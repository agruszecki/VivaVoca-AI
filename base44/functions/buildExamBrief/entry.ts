import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { signPrivateFile, capText } from '../../shared/files.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const materialId = typeof body.material_id === 'string' ? body.material_id.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject : '';
    const topics = Array.isArray(body.topics)
      ? body.topics.filter((t) => typeof t === 'string' && t.trim()).slice(0, 8)
      : [];

    if (!materialId) return Response.json({ error: 'material_id is required' }, { status: 400 });
    if (!topics.length) return Response.json({ error: 'At least one topic is required' }, { status: 400 });

    const material = await base44.entities.StudyMaterial
      .get(materialId)
      .catch((error) => (error.status === 404 ? null : Promise.reject(error)));

    if (!material) return Response.json({ error: 'That material no longer exists.' }, { status: 404 });

    const storedText = capText(typeof material.extracted_text === 'string' ? material.extracted_text : '', 7000);
    const signedUrl = material.file_uri ? await signPrivateFile(base44, material.file_uri) : '';

    if (!signedUrl && !storedText) {
      return Response.json({ error: 'That material has no readable notes yet.' }, { status: 400 });
    }

    const brief = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: [
        'You are preparing the private notes for a live oral examiner who will question a student on ONE supplied document.',
        `The material is: "${material.title}"${material.subject ? ` (${material.subject})` : ''}.`,
        `The examiner will only ask about these topics: ${topics.join('; ')}.`,
        signedUrl
          ? 'Read the attached document and produce a factual brief the examiner can rely on.'
          : 'Read the document below and produce a factual brief the examiner can rely on.',
        'This document is the ONLY source. Ask and judge only what it actually says.',
        'Do not add outside concepts, theories, causes, diagnoses, background or "likely" angles the document does not state, even if the material resembles another field. A film summary stays a film summary; it is not a psychology case unless the document itself discusses psychology.',
        'Keep the examiner inside the document\'s own frame: its own terms, people, events, data and claims.',
        'For EACH topic write 3 to 5 short bullet lines of the exact facts, definitions, mechanisms and examples the student should be able to state from this document.',
        'If the document does not cover a topic, write "not covered in the supplied material" for it.',
        'No preamble, no encouragement, no invented facts. Plain text bullets only, maximum 250 words total.',
        ...(signedUrl ? [] : ['', 'COURSE MATERIAL:', storedText]),
      ].join('\n'),
      file_urls: signedUrl ? [signedUrl] : undefined,
    });

    const text = capText(typeof brief === 'string' ? brief : '', 2600);
    if (!text) return Response.json({ error: 'The exam brief could not be prepared.' }, { status: 500 });

    const scope = [
      `SCOPE: only the student's own document "${material.title}".`,
      `Ask only about: ${topics.join('; ')}.`,
      'Use only the facts in this brief and the document itself. If the document does not support an answer, say so plainly instead of drawing on outside knowledge.',
      `Keep the material's own frame — it is ${material.subject || material.title}, not another field of study.`,
    ].join(' ');

    return Response.json({
      exam_brief: capText(`${scope}\n\n${text}`, 3000),
      subject: subject || material.subject || material.title,
    });
  } catch (error) {
    return Response.json({ error: error.message || 'Brief build failed' }, { status: 500 });
  }
}

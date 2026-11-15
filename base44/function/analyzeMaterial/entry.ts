import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { unzipSync } from 'npm:fflate@0.8.2';
import { signPrivateFile, capText } from '../../shared/files.ts';

function xmlToText(xml) {
  return xml
    .replace(/<\/(w:p|a:p|text:p)>/g, '\n')
    .replace(/<w:br\s*\/>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&#\d+;/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

function rtfToText(rtf) {
  return rtf
    .replace(/\\'([0-9a-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\u(-?\d+)\??/g, (_, code) => String.fromCharCode((parseInt(code, 10) + 65536) % 65536))
    .replace(/\\par[d]?/g, '\n')
    .replace(/\{\\\*[^}]*\}/g, ' ')
    .replace(/\\[a-z]+-?\d*\s?/gi, ' ')
    .replace(/[{}]/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

async function fetchBytes(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(25000) });
  if (!res.ok) return null;
  return new Uint8Array(await res.arrayBuffer());
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const fileUri = typeof body.file_uri === 'string' ? body.file_uri.trim() : '';
    const pastedText = typeof body.text === 'string' ? body.text.trim() : '';
    const fileName = typeof body.file_name === 'string' ? body.file_name : 'notes.pdf';
    if (!fileUri && !pastedText) return Response.json({ error: 'A file or pasted text is required' }, { status: 400 });
    if (pastedText && pastedText.length < 60) {
      return Response.json(
        { error: 'Paste at least a paragraph of notes so the examiner has something to test.' },
        { status: 400 },
      );
    }

    const ext = (fileName.split('.').pop() || '').toLowerCase();
    const signedUrl = pastedText ? '' : await signPrivateFile(base44, fileUri);
    if (!pastedText && !signedUrl) {
      return Response.json({ error: 'That file could not be opened. Please upload it again.' }, { status: 400 });
    }

    let text = '';
    let pdfTopics = [];

    if (pastedText) {
      text = pastedText;
    } else if (ext === 'txt' || ext === 'md' || ext === 'text') {
      const res = await fetch(signedUrl, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) return Response.json({ error: 'That file could not be downloaded. Please upload it again.' }, { status: 400 });
      text = await res.text();
    } else if (ext === 'rtf') {
      const res = await fetch(signedUrl, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) return Response.json({ error: 'That file could not be downloaded. Please upload it again.' }, { status: 400 });
      text = rtfToText(await res.text());
    } else if (ext === 'docx' || ext === 'pptx') {
      const bytes = await fetchBytes(signedUrl);
      if (!bytes) return Response.json({ error: 'That file could not be downloaded. Please upload it again.' }, { status: 400 });
      const files = unzipSync(bytes);
      const decoder = new TextDecoder();
      if (ext === 'docx') {
        const entry = files['word/document.xml'];
        text = entry ? xmlToText(decoder.decode(entry)) : '';
      } else {
        const slideKeys = Object.keys(files)
          .filter((key) => /^ppt\/slides\/slide\d+\.xml$/.test(key))
          .sort((a, b) => {
            const na = parseInt(a.replace(/\D/g, ''), 10);
            const nb = parseInt(b.replace(/\D/g, ''), 10);
            return na - nb;
          });
        text = slideKeys.map((key) => xmlToText(decoder.decode(files[key]))).filter(Boolean).join('\n\n');
      }
    } else if (ext === 'pdf') {
      const extracted = await base44.asServiceRole.integrations.Core.ExtractDataFromUploadedFile({
        file_url: signedUrl,
        json_schema: {
          type: 'object',
          properties: {
            text: { type: 'string', description: 'All readable body text of the document, in reading order' },
            topics: {
              type: 'array',
              items: { type: 'string' },
              description: 'The major course topics this document covers',
            },
          },
          required: ['text'],
        },
      });
      if (extracted.status !== 'success' || !extracted.output) {
        return Response.json(
          { error: 'That PDF could not be read. If it is a scan, export it with selectable text and try again.' },
          { status: 400 },
        );
      }
      text = extracted.output.text || '';
      pdfTopics = Array.isArray(extracted.output.topics) ? extracted.output.topics : [];
    } else {
      return Response.json(
        { error: 'Supported formats are PDF, DOCX, PPTX, TXT and RTF.' },
        { status: 400 },
      );
    }

    const cleaned = capText(text, 18000);
    if (cleaned.length < 60) {
      return Response.json(
        { error: 'That file had almost no readable text. If it is a scanned PDF, export it with selectable text and try again.' },
        { status: 400 },
      );
    }

    const analysis = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: [
        'You extract exam topics for an oral exam. The document below is the ONLY source of truth.',
        'Treat it as exactly what it is: lecture notes, a plot summary, a lab report, a case study, a set of meeting notes, anything. Never reinterpret it as a different field of study.',
        'For example: a summary of a film is about that film — its plot, characters, structure and themes as the text states them. It is NOT about psychology, sociology or any other discipline unless the text itself discusses one.',
        'Rules:',
        '1. Every topic must be traceable to a specific statement in the text, and named in the text\'s own vocabulary — its own terms, people, events, data, works or concepts.',
        '2. Never add a concept, theory, cause, diagnosis or framework the text does not state, even when it seems related to something the text mentions.',
        '3. Each topic summary must restate what the text says. Do not add interpretation, and do not ask what the student "should" know beyond this text.',
        '4. Return between 1 and 7 topics — only as many as the text actually supports. Fewer grounded topics are better than one invented topic.',
        '5. Give the material a short title (max 8 words) describing what it literally is, and a subject (max 4 words) describing its field as the text presents it, e.g. "Film analysis", "Movie plot summary", "Cell biology — respiration". Only name an academic discipline when the text itself works in that discipline.',
        '6. If the text is short, ambiguous, or supports fewer than 3 solid topics, write one short sentence in "note" telling the student what is thin and what a fuller source would include. Otherwise "note" is an empty string.',
        pdfTopics.length
          ? `These candidate topics were pulled from the same document: ${pdfTopics.join(', ')}. Use one only if the text itself supports it.`
          : '',
        'Return JSON only.',
        '',
        'DOCUMENT:',
        cleaned,
      ]
        .filter(Boolean)
        .join('\n'),
      response_json_schema: {
        type: 'object',
        properties: {
          topics: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                summary: { type: 'string' },
                importance: { type: 'string', enum: ['high', 'medium', 'low'] },
              },
              required: ['name', 'summary', 'importance'],
            },
          },
          title: { type: 'string', description: 'Short descriptive title for what this material literally is' },
          subject: { type: 'string', description: 'The field of this material as the text presents it' },
          note: {
            type: 'string',
            description: 'One short sentence on what the source does not cover, or an empty string',
          },
        },
        required: ['topics', 'title', 'subject', 'note'],
      },
    });

    const rawTopics = Array.isArray(analysis?.topics) ? analysis.topics : [];
    const topics = rawTopics
      .filter((topic) => topic && typeof topic.name === 'string' && topic.name.trim())
      .slice(0, 7)
      .map((topic) => ({
        name: topic.name.trim().slice(0, 90),
        summary: typeof topic.summary === 'string' ? topic.summary.trim().slice(0, 320) : '',
        importance: ['high', 'medium', 'low'].includes(topic.importance) ? topic.importance : 'medium',
      }));

    if (!topics.length) {
      return Response.json(
        { error: 'No exam topics could be identified in that file. Try a more complete set of notes.' },
        { status: 400 },
      );
    }

    const title = typeof analysis?.title === 'string' ? analysis.title.trim().slice(0, 120) : '';
    const subject = typeof analysis?.subject === 'string' ? analysis.subject.trim().slice(0, 80) : '';

    const note = typeof analysis?.note === 'string' ? analysis.note.trim().slice(0, 260) : '';

    return Response.json({ topics, text: capText(cleaned, 12000), title, subject, note });
  } catch (error) {
    return Response.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}

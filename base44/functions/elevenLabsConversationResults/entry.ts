import { secrets } from 'base44:runtime';

const FIELDS = ['overall_score', 'strongest_topic', 'weakest_topic', 'key_gap', 'recommended_review'];
const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 3000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function readField(results, key) {
  const entry = results?.[key];
  if (entry === null || entry === undefined) return '';
  const value = typeof entry === 'object' ? entry.value : entry;
  if (value === null || value === undefined) return '';
  return typeof value === 'string' ? value.trim() : String(value);
}

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const conversationId = typeof body.conversation_id === 'string' ? body.conversation_id.trim() : '';
    if (!conversationId) return Response.json({ error: 'conversation_id is required' }, { status: 400 });

    let apiKey = '';
    try {
      apiKey = secrets.get('ELEVENLABS_API_KEY');
    } catch (error) {
      apiKey = '';
    }
    if (!apiKey) {
      return Response.json(
        { error: 'The ElevenLabs API key is not configured for this app yet.' },
        { status: 500 },
      );
    }

    const endpoint = `https://api.elevenlabs.io/v1/convai/conversations/${encodeURIComponent(conversationId)}`;
    let lastStatus = 0;
    let lastDetail = '';

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      if (attempt > 0) await sleep(RETRY_DELAY_MS);

      const res = await fetch(endpoint, {
        method: 'GET',
        headers: { 'xi-api-key': apiKey },
        signal: AbortSignal.timeout(15000),
      });

      const raw = await res.text().catch(() => '');

      if (!res.ok) {
        lastStatus = res.status;
        lastDetail = raw.slice(0, 400);
        // Auth and missing-conversation errors will never resolve by retrying.
        if (res.status === 401 || res.status === 403 || res.status === 404) break;
        continue;
      }

      let data = {};
      try {
        data = JSON.parse(raw);
      } catch (error) {
        data = {};
      }

      const results = data?.analysis?.data_collection_results;
      if (!results || typeof results !== 'object' || !Object.keys(results).length) {
        lastStatus = res.status;
        lastDetail = 'Analysis is not ready yet.';
        continue;
      }

      const numericScore = Number(readField(results, 'overall_score'));
      const payload = {};
      for (const field of FIELDS) {
        if (field === 'overall_score') {
          payload.overall_score = Number.isFinite(numericScore)
            ? Math.max(0, Math.min(100, Math.round(numericScore)))
            : null;
        } else {
          payload[field] = readField(results, field).slice(0, 600);
        }
      }

      return Response.json(payload);
    }

    return Response.json(
      {
        error: `Conversation results were not available (status ${lastStatus || 'unknown'}): ${
          lastDetail || 'no response body'
        }`,
      },
      { status: 502 },
    );
  } catch (error) {
    return Response.json({ error: error.message || 'Could not read the conversation results' }, { status: 500 });
  }
}

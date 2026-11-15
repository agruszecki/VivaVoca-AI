import { secrets } from 'base44:runtime';

export default async function (req) {
  try {
    const body = await req.json().catch(() => ({}));
    const agentId = typeof body.agent_id === 'string' ? body.agent_id.trim() : '';
    if (!agentId) return Response.json({ error: 'agent_id is required' }, { status: 400 });

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

    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      {
        method: 'GET',
        headers: { 'xi-api-key': apiKey },
        signal: AbortSignal.timeout(15000),
      },
    );

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return Response.json(
        { error: `The voice examiner could not be reached (${res.status}). ${detail.slice(0, 200)}` },
        { status: 502 },
      );
    }

    const data = await res.json().catch(() => ({}));
    const signedUrl = data?.signed_url || data?.signedUrl || '';
    if (!signedUrl) return Response.json({ error: 'No signed conversation URL was returned.' }, { status: 502 });

    let token = '';
    try {
      const params = new URL(signedUrl).searchParams;
      token = params.get('conversation_signature') || params.get('conversation_token') || '';
    } catch (error) {
      token = '';
    }

    // signed_url is the full wss:// endpoint the hook connects to; token is kept for older clients.
    return Response.json({ signed_url: signedUrl, token });
  } catch (error) {
    return Response.json({ error: error.message || 'Token request failed' }, { status: 500 });
  }
}

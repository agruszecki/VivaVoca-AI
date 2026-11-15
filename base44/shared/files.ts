export async function signPrivateFile(base44, fileUri) {
  if (!fileUri) return null;
  try {
    const result = await base44.asServiceRole.integrations.Core.CreateFileSignedUrl({
      file_uri: fileUri,
      expires_in: 900,
    });
    return result?.signed_url || null;
  } catch (error) {
    return null;
  }
}

export function capText(text, limit) {
  if (!text) return "";
  const clean = String(text).replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
  return clean.length > limit ? `${clean.slice(0, limit)}…` : clean;
}

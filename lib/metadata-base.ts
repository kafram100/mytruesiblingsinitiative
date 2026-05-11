/**
 * Builds metadataBase safely. Raw `new URL(process.env.NEXT_PUBLIC_SITE_URL)`
 * throws if the env var is missing a scheme / is malformed — which crashes the whole app at boot.
 */
export function getSiteMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) {
    return new URL("http://localhost:3000");
  }
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      return new URL(raw);
    }
    if (/^localhost(:\d+)?$/i.test(raw) || /^127\.0\.0\.1(:\d+)?$/.test(raw)) {
      return new URL(`http://${raw}`);
    }
    return new URL(`https://${raw}`);
  } catch {
    return new URL("http://localhost:3000");
  }
}

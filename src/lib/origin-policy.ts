/** Match the actual destination, including its port, before trusting an origin. */
export function isAllowedOrigin(origin: string | null, host: string | null, allowedOrigins: string[], development: boolean): boolean {
  if (!origin || !host) return false;
  try {
    const url = new URL(origin);
    if (url.origin !== origin || url.host !== host || !["http:", "https:"].includes(url.protocol)) return false;
    if (allowedOrigins.includes(origin)) return true;
    return development && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  } catch {
    return false;
  }
}

// SSRF guard for server-side link-preview fetching.
//
// ClearKorea fetches remote metadata only from public hosts. This rejects
// loopback, link-local, private, and reserved targets so a crafted Speak up
// URL cannot reach internal services or cloud metadata endpoints.

const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "::", "[::]"]);

const ALLOWED_PORTS = new Set(["", "80", "443"]);

function isPrivateIpv4(hostname: string): boolean {
  const parts = hostname.split(".");
  if (parts.length !== 4) {
    return false;
  }
  const octets = parts.map((part) => Number(part));
  if (octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return false;
  }
  const [a, b] = octets;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true; // link-local / cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a >= 224) return true; // multicast / reserved
  return false;
}

function isPrivateIpv6(hostname: string): boolean {
  // URL hostname keeps IPv6 literals wrapped in brackets.
  const inner = hostname.replace(/^\[/, "").replace(/\]$/, "").toLowerCase();
  if (inner === "::1" || inner === "::") return true;
  if (inner.startsWith("fe80")) return true; // link-local
  if (inner.startsWith("fc") || inner.startsWith("fd")) return true; // unique-local
  if (inner.startsWith("::ffff:")) {
    // IPv4-mapped IPv6 address.
    return isPrivateIpv4(inner.slice("::ffff:".length));
  }
  return false;
}

export function isSafePublicHttpUrl(input: string): boolean {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return false;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return false;
  }

  if (!ALLOWED_PORTS.has(url.port)) {
    return false;
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname.length === 0) {
    return false;
  }
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return false;
  }
  if (hostname === "localhost" || hostname.endsWith(".localhost")) {
    return false;
  }
  if (hostname.endsWith(".local")) {
    return false;
  }
  if (hostname.startsWith("[")) {
    return !isPrivateIpv6(hostname);
  }
  if (isPrivateIpv4(hostname)) {
    return false;
  }
  return true;
}

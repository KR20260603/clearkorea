function firstValue(value: string | null | undefined): string | undefined {
  return value?.split(",")[0].trim() || undefined;
}

function isLocalHost(host: string): boolean {
  const name = host.split(":")[0].toLowerCase();
  return (
    name === "localhost" ||
    name === "127.0.0.1" ||
    name.endsWith(".local") ||
    name.endsWith(".localhost")
  );
}

// The OAuth redirect target and post-login redirect must be built from the
// public request host (Host / x-forwarded-host), not from new URL(request.url),
// which the Next dev server reports as its bind address and which can be the
// internal address behind a proxy. This keeps redirect_to on the same origin the
// user is browsing (e.g. app.clearkorea.com), so the session cookie lands there.
export function resolveRequestOrigin(headers: {
  readonly host?: string | null;
  readonly forwardedHost?: string | null;
  readonly forwardedProto?: string | null;
}): string | null {
  const host = firstValue(headers.forwardedHost) ?? firstValue(headers.host);
  if (!host) {
    return null;
  }
  const proto =
    firstValue(headers.forwardedProto) ?? (isLocalHost(host) ? "http" : "https");
  return `${proto}://${host}`;
}

export function originFromRequest(request: Request): string {
  return (
    resolveRequestOrigin({
      host: request.headers.get("host"),
      forwardedHost: request.headers.get("x-forwarded-host"),
      forwardedProto: request.headers.get("x-forwarded-proto"),
    }) ?? new URL(request.url).origin
  );
}

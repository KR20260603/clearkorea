export type HostRoute = { readonly kind: "rewrite"; readonly to: string } | { readonly kind: "next" };

const excludedPrefixes = ["/api", "/auth", "/_next", "/app", "/admin"] as const;

export function isAppHost(host: string | null | undefined): boolean {
  if (!host) {
    return false;
  }
  return host.split(":")[0].toLowerCase().startsWith("app.");
}

function isExcludedPath(pathname: string): boolean {
  if (
    excludedPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return true;
  }
  return (pathname.split("/").pop() ?? "").includes(".");
}

export function resolveHostRoute(input: {
  readonly host: string | null | undefined;
  readonly pathname: string;
}): HostRoute {
  if (!isAppHost(input.host) || isExcludedPath(input.pathname)) {
    return { kind: "next" };
  }
  if (input.pathname === "/") {
    return { kind: "rewrite", to: "/app" };
  }
  return { kind: "rewrite", to: `/app${input.pathname}` };
}

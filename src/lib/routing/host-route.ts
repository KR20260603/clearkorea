export type HostRoute =
  | { readonly kind: "rewrite"; readonly to: string }
  | { readonly kind: "redirect-to-app"; readonly path: string }
  | { readonly kind: "next" };

const excludedPrefixes = ["/api", "/auth", "/_next", "/app", "/admin"] as const;

export function collapseSlashes(pathname: string): string {
  return pathname.replace(/\/{2,}/g, "/");
}

export function isAppHost(host: string | null | undefined): boolean {
  if (!host) {
    return false;
  }
  return host.split(":")[0].toLowerCase().startsWith("app.");
}

export function appHostForRedirect(
  host: string | null | undefined,
): string | null {
  if (!host) {
    return null;
  }
  const [name, port] = host.split(":");
  const base = name.toLowerCase().replace(/^www\./, "");
  const appName = base.startsWith("app.") ? base : `app.${base}`;
  return port ? `${appName}:${port}` : appName;
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
  if (isAppHost(input.host)) {
    if (isExcludedPath(input.pathname)) {
      return { kind: "next" };
    }
    if (input.pathname === "/") {
      return { kind: "rewrite", to: "/app" };
    }
    return { kind: "rewrite", to: `/app${input.pathname}` };
  }

  // Apex / www: the app and its auth flow live on the app subdomain, so force
  // those surfaces there (auth must run on app.* so the session cookie is set
  // on the origin the app reads). Everything else stays on the landing domain.
  if (input.pathname === "/auth" || input.pathname.startsWith("/auth/")) {
    return { kind: "redirect-to-app", path: input.pathname };
  }
  if (input.pathname === "/app") {
    return { kind: "redirect-to-app", path: "/" };
  }
  if (input.pathname.startsWith("/app/")) {
    return { kind: "redirect-to-app", path: input.pathname.slice(4) || "/" };
  }

  return { kind: "next" };
}

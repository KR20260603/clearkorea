// Cross-subdomain session sharing. The app runs on app.clearkorea.com and the
// admin console on admin.clearkorea.com, but both are the same Next.js app and
// must share the Supabase auth-token cookies. To do that the auth cookies are
// written with a parent-domain scope (".clearkorea.com") so every *.clearkorea.com
// host sends them. Localhost has no registrable parent domain, so it stays
// host-only (undefined) and existing single-host dev login is unaffected.

const sharedParentDomains = ["clearkorea.com", "clearkorea.local"] as const;

function hostnameOf(host: string | null | undefined): string | null {
  if (!host) {
    return null;
  }
  const name = host.split(":")[0].trim().toLowerCase();
  return name === "" ? null : name;
}

/**
 * Resolve the cookie `domain` attribute that scopes the Supabase auth cookies so
 * the app and admin subdomains share one session. Returns `undefined` for hosts
 * without a known shared parent (localhost, raw IPs, unrelated domains) so those
 * cookies stay host-only.
 */
export function resolveCookieDomain(
  host: string | null | undefined,
): string | undefined {
  const name = hostnameOf(host);
  if (!name) {
    return undefined;
  }

  for (const parent of sharedParentDomains) {
    if (name === parent || name.endsWith(`.${parent}`)) {
      return `.${parent}`;
    }
  }

  return undefined;
}

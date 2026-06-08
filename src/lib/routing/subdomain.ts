// Subdomain topology for the single Next.js app:
//   clearkorea.com        -> marketing landing
//   app.clearkorea.com    -> the member app + auth flow (login lives here)
//   admin.clearkorea.com  -> the role-gated admin console
// Locally the same shape is mirrored on *.clearkorea.local:<port>.

type SubdomainEnv = Readonly<Record<string, string | undefined>>;

const knownSubPrefixes = ["app.", "admin.", "www."] as const;

function splitHost(host: string): { name: string; port?: string } {
  const [rawName, port] = host.split(":");
  return { name: rawName.toLowerCase(), port: port || undefined };
}

function isLocalName(name: string): boolean {
  return (
    name === "localhost" ||
    name === "127.0.0.1" ||
    name.endsWith(".local") ||
    name.endsWith(".localhost")
  );
}

function baseName(name: string): string {
  for (const prefix of knownSubPrefixes) {
    if (name.startsWith(prefix)) {
      return name.slice(prefix.length);
    }
  }
  return name;
}

export function isAdminHost(host: string | null | undefined): boolean {
  if (!host) {
    return false;
  }
  return host.split(":")[0].toLowerCase().startsWith("admin.");
}

function deriveOrigin(
  host: string | null | undefined,
  subdomain: "app" | "admin",
  override: string | undefined,
): string | null {
  const trimmedOverride = override?.trim();
  if (trimmedOverride) {
    return trimmedOverride.replace(/\/+$/, "");
  }
  if (!host) {
    return null;
  }
  const { name, port } = splitHost(host);
  const base = baseName(name);
  const proto = isLocalName(name) ? "http" : "https";
  const fullName = `${subdomain}.${base}`;
  return port ? `${proto}://${fullName}:${port}` : `${proto}://${fullName}`;
}

/**
 * The app-subdomain origin (where login lives). Prefers NEXT_PUBLIC_APP_ORIGIN,
 * otherwise derives `app.<base>` from the current request host.
 */
export function appOriginForHost(
  host: string | null | undefined,
  env: SubdomainEnv = process.env,
): string | null {
  return deriveOrigin(host, "app", env.NEXT_PUBLIC_APP_ORIGIN);
}

/**
 * The admin-subdomain origin. Prefers NEXT_PUBLIC_ADMIN_ORIGIN, otherwise
 * derives `admin.<base>` from the current request host.
 */
export function adminOriginForHost(
  host: string | null | undefined,
  env: SubdomainEnv = process.env,
): string | null {
  return deriveOrigin(host, "admin", env.NEXT_PUBLIC_ADMIN_ORIGIN);
}

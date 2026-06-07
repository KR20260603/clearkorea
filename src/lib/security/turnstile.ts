export const TURNSTILE_SECRET_ENV = "TURNSTILE_SECRET_KEY";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { readonly kind: "skipped" }
  | { readonly kind: "ok" }
  | { readonly kind: "failed" };

type FetchImpl = (input: string, init?: RequestInit) => Promise<Response>;

export async function verifyTurnstile(input: {
  readonly token: string | null;
  readonly secret: string | undefined;
  readonly remoteIp?: string;
  readonly fetchImpl?: FetchImpl;
}): Promise<TurnstileResult> {
  const { token, secret, remoteIp, fetchImpl = fetch } = input;

  if (!secret) {
    return { kind: "skipped" };
  }
  if (!token) {
    return { kind: "failed" };
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) {
      body.set("remoteip", remoteIp);
    }
    const response = await fetchImpl(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    const data = (await response.json()) as { success?: boolean };
    return data.success ? { kind: "ok" } : { kind: "failed" };
  } catch {
    return { kind: "failed" };
  }
}

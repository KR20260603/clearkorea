import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { authorizeVoiceWrite } from "@/lib/voices/voice-authorization";
import { createRateLimitStore } from "@/lib/security/rate-limit";
import { guardWrite } from "@/lib/security/write-guard";
import { TURNSTILE_SECRET_ENV } from "@/lib/security/turnstile";
import type { AppSessionIdentity } from "@/lib/auth/app-entry";

type AuthClient = {
  auth: { getUser(): PromiseLike<{ data: { user: { id: string } | null } }> };
};

const voiceWriteStore = createRateLimitStore();

async function readSession(
  client: AuthClient | null,
): Promise<AppSessionIdentity | null> {
  if (!client) {
    return null;
  }
  const { data } = await client.auth.getUser();
  return data.user ? { authUserId: data.user.id } : null;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const { client } = createServerSupabaseClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });

  const session = await readSession(client);
  const authorization = authorizeVoiceWrite({ session });
  if (!authorization.allowed) {
    return NextResponse.json({ error: authorization.reason }, { status: 401 });
  }

  const guard = await guardWrite({
    store: voiceWriteStore,
    key: `voice:${session?.authUserId ?? "dev-guest"}`,
    turnstileToken: request.headers.get("cf-turnstile-response"),
    turnstileSecret: process.env[TURNSTILE_SECRET_ENV],
  });
  if (guard.kind === "rate-limited") {
    return NextResponse.json(
      { error: "You are posting too fast. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(guard.retryAfterMs / 1000)) } },
    );
  }
  if (guard.kind === "challenge-failed") {
    return NextResponse.json(
      { error: "Please complete the verification challenge." },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as { content?: unknown } | null;
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (content.length < 1 || content.length > 2000) {
    return NextResponse.json(
      { error: "A voice must be between 1 and 2000 characters." },
      { status: 400 },
    );
  }

  if (!client) {
    return NextResponse.json(
      { error: "The voice service is not configured yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ status: "accepted" }, { status: 202 });
}

export async function GET() {
  return NextResponse.json(
    { voices: [] },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=20" } },
  );
}

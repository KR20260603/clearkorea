import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { readServerSession } from "@/lib/auth/server-session";
import { authorizeVoiceWrite } from "@/lib/voices/voice-authorization";
import { validateComment } from "@/lib/voices/comment";
import { createRateLimitStore } from "@/lib/security/rate-limit";
import { guardWrite } from "@/lib/security/write-guard";
import { TURNSTILE_SECRET_ENV } from "@/lib/security/turnstile";

const commentStore = createRateLimitStore();

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const { client } = createServerSupabaseClient({
    getAll: () => cookieStore.getAll(),
    setAll: () => {},
  });

  const session = await readServerSession(client);
  const authorization = authorizeVoiceWrite({ session });
  if (!authorization.allowed) {
    return NextResponse.json({ error: authorization.reason }, { status: 401 });
  }

  const guard = await guardWrite({
    store: commentStore,
    key: `comment:${session?.authUserId ?? "dev-guest"}`,
    turnstileToken: request.headers.get("cf-turnstile-response"),
    turnstileSecret: process.env[TURNSTILE_SECRET_ENV],
  });
  if (guard.kind === "rate-limited") {
    return NextResponse.json(
      { error: "You are commenting too fast. Try again shortly." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(guard.retryAfterMs / 1000)) } },
    );
  }
  if (guard.kind === "challenge-failed") {
    return NextResponse.json(
      { error: "Please complete the verification challenge." },
      { status: 403 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { voiceId?: unknown; content?: unknown }
    | null;
  const voiceId = typeof body?.voiceId === "number" ? body.voiceId : null;
  if (voiceId === null) {
    return NextResponse.json({ error: "Missing voice id." }, { status: 400 });
  }
  const validation = validateComment(
    typeof body?.content === "string" ? body.content : "",
  );
  if (validation.kind === "invalid") {
    return NextResponse.json({ error: validation.message }, { status: 400 });
  }

  if (!client) {
    return NextResponse.json(
      { error: "Comments are not configured yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ status: "accepted", voiceId }, { status: 202 });
}

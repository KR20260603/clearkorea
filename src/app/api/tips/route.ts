import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { readServerSession } from "@/lib/auth/server-session";
import { authorizeVoiceWrite } from "@/lib/voices/voice-authorization";
import { validateTipSubmission } from "@/lib/tips/tip-submission";
import { createRateLimitStore } from "@/lib/security/rate-limit";
import { guardWrite } from "@/lib/security/write-guard";
import { TURNSTILE_SECRET_ENV } from "@/lib/security/turnstile";

const tipWriteStore = createRateLimitStore();

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
    store: tipWriteStore,
    key: `tip:${session?.authUserId ?? "dev-guest"}`,
    turnstileToken: request.headers.get("cf-turnstile-response"),
    turnstileSecret: process.env[TURNSTILE_SECRET_ENV],
  });
  if (guard.kind === "rate-limited") {
    return NextResponse.json(
      { error: "You are reporting too fast. Try again shortly." },
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
    | { figureName?: unknown; url?: unknown }
    | null;
  const result = validateTipSubmission({
    figureName: typeof body?.figureName === "string" ? body.figureName : "",
    url: typeof body?.url === "string" ? body.url : "",
  });
  if (result.kind === "invalid") {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  if (!client) {
    return NextResponse.json(
      { error: "The report queue is not configured yet." },
      { status: 503 },
    );
  }

  return NextResponse.json({ status: "pending" }, { status: 202 });
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { authorizeVoiceWrite } from "@/lib/voices/voice-authorization";
import { validateTipSubmission } from "@/lib/tips/tip-submission";
import type { AppSessionIdentity } from "@/lib/auth/app-entry";

type AuthClient = {
  auth: { getUser(): PromiseLike<{ data: { user: { id: string } | null } }> };
};

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

  const authorization = authorizeVoiceWrite({ session: await readSession(client) });
  if (!authorization.allowed) {
    return NextResponse.json({ error: authorization.reason }, { status: 401 });
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

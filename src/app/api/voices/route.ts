import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";
import { authorizeVoiceWrite } from "@/lib/voices/voice-authorization";
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

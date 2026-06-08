import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { originFromRequest } from "@/lib/routing/request-origin";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export async function GET(request: Request) {
  const origin = originFromRequest(request);
  const cookieStore = await cookies();
  const { client } = createServerSupabaseClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      for (const { name, value, options } of cookiesToSet) {
        cookieStore.set(name, value, options);
      }
    },
  });

  if (!client) {
    return NextResponse.redirect(new URL("/?auth=unavailable", origin));
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "custom:naver",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(new URL("/?auth=error", origin));
  }

  return NextResponse.redirect(data.url);
}

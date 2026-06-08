import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { originFromRequest } from "@/lib/routing/request-origin";
import { resolveCookieDomain } from "@/lib/supabase/cookie-domain";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export async function GET(request: Request) {
  const origin = originFromRequest(request);
  const cookieDomain = resolveCookieDomain(request.headers.get("host"));
  const cookieStore = await cookies();
  const { client } = createServerSupabaseClient(
    {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        for (const { name, value, options } of cookiesToSet) {
          cookieStore.set(name, value, options);
        }
      },
    },
    process.env,
    cookieDomain,
  );

  if (!client) {
    return NextResponse.redirect(new URL("/?auth=unavailable", origin));
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: "kakao",
    options: { redirectTo: `${origin}/auth/callback` },
  });

  if (error || !data?.url) {
    return NextResponse.redirect(new URL("/?auth=error", origin));
  }

  return NextResponse.redirect(data.url);
}

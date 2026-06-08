import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { originFromRequest } from "@/lib/routing/request-origin";
import { resolveCookieDomain } from "@/lib/supabase/cookie-domain";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export async function POST(request: Request) {
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

  if (client) {
    await client.auth.signOut();
  }

  return NextResponse.redirect(new URL("/auth/start", origin), { status: 303 });
}

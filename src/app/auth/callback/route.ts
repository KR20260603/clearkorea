import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { resolveCallbackRedirect } from "@/lib/auth/auth-flow";
import { createServerSupabaseClient } from "@/lib/supabase/server-client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const cookieStore = await cookies();

  const { client } = createServerSupabaseClient({
    getAll: () => cookieStore.getAll(),
    setAll: (cookiesToSet) => {
      for (const { name, value, options } of cookiesToSet) {
        cookieStore.set(name, value, options);
      }
    },
  });

  const redirectPath = await resolveCallbackRedirect({
    code: url.searchParams.get("code"),
    exchanger: client,
  });

  return NextResponse.redirect(new URL(redirectPath, origin));
}

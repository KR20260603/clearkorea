import { NextResponse, type NextRequest } from "next/server";
import { authEntryPath, shouldGateAppRequest } from "@/lib/auth/app-entry";
import { getSupabasePublicConfig } from "@/lib/supabase/project";

function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((cookie) => /^sb-.*-auth-token/.test(cookie.name));
}

export function middleware(request: NextRequest) {
  const gate = shouldGateAppRequest({
    supabaseConfigured: getSupabasePublicConfig().kind === "configured",
    hasSession: hasSupabaseSessionCookie(request),
  });

  if (gate) {
    return NextResponse.redirect(new URL(authEntryPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*"],
};

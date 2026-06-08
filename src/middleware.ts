import { NextResponse, type NextRequest } from "next/server";
import { authEntryPath, shouldGateAppRequest } from "@/lib/auth/app-entry";
import { appHostForRedirect, resolveHostRoute } from "@/lib/routing/host-route";
import { getSupabasePublicConfig } from "@/lib/supabase/project";

function hasSupabaseSessionCookie(request: NextRequest): boolean {
  return request.cookies
    .getAll()
    .some((cookie) => /^sb-.*-auth-token/.test(cookie.name));
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const { pathname } = request.nextUrl;
  const route = resolveHostRoute({ host, pathname });

  if (route.kind === "redirect-to-app") {
    const appHost = appHostForRedirect(host);
    const url = request.nextUrl.clone();
    if (appHost) {
      url.host = appHost;
    }
    url.pathname = route.path;
    return NextResponse.redirect(url, 308);
  }

  const internalPath = route.kind === "rewrite" ? route.to : pathname;
  const isAppPage = internalPath === "/app" || internalPath.startsWith("/app/");

  if (isAppPage) {
    const gated = shouldGateAppRequest({
      supabaseConfigured: getSupabasePublicConfig().kind === "configured",
      hasSession: hasSupabaseSessionCookie(request),
    });
    if (gated) {
      return NextResponse.redirect(new URL(authEntryPath, request.url));
    }
  }

  if (route.kind === "rewrite") {
    const url = request.nextUrl.clone();
    url.pathname = route.to;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};

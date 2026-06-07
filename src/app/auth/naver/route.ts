import { NextResponse } from "next/server";
import { buildProviderStartLocation } from "@/lib/auth/auth-flow";

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const state = crypto.randomUUID();
  const location = buildProviderStartLocation({
    provider: "naver",
    origin,
    state,
  });

  if (location.kind === "unconfigured") {
    return NextResponse.redirect(new URL("/?auth=unavailable", origin));
  }

  const response = NextResponse.redirect(location.url);
  response.cookies.set("naver_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 600,
  });
  return response;
}

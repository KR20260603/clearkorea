import { NextResponse } from "next/server";
import { buildProviderStartLocation } from "@/lib/auth/auth-flow";
import { originFromRequest } from "@/lib/routing/request-origin";

export function GET(request: Request) {
  const origin = originFromRequest(request);
  const location = buildProviderStartLocation({
    provider: "kakao",
    origin,
  });

  if (location.kind === "unconfigured") {
    return NextResponse.redirect(new URL("/?auth=unavailable", origin));
  }

  return NextResponse.redirect(location.url);
}

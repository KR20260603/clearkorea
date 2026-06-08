import { NextResponse } from "next/server";
import { buildProviderStartLocation } from "@/lib/auth/auth-flow";

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const location = buildProviderStartLocation({
    provider: "kakao",
    origin,
  });

  if (location.kind === "unconfigured") {
    return NextResponse.redirect(new URL("/?auth=unavailable", origin));
  }

  return NextResponse.redirect(location.url);
}

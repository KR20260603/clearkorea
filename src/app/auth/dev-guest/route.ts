import { NextResponse } from "next/server";
import { isGuestParticipationAllowed } from "@/lib/auth/guest-policy";

export function GET(request: Request) {
  const origin = new URL(request.url).origin;

  if (!isGuestParticipationAllowed()) {
    return NextResponse.redirect(new URL("/?auth=unavailable", origin));
  }

  return NextResponse.redirect(new URL("/app?devGuest=1", origin));
}

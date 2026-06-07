import { NextResponse } from "next/server";
import {
  resolveSeoulCongestion,
  seoulCongestionCacheControl,
} from "@/lib/rallies/seoul-congestion";

// Server-only proxy for Seoul real-time city data. The API key stays in env and
// is never returned to the client. Returns regional congestion, not headcount.
export async function GET(request: Request) {
  const place = new URL(request.url).searchParams.get("place");
  const result = await resolveSeoulCongestion({ placeCode: place, env: process.env });

  if (result.kind === "unknown-place") {
    return NextResponse.json(result, {
      status: 404,
      headers: { "Cache-Control": seoulCongestionCacheControl },
    });
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": seoulCongestionCacheControl },
  });
}

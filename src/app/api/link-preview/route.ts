import { NextResponse } from "next/server";
import { resolveLinkPreview } from "@/lib/link-preview/resolve";

// Server-side first-URL metadata preview for Square voices.
// Only public metadata is fetched; no user files are uploaded, stored, or proxied.
export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { kind: "unsupported", reason: "missing-url" },
      { status: 400 },
    );
  }

  const result = await resolveLinkPreview({ url });

  return NextResponse.json(result, {
    status: 200,
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}

import { NextResponse } from "next/server";
import { resolveNaverUserinfo } from "@/lib/auth/providers/naver-userinfo";

// Supabase calls this server-to-server during the custom:naver OAuth flow with the
// Naver access token in the Authorization header. It returns the Naver profile
// flattened to top-level keys (id, email, ...) so Supabase's attribute mapping works.
export async function GET(request: Request) {
  const result = await resolveNaverUserinfo({
    authorization: request.headers.get("authorization"),
  });

  if (result.kind === "unauthorized") {
    return NextResponse.json({ error: "missing_authorization" }, { status: 401 });
  }

  if (result.kind === "failed") {
    return NextResponse.json({ error: "naver_userinfo_failed" }, { status: 502 });
  }

  return NextResponse.json(result.profile);
}

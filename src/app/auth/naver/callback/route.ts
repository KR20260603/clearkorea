import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { resolveNaverCallback, type NaverBridge } from "@/lib/auth/auth-flow";
import {
  exchangeNaverCode,
  fetchNaverIdentity,
} from "@/lib/auth/providers/naver";

function createNaverBridge(
  env: Readonly<Record<string, string | undefined>>,
): NaverBridge {
  return {
    async link({ code, state }) {
      const token = await exchangeNaverCode({
        code,
        state,
        clientId: env.SUPABASE_AUTH_NAVER_CLIENT_ID,
        clientSecret: env.SUPABASE_AUTH_NAVER_CLIENT_SECRET,
      });
      if (token.kind === "unavailable") {
        return "unavailable";
      }
      if (token.kind === "failed") {
        return "failed";
      }
      const identity = await fetchNaverIdentity({ accessToken: token.accessToken });
      if (!identity) {
        return "failed";
      }
      // Identity obtained. Minting an app session for a custom (non-Supabase)
      // identity needs the service role and is approval-gated, so it stays
      // deferred. See docs/setup/auth-setup-guide.md.
      return "unavailable";
    },
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const cookieStore = await cookies();

  const redirectPath = await resolveNaverCallback({
    code: url.searchParams.get("code"),
    state: url.searchParams.get("state"),
    expectedState: cookieStore.get("naver_oauth_state")?.value ?? null,
    bridge: createNaverBridge(process.env),
  });

  cookieStore.delete("naver_oauth_state");
  return NextResponse.redirect(new URL(redirectPath, origin));
}

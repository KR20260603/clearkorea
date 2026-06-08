import { describe, expect, it, vi } from "vitest";
import { resolveNaverUserinfo } from "./naver-userinfo";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("resolveNaverUserinfo (Supabase custom-provider flattening proxy)", () => {
  it("is unauthorized and never calls Naver when no Authorization header is present", async () => {
    const fetchImpl = vi.fn();
    const result = await resolveNaverUserinfo({ authorization: null, fetchImpl });
    expect(result.kind).toBe("unauthorized");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("forwards the bearer token to Naver and lifts response.* to top level", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({
        resultcode: "00",
        message: "success",
        response: { id: "naver-123", email: "user@example.com", nickname: "n" },
      }),
    );

    const result = await resolveNaverUserinfo({
      authorization: "Bearer naver-access-token",
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "https://openapi.naver.com/v1/nid/me",
      { headers: { authorization: "Bearer naver-access-token" } },
    );
    // Supabase custom OAuth2 reads the standard top-level "sub" claim, so the
    // proxy must expose Naver's id as "sub" (email passes through as-is).
    expect(result).toEqual({
      kind: "ok",
      profile: {
        id: "naver-123",
        sub: "naver-123",
        email: "user@example.com",
        nickname: "n",
      },
    });
  });

  it("fails when the Naver profile lookup is unsuccessful", async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse({ resultcode: "024", message: "auth fail", response: {} }),
    );
    const result = await resolveNaverUserinfo({
      authorization: "Bearer x",
      fetchImpl,
    });
    expect(result.kind).toBe("failed");
  });

  it("fails when Naver returns a non-ok HTTP status", async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({ error: "nope" }, 401));
    const result = await resolveNaverUserinfo({
      authorization: "Bearer x",
      fetchImpl,
    });
    expect(result.kind).toBe("failed");
  });

  it("fails without leaking the token when the request throws", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network");
    });
    const result = await resolveNaverUserinfo({
      authorization: "Bearer super-secret-token",
      fetchImpl,
    });
    expect(result.kind).toBe("failed");
    expect(JSON.stringify(result)).not.toContain("super-secret-token");
  });
});

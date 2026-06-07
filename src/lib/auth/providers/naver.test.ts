import { describe, expect, it } from "vitest";
import {
  buildNaverAuthorizationUrl,
  identityFromNaverProfile,
  parseNaverAuthorizationResponse,
} from "./naver";

describe("naver oauth bridge", () => {
  it("builds a Naver authorize URL without leaking secrets", () => {
    const url = new URL(
      buildNaverAuthorizationUrl({
        clientId: "client-public",
        redirectUri: "http://127.0.0.1:3000/auth/naver/callback",
        state: "state-token",
      }),
    );

    expect(url.origin + url.pathname).toBe("https://nid.naver.com/oauth2.0/authorize");
    expect(url.searchParams.get("response_type")).toBe("code");
    expect(url.searchParams.get("client_id")).toBe("client-public");
    expect(url.searchParams.get("redirect_uri")).toBe(
      "http://127.0.0.1:3000/auth/naver/callback",
    );
    expect(url.searchParams.get("state")).toBe("state-token");
  });

  it("parses a valid authorization response and enforces state", () => {
    const params = new URLSearchParams({ code: "auth-code", state: "state-token" });

    expect(parseNaverAuthorizationResponse(params, "state-token")).toEqual({
      code: "auth-code",
      state: "state-token",
    });
  });

  it("rejects an authorization error or a state mismatch", () => {
    const errorParams = new URLSearchParams({ error: "access_denied", state: "x" });
    expect(() => parseNaverAuthorizationResponse(errorParams, "x")).toThrow();

    const mismatch = new URLSearchParams({ code: "c", state: "wrong" });
    expect(() => parseNaverAuthorizationResponse(mismatch, "expected")).toThrow();
  });

  it("extracts a provider identity from the Naver profile response", () => {
    const identity = identityFromNaverProfile({
      resultcode: "00",
      message: "success",
      response: { id: "naver-subject-1" },
    });

    expect(identity).toEqual({ provider: "naver", subject: "naver-subject-1" });
  });

  it("throws when the Naver profile is unsuccessful or missing an id", () => {
    expect(() =>
      identityFromNaverProfile({ resultcode: "024", message: "auth fail", response: {} }),
    ).toThrow();
    expect(() => identityFromNaverProfile({ resultcode: "00", response: {} })).toThrow();
  });
});

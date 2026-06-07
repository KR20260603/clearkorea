import { describe, expect, it, vi } from "vitest";
import { verifyTurnstile } from "./turnstile";

function siteverify(success: boolean): Response {
  return new Response(JSON.stringify({ success }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

describe("verifyTurnstile", () => {
  it("is skipped when no secret is configured (deferred integration)", async () => {
    const fetchImpl = vi.fn();
    const result = await verifyTurnstile({ token: "t", secret: undefined, fetchImpl });
    expect(result.kind).toBe("skipped");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("fails when configured but no token is supplied", async () => {
    const fetchImpl = vi.fn();
    const result = await verifyTurnstile({ token: null, secret: "s", fetchImpl });
    expect(result.kind).toBe("failed");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("verifies a valid token against siteverify", async () => {
    const fetchImpl = vi.fn(async () => siteverify(true));
    const result = await verifyTurnstile({ token: "good", secret: "s", fetchImpl });
    expect(result.kind).toBe("ok");
  });

  it("rejects an invalid token", async () => {
    const fetchImpl = vi.fn(async () => siteverify(false));
    const result = await verifyTurnstile({ token: "bad", secret: "s", fetchImpl });
    expect(result.kind).toBe("failed");
  });

  it("never throws and never leaks the secret on network failure", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("network");
    });
    const result = await verifyTurnstile({ token: "t", secret: "super-secret", fetchImpl });
    expect(result.kind).toBe("failed");
    expect(JSON.stringify(result)).not.toContain("super-secret");
  });
});

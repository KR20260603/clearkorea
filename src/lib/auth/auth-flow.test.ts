import { describe, expect, it, vi } from "vitest";
import { resolveCallbackRedirect } from "./auth-flow";

describe("resolveCallbackRedirect", () => {
  it("sends the user to the app after a successful code exchange", async () => {
    const exchanger = {
      auth: { exchangeCodeForSession: vi.fn().mockResolvedValue({ error: null }) },
    };

    await expect(
      resolveCallbackRedirect({ code: "auth-code", exchanger }),
    ).resolves.toBe("/");
    expect(exchanger.auth.exchangeCodeForSession).toHaveBeenCalledWith("auth-code");
  });

  it("redirects to a safe error when there is no code", async () => {
    await expect(
      resolveCallbackRedirect({ code: null, exchanger: null }),
    ).resolves.toBe("/?auth=error");
  });

  it("redirects to a safe notice when Supabase is unconfigured", async () => {
    await expect(
      resolveCallbackRedirect({ code: "auth-code", exchanger: null }),
    ).resolves.toBe("/?auth=unavailable");
  });

  it("redirects to a safe error when the exchange fails", async () => {
    const exchanger = {
      auth: {
        exchangeCodeForSession: vi.fn().mockResolvedValue({ error: { message: "bad" } }),
      },
    };

    await expect(
      resolveCallbackRedirect({ code: "auth-code", exchanger }),
    ).resolves.toBe("/?auth=error");
  });
});

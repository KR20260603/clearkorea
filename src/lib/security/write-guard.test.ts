import { describe, expect, it } from "vitest";
import { createRateLimitStore } from "./rate-limit";
import { guardWrite } from "./write-guard";

const config = { limit: 3, windowMs: 60_000 };

describe("guardWrite", () => {
  it("allows writes under the limit when Turnstile is not configured", async () => {
    const store = createRateLimitStore();
    const decision = await guardWrite({
      store,
      key: "voice:u1",
      turnstileToken: null,
      turnstileSecret: undefined,
      config,
      softThreshold: 1,
      now: 0,
    });
    expect(decision.kind).toBe("allow");
  });

  it("rate-limits once the window limit is exceeded", async () => {
    const store = createRateLimitStore();
    for (let i = 0; i < 3; i += 1) {
      await guardWrite({ store, key: "k", turnstileToken: null, turnstileSecret: undefined, config, softThreshold: 0, now: 0 });
    }
    const decision = await guardWrite({
      store,
      key: "k",
      turnstileToken: null,
      turnstileSecret: undefined,
      config,
      softThreshold: 0,
      now: 1_000,
    });
    expect(decision.kind).toBe("rate-limited");
  });

  it("requires a passing Turnstile token near the limit when configured", async () => {
    const store = createRateLimitStore();
    // Two requests leave remaining at the soft threshold; with a secret set and
    // no token, the challenge fails.
    await guardWrite({ store, key: "k", turnstileToken: null, turnstileSecret: "s", config, softThreshold: 1, now: 0 });
    const decision = await guardWrite({
      store,
      key: "k",
      turnstileToken: null,
      turnstileSecret: "s",
      config,
      softThreshold: 1,
      now: 0,
    });
    expect(decision.kind).toBe("challenge-failed");
  });
});

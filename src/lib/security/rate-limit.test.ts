import { describe, expect, it } from "vitest";
import {
  checkRateLimit,
  createRateLimitStore,
  requiresChallenge,
} from "./rate-limit";

const config = { limit: 3, windowMs: 60_000 };

describe("checkRateLimit", () => {
  it("allows requests up to the limit within a window", () => {
    const store = createRateLimitStore();
    expect(checkRateLimit(store, "k", config, 0).allowed).toBe(true);
    expect(checkRateLimit(store, "k", config, 10).allowed).toBe(true);
    expect(checkRateLimit(store, "k", config, 20).remaining).toBe(0);
  });

  it("blocks the request that exceeds the limit and reports retry-after", () => {
    const store = createRateLimitStore();
    checkRateLimit(store, "k", config, 0);
    checkRateLimit(store, "k", config, 0);
    checkRateLimit(store, "k", config, 0);
    const blocked = checkRateLimit(store, "k", config, 1_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBe(59_000);
  });

  it("resets after the window elapses", () => {
    const store = createRateLimitStore();
    checkRateLimit(store, "k", config, 0);
    checkRateLimit(store, "k", config, 0);
    checkRateLimit(store, "k", config, 0);
    expect(checkRateLimit(store, "k", config, 60_001).allowed).toBe(true);
  });

  it("keys are isolated", () => {
    const store = createRateLimitStore();
    checkRateLimit(store, "a", config, 0);
    checkRateLimit(store, "a", config, 0);
    checkRateLimit(store, "a", config, 0);
    expect(checkRateLimit(store, "b", config, 0).allowed).toBe(true);
  });
});

describe("requiresChallenge", () => {
  it("requires a challenge once remaining drops to the soft threshold", () => {
    expect(requiresChallenge({ allowed: true, remaining: 0, retryAfterMs: 0 }, 1)).toBe(true);
    expect(requiresChallenge({ allowed: true, remaining: 1, retryAfterMs: 0 }, 1)).toBe(true);
    expect(requiresChallenge({ allowed: true, remaining: 5, retryAfterMs: 0 }, 1)).toBe(false);
  });
});

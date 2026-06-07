// In-memory fixed-window rate limiter. No Redis baseline: this is a per-instance
// soft guard layered under Cloudflare edge rate limiting, which is the real
// distributed defense. See docs/setup/edge-and-abuse-guardrails.md.
export type RateLimitConfig = {
  readonly limit: number;
  readonly windowMs: number;
};

export type RateLimitOutcome = {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly retryAfterMs: number;
};

export type RateLimitStore = Map<string, { count: number; resetAt: number }>;

export function createRateLimitStore(): RateLimitStore {
  return new Map();
}

export function checkRateLimit(
  store: RateLimitStore,
  key: string,
  config: RateLimitConfig,
  now: number = Date.now(),
): RateLimitOutcome {
  const entry = store.get(key);
  if (!entry || now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.limit - 1, retryAfterMs: 0 };
  }
  if (entry.count >= config.limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now };
  }
  entry.count += 1;
  return { allowed: true, remaining: config.limit - entry.count, retryAfterMs: 0 };
}

export function requiresChallenge(
  outcome: RateLimitOutcome,
  softThreshold: number,
): boolean {
  return outcome.remaining <= softThreshold;
}

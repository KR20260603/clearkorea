import {
  checkRateLimit,
  requiresChallenge,
  type RateLimitConfig,
  type RateLimitStore,
} from "./rate-limit";
import { verifyTurnstile } from "./turnstile";

export const WRITE_RATE_LIMIT: RateLimitConfig = { limit: 8, windowMs: 60_000 };
export const CHALLENGE_SOFT_THRESHOLD = 2;

export type WriteGuardDecision =
  | { readonly kind: "allow" }
  | { readonly kind: "rate-limited"; readonly retryAfterMs: number }
  | { readonly kind: "challenge-failed" };

export async function guardWrite(input: {
  readonly store: RateLimitStore;
  readonly key: string;
  readonly turnstileToken: string | null;
  readonly turnstileSecret: string | undefined;
  readonly config?: RateLimitConfig;
  readonly softThreshold?: number;
  readonly now?: number;
}): Promise<WriteGuardDecision> {
  const outcome = checkRateLimit(
    input.store,
    input.key,
    input.config ?? WRITE_RATE_LIMIT,
    input.now,
  );
  if (!outcome.allowed) {
    return { kind: "rate-limited", retryAfterMs: outcome.retryAfterMs };
  }

  if (requiresChallenge(outcome, input.softThreshold ?? CHALLENGE_SOFT_THRESHOLD)) {
    const turnstile = await verifyTurnstile({
      token: input.turnstileToken,
      secret: input.turnstileSecret,
    });
    if (turnstile.kind === "failed") {
      return { kind: "challenge-failed" };
    }
  }

  return { kind: "allow" };
}

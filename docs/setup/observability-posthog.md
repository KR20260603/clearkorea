# Observability: PostHog (Deferred Setup)

PostHog is the single observability tool: product analytics, session replay,
feature flags, A/B, surveys, and error tracking. No Sentry. This is a deferred
runbook; creating the PostHog project and wiring keys requires user approval.

## App-Level Abstraction (already in code)

- `src/lib/posthog/config.ts` — `getPostHogConfig` enables PostHog only when
  both `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` are set.
  `postHogClientOptions` masks all inputs and `data-ph-mask` elements in replay
  and disables broad autocapture.
- `src/components/posthog-provider.tsx` — the boundary that activates only when
  configured; by default it is a no-op.
- `src/lib/posthog/feature-flags.ts` — `resolveHotWeights`,
  `resolveModerationThreshold`, and `isKillSwitchOn` read flag overrides and
  fall back to safe defaults.
- `src/lib/posthog/analytics.ts` — `captureError` records only the error message
  and explicit context, never raw bodies or PII.
- Sensitive surfaces carry `data-ph-mask`: the Speak up composer and the voice
  body in feed cards.

## Setup Steps (requires approval)

- [ ] Create a PostHog project (prefer EU hosting for sensitive users).
- [ ] Set `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` in env.
- [ ] Add the `posthog-js` dependency and initialize it inside `PostHogProvider`
      with `postHogClientOptions`, then enable session replay.
- [ ] Confirm replay masks all inputs, the Speak up composer, and voice bodies.
- [ ] Define feature flags: `hot_weights`, `moderation_auto_hide_threshold`,
      and kill switches such as `disable_posting`.
- [ ] Route client/server errors through `captureError`.
- [ ] Sample error ingestion during spikes; Cloudflare absorbs attack traffic.

## Uptime And Spend

- [ ] Add an uptime monitor (UptimeRobot or Better Stack free tier) for `/`.
- [ ] Set Vercel Spend Management and Supabase spend caps before public launch.
- [ ] Do not add Sentry; PostHog error tracking is the default path.

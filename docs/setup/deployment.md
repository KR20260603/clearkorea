# Deployment And Environment Hygiene (Deferred Setup)

This is a deferred runbook. Creating Vercel, Cloudflare, Supabase, and PostHog
projects or changing DNS, billing, or credentials requires user approval. No
secrets, tokens, or real admin identifiers belong in git. `.env` stays local.

## Continuous Integration

- `.github/workflows/ci.yml` runs lint, typecheck, unit tests, build, and the
  feed liveness check on every push and pull request to `main`.
- `.github/workflows/feeds.yml` runs the feed check weekly.
- Browser QA stays a manual runbook: drive the local dev server and store
  screenshots/action logs under `.omo/evidence/` (not committed).

## License And Metadata

- `package.json` `license` is `AGPL-3.0-only`.
- The landing footer shows `Open source · Licensed AGPL-3.0-only` and links to
  the public repository.

## Environment Variables (names only; values stay in env)

`.env.example` documents the official names: `SUPABASE_DB_PASSWORD`,
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`, `SUPER_ADMIN_PROVIDER_IDS`, `ADMIN_PROVIDER_IDS`,
Kakao/Naver client IDs and secrets, `CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS`,
`SEOUL_CITYDATA_API_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
`TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`,
and `OPENAI_API_KEY`.

## Vercel (requires approval)

- [ ] Create the Vercel project and link the repository.
- [ ] Add all env vars per environment; never commit them.
- [ ] Keep `/app` and `/admin` `noindex`; only public landing routes are indexed.
- [ ] Enable Deployment Protection for preview as needed.
- [ ] Set Spend Management limits.

## Cloudflare (requires approval)

- [ ] See `docs/setup/edge-and-abuse-guardrails.md` for DNS, proxy, WAF, DDoS,
      bot management, and edge rate-limit setup.

## Supabase (requires approval)

- [ ] Link the existing project; apply local migrations after review.
- [ ] Configure Kakao/Naver OAuth providers per `docs/setup/auth-setup-guide.md`.
- [ ] Set a spend cap and enable daily backups at public launch.

## PostHog And Uptime (requires approval)

- [ ] See `docs/setup/observability-posthog.md` for PostHog, replay masking,
      feature flags, error tracking, uptime monitoring, and spend caps.

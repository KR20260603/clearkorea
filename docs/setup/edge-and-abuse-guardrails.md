# Edge Caching And Abuse Guardrails

This is a deferred-integration runbook. App-level guards exist in code; the
hosted Cloudflare and Turnstile setup below requires user approval before any
DNS, WAF, or credential change. No secrets belong in this file.

## App-Level Guards (already in code)

- Write/report APIs run the Kakao/Naver auth gate first and reject production
  anonymous/guest writes with `401` before any rate-limit accounting.
- Authenticated writes pass through an in-memory fixed-window rate limiter
  (`src/lib/security/rate-limit.ts`), returning `429` with `Retry-After`.
- Near the limit, the guard requires a Cloudflare Turnstile token; verification
  runs server-side via `src/lib/security/turnstile.ts`. When no secret is
  configured the challenge is skipped, so local/dev flows are unblocked.
- Public read endpoints serve `Cache-Control` headers: `/api/counters`,
  `/api/link-preview`, `/api/congestion`. Page reads use server components and
  may add ISR as traffic grows.

## No Redis Baseline

- The rate limiter is per-instance and intentionally has no Redis or external
  cache dependency. Cloudflare edge rate limiting is the distributed defense.
- Only introduce a shared store if a measured bottleneck requires it.

## Cloudflare Setup Checklist (requires approval)

- [ ] Add `clearkorea.com` to Cloudflare and switch DNS/nameservers (critical).
- [ ] Proxy (orange-cloud) the app and API hostnames through Cloudflare.
- [ ] Enable unlimited DDoS mitigation (on by default for proxied traffic).
- [ ] Enable the WAF managed ruleset (OWASP/injection/XSS).
- [ ] Enable Bot Fight Mode / bot management on write paths.
- [ ] Add edge rate-limiting rules for `POST /api/voices` and `POST /api/tips`.
- [ ] Cache static assets and public GET endpoints at the edge with short TTLs.
- [ ] Keep an Under Attack mode runbook for coordinated spikes.

## Turnstile Setup Checklist (requires approval)

- [ ] Create a Turnstile widget in the Cloudflare dashboard.
- [ ] Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` in env.
- [ ] Render the widget on suspicious write flows and send the token as the
      `cf-turnstile-response` header on `POST /api/voices` and `POST /api/tips`.
- [ ] Confirm verification failures return `403` and never leak the secret.

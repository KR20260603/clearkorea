# Auth Setup Guide (Kakao / Naver)

This guide covers the **hosted configuration** that production Kakao/Naver login needs. The
application code is already implemented and tested locally; the steps below are the
**critical service integration** that changes hosted projects, OAuth secrets, or the hosted
database. **Each step requires explicit user approval before it is applied.**

> No secret values belong in this repository. Every identifier and key below is set through
> environment variables or a provider dashboard, never committed to source, tests, or docs.

## What is already implemented in code

- Launch-mode single source of truth (`src/lib/auth/launch-mode.ts`): production always denies
  guest participation; a dev/test guest bypass is possible only in non-production behind
  `CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS=true`.
- Provider registry (`src/lib/auth/providers/`): exactly Kakao and Naver. No Google anywhere.
- Kakao and Naver both authorize through Supabase: Kakao via the built-in provider, Naver via a
  Supabase Custom OAuth provider (`custom:naver`). Both return to `/auth/callback` and exchange the
  code for a session; the app holds no provider credentials and mints no sessions itself.
- Auth routes (`src/app/auth/kakao`, `/naver`, `/callback`, `/dev-guest`) and the login choice
  surface (`/auth/start`).
- `/app` gate middleware (`src/middleware.ts`) that redirects unauthenticated visitors to
  `/auth/start` once Supabase is configured, and stays open locally when it is not.
- Immutable nickname generator (`src/lib/nickname/`): deterministic Korean 6-syllable + 4-digit
  nicknames for linked users and dev/test guest fixtures.
- Role bootstrap (`src/lib/auth/role-resolver.ts`, `role-sync.ts`, `role-repository.ts`):
  promotes/demotes from provider-qualified Kakao/Naver IDs on every login; bare emails never
  promote.
- Local migration `supabase/migrations/20260607000000_role_sync.sql`: a `SECURITY DEFINER`
  `sync_user_role` RPC executable only by `service_role`.

## Environment variables (names only)

Set these in the hosting environment and local `.env` (never commit values):

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Supabase publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Calls `sync_user_role`; bypasses RLS. Never expose to the browser |
| `SUPABASE_AUTH_KAKAO_CLIENT_ID` / `SUPABASE_AUTH_KAKAO_CLIENT_SECRET` | server only | Kakao built-in provider credentials |
| `SUPABASE_AUTH_NAVER_CLIENT_ID` / `SUPABASE_AUTH_NAVER_CLIENT_SECRET` | server only | Naver custom OAuth credentials |
| `SUPER_ADMIN_PROVIDER_IDS` | server only | Comma-separated `kakao:<subject>` / `naver:<subject>` super-admin allowlist |
| `ADMIN_PROVIDER_IDS` | server only | Comma-separated provider-qualified admin allowlist |
| `CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS` | server only | `true` only in non-production for multi-account QA |

## 1. Kakao (Supabase built-in provider) — requires approval

1. In the Kakao Developers console, create an application and obtain the REST API key and
   client secret.
2. Set the OAuth Redirect URI to the Supabase callback: `https://<project-ref>.supabase.co/auth/v1/callback`.
3. In the Supabase dashboard (Authentication → Providers → Kakao), enable Kakao and paste the
   client id/secret, or set `SUPABASE_AUTH_KAKAO_CLIENT_ID` / `SUPABASE_AUTH_KAKAO_CLIENT_SECRET`
   and enable Kakao in `supabase/config.toml` (`[auth.external.kakao] enabled = true`).
4. Add the app origin and `/auth/callback` to the allowed redirect URLs.

## 2. Naver (Supabase Custom OAuth2 provider) — requires approval

Naver is not a Supabase built-in provider, so it is registered as a Supabase **Custom OAuth2
provider** with identifier `custom:naver`. Supabase then owns the whole flow: the app only sends
the user to `/auth/v1/authorize?provider=custom:naver` and exchanges the returned code at
`/auth/callback`. The app no longer holds Naver credentials, exchanges codes, or mints sessions.

1. Register an application at the Naver Developers console; obtain the client id and secret.
2. Set the Naver Callback URL to the **Supabase** callback (Supabase owns the flow now):
   `https://<project-ref>.supabase.co/auth/v1/callback`.
3. In Supabase (Authentication → Providers → New Provider → **Manual configuration**, which is the
   OAuth2 type — NOT "Auto-discovery (OIDC)"), or `auth.admin.customProviders.createProvider`,
   register a provider with:
   - identifier `custom:naver`, `provider_type: 'oauth2'`
   - authorization URL `https://nid.naver.com/oauth2.0/authorize`
   - token URL `https://nid.naver.com/oauth2.0/token`
   - userinfo URL = the app's flattening proxy `https://<app-domain>/api/auth/naver/userinfo`
   - `email_optional: true`; scopes empty (Naver requires none)
   - The form shows a read-only **Callback URL** — copy it into Naver's console (step 2). Do not
     paste it into an issuer field (doing so triggers an OIDC discovery error).
4. Why the proxy: Supabase's OAuth2 userinfo handling reads standard top-level claims (`sub`,
   `email`), but Naver's `/v1/nid/me` nests them under `response.{id,email}`.
   `src/app/api/auth/naver/userinfo` forwards the bearer token to Naver and exposes Naver's id as
   the standard `sub` claim (email passes through), so no attribute mapping is needed. The proxy
   must be publicly reachable by Supabase, so end-to-end Naver login is only testable after deploy
   (Kakao, being built-in, has no such constraint).

## 3. Service role key + role sync migration — requires approval

1. Copy the project's service role key into `SUPABASE_SERVICE_ROLE_KEY` (server environment only).
2. Apply the local migration to the hosted database (after approval), for example:
   `supabase db push` or `supabase migration up` against the linked project.
3. The app's Supabase-backed role repository calls `sync_user_role` with the service-role client
   to persist promotions/demotions computed by `resolveRoleForIdentity`.

## 4. Admin / super-admin allowlists

- Populate `SUPER_ADMIN_PROVIDER_IDS` and `ADMIN_PROVIDER_IDS` with provider-qualified ids in the
  form `kakao:<subject>` or `custom:naver:<subject>` (Naver is a Supabase Custom OAuth provider, so
  Supabase reports its identity provider as `custom:naver`).
- Removing an id demotes that account to `user` on its next login.
- Bare email entries never promote anyone.

## 5. Launch mode and dev/test guest bypass

- Production deployments run with `NODE_ENV=production`, which forces launch mode: guest login,
  guest posting, guest reporting, and Google OAuth are all absent.
- The dev/test guest bypass is available only when `NODE_ENV` is not production **and**
  `CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS=true`.

## Verification checklist

- [ ] `/auth/start` shows only Kakao and Naver in production; no Google, no guest.
- [ ] A linked Kakao/Naver user receives an immutable Korean 6-syllable + 4-digit nickname.
- [ ] Provider-qualified ids in the allowlists promote/demote on login; bare emails never do.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set server-side only and never shipped to the browser.
- [ ] No secret values appear in tracked files or commit messages.

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
- Login bootstrap (`src/lib/auth/login-bootstrap.ts`, `provider-identity.ts`,
  `profile-repository.ts`, wired in `src/app/auth/callback/route.ts`): after the verified
  `getUser()`, a trusted service-role client ensures the member's `public.users` row exists and
  then reconciles the role. The allowlist subject is taken **only** from the provider-set
  `identities[]` (never the user-editable `user_metadata`).
- Admin console + subdomain (`src/middleware.ts`, `src/lib/routing/subdomain.ts`): the
  `admin.<host>` subdomain serves the role-gated `/admin` console; unauthenticated visitors are
  redirected to the app-subdomain login. The `/admin` page still enforces the role check itself.
- Conditional Admin link (`src/components/app/account-controls.tsx`, `src/app/api/me/route.ts`):
  the app header shows the Admin link only to `admin`/`super`.
- Cross-subdomain SSO (`src/lib/supabase/cookie-domain.ts`): auth cookies are scoped to the
  shared parent domain (`.clearkorea.com`) so the app and admin subdomains share one session;
  localhost stays host-only.
- Local migration `supabase/migrations/20260606030000_initial_schema.sql`: schema + RLS. The
  `public.users` self-insert is constrained to `role='user'` (no self-promotion), and table reads
  are limited to own-row + admins (no public leak of `auth_user_id`/`oauth_subject`/`role`).
- Local migration `supabase/migrations/20260607000000_role_sync.sql`: a `SECURITY DEFINER`
  `sync_user_role` RPC executable only by `service_role`.

## Environment variables (names only)

Set these in the hosting environment and local `.env` (never commit values):

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Supabase publishable/anon key |
| `NEXT_PUBLIC_APP_ORIGIN` | public | App-subdomain origin (`https://app.clearkorea.com`). Marketing `Enter` link + cross-subdomain login target. Blank derives `app.<host>` |
| `NEXT_PUBLIC_ADMIN_ORIGIN` | public | Admin-subdomain origin (`https://admin.clearkorea.com`). Admin link target. Blank derives `admin.<host>` |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Ensures the `public.users` row on login and calls `sync_user_role`; bypasses RLS. Never expose to the browser |
| `SUPABASE_AUTH_KAKAO_CLIENT_ID` / `SUPABASE_AUTH_KAKAO_CLIENT_SECRET` | server only | Kakao built-in provider credentials |
| `SUPABASE_AUTH_NAVER_CLIENT_ID` / `SUPABASE_AUTH_NAVER_CLIENT_SECRET` | server only | Naver custom OAuth credentials |
| `SUPER_ADMIN_PROVIDER_IDS` | server only | Comma-separated `kakao:<subject>` / `custom:naver:<subject>` super-admin allowlist |
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

## 3. Service role key + database migrations — requires approval

1. Copy the project's service role key into `SUPABASE_SERVICE_ROLE_KEY` (server environment only).
   Login bootstrap needs it to create the `public.users` row and to call `sync_user_role`; without
   it a login still authenticates but persists no profile/role.
2. Apply both local migrations to the hosted database (after approval), **in order**:
   `20260606030000_initial_schema.sql` (schema, RLS, helper functions) then
   `20260607000000_role_sync.sql` (the role-sync RPC). Use `supabase db push` /
   `supabase migration up` against the linked project, the Supabase MCP, or the dashboard SQL
   editor. These migrations use bare `create` statements, so apply them only to an empty/clean
   project.
3. Run the Supabase security advisors after applying and resolve any flagged RLS/policy issues.
4. The app's role repository calls `sync_user_role` with the service-role client to persist
   promotions/demotions computed by `resolveRoleForIdentity`.

## 4. Admin / super-admin allowlists

- Populate `SUPER_ADMIN_PROVIDER_IDS` and `ADMIN_PROVIDER_IDS` with provider-qualified ids in the
  form `kakao:<subject>` or `custom:naver:<subject>` (Naver is a Supabase Custom OAuth provider, so
  Supabase reports its identity provider as `custom:naver`).
- To find your own `<subject>`: after logging in, read the verified user's `identities[].id`
  (Supabase dashboard → Authentication → Users → your user → identity), or have a maintainer log it
  once from `getUser()`. It is the provider's stable user id, not the Supabase UUID.
- Removing an id demotes that account to `user` on its **next login** (env allowlist is reconciled
  at login). Existing sessions keep their DB role until then. Admins created via the in-app
  application/approval flow are not in the env allowlist; revoke them immediately with the
  super-only `application.demote` action.
- Bare email entries never promote anyone.

## 5. Launch mode and dev/test guest bypass

- Production deployments run with `NODE_ENV=production`, which forces launch mode: guest login,
  guest posting, guest reporting, and Google OAuth are all absent.
- The dev/test guest bypass is available only when `NODE_ENV` is not production **and**
  `CLEAR_KOREA_ENABLE_DEV_GUEST_BYPASS=true`.

## 6. Admin console and the admin subdomain — requires approval

The role-gated admin console is served on its own subdomain, sharing one login with the app via
parent-domain auth cookies.

1. DNS / hosting:
   - Point `admin.clearkorea.com` at the same deployment as `app.clearkorea.com` (e.g. add the
     domain in Vercel and a `CNAME admin -> cname.vercel-dns.com`).
   - Locally, add `admin.clearkorea.local` to the hosts file alongside `app.clearkorea.local`.
2. Set `NEXT_PUBLIC_APP_ORIGIN` and `NEXT_PUBLIC_ADMIN_ORIGIN` so the cross-subdomain login
   redirect and the in-app Admin link resolve explicitly (otherwise they are derived from the
   request host).
3. Behavior: middleware serves `/admin` on the admin host and redirects unauthenticated visitors
   to the app-subdomain `/auth/start`. The `/admin` page re-checks the role, so middleware cookie
   presence is never the authorization decision.

### Cross-subdomain SSO and operational security

- Auth cookies are scoped to `.clearkorea.com` so `app.*` and `admin.*` share a session. This makes
  every `*.clearkorea.com` host part of the auth trust boundary.
- Therefore: do **not** use wildcard DNS, do not host untrusted/user-controlled content on any
  `clearkorea.com` subdomain, monitor for dangling CNAMEs (subdomain-takeover), and enforce HSTS.
- During rollout, expect the browser to replace older host-only `sb-*-auth-token` cookies with the
  domain-scoped ones; clearing cookies once avoids transient duplicate-cookie ambiguity.

## Verification checklist

- [ ] `/auth/start` shows only Kakao and Naver in production; no Google, no guest.
- [ ] A linked Kakao/Naver user receives an immutable Korean 6-syllable + 4-digit nickname.
- [ ] Provider-qualified ids in the allowlists promote/demote on login; bare emails never do.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set server-side only and never shipped to the browser.
- [ ] Logging in creates exactly one `public.users` row; a non-admin cannot self-insert a
      privileged role.
- [ ] `admin.<host>` serves `/admin` for admins and redirects everyone else to the app login.
- [ ] The in-app Admin link appears only for `admin`/`super` accounts.
- [ ] No secret values appear in tracked files or commit messages.

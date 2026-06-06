# SUPABASE WORKSPACE GUIDANCE

This file governs `supabase/` and its children. Root `AGENTS.md` still applies.

## SCOPE

- `supabase/config.toml` is the local Supabase CLI configuration.
- `supabase/migrations/` contains local-first schema, RLS, trigger, storage, and policy changes.
- `supabase/seed.sql` contains non-secret seed data for local QA only.

## RULES

- Keep Supabase work local-first unless the user explicitly approves a hosted project mutation.
- Do not run hosted `execute_sql`, `apply_migration`, or destructive project operations as a convenience step. Hosted DDL/RLS/policy changes are critical service integration.
- Every app-exposed table must have RLS enabled and explicit policies. Do not rely on frontend hiding or client-side role checks.
- Do not store secret values, OAuth client secrets, live admin IDs, or personal identifiers in migrations, seed files, tests, or docs.
- Admin and super-admin bootstrap must use provider-qualified Kakao/Naver identity identifiers or explicit super-admin approval. Do not use email-only allowlists.
- Production auth policy is Kakao/Naver only. Do not add Google OAuth tables, provider config, or seed assumptions.
- Seeds may include obvious fixtures, public reference rows, and deterministic local data. Keep them safe to publish.
- When changing SQL shape, update `src/lib/supabase/database.types.ts` and schema contract tests if the app-side contract changes.

## CHECKS

```bash
node scripts/check-supabase-schema.mjs supabase/migrations/20260606030000_initial_schema.sql supabase/seed.sql
pnpm test -- src/lib/supabase
```

Use Supabase CLI local commands only when the CLI and Docker/local stack are available, and record that evidence separately from hosted-service changes.

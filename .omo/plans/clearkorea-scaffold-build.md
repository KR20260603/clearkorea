# ClearKorea Scaffold And Build Plan

## TL;DR
> **Summary**: Scaffold the full ClearKorea v1 app from the current planning/prototype baseline into a production-ready Next.js App Router application, preserving the civic safety constraints and the revised Kakao/Naver-only production identity gate.
> **Deliverables**: Next.js/React/Tailwind scaffold, Supabase schema/RLS/auth with Kakao/Naver production login only, five-tab app, admin workflows, feeds/Cron, moderation agents, observability, deployment readiness, and readable Conventional Commit rules.
> **Effort**: XL
> **Parallel**: YES - 6 waves
> **Critical Path**: Task 1 -> Task 2 -> Task 2A -> Task 2B -> Tasks 3-4 -> Tasks 5-15 -> Task 16

## Context
### Original Request
- `$omo:ulw-plan`
- Read every root Markdown file.
- Produce a plan for scaffolding, commit rules, and the full build plan.
- Commit rules must follow international Conventional Commits.
- Commit messages must not be one-line only; use readable, core-focused explanation with bullet-style body lines.

### Root Markdown Read
- `AGENTS.local.md`: local-only service context; Supabase project exists; `.env` has secrets and allowlists; Vercel/Cloudflare/PostHog not created.
- `AGENTS.md`: project knowledge base, structure, conventions, anti-patterns, available command.
- `CONTRIBUTING.md`: AGPL-3.0-only contribution, safety, security, PR rules.
- `IMAGE.md`: SVG-first brand direction and raster asset prompt rules.
- `PLAN.md`: source of truth for v1 scope, stack, data model, safety, build order.
- `README.ko.md` and `README.md`: Korean/English public copy and operating principles.

### Interview Summary
- No user interview required: repo Markdown defines stack, scope, safety, and local service facts.
- Default applied: strict TDD for production work after scaffold; Codex Browser/browser-use manual QA for browser-facing criteria; no auto-commit unless execution is explicitly approved.

### Metis Review (gaps addressed)
- Gap review verdict: `APPROVE`.
- Addressed risks: no existing test runner, external resources missing, secrets present in `.env`, broad v1 scope, safety-sensitive civic copy, and source/prototype migration boundaries.

### High Accuracy Review
- Momus-style high accuracy review verdict: `OKAY`.
- Latest user constraints verified: `$omo:frontend-ui-ux` is mandatory for frontend/SVG/graphic design work, Windows QA avoids `tmux`, browser QA uses Codex Browser/browser-use, and the plan still covers scaffolding, Conventional Commits, and full v1 build scope.

### Plan Revision: Auth Gate And Landing Cleanup
- New user decision: production launch must remove user-facing guest login and require identity-linked participation through Kakao or Naver OAuth only.
- Guest-like access may remain only as a development/test convenience for multi-account QA and must be disabled in production launch mode.
- Google OAuth is removed from production auth scope. This does not affect Google News RSS feed collection.
- Admin bootstrap must stop using Google verified email allowlists and instead use env-only, provider-qualified Kakao/Naver identity identifiers or super-admin approval flows.
- Landing cleanup must remove the duplicate header GitHub button and keep one GitHub/contribution affordance in content/footer.

## Work Objectives
### Core Objective
Build the complete ClearKorea v1 web application from the current prototype baseline without deferring documented v1 scope.

### Deliverables
- Production Next.js 16.2 line scaffold with React 19, TypeScript, Tailwind, pnpm, `src/`, App Router route groups, shadcn/ui, and strict lint/test tooling.
- Supabase migrations, RLS, type generation, auth/session helpers, Kakao/Naver OAuth, development-only guest/test bypass controls, admin role bootstrap, and audit logs.
- Public landing, five-tab app shell, Square, Rallies, Live, News, affected stations, admin queues, moderation settings, feeds, Cron jobs, and agent-backed operational flows.
- Observability/deployment baseline with PostHog, Turnstile, Vercel, Cloudflare, uptime checks, spend caps, and no Sentry/Redis baseline.
- Conventional Commit rules and commit templates that produce readable multi-line commit messages.
- Mandatory `omo:frontend-ui-ux` usage rule for frontend UI, SVG, raster asset, visual polish, layout, motion, and graphic design work.

### Definition of Done (verifiable conditions with commands)
- `pnpm install --frozen-lockfile` exits 0.
- `pnpm lint` exits 0.
- `pnpm typecheck` exits 0.
- `pnpm test` exits 0 with RED->GREEN evidence for each production task.
- Codex Browser/browser-use QA is run against the local dev server and stores screenshots/action logs for browser-facing criteria.
- `pnpm build` exits 0.
- `node scripts/check-feeds.mjs config/feeds.json` exits 0 or any pre-existing dead required feed is documented before feature work starts.
- Local dev server browser QA confirms `/`, `/app`, `/app/stations`, `/admin`, `robots.txt`, and `sitemap.xml` behavior.
- Launch-mode QA proves guest participation is disabled, Google OAuth is absent from UI/config, and Kakao/Naver OAuth entry points are the only production login choices.
- No secrets, admin allowlist emails, API keys, DB passwords, or deployment tokens appear in tracked files or commit messages.

### Must Have
- Preserve v1 as one initial scope.
- Use route groups `(marketing)`, `(app)`, `(admin)`.
- Use bottom dock labels exactly: `Today`, `Rallies`, `Square`, `Live`, `News`.
- Keep public copy aligned in English/Korean when public claims change.
- Keep civic wording around investigation, recurrence prevention, election transparency, and fair re-vote.
- Label Seoul data as regional real-time congestion, not rally headcount.
- Preserve affected polling station disclaimer that the list summarizes administrative failures and does not prove election fraud.
- Keep feed checker dependency-free.
- Use PostHog as default analytics/error-tracking path.
- Production participation requires Kakao or Naver OAuth account linking; no public guest posting or guest login at launch.
- Development/test guest bypass is allowed only behind explicit non-production configuration and must be impossible in production launch mode.
- Admin bootstrap uses env-only provider-qualified Kakao/Naver identity identifiers or explicit super-admin approval, not Google verified email.
- Use `$omo:frontend-ui-ux` explicitly before frontend UI, SVG image, raster image, visual design, layout, motion, or graphic polish work.
- For design work, require a written aesthetic direction before implementation: purpose, tone, constraints, and the one memorable differentiator.
- Do not integrate Supabase, Vercel, Cloudflare, or PostHog blindly. Critical hosted-service setup must stop for user approval; non-critical work should stay behind abstractions and end with a final setup guide.

### Must NOT Have
- No source or docs containing secret values or allowlist email values.
- No Sentry baseline.
- No Redis or separate in-memory cache baseline.
- No `public/pwa-icon.ico`.
- No source claim that organized election fraud is established fact.
- No doxxing, individual tracking, unlawful organizing, or private retaliation workflows.
- No production Google OAuth login path.
- No production user-facing guest login, guest posting, or guest reporting path.
- Do not remove or confuse Google News RSS feed ingestion; that is unrelated to Google OAuth.
- No auto-commit without explicit approval.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: TDD after scaffold. Use Vitest + Testing Library for unit/integration, SQL/RLS checks through Supabase CLI or project-linked SQL, existing Node feed checker for feeds, and Codex Browser/browser-use for real browser QA.
- QA policy: Every task has agent-executed scenarios. Browser-facing tasks require Codex Browser/browser-use QA against the running app, not just tests.
- Windows policy: Do not use `tmux`. Use Codex Browser/browser-use, HTTP `curl.exe`, PowerShell `Start-Process`/`Stop-Process`, or Git Bash commands that work on Windows.
- Evidence: `.omo/evidence/task-{N}-{slug}.{ext}` plus failing and passing test logs per task.
- RED->GREEN: For each production task after Task 1, first add/adjust a failing test, capture failure, implement, then capture passing output.

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. Dependencies below define exact safe parallelism.

Wave 1: Task 1
Wave 2: Task 2
Wave 2 Repair: Tasks 2A, 2B
Wave 3: Tasks 3, 4
Wave 4: Tasks 5, 6, 7, 7A, 7B, 8, 9
Wave 5: Tasks 10, 11, 12, 13, 14, 15
Wave 6: Task 16

### Current Execution State
- Completed through Wave 4 (Tasks 1-9 including 2A/2B/7A/7B). Next wave is Wave 5 (Tasks 10-15).
- Task 2A completed in commit `e0012fc feat(shell): add unified branded app shell`.
- Task 2B completed in commit `89c8bcf docs(auth): sync Kakao Naver launch policy`.
- Task 3 completed in commit `6616050 feat(db): add Supabase schema and policies`; it added local Supabase config, migration, RLS/storage policies, seed data, schema checks, project constants, and generated database types without mutating the hosted Supabase project.
- Task 4 completed in commit `2cdc860 feat(copy): add safety and UI text contracts`; it added civic copy, safety text, URL validation, nickname contracts, env-name contract tests, and the official `.env.example` variable names.
- Verified after Wave 3: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `node scripts/check-feeds.mjs config/feeds.json`, and `node scripts/check-supabase-schema.mjs supabase/migrations/20260606030000_initial_schema.sql supabase/seed.sql`.
- Task 5 completed (Wave 4): Kakao/Naver-only launch gate, provider registry (no Google), launch-mode SSOT with non-production-only guest bypass, Supabase SSR clients, Naver custom-OAuth bridge, auth routes + `/auth/start` choice UI, `/app` gate middleware, immutable Korean nickname generator, provider-qualified role bootstrap/sync, local `sync_user_role` migration, admin-application validator, and `docs/setup/auth-setup-guide.md` for deferred hosted wiring. Verified: `pnpm lint`, `pnpm typecheck`, `pnpm test` (93), `pnpm build`, and production browser QA of `/auth/start` (Kakao+Naver only, no Google/guest, 320x480). No hosted Supabase mutation performed.
- Task 6 completed in commit `1c255b4 feat(app): add dashboard shell and counters`; five-tab app shell, dock, pinned counters, cached counters API.
- Task 7 + 7A completed in commit `04aba5e feat(square): add voices and today routing`; Square composer/feed contracts, hot-score sorting, unauthenticated write guard, Square-as-home routing, Today (KST) summary route, and `Today/Rallies/Square/Live/News` dock labels.
- Task 7B completed (Wave 4): server-side first-URL metadata preview (`/api/link-preview`) with SSRF guard (rejects loopback/link-local/private/metadata hosts), HTML-only + timeout + size limits, OpenGraph/`<title>` extraction with safe-image filtering, composer draft preview (resolving/resolved/unsupported, no file upload), and large-thumbnail bookmark embed card on voices. Verified: `pnpm lint`, `pnpm typecheck`, `pnpm test` (140), `pnpm build`, real-browser composer preview QA, and API SSRF/og:image probes. No hosted Supabase mutation.
- Task 8 completed in commit `57875c7 feat(rallies): add rally map and congestion proxy`; /app/rallies list+SVG map+support guide, server-only Seoul congestion proxy (cache, no key leak, regional-congestion label), unknown-place 404, deferred unavailable. Verified: lint/typecheck/test/build, browser QA incl 320x480, API probes.
- Task 9 completed in commit `9237323 feat(news): add live streams and feed ingestion`; /app/live verified YouTube+replay grids, /app/news All/Verified/Public/World-press tabs, Kakao/Naver-gated tips API + SNS-whitelist Report modal, metadata-only multilingual feed ingestion (keyword AND filter, tracking-param dedupe), weekly feeds GitHub Action. Verified: lint/typecheck/test (172), build, browser QA. Pre-existing dead required feeds `cbc-world`/`kyodo-en` are upstream RSS outages (documented, not caused by this task).
- **Next wave to execute: Wave 5 — Tasks 10, 11, 12, 13, 14, 15** (affected stations port, admin queues/settings/audit, edge cache/rate-limit/Turnstile guardrails, moderation AI + agents, PostHog observability, deployment/CI/env hygiene).
- Do not wire critical hosted Supabase/Vercel/Cloudflare/PostHog changes without explicit user approval. If a service integration is not critical to the current behavior, keep it abstracted and provide the final setup guide instead.

### Dependency Matrix
| Task | Blocks | Blocked By |
| --- | --- | --- |
| 1 | 2, 3, 4 | none |
| 2 | 2A | 1 |
| 2A | 2B | 2 |
| 2B | 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 15 | 2A |
| 3 | 5, 6, 7, 8, 9, 10, 11, 12 | 1, 2B |
| 4 | 5, 6, 7, 8, 9 | 1, 2B |
| 5 | 10, 16 | 2B, 3, 4 |
| 6 | 10, 13, 16 | 2B, 3, 4 |
| 7 | 7A, 7B, 13, 14, 16 | 2B, 3, 4 |
| 7A | 8, 9, 10, 13, 16 | 6, 7 |
| 7B | 13, 14, 16 | 7 |
| 8 | 12, 16 | 2B, 3, 4 |
| 9 | 12, 16 | 2B, 3, 4 |
| 10 | 13, 14, 16 | 2B, 5, 6 |
| 11 | 13, 14, 16 | 2B, 3, 5 |
| 12 | 16 | 2B, 5, 8, 9 |
| 13 | 16 | 6, 7, 10, 11 |
| 14 | 16 | 7, 10, 11 |
| 15 | 16 | 2B |
| 16 | final | all prior tasks |

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task has references, acceptance criteria, QA scenarios, and commit guidance.

- [x] 1. Scaffold Next.js Workspace, Tooling, And Commit Policy

  **What to do**: Initialize the app scaffold in-place using pnpm and the Next.js 16.2 patch line with App Router, TypeScript, Tailwind, ESLint, `src/`, and import alias. Add Vitest, Testing Library, lint/typecheck/build scripts, `commitlint` or an equivalent commit-msg check, and a `CONVENTIONAL_COMMITS.md` or contribution section describing readable multi-line Conventional Commit messages. Preserve existing docs/config/prototypes/scripts. Do not move prototype files into `src/` yet.
  **Must NOT do**: Do not print `.env`; do not delete root docs or prototype files; do not add `pwa-icon.ico`; do not commit automatically.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2-16 | Blocked By: none

  **References**:
  - Pattern: `AGENTS.md` - no scaffold exists; `src/` is reserved for future Next app.
  - Pattern: `PLAN.md:81` - stack and route-group expectations.
  - Pattern: `CONTRIBUTING.md` - PR/security rules.
  - Skill: `$omo:frontend-ui-ux` - use for any scaffolded visual shell, default landing surface, typography, design-token, or SVG/icon polish decisions.
  - External: Context7 `/vercel/next.js/v16.2.2` - `create-next-app` supports TypeScript, Tailwind, ESLint, App Router, Turbopack, and `--src-dir`.

  **Acceptance Criteria**:
  - [ ] `package.json` exists with `pnpm` scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `test:watch`.
  - [ ] `pnpm-lock.yaml`, `tsconfig.json`, Next config, Tailwind config, and Vitest config exist.
  - [ ] `src/app` exists with route groups `(marketing)`, `(app)`, `(admin)`.
  - [ ] Commit guide defines subject format `<type>(<scope>): <imperative>` and requires a multi-line body for non-trivial commits.
  - [ ] Commit body template uses concise bullets, each bullet on its own line, plus `Plan: .omo/plans/clearkorea-scaffold-build.md` footer for plan-driven implementation commits.
  - [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` exit 0 after scaffold.

  **QA Scenarios**:
  ```
  Scenario: Scaffold boots
    Tool: PowerShell + curl.exe
    Steps: powershell -NoProfile -Command "$p = Start-Process pnpm -ArgumentList 'dev --hostname 127.0.0.1 --port 3000' -PassThru; Start-Sleep 8; curl.exe -i http://127.0.0.1:3000/; Stop-Process -Id $p.Id"
    Expected: HTTP status 200 and body includes ClearKorea or scaffold landing text
    Evidence: .omo/evidence/task-1-scaffold-http.txt

  Scenario: Commit message policy rejects one-line non-trivial commit
    Tool: bash
    Steps: printf 'feat(app): build shell\n' | pnpm commitlint
    Expected: non-zero exit with body/footer requirement message
    Evidence: .omo/evidence/task-1-commitlint-reject.txt
  ```

  **Commit**: YES | Message: `build(scaffold): initialize Next.js workspace` | Files: `package.json`, `pnpm-lock.yaml`, config files, `src/**`, commit policy docs

  **Commit Body Template**:
  ```text
  build(scaffold): initialize Next.js workspace

  - Add Next.js App Router scaffold with TypeScript, Tailwind, src, and pnpm scripts.
  - Add Vitest, lint, typecheck, build verification hooks, and Browser QA instructions.
  - Add Conventional Commit guidance requiring readable multi-line commit bodies.

  Plan: .omo/plans/clearkorea-scaffold-build.md
  ```

- [x] 2. Establish App Architecture, Design Tokens, Assets, And SEO Shell

  **What to do**: Build root layout, route groups, metadata, `robots.ts`, `sitemap.ts`, app providers, design tokens, responsive shell, footer GitHub link, PWA manifest, favicon/icon references, OG metadata, and asset references. Landing text must render as HTML, not baked into raster images.
  **Must NOT do**: Do not make a marketing-only placeholder app; do not overuse raster where SVG/HTML/CSS works; do not change public claims without aligning English/Korean copy.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 2A | Blocked By: 1

  **References**:
  - Pattern: `IMAGE.md` - SVG-first brand and raster asset uses.
  - Pattern: `PLAN.md:35` - brand colors and asset names.
  - Pattern: `PLAN.md:336` - responsive layout and GitHub footer.
  - Skill: `$omo:frontend-ui-ux` - mandatory for aesthetic direction, typography, spacing, motion, SVG-first brand treatment, and screenshot-based visual QA.
  - External: Context7 `/vercel/next.js/v16.2.2` - Metadata API, `robots.ts`, `sitemap.ts`.

  **Acceptance Criteria**:
  - [ ] Before implementation, executor records a `$omo:frontend-ui-ux` aesthetic direction covering purpose, tone, constraints, and one memorable differentiator.
  - [ ] `/` has SEO metadata, OG image, `hreflang` en/ko, Organization JSON-LD, and an Enter CTA.
  - [ ] Landing has exactly one GitHub/contribution affordance and it is not duplicated in the header navigation.
  - [ ] `/robots.txt` allows landing/public routes and disallows `/app` and `/admin`.
  - [ ] `/sitemap.xml` includes public landing routes only.
  - [ ] PWA manifest uses name `ClearKorea`, theme/background `#0A0A0A`, and `public/pwa-icon.png`.
  - [ ] Footer exposes `https://github.com/KR20260603/clearkorea`.

  **QA Scenarios**:
  ```
  Scenario: Landing metadata and CTA render
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/ in the Codex in-app Browser; inspect visible h1/CTA and metadata; capture screenshot
    Expected: Enter is visible, title/description are present, screenshot is nonblank
    Evidence: .omo/evidence/task-2-landing.png

  Scenario: Private routes excluded from robots
    Tool: curl
    Steps: curl -i http://127.0.0.1:3000/robots.txt
    Expected: HTTP 200 and body disallows /app and /admin
    Evidence: .omo/evidence/task-2-robots.txt
  ```

  **Commit**: YES | Message: `feat(shell): add branded app foundation` | Files: `src/app/**`, `src/components/**`, `src/styles/**`, metadata files

- [x] 2A. Correct Landing GitHub Affordance And Public Asset Contract

  **What to do**: Repair the partially completed landing shell so it matches the revised visual/product contract. Remove the duplicate header GitHub button, keep exactly one GitHub/contribution link in content or footer, verify the public asset contract stores brand files directly under `public/`, and use root static URLs such as `/pwa-icon.svg`, `/hero.png`, and `/og.png`.
  **Must NOT do**: Do not keep two GitHub buttons; do not leave a lone header GitHub CTA; do not add a custom asset route-handler workaround unless static `public/` serving is impossible; do not recreate a root `assets/` directory or a nested `public/assets/` directory.

  **Parallelization**: Can Parallel: NO | Wave 2 Repair | Blocks: 2B, 3-16 | Blocked By: 2

  **References**:
  - Pattern: `src/app/(marketing)/page.tsx` - current landing has a header GitHub action and a second CTA GitHub action; remove the header one.
  - Pattern: `public/` - canonical brand asset location and Next.js static root.
  - Pattern: `IMAGE.md`, `PLAN.md` - generated asset names remain source/brand references.
  - Skill: `$omo:frontend-ui-ux` - mandatory for the action hierarchy and screenshot review.

  **Acceptance Criteria**:
  - [x] `/` renders exactly one link to `https://github.com/KR20260603/clearkorea`.
  - [x] The remaining GitHub/contribution link is not in the top header/nav.
  - [x] `/pwa-icon.svg`, `/hero.png`, and `/hero-mobile.png` return HTTP 200 from static public assets.
  - [x] No `assets/` or `public/assets/` directory exists after the migration.
  - [x] No custom asset route handler exists unless the executor documents why static public assets cannot work.
  - [x] `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` exit 0.

  **QA Scenarios**:
  ```
  Scenario: Landing has one GitHub affordance
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/; count visible and DOM GitHub links; capture screenshot
    Expected: exactly one GitHub link exists and header/nav has none
    Evidence: .omo/evidence/task-2a-single-github.png

  Scenario: Public brand assets load
    Tool: curl
    Steps: curl -I http://127.0.0.1:3000/pwa-icon.svg; curl -I http://127.0.0.1:3000/hero.png; curl -I http://127.0.0.1:3000/hero-mobile.png
    Expected: all responses are HTTP 200 and served as static assets
    Evidence: .omo/evidence/task-2a-assets.txt
  ```

  **Commit**: DONE | Commit: `e0012fc feat(shell): add unified branded app shell` | Files: `src/app/**`, `public/hero2.png`, tests, package metadata

- [x] 2B. Sync Auth Policy Across Docs And Plan Contracts

  **What to do**: Update the repository guidance so the auth policy is consistent before deeper implementation continues. Sync `PLAN.md`, `README.md`, `README.ko.md`, `AGENTS.md`, and any generated contribution/env guidance so production participation is Kakao/Naver OAuth only, guest access is development/test only, Google OAuth is absent, and admin bootstrap uses env-only provider-qualified Kakao/Naver identity identifiers or super-admin approval. Deduplicate repeated policy text and keep English/Korean public claims aligned.
  **Must NOT do**: Do not remove Google News RSS/feed ingestion references; do not commit secrets or actual admin identifiers; do not publish private local values from `AGENTS.local.md` or `.env`; do not leave docs implying public guest participation at launch.

  **Parallelization**: Can Parallel: NO | Wave 2 Repair | Blocks: 3-16 | Blocked By: 2A

  **References**:
  - Pattern: `PLAN.md` - product source of truth that currently must absorb the revised auth decision.
  - Pattern: `README.md`, `README.ko.md` - public principles must remain meaning-aligned.
  - Pattern: `AGENTS.md` - execution rules must record the production auth policy and Google News RSS exception.
  - External: Supabase docs - Kakao is a built-in OAuth provider; plan Naver as custom OAuth/OIDC unless later official support is verified from primary docs.

  **Acceptance Criteria**:
  - [x] `PLAN.md` states production login/participation is Kakao/Naver OAuth only.
  - [x] `PLAN.md` and `AGENTS.md` state development/test guest bypass is allowed only under explicit non-production configuration and is disabled in launch mode.
  - [x] `README.md` and `README.ko.md` do not present public guest participation or Google OAuth as launch behavior.
  - [x] Admin bootstrap docs use provider-qualified Kakao/Naver identity IDs or super-admin approval, not Google email allowlists.
  - [x] Google News RSS/feed ingestion remains explicitly preserved and is not conflated with Google OAuth.
  - [x] Major service integration policy requires user approval for critical hosted changes and abstraction plus final setup guide for non-critical work.

  **QA Scenarios**:
  ```
  Scenario: Auth docs contain no stale Google/guest launch contract
    Tool: bash
    Steps: rg -n "Google OAuth|Continue as guest|guest login|guest posting|SUPER_ADMIN_EMAILS|ADMIN_EMAILS" PLAN.md README.md README.ko.md AGENTS.md CONTRIBUTING.md .env.example
    Expected: matches are absent or only describe forbidden production behavior, development/test bypass, variable deprecation, or Google News RSS exception
    Evidence: .omo/evidence/task-2b-auth-doc-scan.txt

  Scenario: English and Korean summaries stay aligned
    Tool: manual review
    Steps: compare README.md and README.ko.md auth/safety paragraphs after edits
    Expected: both describe Kakao/Naver-only production participation and no public guest launch path
    Evidence: .omo/evidence/task-2b-readme-sync.txt
  ```

  **Commit**: YES | Message: `docs(auth): sync Kakao Naver launch policy` | Files: `PLAN.md`, `README.md`, `README.ko.md`, `AGENTS.md`, optional env/contribution docs

- [x] 3. Create Supabase Schema, RLS, Types, And Local Client Boundaries

  **What to do**: Add Supabase CLI config, migrations for every table in `PLAN.md`, enums, indexes, counter snapshots, audit logs, settings, RLS policies, storage buckets, seed data, generated TypeScript database types, and explicit policy fixtures for Kakao/Naver users, admins, super admins, anonymous public reads, and development/test guest bypass. Link to the existing Supabase project ID only through local config or instructions that avoid secrets.
  **Must NOT do**: Do not commit DB password, allowlist emails, API keys, or generated secret-bearing files.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 5-16 | Blocked By: 1, 2B

  **References**:
  - Pattern: `PLAN.md:354` - data model.
  - Pattern: `AGENTS.local.md` - Supabase project exists and secrets are in `.env`.
  - External: Context7 `/supabase/supabase`, `/supabase/cli`, `/supabase/ssr`.

  **Acceptance Criteria**:
  - [x] Supabase migrations create all planned tables and enum constraints.
  - [x] RLS policies cover Kakao/Naver authenticated users, development/test guest fixtures, admins, super admins, and anonymous public reads.
  - [x] Generated DB types compile with `pnpm typecheck`.
  - [x] Seed data includes affected stations and baseline settings without secrets.
  - [x] SQL tests or CLI checks prove production anonymous/guest identities cannot write voices, reports, or admin-only rows.
  - [x] SQL tests or CLI checks prove development/test guest fixtures work only when explicit non-production configuration is enabled.

  **QA Scenarios**:
  ```
  Scenario: RLS blocks production guest writes and admin access
    Tool: bash
    Steps: run SQL policy test as anonymous/guest role for voices, reports, admin_applications, and settings in launch-mode fixture
    Expected: write denied for participation paths and read/write denied for admin-only rows
    Evidence: .omo/evidence/task-3-rls-deny.txt

  Scenario: Development guest fixture is non-production only
    Tool: bash
    Steps: run SQL/API policy tests with dev/test guest flag enabled and then disabled
    Expected: fixture can exercise test writes only when non-production flag is enabled; launch-mode flag denies writes
    Evidence: .omo/evidence/task-3-dev-guest-policy.txt

  Scenario: Public visible content query works
    Tool: bash
    Steps: run SQL/API query for visible voices/news_items as anonymous role
    Expected: visible rows returned, hidden rows omitted
    Evidence: .omo/evidence/task-3-public-query.txt
  ```

  **Commit**: YES | Message: `feat(db): add Supabase schema and policies` | Files: `supabase/**`, `src/lib/supabase/**`, generated types

- [x] 4. Implement Copy System, Safety Constants, And Shared UI Contracts

  **What to do**: Add English UI label constants, bilingual `{ en, ko }` descriptive copy, safety policy constants, allowed SNS domains, Seoul congestion disclaimers, affected station disclaimer, nickname wordlist contract, and shared Zod schemas. Tests must assert exact critical wording.
  **Must NOT do**: Do not introduce full i18n complexity; do not let UI dock labels become Korean; do not claim election fraud as proven.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 5-9 | Blocked By: 1, 2B

  **References**:
  - Pattern: `PLAN.md:326` - English UI labels and bilingual explanations.
  - Pattern: `README.md`, `README.ko.md` - aligned public principles.
  - Pattern: `AGENTS.md` - civic copy conventions.
  - Skill: `$omo:frontend-ui-ux` - use when copy contracts affect visible UI labels, hierarchy, empty states, or component microcopy.

  **Acceptance Criteria**:
  - [x] `copy.ts` or equivalent contains English UI labels and bilingual explanatory copy.
  - [x] Tests assert dock labels exactly `Today`, `Rallies`, `Square`, `Live`, `News` after the Task 7A navigation revision.
  - [x] Tests assert no critical copy says organized election fraud is established fact.
  - [x] URL validation schema allows only approved SNS domains.

  **QA Scenarios**:
  ```
  Scenario: App dock uses English-only labels
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/app in the Codex in-app Browser; inspect bottom dock text
    Expected: exactly Today, Rallies, Square, Live, News
    Evidence: .omo/evidence/task-4-dock-labels.png

  Scenario: Disallowed SNS URL fails validation
    Tool: bash
    Steps: pnpm test -- copy-safety-url-validation
    Expected: malicious or unsupported domain rejected with safe error text
    Evidence: .omo/evidence/task-4-url-validation.txt
  ```

  **Commit**: YES | Message: `feat(copy): add safety and UI text contracts` | Files: `src/lib/copy/**`, `src/lib/validation/**`, tests

- [x] 5. Build Kakao/Naver Auth, Launch Gate, Role Bootstrap, And Nicknames

  **What to do**: Implement production auth around Kakao and Naver only. Use Supabase SSR clients, session cookies, built-in Kakao OAuth, and a Naver custom OAuth/OIDC bridge unless later official Supabase Naver support is verified from primary docs. Add a launch-mode gate that denies guest participation in production, plus a development/test guest bypass behind an explicit non-production env flag for multi-account QA. Generate immutable nicknames for linked users and dev/test guest fixtures. Bootstrap roles from env-only provider-qualified Kakao/Naver identity IDs or explicit super-admin approval, and demote users on login when those identifiers are removed.
  **Must NOT do**: Do not implement Google OAuth; do not render Google as a login choice; do not use email-only allowlists for admin/super-admin; do not copy allowlist values into source/tests; do not allow production guest login, posting, or reporting.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 10, 16 | Blocked By: 2B, 3, 4

  **References**:
  - Pattern: `PLAN.md`, `AGENTS.md` after Task 2B - Kakao/Naver-only production auth and development/test guest bypass policy.
  - Pattern: `PLAN.md:162` and `PLAN.md:307` - roles/auth/nickname rules.
  - Skill: `$omo:frontend-ui-ux` - use for auth entry UI, Kakao/Naver choice hierarchy, launch-gate states, and profile/status affordances.
  - External: Supabase docs - Kakao built-in OAuth provider; Naver planned as custom OAuth/OIDC if no official provider support is verified.

  **Acceptance Criteria**:
  - [x] In production/launch mode, `/` Enter leads to Kakao and Naver login choices only.
  - [x] Google OAuth option is absent from rendered UI, provider policy tests, and app auth configuration.
  - [x] Kakao/Naver linked user can enter `/app` and receives immutable nickname format Korean 6 syllables + 4 digits.
  - [x] Development/test guest bypass works only when explicit non-production flag is enabled and is rejected in production/launch mode.
  - [x] Kakao/Naver OAuth user can apply for admin.
  - [x] Provider-qualified Kakao/Naver identity allowlist promotes admin/super-admin and demotes on next login when removed.
  - [x] Email-only matches never promote admin/super-admin.

  **QA Scenarios**:
  ```
  Scenario: Production auth shows Kakao and Naver only
    Tool: Codex Browser/browser-use
    Steps: run dev server with launch-mode auth flag; open http://127.0.0.1:3000/; click Enter; inspect auth choices
    Expected: Kakao and Naver choices are visible; Google and Continue as guest are absent
    Evidence: .omo/evidence/task-5-auth-choices.png

  Scenario: Development guest bypass is blocked in launch mode
    Tool: bash
    Steps: pnpm test -- auth-launch-guest-policy
    Expected: dev/test guest fixture succeeds only with non-production flag and fails with launch-mode flag
    Evidence: .omo/evidence/task-5-guest-launch-policy.txt

  Scenario: Provider-qualified role bootstrap works
    Tool: bash
    Steps: pnpm test -- role-bootstrap-provider-ids
    Expected: Kakao/Naver provider ID fixtures promote/demote; email-only fixture never promotes
    Evidence: .omo/evidence/task-5-role-bootstrap.txt
  ```

  **Commit**: YES | Message: `feat(auth): add Kakao Naver launch gate` | Files: `src/app/**`, `src/lib/auth/**`, `src/lib/nickname/**`, tests

- [x] 6. Build Five-Tab App Shell, Home Dashboard, And Counters

  **What to do**: Implement `/app` shell with bottom dock, responsive layout, top profile toggle, Home dashboard, pinned participant/voice counters, highlight cards, cached polling, and regional congestion placeholder contract. After the Task 7A navigation revision, this dashboard moves to `/app/today` and `/app` becomes the Square entry surface.
  **Must NOT do**: Do not use realtime per-client sockets for public counters; do not label congestion as rally headcount.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 10, 13, 16 | Blocked By: 2B, 3, 4

  **References**:
  - Pattern: `PLAN.md:183` - five-tab information architecture.
  - Pattern: `PLAN.md:199` - original Home dashboard, superseded by Task 7A Today summary routing.
  - Pattern: `PLAN.md:123` - cache/polling strategy.
  - Skill: `$omo:frontend-ui-ux` - mandatory for dashboard composition, bottom dock ergonomics, responsive spacing, and visual polish.

  **Acceptance Criteria**:
  - [x] `/app` defaults to app entry with dock visible; Task 7A makes this entry Square and moves the dashboard to Today.
  - [ ] Participant and voice counters are visually pinned and poll cached snapshots.
  - [ ] Congestion label says regional real-time congestion and includes disclaimer.
  - [ ] Desktop dock spreads horizontally; mobile remains ergonomic.

  **QA Scenarios**:
  ```
  Scenario: Dashboard renders counters
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/app; inspect pinned counter bar and dock
    Expected: two counters visible and dock labels exact
    Evidence: .omo/evidence/task-6-home-dashboard.png

  Scenario: Counter endpoint uses cache headers
    Tool: curl
    Steps: curl -i http://127.0.0.1:3000/api/counters
    Expected: HTTP 200 with cache-control and participant/voice JSON fields
    Evidence: .omo/evidence/task-6-counters-api.txt
  ```

  **Commit**: YES | Message: `feat(app): add dashboard shell and counters` | Files: `src/app/(app)/**`, `src/components/app/**`, API routes, tests | Completed: `1c255b4`

- [x] 7. Build Square Voices, Reactions, Comments, Hot Sorting, And Sharing

  **What to do**: Implement Speak up composer, voices feed, comments, likes/dislikes, share actions, report entrypoint, latest sorting, 7d/1d/12h/1h hot sorting, view/share counters, and Instagram/Threads-style card layout.
  **Must NOT do**: Do not store nickname strings on voice/comment rows; render through `user_id` joins.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 13, 14, 16 | Blocked By: 2B, 3, 4

  **References**:
  - Pattern: `PLAN.md:216` - Square behavior and hot score.
  - Pattern: `PLAN.md:354` - normalized writer references.
  - Skill: `$omo:frontend-ui-ux` - mandatory for Instagram/Threads-style card rhythm, composer affordance, reaction icons, hover/focus states, and motion.

  **Acceptance Criteria**:
  - [ ] Kakao/Naver authenticated user can create visible voice within rate limits.
  - [ ] Production anonymous/guest identities cannot create voices.
  - [ ] Comments and reactions update counts.
  - [ ] Hot sorting formula uses share/comment/net reaction/view weights.
  - [ ] Period filters first constrain time window, then sort hot.
  - [ ] Tests prove nickname is resolved from user table, not copied into content rows.

  **QA Scenarios**:
  ```
  Scenario: Kakao/Naver user posts a voice
    Tool: Codex Browser/browser-use
    Steps: enter with Kakao/Naver auth fixture; click Square; fill Speak up with 'Your voice, on the record.'; submit
    Expected: new voice appears with nickname, counts update
    Evidence: .omo/evidence/task-7-square-post.png

  Scenario: Production guest write is rejected
    Tool: curl
    Steps: send POST /api/voices without a Kakao/Naver authenticated session in launch-mode fixture
    Expected: HTTP 401 or 403 with safe error body and no row inserted
    Evidence: .omo/evidence/task-7-guest-denied.txt

  Scenario: Hot sorting honors time window
    Tool: bash
    Steps: pnpm test -- hot-sorting-window
    Expected: old high-score voice excluded from 1h tab and included in 7d tab
    Evidence: .omo/evidence/task-7-hot-sorting.txt
  ```

  **Commit**: YES | Message: `feat(square): add voices and hot feed` | Files: `src/app/(app)/square/**`, `src/lib/voices/**`, tests

- [x] 7B. Add External URL Bookmark Previews To Square Voices

  **What to do**: Support Notion/Facebook/Discord-style bookmark/embed cards for the first public URL found in a Speak up body. While the user is drafting, detect the first URL, fetch safe metadata through a server route, and show whether it resolves into an embed preview before submission. In the feed, render the first resolved URL as a large-thumbnail card so an external Instagram/Threads/X/YouTube/community/article post can visually stand in for photo proof without ClearKorea hosting images.
  **Must NOT do**: Do not add a file upload button. Do not store or proxy user-uploaded image files through ClearKorea storage. Do not restrict supported public URLs by political leaning or community type; progressive, conservative, social, community, Instagram, Threads, X, YouTube, and other lawful public sources are acceptable when metadata can be fetched safely. Do not execute remote scripts or trust remote HTML beyond metadata extraction.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 13, 14, 16 | Blocked By: 7

  **References**:
  - Pattern: `src/components/app/speak-up-composer.tsx` - composer drafting and submit UX.
  - Pattern: `src/components/app/voice-card.tsx` - voice feed card rendering.
  - Pattern: `src/lib/validation/social-url.ts` - URL/domain validation constraints; extend without turning this into a partisan allowlist.
  - Skill: `$omo:frontend-ui-ux` - mandatory for large-thumbnail embed card hierarchy, loading/error states, and no-upload affordance clarity.

  **Acceptance Criteria**:
  - [x] Composer detects the first URL while drafting and shows whether an embed card can be resolved before submission.
  - [x] Metadata fetching happens server-side with safe timeout/size/content-type limits and no script execution.
  - [x] Voice cards render only the first resolved URL as a large-thumbnail bookmark/embed card with title, source, and outbound link.
  - [x] External thumbnail URLs are referenced as remote media; ClearKorea does not accept, store, proxy, or transform user-uploaded image files.
  - [x] No image/file upload UI is exposed for Square voice posting.
  - [x] Unsupported or blocked metadata fetches leave the original text/link usable without blocking the voice.

  **QA Scenarios**:
  ```
  Scenario: Composer previews first embeddable URL
    Tool: Codex Browser/browser-use
    Steps: paste a public SNS/community/article URL into Speak up while drafting
    Expected: a preview card appears before submit with title/source and a large thumbnail when metadata is available; no file upload button exists
    Evidence: .omo/evidence/task-7b-url-preview-composer.png

  Scenario: Voice renders external bookmark card
    Tool: Codex Browser/browser-use
    Steps: open Square feed containing a voice with multiple URLs
    Expected: only the first resolvable URL renders as a large-thumbnail embed/bookmark card and the original link opens externally
    Evidence: .omo/evidence/task-7b-url-preview-feed.png

  Scenario: Unsupported URL remains safe text
    Tool: curl + Codex Browser/browser-use
    Steps: preview a URL that times out, blocks metadata, or lacks image metadata
    Expected: no unsafe fetch output is rendered, no post is blocked solely because preview failed, and the link remains usable
    Evidence: .omo/evidence/task-7b-url-preview-fallback.txt
  ```

  **Commit**: YES | Message: `feat(square): add external URL previews` | Files: `src/app/api/**`, `src/components/app/**`, `src/lib/voices/**`, `src/lib/validation/**`, tests, plan

- [x] 7A. Convert Home Dashboard Into KST Today Summary

  **What to do**: Rename Home to Today in copy, dock tests, and app navigation. Keep Square as the practical home/feed at `/app`; redirect `/app/square` to `/app`; move the summary/dashboard route to `/app/today`. Scope all Today widgets to the current KST day (`00:00-23:59`): people who spoke up, voices, Seoul regional congestion, top voices, world press, and verified posts. Where cumulative context is useful, display `today/total` with the total smaller and softer, similar to older blog visit-counter patterns.
  **Must NOT do**: Do not perform hosted DNS, Vercel, Cloudflare, OAuth callback, or production domain mutations in this task. Do not label Seoul congestion as rally headcount. Do not remove cumulative counter availability; show it only as secondary context on Today.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 8, 9, 10, 13, 16 | Blocked By: 6, 7

  **References**:
  - Pattern: `src/components/app/app-dock.tsx` - dock label, route, icon, and active-state contract.
  - Pattern: `src/app/(app)/app/page.tsx` - Square should be the `/app` entry surface.
  - Pattern: `src/app/(app)/app/today/page.tsx` - Today summary placeholder route.
  - Pattern: `src/lib/counters/counters.ts` - extend counter snapshots to carry today and total counts.
  - Skill: `$omo:frontend-ui-ux` - mandatory for Today summary hierarchy, `today/total` typographic treatment, and small-viewport dock verification.

  **Acceptance Criteria**:
  - [ ] Dock labels are exactly `Today`, `Rallies`, `Square`, `Live`, `News`.
  - [ ] `/app` renders the Square feed/composer and marks Square active.
  - [ ] `/app/square` redirects to `/app`.
  - [ ] `/app/today` renders Today summary and marks Today active.
  - [ ] Today counters show KST-current-day counts first and cumulative totals as smaller secondary context.
  - [ ] Today highlights for Seoul congestion, top voices, world press, and verified posts are scoped to the KST day.
  - [ ] Domain setup remains documented/deferred until deployment approval; no hosted domain changes are made.

  **QA Scenarios**:
  ```
  Scenario: Square is the app home
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/app; inspect dock, composer, and active tab
    Expected: Square feed/composer is visible, Square dock item is active, Today links to /app/today
    Evidence: .omo/evidence/task-7a-square-home.png

  Scenario: Today shows KST-scoped summary
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/app/today; inspect counters and summary cards
    Expected: Today · KST heading, today/total counter treatment, congestion disclaimer, and today-scoped highlight copy
    Evidence: .omo/evidence/task-7a-today-summary.png

  Scenario: Legacy Square route redirects
    Tool: curl
    Steps: curl -i http://127.0.0.1:3000/app/square
    Expected: redirect response to /app
    Evidence: .omo/evidence/task-7a-square-redirect.txt
  ```

  **Commit**: YES | Message: `feat(app): make Square home and add Today summary` | Files: `src/app/(app)/app/**`, `src/components/app/**`, `src/lib/counters/**`, tests, plan

- [x] 8. Build Rallies, Seoul Congestion Proxy, Map, And Support Guide

  **What to do**: Implement rallies list/map, status, support guide, admin-managed rally data, Seoul place-code mapping, server proxy with 1-5 minute cache for Seoul real-time city data, and Seoul-only congestion disclaimer. Use admin/crowdsourced fallback for non-Seoul.
  **Must NOT do**: Do not expose Seoul API key client-side; do not display congestion as rally attendance.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 12, 16 | Blocked By: 2B, 3, 4

  **References**:
  - Pattern: `PLAN.md:206` - Rallies requirements.
  - Pattern: `PLAN.md:135` - Cloudflare/security posture.
  - Skill: `$omo:frontend-ui-ux` - mandatory for map/list/support-guide layout, congestion visual hierarchy, and disclaimer placement.

  **Acceptance Criteria**:
  - [x] `/app/rallies` lists ongoing/upcoming rallies with map markers.
  - [x] Support guide explains delivery/support actions safely.
  - [x] Seoul congestion API route caches and labels data correctly.
  - [x] Non-Seoul rallies render without failing when no API mapping exists.

  **QA Scenarios**:
  ```
  Scenario: Rally list and support guide render
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/app/rallies; inspect rally cards, map, support guide
    Expected: cards and guide visible; congestion disclaimer present
    Evidence: .omo/evidence/task-8-rallies.png

  Scenario: Missing Seoul mapping falls back safely
    Tool: curl
    Steps: curl -i http://127.0.0.1:3000/api/congestion?place=unknown
    Expected: HTTP 404 or safe empty response without secret leakage
    Evidence: .omo/evidence/task-8-congestion-fallback.txt
  ```

  **Commit**: YES | Message: `feat(rallies): add rally map and congestion proxy` | Files: `src/app/(app)/rallies/**`, API routes, tests

- [x] 9. Build Live Streams, News Tabs, Tips, And Feed Ingestion

  **What to do**: Implement Live YouTube grid/replays, News tabs All/Verified/Public/World press, verified badges, Report a post modal, SNS URL validation, admin tip queue integration, RSS/Google News ingestion Cron, keyword filtering, URL dedupe, thumbnail metadata parsing, and GitHub Action for existing feed checker.
  **Must NOT do**: Do not collect article bodies; do not add npm dependencies to `scripts/check-feeds.mjs`.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 12, 16 | Blocked By: 2B, 3, 4

  **References**:
  - Pattern: `PLAN.md:239` - Live.
  - Pattern: `PLAN.md:243` and `PLAN.md:273` - News and feeds.
  - Pattern: `config/feeds.json` - feed config.
  - Pattern: `scripts/check-feeds.mjs` - dependency-free liveness checker.
  - Skill: `$omo:frontend-ui-ux` - mandatory for stream grid, news tab density, verified badges, thumbnails, and report modal design.

  **Acceptance Criteria**:
  - [x] `/app/live` renders verified YouTube embeds and replay state.
  - [x] `/app/news` renders All/Verified/Public/World press tabs.
  - [x] Report modal accepts allowed SNS links and rejects disallowed domains.
  - [x] Feed ingestion stores filtered metadata only: title, source, URL, thumbnail, publish date, language.
  - [x] Weekly GitHub Action runs `node scripts/check-feeds.mjs config/feeds.json`.

  **QA Scenarios**:
  ```
  Scenario: News tabs and report modal work
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/app/news; click World press; open Report a post; submit allowed x.com fixture URL
    Expected: tip enters pending state and modal confirms review path
    Evidence: .omo/evidence/task-9-news-report.png

  Scenario: Feed checker still works dependency-free
    Tool: bash
    Steps: node scripts/check-feeds.mjs config/feeds.json
    Expected: exit 0, or pre-existing required dead feeds documented before code changes
    Evidence: .omo/evidence/task-9-feed-check.txt
  ```

  **Commit**: YES | Message: `feat(news): add live streams and feed ingestion` | Files: `src/app/(app)/live/**`, `src/app/(app)/news/**`, Cron/API routes, `.github/workflows/**`, tests

- [x] 10. Port Affected Stations Into `/app/stations`

  **What to do**: Extract station seed data from the prototype into typed data or DB seed, port the ballot-box SVG visual into reusable components, implement `/app/stations`, 가나다 sorting, severity filters, responsive 3/4/6-column grid, summary stats, updated date, Today/Rallies entry links, and daily agentic Cron update structure.
  **Must NOT do**: Do not leave data hard to migrate; do not omit disclaimer; do not state the list proves fraud.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 13, 14, 16 | Blocked By: 2B, 5, 6

  **References**:
  - Pattern: `prototypes/affected-stations/AffectedStations.jsx` - visual/data prototype.
  - Pattern: `PLAN.md:250` - affected polls requirements.
  - Pattern: `AGENTS.md` - keep `STATIONS`, `SUMMARY`, `UPDATED_AT` extractable.
  - Skill: `$omo:frontend-ui-ux` - mandatory for ballot-box SVG design, severity color system, responsive grid, and visual accessibility.

  **Acceptance Criteria**:
  - [x] Executor records `$omo:frontend-ui-ux` aesthetic direction before porting the SVG board.
  - [x] `/app/stations` renders station board using typed data.
  - [x] Filters for all/red/orange/yellow work.
  - [x] Stations sort by Korean locale.
  - [x] Disclaimer text is present and tested.
  - [x] Cron update route/job can generate a review draft without automatically publishing unverified changes.

  **QA Scenarios**:
  ```
  Scenario: Severity filter updates station grid
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/app/stations; click 투표 중단/red filter
    Expected: only red severity stations remain and summary/disclaimer stays visible
    Evidence: .omo/evidence/task-10-stations-filter.png

  Scenario: Disclaimer cannot be removed accidentally
    Tool: bash
    Steps: pnpm test -- affected-stations-disclaimer
    Expected: test fails if administrative-failure/not-fraud disclaimer is missing
    Evidence: .omo/evidence/task-10-disclaimer-test.txt
  ```

  **Commit**: YES | Message: `feat(stations): port affected polling board` | Files: `src/app/(app)/stations/**`, `src/data/**`, Cron/API routes, tests

- [x] 11. Build Admin Queues, Applications, Settings, And Audit Logs

  **What to do**: Implement `/admin` client-only noindex route with role gating, tip approval/rejection, admin application approval/rejection/demotion, moderation queues, super-admin-only auto-hide settings, audit log writes, and profile menu entry points. Admin identity checks must use roles produced by the Kakao/Naver provider-ID bootstrap or explicit super-admin approvals from Task 5.
  **Must NOT do**: Do not expose admin UI to guests/users; do not let regular admins change auto-hide thresholds.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 13, 14, 16 | Blocked By: 2B, 3, 5

  **References**:
  - Pattern: `PLAN.md:297` - admin applications.
  - Pattern: `PLAN.md:258` - moderation queue split.
  - Pattern: `PLAN.md`, `AGENTS.md` after Task 2B - provider-qualified Kakao/Naver admin identity policy.
  - Skill: `$omo:frontend-ui-ux` - use for dense utilitarian admin UI, queue scanning, form hierarchy, and destructive-action clarity.

  **Acceptance Criteria**:
  - [x] `/admin` has noindex metadata and denies non-admin users.
  - [x] Super admin can approve/demote admins and adjust moderation settings.
  - [x] Regular admin can process tips and moderation queues but cannot change super settings.
  - [x] Every approval/rejection/demotion/settings change writes `audit_logs`.

  **QA Scenarios**:
  ```
  Scenario: Super admin changes moderation threshold
    Tool: Codex Browser/browser-use
    Steps: login with super-admin fixture; open http://127.0.0.1:3000/admin; update threshold; save
    Expected: setting changes and audit log row appears
    Evidence: .omo/evidence/task-11-super-settings.png

  Scenario: Regular admin cannot see super settings
    Tool: Codex Browser/browser-use
    Steps: login with admin fixture; open http://127.0.0.1:3000/admin
    Expected: settings panel hidden or disabled; direct mutation denied
    Evidence: .omo/evidence/task-11-admin-denied.png
  ```

  **Commit**: YES | Message: `feat(admin): add queues and role-gated settings` | Files: `src/app/(admin)/**`, `src/lib/admin/**`, tests

- [x] 12. Add Edge Caching, Rate Limits, Turnstile, And Abuse Guardrails

  **What to do**: Implement app-level rate limits for authenticated Kakao/Naver writing/reporting, immediate launch-mode rejection for anonymous/guest production writes, optional development/test guest limits behind the same non-production flag as Task 5, Turnstile challenge on suspicious write paths, cache headers/ISR for public read-heavy endpoints, Cloudflare deployment checklist, WAF/bot rules checklist, and no-Redis baseline documentation.
  **Must NOT do**: Do not add Redis; do not leak IP/device identifiers into public UI.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 16 | Blocked By: 2B, 5, 8, 9

  **References**:
  - Pattern: `PLAN.md:123` - read-cache strategy.
  - Pattern: `PLAN.md:135` - Cloudflare security.
  - Pattern: `AGENTS.md` - no Redis baseline.

  **Acceptance Criteria**:
  - [x] Public read endpoints use cache headers or ISR as appropriate.
  - [x] Production anonymous/guest write/report endpoints are rejected before rate-limit accounting.
  - [x] Authenticated Kakao/Naver write/report endpoints enforce rate limits.
  - [x] Development/test guest write/report limits work only when non-production guest bypass is enabled.
  - [x] Suspicious write flow requires Turnstile.
  - [x] Cloudflare setup checklist covers DNS/proxy/WAF/DDoS/bot/rate-limit settings.

  **QA Scenarios**:
  ```
  Scenario: Production guest write is rejected before rate limit
    Tool: curl
    Steps: send POST /api/voices without Kakao/Naver session in launch-mode fixture
    Expected: HTTP 401 or 403 with safe body and no rate-limit bucket increment
    Evidence: .omo/evidence/task-12-guest-reject.txt

  Scenario: Authenticated write rate limit triggers
    Tool: curl
    Steps: send repeated Kakao/Naver-authenticated POST /api/voices fixture requests beyond configured threshold
    Expected: final response HTTP 429 with safe error body
    Evidence: .omo/evidence/task-12-rate-limit.txt

  Scenario: Read endpoint cache headers present
    Tool: curl
    Steps: curl -i http://127.0.0.1:3000/api/news/world
    Expected: HTTP 200 with cache-control header
    Evidence: .omo/evidence/task-12-cache-headers.txt
  ```

  **Commit**: YES | Message: `feat(security): add rate limits and cache guardrails` | Files: middleware/API routes, docs/checklists, tests

- [x] 13. Add Moderation AI, Human Review, And Operational Agents

  **What to do**: Implement hot-entry one-time AI moderation with `ai_checked`, soft-hide, popular review queue, report/dislike queue, trust scoring, appeal path, OpenAI key usage from env, station/rally/news/tip triage draft agents, anomaly detection hooks, and kill-switch/threshold settings through PostHog or DB settings as planned.
  **Must NOT do**: Do not run AI on every post by default; do not make AI final authority for ambiguous cases; do not print OpenAI key.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 16 | Blocked By: 6, 7, 10, 11

  **References**:
  - Pattern: `PLAN.md:109` - AI-native operations.
  - Pattern: `PLAN.md:258` - moderation rules.
  - Pattern: `AGENTS.local.md` - OpenAI key exists in `.env`.

  **Acceptance Criteria**:
  - [x] Voice entering hot feed triggers one AI moderation call only when `ai_checked=false`.
  - [x] Weak violations soft-hide and enter popular review queue.
  - [x] Admin can restore or permanently hide.
  - [x] AI agent Cron jobs create drafts/recommendations, not unreviewed destructive changes.
  - [x] Tests prove `ai_checked=true` prevents duplicate calls.

  **QA Scenarios**:
  ```
  Scenario: Hot voice AI check runs once
    Tool: bash
    Steps: pnpm test -- moderation-ai-once
    Expected: first hot entry calls AI mock once; second entry does not
    Evidence: .omo/evidence/task-13-ai-once.txt

  Scenario: Soft-hidden item appears in admin review
    Tool: Codex Browser/browser-use
    Steps: create fixture weak-violation hot voice; login admin; open popular review queue
    Expected: item visible with Restore and Permanent hide actions
    Evidence: .omo/evidence/task-13-review-queue.png
  ```

  **Commit**: YES | Message: `feat(moderation): add AI-assisted review queues` | Files: moderation routes/jobs/admin UI/tests

- [x] 14. Wire PostHog, Feature Flags, Error Tracking, Replay Masking, And Uptime

  **What to do**: Create PostHog project externally during execution, add SDK, analytics events, feature flags for hot-score weights/moderation thresholds/kill switches, error tracking, session replay with input/body masking, survey hooks if needed, uptime monitor checklist, and spend cap checklist for Vercel/Supabase.
  **Must NOT do**: Do not add Sentry; do not replay sensitive body text or PII.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 16 | Blocked By: 7, 10, 11

  **References**:
  - Pattern: `PLAN.md:94` - PostHog baseline.
  - Pattern: `AGENTS.local.md` - PostHog project not created yet.
  - Skill: `$omo:frontend-ui-ux` - use when replay masking, error states, flag-controlled variants, or survey surfaces affect UI.

  **Acceptance Criteria**:
  - [x] PostHog provider loads only with configured public key/host.
  - [x] Session replay masks inputs and voice body text.
  - [x] Error tracking captures client/server errors through PostHog path.
  - [x] Feature flags can adjust hot-score weights and moderation thresholds.
  - [x] No Sentry package exists in `package.json`.

  **QA Scenarios**:
  ```
  Scenario: Replay masking protects voice input
    Tool: Codex Browser/browser-use
    Steps: type fixture sensitive text into Speak up; inspect PostHog masking config or test hook
    Expected: text is masked/not captured
    Evidence: .omo/evidence/task-14-replay-masking.txt

  Scenario: Feature flag changes hot weight
    Tool: bash
    Steps: pnpm test -- posthog-hot-weight-flag
    Expected: mocked flag changes ranking weight deterministically
    Evidence: .omo/evidence/task-14-feature-flag.txt
  ```

  **Commit**: YES | Message: `feat(observability): add PostHog flags and masking` | Files: `src/lib/posthog/**`, providers, tests, ops docs

- [x] 15. Configure Deployment, External Projects, CI, And Environment Hygiene

  **What to do**: Add Vercel project setup instructions/config, Cloudflare zone/DNS/WAF checklist, Supabase linked project instructions, env var templates without values, GitHub Actions for lint/typecheck/test/build/feed check, Codex Browser/browser-use manual QA instructions, deployment protection/noindex checks, spend caps, and AGPL/license metadata in package/footer.
  **Must NOT do**: Do not create or commit `.env`; do not commit Vercel/Supabase tokens.

  **Parallelization**: Can Parallel: YES | Wave 5 | Blocks: 16 | Blocked By: 2B

  **References**:
  - Pattern: `AGENTS.local.md` - external project creation status.
  - Pattern: `PLAN.md:123` and `PLAN.md:145` - infra/cost rules.
  - Pattern: `CONTRIBUTING.md` - security and checks.

  **Acceptance Criteria**:
  - [x] `.env.example` lists variable names only, including `SUPER_ADMIN_PROVIDER_IDS` and `ADMIN_PROVIDER_IDS` or the final names chosen in Task 2B.
  - [x] CI runs lint, typecheck, unit tests, build, and feed check; browser QA remains Codex Browser/browser-use runbook evidence.
  - [x] Package metadata/license is `AGPL-3.0-only`.
  - [x] Deployment docs include Vercel, Cloudflare, Supabase, PostHog, Turnstile, uptime, and spend caps.

  **QA Scenarios**:
  ```
  Scenario: Secret scan finds no tracked secrets
    Tool: bash
    Steps: git grep -nE '(password|api[_-]?key|SUPER_ADMIN_EMAILS|ADMIN_EMAILS|SUPER_ADMIN_PROVIDER_IDS|ADMIN_PROVIDER_IDS)' -- ':!AGENTS.local.md' ':!.omo/**'
    Expected: no secret values; legacy email allowlist names appear only in deprecation/forbidden-policy context and provider-ID names appear only as safe variable names
    Evidence: .omo/evidence/task-15-secret-scan.txt

  Scenario: CI command set runs locally
    Tool: bash
    Steps: pnpm lint && pnpm typecheck && pnpm test && pnpm build && node scripts/check-feeds.mjs config/feeds.json
    Expected: all commands exit 0 or documented pre-existing feed outage only
    Evidence: .omo/evidence/task-15-ci-local.txt
  ```

  **Commit**: YES | Message: `ci(deploy): add deployment checks and env hygiene` | Files: `.github/workflows/**`, deployment docs, `.env.example`, package metadata

- [ ] 16. Full-Surface Verification, Accessibility, Performance, And Release Readiness

  **What to do**: Run full test/build suite, Codex Browser/browser-use QA across mobile/desktop viewports, accessibility checks, nonblank screenshot checks, route/SEO checks, RLS regression checks, feed liveness, manual QA transcript, git diff review, and final commit-message review. Fix all failures with TDD before declaring complete.
  **Must NOT do**: Do not mark done from tests alone; do not leave QA processes, browser contexts, or ports running.

  **Parallelization**: Can Parallel: NO | Wave 6 | Blocks: final | Blocked By: all prior tasks

  **References**:
  - Pattern: all prior task evidence.
  - Pattern: `AGENTS.md` and `CONTRIBUTING.md` - final checks and safety/security rules.
  - Skill: `$omo:frontend-ui-ux` - mandatory for final visual QA review across frontend, SVG, graphics, spacing, typography, motion, and responsive screenshots.

  **Acceptance Criteria**:
  - [ ] All automated checks exit 0.
  - [ ] Codex Browser/browser-use QA covers `/`, `/app`, `/app/rallies`, `/app/square`, `/app/live`, `/app/news`, `/app/stations`, `/admin`, `/robots.txt`, `/sitemap.xml`.
  - [ ] Launch-mode browser QA proves Kakao/Naver are the only production login choices.
  - [ ] Launch-mode API QA proves anonymous/guest posting/reporting is rejected.
  - [ ] Static/diff scan proves Google OAuth is absent while Google News RSS/feed ingestion remains intact.
  - [ ] Mobile and desktop screenshots show no overlapping text or broken layout.
  - [ ] Accessibility checks pass for core routes.
  - [ ] Secret scan is clean.
  - [ ] Commit messages follow policy and include plan footer where required.

  **QA Scenarios**:
  ```
  Scenario: Full browser smoke through app surface
    Tool: Codex Browser/browser-use
    Steps: drive the local dev server through the listed routes in the Codex in-app Browser and capture route screenshots/action log
    Expected: all route assertions pass; screenshots nonblank and layout-safe
    Evidence: .omo/evidence/task-16-full-browser-report.html

  Scenario: Launch auth policy regression
    Tool: Codex Browser/browser-use + curl
    Steps: inspect auth choices from `/` Enter, then POST unauthenticated fixture writes to voices/reports
    Expected: Kakao/Naver only in UI, no Google/guest launch choices, and unauthenticated writes rejected
    Evidence: .omo/evidence/task-16-launch-auth-policy.txt

  Scenario: Final cleanup receipt
    Tool: PowerShell + Git Bash
    Steps: powershell -NoProfile -Command "Get-Process node,pnpm -ErrorAction SilentlyContinue | Select-Object Id,ProcessName,Path"; netstat -ano | findstr ":3000"; git status --short
    Expected: no unintended dev server left running on the QA port and only intended changes
    Evidence: .omo/evidence/task-16-cleanup.txt
  ```

  **Commit**: YES | Message: `chore(release): verify ClearKorea v1 build` | Files: final fixes/evidence docs as needed

## Final Verification Wave (MANDATORY - after ALL implementation tasks)
> ALL must APPROVE. Present consolidated results to user and get explicit okay before completing implementation.
- [ ] F1. Plan Compliance Audit: compare implementation diff against every `PLAN.md` v1 item and this plan's TODOs.
- [ ] F2. Code Quality Review: run LSP/typecheck/lint and inspect changed files for over-broad abstractions, duplicated policies, secret leakage, and unsafe civic wording.
- [ ] F3. Real Manual QA: drive the real local web surface with Codex Browser/browser-use and capture screenshots/action logs.
- [ ] F4. Scope Fidelity Check: verify no v1 item was silently deferred and no forbidden baseline technology was added.

## Commit Strategy
- Default: stage and draft commits; do not run `git commit` until the user explicitly approves execution-time commits.
- Use one logical change per commit.
- Subject format: `<type>(<scope>): <imperative>`.
- Allowed primary types: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, `perf`.
- Subject should be concise and imperative, for example `feat(auth): add Kakao Naver launch gate`.
- Non-trivial commits require a body. Do not use one-line-only commit messages for implementation commits.
- Body style:
  - Use `- ` bullets, one bullet per line.
  - Keep each bullet focused on user-visible behavior, test coverage, or operational impact.
  - Avoid wrapping a single bullet across multiple visual lines unless unavoidable.
  - Mention safety/security impact when relevant.
  - End plan-driven commits with `Plan: .omo/plans/clearkorea-scaffold-build.md`.
- Example:

```text
feat(auth): add Kakao Naver launch gate

- Add Kakao and Naver production auth entry points with immutable generated nicknames.
- Block production guest participation while retaining an explicit development/test bypass.
- Bootstrap admin roles from provider-qualified Kakao/Naver identities and prove Google OAuth stays absent.

Plan: .omo/plans/clearkorea-scaffold-build.md
```

## Success Criteria
- All root Markdown guidance has been honored.
- Full v1 scope in `PLAN.md` is represented in implementation tasks.
- Every task has references, acceptance criteria, QA scenarios, and commit guidance.
- Scaffolding starts from the current baseline and preserves existing public/config/prototypes/scripts.
- Conventional Commit policy is explicit and rejects one-line-only non-trivial implementation commits.
- Verification requires automated RED->GREEN proof and real Windows-compatible browser/HTTP/PowerShell surface evidence.
- Production auth policy is internally consistent: Kakao/Naver only, no Google OAuth, no public guest participation, and Google News RSS preserved.
- Secrets remain local-only and are never copied into source, docs, commits, or evidence.

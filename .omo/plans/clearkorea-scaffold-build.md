# ClearKorea Scaffold And Build Plan

## TL;DR
> **Summary**: Scaffold the full ClearKorea v1 app from the current planning/prototype baseline into a production-ready Next.js App Router application, preserving the civic safety constraints and implementing the entire v1 scope in one initial build.
> **Deliverables**: Next.js/React/Tailwind scaffold, Supabase schema/RLS/auth, five-tab app, admin workflows, feeds/Cron, moderation agents, observability, deployment readiness, and readable Conventional Commit rules.
> **Effort**: XL
> **Parallel**: YES - 5 waves
> **Critical Path**: Task 1 -> Task 2 -> Task 3 -> Task 4 -> Tasks 5-15 -> Task 16

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

## Work Objectives
### Core Objective
Build the complete ClearKorea v1 web application from the current prototype baseline without deferring documented v1 scope.

### Deliverables
- Production Next.js 16.2 line scaffold with React 19, TypeScript, Tailwind, pnpm, `src/`, App Router route groups, shadcn/ui, and strict lint/test tooling.
- Supabase migrations, RLS, type generation, auth/session helpers, guest identity, OAuth flow support, admin role bootstrap, and audit logs.
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
- No secrets, admin allowlist emails, API keys, DB passwords, or deployment tokens appear in tracked files or commit messages.

### Must Have
- Preserve v1 as one initial scope.
- Use route groups `(marketing)`, `(app)`, `(admin)`.
- Use bottom dock labels exactly: `Home`, `Rallies`, `Square`, `Live`, `News`.
- Keep public copy aligned in English/Korean when public claims change.
- Keep civic wording around investigation, recurrence prevention, election transparency, and fair re-vote.
- Label Seoul data as regional real-time congestion, not rally headcount.
- Preserve affected polling station disclaimer that the list summarizes administrative failures and does not prove election fraud.
- Keep feed checker dependency-free.
- Use PostHog as default analytics/error-tracking path.
- Use `$omo:frontend-ui-ux` explicitly before frontend UI, SVG image, raster image, visual design, layout, motion, or graphic polish work.
- For design work, require a written aesthetic direction before implementation: purpose, tone, constraints, and the one memorable differentiator.

### Must NOT Have
- No source or docs containing secret values or allowlist email values.
- No Sentry baseline.
- No Redis or separate in-memory cache baseline.
- No `assets/pwa-icon.ico`.
- No source claim that organized election fraud is established fact.
- No doxxing, individual tracking, unlawful organizing, or private retaliation workflows.
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
Wave 2: Tasks 2, 3, 4
Wave 3: Tasks 5, 6, 7, 8, 9
Wave 4: Tasks 10, 11, 12, 13, 14, 15
Wave 5: Task 16

### Dependency Matrix
| Task | Blocks | Blocked By |
| --- | --- | --- |
| 1 | 2, 3, 4 | none |
| 2 | 5, 6, 7, 8, 9, 10, 11, 12 | 1 |
| 3 | 5, 6, 7, 8, 9, 10, 11, 12 | 1 |
| 4 | 5, 6, 7, 8, 9 | 1 |
| 5 | 10, 16 | 2, 3, 4 |
| 6 | 10, 13, 16 | 2, 3, 4 |
| 7 | 13, 14, 16 | 2, 3, 4 |
| 8 | 12, 16 | 2, 3, 4 |
| 9 | 12, 16 | 2, 3, 4 |
| 10 | 13, 14, 16 | 2, 5, 6 |
| 11 | 13, 14, 16 | 2, 3 |
| 12 | 16 | 2, 8, 9 |
| 13 | 16 | 6, 7, 10, 11 |
| 14 | 16 | 7, 10, 11 |
| 15 | 16 | 2 |
| 16 | final | all prior tasks |

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task has references, acceptance criteria, QA scenarios, and commit guidance.

- [x] 1. Scaffold Next.js Workspace, Tooling, And Commit Policy

  **What to do**: Initialize the app scaffold in-place using pnpm and the Next.js 16.2 patch line with App Router, TypeScript, Tailwind, ESLint, `src/`, and import alias. Add Vitest, Testing Library, lint/typecheck/build scripts, `commitlint` or an equivalent commit-msg check, and a `CONVENTIONAL_COMMITS.md` or contribution section describing readable multi-line Conventional Commit messages. Preserve existing docs/assets/config/prototypes/scripts. Do not move prototype files into `src/` yet.
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

- [ ] 2. Establish App Architecture, Design Tokens, Assets, And SEO Shell

  **What to do**: Build root layout, route groups, metadata, `robots.ts`, `sitemap.ts`, app providers, design tokens, responsive shell, footer GitHub link, PWA manifest, favicon/icon references, OG metadata, and asset references. Landing text must render as HTML, not baked into raster images.
  **Must NOT do**: Do not make a marketing-only placeholder app; do not overuse raster where SVG/HTML/CSS works; do not change public claims without aligning English/Korean copy.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 5-12 | Blocked By: 1

  **References**:
  - Pattern: `IMAGE.md` - SVG-first brand and raster asset uses.
  - Pattern: `PLAN.md:35` - brand colors and asset names.
  - Pattern: `PLAN.md:336` - responsive layout and GitHub footer.
  - Skill: `$omo:frontend-ui-ux` - mandatory for aesthetic direction, typography, spacing, motion, SVG-first brand treatment, and screenshot-based visual QA.
  - External: Context7 `/vercel/next.js/v16.2.2` - Metadata API, `robots.ts`, `sitemap.ts`.

  **Acceptance Criteria**:
  - [ ] Before implementation, executor records a `$omo:frontend-ui-ux` aesthetic direction covering purpose, tone, constraints, and one memorable differentiator.
  - [ ] `/` has SEO metadata, OG image, `hreflang` en/ko, Organization JSON-LD, and an Enter CTA.
  - [ ] `/robots.txt` allows landing/public routes and disallows `/app` and `/admin`.
  - [ ] `/sitemap.xml` includes public landing routes only.
  - [ ] PWA manifest uses name `ClearKorea`, theme/background `#0A0A0A`, and `assets/pwa-icon.png`.
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

- [ ] 3. Create Supabase Schema, RLS, Types, And Local Client Boundaries

  **What to do**: Add Supabase CLI config, migrations for every table in `PLAN.md`, enums, indexes, counter snapshots, audit logs, settings, RLS policies, storage buckets, seed data, and generated TypeScript database types. Link to the existing Supabase project ID only through local config or instructions that avoid secrets.
  **Must NOT do**: Do not commit DB password, allowlist emails, API keys, or generated secret-bearing files.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 5-16 | Blocked By: 1

  **References**:
  - Pattern: `PLAN.md:354` - data model.
  - Pattern: `AGENTS.local.md` - Supabase project exists and secrets are in `.env`.
  - External: Context7 `/supabase/supabase`, `/supabase/cli`, `/supabase/ssr`.

  **Acceptance Criteria**:
  - [ ] Supabase migrations create all planned tables and enum constraints.
  - [ ] RLS policies cover guests, users, admins, and super admins.
  - [ ] Generated DB types compile with `pnpm typecheck`.
  - [ ] Seed data includes affected stations and baseline settings without secrets.
  - [ ] SQL tests or CLI checks prove guests cannot access admin-only rows.

  **QA Scenarios**:
  ```
  Scenario: RLS blocks guest admin access
    Tool: bash
    Steps: run SQL policy test as anonymous/guest role for admin_applications/settings
    Expected: read/write denied for admin-only rows
    Evidence: .omo/evidence/task-3-rls-deny.txt

  Scenario: Public visible content query works
    Tool: bash
    Steps: run SQL/API query for visible voices/news_items as anonymous role
    Expected: visible rows returned, hidden rows omitted
    Evidence: .omo/evidence/task-3-public-query.txt
  ```

  **Commit**: YES | Message: `feat(db): add Supabase schema and policies` | Files: `supabase/**`, `src/lib/supabase/**`, generated types

- [ ] 4. Implement Copy System, Safety Constants, And Shared UI Contracts

  **What to do**: Add English UI label constants, bilingual `{ en, ko }` descriptive copy, safety policy constants, allowed SNS domains, Seoul congestion disclaimers, affected station disclaimer, nickname wordlist contract, and shared Zod schemas. Tests must assert exact critical wording.
  **Must NOT do**: Do not introduce full i18n complexity; do not let UI dock labels become Korean; do not claim election fraud as proven.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 5-10 | Blocked By: 1

  **References**:
  - Pattern: `PLAN.md:326` - English UI labels and bilingual explanations.
  - Pattern: `README.md`, `README.ko.md` - aligned public principles.
  - Pattern: `AGENTS.md` - civic copy conventions.
  - Skill: `$omo:frontend-ui-ux` - use when copy contracts affect visible UI labels, hierarchy, empty states, or component microcopy.

  **Acceptance Criteria**:
  - [ ] `copy.ts` or equivalent contains English UI labels and bilingual explanatory copy.
  - [ ] Tests assert dock labels exactly `Home`, `Rallies`, `Square`, `Live`, `News`.
  - [ ] Tests assert no critical copy says organized election fraud is established fact.
  - [ ] URL validation schema allows only approved SNS domains.

  **QA Scenarios**:
  ```
  Scenario: App dock uses English-only labels
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/app in the Codex in-app Browser; inspect bottom dock text
    Expected: exactly Home, Rallies, Square, Live, News
    Evidence: .omo/evidence/task-4-dock-labels.png

  Scenario: Disallowed SNS URL fails validation
    Tool: bash
    Steps: pnpm test -- copy-safety-url-validation
    Expected: malicious or unsupported domain rejected with safe error text
    Evidence: .omo/evidence/task-4-url-validation.txt
  ```

  **Commit**: YES | Message: `feat(copy): add safety and UI text contracts` | Files: `src/lib/copy/**`, `src/lib/validation/**`, tests

- [ ] 5. Build Auth, Guest Identity, Role Bootstrap, And Nicknames

  **What to do**: Implement guest entry, immutable nickname generation, OAuth entry points for Google/Kakao, Naver bridge route planning/implementation, Supabase SSR clients, session cookies, role bootstrap from env allowlists, and login-time demotion. Google admin bootstrap must require `email_verified === true`; Kakao/Naver must never grant admin via email.
  **Must NOT do**: Do not copy allowlist values into source/tests; use test env fixture values only.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 10, 16 | Blocked By: 2, 3, 4

  **References**:
  - Pattern: `AGENTS.local.md` - role bootstrap rules.
  - Pattern: `PLAN.md:162` and `PLAN.md:307` - roles/auth/nickname rules.
  - Skill: `$omo:frontend-ui-ux` - use for auth entry UI, guest/login choice hierarchy, and profile/status affordances.

  **Acceptance Criteria**:
  - [ ] Guest can enter `/app` without signup and receives immutable nickname format Korean 6 syllables + 4 digits.
  - [ ] OAuth user can apply for admin.
  - [ ] Verified Google allowlist user becomes admin/super; unverified Google and Kakao/Naver do not.
  - [ ] Removing allowlist fixture demotes on next login.

  **QA Scenarios**:
  ```
  Scenario: Guest enters app and gets nickname
    Tool: Codex Browser/browser-use
    Steps: open http://127.0.0.1:3000/; click Enter; choose Continue as guest; inspect profile label
    Expected: /app loads and nickname matches curated Korean words plus 4 digits
    Evidence: .omo/evidence/task-5-guest-entry.png

  Scenario: Non-Google email cannot bootstrap admin
    Tool: bash
    Steps: pnpm test -- role-bootstrap-provider-restrictions
    Expected: Kakao/Naver fixture remains user even if email matches fixture allowlist
    Evidence: .omo/evidence/task-5-role-bootstrap.txt
  ```

  **Commit**: YES | Message: `feat(auth): add guest and role bootstrap flows` | Files: `src/app/**`, `src/lib/auth/**`, `src/lib/nickname/**`, tests

- [ ] 6. Build Five-Tab App Shell, Home Dashboard, And Counters

  **What to do**: Implement `/app` shell with bottom dock, responsive layout, top profile toggle, Home dashboard, pinned participant/voice counters, highlight cards, cached polling, and regional congestion placeholder contract.
  **Must NOT do**: Do not use realtime per-client sockets for public counters; do not label congestion as rally headcount.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 10, 13, 16 | Blocked By: 2, 3, 4

  **References**:
  - Pattern: `PLAN.md:183` - five-tab information architecture.
  - Pattern: `PLAN.md:199` - Home dashboard.
  - Pattern: `PLAN.md:123` - cache/polling strategy.
  - Skill: `$omo:frontend-ui-ux` - mandatory for dashboard composition, bottom dock ergonomics, responsive spacing, and visual polish.

  **Acceptance Criteria**:
  - [ ] `/app` defaults to Home or app entry with dock visible.
  - [ ] Participant and voice counters are visually pinned and poll cached snapshots.
  - [ ] Congestion label says regional real-time congestion and includes disclaimer.
  - [ ] Desktop dock spreads horizontally; mobile remains ergonomic.

  **QA Scenarios**:
  ```
  Scenario: Home dashboard renders counters
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

  **Commit**: YES | Message: `feat(app): add dashboard shell and counters` | Files: `src/app/(app)/**`, `src/components/app/**`, API routes, tests

- [ ] 7. Build Square Voices, Reactions, Comments, Hot Sorting, And Sharing

  **What to do**: Implement Speak up composer, voices feed, comments, likes/dislikes, share actions, report entrypoint, latest sorting, 7d/1d/12h/1h hot sorting, view/share counters, and Instagram/Threads-style card layout.
  **Must NOT do**: Do not store nickname strings on voice/comment rows; render through `user_id` joins.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 13, 14, 16 | Blocked By: 2, 3, 4

  **References**:
  - Pattern: `PLAN.md:216` - Square behavior and hot score.
  - Pattern: `PLAN.md:354` - normalized writer references.
  - Skill: `$omo:frontend-ui-ux` - mandatory for Instagram/Threads-style card rhythm, composer affordance, reaction icons, hover/focus states, and motion.

  **Acceptance Criteria**:
  - [ ] Guest and user can create visible voice within rate limits.
  - [ ] Comments and reactions update counts.
  - [ ] Hot sorting formula uses share/comment/net reaction/view weights.
  - [ ] Period filters first constrain time window, then sort hot.
  - [ ] Tests prove nickname is resolved from user table, not copied into content rows.

  **QA Scenarios**:
  ```
  Scenario: Guest posts a voice
    Tool: Codex Browser/browser-use
    Steps: enter as guest; click Square; fill Speak up with 'Your voice, on the record.'; submit
    Expected: new voice appears with nickname, counts update
    Evidence: .omo/evidence/task-7-square-post.png

  Scenario: Hot sorting honors time window
    Tool: bash
    Steps: pnpm test -- hot-sorting-window
    Expected: old high-score voice excluded from 1h tab and included in 7d tab
    Evidence: .omo/evidence/task-7-hot-sorting.txt
  ```

  **Commit**: YES | Message: `feat(square): add voices and hot feed` | Files: `src/app/(app)/square/**`, `src/lib/voices/**`, tests

- [ ] 8. Build Rallies, Seoul Congestion Proxy, Map, And Support Guide

  **What to do**: Implement rallies list/map, status, support guide, admin-managed rally data, Seoul place-code mapping, server proxy with 1-5 minute cache for Seoul real-time city data, and Seoul-only congestion disclaimer. Use admin/crowdsourced fallback for non-Seoul.
  **Must NOT do**: Do not expose Seoul API key client-side; do not display congestion as rally attendance.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 12, 16 | Blocked By: 2, 3, 4

  **References**:
  - Pattern: `PLAN.md:206` - Rallies requirements.
  - Pattern: `PLAN.md:135` - Cloudflare/security posture.
  - Skill: `$omo:frontend-ui-ux` - mandatory for map/list/support-guide layout, congestion visual hierarchy, and disclaimer placement.

  **Acceptance Criteria**:
  - [ ] `/app/rallies` lists ongoing/upcoming rallies with map markers.
  - [ ] Support guide explains delivery/support actions safely.
  - [ ] Seoul congestion API route caches and labels data correctly.
  - [ ] Non-Seoul rallies render without failing when no API mapping exists.

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

- [ ] 9. Build Live Streams, News Tabs, Tips, And Feed Ingestion

  **What to do**: Implement Live YouTube grid/replays, News tabs All/Verified/Public/World press, verified badges, Report a post modal, SNS URL validation, admin tip queue integration, RSS/Google News ingestion Cron, keyword filtering, URL dedupe, thumbnail metadata parsing, and GitHub Action for existing feed checker.
  **Must NOT do**: Do not collect article bodies; do not add npm dependencies to `scripts/check-feeds.mjs`.

  **Parallelization**: Can Parallel: YES | Wave 3 | Blocks: 12, 16 | Blocked By: 2, 3, 4

  **References**:
  - Pattern: `PLAN.md:239` - Live.
  - Pattern: `PLAN.md:243` and `PLAN.md:273` - News and feeds.
  - Pattern: `config/feeds.json` - feed config.
  - Pattern: `scripts/check-feeds.mjs` - dependency-free liveness checker.
  - Skill: `$omo:frontend-ui-ux` - mandatory for stream grid, news tab density, verified badges, thumbnails, and report modal design.

  **Acceptance Criteria**:
  - [ ] `/app/live` renders verified YouTube embeds and replay state.
  - [ ] `/app/news` renders All/Verified/Public/World press tabs.
  - [ ] Report modal accepts allowed SNS links and rejects disallowed domains.
  - [ ] Feed ingestion stores filtered metadata only: title, source, URL, thumbnail, publish date, language.
  - [ ] Weekly GitHub Action runs `node scripts/check-feeds.mjs config/feeds.json`.

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

- [ ] 10. Port Affected Stations Into `/app/stations`

  **What to do**: Extract station seed data from the prototype into typed data or DB seed, port the ballot-box SVG visual into reusable components, implement `/app/stations`, 가나다 sorting, severity filters, responsive 3/4/6-column grid, summary stats, updated date, Home/Rallies entry links, and daily agentic Cron update structure.
  **Must NOT do**: Do not leave data hard to migrate; do not omit disclaimer; do not state the list proves fraud.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 13, 14, 16 | Blocked By: 2, 5, 6

  **References**:
  - Pattern: `prototypes/affected-stations/AffectedStations.jsx` - visual/data prototype.
  - Pattern: `PLAN.md:250` - affected polls requirements.
  - Pattern: `AGENTS.md` - keep `STATIONS`, `SUMMARY`, `UPDATED_AT` extractable.
  - Skill: `$omo:frontend-ui-ux` - mandatory for ballot-box SVG design, severity color system, responsive grid, and visual accessibility.

  **Acceptance Criteria**:
  - [ ] Executor records `$omo:frontend-ui-ux` aesthetic direction before porting the SVG board.
  - [ ] `/app/stations` renders station board using typed data.
  - [ ] Filters for all/red/orange/yellow work.
  - [ ] Stations sort by Korean locale.
  - [ ] Disclaimer text is present and tested.
  - [ ] Cron update route/job can generate a review draft without automatically publishing unverified changes.

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

- [ ] 11. Build Admin Queues, Applications, Settings, And Audit Logs

  **What to do**: Implement `/admin` client-only noindex route with role gating, tip approval/rejection, admin application approval/rejection/demotion, moderation queues, super-admin-only auto-hide settings, audit log writes, and profile menu entry points.
  **Must NOT do**: Do not expose admin UI to guests/users; do not let regular admins change auto-hide thresholds.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 13, 14, 16 | Blocked By: 2, 3

  **References**:
  - Pattern: `PLAN.md:297` - admin applications.
  - Pattern: `PLAN.md:258` - moderation queue split.
  - Pattern: `AGENTS.local.md` - role rules.
  - Skill: `$omo:frontend-ui-ux` - use for dense utilitarian admin UI, queue scanning, form hierarchy, and destructive-action clarity.

  **Acceptance Criteria**:
  - [ ] `/admin` has noindex metadata and denies non-admin users.
  - [ ] Super admin can approve/demote admins and adjust moderation settings.
  - [ ] Regular admin can process tips and moderation queues but cannot change super settings.
  - [ ] Every approval/rejection/demotion/settings change writes `audit_logs`.

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

- [ ] 12. Add Edge Caching, Rate Limits, Turnstile, And Abuse Guardrails

  **What to do**: Implement app-level rate limits for guest writing/reporting, Turnstile challenge on suspicious write paths, cache headers/ISR for public read-heavy endpoints, Cloudflare deployment checklist, WAF/bot rules checklist, and no-Redis baseline documentation.
  **Must NOT do**: Do not add Redis; do not leak IP/device identifiers into public UI.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 16 | Blocked By: 2, 8, 9

  **References**:
  - Pattern: `PLAN.md:123` - read-cache strategy.
  - Pattern: `PLAN.md:135` - Cloudflare security.
  - Pattern: `AGENTS.md` - no Redis baseline.

  **Acceptance Criteria**:
  - [ ] Public read endpoints use cache headers or ISR as appropriate.
  - [ ] Guest write/report endpoints enforce rate limits.
  - [ ] Suspicious write flow requires Turnstile.
  - [ ] Cloudflare setup checklist covers DNS/proxy/WAF/DDoS/bot/rate-limit settings.

  **QA Scenarios**:
  ```
  Scenario: Guest write rate limit triggers
    Tool: curl
    Steps: send repeated POST /api/voices fixture requests beyond configured threshold
    Expected: final response HTTP 429 with safe error body
    Evidence: .omo/evidence/task-12-rate-limit.txt

  Scenario: Read endpoint cache headers present
    Tool: curl
    Steps: curl -i http://127.0.0.1:3000/api/news/world
    Expected: HTTP 200 with cache-control header
    Evidence: .omo/evidence/task-12-cache-headers.txt
  ```

  **Commit**: YES | Message: `feat(security): add rate limits and cache guardrails` | Files: middleware/API routes, docs/checklists, tests

- [ ] 13. Add Moderation AI, Human Review, And Operational Agents

  **What to do**: Implement hot-entry one-time AI moderation with `ai_checked`, soft-hide, popular review queue, report/dislike queue, trust scoring, appeal path, OpenAI key usage from env, station/rally/news/tip triage draft agents, anomaly detection hooks, and kill-switch/threshold settings through PostHog or DB settings as planned.
  **Must NOT do**: Do not run AI on every post by default; do not make AI final authority for ambiguous cases; do not print OpenAI key.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 16 | Blocked By: 6, 7, 10, 11

  **References**:
  - Pattern: `PLAN.md:109` - AI-native operations.
  - Pattern: `PLAN.md:258` - moderation rules.
  - Pattern: `AGENTS.local.md` - OpenAI key exists in `.env`.

  **Acceptance Criteria**:
  - [ ] Voice entering hot feed triggers one AI moderation call only when `ai_checked=false`.
  - [ ] Weak violations soft-hide and enter popular review queue.
  - [ ] Admin can restore or permanently hide.
  - [ ] AI agent Cron jobs create drafts/recommendations, not unreviewed destructive changes.
  - [ ] Tests prove `ai_checked=true` prevents duplicate calls.

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

- [ ] 14. Wire PostHog, Feature Flags, Error Tracking, Replay Masking, And Uptime

  **What to do**: Create PostHog project externally during execution, add SDK, analytics events, feature flags for hot-score weights/moderation thresholds/kill switches, error tracking, session replay with input/body masking, survey hooks if needed, uptime monitor checklist, and spend cap checklist for Vercel/Supabase.
  **Must NOT do**: Do not add Sentry; do not replay sensitive body text or PII.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 16 | Blocked By: 7, 10, 11

  **References**:
  - Pattern: `PLAN.md:94` - PostHog baseline.
  - Pattern: `AGENTS.local.md` - PostHog project not created yet.
  - Skill: `$omo:frontend-ui-ux` - use when replay masking, error states, flag-controlled variants, or survey surfaces affect UI.

  **Acceptance Criteria**:
  - [ ] PostHog provider loads only with configured public key/host.
  - [ ] Session replay masks inputs and voice body text.
  - [ ] Error tracking captures client/server errors through PostHog path.
  - [ ] Feature flags can adjust hot-score weights and moderation thresholds.
  - [ ] No Sentry package exists in `package.json`.

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

- [ ] 15. Configure Deployment, External Projects, CI, And Environment Hygiene

  **What to do**: Add Vercel project setup instructions/config, Cloudflare zone/DNS/WAF checklist, Supabase linked project instructions, env var templates without values, GitHub Actions for lint/typecheck/test/build/feed check, Codex Browser/browser-use manual QA instructions, deployment protection/noindex checks, spend caps, and AGPL/license metadata in package/footer.
  **Must NOT do**: Do not create or commit `.env`; do not commit Vercel/Supabase tokens.

  **Parallelization**: Can Parallel: YES | Wave 4 | Blocks: 16 | Blocked By: 2

  **References**:
  - Pattern: `AGENTS.local.md` - external project creation status.
  - Pattern: `PLAN.md:123` and `PLAN.md:145` - infra/cost rules.
  - Pattern: `CONTRIBUTING.md` - security and checks.

  **Acceptance Criteria**:
  - [ ] `.env.example` lists variable names only.
  - [ ] CI runs lint, typecheck, unit tests, build, and feed check; browser QA remains Codex Browser/browser-use runbook evidence.
  - [ ] Package metadata/license is `AGPL-3.0-only`.
  - [ ] Deployment docs include Vercel, Cloudflare, Supabase, PostHog, Turnstile, uptime, and spend caps.

  **QA Scenarios**:
  ```
  Scenario: Secret scan finds no tracked secrets
    Tool: bash
    Steps: git grep -nE '(password|api[_-]?key|SUPER_ADMIN_EMAILS|ADMIN_EMAILS)' -- ':!AGENTS.local.md' ':!.omo/**'
    Expected: no secret values; only safe variable names where appropriate
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

  **Parallelization**: Can Parallel: NO | Wave 5 | Blocks: final | Blocked By: all prior tasks

  **References**:
  - Pattern: all prior task evidence.
  - Pattern: `AGENTS.md` and `CONTRIBUTING.md` - final checks and safety/security rules.
  - Skill: `$omo:frontend-ui-ux` - mandatory for final visual QA review across frontend, SVG, graphics, spacing, typography, motion, and responsive screenshots.

  **Acceptance Criteria**:
  - [ ] All automated checks exit 0.
  - [ ] Codex Browser/browser-use QA covers `/`, `/app`, `/app/rallies`, `/app/square`, `/app/live`, `/app/news`, `/app/stations`, `/admin`, `/robots.txt`, `/sitemap.xml`.
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
- Subject should be concise and imperative, for example `feat(auth): add guest role bootstrap`.
- Non-trivial commits require a body. Do not use one-line-only commit messages for implementation commits.
- Body style:
  - Use `- ` bullets, one bullet per line.
  - Keep each bullet focused on user-visible behavior, test coverage, or operational impact.
  - Avoid wrapping a single bullet across multiple visual lines unless unavoidable.
  - Mention safety/security impact when relevant.
  - End plan-driven commits with `Plan: .omo/plans/clearkorea-scaffold-build.md`.
- Example:

```text
feat(auth): add guest role bootstrap

- Add guest entry with immutable generated nicknames and persisted session state.
- Promote only verified Google allowlist identities and demote removed identities on next login.
- Cover provider restrictions, nickname collisions, and guest entry with RED-to-GREEN tests.

Plan: .omo/plans/clearkorea-scaffold-build.md
```

## Success Criteria
- All root Markdown guidance has been honored.
- Full v1 scope in `PLAN.md` is represented in implementation tasks.
- Every task has references, acceptance criteria, QA scenarios, and commit guidance.
- Scaffolding starts from the current baseline and preserves existing assets/config/prototypes/scripts.
- Conventional Commit policy is explicit and rejects one-line-only non-trivial implementation commits.
- Verification requires automated RED->GREEN proof and real Windows-compatible browser/HTTP/PowerShell surface evidence.
- Secrets remain local-only and are never copied into source, docs, commits, or evidence.

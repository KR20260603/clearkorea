# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-07
**Commit:** `2cdc860`
**Branch:** `main`

## OVERVIEW

ClearKorea is an AGPL-3.0-only civic-tech platform for lawful online participation, rally support, livestream aggregation, verified posts, and foreign press tracking around Korean election transparency. The repository now contains the v1 Next.js scaffold, public brand assets, local Supabase schema/RLS baseline, copy/safety contracts, validation utilities, nickname contracts, feed tooling, and the pre-scaffold affected-stations prototype.

## STRUCTURE

```text
clearkorea/
|-- README.md          # English product summary and operating principles
|-- README.ko.md       # Korean product summary; keep in sync with README.md
|-- PLAN.md            # Product source of truth for v1 scope, stack, safety, data model
|-- IMAGE.md           # Prompts and rules for raster brand/marketing assets
|-- package.json       # Next.js 16 / React 19 scaffold scripts and dependencies
|-- .env.example       # Public env-name contract; no secret values
|-- public/            # SVG/PNG/JPG brand, PWA, OG, SNS, hero, tile assets
|-- src/
|   |-- app/           # Next.js App Router routes, metadata, tests, shell frame
|   |-- lib/           # Copy, validation, nickname, config, Supabase contracts
|   `-- test/          # Vitest setup
|-- supabase/          # Local Supabase config, migrations, seed data
|-- config/
|   `-- feeds.json     # Foreign press feed and keyword-filter config
|-- prototypes/
|   `-- affected-stations/
|       `-- AffectedStations.jsx  # Portable React affected-polling-stations board
`-- scripts/
    |-- check-feeds.mjs           # Node 18+ RSS/Google News liveness checker
    `-- check-supabase-schema.mjs # Local SQL/seed contract checker
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Active implementation plan | `.omo/plans/clearkorea-scaffold-build.md` | Wave 3 is complete; next wave starts with Task 5 Kakao/Naver auth, launch gate, role bootstrap, and nickname implementation. |
| Product scope and architecture | `PLAN.md` | Source of truth for v1 scope, stack, safety, data model, and Kakao/Naver-only production auth policy. |
| App shell and SEO routes | `src/app/` | Next.js App Router route groups `(marketing)`, `(app)`, `(admin)`, metadata, robots, sitemap, manifest, tests. |
| Shared visual shell | `src/app/shell-frame.tsx` | Landing and app header/logo alignment lives here; avoid duplicating shell header markup in route pages. |
| Copy and safety contracts | `src/lib/copy/`, `src/lib/validation/`, `src/lib/config/` | Korean/English civic copy, launch-policy text, social URL validation, env-name contract tests. |
| Nickname contract | `src/lib/nickname/` | Current word buckets are fixture-grade; Task 5 should expand and harden generation. |
| Supabase schema/RLS | `supabase/`, `src/lib/supabase/` | Local migration, seed, generated DB types, project constants, schema contract tests. See `supabase/AGENTS.md`. |
| User-facing copy and principles | `README.md`, `README.ko.md` | Keep English/Korean meaning aligned when editing product claims. |
| Brand assets and generation rules | `IMAGE.md`, `public/` | SVG-first for app/docs/open-source surfaces; raster only for PWA/OG/SNS/marketing needs. |
| Affected polling station UI | `prototypes/affected-stations/AffectedStations.jsx` | Self-contained JSX component with inline CSS and hardcoded station data. |
| Foreign press feed validation | `config/feeds.json`, `scripts/check-feeds.mjs` | `checked: true` feeds are required and make the checker fail if dead. |

## IMPLEMENTATION BASELINE

- The Next.js scaffold exists with `package.json`, `pnpm-lock.yaml`, `src/app`, TypeScript, Tailwind, ESLint, Vitest, and commitlint.
- Wave 3 is complete: Task 3 added the local Supabase schema/RLS/types baseline; Task 4 added copy, safety, URL-validation, nickname, and env-name contracts.
- Task 3 did not mutate hosted Supabase. Treat hosted DDL/policy changes as critical service integration unless the user explicitly approves them.
- `PLAN.md` remains the v1 production source of truth; use `.omo/plans/clearkorea-scaffold-build.md` for the active plan-driven build sequence.
- Current visual state: `/` uses `public/hero2.png`; `/app` keeps `public/tile.png`; both share `ShellFrame`; `/app` bottom dock has icon+label items and must remain fully visible at small viewport heights.
- Keep pre-scaffold prototypes, scripts, and config outside `src/` unless a plan task explicitly ports them.
- If `AGENTS.local.md` exists, read it for local-only service/project context. It is ignored by git and must not be committed.
- `.env.example` documents official env variable names. `.env` is local-only; inspect variable names only when needed and never print values.
- `prototypes/affected-stations/AffectedStations.jsx` is written as a component to port into the app. Keep `STATIONS`, `SUMMARY`, and `UPDATED_AT` easy to extract into data files or a DB table.
- `scripts/check-feeds.mjs` has no external dependencies and relies on Node 18+ global `fetch`.
- Child guidance exists only where domain-specific rules matter. Currently `supabase/AGENTS.md` governs local schema/RLS work; other directories remain covered by root guidance.

## CONVENTIONS

- Korean civic copy should avoid stating "organized election fraud" as established fact. Use investigation, recurrence prevention, election transparency, and fair re-vote framing.
- Keep safety language explicit: no doxxing, no tracking specific individuals, no organizing unlawful acts, no private retaliation.
- For Seoul crowd data, label it as regional real-time congestion, not rally headcount.
- For affected polling stations, keep the disclaimer that the list summarizes confirmed administrative failures and does not itself prove election fraud.
- UI labels in the planned app bottom dock are English-only: `Home`, `Rallies`, `Square`, `Live`, `News`.
- Production participation policy is Kakao/Naver OAuth only. Public launch must not expose guest login/posting/reporting or Google OAuth.
- Development/test guest bypass is allowed only behind explicit non-production configuration and must be impossible in production launch mode.
- Google News RSS/feed ingestion is still allowed and must not be confused with Google OAuth login.
- Admin bootstrap must use env-only provider-qualified Kakao/Naver identity identifiers or explicit super-admin approval. Do not use email-only allowlists for production roles.
- The official env-name direction is provider-qualified IDs: `SUPER_ADMIN_PROVIDER_IDS`, `ADMIN_PROVIDER_IDS`, plus Kakao/Naver provider credentials. Do not reintroduce `SUPER_ADMIN_EMAILS` or `ADMIN_EMAILS`.
- Current `sampleNicknameWordBuckets` data is temporary fixture coverage. Task 5 should expand the Korean word pool and keep immutable linked-user nickname semantics.
- Brand palette is dark civic-tech: `#0A0A0A`, white, Korean-flag red `#CD2E3A`, and Korean-flag blue `#0047A0`; use red/blue as accents.
- Brand direction is SVG-first. Use `public/readme-banner.svg` and `public/pwa-icon.svg` as the clean vector style references.
- Preserve generated asset names from `PLAN.md` and `IMAGE.md`: `pwa-icon.svg`, `pwa-icon.png`, `pwa-icon.jpg`, `hero.png`, `hero-mobile.png`, `splash.png`, `og.png`, `readme-banner.svg`, `square.png`, `ig-feed.png`, `ig-story.png`, `x-header.png`, `tile.png`.

## PLANNING AND EXECUTION PHILOSOPHY

- Treat `PLAN.md` as the product source of truth and keep v1 as one complete initial scope unless the user explicitly changes the scope.
- Before creating or executing a work plan, read every root Markdown file that can affect scope, safety, implementation order, or contribution rules.
- Keep future work plans decision-complete: each task should state exact references, acceptance criteria, QA evidence, dependency order, and commit guidance.
- Use TDD for production behavior after the app scaffold exists: capture RED evidence before implementation and GREEN evidence after implementation.
- Browser-facing work must be verified through the real browser surface with captured screenshots or action logs; tests alone are not enough.
- Any layout touching landing or in-app shell must include small-viewport verification. At minimum check that major UI and `/app` dock remain fully visible at `320x480`; prefer also checking `320x420`, `320x568`, `360x640`, `390x844`, and desktop.
- For frontend UI, SVG image, raster image, visual design, layout, motion, or graphic polish work, explicitly use `$omo:frontend-ui-ux` and record the aesthetic direction before implementation.
- Keep aesthetic direction compatible with the project brand: dark civic-tech, SVG-first, high contrast, restrained Korean-flag red/blue accents, and safety-conscious civic copy.
- Do not let planning artifacts execute the work. Plans may live under `.omo/plans/`; drafts may live under `.omo/drafts/` and should be removed when the final plan is complete.
- Do not integrate Supabase, Vercel, Cloudflare, or PostHog blindly. For critical hosted-service changes, stop for user approval; when the integration is not critical to current behavior, abstract the integration and provide a final setup guide instead of wiring live services.
- For plan-driven execution, finish one top-level plan task at a time: implement, verify, mark the task checkbox, then commit that task before starting the next top-level task.
- Do not combine multiple plan tasks into one commit. If a later task was started before the previous commit, split the work back into task-sized commits before continuing.
- Once the user has approved committing during a plan execution session, treat each task's `Commit: YES` guidance as approval to commit that completed task immediately.
- At the end of each large execution wave, run `$omo:init-deep` / `omo:init-deep` update mode before moving to the next wave. Sync `AGENTS.md`, any warranted child `AGENTS.md`, and the active `.omo/plans/*.md` with completed tasks, next-task pointers, new conventions, and directory-boundary changes, then commit that durable guidance update as its own task-boundary commit.
- Keep bulky runtime evidence local. Do not commit `.omo/evidence/`, `.omo/start-work/`, `.omo/boulder.json`, screenshots, server logs, or transient QA transcripts unless the user explicitly requests those artifacts in git.
- Commit only durable project changes: source, tests, config, docs, migrations, plan checkbox updates, and concise policy/runbook updates.

## COMMIT STYLE

- Use Conventional Commits: `<type>(<scope>): <imperative>`.
- Do not use one-line-only messages for non-trivial implementation commits.
- Prefer concise multi-line bodies with `- ` bullets, one clear point per line, focused on behavior, verification, safety, or operational impact.
- For plan-driven implementation commits, include a footer such as `Plan: .omo/plans/<slug>.md`.
- Do not auto-commit unless the user explicitly approves committing in that session.
- For plan-driven work after approval, commit at every completed top-level task boundary using that task's planned commit subject/scope when provided.

## ANTI-PATTERNS (THIS PROJECT)

- Do not defer v1 items out of the initial scope when implementing `PLAN.md`; the full listed v1 scope is one initial scope.
- Do not copy secrets or env values into docs or code. Admin identifiers are env-only; docs may name variable concepts but never actual values.
- Do not use `SUPER_ADMIN_EMAILS` or `ADMIN_EMAILS` for the production admin contract. Use provider-qualified Kakao/Naver identity identifiers or explicit super-admin approval.
- Do not introduce Sentry as the default observability path; the plan uses PostHog error tracking.
- Do not add Redis or a separate in-memory cache as baseline infrastructure unless measured bottlenecks justify it.
- Do not convert the feed checker to depend on npm packages without a concrete reason; its current value is dependency-free CI use.
- Do not add `public/pwa-icon.ico`; `pwa-icon.svg` is the canonical icon source, with PNG/JPG variants only.
- Do not commit `.env`, `AGENTS.local.md`, `.omo/ulw-loop/evidence/`, or handoff files created for local agent transitions.

## COMMANDS

```bash
# Install dependencies.
pnpm install --frozen-lockfile

# Run scaffold/app checks.
pnpm lint
pnpm typecheck
pnpm test
pnpm build

# Check RSS/Google News feed liveness; required checked:true feeds fail the run.
node scripts/check-feeds.mjs config/feeds.json

# Check local Supabase SQL/seed contract.
node scripts/check-supabase-schema.mjs supabase/migrations/20260606030000_initial_schema.sql supabase/seed.sql
```

Use Windows-compatible dev-server process control from `AGENTS.local.md` for browser-facing QA on this machine.

## NOTES

- Use `git status --short` before edits and avoid reverting user changes.
- `.env` exists; inspect variable names only when needed and avoid printing values.
- `AGENTS.local.md`, when present, records local service setup facts without secret values. If it conflicts with the Kakao/Naver-only launch policy, the active user decision and tracked plan win.
- `IMAGE.md` allows rendered text in generated marketing images, but `PLAN.md` notes real app landing text should eventually use HTML for responsiveness, SEO, and localization.

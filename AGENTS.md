# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-07
**Commit:** `e0012fc`
**Branch:** `main`

## OVERVIEW

ClearKorea is an AGPL-3.0-only civic-tech platform for lawful online participation, rally support, livestream aggregation, verified posts, and foreign press tracking around Korean election transparency. The repository now contains the v1 Next.js scaffold plus the original docs, public brand assets, feed config, and pre-scaffold prototype.

## STRUCTURE

```text
clearkorea/
├── README.md          # English product summary and operating principles
├── README.ko.md       # Korean product summary; keep in sync with README.md
├── PLAN.md            # Source of truth for v1 scope, stack, safety, data model
├── IMAGE.md           # Prompts and rules for raster brand/marketing assets
├── public/            # SVG/PNG/JPG brand, PWA, OG, and SNS assets
├── src/
│   ├── app/           # Next.js App Router routes, metadata, tests, shell frame
│   └── test/          # Vitest setup
├── config/
│   └── feeds.json     # Foreign press feed and keyword-filter config
├── prototypes/
│   └── affected-stations/
│       └── AffectedStations.jsx  # Portable React affected-polling-stations board
└── scripts/
    └── check-feeds.mjs           # Node 18+ RSS/Google News liveness checker
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Active implementation plan | `.omo/plans/clearkorea-scaffold-build.md` | Task 2A is complete; the next planned top-level task is Task 2B auth-policy doc sync. |
| Product scope and architecture | `PLAN.md` | Source of truth for v1 scope, stack, safety, data model; Task 2B must sync stale auth text before DB/auth implementation. |
| App shell and SEO routes | `src/app/` | Next.js App Router route groups `(marketing)`, `(app)`, `(admin)`, metadata, robots, sitemap, manifest, tests. |
| Shared visual shell | `src/app/shell-frame.tsx` | Landing and app header/logo alignment lives here; avoid duplicating shell header markup in route pages. |
| User-facing copy and principles | `README.md`, `README.ko.md` | Keep English/Korean meaning aligned when editing product claims. |
| Brand assets and generation rules | `IMAGE.md`, `public/` | SVG-first for app/docs/open-source surfaces; raster only for PWA/OG/SNS/marketing needs. |
| Affected polling station UI | `prototypes/affected-stations/AffectedStations.jsx` | Self-contained JSX component with inline CSS and hardcoded station data. |
| Foreign press feed validation | `config/feeds.json`, `scripts/check-feeds.mjs` | `checked: true` feeds are required and make the checker fail if dead. |

## IMPLEMENTATION BASELINE

- The Next.js scaffold exists with `package.json`, `pnpm-lock.yaml`, `src/app`, TypeScript, Tailwind, ESLint, Vitest, and commitlint.
- `PLAN.md` remains the v1 production source of truth; use `.omo/plans/clearkorea-scaffold-build.md` for the active plan-driven build sequence.
- Current visual state: `/` uses `public/hero2.png`; `/app` keeps `public/tile.png`; both share `ShellFrame`; `/app` bottom dock has icon+label items and must remain fully visible at small viewport heights.
- Keep pre-scaffold prototypes, scripts, and config outside `src/` unless a plan task explicitly ports them.
- If `AGENTS.local.md` exists, read it for local-only service/project context. It is ignored by git and must not be committed.
- `prototypes/affected-stations/AffectedStations.jsx` is written as a component to port into the app. Keep `STATIONS`, `SUMMARY`, and `UPDATED_AT` easy to extract into data files or a DB table.
- `scripts/check-feeds.mjs` has no external dependencies and relies on Node 18+ global `fetch`.
- No child `AGENTS.md` files are warranted yet. `src/app` is still a small route shell, and child guidance would mostly duplicate root rules.

## CONVENTIONS

- Korean civic copy should avoid stating "organized election fraud" as established fact. Use investigation, recurrence prevention, election transparency, and fair re-vote framing.
- Keep safety language explicit: no doxxing, no tracking specific individuals, no organizing unlawful acts, no private retaliation.
- For Seoul crowd data, label it as regional real-time congestion, not rally headcount.
- For affected polling stations, keep the disclaimer that the list summarizes confirmed administrative failures and does not itself prove election fraud.
- UI labels in the planned app bottom dock are English-only: `Home`, `Rallies`, `Square`, `Live`, `News`.
- Production participation policy is Kakao/Naver OAuth only. Public launch must not expose guest login/posting/reporting or Google OAuth.
- Development/test guest bypass is allowed only behind explicit non-production configuration and must be impossible in production launch mode.
- Google News RSS/feed ingestion is still allowed and must not be confused with Google OAuth login.
- Admin bootstrap must use env-only provider-qualified Kakao/Naver identity identifiers or explicit super-admin approval; do not use Google verified-email allowlists for the production plan.
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
- For plan-driven execution, finish one top-level plan task at a time: implement, verify, mark the task checkbox, then commit that task before starting the next top-level task.
- Do not combine multiple plan tasks into one commit. If a later task was started before the previous commit, split the work back into task-sized commits before continuing.
- Once the user has approved committing during a plan execution session, treat each task's `Commit: YES` guidance as approval to commit that completed task immediately.
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
- Do not use `SUPER_ADMIN_EMAILS` or `ADMIN_EMAILS` as the future production admin contract; Task 2B must replace stale email allowlist docs with provider-qualified Kakao/Naver identity identifiers or super-admin approval.
- Do not introduce Sentry as the default observability path; the plan uses PostHog error tracking.
- Do not add Redis or a separate in-memory cache as baseline infrastructure unless measured bottlenecks justify it.
- Do not convert the feed checker to depend on npm packages without a concrete reason; its current value is dependency-free CI use.
- Do not add `public/pwa-icon.ico`; `pwa-icon.svg` is the canonical icon source, with PNG/JPG variants only.

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
```

Use Windows-compatible dev-server process control from `AGENTS.local.md` for browser-facing QA on this machine.

## NOTES

- Use `git status --short` before edits and avoid reverting user changes.
- `.env` exists; inspect variable names only when needed and avoid printing values.
- `AGENTS.local.md`, when present, records local service setup facts without secret values. If it conflicts with the Kakao/Naver-only launch policy, the active user decision and tracked plan win.
- `IMAGE.md` allows rendered text in generated marketing images, but `PLAN.md` notes real app landing text should eventually use HTML for responsiveness, SEO, and localization.

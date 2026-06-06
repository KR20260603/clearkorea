# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-06
**Commit:** inspect locally with `git rev-parse --short HEAD`
**Branch:** inspect locally with `git branch --show-current`

## OVERVIEW

ClearKorea is an AGPL-3.0-only civic-tech platform for lawful online participation, rally support, livestream aggregation, verified posts, and foreign press tracking around Korean election transparency. This repository is the v1 planning/prototype baseline: product docs, SVG-first brand assets, one portable React JSX widget, one feed config, and one Node feed-liveness checker.

## STRUCTURE

```text
clearkorea/
├── README.md          # English product summary and operating principles
├── README.ko.md       # Korean product summary; keep in sync with README.md
├── PLAN.md            # Source of truth for v1 scope, stack, safety, data model
├── IMAGE.md           # Prompts and rules for raster brand/marketing assets
├── assets/            # SVG/PNG/JPG brand, PWA, OG, and SNS assets
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
| Product scope and architecture | `PLAN.md` | Planned stack is Next.js 16.2, React 19, TypeScript, Tailwind, Supabase, Vercel, Cloudflare, PostHog, pnpm. |
| User-facing copy and principles | `README.md`, `README.ko.md` | Keep English/Korean meaning aligned when editing product claims. |
| Brand assets and generation rules | `IMAGE.md`, `assets/` | SVG-first for app/docs/open-source surfaces; raster only for PWA/OG/SNS/marketing needs. |
| Affected polling station UI | `prototypes/affected-stations/AffectedStations.jsx` | Self-contained JSX component with inline CSS and hardcoded station data. |
| Foreign press feed validation | `config/feeds.json`, `scripts/check-feeds.mjs` | `checked: true` feeds are required and make the checker fail if dead. |

## IMPLEMENTATION BASELINE

- The Next.js scaffold now exists with `package.json`, `pnpm-lock.yaml`, `src/app`, TypeScript, Tailwind, ESLint, Vitest, and commitlint.
- `PLAN.md` remains the v1 production source of truth; use `.omo/plans/clearkorea-scaffold-build.md` for the active plan-driven build sequence.
- Keep pre-scaffold prototypes, scripts, and config outside `src/` unless a plan task explicitly ports them.
- If `AGENTS.local.md` exists, read it for local-only service/project context. It is ignored by git and must not be committed.
- `prototypes/affected-stations/AffectedStations.jsx` is written as a component to port into the app. Keep `STATIONS`, `SUMMARY`, and `UPDATED_AT` easy to extract into data files or a DB table.
- `scripts/check-feeds.mjs` has no external dependencies and relies on Node 18+ global `fetch`.
- No child `AGENTS.md` files are warranted yet; current subdirectories are small and root guidance covers them.

## CONVENTIONS

- Korean civic copy should avoid stating "organized election fraud" as established fact. Use investigation, recurrence prevention, election transparency, and fair re-vote framing.
- Keep safety language explicit: no doxxing, no tracking specific individuals, no organizing unlawful acts, no private retaliation.
- For Seoul crowd data, label it as regional real-time congestion, not rally headcount.
- For affected polling stations, keep the disclaimer that the list summarizes confirmed administrative failures and does not itself prove election fraud.
- UI labels in the planned app bottom dock are English-only: `Home`, `Rallies`, `Square`, `Live`, `News`.
- Brand palette is dark civic-tech: `#0A0A0A`, white, Korean-flag red `#CD2E3A`, and Korean-flag blue `#0047A0`; use red/blue as accents.
- Brand direction is SVG-first. Use `assets/readme-banner.svg` and `assets/pwa-icon.svg` as the clean vector style references.
- Preserve generated asset names from `PLAN.md` and `IMAGE.md`: `pwa-icon.svg`, `pwa-icon.png`, `pwa-icon.jpg`, `hero.png`, `hero-mobile.png`, `splash.png`, `og.png`, `readme-banner.svg`, `square.png`, `ig-feed.png`, `ig-story.png`, `x-header.png`, `tile.png`.

## PLANNING AND EXECUTION PHILOSOPHY

- Treat `PLAN.md` as the product source of truth and keep v1 as one complete initial scope unless the user explicitly changes the scope.
- Before creating or executing a work plan, read every root Markdown file that can affect scope, safety, implementation order, or contribution rules.
- Keep future work plans decision-complete: each task should state exact references, acceptance criteria, QA evidence, dependency order, and commit guidance.
- Use TDD for production behavior after the app scaffold exists: capture RED evidence before implementation and GREEN evidence after implementation.
- Browser-facing work must be verified through the real browser surface with captured screenshots or action logs; tests alone are not enough.
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
- Do not copy secrets or env values into docs or code. `SUPER_ADMIN_EMAILS` and `ADMIN_EMAILS` are env-only identifiers.
- Do not introduce Sentry as the default observability path; the plan uses PostHog error tracking.
- Do not add Redis or a separate in-memory cache as baseline infrastructure unless measured bottlenecks justify it.
- Do not convert the feed checker to depend on npm packages without a concrete reason; its current value is dependency-free CI use.
- Do not add `assets/pwa-icon.ico`; `pwa-icon.svg` is the canonical icon source, with PNG/JPG variants only.

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
- `AGENTS.local.md`, when present, records local service setup facts without secret values.
- `IMAGE.md` allows rendered text in generated marketing images, but `PLAN.md` notes real app landing text should eventually use HTML for responsiveness, SEO, and localization.

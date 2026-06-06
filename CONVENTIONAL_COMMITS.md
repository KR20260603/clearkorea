# Conventional Commits

ClearKorea uses readable Conventional Commits for all implementation work.

## Subject

Use this format:

```text
<type>(<scope>): <imperative>
```

Allowed primary types are `feat`, `fix`, `refactor`, `test`, `docs`, `chore`, `build`, `ci`, and `perf`.

## Body

Non-trivial implementation commits must not be one-line only. Add a blank line after the subject, then a concise bullet body:

```text
build(scaffold): initialize Next.js workspace

- Add Next.js App Router scaffold with TypeScript, Tailwind, src, and pnpm scripts.
- Add Vitest, lint, typecheck, build verification hooks, and browser QA instructions.
- Add Conventional Commit guidance requiring readable multi-line commit bodies.

Plan: .omo/plans/clearkorea-scaffold-build.md
```

Keep each `- ` bullet focused on behavior, verification, safety, or operational impact. Plan-driven implementation commits must end with:

```text
Plan: .omo/plans/clearkorea-scaffold-build.md
```

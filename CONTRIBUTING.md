# Contributing to ClearKorea

ClearKorea is a public, open-source civic-tech platform. Contributions are welcome through GitHub issues and pull requests.

## License

ClearKorea is licensed under `AGPL-3.0-only`. By contributing, you agree that your contribution is provided under the same license.

## What To Contribute

- Product planning and copy improvements
- Safety and moderation improvements
- UI and accessibility improvements
- Feed reliability and source quality improvements
- Documentation and Korean/English wording alignment

## Safety Rules

- Do not post or track personal information about specific individuals.
- Do not encourage or organize unlawful acts.
- Do not frame organized election fraud as established fact.
- Keep the project language focused on investigation, recurrence prevention, election transparency, and a fair re-vote.

## Security Rules

- Never commit secrets, env values, admin allowlist emails, API keys, database passwords, or deployment tokens.
- Keep `.env*` files local.
- If you suspect a secret was committed, rotate it before opening an issue or PR.

## Pull Requests

- Keep changes scoped and explain the user-facing impact.
- Keep English and Korean public copy aligned when editing `README.md` or `README.ko.md`.
- Run available checks before submitting. The current feed check is:

```bash
node scripts/check-feeds.mjs config/feeds.json
```

# Security Policy

## Reporting a Vulnerability

Please do **not** open a public issue for security problems.

Report privately instead — two options, either works:

1. GitHub private vulnerability reporting (preferred): open *Settings → Security → Security advisory* on the repo and create a report, or
2. Email the maintainer directly: found via the repo's commit history / GitHub profile.

## What happens next

- You'll get an acknowledgment within 48 hours.
- The report stays private until a fix ships, then a coordinated disclosure is published (severity, fix version, thanks).

## Scope

- `scripts/install.sh` and `scripts/validate.sh` — anything that touches a machine's filesystem.
- Any skill instructions that ask an agent to run commands or fetch remote content.
- Distribution integrity: if a published copy differs from the tagged source, that's a security issue too.

## Supported versions

Only the latest release on `main` is supported. Security patches land there first and are backported only on request.
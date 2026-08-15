# Contributing

The growth mechanic of this repo is **taste packs**: narrow, opinionated design identities any designer can encode as a skill. The core `design-taste` skill is the *process*; packs are the *outputs*.

## What makes a good pack

- **One identity, fully committed.** "Editorial-minimal" is Swiss print. "Brutalist" is raw grid + type. A pack that says "a bit of everything" is not a pack.
- **Executable rules, not vibes.** "Feels premium" is useless to an agent. "Paper `#F5F1EA`, ink `#1A1A18`, one accent, hairline rules, indexed sections" is executable.
- **A name and trigger phrases** so the agent loads it at the right moment.
- **A demo.** Add a `before/after` pair under `examples/` or `gallery/` showing the identity applied. A pack without a demo is a theory.

## Anatomy of a pack

```text
skills/
└── my-identity/
    └── SKILL.md        ← frontmatter + rules
```

Frontmatter (keep it minimal for portability):

```yaml
---
name: my-identity
description: |
  One paragraph: what identity this is, when to use it, and how it differs from the defaults.
triggers:
  - "my identity"
  - "trigger phrases"
---
```

Body structure — follow `editorial-minimal/SKILL.md`:

1. **The one-sentence identity** ("a printed broadsheet that happens to be a website")
2. **Palette** — exact values, and what's banned
3. **Typography** — faces, sizes, pairings
4. **Composition** — grids, patterns, spacing
5. **Content treatment** — icons, imagery, CTAs
6. **Motion** — what little there is
7. **Checklist** — fail conditions (agents run these literally)

## Process

1. Fork, create `skills/<your-identity>/SKILL.md`.
2. Install it locally and *actually generate something with it* — fix the skill until the output matches the identity. Untested skills get rejected.
3. Add your before/after to `gallery/<your-identity>/` (see `gallery/README.md`).
4. Open a PR. Describe the identity in 2 sentences and link the demo.

## Standards

- No comments in code, no clutter in skills — agents read these files in full, every line must earn its place.
- MIT license applies to everything you contribute.
- Be opinionated. Bland packs don't survive contact with the never-list.

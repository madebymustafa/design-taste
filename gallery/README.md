# Gallery

Proof, not promises. Every pack in this repo has a before/after pair generated with a real agent.

## The ritual (how the demos are made)

1. Take one prompt — e.g. *"Create a landing page for my product"* — and generate it **without** any skill. That's your `before`.
2. Load the skill, run the **same prompt**. That's your `after`.
3. Screenshot both at the same viewport (1440×900 works well), full page, no scrollbars.
4. Add them to `gallery/<pack-name>/before.png` and `gallery/<pack-name>/after.png`, plus a one-line caption in this README.

Same prompt is the whole point — the only variable is the skill.

## Current pairs

All ten demos share the same baseline: `examples/before.html` (default agent output). The `after` for each pack:

| Pack | Demo (interactive HTML) | Screenshot pair |
|---|---|---|
| `editorial-minimal` | [`examples/after.html`](../examples/after.html) | [before](editorial-minimal/before.png) / [after](editorial-minimal/after.png) |
| `brutalist-industrial` | [`examples/brutalist-industrial.html`](../examples/brutalist-industrial.html) | [before](brutalist-industrial/before.png) / [after](brutalist-industrial/after.png) |
| `quiet-luxury` | [`examples/quiet-luxury.html`](../examples/quiet-luxury.html) | [before](quiet-luxury/before.png) / [after](quiet-luxury/after.png) |
| `dark-tech` | [`examples/dark-tech.html`](../examples/dark-tech.html) | [before](dark-tech/before.png) / [after](dark-tech/after.png) |
| `playful-color` | [`examples/playful-color.html`](../examples/playful-color.html) | [before](playful-color/before.png) / [after](playful-color/after.png) |
| `retro-print` | [`examples/retro-print.html`](../examples/retro-print.html) | [before](retro-print/before.png) / [after](retro-print/after.png) |
| `japanese-minimal` | [`examples/japanese-minimal.html`](../examples/japanese-minimal.html) | [before](japanese-minimal/before.png) / [after](japanese-minimal/after.png) |
| `neo-brutalism` | [`examples/neo-brutalism.html`](../examples/neo-brutalism.html) | [before](neo-brutalism/before.png) / [after](neo-brutalism/after.png) |
| `corporate-trust` | [`examples/corporate-trust.html`](../examples/corporate-trust.html) | [before](corporate-trust/before.png) / [after](corporate-trust/after.png) |
| `cinematic-motion` | [`examples/cinematic-motion.html`](../examples/cinematic-motion.html) | [before](cinematic-motion/before.png) / [after](cinematic-motion/after.png) |

The HTML pairs ship interactive so people can open them in a browser in five seconds; screenshots are the gallery version of the same story. Open them all, tab to tab — ten radically different identities from one brief is the strongest argument this repo makes.

Screenshots are produced by [`scripts/capture-screenshots.mjs`](../scripts/capture-screenshots.mjs) — one command, deterministic output (local font/JS inlining, full scroll-through so pinned sections freeze completed). Regenerate any pair, forever.

## Guidelines

- Real agent output only — no hand-tuned screenshots. If a `before` is suspiciously beautiful, reviewers will know.
- 1:1 resolution, PNG, no borders or shadows added by the capture tool.
- Captions must state the prompt verbatim. Reproducibility is the trust layer.
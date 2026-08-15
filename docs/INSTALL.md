# Install

Skills are folders containing a `SKILL.md` file. You copy the folders into your agent's skills directory; the agent picks them up automatically when a prompt matches their description.

## One-liner

```bash
git clone https://github.com/<you>/design-taste.git
cd design-taste
./scripts/install.sh
```

`install.sh` copies every skill in `skills/` into every agent directory it finds on your machine:

| Agent | Path |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |
| Codex | `~/.codex/skills/` |
| opencode | `~/.config/opencode/skills/` |
| Cline | `~/.cline/skills/` |
| Roo Code | `~/.roo/skills/` |

Pass a path to install to a custom location:

```bash
./scripts/install.sh ~/my-project/.claude/skills
```

## Manual install

Copy the skill folders you want:

```bash
cp -r skills/design-taste ~/.claude/skills/
cp -r skills/editorial-minimal ~/.claude/skills/
```

(Replace `~/.claude/skills` with your agent's path from the table above.)

## Uninstall

```bash
rm -rf ~/.claude/skills/design-taste ~/.claude/skills/editorial-minimal
```

## Verify

1. Ask your agent: *"Create a landing page for my product"* — it should mention it's loading the `design-taste` skill (or trigger it by name).
2. Compare against `examples/before.html` — if your output looks closer to `examples/after.html`, it worked.

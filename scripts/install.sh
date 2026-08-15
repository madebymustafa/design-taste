#!/usr/bin/env bash
set -euo pipefail

TARGET_DIR="${1:-}"

HOME_AGENTS=(
  "$HOME/.claude/skills"
  "$HOME/.cursor/skills"
  "$HOME/.codex/skills"
  "$HOME/.config/opencode/skills"
  "$HOME/.cline/skills"
  "$HOME/.roo/skills"
)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/../skills"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "error: skills directory not found at $SOURCE_DIR" >&2
  exit 1
fi

SKILLS=()
for dir in "$SOURCE_DIR"/*/; do
  SKILLS+=("$(basename "$dir")")
done

if (( ${#SKILLS[@]} == 0 )); then
  echo "error: no skills found in $SOURCE_DIR" >&2
  exit 1
fi

installed_any=0

install_to() {
  local dest="$1"
  mkdir -p "$dest"
  for skill in "${SKILLS[@]}"; do
    cp -R "$SOURCE_DIR/$skill" "$dest/"
    echo "  ✓ $skill → $dest"
  done
  installed_any=1
}

if [[ -n "$TARGET_DIR" ]]; then
  echo "Installing ${#SKILLS[@]} skills to $TARGET_DIR"
  install_to "$TARGET_DIR"
else
  echo "Looking for agent skills directories (${#SKILLS[@]} skills to install)..."
  for dir in "${HOME_AGENTS[@]}"; do
    if [[ -d "$dir" ]] || [[ "$dir" == "$HOME/.claude/skills" ]]; then
      install_to "$dir"
    fi
  done
fi

if [[ "$installed_any" -eq 0 ]]; then
  echo "No agent skills directory found. Install manually:"
  echo "  mkdir -p ~/.claude/skills && cp -R $SOURCE_DIR/* ~/.claude/skills/"
  exit 1
fi

echo ""
echo "Done — ${#SKILLS[@]} skills installed. Ask your agent for a landing page and it should load the skill automatically."
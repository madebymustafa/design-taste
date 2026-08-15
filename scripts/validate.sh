#!/usr/bin/env bash
# Validates every skill in skills/: frontmatter integrity, name/folder match,
# required sections, and minimum body size. Exit code 1 on any failure.
set -uo pipefail

SKILLS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../skills" && pwd)"
PASS=0
FAIL=0

for skill_dir in "$SKILLS_DIR"/*/; do
  folder="$(basename "$skill_dir")"
  file="$skill_dir/SKILL.md"
  errors=()

  if [[ ! -f "$file" ]]; then
    echo "✗ $folder — missing SKILL.md"
    FAIL=$((FAIL+1))
    continue
  fi

  first_line="$(head -1 "$file")"
  close_line="$(awk '/^---$/{n++; if(n==2){print NR; exit}}' "$file")"

  if [[ "$first_line" != "---" ]] || [[ -z "$close_line" ]] || [[ "$close_line" -gt 40 ]]; then
    errors+=("frontmatter must open on line 1 with '---' and close within the first 40 lines")
  fi

  name="$(awk -F': ' '/^name:/{print $2; exit}' "$file" | tr -d ' \r')"
  if [[ -z "$name" ]]; then
    errors+=("missing name field")
  elif [[ "$name" != "$folder" ]]; then
    errors+=("name '$name' does not match folder '$folder'")
  fi

  desc_lines="$(awk '/^description:/{flag=1; next} /^---$/{if(flag) exit} flag' "$file" | wc -l | tr -d ' ')"
  if [[ "$desc_lines" -lt 2 ]]; then
    errors+=("description field too short or missing")
  fi

  line_count="$(wc -l < "$file" | tr -d ' ')"
  if [[ "$line_count" -lt 40 ]]; then
    errors+=("body too short (${line_count} lines) for a functional skill")
  fi

  if ! grep -qEi '^#+\s*[0-9]*\.?\s*(PALETTE|TYPOGRAPHY|COMPOSITION|CONTENT|CHECKLIST)' "$file"; then
    errors+=("missing one of the required section headers (palette/typography/composition/content/checklist)")
  fi

  if ! grep -qi "checklist" "$file"; then
    errors+=("missing a checklist section")
  fi

  if (( ${#errors[@]} > 0 )); then
    echo "✗ $folder"
    for e in "${errors[@]}"; do echo "    - $e"; done
    FAIL=$((FAIL+1))
  else
    echo "✓ $folder — name matches, frontmatter OK, ${line_count} lines (${desc_lines}-line description)"
    PASS=$((PASS+1))
  fi
done

echo ""
echo "────"
echo "  $PASS passed, $FAIL failed"
[[ "$FAIL" -gt 0 ]] && exit 1
exit 0
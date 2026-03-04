#!/bin/bash
# QA Automation slash commands installer for Claude Code

set -e

COMMANDS_DIR="$HOME/.claude/commands"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$COMMANDS_DIR"

for cmd in "$SCRIPT_DIR"/commands/qa-*.md; do
  cp "$cmd" "$COMMANDS_DIR/"
  echo "  Installed: $(basename "$cmd")"
done

echo ""
echo "Done! Restart Claude Code, then use:"
echo "  /qa-test <URL or file>          Run a test"
echo "  /qa-sheet <Google Sheet URL>    Test from spreadsheet"
echo "  /qa-md <test description>       Generate test case"
echo "  /qa-suite <file or folder>      Run multiple tests"
echo "  /qa-validate <file>             Validate format only"

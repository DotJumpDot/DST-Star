#!/bin/sh
# Re-creates the vendored checkouts at the pins recorded in VENDORED.md.
#
# vendor/dsh-tui        — the tracked FORK (latest upstream dsh-TUI at the
#                         Star pin; our only code diff lives here)
# vendor/dsh-tui/vendor/dsh-std — upstream's submodule (empty dir in a bare
#                         clone; checked out at the submodule pin)
# vendor/deepseek-harness — untracked read-only reference (plugin APIs,
#                         tools, agent-team service)
set -eu
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

DSH_TUI_PIN="a0630f4b1f493e726c9a727dc075e1322c49b671"
DSH_STD_PIN="614dfa1ac168db79fcf4577cf0ebb34e2e3b944b"
HARNESS_PIN="ce7073d51254c26cd63b22a60835b8f948deb447"

if [ ! -f vendor/dsh-tui/package.json ]; then
  git clone https://github.com/ccch1mneyyy/dsh-TUI.git vendor/dsh-tui
  git -C vendor/dsh-tui checkout "$DSH_TUI_PIN"
  rm -rf vendor/dsh-tui/.git
fi

if [ ! -f vendor/dsh-tui/vendor/dsh-std/package.json ]; then
  git clone https://github.com/T-Auto/dsh-std.git vendor/dsh-tui/vendor/dsh-std
  git -C vendor/dsh-tui/vendor/dsh-std checkout "$DSH_STD_PIN"
  rm -rf vendor/dsh-tui/vendor/dsh-std/.git
fi

if [ ! -d vendor/deepseek-harness ]; then
  git clone --depth 1 https://github.com/deepseek-ai/deepseek-harness.git vendor/deepseek-harness
  git -C vendor/deepseek-harness checkout "$HARNESS_PIN" 2>/dev/null || true
  rm -rf vendor/deepseek-harness/.git
fi

echo "vendor checkouts ready."

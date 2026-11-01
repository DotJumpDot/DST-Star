# DST-Star bootstrap prompt (one-paste handoff)

Paste everything between the fences into a FRESH conversation. It is
self-contained: the agent needs nothing else from the session that wrote
this file.

```text
Set up DST-Star at C:\Code\DST-Star exactly per its own docs. Before
writing anything, read these three files in the repo and follow them as
the contract:

1. C:\Code\DST-Star\AGENTS.md  — house rules + the commit/push style
   (Type: summary + - [x] checklist + Verified: paragraph, via
   `git commit -F <file>`; one push = whole commits only).
2. C:\Code\DST-Star\Docs\PLAN_NOTES.md — the full phased plan. Execute
   Phase 1 (vendor + build), Phase 2 (profile + launchers + install),
   Phase 3 (identity: star theme + rebrand + shortcut), Phase 4 (verify
   + handoff docs), in order, updating the plan's checkboxes as you go.
3. C:\Code\DST-Star\Docs\BOOTSTRAP-PROMPT.md is this file — no action
   needed beyond heeding its rails.

WHAT DST-STAR IS: the third DST sibling. DST-Comet (C:\Code\Dsh_Tui_Comet)
is the bug-bounty harness with Constellation MCP and Agent-Teams plugins.
DST-Moon (C:\Code\DST-Moon) is the local-llama.cpp harness with a strict
workspace-write sandbox. DST-Star is the CLEAN DAILY DRIVER: the latest
upstream dsh-TUI kept as close to stock as possible, with Comet-style
comfort settings applied through the PROFILE (not code), cloud providers
with my own credentials, normal sandbox defaults. Launch command `dsts`
(dsh --profile dst-star). Repo: https://github.com/DotJumpDot/DST-Star
(remote already set; push with the house commit style).

HARD RAILS (violating any of these is a failed run):
- NO MCP servers, NO Agent-Teams/orchestra plugins, NO engine fork
  tarballs, NO bug-bounty tooling in Star. Ever. The bundle list is
  exactly ["@deepseek-ai/dsh-base", "@deepseek-harness-tui/dsh-tui"].
- NEVER copy or read credentials from DST-Comet's installed profile
  (~/.dsh/profiles/dsh-tui/cordis.patch.yml contains LIVE API keys and a
  Gmail app password). Star's profile is hand-written; I supply my own
  keys via the normal dsh onboarding flow (keep onboarding ENABLED).
- STATE ISOLATION: Star owns ~/.dst-star only. The paths.ts fork +
  bin/dsts launchers must pin DSH_TUI_STATE_DIR=%USERPROFILE%\.dst-star
  and DSH_TUI_SESSION_ROOT=%USERPROFILE%\.dst-star\sessions. Comet owns
  ~/.dsh-tui-comet, Moon owns ~/.dst-moon — a Star boot must never write
  to either (verify after first boot).
- MINIMAL DRIFT: the ONLY mandatory code diff vs upstream is
  vendor/dsh-tui/src/utils/paths.ts (data dir). Everything else is
  profile config or a documented Phase-3 identity change (star theme,
  wordmark, splash — each row in Docs/CHANGES.md).
- Never `npm install` the fork (workspace:* fails). Use
  `npx -y pnpm@11.21.0 install --config.nodeLinker=hoisted`.
- Do not touch Windows Terminal font settings (stock Cascadia Mono is
  intentional). Reply to me in English only. If a stat/number display
  ever comes up: plain single-color numbers, no gauges/sparklines.
- After changing bin/dsts.cmd, always re-copy it to
  %APPDATA%\npm\dsts.cmd (the PATH shim).

KEY REFERENCE PATHS:
- Clean structural reference for a profile row + launcher shape:
  C:\Code\DST-Moon\profile\cordis.patch.yml and C:\Code\DST-Moon\bin\
  (dstm.cmd/dstm) — copy the SHAPES, not the llama/provider content.
- Moon's paths.ts carries the exact resolveDataDir pattern to mirror.
- Moon's install-fork.bat shows the pack/install dance; Star's is
  simpler (no engine tarballs, no plugin deps).
- The icon already exists: assets/dst-star.ico (+ scripts/gen-star-icon.py
  to regenerate). Phase 3 wires it into the desktop shortcut via a
  cache-proof path (~/.dsh/icons/dst-star-v2.ico).

COMFORT SETTINGS THE PROFILE SHOULD CARRY (from Comet's defaults; verify
each key exists in the dump-config schema and drop the ones that don't):
lang en, fullscreen, terminalImages, pageMargin normal, toolBackground
none, oneLineToolCards, foldTerminalCommand, whaleIdle, whaleGirl,
companion skin whale, side panel open by default (if a config key
exists; otherwise a one-line documented code default is acceptable).

VERIFY STANDARD (Phase 2 & 4 gates): pnpm typecheck + compile clean;
dsh --profile dst-star --dump-config shows exactly 2 bundles, 0 MCP
rows, 0 agent-team rows; dsts boots in BOTH Git Bash and PowerShell/
Windows Terminal; ~/.dst-star created, sibling dirs untouched; Phase 3's
verify-star-transcript.tsx green. Capture real numbers in each commit's
Verified: paragraph. Update Docs/CHANGES.md, Docs/HANDOFF.md, HOW_TO_RUN
and CHANGELOG.md as you land phases, then push.

Start with Phase 1 now. Work autonomously phase by phase; ask me only
for my provider credentials choice (which cloud provider/key to log in
with) when the onboarding moment arrives.
```

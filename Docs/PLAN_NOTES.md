# Plan notes

Phase plan + version pins + deferred ideas. Update as phases complete;
completed phases get their CHANGELOG line on the day they land.

## Current phase

- Phase 0 (bootstrap) DONE. Phase 1 (vendor + build) DONE 2026-11-01
  (upstream pin `a0630f4`, one code diff, build green, packed).
  Phase 2 (profile + launchers + install) is next; execute via
  `Docs/BOOTSTRAP-PROMPT.md`.

## What DST-Star is (the one-paragraph spec)

The third DST sibling. Comet = bug-bounty + Constellation. Moon = local
llama.cpp + strict sandbox. **Star = the clean stock harness**: latest
upstream dsh-TUI, Comet's comfort settings (side panel, folded terminal
output, one-line tool cards, …), cloud providers with the user's own
credentials, normal sandbox/approval defaults. No MCP servers, no
Agent-Teams/orchestra plugins, no engine fork tarballs, no bug-bounty
tooling. Everything Star-owned: profile `dst-star`, data dir `~/.dst-star`,
session root `~/.dst-star/sessions`, launcher `dsts`.

## Architecture decisions (already made — do not relitigate)

1. **Minimal-fork strategy.** Star vendors the LATEST upstream dsh-tui
   (not Moon's tree, not Comet's tree) and keeps a code diff of as close
   to ONE file as possible: `src/utils/paths.ts` (data dir → `~/.dst-star`
   + `DSH_TUI_STATE_DIR` pin, mirroring the other two forks). Every other
   difference from stock is a **profile setting**, not a code change.
   Upstream had moved on since the family pin (`2957277`); take whatever
   is newest at setup time and RECORD the new pin in `VENDORED.md`.
2. **No engine forks.** The profile bundle list is
   `["@deepseek-ai/dsh-base", "@deepseek-harness-tui/dsh-tui"]` — no
   `dsh-experimental-*-agent-team*` rows, no local tarballs, so no
   version-exemption dance and no `engine/` directory at all.
3. **No MCP, no plugins dir.** Zero MCP servers ride the profile.
4. **Credentials: fresh, never inherited.** Comet's installed profile
   (`~/.dsh/profiles/dsh-tui/cordis.patch.yml`) contains LIVE credentials
   (API keys + a Gmail app password). Never copy, never quote it. Star's
   profile is hand-written; the user logs in / pastes their own key via
   the normal dsh flow. Keep the onboarding wizard ENABLED (unlike Moon,
   Star's users genuinely need to pick a cloud provider).
5. **Normal sandbox.** No `sandbox-policy` / `approval` override rows —
   Star inherits the dsh-tui bundle defaults. (Moon is the strict one.)
6. **Three-way state isolation is load-bearing.** Comet pins
   `~/.dsh-tui-comet`, Moon pins `~/.dst-moon`, Star pins `~/.dst-star` —
   each fork's `paths.ts` honors `DSH_TUI_STATE_DIR` AND each launcher
   exports it explicitly, so even a rebase that restores the upstream
   `~/.dsh-tui` default cannot collide the siblings.
7. **Identity (Phase 3, recommended):** a `star` theme in the icon's
   blue/starlight family (structure copied from `pink-night`, exactly as
   Moon copied it) + `DST·Star` wordmark + DST/STAR splash words, with
   `auto`-dark resolving to `star`. Palette starting point = the icon:
   ice-blue core `#CFE8FF`, star blue `#3E7BC8`, deep-navy neutrals
   `#0F1526`/`#1A2440`, steel border `#3A4C6A`.

## Phases

### Phase 0 — bootstrap (DONE, 2026-11-01)

- [x] Repo from the Project-Base template; AGENTS.md filled for Star;
      README family table; CHANGELOG opened.
- [x] `assets/dst-star.ico` (7 sizes 16–256) + `dst-star.png`, generated
      by `scripts/gen-star-icon.py` — family tile template (rounded night
      square, border, sparkles), Star v6: blue star, wide radial aura,
      hot core + cross-flare. Matches Comet (pink tile) and Moon (gold).
- [x] `Docs/PLAN_NOTES.md` (this file) + `Docs/BOOTSTRAP-PROMPT.md`.
- [x] git init, first house-style commit, push to
      `https://github.com/DotJumpDot/DST-Star` (`main`).

### Phase 1 — vendor + build (the fork comes to life) — DONE 2026-11-01

- [x] `scripts/setup-vendor.sh`: clones upstream dsh-TUI `a0630f4`
      (LATEST main 2026-11-01, family pin was `2957277`) into the tracked
      `vendor/dsh-tui/`, its dsh-std submodule `614dfa1` (empty dir in a
      bare clone — the pin lives in the parent tree, read it with
      `git ls-tree`), and the untracked `vendor/deepseek-harness/`
      reference `ce7073d`. Pins recorded in `VENDORED.md`.
- [x] `.gitignore` / `.gitattributes` carried from Phase 0 (already had
      the `vendor/deepseek-harness/` ignore + `!vendor/dsh-tui/scripts/lib/`
      negation + LF/CRLF rules) — verified working on the real tree.
- [x] Install `npx -y pnpm@11.21.0 install --config.nodeLinker=hoisted`
      (1m; prepare generated 77 settings, backend index claude+codex);
      baseline `pnpm run typecheck` + `pnpm run compile` both exit 0 on
      the UNTOUCHED tree before any diff.
- [x] The one code diff: `src/utils/paths.ts` — upstream at the new pin
      ships a plain `DATA_DIR = join(homeDir(), '.dsh-tui')` constant
      (no resolveDataDir); reintroduced the family fork shape
      (`DSH_TUI_DATA_DIR` → `DSH_TUI_STATE_DIR` → `~/.dst-star`), kept
      the new `expandHomePrefix` untouched. Verified the compiled
      `lib/types/utils/paths.js` carries the fork resolution.
- [x] Rebuilt green (typecheck 0, compile 0); `pnpm pack` → moved from
      package root to `dist/dst-star.tgz` (18.8 MB, fork lesson #2).

**Acceptance:** typecheck + compile green on the forked tree with only
paths.ts changed; `Docs/CHANGES.md` opened with that one row. ✔

### Phase 2 — profile + launchers + install — DONE 2026-11-01

1. `profile/cordis.patch.yml`, hand-written from scratch. Rows:
   - `dsh-tui` (name `@deepseek-harness-tui/dsh-tui`): NO `provider`/
     `model` pin (let onboarding/catalog decide), and the comfort
     settings from Comet's defaults — `lang: en`, `fullscreen: true`,
     `terminalImages: true`, `pageMargin: normal`, `toolBackground: none`,
     `oneLineToolCards: true`, `foldTerminalCommand: true`,
     `whaleIdle: true`, `whaleGirl: true`, `companion: { skin: whale }`.
     Verify each key against the installed Config schema
     (`dsh --profile dst-star --dump-config`) and drop any that don't
     exist upstream; add others the user names later.
   - NO llm-pi-ai row (cloud providers come from the built-in catalog +
     credentials), NO sandbox/approval rows, NO MCP rows, NO plugin rows.
2. `bin/dsts` (sh) + `bin/dsts.cmd`: mirror Moon's launchers minus the
   llama probe — `NODE_ENV=production`,
   `DSH_TUI_SESSION_ROOT=%USERPROFILE%\.dst-star\sessions`,
   `DSH_TUI_STATE_DIR=%USERPROFILE%\.dst-star`, `--resume` support
   (resume.txt), `exec dsh --profile dst-star "$@"`.
3. `scripts/install-fork.bat` (simplified from Moon's): pack guard,
   `dsh plugin --profile dst-star add dist\dst-star.tgz`, copy the
   profile patch to `~/.dsh/profiles/dst-star/`, init the profile
   `package.json` bundles list (decision #2). NO engine tarball moves,
   NO plugin pnpm-install, NO allow-version exemptions (none needed
   without local tarballs — if dsh still complains about the TUI
   tarball's version, grant exactly that one exemption and record it).
4. Copy `bin/dsts.cmd` to `%APPDATA%\npm\dsts.cmd` (the PATH shim —
   must be refreshed EVERY time bin/dsts.cmd changes; fork lesson #3).
   Optionally a `bin/dsts` shim for Git Bash PATH users.
5. `dsh --profile dst-star --dump-config`: assert exactly two bundles
   (dsh-base + the fork tarball), ZERO `mcp` rows, ZERO agent-team rows,
   the settings block present.

**Acceptance:** `dsts` boots the stock-looking TUI (post-onboarding) in
both Git Bash and Windows Terminal; `~/.dst-star/` exists and
`~/.dsh-tui`, `~/.dsh-tui-comet`, `~/.dst-moon` are untouched by a Star
boot. ✔ (2026-11-01 — both launchers booted in real console windows;
`~/.dst-star/settings.json` carries every comfort key incl.
`sidePanel.open: true`; 0 sibling files newer than the pre-boot markers;
the onboarding wizard is the first screen, waiting on the user's provider
choice.)

Phase-2 landed notes:
- `oneLineToolCards` DROPPED from the comfort set — the key no longer
  exists at the a0630f4 pin (upstream removed it; no rename found).
- `sidePanel.open: true` IS a config key at this pin — no code default
  needed.
- The install needed TWO exact-version exemptions (the anticipated one
  became two): the rc.5-line TUI bundle ships first-party plugins
  `@deepseek-ai/dsh-code-runtime-worker-thread@0.1.0-rc.6` and
  `@deepseek-ai/dsh-agent-presets@0.1.0-rc.6` whose requirement ranges
  read `^0.1.0-rc.6` against the installed dsh host `0.2.1-rc.2` — the
  same pairing Moon runs. `scripts/install-fork.bat` grants both before
  `dsh plugin add`. They are bundle internals riding the TUI tarball,
  NOT added plugins — the bundle list stays exactly the two Star rows.

### Phase 3 — identity (recommended, keeps Star findable at a glance)

1. `star` theme: copy `pink-night`'s structure into `starlightTheme`
   exactly the way Moon did (see `C:\Code\DST-Moon\vendor\dsh-tui\src\
   theme.ts` `moonNightTheme` + `MOON_BAR_RAMP` for the pattern): one
   hue family (starlight blue), `THEME_NAMES` entry, `getTheme` case,
   `auto`-dark slot resolves to star, `themeCatalog` BUILT_IN_BASE
   `star: 'dark'`, `isLightThemeActive` dark identity list.
2. Rebrand: `branding.ts` splash words DST/STAR + starlight tagline,
   `SidePanelColumn.tsx` `DST·Star` wordmark, settings hint text.
3. `scripts/verify-star-transcript.tsx` regression (adapt Moon's
   `verify-moon-transcript.tsx`): boot-screen wordmark, theme accent on
   a rendered transcript, plain single-color stats preserved.
4. Desktop shortcut `DST-Star.lnk` → `%APPDATA%\npm\dsts.cmd`, icon from
   a cache-proof path (`~/.dsh/icons/dst-star-v2.ico` — fresh filename
   beats the icon cache; fork lesson #4), created via a small python
   winreg/COM script (PowerShell inline eats backslashes; lesson #5).

**Acceptance:** shortcut + `dsts` both show the blue identity in both
shells; verify script green; icon correct in Explorer (no stale cache).

### Phase 4 — verify + handoff docs

1. Full pass: `pnpm typecheck`, `pnpm compile`, verify scripts,
   `dump-config` assertions, both shells boot, a real cloud session.
2. `Docs/CHANGES.md` complete file list; `Docs/HANDOFF.md` day-one
   state + gotchas; `Docs/HOW_TO_RUN.md` filled; `CHANGELOG.md` line.

## Version pins

- dsh CLI — whatever is globally installed (`npm i -g @deepseek-ai/dsh`,
  currently 0.2.1-rc.2) — shared by all three siblings, never forked.
- upstream dsh-tui — LATEST at Phase 1 time; record the exact commit in
  `VENDORED.md` (family reference pin was `2957277`, likely stale).
- pnpm — `11.21.0` via `npx -y`, `--config.nodeLinker=hoisted` — the
  fork toolchain (npm cannot install the workspace).

## Deferred / ideas

- `star` theme + rebrand — Phase 3 by default, but skippable if the user
  wants stock visuals first; the fork works without it.
- Local-model telemetry (Moon's TTFT/prefill rows) — NOT wanted here;
  Star is the cloud twin, stock behavior is the point.
- Star-specific verify scripts beyond the transcript regression — add
  when a Star change needs one.

## Family gotcha index (lessons that cost time on Moon/Comet)

1. `npm install` fails (`EUNSUPPORTEDPROTOCOL workspace:*`) — pnpm 11
   with hoisted linker only.
2. `pnpm pack` drops the tarball at the package ROOT, not `dist/`.
3. `%APPDATA%\npm\dsts.cmd` is a COPY — editing `bin/dsts.cmd` does
   nothing for PATH users until it is re-copied.
4. Windows icon cache: same-path icon updates don't refresh; use a new
   filename (`-v2`) for shortcut icon changes.
5. PowerShell inline scripts mangle backslashes — use python (winreg /
   short .py files) for registry/COM/shortcut work.
6. Windows grep emits CRLF — `sed 's/\r$//'` in pipelines; piped `| tail`
   masks exit codes — check output, not just `$?`.
7. Comet's installed profile has live credentials — never read it into
   this repo. Moon's profile (`C:\Code\DST-Moon\profile\cordis.patch.yml`)
   is the safe structural reference for what a profile row looks like.
8. The user's terminal font is stock Cascadia Mono — never touch Windows
   Terminal font settings without asking (a Thai-font experiment broke
   English kerning once and was fully reverted).
9. Commit messages via `git commit -F <file>` — inline heredocs through
   Git Bash can flatten newlines.

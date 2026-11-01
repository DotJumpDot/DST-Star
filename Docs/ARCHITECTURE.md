# Architecture

A map of how DST-Star is built. The fork lives in `vendor/dsh-tui`; the
rest of the repo is scaffolding around it.

## Overview

`dsts` (PATH shim → `bin/dsts.cmd` / `bin/dsts`) runs
`dsh --profile dst-star` with `DSH_TUI_STATE_DIR` / `DSH_TUI_SESSION_ROOT`
pinned to `~/.dst-star`. The profile (`profile/cordis.patch.yml`,
installed by `scripts/install-fork.bat`) carries the fork tarball
(`dist/dst-star.tgz`, packed from `vendor/dsh-tui`) plus comfort
settings; providers/credentials come from the stock catalog + onboarding.
Stack: Node ≥ 24, dsh CLI 0.2.1-rc.2, pnpm 11.21.0 (hoisted) for builds.

## Modules

- `vendor/dsh-tui/` — the fork. Upstream `a0630f4` (see `VENDORED.md`)
  plus the diff list in `Docs/CHANGES.md`: `src/utils/paths.ts` (data
  dir) + the Phase-3 identity files (`theme.ts`, `themeCatalog.ts`,
  `branding.ts`, `i18n.ts`, `scripts/verify-star-transcript.tsx`).
- `vendor/deepseek-harness/` — untracked read-only reference.
- `profile/cordis.patch.yml` — source of truth for Star's settings rows.
- `bin/dsts{,.cmd}` — launchers; copied to `%APPDATA%\npm` as shims.
- `scripts/` — `setup-vendor.sh` (recreate checkouts at pins),
  `install-fork.bat` (build/pack/install/pin bundles),
  `make-shortcut.js` (desktop .lnk), `gen-star-icon.py` (icon).
- `~/.dst-star/` — all Star state (settings, sessions, resume.txt).
  Siblings own `~/.dsh-tui-comet` / `~/.dst-moon`; never crossed.

## Data flow

User → `dsts` → dsh CLI (global) → profile `dst-star`
(bundles: `@deepseek-ai/dsh-base` + the fork tarball; patch layer =
comfort settings) → TUI renders under the `star` theme → cloud provider
via the built-in catalog with the user's own credentials. Preferences and
session logs write only under `~/.dst-star` (`paths.ts` DATA_DIR +
launchers' env pins make the isolation double-loaded).

## Decisions

- **2026-11-01 — latest upstream, not the family pin**: `a0630f4` over
  `2957277` — Star's identity is "latest stock"; re-justify every diff on
  re-vendor (the pin moved paths.ts/oneLineToolCards/tagline plumbing).
- **2026-11-01 — auto-dark → star**: the TUI's default `auto` theme
  resolves dark terminals to `starlightTheme` (Moon's convention), so a
  stock-config boot still shows the blue identity with zero settings.
- **2026-11-01 — comfort via profile only**: every Comet-style comfort
  row is config; `sidePanel.open` exists upstream, so no code default
  was needed. `oneLineToolCards` was dropped (key removed upstream).
- **2026-11-01 — no engine/ dir at all**: unlike Moon there are no
  tarball'd engine forks; the two rc.6 exact-version exemptions cover
  plugins that ride INSIDE the TUI bundle (see Docs/CHANGES.md).

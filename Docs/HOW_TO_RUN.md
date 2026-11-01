# How to run

DST-Star is the family's clean daily driver: the latest upstream dsh-TUI
with a one-file fork (data dir) plus profile comfort settings. Windows
first; verified in both Git Bash and PowerShell / Windows Terminal.

## Prerequisites

- Node ≥ 24 (dsh requires it) and the dsh CLI on PATH:
  `npm i -g @deepseek-ai/dsh` (this box: 0.2.1-rc.2, shared by all three
  siblings, never forked).
- pnpm is invoked through `npx -y pnpm@11.21.0` with
  `--config.nodeLinker=hoisted` — **never `npm install` the fork**
  (workspace:* protocol). pnpm 12 refuses bundledDependencies under the
  isolated linker.
- Python only for `scripts/gen-star-icon.py` (icon regeneration).

## Setup (fresh machine)

```bash
git clone https://github.com/DotJumpDot/DST-Star.git C:/Code/DST-Star
cd C:/Code/DST-Star
./scripts/setup-vendor.sh          # vendor/dsh-tui @ pin + harness reference
cmd //c "scripts\\install-fork.bat"   # build, pack, install profile
cp bin/dsts.cmd "$APPDATA/npm/dsts.cmd"   # PATH shim (re-copy on EVERY change)
cp bin/dsts "$APPDATA/npm/dsts"
cscript //nologo scripts/make-shortcut.js  # desktop shortcut + cache-proof icon
```

`install-fork.bat` is idempotent: rebuilds the fork when `lib/` is
missing, re-packs when `dist/dst-star.tgz` is missing, reinstalls the
tarball into the `dst-star` dsh profile, copies `profile/cordis.patch.yml`
to `~/.dsh/profiles/dst-star/`, and pins the bundle list to exactly
`["@deepseek-ai/dsh-base", "@deepseek-harness-tui/dsh-tui"]`. It also
grants the two documented rc.6 exact-version exemptions (see
Docs/CHANGES.md install-time note).

## Run

```bash
dsts            # anywhere (PATH shim) — launches dsh --profile dst-star
dsts --resume   # resume the session id recorded in ~/.dst-star/resume.txt
```

First boot opens the onboarding wizard: pick a cloud provider and supply
YOUR OWN key (the repo carries none). State lives in `~/.dst-star` only;
`DSH_TUI_STATE_DIR` / `DSH_TUI_SESSION_ROOT` are pinned by both launchers
so a rebase can never collide with DST-Comet (`~/.dsh-tui-comet`) or
DST-Moon (`~/.dst-moon`).

## Verify

```bash
cd vendor/dsh-tui
npx -y pnpm@11.21.0 run typecheck   # exit 0
npx -y pnpm@11.21.0 run compile     # exit 0
node --import tsx/esm scripts/verify-star-transcript.tsx  # 19/19 OK
npx -y pnpm@11.21.0 run verify:build                     # upstream suite

dsh --profile dst-star --dump-config  # exactly 2 bundles' rows, settings
                                      # block present, 0 agent-team rows,
                                      # 0 Star-added MCP rows
```

`verify:build` at the `a0630f4` pin on this box: **95/103, with all 8
fails accounted for** — 5 environment fails that also fail on a PRISTINE
upstream checkout (history-search stale-lock, terminal-images raster
assertion, session-mounts upstream fixture gate, runtime-themes
static-cache ordering, host-contract Windows symlink privilege), 2 suite
flakes that pass standalone on the full fork (rewind-edit,
initial-prompt), and 1 documented fork-data-dir fail (theme-preview
hardcodes `~/.dsh-tui/themes` for its probe fixtures while the fork
resolves themes from `~/.dst-star/themes` — same class as the family's
documented env-only fails; the upstream script is left untouched).

State isolation after a boot: no file in `~/.dsh-tui`, `~/.dsh-tui-comet`
or `~/.dst-moon` newer than a marker touched just before the launch.

## Re-vendor at a new upstream pin

See `VENDORED.md` (clone + submodule pin + re-apply Docs/CHANGES.md).
After re-vendoring, re-run install and re-verify.

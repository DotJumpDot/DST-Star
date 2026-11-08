# Vendored upstreams

DST-Star vendors the LATEST upstream dsh-TUI and keeps a code diff of as
close to one file as possible (`src/utils/paths.ts`, the data dir). Pins
live here so a rebase knows what we changed against. `scripts/setup-vendor.sh`
re-creates both checkouts at these pins.

| Path | Upstream | Pinned commit | Date |
|---|---|---|---|
| `vendor/dsh-tui` (tracked fork) | https://github.com/ccch1mneyyy/dsh-TUI | `224f847d02c2157f43862d2792cf9d7459222f4c` (tag v0.19.0) | 2026-11-06 |
| `vendor/dsh-tui/vendor/dsh-std` (upstream's submodule) | https://github.com/T-Auto/dsh-std | `614dfa1ac168db79fcf4577cf0ebb34e2e3b944b` | (submodule pin UNCHANGED at v0.19.0) |
| `vendor/deepseek-harness` (untracked, local reference only) | https://github.com/deepseek-ai/deepseek-harness | `ce7073d51254c26cd63b22a60835b8f948deb447` | 2026-10-30 |

The family reference pin was `2957277` (2026-10-24, Comet/Moon era); Star
started at `a0630f4` (0.18.0 / rc.5 dev line, 2026-11-01) and moved to tag
v0.19.0 in the 2026-11-09 family migration — a ZERO-conflict merge (Star's
32-file surface does not overlap the 0.18.0→0.19.0 upstream window). The
tree packages itself as `@deepseek-harness-tui/dsh-tui@0.19.0` and runs
against the global `@deepseek-ai/dsh@0.2.2-rc.1`.

## Why deepseek-harness is not in git

~180 MB of source treated as a read-only reference (plugin APIs, tools).
Star's product changes are all inside `vendor/dsh-tui`, and unlike Moon
there is no `engine/` fork at all — Star installs NO local tarballs beyond
the TUI pack itself.

## Re-vendoring at a new pin

```sh
rm -rf vendor/dsh-tui
git clone https://github.com/ccch1mneyyy/dsh-TUI.git vendor/dsh-tui
git -C vendor/dsh-tui checkout <commit>
rm -rf vendor/dsh-tui/.git
git clone https://github.com/T-Auto/dsh-std.git vendor/dsh-tui/vendor/dsh-std
git -C vendor/dsh-tui/vendor/dsh-std checkout <submodule-pin>   # git -C <tmp> ls-tree HEAD vendor/dsh-std
rm -rf vendor/dsh-tui/vendor/dsh-std/.git
# update the table above, then re-apply Docs/CHANGES.md
```

# Vendored upstreams

DST-Star vendors the LATEST upstream dsh-TUI and keeps a code diff of as
close to one file as possible (`src/utils/paths.ts`, the data dir). Pins
live here so a rebase knows what we changed against. `scripts/setup-vendor.sh`
re-creates both checkouts at these pins.

| Path | Upstream | Pinned commit | Date |
|---|---|---|---|
| `vendor/dsh-tui` (tracked fork) | https://github.com/ccch1mneyyy/dsh-TUI | `a0630f4b1f493e726c9a727dc075e1322c49b671` | 2026-11-01 |
| `vendor/dsh-tui/vendor/dsh-std` (upstream's submodule) | https://github.com/T-Auto/dsh-std | `614dfa1ac168db79fcf4577cf0ebb34e2e3b944b` | (submodule pin at the tree above) |
| `vendor/deepseek-harness` (untracked, local reference only) | https://github.com/deepseek-ai/deepseek-harness | `ce7073d51254c26cd63b22a60835b8f948deb447` | 2026-10-30 |

The family reference pin was `2957277` (2026-10-24, Comet/Moon era);
upstream moved on and Star took the newest main at setup time. The tree
at `a0630f4` targets the `0.2.1-rc.5` dev line (pnpm-workspace overrides)
and packages itself as `@deepseek-harness-tui/dsh-tui@0.18.0`.

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

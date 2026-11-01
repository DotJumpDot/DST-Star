# Handoff — day-one state + gotchas

Where DST-Star left off after the four-phase bootstrap (2026-11-01),
plus everything the next session should know before touching it.

## Day-one state

- All four phases DONE. Phases 1-3 committed (`ae4b4b2` vendor+build,
  `58b0138` profile+launchers, `c5d3bc6` identity), pushed to
  `https://github.com/DotJumpDot/DST-Star` main. Phase 4 (docs + final
  verify pass) lands with its own commit.
- The fork vendors upstream dsh-TUI `a0630f4` (2026-11-01) with the
  dsh-std submodule `614dfa1`; pins in `VENDORED.md`. The installed dsh
  host is `0.2.1-rc.2` (shared with the siblings).
- Code diff vs upstream: `src/utils/paths.ts` (data dir) + the five
  documented Phase-3 identity files — every row in `Docs/CHANGES.md`.
  Nothing else. If a change can be a profile setting, it MUST be.
- Installed and live: profile `dst-star` (bundle list exactly dsh-base +
  the fork tarball), `dsts` on PATH (shims in `%APPDATA%\npm`), desktop
  `DST-Star.lnk` with the cache-proof `~/.dsh/icons/dst-star-v2.ico`.
- Verification standing: typecheck/compile exit 0;
  `verify-star-transcript.tsx` 19/19; dump-config shows only the two
  bundles' rows with the full comfort-settings block; boots verified in
  Git Bash and via cmd/PowerShell in real consoles; `~/.dst-star` written,
  sibling dirs 0 writes across every boot test.

## The one open item: onboarding

The first REAL session still needs the user's cloud provider + key —
the onboarding wizard is intentionally enabled and the repo carries no
credentials. Everything else works headless of it (the wizard is the
first screen). Never copy DST-Comet's installed profile: it contains
live API keys.

## Gotchas (beyond the family index in PLAN_NOTES.md)

1. **Upstream moved since the family pin.** `a0630f4` ≠ Moon's `2957277`:
   `paths.ts` lost its `resolveDataDir` (we re-added it),
   `oneLineToolCards` is gone (dropped from the comfort set),
   the deepseek tagline routes through i18n `logo-tagline` (not
   BRAND_TAGLINE), and Moon's sidebar BrandHeader wordmark doesn't exist
   upstream — Star ports it (sidebarBrand.ts + SidebarMascot.tsx +
   SidePanelColumn/Layout; top placement only, no `sidebarLogoPosition`
   setting chain).
2. **dsh-std is a SUBMODULE upstream now.** A bare clone leaves
   `vendor/dsh-tui/vendor/dsh-std` empty; `scripts/setup-vendor.sh`
   checks it out at the pin (read the pin with `git ls-tree HEAD
   vendor/dsh-std` on a temp clone — the parent's .git is stripped).
3. **Two exact-version exemptions ride the install** (bundle-internal
   plugins `dsh-code-runtime-worker-thread@0.1.0-rc.6` and
   `dsh-agent-presets@0.1.0-rc.6` vs host `0.2.1-rc.2`) — the installer
   grants them; they are not added plugins; the bundle list stays two.
4. **Harness theming gotcha:** in headless verify scripts,
   `DSH_TUI_THEME` alone does NOT theme a bare render (ThemeProvider's
   `active` stays null → dark). Mount `<ThemeProvider theme="star">`.
   Prove the palette is live via markdown-baked SGR (permission/subtle),
   not the accent — a plain transcript never paints accent.
5. **The stock dump contains an `mcp-resources` row** — that's dsh-base
   internals (Moon's dump has it too), NOT an MCP server Star added.
   "0 MCP rows" means zero rows Star's patch contributes.
6. **Shortcut creation is `scripts/make-shortcut.js` via cscript**, not
   the planned python: pywin32 is absent and the ctypes-vtable attempt
   was fragile. File-based JScript still avoids the inline-PowerShell
   backslash mangling. Re-run it any time; readback self-verifies.
7. **`dsts.cmd` on PATH is a COPY.** After editing `bin/dsts.cmd`,
   re-copy to `%APPDATA%\npm\dsts.cmd` (and `bin/dsts` → `%APPDATA%\npm\dsts`
   for Git Bash PATH users).
8. **Stats rail:** if any stat/number display ever changes, it stays
   plain single-color digits — no gauges/sparklines
   (verify-star-transcript.tsx locks the digit-line rule).
9. **Fork-added features that upstream doesn't have (2026-11-02 Comet
   parity pass):** the PanelBar navigator (upstream at a0630f4 ships a
   centered-title carousel — a rebase must re-apply the navigator file),
   one-line tool cards (`dsh-tui.oneLineToolCards`, default ON, wiring
   mirrors foldTerminalCommand at every layer), and the MCP display
   naming (`mcpToolDisplayName` in AssistantToolUseMessage). The MCP name
   shows on cards whose view has NO title; a structured card view with
   its own title still renders the title (upstream behavior).
10. **The TUI writes user rows into the INSTALLED profile patch**
    (`~/.dsh/profiles/dst-star/cordis.patch.yml`): a custom cloud
    provider added via `/provider`, plugin-manager changes. The installer
    therefore MERGES instead of copying (`scripts/merge-patch.mjs`): the
    repo patch stays the source of truth for its rows, user-only rows are
    carried over, and a timestamped `.bak` is kept. Never reinstall with a
    blind copy — that wiped the user's provider once (2026-11-02).
11. **The splash font rotates by local date** (`dsh-tui.splashFont:
    daily` is upstream's default; Nov 1-2 land on the `stencil` cutout
    face, which reads as broken glyphs). Star pins `splashFont: bold` in
    the profile. All siblings rotate the same way — Comet/Moon look
    "weird" on the same days; fix per-profile there if wanted.

## Next steps, in order

1. User onboards (provider + own key) and runs a real cloud session.
2. Rebase drill when wanted: upstream moves → re-vendor per VENDORED.md →
   re-apply Docs/CHANGES.md rows → rebuild/repack/reinstall → verify.
3. Comfort-setting tweaks go in `profile/cordis.patch.yml` (then re-run
   install-fork.bat or copy the file to the profile dir).

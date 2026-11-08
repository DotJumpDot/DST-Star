# Modified files (vs upstream pin `224f847d` / v0.19.0)

House rule: one line per file, why it changed. New upstream pins re-apply
this list. Commits and pushes follow the AGENTS.md commit style.

Upstream migration round (2026-11-09, whole family with DST-Comet +
DST-Moon: TUI 0.18.0 → 0.19.0, global engine 0.2.1-rc.2 → 0.2.2-rc.1):
`vendor/dsh-tui` merged onto upstream tag v0.19.0 with ZERO conflicts —
Star's 32-file surface (paths.ts data dir, star/green-night/red-night
themes, branding, navigator/one-line-card parity, verify-star-transcript)
does not overlap anything upstream changed in the 0.18.0→0.19.0 window,
so the merge brought upstream's #1794 channel hints, session-restore
batch, /update, onboarding login, git-worktree plugin and Agent.model
selection in whole. `patch-surface.snapshot.json` regenerated. The dsh-std
submodule pin is UNCHANGED (`614dfa1`) at v0.19.0. Star installs no engine
tarballs — the `dst-star` profile rides the global host, now
`@deepseek-ai/dsh@0.2.2-rc.1` (installed with allow-scripts so node-pty /
koffi natives rebuilt). Profile patch-yml unchanged vs pre-install
snapshot. Fresh `dsts` required.

The ONLY mandatory code diff is `src/utils/paths.ts` (fork data dir). Every
Phase-3 identity row below is deliberate, documented drift — re-justify
each on a rebase. Everything else about Star is profile config
(`profile/cordis.patch.yml`), not code.

| File | Why |
|---|---|
| `src/utils/paths.ts` | DST-Star fork: `DATA_DIR` resolves `DSH_TUI_DATA_DIR` (tests) → `DSH_TUI_STATE_DIR` (launcher pin) → `~/.dst-star`; header + backendDataDir doc comments updated to name the fork default. Same shape as the DST-Moon/DST-Comet forks. |
| `src/theme.ts` | DST-Star identity: `STAR_BAR_RAMP` + `starlightTheme` (pink-night's structure recolored to ONE starlight-blue family — accent #8FC1F2, ice shimmer #CFE8FF, deep-navy tool cards #1A2440/#0F1526 ink, steel borders #3A4C6A, functional escapes kept); `'star'` in THEME_NAMES, `getTheme` case, **auto-dark resolves to star**, starlightTheme in `isLightThemeActive`'s dark identity list. |
| `src/themeCatalog.ts` | `BUILT_IN_BASE` gains `star: 'dark'` (the catalog Record is total over THEME_NAMES). |
| `src/theme.ts` (green/red, 2026-11-02) | User ask: `greenNightTheme` + `redNightTheme` — the same pink-night recipe as star, rotated to ONE hue family each (emerald `#8FD9A8` over forest neutrals / soft rose-red `#F09A9A` over wine neutrals, GREEN_BAR_RAMP / RED_BAR_RAMP). Registered in THEME_NAMES (star's dark-family group), `getTheme` cases, `isLightThemeActive`'s dark identity list, catalog base `dark`. Functional escapes kept; collisions solved per family (green: deeper keyword green + brighter mint success; red: accent stays lighter than the alarm error). |
| `src/branding.ts` | deepseek splash words → `DST` / `STAR` / `DST Star` (Moon's convention). |
| `src/i18n.ts` | `logo-tagline` → the starlight tagline (zh 星海日常… / en "The starlight terminal,\npowered by your cloud models"); at this pin the deepseek-brand tagline routes through i18n, not BRAND_TAGLINE. |
| `scripts/verify-star-transcript.tsx` | NEW — 19-check regression: splash words + tagline, star palette identity + auto resolution + dark role, a rendered Chat transcript carrying star markdown SGR (permission inline-code, subtle quote-bar — needs an explicit `<ThemeProvider theme="star">`; the env var alone leaves the provider's `active` null), digit-line stats rail (no gauge/sparkline glyphs). |
| `src/components/Whale.tsx` | Export the sprite palette as `WHALE_PALETTE` (read-only alias of the local `PALETTE`) so the sidebar mascot samples the same art (Moon's convention). |
| `src/components/sidePanel/sidebarBrand.ts` | NEW (ported from Moon) — sidebar mascot store: whale girl → whale → none click cycle persisted in `<DATA_DIR>/sidebar-logo.json` (`~/.dst-star`), plus the brand-header height ladder (`sidebarBrandRows`, compact 2-row strip under 30 terminal rows or a 42-col panel, 8-row mascot + gap above). |
| `src/components/sidePanel/SidebarMascot.tsx` | NEW (ported from Moon) — the whale girl / pixel whale sampled to a 22-col half-block sprite beside the wordmark (mode-downsample keeps the face). |
| `src/components/sidePanel/SidePanelColumn.tsx` | `BrandHeader` (mascot + `DST·Star vX` wordmark + live model·effort line) rides above the PanelBar; host height subtracts the brand rows. Top placement only — Moon's `sidebarLogoPosition: bottom` setting chain was deliberately NOT ported (a whole settings-schema feature; the top header is the Comet look Star wanted). |
| `src/components/sidePanel/SidePanelLayout.tsx` | The divider's top junction tee follows the brand-header height (`sidebarBrandRows(...) + 1`) instead of hard-coded row 1. |
| `scripts/verify-side-panel-{layout,mouse,resize,scroll-paint,registry,todo,jobs,agents}-*.tsx(x)` | Brand-aware: row-indexed assertions offset by the header height (or find the bar by its nav arrows), the todo fixture's wheel events aim at live list rows, layout gains the `sidebarBrandRows` height-ladder unit checks. |
| `src/components/sidePanel/PanelBar.tsx` | DST-Star port (Comet navigator, 2026-11-02): the bar shows ONLY the active panel's icon + title between ◀/▶ arrows (with badge tones on the arrows) — upstream at a0630f4 renders a centered-title carousel with every panel's icon + unread counts. Arrows cycle/wrap the panel order; ⤢ unchanged. |
| `src/components/messages/AssistantToolUseMessage.tsx` | DST-Star port (Comet, 2026-11-02): (1) `mcpToolDisplayName` — `mcp__<server>__<tool>` reads `MCP › Server › Tool Words` (`browser_`/`_unsafe` dropped, NAME_ACRONYMS kept uppercase), plus a dim `›` before args on title-less cards; (2) one-line cards — a settled terminal/MCP/Read/Grep card keeps its header line only with a persistent `▸` (the row click / Ctrl+O expands; running cards, error verdicts, split diffs and SendMessage relays keep their bodies); (3) `HeaderTitle.singleLine` flattens multi-line titles to one pre-cut row (tooltip still discloses the original). |
| `src/dsh-adapter/index.ts`, `src/dsh-adapter/channel/state.ts`, `src/dsh-adapter/channel/preferences.ts`, `src/dsh-adapter/plugin.ts`, `src/adapter/ports/channel-ui.ts`, `src/adapter/channel/ui-policy.ts` | the `dsh-tui.oneLineToolCards` setting chain (fork key, default ON), mirroring `foldTerminalCommand`'s wiring at every layer: Config schema + doc, channel state/init/setter, seed + settings-user schema + applyDisplay + /settings field, ChannelUi port member + setter, effects inventory. |
| `src/components/MessageList.tsx`, `src/components/messages/TranscriptLeaves.tsx`, `src/screens/Chat.tsx` | prop plumbing for `oneLineToolCards` down to the tool cards. |
| `src/components/SubagentDetailScene.tsx` | the subagent DETAIL page pins `oneLineToolCards={false}` — result previews stay visible there. |
| `src/settings/definitions.ts` | the `oneLineToolCards` row (conversation group, zh/en). |
| `scripts/verify-star-transcript.tsx` | +8 checks: one-line hiding/flattening/▸/Ctrl+O and the `MCP › Constellation › Run Code` naming (27 total). |
| `scripts/verify-side-panel-{mouse,registry,layout}.tsx` | navigator contract replaces the carousel assertions (arrow cycling, only-active-icon, keyboard → routing in the registry fixture). |
| `profile/cordis.patch.yml` | `oneLineToolCards: true` joins the comfort rows (explicit even though the fork default is ON). |
| `scripts/merge-patch.mjs` (repo scaffolding) | NEW — installer merge: the repo profile patch stays the source of truth; top-level rows that exist only in the INSTALLED patch (written by the TUI's /provider editor or the plugin manager) are carried over verbatim; timestamped `.bak` before every write. The old blind `copy /y` erased the user's custom provider on every reinstall. |
| `scripts/install-fork.bat` | the patch step is the merge, not a copy. |

Install-time note (not a file diff): the a0630f4 bundle's first-party
plugins `@deepseek-ai/dsh-code-runtime-worker-thread@0.1.0-rc.6` and
`@deepseek-ai/dsh-agent-presets@0.1.0-rc.6` declare `^0.1.0-rc.6`
requirements while the installed dsh host is `0.2.1-rc.2`;
`scripts/install-fork.bat` grants exactly those two exact-version
exemptions before `dsh plugin add` (same pairing DST-Moon runs).

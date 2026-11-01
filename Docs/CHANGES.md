# Modified files (vs upstream pin `a0630f4`)

House rule: one line per file, why it changed. New upstream pins re-apply
this list. Commits and pushes follow the AGENTS.md commit style.

The ONLY mandatory code diff is `src/utils/paths.ts` (fork data dir). Every
Phase-3 identity row below is deliberate, documented drift — re-justify
each on a rebase. Everything else about Star is profile config
(`profile/cordis.patch.yml`), not code.

| File | Why |
|---|---|
| `src/utils/paths.ts` | DST-Star fork: `DATA_DIR` resolves `DSH_TUI_DATA_DIR` (tests) → `DSH_TUI_STATE_DIR` (launcher pin) → `~/.dst-star`; header + backendDataDir doc comments updated to name the fork default. Same shape as the DST-Moon/DST-Comet forks. |
| `src/theme.ts` | DST-Star identity: `STAR_BAR_RAMP` + `starlightTheme` (pink-night's structure recolored to ONE starlight-blue family — accent #8FC1F2, ice shimmer #CFE8FF, deep-navy tool cards #1A2440/#0F1526 ink, steel borders #3A4C6A, functional escapes kept); `'star'` in THEME_NAMES, `getTheme` case, **auto-dark resolves to star**, starlightTheme in `isLightThemeActive`'s dark identity list. |
| `src/themeCatalog.ts` | `BUILT_IN_BASE` gains `star: 'dark'` (the catalog Record is total over THEME_NAMES). |
| `src/branding.ts` | deepseek splash words → `DST` / `STAR` / `DST Star` (Moon's convention). |
| `src/i18n.ts` | `logo-tagline` → the starlight tagline (zh 星海日常… / en "The starlight terminal,\npowered by your cloud models"); at this pin the deepseek-brand tagline routes through i18n, not BRAND_TAGLINE. |
| `scripts/verify-star-transcript.tsx` | NEW — 19-check regression: splash words + tagline, star palette identity + auto resolution + dark role, a rendered Chat transcript carrying star markdown SGR (permission inline-code, subtle quote-bar — needs an explicit `<ThemeProvider theme="star">`; the env var alone leaves the provider's `active` null), digit-line stats rail (no gauge/sparkline glyphs). |

Install-time note (not a file diff): the a0630f4 bundle's first-party
plugins `@deepseek-ai/dsh-code-runtime-worker-thread@0.1.0-rc.6` and
`@deepseek-ai/dsh-agent-presets@0.1.0-rc.6` declare `^0.1.0-rc.6`
requirements while the installed dsh host is `0.2.1-rc.2`;
`scripts/install-fork.bat` grants exactly those two exact-version
exemptions before `dsh plugin add` (same pairing DST-Moon runs).

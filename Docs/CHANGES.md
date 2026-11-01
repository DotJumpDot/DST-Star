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

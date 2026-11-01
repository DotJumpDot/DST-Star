# Changelog

One line per meaningful change, newest first. Format:
`YYYY-MM-DD — what`. A bigger pass may take a short indented bullet
list under its date line. Entries mirror the commit log; commits
themselves follow the style in `AGENTS.md`.

- 2026-11-01 — Phase 1 vendor + build (the fork comes to life): vendored
  LATEST upstream dsh-TUI `a0630f4` (2026-11-01; family pin was 2957277)
  with its dsh-std submodule `614dfa1` + deepseek-harness reference
  `ce7073d` via scripts/setup-vendor.sh; pins recorded in VENDORED.md;
  baseline typecheck+compile green on the untouched tree; the ONE code
  diff applied — vendor/dsh-tui/src/utils/paths.ts DATA_DIR resolves
  DSH_TUI_DATA_DIR → DSH_TUI_STATE_DIR → ~/.dst-star (Moon's pattern);
  rebuilt green, packed to dist/dst-star.tgz (18.8 MB); Docs/CHANGES.md
  opened.
- 2026-11-01 — Phase 0 bootstrap (planning only, no fork work): AGENTS.md
  filled for Star's identity (minimal-drift fork, no MCP/no agent-teams/no
  engine tarballs, three-way state isolation, no Comet credentials);
  README family table; Docs/PLAN_NOTES.md full phased plan (P1 vendor+
  build, P2 profile+launchers, P3 identity/shortcut, P4 verify) with the
  architecture decisions and the family gotcha index;
  Docs/BOOTSTRAP-PROMPT.md one-paste handoff; assets/dst-star.ico family
  tile v6 (blue star, wide radial aura, hot core + cross-flare, 7 sizes
  16-256; regenerable via scripts/gen-star-icon.py); .gitignore vendor
  rules + .gitattributes LF/CRLF; git init + first push.
- 2026-10-26 — Base project scaffold: README, AGENTS.md (house rules +
  commit & push style contract), CHANGELOG, `Docs/` starter set (index,
  architecture, how-to-run, plan notes, handoff), .gitignore; initial
  commit made in the house style via `git commit -F`.

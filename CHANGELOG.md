# Changelog

One line per meaningful change, newest first. Format:
`YYYY-MM-DD — what`. A bigger pass may take a short indented bullet
list under its date line. Entries mirror the commit log; commits
themselves follow the style in `AGENTS.md`.

- 2026-11-03 — Fix: red-night reworked to opencode's signal red (user
  ask) — the rose #F09A9A accent read pink, so the palette re-anchors
  on opencode's input-bar red sampled off the user's screenshot
  (#FF3E30): salmon shimmer, warm clay second voice, near-black ember
  neutrals (#201110 cards, pure-black input like opencode), umber→
  salmon bar ramp; alarm error shifted cool crimson #F04258 to stay
  distinct from the warm accent; green/cyan/amber escapes kept.
  verify-star-transcript expectations updated, 38/38.
- 2026-11-02 — Fix: desktop shortcut auto-sent the start-in folder as
  the first prompt — Desktop\DST-Star.lnk carried a stale Arguments
  field (C:\Users\jamej) since bootstrap; dsts.cmd forwards positionals
  to dsh and the TUI's initial-prompt path submitted it as a first user
  message on every launch. scripts/make-shortcut.js now clears
  Arguments explicitly (WScript keeps fields it doesn't set when
  re-saving an existing .lnk) and self-verifies the readback; shortcut
  regenerated — a boot through it now lands with no session.
- 2026-11-02 — Feat: green-night + red-night themes (user ask) —
  pink-night's structure rotated to one hue family each, exactly like
  star: greenNightTheme (emerald accent #8FD9A8, mint shimmer, forest
  tool cards/ink, GREEN_BAR_RAMP) and redNightTheme (soft rose-red
  accent #F09A9A kept lighter than the alarm error, wine tool
  cards/ink, RED_BAR_RAMP); registered as dark-role built-ins next to
  star. verify-star-transcript grew to 38 checks (11 new: palette
  identity, distinctness, dark roles). Fork repacked + reinstalled —
  the installer's first real merge run preserved the user's llm-pi-ai
  provider row (the bug-2 fix working in production).
- 2026-11-02 — Fix: splash font pinned. The "twisted/deformed" splash
  glyphs were upstream's date-rotated splash font — Nov 1-2 land on the
  `stencil` cutout face (all siblings rotate the same way; stock looks
  "normal" because its data dir holds a user-set font). Star pins
  `dsh-tui.splashFont: bold` in the profile (stock look every day); the
  deepseek-brand big words remain DEEPSEEK/HARNESS by upstream design at
  this pin (the font table carries them; BRAND_SPLASH_WORDS only drives
  other brands + the narrow plain name).
- 2026-11-02 — Fix: installer stops erasing the user's provider. The TUI
  persists /provider rows into the INSTALLED profile patch; the
  installer's blind copy wiped them on every harness-fix reinstall.
  scripts/merge-patch.mjs (NEW) merges instead: repo patch stays source
  of truth, user-only rows carried verbatim, timestamped .bak kept;
  install-fork.bat uses it. Re-add your provider once — after this it
  survives reinstalls.
- 2026-11-02 — Comet parity pass (user ask): PanelBar swapped to the
  Comet navigator (only the active panel's icon + title between the
  arrows — no more icon wall); one-line tool cards ported (settled
  Pwsh/Read/Grep/MCP cards keep their header line with a persistent ▸,
  Ctrl+O/click expands; errors/diffs/running keep previews; setting
  dsh-tui.oneLineToolCards, default on, full plumbing chain); MCP cards
  named `MCP › Server › Tool Words` with a dim › before args; header
  titles flatten to one pre-cut row. verify-star-transcript 27 checks
  (8 new); mouse/registry/layout moved to the navigator contract;
  verify:build 94/103 with the same known 8 + verify:btw suite-flake
  (passes standalone). Fork repacked/reinstalled; boot + isolation
  re-verified.
- 2026-11-01 — Day-one fix: Comet-style sidebar brand header ported. The
  Phase-3 plan's `DST·Star` wordmark had been skipped (upstream at the
  new pin has no BrandHeader); ported from Moon: sidebarBrand.ts (mascot
  click-cycle store, persists to ~/.dst-star/sidebar-logo.json) +
  SidebarMascot.tsx (22-col half-block sprite) + SidePanelColumn
  BrandHeader (mascot + DST·Star vX + model·effort above the panel bar)
  + SidePanelLayout tee row; Whale.tsx exports WHALE_PALETTE; 8
  side-panel verify scripts made brand-aware (row offsets / arrow-anchored
  bar lookups / wheel aimed at live list rows); top placement only (no
  sidebarLogoPosition setting chain). Fork repacked + reinstalled; boot
  re-verified (siblings 0 writes).
- 2026-11-01 — Phase 4 verify + handoff docs (bootstrap complete):
  full verification pass — typecheck/compile exit 0, star regression
  19/19, upstream verify:build 95/103 with all 8 fails classified
  against a PRISTINE upstream checkout (5 env: history-search,
  terminal-images, session-mounts, runtime-themes, host-contract
  symlink; 2 suite flakes passing standalone: rewind-edit,
  initial-prompt; 1 documented fork-data-dir: theme-preview hardcodes
  ~/.dsh-tui/themes); Docs/HANDOFF.md (day-one state + gotchas),
  HOW_TO_RUN.md and ARCHITECTURE.md filled, README status → live,
  PLAN_NOTES phases closed. Remaining user step: cloud-provider
  onboarding.
- 2026-11-01 — Phase 3 identity (star theme + rebrand + shortcut):
  starlightTheme (pink-night structure recolored to one starlight-blue
  family: accent #8FC1F2, ice shimmer #CFE8FF, navy cards/ink, steel
  borders; STAR_BAR_RAMP) registered as 'star' with auto-dark resolving
  to it; splash words DST/STAR + starlight tagline (i18n logo-tagline);
  scripts/verify-star-transcript.tsx NEW (19 checks: brand words,
  palette identity/auto/dark-role, rendered-transcript star SGR via
  ThemeProvider lock, plain-digit stats rail); desktop DST-Star.lnk →
  %APPDATA%\npm\dsts.cmd with cache-proof ~/.dsh/icons/dst-star-v2.ico
  via scripts/make-shortcut.js (cscript/WScript — ctypes-COM python was
  fragile, pywin32 absent); fork repacked + reinstalled; boot verified
  again (process alive, ~/.dst-star only, siblings 0 writes).
- 2026-11-01 — Phase 2 profile + launchers + install (dsts boots):
  profile/cordis.patch.yml hand-written (no provider pin, onboarding
  enabled; comfort keys lang/fullscreen/terminalImages/pageMargin/
  toolBackground/foldTerminalCommand/whaleIdle/whaleGirl/
  companion.skin/sidePanel.open verified against the a0630f4 schema;
  oneLineToolCards dropped — removed upstream); bin/dsts + bin/dsts.cmd
  launchers (DSH_TUI_STATE_DIR + DSH_TUI_SESSION_ROOT pins, --resume);
  scripts/install-fork.bat (pack guard, dsh plugin add with the two
  documented rc.6 exact-version exemptions, patch copy, bundle list
  pinned to exactly dsh-base + dsh-tui); PATH shims copied to
  %APPDATA%\npm. Verified: dump-config shows only the two bundles' rows
  + settings block, 0 added MCP / 0 agent-team rows; dsts booted in real
  consoles via both launchers; ~/.dst-star created and populated; 0
  files newer than pre-boot markers in ~/.dsh-tui and ~/.dst-moon.
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

# DST-Star

**DST** = **D**eep**S**eek **T**erminal. DST-Star is the family's clean
daily driver: the **latest upstream dsh + dsh-TUI**, kept as close to stock
as a fork can be, with DST-Comet's comfort settings and **none** of the
specialized machinery — no Constellation MCP, no orchestra / Agent-Teams
plugins, no bug-bounty tooling, no engine fork tarballs. `dsts` launches
it (**DST Star**).

```
dsts  →  dsh --profile dst-star  →  near-stock dsh-tui (latest pin)  →  your cloud provider
```

## The family

| | DST-Comet | DST-Moon | DST-Star |
|---|---|---|---|
| Purpose | bug-bounty orchestra + Constellation MCP | local llama.cpp, strict sandbox | **clean latest TUI, daily driver** |
| dsh profile | `dsh-tui` | `dst-moon` | `dst-star` |
| TUI state dir | `~/.dsh-tui-comet` | `~/.dst-moon` | `~/.dst-star` |
| Session logs | `~/.dsh/sessions` | `~/.dst-moon/sessions` | `~/.dst-star/sessions` |
| Provider | cloud (Comet creds) | `llama-local` 127.0.0.1:8080 | cloud, **your own keys** |
| Sandbox | TUI defaults | workspace-write + ask | TUI defaults (normal) |
| MCP servers | Constellation | none | **none** |
| Engine forks | agent-team tarballs | `-moon.1` tarballs | **none** |

All three are fully isolated from each other (own profile, own data dir,
own session root, launcher-pinned `DSH_TUI_STATE_DIR`). Nothing is shared
except the dsh CLI itself.

## Status

**Planning — bootstrap only.** The repo currently holds the contract
(`AGENTS.md`), the family icon tile (`assets/dst-star.ico` — blue star
with wide aura, regenerable via `scripts/gen-star-icon.py`), the full
build plan ([`Docs/PLAN_NOTES.md`](Docs/PLAN_NOTES.md)) and the one-shot
prompt that executes it ([`Docs/BOOTSTRAP-PROMPT.md`](Docs/BOOTSTRAP-PROMPT.md)).
No vendor tree, no profile, no launcher yet — those are Phase 1+.

## Docs index

- [`AGENTS.md`](AGENTS.md) — working rules + commit & push style (read first)
- [`Docs/PLAN_NOTES.md`](Docs/PLAN_NOTES.md) — the full phased build plan
- [`Docs/BOOTSTRAP-PROMPT.md`](Docs/BOOTSTRAP-PROMPT.md) — one-prompt handoff for a fresh session
- [`Docs/README.md`](Docs/README.md) — documentation index
- [`CHANGELOG.md`](CHANGELOG.md) — newest-first work log

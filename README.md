# OI Sample Management Runtime

GSK Human Biological Sample Management — Deno EaC runtime with Preact + Tailwind.

## Getting Started

```bash
deno task dev
```

Opens at [http://localhost:5418](http://localhost:5418).

## Tasks

| Task | Description |
|------|-------------|
| `deno task dev` | Start dev server with file watching |
| `deno task build` | Format, lint, publish check, test |
| `deno task start` | Start production server |
| `deno task test` | Run tests |

## Project Structure

```
├── apps/
│   ├── dashboard/     # Main dashboard (5-pane)
│   ├── receive/       # Manifest intake + barcode scanning
│   ├── track/         # Sample status, search, lifecycle
│   ├── report/        # ALCOA+ audit trail + ethics approval
│   ├── assets/        # Static files
│   └── tailwind/      # Theme CSS (3 themes: OI, GSK, Fathym Light)
├── configs/           # Runtime + icon configuration
├── src/
│   ├── logging/       # Runtime logging provider
│   ├── plugins/       # RuntimePlugin (kitchen sink) + processor resolver
│   ├── state/         # OISampleMgmtWebState
│   └── utils/         # Theme resolution + demo access roles
├── tests/             # Test infrastructure
├── main.ts            # Production entry
├── dev.ts             # Dev entry (EAC_RUNTIME_DEV + PORT=5418)
├── tailwind.config.ts # Semantic token config
└── deno.jsonc         # Package config + import map
```

## Themes

Switch themes via `?theme=` query parameter:

- `oi` — OI Dark-Neon (default)
- `gsk` — GSK branded
- `fathym-light` — Fathym Light

## Demo Roles

Switch roles via `?demo_role=` query parameter:

`sample_manager` · `qa_auditor` · `lab_manager` · `study_coordinator` · `read_only` · `hbsm_custodian` · `study_lead` · `csv_group_head` · `scientist`

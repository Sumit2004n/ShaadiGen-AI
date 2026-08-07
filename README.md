# ShaadiGen AI

Monorepo for the Generative AI Indian wedding platform.

```
ShaadiGen-AI/
├── shaadigen-ai-classic/   # Next.js classic MVP (6 modules)
├── shaadigen-backend/      # FastAPI Clean Architecture API
├── docker/                 # local postgres, redis, api, worker
├── docs/architecture/      # backend architecture
└── Makefile
```

## Quick start

### Backend stack (API + Postgres + Redis + Celery)

```bash
make up
curl http://localhost:8000/api/v1/health
curl http://localhost:8000/api/v1/auth/status
```

Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Classic frontend

```bash
make frontend-install
cp shaadigen-ai-classic/.env.example shaadigen-ai-classic/.env.local
make dev-frontend
```

Open [http://localhost:3000](http://localhost:3000).  
Set `NEXT_PUBLIC_API_URL=http://localhost:8000` to point at the API.

## Modules (classic app)

| Route | Module |
| --- | --- |
| `/` | Landing + budget calculator |
| `/vendors` | Budget vendor matchmaker |
| `/shopping-hub` | Local shopping discovery |
| `/ai-studio` | Virtual try-on + shoot generator |
| `/media-suite` | Song generator + invite editor |
| `/guest-hub` | Guest portal + RSVP |

## Architecture

See [docs/architecture/backend.md](docs/architecture/backend.md).

## Development

```bash
make backend-install   # Python deps
make test-backend      # pytest
make lint-backend      # ruff
make ci                # lint + test
```

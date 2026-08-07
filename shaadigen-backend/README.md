# ShaadiGen Backend

FastAPI Clean Architecture API for ShaadiGen AI.

## Layout

```
src/shaadigen/
  core/             # config, security
  domain/           # entities + ports (no framework deps)
  application/      # use cases (auth M1)
  infrastructure/   # db, redis, celery, ai adapters
  presentation/     # FastAPI routers & schemas
```

## Quick start

```bash
# from repo root
make backend-install
make up            # postgres + redis + api + worker
make migrate
curl http://localhost:8000/api/v1/health
```

Local (without Docker):

```bash
cd shaadigen-backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
uvicorn shaadigen.main:app --reload --port 8000
```

## API (Milestone 1)

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/health` | Liveness + dependency checks |
| GET | `/api/v1/auth/status` | Auth module status skeleton |
| POST | `/api/v1/auth/register` | Register user (requires Postgres) |
| POST | `/api/v1/auth/login` | Login (requires Postgres) |

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Tests

```bash
make test-backend
```

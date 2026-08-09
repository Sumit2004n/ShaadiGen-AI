# ShaadiGen Backend

FastAPI Clean Architecture API for ShaadiGen AI.

## Layout

```
src/shaadigen/
  core/             # config, security
  domain/           # entities + ports (no framework deps)
  application/      # use cases (auth M1, vendors M2)
  infrastructure/   # db, redis, celery, ai adapters
  presentation/     # FastAPI routers & schemas
```

## Quick start

```bash
# from repo root
make backend-install
make up            # postgres + redis + api + worker (runs alembic upgrade head)
curl http://localhost:8000/api/v1/health
curl "http://localhost:8000/api/v1/vendors/match?budget=2500000&category=Photographer"
```

Local (without Docker):

```bash
cd shaadigen-backend
python -m venv .venv && source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
alembic upgrade head
uvicorn shaadigen.main:app --reload --port 8000
# separate terminal for negotiations:
celery -A shaadigen.infrastructure.celery.app.celery_app worker --loglevel=INFO
```

## API

### Milestone 1 — Auth

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/v1/health` | Liveness + dependency checks |
| GET | `/api/v1/auth/status` | Auth module status skeleton |
| POST | `/api/v1/auth/register` | Register user (requires Postgres) |
| POST | `/api/v1/auth/login` | Login (requires Postgres) |

### Milestone 2 — Vendors

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/v1/vendors/categories` | public | Category labels + budget shares |
| GET | `/api/v1/vendors/match` | public | Match vendors by budget/category/guests |
| GET | `/api/v1/vendors/{id}` | public | Vendor detail |
| POST | `/api/v1/vendors/negotiations` | optional JWT | Start async AI negotiation job |
| GET | `/api/v1/vendors/negotiations/{job_id}` | public | Poll negotiation status |
| GET/POST/DELETE | `/api/v1/vendors/shortlist…` | JWT | Persist shortlist |

Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## Tests

```bash
make test-backend
```


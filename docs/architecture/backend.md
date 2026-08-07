# ShaadiGen Backend Architecture

## Goals

- Serve the classic Next.js app (`shaadigen-ai-classic`) over a stable HTTP API.
- Keep AI providers, databases, and brokers behind ports so domain logic stays testable.
- Ship Milestone 1 (auth foundation) first; expand to vendors, try-on, media, and guest hub later.

## Stack

| Concern | Choice |
| --- | --- |
| API | FastAPI + Pydantic v2 |
| Language | Python 3.12+ |
| DB | PostgreSQL 16 + SQLAlchemy 2 (async) + Alembic |
| Cache / broker | Redis 7 |
| Workers | Celery |
| Auth | JWT (python-jose) + passlib/bcrypt |
| Packaging | `pyproject.toml` (hatchling) |
| Local orchestration | Docker Compose (`docker/compose.local.yml`) |

## Clean Architecture layers

```
presentation  →  application  →  domain
       ↓               ↓
infrastructure (db / redis / celery / ai)
```

### `domain/`

- Pure entities (`User`, future `Vendor`, `Wedding`, `TryOnJob`, …).
- Ports (interfaces): `UserRepositoryPort`, `CachePort`, `AIProviderPort`.
- No FastAPI, SQLAlchemy, Redis, or OpenAI imports.

### `application/`

- Use cases orchestrate ports.
- Milestone 1: `RegisterUserUseCase`, `LoginUserUseCase`, `GetAuthStatusUseCase`.
- Raises typed `ApplicationError` subclasses; presentation maps them to HTTP.

### `infrastructure/`

- `db/` — async engine, ORM models, repository adapters, Alembic.
- `redis/` — `RedisCache` implementing `CachePort`.
- `celery/` — worker app + task stubs (`virtual_tryon`).
- `ai/` — `StubAIProvider` today; swap for fal.ai / OpenAI adapters without touching use cases.

### `presentation/`

- FastAPI routers under `/api/v1`.
- Pydantic schemas at the edge only.
- Exception handlers translate application errors → status codes.

### `core/`

- `Settings` (pydantic-settings) and security helpers shared across layers that need them.

## API surface (current)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/v1/health` | API + optional Redis ping |
| GET | `/api/v1/auth/status` | M1 skeleton |
| POST | `/api/v1/auth/register` | Persists user, returns JWT |
| POST | `/api/v1/auth/login` | Verifies password, returns JWT |

OpenAPI: `/docs` (disabled in production).

## Local topology

```
Browser → Next.js :3000
              ↓ NEXT_PUBLIC_API_URL
         FastAPI :8000
           ↙        ↘
     Postgres     Redis ← Celery worker
```

```bash
make up          # postgres, redis, api, worker
make migrate     # if running API on host
make test-backend
```

## Milestone roadmap

1. **M1 — Auth** (this skeleton): register/login/status, users table, JWT.
2. **M2 — Vendors & budget**: CRUD + matchmaking endpoints replacing mock vendor data.
3. **M3 — AI Studio try-on**: async jobs via Celery + AI provider port.
4. **M4 — Media suite**: song / invite generation jobs.
5. **M5 — Guest hub**: RSVP + ritual content APIs.
6. **M6 — Hardening**: rate limits, refresh tokens, observability, CI deploy.

## Testing strategy

- **Unit**: use cases against in-memory repository (no I/O).
- **Integration**: FastAPI `TestClient` for health/auth status (no DB).
- **Future**: pytest + testcontainers for Postgres/Redis register/login flows.

## Dependency rule

Inner layers never import outer layers. Allowed direction:

`presentation → application → domain ← infrastructure`

Infrastructure implements ports defined in `domain/ports`.

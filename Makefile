COMPOSE := docker compose -f docker/compose.local.yml
BACKEND := shaadigen-backend
FRONTEND := shaadigen-ai-classic

.PHONY: help up down logs migrate backend-install frontend-install test-backend lint-backend \
	dev-api dev-frontend ci

help:
	@echo "ShaadiGen monorepo targets:"
	@echo "  make up                 Start postgres, redis, api, worker"
	@echo "  make down               Stop local stack"
	@echo "  make logs               Tail compose logs"
	@echo "  make migrate            Run Alembic migrations (host)"
	@echo "  make backend-install    pip install backend editable + dev deps"
	@echo "  make frontend-install   npm install classic frontend"
	@echo "  make test-backend       pytest"
	@echo "  make lint-backend       ruff check"
	@echo "  make dev-api            uvicorn with reload"
	@echo "  make dev-frontend       next dev"
	@echo "  make ci                 lint + test backend"

up:
	$(COMPOSE) up --build -d

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

migrate:
	cd $(BACKEND) && alembic upgrade head

backend-install:
	cd $(BACKEND) && python -m pip install -e ".[dev]"

frontend-install:
	cd $(FRONTEND) && npm install

test-backend:
	cd $(BACKEND) && pytest -q

lint-backend:
	cd $(BACKEND) && ruff check src tests

dev-api:
	cd $(BACKEND) && uvicorn shaadigen.main:app --reload --port 8000

dev-frontend:
	cd $(FRONTEND) && npm run dev

ci: lint-backend test-backend

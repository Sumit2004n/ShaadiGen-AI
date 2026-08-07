"""Health and readiness endpoints."""

from fastapi import APIRouter, Request

from shaadigen import __version__
from shaadigen.core.config import get_settings
from shaadigen.presentation.api.v1.schemas import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(request: Request) -> HealthResponse:
    settings = get_settings()
    checks: dict[str, str] = {"api": "ok"}

    redis_cache = getattr(request.app.state, "cache", None)
    if redis_cache is not None:
        checks["redis"] = "ok" if await redis_cache.ping() else "down"
    else:
        checks["redis"] = "skipped"

    return HealthResponse(
        status="ok",
        app=settings.app_name,
        env=settings.app_env,
        version=__version__,
        checks=checks,
    )

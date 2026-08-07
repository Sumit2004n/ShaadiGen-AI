"""FastAPI application factory and ASGI entrypoint."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shaadigen import __version__
from shaadigen.core.config import get_settings
from shaadigen.infrastructure.ai.client import StubAIProvider
from shaadigen.infrastructure.redis.client import RedisCache, close_redis, get_redis
from shaadigen.presentation.api.v1.router import api_v1_router
from shaadigen.presentation.exception_handlers import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    app.state.settings = settings
    app.state.ai = StubAIProvider()

    try:
        redis = await get_redis(settings)
        app.state.cache = RedisCache(redis)
    except Exception:
        app.state.cache = None

    yield

    await close_redis()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version=__version__,
        description="ShaadiGen AI backend — Clean Architecture API",
        lifespan=lifespan,
        docs_url="/docs" if not settings.is_production else None,
        redoc_url="/redoc" if not settings.is_production else None,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)
    app.include_router(api_v1_router, prefix=settings.api_v1_prefix)

    @app.get("/")
    async def root() -> dict[str, str]:
        return {
            "app": settings.app_name,
            "version": __version__,
            "docs": "/docs",
            "health": f"{settings.api_v1_prefix}/health",
        }

    return app


app = create_app()


def run() -> None:
    import uvicorn

    settings = get_settings()
    uvicorn.run(
        "shaadigen.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug and settings.app_env == "local",
    )


if __name__ == "__main__":
    run()

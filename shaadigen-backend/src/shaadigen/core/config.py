"""Application settings loaded from environment variables."""

from functools import lru_cache
from typing import Literal

from pydantic import Field, PostgresDsn, RedisDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "ShaadiGen AI"
    app_env: Literal["local", "test", "staging", "production"] = "local"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    # Security
    secret_key: str = Field(
        default="change-me-in-production-use-openssl-rand-hex-32",
        min_length=16,
    )
    access_token_expire_minutes: int = 60 * 24
    algorithm: str = "HS256"
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )

    # Persistence
    database_url: PostgresDsn = Field(
        default="postgresql+asyncpg://shaadigen:shaadigen@localhost:5432/shaadigen"
    )
    database_echo: bool = False

    # Cache / broker
    redis_url: RedisDsn = Field(default="redis://localhost:6379/0")
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    # AI providers (stubs for M1+)
    openai_api_key: str | None = None
    fal_api_key: str | None = None

    @property
    def is_production(self) -> bool:
        return self.app_env == "production"


@lru_cache
def get_settings() -> Settings:
    return Settings()

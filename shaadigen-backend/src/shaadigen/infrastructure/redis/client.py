"""Redis cache adapter implementing CachePort."""

import json
from typing import Any

from redis.asyncio import Redis

from shaadigen.core.config import Settings, get_settings
from shaadigen.domain.ports.cache import CachePort

_redis: Redis | None = None


async def get_redis(settings: Settings | None = None) -> Redis:
    global _redis
    if _redis is None:
        cfg = settings or get_settings()
        _redis = Redis.from_url(str(cfg.redis_url), decode_responses=True)
    return _redis


async def close_redis() -> None:
    global _redis
    if _redis is not None:
        await _redis.aclose()
        _redis = None


class RedisCache(CachePort):
    def __init__(self, client: Redis) -> None:
        self._client = client

    async def get(self, key: str) -> Any | None:
        raw = await self._client.get(key)
        if raw is None:
            return None
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return raw

    async def set(self, key: str, value: Any, ttl_seconds: int | None = None) -> None:
        payload = json.dumps(value) if not isinstance(value, str) else value
        if ttl_seconds is not None:
            await self._client.set(key, payload, ex=ttl_seconds)
        else:
            await self._client.set(key, payload)

    async def delete(self, key: str) -> None:
        await self._client.delete(key)

    async def ping(self) -> bool:
        try:
            return bool(await self._client.ping())
        except Exception:
            return False

"""Password hashing and JWT helpers (Milestone 1 auth foundation)."""

from datetime import UTC, datetime, timedelta
from typing import Any

import bcrypt
from jose import JWTError, jwt

from shaadigen.core.config import Settings, get_settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8"),
        )
    except ValueError:
        return False


def create_access_token(
    subject: str,
    *,
    expires_delta: timedelta | None = None,
    extra_claims: dict[str, Any] | None = None,
    settings: Settings | None = None,
) -> str:
    cfg = settings or get_settings()
    expire = datetime.now(UTC) + (
        expires_delta or timedelta(minutes=cfg.access_token_expire_minutes)
    )
    payload: dict[str, Any] = {"sub": subject, "exp": expire}
    if extra_claims:
        payload.update(extra_claims)
    return jwt.encode(payload, cfg.secret_key, algorithm=cfg.algorithm)


def decode_access_token(
    token: str,
    *,
    settings: Settings | None = None,
) -> dict[str, Any] | None:
    cfg = settings or get_settings()
    try:
        return jwt.decode(token, cfg.secret_key, algorithms=[cfg.algorithm])
    except JWTError:
        return None

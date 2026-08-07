"""Auth use-case DTOs (no FastAPI / SQLAlchemy types)."""

from dataclasses import dataclass
from uuid import UUID

from shaadigen.domain.entities.user import UserRole


@dataclass(frozen=True)
class RegisterUserCommand:
    email: str
    password: str
    full_name: str
    role: UserRole = UserRole.COUPLE


@dataclass(frozen=True)
class LoginCommand:
    email: str
    password: str


@dataclass(frozen=True)
class AuthTokenResult:
    access_token: str
    token_type: str
    user_id: UUID
    email: str
    role: UserRole


@dataclass(frozen=True)
class AuthStatusResult:
    authenticated: bool
    user_id: UUID | None = None
    email: str | None = None
    role: UserRole | None = None
    message: str = "Auth module ready (Milestone 1 skeleton)"

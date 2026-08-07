"""Pydantic request/response schemas for API v1."""

from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from shaadigen.domain.entities.user import UserRole


class HealthResponse(BaseModel):
    status: str
    app: str
    env: str
    version: str
    checks: dict[str, str] = Field(default_factory=dict)


class AuthStatusResponse(BaseModel):
    authenticated: bool
    user_id: UUID | None = None
    email: EmailStr | None = None
    role: UserRole | None = None
    message: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=200)
    role: UserRole = UserRole.COUPLE


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: UUID
    email: EmailStr
    role: UserRole


class ErrorResponse(BaseModel):
    detail: str

"""Milestone 1 auth use cases."""

from shaadigen.application.auth.dto import (
    AuthStatusResult,
    AuthTokenResult,
    LoginCommand,
    RegisterUserCommand,
)
from shaadigen.application.common.exceptions import AuthenticationError, ConflictError
from shaadigen.core.security import create_access_token, hash_password, verify_password
from shaadigen.domain.entities.user import User
from shaadigen.domain.ports.user_repository import UserRepositoryPort


class RegisterUserUseCase:
    def __init__(self, users: UserRepositoryPort) -> None:
        self._users = users

    async def execute(self, command: RegisterUserCommand) -> AuthTokenResult:
        if await self._users.exists_by_email(command.email.lower()):
            raise ConflictError("Email already registered")

        user = User(
            email=command.email.lower().strip(),
            hashed_password=hash_password(command.password),
            full_name=command.full_name.strip(),
            role=command.role,
        )
        saved = await self._users.add(user)
        token = create_access_token(
            str(saved.id),
            extra_claims={"email": saved.email, "role": saved.role.value},
        )
        return AuthTokenResult(
            access_token=token,
            token_type="bearer",
            user_id=saved.id,
            email=saved.email,
            role=saved.role,
        )


class LoginUserUseCase:
    def __init__(self, users: UserRepositoryPort) -> None:
        self._users = users

    async def execute(self, command: LoginCommand) -> AuthTokenResult:
        user = await self._users.get_by_email(command.email.lower().strip())
        if user is None or not verify_password(command.password, user.hashed_password):
            raise AuthenticationError("Invalid email or password")
        if not user.is_active:
            raise AuthenticationError("Account is disabled")

        token = create_access_token(
            str(user.id),
            extra_claims={"email": user.email, "role": user.role.value},
        )
        return AuthTokenResult(
            access_token=token,
            token_type="bearer",
            user_id=user.id,
            email=user.email,
            role=user.role,
        )


class GetAuthStatusUseCase:
    """Skeleton status for Milestone 1 — full session resolution comes later."""

    async def execute(self) -> AuthStatusResult:
        return AuthStatusResult(authenticated=False)

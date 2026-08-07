"""Unit tests for Milestone 1 auth use cases."""

import pytest

from shaadigen.application.auth.dto import LoginCommand, RegisterUserCommand
from shaadigen.application.auth.use_cases import (
    GetAuthStatusUseCase,
    LoginUserUseCase,
    RegisterUserUseCase,
)
from shaadigen.application.common.exceptions import AuthenticationError, ConflictError
from shaadigen.domain.entities.user import UserRole
from tests.conftest import InMemoryUserRepository


@pytest.mark.asyncio
async def test_register_user_success(user_repo: InMemoryUserRepository) -> None:
    use_case = RegisterUserUseCase(user_repo)
    result = await use_case.execute(
        RegisterUserCommand(
            email="new@shaadigen.ai",
            password="securepass1",
            full_name="Priya Sharma",
            role=UserRole.COUPLE,
        )
    )
    assert result.email == "new@shaadigen.ai"
    assert result.token_type == "bearer"
    assert result.access_token
    assert result.role == UserRole.COUPLE


@pytest.mark.asyncio
async def test_register_duplicate_email(user_repo: InMemoryUserRepository) -> None:
    use_case = RegisterUserUseCase(user_repo)
    cmd = RegisterUserCommand(
        email="dup@shaadigen.ai",
        password="securepass1",
        full_name="One",
    )
    await use_case.execute(cmd)
    with pytest.raises(ConflictError):
        await use_case.execute(cmd)


@pytest.mark.asyncio
async def test_login_success(user_repo: InMemoryUserRepository, seeded_user) -> None:
    use_case = LoginUserUseCase(user_repo)
    result = await use_case.execute(
        LoginCommand(email=seeded_user.email, password="password123")
    )
    assert result.user_id == seeded_user.id
    assert result.access_token


@pytest.mark.asyncio
async def test_login_invalid_password(user_repo: InMemoryUserRepository, seeded_user) -> None:
    use_case = LoginUserUseCase(user_repo)
    with pytest.raises(AuthenticationError):
        await use_case.execute(
            LoginCommand(email=seeded_user.email, password="wrong-password")
        )


@pytest.mark.asyncio
async def test_auth_status_skeleton() -> None:
    result = await GetAuthStatusUseCase().execute()
    assert result.authenticated is False
    assert "Milestone 1" in result.message

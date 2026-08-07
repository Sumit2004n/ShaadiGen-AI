"""Shared pytest fixtures."""

from uuid import uuid4

import pytest

from shaadigen.domain.entities.user import User, UserRole
from shaadigen.domain.ports.user_repository import UserRepositoryPort


class InMemoryUserRepository(UserRepositoryPort):
    def __init__(self) -> None:
        self._users: dict[str, User] = {}

    async def get_by_id(self, user_id):  # type: ignore[no-untyped-def]
        for user in self._users.values():
            if user.id == user_id:
                return user
        return None

    async def get_by_email(self, email: str) -> User | None:
        return self._users.get(email.lower())

    async def add(self, user: User) -> User:
        if user.id is None:
            user.id = uuid4()
        self._users[user.email.lower()] = user
        return user

    async def exists_by_email(self, email: str) -> bool:
        return email.lower() in self._users


@pytest.fixture
def user_repo() -> InMemoryUserRepository:
    return InMemoryUserRepository()


@pytest.fixture
async def seeded_user(user_repo: InMemoryUserRepository) -> User:
    from shaadigen.core.security import hash_password

    user = User(
        email="couple@example.com",
        hashed_password=hash_password("password123"),
        full_name="Test Couple",
        role=UserRole.COUPLE,
    )
    return await user_repo.add(user)

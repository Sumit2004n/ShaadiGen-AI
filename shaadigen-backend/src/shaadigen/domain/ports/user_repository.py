"""Port: user persistence. Implemented in infrastructure."""

from abc import ABC, abstractmethod
from uuid import UUID

from shaadigen.domain.entities.user import User


class UserRepositoryPort(ABC):
    @abstractmethod
    async def get_by_id(self, user_id: UUID) -> User | None:
        raise NotImplementedError

    @abstractmethod
    async def get_by_email(self, email: str) -> User | None:
        raise NotImplementedError

    @abstractmethod
    async def add(self, user: User) -> User:
        raise NotImplementedError

    @abstractmethod
    async def exists_by_email(self, email: str) -> bool:
        raise NotImplementedError

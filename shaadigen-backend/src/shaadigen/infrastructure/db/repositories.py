"""SQLAlchemy implementations of domain ports."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from shaadigen.domain.entities.user import User
from shaadigen.domain.ports.user_repository import UserRepositoryPort
from shaadigen.infrastructure.db.models import UserModel


class SqlAlchemyUserRepository(UserRepositoryPort):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, user_id: UUID) -> User | None:
        result = await self._session.get(UserModel, user_id)
        return result.to_entity() if result else None

    async def get_by_email(self, email: str) -> User | None:
        stmt = select(UserModel).where(UserModel.email == email.lower())
        result = await self._session.execute(stmt)
        row = result.scalar_one_or_none()
        return row.to_entity() if row else None

    async def add(self, user: User) -> User:
        model = UserModel.from_entity(user)
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def exists_by_email(self, email: str) -> bool:
        stmt = select(UserModel.id).where(UserModel.email == email.lower()).limit(1)
        result = await self._session.execute(stmt)
        return result.scalar_one_or_none() is not None

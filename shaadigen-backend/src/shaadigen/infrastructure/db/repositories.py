"""SQLAlchemy implementations of domain ports."""

from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from shaadigen.domain.entities.negotiation import NegotiationJob
from shaadigen.domain.entities.shortlist import ShortlistItem
from shaadigen.domain.entities.user import User
from shaadigen.domain.entities.vendor import Vendor, VendorCategory
from shaadigen.domain.ports.negotiation_repository import NegotiationRepositoryPort
from shaadigen.domain.ports.shortlist_repository import ShortlistRepositoryPort
from shaadigen.domain.ports.user_repository import UserRepositoryPort
from shaadigen.domain.ports.vendor_repository import VendorRepositoryPort
from shaadigen.infrastructure.db.models import (
    NegotiationJobModel,
    ShortlistItemModel,
    UserModel,
    VendorModel,
)


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


class SqlAlchemyVendorRepository(VendorRepositoryPort):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, vendor_id: UUID) -> Vendor | None:
        result = await self._session.get(VendorModel, vendor_id)
        return result.to_entity() if result else None

    async def list_by_category(self, category: VendorCategory) -> list[Vendor]:
        stmt = select(VendorModel).where(VendorModel.category == category.value)
        result = await self._session.execute(stmt)
        return [row.to_entity() for row in result.scalars().all()]

    async def list_all(self) -> list[Vendor]:
        result = await self._session.execute(select(VendorModel))
        return [row.to_entity() for row in result.scalars().all()]


class SqlAlchemyNegotiationRepository(NegotiationRepositoryPort):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, job_id: UUID) -> NegotiationJob | None:
        result = await self._session.get(NegotiationJobModel, job_id)
        return result.to_entity() if result else None

    async def add(self, job: NegotiationJob) -> NegotiationJob:
        model = NegotiationJobModel.from_entity(job)
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def update(self, job: NegotiationJob) -> NegotiationJob:
        model = await self._session.get(NegotiationJobModel, job.id)
        if model is None:
            model = NegotiationJobModel.from_entity(job)
            self._session.add(model)
        else:
            model.user_id = job.user_id
            model.vendor_id = job.vendor_id
            model.budget_total = job.budget_total
            model.guest_count = job.guest_count
            model.status = job.status.value
            model.perk_text = job.perk_text
            model.estimated_savings = job.estimated_savings
            model.counter_offer_amount = job.counter_offer_amount
            model.rfp_summary = job.rfp_summary
            model.error_message = job.error_message
            model.completed_at = job.completed_at
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()


class SqlAlchemyShortlistRepository(ShortlistRepositoryPort):
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def list_by_user(self, user_id: UUID) -> list[ShortlistItem]:
        stmt = select(ShortlistItemModel).where(ShortlistItemModel.user_id == user_id)
        result = await self._session.execute(stmt)
        return [row.to_entity() for row in result.scalars().all()]

    async def add(self, item: ShortlistItem) -> ShortlistItem:
        model = ShortlistItemModel.from_entity(item)
        self._session.add(model)
        await self._session.flush()
        await self._session.refresh(model)
        return model.to_entity()

    async def remove(self, user_id: UUID, vendor_id: UUID) -> bool:
        stmt = delete(ShortlistItemModel).where(
            ShortlistItemModel.user_id == user_id,
            ShortlistItemModel.vendor_id == vendor_id,
        )
        result = await self._session.execute(stmt)
        await self._session.flush()
        return (result.rowcount or 0) > 0

    async def get_by_user_and_vendor(
        self, user_id: UUID, vendor_id: UUID
    ) -> ShortlistItem | None:
        stmt = select(ShortlistItemModel).where(
            ShortlistItemModel.user_id == user_id,
            ShortlistItemModel.vendor_id == vendor_id,
        )
        result = await self._session.execute(stmt)
        row = result.scalar_one_or_none()
        return row.to_entity() if row else None

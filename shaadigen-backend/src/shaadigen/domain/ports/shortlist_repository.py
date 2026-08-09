"""Port: shortlist persistence."""

from abc import ABC, abstractmethod
from uuid import UUID

from shaadigen.domain.entities.shortlist import ShortlistItem


class ShortlistRepositoryPort(ABC):
    @abstractmethod
    async def list_by_user(self, user_id: UUID) -> list[ShortlistItem]:
        raise NotImplementedError

    @abstractmethod
    async def add(self, item: ShortlistItem) -> ShortlistItem:
        raise NotImplementedError

    @abstractmethod
    async def remove(self, user_id: UUID, vendor_id: UUID) -> bool:
        raise NotImplementedError

    @abstractmethod
    async def get_by_user_and_vendor(
        self, user_id: UUID, vendor_id: UUID
    ) -> ShortlistItem | None:
        raise NotImplementedError

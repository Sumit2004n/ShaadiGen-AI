"""Port: vendor persistence."""

from abc import ABC, abstractmethod
from uuid import UUID

from shaadigen.domain.entities.vendor import Vendor, VendorCategory


class VendorRepositoryPort(ABC):
    @abstractmethod
    async def get_by_id(self, vendor_id: UUID) -> Vendor | None:
        raise NotImplementedError

    @abstractmethod
    async def list_by_category(self, category: VendorCategory) -> list[Vendor]:
        raise NotImplementedError

    @abstractmethod
    async def list_all(self) -> list[Vendor]:
        raise NotImplementedError

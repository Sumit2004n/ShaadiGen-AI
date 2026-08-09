"""Port: negotiation job persistence."""

from abc import ABC, abstractmethod
from uuid import UUID

from shaadigen.domain.entities.negotiation import NegotiationJob


class NegotiationRepositoryPort(ABC):
    @abstractmethod
    async def get_by_id(self, job_id: UUID) -> NegotiationJob | None:
        raise NotImplementedError

    @abstractmethod
    async def add(self, job: NegotiationJob) -> NegotiationJob:
        raise NotImplementedError

    @abstractmethod
    async def update(self, job: NegotiationJob) -> NegotiationJob:
        raise NotImplementedError

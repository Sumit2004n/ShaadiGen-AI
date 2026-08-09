"""Port: AI vendor negotiation."""

from abc import ABC, abstractmethod
from dataclasses import dataclass

from shaadigen.domain.entities.vendor import Vendor


@dataclass(frozen=True)
class NegotiationDeal:
    perk_text: str
    estimated_savings: int
    counter_offer_amount: int
    rfp_summary: str


class AINegotiatorPort(ABC):
    @abstractmethod
    async def negotiate(
        self,
        *,
        vendor: Vendor,
        budget_total: int,
        guest_count: int,
    ) -> NegotiationDeal:
        raise NotImplementedError

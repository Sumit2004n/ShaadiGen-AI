"""Vendor use-case DTOs."""

from dataclasses import dataclass
from uuid import UUID

from shaadigen.domain.entities.negotiation import NegotiationStatus
from shaadigen.domain.entities.vendor import PricingUnit, Vendor, VendorCategory


@dataclass(frozen=True)
class MatchVendorsQuery:
    budget_total: int
    category: VendorCategory
    guest_count: int = 300


@dataclass(frozen=True)
class StartNegotiationCommand:
    vendor_id: UUID
    budget_total: int
    guest_count: int = 300
    user_id: UUID | None = None


@dataclass(frozen=True)
class NegotiationJobResult:
    job_id: UUID
    status: NegotiationStatus
    vendor_id: UUID
    perk_text: str | None = None
    estimated_savings: int | None = None
    counter_offer_amount: int | None = None
    rfp_summary: str | None = None
    error_message: str | None = None


@dataclass(frozen=True)
class AddShortlistCommand:
    user_id: UUID
    vendor_id: UUID
    negotiation_job_id: UUID | None = None
    notes: str | None = None


@dataclass(frozen=True)
class ShortlistItemResult:
    id: UUID
    user_id: UUID
    vendor_id: UUID
    negotiation_job_id: UUID | None
    notes: str | None
    status: str
    vendor: Vendor | None = None


@dataclass(frozen=True)
class CategoryInfo:
    key: VendorCategory
    label: str
    budget_share: float
    pricing_unit: PricingUnit

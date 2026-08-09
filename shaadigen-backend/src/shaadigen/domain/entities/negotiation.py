"""Negotiation job domain entity."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from uuid import UUID, uuid4


class NegotiationStatus(StrEnum):
    QUEUED = "queued"
    RUNNING = "running"
    SUCCEEDED = "succeeded"
    FAILED = "failed"


@dataclass
class NegotiationJob:
    vendor_id: UUID
    budget_total: int
    guest_count: int = 300
    user_id: UUID | None = None
    status: NegotiationStatus = NegotiationStatus.QUEUED
    perk_text: str | None = None
    estimated_savings: int | None = None
    counter_offer_amount: int | None = None
    rfp_summary: str | None = None
    error_message: str | None = None
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None
    updated_at: datetime | None = None
    completed_at: datetime | None = None

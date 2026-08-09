"""Shortlist item domain entity."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID, uuid4


@dataclass
class ShortlistItem:
    user_id: UUID
    vendor_id: UUID
    negotiation_job_id: UUID | None = None
    notes: str | None = None
    status: str = "saved"
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None
    updated_at: datetime | None = None

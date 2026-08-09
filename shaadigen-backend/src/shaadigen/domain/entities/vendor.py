"""Vendor domain entity — framework-free."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from uuid import UUID, uuid4


class VendorCategory(StrEnum):
    PHOTOGRAPHER = "Photographer"
    CATERER = "Caterer"
    DECORATOR = "Decorator"
    MAKEUP_ARTIST = "Makeup Artist"
    LEHENGA_RETAILER = "Lehenga Retailer"


class PricingUnit(StrEnum):
    PACKAGE = "package"
    PER_PLATE = "per_plate"


@dataclass
class Vendor:
    name: str
    category: VendorCategory
    location: str
    price_min: int
    price_max: int
    rating: float
    reviews_count: int
    image_url: str
    tags: list[str]
    negotiated_deal: str
    pricing_unit: PricingUnit = PricingUnit.PACKAGE
    is_verified: bool = True
    id: UUID = field(default_factory=uuid4)
    created_at: datetime | None = None
    updated_at: datetime | None = None

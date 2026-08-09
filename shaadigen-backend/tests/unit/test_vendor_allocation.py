"""Allocation math tests (server truth for vendor match)."""

from shaadigen.application.vendors.allocation import (
    category_allocation,
    match_threshold,
    vendor_fits_budget,
)
from shaadigen.domain.entities.vendor import PricingUnit, Vendor, VendorCategory


def test_category_allocation_shares() -> None:
    budget = 2_500_000
    assert category_allocation(budget, VendorCategory.PHOTOGRAPHER) == 250_000
    assert category_allocation(budget, VendorCategory.DECORATOR) == 375_000
    assert category_allocation(budget, VendorCategory.CATERER) == 625_000
    assert category_allocation(budget, VendorCategory.MAKEUP_ARTIST) == 125_000


def test_caterer_per_plate_threshold() -> None:
    # 2.5L * 0.25 / 300 = 2083
    assert (
        match_threshold(
            2_500_000,
            VendorCategory.CATERER,
            guest_count=300,
            pricing_unit=PricingUnit.PER_PLATE,
        )
        == 2083
    )


def test_vendor_fits_budget_photographer() -> None:
    vendor = Vendor(
        name="Test",
        category=VendorCategory.PHOTOGRAPHER,
        location="Delhi",
        price_min=80_000,
        price_max=220_000,
        rating=4.5,
        reviews_count=10,
        image_url="gradient:amber",
        tags=[],
        negotiated_deal="perk",
    )
    assert vendor_fits_budget(vendor, 2_500_000) is True
    expensive = Vendor(
        name="Luxury",
        category=VendorCategory.PHOTOGRAPHER,
        location="Delhi",
        price_min=400_000,
        price_max=900_000,
        rating=5.0,
        reviews_count=10,
        image_url="gradient:rose",
        tags=[],
        negotiated_deal="perk",
    )
    assert vendor_fits_budget(expensive, 2_500_000) is False

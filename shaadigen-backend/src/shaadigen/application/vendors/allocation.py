"""Server-authoritative category budget allocation (mirrors classic FE rules)."""

from shaadigen.domain.entities.vendor import PricingUnit, Vendor, VendorCategory

CATEGORY_BUDGET_SHARE: dict[VendorCategory, float] = {
    VendorCategory.PHOTOGRAPHER: 0.10,
    VendorCategory.DECORATOR: 0.15,
    VendorCategory.CATERER: 0.25,
    VendorCategory.MAKEUP_ARTIST: 0.05,
}

CATEGORY_LABELS: dict[VendorCategory, str] = {
    VendorCategory.PHOTOGRAPHER: "Photographers",
    VendorCategory.DECORATOR: "Decorators",
    VendorCategory.CATERER: "Caterers",
    VendorCategory.MAKEUP_ARTIST: "Makeup Artists",
}

DEFAULT_GUEST_COUNT = 300


def category_allocation(budget_total: int, category: VendorCategory) -> int:
    share = CATEGORY_BUDGET_SHARE.get(category, 0.1)
    return int(budget_total * share)


def match_threshold(
    budget_total: int,
    category: VendorCategory,
    *,
    guest_count: int = DEFAULT_GUEST_COUNT,
    pricing_unit: PricingUnit = PricingUnit.PACKAGE,
) -> int:
    alloc = category_allocation(budget_total, category)
    if pricing_unit == PricingUnit.PER_PLATE:
        guests = guest_count if guest_count > 0 else DEFAULT_GUEST_COUNT
        return alloc // guests
    return alloc


def vendor_fits_budget(
    vendor: Vendor,
    budget_total: int,
    *,
    guest_count: int = DEFAULT_GUEST_COUNT,
) -> bool:
    threshold = match_threshold(
        budget_total,
        vendor.category,
        guest_count=guest_count,
        pricing_unit=vendor.pricing_unit,
    )
    return vendor.price_min <= threshold

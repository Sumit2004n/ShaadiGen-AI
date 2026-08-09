"""Unit tests for vendor match / negotiation / shortlist use cases."""

from uuid import UUID, uuid4

import pytest

from shaadigen.application.common.exceptions import ConflictError, NotFoundError
from shaadigen.application.vendors.dto import (
    AddShortlistCommand,
    MatchVendorsQuery,
    StartNegotiationCommand,
)
from shaadigen.application.vendors.use_cases import (
    AddToShortlistUseCase,
    GetNegotiationStatusUseCase,
    ListVendorCategoriesUseCase,
    MatchVendorsUseCase,
    RunNegotiationUseCase,
    StartNegotiationUseCase,
)
from shaadigen.domain.entities.negotiation import NegotiationJob, NegotiationStatus
from shaadigen.domain.entities.shortlist import ShortlistItem
from shaadigen.domain.entities.vendor import PricingUnit, Vendor, VendorCategory
from shaadigen.domain.ports.ai_negotiator import AINegotiatorPort, NegotiationDeal
from shaadigen.domain.ports.negotiation_repository import NegotiationRepositoryPort
from shaadigen.domain.ports.shortlist_repository import ShortlistRepositoryPort
from shaadigen.domain.ports.vendor_repository import VendorRepositoryPort
from shaadigen.infrastructure.ai.negotiator import StubAINegotiator


class InMemoryVendorRepository(VendorRepositoryPort):
    def __init__(self, vendors: list[Vendor] | None = None) -> None:
        self._vendors = {v.id: v for v in (vendors or [])}

    async def get_by_id(self, vendor_id: UUID) -> Vendor | None:
        return self._vendors.get(vendor_id)

    async def list_by_category(self, category: VendorCategory) -> list[Vendor]:
        return [v for v in self._vendors.values() if v.category == category]

    async def list_all(self) -> list[Vendor]:
        return list(self._vendors.values())


class InMemoryNegotiationRepository(NegotiationRepositoryPort):
    def __init__(self) -> None:
        self._jobs: dict[UUID, NegotiationJob] = {}

    async def get_by_id(self, job_id: UUID) -> NegotiationJob | None:
        return self._jobs.get(job_id)

    async def add(self, job: NegotiationJob) -> NegotiationJob:
        self._jobs[job.id] = job
        return job

    async def update(self, job: NegotiationJob) -> NegotiationJob:
        self._jobs[job.id] = job
        return job


class InMemoryShortlistRepository(ShortlistRepositoryPort):
    def __init__(self) -> None:
        self._items: dict[tuple[UUID, UUID], ShortlistItem] = {}

    async def list_by_user(self, user_id: UUID) -> list[ShortlistItem]:
        return [i for i in self._items.values() if i.user_id == user_id]

    async def add(self, item: ShortlistItem) -> ShortlistItem:
        self._items[(item.user_id, item.vendor_id)] = item
        return item

    async def remove(self, user_id: UUID, vendor_id: UUID) -> bool:
        return self._items.pop((user_id, vendor_id), None) is not None

    async def get_by_user_and_vendor(
        self, user_id: UUID, vendor_id: UUID
    ) -> ShortlistItem | None:
        return self._items.get((user_id, vendor_id))


def _photographer(price_min: int = 80_000) -> Vendor:
    return Vendor(
        name="Shutter Co",
        category=VendorCategory.PHOTOGRAPHER,
        location="Bandra, Mumbai",
        price_min=price_min,
        price_max=220_000,
        rating=4.7,
        reviews_count=100,
        image_url="gradient:rose",
        tags=["Candid"],
        negotiated_deal="12% off",
        pricing_unit=PricingUnit.PACKAGE,
    )


@pytest.mark.asyncio
async def test_list_categories() -> None:
    cats = await ListVendorCategoriesUseCase().execute()
    assert len(cats) == 4
    assert {c.key for c in cats} == {
        VendorCategory.PHOTOGRAPHER,
        VendorCategory.DECORATOR,
        VendorCategory.CATERER,
        VendorCategory.MAKEUP_ARTIST,
    }


@pytest.mark.asyncio
async def test_match_vendors_filters_by_budget() -> None:
    cheap = _photographer(80_000)
    pricey = _photographer(400_000)
    pricey.id = uuid4()
    repo = InMemoryVendorRepository([cheap, pricey])
    matched = await MatchVendorsUseCase(repo).execute(
        MatchVendorsQuery(budget_total=2_500_000, category=VendorCategory.PHOTOGRAPHER)
    )
    assert [v.id for v in matched] == [cheap.id]


@pytest.mark.asyncio
async def test_start_and_run_negotiation() -> None:
    vendor = _photographer()
    vendors = InMemoryVendorRepository([vendor])
    jobs = InMemoryNegotiationRepository()

    started = await StartNegotiationUseCase(vendors, jobs).execute(
        StartNegotiationCommand(vendor_id=vendor.id, budget_total=2_500_000)
    )
    assert started.status == NegotiationStatus.QUEUED

    # Speed up stub sleep for unit test
    class FastNegotiator(AINegotiatorPort):
        async def negotiate(self, *, vendor, budget_total, guest_count):  # type: ignore[no-untyped-def]
            return NegotiationDeal(
                perk_text=vendor.negotiated_deal,
                estimated_savings=1000,
                counter_offer_amount=vendor.price_min - 1000,
                rfp_summary="ok",
            )

    result = await RunNegotiationUseCase(vendors, jobs, FastNegotiator()).execute(
        started.job_id
    )
    assert result.status == NegotiationStatus.SUCCEEDED
    assert result.perk_text == "12% off"
    assert result.estimated_savings == 1000

    status = await GetNegotiationStatusUseCase(jobs).execute(started.job_id)
    assert status.status == NegotiationStatus.SUCCEEDED


@pytest.mark.asyncio
async def test_stub_negotiator_savings_formula() -> None:
    vendor = _photographer(100_000)
    deal = await StubAINegotiator().negotiate(
        vendor=vendor, budget_total=2_500_000, guest_count=300
    )
    assert deal.estimated_savings == 12_000
    assert deal.perk_text == vendor.negotiated_deal


@pytest.mark.asyncio
async def test_shortlist_add_and_conflict() -> None:
    vendor = _photographer()
    user_id = uuid4()
    vendors = InMemoryVendorRepository([vendor])
    shortlist = InMemoryShortlistRepository()
    use_case = AddToShortlistUseCase(vendors, shortlist)

    first = await use_case.execute(
        AddShortlistCommand(user_id=user_id, vendor_id=vendor.id)
    )
    assert first.vendor_id == vendor.id

    with pytest.raises(ConflictError):
        await use_case.execute(
            AddShortlistCommand(user_id=user_id, vendor_id=vendor.id)
        )


@pytest.mark.asyncio
async def test_get_unknown_vendor_raises() -> None:
    from shaadigen.application.vendors.use_cases import GetVendorUseCase

    with pytest.raises(NotFoundError):
        await GetVendorUseCase(InMemoryVendorRepository()).execute(uuid4())

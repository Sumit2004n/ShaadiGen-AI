"""Milestone 2 vendor use cases."""

from uuid import UUID

from shaadigen.application.common.exceptions import ConflictError, NotFoundError
from shaadigen.application.vendors.allocation import (
    CATEGORY_BUDGET_SHARE,
    CATEGORY_LABELS,
    vendor_fits_budget,
)
from shaadigen.application.vendors.dto import (
    AddShortlistCommand,
    CategoryInfo,
    MatchVendorsQuery,
    NegotiationJobResult,
    ShortlistItemResult,
    StartNegotiationCommand,
)
from shaadigen.domain.entities.negotiation import NegotiationJob, NegotiationStatus
from shaadigen.domain.entities.shortlist import ShortlistItem
from shaadigen.domain.entities.vendor import PricingUnit, Vendor, VendorCategory
from shaadigen.domain.ports.ai_negotiator import AINegotiatorPort
from shaadigen.domain.ports.negotiation_repository import NegotiationRepositoryPort
from shaadigen.domain.ports.shortlist_repository import ShortlistRepositoryPort
from shaadigen.domain.ports.vendor_repository import VendorRepositoryPort


class ListVendorCategoriesUseCase:
    async def execute(self) -> list[CategoryInfo]:
        result: list[CategoryInfo] = []
        for category, share in CATEGORY_BUDGET_SHARE.items():
            unit = (
                PricingUnit.PER_PLATE
                if category == VendorCategory.CATERER
                else PricingUnit.PACKAGE
            )
            result.append(
                CategoryInfo(
                    key=category,
                    label=CATEGORY_LABELS[category],
                    budget_share=share,
                    pricing_unit=unit,
                )
            )
        return result


class MatchVendorsUseCase:
    def __init__(self, vendors: VendorRepositoryPort) -> None:
        self._vendors = vendors

    async def execute(self, query: MatchVendorsQuery) -> list[Vendor]:
        candidates = await self._vendors.list_by_category(query.category)
        matched = [
            v
            for v in candidates
            if vendor_fits_budget(
                v, query.budget_total, guest_count=query.guest_count
            )
        ]
        matched.sort(key=lambda v: (-v.rating, v.price_min))
        return matched


class GetVendorUseCase:
    def __init__(self, vendors: VendorRepositoryPort) -> None:
        self._vendors = vendors

    async def execute(self, vendor_id: UUID) -> Vendor:
        vendor = await self._vendors.get_by_id(vendor_id)
        if vendor is None:
            raise NotFoundError("Vendor not found")
        return vendor


class StartNegotiationUseCase:
    def __init__(
        self,
        vendors: VendorRepositoryPort,
        jobs: NegotiationRepositoryPort,
    ) -> None:
        self._vendors = vendors
        self._jobs = jobs

    async def execute(self, command: StartNegotiationCommand) -> NegotiationJobResult:
        vendor = await self._vendors.get_by_id(command.vendor_id)
        if vendor is None:
            raise NotFoundError("Vendor not found")

        job = NegotiationJob(
            vendor_id=command.vendor_id,
            budget_total=command.budget_total,
            guest_count=command.guest_count,
            user_id=command.user_id,
            status=NegotiationStatus.QUEUED,
        )
        saved = await self._jobs.add(job)
        return NegotiationJobResult(
            job_id=saved.id,
            status=saved.status,
            vendor_id=saved.vendor_id,
        )


class GetNegotiationStatusUseCase:
    def __init__(self, jobs: NegotiationRepositoryPort) -> None:
        self._jobs = jobs

    async def execute(self, job_id: UUID) -> NegotiationJobResult:
        job = await self._jobs.get_by_id(job_id)
        if job is None:
            raise NotFoundError("Negotiation job not found")
        return NegotiationJobResult(
            job_id=job.id,
            status=job.status,
            vendor_id=job.vendor_id,
            perk_text=job.perk_text,
            estimated_savings=job.estimated_savings,
            counter_offer_amount=job.counter_offer_amount,
            rfp_summary=job.rfp_summary,
            error_message=job.error_message,
        )


class RunNegotiationUseCase:
    """Executed by the Celery worker."""

    def __init__(
        self,
        vendors: VendorRepositoryPort,
        jobs: NegotiationRepositoryPort,
        negotiator: AINegotiatorPort,
    ) -> None:
        self._vendors = vendors
        self._jobs = jobs
        self._negotiator = negotiator

    async def execute(self, job_id: UUID) -> NegotiationJobResult:
        job = await self._jobs.get_by_id(job_id)
        if job is None:
            raise NotFoundError("Negotiation job not found")

        vendor = await self._vendors.get_by_id(job.vendor_id)
        if vendor is None:
            job.status = NegotiationStatus.FAILED
            job.error_message = "Vendor not found"
            await self._jobs.update(job)
            raise NotFoundError("Vendor not found")

        job.status = NegotiationStatus.RUNNING
        await self._jobs.update(job)

        try:
            deal = await self._negotiator.negotiate(
                vendor=vendor,
                budget_total=job.budget_total,
                guest_count=job.guest_count,
            )
            from datetime import UTC, datetime

            job.status = NegotiationStatus.SUCCEEDED
            job.perk_text = deal.perk_text
            job.estimated_savings = deal.estimated_savings
            job.counter_offer_amount = deal.counter_offer_amount
            job.rfp_summary = deal.rfp_summary
            job.completed_at = datetime.now(UTC)
            job.error_message = None
        except Exception as exc:  # noqa: BLE001 — worker boundary
            from datetime import UTC, datetime

            job.status = NegotiationStatus.FAILED
            job.error_message = str(exc)
            job.completed_at = datetime.now(UTC)

        saved = await self._jobs.update(job)
        return NegotiationJobResult(
            job_id=saved.id,
            status=saved.status,
            vendor_id=saved.vendor_id,
            perk_text=saved.perk_text,
            estimated_savings=saved.estimated_savings,
            counter_offer_amount=saved.counter_offer_amount,
            rfp_summary=saved.rfp_summary,
            error_message=saved.error_message,
        )


class AddToShortlistUseCase:
    def __init__(
        self,
        vendors: VendorRepositoryPort,
        shortlist: ShortlistRepositoryPort,
        jobs: NegotiationRepositoryPort | None = None,
    ) -> None:
        self._vendors = vendors
        self._shortlist = shortlist
        self._jobs = jobs

    async def execute(self, command: AddShortlistCommand) -> ShortlistItemResult:
        vendor = await self._vendors.get_by_id(command.vendor_id)
        if vendor is None:
            raise NotFoundError("Vendor not found")

        if command.negotiation_job_id and self._jobs is not None:
            job = await self._jobs.get_by_id(command.negotiation_job_id)
            if job is None:
                raise NotFoundError("Negotiation job not found")

        existing = await self._shortlist.get_by_user_and_vendor(
            command.user_id, command.vendor_id
        )
        if existing is not None:
            raise ConflictError("Vendor already on shortlist")

        item = ShortlistItem(
            user_id=command.user_id,
            vendor_id=command.vendor_id,
            negotiation_job_id=command.negotiation_job_id,
            notes=command.notes,
        )
        saved = await self._shortlist.add(item)
        return ShortlistItemResult(
            id=saved.id,
            user_id=saved.user_id,
            vendor_id=saved.vendor_id,
            negotiation_job_id=saved.negotiation_job_id,
            notes=saved.notes,
            status=saved.status,
            vendor=vendor,
        )


class ListShortlistUseCase:
    def __init__(
        self,
        vendors: VendorRepositoryPort,
        shortlist: ShortlistRepositoryPort,
    ) -> None:
        self._vendors = vendors
        self._shortlist = shortlist

    async def execute(self, user_id: UUID) -> list[ShortlistItemResult]:
        items = await self._shortlist.list_by_user(user_id)
        results: list[ShortlistItemResult] = []
        for item in items:
            vendor = await self._vendors.get_by_id(item.vendor_id)
            results.append(
                ShortlistItemResult(
                    id=item.id,
                    user_id=item.user_id,
                    vendor_id=item.vendor_id,
                    negotiation_job_id=item.negotiation_job_id,
                    notes=item.notes,
                    status=item.status,
                    vendor=vendor,
                )
            )
        return results


class RemoveFromShortlistUseCase:
    def __init__(self, shortlist: ShortlistRepositoryPort) -> None:
        self._shortlist = shortlist

    async def execute(self, user_id: UUID, vendor_id: UUID) -> None:
        removed = await self._shortlist.remove(user_id, vendor_id)
        if not removed:
            raise NotFoundError("Shortlist item not found")

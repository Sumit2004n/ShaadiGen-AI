"""Vendor match, negotiation, and shortlist routes."""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from shaadigen.application.vendors.allocation import DEFAULT_GUEST_COUNT
from shaadigen.application.vendors.dto import (
    AddShortlistCommand,
    MatchVendorsQuery,
    StartNegotiationCommand,
)
from shaadigen.application.vendors.use_cases import (
    AddToShortlistUseCase,
    GetNegotiationStatusUseCase,
    GetVendorUseCase,
    ListShortlistUseCase,
    ListVendorCategoriesUseCase,
    MatchVendorsUseCase,
    RemoveFromShortlistUseCase,
    StartNegotiationUseCase,
)
from shaadigen.domain.entities.vendor import Vendor, VendorCategory
from shaadigen.infrastructure.celery.tasks import enqueue_negotiation
from shaadigen.infrastructure.db.repositories import (
    SqlAlchemyNegotiationRepository,
    SqlAlchemyShortlistRepository,
    SqlAlchemyVendorRepository,
)
from shaadigen.infrastructure.db.session import get_db_session
from shaadigen.presentation.api.v1.schemas import (
    AddShortlistRequest,
    NegotiationJobResponse,
    ShortlistItemResponse,
    StartNegotiationRequest,
    VendorCategoryResponse,
    VendorResponse,
)
from shaadigen.presentation.dependencies.auth import CurrentUser, OptionalUser

router = APIRouter(prefix="/vendors", tags=["vendors"])

DbSession = Annotated[AsyncSession, Depends(get_db_session)]


def _vendor_response(vendor: Vendor) -> VendorResponse:
    return VendorResponse(
        id=vendor.id,
        name=vendor.name,
        category=vendor.category,
        location=vendor.location,
        priceRange={"min": vendor.price_min, "max": vendor.price_max},
        rating=vendor.rating,
        reviewsCount=vendor.reviews_count,
        imageUrl=vendor.image_url,
        tags=vendor.tags,
        negotiatedDeal=vendor.negotiated_deal,
        pricingUnit=vendor.pricing_unit,
        isVerified=vendor.is_verified,
    )


@router.get("/categories", response_model=list[VendorCategoryResponse])
async def list_categories() -> list[VendorCategoryResponse]:
    items = await ListVendorCategoriesUseCase().execute()
    return [
        VendorCategoryResponse(
            key=item.key,
            label=item.label,
            budgetShare=item.budget_share,
            pricingUnit=item.pricing_unit,
        )
        for item in items
    ]


@router.get("/match", response_model=list[VendorResponse])
async def match_vendors(
    session: DbSession,
    budget: Annotated[int, Query(gt=0, description="Total wedding budget in INR")],
    category: Annotated[VendorCategory, Query()],
    guests: Annotated[int, Query(gt=0)] = DEFAULT_GUEST_COUNT,
) -> list[VendorResponse]:
    use_case = MatchVendorsUseCase(SqlAlchemyVendorRepository(session))
    vendors = await use_case.execute(
        MatchVendorsQuery(
            budget_total=budget,
            category=category,
            guest_count=guests,
        )
    )
    return [_vendor_response(v) for v in vendors]


@router.get("/negotiations/{job_id}", response_model=NegotiationJobResponse)
async def get_negotiation(job_id: UUID, session: DbSession) -> NegotiationJobResponse:
    result = await GetNegotiationStatusUseCase(
        SqlAlchemyNegotiationRepository(session)
    ).execute(job_id)
    return NegotiationJobResponse(
        job_id=result.job_id,
        status=result.status,
        vendor_id=result.vendor_id,
        perk_text=result.perk_text,
        estimated_savings=result.estimated_savings,
        counter_offer_amount=result.counter_offer_amount,
        rfp_summary=result.rfp_summary,
        error_message=result.error_message,
    )


@router.post(
    "/negotiations",
    response_model=NegotiationJobResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def start_negotiation(
    body: StartNegotiationRequest,
    session: DbSession,
    user: OptionalUser,
) -> NegotiationJobResponse:
    use_case = StartNegotiationUseCase(
        SqlAlchemyVendorRepository(session),
        SqlAlchemyNegotiationRepository(session),
    )
    result = await use_case.execute(
        StartNegotiationCommand(
            vendor_id=body.vendor_id,
            budget_total=body.budget_total,
            guest_count=body.guest_count,
            user_id=user.id if user else None,
        )
    )
    # Commit before enqueue so the Celery worker can see the job row.
    await session.commit()
    enqueue_negotiation(result.job_id)
    return NegotiationJobResponse(
        job_id=result.job_id,
        status=result.status,
        vendor_id=result.vendor_id,
        perk_text=result.perk_text,
        estimated_savings=result.estimated_savings,
        counter_offer_amount=result.counter_offer_amount,
        rfp_summary=result.rfp_summary,
        error_message=result.error_message,
    )


@router.get("/shortlist", response_model=list[ShortlistItemResponse])
async def list_shortlist(
    session: DbSession,
    user: CurrentUser,
) -> list[ShortlistItemResponse]:
    items = await ListShortlistUseCase(
        SqlAlchemyVendorRepository(session),
        SqlAlchemyShortlistRepository(session),
    ).execute(user.id)
    return [
        ShortlistItemResponse(
            id=item.id,
            user_id=item.user_id,
            vendor_id=item.vendor_id,
            negotiation_job_id=item.negotiation_job_id,
            notes=item.notes,
            status=item.status,
            vendor=_vendor_response(item.vendor) if item.vendor else None,
        )
        for item in items
    ]


@router.post(
    "/shortlist",
    response_model=ShortlistItemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_shortlist(
    body: AddShortlistRequest,
    session: DbSession,
    user: CurrentUser,
) -> ShortlistItemResponse:
    result = await AddToShortlistUseCase(
        SqlAlchemyVendorRepository(session),
        SqlAlchemyShortlistRepository(session),
        SqlAlchemyNegotiationRepository(session),
    ).execute(
        AddShortlistCommand(
            user_id=user.id,
            vendor_id=body.vendor_id,
            negotiation_job_id=body.negotiation_job_id,
            notes=body.notes,
        )
    )
    return ShortlistItemResponse(
        id=result.id,
        user_id=result.user_id,
        vendor_id=result.vendor_id,
        negotiation_job_id=result.negotiation_job_id,
        notes=result.notes,
        status=result.status,
        vendor=_vendor_response(result.vendor) if result.vendor else None,
    )


@router.delete("/shortlist/{vendor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_shortlist(
    vendor_id: UUID,
    session: DbSession,
    user: CurrentUser,
) -> None:
    await RemoveFromShortlistUseCase(SqlAlchemyShortlistRepository(session)).execute(
        user.id, vendor_id
    )


@router.get("/{vendor_id}", response_model=VendorResponse)
async def get_vendor(vendor_id: UUID, session: DbSession) -> VendorResponse:
    vendor = await GetVendorUseCase(SqlAlchemyVendorRepository(session)).execute(vendor_id)
    return _vendor_response(vendor)

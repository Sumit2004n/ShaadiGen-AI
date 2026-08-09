"""Pydantic request/response schemas for API v1."""

from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from shaadigen.domain.entities.negotiation import NegotiationStatus
from shaadigen.domain.entities.user import UserRole
from shaadigen.domain.entities.vendor import PricingUnit, VendorCategory


class HealthResponse(BaseModel):
    status: str
    app: str
    env: str
    version: str
    checks: dict[str, str] = Field(default_factory=dict)


class AuthStatusResponse(BaseModel):
    authenticated: bool
    user_id: UUID | None = None
    email: EmailStr | None = None
    role: UserRole | None = None
    message: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=200)
    role: UserRole = UserRole.COUPLE


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=128)


class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str
    user_id: UUID
    email: EmailStr
    role: UserRole


class ErrorResponse(BaseModel):
    detail: str


class PriceRangeSchema(BaseModel):
    min: int
    max: int


class VendorResponse(BaseModel):
    id: UUID
    name: str
    category: VendorCategory
    location: str
    priceRange: PriceRangeSchema
    rating: float
    reviewsCount: int
    imageUrl: str
    tags: list[str]
    negotiatedDeal: str
    pricingUnit: PricingUnit = PricingUnit.PACKAGE
    isVerified: bool = True


class VendorCategoryResponse(BaseModel):
    key: VendorCategory
    label: str
    budgetShare: float
    pricingUnit: PricingUnit


class StartNegotiationRequest(BaseModel):
    vendor_id: UUID
    budget_total: int = Field(gt=0)
    guest_count: int = Field(default=300, gt=0)


class NegotiationJobResponse(BaseModel):
    job_id: UUID
    status: NegotiationStatus
    vendor_id: UUID
    perk_text: str | None = None
    estimated_savings: int | None = None
    counter_offer_amount: int | None = None
    rfp_summary: str | None = None
    error_message: str | None = None


class AddShortlistRequest(BaseModel):
    vendor_id: UUID
    negotiation_job_id: UUID | None = None
    notes: str | None = None


class ShortlistItemResponse(BaseModel):
    id: UUID
    user_id: UUID
    vendor_id: UUID
    negotiation_job_id: UUID | None = None
    notes: str | None = None
    status: str
    vendor: VendorResponse | None = None


"""ORM models — map to domain entities at the repository boundary."""

from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column

from shaadigen.domain.entities.negotiation import NegotiationJob, NegotiationStatus
from shaadigen.domain.entities.shortlist import ShortlistItem
from shaadigen.domain.entities.user import User, UserRole
from shaadigen.domain.entities.vendor import PricingUnit, Vendor, VendorCategory
from shaadigen.infrastructure.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class UserModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    role: Mapped[str] = mapped_column(String(32), nullable=False, default=UserRole.COUPLE.value)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    def to_entity(self) -> User:
        return User(
            id=self.id,
            email=self.email,
            hashed_password=self.hashed_password,
            full_name=self.full_name,
            role=UserRole(self.role),
            is_active=self.is_active,
            is_verified=self.is_verified,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )

    @classmethod
    def from_entity(cls, user: User) -> "UserModel":
        return cls(
            id=user.id,
            email=user.email,
            hashed_password=user.hashed_password,
            full_name=user.full_name,
            role=user.role.value,
            is_active=user.is_active,
            is_verified=user.is_verified,
        )


class VendorModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "vendors"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    location: Mapped[str] = mapped_column(String(200), nullable=False)
    price_min: Mapped[int] = mapped_column(Integer, nullable=False)
    price_max: Mapped[int] = mapped_column(Integer, nullable=False)
    pricing_unit: Mapped[str] = mapped_column(
        String(32), nullable=False, default=PricingUnit.PACKAGE.value
    )
    rating: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    reviews_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    image_url: Mapped[str] = mapped_column(String(255), nullable=False)
    tags: Mapped[list[str]] = mapped_column(ARRAY(String), nullable=False, default=list)
    negotiated_deal: Mapped[str] = mapped_column(Text, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    def to_entity(self) -> Vendor:
        return Vendor(
            id=self.id,
            name=self.name,
            category=VendorCategory(self.category),
            location=self.location,
            price_min=self.price_min,
            price_max=self.price_max,
            pricing_unit=PricingUnit(self.pricing_unit),
            rating=self.rating,
            reviews_count=self.reviews_count,
            image_url=self.image_url,
            tags=list(self.tags or []),
            negotiated_deal=self.negotiated_deal,
            is_verified=self.is_verified,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )

    @classmethod
    def from_entity(cls, vendor: Vendor) -> "VendorModel":
        return cls(
            id=vendor.id,
            name=vendor.name,
            category=vendor.category.value,
            location=vendor.location,
            price_min=vendor.price_min,
            price_max=vendor.price_max,
            pricing_unit=vendor.pricing_unit.value,
            rating=vendor.rating,
            reviews_count=vendor.reviews_count,
            image_url=vendor.image_url,
            tags=vendor.tags,
            negotiated_deal=vendor.negotiated_deal,
            is_verified=vendor.is_verified,
        )


class NegotiationJobModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "negotiation_jobs"

    user_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    vendor_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("vendors.id"), nullable=False, index=True
    )
    budget_total: Mapped[int] = mapped_column(Integer, nullable=False)
    guest_count: Mapped[int] = mapped_column(Integer, nullable=False, default=300)
    status: Mapped[str] = mapped_column(
        String(32), nullable=False, default=NegotiationStatus.QUEUED.value, index=True
    )
    perk_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    estimated_savings: Mapped[int | None] = mapped_column(Integer, nullable=True)
    counter_offer_amount: Mapped[int | None] = mapped_column(Integer, nullable=True)
    rfp_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    def to_entity(self) -> NegotiationJob:
        return NegotiationJob(
            id=self.id,
            user_id=self.user_id,
            vendor_id=self.vendor_id,
            budget_total=self.budget_total,
            guest_count=self.guest_count,
            status=NegotiationStatus(self.status),
            perk_text=self.perk_text,
            estimated_savings=self.estimated_savings,
            counter_offer_amount=self.counter_offer_amount,
            rfp_summary=self.rfp_summary,
            error_message=self.error_message,
            created_at=self.created_at,
            updated_at=self.updated_at,
            completed_at=self.completed_at,
        )

    @classmethod
    def from_entity(cls, job: NegotiationJob) -> "NegotiationJobModel":
        return cls(
            id=job.id,
            user_id=job.user_id,
            vendor_id=job.vendor_id,
            budget_total=job.budget_total,
            guest_count=job.guest_count,
            status=job.status.value,
            perk_text=job.perk_text,
            estimated_savings=job.estimated_savings,
            counter_offer_amount=job.counter_offer_amount,
            rfp_summary=job.rfp_summary,
            error_message=job.error_message,
            completed_at=job.completed_at,
        )


class ShortlistItemModel(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "shortlist_items"
    __table_args__ = (UniqueConstraint("user_id", "vendor_id", name="uq_shortlist_user_vendor"),)

    user_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    vendor_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("vendors.id"), nullable=False, index=True
    )
    negotiation_job_id: Mapped[UUID | None] = mapped_column(
        PGUUID(as_uuid=True), ForeignKey("negotiation_jobs.id"), nullable=True
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(32), nullable=False, default="saved")

    def to_entity(self) -> ShortlistItem:
        return ShortlistItem(
            id=self.id,
            user_id=self.user_id,
            vendor_id=self.vendor_id,
            negotiation_job_id=self.negotiation_job_id,
            notes=self.notes,
            status=self.status,
            created_at=self.created_at,
            updated_at=self.updated_at,
        )

    @classmethod
    def from_entity(cls, item: ShortlistItem) -> "ShortlistItemModel":
        return cls(
            id=item.id,
            user_id=item.user_id,
            vendor_id=item.vendor_id,
            negotiation_job_id=item.negotiation_job_id,
            notes=item.notes,
            status=item.status,
        )

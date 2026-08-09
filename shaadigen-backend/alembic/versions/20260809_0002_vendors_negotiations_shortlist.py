"""vendors, negotiation_jobs, shortlist_items + seed

Revision ID: 20260809_0002
Revises: 20260807_0001
Create Date: 2026-08-09

"""

from typing import Sequence, Union
from uuid import UUID

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20260809_0002"
down_revision: Union[str, None] = "20260807_0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Stable IDs so FE can rely on seeded catalog across environments.
SEED_VENDORS = [
    {
        "id": UUID("11111111-1111-1111-1111-111111111101"),
        "name": "Dilwale Frames Studio",
        "category": "Photographer",
        "location": "Hauz Khas, Delhi",
        "price_min": 150000,
        "price_max": 450000,
        "pricing_unit": "package",
        "rating": 4.9,
        "reviews_count": 312,
        "image_url": "gradient:amber",
        "tags": ["Cinematic Films", "Drone Coverage", "Same-Day Edit"],
        "negotiated_deal": "Free pre-wedding teaser reel worth ₹35,000",
    },
    {
        "id": UUID("11111111-1111-1111-1111-111111111102"),
        "name": "Shutter Shaadi Co.",
        "category": "Photographer",
        "location": "Bandra, Mumbai",
        "price_min": 80000,
        "price_max": 220000,
        "pricing_unit": "package",
        "rating": 4.7,
        "reviews_count": 189,
        "image_url": "gradient:rose",
        "tags": ["Candid", "Traditional", "Album Included"],
        "negotiated_deal": "12% off on 3-day full coverage",
    },
    {
        "id": UUID("11111111-1111-1111-1111-111111111103"),
        "name": "Rajwada Caterers",
        "category": "Caterer",
        "location": "Chandni Chowk, Delhi",
        "price_min": 900,
        "price_max": 2800,
        "pricing_unit": "per_plate",
        "rating": 4.8,
        "reviews_count": 540,
        "image_url": "gradient:emerald",
        "tags": ["Live Chaat Counter", "Awadhi Cuisine", "Jain Menu"],
        "negotiated_deal": "Complimentary dessert counter for 200+ plates",
    },
    {
        "id": UUID("11111111-1111-1111-1111-111111111104"),
        "name": "Zaika-e-Shaadi Kitchens",
        "category": "Caterer",
        "location": "Jubilee Hills, Hyderabad",
        "price_min": 1400,
        "price_max": 4200,
        "pricing_unit": "per_plate",
        "rating": 4.6,
        "reviews_count": 267,
        "image_url": "gradient:gold",
        "tags": ["Hyderabadi Dum Biryani", "Multi-Cuisine", "Live Grills"],
        "negotiated_deal": "Free mocktail bar upgrade worth ₹60,000",
    },
    {
        "id": UUID("11111111-1111-1111-1111-111111111105"),
        "name": "Phool Bagh Decor",
        "category": "Decorator",
        "location": "Udaipur, Rajasthan",
        "price_min": 350000,
        "price_max": 1800000,
        "pricing_unit": "package",
        "rating": 4.9,
        "reviews_count": 145,
        "image_url": "gradient:rose",
        "tags": ["Floral Mandap", "Palace Weddings", "LED Dance Floor"],
        "negotiated_deal": "Free vidaai flower shower setup",
    },
    {
        "id": UUID("11111111-1111-1111-1111-111111111106"),
        "name": "Roshni Events & Decor",
        "category": "Decorator",
        "location": "Koramangala, Bengaluru",
        "price_min": 120000,
        "price_max": 600000,
        "pricing_unit": "package",
        "rating": 4.5,
        "reviews_count": 203,
        "image_url": "gradient:emerald",
        "tags": ["Pastel Themes", "Eco-Friendly", "Photo Booths"],
        "negotiated_deal": "10% off + free haldi backdrop",
    },
    {
        "id": UUID("11111111-1111-1111-1111-111111111107"),
        "name": "Gulaab Glow Artistry",
        "category": "Makeup Artist",
        "location": "South Extension, Delhi",
        "price_min": 45000,
        "price_max": 150000,
        "pricing_unit": "package",
        "rating": 4.8,
        "reviews_count": 421,
        "image_url": "gradient:gold",
        "tags": ["HD Bridal", "Airbrush", "Hair Styling"],
        "negotiated_deal": "Free engagement-look trial session",
    },
    {
        "id": UUID("11111111-1111-1111-1111-111111111108"),
        "name": "Noor Makeovers",
        "category": "Makeup Artist",
        "location": "Aundh, Pune",
        "price_min": 25000,
        "price_max": 80000,
        "pricing_unit": "package",
        "rating": 4.6,
        "reviews_count": 158,
        "image_url": "gradient:amber",
        "tags": ["Minimal Glam", "South Indian Bridal", "On-Site Team"],
        "negotiated_deal": "Complimentary mehendi-day touch-up",
    },
]


def upgrade() -> None:
    op.create_table(
        "vendors",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("location", sa.String(length=200), nullable=False),
        sa.Column("price_min", sa.Integer(), nullable=False),
        sa.Column("price_max", sa.Integer(), nullable=False),
        sa.Column("pricing_unit", sa.String(length=32), nullable=False),
        sa.Column("rating", sa.Float(), nullable=False),
        sa.Column("reviews_count", sa.Integer(), nullable=False),
        sa.Column("image_url", sa.String(length=255), nullable=False),
        sa.Column("tags", postgresql.ARRAY(sa.String()), nullable=False),
        sa.Column("negotiated_deal", sa.Text(), nullable=False),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_index("ix_vendors_category", "vendors", ["category"])

    op.create_table(
        "negotiation_jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=True),
        sa.Column(
            "vendor_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("vendors.id"),
            nullable=False,
        ),
        sa.Column("budget_total", sa.Integer(), nullable=False),
        sa.Column("guest_count", sa.Integer(), nullable=False, server_default="300"),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("perk_text", sa.Text(), nullable=True),
        sa.Column("estimated_savings", sa.Integer(), nullable=True),
        sa.Column("counter_offer_amount", sa.Integer(), nullable=True),
        sa.Column("rfp_summary", sa.Text(), nullable=True),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
    )
    op.create_index("ix_negotiation_jobs_vendor_id", "negotiation_jobs", ["vendor_id"])
    op.create_index("ix_negotiation_jobs_status", "negotiation_jobs", ["status"])

    op.create_table(
        "shortlist_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id"),
            nullable=False,
        ),
        sa.Column(
            "vendor_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("vendors.id"),
            nullable=False,
        ),
        sa.Column(
            "negotiation_job_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("negotiation_jobs.id"),
            nullable=True,
        ),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="saved"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.UniqueConstraint("user_id", "vendor_id", name="uq_shortlist_user_vendor"),
    )
    op.create_index("ix_shortlist_items_user_id", "shortlist_items", ["user_id"])
    op.create_index("ix_shortlist_items_vendor_id", "shortlist_items", ["vendor_id"])

    vendors_table = sa.table(
        "vendors",
        sa.column("id", postgresql.UUID(as_uuid=True)),
        sa.column("name", sa.String),
        sa.column("category", sa.String),
        sa.column("location", sa.String),
        sa.column("price_min", sa.Integer),
        sa.column("price_max", sa.Integer),
        sa.column("pricing_unit", sa.String),
        sa.column("rating", sa.Float),
        sa.column("reviews_count", sa.Integer),
        sa.column("image_url", sa.String),
        sa.column("tags", postgresql.ARRAY(sa.String())),
        sa.column("negotiated_deal", sa.Text),
        sa.column("is_verified", sa.Boolean),
    )
    op.bulk_insert(
        vendors_table,
        [{**row, "is_verified": True} for row in SEED_VENDORS],
    )


def downgrade() -> None:
    op.drop_index("ix_shortlist_items_vendor_id", table_name="shortlist_items")
    op.drop_index("ix_shortlist_items_user_id", table_name="shortlist_items")
    op.drop_table("shortlist_items")
    op.drop_index("ix_negotiation_jobs_status", table_name="negotiation_jobs")
    op.drop_index("ix_negotiation_jobs_vendor_id", table_name="negotiation_jobs")
    op.drop_table("negotiation_jobs")
    op.drop_index("ix_vendors_category", table_name="vendors")
    op.drop_table("vendors")

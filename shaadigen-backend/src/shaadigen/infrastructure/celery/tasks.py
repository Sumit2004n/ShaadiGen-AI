"""Background tasks — try-on stubs and vendor negotiation."""

import asyncio
from uuid import UUID

from shaadigen.application.vendors.use_cases import RunNegotiationUseCase
from shaadigen.infrastructure.ai.negotiator import StubAINegotiator
from shaadigen.infrastructure.celery.app import celery_app
from shaadigen.infrastructure.db.repositories import (
    SqlAlchemyNegotiationRepository,
    SqlAlchemyVendorRepository,
)
from shaadigen.infrastructure.db.session import get_session_factory


@celery_app.task(name="shaadigen.ping")
def ping() -> dict[str, str]:
    return {"status": "ok", "worker": "shaadigen"}


@celery_app.task(name="shaadigen.ai.virtual_tryon")
def virtual_tryon_task(
    job_id: str,
    person_image_url: str,
    garment_image_url: str,
) -> dict[str, str]:
    """Placeholder for virtual try-on pipeline (fal.ai / custom model)."""
    return {
        "job_id": job_id,
        "status": "queued_stub",
        "person_image_url": person_image_url,
        "garment_image_url": garment_image_url,
    }


async def _run_negotiation(job_id: str) -> dict[str, str | int | None]:
    factory = get_session_factory()
    async with factory() as session:
        try:
            use_case = RunNegotiationUseCase(
                SqlAlchemyVendorRepository(session),
                SqlAlchemyNegotiationRepository(session),
                StubAINegotiator(),
            )
            result = await use_case.execute(UUID(job_id))
            await session.commit()
            return {
                "job_id": str(result.job_id),
                "status": result.status.value,
                "vendor_id": str(result.vendor_id),
                "perk_text": result.perk_text,
                "estimated_savings": result.estimated_savings,
            }
        except Exception:
            await session.rollback()
            raise


@celery_app.task(name="shaadigen.vendors.negotiate")
def negotiate_vendor_task(job_id: str) -> dict[str, str | int | None]:
    """Process a queued vendor negotiation job."""
    return asyncio.run(_run_negotiation(job_id))


def enqueue_negotiation(job_id: UUID) -> None:
    negotiate_vendor_task.delay(str(job_id))

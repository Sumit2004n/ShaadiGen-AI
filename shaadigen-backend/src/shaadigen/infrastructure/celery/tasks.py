"""Background task stubs — try-on, media generation, chatbot jobs."""

from shaadigen.infrastructure.celery.app import celery_app


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

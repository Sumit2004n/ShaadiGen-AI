"""AI provider facade — keep vendor SDKs out of domain/application."""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass(frozen=True)
class TryOnResult:
    job_id: str
    status: str
    result_image_url: str | None = None
    message: str = ""


@dataclass(frozen=True)
class ChatReply:
    reply: str
    model: str


class AIProviderPort(ABC):
    @abstractmethod
    async def virtual_tryon(
        self,
        *,
        job_id: str,
        person_image_url: str,
        garment_image_url: str,
    ) -> TryOnResult:
        raise NotImplementedError

    @abstractmethod
    async def chat(self, *, message: str, context: str | None = None) -> ChatReply:
        raise NotImplementedError


class StubAIProvider(AIProviderPort):
    """Local/dev stub so the API boots without external AI keys."""

    async def virtual_tryon(
        self,
        *,
        job_id: str,
        person_image_url: str,
        garment_image_url: str,
    ) -> TryOnResult:
        return TryOnResult(
            job_id=job_id,
            status="stub",
            result_image_url=None,
            message="AI try-on stub — wire fal.ai / custom model in a later milestone",
        )

    async def chat(self, *, message: str, context: str | None = None) -> ChatReply:
        _ = context
        return ChatReply(
            reply=f"[stub] You said: {message[:200]}",
            model="stub-v0",
        )

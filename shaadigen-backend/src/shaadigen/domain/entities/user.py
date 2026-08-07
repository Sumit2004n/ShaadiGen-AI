"""User domain entity — framework-free."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from uuid import UUID, uuid4


class UserRole(StrEnum):
    COUPLE = "couple"
    VENDOR = "vendor"
    GUEST = "guest"
    ADMIN = "admin"


@dataclass
class User:
    email: str
    hashed_password: str
    full_name: str
    role: UserRole = UserRole.COUPLE
    id: UUID = field(default_factory=uuid4)
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None

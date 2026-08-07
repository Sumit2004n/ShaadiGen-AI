"""Database infrastructure."""

from shaadigen.infrastructure.db import models as models
from shaadigen.infrastructure.db.base import Base

__all__ = ["Base", "models"]

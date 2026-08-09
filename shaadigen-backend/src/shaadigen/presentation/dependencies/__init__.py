"""FastAPI dependency providers."""

from shaadigen.presentation.dependencies.auth import (
    CurrentUser,
    OptionalUser,
    get_current_user,
    get_optional_user,
)

__all__ = [
    "CurrentUser",
    "OptionalUser",
    "get_current_user",
    "get_optional_user",
]

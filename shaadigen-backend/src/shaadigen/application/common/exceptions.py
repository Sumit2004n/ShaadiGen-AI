"""Application-layer exceptions mapped to HTTP in presentation."""


class ApplicationError(Exception):
    """Base application error."""

    def __init__(self, message: str = "Application error") -> None:
        self.message = message
        super().__init__(message)


class ConflictError(ApplicationError):
    pass


class NotFoundError(ApplicationError):
    pass


class AuthenticationError(ApplicationError):
    pass


class AuthorizationError(ApplicationError):
    pass

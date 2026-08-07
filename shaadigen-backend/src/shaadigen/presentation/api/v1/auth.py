"""Auth routes — Milestone 1 skeleton (+ register/login ready for wiring)."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from shaadigen.application.auth.dto import LoginCommand, RegisterUserCommand
from shaadigen.application.auth.use_cases import (
    GetAuthStatusUseCase,
    LoginUserUseCase,
    RegisterUserUseCase,
)
from shaadigen.infrastructure.db.repositories import SqlAlchemyUserRepository
from shaadigen.infrastructure.db.session import get_db_session
from shaadigen.presentation.api.v1.schemas import (
    AuthStatusResponse,
    AuthTokenResponse,
    LoginRequest,
    RegisterRequest,
)

router = APIRouter(prefix="/auth", tags=["auth"])

DbSession = Annotated[AsyncSession, Depends(get_db_session)]


@router.get("/status", response_model=AuthStatusResponse)
async def auth_status() -> AuthStatusResponse:
    result = await GetAuthStatusUseCase().execute()
    return AuthStatusResponse(
        authenticated=result.authenticated,
        user_id=result.user_id,
        email=result.email,
        role=result.role,
        message=result.message,
    )


@router.post(
    "/register",
    response_model=AuthTokenResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(body: RegisterRequest, session: DbSession) -> AuthTokenResponse:
    use_case = RegisterUserUseCase(SqlAlchemyUserRepository(session))
    result = await use_case.execute(
        RegisterUserCommand(
            email=str(body.email),
            password=body.password,
            full_name=body.full_name,
            role=body.role,
        )
    )
    return AuthTokenResponse(
        access_token=result.access_token,
        token_type=result.token_type,
        user_id=result.user_id,
        email=result.email,
        role=result.role,
    )


@router.post("/login", response_model=AuthTokenResponse)
async def login(body: LoginRequest, session: DbSession) -> AuthTokenResponse:
    use_case = LoginUserUseCase(SqlAlchemyUserRepository(session))
    result = await use_case.execute(
        LoginCommand(email=str(body.email), password=body.password)
    )
    return AuthTokenResponse(
        access_token=result.access_token,
        token_type=result.token_type,
        user_id=result.user_id,
        email=result.email,
        role=result.role,
    )

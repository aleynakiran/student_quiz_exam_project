"""Authentication routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from schemas.auth import AuthTokenResponse, LoginRequest, RegisterRequest, UserPublic
from services.auth_service import AuthService

router = APIRouter()


def _user_public(user) -> UserPublic:
    return UserPublic(
        id=user.id,
        full_name=user.full_name,
        email=user.email,
        role=user.role.value,
    )


@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    svc = AuthService(db)
    try:
        user = svc.register(body)
        return _user_public(user)
    except ValueError as exc:
        if str(exc) == "email_exists":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered",
            ) from exc
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid registration") from exc


@router.post("/login", response_model=AuthTokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    svc = AuthService(db)
    try:
        token, user = svc.login(body)
        return AuthTokenResponse(access_token=token, user=_user_public(user))
    except ValueError as exc:
        if str(exc) == "invalid_credentials":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            ) from exc
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Login failed") from exc


@router.get("/status")
def auth_layer_status():
    return {"layer": "api", "module": "auth", "status": "live"}

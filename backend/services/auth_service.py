"""Authentication business logic."""

from sqlalchemy.orm import Session

from core.security import create_access_token, hash_password, verify_password
from models.user import User, UserRole
from repositories.user_repository import UserRepository
from schemas.auth import LoginRequest, RegisterRequest


class AuthService:
    def __init__(self, db: Session) -> None:
        self._db = db
        self._users = UserRepository(db)

    def register(self, data: RegisterRequest) -> User:
        email = data.email.lower().strip()
        if self._users.get_by_email(email):
            raise ValueError("email_exists")

        role = UserRole.TEACHER if data.role == "teacher" else UserRole.STUDENT

        user = User(
            full_name=data.full_name.strip(),
            email=email,
            password_hash=hash_password(data.password),
            role=role,
        )
        return self._users.create(user)

    def login(self, data: LoginRequest) -> tuple[str, User]:
        email = data.email.lower().strip()
        user = self._users.get_by_email(email)
        if user is None or not verify_password(data.password, user.password_hash):
            raise ValueError("invalid_credentials")

        token = create_access_token({"sub": str(user.id), "role": user.role.value})
        return token, user

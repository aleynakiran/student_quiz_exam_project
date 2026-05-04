"""User entity."""

import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum as SQLEnum, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(
        SQLEnum(UserRole, values_callable=lambda obj: [e.value for e in obj], native_enum=False, length=32),
        nullable=False,
        default=UserRole.STUDENT,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        server_default=func.now(),
        nullable=False,
    )

    quizzes_created: Mapped[list["Quiz"]] = relationship("Quiz", back_populates="creator")
    submissions: Mapped[list["Submission"]] = relationship("Submission", back_populates="student")

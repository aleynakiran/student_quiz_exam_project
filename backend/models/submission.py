"""Submission entity."""

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    quiz_id: Mapped[int] = mapped_column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    started_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=False),
        server_default=func.now(),
        nullable=False,
    )
    submitted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=False), nullable=True)
    is_auto_submitted: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="submissions")
    student: Mapped["User"] = relationship("User", back_populates="submissions")
    result: Mapped["Result | None"] = relationship("Result", back_populates="submission", uselist=False)
    answers: Mapped[list["SubmissionAnswer"]] = relationship(
        "SubmissionAnswer",
        back_populates="submission",
        cascade="all, delete-orphan",
    )

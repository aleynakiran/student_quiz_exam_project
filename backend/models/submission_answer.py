"""Per-question responses for a submission."""

from sqlalchemy import Boolean, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base


class SubmissionAnswer(Base):
    __tablename__ = "submission_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    submission_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("submissions.id"),
        nullable=False,
        index=True,
    )
    question_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("questions.id"),
        nullable=False,
        index=True,
    )
    selected_answer: Mapped[str] = mapped_column(String(8), nullable=False, default="")
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    points_earned: Mapped[float] = mapped_column(Float, nullable=False, default=0)

    submission: Mapped["Submission"] = relationship("Submission", back_populates="answers")
    question: Mapped["Question"] = relationship("Question")

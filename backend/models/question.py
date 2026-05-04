"""Question entity."""

import enum

from sqlalchemy import Enum as SQLEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from models.base import Base


class QuestionType(str, enum.Enum):
    MULTIPLE_CHOICE = "multiple_choice"


class Question(Base):
    __tablename__ = "questions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    quiz_id: Mapped[int] = mapped_column(Integer, ForeignKey("quizzes.id"), nullable=False, index=True)
    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    question_type: Mapped[QuestionType] = mapped_column(
        SQLEnum(
            QuestionType,
            values_callable=lambda obj: [e.value for e in obj],
            native_enum=False,
            length=32,
        ),
        nullable=False,
        default=QuestionType.MULTIPLE_CHOICE,
    )
    option_a: Mapped[str] = mapped_column(String(512), nullable=False)
    option_b: Mapped[str] = mapped_column(String(512), nullable=False)
    option_c: Mapped[str] = mapped_column(String(512), nullable=False)
    option_d: Mapped[str] = mapped_column(String(512), nullable=False)
    correct_answer: Mapped[str] = mapped_column(String(8), nullable=False)
    points: Mapped[int] = mapped_column(Integer, nullable=False, default=1)

    quiz: Mapped["Quiz"] = relationship("Quiz", back_populates="questions")

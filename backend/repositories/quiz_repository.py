"""Quiz repository."""

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from models.question import Question, QuestionType
from models.quiz import Quiz
from schemas.question import QuestionCreate


class QuizRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_id(self, quiz_id: int) -> Quiz | None:
        stmt = select(Quiz).where(Quiz.id == quiz_id)
        return self._db.scalars(stmt).first()

    def list_active_quizzes(self) -> list[Quiz]:
        stmt = select(Quiz).where(Quiz.is_active.is_(True)).order_by(Quiz.id.asc())
        return list(self._db.scalars(stmt).unique().all())

    def get_active_with_questions(self, quiz_id: int) -> Quiz | None:
        stmt = (
            select(Quiz)
            .options(selectinload(Quiz.questions))
            .where(Quiz.id == quiz_id, Quiz.is_active.is_(True))
        )
        return self._db.scalars(stmt).first()

    def get_with_questions(self, quiz_id: int) -> Quiz | None:
        stmt = select(Quiz).options(selectinload(Quiz.questions)).where(Quiz.id == quiz_id)
        return self._db.scalars(stmt).first()

    def get_owned_with_questions(self, quiz_id: int, creator_id: int) -> Quiz | None:
        stmt = (
            select(Quiz)
            .options(selectinload(Quiz.questions))
            .where(Quiz.id == quiz_id, Quiz.created_by == creator_id)
        )
        return self._db.scalars(stmt).first()

    def list_by_creator(self, creator_id: int) -> list[Quiz]:
        stmt = (
            select(Quiz)
            .options(selectinload(Quiz.questions))
            .where(Quiz.created_by == creator_id)
            .order_by(Quiz.id.desc())
        )
        return list(self._db.scalars(stmt).unique().all())

    def create_with_questions(
        self,
        *,
        creator_id: int,
        title: str,
        description: str | None,
        duration_minutes: int,
        questions: list[QuestionCreate],
    ) -> Quiz:
        quiz = Quiz(
            title=title,
            description=description,
            duration_minutes=duration_minutes,
            created_by=creator_id,
            is_active=True,
        )
        self._db.add(quiz)
        self._db.flush()

        for item in questions:
            correct = item.correct_answer.strip().upper()[:8]
            self._db.add(
                Question(
                    quiz_id=quiz.id,
                    question_text=item.question_text.strip(),
                    question_type=QuestionType.MULTIPLE_CHOICE,
                    option_a=item.option_a.strip(),
                    option_b=item.option_b.strip(),
                    option_c=item.option_c.strip(),
                    option_d=item.option_d.strip(),
                    correct_answer=correct,
                    points=item.points,
                )
            )

        self._db.commit()
        self._db.refresh(quiz)
        return self.get_with_questions(quiz.id)  # type: ignore[return-value]

    def set_active(self, quiz_id: int, creator_id: int, *, is_active: bool) -> Quiz | None:
        quiz = self.get_owned_with_questions(quiz_id, creator_id)
        if quiz is None:
            return None
        quiz.is_active = is_active
        self._db.commit()
        self._db.refresh(quiz)
        return quiz

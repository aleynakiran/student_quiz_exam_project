"""Quiz repository."""

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from models.quiz import Quiz


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

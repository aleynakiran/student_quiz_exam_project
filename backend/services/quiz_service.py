"""Quiz management business logic."""

from sqlalchemy.orm import Session


class QuizService:
    def __init__(self, db: Session) -> None:
        self._db = db

"""Result repository."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.result import Result


class ResultRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_submission_id(self, submission_id: int) -> Result | None:
        stmt = select(Result).where(Result.submission_id == submission_id)
        return self._db.scalars(stmt).first()

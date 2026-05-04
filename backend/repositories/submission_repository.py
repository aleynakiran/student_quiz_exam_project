"""Submission repository."""

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.submission import Submission


class SubmissionRepository:
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_by_id(self, submission_id: int) -> Submission | None:
        stmt = select(Submission).where(Submission.id == submission_id)
        return self._db.scalars(stmt).first()

    def create(self, quiz_id: int, student_id: int) -> Submission:
        submission = Submission(quiz_id=quiz_id, student_id=student_id)
        self._db.add(submission)
        self._db.commit()
        self._db.refresh(submission)
        return submission

    def get_owned(self, submission_id: int, student_id: int) -> Submission | None:
        stmt = select(Submission).where(
            Submission.id == submission_id,
            Submission.student_id == student_id,
        )
        return self._db.scalars(stmt).first()

    def mark_finalized(self, submission: Submission, *, auto_submitted: bool) -> None:
        submission.submitted_at = datetime.now()
        submission.is_auto_submitted = auto_submitted
        self._db.commit()
        self._db.refresh(submission)

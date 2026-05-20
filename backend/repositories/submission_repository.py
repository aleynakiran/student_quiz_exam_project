"""Submission repository."""

from datetime import datetime

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session, joinedload

from models.result import Result
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

    def list_finished_for_quiz(self, quiz_id: int) -> list[Submission]:
        stmt = (
            select(Submission)
            .options(joinedload(Submission.student), joinedload(Submission.result))
            .where(Submission.quiz_id == quiz_id, Submission.submitted_at.isnot(None))
            .order_by(Submission.submitted_at.desc())
        )
        return list(self._db.scalars(stmt).unique().all())

    def stats_by_quiz_ids(self, quiz_ids: list[int]) -> dict[int, dict[str, float | int]]:
        if not quiz_ids:
            return {}
        stmt = (
            select(
                Submission.quiz_id,
                func.count(Submission.id).label("attempts"),
                func.avg(Result.percentage).label("avg_pct"),
                func.sum(case((Result.passed.is_(True), 1), else_=0)).label("passes"),
            )
            .join(Result, Result.submission_id == Submission.id)
            .where(
                Submission.quiz_id.in_(quiz_ids),
                Submission.submitted_at.isnot(None),
            )
            .group_by(Submission.quiz_id)
        )
        out: dict[int, dict[str, float | int]] = {}
        for row in self._db.execute(stmt).all():
            attempts = int(row.attempts or 0)
            passes = int(row.passes or 0)
            out[int(row.quiz_id)] = {
                "attempts": attempts,
                "avg_pct": float(row.avg_pct) if row.avg_pct is not None else None,  # type: ignore[typeddict-item]
                "pass_rate": (passes / attempts) if attempts > 0 else None,  # type: ignore[typeddict-item]
            }
        return out

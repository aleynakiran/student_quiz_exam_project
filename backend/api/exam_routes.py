"""Exam routes."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.dependencies import get_current_user, require_student
from models.user import User
from schemas.exam import (
    ExamReviewResponse,
    FinishExamRequest,
    FinishExamResponse,
    QuizSummary,
    StartExamRequest,
    StartExamResponse,
)
from services.exam_service import ExamService

router = APIRouter()


@router.get("/catalog", response_model=list[QuizSummary])
def exam_catalog(
    _user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ExamService(db).catalog()


@router.post("/start", response_model=StartExamResponse)
def start_exam(
    body: StartExamRequest,
    student: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    try:
        return ExamService(db).start_exam(quiz_id=body.quiz_id, student=student)
    except ValueError as exc:
        code = str(exc)
        if code == "not_student":
            raise HTTPException(status.HTTP_403_FORBIDDEN, detail="Student access only") from exc
        if code == "quiz_not_found":
            raise HTTPException(status.HTTP_404_NOT_FOUND, detail="Quiz not available") from exc
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Unable to start exam") from exc


@router.post("/submissions/{submission_id}/finish", response_model=FinishExamResponse)
def finish_exam(
    submission_id: int,
    body: FinishExamRequest,
    student: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    try:
        return ExamService(db).finish_exam(
            submission_id=submission_id,
            student=student,
            answers=body.answers,
            auto_submitted=body.is_auto_submitted,
        )
    except ValueError as exc:
        code = str(exc)
        mapping = {
            "not_student": (status.HTTP_403_FORBIDDEN, "Student access only"),
            "submission_not_found": (status.HTTP_404_NOT_FOUND, "Submission not found"),
            "already_submitted": (status.HTTP_409_CONFLICT, "Exam already submitted"),
            "quiz_missing": (status.HTTP_404_NOT_FOUND, "Quiz no longer available"),
        }
        if code in mapping:
            stat, detail = mapping[code]
            raise HTTPException(stat, detail=detail) from exc
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Unable to submit exam") from exc


@router.get("/submissions/{submission_id}/review", response_model=ExamReviewResponse)
def review_exam(
    submission_id: int,
    student: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    try:
        return ExamService(db).get_review(submission_id=submission_id, student=student)
    except ValueError as exc:
        code = str(exc)
        mapping = {
            "submission_not_found": (status.HTTP_404_NOT_FOUND, "Submission not found"),
            "still_in_progress": (status.HTTP_409_CONFLICT, "Exam still in progress"),
            "no_result": (status.HTTP_404_NOT_FOUND, "Result not found"),
            "quiz_missing": (status.HTTP_404_NOT_FOUND, "Quiz metadata missing"),
        }
        if code in mapping:
            stat, detail = mapping[code]
            raise HTTPException(stat, detail=detail) from exc
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Unable to load review") from exc


@router.get("/status")
def exam_layer_status():
    return {"layer": "api", "module": "exam", "status": "live"}

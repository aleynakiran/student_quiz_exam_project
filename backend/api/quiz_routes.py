"""Quiz routes (teacher authoring & gradebook)."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from core.database import get_db
from core.dependencies import require_teacher
from models.user import User
from schemas.quiz import (
    QuizActiveUpdate,
    QuizCreateWithQuestions,
    QuizDetailRead,
    QuizRead,
    StudentGradeItem,
    TeacherQuizListItem,
)
from services.quiz_service import QuizService

router = APIRouter()


@router.get("/status")
def quiz_layer_status():
    return {"layer": "api", "module": "quiz", "status": "live"}


def _map_value_error(exc: ValueError) -> HTTPException:
    code = str(exc)
    mapping = {
        "not_teacher": (status.HTTP_403_FORBIDDEN, "Teacher access only"),
        "quiz_not_found": (status.HTTP_404_NOT_FOUND, "Quiz not found"),
        "no_questions": (status.HTTP_400_BAD_REQUEST, "Add at least one question"),
    }
    if code in mapping:
        stat, detail = mapping[code]
        return HTTPException(stat, detail=detail)
    if code.startswith("invalid_correct_answer:"):
        return HTTPException(
            status.HTTP_400_BAD_REQUEST,
            detail="Each question needs correct answer A, B, C, or D",
        )
    return HTTPException(status.HTTP_400_BAD_REQUEST, detail="Invalid quiz data")


@router.post("", response_model=QuizDetailRead, status_code=status.HTTP_201_CREATED)
def create_quiz(
    body: QuizCreateWithQuestions,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    try:
        return QuizService(db).create_quiz(teacher=teacher, data=body)
    except ValueError as exc:
        raise _map_value_error(exc) from exc


@router.get("/mine", response_model=list[TeacherQuizListItem])
def list_my_quizzes(
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    try:
        return QuizService(db).list_mine(teacher=teacher)
    except ValueError as exc:
        raise _map_value_error(exc) from exc


@router.get("/{quiz_id}/grades", response_model=list[StudentGradeItem])
def quiz_grades(
    quiz_id: int,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    try:
        return QuizService(db).grades_for_quiz(teacher=teacher, quiz_id=quiz_id)
    except ValueError as exc:
        raise _map_value_error(exc) from exc


@router.patch("/{quiz_id}", response_model=QuizRead)
def update_quiz_active(
    quiz_id: int,
    body: QuizActiveUpdate,
    teacher: User = Depends(require_teacher),
    db: Session = Depends(get_db),
):
    try:
        return QuizService(db).set_active(teacher=teacher, quiz_id=quiz_id, is_active=body.is_active)
    except ValueError as exc:
        raise _map_value_error(exc) from exc

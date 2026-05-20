"""Quiz schemas."""

from datetime import datetime

from pydantic import BaseModel, Field

from schemas.question import QuestionCreate, QuestionRead


class QuizBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=512)
    description: str | None = None
    duration_minutes: int = Field(default=60, ge=1, le=480)


class QuizCreate(QuizBase):
    pass


class QuizCreateWithQuestions(QuizCreate):
    questions: list[QuestionCreate] = Field(..., min_length=1)


class QuizRead(QuizBase):
    id: int
    created_by: int
    is_active: bool

    class Config:
        from_attributes = True


class QuizDetailRead(QuizRead):
    questions: list[QuestionRead]


class TeacherQuizListItem(BaseModel):
    id: int
    title: str
    description: str | None
    duration_minutes: int
    is_active: bool
    question_count: int
    attempt_count: int
    avg_score: float | None = None
    pass_rate: float | None = None


class StudentGradeItem(BaseModel):
    submission_id: int
    student_id: int
    student_name: str
    student_email: str
    percentage: float
    total_score: float
    passed: bool
    submitted_at: datetime
    is_auto_submitted: bool


class QuizActiveUpdate(BaseModel):
    is_active: bool

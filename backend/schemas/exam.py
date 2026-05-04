"""Exam / quiz-taking API schemas."""

from pydantic import BaseModel, Field


class QuizSummary(BaseModel):
    id: int
    title: str
    description: str | None
    duration_minutes: int

    class Config:
        from_attributes = True


class QuestionTake(BaseModel):
    id: int
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str


class StartExamRequest(BaseModel):
    quiz_id: int = Field(..., ge=1)


class StartExamResponse(BaseModel):
    submission_id: int
    quiz_title: str
    duration_minutes: int
    questions: list[QuestionTake]


class AnswerItem(BaseModel):
    question_id: int
    choice: str | None = None


class FinishExamRequest(BaseModel):
    answers: list[AnswerItem] = Field(default_factory=list)
    is_auto_submitted: bool = False


class WrongAnswerDetail(BaseModel):
    question_id: int
    question_text: str
    your_answer: str | None
    correct_answer: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str


class ExamResultPayload(BaseModel):
    submission_id: int
    quiz_title: str
    total_score: float
    max_score: float
    percentage: float
    passed: bool
    wrong_answers: list[WrongAnswerDetail]


class FinishExamResponse(ExamResultPayload):
    pass


class ExamReviewResponse(ExamResultPayload):
    pass

"""Question schemas."""

from pydantic import BaseModel


class QuestionBase(BaseModel):
    question_text: str
    question_type: str = "multiple_choice"
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str
    points: int = 1


class QuestionCreate(QuestionBase):
    pass


class QuestionRead(QuestionBase):
    id: int
    quiz_id: int

    class Config:
        from_attributes = True

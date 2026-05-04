"""Quiz schemas."""

from pydantic import BaseModel


class QuizBase(BaseModel):
    title: str
    description: str | None = None
    duration_minutes: int = 60


class QuizCreate(QuizBase):
    pass


class QuizRead(QuizBase):
    id: int
    created_by: int
    is_active: bool

    class Config:
        from_attributes = True

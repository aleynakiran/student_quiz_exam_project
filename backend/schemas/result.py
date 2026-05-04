"""Result schemas."""

from pydantic import BaseModel


class ResultRead(BaseModel):
    id: int
    submission_id: int
    total_score: float
    percentage: float
    passed: bool

    class Config:
        from_attributes = True

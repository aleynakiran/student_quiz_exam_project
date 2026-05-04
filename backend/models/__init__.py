"""ORM entities (Persistence Layer mapping)."""

from models.question import Question
from models.quiz import Quiz
from models.result import Result
from models.submission import Submission
from models.submission_answer import SubmissionAnswer
from models.user import User

__all__ = ["User", "Quiz", "Question", "Submission", "SubmissionAnswer", "Result"]

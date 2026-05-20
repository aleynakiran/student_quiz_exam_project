"""Quiz authoring and teacher gradebook (Business Logic Layer)."""

from sqlalchemy.orm import Session

from models.user import User, UserRole
from repositories.quiz_repository import QuizRepository
from repositories.submission_repository import SubmissionRepository
from schemas.question import QuestionCreate, QuestionRead
from schemas.quiz import (
    QuizCreateWithQuestions,
    QuizDetailRead,
    QuizRead,
    StudentGradeItem,
    TeacherQuizListItem,
)


VALID_CHOICES = frozenset({"A", "B", "C", "D"})


class QuizService:
    def __init__(self, db: Session) -> None:
        self._db = db
        self._quizzes = QuizRepository(db)
        self._submissions = SubmissionRepository(db)

    def create_quiz(self, *, teacher: User, data: QuizCreateWithQuestions) -> QuizDetailRead:
        if teacher.role not in (UserRole.TEACHER, UserRole.ADMIN):
            raise ValueError("not_teacher")
        self._validate_questions(data.questions)

        quiz = self._quizzes.create_with_questions(
            creator_id=teacher.id,
            title=data.title.strip(),
            description=data.description.strip() if data.description else None,
            duration_minutes=data.duration_minutes,
            questions=data.questions,
        )
        return self._to_detail(quiz)

    def list_mine(self, *, teacher: User) -> list[TeacherQuizListItem]:
        if teacher.role not in (UserRole.TEACHER, UserRole.ADMIN):
            raise ValueError("not_teacher")

        quizzes = self._quizzes.list_by_creator(teacher.id)
        stats = self._submissions.stats_by_quiz_ids([q.id for q in quizzes])

        items: list[TeacherQuizListItem] = []
        for quiz in quizzes:
            row = stats.get(quiz.id, {})
            attempts = int(row.get("attempts", 0))
            avg_raw = row.get("avg_pct")
            pass_raw = row.get("pass_rate")
            items.append(
                TeacherQuizListItem(
                    id=quiz.id,
                    title=quiz.title,
                    description=quiz.description,
                    duration_minutes=quiz.duration_minutes,
                    is_active=quiz.is_active,
                    question_count=len(quiz.questions),
                    attempt_count=attempts,
                    avg_score=round(float(avg_raw), 1) if avg_raw is not None else None,
                    pass_rate=round(float(pass_raw), 3) if pass_raw is not None else None,
                )
            )
        return items

    def grades_for_quiz(self, *, teacher: User, quiz_id: int) -> list[StudentGradeItem]:
        if teacher.role not in (UserRole.TEACHER, UserRole.ADMIN):
            raise ValueError("not_teacher")

        quiz = self._quizzes.get_owned_with_questions(quiz_id, teacher.id)
        if quiz is None:
            raise ValueError("quiz_not_found")

        submissions = self._submissions.list_finished_for_quiz(quiz_id)
        grades: list[StudentGradeItem] = []
        for sub in submissions:
            if sub.result is None or sub.submitted_at is None:
                continue
            grades.append(
                StudentGradeItem(
                    submission_id=sub.id,
                    student_id=sub.student_id,
                    student_name=sub.student.full_name,
                    student_email=sub.student.email,
                    percentage=sub.result.percentage,
                    total_score=sub.result.total_score,
                    passed=sub.result.passed,
                    submitted_at=sub.submitted_at,
                    is_auto_submitted=sub.is_auto_submitted,
                )
            )
        return grades

    def set_active(self, *, teacher: User, quiz_id: int, is_active: bool) -> QuizRead:
        if teacher.role not in (UserRole.TEACHER, UserRole.ADMIN):
            raise ValueError("not_teacher")

        quiz = self._quizzes.set_active(quiz_id, teacher.id, is_active=is_active)
        if quiz is None:
            raise ValueError("quiz_not_found")
        return QuizRead.model_validate(quiz)

    @staticmethod
    def _validate_questions(questions: list[QuestionCreate]) -> None:
        if not questions:
            raise ValueError("no_questions")
        for idx, q in enumerate(questions, start=1):
            choice = q.correct_answer.strip().upper()[:1]
            if choice not in VALID_CHOICES:
                raise ValueError(f"invalid_correct_answer:{idx}")

    @staticmethod
    def _to_detail(quiz) -> QuizDetailRead:
        questions = sorted(quiz.questions, key=lambda item: item.id)
        return QuizDetailRead(
            id=quiz.id,
            title=quiz.title,
            description=quiz.description,
            duration_minutes=quiz.duration_minutes,
            created_by=quiz.created_by,
            is_active=quiz.is_active,
            questions=[QuestionRead.model_validate(q) for q in questions],
        )

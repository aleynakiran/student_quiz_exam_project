"""Exam session orchestration (Business Logic Layer)."""

from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from models.question import Question
from models.result import Result
from models.submission_answer import SubmissionAnswer
from models.user import User, UserRole
from repositories.quiz_repository import QuizRepository
from repositories.result_repository import ResultRepository
from repositories.submission_repository import SubmissionRepository
from schemas.exam import (
    AnswerItem,
    ExamReviewResponse,
    FinishExamResponse,
    QuestionTake,
    QuizSummary,
    StartExamResponse,
    WrongAnswerDetail,
)
from services.scoring_service import grade_question, max_possible_points


class ExamService:
    def __init__(self, db: Session) -> None:
        self._db = db
        self._quizzes = QuizRepository(db)
        self._submissions = SubmissionRepository(db)
        self._results = ResultRepository(db)

    def catalog(self) -> list[QuizSummary]:
        quizzes = self._quizzes.list_active_quizzes()
        return [
            QuizSummary(
                id=q.id,
                title=q.title,
                description=q.description,
                duration_minutes=q.duration_minutes,
            )
            for q in quizzes
        ]

    def start_exam(self, *, quiz_id: int, student: User) -> StartExamResponse:
        if student.role != UserRole.STUDENT:
            raise ValueError("not_student")

        quiz = self._quizzes.get_active_with_questions(quiz_id)
        if quiz is None:
            raise ValueError("quiz_not_found")

        questions = sorted(quiz.questions, key=lambda q: q.id)
        submission = self._submissions.create(quiz_id=quiz.id, student_id=student.id)

        take_questions = [
            QuestionTake(
                id=q.id,
                question_text=q.question_text,
                option_a=q.option_a,
                option_b=q.option_b,
                option_c=q.option_c,
                option_d=q.option_d,
            )
            for q in questions
        ]

        return StartExamResponse(
            submission_id=submission.id,
            quiz_title=quiz.title,
            duration_minutes=quiz.duration_minutes,
            questions=take_questions,
        )

    def finish_exam(
        self,
        *,
        submission_id: int,
        student: User,
        answers: list[AnswerItem],
        auto_submitted: bool,
    ) -> FinishExamResponse:
        if student.role != UserRole.STUDENT:
            raise ValueError("not_student")

        submission = self._submissions.get_owned(submission_id, student.id)
        if submission is None:
            raise ValueError("submission_not_found")
        if submission.submitted_at is not None:
            raise ValueError("already_submitted")

        quiz = self._quizzes.get_active_with_questions(submission.quiz_id)
        if quiz is None:
            raise ValueError("quiz_missing")

        questions = sorted(quiz.questions, key=lambda q: q.id)
        answer_map = {item.question_id: item.choice for item in answers}

        rows: list[SubmissionAnswer] = []
        total_score = 0.0
        for question in questions:
            choice = answer_map.get(question.id)
            correct, pts = grade_question(question, choice)
            total_score += pts
            normalized = ""
            if choice and choice.strip():
                normalized = choice.strip().upper()[:8]
            rows.append(
                SubmissionAnswer(
                    submission_id=submission.id,
                    question_id=question.id,
                    selected_answer=normalized,
                    is_correct=correct,
                    points_earned=pts,
                )
            )

        max_points = max_possible_points(questions)
        percentage = round((total_score / max_points) * 100, 2) if max_points > 0 else 0.0
        score_out_of_100 = percentage
        passed = percentage >= 50.0

        self._db.add_all(rows)
        submission.submitted_at = datetime.now()
        submission.is_auto_submitted = auto_submitted
        self._db.add(
            Result(
                submission_id=submission.id,
                total_score=score_out_of_100,
                percentage=percentage,
                passed=passed,
            )
        )
        self._db.commit()
        self._db.refresh(submission)

        wrong_details = self._wrong_from_rows(rows, questions)
        return FinishExamResponse(
            submission_id=submission.id,
            quiz_title=quiz.title,
            total_score=score_out_of_100,
            max_score=100.0,
            percentage=percentage,
            passed=passed,
            wrong_answers=wrong_details,
        )

    def _wrong_from_rows(
        self,
        rows: list[SubmissionAnswer],
        questions: list[Question],
    ) -> list[WrongAnswerDetail]:
        qmap = {q.id: q for q in questions}
        wrong: list[WrongAnswerDetail] = []
        for row in rows:
            if row.is_correct:
                continue
            question = qmap[row.question_id]
            wrong.append(self._wrong_detail(question, row.selected_answer))
        return wrong

    def _wrong_detail(self, question: Question, selected: str) -> WrongAnswerDetail:
        return WrongAnswerDetail(
            question_id=question.id,
            question_text=question.question_text,
            your_answer=selected or None,
            correct_answer=question.correct_answer.strip().upper(),
            option_a=question.option_a,
            option_b=question.option_b,
            option_c=question.option_c,
            option_d=question.option_d,
        )

    def get_review(self, *, submission_id: int, student: User) -> ExamReviewResponse:
        submission = self._submissions.get_owned(submission_id, student.id)
        if submission is None:
            raise ValueError("submission_not_found")
        if submission.submitted_at is None:
            raise ValueError("still_in_progress")

        result = self._results.get_by_submission_id(submission_id)
        if result is None:
            raise ValueError("no_result")

        quiz = self._quizzes.get_with_questions(submission.quiz_id)
        if quiz is None:
            raise ValueError("quiz_missing")

        questions = sorted(quiz.questions, key=lambda q: q.id)
        stmt = (
            select(SubmissionAnswer)
            .options(joinedload(SubmissionAnswer.question))
            .where(SubmissionAnswer.submission_id == submission_id)
        )
        answer_rows = list(self._db.scalars(stmt).unique().all())

        wrong_details: list[WrongAnswerDetail] = []
        for row in answer_rows:
            if row.is_correct:
                continue
            question = row.question
            wrong_details.append(self._wrong_detail(question, row.selected_answer))

        return ExamReviewResponse(
            submission_id=submission.id,
            quiz_title=quiz.title,
            total_score=result.total_score,
            max_score=100.0,
            percentage=result.percentage,
            passed=result.passed,
            wrong_answers=wrong_details,
        )

"""Scoring helpers (Business Logic Layer)."""

from models.question import Question


def normalize_choice(choice: str | None) -> str:
    if not choice:
        return ""
    s = choice.strip().upper()
    if not s:
        return ""
    return s[0]


def grade_question(question: Question, choice: str | None) -> tuple[bool, float]:
    picked = normalize_choice(choice)
    correct_key = normalize_choice(question.correct_answer)
    ok = picked != "" and picked == correct_key
    return ok, float(question.points) if ok else 0.0


def max_possible_points(questions: list[Question]) -> float:
    return float(sum(q.points for q in questions))

"""Demo quizzes for local / first-boot environments."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from models.question import Question, QuestionType
from models.quiz import Quiz
from models.user import User, UserRole


def _pick_creator(db: Session) -> User | None:
    teacher = db.scalars(select(User).where(User.role == UserRole.TEACHER).order_by(User.id)).first()
    if teacher:
        return teacher
    return db.scalars(select(User).order_by(User.id)).first()


def _add_quiz_with_questions(
    db: Session,
    *,
    creator_id: int,
    title: str,
    description: str,
    duration_minutes: int,
    items: list[tuple[str, str, str, str, str, str, int]],
) -> None:
    quiz = Quiz(
        title=title,
        description=description,
        duration_minutes=duration_minutes,
        created_by=creator_id,
        is_active=True,
    )
    db.add(quiz)
    db.flush()

    for text, a, b, c, d, correct, pts in items:
        db.add(
            Question(
                quiz_id=quiz.id,
                question_text=text,
                question_type=QuestionType.MULTIPLE_CHOICE,
                option_a=a,
                option_b=b,
                option_c=c,
                option_d=d,
                correct_answer=correct,
                points=pts,
            )
        )


def seed_if_needed(db: Session) -> None:
    exists = db.scalars(
        select(Quiz).where(Quiz.title == "Architecture Proficiency Sprint")
    ).first()
    if exists:
        return

    creator = _pick_creator(db)
    if creator is None:
        from core.security import hash_password

        creator = User(
            full_name="Seed Teacher",
            email="seed.teacher@quiz-system.local",
            password_hash=hash_password("ChangeMe!Quiz2026"),
            role=UserRole.TEACHER,
        )
        db.add(creator)
        db.commit()
        db.refresh(creator)

    architecture_items: list[tuple[str, str, str, str, str, str, int]] = [
        (
            "In strict N-tier architecture, which layer should remain unaware of HTTP routing concerns?",
            "Persistence layer",
            "Business logic layer",
            "Presentation / API adapters",
            "Repository interfaces only",
            "C",
            1,
        ),
        (
            "What is the primary responsibility of the Repository layer?",
            "Render UI components",
            "Apply domain rules and orchestration",
            "Abstract data access behind persistence technology",
            "Issue JWT tokens",
            "A",
            1,
        ),
        (
            "Which pairing best describes SQLAlchemy models in this codebase?",
            "Presentation Layer",
            "Business Logic Layer",
            "Persistence mapping (ORM entities)",
            "Infrastructure automation scripts",
            "C",
            1,
        ),
        (
            "Why keep services separate from FastAPI route handlers?",
            "Smaller Docker images",
            "Handlers stay thin; rules stay testable without HTTP",
            "JWT becomes optional",
            "MySQL requires it",
            "B",
            1,
        ),
        (
            "Alembic primarily manages __________.",
            "CSS bundles",
            "Schema migrations for the database",
            "JWT signing keys",
            "Browser caching headers",
            "B",
            1,
        ),
        (
            "Which transport is most accurate for JWT bearer authentication?",
            "LDAP bind only",
            "Authorization: Bearer <token>",
            "Cookie SameSite=Strict only",
            "SSH tunnel headers",
            "B",
            1,
        ),
        (
            "DTO / Pydantic schemas in `schemas/` chiefly protect __________.",
            "Git commit messages",
            "Network boundaries and validation contracts",
            "CPU scheduling",
            "Disk inode allocation",
            "B",
            1,
        ),
        (
            "A repository returning SQLAlchemy entities typically exposes data to __________.",
            "React hooks only",
            "Service layer orchestrators",
            "Webpack loaders",
            "Nginx upstream blocks",
            "B",
            1,
        ),
        (
            "Why avoid merging DB queries directly inside route functions?",
            "It breaks layered boundaries and complicates testing",
            "FastAPI forbids SQL",
            "JWT stops working",
            "Docker Compose fails",
            "A",
            1,
        ),
        (
            "Which concern belongs in the Presentation layer?",
            "JWT expiration curve smoothing",
            "HTTP routing, serialization, status mapping",
            "Table index tuning",
            "Disk snapshot retention",
            "B",
            1,
        ),
        (
            "Horizontal scaling of stateless API replicas primarily requires __________.",
            "Sticky sessions for anonymous TCP",
            "Externalizing sessions / tokens and shared database",
            "Disabling load balancers",
            "Embedding SQLite per replica only",
            "B",
            2,
        ),
        (
            "ACID transactions are chiefly enforced by __________ in this stack.",
            "Tailwind CSS layers",
            "MySQL InnoDB through SQLAlchemy sessions",
            "Framer Motion timelines",
            "Vite HMR socket",
            "B",
            2,
        ),
    ]

    distributed_items: list[tuple[str, str, str, str, str, str, int]] = [
        (
            "CAP theorem: pick two guarantees mentioned most often for partitioned networks.",
            "Consistency + Availability (always)",
            "Consistency + Partition tolerance",
            "Latency + Throughput",
            "CPU + RAM",
            "B",
            1,
        ),
        (
            "What does eventual consistency imply?",
            "Writes never propagate",
            "Replicas converge after some time without guaranteed immediate reads",
            "Every read is serializable instantly",
            "Single-master databases cannot exist",
            "B",
            1,
        ),
        (
            "Idempotent HTTP methods help retries because __________.",
            "They remove JWT requirements",
            "Repeating them does not compound side-effects",
            "They disable logging",
            "They encrypt payloads automatically",
            "B",
            1,
        ),
        (
            "Message queues primarily decouple __________.",
            "Git branches",
            "Producers and consumers in time and scale",
            "DNS TTL values",
            "CSS specificity",
            "B",
            1,
        ),
        (
            "Circuit breakers protect downstream services by __________.",
            "Increasing payload sizes",
            "Failing fast when error thresholds breach",
            "Caching JWT private keys in Redis forever",
            "Disabling HTTPS",
            "B",
            1,
        ),
        (
            "Sagas coordinate __________ transactions across services.",
            "Single-threaded CPU",
            "Distributed long-running workflows with compensations",
            "Font loading",
            "Image rasterization",
            "B",
            1,
        ),
        (
            "Partition tolerance means the system continues despite __________.",
            "Increased bundle size",
            "Network splits between nodes",
            "Dark mode toggles",
            "Lint warnings",
            "B",
            1,
        ),
        (
            "Rate limiting most directly addresses __________.",
            "Theme switching latency",
            "Abuse, bursts, and noisy-neighbor traffic",
            "ORM migrations",
            "CSS grid gaps",
            "B",
            1,
        ),
        (
            "Health checks in orchestrators verify __________.",
            "Logo contrast ratios",
            "Instance readiness for traffic",
            "Git blame authors",
            "Markdown lint rules",
            "B",
            1,
        ),
        (
            "Blue/Green deployments reduce downtime by __________.",
            "Deleting databases mid-deploy",
            "Shifting traffic between two parallel environments",
            "Inlining every dependency",
            "Disabling monitoring",
            "B",
            2,
        ),
    ]

    _add_quiz_with_questions(
        db,
        creator_id=creator.id,
        title="Architecture Proficiency Sprint",
        description=(
            "Timed scenario focusing on layered architectures, repositories, services, "
            "and exam-grade reliability patterns."
        ),
        duration_minutes=15,
        items=architecture_items,
    )

    _add_quiz_with_questions(
        db,
        creator_id=creator.id,
        title="Distributed Systems Drill",
        description=(
            "Foundational concepts in resilience, messaging, and operational readiness "
            "for modern distributed workloads."
        ),
        duration_minutes=40,
        items=distributed_items,
    )

    db.commit()

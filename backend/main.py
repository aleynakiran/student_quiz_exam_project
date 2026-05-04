"""Presentation Layer entry: FastAPI application bootstrap."""

from contextlib import asynccontextmanager

import models  # noqa: F401 — register ORM metadata
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import admin_routes, auth_routes, exam_routes, quiz_routes
from core.database import SessionLocal, engine
from core.seed import seed_if_needed
from models.base import Base


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_if_needed(db)
    finally:
        db.close()
    yield


app = FastAPI(title="Online Quiz System API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api/auth", tags=["auth"])
app.include_router(quiz_routes.router, prefix="/api/quizzes", tags=["quizzes"])
app.include_router(exam_routes.router, prefix="/api/exams", tags=["exams"])
app.include_router(admin_routes.router, prefix="/api/admin", tags=["admin"])


@app.get("/health")
def health():
    return {"status": "ok"}

"""Quiz routes."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
def quiz_layer_status():
    return {"layer": "api", "module": "quiz", "status": "stub"}

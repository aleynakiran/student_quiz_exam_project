"""Admin routes."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/status")
def admin_layer_status():
    return {"layer": "api", "module": "admin", "status": "stub"}

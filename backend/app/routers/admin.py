from fastapi import APIRouter

from app.data.mock_data import RECEIVERS

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/receivers")
def list_receivers():
    return {"success": True, "data": RECEIVERS}

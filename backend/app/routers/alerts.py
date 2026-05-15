from fastapi import APIRouter, HTTPException

from app.data.mock_data import ALERTS
from app.models.schemas import AlertStatusUpdate

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("")
def list_alerts(status: str | None = None):
    data = ALERTS
    if status:
        data = [a for a in ALERTS if a["status"] == status]
    return {"success": True, "data": data}


@router.patch("/{alert_id}/status")
def update_alert_status(alert_id: str, body: AlertStatusUpdate):
    target = next((a for a in ALERTS if a["id"] == alert_id), None)
    if target is None:
        raise HTTPException(status_code=404, detail="Alert not found")

    target["status"] = body.status
    if body.processed_by:
        target["processed_by"] = body.processed_by
    if body.memo:
        target["memo"] = body.memo

    return {"success": True, "data": target}

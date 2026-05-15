from fastapi import APIRouter, HTTPException

from app.data.mock_data import REPORTS

router = APIRouter(prefix="/rag", tags=["rag"])


@router.get("/reports")
def list_reports():
    return {"success": True, "data": REPORTS}


@router.get("/reports/{report_id}")
def get_report(report_id: str):
    report = next((r for r in REPORTS if r["id"] == report_id), None)
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"success": True, "data": report}

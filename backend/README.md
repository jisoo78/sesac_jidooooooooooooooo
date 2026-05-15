# FastAPI Backend

## 1) 실행

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 2) 확인
- Health: `http://localhost:8000/health`
- Swagger: `http://localhost:8000/docs`

## 3) 주요 엔드포인트
- `GET /api/v1/dashboard/tabs`
- `GET /api/v1/dashboard/plants`
- `GET /api/v1/dashboard/plants/{plant_id}/generators`
- `GET /api/v1/dashboard/generators/{generator_id}/assets`
- `GET /api/v1/alerts`
- `PATCH /api/v1/alerts/{alert_id}/status`
- `GET /api/v1/rag/reports`
- `GET /api/v1/rag/reports/{report_id}`
- `GET /api/v1/admin/receivers`

## 4) 프론트 연동 팁
프론트에서 API 호출 시 base URL을 `http://localhost:8000/api/v1`로 맞추면 됩니다.

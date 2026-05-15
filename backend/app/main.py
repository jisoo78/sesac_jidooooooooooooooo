from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.dashboard import router as dashboard_router
from app.routers.alerts import router as alerts_router
from app.routers.rag import router as rag_router
from app.routers.admin import router as admin_router

app = FastAPI(
    title="KOWEPO Anomaly Dashboard API",
    version="0.1.0",
    description="FastAPI backend for KOWEPO dashboard screen transitions and data APIs",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"success": True, "data": {"status": "ok"}}


app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(alerts_router, prefix="/api/v1")
app.include_router(rag_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")

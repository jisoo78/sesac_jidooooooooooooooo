PLANTS = [
    {
        "id": "김포",
        "name": "김포열병합발전소",
        "address": "경기도 김포시 양촌읍 학운리",
        "lat": 37.60,
        "lng": 126.65,
        "capacity": "495 MW",
        "generators_count": 2,
        "status": "normal",
        "warning_count": 0,
        "error_count": 0,
    },
    {
        "id": "서인천",
        "name": "서인천발전본부",
        "address": "인천광역시 서구 장도로 57",
        "lat": 37.52,
        "lng": 126.62,
        "capacity": "1,861.8 MW",
        "generators_count": 8,
        "status": "caution",
        "warning_count": 2,
        "error_count": 0,
    },
]

GENERATORS = {
    "김포": [
        {
            "id": "G-김포-1",
            "plant_id": "김포",
            "name": "김포 #1 발전기",
            "fuel_type": "LNG",
            "status": "normal",
            "is_operating": True,
            "max_mse": 0.31,
            "alert_count": 0,
            "load_factor": 91.2,
            "total_assets": 8,
            "faulty_assets": 0,
        }
    ],
    "서인천": [
        {
            "id": "G-서인천-1",
            "plant_id": "서인천",
            "name": "서인천 #1 발전기",
            "fuel_type": "유연탄",
            "status": "caution",
            "is_operating": True,
            "max_mse": 0.66,
            "alert_count": 2,
            "load_factor": 83.4,
            "total_assets": 9,
            "faulty_assets": 2,
        }
    ],
}

ASSETS = {
    "G-김포-1": [
        {"id": "asm-1", "generator_id": "G-김포-1", "name": "MAC A", "mse": 0.24, "status": "normal"},
        {"id": "asm-2", "generator_id": "G-김포-1", "name": "BAC", "mse": 0.55, "status": "caution"},
    ],
    "G-서인천-1": [
        {"id": "asm-1", "generator_id": "G-서인천-1", "name": "MAC A", "mse": 0.33, "status": "normal"},
        {"id": "asm-2", "generator_id": "G-서인천-1", "name": "BAC", "mse": 0.78, "status": "caution"},
    ],
}

ALERTS = [
    {
        "id": "AL-1092",
        "plant_id": "서인천",
        "generator_id": "G-서인천-1",
        "asset_id": "asm-2",
        "type": "anomaly",
        "severity": "caution",
        "message": "BAC 베어링 온도 급격한 상승 감지",
        "timestamp": "2026-05-08T09:30:00+09:00",
        "status": "unconfirmed",
    }
]

REPORTS = [
    {
        "id": "AL-1092",
        "title": "BAC 베어링 온도 이상 심층 분석",
        "asset": "BAC Gland Seal 모터",
        "status": "High",
        "time": "2026-05-08 09:30:12",
        "score": "78%",
        "summary": "NDE 베어링 온도가 임계치에 근접. 윤활 계통 장애 판단.",
    }
]

RECEIVERS = [
    {
        "id": "e1",
        "email": "kimgwanri@kowepo.co.kr",
        "name": "김관리",
        "plant_id": "서인천",
        "asset_scope": "전체",
        "is_verified": True,
        "is_active": True,
    }
]

NAV_TABS = [
    {"id": "map", "label": "관제 지도"},
    {"id": "monitoring", "label": "설비 모니터링"},
    {"id": "alerts", "label": "이상 징후 이력"},
    {"id": "rag", "label": "AI 분석"},
    {"id": "admin", "label": "유저 관리"},
]

from datetime import datetime

from fastapi import APIRouter, HTTPException

from app.data.mock_data import PLANTS, GENERATORS, ASSETS, NAV_TABS
from app.db import get_connection

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

SENSOR_TABLE_BY_PART_TYPE = {
    "MAC_A": "tb_mac_a_sensor",
    "MAC_B": "tb_mac_b_sensor",
    "BAC": "tb_bac_sensor",
    "DGAN": "tb_dgan_sensor",
    "VHP": "tb_vhp_sensor",
}


def station_key(name: str) -> str:
    return (
        name.replace("발전본부", "")
        .replace("열병합발전소", "")
        .replace("발전소", "")
        .strip()
    )


def format_capacity(value: float | int | None) -> str:
    if value is None:
        return "-"
    return f"{value:,.1f} MW" if float(value) % 1 else f"{int(value):,} MW"


def parse_dt(value):
    if isinstance(value, datetime):
        return value.isoformat()
    if value:
        return str(value)
    return datetime.now().isoformat()


def get_latest_prediction(cur, part_id: int):
    cur.execute(
        """
        SELECT
            m.model_id,
            m.threshold,
            p.anomaly_score,
            p.prediction_time
        FROM tb_model_info m
        LEFT JOIN tb_prediction p ON p.model_id = m.model_id
        WHERE m.part_id = %s
        ORDER BY p.prediction_time DESC, p.prediction_id DESC
        LIMIT 1
        """,
        (part_id,),
    )
    return cur.fetchone()


def get_latest_sensor(cur, part_type: str, part_id: int):
    table = SENSOR_TABLE_BY_PART_TYPE.get(part_type)
    if table is None:
        return None

    cur.execute(
        f"""
        SELECT
            measured_at,
            current,
            NDE_temp,
            DE_temp,
            NDE_X_vibration,
            NDE_Y_vibration,
            DE_X_vibration,
            DE_Y_vibration
        FROM {table}
        WHERE part_id = %s
        ORDER BY measured_at DESC
        LIMIT 1
        """,
        (part_id,),
    )
    return cur.fetchone()


def build_asset(cur, row):
    prediction = get_latest_prediction(cur, row["part_id"]) or {}
    sensor = get_latest_sensor(cur, row["part_type"], row["part_id"]) or {}

    mse = float(prediction.get("anomaly_score") or 0)
    threshold = prediction.get("threshold")
    status = "caution" if threshold is not None and mse > float(threshold) else "normal"

    return {
        "id": str(row["part_id"]),
        "generatorId": str(row["plant_id"]),
        "name": row["part_type"].replace("_", " "),
        "mse": mse,
        "status": status,
        "lastUpdated": parse_dt(sensor.get("measured_at") or prediction.get("prediction_time")),
        "current": sensor.get("current"),
        "tempNDE": sensor.get("NDE_temp"),
        "tempDE": sensor.get("DE_temp"),
        "vibNDE1": sensor.get("NDE_X_vibration"),
        "vibNDE2": sensor.get("NDE_Y_vibration"),
        "vibDE1": sensor.get("DE_X_vibration"),
        "vibDE2": sensor.get("DE_Y_vibration"),
    }


@router.get("/tabs")
def get_tabs():
    return {"success": True, "data": NAV_TABS}


@router.get("/plants")
def get_plants():
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        s.station_id,
                        s.station_name,
                        s.station_lat,
                        s.station_lon,
                        s.station_add,
                        s.station_capacity,
                        COUNT(p.plant_id) AS generators_count
                    FROM tb_power_station s
                    LEFT JOIN tb_power_plant p ON p.station_id = s.station_id
                    GROUP BY
                        s.station_id,
                        s.station_name,
                        s.station_lat,
                        s.station_lon,
                        s.station_add,
                        s.station_capacity
                    ORDER BY s.station_id
                    """
                )
                data = [
                    {
                        "id": station_key(row["station_name"]),
                        "name": row["station_name"],
                        "address": row["station_add"],
                        "lat": row["station_lat"],
                        "lng": row["station_lon"],
                        "capacity": format_capacity(row["station_capacity"]),
                        "generatorsCount": row["generators_count"],
                        "status": "normal",
                        "warningCount": 0,
                        "errorCount": 0,
                    }
                    for row in cur.fetchall()
                ]
        return {"success": True, "data": data}
    except Exception:
        return {"success": True, "data": PLANTS}


@router.get("/plants/{plant_id}/generators")
def get_generators(plant_id: str):
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT
                        p.plant_id,
                        p.plant_name,
                        p.fuel_type,
                        p.plant_status,
                        s.station_name,
                        COUNT(part.part_id) AS total_assets
                    FROM tb_power_plant p
                    JOIN tb_power_station s ON s.station_id = p.station_id
                    LEFT JOIN tb_part part ON part.plant_id = p.plant_id
                    WHERE s.station_name LIKE %s OR CAST(s.station_id AS CHAR) = %s
                    GROUP BY
                        p.plant_id,
                        p.plant_name,
                        p.fuel_type,
                        p.plant_status,
                        s.station_name
                    ORDER BY p.plant_id
                    """,
                    (f"%{plant_id}%", plant_id),
                )
                rows = cur.fetchall()

                data = []
                for row in rows:
                    cur.execute("SELECT part_id, plant_id, part_type FROM tb_part WHERE plant_id = %s", (row["plant_id"],))
                    assets = [build_asset(cur, asset_row) for asset_row in cur.fetchall()]
                    faulty_assets = sum(1 for asset in assets if asset["status"] == "caution")
                    max_mse = max([asset["mse"] for asset in assets], default=0)

                    data.append(
                        {
                            "id": str(row["plant_id"]),
                            "plantId": station_key(row["station_name"]),
                            "name": row["plant_name"],
                            "fuelType": row["fuel_type"],
                            "status": "caution" if faulty_assets else "normal",
                            "isOperating": row["plant_status"] == "운영중",
                            "maxMse": max_mse,
                            "alertCount": faulty_assets,
                            "loadFactor": 100.0 if row["plant_status"] == "운영중" else 0.0,
                            "totalAssets": row["total_assets"],
                            "faultyAssets": faulty_assets,
                        }
                    )

        if not data:
            raise HTTPException(status_code=404, detail="Plant not found")
        return {"success": True, "data": data}
    except HTTPException:
        raise
    except Exception:
        data = GENERATORS.get(plant_id)
        if data is None:
            raise HTTPException(status_code=404, detail="Plant not found")
        return {"success": True, "data": data}


@router.get("/generators/{generator_id}/assets")
def get_assets(generator_id: str):
    try:
        with get_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT part_id, plant_id, part_type, part_name
                    FROM tb_part
                    WHERE plant_id = %s
                    ORDER BY part_code
                    """,
                    (generator_id,),
                )
                data = [build_asset(cur, row) for row in cur.fetchall()]

        if not data:
            raise HTTPException(status_code=404, detail="Generator not found")
        return {"success": True, "data": data}
    except HTTPException:
        raise
    except Exception:
        data = ASSETS.get(generator_id)
        if data is None:
            raise HTTPException(status_code=404, detail="Generator not found")
        return {"success": True, "data": data}

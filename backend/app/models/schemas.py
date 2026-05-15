from typing import Literal, Optional
from pydantic import BaseModel

Status = Literal["normal", "caution", "none"]


class Plant(BaseModel):
    id: str
    name: str
    address: str
    lat: float
    lng: float
    capacity: str
    generators_count: int
    status: Status
    warning_count: int
    error_count: int


class Generator(BaseModel):
    id: str
    plant_id: str
    name: str
    fuel_type: str
    status: Status
    is_operating: bool
    max_mse: float
    alert_count: int
    load_factor: float
    total_assets: int
    faulty_assets: int


class Asset(BaseModel):
    id: str
    generator_id: str
    name: str
    mse: float
    status: Status


class Alert(BaseModel):
    id: str
    plant_id: str
    generator_id: str
    asset_id: str
    type: Literal["threshold", "anomaly"]
    severity: Status
    message: str
    timestamp: str
    status: Literal["unconfirmed", "confirmed", "resolved", "processing", "false_alarm"]


class Report(BaseModel):
    id: str
    title: str
    asset: str
    status: Literal["Medium", "High", "Critical"]
    time: str
    score: str
    summary: str


class Receiver(BaseModel):
    id: str
    email: str
    name: str
    plant_id: str
    asset_scope: str
    is_verified: bool
    is_active: bool


class NavigationTab(BaseModel):
    id: str
    label: str


class ApiResponse(BaseModel):
    success: bool = True
    data: object


class ErrorResponse(BaseModel):
    success: bool = False
    error: dict


class AlertStatusUpdate(BaseModel):
    status: Literal["unconfirmed", "confirmed", "resolved", "processing", "false_alarm"]
    processed_by: Optional[str] = None
    memo: Optional[str] = None

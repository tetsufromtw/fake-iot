from typing import Any, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class WSMessage(BaseModel):
    event: str
    data: dict = Field(..., min_items=1)
    timestamp: Optional[float] = None

    class Config:
        json_encoders = {
            datetime: lambda v: v.timestamp()
        }


class WSMotorControl(BaseModel):
    action: str
    speed: Optional[int] = None


class WSConnectionStatus(BaseModel):
    status: str
    message: Optional[str] = None


class WSMotor1Status(BaseModel):
    position: int
    timestamp: float
    last_update: datetime


class WSMotor2Status(BaseModel):
    position: int
    timestamp: float
    last_update: datetime


class WSTemperatureStatus(BaseModel):
    value: int
    timestamp: float
    last_update: datetime


class WSMotorStatus(BaseModel):
    angle: float
    rpm: float
    temperature: float
    vibration: float

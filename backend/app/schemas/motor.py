from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MotorStatusResponse(BaseModel):
    angle: Optional[float] = None
    rpm: Optional[float] = None
    temperature: Optional[float] = None
    vibration: Optional[float] = None
    timestamp: Optional[float] = None
    last_update: Optional[datetime] = None
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class MotorControlRequest(BaseModel):
    action: str  # "start" or "stop"
    speed: Optional[int] = None  # 0-100


class MotorStatsResponse(BaseModel):
    mqtt_broker: str
    mqtt_topic: str
    connection_status: str
    messages_received: int
    start_time: datetime
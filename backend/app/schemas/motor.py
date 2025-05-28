from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Motor1StatusResponse(BaseModel):
    position: Optional[int] = None
    timestamp: Optional[float] = None
    last_update: Optional[datetime] = None
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class Motor2StatusResponse(BaseModel):
    position: Optional[int] = None
    timestamp: Optional[float] = None
    last_update: Optional[datetime] = None
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class TemperatureStatusResponse(BaseModel):
    value: Optional[int] = None
    timestamp: Optional[float] = None
    last_update: Optional[datetime] = None
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }


class MotorControlRequest(BaseModel):
    action: str
    speed: Optional[int] = None


class MotorStatsResponse(BaseModel):
    mqtt_broker: str
    motor1_topic: str
    motor2_topic: str
    temp_topic: str
    connection_status: str
    messages_received: int
    start_time: datetime
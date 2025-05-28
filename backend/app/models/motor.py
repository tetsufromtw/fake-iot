from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class Motor1Status(BaseModel):
    position: Optional[int] = None
    timestamp: Optional[float] = None
    last_update: Optional[datetime] = None


class Motor2Status(BaseModel):
    position: Optional[int] = None
    timestamp: Optional[float] = None
    last_update: Optional[datetime] = None


class TemperatureStatus(BaseModel):
    value: Optional[int] = None
    timestamp: Optional[float] = None
    last_update: Optional[datetime] = None


class MotorStats(BaseModel):
    messages_received: int = 0
    connection_status: str = "disconnected"
    start_time: datetime = datetime.now()
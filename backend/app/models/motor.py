from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MotorStatus(BaseModel):
    angle: Optional[float] = None
    rpm: Optional[float] = None
    temperature: Optional[float] = None
    vibration: Optional[float] = None
    timestamp: Optional[float] = None
    last_update: Optional[datetime] = None


class MotorStats(BaseModel):
    messages_received: int = 0
    connection_status: str = "disconnected"
    start_time: datetime = datetime.now()
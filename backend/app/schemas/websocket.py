from typing import Any, Optional
from pydantic import BaseModel
from datetime import datetime


class WSMessage(BaseModel):
    event: str
    data: Any
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
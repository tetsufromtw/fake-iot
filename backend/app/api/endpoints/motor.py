from fastapi import APIRouter, Response
from app.core.mqtt_manager import mqtt_manager
from app.core.config import get_settings

router = APIRouter(prefix="/motor", tags=["motor"])
settings = get_settings()


@router.get("/status")
async def get_motor_status(response: Response):
    if mqtt_manager.motor_status.angle is None:
        response.status_code = 204
        return {"message": "No motor data received yet"}
    
    return {
        "status": "ok",
        "data": mqtt_manager.motor_status.dict()
    }


@router.get("/stats")
async def get_stats():
    return {
        "mqtt_broker": f"{settings.mqtt_broker}:{settings.mqtt_port}",
        "mqtt_topic": settings.mqtt_topic,
        "connection_status": mqtt_manager.stats.connection_status,
        "messages_received": mqtt_manager.stats.messages_received,
        "start_time": mqtt_manager.stats.start_time.isoformat()
    }
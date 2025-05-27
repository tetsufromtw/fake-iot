from datetime import datetime
from fastapi import APIRouter
from app.core.mqtt_manager import mqtt_manager

router = APIRouter(tags=["health"])


@router.get("/")
async def root():
    return {
        "service": "IoT Backend Service",
        "status": "running",
        "mqtt_status": mqtt_manager.stats.connection_status
    }


@router.get("/health")
async def health_check():
    uptime = datetime.now() - mqtt_manager.stats.start_time
    return {
        "status": "healthy",
        "mqtt_connected": mqtt_manager.stats.connection_status == "connected",
        "uptime": str(uptime)
    }
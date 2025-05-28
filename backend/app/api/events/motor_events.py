import logging
import json
from app.core.socketio_manager import socketio_manager
from app.core.mqtt_manager import mqtt_manager
from app.schemas.websocket import WSMotorControl
from app.schemas.motor import Motor1StatusResponse, Motor2StatusResponse, TemperatureStatusResponse

logger = logging.getLogger(__name__)


def register_motor_events(sio):
    @sio.event
    async def connect(sid, environ, auth=None):
        socketio_manager.add_connection(sid)
        
        if mqtt_manager.motor1_status.position is not None:
            await sio.emit(
                "motor1_status",
                json.loads(Motor1StatusResponse(**mqtt_manager.motor1_status.dict()).json()),
                room=sid
            )
        
        if mqtt_manager.motor2_status.position is not None:
            await sio.emit(
                "motor2_status",
                json.loads(Motor2StatusResponse(**mqtt_manager.motor2_status.dict()).json()),
                room=sid
            )
        
        if mqtt_manager.temperature_status.value is not None:
            await sio.emit(
                "temperature_status",
                json.loads(TemperatureStatusResponse(**mqtt_manager.temperature_status.dict()).json()),
                room=sid
            )
        
        await sio.emit(
            "connection_status",
            {"status": mqtt_manager.stats.connection_status},
            room=sid
        )
    
    @sio.event
    async def disconnect(sid):
        socketio_manager.remove_connection(sid)
    
    @sio.event
    async def motor_control(sid, data):
        try:
            control = WSMotorControl(**data)
            logger.info(f"Received motor control: {control}")
            
            await sio.emit(
                "control_response",
                {"status": "success", "action": control.action},
                room=sid
            )
        except Exception as e:
            logger.error(f"Error handling motor control: {e}")
            await sio.emit(
                "control_response",
                {"status": "error", "message": str(e)},
                room=sid
            )
    
    @sio.event
    async def ping(sid):
        await sio.emit("pong", {
            "motor1_timestamp": mqtt_manager.motor1_status.timestamp,
            "motor2_timestamp": mqtt_manager.motor2_status.timestamp,
            "temperature_timestamp": mqtt_manager.temperature_status.timestamp
        }, room=sid)
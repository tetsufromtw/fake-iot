import logging
import json
from app.core.socketio_manager import socketio_manager
from app.core.mqtt_manager import mqtt_manager
from app.schemas.websocket import WSMotorControl
from app.schemas.motor import MotorStatusResponse

logger = logging.getLogger(__name__)


def register_motor_events(sio):
    @sio.event
    async def connect(sid, environ, auth=None):
        socketio_manager.add_connection(sid)
        
        if mqtt_manager.motor_status.angle is not None:
            await sio.emit(
                "motor_status",
                #MotorStatusResponse(**mqtt_manager.motor_status.dict()).dict(),
                json.loads(MotorStatusResponse(**mqtt_manager.motor_status.dict()).json()),
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
        await sio.emit("pong", {"timestamp": mqtt_manager.motor_status.timestamp}, room=sid)
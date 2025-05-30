import logging
from typing import Optional
import socketio
import json
import time
from app.schemas.websocket import WSMessage, WSMotor1Status, WSMotor2Status, WSTemperatureStatus, WSMotorStatus

logger = logging.getLogger(__name__)


class SocketIOManager:
    def __init__(self):
        self.sio: Optional[socketio.AsyncServer] = None
        self.active_connections = set()
    
    def initialize(self, app):
        self.sio = socketio.AsyncServer(
            async_mode='asgi',
            cors_allowed_origins='*',
            logger=True,
            engineio_logger=True
        )

        from app.api.events import register_motor_events
        register_motor_events(self.sio)
        
        app_with_socketio = socketio.ASGIApp(
            socketio_server=self.sio,
            other_asgi_app=app
        )
        
        return app_with_socketio
    
    async def emit_motor1_status(self, data: dict):
        if self.sio:
            _ = WSMotor1Status(**data)
            logger.info(f"🚀 Emitting motor1_status: {data['position']}")
            message = WSMessage(
                event="motor1_status",
                data=data,
                timestamp=time.time()
            )
            await self.sio.emit("motor1_status", json.loads(message.json()))
    
    async def emit_motor2_status(self, data: dict):
        if self.sio:
            _ = WSMotor2Status(**data)
            message = WSMessage(
                event="motor2_status",
                data=data,
                timestamp=time.time()
            )
            await self.sio.emit("motor2_status", json.loads(message.json()))
    
    async def emit_temperature_status(self, data: dict):
        if self.sio:
            _ = WSTemperatureStatus(**data)
            message = WSMessage(
                event="temperature_status",
                data=data,
                timestamp=time.time()
            )
            await self.sio.emit("temperature_status", json.loads(message.json()))
    
    async def emit_motor_status(self, data: dict):
        if self.sio:
            _ = WSMotorStatus(**data)
            message = WSMessage(
                event="motor_status",
                data=data,
                timestamp=time.time()
            )
            await self.sio.emit("motor_status", json.loads(message.json()))
    
    async def emit_connection_status(self, status: str, message: str = None):
        if self.sio:
            await self.sio.emit("connection_status", {
                "status": status,
                "message": message
            })
    
    def add_connection(self, sid: str):
        self.active_connections.add(sid)
        logger.info(f"Client {sid} connected. Total: {len(self.active_connections)}")
    
    def remove_connection(self, sid: str):
        self.active_connections.discard(sid)
        logger.info(f"Client {sid} disconnected. Total: {len(self.active_connections)}")


socketio_manager = SocketIOManager()

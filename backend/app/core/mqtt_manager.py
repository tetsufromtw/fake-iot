import json
import asyncio
import logging
from datetime import datetime
from typing import Optional

import paho.mqtt.client as mqtt
from app.models.motor import MotorStatus, MotorStats
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class MQTTManager:
    """MQTT Connection Manager"""
    
    def __init__(self):
        self.client = mqtt.Client(client_id=settings.mqtt_client_id)
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        self.loop_task: Optional[asyncio.Task] = None
        
        # Data storage
        self.motor_status = MotorStatus()
        self.stats = MotorStats()
        
    def _on_connect(self, client, userdata, flags, rc):
        """MQTT connect callback"""
        if rc == 0:
            logger.info(f"Connected to MQTT Broker: {settings.mqtt_broker}:{settings.mqtt_port}")
            self.stats.connection_status = "connected"
            client.subscribe(settings.mqtt_topic)
            logger.info(f"Subscribed to topic: {settings.mqtt_topic}")
        else:
            logger.error(f"Connection failed, return code: {rc}")
            self.stats.connection_status = "failed"
    
    def _on_disconnect(self, client, userdata, rc):
        """MQTT disconnect callback"""
        logger.warning(f"Disconnected from MQTT Broker, return code: {rc}")
        self.stats.connection_status = "disconnected"
    
    def _on_message(self, client, userdata, msg):
        try:
            payload = json.loads(msg.payload.decode())
            
            self.motor_status.angle = payload.get("angle")
            self.motor_status.rpm = payload.get("rpm")
            self.motor_status.temperature = payload.get("temperature", 0)
            self.motor_status.vibration = payload.get("vibration", 0)
            self.motor_status.timestamp = payload.get("timestamp")
            self.motor_status.last_update = datetime.now()
            
            self.stats.messages_received += 1
            
            # logger.info(
            #     f"Received MQTT message - Angle: {payload.get('angle')}, "
            #     f"RPM: {payload.get('rpm')}"
            # )
            
            from app.core.socketio_manager import socketio_manager
            asyncio.create_task(
                socketio_manager.emit_motor_status(self.motor_status.dict())
            )
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
    
    async def connect_and_subscribe(self):
        """Connect to MQTT Broker and start subscribing"""
        try:
            self.client.connect(settings.mqtt_broker, settings.mqtt_port, 60)
            self.loop_task = asyncio.create_task(self._mqtt_loop())
            logger.info("MQTT client started")
        except Exception as e:
            logger.error(f"Unable to connect to MQTT Broker: {e}")
            self.stats.connection_status = "error"
    
    async def _mqtt_loop(self):
        """Non-blocking MQTT loop"""
        while True:
            self.client.loop(timeout=0.1)
            await asyncio.sleep(0.1)
    
    async def disconnect(self):
        """Disconnect MQTT connection"""
        if self.loop_task:
            self.loop_task.cancel()
            try:
                await self.loop_task
            except asyncio.CancelledError:
                pass
        self.client.disconnect()
        logger.info("MQTT client closed")

mqtt_manager = MQTTManager()
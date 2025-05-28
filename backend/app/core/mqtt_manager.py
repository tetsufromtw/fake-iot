import json
import asyncio
import logging
import time
from datetime import datetime
from typing import Optional

import paho.mqtt.client as mqtt
from app.models.motor import Motor1Status, Motor2Status, TemperatureStatus, MotorStats
from app.core.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


class MQTTManager:
    
    def __init__(self):
        self.client = mqtt.Client(client_id=settings.mqtt_client_id)
        self.client.on_connect = self._on_connect
        self.client.on_disconnect = self._on_disconnect
        self.client.on_message = self._on_message
        self.loop_task: Optional[asyncio.Task] = None
        
        self.motor1_status = Motor1Status()
        self.motor2_status = Motor2Status()
        self.temperature_status = TemperatureStatus()
        self.stats = MotorStats()
        
    def _on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            logger.info(f"Connected to MQTT Broker: {settings.mqtt_broker}:{settings.mqtt_port}")
            self.stats.connection_status = "connected"
            
            client.subscribe(settings.motor1_topic)
            client.subscribe(settings.motor2_topic)
            client.subscribe(settings.temp_topic)
            
            logger.info(f"Subscribed to topics: {settings.motor1_topic}, {settings.motor2_topic}, {settings.temp_topic}")
        else:
            logger.error(f"Connection failed, return code: {rc}")
            self.stats.connection_status = "failed"
    
    def _on_disconnect(self, client, userdata, rc):
        logger.warning(f"Disconnected from MQTT Broker, return code: {rc}")
        self.stats.connection_status = "disconnected"
    
    def _on_message(self, client, userdata, msg):
        try:
            topic = msg.topic
            value = int(msg.payload.decode())
            current_time = time.time()
            
            from app.core.socketio_manager import socketio_manager
            
            if topic == settings.motor1_topic:
                self.motor1_status.position = value
                self.motor1_status.timestamp = current_time
                self.motor1_status.last_update = datetime.now()
                
                asyncio.create_task(
                    socketio_manager.emit_motor1_status(self.motor1_status.dict())
                )
                
            elif topic == settings.motor2_topic:
                self.motor2_status.position = value
                self.motor2_status.timestamp = current_time
                self.motor2_status.last_update = datetime.now()
                
                asyncio.create_task(
                    socketio_manager.emit_motor2_status(self.motor2_status.dict())
                )
                
            elif topic == settings.temp_topic:
                self.temperature_status.value = value
                self.temperature_status.timestamp = current_time
                self.temperature_status.last_update = datetime.now()
                
                asyncio.create_task(
                    socketio_manager.emit_temperature_status(self.temperature_status.dict())
                )
            
            self.stats.messages_received += 1
            
        except Exception as e:
            logger.error(f"Error processing message: {e}")
    
    async def connect_and_subscribe(self):
        try:
            self.client.connect(settings.mqtt_broker, settings.mqtt_port, 60)
            self.loop_task = asyncio.create_task(self._mqtt_loop())
            logger.info("MQTT client started")
        except Exception as e:
            logger.error(f"Unable to connect to MQTT Broker: {e}")
            self.stats.connection_status = "error"
    
    async def _mqtt_loop(self):
        while True:
            self.client.loop(timeout=0.1)
            await asyncio.sleep(0.001)
    
    async def disconnect(self):
        if self.loop_task:
            self.loop_task.cancel()
            try:
                await self.loop_task
            except asyncio.CancelledError:
                pass
        self.client.disconnect()
        logger.info("MQTT client closed")

mqtt_manager = MQTTManager()
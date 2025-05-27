import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.core.mqtt_manager import mqtt_manager
from app.core.socketio_manager import socketio_manager
from app.api.endpoints import health, motor
from app.api.events import register_motor_events

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await mqtt_manager.connect_and_subscribe()
    yield
    await mqtt_manager.disconnect()


app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(motor.router)

app_with_socketio = socketio_manager.initialize(app)
#register_motor_events(socketio_manager.sio)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app_with_socketio, host="0.0.0.0", port=8000)
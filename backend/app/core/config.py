import os
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mqtt_broker: str = "localhost"
    mqtt_port: int = 1883
    mqtt_topic: str = "/motor/status"
    mqtt_client_id: str = "backend-service"
    
    api_title: str = "IoT Backend Service"
    api_version: str = "1.0.0"
    api_description: str = "Backend service for IoT motor monitoring"
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings():
    return Settings()
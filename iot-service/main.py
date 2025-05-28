import os
import json
import time
import logging
from itertools import cycle

import pandas as pd
import paho.mqtt.client as mqtt
from dotenv import load_dotenv

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

MQTT_BROKER = os.getenv('MQTT_BROKER', 'localhost')
MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
MOTOR1_TOPIC = os.getenv('MOTOR1_TOPIC', 'motor/1/pos')
MOTOR2_TOPIC = os.getenv('MOTOR2_TOPIC', 'motor/2/pos')
TEMP_TOPIC = os.getenv('TEMP_TOPIC', 'sensor/1/temp')
MQTT_CLIENT_ID = os.getenv('MQTT_CLIENT_ID', 'iot-service')

CSV_FILE = os.getenv('CSV_FILE', 'data.csv')
SEND_INTERVAL = float(os.getenv('SEND_INTERVAL', 0.001))


def on_connect(client, userdata, flags, rc):
    if rc == 0:
        logger.info(f"Connected to MQTT Broker: {MQTT_BROKER}:{MQTT_PORT}")
    else:
        logger.error(f"Connection failed, return code: {rc}")


def on_disconnect(client, userdata, rc):
    logger.warning(f"Disconnected from MQTT Broker, return code: {rc}")


def on_publish(client, userdata, mid):
    logger.debug(f"Message published, message ID: {mid}")


def load_data(file_path):
    try:
        df = pd.read_csv(file_path)
        logger.info(f"Successfully loaded {len(df)} records")
        return df
    except FileNotFoundError:
        logger.error(f"File not found: {file_path}")
        return None
    except Exception as e:
        logger.error(f"Error reading CSV: {e}")
        return None


def main():
    df = load_data(CSV_FILE)
    if df is None or df.empty:
        logger.error("Failed to load data or data is empty")
        return

    required_columns = ['motor1_pos', 'motor2_pos', 'temperature']
    if not all(col in df.columns for col in required_columns):
        logger.error(f"CSV file missing required columns: {required_columns}")
        return

    client = mqtt.Client(client_id=MQTT_CLIENT_ID)
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_publish = on_publish

    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
    except Exception as e:
        logger.error(f"Unable to connect to MQTT Broker: {e}")
        return

    #time.sleep(0.1)

    data_cycle = cycle(df.to_dict('records'))

    logger.info(f"Start sending data to topics: {MOTOR1_TOPIC}, {MOTOR2_TOPIC}, {TEMP_TOPIC}")
    
    try:
        while True:
            data = next(data_cycle)
            logger.info(f"📤 Sending: motor1={data['motor1_pos']}, motor2={data['motor2_pos']}")

            
            motor1_result = client.publish(MOTOR1_TOPIC, str(int(data['motor1_pos'])), qos=1)
            motor2_result = client.publish(MOTOR2_TOPIC, str(int(data['motor2_pos'])), qos=1)
            temp_result = client.publish(TEMP_TOPIC, str(int(data['temperature'])), qos=1)
            time.sleep(1/50.0)
            #time.sleep(SEND_INTERVAL)
            
    except KeyboardInterrupt:
        logger.info("Received interrupt signal, shutting down...")
    except Exception as e:
        logger.error(f"Error occurred: {e}")
    finally:
        client.loop_stop()
        client.disconnect()
        logger.info("MQTT connection closed")


if __name__ == "__main__":
    main()
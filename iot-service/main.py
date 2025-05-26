import os
import json
import time
import logging
from itertools import cycle

import pandas as pd
import paho.mqtt.client as mqtt
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MQTT settings
MQTT_BROKER = os.getenv('MQTT_BROKER', 'localhost')
MQTT_PORT = int(os.getenv('MQTT_PORT', 1883))
MQTT_TOPIC = os.getenv('MQTT_TOPIC', '/motor/status')
MQTT_CLIENT_ID = os.getenv('MQTT_CLIENT_ID', 'iot-service')

# Data settings
CSV_FILE = os.getenv('CSV_FILE', 'data.csv')
SEND_INTERVAL = float(os.getenv('SEND_INTERVAL', 1.0))


def on_connect(client, userdata, flags, rc):
    """MQTT connect callback"""
    if rc == 0:
        logger.info(f"Connected to MQTT Broker: {MQTT_BROKER}:{MQTT_PORT}")
    else:
        logger.error(f"Connection failed, return code: {rc}")


def on_disconnect(client, userdata, rc):
    """MQTT disconnect callback"""
    logger.warning(f"Disconnected from MQTT Broker, return code: {rc}")


def on_publish(client, userdata, mid):
    """MQTT publish callback"""
    logger.debug(f"Message published, message ID: {mid}")


def load_data(file_path):
    """Load CSV data"""
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
    """Main function"""
    # Load data
    df = load_data(CSV_FILE)
    if df is None or df.empty:
        logger.error("Failed to load data or data is empty")
        return

    # Check required columns
    required_columns = ['angle', 'rpm']
    if not all(col in df.columns for col in required_columns):
        logger.error(f"CSV file missing required columns: {required_columns}")
        return

    # Create MQTT client
    client = mqtt.Client(client_id=MQTT_CLIENT_ID)
    client.on_connect = on_connect
    client.on_disconnect = on_disconnect
    client.on_publish = on_publish

    # Connect to MQTT Broker
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
    except Exception as e:
        logger.error(f"Unable to connect to MQTT Broker: {e}")
        return

    # Wait for connection to establish
    time.sleep(2)

    # Create data cycle iterator
    data_cycle = cycle(df.to_dict('records'))

    logger.info(f"Start sending data to topic: {MQTT_TOPIC}")
    
    try:
        while True:
            # Get next data record
            data = next(data_cycle)
            
            # Prepare payload
            payload = {
                'angle': float(data['angle']),
                'rpm': float(data['rpm']),
                'timestamp': time.time()
            }
            
            # Publish message
            result = client.publish(
                MQTT_TOPIC,
                json.dumps(payload),
                qos=1
            )
            
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                logger.info(f"Sent: angle={payload['angle']}, rpm={payload['rpm']}")
            else:
                logger.error(f"Send failed, error code: {result.rc}")
            
            # Wait for specified interval
            time.sleep(SEND_INTERVAL)
            
    except KeyboardInterrupt:
        logger.info("Received interrupt signal, shutting down...")
    except Exception as e:
        logger.error(f"Error occurred: {e}")
    finally:
        # Clean up resources
        client.loop_stop()
        client.disconnect()
        logger.info("MQTT connection closed")


if __name__ == "__main__":
    main()
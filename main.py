#import neccessary libraries for MicroPython
import network
import time
import machine
import ubinascii
from umqtt.simple import MQTTClient
import ujson

# ==== USER SETTINGS ====
WIFI_SSID = "ultrawiserouter"
WIFI_PASSWORD = "12345678"

MQTT_BROKER = "b890de781a384ca5974549b128d23408.s1.eu.hivemq.cloud"             #Using Hivemq Broker Cloud Credentials
MQTT_PORT = 8883   
MQTT_USER = "Ultrawise"
MQTT_PASSWORD = "Ultrawise001"
MQTT_TOPIC = b"data_center/sensor/001"

SENSOR_ID = "001"
TRIG_PIN = 27   # GPIO Pins on Pico W
ECHO_PIN = 26

# ==== CONNECT TO WIFI ====
def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if not wlan.isconnected():
        print("Connecting to WiFi...")
        wlan.connect(WIFI_SSID, WIFI_PASSWORD)
        while not wlan.isconnected():
            time.sleep(0.5)
    print("Connected:", wlan.ifconfig())
    return wlan

# ==== MEASURE DISTANCE ====
def measure_distance():
    trig = machine.Pin(TRIG_PIN, machine.Pin.OUT)
    echo = machine.Pin(ECHO_PIN, machine.Pin.IN)
    
    # Send trigger pulse
    trig.low()
    time.sleep_us(2)
    trig.high()
    time.sleep_us(10)
    trig.low()
    
    # Measure echo time
    while echo.value() == 0:
        pulse_start = time.ticks_us()
    while echo.value() == 1:
        pulse_end = time.ticks_us()
    
    duration = time.ticks_diff(pulse_end, pulse_start)
    distance_cm = (duration / 2) / 29.1  # convert to cm
    return distance_cm

# ==== CONNECT TO MQTT ====
def connect_mqtt():
    client_id = b"pico-" + ubinascii.hexlify(machine.unique_id())
    client = MQTTClient(
        client_id,
        MQTT_BROKER,
        port=MQTT_PORT,
        user=MQTT_USER,
        password=MQTT_PASSWORD,
        ssl=False   # set True for TLS (if enabled in HiveMQ settings)
    )
    client.connect()
    print("Connected to MQTT broker")
    return client

# ==== MAIN LOOP ====
def main():
    wlan = connect_wifi()
    client = connect_mqtt()

    while True:
        distance = measure_distance()
        payload = ujson.dumps({
            "sensor_id": SENSOR_ID,
            "distance": round(distance, 2),
            "timestamp": time.time()
        })
        client.publish(MQTT_TOPIC, payload)
        print("Published:", payload)
        time.sleep(5)  # publish every 5 seconds

# ==== RUN ====
main()

  
    



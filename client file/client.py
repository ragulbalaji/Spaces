# This code is to be run on the RasPi 3.
# It uses MQTT to toggle an LED connected to GPIO 18.
#
# Topic: "led"
# Message payload:
#   1. "off" - off the LED
#   2. "on" - on the LED

import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO
import sys

ADDR_TO_CONN = "192.168.43.86" #connect to Broker
PORT_TO_CONN = 1883

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    if rc == 0:
        client.subscribe("test") #subscribe to topic "led"
    else:
        sys.exit("Connction refused.") #Broker refused to connect. Exit with error msg.

#initialize GPIO pin 18 to output
def init_gpio():
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(18, GPIO.OUT)

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print("Received message: " + str(msg.payload) + " on topic:" + msg.topic + "' with QoS " + str(msg.qos))
    if msg.topic == "test":
        toggle_light(msg.payload)

def toggle_light(command):
    if command == b"off":
        GPIO.output(18, GPIO.LOW)
    elif command == b"on":
        GPIO.output(18, GPIO.HIGH)


init_gpio() #initialize the GPIO pin

client = mqtt.Client(client_id="testing", clean_session=True, protocol=mqtt.MQTTv311)

client.on_connect = on_connect
client.on_message = on_message

print("Attempting to connect...\r")
client.connect(ADDR_TO_CONN, port=PORT_TO_CONN) #client connects

client.loop_forever()

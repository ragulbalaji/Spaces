# This code is to be run on the RasPi 3.
# It uses MQTT to toggle an LED connected to GPIO 18.
#
# Topic: "led"
# Message payload:
#   1. "off" - off the LED
#   2. "on" - on the LED

import paho.mqtt.client as mqtt
import RPi.GPIO as GPIO


ADDR_TO_CONN = "iot.eclipse.org"
PORT_TO_CONN = 1883

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    client.subscribe("test") #subscribe to topic "test"

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    print("Received message '" + str(message.payload) + "' on topic '" + message.topic + "' with QoS " + str(message.qos))
    if message.topic == "led":
        toggle_light(message.payload)

def toggle_light(command):
    if command == "off":
        GPIO.output(18, GPIO.LOW)
    elif command == "on":
        GPIO.output(18, GPIO.HIGH)


client = mqtt.Client(client_id="test", clean_session=True, protocol=mqtt.MQTTv311)

client.on_connect = on_connect
client.on_message = on_message

print("Attempting to connect...\r")
client.connect(ADDR_TO_CONN, port=PORT_TO_CONN) #client connects

client.loop_forever()

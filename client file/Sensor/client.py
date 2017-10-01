# This file is run by the RasPi of the IoT to allow it to communicate with the
# main server through MQTT and with the actual device through an Arduino
#
#To communicate with the sensor:
#   Topic - "sensor"
#
#   To read temp and humidity level:
#       payload - "read_temp"
#   To read from PIR:
#       payload - "read_presence"
#
#Output from temp and humidity level:
#   b'20 *C 71%'
#
#Output from PIR:
#   b'someone_is_here' - if PIR detects motion
#   b'noone_is_here' - if PIR detects noone

import paho.mqtt.client as mqtt
import sys
import serial
import time


ADDR_OF_ARDUINO = '/dev/ttyACM0'
BAUD_RATE = 9600
ADDR_TO_CONN = "192.168.43.86" #connect to Broker
PORT_TO_CONN = 1883

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    if rc == 0:
        pass
    else:
        sys.exit("Connection refused.") #Broker refused to connect. Exit with error msg.


ser = serial.Serial(ADDR_OF_ARDUINO, BAUD_RATE)

client = mqtt.Client(client_id="sensor", clean_session=True, protocol=mqtt.MQTTv311)

client.on_connect = on_connect

client.connect(ADDR_TO_CONN, port=PORT_TO_CONN) #client connects

client.subscribe("sensor") #subscribe to topic "sensor"



while True:
    data = ser.readline()
    print(data)
    client.publish("sensor_data", payload=data, qos=0, retain=False)
    time.sleep(1)

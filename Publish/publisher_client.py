#This code is run alongside publish.py to read data sent back to the publisher from the client (especially sensors)

import paho.mqtt.client as paho
import paho.mqtt.publish as publish

def on_connect(client, userdata, flags, rc):
        print("CONNACK received with code {}.".format(client.subscribe("sensor_data")))

def on_message(client, userdata,msg):
        print("{} {}".format(msg.topic,msg.payload.decode('utf-8')))

client = paho.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect("172.20.10.7", 1883)
try:
	client.loop_forever()
except UnicodeDecodeError:
	print('Finish')

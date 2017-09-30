import paho.mqtt.client as mqtt
import sys
import serial


ADDR_OF_ARDUINO = '/dev/ttyACM0'
BAUD_RATE = 9600
ADDR_TO_CONN = "172.20.10.7" #connect to Broker
PORT_TO_CONN = 1883

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    if rc == 0:
        pass
    else:
        sys.exit("Connction refused.") #Broker refused to connect. Exit with error msg.


# The RasPi forwards messages from the publisher to the Arduino
def on_message(client, userdata, msg):
    instruction = msg.payload
    topic = msg.topic
    if topic == "TV":
        ser.write(instruction.encode())


ser = serial.Serial(ADDR_OF_ARDUINO, BAUD_RATE)

client = mqtt.Client(client_id="TV", clean_session=True, protocol=mqtt.MQTTv311)

client.on_connect = on_connect
client.on_message = on_message

client.connect(ADDR_TO_CONN, port=PORT_TO_CONN) #client connects

client.subscribe("TV") #subscribe to topic "TV"

client.loop_forever()

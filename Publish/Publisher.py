import paho.mqtt.publish as publish
import paho.mqtt.client as client

x = str(input("Msg: "))
publish.single("", "on_tv", hostname="172.20.10.7")

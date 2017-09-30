import paho.mqtt.publish as publish

x = str(input("Msg: "))
publish.single("TV", "on_tv", hostname="172.20.10.7")

import paho.mqtt.publish as publish

x = str(input("Msg: "))
publish.single("paho/test/single", x, hostname="192.168.43.86")

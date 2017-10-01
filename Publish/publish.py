#This code publishes to MQTT clients.

import paho.mqtt.publish as publish
publish.single("sensor", 'read_presence', hostname="172.20.10.7")

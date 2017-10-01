#!/usr/bin/python3

import cgitb, cgi
#import paho.mqtt.publish as publish
cgitb.enable()

print("Content-Type: text")    # text is following
print()                    # blank line, end of headers

request = cgi.FieldStorage() 

#publish.single(request["thing"], request["r"], hostname="172.20.10.7")

print(request.getvalue("thing") + ' ' + request.getvalue("r"))
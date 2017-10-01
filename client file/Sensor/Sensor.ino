#include <SimpleDHT.h>

// for DHT11,
//      VCC: 5V or 3V
//      GND: GND
//      DATA: 2
// This file assumes that the arduino is serially connected to the RasPi.
int pinDHT11 = 2;
SimpleDHT11 dht11;
String string;
int pirPin = 7; // Input for HC-S501
int pirValue; // Place to store read PIR Value

void setup() {
  Serial.begin(9600);
  pinMode(pirPin, INPUT);
}

void loop() {
  if(Serial.available() && (string = Serial.readString()) == "read_temp"){ //read_temp talks to the DHT11
    byte temperature = 0;
    byte humidity = 0;
    byte data[40] = {0};
    if (dht11.read(pinDHT11, &temperature, &humidity, data)) {
      ;
    }
    Serial.print((int)temperature); Serial.print(" *C, "); //send back data from the sensor
    Serial.print((int)humidity); Serial.println(" %");

  }
  else if (string == "read_presence"){
    if(digitalRead(pirPin)){
      Serial.println("someone_is_here");
    } else {
      Serial.println("noone_is_here");
    }
  }
}

#include <SimpleDHT.h>

// for DHT11,
//      VCC: 5V or 3V
//      GND: GND
//      DATA: 2
// This file assumes that the arduino is serially connected to the RasPi.
int pinDHT11 = 2;
SimpleDHT11 dht11;
String string;

void setup() {
  Serial.begin(9600);
}

void loop() {
  if(Serial.available()){
    Serial.readString(); //receive serial command from RasPi
    byte temperature = 0;
    byte humidity = 0;
    byte data[40] = {0};
    if (dht11.read(pinDHT11, &temperature, &humidity, data)) {
      ;
    }
    Serial.print((int)temperature); Serial.print(" *C, "); //send back data from the sensor
    Serial.print((int)humidity); Serial.println(" %");

  }

}

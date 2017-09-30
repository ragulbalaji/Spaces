#include <SimpleDHT.h>

// for DHT11, 
//      VCC: 5V or 3V
//      GND: GND
//      DATA: 2
int pinDHT11 = 2;
SimpleDHT11 dht11;
String string;

void setup() {
  Serial.begin(9600);
}

void loop() {
  if(Serial.available()){
    Serial.readString();
    // read with raw sample data.
    byte temperature = 0;
    byte humidity = 0;
    byte data[40] = {0};
    if (dht11.read(pinDHT11, &temperature, &humidity, data)) {
      ;
    }
    Serial.print((int)temperature); Serial.print(" *C, ");
    Serial.print((int)humidity); Serial.println(" %");
    
  }

}

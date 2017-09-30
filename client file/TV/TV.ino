#include "U8glib.h"

U8GLIB_SH1106_128X64 u8g(U8G_I2C_OPT_NONE);  // I2C
String string;

void draw(void) {
  // graphic commands to redraw the complete screen should be placed here  
  u8g.setFont(u8g_font_unifont);
  //u8g.setFont(u8g_font_osb21);
  u8g.drawStr( 0, 22, "Test");
}

void clear(void){
  u8g.drawStr( 0, 22, "");
}

void setup(){
  Serial.begin(9600);
  // flip screen, if required
  // u8g.setRot180();
  
  // set SPI backup if required
  //u8g.setHardwareBackup(u8g_backup_avr_spi);

  // assign default color value
  if ( u8g.getMode() == U8G_MODE_R3G3B2 ) {
    u8g.setColorIndex(255);     // white
  }
  else if ( u8g.getMode() == U8G_MODE_GRAY2BIT ) {
    u8g.setColorIndex(3);         // max intensity
  }
  else if ( u8g.getMode() == U8G_MODE_BW ) {
    u8g.setColorIndex(1);         // pixel on
  }
  else if ( u8g.getMode() == U8G_MODE_HICOLOR ) {
    u8g.setHiColorByRGB(255,255,255);
  }
}

void loop()
{ 
  if(Serial.available() && (string = Serial.readString()) == "on_tv"){
    u8g.firstPage();  
    do {
      draw();
    } while( u8g.nextPage() );
  }
  else if (string == "off_tv"){
    u8g.firstPage();
    do{
      clear();
    } while( u8g.nextPage() );
  }
}


/*

*/

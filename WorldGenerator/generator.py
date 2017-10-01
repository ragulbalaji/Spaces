from PIL import Image

filename = "world.png"

blockID = {
    "000000": "", # Null
    "ffffff": 1,  # Wall
    "ff0000": 2,  # Start Point
    "2c0058": 3,  # Generic Floor
    "0000ff": 4,  # Generic Button
    "ffff00": 5,  # Generic Sensor
	"ffff44": "'PS'",  # Presense Sensor
	"ffffaa": "'DHT'",  # DHT Sensor
	"0000af": "'TV'",  # TV DEVICE
}

img = Image.open(filename)
pix = img.load()


def rgba2hex(rgba_color):
    red = int(rgba_color[0])
    green = int(rgba_color[1])
    blue = int(rgba_color[2])
    return '{r:02x}{g:02x}{b:02x}'.format(r=red, g=green, b=blue)


outputBuffer = ""

w, h = img.size
longline = ""
for y in range(h):
	for x in range(w):
		val = blockID[rgba2hex(pix[x, y])]
		if(val == 2):
			spawn = (x,y)
			val = 3 # HARDCODE FLOOR
		longline += str(val)
		longline += ","

print("const SpacesWorld = {\nsize:[" + str(w) + "," + str(h) + "],\nspawn:[" + str(spawn)[1:-1]  + "],\narray:[" + longline + "]\n}\n//module.exports = SpacesWorld // For NODEJS")

const SpacesWorld = require("./gameshare/world.js")

//console.log(SpacesWorld)

var line = "";

for(var i=0;i<SpacesWorld.array.length;i++)
{
    if(i % SpacesWorld.size[0] == 0)
    {
        console.log(line);
        line = "";
    }
    if(SpacesWorld.array[i] == null) line += " ";
    else line += SpacesWorld.array[i];
}
var basicLevel = {
    lengthX: 20,
    widthZ: 20,
    spawn: {
        x: 17,
        z: 3
    },
    objects: [-1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 2, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 0, 0, 0, 2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 0, 0, 3, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, -1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, 1, 0, 0, 1, -1, -1, 1, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 1, -1, 1, 0, 0, 1, -1, -1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, 1, 0, 0, 1, -1, -1, -1, -1, 1, 0, 0, 0, 3, 0, 0, 0, 1, -1, -1, -1, 1, 0, 0, 1, 1, -1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, -1, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, -1, -1, 1, -1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1, 1, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, -1, -1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, -1, -1, 1, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, -1, -1, -1, -1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1]
};

var world = {
    "BasicLevel": basicLevel
};

function loadWorld(name) {
    level = world[name];
    makeSpawn(level.spawn.x, level.spawn.z);
    player.respawnPos = [level.spawn.x, 0, level.spawn.z];
    for (x = 0; x < level.lengthX; x++) {
        for (z = 0; z < level.widthZ; z++) {
            objectID = level.objects[x + (z * level.lengthX)];
            if (objectID >= 0) makeBlock(objectID, x, z);
        }
    }
}

var chunk = {
    size: 7
};

function generateDungeon(seed, sx, sz) {
    makeSpawn(sx, sz);
    generateChunk(seed, sx, sz);
}

function generateChunk(seed, cx, cz) {
    Math.seedrandom(cx + "," + cz + "," + seed);

    var maxNoise = 0;
    var noise = new Array(chunk.size);
    for (var i = 0; i < chunk.size; i++) {
        noise[i] = new Array(chunk.size);
        for (var j = 0; j < chunk.size; j++) {
            noise[i][j] = Math.random();
            if (noise[i][j] > maxNoise) maxNoise = noise[i][j];
        }
    }



}

/*function generateDungeon(seed, complexity) {
    Math.seedrandom(seed);
    var rooms = randomInt(3, 5),
        PG = {
            pos: {
                x: 0,
                z: 0
            },
            lastRMsize: {
                l: 1,
                b: 1
            }
        };
    makeSpawn(2, 2);
    for (var r = 0; r < rooms; r++) {
        var RM = {
            startx: PG.pos.x,
            startz: PG.pos.z,
            Length: randomInt(5, 10),
            Breadth: randomInt(5, 10)
        };
        for (x = 0; x < RM.Length; x++) {
            for (z = 0; z < RM.Breadth; z++) {
                if (x == 0 || z == 0 || x == RM.Length - 1 || z == RM.Breadth - 1) {
                    makeBlock(BlockID.BasicBlock, RM.startx + x, RM.startz + z);
                    continue;
                }
                makeBlock(BlockID.BasicFandC, RM.startx + x, RM.startz + z);
            }
        }
        PG.lastRMsize.l = RM.Length;
        PG.lastRMsize.b = RM.Breadth;
        PG.pos.x += (RM.Length) * randomInt(0, 1);
        PG.pos.z += (RM.Breadth) * randomInt(0, 1);
    }
}*/
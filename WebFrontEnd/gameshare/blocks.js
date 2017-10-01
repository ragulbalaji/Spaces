/*
	"000000": "", # Null
    "ffffff": 1,  # Wall
    "ff0000": 2,  # Start Point
    "2c0058": 3,  # Generic Floor
    "0000ff": 4,  # Generic Button
    "ffff00": 5,  # Generic Sensor
	"ffff44": "'PS'",  # Presense Sensor
	"ffffaa": "'DHT'",  # DHT Sensor
	"0000af": "'TV'",  # TV DEVICE
*/

function makeBlock(id, px, pz) {
    switch (id) {
        case 1: //Wall
            addGameObject(new BasicBlock(px, pz))
            break;
        case 3: // Generic Floor
            addFnC(px, pz)
            break;
        case 4: // Generic Button
            addGameObject(new BasicButton(px, pz))
            addGameObject(new BasicCeiling(px, pz))
            break;
        case 'TV':
            addGameObject(new ArduinoTV(px, pz))
            addGameObject(new BasicCeiling(px, pz))
            break;
        case 'DHT':
            addGameObject(new ArduinoDHT(px, pz))
            addGameObject(new BasicCeiling(px, pz))
            break;
        case 'PS':
            addGameObject(new ArduinoPresense(px, pz))
            addGameObject(new BasicCeiling(px, pz))
            break;
    }
}

function addFnC(px, pz){
    addGameObject(new BasicFloor(px, pz))
    addGameObject(new BasicCeiling(px, pz))
}

function makeSpawn(px, pz) {
    _C.position.set(px, player.y, pz);
}

function killGameObject(it) {
    _S.remove(it.obj);
    gameObjects.splice(gameObjects.indexOf(it), 1);
}

function Block(px, pz) {
    this.x = px;
    this.z = pz;
    this.needsUpdate = false;
    this.update = function () {}
}

function SlopeFloor(px, pz) {
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(1, Math.sqrt(2)), new THREE.MeshBasicMaterial({
        color: '#E91E63',
        side: THREE.DoubleSide
    }));
    this.obj.position.set(px, 0, pz);
    this.obj.rotation.x = Math.PI / 4;
    this.obj.rotation.y = (Math.PI / 2) * randomInt(0, 3);
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.rotateEnabled = false;
    this.obj.selected = function () {
        if (this.rotateEnabled) {
            this.rotateEnabled = false;
        } else {
            this.rotateEnabled = true;
        }
    }
    this.needsUpdate = true;
    this.obj.collidable = true;
    this.rayEnabled = true;
    this.update = function () {
        if (this.obj.rotateEnabled) this.obj.rotation.y += (Math.random() / 200) * DELTA;
    }
}

function BasicFloor(px, pz) {
    //var x = Math.round(Math.abs((128 * Math.sin(px / 10) + 128 * Math.cos(pz / 10))));
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
        color: '#4CAF50'
    }));
    this.obj.position.set(px, -0.5, pz);
    this.obj.rotation.x = -Math.PI / 2;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.selected = function () {
        /*if (!this.material.wireframe) {
            this.collidable = false;
            this.material.wireframe = true;
        } else {
            this.collidable = true;
            this.material.wireframe = false;
        }*/
    }
    this.needsUpdate = false;
    this.rayEnabled = true;
    this.obj.collidable = true;
    this.update = function () {
        /*if(Math.sqrt(Math.pow((this.obj.position.x-_C.position.x),2)+Math.pow((this.obj.position.z-_C.position.z),2))<0.5){
        	this.obj.material.color.r = Math.random();
        	this.obj.material.color.g = Math.random();
        	this.obj.material.color.b = Math.random();
        }//*/
    }
}

function BasicCeiling(px, pz) {
    //var x = Math.round(Math.abs((128 * Math.sin(px / 10) + 128 * Math.cos(pz / 10))));
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
        color: '#607D8B'
    }));
    this.obj.position.set(px, 0.5, pz);
    this.obj.rotation.x = 0.5 * Math.PI;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.selected = function () {
        /*if (!this.material.wireframe) {
            this.collidable = false;
            this.material.wireframe = true;
        } else {
            this.collidable = true;
            this.material.wireframe = false;
        }*/
    }
    this.needsUpdate = false;
    this.obj.collidable = true;
    this.rayEnabled = false;
    this.update = function () {}
}

function BasicBlock(px, pz) {
    //var x = Math.round(Math.abs((128 * Math.sin(px / 11) + 128 * Math.cos(pz / 11))));
    var colorCorrection = 158 + randomInt(-5, 5);
    this.obj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
        color: 'rgb(' + colorCorrection + ',' + colorCorrection + ',' + colorCorrection + ')'
    }));
    this.obj.position.set(px, 0, pz);
    this.obj.alive = true;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.selected = function () {
        /*if (!this.material.wireframe) {
            this.collidable = false;
            this.material.wireframe = true;
        } else {
            this.collidable = true;
            this.material.wireframe = false;
        }*/
    }
    this.needsUpdate = false;
    this.obj.collidable = true;
    this.rayEnabled = true;
    this.update = function () {
        //if(!this.obj.alive) killGameObject(this);
        //this.obj.rotation.x+=(Math.random()/100)*DELTA;
        //this.obj.rotation.y+=(Math.random()/100)*DELTA;
        //this.obj.rotation.z+=(Math.random()/100)*DELTA;
        /*if(Math.sqrt(Math.pow((this.obj.position.x-_C.position.x),2)+Math.pow((this.obj.position.z-_C.position.z),2))<1){
        	killGameObject(this);
        }//*/
    }
}

function BasicButton(px, pz) {
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
        color: '#ffa500'
    }));
    this.obj.position.set(px, -0.5, pz);
    this.obj.rotation.x = -Math.PI / 2;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.resetColorTime = Number.MAX_SAFE_INTEGER
    this.obj.selected = function () {
        this.material.color = new THREE.Color( 0xff0000 )
        this.resetColorTime = Date.now() + 1000
    }
    //
    this.label = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.5), new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(makeTextSprite(["TEST"+px])),
        side: THREE.DoubleSide
    }));
    this.label.position.set(px, 0, pz);
    this.label.rotation.y = Math.random();
    _S.add(this.label);
    this.label.rotation.order = "YXZ";
    //
    this.needsUpdate = true;
    this.rayEnabled = true;
    this.obj.collidable = true;
    this.update = function () {
        this.label.rotation.y = _C.rotation.y;
        this.label.material.map = new THREE.CanvasTexture(makeTextSprite(["TEST"+px++]))
        if(this.obj.resetColorTime < Date.now()){
            this.obj.material.color = new THREE.Color( 0xffa500 )
            this.obj.resetColorTime = Number.MAX_SAFE_INTEGER
        }
    }
}

function ArduinoTV(px, pz) {
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
        color: '#ffa500'
    }));
    this.obj.position.set(px, -0.5, pz);
    this.obj.rotation.x = -Math.PI / 2;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.resetColorEnabled = false
    this.obj.selected = function () {
        if(this.resetColorEnabled){
            this.material.color = new THREE.Color( 0xffa500 )
            MQTTclient.publish("TV", "off_tv")
            this.resetColorEnabled = false
        }else{
            this.material.color = new THREE.Color( 0x00ff00 )
            MQTTclient.publish("TV", "on_tv")
            this.resetColorEnabled = true
        }
    }
    //
    this.label = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.7), new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(makeTextSprite(["TV -"])),
        side: THREE.DoubleSide
    }));
    this.label.position.set(px, 0, pz);
    this.label.rotation.y = Math.random();
    _S.add(this.label);
    this.label.rotation.order = "YXZ";
    //
    this.needsUpdate = true;
    this.rayEnabled = true;
    this.obj.collidable = true;
    this.update = function () {
        this.label.rotation.y = _C.rotation.y;
        this.label.material.map = new THREE.CanvasTexture(makeTextSprite(["TV",(this.obj.resetColorEnabled ? "ON" : "OFF")]))
    }
}

function ArduinoDHT(px, pz) {
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
        color: '#4CAF50'
    }));
    this.obj.position.set(px, -0.5, pz);
    this.obj.rotation.x = -Math.PI / 2;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.selected = function () {
        
    }
    //
    this.label = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.7), new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(makeTextSprite(["DHT -"])),
        side: THREE.DoubleSide
    }));
    this.label.position.set(px, 0, pz);
    this.label.rotation.y = Math.random();
    _S.add(this.label);
    this.label.rotation.order = "YXZ";
    //
    this.needsUpdate = true;
    this.rayEnabled = true;
    this.obj.collidable = true;
    this.update = function () {
        this.label.rotation.y = _C.rotation.y;
        this.label.material.map = new THREE.CanvasTexture(makeTextSprite(["DHT",DHTmsg]))
    }
}

function ArduinoPresense(px, pz) {
    this.obj = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({
        color: '#4CAF50'
    }));
    this.obj.position.set(px, -0.5, pz);
    this.obj.rotation.x = -Math.PI / 2;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.selected = function () {
        
    }
    //
    this.label = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.7), new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(makeTextSprite(["Presence -"])),
        side: THREE.DoubleSide
    }));
    this.label.position.set(px, 0, pz);
    this.label.rotation.y = Math.random();
    _S.add(this.label);
    this.label.rotation.order = "YXZ";
    //
    this.needsUpdate = true;
    this.rayEnabled = true;
    this.obj.collidable = true;
    this.update = function () {
        this.label.rotation.y = _C.rotation.y;
        this.label.material.map = new THREE.CanvasTexture(makeTextSprite(["Presence",Presencemsg]))
    }
}

function PillarBlock(px, pz) {
    this.obj = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), new THREE.MeshBasicMaterial({
        color: 0x989898
    }));
    this.obj.position.set(px, 0, pz);
    this.obj.alive = true;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.rotateEnabled = false;
    this.obj.selected = function () {
        if (this.rotateEnabled) {
            this.rotateEnabled = false;
        } else {
            this.rotateEnabled = true;
        }
    }
    this.needsUpdate = true;
    this.obj.collidable = true;
    this.rayEnabled = true;
    this.update = function () {
        if (this.obj.rotateEnabled) this.obj.rotation.y += (Math.random() / 100) * DELTA;
    }
}

function PunchBlock(px, pz) {
    this.obj = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({
        color: 0x808080
    }));
    this.obj.position.set(px, 0, pz);
    this.obj.alive = true;
    this.obj.health = randomInt(1, 5);
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.selected = function () {
        this.health--;
        this.material.color.g -= Math.random() / 10;
        this.material.color.b -= Math.random() / 10;
        if (this.health == 0) {
            this.alive = false;
            addGameObject(new BasicFloor(px, pz));
            addGameObject(new BasicCeiling(px, pz));
        }
    }
    this.needsUpdate = true;
    this.obj.collidable = true;
    this.rayEnabled = true;
    this.update = function () {
        if (!this.obj.alive) killGameObject(this);
        distanceFromPlayer = Math.sqrt(Math.pow((this.obj.position.x - _C.position.x), 2) + Math.pow((this.obj.position.z - _C.position.z), 2));
        if (distanceFromPlayer < RENDER_DISTANCE) {
            this.obj.material.color.b = 1 - (distanceFromPlayer / 10);
        }
    }
}

function SimpleEntity(px, pz) {
    this.obj = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshBasicMaterial({
        color: 0xFF5722
    }));
    this.obj.position.set(px, 0, pz);
    this.obj.alive = true;
    _S.add(this.obj);
    this.obj.rotation.order = "YXZ";
    this.obj.rotateEnabled = false;
    this.obj.selected = function () {}
    this.needsUpdate = true;
    this.obj.collidable = true;
    this.rayEnabled = true;
    this.update = function () {
        this.obj.rotation.y += (Math.random() / 10) * DELTA;
    }
}

function makeTextSprite(msg){
    canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.health = 128
    ctx = canvas.getContext('2d');
    ctx.font = '30pt Jura';
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);
    ctx.fillStyle = 'black';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for(var i in msg){
        ctx.fillText(msg[i].toString(), canvas.width / 2, canvas.height * (i/(msg.length+2))+30);
    }
    return canvas
}
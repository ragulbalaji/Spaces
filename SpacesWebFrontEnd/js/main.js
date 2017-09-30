//<link href='http://fonts.googleapis.com/css?family=Electrolize' rel='stylesheet' type='text/css'>
_WIDTH = window.innerWidth, _HEIGHT = window.innerHeight;
var universe = {
    gravity: 9.8,
    gravityEnabled: false
};
var RENDER_DISTANCE = 10;
var renderer = Detector.webgl ? new THREE.WebGLRenderer({
    alpha: true
}) : new THREE.CanvasRenderer();
renderer.setClearColor(0x0B1622, 1);
renderer.setSize(_WIDTH, _HEIGHT);
renderer.domElement.id = "gameCanvas";
document.body.appendChild(renderer.domElement);
var _S = new THREE.Scene();
var _C = new THREE.PerspectiveCamera(100, (_WIDTH / 2) / (_HEIGHT / 2), 0.0001, RENDER_DISTANCE);
//var _C = new THREE.OrthographicCamera(_WIDTH / -100, _WIDTH / 100, _HEIGHT / 100, _HEIGHT / -100, 0.0001, 100);
var gameObjects = new Array();
var keys = new Array(255),
    oldKeys = new Array(255);
var lastFrame, DELTA, time, fps = 0,
    tempfps, lastFPS;
var focus = document.getElementById('focus');
var stats = document.getElementById('stats');
var player = {
    y: 0.5,
    movementSpeed: 0.005,
    turnSpeed: 0.004,
    mouseSensitivity: 0.05,
    gamePadTurnSpeed: 0.002,
    gamePadSpeed: 0.002,
    selectSpeed: 100,
    moving: false,
    rayFar: RENDER_DISTANCE - 2,
    collisionDistance: 0.4,
    standDistance: 0.6,
    reachDistance: 2,
    lastSelectTime: 0,
    respawnPos: [0, 0, 0],
};
var playerRayCaster = new THREE.Raycaster();
playerRayCaster.far = player.rayFar;
var playerRay = new Array(); // 0/Forward,1/Right,2/Back,3/Left; 
var worldObstacles = new Array();
var tile_items;
var myConsole = document.getElementById("console"),
    myConsoleData = new Array();
var detectHardwareLoop, hardwareToDetect = 1;
var pad;

window.addEventListener('resize', onWindowResize, false);
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);
document.addEventListener('webkitpointerlockchange', lockChangeAlert, false);

var lockElement = document.getElementById(renderer.domElement.id);
lockElement.requestPointerLock = lockElement.requestPointerLock ||
    lockElement.mozRequestPointerLock ||
    lockElement.webkitRequestPointerLock;

lockElement.onclick = function () {
    lockElement.requestPointerLock();
}

function start() {
    loadAssets();
    lastFPS = getTime();
    getDelta();
    updateFPS();
    _S.fog = new THREE.Fog(0x0B1622, 0, RENDER_DISTANCE * 0.9);
    _C.rotation.order = "YXZ";
    _C.rotation.set(0, 0, 0);

    //generateDungeon(1998, 0, 0);

    loadWorld("BasicLevel");

    universe.gravityEnabled = true;

    /*
    for(x=0;x<100;x++){
    	for(z=0;z<100;z++){
    		if(Math.random()<0.5){
    			makeBlock(BlockID.BasicBlock,x,z);
    		}else{
    			makeBlock(BlockID.BasicFandC,x,z);
    		}
    	}	
    }//*/

    //detectHardwareLoop = setInterval(detectHardware, 1000);

    update();
}

function update() {
    requestAnimationFrame(update);
    getDelta();
    worldObstacles = [];
    for (i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i].needsUpdate) gameObjects[i].update();
        if (gameObjects[i].rayEnabled) worldObstacles.push(gameObjects[i].obj);
    }
    controls();
    render();
    updateFPS();
}

function controls() {
    player.moving = false;
    if (keys[37]) {
        _C.rotation.y += DELTA * player.turnSpeed
    } //Left
    if (keys[39]) {
        _C.rotation.y -= DELTA * player.turnSpeed
    } //Right
    playerRay = [new THREE.Vector3(Math.sin(_C.rotation.y + Math.PI), Math.sin(_C.rotation.x), Math.cos(_C.rotation.y + Math.PI)).normalize(), new THREE.Vector3(Math.sin(_C.rotation.y + Math.PI), 0, Math.cos(_C.rotation.y + Math.PI)).normalize(), new THREE.Vector3(Math.sin(_C.rotation.y + Math.PI / 2), 0, Math.cos(_C.rotation.y + Math.PI / 2)).normalize(), new THREE.Vector3(Math.sin(_C.rotation.y), 0, Math.cos(_C.rotation.y)).normalize(), new THREE.Vector3(Math.sin(_C.rotation.y - Math.PI / 2), 0, Math.cos(_C.rotation.y - Math.PI / 2)).normalize(), new THREE.Vector3(0, -1, 0).normalize()];

    oSR = rayCast(playerRay[0], player.reachDistance);
    //if(oSR != 0) oSR.object.material.wireframe = true;
    oCR0 = rayCast(playerRay[1], player.collisionDistance);
    oCR1 = rayCast(playerRay[2], player.collisionDistance);
    oCR2 = rayCast(playerRay[3], player.collisionDistance);
    oCR3 = rayCast(playerRay[4], player.collisionDistance);
    oCRDown = rayCast(playerRay[5], player.standDistance * 2);

    if (oCRDown != 0 && oCRDown.object.collidable && universe.gravityEnabled) {
        player.y = oCRDown.point.y + player.standDistance;
        _C.position.y = player.y;
    }
    if (oCRDown != 0 && !oCRDown.object.collidable && universe.gravityEnabled) {
        player.y -= universe.gravity * DELTA * 0.0005;
        _C.position.y = player.y;
    } else if (!oCRDown.distance && universe.gravityEnabled) {
        player.y -= universe.gravity * DELTA * 0.0005;
        _C.position.y = player.y;
    }

    if (keys[65] && (oCR3 == 0 || !oCR3.object.collidable)) { //Strafe Left
        player.moving = true;
        _C.position.x -= player.movementSpeed * DELTA * Math.sin(_C.rotation.y + (Math.PI / 2));
        _C.position.z -= player.movementSpeed * DELTA * Math.cos(_C.rotation.y + (Math.PI / 2));
    } else if (keys[68] && (oCR1 == 0 || !oCR1.object.collidable)) { //Strafe Right
        player.moving = true;
        _C.position.x -= player.movementSpeed * DELTA * Math.sin(_C.rotation.y - (Math.PI / 2));
        _C.position.z -= player.movementSpeed * DELTA * Math.cos(_C.rotation.y - (Math.PI / 2));
    }


    if ((keys[87] || keys[38]) && (oCR0 == 0 || !oCR0.object.collidable)) { //Forward
        player.moving = true;
        _C.position.x -= player.movementSpeed * DELTA * Math.sin(_C.rotation.y);
        _C.position.z -= player.movementSpeed * DELTA * Math.cos(_C.rotation.y);
    } else if ((keys[83] || keys[40]) && (oCR2 == 0 || !oCR2.object.collidable)) { //Backward
        player.moving = true;
        _C.position.x += player.movementSpeed * DELTA * Math.sin(_C.rotation.y);
        _C.position.z += player.movementSpeed * DELTA * Math.cos(_C.rotation.y);
    }

    if (keys[32] && !oldKeys[32] && getTime() - player.lastSelectTime > player.selectSpeed && oSR != 0) {
        if (oSR.object.selected) oSR.object.selected();
        player.lastSelectTime = getTime();
        keys[32] = false;
        oldKeys[32] = true;
    }

    if (keys[82] && !oldKeys[82]) {
        _C.position.set(player.respawnPos[0], player.respawnPos[1], player.respawnPos[2]);
        keys[82] = false;
        oldKeys[82] = true;
    }

    /*if(keys[16]){
    	player.y+=player.movementSpeed*DELTA;
    	_C.position.y = player.y
    }else if(keys[17]){
    	player.y-=player.movementSpeed*DELTA;
    	_C.position.y = player.y
    }*/
    if (player.moving) _C.position.y = player.y + Math.sin(getTime() / 80) / 20; // Bob the camera!
}

function rayCast(ray, reachLimit) {
    playerRayCaster.set(_C.position, ray);
    var collisions = playerRayCaster.intersectObjects(worldObstacles);
    if (collisions.length > 0 && collisions[0].distance <= reachLimit) return collisions[0];
    return 0;
}

function onKeyDown(e) {
    keys[e.keyCode] = true;
    oldKeys[e.keyCode] = false;
    //console.log(e.keyCode+" Pressed!");
}

function onKeyUp(e) {
    keys[e.keyCode] = false;
    oldKeys[e.keyCode] = true;
    //console.log(e.keyCode+" Released!");
}

function onMouseMove(e) {
    var movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    _C.rotation.y -= movementX * DELTA * player.mouseSensitivity * player.turnSpeed;
    var movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    if ((_C.rotation.x < Math.PI / 2 && movementY < 0) || (_C.rotation.x > -Math.PI / 2 && movementY > 0)) {
        _C.rotation.x -= movementY * DELTA * player.mouseSensitivity * player.turnSpeed;
    } else {
        if (_C.rotation.x > Math.PI / 2) {
            _C.rotation.x = Math.PI / 2;
        } else if (_C.rotation.x < -Math.PI / 2) {
            _C.rotation.x = -Math.PI / 2;
        }
    }
}

function detectHardware() {
    pad = ((navigator.getGamepads && navigator.getGamepads()) || (navigator.webkitGetGamepads && navigator.webkitGetGamepads()))[0];
    if (pad) {
        log(pad.id + " GamePad Detected");
        hardwareToDetect--;
    }
    if (hardwareToDetect < 1) detectHardwareLoop = clearInterval(detectHardwareLoop);
}

function render() {
    renderer.render(_S, _C);
}

function addGameObject(obj) {
    gameObjects.push(obj);
}

function log(a) {
    myConsoleData.push(("\n" + a).toString());
    if (myConsoleData.length > 3) myConsoleData.splice(0, 1);
    myConsole.innerHTML = myConsoleData.toString().replace(',', '');
    console.log(a);
    myConsole.scrollTop = myConsole.scrollHeight;
}

function getTime() {
    return Date.now();
}

function updateFPS() {
    if (getTime() - lastFPS > 1000) {
        //console.log(fps+" Updates Per Second");// FPS OUTPUT
        log(fps + " UPS; " + _S.children.length + " Objects;");
        fps = tempfps;
        tempfps = 0;
        lastFPS += 1000;
    }
    tempfps++;
}

function getDelta() {
    time = getTime();
    DELTA = (time - lastFrame);
    lastFrame = time;
}

function loadAssets() {
    tile_items = THREE.ImageUtils.loadTexture('res/items.png');
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomHexColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

function onWindowResize() {
    _WIDTH = window.innerWidth, _HEIGHT = window.innerHeight;
    _C.aspect = window.innerWidth / window.innerHeight;
    _C.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function lockChangeAlert() {
    if (document.pointerLockElement === lockElement ||
        document.mozPointerLockElement === lockElement ||
        document.webkitPointerLockElement === lockElement) {
        document.addEventListener('mousemove', onMouseMove, false);
        document.addEventListener('keydown', onKeyDown, false);
        document.addEventListener('keyup', onKeyUp, false);
    } else {
        document.removeEventListener('mousemove', onMouseMove, false);
        document.removeEventListener('keydown', onKeyDown, false);
        document.removeEventListener('keyup', onKeyUp, false);
    }
}
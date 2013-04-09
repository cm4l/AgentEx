/* This file is part of Friendfind.

 First call function 'route3dInit' with parameters target_element,width,height. (e.g. during init)
 Then add route and/or friends to the scene.
*/
/*globals writeLog*/
//'globals'
var camera;
var scene;
var renderer;
var projector;

//3D -objects
var route;
var friend_objects = [];

//context-menu for friends
var menu_visible = false;
var entry_clicked = false; //this is almost hack. When menu-entry is clicked, we want prevent 'global' document listener to trig
var menu_div;

function route3dInit(target_element) {
    writeLog("route3dInit called");
    //Create camera, because its rotation is bind to the sensors
    // PerspectiveCamera(fov,    aspect,    near, far)
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.00001, 0.001); //camera sees from 1m to 100m (about)
    //camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.00001, 0.001 ); //works (camera vision is from 1 meter to 100 meters)
    //camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.00001, 2000 );//this breaks ray-intersecting
    //Both seems to work, what is difference?
    renderer = new THREE.CanvasRenderer(); //This works better with Opera
    //renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    target_element.appendChild(renderer.domElement);

    //  camera.position.set(localStorage.ownLongitude, 0, localStorage.ownLatitude);
    //camera.position.set(localStorage.ownLongitude*10, 0.1, -localStorage.ownLatitude*10);
    camera.position.set(localStorage.ownLongitude, 0.0001, localStorage.ownLatitude);
    //camera rotation (0,0,0) -> points to the north

    scene = new THREE.Scene();
    //scene.add(camera);

    //add friends
    //addAllFriends();

    projector = new THREE.Projector();
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);
    route3dUpdateCameraPosition();


    //Create context-menu (walk and drive) for friends
    menu_div = document.createElement("div");
    menu_div.style.position = "absolute";
    menu_div.style.zIndex = "14";
    menu_div.style.background = "white";
    menu_div.style.display = 'none'; //Hidden

    var walk_entry = document.createElement("span");
    walk_entry.innerHTML = "WALK<br>";
    walk_entry.onmousedown = function () {
        menu_entry_clicked("WALK");
    };
    menu_div.appendChild(walk_entry);

    var drive_entry = document.createElement("span");
    drive_entry.innerHTML = "DRIVE";
    drive_entry.onmousedown = function (event) {
        menu_entry_clicked("DRIVE");
    };
    menu_div.appendChild(drive_entry);

    document.body.appendChild(menu_div);
}


function menu_entry_clicked(name) {
    //writeLog("Button '"+name+"' clicked");
    entry_clicked = true;
    if (name.indexOf("WALK") > -1) {
        //writeLog("WALK mode selected");
        localStorage.calcRouteTravelMode = "Walk";
    } else {
        //writeLog("DRIVE mode selected");
        localStorage.calcRouteTravelMode = "Drive";
    }

    calcRoute(route3dAddRoute, 2); //'2'=it will give array of coordinate-pairs
}

function route3d_addAllFriends() {
    var user_table = JSON.parse(localStorage.friends);
    for (x in user_table) {
        //writeLog(x);
        //writeLog(localStorage.sessionId);

        //do not add me, only friends
        if (x !== localStorage.sessionId) {
            var latitude = user_table[x].substring(0, user_table[x].indexOf(","));
            var longitude = user_table[x].substring(user_table[x].indexOf(",") + 1, user_table[x].length);
            route3dAddFriend(x, latitude, longitude);
        }
    }

    //update scene
    renderer.render(scene, camera);
}

function route3dAddRoute(array) {
    writeLog("route3dAddRoute called");

    //remove existing route
    if (route != null) scene.remove(route)

    if (array == "undefined") {
        writeLog("route3dAddRoute: route array empty, only removing old one");
        return;
    }


    //https://github.com/mrdoob/three.js/wiki/Drawing-lines

    var material = new THREE.LineBasicMaterial({
        color: 0x0000ff,
    });

    var geometry = new THREE.Geometry();
    for (x in array) {
        var lat = (array[x][0]);
        var lon = (array[x][1]);

        //writeLog("route3dDraw: point: "+lat +","+ lon);
        geometry.vertices.push(new THREE.Vector3(lon, 0, lat));

    }

    //route is global
    route = new THREE.Line(geometry, material);
    //scene.add(route);

    //update scene
    renderer.render(scene, camera);
}

function route3dAddFriend(username, lat, lon) {
    writeLog("route3dAddFriend called " + lat + "," + lon);
    var radius = 0.5,
        height = 0.5,
        segments = 16;
    var geometry = new THREE.CylinderGeometry(0, radius, height, segments, segments, false);
    //var cube = new THREE.Mesh(new THREE.CubeGeometry(0.00001,0.00001,0.00001), new THREE.MeshBasicMaterial({color: 0x00ff00})); //1m3 cube
    var cube = new THREE.Mesh(new THREE.CubeGeometry(0.0001, 0.0001, 0.0001), new THREE.MeshBasicMaterial({
        color: 0x00ff00
    })); //10m3 cube    
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
    });

    //var object = new THREE.Mesh( geometry, material);
    var object = cube; //lets push the cube to scene
    object.name = username;

    object.position.x = lon;
    object.position.y = 0; //have to calculate how much we want to raise the object
    object.position.z = -lat;

    scene.add(object);
    friend_objects.push(object);

    //use this to add a modeled artifact instead
    //we really need that mission-building infra, though
    //addArtifactToScene(scene, "models/artifact01", lat, lon);

    //lets calculate distance to object here
    var dist = calcDistance(localStorage.ownLatitude, localStorage.ownLongitude, lat, lon);
    writeLog("distance to object " + object.name + " is " + dist + " km");
}

//shortcut for handling degrees and radians
var degree = Math.PI / 180;
var deg2rad = Math.PI / 180;

function route3dUpdateCameraPosition() {
    //Move and rotate camera.
    //camera axis z is phone camera exis y
    camera.position.x = localStorage.ownLongitude;
    camera.position.z = -localStorage.ownLatitude;



    camera.rotation.y = (localStorage.orientationAlphaCompass) * deg2rad;
    camera.rotation.z = (localStorage.orientationBetaY) * deg2rad;
    camera.rotation.x = (localStorage.orientationGammaX - 90) * deg2rad; //this is -90 because device is turned 90 degrees when using camera mode

    //camera.lookAt(60.320938888984735,0,25.084144891275255);
    //writeLog("")

    //If cam-view is not visible, do no more
    if (!isElementVisible('cam')) {
        return;
    }

    renderer.render(scene, camera);

    //debug messages:

    var txt = "Camera: (X,Y,Z) (" + camera.position.x + " , " + camera.position.y + " , " + camera.position.z + ") ";
    var txt2 = "Rotation in degrees: (x,y,z) (" + camera.rotation.x * degree + " , " + camera.rotation.y * degree + " , " + camera.rotation.z * degree + ") ";
    //writeLog(txt+txt2);

}


function onDocumentMouseDown(event) {
    //If cam-view is not visible, do no more
    if (!isElementVisible('cam')) {
        return;
    }

    event.preventDefault();

    if (menu_visible) {
        //writeLog("Menu was visible");
        menu_div.style.display = 'none'; //Hide
        menu_visible = false;
    }
    /*else
        writeLog("Menu is not visible");*/

    if (entry_clicked) { //this very same event is meant only for menu-entry
        //writeLog("do nothing more");
        entry_clicked = false;
        return;
    }


    var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    projector.unprojectVector(vector, camera);

    var ray = new THREE.Ray(camera.position, vector.subSelf(camera.position).normalize());

    var intersects = ray.intersectObjects(friend_objects);
    if (intersects.length > 0) {
        //Show menu in correct place
        menu_div.style.left = event.clientX + "px";
        menu_div.style.top = event.clientY + "px";
        menu_div.style.display = 'block'; //Show
        menu_visible = true;

        //Assing targetCoordinates
        var x = intersects[0].object.name;

        //writeLog("hit: "+intersects[ 0 ].object.name);

        var user_table = JSON.parse(localStorage.friends);
        var latitude = user_table[x].substring(0, user_table[x].indexOf(","));
        var longitude = user_table[x].substring(user_table[x].indexOf(",") + 1, user_table[x].length);

        localStorage.targetLatitude = latitude;
        localStorage.targetLongitude = longitude;
    } else writeLog("miss");
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
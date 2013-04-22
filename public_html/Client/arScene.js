var ar_renderer;
var ar_scene;
var ar_camera;
var ar_projector;
var ar_object;

var ar_loader;

var ar_objectsArray = [];

//asynchronous
function loadArtifact() {
        
	var name = $('#artifactId').val();
	
	if (typeof name === 'undefined') {
		name = 'models/artefact01.js';  
	}

	writeLog('Artifact name: '+ name);
	ar_loader.load( name, startScene );
}

function ar_initScene() {
    
	try {
		ar_scene = new THREE.Scene();
		ar_projector = new THREE.Projector();
		//camera sees from 1m to 100m (about)
		ar_camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.00001, 0.001);
		ar_renderer = new THREE.CanvasRenderer();
		//ar_renderer = new THREE.WebGLRenderer();

		ar_renderer.setSize(window.innerWidth, window.innerHeight);

		ar_scene.add(ar_camera);
		writeLog('AR camera added');
		ar_camera.position.set(localStorage.ownLongitude, 0.0001, -localStorage.ownLatitude);

		//document.getElementById('arCanvas').appendChild(ar_renderer.domElement);
		$('#arCanvas').append(ar_renderer.domElement);
		$('#arCanvas').mousedown(ar_onArtifactClick);
		
		//$('#arCanvas').mousedown(ar_onArClick);  // this one might work

		window.addEventListener('resize', onWindowResize, false);

		ar_loader = new THREE.JSONLoader();

		loadArtifact();
        
    } catch (err) {
		writeLog('ar error:' + err.message);
	}
}

//called once artifact model is loaded
function startScene(geometry) {
	
	writeLog('Scene started after model loading was completed');
	var material = new THREE.MeshBasicMaterial( { color: 0x993399 } );
	ar_object = new THREE.Mesh(geometry, material);
        
	//object.name = username;
	// for debugpurposes lets add also one next to the user (50 meters north)
        
	ar_object.position.x = $('#targetLong').val();
	ar_object.position.y = 0; //have to calculate how much we want to raise the object
	ar_object.position.z = -$('#targetLat').val();
    
	//ar_object.position.x = localStorage.ownLongitude;
	//ar_object.position.y = 0; //have to calculate how much we want to raise the object
	//ar_object.position.z = -(parseFloat(localStorage.ownLatitude)+0.0005);
         
	ar_object.scale.set(0.0001, 0.0001, 0.0001);
	
	ar_scene.add(ar_object);
	ar_objectsArray.push(ar_object);
	
	ar_render();
}

function ar_render() {
	//writeLog('render called');
	//requestAnimationFrame(ar_render);
	//ar_object.rotation.x += 0.01;
	//ar_object.rotation.y += 0.01;
	ar_renderer.render(ar_scene, ar_camera);	
}

function updateMatrices() {
	ar_camera.updateMatrix();
	ar_camera.updateMatrixWorld();
	ar_camera.matrixWorldInverse.getInverse(ar_camera.matrixWorld);
	
	for (var i=0; i < ar_objectsArray.length; ++i) {
		ar_objectsArray[i].updateMatrix();
		ar_objectsArray[i].updateMatrixWorld();
	}	
}

function isObjectInView() {
	
	updateMatrices(); //need to update matrices or might get nonsense answers
	
	var frustum = new THREE.Frustum();
	frustum.setFromMatrix( new THREE.Matrix4().multiply(ar_camera.projectionMatrix, ar_camera.matrixWorldInverse) );
	
	for (var i=0; i < ar_objectsArray.length; ++i) { 
		var object = ar_objectsArray[i];
		
		if ( frustum.contains(object) ) {
			return true; // we should only have one object anyway
		}
	}
	return false;
}

function artifactScreenCoordinates() {
		
	var widthHalf = window.innerWidth/2;
	var heightHalf = window.innerHeight/2;
	
	updateMatrices(); // might get NaN without this step
	
	//project artifact position on camera plane
	var projector = new THREE.Projector();
	var vector = projector.projectVector( object.matrixWorld.getPosition().clone(), ar_camera);
	
	//convert Normalized Device Coordinates to screen coordinates
	var x = (vector.x * widthHalf) + widthHalf;
	var y = - (vector.y * heightHalf ) + heightHalf;
	
	return new Array(x,y);
}

function isHit(x, y) {
	
	var hitBoxWidth = 100;	
	var target = artifactScreenCoordinates();  //array with x and y coords
	
	if (x > target[0] - hitBoxWidth/2 && x < target[0] + hitBoxWidth/2 
		&& y > target[1] - hitBoxWidth/2 && y < target[1] + hitBoxWidth/2) {
		return true;
	}
		
	return false;
}

function ar_onArClick(event) {

	// I can't actually test this, but it should work
	// Coordinates might have a little offset depending on margins and such
	
	if ( isHit(event.clientX, event.clientY) ) {
		writeLog("hit");
	}
	else {
		writeLog("miss");
	}
}

function ar_onArtifactClick(event){
    
    /*
    var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    ar_projector.unprojectVector(vector, ar_camera);

    var ray = new THREE.Ray(ar_camera.position, vector.subSelf(ar_camera.position).normalize());

    var intersects = ray.intersectObjects(ar_objectsArray);
    if (intersects.length > 0) {
        
        alert('hit');
    }
   */ 
  
	try {
		//If cam-view is not visible, do no more
		if (!isElementVisible('cam')) {
			return;
		}
		event.preventDefault();
    
		//var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5,0,0.001 );
		var vector = new THREE.Vector3((event.clientX / window.innerHeight) * 2 - 1, -(event.clientY / window.innerWidth) * 2 + 1, 0.5,0,0.001 );
     
		writeLog('vector x' + vector.x+'vector y' + vector.y+'vector z' + vector.z);
		ar_projector.unprojectVector(vector, ar_camera);
		writeLog('vector x' + vector.x+'vector y' + vector.y+'vector z' + vector.z);
		var dir = vector.sub(ar_camera.position).normalize(); //direction
		dir.z = -(dir.z);
		//alert('x '+event.clientX+" y "+event.clientY+"inner width and height "+window.innerWidth+":"+window.innerHeight);
		var raycaster = new THREE.Raycaster(ar_camera.position, dir);
		//var raycaster = new THREE.Raycaster(ar_camera.position, ar_object.position);
		writeLog('RayCaster with: camera x:'+ar_camera.position.x+" y:"+ar_camera.position.y+" z:" 
				+ar_camera.position.z+ "VECTOR DIRECTION x:"+ dir.x+ " y:"+ dir.y+ " z:"+ dir.z);
		//lets draw a line to visualize the ray
		var material = new THREE.LineBasicMaterial({
			color: 0xff0000,
		});
		var geometry = new THREE.Geometry();
		geometry.vertices.push(vector);
		geometry.vertices.push(ar_camera.position);
		//geometry.vertices.push(ar_object.position);
		var line = new THREE.Line(geometry, material);
		ar_scene.add(line);
		ar_render();
   
		var intersects = raycaster.intersectObjects(ar_objectsArray);
     
		if (intersects.length > 0) {
			writeLog("hit");
		}else {
			writeLog("miss");
		}
    
	} catch (err) {
		writeLog('ar click error:' + err.message);
	}
}

function ar_updateCameraPosition() {
    //If cam-view is not visible, do no more
    if (!isElementVisible('cam')) {
        return;
    }
    
    //Move and rotate camera.
    //camera axis z is phone camera exis y
    ar_camera.position.x = localStorage.ownLongitude;
    ar_camera.position.z = -localStorage.ownLatitude;

    ar_camera.rotation.y = (localStorage.orientationAlphaCompass) * deg2rad;
    //ar_camera.rotation.z = (localStorage.orientationBetaY) * deg2rad; // this was disabled because some android devices were giving funny sensor readings and flipping the object etc.
    ar_camera.rotation.x = (localStorage.orientationGammaX - 90) * deg2rad; //this is -90 because device is turned 90 degrees when using camera mode

    ar_render();
    //ar_renderer.render(ar_scene, ar_camera);
}

function onWindowResize() {
    ar_camera.aspect = window.innerWidth / window.innerHeight;
    ar_camera.updateProjectionMatrix();
    ar_renderer.setSize(window.innerWidth, window.innerHeight);
}
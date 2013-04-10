var ar_renderer;
var ar_scene;
var ar_camera;
var ar_projector;
var ar_object;

var ar_loader;

var ar_objectsArray = [];

//asynchronous
function loadArtifact() {
        
        var name = $('artifactId').val();
	ar_loader.load( name, startScene );
}

function ar_initScene() {
	ar_scene = new THREE.Scene();
        ar_projector = new THREE.Projector();
	ar_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.00001, 0.001); //camera sees from 1m to 100m (about)
        
        ar_renderer = new THREE.CanvasRenderer();
	//ar_renderer = new THREE.WebGLRenderer();
	ar_renderer.setSize(window.innerWidth, window.innerHeight);
	
	ar_scene.add(ar_camera);
        
        ar_camera.position.set(localStorage.ownLongitude, 0.0001, localStorage.ownLatitude);
	
        $('arCanvas').append(ar_renderer.domElement);

	ar_loader = new THREE.JSONLoader();
	
	loadArtifact();
}

//called once artifact model is loaded
function startScene(geometry) {
	
//	var material = new THREE.MeshBasicMaterial( { color: 0x330066 } );
	var material = new THREE.MeshBasicMaterial( { color: 0x993399 } );
	ar_object = new THREE.Mesh(geometry, material);
        
        
	//object.name = username;

        ar_object.position.x = $('targetLong').val();
        ar_object.position.y = 0; //have to calculate how much we want to raise the object
        ar_object.position.z = -$('targetLat').val();
    
        //ar_object.position.set(10,0,-10);
	ar_object.scale.set(0.0001, 0.0001, 0.0001);
	
	ar_scene.add(ar_object);
		
	ar_render();
}

function ar_render() {
	requestAnimationFrame(ar_render);
	//ar_object.rotation.x += 0.01;
	//ar_object.rotation.y += 0.01;
	ar_renderer.render(ar_scene, ar_camera);	
}

//$(document).ready(function() {
//	setScene();
//});


function ar_onArtifactClick(){
    
    //If cam-view is not visible, do no more
    if (!isElementVisible('cam')) {
        return;
    }
    
    var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
    ar_projector.unprojectVector(vector, ar_camera);

    var ray = new THREE.Ray(ar_camera.position, vector.subSelf(ar_camera.position).normalize());

    var intersects = ray.intersectObjects(friend_objects);
    
    if (intersects.length > 0) {
        writeLog("hit");
        
        
    }else {
        writeLog("miss");
        
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
    ar_camera.rotation.z = (localStorage.orientationBetaY) * deg2rad;
    ar_camera.rotation.x = (localStorage.orientationGammaX - 90) * deg2rad; //this is -90 because device is turned 90 degrees when using camera mode


    
    ar_render();
    //ar_renderer.render(ar_scene, ar_camera);


}
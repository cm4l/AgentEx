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
        if(typeof name === 'undefined'){
          name = '/models/artefact01.js';  
        };
       //var name = document.getElementById('artifactId').value;
        writeLog('Artifact name: '+ name);
	ar_loader.load( name, startScene );
}

function ar_initScene() {
    
        try {
	ar_scene = new THREE.Scene();
        ar_projector = new THREE.Projector();
	ar_camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.00001, 0.001); //camera sees from 1m to 100m (about)
        
        ar_renderer = new THREE.CanvasRenderer();
	//ar_renderer = new THREE.WebGLRenderer();
	ar_renderer.setSize(window.innerWidth, window.innerHeight);
	
	ar_scene.add(ar_camera);
        writeLog('camera added');
        ar_camera.position.set(localStorage.ownLongitude, 0.0001, -localStorage.ownLatitude);
	
        //document.getElementById('arCanvas').appendChild(ar_renderer.domElement);
        $('#arCanvas').append(ar_renderer.domElement);

	ar_loader = new THREE.JSONLoader();
	
	loadArtifact();
        
        } catch (err) {
            
            writeLog('ar error:' + err.message);
        }
}

//called once artifact model is loaded
function startScene(geometry) {
	writeLog('Scene started after model loading was completed');
//	var material = new THREE.MeshBasicMaterial( { color: 0x330066 } );
	var material = new THREE.MeshBasicMaterial( { color: 0x993399 } );
	ar_object = new THREE.Mesh(geometry, material);
        
        
	//object.name = username;
        // for debugpurposes lets add also one next to the user (50 meters north)
        
        //ar_object.position.x = $('#targetLong').val();
        //ar_object.position.y = 0; //have to calculate how much we want to raise the object
        //ar_object.position.z = -$('#targetLat').val();
    
        ar_object.position.x = localStorage.ownLongitude;
        ar_object.position.y = 0; //have to calculate how much we want to raise the object
        ar_object.position.z = -(parseFloat(localStorage.ownLatitude)+0.0005);
         
        
        //ar_object.position.set(10,0,-10);
	ar_object.scale.set(0.0001, 0.0001, 0.0001);
	
	ar_scene.add(ar_object);
		
        //for debug
        var cube = new THREE.Mesh(new THREE.CubeGeometry(0.0001, 0.0001, 0.0001), new THREE.MeshBasicMaterial({
        color: 0x00ff00
    })); //10m3 cube 
        cube.position.x = 24.93676;
        cube.position.y = 0; //have to calculate how much we want to raise the object
        cube.position.z = -60.16184;
        //alert('x:'+cube.position.x + " z:"+cube.position.z);
        var cube2 = new THREE.Mesh(new THREE.CubeGeometry(0.0001, 0.0001, 0.0001), new THREE.MeshBasicMaterial({
        color: 0x00ff00
    })); //10m3 cube 
        cube2.position.x = parseFloat(localStorage.ownLongitude)+0.0007;
        cube2.position.y = 0; //have to calculate how much we want to raise the object
        cube2.position.z = -(parseFloat(localStorage.ownLatitude)+0.0002);
        
        ar_scene.add(cube);
        ar_scene.add(cube2);      
	ar_render();
}

function ar_render() {
        //writeLog('render called');
	//requestAnimationFrame(ar_render);
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
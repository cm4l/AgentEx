var ar_renderer;
var ar_scene;
var ar_camera;

var ar_object;

var ar_loader;

//asynchronous
function loadArtifact(name) {
	ar_loader.load( name, startScene );
}

function setScene() {
	ar_scene = new THREE.Scene();
	ar_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	
	ar_renderer = new THREE.WebGLRenderer();
	ar_renderer.setSize(window.innerWidth, window.innerHeight);
	
	ar_scene.add(ar_camera);

	ar_camera.position.z = 30;

	ar_renderer.setSize(500, 300);
	
	var container = $('#view');
	
	container.append(ar_renderer.domElement);
	
	ar_loader = new THREE.JSONLoader();
	
	loadArtifact("objs/artefact02.js");
}

//called once artifact model is loaded
function startScene(geometry) {
	
//	var material = new THREE.MeshBasicMaterial( { color: 0x330066 } );
	var material = new THREE.MeshBasicMaterial( { color: 0x993399 } );
	ar_object = new THREE.Mesh(geometry, material);
	ar_object.position.set(10,0,-10);
	ar_object.scale.set(10,10,10);
	
	ar_scene.add(ar_object);
		
	ar_render();
}

function ar_render() {
	requestAnimationFrame(ar_render);
	ar_object.rotation.x += 0.01;
	ar_object.rotation.y += 0.01;
	ar_renderer.render(ar_scene, ar_camera);	
}

//$(document).ready(function() {
//	setScene();
//});

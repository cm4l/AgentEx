var loader;
var the_scene;

var ArX;
var ArZ;
//stylish, but god damn three.js and undocumented custom callback funtions

//need to add a callback here if we we want to get the artifact object for use elsewhere
function addArtifact(geometry) {
	var material = new THREE.MeshBasicMaterial( { color: 0x330066 } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(ArX,0,ArZ);
	mesh.scale.set(0.00001,0.00001,0.00001);
	//that should be the right scale, right?
	
	the_scene.add(mesh);
}

function addArtifactToScene(scene, artifactName, lat, lon) {
	the_scene = scene;
	ArX = lat;
	ArZ = -lon;
	
	loader.load( artifactName, addArtifact );		
}

$(document).ready(function() {
	loader = new THREE.JSONLoader();
});
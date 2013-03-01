/* This file is part of Friendfind.

 First: call function startCommunication(), it will create socket.

 Then: to send message to the server use: communicationSendToServer(msg)

 When server sends 'coordinateTables' it is stored to the localStorage.friends.
*/


var socket;

function startCommunication(user_id) {
console.log("startCommunication called");

socket = io.connect();

socket.on('connect', function () {
	console.log("connecting to the server");
	socket.emit("setName", user_id);
	socket.emit( 'message', "got in!");

	var coords = localStorage.ownLatitude+","+localStorage.ownLongitude;
	socket.emit('setCoordinates', coords);

});

socket.on('disconnect', function(msg) {
	console.log("disconnecting to the server");
});


socket.on('message', function(msg) {
	console.log("Communication: server sends '"+msg+"'");  //log
});

socket.on('coordinateTables', function(msg) {
	console.log("Communication: coordinates '"+msg+"'");

	localStorage.friends = msg;
	route3d_addAllFriends();

	if (isElementVisible('map')) {
		drawMap();
	}
    
        //menuobject list is also updated when change occurs
        updateObjectList();

});

} //startCommunication ends



function communicationSendToServer(msg) {
	//console.log("Communication: will send message to the server '"+msg+"'");
	socket.emit( 'message', msg);
}

/* This file is part of Friendfind

 This server handles static html files (png, jpeg, css).
*/
var PORT = 9002;

var http = require('http');
var fs = require('fs');
var path = require('path');

//contains players, current task and level
var player_table = [
           {
            "name":"null",
            "id":"1"
           },
           {
            "name":"null",
            "id":"2"
           },
           {
            "name":"null",
            "id":"3"
           }
          ];
 
var server = http.createServer(function (request, response) {
	//console.log("LOG: requesting: '" + request.url +"'");

	if (request.url.substring(1,16) == "friendfind.html") {
		var user = request.url.substring(22,request.url.indexOf("&"));
                player_table[0].name = user;
		var startingOrientation = request.url.substring(request.url.indexOf("&")+13,request.url.length);
		//console.log("user: '"+user +"'. orientation: '" + startingOrientation +"'");

		if (startingOrientation == "map")
			filePath =  '/map.html';
		else
			filePath = '/webcam.html';

		//301 moved permanently
		//302 temporary redirect
		response.writeHead(301, { 'Location': filePath });
	        response.end();

		return;
	}

	//var filePath = '../public_html/client';
        var filePath = '../Client';
        
	if (request.url == '/')
		filePath = filePath + '/index.html';
	else
		filePath = filePath + request.url;

	console.log("LOG: looking for file '" + filePath +"'");
         
	var extname = path.extname(filePath);
	var contentType = 'text/html';

	switch (extname) {
	case '.js':
		contentType = 'text/javascript';
		break;
	case '.css':
		contentType = 'text/css';
		break;
	case '.jpg':
	case '.jpeg':
		contentType = 'image/jpeg';
		break;
	case '.png':
		contentType = 'image/png';
		break;
	}

	path.exists(filePath, function(exists) {
		if (exists) {
			fs.readFile(filePath, function(error, content) {
				if (error) {
					response.writeHead(500);
					response.end();
				}
				else {
					response.writeHead(200, { 'Content-Type': contentType });
					response.end(content, 'utf-8');
				}
			});
	        }
        	else {
			response.writeHead(404);
			response.write("No page '"+ request.url + "'");
			response.end();
		}
	});
});

var io = require('socket.io').listen(server);
server.listen(PORT);
io.set('transports');

// log level 0 or 1 : info output
// 2: debug output
io.set( 'log level', 2 );

//contains userids and coordinates
var user_table = {};




function sendCoordinatesToEverybody() {
	var txt = JSON.stringify(user_table);
	console.log(txt);
	io.sockets.emit('coordinateTables',txt);
}


/* "Protocol":
  order (client):
   a) client connects
   b) client sends 'setName'
   c) client sends 'setCoordinates'
      repeat c as often as needed
   d) client disconnects

  server:
   whenever any client sends 'setCoordinates' or disconnects:
    *sendCoordinatesToEverybody
*/
io.sockets.on('connection', function (socket) {
	console.log('connection established');
	socket.emit('message', "connected to the server" );

	socket.on('setName', function (name) {
		socket.set('nickname', name, function () {
			//socket.emit('ready');
		});
	});


	socket.on('setCoordinates', function (msg) {
		socket.get('nickname', function (err, name) {
			//console.log("setting coordinate ");
			user_table[name] = msg;

			//inform everybody
			sendCoordinatesToEverybody();
		});
	});

	socket.on('disconnect', function () {
		socket.get('nickname', function (err, name) {
			console.log(name +" disconnected");
			delete user_table[name];

			//inform everybody
			sendCoordinatesToEverybody();
		});
	});

	//just for chatting
	socket.on('message', function (msg) {
		socket.get('nickname', function (err, name) {
			console.log(name+": "+msg);
		});
	});
});



user_table["debug_person1"] = "60.320938888984735,25.084144891275255";
user_table["debug_person2"] = "60.2720938888984735,25.084144891275255";
user_table["debug_person3"] = "60.320938888984735,25.004144891275255";
user_table["debug_person4"] = "60.169863000000001,25.000000000000000";
user_table["debug_person5"] = "60.169863000000001,23.924144891275255";


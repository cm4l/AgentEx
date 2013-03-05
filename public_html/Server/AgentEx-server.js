/* This file is part of Friendfind

 This server handles static html files (png, jpeg, css).
*/
var PORT = 9002;

var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');


function getContentType(extname) {
    switch (extname) {
    case '.js':
        return 'text/javascript';
    case '.css':
        return 'text/css';
    case '.jpg':
    case '.jpeg':
        return 'image/jpeg';
    case '.png':
        return 'image/png';
    default:
        return 'text/html';
    }
}

function serveFile(filePath, response) {
    console.log("LOG: looking for file '" + filePath + "'");
    var extname, contentType;
    extname = path.extname(filePath);
    contentType = getContentType(extname);

    path.exists(filePath, function (exists) {
        if (exists) {
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                } else {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                }
            });
        } else {
            response.writeHead(404);
            response.write("No page '" + filePath + "'");
            response.end();
        }
    });
}

function readPlayers() {
    var playersText;
    playersText = fs.readFileSync('players.json', 'utf8');
    return JSON.parse(playersText);
}

function savePlayers(object) {
    console.log("saving");
    fs.writeFile('players.json', JSON.stringify(object), function (err) {
        if (err) {
            return console.log(err.description);
        }
    });
}

function isValidNewUser(name, pwd, players) {
    if (name !== undefined && pwd !== undefined) {
        return true;
    } //TODO check player name is unique
}

function generateId(players) {
    var id = players.length + 1; //TODO
    console.log("ID " + id);
    return id;
}

function addNewUser(players, post) {
    var newPlayer, id;
    id = '';
    console.log("newUser");
    if (isValidNewUser(post.name, post.pwd1, players)) {
        id = generateId(players);
        newPlayer = {"name": post.name, "pwd": post.pwd1, "id": id};
        players.push(newPlayer);
        savePlayers(players);
    }
    console.log("loppu");
    return id;
}

function register(post, response) {
    var players, id;
    id = '';
    if (post !== undefined) {
        players = readPlayers();
        id = addNewUser(players, post);
    }
    if (id !== '') {
        //TODO modify html before returning
        response.writeHead(301, { 'Location': 'main.html'});
        response.end();
    } else {
        serveFile('../Client/index.html', response);
    }
}

function loginWithId(clientId) {
	return true; //TODO
}

function loginWithPwd(name, pwd) {
	return true; //TODO
}

function login(post, response) {
    var authorized = false;
    if (post !== undefined) {
        if (post.clientId !== undefined) {
            authorized = loginWithId(post.clientId);
        } else if (post.name !== undefined && post.pwd !== undefined) {
            authorized = loginWithPwd(post.name, post.pwd);
        }
    }

    if (authorized) {
        response.writeHead(301, { 'Location': 'main.html'});
        response.end();
    } else {
        serveFile('../Client/index.html', response);
    }
}

function routeRequest(path, response, getData, postData) {
    var filePath;
    filePath = '../Client';
    console.log('register hit 0');
    switch (path) {
    case '/':
        return serveFile(filePath + '/index.html', response);
    case '/Register':
        return register(postData, response);
    case '/Login':
        return login(postData, response);
    default:
        return serveFile(filePath + path, response);
    }
}

var server = http.createServer(function (request, response) {
    console.log("LOG: requesting: '" + request.url + "'");

    var getData, postData, urlData, filePath, querystring, data;
    urlData = url.parse(request.url, true);
    getData = urlData.query;
    //console.log("Parsed: "+ urlData.pathname);
    //console.log("Data", JSON.stringify(queryData));
    if (request.method === 'POST') {
        querystring = require('querystring');
        data = '';
        request.on('data', function (chunk) {
            data += chunk;
        });
        request.on('end', function () {
            postData = querystring.parse(data);
            //routing called after all POST data is read
            routeRequest(urlData.pathname, response, getData, postData);
        });
    } else { //GET
        routeRequest(urlData.pathname, response, getData, postData);
    }
});

server.listen(PORT);

var io = require('socket.io').listen(server);
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


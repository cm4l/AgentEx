/* This file is part of Friendfind

 This server handles static html files (png, jpeg, css).
*/
var PORT = 9002;

var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    url = require('url'),
    cookie = require('cookie'),
    whiskers = require('whiskers');






function readPlayers() {
    var playersText;
    playersText = fs.readFileSync('players.json', 'utf8');
    return JSON.parse(playersText);
}

function getPlayerWithId(id) {
    var i,
        players = readPlayers(),
        playerCount = players.length;

    for (i = 0; i < playerCount; i++) {
        if (players[i].id === id) {
            return players[i];
        }
    }
    return undefined;
}

function personalizeMainPage(template, agentexId) {
    var personalizedContent,
        player = getPlayerWithId(agentexId),
        context,
        mission;

    if (player !== undefined) {
        context = {
            missionDescription : 'Tämä on testitehtävän kuvaus.',
            name : player.name,
            rank : 'Rookie',
            missionCount  : '2'
        };
        return whiskers.render(template, context);
    }
    return template;
}

function getContentType(filePath) {
    var extname;
    extname = path.extname(filePath);
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

function serveFile(filePath, response, agentexId) {
    console.log("LOG: looking for file '" + filePath + "'");
    var contentType = getContentType(filePath);
    path.exists(filePath, function (exists) {
        if (exists) {
            fs.readFile(filePath, function (error, content) {
                if (error) {
                    response.writeHead(500);
                    response.end();
                } else {
                    if (filePath === '../Client/main.html') {
                        content = personalizeMainPage(content, agentexId);
                    }
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
        var i;
            num_of_players = players.length;
        console.log("num_of_players");
        for (i = 0; i < num_of_players; i++) {
            if (players[i].name === name) {
                console.log("nimi jo olemassa");
                return false;
            }
        }
        return true;
    }
    return false;
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
        newPlayer = {
            'name': post.name,
            'pwd': post.pwd1,
            'id': id,
            'rank': 'Rookie',
            'missionCount': 0,
            'currentMission': 1
             };
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
        response.setHeader("Set-Cookie", ["agentex_id=" + id]);
        response.writeHead(301, { 'Location': 'main.html'});
        response.end();
    } else {
        serveFile('../Client/index.html', response);
    }
}

function loginWithId(clientId) {
       if (clientId !== undefined) {
        var players, i;
        players = readPlayers();
        num_of_players = players.length;
        for (i = 0; i < num_of_players; i++) {
            if (players[i].id === clientId) {
                return true;
            }
        }
        return false;
    }
    return false;
}

function loginWithPwd(name, pwd) {
    if (name !== undefined && pwd !== undefined) {
        var players, i;
        players = readPlayers();
        num_of_players = players.length;
        for (i = 0; i < num_of_players; i++) {
            if (players[i].name === name && players[i].pwd == pwd) {
                return true;
            }
        }
        return false;
    }
    return false;
}

function getAgentexId(name) {
    return 1;
}

function login(post, response, agentexId) {
    var authorized = false;
    if (agentexId !== undefined) {
        authorized = loginWithId(agentexId);
    } else if (post !== undefined && post.name !== undefined && post.pwd !== undefined) {
        authorized = loginWithPwd(post.name, post.pwd);
        if (authorized) {
            agentexId = getAgentexId(post.name);
            response.setHeader("Set-Cookie", ["agentex_id=" + agentexId]);
        }
    }
    if (authorized) {
        response.writeHead(301, { 'Location': 'main.html'});
        response.end();
    } else {
        serveFile('../Client/index.html', response);
    }
}

function routeRequest(path, response, getData, postData, agentexId) {
    var filePath;
    filePath = '../Client';
    switch (path) {
    case '/':
        if (agentexId !== undefined) {
            return login(postData, response, agentexId);
        }
        return serveFile(filePath + '/index.html', response);
    case '/Register':
        return register(postData, response);
    case '/Login':
        return login(postData, response, agentexId);
    case '/main':
        if(agentexId === undefined){
            serveFile('../Client/index.html', response);
        }
    default:
        return serveFile(filePath + path, response, agentexId);
    }
}

var server = http.createServer(function (request, response) {
    console.log("LOG: requesting: '" + request.url + "'");
    var getData, postData, urlData, filePath, querystring, data, cookies, agentexId;
    urlData = url.parse(request.url, true);
    getData = urlData.query;
    if (request.headers.cookie) {
        cookies = cookie.parse(request.headers.cookie);
        if (cookies.agentex_id !== undefined) {
            console.log("Cookie found: " + cookies.agentex_id);
            agentexId = cookies.agentex_id;
        }
    }
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
            routeRequest(urlData.pathname, response, getData, postData, agentexId);
        });
    } else { //GET
        routeRequest(urlData.pathname, response, getData, postData, agentexId);
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
	/*console.log(txt);*/
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
user_table["debug_person6"] = "60.16184,24.93676";
user_table["debug_person7"] = "60.16,24.93676";
user_table["debug_person8"] = "60.16084,24.93626";
user_table["debug_person9"] = "60.16084,24.93726";


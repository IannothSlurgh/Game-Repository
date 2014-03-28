// This node.js program implements a simple chat room service.

// The node.js HTTP server.
var app = require('http').createServer(handler);

// The socket.io WebSocket server, running with the node.js server.
var io = require('socket.io').listen(app);

// Allows access to local file system.
var fs = require('fs')

// Listen on a high port.
app.listen(16382);

function handler(request, response) {
  // This will read the file 'index.html', and call the function (the 2nd
  // argument) to process the content of the file.
  // __dirname is a preset variable pointing to the folder of this file.
  fs.readFile(
    __dirname + '/index1.html',
    function(err, content) {
      if (err) {
        // If an error happened when loading 'index.html', return a 500 error.
        response.writeHead(500);
        return response.end('Error loading index.html!');
      }
      // If no error happened, return the content of 'index.html'
      response.writeHead(200, {'Content-Type': 'text/html'});
      response.end(content);
    });
}

//---------------Maze Algorithm--------------------------------------------------------------
var mazeData = new Array(55);

function hasUnvisitedNeighbor(row, col, dir){
	if(dir == 0 && (col - 2) >= 0)
	{
		return (mazeData[row][col - 2] == 'U');
	}
	else if(dir == 1 && (col + 2) < 39){
		return (mazeData[row][col + 2] == 'U');
	}
	else if(dir == 2 && (row - 2) >= 0){
		return (mazeData[row - 2][col] == 'U');
	}
	else if(dir == 3 && (row + 2) < 55){
		return (mazeData[row + 2][col] == 'U');
	}
	else{;
		return false;
	}
}

function generateMaze(row, column){
	mazeData[row][column] = '.';
	
	while(hasUnvisitedNeighbor(row, column, 0) || hasUnvisitedNeighbor(row, column, 1)
		|| hasUnvisitedNeighbor(row, column, 2) || hasUnvisitedNeighbor(row, column, 3))
	{
		var direction = Math.floor(Math.random() * 4);
		//window.alert("direction " + direction);
		if(hasUnvisitedNeighbor(row, column, direction))
		{	
			//window.alert("in here");
			switch(direction)
			{
				
				case 0:
					mazeData[row][column - 1] = '.';
					generateMaze(row, column - 2);
					break;
				case 1:
					mazeData[row][column + 1] = '.';
					generateMaze(row, column + 2);
					break;
				case 2:
					mazeData[row - 1][column] = '.';
					generateMaze(row - 2, column);
			    	break;
				case 3:
					mazeData[row + 1][column] = '.';
					generateMaze(row + 2, column);
					break;
			}
		}
	}
}

function initialize_maze()
{
	for(var i = 0; i < 55; i++){
		mazeData[i] = new Array(39);
		for(var j = 0; j < 39; j++){
			mazeData[i][j] = 'U';
		}
	}
	
	for(var x = 0; x < 55; x++){
		for(var y = 0; y < 39; y++){
			var at_edge = x == 0 || x == 55 - 1 ||
				y == 0 || y == 39 - 1;
				
			var cell_num = x + (y * 39);
			
			if(at_edge){
				mazeData[x][y] = '#';
			}			
			else if(y % 2 == 0 && cell_num % 2 == 0){
				mazeData[x][y] = '#';
			}
			else if(y % 2 != 0 && cell_num % 2 != 0){
				mazeData[x][y] = '#';
			}
		}
	}
}

function modify_maze()
{
	for(var x = 1; x < 55 - 1; x++){
		mazeData[x][1] = '.';
		if(mazeData[x][3] == '#' && Math.random() < .75)
		{
			mazeData[x][2] = '#';
		}
		mazeData[x][39 - 2] = '.';
		if(mazeData[x][39 - 4] == '#' && Math.random() < .75)
		{
			mazeData[x][39 - 3] = '#';
		}
	}
	
	for(var y = 1; y < 39 - 1; y++){
		mazeData[1][y] = '.';
		if(mazeData[3][y] == '#' && Math.random() < .75)
		{
			mazeData[2][y] = '#';
		}
		
		mazeData[55 - 2][y] = '.';
		if(mazeData[55 - 4][y] == '#' && Math.random() < .75)
		{
			mazeData[55 - 3][y] = '#';
		}
	}
}

function mazeGenerationAlgorithm()
{
	//initialize grid
	initialize_maze();
	
	//choose valid start position in the grid
	var col = Math.floor(Math.random() * 55);
	var row = Math.floor(Math.random() * 39);
		
	while(mazeData[col][row] == '#' && !(col == 0 || col == 55 - 1 ||
				col == 0 || col == 39 - 1)){
		col = Math.floor(Math.random() * 55);
		row = Math.floor(Math.random() * 39);
	}
	
	generateMaze(col, row);
	
	modify_maze();
	
	var max_money = 100;
	var money_count = 0;
	while(money_count < max_money){
		var x = Math.floor(Math.random() * 55);
		var y = Math.floor(Math.random() * 39);
		
		if(mazeData[x][y] == '.'){
			mazeData[x][y] = '$';
			
			money_count++;
		}
	}
}

mazeGenerationAlgorithm();
//------------------------------------------------------------------------------
var clients = [];
var clients_ready = [];

io.sockets.on(
  'connection',
  function(client) {
    // Send a welcome message first.
    client.emit('msg', 'Login');
	client.emit('mazeDataMsg', JSON.stringify({mazeArray : mazeData}));
    // Listen to an event called 'login'. The client should emit this event when
    // it wants to log in to the chat room.
    client.on(
      'login',
      function(message) {
        // This function extracts the user name from the login message, stores
        // it to the client object, sends a login_ok message to the client, and
        // sends notifications to other clients.
        if (message && message.user_name) {
          client.set('user_name', message.user_name);
		  var check = false;
		  for(var i = 0; i < clients.length; i++) {
			if(message.user_name == clients[i])
			{
				check = true;
			}
		  }
		  if(!check){
			clients.push(message.user_name);
			clients_ready.push(0);
          }
          client.emit('login_ok');
          // client.broadcast.emits() will send to all clients except the
          // current client. See socket.io FAQ for more examples.
          client.broadcast.emit('notification',
                                message.user_name + ' entered the room.');
          return
        }
        // When something is wrong, send a login_failed message to the client.
        client.emit('login_failed');
      });

    // Listen to an event called 'chat'. The client should emit this event when
    // it sends a chat message.
    client.on(
      'chat',
      function(message) {
        // This function tries to get the user name from the client object, and
        // use that to form a chat message that will be sent to all clients.
        if (message && message.msg) {
          client.get(
            'user_name', 
            function(err, name) {
              if (!err) {
                // io.sockets.emit() will send the message to all clients,
                // including the current client. See socket.io FAQ for more
                // examples.
				var obj = { "user_name": name, "msg": message.msg };
                client.broadcast.emit('chat', JSON.stringify(obj));
              }
            });
        }
      });
	  function removeDuplicates(arr){
		var i,
		len = arr.length,
		out = [],
		obj = {};
		
		for (i = 0; i < len; i++){
			obj[arr[i]] = 0;
		}
		for (i in obj){
			out.push(i);
		}
		return out;
	  }
	client.on(
	  'userlist',
	  function(message){
	    client.get(
            'user_name', 
            function(err, name) {
              if (!err) {
                var status = message.status;
				var uniqueNames = [];
				uniqueNames = removeDuplicates(clients);
				var index = uniqueNames.indexOf(name);
				if(index > -1)
				{
					if(status > 0){
						clients_ready[index] = status;
					}
				}
				io.sockets.emit('userlist', JSON.stringify({"uniqueNames":uniqueNames, "status": clients_ready}));
              }
            });
	});
	
	client.on(
		'PlayerMovement',
		function(message){
			if(true) {
				var obj = JSON.parse(message);
				console.log(obj);
				client.broadcast.emit('updateEnemyPlayer', obj);
			}
	});
	
	client.on(
		'CollectMoney',
		function(message){
			if(true) {
				var obj = JSON.parse(message);
				console.log(obj);
				client.broadcast.emit('destroyMoney', obj);
			}
	});
	
	client.on(
		'getusername',
		function(message){
		  if(!err) {
			var obj = { "user_name": name};
			client.emit('getusername', JSON.stringify(obj));
		  }
	});
	
    // Print a message when somebody left.
    client.on(
      'disconnect',
      function() {
            if (name) {
              io.sockets.emit('notification', name + ' left the room.');
			  var index = clients.indexOf(name);
			  if(index > -1){
				clients.splice(index, 1);
				clients_ready.splice(index, 1);
			  }
			  io.sockets.emit('userlist', JSON.stringify({"uniqueNames":clients, "status": clients_ready}));
            }
          });
      });


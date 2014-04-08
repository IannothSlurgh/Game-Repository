// This node.js program implements a simple chat room service.

// The node.js HTTP server.
var app = require('http').createServer(handler);

// The socket.io WebSocket server, running with the node.js server.
var io = require('socket.io').listen(app);

// Allows access to local file system.
var fs = require('fs')

// Listen on a high port.
app.listen(16384);

function handler(request, response) 
{
	// This will read the file 'index.html', and call the function (the 2nd
	// argument) to process the content of the file.
	// __dirname is a preset variable pointing to the folder of this file.
	fs.readFile(
		__dirname + '/index.html',
		function(err, content){
			if (err)
			{
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
//stores the maze for phase one in an array of strings
var maze_data = new Array(55);

//determines whether a cell has been visited already by the algorithm
function hasUnvisitedNeighbor(row, col, dir)
{
	if(dir == 0 && (col - 2) >= 0)
	{
		return (maze_data[row][col - 2] == 'U');
	}
	else if(dir == 1 && (col + 2) < 39){
		return (maze_data[row][col + 2] == 'U');
	}
	else if(dir == 2 && (row - 2) >= 0){
		return (maze_data[row - 2][col] == 'U');
	}
	else if(dir == 3 && (row + 2) < 55){
		return (maze_data[row + 2][col] == 'U');
	}
	else{;
		return false;
	}
}

//recursive function which performs a depth-first search, picking a random direction until it reaches a dead end
function generateMaze(row, column)
{
	maze_data[row][column] = '.';
	
	while( hasUnvisitedNeighbor(row, column, 0) 
		|| hasUnvisitedNeighbor(row, column, 1)
		|| hasUnvisitedNeighbor(row, column, 2) 
		|| hasUnvisitedNeighbor(row, column, 3))
	{
		var direction = Math.floor(Math.random() * 4);
		//window.alert("direction " + direction);
		if(hasUnvisitedNeighbor(row, column, direction))
		{	
			//window.alert("in here");
			switch(direction)
			{
				case 0:
					maze_data[row][column - 1] = '.';
					generateMaze(row, column - 2);
					break;
				case 1:
					maze_data[row][column + 1] = '.';
					generateMaze(row, column + 2);
					break;
				case 2:
					maze_data[row - 1][column] = '.';
					generateMaze(row - 2, column);
			    	break;
				case 3:
					maze_data[row + 1][column] = '.';
					generateMaze(row + 2, column);
					break;
			}
		}
	}
}

//makes the maze into a checkered board
function initializeMaze()
{
	for(var i = 0; i < 55; i++)
	{
		maze_data[i] = new Array(39);
		for(var j = 0; j < 39; j++)
		{
			maze_data[i][j] = 'U';
		}
	}
	for(var x = 0; x < 55; x++)
	{
		for(var y = 0; y < 39; y++)
		{
			var at_edge = x == 0 
				|| x == 55 - 1 
				|| y == 0 
				|| y == 39 - 1;
				
			var cell_num = x + (y * 39);
			
			if(at_edge)
			{
				maze_data[x][y] = '#';
			}			
			else if(y % 2 == 0 
				&& cell_num % 2 == 0)
			{
				maze_data[x][y] = '#';
			}
			else if(y % 2 != 0 
				&& cell_num % 2 != 0)
			{
				maze_data[x][y] = '#';
			}
		}
	}
}

//modifies the maze to make it look consistent overall
function modifyMaze()
{
	for(var x = 1; x < 55 - 1; x++)
	{
		maze_data[x][1] = '.';
		if(maze_data[x][3] == '#' 
			&& Math.random() < .75)
		{
			maze_data[x][2] = '#';
		}
		maze_data[x][39 - 2] = '.';
		if(maze_data[x][39 - 4] == '#' 
			&& Math.random() < .75)
		{
			maze_data[x][39 - 3] = '#';
		}
	}
	
	for(var y = 1; y < 39 - 1; y++)
	{
		maze_data[1][y] = '.';
		if(maze_data[3][y] == '#' 
			&& Math.random() < .75)
		{
			maze_data[2][y] = '#';
		}
		
		maze_data[55 - 2][y] = '.';
		if(maze_data[55 - 4][y] == '#' 
			&& Math.random() < .75)
		{
			maze_data[55 - 3][y] = '#';
		}
	}
}

//puts all the above function together
function mazeGenerationAlgorithm()
{
	//initialize grid
	initializeMaze();
	
	//choose valid start position in the grid
	var col = Math.floor(Math.random() * 55);
	var row = Math.floor(Math.random() * 39);
		
	while(maze_data[col][row] == '#' 
		&& !(col == 0 
		|| col == 55 - 1)
		&& !(row == 0
		|| row == 39 - 1))
	{
		col = Math.floor(Math.random() * 55);
		row = Math.floor(Math.random() * 39);
	}
	
	generateMaze(col, row);
	
	modifyMaze();
	
	//distributes the money around the board
	var max_money = 100;
	var money_count = 0;
	while(money_count < max_money)
	{
		var x = Math.floor(Math.random() * 55);
		var y = Math.floor(Math.random() * 39);
		
		if(maze_data[x][y] == '.')
		{
			maze_data[x][y] = '$';
			
			money_count++;
		}
	}
}

mazeGenerationAlgorithm();
//------------------------------------------------------------------------------
// Player Objects
var player_1 =
{
	name:null,
	unit_list:[],
	units_placed:0,
	is_alive:false
}
var player_2 =
{
	name:null,
	unit_list:[],
	units_placed:0,
	is_alive:false
}
var player_3 =
{
	name:null,
	unit_list:[],
	units_placed:0,
	is_alive:false
}
var player_4 =
{
	name:null,
	unit_list:[],
	units_placed:0,
	is_alive:false
}

// Object for selecting units
var selected_unit =
{
	xcoor:null,
	ycoor:null,
	owner:null
}

// Phase for translating different messages
var phase = 3;
var place_phase = true;
var ability_toggle = false;

var turn_order =["", ""];

var score_list = [-1, -1];

//current_turn is the index of turn_order;
var current_turn = 0;

//------------------------------------------------------------------------------

// Clients array for storing the username of each client. The clients_ready array
// Stores the amount of clients that are currently ready in each phase.
var clients = [];
var clients_ready = [];

io.sockets.on(
	'connection',
	function(client) 
	{
	// Send a welcome message first.
	client.emit('msg', 'Login');
	// Listen to an event called 'login'. The client should emit this event when
	// it wants to log in to the chat room.
	client.on(
		'login',
		function(message) 
		{
		// This function extracts the user name from the login message, stores
		// it to the client object, sends a login_ok message to the client, and
		// sends notifications to other clients.
		var user_check = false;
		for(var i = 0; i < clients.length; i++)
		{
			if(clients[i] == message.user_name)
			{
				user_check = true;
			}
		}
		if (message 
			&& message.user_name 
			&& !user_check)
		{
			client.set('user_name', message.user_name);
			var check = false;
			for(var i = 0; i < clients.length; i++)
			{
				if(message.user_name == clients[i])
				{
					check = true;
				}
			}
			if(!check)
			{
				clients.push(message.user_name);
				clients_ready.push(0);
			}
			client.emit('login_ok');
			client.emit('mazeDataMsg', JSON.stringify({mazeArray : maze_data}));
			// client.broadcast.emits() will send to all clients except the
			// current client. See socket.io FAQ for more examples.
			client.broadcast.emit('notification',
									message.user_name + ' entered the room.');
			client.emit('emptyChat');
			return
		}
		// When something is wrong, send a login_failed message to the client.
		client.emit('login_failed');
	});
	// Listen to an event called 'chat'. The client should emit this event when
	// it sends a chat message.
	client.on(
		'chat',
		function(message) 
		{
			// This function tries to get the user name from the client object, and
			// use that to form a chat message that will be sent to all clients.
			if (message && message.msg) 
			{
				client.get(
					'user_name', 
					function(err, name) 
					{
						if (!err)
						{
							// io.sockets.emit() will send the message to all clients,
							// including the current client. See socket.io FAQ for more
							// examples.
							var obj = { "user_name": name, "msg": message.msg };
							io.sockets.emit('chat', JSON.stringify(obj));
						}
					});
			}
		});
		function removeDuplicates(arr)
		{
			var i,
			len = arr.length,
			out = [],
			obj = {};
			
			for (i = 0; i < len; i++)
			{
				obj[arr[i]] = 0;
			}
			for (i in obj)
			{
				out.push(i);
			}
			return out;
		}
	client.on(
		'userlist',
		function(message)
		{
			client.get(
				'user_name', 
				function(err, name) 
				{
					if (!err) 
					{
						var status = message.status;
						var unique_names = [];
						unique_names = removeDuplicates(clients);
						var index = unique_names.indexOf(name);
						if(index > -1)
						{
							if(status > 0)
							{
								clients_ready[index] = status;
							}
						}
						io.sockets.emit('userlist', JSON.stringify({"uniqueNames":unique_names, "status": clients_ready}));
					}
				});
		});
	//Jacob stuff
	client.on(
		'phaseIII_message',
		function(message)
		{
			io.sockets.emit('phaseIII_notification', message);
		});
	
	// This function handles the player movement in the maze of phase one
	client.on(
		'PlayerMovement',
		function(message)
		{
			if(true) 
			{
				var obj = JSON.parse(message);
				console.log(obj);
				client.broadcast.emit('updateEnemyPlayer', obj);
			}
		});
	// This function destroys the money the is picked up in phase one
	client.on(
		'CollectMoney',
		function(message)
		{
			if(true) 
			{
				var obj = JSON.parse(message);
				console.log(obj);
				client.broadcast.emit('destroyMoney', obj);
			}
		});
	// The following function is used to get the username of the current client
	client.on(
		'getusername',
		function(message)
		{
			var obj = 
			{ 
				"user_name": name
			};
			client.emit('getusername', JSON.stringify(obj));
		});
	
		function translate_str_to_unit(name_list)
		{
			var unit_list = new Array();
			for(var i = 0; i < name_list.length; ++i)
			{
				switch(name_list[i])
				{
					case "warrior":
						unit_list.push({src:"http://imgur.com/LnfGPbm.png", name:"warrior", xcoor:null, ycoor:null, health:16, damage:4, range:1, movement:2, can_move:true, can_attack:true, is_dead:false, has_been_placed:false, arr_index:i});
						break;
					case "rogue":
						unit_list.push({src:"http://imgur.com/WNL0znA.png", name:"rogue", xcoor:null, ycoor:null, health:10, damage:3, range:1, movement:2, can_move:true, can_attack:true, is_dead:false, has_been_placed:false, arr_index:i});
						break;
					case "goblin":
						unit_list.push({src:"http://i.imgur.com/5SeUpMM.png", name:"goblin", xcoor:null, ycoor:null, health:6, damage:2, range:1, movement:4, can_move:true, can_attack:true, is_dead:false, has_been_placed:false, arr_index:i});
						break;
					case "hunter":
						unit_list.push({src:"http://imgur.com/Hc0Hcyp.png", name:"hunter", xcoor:null, ycoor:null, health:8, damage:2, range:5, movement:1, can_move:true, can_attack:true, is_dead:false, has_been_placed:false, arr_index:i});
						break;
				}
			}
			return unit_list;
		}
	// This function sorts the scores of players in phase one to determine turn order in phase three
		function sort_scores()
		{
			for(var i = 1; i < turn_order.length; ++i)
			{
				var j = i;
				while(j > 0 
					&& score_list[j-1] > score_list[j])
				{
					var temp_score = score_list[j];
					score_list[j] = score_list[j-1];
					score_list[j-1] = temp_score;
					var temp_name = turn_order[j];
					turn_order[j] = turn_order[j-1];
					turn_order[j-1] = temp_name;
					j--;
				}
			}
		}
	// This function sets the status of players as ready as they have pressed the ready button. Allows for moving between phases
		client.on(
			'SetStatusReady',
			function(message)
			{
				var username = JSON.parse(message).user_name;
				console.log(username);
				var str_unit_list = JSON.parse(message).player_units;
				var index = clients.indexOf(username);
				if(index > 1 
					&& (score_list.length < 4 
					|| turn_order.length < 4))
				{
					score_list.push(-1);
					score_list.push(-1);
					turn_order.push("");
					turn_order.push("");
				}
			
				turn_order[index] = username;
				score_list[index] = JSON.parse(message).player_score;

				clients_ready[index] = 0;
				switch(index)
				{
					case 0: 
						player_1.name = username;
						player_1.unit_list = translate_str_to_unit(str_unit_list);
						player_1.is_alive = true;
						io.sockets.emit('SetPlayerOneUnitList', JSON.stringify({unit_list : player_1.unit_list}));
						break;
					case 1:
						player_2.name = username;
						player_2.unit_list = translate_str_to_unit(str_unit_list);
						player_2.is_alive = true;
						io.sockets.emit('SetPlayerTwoUnitList', JSON.stringify({unit_list : player_2.unit_list}));
						break;
					case 2:
						player_3.name = username;
						player_3.is_alive = true;
						player_3.unit_list = translate_str_to_unit(str_unit_list);
						io.sockets.emit('SetPlayerThreeUnitList', JSON.stringify({unit_list : player_3.unit_list}));
						break;
					case 3:
						player_4.name = username;
						player_4.unit_list = translate_str_to_unit(str_unit_list);
						player_4.is_alive = true;
						io.sockets.emit('SetPlayerFourUnitList', JSON.stringify({unit_list : player_4.unit_list}));
						break;
					default:
						console.log("No such name");
					break;
				}
				
				var num_of_players_ready = 0;
				
				for(var i = 0; i < clients_ready.length; i++)
				{
					if(clients_ready[i] == 0)
					{
						num_of_players_ready++;
					}
				}
				
				if(num_of_players_ready == clients.length)
				{
					console.log("***");
					console.log(player_1.unit_list);
					console.log(player_2.unit_list);
					console.log(player_3.unit_list);
					console.log(player_4.unit_list);
					console.log("***");
					sort_scores();
					console.log("---");
					console.log(turn_order);
					console.log(score_list);
					console.log("---");
					io.sockets.emit('moveToPhase3');
				}
			}
		);
	// Generic translate message between client and server
		function translateMessage(message)
		{
			switch(phase)
			{
				case 1:
					//translateMessagePhaseI(message);
					break;
				case 2:
					//translateMessagePhaseII(message);
					break;
				case 3:
					translateMessagePhaseIII(message);
					break;
			}
		}
	
		client.on('Event_received',
			translateMessage);
	// Translates any message in phase three
		function translateMessagePhaseIII(message)
		{
			var decrypted = JSON.parse(message);
			var confirmation =
			{
				"type":"Confirmation",
				"action":null,
				"who":null,
				"xcoor":decrypted.xcoor,
				"ycoor":decrypted.ycoor,
				"success":null,
				"healthSelf":null,
				"healthTarget":null,
				"dragged_num":null
			};
		
			var notification =
			{
				"type":"Notification",
				"action":null,
				"xcoor":decrypted.xcoor,
				"ycoor":decrypted.ycoor,
				"who":null,
				"healthSelf":null,
				"healthTarget":null,
				"dragged_num":null
			};
		
			switch(decrypted.action)
			{
				case "Lclick":
					if(place_phase)
					{
						console.log(decrypted);
						confirmation.action = "Place";
						confirmation.success = place(decrypted.xcoor, decrypted.ycoor, decrypted.who, decrypted.dragged_num); 
						if(player_1.units_placed == player_1.unit_list.length 
							&& player_2.units_placed == player_2.unit_list.length 
							&& player_3.units_placed == player_3.unit_list.length 
							&& player_4.units_placed == player_4.unit_list.length)
							{
								place_phase = false;
								confirmation.action = "PlaceDone";
								confirmation.starting_player = turn_order[current_turn];
								notification.starting_player = confirmation.starting_player;
							}
							confirmation.who = decrypted.who;
							confirmation.dragged_num = decrypted.dragged_num;
							notification.dragged_num = decrypted.dragged_num;
					}
					else
					{
						if(isOccupied(decrypted.xcoor, decrypted.ycoor))
						{
							confirmation.action = "Select";
							confirmation.success = true;
							select(decrypted.xcoor, decrypted.ycoor);
							confirmation.who = getPlayerOccupying(decrypted.xcoor, decrypted.ycoor);
						}
						else
						{
							if(selected_unit.owner == decrypted.who)
							{
								confirmation.action = "Move";
								confirmation.success = move(decrypted.xcoor, decrypted.ycoor);
								confirmation.who = selected_unit.owner;
							}
							else
							{
								confirmation.success = false;
							}
						}
					}
				break;
				case "Rclick":
					if(!place_phase)
					{
						if(ability_toggle)
						{
							confirmation.success = ability(decrypted.xcoor, decrypted.ycoor);
						}
						else
						{
							confirmation.action = "Attack";
							if(isOccupied(decrypted.xcoor, decrypted.ycoor) 
								&& getPlayerOccupying(decrypted.xcoor, decrypted.ycoor) != selected_unit.owner 
								&& decrypted.who == selected_unit.owner)
							{
								var attack_results = checkRange(decrypted.xcoor, decrypted.ycoor);
								confirmation.success = attack_results.success;
								confirmation.healthSelf = attack_results.unit_one;
								confirmation.healthTarget = attack_results.unit_two;
								confirmation.who = getPlayerOccupying(decrypted.xcoor, decrypted.ycoor);
								var attacker = findUnit(selected_unit.xcoor, selected_unit.ycoor);
								attacker.can_attack = false;
								var defender = findUnit(decrypted.xcoor, decrypted.ycoor);
								if(attacker.health <= 0)
								{
									attacker.is_dead = true;
									attacker.xcoor = null;
									attacker.ycoor = null;
									if(! checkPlayerAlive(selected_unit.owner))
									{
										confirmation.healthSelf = "Playerdead";
									}
									selected_unit.xcoor = null;
									selected_unit.ycoor = null;
									selected_unit.owner = null;
								}
								if(defender.health <= 0)
								{
									defender.is_dead = true;
									defender.xcoor = null;
									defender.ycoor = null;
									if(! checkPlayerAlive(confirmation.who))
									{
										confirmation.healthTarget = "Playerdead";
									}
								}
							}
							else
							{
								confirmation.success = false;
							}
						}
					}
					break;
				case "Endturn":
					if(!place_phase)
					{
						confirmation.action = "Endturn";
						confirmation.success = false;
						if(turn_order[current_turn] == decrypted.who)
						{
							confirmation.who = endTurn();
							if(confirmation.who != "tie")
							{
								confirmation.success = true;
								var player = getPlayer(confirmation.who);
								var unit_list = player.unit_list;
								for(var i = 0; i < unit_list.length; ++i)
								{
									unit_list[i].can_move = true;
									unit_list[i].can_attack = true;
								}
							}
						}
					}
					break;
			}
			notification.action = confirmation.action;
			notification.who = confirmation.who;
			notification.healthSelf = confirmation.healthSelf;
			notification.healthTarget = confirmation.healthTarget;
			if(confirmation.success)
			{
				client.emit('phaseIIIservermessage', JSON.stringify(confirmation));
				client.broadcast.emit('phaseIIIservermessage', JSON.stringify(notification));
			}
			else
			{
				client.emit('phaseIIIservermessage', JSON.stringify(confirmation));
			}
		}
	// Testing function that we use to call during bug testing. Allows us to know if we are connecting to the server correctly
	client.on(
		'Testing',
		function(message) 
		{
			client.emit(
				'Testing',
				message);
		});
	
	// Print a message when somebody left.
	client.on( 
		'disconnect',
		function() 
		{
		client.get(
			'user_name',
			function(err, name)
			{
				if (name) 
				{
					io.sockets.emit('notification', name + ' left the room.');
					var index = clients.indexOf(name);
					if(index > -1)
					{
						clients.splice(index, 1);
						clients_ready.splice(index, 1);
					}
					io.sockets.emit('userlist', JSON.stringify({"uniqueNames":clients, "status": clients_ready}));
				}
			});
		});
	});

//---------------------------------------------------------------------------------------------------------
//Gives the distance from selected_unit's position to the given coordinates
function getDistance(xcoor, ycoor)
{
	var original_x = selected_unit.xcoor;
	var original_y = selected_unit.ycoor;
	var delta_x = Math.abs(xcoor - original_x);
	var delta_y = Math.abs(ycoor - original_y);
	var distance = Math.max(delta_x, delta_y)
	console.log(distance);
	return distance;
}

// Finds the unit as specified by findUnit
function findUnitHelp(xcoor, ycoor, player)
{
	var unit = null;
	if(player.unit_list != null)
	{
		for(var i = 0; i < player.unit_list.length; ++i)
		{
			if(player.unit_list[i].xcoor == xcoor)
			{
				if(player.unit_list[i].ycoor == ycoor)
				{
					unit = player.unit_list[i];
					return unit;
				}
			}
		}
	}
	return unit;
}
// Gets the specfic unit and calls findUnitHelp for each player
function findUnit(xcoor, ycoor)
{
	var unit = findUnitHelp(xcoor, ycoor, player_1);
	if(unit == null)
	{
		unit = findUnitHelp(xcoor, ycoor, player_2);
	}
	if(unit == null)
	{
		unit = findUnitHelp(xcoor, ycoor, player_3);
	}
	if(unit == null)
	{
		unit = findUnitHelp(xcoor, ycoor, player_4);
	}
	return unit;
}
// Gets the specific player and returns the player object
function getPlayer(player_name)
{
	var player = null;
	if(player_1.name == player_name)
	{
		player = player_1;
	}
	if(player_2.name == player_name)
	{
		player = player_2;
	}
	if(player_3.name == player_name)
	{
		player = player_3;
	}
	if(player_4.name == player_name)
	{
		player = player_4;
	}
	if(player == null)
	{
		console.log("***");
		console.log(player_name);
		console.log("***");
	}
	return player;
}
// Gets the player occupying a specific space on the grid in phase three
function getPlayerOccupying(xcoor, ycoor)
{
	var unit = findUnitHelp(xcoor, ycoor, player_1);
	if(unit != null)
	{
		return player_1.name;
	}
	unit = findUnitHelp(xcoor, ycoor, player_2);
	if(unit != null)
	{
		return player_2.name;
	}
	unit = findUnitHelp(xcoor, ycoor, player_3);
	if(unit != null)
	{
		return player_3.name;
	}
	unit = findUnitHelp(xcoor, ycoor, player_4);
	if(unit != null)
	{
		return player_4.name;
	}
	return null;
}
// Checks if a player still has any units left alive
function checkPlayerAlive(player_name)
{
	var player = getPlayer(player_name);
	var unit_list = player.unit_list;
	for(var i = 0; i < unit_list.length; ++i)
	{
		if(unit_list[i].is_dead == false)
		{
			return true;
		}
	}
	player.is_alive = false;
	return false;
}
// Checks and returns the decision of an attack based on a range check
function checkRange(xcoor, ycoor)
{
	var unit_one = findUnit(selected_unit.xcoor, selected_unit.ycoor);
	var unit_two = findUnit(xcoor, ycoor);
	
	var total_distance = getDistance(xcoor, ycoor);

	var obj_one = 
	{
		unit_one:unit_one.health,
		unit_two:unit_two.health,
		success:false
	}
	
	if(total_distance <= unit_one.range 
		&& unit_one.can_attack)
	{
		obj_one.unit_two = returnNewUnitHP(unit_two.health, unit_one.damage);
		obj_one.success = true;	
	}
	if(total_distance <= unit_two.range)
	{
		var damage_taken = Math.ceil(unit_two.damage/2);
		obj_one.unit_one = returnNewUnitHP(unit_one.health, damage_taken);
	}
	unit_one.health = obj_one.unit_one;
	unit_two.health = obj_one.unit_two;
	return obj_one;
}
// Returns the new unit's HP
function returnNewUnitHP(health, damage_taken)
{
	return health - damage_taken;
}
// Used to select a unit on the board
function select(xcoor, ycoor)
{
	selected_unit.xcoor = xcoor;
	selected_unit.ycoor = ycoor;
	selected_unit.owner = getPlayerOccupying(xcoor, ycoor);
}
// Specifys the rules of moving a player
function move(xcoor, ycoor)
{
	var unit = findUnit(selected_unit.xcoor, selected_unit.ycoor);
	var distance = getDistance(xcoor, ycoor);
	if(distance > unit.movement || (!unit.can_move))
	{
		return false;
	}
	unit.xcoor = xcoor;
	unit.ycoor = ycoor;
	selected_unit.xcoor = xcoor;
	selected_unit.ycoor = ycoor;
	unit.can_move = false;
	return true;
}
// Function that allows the places the units down
function place(xcoor, ycoor, player_name, unit_to_place)
{
	if(unit_to_place == null)
	{
		return false;
	}
	var player = getPlayer(player_name);
	var success = true;
	if(player_name == player_1.name)
	{
		if(xcoor > 3 || ycoor > 3)
		{
			return false;
		}
	}
	if(player_name == player_2.name)
	{
		if(xcoor < 10 || ycoor < 10)
		{
			return false;
		}
	}
	if(player_name == player_3.name)
	{
		if(xcoor > 3 || ycoor < 10)
		{
			return false;
		}
	}
	if(player_name == player_4.name)
	{
		if(xcoor < 10 || ycoor > 3)
		{
			return false;
		}
	}
	if(isOccupied(xcoor, ycoor) || unit_to_place >= player.unit_list.length || player.unit_list[unit_to_place].has_been_placed)
	{
		success = false;
	}
	if(success)
	{
		player.unit_list[unit_to_place].xcoor = xcoor;
		player.unit_list[unit_to_place].ycoor = ycoor;
		player.unit_list[unit_to_place].has_been_placed = true;
		player.units_placed += 1;
	}
	return success;
}
// Returns whether or not a space is currently occupied
function isOccupied(xcoor, ycoor)
{
	if(findUnit(xcoor, ycoor) == null)
	{
		return false;
	}
	return true;
}
// Gives the rules for how a turn is ended when a player clicks the end turn button
function endTurn()
{
	selected_unit.xcoor = null;
	selected_unit.ycoor = null;
	selected_unit.owner = null;
	if(! player_1.is_alive 
		&& ! player_2.is_alive 
		&& ! player_3.is_alive 
		&& ! player_4.is_alive )
	{
		return "tie";
	}
	current_turn = (current_turn + 1) % turn_order.length;
	var next_player = getPlayer(turn_order[current_turn]);
	while(! next_player.is_alive)
	{
		current_turn = (current_turn + 1) % turn_order.length;
		next_player = getPlayer(turn_order[current_turn]);
	}
	return turn_order[current_turn];
}

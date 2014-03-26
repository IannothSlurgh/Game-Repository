// This node.js program implements a simple chat room service.

// The node.js HTTP server.
var app = require('http').createServer(handler);

// The socket.io WebSocket server, running with the node.js server.
var io = require('socket.io').listen(app);

// Allows access to local file system.
var fs = require('fs')

// Listen on a high port.
app.listen(16384);

function handler(request, response) {
  // This will read the file 'index.html', and call the function (the 2nd
  // argument) to process the content of the file.
  // __dirname is a preset variable pointing to the folder of this file.
  fs.readFile(
    __dirname + '/index.html',
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

var player_1 =
{
	name:null,
	unit_list:null,
	unit_to_place:0
}
var player_2 =
{
	name:null,
	unit_list:null,
	unit_to_place:0
}
var player_3 =
{
	name:null,
	unit_list:null,
	unit_to_place:0
}
var player_4 =
{
	name:null,
	unit_list:null,
	unit_to_place:0
}

var selected_unit =
{
	xcoor:null,
	ycoor:null,
	owner:null
}

var phase = 3;
var place_phase = false;
var ability_toggle = false;

var turn_order;
turn_order = ["Annoth", "Pyrosox"]; //Hardcoded
//current_turn is the index of turn_order;
var current_turn;
current_turn = "Annoth"; //hardcoded

function find_unit_help(xcoor, ycoor, player)
{
	for(var i = 0; i < player.unit_list.length; ++i)
	{
		if(player.xcoor == xcoor)
		{
			if(player.ycoor == ycoor)
			{
				return player.unit_list[i];
			}
		}
	}
	return null;
}

function find_unit(xcoor, ycoor)
{
	var unit = find_unit_help(xcoor, ycoor, player_1);
	if(unit == null)
	{
		find_unit_help(xcoor, ycoor, player_2);
	}
	if(unit == null)
	{
		find_unit_help(xcoor, ycoor, player_3);
	}
	if(unit == null)
	{
		find_unit_help(xcoor, ycoor, player_4);
	}
	return unit;
}

function get_player(player_name)
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
	return player;
}

function checkRange(xcoor, ycoor)
{
	var unit_one = find_unit(selected_unit.xcoor, selected_unit.ycoor);
	var unit_two = find_unit(xcoor, ycoor);
	
	var distance_one = Math.abs(unit_one.xcoor - unit_two.xcoor);
	var distance_two = Math.abs(unit_one.ycoor - unit_two.ycoor);
	
	var total_distance = distance_one + distance_two;
	
	if(total_distance <= unit_one.range)
	{
		var damage_taken = unit_two.damage/2;
		if(unit_two.damage%2 == 1)
		{
			damage_taken = (unit_two.damage/2)+1;
		}		
		var obj_one = 
		{
			unit_one:returnNewUnitHP(unit_one, damage_taken),
			unit_two:returnNewUnitHP(unit_two, unit_one.damage),
			success:true
		}
		
		return obj_one;
	}
}

function returnNewUnitHP(unit, damage_taken)
{
	unit.health = unit.health - damage_taken;
	return unit;
}

function select(xcoor, ycoor)
{
	selected_unit.xcoor = xcoor;
	selected_unit.ycoor = ycoor;
	selected_unit.owner = getPlayerOccupying(xcoor, ycoor);
}

function move(xcoor, ycoor)
{
	var unit = find_unit(selected_unit.xcoor, selected_unit.ycoor);
	var distance = Math.abs(unit.xcoor - xcoor) + Math.abs(unit.ycoor - ycoor);
	if(distance > unit.movement)
	{
		return false;
	}
	return true;
}

function place(xcoor, ycoor, player_name)
{
	var player = getPlayer(player_name);
	var success = true;
	if(isOccupied(xcoor, ycoor) && player.unit_to_place >= player.unit_list.length)
	{
		success = false;
	}
	if(success)
	{
		player.unit_list[unit_to_place].xcoor = xcoor;
		player.unit_list[unit_to_place].ycoor = ycoor;
		player.unit_to_place += 1;
	}
	return success;
}

function isOccupied(xcoor, ycoor)
{
	if(find_unit(xcoor, ycoor) == null)
	{
		return false;
	}
	return true;
}

function endturn()
{
	current_turn = (current_turn + 1) % turn_order.length;
	return turn_order[current_turn];
}

var clients = [];

io.sockets.on(
  'connection',
  function(client) {
    // Send a welcome message first.
    client.emit('msg', 'Login');

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
		  clients.push(message.user_name);
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
	  
	client.on(
	  'userlist',
	  function(message){
	    client.get(
            'user_name', 
            function(err, name) {
              if (!err) {
                // io.sockets.emit() will send the message to all clients,
                // including the current client. See socket.io FAQ for more
                // examples.
				var obj = { "user_name": name};
                io.sockets.emit('userlist', JSON.stringify(obj));
				for(var j = 0; j < clients.length; j++)
				{
					if(clients[j] != name)
					{
						console.log('I Entered the loop');
						var others = { "user_name": clients[j]};
						client.emit('userlist', JSON.stringify(others));
					}
				}
              }
            });
	});
	
	client.on(
		'getusername',
		function(message){
		  if(!err) {
			var obj = { "user_name": name};
			client.emit('getusername', JSON.stringify(obj));
		  }
	});
	
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
				"healthTarget":null
			};
			
			var notification =
			{
				"type":"Notification",
				"action":null,
				"xcoor":decrypted.xcoor,
				"ycoor":decrypted.ycoor,
				"who":null,
				"healthSelf":null,
				"healthTarget":null
			};	
			
			switch(decrypted.action)
			{
				case "Lclick":
					if(place_phase)
					{
						confirmation.action = "Place";
						confirmation.success = place(decrypted.xcoor, decrypted.ycoor, decrypted.who); 
					}	
					else if(isOccupied(xcoor, ycoor))
					{
						confirmation.action = "Select";
						confirmation.success = true;
						select(xcoor, ycoor);
						notification.who = selected_unit.owner;
					}
					else
					{
						confirmation.action = "Move";
						confirmation.success = move(xcoor, ycoor);
						notification.who = selected_unit.owner;
					}
				break;
				case "Rclick":
					if(ability_toggle)
					{
						confirmation.success = ability(xcoor, ycoor);
					}	
					else
					{
						var attack_results = checkRange(xcoor, ycoor);
						confirmation.success = attack_results.success;
						confirmation.healthSelf = attack_results.unit_one;
						confirmation.healthTarget = attack_results.unit_two;
						confirmation.who = getPlayerOccupying(xcoor, ycoor);
					}
				break;
				case "Endturn":
					confirmation.action = "Endturn";
					confirmation.who = endturn();
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

	
	client.on('phaseIIIservermessage', translateMessagePhaseIII);
	
    // Print a message when somebody left.
    client.on(
      'disconnect',
      function() {
        client.get(
          'user_name',
          function(err, name) {
            if (name) {
              io.sockets.emit('notification', name + ' left the room.');
            }
          });
      });
  });

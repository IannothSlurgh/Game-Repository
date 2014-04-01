
//Global scope variables associated with phase III that are set before 
var this_player_name = null;
//Player objects contain their unit objects, the player name, and the current unit in the array to place.
var player_1 =
{
	unit_list:[],
	name:null,
	unit_to_place:0
};
var player_2 =
{
	unit_list:[],
	name:null,
	unit_to_place:0
};
var player_3 =
{
	unit_list:[],
	name:null,
	unit_to_place:0
};
var player_4 =
{
	unit_list:[],
	name:null,
	unit_to_place:0
};

//Phase III functions and variables that do not require modification by Phase II	
Crafty.scene('Phase 3', function(){
  $(document).ready(function() {

	//Once client sends an event to server, the client cannot send any more until the server sends a confirmation to the client.
	var events_locked = false;
	
	//Makes finding selected unit easier for modifying attacker and modifying selected unit location.
	var selected_unit =
	{
		owner:null,
		arr_index:null
	};
	
	//Simple helper function for finding player object based on a string name. Returns null if no such player. (Modify to switch self)
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
		return player;
	}
	
	//Return a string of player-color based on if the given string equals a particular player name. (important for finding team_color elements)
	//(Switchify self)
	function getTeamColor(player_name)
	{
		if(player_name == player_1.name)
		{
			return "blue";
		}
		else if(player_name == player_2.name)
		{
			return "teal"
		}
		else if(player_name == player_3.name)
		{
			return "orange"
		}
		else if(player_name == player_4.name)
		{
			return "purple"
		}
	}
	
	//Take integer value 0 to 13 inclusive and give pixel value for where a tile is. Ex 0,0 is 23 top, 23 left.
	function getAbsoluteFromGrid(coor)
	{
		return 23+43*coor;
	}
	
	//Paint a tile for the combat grid at particular x and y where the coordinates are 0 to 13 inclusive.
	//Set its event handlers.
	function addTile(xcoor, ycoor)
	{
		var id = "X"+xcoor.toString()+"Y"+ycoor.toString();
		try
		{
		addImage(id, "http://i.imgur.com/ubwIthk.gif", getAbsoluteFromGrid(xcoor), getAbsoluteFromGrid(ycoor), 1, 40, 40);
		document.getElementById(id).onclick = function() { sendEvent("Lclick", xcoor, ycoor); return false; };
		document.getElementById(id).oncontextmenu = function() { sendEvent("Rclick", xcoor, ycoor); return false; };
		}
		catch(err)
		{
		alert(err);
		}
	}
	
	//Generalized function to add a new image with id, src, left, top, zindex, width, height attributes specified. Disable drag-drop and add to div_tiles
	function addImage(id, src, left, top, z, width, height)
	{
		try
		{
			var img_new = document.createElement("img");
			img_new.id=id;
			img_new.src=src;
			img_new.style.display="block";
			img_new.style.position="absolute";
			img_new.style.top=top.toString()+"px";
			img_new.style.left=left.toString()+"px";
			img_new.style.zIndex=z.toString();
			img_new.style.width=width.toString()+"px";
			img_new.style.height=height.toString()+"px";
			img_new.ondragstart=function(){return false;};
			img_new.ondrop=function(){return false;};
			var div_tiles = document.getElementById("div_tiles");
			div_tiles.appendChild(img_new);
		}
		catch(err)
		{
			alert(err);
		}
	}
	
	//If selection box not created, create at x,y pair (0 to 13 inclusive), if not move the existing selection box to the spot.
	function moveSelectionBox(xcoor, ycoor)
	{
		var border_width = 3;
		var selection_box = document.getElementById("selection");
		if(selection_box == null)
		{
			addImage("selection", "http://imgur.com/VSv5AOI.png", getAbsoluteFromGrid(xcoor)-border_width, getAbsoluteFromGrid(ycoor)-border_width, 3, 46, 46);
		}
		else
		{
			selection_box.style.left = (getAbsoluteFromGrid(xcoor)-border_width).toString()+"px";
			selection_box.style.top = (getAbsoluteFromGrid(ycoor)-border_width).toString()+"px";
			selection_box.style.display="block";
		}
	}
	
	//Helper function- given a string player_name, return the unit_list of the player object.
	//(Switchify self)
	function findUnitList(player_name)
	{
		var unit_list;
	
		if(player_name==player_1.name)
		{
			unit_list = player_1.unit_list;
		}
		else if(player_name==player_2.name)
		{
			unit_list = player_2.unit_list;
		}
		else if(player_name==player_3.name)
		{
			unit_list = player_3.unit_list;
		}
		else if(player_name==player_4.name)
		{
			unit_list = player_4.unit_list;
		}
		return unit_list;
	}
	
	//Helper function that finds the unit object of a player at xcoor,ycoor. If no such unit, return false.
	function findUnit(player_name, xcoor, ycoor)
	{
		var unit_list = findUnitList(player_name);
		for(var i = 0; i<unit_list.length; ++i)
		{
			if(unit_list[i].xcoor == xcoor)
			{
				if(unit_list[i].ycoor == ycoor)
				{
					return unit_list[i];
				}
			}
		}
		return null;
	}
	
	//Clears selected_unit, stats, and hides selection box.
	function clearSelection()
	{
		selected_unit.owner = null;
		selected_unit.arr_index = null;
		document.getElementById("stat_hp").innerHTML = "";
		document.getElementById("stat_damage").innerHTML = "";
		document.getElementById("stat_movement").innerHTML = "";
		document.getElementById("stat_range").innerHTML = "";
		document.getElementById("stat_ability").innerHTML = "";
		document.getElementById("stat_log").innerHTML = "";
		document.getElementById("stat_icon").src = "";
		if(document.getElementById("selection") != null)
		{
			document.getElementById("selection").style.display="none";
		}
	}
	
	//Sets the stats to those indicated in a stats object. (has src, health, damage, range, and movement)
	function changeStatsGraphical(stats)
	{
		if(stats.src!=null)
		{
			document.getElementById("stat_icon").src = stats.src;
		}
		if(stats.health!=null)
		{
			document.getElementById("stat_hp").innerHTML = stats.health.toString();
		}
		if(stats.damage!=null)
		{
			document.getElementById("stat_damage").innerHTML = stats.damage.toString();
		}
		if(stats.range!=null)
		{
			document.getElementById("stat_range").innerHTML = stats.range.toString();
		}
		if(stats.movement!=null)
		{
			document.getElementById("stat_movement").innerHTML = stats.movement.toString();
		}
	}
	
	//Handles the case that the client successfully selects a unit.
	function select(xcoor, ycoor, unit_owner)
	{
		//Default cases
		var src = "";
		var health = 0;
		var movement = 0;
		var damage = 0;
		var range = 0;
		var unit_list;
		var stats =
		{
			src:null,
			health:null,
			movement:null,
			damage:null,
			range:null
		};
		selected_unit.owner = unit_owner;
		unit_list = findUnitList(unit_owner);
		//Old style findUnit- fix later.
		for(var i = 0; i < unit_list.length; ++i)
		{
			if(unit_list[i].xcoor == xcoor)
			{
				if(unit_list[i].ycoor == ycoor)
				{
					stats.src = unit_list[i].src;
					stats.health = unit_list[i].health;
					stats.movement = unit_list[i].movement;
					stats.damage = unit_list[i].damage;
					stats.range = unit_list[i].range;
					
					selected_unit.arr_index = i;
				}
			}
		}
		//Set the stat boards with the stats of the found unit
		changeStatsGraphical(stats);
		//Either create selection box, or move it to the newly selected unit.
		moveSelectionBox(xcoor, ycoor);
	}
	
	//Handler for endturn. Also called when a player dies on his own turn.
	function endTurn(nextPlayer)
	{
		//If it is your turn, unlock events- otherwise, lock events.
		if(nextPlayer == this_player_name)
		{
			events_locked = false;
		}
		else
		{
			events_locked = true;
		}
		document.getElementById("stat_player_turn").innerHTML = nextPlayer+"\'s turn";
		clearSelection();
	}
	
	function place(xcoor, ycoor, player_name, nth_unit)
	{
		//Set unit (nth_unit in the unit_list) location attributes
		var unit_list = findUnitList(player_name);
		unit_list[nth_unit].xcoor = xcoor;
		unit_list[nth_unit].ycoor = ycoor;
		//Change src of appropriate tile.
		var tile = document.getElementById("X"+xcoor.toString()+"Y"+ycoor.toString());
		tile.src = unit_list[nth_unit].src;
		//Add teamcolor underneath placed unit.
		var color = getTeamColor(player_name);
		if(color == "blue")
		{
			addImage(color+nth_unit.toString(), "http://imgur.com/0naGZPu.png", getAbsoluteFromGrid(xcoor), getAbsoluteFromGrid(ycoor), 0, 40, 40);
		}
		if(color == "teal")
		{
			addImage(color+nth_unit.toString(), "http://imgur.com/2uaKXfL.png", getAbsoluteFromGrid(xcoor), getAbsoluteFromGrid(ycoor), 0, 40, 40);
		}
		if(color == "orange")
		{
			addImage(color+nth_unit.toString(), "http://imgur.com/RzvzXFl.png", getAbsoluteFromGrid(xcoor), getAbsoluteFromGrid(ycoor), 0, 40, 40);
		}
		if(color == "purple")
		{
			addImage(color+nth_unit.toString(), "http://imgur.com/USo1Ce6.png", getAbsoluteFromGrid(xcoor), getAbsoluteFromGrid(ycoor), 0, 40, 40);
		}	
	}
	
	//helper function that moves team color element of selected unit.
	function moveTeamColor(xcoor, ycoor)
	{
		var color = getTeamColor(selected_unit.owner);
		var team_color = document.getElementById(color+selected_unit.arr_index.toString());
		team_color.style.top = getAbsoluteFromGrid(ycoor).toString()+"px";
		team_color.style.left = getAbsoluteFromGrid(xcoor).toString()+"px";
	}
	
	//Movement handler
	function move(xcoor, ycoor)
	{
		//change selected unit's xcoor-ycoor
		var unit_list = findUnitList(selected_unit.owner);
		var original_xcoor = unit_list[selected_unit.arr_index].xcoor;
		var original_ycoor = unit_list[selected_unit.arr_index].ycoor;
		var original_tile = document.getElementById("X"+original_xcoor+"Y"+original_ycoor);
		var new_tile = document.getElementById("X"+xcoor+"Y"+ycoor);
		unit_list[selected_unit.arr_index].xcoor = xcoor;
		unit_list[selected_unit.arr_index].ycoor = ycoor;
		//Shift images on grid.
		original_tile.src="http://i.imgur.com/ubwIthk.gif";
		new_tile.src = unit_list[selected_unit.arr_index].src;
		moveSelectionBox(xcoor, ycoor);
		moveTeamColor(xcoor, ycoor);
	}
	
	function attack(xcoor, ycoor, secondary_player, attacker_health, defender_health)
	{
		//Get related unit objects.
		var attacker = findUnitList(selected_unit.owner)[selected_unit.arr_index];
		var defender = findUnit(secondary_player, xcoor, ycoor);
		//If this client loses its last unit during its turn, immediately end turn for this player.
		if(attacker_health == "Playerdead" && selected_unit.owner == this_player_name)
		{
			sendEvent("Endturn", null, null);
		}
		//Change value to a numerical value.
		if(attacker_health == "Playerdead")
		{
			attacker_health = 0;
		}
		if(defender_health == "Playerdead")
		{
			defender_health = 0;
		}
		var div_tiles = document.getElementById("div_tiles");
		//Set to health values given by server.
		defender.health = defender_health;
		attacker.health = attacker_health;
		//Fix selected unit's hp
		document.getElementById("stat_hp").innerHTML=attacker_health.toString();
		//If defender dead, dislocate it, delete team-color, and make tile be dirt again
		if(defender_health <= 0)
		{
			var defender_tile = document.getElementById("X"+xcoor+"Y"+ycoor);
			defender_tile.src = "http://i.imgur.com/ubwIthk.gif";
			var color_id = getTeamColor(secondary_player)+defender.arr_index.toString();
			var defender_color = document.getElementById(color_id);
			div_tiles.removeChild(defender_color);
			defender.xcoor = null;
			defender.ycoor = null;
		}
		//Same as defender death, but clear stat board.
		if(attacker_health <= 0)
		{
			var attacker_tile = document.getElementById("X"+attacker.xcoor+"Y"+attacker.ycoor);
			attacker_tile.src = "http://i.imgur.com/ubwIthk.gif";
			var color_id = getTeamColor(selected_unit.owner)+selected_unit.arr_index.toString();
			var attacker_color = document.getElementById(color_id);
			div_tiles.removeChild(attacker_color);
			attacker.xcoor = null;
			attacker.ycoor = null;
			clearSelection();
		}
		
	}
	
	//Pass data to server based on player click. Called by the tiles onclick and oncontextmenu
	function sendEvent(action, xcoor, ycoor)
	{
		//If its your turn and you are not waiting on a server response already.
		if(! events_locked )
		{
			//Then prevent new events until server response (confirmation) and...
			events_locked = true;
			try
			{
				//Send event to server with the parameters.
				var client_event = 
				{
					"type":"Event",
					"action":action,
					"xcoor":xcoor,
					"ycoor":ycoor,
					"who":this_player_name
				};
				socket.emit('Event_received', JSON.stringify(client_event));
			}
			catch(err)
			{
				events_locked = false;
			}
		}
	}
	
	//Called when server sends a confirmation (responding to a client activity) or a notification (telling other clients of that activity)
	socket.on('phaseIIIservermessage', translateServerMessage);
	function translateServerMessage(message)
	{
			var decrypted = JSON.parse(message);
			if(decrypted.type == "Confirmation")
			{
				//If the action made sense and followed the rules, the confirmation will have a success of true.
				if(decrypted.success)
				{
					//Call appropriate handler
					if(decrypted.action == "Select")
					{
						select(decrypted.xcoor, decrypted.ycoor, decrypted.who);
					}
					else if(decrypted.action == "Endturn")
					{
						endTurn(decrypted.who);
					}
					else if(decrypted.action == "Move")
					{
						move(decrypted.xcoor, decrypted.ycoor);
					}
					else if(decrypted.action == "Attack")
					{
						attack(decrypted.xcoor, decrypted.ycoor, decrypted.who, decrypted.healthSelf, decrypted.healthTarget);
					}
					else if(decrypted.action == "Place")
					{
						place(decrypted.xcoor, decrypted.ycoor, this_player_name, getPlayer(this_player_name).unit_to_place);
						//Next unit in unit_list.
						getPlayer(this_player_name).unit_to_place+=1;
					}
					else if(decrypted.action == "PlaceDone")
					{
						//The last place of the place phase sets whose turn it is and event-locks everyone else.
						place(decrypted.xcoor, decrypted.ycoor, this_player_name, getPlayer(this_player_name).unit_to_place);
						getPlayer(this_player_name).unit_to_place+=1;
						endTurn(decrypted.starting_player);
						document.getElementById("stat_log").innerHTML = "";
					}
				} //Except in special situations, it remains your turn and you can go ahead and send more events.
				if(decrypted.action != "Endturn" && decrypted.action != "PlaceDone")
				{
					events_locked = false;
				}
			} //What did the other clients do?
			else if(decrypted.type == "Notification")
			{
				//Call appropriate handler (mostly alike confirmation)
				if(decrypted.action == "Select")
				{
					select(decrypted.xcoor, decrypted.ycoor, decrypted.who);
				}
				else if(decrypted.action == "Endturn")
				{
					endTurn(decrypted.who);
				}
				else if(decrypted.action == "Move")
				{
					move(decrypted.xcoor, decrypted.ycoor);
				}
				else if(decrypted.action == "Attack")
				{
					attack(decrypted.xcoor, decrypted.ycoor, decrypted.who, decrypted.healthSelf, decrypted.healthTarget);
				}
				else if(decrypted.action == "Place")
				{
					place(decrypted.xcoor, decrypted.ycoor, decrypted.who, getPlayer(decrypted.who).unit_to_place);
					getPlayer(decrypted.who).unit_to_place+=1;
				}
				else if(decrypted.action == "PlaceDone")
				{
					place(decrypted.xcoor, decrypted.ycoor, decrypted.who, getPlayer(decrypted.who).unit_to_place);
					getPlayer(decrypted.who).unit_to_place+=1;
					endTurn(decrypted.starting_player);
					document.getElementById("stat_log").innerHTML = "";
				}
			}
	}	
	//Sets up phase 3 elements.
	function init()
	{
		//Hide phase 2
		document.getElementById("helpAndShop").style.display = "none";
		document.getElementById("command").style.display = "none";
		document.getElementById("yourGold").style.display = "none";
		document.getElementById("yourUnit").style.display = "none";
		document.getElementById("scrollbar").style.display = "none";
		document.getElementById("yourUnitList").style.display = "none";
		document.getElementById("ready").style.display = "none";
		document.getElementById("reset").style.display = "none";
		
		//Generate tiles on grid.
		for(var i = 0; i<14; ++i)
		{
			for(var j = 0; j<14; ++j)
			{
				addTile(i,j);
			}
		}
		//Reveal phase 3 elements.
		document.getElementById("stat_end_turn").onclick = function(){ sendEvent("Endturn", null, null); };
		document.getElementById("stat_end_turn").style.display = "block";
		document.getElementById("stat_hp").style.display = "block";
		document.getElementById("stat_damage").style.display = "block";
		document.getElementById("stat_movement").style.display = "block";
		document.getElementById("stat_range").style.display = "block";
		document.getElementById("stat_icon").style.display = "block";
		document.getElementById("stat_log").style.display = "block";
		document.getElementById("stat_ability").style.display = "block";
		document.getElementById("stat_player_turn").style.display = "block";
		document.getElementById("grid").style.display = "block";
		document.getElementById("next").style.display = "block";
		
		//old Hide- probably delete
		document.getElementById("loggedin").style.display = "none";
		document.getElementById("board").style.display = "none";
		document.getElementById("msg").style.display = "none";
		document.getElementById("send").style.display = "none";
		document.getElementById("start_button").style.display = "none";
		
		document.getElementById("stat_player_turn").innerHTML = "Place Phase";
		
		//Set names of player objects.
		this_player_name = user_str;
		
		player_1.name = list_of_users[0];
		player_2.name = list_of_users[1];
		
		if(!is_two_player_game)
		{
			player_3.name = list_of_users[2];
			player_4.name = list_of_users[3];
		}
		document.getElementById("stat_log").innerHTML = "Place your units in your camp.";
		socket.emit('Testing', "Hello");
	}
	//Old testing function. Probably delete.
	function Testing(message)
	{
		console.log(message);
	}
	socket.on('Testing', Testing);
	
	//Finish constructing phase 3.
	init();
  });
 });
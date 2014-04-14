//Global scope variables associated with phase III that are set before 
var this_player_name = null;
//Player objects contain their unit objects, the player name, and the current unit in the array to place.
var player_1 =
{
	unit_list:[],
	name:null,
	is_alive:false
};
var player_2 =
{
	unit_list:[],
	name:null,
	is_alive:false
};
var player_3 =
{
	unit_list:[],
	name:null,
	is_alive:false
};
var player_4 =
{
	unit_list:[],
	name:null,
	is_alive:false
};

//Phase III functions and variables that do not require modification by Phase II	
Crafty.scene('Phase 3', function()
{
	$(document).ready(function() 
	{

		//Once client sends an event to server, the client cannot send any more until the server sends a confirmation to the client.
		var events_locked = false;

		//Makes finding selected unit easier for modifying attacker and modifying selected unit location.
		var selected_unit =
		{
			owner:null,
			arr_index:null
		};

		//Used for place phase with unit-inventory to determine the index of the client's unit_list which is being dragged.
		var inventory_dragged_unit = null;

		//An array containing all DOM ids of squares which can be moved to.
		var movement_shadow = [];

		//Function that finds all spaces that can be moved to, checks their occupancy, then adds a shadow to array if unoccupied
		function generateMovementShadow()
		{
			var unit = getPlayer(selected_unit.owner).unit_list[selected_unit.arr_index];
			//If the unit cannot move, no shadow.
			if(unit.can_move == false)
			{
				return;
			}
			//Set appropriate boundaries.
			var far_left = unit.xcoor - unit.movement;
			var far_right = unit.xcoor + unit.movement;
			var far_top = unit.ycoor - unit.movement;
			var far_bottom = unit.ycoor + unit.movement;
			if(far_left < 0)
			{
				far_left = 0;
			}
			if(far_right > 13)
			{
				far_right = 13;
			}
			if(far_top < 0)
			{
				far_top = 0;
			}
			if(far_bottom > 13)
			{
				far_bottom = 13;
			}
			//Check each space top to bottom- left to right
			for(var i = far_left;i <= far_right;++i)
			{
				for(var j = far_top;j <= far_bottom;++j)
				{
					//If space empty- add shadow.
					if(!isOccupied(i, j))
					{
						var shadow_id = "X"+i.toString()+"Y"+j.toString();
						movement_shadow.push(shadow_id);
						document.getElementById(shadow_id).src = "http://i.imgur.com/Pa1TQOw.png";
					}
				}
			}
		}

		//Deletes the movement shadow.
		function clearMovementShadow()
		{
			while(movement_shadow.length > 0)
			{
				var shadow_id = movement_shadow.pop();
				var y_in_id = shadow_id.indexOf("Y");
				//Start 1 past x, go to y. Make int.
				var xcoor = parseInt(shadow_id.substring(1, y_in_id));
				//Start 1 past y, go to end. Make int
				var ycoor = parseInt(shadow_id.substring(y_in_id+1));
				if(!isOccupied(xcoor, ycoor))
				{
					document.getElementById(shadow_id).src = "http://i.imgur.com/ubwIthk.gif";
				}
			}
		}

		function checkVictory()
		{
			//Check to see that only one player lives
			var num_alive = player_1.is_alive + player_2.is_alive + player_3.is_alive + player_4.is_alive;
			if(num_alive == 1)
			{
				//Put the live player's name in victory alert.
				switch(true)
				{
					case player_1.is_alive:
						name = player_1.name;
					break;
					case player_2.is_alive:
						name = player_2.name;
					break;
					case player_3.is_alive:
						name = player_3.name;
					break;
					case player_3.is_alive:
						name = player_4.name;
					break;					
				}
				alert(name + " wins the game.");
			}
			if(num_alive == 0)
			{
				alert("There has been a tie.");
			}
		}

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
		/*function getTeamColor(player_name)
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
		}*/

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

		function addRedX(id)
		{
			var red_x = document.getElementById(id);
			var src = "http://i.imgur.com/hj0R9rv.png";
			if(red_x == null)
			{
				switch(id)
				{
					case "noAttack":
						addImage(id, src, 800, 200, 2, 36, 36);
					break;
					case "noMove":
						addImage(id, src, 700, 250, 2, 36, 36);
					break;
				}
			}
			else
			{
				red_x.style.visibility = "visible";
			}
		}

		function hideRedX(id)
		{
			var red_x = document.getElementById(id);
			if(red_x != null)
			{
				red_x.style.visibility = "hidden";
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

		//Helper function that finds the unit object of a player at xcoor,ycoor. If no such unit, return null.
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

		//Is the space at x-y occupied by a unit?
		function isOccupied(xcoor, ycoor)
		{
			//Check each player's unit list for a unit at x-y.
			var owner_1 = findUnit(player_1.name, xcoor, ycoor);
			var owner_2 = findUnit(player_2.name, xcoor, ycoor);
			var owner_3 = findUnit(player_3.name, xcoor, ycoor);
			var owner_4 = findUnit(player_4.name, xcoor, ycoor);
			if(owner_1 == null 
			&& owner_2 == null 
			&& owner_3 == null 
			&& owner_4 == null)
			{
				return false;
			}
			return true;
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
			//Clear disabilities.
			hideRedX("noAttack");
			hideRedX("noMove");
			//Remove movement shadow.
			clearMovementShadow();
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
			//Clear current selection.
			clearSelection();
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
						//Set disabilities.
						if(!unit_list[i].can_move)
						{
							addRedX("noMove");
						}
						if(!unit_list[i].can_attack)
						{
							addRedX("noAttack");
						}						
					}
				}
			}
			//Set the stat boards with the stats of the found unit
			changeStatsGraphical(stats);
			//Either create selection box, or move it to the newly selected unit.
			moveSelectionBox(xcoor, ycoor);
			//Movement shadow seen only on your own units.
			if(selected_unit.owner == this_player_name)
			{
				generateMovementShadow();
			}
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
			//Reset movement-attack capabilities for units owned by nextPlayer.
			var unit_list = getPlayer(nextPlayer).unit_list
			for(var i = 0; i < unit_list.length; ++i)
			{
				unit_list[i].can_move = true;
				unit_list[i].can_attack = true;
			}
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
			/*var color = getTeamColor(player_name);
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
			}*/
			//Remove placed unit from your inventory if the placed unit was your unit.
			if(player_name == this_player_name)
			{
				var div_tiles = document.getElementById("div_tiles");
				var inventory_unit = document.getElementById("inventory_unit"+nth_unit);
				div_tiles.removeChild(inventory_unit);
			}			
		}

		//helper function that moves team color element of selected unit.
		/*function moveTeamColor(xcoor, ycoor)
		{
			var color = getTeamColor(selected_unit.owner);
			var team_color = document.getElementById(color+selected_unit.arr_index.toString());
			team_color.style.top = getAbsoluteFromGrid(ycoor).toString()+"px";
			team_color.style.left = getAbsoluteFromGrid(xcoor).toString()+"px";
		}*/

		//Movement handler
		function move(xcoor, ycoor)
		{
			clearMovementShadow()
			//change selected unit's xcoor-ycoor
			var unit_list = findUnitList(selected_unit.owner);
			var original_xcoor = unit_list[selected_unit.arr_index].xcoor;
			var original_ycoor = unit_list[selected_unit.arr_index].ycoor;
			var original_tile = document.getElementById("X"+original_xcoor+"Y"+original_ycoor);
			var new_tile = document.getElementById("X"+xcoor+"Y"+ycoor);
			unit_list[selected_unit.arr_index].xcoor = xcoor;
			unit_list[selected_unit.arr_index].ycoor = ycoor;
			unit_list[selected_unit.arr_index].can_move = false;
			//Shift images on grid.
			original_tile.src="http://i.imgur.com/ubwIthk.gif";
			new_tile.src = unit_list[selected_unit.arr_index].src;
			moveSelectionBox(xcoor, ycoor);
			//moveTeamColor(xcoor, ycoor);
			addRedX("noMove");
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
			var check_if_dead = false;
			if(attacker_health == "Playerdead")
			{
				attacker_health = 0;
				getPlayer(selected_unit.owner).is_alive = false;
			}
			if(defender_health == "Playerdead")
			{
				defender_health = 0;
				getPlayer(secondary_player).is_alive = false;
			}
			if(defender_health <= 0)
			{
				check_if_dead = true;
			}
			var div_tiles = document.getElementById("div_tiles");
			// Hey, I didn't break anything!
			var damage_dealt = defender.health - defender_health;
			var message = selected_unit.owner + "\'s " + attacker.name + " attacked "
						+ secondary_player + "\'s " + defender.name + " and did "
						+ damage_dealt + " damage.";
			if(selected_unit.owner == this_player_name)
			{
				socket.emit('phaseIII_message', message);
				if(check_if_dead)
				{
					var death_message = secondary_player + "\'s " + 
							defender.name + " died.";
					socket.emit('phaseIII_message', death_message);
				}
			}
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
				//var color_id = getTeamColor(secondary_player)+defender.arr_index.toString();
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
				//var color_id = getTeamColor(selected_unit.owner)+selected_unit.arr_index.toString();
				var attacker_color = document.getElementById(color_id);
				div_tiles.removeChild(attacker_color);
				attacker.xcoor = null;
				attacker.ycoor = null;
				clearSelection();
			}
			attacker.can_attack = false;
			addRedX("noAttack");
			checkVictory();
		}

		//Pass data to server based on player click. Called by the tiles onclick and oncontextmenu
		function sendEvent(action, xcoor, ycoor)
		{
			console.log("Event sent");
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
						"who":this_player_name,
						"dragged_num":inventory_dragged_unit
					};
					socket.emit('Event_received', JSON.stringify(client_event));
				}
				catch(err)
				{
					alert(err);
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
						place(decrypted.xcoor, decrypted.ycoor, this_player_name, decrypted.dragged_num);
						//Next unit in unit_list.
					}
					else if(decrypted.action == "PlaceDone")
					{
						//The last place of the place phase sets whose turn it is and event-locks everyone else.
						place(decrypted.xcoor, decrypted.ycoor, this_player_name, decrypted.dragged_num);
						endTurn(decrypted.starting_player);
						document.getElementById("stat_log").innerHTML = "";
						var div_tiles = document.getElementById("div_tiles");
						var unit_camp = document.getElementById("unit_camp");
						div_tiles.removeChild(unit_camp);
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
					place(decrypted.xcoor, decrypted.ycoor, decrypted.who, decrypted.dragged_num);
				}
				else if(decrypted.action == "PlaceDone")
				{
					place(decrypted.xcoor, decrypted.ycoor, decrypted.who, decrypted.dragged_num);
					endTurn(decrypted.starting_player);
					document.getElementById("stat_log").innerHTML = "";
					var div_tiles = document.getElementById("div_tiles");
					var unit_camp = document.getElementById("unit_camp");
					div_tiles.removeChild(unit_camp);
				}
			}
		}

		//Unit camp element's onclick function that transports events to tiles beneath the element.
		function unitCampOnClick(mouse_event)
		{
			var unit_camp = document.getElementById("unit_camp");
			//Get place clicked.
			var xcoor = mouse_event.pageX;
			var ycoor = mouse_event.pageY;
			//Hide unit camp element so elementFromPoint will return a tile, not unit camp element.
			unit_camp.style.visibility = "hidden";
			var found_element = document.elementFromPoint(xcoor, ycoor);
			unit_camp.style.visibility = "visible";
			//If the click was aimed at a tile, make it happen.
			if(found_element != null)
			{
				console.log(found_element.id);
				//If no onclick, not the element we want.
				if(typeof found_element.onclick == "function")
				{
					console.log("enter");
					found_element.onclick(mouse_event);
				}
			}
		}

		//Place player-camp affordance based on which player this client is.
		function placePlayerCamp()
		{
			var xcoor;
			var ycoor;
			switch(this_player_name)
			{
				case player_1.name:
					xcoor = 0;
					ycoor = 0;
					break;
				case player_2.name:
					xcoor = 10;
					ycoor = 10;
					break;
				case player_3.name:
					xcoor = 0;
					ycoor = 10;
					break;
				case player_4.name:
					xcoor = 10;
					ycoor = 0;
					break;
			}
			xcoor = getAbsoluteFromGrid(xcoor);
			ycoor = getAbsoluteFromGrid(ycoor);
			//Add the big green square.
			addImage("unit_camp", "http://imgur.com/VSv5AOI.png", xcoor, ycoor, 2, 184, 184);
			//Set transport layer for the green square.
			var unit_camp = document.getElementById("unit_camp");
			unit_camp.onclick = unitCampOnClick;
			unit_camp.ondragover =
			function(mouse_event)
			{
				mouse_event.preventDefault();
			}
			unit_camp.ondragenter =
			function(mouse_event)
			{
				mouse_event.preventDefault();
			}			
		}

	function paintInventory(unit_list)
	{
		//Create unit inventory back-drop
		addImage("unit_inventory", "http://i.imgur.com/xOprkXs.png", 685, 500, 0, 176, 124);
		var inventory = document.getElementById("unit_inventory");
		inventory.ondragstart = 
		function()
		{
			return false;
		}
		inventory.ondrop = 
		function()
		{
			return false;
		}		
		//Paint inventory slots
		for(var i = 0; i < 8; ++i)
		{
			var square_id = "inventory_square"+i;
			//Paint squares left to right, after first row, do second.
			var square_left = 685+(43*(i%4));
			var square_top = 533+43*(i>3);
			addImage(square_id, "http://i.imgur.com/Uka6Tb2.png", square_left, square_top, 1, 46, 46);
			var square = document.getElementById(square_id);
			square.oncontextmenu = 
			function()
			{
				return false;
			};
			//Paint unit icons in the slots.
			if(i < unit_list.length)
			{
				var unit_id = "inventory_unit"+i;
				//Paint icons on squares in same order as the squares were painted.
				var unit_left = 688+(43*(i%4));
				var unit_top = 536+(43*(i>3));
				addImage(unit_id, unit_list[i].src, unit_left, unit_top, 2, 40, 40);
				var unit = document.getElementById(unit_id);
				unit.oncontextmenu = 
				function()
				{
					return false;
				};
				unit.ondragstart =
				(function(unit)
				{
					return function()
					{
						console.log("drag start" + parseInt(unit.id.substring(14)).toString());
						//Set global variable telling the index of the dragged unit.
						inventory_dragged_unit = parseInt(unit.id.substring(14));
					}
				})(unit);

				unit.ondragend = 
				function(mouse_event)
				{
					var xcoor = mouse_event.pageX;
					var ycoor = mouse_event.pageY;
					var found_element = document.elementFromPoint(xcoor, ycoor);
					if(found_element != null)
					{
						//If no onclick, not the element we want.
						if(typeof found_element.onclick == "function")
						{
							found_element.onclick(mouse_event);
						}
					}
					inventory_dragged_unit = null;
				}
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
			document.getElementById("log").style.display = "block";
			document.getElementById("battle_log").style.display = "block";

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

			player_1.is_alive = true;
			player_2.is_alive = true;

			if(!is_two_player_game)
			{
				player_3.name = list_of_users[2];
				player_4.name = list_of_users[3];
				player_3.is_alive = true;
				player_4.is_alive = true;

			}
			document.getElementById("stat_log").innerHTML = "Place your units in your camp.";
			placePlayerCamp();
			paintInventory(getPlayer(this_player_name).unit_list);
			socket.emit('Testing', "Hello");
		}

		//Old testing function. Probably delete.
		function Testing(message)
		{
			console.log(message);
		}
		socket.on('Testing', Testing);

		socket.on('phaseIII_notification',
			function(message) 
			{
				if (message) 
				{
					// Similar to the handler of 'chat' event ...
					var div = $('<div></div>');
					div.append($('<span></span>').addClass('phaseIII_notification').text(message));
					$('#log').append(div);
					var scrollingDown = document.getElementById("log");
					scrollingDown.scrollTop = scrollingDown.scrollHeight; 
				}
			});
		socket.on('phaseIII_chat',
			function(message)
			{
				var obj = JSON.parse(message);
				if (obj && obj.user_name && obj.msg) 
				{
					var user_name = obj.user_name;

					var msg = obj.msg;

					var div = $('<div></div>');

					div.append($('<span></span>').addClass('user_name').text(user_name));
					div.append($('<span></span>').addClass('says').text(' says: '));
					div.append($('<span></span>').addClass('msg').text(msg));

					$('#log').append(div);
					var scrollingDown = document.getElementById("log");
					scrollingDown.scrollTop = scrollingDown.scrollHeight; 
				}
			});
		//Finish constructing phase 3.
		init();
	});
 });

var this_player_name = null;
	 
Crafty.scene('Phase 3', function(){
  $(document).ready(function() {


	var events_locked = false;
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
	var last_event =
	{
		type:null,
		action:null,
		xcoor:null,
		ycoor:null
	};		
	//Makes finding selected unit easier.
	var selected_unit =
	{
		owner:null,
		arr_index:null
	};
	
	socket.on('SetPlayerOneUnitList', function(message){
		player_1.unit_list = JSON.parse(message).unit_list;
	});
	
	socket.on('SetPlayerTwoUnitList', function(message){
		player_2.unit_list = JSON.parse(message).unit_list;
	});
	
	socket.on('SetPlayerThreeUnitList', function(message){
		player_3.unit_list = JSON.parse(message).unit_list;
	});
	
	socket.on('SetPlayerFourUnitList', function(message){
		player_4.unit_list = JSON.parse(message).unit_list;
	});
	
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
		console.log("in getPlayer, player = " + player_name);
		return player;
	}
	
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
	
	function getAbsoluteFromGrid(coor)
	{
		return 23+43*coor;
	}
	
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
	
	function findUnitList(player_name)
	{
		var unit_list;
		console.log("player1.name = " + player1.name);
		console.log("player2.name = " + player2.name);
		console.log("player3.name = " + player3.name);
		console.log("player4.name = " + player4.name);
	
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
		else
		{
			console.log("default");
		}
		return unit_list;
	}
	
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
	
	function select(xcoor, ycoor, unit_owner)
	{
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
		changeStatsGraphical(stats);
		moveSelectionBox(xcoor, ycoor);
	}
	
	function endTurn(nextPlayer)
	{
		console.log(this_player_name);
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
		console.log("in place(), player_name = " + player_name);
		var unit_list = findUnitList(player_name);
		console.log("unit_list = " + unit_list);
		unit_list[nth_unit].xcoor = xcoor;
		unit_list[nth_unit].ycoor = ycoor;
		var tile = document.getElementById("X"+xcoor.toString()+"Y"+ycoor.toString());
		tile.src = unit_list[nth_unit].src;
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
	
	function moveTeamColor(xcoor, ycoor)
	{
		var color = getTeamColor(selected_unit.owner);
		var team_color = document.getElementById(color+selected_unit.arr_index.toString());
		team_color.style.top = getAbsoluteFromGrid(ycoor).toString()+"px";
		team_color.style.left = getAbsoluteFromGrid(xcoor).toString()+"px";
	}
	
	function move(xcoor, ycoor)
	{
		var unit_list = findUnitList(selected_unit.owner);
		var original_xcoor = unit_list[selected_unit.arr_index].xcoor;
		var original_ycoor = unit_list[selected_unit.arr_index].ycoor;
		var original_tile = document.getElementById("X"+original_xcoor+"Y"+original_ycoor);
		var new_tile = document.getElementById("X"+xcoor+"Y"+ycoor);
		unit_list[selected_unit.arr_index].xcoor = xcoor;
		unit_list[selected_unit.arr_index].ycoor = ycoor;
		original_tile.src="http://i.imgur.com/ubwIthk.gif";
		new_tile.src = unit_list[selected_unit.arr_index].src;
		moveSelectionBox(xcoor, ycoor);
		moveTeamColor(xcoor, ycoor);
	}
	
	function attack(xcoor, ycoor, secondary_player, attacker_health, defender_health)
	{
		if(attacker_health == "Playerdead" && selected_unit.owner == this_player_name)
		{
			sendEvent("Endturn", null, null);
		}
		if(attacker_health == "Playerdead")
		{
			attacker_health = 0;
		}
		if(defender_health == "Playerdead")
		{
			defender_health = 0;
		}
		var attacker = findUnitList(selected_unit.owner)[selected_unit.arr_index];
		var defender = findUnit(secondary_player, xcoor, ycoor);
		var div_tiles = document.getElementById("div_tiles");
		defender.health = defender_health;
		attacker.health = attacker_health;
		document.getElementById("stat_hp").innerHTML=attacker_health.toString();
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
	function sendEvent(action, xcoor, ycoor)
	{
		if(! events_locked || action == "Exit" )
		{
			events_locked = true;
			try
			{
				var client_event = 
				{
					"type":"Event",
					"action":action,
					"xcoor":xcoor,
					"ycoor":ycoor,
					"who":this_player_name
				};
				socket.emit('Event_received', JSON.stringify(client_event));
				if(! action == "Exit")
				{
					last_event.type="Event";
					last_event.action=action;
					last_event.xcoor=xcoor;
					last_event.ycoor=ycoor;
				}
			}
			catch(err)
			{
				events_locked = false;
			}
		}
	}
	
	socket.on('phaseIIIservermessage', translateServerMessage);
	function translateServerMessage(message)
	{
			var decrypted = JSON.parse(message);
			console.log("###");
			console.log(decrypted.type);
			console.log(decrypted.action);
			console.log("###");
			if(decrypted.type == "Confirmation")
			{
				if(decrypted.success)
				{
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
						getPlayer(this_player_name).unit_to_place+=1;
					}
					else if(decrypted.action == "PlaceDone")
					{
						place(decrypted.xcoor, decrypted.ycoor, this_player_name, getPlayer(this_player_name).unit_to_place);
						getPlayer(this_player_name).unit_to_place+=1;
						console.log("---");
						console.log(decrypted.starting_player);
						endTurn(decrypted.starting_player);
					}
				}
				if(decrypted.action != "Endturn" && decrypted.action != "PlaceDone")
				{
					events_locked = false;
				}
			}
			else if(decrypted.type == "Notification")
			{
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
					console.log("---");
					console.log(decrypted.starting_player);
					endTurn(decrypted.starting_player);
				}
			}
	}		
		function init()
		{
			document.getElementById("helpAndShop").style.display = "none";
			document.getElementById("command").style.display = "none";
			document.getElementById("yourGold").style.display = "none";
			document.getElementById("yourUnit").style.display = "none";
			document.getElementById("scrollbar").style.display = "none";
			document.getElementById("yourUnitList").style.display = "none";
			document.getElementById("ready").style.display = "none";
			document.getElementById("reset").style.display = "none";
			
			for(var i = 0; i<14; ++i)
			{
				for(var j = 0; j<14; ++j)
				{
					addTile(i,j);
				}
			}
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
			
			//Hide
			document.getElementById("loggedin").style.display = "none";
			document.getElementById("board").style.display = "none";
			document.getElementById("msg").style.display = "none";
			document.getElementById("send").style.display = "none";
			document.getElementById("start_button").style.display = "none";
			
			document.getElementById("stat_player_turn").innerHTML = "Place Phase";
			
			this_player_name = user_str;
			
			player_1.name = list_of_users[0];
			player_2.name = list_of_users[1];
			
			if(!is_two_player_game)
			{
				player_3.name = list_of_users[2];
				player_4.name = list_of_users[3];
			}
			
			socket.emit('Testing', "Hello");
		}
	function Testing(message)
	{
		console.log(message);
	}
	socket.on('Testing', Testing);
	
	init();
  });
 });
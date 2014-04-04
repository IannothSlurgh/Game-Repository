//stores the maze to be draw in the format of an array of strings
var maze_data;
//the position of the player relative to the other clients
var player_number = 0;
//determines whether the game is in two player mode or four player mode
var is_two_player_game = false;
//stores a list of enemy players which represent the other clients playing the game
var enemy_list = new Array();
//stores all the money that are on the grid
var money_list = new Array();
//the connection where the client communicates with the server
var socket;
//stores an instance of the client's player object
var player;
//stores the name that the player entered during the log in screen
var user_str;
//stores a list of all client names
var list_of_users;

//places the client player into its corresponding spot in the center of the maze
function place_player()
{
	var col;
	var row;
	
	switch(player_number)
	{
		case 0:
			if(is_two_player_game)
			{
				col = 27;
				row = 20;
			}
			else
			{
				col = 27;
				row = 19;
			}
			
			break;
		case 1:
			if(is_two_player_game)
			{
				col = 29;
				row = 20;
			}
			else
			{
				col = 29;
				row = 21;
			}
			
			break;
		case 2:
			col = 29;
			row = 19;
			break;
		case 3:
			col = 27;
			row = 21;
			break;
	}
	
	var player_text = Crafty.e("2D, DOM, Text")
		.attr({x: col * 16, y: row * 16 - 15, w: 75})
		.text(list_of_users[player_number]);
		
	player = Crafty.e('PlayerCharacter').at(col, row).attach(player_text);
}

//places an enemy player in the center of the grid which will represent another client
function place_enemy_player(index)
{
	var col;
	var row;
	
	switch(index)
	{
		case 0:
			if(is_two_player_game)
			{
				col = 27;
				row = 20;
			}
			else
			{
				col = 27;
				row = 19;
			}
			
			break;
		case 1:
			if(is_two_player_game)
			{
				col = 29;
				row = 20;
			}
			else
			{
				col = 29;
				row = 21;
			}
			
			break;
		case 2:
			col = 29;
			row = 19;
			break;
		case 3:
			col = 27;
			row = 21;
			break;
	}
	
	//need to change width and x position based on user_name
	var enemy_text = Crafty.e("2D, DOM, Text")
		.attr({x: col * 16, y: row * 16 - 15, w: 75})
		.text(list_of_users[index]);
	
	enemy_list.push(Crafty.e('EnemyPlayer').attr({index: index}).at(col, row).attach(enemy_text));
}

//the help screen
var whichHelpScreen = 0;
//the next 3 functions, and Craft.scene('Help', function()) written by Jason Sitzman
//all illustrations inside the help menu produced by Jason Sitzman
Crafty.scene('Help', function()
{
	Crafty.stage.elem.style.display = "none";
	document.getElementById("helpAndShop").style.display = "block";
	document.getElementById("helpAndShop").style.zIndex = "-1";
	back();
});

function phase_one() {
	document.getElementById("helpText2").style.display = "none";
	document.getElementById("helpText3").style.display = "none";
	document.getElementById("toTitle").style.display = "none";
	document.getElementById("phase2").style.display = "none";
	document.getElementById("phase3").style.display = "none";
	document.getElementById("phase1").style.display = "none"; 
	document.getElementById("toHelp").style.display = "block";
	document.getElementById("toHelp").style.top = "576px";
	document.getElementById("toHelp").style.left = "761px";
	document.getElementById("toHelp").style.zIndex = "2";
	document.getElementById("helpText1").style.display = "block";
	document.getElementById("helpText1").style.zIndex = "0";
}

function phase_two() {
	document.getElementById("helpText1").style.display = "none";
	document.getElementById("helpText3").style.display = "none";
	document.getElementById("toTitle").style.display = "none";
	document.getElementById("phase2").style.display = "none";
	document.getElementById("phase3").style.display = "none";
	document.getElementById("phase1").style.display = "none"; 
	document.getElementById("toHelp").style.display = "block";
	document.getElementById("toHelp").style.top = "576px";
	document.getElementById("toHelp").style.left = "761px";
	document.getElementById("toHelp").style.zIndex = "2";
	document.getElementById("helpText2").style.display = "block";
	document.getElementById("helpText2").style.zIndex = "0";
}

function phase_three() {
	document.getElementById("helpText2").style.display = "none";
	document.getElementById("helpText1").style.display = "none";
	document.getElementById("toTitle").style.display = "none";
	document.getElementById("phase2").style.display = "none";
	document.getElementById("phase3").style.display = "none";
	document.getElementById("phase1").style.display = "none"; 
	document.getElementById("toHelp").style.display = "block";
	document.getElementById("toHelp").style.top = "576px";
	document.getElementById("toHelp").style.left = "761px";
	document.getElementById("toHelp").style.zIndex = "2";
	document.getElementById("helpText3").style.display = "block";
	document.getElementById("helpText3").style.zIndex = "0";
}

function back() {
	document.getElementById("helpText1").style.display = "none";
	document.getElementById("helpText2").style.display = "none";
	document.getElementById("helpText3").style.display = "none";
	document.getElementById("toHelp").style.display = "none";
	
	document.getElementById("toTitle").style.display = "block";
	document.getElementById("toTitle").style.top = "490px";
	document.getElementById("toTitle").style.left = "380px";
	document.getElementById("toTitle").style.zIndex = "2";
	
	document.getElementById("phase2").style.display = "block";
	document.getElementById("phase2").style.top = "221px";
	document.getElementById("phase2").style.left = "380px";
	document.getElementById("phase2").style.zIndex = "2";
	
	document.getElementById("phase3").style.display = "block";
	document.getElementById("phase3").style.top = "355px";
	document.getElementById("phase3").style.left = "380px";
	document.getElementById("phase3").style.zIndex = "2";
	
	document.getElementById("phase1").style.display = "block"; 
	document.getElementById("phase1").style.top = "86px";
	document.getElementById("phase1").style.left = "380px";
	document.getElementById("phase1").style.zIndex = "2";
}

//exits the help menu
function returnFromHelpScreen() 
{
	whichHelpScreen = 0;
	document.getElementById("helpAndShop").style.display = "none";
	document.getElementById("helpText1").style.display = "none";
	document.getElementById("helpText2").style.display = "none";
	document.getElementById("helpText3").style.display = "none";
	document.getElementById("toHelp").style.display = "none";
	document.getElementById("toTitle").style.display = "none";
	document.getElementById("phase1").style.display = "none";
	document.getElementById("phase2").style.display = "none";
	document.getElementById("phase3").style.display = "none";
	Crafty.stage.elem.style.display = "block";
	Crafty.scene('StartScreen');
}

//Contains the initialization of the maze phase of the game
//Places money, players, and enemy players on the grid
Crafty.scene('Game', function()
{
	//2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for(var i = 0; i < Game.map_grid.width; i++)
	{
		this.occupied[i] = new Array(Game.map_grid.height);
		for(var y = 0; y < Game.map_grid.height; y++)
		{
			this.occupied[i][y] = false;
		}
	}
	
	for(var x = 26; x < 31; x++)
	{
		for(var y = 18; y < 23; y++)
		{
			maze_data[x][y] = '.';
			this.occupied[x][y] = true;
		}
	}
	
	//draw grid on screen
	var money_counter = 0;
	for(var x = 0; x < Game.map_grid.width; x++)
	{
		for(var y = 0; y < Game.map_grid.height; y++)
		{
			if(maze_data[x][y] != '.')
			{
				if(maze_data[x][y] == '$')
				{
					Crafty.e('Path').at(x, y);
					money_list.push(Crafty.e('Money').attr({index : money_counter}).at(x, y));
					money_counter++;
					this.occupied[x][y] = true;
				}
				else
				{
					Crafty.e('Wall').at(x, y);
					this.occupied[x][y] = true;
				}
			}
			else
			{
				Crafty.e('Path').at(x, y);
			}
		}
	}
	
	//place character
	place_player();
	
	for(var j = 0; j < 4; j++)
	{
		if(is_two_player_game && j > 1)
		{
			break;
		}
		if(j != player_number)
		{
			place_enemy_player(j);
		}
	}
	
	//sends info to the server whenever the player moves
	Crafty.bind('PlayerMoved', function()
	{
		var player_info = 
		{ 
			"index" : player_number, 
			"x" : player.x, 
			"y": player.y 
		};
		socket.emit('PlayerMovement', JSON.stringify(player_info));
	});
	
	//updates the position of an enemy player
	socket.on('updateEnemyPlayer', function(message)
	{
		var enemy_index = message.index;
		for(var i = 0; i < enemy_list.length; i++)
		{
			if(enemy_list[i].index == enemy_index)
			{
				enemy_list[i].x = message.x;
				enemy_list[i].y = message.y;
			}
		}
	});
	
	//send message to server to indicate that one of the players has collided with a piece of money
	socket.on('destroyMoney', function(message)
	{
		var money_index = message.collected_money_index;
		money_list[money_index].x = message.x;
		money_list[money_index].y = message.y;
	});
	
	
	
	//displays the score of the client player
	Crafty.e("2D, DOM, Text")
		.attr({x: 0, y: 0, w: 75})
		.text("Score: 0")
		.bind('ChangeScore', function(player)
		{
			//receive signal from server
			this.text('Score: ' + player.score);
		});
	
	//sends an event to update the maze timer
	setTimeout (function()
	{
		Crafty.trigger('ChangeTimer');
	}, 1000);
	
	var time_left = 45;
	
	//displays the timer on the screen
	Crafty.e("2D, DOM, Text")
		.attr({x: 100, y: 0, w: 100})
		.text("Time = " + Math.floor(time_left/60) + ":"+(time_left%60))
		.bind('ChangeTimer', function()
		{
			time_left -= 1;
			
			if(time_left >= 0)
			{
				setTimeout (function()
				{
					Crafty.trigger('ChangeTimer');
				}, 1000);
				if((time_left%60) >= 10)
				{
					this.text("Time = " + Math.floor(time_left/60) + ":"+(time_left%60));
				}
				else
				{
					this.text("Time = " + Math.floor(time_left/60) + ":0"+(time_left%60));
				}
			}
			else
			{
				Crafty.scene('Phase 2');
			}
		});
	
	//redistributes money on the screen
	this.add_money = this.bind('MoneyCollected', function(money)
	{
		var exit = false;
		
		while(!exit){
			var x = Math.floor(Math.random() * Game.map_grid.width);
			var y = Math.floor(Math.random() * Game.map_grid.height);
		
			if(!this.occupied[x][y])
			{
				this.occupied[x][y] = true;
				money.at(x, y);
				socket.emit('CollectMoney', JSON.stringify({ collected_money_index : money.index, y : money.y, x : money.x}));
			 	exit = true;
			}
		}
	});
	
}, function()
	{
	this.unbind('MoneyCollected', this.add_money);
});

//draws the buttons and images of the start screen
Crafty.scene('StartScreen', function()
{
	
	console.log('This is working.');
	Crafty.e('2D, Canvas, Image')
		.attr({x: 0, y: 0})
		.image("https://raw.githubusercontent.com/IannothSlurgh/Game-Repository/master/start_background.png");
		
	console.log('This is working.');
	Crafty.e('MineCart')
		.attr({x: -100, y: 201});
		
	Crafty.e('2D, Canvas, Image')
		.attr({x: 200, y: 10})
		.image("https://raw.githubusercontent.com/IannothSlurgh/Game-Repository/master/title_img.png");
	
	Crafty.e('2PlayerButton')
		.attr({x: 317, y: 196});
		
	Crafty.e('4PlayerButton')
		.attr({x: 317, y: 352});
		
	Crafty.e('HelpButton')
		.attr({x: 317, y: 508});
		
	
});

Crafty.scene('ConnectionRoom', function()
{
	$(document).ready(function() 
	{
	
		// Hide the warning section and show the login section.
		$('#warning').css('display', 'none');
		$('#login_section').css('display', 'block');

		// Initialize socket.io.
		// document.location.host returns the host of the current page.
		socket = io.connect('http://' + document.location.host);
		$('#start_button').click(function()
		{
			socket.emit('userlist', { user_name: name, status: 1});
			/*
			document.getElementById("board").style.display = "none";
			document.getElementById("loggedin").style.display = "none";
			document.getElementById("msg").style.display = "none";
			document.getElementById("send").style.display = "none";
			document.getElementById("start_button").style.display = "none";
			Crafty.scene('Game');
			*/
		 });
		// If a welcome message is received, it means the chat room is available.
		// The Log In button will be then enabled.
		socket.on('msg',
			function(message) 
			{
				$('#status').text(message);
				$('#login').attr('disabled', false);
			});
	  
		socket.on('mazeDataMsg',
			function(message)
			{
				maze_data = JSON.parse(message).mazeArray;
			});
	
		// If a login_ok message is received, proceed to the chat section.
		socket.on('login_ok',
		function() 
		{
			$('#login_section').css('display', 'none');
			$('#chat_section').css('display', 'block');
			$('#status').text('Logged In.');
		});

		// If a login_failed message is received, stay in the login section but
		// display an error message.
		socket.on('login_failed',
		function()
		{
			$('#status').text('Failed to log in!');
		});

		// If a chat message is received, display it.
	
		socket.on('chat',
		function(message)
		{
			var obj = JSON.parse(message);
			if (obj && obj.user_name && obj.msg) 
			{
				var user_name = obj.user_name;
				  
				var msg = obj.msg;
				// This will create a div element using the HTML code:
				var div = $('<div></div>');
				// Similarly, create span elements with CSS classes and corresponding
				// contents, and append them in a row to the new div element.
				div.append($('<span></span>').addClass('user_name').text(user_name));
				div.append($('<span></span>').addClass('says').text(' says: '));
				div.append($('<span></span>').addClass('msg').text(msg));
				// Add the new div element to the chat board.
				$('#board').append(div);
			}
		});

		socket.on('userlist',
		function(message)
		{
			var obj = JSON.parse(message);
			var names = obj.uniqueNames;
			var status = obj.status;
			list_of_users = names;
			player_number = names.indexOf(user_str);
			console.log("Player_number = " + player_number);
			$('#loggedin').empty();
			
			var original = $('<div class = users>Users:</div>');
			$('#loggedin').append(original);
			
			for(var i = 0; i < names.length; i++)
			{	
				var div = $('<div></div>');
				if(status[i] == 0)
				{
					div.append($('<span></span>').addClass('user_name').text(names[i]));	
				}
				else
				{
					div.append($('<span></span>').addClass('user_ready').text(names[i]));
				}
				$('#loggedin').append(div);	
				
			}
			var count = 0;
			for(var i = 0; i < status.length; i++)
			{
				if((status[i] == 1))
				{
					count++;
				}
			}
			if(count == status.length 
				&& ((is_two_player_game 
				&& status.length == 2) 
				|| (!is_two_player_game 
				&& status.length == 4)))
			{
				document.getElementById("board").style.display = "none";
				document.getElementById("loggedin").style.display = "none";
				document.getElementById("msg").style.display = "none";
				document.getElementById("send").style.display = "none";
				document.getElementById("start_button").style.display = "none";
				Crafty.scene('Game');
			}
		});
	
		// If a notification is received, display it.
		socket.on('notification',
		function(message) 
		{
			if (message) 
			{
				// Similar to the handler of 'chat' event ...
				var div = $('<div></div>');
				div.append($('<span></span>').addClass('notification').text(message));
				$('#board').append(div);
			}
		});
	  
		socket.on('emptyChat',
			function()
			{
				$('#board').empty();
			}
		);

		// When the Log In button is clicked, the provided function will be called,
		// which sends a login message to the server.
		$('#login').click(function() 
		{
			var name = $('#name').val();
			if (name) 
			{
				name = name.trim();
				if (name.length > 0) 
				{
					socket.emit('login', { user_name: name });
					user_str = name;
					socket.emit('userlist', { user_name: name, status: 0});
				}
			}
			// Clear the input field.
			$('#name').val('');
		});

		// When Enter is pressed in the name field, it should be treated as clicking
		// on the Log In button.
		$('#name').keyup(function(event) 
		{
			if (event.keyCode == 13) 
			{
				$('#login').click();
			}
		});

		// When the Log In button is clicked, the provided function will be called,
		// which sends a chat message to the server.
		$('#send').click(function() 
		{
			var data = $('#msg').val();
			if (data) 
			{
				data = data.trim();
				if (data.length > 0) 
				{
					socket.emit('chat', { msg: data });
				}
			}
			// Clear the input field.
			$('#msg').val('');
		});

		// When Enter is pressed in the message field, it should be treated as
		// clicking on the Send button.
		$('#msg').keyup(function(event) 
		{
			if (event.keyCode == 13) 
			{
				$('#send').click();
			}
		});
	});
});

//Craft.scene('Phase 2', function()) written by Jason Sitzman
Crafty.scene('Phase 2', function()
{
	Crafty.stage.elem.style.display = "none";
	document.getElementById("helpAndShop").style.display = "block";
	document.getElementById("command").style.display = "block";
	document.getElementById("yourGold").style.display = "block";
	document.getElementById("yourUnit").style.display = "block";
	document.getElementById("scrollbar").style.display = "block";
	document.getElementById("yourUnitList").style.display = "block";
	document.getElementById("ready").style.display = "block";
	document.getElementById("reset").style.display = "block";
	document.getElementById("helpAndShop").style.top = "0px";
	document.getElementById("helpAndShop").style.left = "0px";
	document.getElementById("yourGold").style.top = "120px";
	document.getElementById("yourGold").style.left = "700px";
	document.getElementById("yourUnit").style.top = "220px";
	document.getElementById("yourUnit").style.left = "710px";
	document.getElementById("yourUnitList").style.top = "450px";
	document.getElementById("yourUnitList").style.left= "0px";
	counter=setInterval(timer, 1000);
	reset();
	
	socket.on('SetPlayerOneUnitList', function(message)
	{
		player_1.unit_list = JSON.parse(message).unit_list;
		console.log(player_1.unit_list);
	});
	
	socket.on('SetPlayerTwoUnitList', function(message)
	{
		player_2.unit_list = JSON.parse(message).unit_list;
		console.log(player_2.unit_list);
	});
	
	socket.on('SetPlayerThreeUnitList', function(message)
	{
		player_3.unit_list = JSON.parse(message).unit_list;
	});
	
	socket.on('SetPlayerFourUnitList', function(message)
	{
		player_4.unit_list = JSON.parse(message).unit_list;
	});
	
	socket.on('moveToPhase3', function()
	{
		Crafty.scene('Phase 3');
	});
});

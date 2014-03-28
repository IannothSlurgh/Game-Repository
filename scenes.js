var mazeData;
var player_number = 0;
var is_two_player_game = false;
var enemy_list = new Array();
var money_list = new Array();
var socket;
var player;

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
		col = 25;
		row = 27;
		break;
	case 3:
		col = 27;
		row = 27;
		break;
	}
	
	var player_text = Crafty.e("2D, DOM, Text")
		.attr({x: col * 16 - 8, y: row * 16 - 15, w: 75})
		.text("Player");
		
	player = Crafty.e('PlayerCharacter').at(col, row).attach(player_text);
}

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
	
	enemy_list.push(Crafty.e('EnemyPlayer').attr({index: index}).at(col, row));
}

//the help screen
var whichHelpScreen = 0;
Crafty.scene('Help', function() {
		/*Crafty.stage.elem.style.display = "none";
		document.getElementById("helpAndShop").style.display = "block";
		//nextHelpScreen();
		document.getElementById("helpText1").style.display = "block";
		document.getElementById("helpText2").style.display = "block";
		document.getElementById("helpText3").style.display = "block";
		document.getElementById("nextHelp").style.display = "block";
		document.getElementById("back").style.display = "block";
		document.getElementById("finish").style.display = "block";
		document.getElementById("returnHome").style.display = "block";*/
});

/*function nextHelpScreen() {
	whichHelpScreen++;
	switch(whichHelpScreen) {
	case 1:
		document.getElementById("helpText2").style.display = "none";
		document.getElementById("helpText3").style.display = "none";
		document.getElementById("back").style.display = "none";
		document.getElementById("finish").style.display = "none";
		document.getElementById("returnHome").style.display = "block";
		document.getElementById("returnHome").style.top = "576px"; 
		document.getElementById("returnHome").style.left = "0px"; 
		document.getElementById("nextHelp").style.display = "block";
		document.getElementById("nextHelp").style.top = "576px";
		document.getElementById("nextHelp").style.left = "761px";
		document.getElementById("helpText1").style.display = "block";
		document.getElementById("helpText1").style.top = "0px";
		document.getElementById("helpText1").style.bottom = "624px";
		document.getElementById("helpText1").style.right = "880px";
		document.getElementById("helpText1").style.left = "0px";
		break;
	case 2:
		document.getElementById("helpText1").style.display = "none";
		document.getElementById("helpText3").style.display = "none";
		document.getElementById("returnHome").style.display = "none";
		document.getElementById("finish").style.display = "none";
		document.getElementById("back").style.display = "block";
		document.getElementById("back").style.top = "576px"; 
		document.getElementById("back").style.left = "0px"; 
		document.getElementById("nextHelp").style.display = "block";
		document.getElementById("nextHelp").style.top = "576px";
		document.getElementById("nextHelp").style.left = "761px";
		document.getElementById("helpText2").style.display = "block";
		document.getElementById("helpText2").style.top = "0px";
		document.getElementById("helpText2").style.bottom = "624px";
		document.getElementById("helpText2").style.right = "880px";
		document.getElementById("helpText2").style.left = "0px";
		break;
	case 3:
		document.getElementById("helpText1").style.display = "none";
		document.getElementById("helpText2").style.display = "none";
		document.getElementById("nextHelp").style.display = "none";
		document.getElementById("returnHome").style.display = "none";
		document.getElementById("back").style.display = "block";
		document.getElementById("back").style.top = "576px"; 
		document.getElementById("back").style.left = "0px"; 
		document.getElementById("finish").style.display = "block";
		document.getElementById("finish").style.top = "576px";
		document.getElementById("finish").style.left = "761px";
		document.getElementById("helpText3").style.display = "block";
		document.getElementById("helpText3").style.top = "0px";
		document.getElementById("helpText3").style.bottom = "624px";
		document.getElementById("helpText3").style.right = "880px";
		document.getElementById("helpText3").style.left = "0px";
		break;
	}
}
function previousHelpScreen() {
	whichHelpScreen--;
	nextHelpScreen();
}
function returnFromHelpScreen() {
	whichHelpScreen = 0;
	document.getElementById("helpAndShop").style.display = "none";
	document.getElementById("helpText1").style.display = "none";
	document.getElementById("helpText2").style.display = "none";
	document.getElementById("helpText3").style.display = "none";
	document.getElementById("nextHelp").style.display = "none";
	document.getElementById("back").style.display = "none";
	document.getElementById("finish").style.display = "none";
	document.getElementById("returnHome").style.display = "none";
	Crafty.scene('StartScreen');
}*/

Crafty.scene('Game', function(){
	//2D array to keep track of all occupied tiles
	this.occupied = new Array(Game.map_grid.width);
	for(var i = 0; i < Game.map_grid.width; i++){
		this.occupied[i] = new Array(Game.map_grid.height);
		for(var y = 0; y < Game.map_grid.height; y++){
			this.occupied[i][y] = false;
		}
	}
	
	for(var x = 26; x < 31; x++)
	{
		for(var y = 18; y < 23; y++)
		{
			mazeData[x][y] = '.';
			this.occupied[x][y] = true;
		}
	}
	
	//draw grid on screen
	var money_counter = 0;
	for(var x = 0; x < Game.map_grid.width; x++){
		for(var y = 0; y < Game.map_grid.height; y++){
			if(mazeData[x][y] != '.'){
				if(mazeData[x][y] == '$'){
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
	
	place_enemy_player(1);
	
	if(!is_two_player_game)
	{
		place_enemy_player(2);
		place_enemy_player(3);
	}
	
	Crafty.bind('PlayerMoved', function(){
		var player_info = { "index" : 1, "x" : player.x, "y": player.y };
		socket.emit('PlayerMovement', JSON.stringify(player_info));
	});
	
	socket.on('updateEnemyPlayer', function(message){
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
	
	socket.on('destroyMoney', function(message){
		var money_index = message.collected_money_index;
		money_list[money_index].x = message.x;
		money_list[money_index].y = message.y;
	});
	
	//Place money around grid
	
	
	Crafty.e("2D, DOM, Text")
		.attr({x: 0, y: 0, w: 75})
		.text("Score: 0")
		.bind('ChangeScore', function(player){
			//receive signal from server
			this.text('Score: ' + player.score);
		});
	
	setTimeout (function(){
		Crafty.trigger('ChangeTimer');
	}, 1000);
	
	var time_left = 45;
	
	//disply incorrect if over a minute
	Crafty.e("2D, DOM, Text")
		.attr({x: 100, y: 0, w: 100})
		.text("Time = " + Math.floor(time_left/60) + ":"+(time_left%60))
		.bind('ChangeTimer', function(){
			time_left -= 1;
			
			if(time_left >= 0)
			{
				setTimeout (function(){
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
	
	this.add_money = this.bind('MoneyCollected', function(money){
		var exit = false;
		console.log(money);
		
		while(!exit){
			var x = Math.floor(Math.random() * Game.map_grid.width);
			var y = Math.floor(Math.random() * Game.map_grid.height);
		
			if(!this.occupied[x][y]){
				this.occupied[x][y] = true;
				money.at(x, y);
				socket.emit('CollectMoney', JSON.stringify({ collected_money_index : money.index, y : money.y, x : money.x}));
			 	exit = true;
			}
		}
	});
	
}, function(){
	this.unbind('MoneyCollected', this.add_money);
});

Crafty.scene('StartScreen', function(){
	
	console.log('This is working.');
	Crafty.e('2D, Canvas, Image')
		.attr({x: 0, y: 0})
		.image("https://raw.githubusercontent.com/IannothSlurgh/Game-Repository/master/start_background.png");
	console.log('This is working.');
	Crafty.e('MineCart')
		.attr({x: -100, y: 262, w: 100, h: 50});
		
	Crafty.e('2D, Canvas, Color')
		.attr({x: 352, y: 40, w: 176, h: 76})
		.color('rgb(123, 104, 238)');
	
	Crafty.e('2PlayerButton')
		.attr({x: 352, y: 196, w: 176, h: 76});
		
	Crafty.e('4PlayerButton')
		.attr({x: 352, y: 352, w: 176, h: 76});
		
	Crafty.e('HelpButton')
		.attr({x: 352, y: 508, w: 176, h: 76});
		
	
});

Crafty.scene('ConnectionRoom', function(){
	 $(document).ready(function() {
	
    // Hide the warning section and show the login section.
    $('#warning').css('display', 'none');
    $('#login_section').css('display', 'block');

    // Initialize socket.io.
    // document.location.host returns the host of the current page.
    socket = io.connect('http://' + document.location.host);
	$('#start_button').click(function(){
		document.getElementById("board").style.display = "none";
		document.getElementById("loggedin").style.display = "none";
		document.getElementById("msg").style.display = "none";
		document.getElementById("send").style.display = "none";
		document.getElementById("start_button").style.display = "none";
		Crafty.scene('Game');
	 });
    // If a welcome message is received, it means the chat room is available.
    // The Log In button will be then enabled.
    socket.on(
      'msg',
      function(message) {
        $('#status').text(message);
        $('#login').attr('disabled', false);
      });
	  
	socket.on(
		'mazeDataMsg',
		function(message){
			mazeData = JSON.parse(message).mazeArray;
		});
	
    // If a login_ok message is received, proceed to the chat section.
    socket.on(
      'login_ok',
      function() {
        $('#login_section').css('display', 'none');
        $('#chat_section').css('display', 'block');
        $('#status').text('Logged In.');
      });

    // If a login_failed message is received, stay in the login section but
    // display an error message.
    socket.on(
      'login_failed',
      function() {
        $('#status').text('Failed to log in!');
      });

    // If a chat message is received, display it.
    socket.on(
      'chat',
      function(message) {
		var obj = JSON.parse(message);
        if (obj && obj.user_name && obj.msg) {
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

	socket.on(
	  'userlist',
	  function(message){
		var obj = JSON.parse(message);
		var user_name = obj.user_name;
	    var div = $('<div></div>');
          div.append($('<span></span>').addClass('user_name').text(user_name));
          $('#loggedin').append(div);
	});
	
    // If a notification is received, display it.
    socket.on(
      'notification',
      function(message) {
        if (message) {
          // Similar to the handler of 'chat' event ...
          var div = $('<div></div>');
          div.append($('<span></span>').addClass('notification').text(message));
          $('#board').append(div);
        }
      });

    // When the Log In button is clicked, the provided function will be called,
    // which sends a login message to the server.
    $('#login').click(function() {
      var name = $('#name').val();
      if (name) {
        name = name.trim();
        if (name.length > 0) {
          socket.emit('login', { user_name: name });
		  socket.emit('userlist', { user_name: name});
        }
      }
      // Clear the input field.
      $('#name').val('');
    });

    // When Enter is pressed in the name field, it should be treated as clicking
    // on the Log In button.
    $('#name').keyup(function(event) {
      if (event.keyCode == 13) {
        $('#login').click();
      }
    });

    // When the Log In button is clicked, the provided function will be called,
    // which sends a chat message to the server.
    $('#send').click(function() {
      var data = $('#msg').val();
      if (data) {
        data = data.trim();
        if (data.length > 0) {
          socket.emit('chat', { msg: data });
        }
      }
      // Clear the input field.
      $('#msg').val('');
    });

    // When Enter is pressed in the message field, it should be treated as
    // clicking on the Send button.
    $('#msg').keyup(function(event) {
      if (event.keyCode == 13) {
        $('#send').click();
      }
    });
  });
});

Crafty.scene('Phase 2', function(){
	Crafty.stage.elem.style.display = "none";
	document.getElementById("helpAndShop").style.display = "block";
	document.getElementById("command").style.display = "block";
	document.getElementById("yourGold").style.display = "block";
	document.getElementById("yourUnit").style.display = "block";
	document.getElementById("yourTimer").style.display = "block";
	document.getElementById("scrollbar").style.display = "block";
	document.getElementById("yourUnitList").style.display = "block";
	document.getElementById("ready").style.display = "block";
	document.getElementById("reset").style.display = "block";
	document.getElementById("helpAndShop").style.top = "0px";
	document.getElementById("helpAndShop").style.left = "0px";
	document.getElementById("yourTimer").style.top = "20px";
	document.getElementById("yourTimer").style.left = "560px";
	document.getElementById("yourGold").style.top = "120px";
	document.getElementById("yourGold").style.left = "700px";
	document.getElementById("yourUnit").style.top = "220px";
	document.getElementById("yourUnit").style.left = "710px";
	document.getElementById("yourUnitList").style.top = "450px";
	document.getElementById("yourUnitList").style.left= "0px";
	counter=setInterval(timer, 1000);
	reset();
});

Crafty.scene('Phase 3', function(){
	document.getElementById("helpAndShop").style.display = "none";
	document.getElementById("command").style.display = "none";
	document.getElementById("yourGold").style.display = "none";
	document.getElementById("yourUnit").style.display = "none";
	document.getElementById("yourTimer").style.display = "none";
	document.getElementById("scrollbar").style.display = "none";
	document.getElementById("yourUnitList").style.display = "none";
	document.getElementById("ready").style.display = "none";
	document.getElementById("reset").style.display = "none";
	
	//-----------------------------------------------------
	
	document.getElementById("stat_hp").style.display = "block";
	document.getElementById("stat_damage").style.display = "block";
	document.getElementById("stat_movement").style.display = "block";
	document.getElementById("stat_range").style.display = "block";
	document.getElementById("stat_ability").style.display = "block";
	document.getElementById("stat_log").style.display = "block";
	document.getElementById("stat_icon").style.display = "block";
	document.getElementById("grid").style.display = "block";
	document.getElementById("next").style.display = "block";
	document.getElementById("stat_player_turn class").style.display = "block";
	
	for(var i = 0; i<14; ++i)
	{
		for(var j = 0; j<14; ++j)
		{
			addTile(i,j);
		}
	}

	//place(0,0,"Annoth",0);
});

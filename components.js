//Grid component allows an element to be Located
Crafty.c('Grid', {
	init: function() {
		this.attr({
			w: Game.map_grid.tile.width,
			h: Game.map_grid.tile.height
		});
	},
	
	//Locate this entity at the given position on grid
	at: function(x, y){
		if(x === undefined && y === undefined){
			return {x: this.x/Game.map_grid.tile.width,
				y: this.y/Game.map_grid.tile.height};
		}
		else{
			this.attr({x: x * Game.map_grid.tile.width, 
				y: y * Game.map_grid.tile.height});
			return this;
		}
	}
});

//entity that is drawn in 2D on canvas via Grid
Crafty.c('Actor', {
	init: function() {
		this.requires('2D, Canvas, Grid');
	},
});

//Tree is an Actor with a certain color
Crafty.c('Wall', {
	init: function() {
		this.requires('Actor, Color, Solid')
			.color('rgb(139, 115, 85)');
	},
});

Crafty.c('EnemyPlayer', {
	init: function() {
		this.attr({
			index: undefined
		});
		
		this.requires('Actor, Color')
			.color('rgb(204, 0, 0)');
	},
});

Crafty.c('Path', {
	init: function(){
		this.requires('Actor, Color')
			.color('rgb(205, 170, 125)');
	},
});



Crafty.c('PlayerCharacter', {
	init: function(){
		this.attr({
			score: 0,
			index: player_number
		});
		
		this.requires('Actor, Fourway, Color, Collision')
			.fourway(4)
			.color('rgb(20, 75, 40)')
			.stopOnSolids()
			.onHit('Money', this.collectMoney)
			.bind('Move', function(){
				//send new x, y coordinates to server
				Crafty.trigger('PlayerMoved');
			});
	},
	
	//registers a stop-movement when entity hits an entity
	//with the "Solid" component
	stopOnSolids: function() {
		this.onHit('Solid', this.stopMovement);
		return this;
	},
	
	//stops movement
	stopMovement: function(){
		this._speed = 0;
		if(this._movement){
			this.x -= this._movement.x;
			this.y -= this._movement.y;
		}
	},
	
	collectMoney: function(data){
		var money = data[0].obj;
		this.score += money.value;
		
		//send signal to the server indicating that money has been collected
		Crafty.trigger('MoneyCollected', money);
		Crafty.trigger('ChangeScore', this);
	}
});

Crafty.c('Money', {
	init: function(){
		this.attr({
			array_index : -1,
			value: 50
		});
		this.requires('Actor, Color')
			.color('rgb(255, 215, 0)');
	}
});

Crafty.c('2PlayerButton', {
	init: function(){
		this.requires('2D, Canvas, Image, Mouse')
		.image("http://i.imgur.com/v7ODQeq.png")
		.bind('MouseOver', function(e){
			this.image("http://i.imgur.com/brO6x5C.png");
		})
		.bind('MouseOut', function(e){
			this.image("http://i.imgur.com/v7ODQeq.png");
		})
		.bind('Click', function(e){
			is_two_player_game = true;
			Crafty.scene('ConnectionRoom');
		});
	}
	
});

Crafty.c('4PlayerButton', {
	init: function(){
		this.requires('2D, Canvas, Image, Mouse')
		.image("http://i.imgur.com/bH9mClg.png")
		.bind('MouseOver', function(e){
			this.image("http://i.imgur.com/DUkyEO7.png")
		})
		.bind('MouseOut', function(e){
			this.image("http://i.imgur.com/bH9mClg.png");
		})
		.bind('Click', function(e){
			is_two_player_game = false;
			Crafty.scene('ConnectionRoom');
		});
	}
	
});

Crafty.c('HelpButton', {
	init: function(){
		this.requires('2D, Canvas, Image, Mouse')
		.image("http://i.imgur.com/paoEBwZ.png")
		.bind('MouseOver', function(e){
			this.image("http://i.imgur.com/lxZmpCM.png")
		})
		.bind('MouseOut', function(e){
			this.image("http://i.imgur.com/paoEBwZ.png");
		})
		.bind('Click', function(e){
			Crafty.scene('Help');
		});
	}
	
});

Crafty.c('MineCart', {
	init: function(){
		this.requires('2D, Canvas, Image, Tween')
			.image("http://i.imgur.com/K00JnU4.png")
			.tween({x: 880}, 5000)
			.bind('TweenEnd', function(){
				
				var track_num = Math.floor(Math.random() * 3);
				var direction = Math.round(Math.random());
				console.log(track_num);
				switch(track_num)
				{
				case 0:
					this.y = 201; 
					this.x = -100;
					this.tween({x: 880}, 5000);
					break;
				case 1: 
					this.y = 357; 
					this.x = 880;
					this.tween({x: 0 - 126}, 5000);
					break;
				case 2: 
					this.y = 513; 
					this.x = -100;
					this.tween({x: 880}, 5000);
					break;
				}
			});
	}
});

Crafty.c('StartButton', {
	init: function(){
		this.requires('2D, Canvas, Color, Mouse')
		.color('rgb(0, 255, 255)')
		.bind('MouseOver', function(e){
			this.color('rgb(64, 224, 208)')
		})
		.bind('MouseOut', function(e){
			this.color('rgb(0, 255, 255)');
		})
		.bind('Click', function(e){
			//To Be Implemented
		});
	}
	
});

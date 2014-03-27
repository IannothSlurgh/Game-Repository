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
			.color('rgb(20, 185, 40)');
	},
});

Crafty.c('EnemyPlayer', {
	init: function() {
		this.attr({
			index: undefined
		});
		
		this.requires('Actor, Color')
			.color('rgb(223, 0, 255)');
	},
});

Crafty.c('Path', {
	init: function(){
		this.requires('Actor, Color')
			.color('rgb(249, 223, 125)');
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
		money = data[0].obj;
		this.score += money.value;
		
		//send signal to the server indicating that money has been collected
		Crafty.trigger('MoneyCollected', this, money);
		Crafty.trigger('ChangeScore', this);
	}
});

Crafty.c('Money', {
	init: function(){
		this.attr({
			array_index = -1;
			value: 10
		});
		this.requires('Actor, Color')
			.color('rgb(170, 125, 40)');
	},
	
	collect: function(){
		this.destroy();
	}
});

Crafty.c('2PlayerButton', {
	init: function(){
		this.requires('2D, Canvas, Color, Mouse')
		.color('rgb(255, 51, 51)')
		.bind('MouseOver', function(e){
			this.color('rgb(178, 34, 34)');
		})
		.bind('MouseOut', function(e){
			this.color('rgb(255, 51, 51)');
		})
		.bind('Click', function(e){
			is_two_player_game = true;
			Crafty.scene('ConnectionRoom');
		});
	}
	
});

Crafty.c('4PlayerButton', {
	init: function(){
		this.requires('2D, Canvas, Color, Mouse')
		.color('rgb(255, 255, 0)')
		.bind('MouseOver', function(e){
			this.color('rgb(255, 215, 0)')
		})
		.bind('MouseOut', function(e){
			this.color('rgb(255, 255, 0)');
		})
		.bind('Click', function(e){
			is_two_player_game = false;
			Crafty.scene('ConnectionRoom');
		});
	}
	
});

Crafty.c('HelpButton', {
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
			Crafty.scene('help');
		});
	}
	
});

Crafty.c('MineCart', {
	init: function(){
		this.requires('2D, Canvas, Color, Tween')
			.color('rgb(255, 128, 0)')
			.tween({x: 880}, 10000)
			.bind('TweenEnd', function(){
				
				var track_num = Math.floor(Math.random() * 3);
				var direction = Math.round(Math.random());
				console.log(track_num);
				switch(track_num)
				{
				case 0:
					this.y = 262; 
					this.x = -100;
					this.tween({x: 880}, 10000);
					break;
				case 1: 
					this.y = 418; 
					this.x = 880;
					this.tween({x: 0 - this.w}, 10000);
					break;
				case 2: 
					this.y = 574; 
					this.x = -100;
					this.tween({x: 880}, 10000);
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

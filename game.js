Game = {
//
	//This defines our grid's size and the size of each of its tiles
	map_grid: {
		width : 55,
		height : 39,
		tile: {
			width: 16,
			height: 16
		}
	},
	
	//Total width of the game screen.
	width: function() {
		return this.map_grid.width * this.map_grid.tile.width;
	},
	
	//Total height of the game screen
	height: function() {
		return this.map_grid.height * this.map_grid.tile.height;
	},
	
	// Initialize and start our game
	start: function() {
		
		Crafty.init(Game.width(), Game.height());
		//Crafty.background('rgb(100, 100, 100)');
		
		Crafty.scene('StartScreen');
	}
};

window.addEventListener('load', Game.start);
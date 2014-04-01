Instructions to run the game "Miner's Quarrel":
  1. Download the Zip file
  2. Enter the directory of the zip file using "cd Function-Prototype-1"
  3. Run "make"
  4. On your favorite web browser, visit compute.cse.tamu.edu:16384
  5. Enjoy

Files included:

Images:
- 2_player_selected.png
- 2_player_unselected.png
- 4_player_selected.png
- 4_player_unselected.png
- Back.gif
- Background.gif
- Finish.gif
- Goblin.gif
- Hunter.gif
- NextHelp.gif
- Ready.gif
- Reset.gif
- Return.gif
- Rogue.gif
- Warrior.gif
- fakeShop.gif
- goblin-icon.png
- grid.gif
- helpText1.gif
- helpText2.gif
- helpText3.gif
- help_button_selected.png
- help_button_unselected.png
- new_creepy_cart.png
- next.gif
- selection.png
- start_background.png
- symbols.gif
- team_color_blue.png
- test.gif
- test.png
- test2.gif
- test2.png
- title_img.png

Code:
- components.js
  - Includes the creation of the titlescreen, linking the buttons on the title screen to the separate scenes, 
    and creation of the images for the walls and players of phase one(the maze phase).
  - Implements the collection of money on phase one(maze) and movement of players.

- crafty.js
  - This is the graphics library that we are using to implement the majority of our game. For more information, 
    please visit http://craftyjs.com/

- game.js
  - Ask Steven later
- ian_code.js
  - 
- index.html
- phase_two.js

- scenes.js
  - Implements the placing of players and their opponents on phase one(maze) of the game. Contains the help
    screens and the maze generation.
  - Includes the money placement of the maze, where it randomly places money pieces down.
  - Has a timer that counts down for the maze portion of the game. Continues to the next scene.
  - Handles the scenes for every file.

- server.js
  - Includes the maze algorithm on the server side. This way the same maze is exported to each client.
  - Initializes server and runs on port 16384 of compute.cse.tamu.edu.
  - Initializes the player objects to be manipulated by the server.
  - Includes the connecting of separate players together in order for them to play.
  - Chat and login implementation with influence and help from Yin Qu. His implementation can be found 
    here: https://github.com/quyin/WebSocketChat
  - Creates a userlist of all players that log in. This is used for manipulation of each user and 
    assigning of ready values and turn order throughout the game
  - Sorts the scores that are made within the game for declaration of turn order.
  - Includes a switch case that handles different types of message. Also includes a translateMessage
    function that allows for generic sending of messages from the client to the server, and back.
  - Has some functionality of Ian's code(phase 3) that needed to be on the server to be more secure.
  - Implements what happens when someone disconnects from the server.

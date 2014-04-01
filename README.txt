Instructions to run the game "Miner's Quarrel":
  1. Download the Zip file
  2. Enter the directory of the zip file using "cd Functional-Prototype-1"
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
  - Stores the tiles for the grid in phase I

- ian_code.js
  - Contains global variables which are set in phase II (and used throughout phase III).
  - Reveals several pre-created html elements, creates a bunch of tiles that when clicked send events to the
	  server (handled in server.js).
  - Handles server responses to events (known as confirmations) and server notifications (which are sent to
	  clients informing them about the activities of other clients)
  - Uses DOM to alter text elements, alter the image source of the unit that is selected, etc.
  - Alters its own gamestate (which can potentially be different from the server gamestate) by changing unit
	  health values.

- index.html 
  - This is the file that server.js calls and can be viewed with the "f12" key once the webpage has opened. 
    In this webpage, there is various information about the different parts of the game, including the help 
    menu, start menu, and all 3 of the phases of the game (maze, store, battlefield). The first part of this
    document contains the html code that sets up phase 3 visually and is followed by the log-in graphics 
    provided by Yin Qu. The file then adds all the scripts that will be implemented by the webpage which 
    includes all of the javscript files needed to implement the game along with various image files. After 
    that the html discribes the body of page itself and sets up the various screens to be used such as the 
    help screen, the third phase, and the second phase (in that order).

- phase_two.js
  - This file contains the code associated with phase 2 of the game (the store). These actions are called 
    whenever a button is pressed, whether it be a unit or the reset/ready button pressed. Each button has
    it's own function associated with it and is defined clearly as selected<NameOfUnit>() or reset()/ready(). 
    In addition to these functions there is also a timer being used that counts down from 60 to 0 seconds and
    is called every second of real time.

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

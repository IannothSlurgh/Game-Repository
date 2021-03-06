//phase_two.js
//code written by Jason Sitzman
//all illustrations in phase 2 of the game produced by Jason Sitzman

var money; //int
var units=new Array(); //array of strings
var unitCount = 0; //int
var ready = false; //bool

//prints a list of the client's current units purchased
function printUnitList() {
	var theString = "";
	var i = 0;
	
	//make a string of all units purchased
	while(i < units.length - 1) {
		theString = theString + units[i] + ", ";
		i++;
	}
	if(units.length > 0) {
		theString = theString + units[i]
	}

	//update client page
	document.getElementById("theUnits").innerHTML=theString;
}

//updates the current resources for the client
function updateResources() {
	document.getElementById("money").innerHTML=money + "/" + player.score;
	document.getElementById("counter").innerHTML=unitCount + "/8";
}

//add a warrior to the unit list
function selectWarrior()
{
	if(unitCount < 8 && money >= 400 && !ready) {
		units[unitCount] = "warrior";
		unitCount++;
		money = money - 400;
		updateResources();
		printUnitList();
	}
}

//add a hunter to the unit list
function selectHunter()
{
	if(unitCount < 8 && money >= 300 && !ready) {
		units[unitCount] = "hunter";
		unitCount++;
		money = money - 300;
		updateResources();
		printUnitList();
	}
}

//add a priest to the unit list
function selectPriest()
{
	if(unitCount < 8 && money >= 250 && !ready) {
		units[unitCount] = "priest";
		unitCount++;
		money = money - 250;
		updateResources();
		printUnitList();
	}
}

//add a rogue to the unit list
function selectRogue()
{
	if(unitCount < 8 && money >= 200 && !ready) {
		units[unitCount] = "rogue";
		unitCount++;
		money = money - 200;
		updateResources();
		printUnitList();
	}
}

//add a goblin to the unit list
function selectGoblin()
{
	if(unitCount < 8 && money >= 100 && !ready) {
		units[unitCount] = "goblin";
		unitCount++;
		money = money - 100;
		updateResources();
		printUnitList();
	}
}

//add a plant to the unit list
function selectPlant()
{
	if(unitCount < 8 && money >= 50 && !ready) {
		units[unitCount] = "plant";
		unitCount++;
		money = money - 50;
		updateResources();
		printUnitList();
	}
}

//reset the resources of the client and clear the unit list
function reset()
{
	if(!ready) {
		money = player.score;
		units.length = 0;
		unitCount = 0;
		updateResources();
		printUnitList();
	}
}

//indicates that the client is ready to proceed to phase 3
function ready_method()
{
	if(!ready)
	{
		ready = true;
		clearInterval(counter);
		if(unitCount == 0) {
			units[unitCount] = "goblin";
			unitCount++;
		}
		socket.emit('SetStatusReady', JSON.stringify({user_name: user_str, player_units: units, player_score : player.score}));
	}
}

//timer function (1 tick per second)
var count = 60;
var counter; //runs timer() every second
function timer()
{
	count = count - 1;
	document.getElementById("timer").innerHTML=count + " sec";
	if (count <= 0) {
		ready_method();
	}
}

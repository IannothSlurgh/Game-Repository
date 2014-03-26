var money=2000; //dummy value
var units=new Array();
var unitCount = 0;
function printUnitList() {
 var theString = "";
 var i = 0;
 while(i < units.length - 1) {
  theString = theString + units[i] + ", ";
  i++;
 }
 if(units.length > 0) {
 theString = theString + units[i]
 }
 document.getElementById("theUnits").innerHTML=theString;
}

function updateResources() {
 document.getElementById("money").innerHTML=money + "/2000";
 document.getElementById("counter").innerHTML=unitCount + "/8";
}

function selectWarrior()
{
 if(unitCount < 8 && money >= 400) {
  units[unitCount] = "warrior";
  unitCount++;
  money = money - 400;
  updateResources();
  printUnitList();
 }
}

function selectHunter()
{
 if(unitCount < 8 && money >= 300) {
  units[unitCount] = "hunter";
  unitCount++;
  money = money - 300;
  updateResources();
  printUnitList();
 }
}

function selectRogue()
{
 if(unitCount < 8 && money >= 200) {
  units[unitCount] = "rogue";
  unitCount++;
  money = money - 200;
  updateResources();
  printUnitList();
 }
}

function selectGoblin()
{
 if(unitCount < 8 && money >= 100) {
  units[unitCount] = "goblin";
  unitCount++;
  money = money - 100;
  updateResources();
  printUnitList();
 }
} 

function reset()
{
 money = 2000; //dummy value
 units.length = 0;
 unitCount = 0;
 updateResources();
 printUnitList();
}
function ready()
{
	clearInterval(counter);
	Crafty.scene('Phase 3');
}

var count=120;
var counter;//runs timer() every second

function timer()
{
 document.getElementById("timer").innerHTML=count + " secs";
 count=count-1;
 console.log("Timer is running...");
 if (count < 0)
 {
	ready();
	

 }
}
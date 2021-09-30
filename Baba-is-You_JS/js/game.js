// GAME.JS - BABA IS Y'ALL LEVEL PLAYER
// VERSION 1.0b
// Code by Milk

/* global map_key */
/* global demoLevels */
/* global imgHash */
/* global oppDir */


// parameters and properties for the level/game 
let game_parameters = {};
game_parameters['orig_map'] = []
game_parameters['obj_map'] = []
game_parameters['back_map'] = []
game_parameters['words'] = [];
game_parameters['phys'] = [];
game_parameters['is_connectors'] = [];
game_parameters['sort_phys'] = {};
game_parameters['rules'] = [];
game_parameters['rule_objs'] = [];
game_parameters['players'] = [];
game_parameters['auto_movers'] = [];
game_parameters['winnables'] = [];
game_parameters['pushables'] = [];
game_parameters['killers'] = [];
game_parameters['sinkers'] = [];
game_parameters['featured'] = {};
game_parameters['overlaps'] = [];
game_parameters['unoverlaps'] = [];



//set up the canvas
var canvas = document.getElementById("gameWindow");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 640;

//map features
var size = 32;
var mapWidth = 12;
var mapHeight = 12;
var offX = 0;
var offY = 0;

var orig_map = [];
var back_map = [];
var obj_map = [];
var mapAllReady = false;
var curLevel = 0;
var demo = false;

//sprites

//KEYS
// directionals
var upKey = 38;     //[Up]
var leftKey = 37;   //[Left]
var rightKey = 39;  //[Rigt]
var downKey = 40;   //[Down]
var space_key = 32; //[SPACE]
var moveKeySet = [upKey, leftKey, rightKey, downKey, space_key];

// R and Z
var z_key = 90;   //[Z]
var r_key = 82;   //[R]
//var n_key = 78;	  //[N]
var actionKeySet = [z_key, r_key, space_key];

var keys = [];
var moved = false;
var acted = false;
var movedObjs = [];


var moveSteps = [];
var initRules = [];
var endRules = [];
 
// event screens
var winscreen = new Image();
winscreen.src = "img/win_screen.png";
var ws_ready = false;
winscreen.onload = function(){ws_ready = true;}

var winscreen2 = new Image();
winscreen2.src = "img/win_screen2.png";
var ws2_ready = false;
winscreen2.onload = function(){ws2_ready = true;}

var kekeScreen = new Image();
kekeScreen.src = "img/solver_screen.png";
var ks_ready = false;
kekeScreen.onload = function(){ks_ready = true;}

var unsolvablescreen = new Image();
unsolvablescreen.src = "img/unsolvable.png";
var us_ready = false;
unsolvablescreen.onload = function(){us_ready = true;}

var controlScreen = new Image();
controlScreen.src = "img/control_screen.png";
var cs_ready = false;
controlScreen.onload = function(){cs_ready = true;}


var wonGame = false;
var saveLevel = false;
var show_controls = false;
var demoGame = false;

var aiControl = false;
var curPath = [];
var pathIndex = 0;
var solving = false;
var unsolvable = false;


//////////////////    GENERIC FUNCTIONS   ///////////////


//checks if an element is in an array
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}


////////////////   KEYBOARD FUNCTIONS  //////////////////


// key events
var keyTick = 0;
var kt = null; 
var rt = null;

// IF MOVE OR ACTION KEY PRESSED
function anyKey(){
	return anyMoveKey() || anyActionKey();
}

// CHECK IF ANY DIRECTIONAL KEY IS HELD DOWN
function anyMoveKey(){
	return (keys[upKey] || keys[downKey] || keys[leftKey] || keys[rightKey] || keys[space_key])
}

// CHECK IF SPECIAL ACTION KEY IS HELD DOWN
function anyActionKey(){
	return (keys[z_key] || keys[r_key] || keys[space_key]);
}

// UPDATE THE GAME STATE WITH ACTION KEY PRESS [UNDO, IDLE, RESET]
function stateChange(){
	if(!acted && anyActionKey()){
		//reset the level
		if(keys[r_key]){
			if(demo)
				newLevel(curLevel);
			else
				initEditTest();
		}
		//iterate to the next level
		else if(keys[space_key] && wonGame && demo){
			curLevel++;
			if(curLevel < demoLevels.length)
				newLevel(curLevel);
		}
		//undo a move
		else if(keys[z_key] && !aiControl){
			undoMove();
		}
		acted = true;

		//render();
	}
}

// MOVES PLAYER(S) BASED ON USER KEY INPUT
function key_input(){
	if(!moved && (anyMoveKey())){
		var moved_objects = [];

		let beforeState = doubleMap2Str(game_parameters['obj_map'],game_parameters['back_map']);

		if(keys[upKey])
			movePlayers("up", moved_objects, game_parameters);
		else if(keys[downKey])
			movePlayers("down", moved_objects, game_parameters);
		else if(keys[leftKey])
			movePlayers("left", moved_objects, game_parameters);
		else if(keys[rightKey])
			movePlayers("right", moved_objects, game_parameters);

		moveAutoMovers(moved_objects, game_parameters);

		let afterState = doubleMap2Str(game_parameters['obj_map'],game_parameters['back_map']);

		//save to the movestep set (if map changed)
		if(beforeState != afterState){
			if(keys[upKey])
				moveSteps.push("up");
			else if(keys[downKey])
				moveSteps.push("down");
			else if(keys[leftKey])
				moveSteps.push("left");
			else if(keys[rightKey])
				moveSteps.push("right");
			else if(keys[space_key])
				moveSteps.push("space");
		}

		//update the rule set if this object is a rule
		for(var m=0;m<moved_objects.length;m++){
			if(moved_objects[m].type == "word"){
				interpretRules(game_parameters);
			}
		}

		wonGame = win(game_parameters['players'], game_parameters['winnables']);
		
		//copy final result rules
		if(wonGame){
			drawWin();
			endRules = getCurRules();
			localStorage.setItem("endRules", JSON.stringify(endRules));
		}

		moved = true;
		//render();
	}
}

// UNDO A MOVE UP UNTIL THE LAST POINT
function undoMove(){
	moveSteps.splice(-1,1);
	let newSolution = moveSteps;

	//reset the level
	if(demo)
		newLevel(curLevel);
	else
		initEditTest();

	//setup keke
	wonGame = false;

	//iterate through n-1 previous moves
	for(let s=0;s<newSolution.length;s++){
		nextMove(newSolution[s]);
	}
	//console.log(newSolution);

	moveSteps = newSolution;
}

// GOTO THE NEXT DIRECTIONAL POINT IN THE SOLUTION STEP
function nextMove(nextDir){
	//reset
	var moved_objects = [];
	moved = false;

	//if directional move, move the players
	if(nextDir != "")
		movePlayers(nextDir, moved_objects, game_parameters);

	//move the movers (i.e. X-is-MOVE objects)
	moveAutoMovers(moved_objects, game_parameters);

	//update the rule set if this object is a rule
	for(var m=0;m<moved_objects.length;m++){
		//if(inArr(rule_objs, movedObjs[m]))
		if(moved_objects[m].type == "word"){
			interpretRules(game_parameters);
		}
	}

	//check if the game has been won
	wonGame = win(game_parameters['players'],game_parameters['winnables']);
	if(wonGame){
		drawWin();
		endRules = getCurRules();
		localStorage.setItem("endRules", JSON.stringify(endRules));
	}

	
	pathIndex++;
	moved = true;
}

// MOVES PLAYERS USING KEKE AI
function ai_input(){
	if(pathIndex == curPath.length){
		clearInterval(kt);
		return;
	}else{
		wonGame = false;
	}

	//reset
	var moved_objects = [];
	moved = false;

	let nextDir = curPath[pathIndex];
	if(nextDir != "")
		movePlayers(nextDir, moved_objects, game_parameters);

	moveAutoMovers(moved_objects, game_parameters);

	//update the rule set if this object is a rule
	for(var m=0;m<moved_objects.length;m++){
		//if(inArr(rule_objs, movedObjs[m]))
		if(moved_objects[m].type == "word"){
			interpretRules(game_parameters);
		}
	}


	wonGame = win(game_parameters['players'],game_parameters['winnables']);
	if(wonGame){
		drawWin();
		endRules = getCurRules();
		localStorage.setItem("endRules", JSON.stringify(endRules));
	}

	
	pathIndex++;
	moved = true;
}


// CHECK IF AN OBJECT IS MOVABLE
function canMove(e, dir, om, bm, movedObjs, p, u, phys, sort_phys){	//p=players, u=pushables
	if(movedObjs.indexOf(e) != -1)
		return false;

	//check validity of object
	if(e == " ") //blank spot
		return false;
	if(!e.is_movable)		//cannot move
		return false;

	var o = ' ';

	//determine direction
	if(dir == "up"){
		//check map placement first	
		if(e.y-1 < 0)						//oob
			return false;
		if(bm[e.y-1][e.x] == '_')		//border
			return false;

		o = om[e.y-1][e.x];		//assign adjacent object
	}else if(dir == "down"){
		//check map placement first	
		if(e.y+1 >= bm.length)		//oob
			return false;
		if(bm[e.y+1][e.x] == '_')		//border
			return false;

		o = om[e.y+1][e.x];		//assign adjacent object
	}else if(dir == "left"){
		//check map placement first	
		if(e.x-1 < 0)						//oob
			return false;
		if(bm[e.y][e.x-1] == '_')		//border
			return false;

		o = om[e.y][e.x-1];		//assign adjacent object
	}else if(dir == "right"){
		//check map placement first	
		if(e.x+1 >= bm[0].length)		//oob
			return false;
		if(bm[e.y][e.x+1] == '_')		//border
			return false;

		o = om[e.y][e.x+1];		//assign adjacent object
	}



	//check the adjacent object
	if(o == ' ')		//empty space so movable
		return true;
	if(o.is_stopped)	//immovable object above it
		return false;
	if(o.is_movable){	//move the object next to it
		//console.log(p.indexOf(o) != -1);
		//console.log(p);
		//console.log(o)

		if(o.is_movable && u.indexOf(o) != -1)									//pushables
			return moveObj(o, dir, om, bm, movedObjs, p, u);
		else if(p.indexOf(o) != -1 && p.indexOf(e) == -1)							//player
			return true;
		else if((o.type == "phys" && (u.length == 0 || u.indexOf(o) == -1)))		//movable but not pushable
			return false;
		else if((e.is_movable || o.is_movable) && (e.type == "phys" && o.type == "phys"))	//automover
			return true;
		else if((e.name == o.name) && (p.indexOf(e) != -1) && (isPhys(o) && isPhys(e)))	//same type of entity = merge
			return moveObjMerge(o, dir, om, bm, movedObjs, p, u, phys, sort_phys);
		else{
			return moveObj(o, dir, om, bm, movedObjs, p, u);
		}
		
	}	
		
	if(!o.is_stopped && !o.is_movable)
		return true;

	//when in doubt move
	return true;
}

// RECURSIVE STATEMENT TO ALLOW MOVEMENT
function moveObj(o, dir, om, bm, movedObjs, p, u, phys, sort_phys){
	//move
	if(canMove(o, dir, om, bm, movedObjs, p, u, phys, sort_phys)){
		//update the position
		om[o.y][o.x] = ' ';
		if(dir == "up")
			o.y--;
		else if(dir == "down")
			o.y++;
		else if(dir == "left")
			o.x--;
		else if(dir == "right")
			o.x++;
		om[o.y][o.x] = o;

		movedObjs.push(o);
		o.dir = dir;	//set the direction the object moved in

		return true;
	}
	//blocked
	else{
		return false;
	}
}

// RECURSIVE STATEMENT ALLOWING MOVEMENT FOR OBJECTS OF THE SAME TYPE
function moveObjMerge(o, dir, om, bm, movedObjs, p, u, phys, sort_phys){
	//move
	if(canMove(o, dir, om, bm, movedObjs, p, u, phys, sort_phys)){
		//update the position
		om[o.y][o.x] = ' ';
		if(dir == "up")
			o.y--;
		else if(dir == "down")
			o.y++;
		else if(dir == "left")
			o.x--;
		else if(dir == "right")
			o.x++;
		om[o.y][o.x] = o;

		movedObjs.push(o);
		o.dir = dir;	//set the direction the object moved in

		return true;
	}
	//blocked (so allow the others to take over)
	else{
		om[o.y][o.x] = ' ';
		//sort_phys[o.name].splice(sort_phys[o.name].indexOf(o), 1);
		//phys.splice(o,1);
		return true;
	}
}

// MOVES ALL PLAYER OBJECTS
function movePlayers(dir, mo, parameters){
	let om = parameters['obj_map'];
	let bm = parameters['back_map'];
	let players = parameters['players'];
	let pushs = parameters['pushables'];
	let phys = parameters['phys'];
	let sort_phys = parameters['sort_phys'];
	let killers = parameters['killers'];
	let sinkers = parameters['sinkers'];
	let featured = parameters['featured'];


	for(var p=0;p<players.length;p++){
		var curPlayer = players[p];
		//console.log(curPlayer.name + " (" + curPlayer.x + "," + curPlayer.y + ")");
		moveObj(curPlayer,dir, om, bm, mo, players, pushs, phys, sort_phys);
		//console.log(curPlayer.name + " (" + curPlayer.x + "," + curPlayer.y + ")");
	}

	//check for kill condition
	destroyObjs(killed(players, killers), parameters);
	destroyObjs(drowned(phys, sinkers), parameters);
	destroyObjs(badFeats(featured, sort_phys), parameters);
}

// MOVES ALL NPC (MOVER) OBJECTS
function moveAutoMovers(mo, parameters){
	let automovers = parameters['auto_movers'];
	let om = parameters['obj_map'];
	let bm = parameters['back_map'];
	let players = parameters['players'];
	let pushs = parameters['pushables'];
	let phys = parameters['phys'];
	let sort_phys = parameters['sort_phys'];
	let killers = parameters['killers'];
	let sinkers = parameters['sinkers'];
	let featured = parameters['featured'];

	for(var a=0;a<automovers.length;a++){
		var curAuto = automovers[a];
		var m = moveObj(curAuto, curAuto.dir, om, bm, mo, players, pushs, phys, sort_phys);
		if(!m){
			curAuto.dir = oppDir[curAuto.dir];
		}
	}

	//check for kill condition
	destroyObjs(killed(players, killers), parameters);
	destroyObjs(drowned(phys, sinkers), parameters);
	destroyObjs(badFeats(featured, sort_phys), parameters);
}



//////////////////  RENDER FUNCTIONS  ////////////////////

// DRAWS THE BACKGROUND MAP (NON-INTERACTABLE OBJECTS)
function drawBackMap(){
	let back_map = game_parameters['back_map']

	if(!mapAllReady){
		mapAllReady = mapReady();
		return;
	}

	for(var r=0;r<back_map.length;r++){
		for(var c=0;c<back_map[0].length;c++){
			var charac = back_map[r][c];
			var sprite;
			if(charac.name != undefined)
				sprite = charac.img;
			else
				sprite = imgHash[charac][0];

			ctx.drawImage(sprite, 0, 0, sprite.width, sprite.height,
				c*size+offX, r*size+offY, size, size);
		}
	}
}


// DRAW THE WORD OBJECTS
function drawWords(){
	let words = game_parameters['words'];

	for(var w=0;w<words.length;w++){
		var word = words[w];
		ctx.drawImage(word.img, 0, 0, word.img.width, word.img.height,
			word.x*size+offX, word.y*size+offY, size, size);
	}
}

// DRAW PHYSICAL OBJECTS
function drawPhysicals(){
	let overlaps = game_parameters['overlaps'];
	let unoverlaps = game_parameters['unoverlaps'];

	for(var o=0;o<overlaps.length;o++){
		var phy = overlaps[o];
		ctx.drawImage(phy.img, 0, 0, phy.img.width, phy.img.height,
			phy.x*size+offX, phy.y*size+offY, size, size);
	}
	for(var o=0;o<unoverlaps.length;o++){
		var phy = unoverlaps[o];
		ctx.drawImage(phy.img, 0, 0, phy.img.width, phy.img.height,
			phy.x*size+offX, phy.y*size+offY, size, size);
	}
}

// DRAWS THE "CONGRATULATIONS" WINDOW IF THE LEVEL HAS BEEN WON
function drawWin(){
	if(!ws_ready){
		winscreen.onload = function(){ws_ready = true;}
		return;
	}
	if(!ws2_ready){
		winscreen2.onload = function(){ws2_ready = true;}
		return;
	}
	
	if(demo){
		ctx.drawImage(winscreen2, 0, 0, winscreen2.width, winscreen2.height,
		(canvas.width/2)-(3*size), (canvas.height/2)-(1.5*size),6*size, 3*size)
	}else{
		ctx.drawImage(winscreen, 0, 0, winscreen.width, winscreen.height,
		(canvas.width/2)-(3*size), (canvas.height/2)-(1.5*size),6*size, 3*size)
	}
	
}

// DRAW 'KEKE IS SOLVING' WINDOW IF IN THE MIDDLE OF SOLVING
function drawKekeSolve(){
	if(!ks_ready){
		kekeScreen.onload = function(){ks_ready = true;}
		return;
	}
	ctx.drawImage(kekeScreen, 0, 0, kekeScreen.width, kekeScreen.height,
		(canvas.width/2)-(3*size), (canvas.height/2)-(1.5*size),6*size, 3*size)

	//draw the iteration count overtop of it
	ctx.font = "bold 28px Consolas";
	ctx.fillStyle = "#ffffff";
	ctx.textAlign = "center";
	ctx.fillText("Iter: " + getIterRatio(), (canvas.width/2), (canvas.height/2)+(size*(3.0/4.0)));
}

// DRAW 'UNSOLVABLE' IF THE AI COULD NOT FIND A SOLUTION
function drawUnsolve(){
	if(!us_ready){
		unsolvablescreen.onload = function(){us_ready = true;}
		return;
	}
	ctx.drawImage(unsolvablescreen, 0, 0, unsolvablescreen.width, unsolvablescreen.height,
		(canvas.width/2)-(3*size), (canvas.height/2)-(1.5*size),6*size, 3*size)
}

// DRAW THE CONTROL UI FOR THE game
function drawControls(){
	if(!cs_ready){
		controlScreen.onload = function(){cs_ready=true;}
		return;
	}
	ctx.drawImage(controlScreen, 0, 0, controlScreen.width, controlScreen.height,
		(canvas.width/2)-(4*size), (canvas.height/2)-(2*size),8*size, 4*size)
}


// GAME RENDER FUNCTION
function render(){
	ctx.save();
	//ctx.translate(-camera.x, -camera.y);		//camera
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width, canvas.height);
	
	/*   add draw functions here  */
	drawBackMap();
	drawWords();
	drawPhysicals();

	if(wonGame && !solving) {
		drawWin();
	}

	if(!unsolvable && curPath.length == 0 && localStorage.control == "keke" && !demo)
		drawKekeSolve();
	else if(unsolvable && localStorage.control == "keke")
		drawUnsolve();

	if(show_controls)
		drawControls();
	
	ctx.restore();
}



//////////////   GAME LOOP FUNCTIONS   //////////////////

// GAME INITIALIZATION FUNCTION
function initDemo(lvl){
	demo = true;
	curLevel = lvl;
	newLevel(curLevel);
}

// START THE GAME TO TEST THE LEVEL
function initEditTest(){
	//change level id
	document.getElementById("levelIndex").innerHTML = "Level: " + localStorage.levelNum;


	demo = false;
	saveLevel = false;
	curLevel = 0;
	//allowSubmit();

	//load map
	if(localStorage.testMap){
		makeLevel(parseMap(localStorage.testMap));

		let d = {'u': 'up', 'd': 'down', 'l':'left', 'r':'right', 's':'space'};

		curPath = localStorage.bestSolution;

		if(curPath != null && curPath != "")
			curPath = curPath.split(",").map(x => d[x]);
		else
			curPath = [];

	}
	//use demo maps
	else{
		//alert('test map not found - using demo levels instead');
		initDemo(0);
	}
}			

// CREATES A DEMO LEVEL
function newLevel(lvl_index){
	clearLevel(game_parameters);
	demo = true;

	game_parameters['orig_map'] = demoLevels[lvl_index];
	setLevel();
}

// MAKES A LEVEL FROM AN ASCII MAP
function makeLevel(map){
	clearLevel(game_parameters);
	demo = false;

	game_parameters['orig_map'] = map
	setLevel();
}

// GET THE RULES THAT ARE CURRENTLY ACTIVE
function getCurRules(){
	ruleset = [];
	for(let r=0;r<game_parameters['rules'].length;r++){
		ruleset.push(game_parameters['rules'][r]);
	}
	return ruleset;
}

// INITIALIZE THE SAVED LEVEL 
function setLevel(){
	makeImgHash();

	var maps = splitMap(game_parameters['orig_map']);
	game_parameters['back_map'] = maps[0]
	game_parameters['obj_map'] = maps[1];

	assignMapObjs(game_parameters);
	interpretRules(game_parameters);

	localStorage.setItem("endRules", JSON.stringify(endRules));
	endRules = [];
	initRules = getCurRules();
	localStorage.setItem("initRules", JSON.stringify(initRules));
	
	//mapThumbnail = null;
	mapHeight = game_parameters['orig_map'].length;
	mapWidth = game_parameters['orig_map'][0].length;
	calcOffset();

	aiControl = false;
	clearInterval(kt);
	kt = 0;
	moved = false;
	unsolvable = false;

	saveLevel = false;

	moveSteps = [];

	wonGame = false;
	alreadySolved = false;

	render();

	let testerBtn = document.getElementById('testerCol');
	//goto keke after a short delay to make sure the page is loaded
	if(localStorage.control && localStorage.control == "keke" && !demo){
		rt = setTimeout(function(){useKeke();}, 500);

		if(testerBtn){
			testerBtn.innerHTML = "Tester:<br> KEKE";
			testerBtn.style.backgroundColor = "#ff0000";
		}
		
	}else{
		if(testerBtn){
			document.getElementById('testerCol').innerHTML = "Tester:<br> HUMAN";
			testerBtn.style.backgroundColor = "#ffffff";
		}
	}
}

// CALCULATE THE OFFSET PLACEMENT FOR THE BABA IS YOU SCREEN
function calcOffset(){
	if(mapWidth > mapHeight){
		size = canvas.width / mapWidth;
		offX = 0;
		offY = (canvas.height - (size*mapHeight)) / 2;
	}else{
		size = canvas.height / mapHeight;
		offY = 0;
		offX = (canvas.width - (size*mapWidth)) / 2;
	}
}

// MAIN GAME LOOP
function main(){
	/*console.log(CURRENT_USER);*/
	requestAnimationFrame(main);
	canvas.focus();

	render();

	//player movement
	if(!wonGame && !aiControl)
		key_input(obj_map, back_map);
	

	stateChange();

	//reset move key
	if(!anyMoveKey() && moved && !aiControl){
		moved = false;
		movedObjs = [];
	}

	//reset action key
	if(!anyActionKey() && acted){
		acted = false;
	}

	//set level settings
	if(document.getElementById("levelLabel"))
		document.getElementById("levelLabel").innerHTML = "Goal Label: " + (localStorage.objRuleRep && localStorage.objRuleRep != "" ? localStorage.objRuleRep : 'ANY-RULES');

	if(document.getElementById("myLabel"))
		document.getElementById('myLabel').innerHTML = "Level Label: " + translateChromo(getChromosomeRep(initRules, endRules));
}

// USE THE AI BOT TO SOLVE THE LEVEL IF A SOLUTION CAN BE FOUND
function useKeke(){

	//path not found yet
	if(curPath.length == 0){
		clearInterval(rt);

		unsolvable = false;

		drawKekeSolve();
		render();

		//solving = true;
		let curIteration = 0;
		let path = [];


		//callback once a solution (or lack thereof is found)
		solve(game_parameters, function(path){
			console.log(path);

			//check for the answer
			//solving = false;
			if(path.length > 0){
				wonGame = false;
				aiControl = true;
				pathIndex = 0;
				curPath = path;
				kt = setInterval(function(){
					ai_input();
				}, 300);
			}else{
				console.log("UNSOLVABLE!");
				unsolvable = true;
			}
		});
	}
	//path already found
	else{
		clearInterval(kt);
		wonGame = false;
		aiControl = true;
		pathIndex = 0;
		kt = setInterval(function(){
			ai_input();
		}, 300);
	}
	
	
}


// TRANSLATE THE SOLUTION'S UDLR SYNTAX TO MOVEMENT FOR KEKE
function translateSol(solStr){
	let parts = solStr.split("");
	let solution = [];
	for(let p=0;p<parts.length;p++){
		let a = parts[p];
		if(a == "U")
			solution.push("up");
		else if(a == "D")
			solution.push("down");
		else if(a == "L")
			solution.push("left");
		else if(a == "R")
			solution.push("right");
		else if(a == "S")
			solution.push("");
	}
	return solution;
}

// HAVE THE KEKE BOT DEMONSTRATE THE SOLUTION FOR THE LEVEL
function showSolution(){
	//reset the level first
	localStorage.control = "user";
	if(demo)
		newLevel(curLevel);
	else
		initEditTest();

	//setup keke
	wonGame = false;
	aiControl = true;
	pathIndex = 0;
	curPath = translateSol(localStorage.bestSolution);
	kt = setInterval(function(){
		ai_input();
	}, 300);
}

// TOGGLE TESTER CONTROL FOR THE LEVEL (AI/HUMAN)
function toggleControl(btn){
	//switch control
	if(localStorage.control == "keke")
		localStorage.control = "human";
	else
		localStorage.control = "keke";

	//reset the game if already won
	if(wonGame || (curPath.length > 0 && localStorage.control == 'keke')){
		if(demo)
			newLevel(curLevel);
		else
			initEditTest();
	}


	//change button text and color
	btn.style.backgroundColor = (localStorage.control == "human" ? "#ffffff" : "#ff0000");
	btn.innerHTML = localStorage.control.toUpperCase();

	//reset level with new control at current map point
	let curAscii = doubleMap2Str(game_parameters['obj_map'], game_parameters['back_map']);
	//console.log(curAscii);
	makeLevel(parseMap(curAscii));
}

// SHOW THE CONTROL HINT WINDOW
function showControls(){
	show_controls = !show_controls;
}

function allowSubmit(){
	if((importData != "1") && (document.getElementById("submitCol") != null)){
		if(!saveLevel){
			document.getElementById("submitCol").classList.remove("sub");
			document.getElementById("submitCol").classList.add("dis");
		}else{
			document.getElementById("submitCol").classList.remove("dis");
			document.getElementById("submitCol").classList.add("sub");
		}			
	}
}


///////////////      EXPORTING FUNCTIONS      ///////////////


function minimizeSolution(solution){
	let miniSol = [];
	for(let s=0;s<solution.length;s++){
		miniSol.push(solution[s][0].toLowerCase());
	}
	return miniSol.join("");
}

function level2JSON(lvl){

}


/////////////////   HTML5 FUNCTIONS  //////////////////

// DETERMINE IF VALUD KEY TO PRESS
document.body.addEventListener("keydown", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = true;
	}
	if(anyKey())
		show_controls = false;
});

// CHECK FOR KEY RELEASED
document.body.addEventListener("keyup", function (e) {
	if(inArr(moveKeySet, e.keyCode)){
		keys[e.keyCode] = false;
	}else if(inArr(actionKeySet, e.keyCode)){
		keys[e.keyCode] = false;
	}
});

// PREVENT SCROLLING WITH THE GAME
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }

}, false);


main();

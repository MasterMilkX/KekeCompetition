//GUI MODE CLIENT SIDE JS
//Written by Milk

var socket = io();	//start socket communicator

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

//maps
var imgHash = {};
var orgi_map = [];
var ascii_map = [];
var map2d = [];

//solution attributes
var keke_solution = [];
var kt = 0;
var solStep = 0;
var solTime = 450; 
var canUpdate = true;

//win screen
var wonGame = false;
var winscreen = new Image();
winscreen.src = "img/win_screen.png";
var ws_ready = false;
winscreen.onload = function(){ws_ready = true;}



//////////////////////////   KEKE SOLUTION FUNCTIONS   ///////////////////////

// RESET THE ITERATOR TO SHOW EACH STEP
function startRun(btn){
	kt = setInterval(function(){
		nextStep();
	},solTime);
	btn.innerHTML = "Pause Run<br>[SPACE]";
	btn.classList.add("pauseBg")
	btn.classList.remove("runBg")

}

// STOP THE ITERATOR TO SHOW EACH STEP
function stopRun(btn){
	clearInterval(kt);
	kt = 0;
	btn.innerHTML = "Start Run<br>[SPACE]";
	btn.classList.remove("pauseBg")
	btn.classList.add("runBg")
}

// TOGGLE TO SHOW THE KEKE SOLUTION
function toggleRun(btn){
	//STOP or REACH END
	if(kt > 0){
		stopRun(btn);
	}
	//START
	else{
		//restart first
		if(wonGame){
			console.log("resetting and running...")
			resetMap();
		}

		startRun(btn);
	}
}

// SHOW THE NEXT STEP IN THE SOLUTION
function nextStep(){
	if(!canUpdate)
		return;

	//end of the solution
	if(solStep >= keke_solution.length){
		solStep = keke_solution.length;
		stopRun(document.getElementById("togBtn"));
		return;
	}
	updateMap(keke_solution[solStep]);
	solStep++;
}

// UPDATE THE TIME BETWEEN STEPS (MS)
function updateTime(){
	solTime = parseInt(document.getElementById("ms_step").value);
}


/////////////////////////        MAP FUNCTIONS       ///////////////////////


// MAKE THE HASHMAP OF IMAGES TO NAMES
function makeImgHash(){
	//iterate through each character
	var chars = Object.keys(map_key);
	for(var r=0;r<chars.length;r++){
		var charac = chars[r];
		//character not yet saved in the image hash - so make a new entry
		if(!(charac in imgHash)){
			var i = new Image();
			i.src = "img/" + map_key[charac] + ".png";
			var ir = false;
			i.onload = function(){ir = true;};
			var i_arr = [i, ir];
			imgHash[charac] = i_arr;
		}
	}
}


// RECIEVE NEW MAP DATA
socket.on('new-map', function(dat){
	ascii_map = dat['ascii_map'];
	map2d = parseMap(ascii_map);
	won = dat['won'];

	canUpdate = true;
	sentReq = false;

	//finish game
	if(won){
		wonGame = true;
		clearInterval(kt);
		kt = 0;
		stopRun(document.getElementById("togBtn"));
	}
})

//RECIEVE MAP KEY DICTIONARY
socket.on('ret-map-key',function(mk){
	map_key = mk;
	makeImgHash();
})


// UPDATE THE ASCII MAP BY FEEDING THE SOLUTION THROUGH
function updateMap(step){
	socket.emit('step-map', {'step':step});
	canUpdate = false;
}


// RESET THE CURRENT MAP FOR THE SERVER GAME STATE
function resetMap(m){
	if(kt > 0){return;}

	if(m == null){m = orig_map;}

	socket.emit('reset-map',{'ascii_map':m});
	ascii_map = m;
	map2d = parseMap(ascii_map);
	wonGame = false;
	solStep = 0;
	canUpdate = true;

}

// GET THE MAP SPRITE DICTIONARY
function getMapKey(){
	socket.emit('get-map-key');
}

// TURNS A STRING OBJECT BACK INTO A 2D ARRAY
function parseMap(ms){
	var newMap = [];
	var rows = ms.split("\n");
	for(var r=0;r<rows.length;r++){
		var allPush = rows[r].replace(/\./g, " ").split("");
		newMap.push(allPush);
	}
	return newMap;
}

//////////////////////////      MAIN FUNCTIONS      ////////////////////////////

// INITIALIZATION FUNCTION
function init(){
	//import the images, map, and solution
	orig_map = localStorage.cur_ascii_map;
	keke_solution = localStorage.cur_solution;

	//update buttons and labels
	let stat = "";
	stat += "Level: <span class='lvlsetTxt'>" + localStorage.lvlSet + "</span>";
	stat += " <span class='lvlidTxt'>#" + localStorage.levelID + "</span>";
	stat +=  " --- Agent: <span class='agentTxt'>" + localStorage.agent + "</span>";
	document.getElementById("levelIndex").innerHTML = stat;

	updateTime();

	//get sprite key
	getMapKey();
	resetMap(orig_map);

	//setup map
	map2d = parseMap(ascii_map);
	mapHeight = map2d.length
	mapWidth = map2d[0].length
	calcOffset();
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

// RENDER THE SCREEN
function render(){
	//update the screen
	requestAnimationFrame(render);
	canvas.focus();

	//clear the map
	ctx.save();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	//background
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,canvas.width, canvas.height);


	//draw sprites on map
	for(let r=0;r<map2d.length;r++){
		for(let c=0;c<map2d[0].length;c++){
			var charac =  map2d[r][c];
			var sprite = null;
			if(charac.name != undefined)
				sprite = charac.img;
			else if(charac in imgHash)
				sprite = imgHash[charac][0];

			if(sprite != null && sprite.width > 0)
				ctx.drawImage(sprite, 0, 0, sprite.width, sprite.height,
					c*size+offX, r*size+offY, size, size);
		}
	}

	//draw the win screen
	if(wonGame && ws_ready)
		ctx.drawImage(winscreen, 0, 0, winscreen.width, winscreen.height, (canvas.width/2)-(3*size), (canvas.height/2)-(1.5*size),6*size, 3*size)
	//reload the win_screen
	else if(!ws_ready){
		winscreen.onload = function(){ws_ready = true;}
		if(winscreen.width > 0){ws_ready = true;}
	}

	ctx.restore();

}

render();




// PREVENT SCROLLING WITH THE GAME
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if(([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)){
        e.preventDefault();
    }

}, false);


// HOTKEY BUTTONS
window.addEventListener("keydown", function(e) {
	//space - toggle running
    if(e.keyCode == 32){
    	toggleRun(document.getElementById("togBtn"))
    }
    //r - reset the map
    else if(e.keyCode == 82){
    	resetMap(orig_map);
    }
    //q - close the gui mode window
    else if(e.keyCode == 81){
    	window.close();
    }

}, false);



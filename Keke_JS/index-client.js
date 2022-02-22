// CLIENT SIDE NODEJS INTERFACE 
// Interacts with the NodeJS server to update the HTML interface for the Keke Competition
// Written by Milk


////  GLOBAL VARIABLES ///// 

var socket = io();

var tableFilled = false;		//if the level set table has been populated with the level data yet
var executingAgent = false;		//if currently executing the agent on the level set
var unsolvedLevels = [];		//list of currently unsolved levels





// USE THE LOCALLY SAVED SETUP FOR THE LEVEL-SET AND AGENT
function useLastSetup(){
	//set the level set dropdown + value
	if(localStorage.lvlSet)
		document.getElementById("levelSetList").value = localStorage.lvlSet
	else
		localStorage.lvlSet = document.getElementById("levelSetList").value;
	

	//set the agent dropdown + value
	if(localStorage.agent){
		document.getElementById("agentList").value = localStorage.agent;
	}
	else
		localStorage.agent = document.getElementById("agentList").value;
}



// CALLED AT THE INITIALIZATION OF THE SYSTEM/SITE
function init(){
	//loadAgentSet();

	setInterval(pendEllipse,500);   //iterate ellipses for pending levels
	
	//make sure the table is always loaded on start
	setInterval(function(){
		if(!tableFilled){loadAgentSet();setDropDowns();}
	},1000);
}


////////    LEVEL TABLE MODIFICATIONS    ///////

// CLEARS THE LEVEL TABLE OF ALL DATA
function clearLevelTable(){
	//remove all except header
	let lt = document.getElementById("level-table");
	while (lt.children.length > 1) {
	    lt.removeChild(lt.lastChild);
	}
	tableFilled = false;
}

// MAKES A NEW ROW IN THE LEVEL TABLE
function addLevelRow(id,status='-', timeExec="?", iter='?',sol="", win=false){
	let lt = document.getElementById("level-table");

	//create row
	let r = document.createElement("div");
	r.classList.add("row", "row-no-gutters");
	r.id = ("levelRow"+id);

	//create columns
	let c1 = document.createElement("div");
		c1.classList.add("col-xs-1", "levelID");
		c1.innerHTML = id;
	let c2 = document.createElement("div");
		c2.classList.add("col-xs-3", "solveStat");
		c2.innerHTML = "[ " + status + " ]";
	let c3 = document.createElement("div");
		c3.classList.add("col-xs-2", "timeStat");
		c3.innerHTML = (timeExec + "s");
	let c4 = document.createElement("div");
		c4.classList.add("col-xs-3", "solveIter");
		c4.innerHTML = (iter + " / 10000");
	let c5 = document.createElement("div");
		c5.classList.add("col-xs-3", 'guiCol');
		let showBtn = document.createElement("button");
		showBtn.classList.add('guiBtn');
		showBtn.innerHTML = "Show Level";
		//showBtn.disabled = (sol.length > 0 ? true : false);
		showBtn.onclick = function(){}
		showBtn.value = sol;
		c5.appendChild(showBtn);

	//add columns to row
	r.appendChild(c1);
	r.appendChild(c2);
	r.appendChild(c3);
	r.appendChild(c4);
	r.appendChild(c5);

	//add row to table
	lt.appendChild(r);


	//say the table is filled with something
	tableFilled = true;
}

// UPDATE A LEVEL TABLE ROW WITH JSON INFO
function updateLevelRow(id, status, timeExec, iter, sol,ascii_map,won){
	//get columns
	let row = document.getElementById("levelRow"+id);
	row.classList.remove('pendingLevel');
	let c2 = row.getElementsByClassName("solveStat")[0];
	let c3 = row.getElementsByClassName("timeStat")[0];
	let c4 = row.getElementsByClassName("solveIter")[0];
	let c5 = row.getElementsByClassName("guiBtn")[0];

	//update the values
	c2.innerHTML = "[ " + status + " ]";
	c3.innerHTML = timeExec + "s";
	c4.innerHTML = iter + " / 10000";
	//c5.disabled = (status == "SOLVED!" ? false : true);
	c5.value = sol;
	c5.onclick = function(){showLevelGUI(id,ascii_map,sol)}

	//update row color
	row.classList.add((won ? "solvedLevel" : "unsolvedLevel"));
}

// SHOW A LEVEL IS CURRENTLY BEING SOLVED BY THE SYSTEM IN THE BACKEND
function solvingLevelRow(id){
	let row = document.getElementById("levelRow"+id);
	if(row)
		row.classList.add("pendingLevel");
}

// ADD ELLIPSE FOR ALL PENDING ROWS
var ellipse = 1;
function pendEllipse(){
	let pr = document.getElementsByClassName("pendingLevel");
	ellipse = (ellipse%3)+1;
	let estr = "";
	for(let e=0;e<ellipse;e++){estr += ".";}
	for(let i=0;i<pr.length;i++){
		pr[i].getElementsByClassName("solveStat")[0].innerHTML = "[ solving" + estr + " ]";
	}
}


// CLEAR THE TABLE OF ALL AGENT STATS
function resetLevelTable(){
	let rows = document.getElementById("level-table").getElementsByClassName("row");
	for(let i=0;i<rows.length;i++){
		//skip header row
		if(rows[i].classList.contains("header"))
			continue;

		//retrieve data from the columns in the row
		let r = rows[i];
		r.classList.remove("solvedLevel");
		r.classList.remove("unsolvedLevel");
		r.classList.remove("pendingLevel");
		r.getElementsByClassName("solveStat")[0].innerHTML = "[ - ]";
		r.getElementsByClassName("timeStat")[0].innerHTML = "?s";
		r.getElementsByClassName("solveIter")[0].innerHTML = " ? / 10000";
		let btn = r.getElementsByClassName("guiBtn")[0];
		btn.value = '';
		//btn.disabled = true;
	}
}

// UPDATE THE STAT TABLES BASED ON THE LEVEL TABLE INFO
function updateStats(){
	//level completion stats
	let winCt = 0
	let loseCt = 0;
	let emptyCt = 0;

	//solution stats
	let iterCt = [];
	let timeCt = [];
	let solCt = [];

	//iterate over every row
	let rows = document.getElementById("level-table").getElementsByClassName("row");
	for(let i=0;i<rows.length;i++){
		//skip header row
		if(rows[i].classList.contains("header"))
			continue;

		//retrieve data from the columns in the row
		let r = rows[i];
		let stat = r.getElementsByClassName("solveStat")[0].innerHTML;
		let time = r.getElementsByClassName("timeStat")[0].innerHTML;
		let iter = r.getElementsByClassName("solveIter")[0].innerHTML;
		let btn = r.getElementsByClassName("guiBtn")[0];

		//count level completions
		if(stat.includes("SOLVED!")){winCt++;}
		else if(stat.includes("MAXED")){loseCt++;}
		else{emptyCt++;}

		//add to averages if a solution is given
		if(btn.value && btn.value.length > 0){
			iterCt.push(parseInt(iter.split("/")[0]));
			timeCt.push(parseFloat(time.replace('s','')));
			solCt.push(btn.value.length);
		}
	}

	//apply averages + accuracy
	let iterCtAvg = (iterCt.length > 0 ? iterCt.reduce((a, b) => a + b) / iterCt.length : 0);
	let timeCtAvg = (timeCt.length > 0 ? timeCt.reduce((a, b) => a + b) / timeCt.length : 0);
	let solCtAvg = (solCt.length > 0? solCt.reduce((a, b) => a + b) / solCt.length : 0);
	let levAcc = ((winCt+loseCt) > 0 ? winCt / (winCt+loseCt) : 0);

	//write values to the tables
	document.getElementById("level_win_num").innerHTML = winCt;
	document.getElementById("level_lose_num").innerHTML = loseCt;
	document.getElementById("level_unsolve_num").innerHTML = emptyCt;
	document.getElementById("level_acc").innerHTML = (levAcc*100).toFixed(1) + "%";

	document.getElementById("avg_iter").innerHTML = Math.round(iterCtAvg);
	document.getElementById("avg_time").innerHTML = timeCtAvg.toFixed(3);
	document.getElementById("avg_sol_len").innerHTML = solCtAvg.toFixed(1);
}

// CHANGE THE AGENT FROM THE DROPDOWN
function updateAgent(){
	if(executingAgent){
		alert("Cannot change agent set while solving levels!");
		document.getElementById("agentList").value = localStorage.agent;
		return;
	}
	console.log("changed agent");
	localStorage.agent = document.getElementById("agentList").value;
	loadAgentSet();
}

// CHANGE THE LEVEL SET FROM THE DROPDOWN
function updateLvlSet(){
	//prevent change while executing agent
	if(executingAgent){
		alert("Cannot change level set while solving levels!");
		document.getElementById("levelSetList").value = localStorage.lvlSet
		return;
	}
	console.log("changed level set")
	localStorage.lvlSet = document.getElementById("levelSetList").value;
	loadAgentSet();
}

// OPEN THE GUI MODE
function showLevelGUI(id,ascii_map,solution){
	//set the local variables for transferability
	localStorage.levelID = id;
	localStorage.cur_ascii_map = ascii_map;
	localStorage.cur_solution = solution;

	//open a new window
	window.open("game.html");
}

/////////    SERVER RECEPTION FUNCTIONS    //////////


// RECIEVE LEVEL SET LIST FROM SERVER
socket.on('level-set-list', function(lsl) {
	//add list of level sets to the dropdown
	let lsSel = document.getElementById("levelSetList");
	lsSel.innerHTML = "";
	for(let i=0;i<lsl.length;i++){
		let l = lsl[i].replace(".json", '').replace("_LEVELS", '');
		let o = document.createElement("option");
		o.value = l.replace(' ', '');
		o.innerHTML = l;
		lsSel.appendChild(o);
	}

	useLastSetup();
});

// RECIEVE AGENT LIST FROM SERVER
socket.on('agent-list', function(al){
	//add list of agents sets to the other dropdown
	let agSel = document.getElementById("agentList");
	agSel.innerHTML = "";
	for(let i=0;i<al.length;i++){
		let l = al[i].replace("_AGENT", '').replace(".js", '');
		let o = document.createElement("option");
		o.value = l.toUpperCase().replace(' ', '');
		o.innerHTML = l;
		agSel.appendChild(o);
	}

	useLastSetup();
});

//RECIEVE LEVEL SET JSON FOR AGENT
socket.on('return-level-json', function(j){
	//remove old levels if any
	clearLevelTable();

	//add a row for every level in the level set
	for(let i=0;i<j.length;i++){
		let lvl = j[i];
		addLevelRow(lvl["id"]);
	}
	updateStats();
});


// RECIEVE AGENT JSON AND UPDATE THE INFO IN THE LEVEL TABLE
socket.on('return-agent-json', function(j){
	//parse the info to update the table
	for(let i=0;i<j.length;i++){
		let lvl = j[i];
		let ss = (lvl['won_level'] ? "SOLVED!" : "MAXED");
		updateLevelRow(lvl['id'],ss,lvl['time'],lvl['iterations'],lvl['solution'],lvl['ascii_map'],lvl['won_level']);
	}
	updateStats();
});


// RESET THE DATA IN THE LEVEL TABLE FROM AN UPDATED JSON FILE
socket.on('reset-agent-json', function(){
	resetLevelTable();
});


// LEVEL SET NOT FOUND SO USE THE DEFAULT ONE
socket.on('level-set-404', function(){
	localStorage.lvlSet = "test";
});

//AGENT NOT FOUND SO USE THE EMPTY ONE
socket.on('agent-404', function(){
	localStorage.agent = "empty";
})

socket.on('set-als',function(){
	loadAgentSet();
});




// SHOW A LEVEL IS CURRENTLY BEING SOLVED
socket.on('pending-level', function(id){
	solvingLevelRow(id);
})

// UPDATE A LEVEL ROW ON COMPLETION AND SOLVE THE NEXT ONE IF AVAILABLE
socket.on('finish-level', function(lvl){
	//update the level row with the new info
	let ss = (lvl['won_level'] ? "SOLVED!" : "MAXED");
	console.log("GOT LEVEL DATA: " + lvl['id']);
	updateLevelRow(lvl['id'],ss,lvl['time'],lvl['iterations'],lvl['solution'],lvl['ascii_map'],lvl['won_level']);
	unsolvedLevels.shift()	//remove the level from the unsolved listx

	//update the stats
	updateStats();

	//solve the next level if possible
	if(!executingAgent){return;}
	solveNextLevel();
});



/////////    CLIENT BROADCAST FUNCTIONS    //////////

//check if the saved agent and level set exists in the file I/O
function checkALS(){
	socket.emit('als_exists', {'agent':localStorage.agent, 'levelSet':localStorage.lvlSet});
}

//load the agents and levels
function loadAgentSet(){
	loadLevelSet();
	loadAgentJSON();
}

// LOAD THE AGENT JSON FOR THE LEVEL SET
function loadAgentJSON(){
	let lvlSet = localStorage.lvlSet;
	let agent = localStorage.agent;

	socket.emit('get-agent-json', {"agent":agent, "levelSet":(lvlSet+"_LEVELS")});
	
}

// LOAD THE LEVEL SET FROM THE JSON FILE
function loadLevelSet(){
	let lvlSet = localStorage.lvlSet;

	socket.emit('get-level-set', {"levelSet":(lvlSet+"_LEVELS")});
}




// TRAIN THE SELECTED AGENT ON THE SELECTED DATASET
function runAgent(){
	if(executingAgent){return;}	//check if already running agent

	let lvlSet = localStorage.lvlSet;
	let agent = localStorage.agent;

	//confirm to use agent on level set
	if(confirm(`Run agent [ ${agent} ] on level set [ ${lvlSet} ]?`)){
		unsolvedLevels = getUnsolvedLevels();
		executingAgent = true;
		solveNextLevel();
		toggleSolveBtn();
		//socket.emit('start-run', {"agent":agent, "levelSet":(lvlSet+"_LEVELS"), "unsolve_set_ids":usi});
	}
}

// STOP THE AGENT FROM TESTING THE LEVELS
function pauseAgent(){
	if(!executingAgent){return;}

	let lvlSet = localStorage.lvlSet;
	let agent = localStorage.agent;

	//confirm cancellation
	if(!confirm(`Want to stop running agent [ ${agent} ] on level set [ ${lvlSet} ]?\nAny currently running levels will be finished.`)){
		return;
	}

	executingAgent = false;
	toggleSolveBtn();
}



// SOLVE THE NEXT LEVEL IN THE UNSOLVED LIST
function solveNextLevel(){
	//all levels solved
	if(unsolvedLevels.length == 0){
		console.log("SOLVED ALL LEVELS!")
		executingAgent = false;
		toggleSolveBtn();
		return;
	}

	let lvlSet = localStorage.lvlSet;
	let agent = localStorage.agent.toLowerCase();

	//pass the next unsolved level data to the server to solve it
	let lv = unsolvedLevels[0];
	socket.emit('solve-level', {"agent":agent, "levelSet":(lvlSet+"_LEVELS"), "levelID":lv});
}


// TOGGLE TO RUN AGENT BUTTON GUI
function toggleSolveBtn(){
	let btn = document.getElementById("agentExecBtn");

	//change to pause btn
	if(executingAgent){
		btn.innerHTML = "PAUSE AGENT";
		btn.classList.remove("runBtn");
		btn.classList.add("pauseBtn");
		btn.onclick = function(){pauseAgent()}

	}
	//change to run btn
	else{
		btn.innerHTML = "RUN AGENT";
		btn.classList.add("runBtn");
		btn.classList.remove("pauseBtn")
		btn.onclick = function(){runAgent()}
	}
}



// RETURNS A LIST OF LEVELS THAT ARE UNSOLVED CURRENTLY 
function getUnsolvedLevels(){
	//get set of unsolved levels in the level set
	let lvls = document.getElementById("level-table").getElementsByClassName("row");
	let usi = [];
	for(let i=0;i<lvls.length;i++){
		let l = lvls[i];

		//ignore header row
		if(l.classList.contains("header"))
			continue;

		//get status and add unsolved status levels
		let stat = l.getElementsByClassName("solveStat")[0].innerHTML;
		if(stat.includes("-")){
			let id = l.getElementsByClassName("levelID")[0].innerHTML;
			usi.push(parseInt(id));
		}
	}
	return usi;
}

// CLEAR THE SAVED JSON DATA FOR AN AGENT ON THE DATASET
function resetAgentData(){
	let lvlSet = localStorage.lvlSet;
	let agent = localStorage.agent;

	if(confirm(`Are you sure you want to clear the JSON data for [ ${agent} ] on level set [ ${lvlSet} ]?`)){
		//alert("lol, baka");
		socket.emit('delete-json-set', {"agent":agent, "levelSet":(lvlSet+"_LEVELS")});
	}
}




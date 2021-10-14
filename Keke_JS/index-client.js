// CLIENT SIDE NODEJS INTERFACE 
// Interacts with the NodeJS server to update the HTML interface for the Keke Competition
// Written by Milk



var socket = io();


function init(){
	loadAgentSet();
}


////////    LEVEL TABLE MODIFICATIONS    ///////

// CLEARS THE LEVEL TABLE OF ALL DATA
function clearLevelTable(){
	//remove all except header
	let lt = document.getElementById("level-table");
	while (lt.children.length > 1) {
	    lt.removeChild(lt.lastChild);
	}
}

// MAKES A NEW ROW IN THE LEVEL TABLE
function addLevelRow(id,status='-', timeExec=0, iter=0,sol=""){
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
		showBtn.disabled = (sol.length > 0 ? true : false);
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
}

// UPDATE A LEVEL TABLE ROW WITH JSON INFO
function updateLevelRow(id, status, timeExec, iter, sol){
	//get columns
	let row = document.getElementById("levelRow"+id);
	let c2 = row.getElementsByClassName("solveStat")[0];
	let c3 = row.getElementsByClassName("timeStat")[0];
	let c4 = row.getElementsByClassName("solveIter")[0];
	let c5 = row.getElementsByClassName("guiBtn")[0];

	//update the values
	c2.innerHTML = "[ " + status + " ]";
	c3.innerHTML = timeExec + "s";
	c4.innerHTML = iter + " / 10000";
	c5.disabled = (status == "SOLVED!" ? false : true);
	c5.value = sol;

	//update row color
	row.classList.add((status == "SOLVED!" ? "solvedLevel" : "unsolvedLevel"));
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
	document.getElementById("level_acc").innerHTML = levAcc.toFixed(3)*100.0 + "%";

	document.getElementById("avg_iter").innerHTML = Math.round(iterCtAvg);
	document.getElementById("avg_time").innerHTML = timeCtAvg.toFixed(3);
	document.getElementById("avg_sol_len").innerHTML = solCtAvg.toFixed(1);
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
		let ss = (lvl['solution'].length > 0 ? "SOLVED!" : "MAXED");
		updateLevelRow(lvl['id'],ss,lvl['time'],lvl['iterations'],lvl['solution']);
	}
	updateStats();
});


/////////    CLIENT BROADCAST FUNCTIONS    //////////

function loadAgentSet(){
	loadLevelSet();
	loadAgentJSON();
}

// LOAD THE AGENT JSON FOR THE LEVEL SET
function loadAgentJSON(){
	let lvlSet = document.getElementById("levelSetList").value;
	let agent = document.getElementById("agentList").value;

	socket.emit('get-agent-json', {"agent":agent, "levelSet":lvlSet});
	
}

// LOAD THE LEVEL SET FROM THE JSON FILE
function loadLevelSet(){
	let lvlSet = document.getElementById("levelSetList").value;

	socket.emit('get-level-set', {"levelSet":lvlSet});
}

// TRAIN THE SELECTED AGENT ON THE SELECTED DATASET
function runAgent(){
	let lvlSet = document.getElementById("levelSetList").value;
	let agent = document.getElementById("agentList").value;

	//confirm to use agent on level set
	if(confirm(`Run agent [ ${agent} ] on level set [ ${lvlSet} ]?`)){
		socket.emit('start-run', {"agent":agent, "levelSet":lvlSet});
	}
}

// CLEAR THE SAVED JSON DATA FOR AN AGENT ON THE DATASET
function resetAgentData(){
	let agent = document.getElementById("agentList").value;

	if(confirm(`Are you sure you want to clear the JSON data for [ ${agent} ] on level set [ ${lvlSet} ]?`)){
		alert("lol, baka");
	}
}




var socket = io();


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
function addLevelRow(id,status='[ - ]', timeExec=0, iter=0){
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
		c2.innerHTML = status;
	let c3 = document.createElement("div");
		c3.classList.add("col-xs-2", "timeStat");
		c3.innerHTML = (timeExec + "s");
	let c4 = document.createElement("div");
		c4.classList.add("col-xs-3", "solveIter");
		c4.innerHTML = (iter + " / 10000");
	let c5 = document.createElement("div");
		c5.classList.add("col-xs-2");
		let showBtn = document.createElement("button");
		showBtn.innerHTML = "Show Level";
		showBtn.disabled = (status === '[ - ]' ? true : false);
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




/////////    SERVER RECEPTION FUNCTIONS    //////////


// RECIEVE LEVEL SET LIST FROM SERVER
socket.on('level-set-list', function(lsl) {
	//add list of level sets to the dropdown
	let lsSel = document.getElementById("levelSetList");
	lsSel.innerHTML = "";
	for(let i=0;i<lsl.length;i++){
		let l = lsl[i].replace(".json", '').replace("_levels", '');
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
		let l = al[i].replace(".js", '');
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
});


/////////    CLIENT BROADCAST FUNCTIONS    //////////


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
	if(confirm(`Are you sure you want to clear the JSON data for [ ${agent} ] on level set [ ${lvlSet} ]?`)){
		alert("lol, baka");
	}
}




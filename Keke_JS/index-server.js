//SERVER SIDE CODE THAT INTERACTS WITH THE BACKEND JS CALCULATIONS AND THE WEBAPP
//Written by Milk

////  IMPORTS  ////

//import express
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.use('favicon.ico', express.static('favicon.ico'));

//import http server
const http = require('http');
const server = http.createServer(app);
let PORT = 8080;

//import socket io library for communication
const { Server } = require("socket.io");
const io = new Server(server);

//file I/O
const fs = require('fs');

//import level imports
const jsonjs = require('./js/json_io');

//import execution code
const execjs = require('./js/exec');

//import gui code
const guijs = require('./js/gui');

//import simulation code
const simjs = require('./js/simulation')






////   SETUP THE SERVER   ////

//connect the app to the html
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});


//initial connection onstart
io.on('connection', (socket) =>{
	//send the list of possible level sets + agents
	io.emit('level-set-list', jsonjs.importLevelSets());
	io.emit('agent-list', jsonjs.getAgentList());
});


////     FUNCTION DEFINITIONS    ////


// IMPORT THE AGENT REPORT 
function sendReport(dat){
	let rep = jsonjs.importALSReport(dat['agent'],dat['levelSet']);
	if (rep != null){
		//add ascii maps (not included in report)
		for(let i=0;i<rep.length;i++){
			let l = jsonjs.getLevel(dat['levelSet'],rep[i]['id']);
			if(l == null){continue;}
			let am = l['ascii'];
			rep[i]['ascii_map'] = am;
		}

		io.emit('return-agent-json',rep);
	}else{
		console.log(`- No JSON found for agent [ ${dat['agent']} ] ON LEVEL SET [ ${dat['levelSet']} ]... - `)
	}
}

// SOLVE A LEVEL BY ID # FOR A LEVEL SET
function solveLevel(ls,id,agent){
	io.emit('pending-level',id);
	let res = execjs.solveLevel(ls,id,agent);
	io.emit('finish-level',res);
	console.log(`* FINISHED LEVEL [ ${id} ] *`)
}


////     SERVER INTERACTIONS     ////


//start socket connection
io.on('connection', (socket) => {

	//get the level set for the agent to populate the level table
	socket.on('get-level-set', (dat) =>{
		let ls = dat['levelSet'];
		console.log(`-- RETRIEVING LEVEL SET [ ${ls} ] --`)
		let j = jsonjs.getLevelSet(ls);
		if(j != null){
			io.emit('return-level-json', j);
		}else{
			console.log("ERROR: JSON NOT FOUND!");
			io.emit('level-set-404');
		}

	})


	//get agent json
	socket.on('get-agent-json', (dat) =>{
		console.log(`-- RETRIEVING AGENT REPORT [ ${dat['agent']} ]`)
		sendReport(dat);
	});


	//start training an agent on specific level set
	socket.on('solve-level', (dat) => {
		console.log(`-- SOLVING LEVEL [ ${dat['levelID']} ] FROM LEVEL SET [ ${dat['levelSet']} ] WITH AGENT [ ${dat['agent']} ] --`);
		solveLevel(dat['levelSet'],dat['levelID'],dat['agent']);
	});


	//delete a json report for a specific agent and level set
	socket.on('delete-json-set', (dat) =>{
		jsonjs.deleteALSReport(dat['agent'],dat['levelSet']);
		console.log(`-- DELETED REPORT FOR [ ${dat['agent']} ] ON LEVEL SET [ ${dat['levelSet']} ] --`)
		io.emit('reset-agent-json', []);
	});




	//initialize the ascii map 
	socket.on('reset-map', (dat) =>{
		console.log(`LOADING NEW MAP: \n${dat['ascii_map']}`);
		guijs.initMap(dat['ascii_map']);
	});

	//go through next step and update the map
	socket.on('step-map', (dat) =>{
		let d = guijs.updateMap(dat['step']);
		io.emit('new-map', d);
	});

	//get the map key dictionary
	socket.on('get-map-key', () =>{
		let mk = simjs.getMapKey();
		io.emit('ret-map-key',mk);
	});


	//check if the agent and level set exist
	socket.on('als_exists',(dat) =>{
		if(!jsonjs.agent_exists(dat["agent"])){io.emit('agent-404');} 
		if(!jsonjs.level_set_exists(dat["levelSet"])){io.emit('level-set-404');} 
		io.emit("set-als")
	});

});




//listen on port 'localhost:8080' for incoming sockets
server.listen(PORT, () => {
	console.log(`listening on localhost: ${PORT} ...`);	
});
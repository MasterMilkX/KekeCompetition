////  IMPORTS  ////

//import express
const express = require('express');
const app = express();
app.use(express.static(__dirname));
app.use('favicon.ico', express.static('favicon.ico'));

//import http server
const http = require('http');
const server = http.createServer(app);

//import socket io library for communication
const { Server } = require("socket.io");
const io = new Server(server);

//file I/O
const fs = require('fs');

//import level imports
const jsonjs = require('./js/json_io');

//import execution code
const execjs = require('./js/exec');






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


//get the level set for the agent to populate the level table
io.on('connection', (socket) => {
	socket.on('get-level-set', (dat) =>{
		let ls = dat['levelSet'];
		console.log(`-- RETRIEVING LEVEL SET [ ${ls} ] --`)
		let j = jsonjs.getLevelSet(ls);
		if(j != null){
			io.emit('return-level-json', j);
		}else{
			console.log("ERROR: JSON NOT FOUND!")
		}

	})
});

//get agent json
io.on('connection', (socket) => {
	socket.on('get-agent-json', (dat) =>{
		console.log(`-- RETRIEVING AGENT REPORT [ ${dat['agent']} ]`)
		sendReport(dat);
	})
});


//start training an agent on specific level set
io.on('connection', (socket) => {
	socket.on('solve-level', (dat) => {
		console.log(`-- SOLVING LEVEL [ ${dat['levelID']} ] FROM LEVEL SET [ ${dat['levelSet']} ] WITH AGENT [ ${dat['agent']} ] --`);
		solveLevel(dat['levelSet'],dat['levelID'],dat['agent']);
	});
});


io.on('connection', (socket) =>{
	socket.on('delete-json-set', (dat) =>{
		jsonjs.deleteALSReport(dat['agent'],dat['levelSet']);
		console.log(`-- DELETED REPORT FOR [ ${dat['agent']} ] ON LEVEL SET [ ${dat['levelSet']} ] --`)
		io.emit('reset-agent-json', []);
	});
});



//listen on port 'localhost:8080' for incoming sockets
server.listen(8080, () => {
	console.log('listening on localhost:8080');	
});
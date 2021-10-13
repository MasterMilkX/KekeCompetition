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
const fs = require('fs')

//import level imports
const jsonjs = require('./js/json_io')


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



////     SERVER INTERACTIONS     ////


//get the level set for the agent to populate the level table
io.on('connection', (socket) => {
	socket.on('get-level-set', (dat) =>{
		let ls = dat['levelSet']+"_LEVELS";
		console.log(`-- RETRIEVING LEVEL SET [ ${ls} ] --`)
		let j = jsonjs.getLevelSet(ls);
		if(j != null){
			io.emit('return-level-json', j);
		}else{
			console.log("ERROR: JSON NOT FOUND!")
		}

	})
});


//start training an agent on specific level set
io.on('connection', (socket) => {
	socket.on('start run', (dat) => {
		console.log(`-- RUNNING [ ${dat['agent']} ] ON LEVEL SET [ ${dat['levelSet']} ] --`);


		//go through all of the levels




	});
});





//listen on port 'localhost:8080' for incoming sockets
server.listen(8080, () => {
	console.log('listening on localhost:8080');	
});
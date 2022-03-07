// BABA IS Y'ALL SOLVER - BAD AGENT TEMPLATE
// Bad because missing function calls in the module.exports
// Version 1.0
// Code by Milk 


//get imports (NODEJS)
var simjs = require('../js/simulation')					//access the game states and simulation

let possActions = ["space", "right", "up", "left", "down"];

var MAX_SEQ = 50;


var an_action_set = []    //"best" solution

//returns a random sequence of directions
function makeSeq(){
	let s = [];
	for(let i=0;i<MAX_SEQ;i++){
		let action = possActions[Math.floor(Math.random()*possActions.length)];
		s.push(action);
	}
	an_action_set = s;
	return s;
}


// NEXT ITERATION STEP FOR SOLVING
function iterSolve(init_state){
	// return a list of random movements
	return makeSeq();
}



// VISIBLE FUNCTION FOR OTHER JS FILES (NODEJS)
module.exports = {
	step : function(init_state){return iterSolve(init_state)},		// iterative step function (returns solution as list of steps from poss_actions or empty list)
	//init : function(init_state){},									// initializing function here
	//best_sol : function(){}
}



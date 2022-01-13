// BABA IS Y'ALL SOLVER BFS AI - KEKE 
// Version 2.0
// Code by Milk 


//get imports (NODEJS)
var simjs = require('../js/simulation')


var agentJSON = "report.json";

let possActions = ["space", "right", "up", "left", "down"];
let stateSet = [];

let curIteration = 0;

let queue = [];


// NODE CLASS FOR EXPLORATION
function node(m, a, p, w, d){
	this.mapRep = m;
	this.actionSet = a;
	this.parent = p;
	this.win = w;
	this.died = d;
}

// CHECK IF 2 ARRAYS ARE EQUAL
function arrEq(a1,a2){
	if(a1.length != a2.length)
		return false;
	for(let a=0;a<a1.length;a++){
		if(a1[a] != a2[a])
			return false;
	}
	return true;
}

// COPIES ANYTHING NOT AN OBJECT
// DEEP COPY CODE FROM HTTPS://MEDIUM.COM/@ZIYOSHAMS/DEEP-COPYING-JAVASCRIPT-ARRAYS-4D5FC45A6E3E
function deepCopy(arr){
  let copy = [];
  arr.forEach(elem => {
    if(Array.isArray(elem)){
      copy.push(deepCopy(elem))
    }else{
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
    } else {
        copy.push(elem)
      }
    }
  })
  return copy;
}

// DEEP COPY AN OBJECT
function deepCopyObject(obj){
  let tempObj = {};
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value);
    } else {
      if (typeof value === 'object') {
        tempObj[key] = deepCopyObject(value);
      } else {
        tempObj[key] = value
      }
    }
  }
  return tempObj;
}

// CREATE NEW GAME STATE state AND RESET THE MAP PROPERTIES
function newstate(keke_state, m){
	simjs.clearLevel(keke_state);

	keke_state['orig_map'] = m;

	var maps = simjs.splitMap(keke_state['orig_map']);
	keke_state['back_map'] = maps[0]
	keke_state['obj_map'] = maps[1];
	
	simjs.assignMapObjs(keke_state);
	simjs.interpretRules(keke_state);
}

// RESET THE QUEUE AND THE ITERATION COUNT
function initQueue(state){
	//loop until the limit is reached
	curIteration = 0;
	stateSet = [];

	//create the initial node
	let master_node = new node(simjs.map2Str(state['orig_map']), [], null, false, false);
	queue = [[0, master_node]];
}




// NEXT ITERATION STEP FOR SOLVING
function iterSolve(init_state){
	if(queue.length < 1)
		return [];

	//pop the next node off the queue and get its children
	let curnode = queue.shift()[1];
	children = getChildren(init_state['orig_map'], curnode);

	//check if golden child was found
	for(let c=0;c<children.length;c++){
		stateSet.push(children[c][1].mapRep);
		//console.log(children[c].mapRep);
		if(children[c][1].win){
			//console.log(children[c][1].actionSet);
			return children[c][1].actionSet;
		}
	}

	//otherwise add to the list and sort it for priority
	queue.push.apply(queue, children);
	queue.sort();
	curIteration++;
	
	return [];
}

// GETS THE CHILD STATES OF A NODE
function getChildren(rootMap, parent){
	let children = [];

	for(let a=0;a<possActions.length;a++){
		//remake state everytime
		let n_kk_p = {};
		newstate(n_kk_p, rootMap)

		//let n_kk_p = deepCopyObject(rootstate);
		let childNode = getNextState(possActions[a], n_kk_p, parent);

		//add if not already in the queue
		if(stateSet.indexOf(childNode[1].mapRep) == -1 && !childNode[1].died)
			children.push(childNode);
		//console.log(outMap);
	}
	return children;
}

// RETURNS AN ASCII REPRESENTATION OF THE MAP STATE AFTER AN ACTION IS TAKEN
function getNextState(dir, state, parent){
	//get the action space from the parent + new action
	let newActions = [];
	newActions.push.apply(newActions, parent.actionSet);
	newActions.push(dir);

	//console.log("before KEKE (" + newActions + "): \n" + simjs.doubleMap2Str(state.obj_map, state.back_map))

	//move the along the action space
	let didwin = false;
	for(let a=0;a<newActions.length;a++){
		let res = simjs.nextMove(newActions[a],state);
		state = res['next_state'];
		didwin = res['won'];

		//everyone died
		if(state['players'].length == 0){
			didwin = false;
			break;
		}

	}

	//return distance from nearest goal for priority queue purposes
	let win_d = heuristic2(state['players'], state['winnables']);
	let word_d = heuristic2(state['players'], state['words']);
	let push_d = heuristic2(state['players'], state['pushables']);
	//console.log(d);
	//console.log("after KEKE (" + newActions + "): \n" + simjs.doubleMap2Str(state.obj_map, state.back_map));


	return [(win_d+word_d+push_d)/3, new node(simjs.doubleMap2Str(state.obj_map, state.back_map), newActions, parent, didwin, (state['players'].length == 0))]
}


// FIND AVERAGE DISTANCE OF GROUP THAT IS CLOSEST TO ANOTHER OBJECT IN A DIFFERENT GROUP
function heuristic2(g1, g2){
	let allD = [];
	for(let g=0;g<g1.length;g++){
		for(let h=0;h<g2.length;h++){
			let d = dist(g1[g], g2[h]);
			allD.push(d);
		}
	}

	let avg = 0;
	for(let i=0;i<allD.length;i++){
		avg += allD[i];
	}
	return avg/allD.length;
}

// BASIC EUCLIDEAN DISTANCE FUNCTION FROM OBJECT A TO OBJECT B
function dist(a,b){
	return (Math.abs(b.x-a.x)+Math.abs(b.y-a.y));
}



// VISIBLE FUNCTION FOR OTHER JS FILES (NODEJS)
module.exports = {
	step : function(init_state){return iterSolve(init_state)},
	init : function(init_state){initQueue(init_state);},
	best_sol : function(){return (queue.length > 1 ? queue.shift()[1].actionSet : []);}
}



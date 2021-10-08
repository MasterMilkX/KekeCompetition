// BABA IS Y'ALL SOLVER BFS AI - KEKE 
// Version 2.0
// Code by Milk 
module.exports = {

	possActions : ["", "right", "up", "left", "down"],
	stateSet : [],

	MAX_ITER : 10000,
	curIteration : 0,

	queue : [],

	// NODE CLASS FOR EXPLORATION
	node: function (m, a, p, w, d){
		this.mapRep = m;
		this.actionSet = a;
		this.parent = p;
		this.win = w;
		this.died = d;
	},

	// CHECK IF 2 ARRAYS ARE EQUAL
	arrEq: function (a1,a2){
		if(a1.length != a2.length)
			return false;
		for(let a=0;a<a1.length;a++){
			if(a1[a] != a2[a])
				return false;
		}
		return true;
	},

	// COPIES ANYTHING NOT AN OBJECT
	// DEEP COPY CODE FROM HTTPS://MEDIUM.COM/@ZIYOSHAMS/DEEP-COPYING-JAVASCRIPT-ARRAYS-4D5FC45A6E3E
	deepCopy: function (arr){
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
	},

	// DEEP COPY AN OBJECT
	deepCopyObject: function (obj){
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
	},

	// CREATE NEW GAME STATE PARAMETERS AND RESET THE MAP PROPERTIES
	newParameters: function (keke_parameters, m){
		clearLevel(keke_parameters);

		keke_parameters['orig_map'] = m;
		makeImgHash();

		var maps = splitMap(keke_parameters['orig_map']);
		keke_parameters['back_map'] = maps[0]
		keke_parameters['obj_map'] = maps[1];
		
		assignMapObjs(keke_parameters);
		interpretRules(keke_parameters);
	},



	// SOLVES THE MAP USING BFS ON THE GAME NODES
	ot : 0,
	solve: function (init_parameters, callback){
		//console.log(parameters.sort_phys);

		//loop until the limit is reached
		curIteration = 0;
		stateSet = [];

		//create the initial node
		let master_node = new node(map2Str(init_parameters['orig_map']), [], null, false, false);
		queue = [[0, master_node]];

		ot = setInterval(function(){
			let solution = iterSolve(init_parameters);

			//found the solution!
			if(solution.length > 0){
				console.log("got em!")
				console.log(solution)
				clearInterval(ot);
				ot = 0;
				callback(solution);
			}

			//if end of queue or max iterations
			if(queue.length < 1 || curIteration >= MAX_ITER){
				console.log("end of the line")
				clearInterval(ot);
				ot = 0;
				callback([]);
			}

		}, 1);
	},	

	// NEXT ITERATION STEP FOR SOLVING
	iterSolve: function (init_parameters){
		if(queue.length < 1 || curIteration >= MAX_ITER)
			return [];

		//console.log(queue);
		let curnode = queue.shift()[1];

		if(curIteration % 1000 == 0){
			console.log(stateSet);
		}

		children = getChildren(init_parameters['orig_map'], curnode);

		//check if golden child was found
		for(let c=0;c<children.length;c++){
			stateSet.push(children[c][1].mapRep);
			//console.log(children[c].mapRep);
			if(children[c][1].win){
				console.log(curIteration + "/" + MAX_ITER);
				return children[c][1].actionSet;
			}
		}

		//console.log(i + "-> +" + children.length + " children / " + queue.length + " queue size");

		//otherwise add to the list (if there's enough room) and sort it for priority
		if(queue.length < (MAX_ITER - curIteration)){
			queue.push.apply(queue, children);
			queue.sort();
			curIteration++;
		}
		return [];
	},

	// GETS THE CHILD STATES OF A NODE
	getChildren: function (rootMap, parent){
		let children = [];

		for(let a=0;a<possActions.length;a++){
			//remake parameters everytime
			let n_kk_p = {};
			newParameters(n_kk_p, rootMap)

			//let n_kk_p = deepCopyObject(rootParam);
			let childNode = getNextState(possActions[a], n_kk_p, parent);
		

			//add if not already in the queue
			if(stateSet.indexOf(childNode[1].mapRep) == -1 && !childNode[1].died)
				children.push(childNode);
			//console.log(outMap);
		}
		return children;
	},

	// RETURNS AN ASCII REPRESENTATION OF THE MAP STATE AFTER AN ACTION IS TAKEN
	getNextState: function (dir, new_kk_p, parent){
		//get the action space from the parent + new action
		let newActions = [];
		newActions.push.apply(newActions, parent.actionSet);
		newActions.push(dir);

		//console.log("before KEKE (" + newActions + "): \n" + doubleMap2Str(new_kk_p.obj_map, new_kk_p.back_map))

		//move the along the action space
		let didwin = false;
		for(let a=0;a<newActions.length;a++){
			let moved_objects = [];

			if(newActions[a] != "")
				movePlayers(newActions[a], moved_objects, new_kk_p);
				
			//move any npcs
			moveAutoMovers(moved_objects, new_kk_p);

			//update the rule set if this object is a rule
			for(var m=0;m<moved_objects.length;m++){
				if(moved_objects[m].type == "word"){
					interpretRules(new_kk_p);
				}
			}

			didwin = win(new_kk_p['players'], new_kk_p['winnables']);

			if(new_kk_p['players'].length == 0){
				break;
			}

		}

		//return distance from nearest goal for priority queue purposes
		let win_d = heuristic2(new_kk_p['players'], new_kk_p['winnables']);
		let word_d = heuristic2(new_kk_p['players'], new_kk_p['words']);
		let push_d = heuristic2(new_kk_p['players'], new_kk_p['pushables']);
		//console.log(d);
		//console.log("after KEKE (" + newActions + "): \n" + doubleMap2Str(new_kk_p.obj_map, new_kk_p.back_map));


		return [(win_d+word_d+push_d)/3, new node(doubleMap2Str(new_kk_p.obj_map, new_kk_p.back_map), newActions, parent, didwin, (new_kk_p['players'].length == 0))]
	},


	// FIND AVERAGE DISTANCE OF GROUP THAT IS CLOSEST TO ANOTHER OBJECT IN A DIFFERENT GROUP
	heuristic2: function (g1, g2){
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
	},

	// BASIC EUCLIDEAN DISTANCE FUNCTION FROM OBJECT A TO OBJECT B
	dist: function (a,b){
		return (Math.abs(b.x-a.x)+Math.abs(b.y-a.y));
	},

	// RETURN THE CURRENT ITERATIONS OVER THE MAXIMUM ITERATION
	getIterRatio: function (){return curIteration + " / " + MAX_ITER;}
};

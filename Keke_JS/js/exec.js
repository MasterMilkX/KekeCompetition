const args = process.argv.slice(2)
var kekeAgent = args[0];


var kekejs = require('./' + kekeAgent)
var leveljs = require('./level-set')
var simjs = require('./simulation')


function run_keke(level, iterations){
	//setup state
	simjs.setupLevel(simjs.parseMap(level));
	let gp = simjs.getGameParam();
	//console.log(gp["orig_map"])
	kekejs.resetQueue();
	kekejs.initQueue(gp);


	//solve for # iterations
	for(let i=0;i<iterations;i++){
		let solution = kekejs.step(gp);

		// solution found
		if (solution.length > 0){
			console.log(`-- SOLUTION FOUND IN ${i} / ${iterations} ITERATIONS --`);
			return solution;
		}
	}

	console.log(`-- NO SOLUTION FOUND IN ${iterations} ITERATIONS--`);
	
}

function main(){
	let lvlSetNames = leveljs.importLevelSets();
	let lvlSet = leveljs.importLevels(lvlSetNames[0]);
	let lvl1 = lvlSet[0];
	console.log(lvl1);

	//run keke solver
	run_keke(lvl1.ascii,5000)

}

main();
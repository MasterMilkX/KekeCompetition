//read in command line arguments
const args = process.argv.slice(2)
var kekeAgent = (args.length > 0 ? args[0] : 'default');
var levelSetName = (args.length > 1 ? args[1] : 'demo_levels');
var levelNum = (args.length > 2 ? args[2] : 1);

//get node.js imports
var kekejs = require('../agents/' + kekeAgent)
var leveljs = require('./level-set')
var simjs = require('./simulation')

// RUN THE KEKE SOLVER ON A LEVEL
function run_keke(ascii_level, iterations){
	//setup state
	simjs.setupLevel(simjs.parseMap(ascii_level));
	let gp = simjs.getGameParam();

	//setup solver
	kekejs.resetQueue();
	kekejs.initQueue(gp);

	console.log("Solving...");

	//solve for # iterations
	for(let i=0;i<iterations;i++){
		let solution = kekejs.step(gp);

		// solution found
		if (solution.length > 0){
			console.log(`-- SOLUTION FOUND IN ${i} / ${iterations} ITERATIONS --`);
			return {"s":solution,"i":i};
		}
	}

	console.log(`-- NO SOLUTION FOUND IN ${iterations} ITERATIONS--`);
	return {"s":[],"i":iterations};
	
}

// SOLVE A SINGLE LEVEL FROM A LEVEL SET FOR A SET NUMBER OF ITERATIONS
function executeLevel(ls,ln,iter){
	let lvlSet = leveljs.getLevelSet(ls);
	let lvl = leveljs.getLevel(lvlSet,ln);
	console.log(` -- LEVEL [ ${ln} ] FROM LEVEL SET [ ${ls} ] FOR [ ${iter} ] ITERATIONS --`)

	//run keke solver
	const start = Date.now();		//start timer

	//solve level
	let r = run_keke(lvl.ascii,iter);
	let solution = r.s;
	let iterCt = r.i;

	const end = Date.now();
	let timeExec = (end-start)/1000;
	console.log(`SOLUTION: ${solution}`)

	//export to JSON if solution found
	leveljs.exportReport(kekeAgent + "_REPORT.json", ls, ln, iterCt, timeExec,solution);

}

// SOLVE ALL LEVELS IN A LEVEL SET FOR A SET NUMBER OF ITERATIONS
function executeLevelSet(ls,iter){
	let lvlSet = leveljs.getLevelSet(ls);

	console.log(`-- SOLVING [ ${lvlSet.length} ] LEVELS FROM LEVEL SET [ ${ls} ] FOR [ ${iter} ] ITERATIONS --`);

	for(let l=0;l<lvlSet.length;l++){
		let lvl = lvlSet[l];
		console.log(` LEVEL [ ${lvl.id} ] `)
		

		//run keke solver
		const start = Date.now();		//start timer

		//solve level
		let r = run_keke(lvl.ascii,iter);
		let solution = r.s;
		let iterCt = r.i;

		const end = Date.now();
		let timeExec = (end-start)/1000;

		//export to JSON if solution found
		leveljs.exportReport(kekeAgent + "_REPORT.json", ls, lvl.id, iterCt, timeExec,solution);

		console.log("");
	}
}


function main(){
	//executeLevel(levelSetName,levelNum,5000)
	executeLevelSet(levelSetName,5000);
}

main();
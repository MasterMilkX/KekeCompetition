//read in command line arguments
const args = process.argv.slice(2)
var kekeAgent = (args.length > 0 ? args[0] : 'default');
var levelSetName = (args.length > 1 ? args[1] : 'demo_levels');
var levelNum = (args.length > 2 ? args[2] : 1);

var TIMEOUT = 10.0;			//10s
var MAX_ITER = 10000;	

//get node.js imports
var kekejs = require('../agents/' + kekeAgent + '_AGENT')
var jsonjs = require('./json_io')
var simjs = require('./simulation')

const cluster = require('cluster')

// RUN THE KEKE SOLVER ON A LEVEL
function run_keke(ascii_level, iterations){
	//setup state
	simjs.setupLevel(simjs.parseMap(ascii_level));
	let gp = simjs.getGamestate();

	//setup solver
	kekejs.init(gp);

	console.log("Solving...");

	const start = Date.now();		//start timer

	//solve for # iterations
	let i=0;
	for(i=0;i<iterations;i++){
		//check if timed out
		if(timedOut(start)){break;}

		//try to find solution
		let solution = kekejs.step(gp);

		// solution found
		if (solution.length > 0){
			if(timedOut(start)){break;}		//does't count if timed out

			//cutoff timer
			let end = Date.now();
			let timeExec = (end-start)/1000;

			console.log(`-- SOLUTION FOUND IN ${i} / ${iterations} ITERATIONS | ${timeExec}s --`);
			return {"s":solution,"i":i, "t":timeExec};
		}
	}

	//cutoff timer
	let end = Date.now();
	let timeExec = (end-start)/1000;

	let REASON = (i == iterations ? `MAXED ITERATIONS (${iterations})` : `TIMED OUT (${TIMEOUT})s`)

	console.log(`-- NO SOLUTION FOUND: ${REASON}--`);
	return {"s":'',"i":iterations, "t":timeExec};
	
}

function timedOut(s){
	let maybe_end = Date.now();
	if((maybe_end - s)/1000 > TIMEOUT){
		return true;
	} 
	return false;
}

// SOLVE A SINGLE LEVEL FROM A LEVEL SET FOR A SET NUMBER OF ITERATIONS
function executeLevel(ls,ln,iter){
	let lvlSet = jsonjs.getLevelSet(ls);
	let lvl = jsonjs.getLevel(lvlSet,ln);
	console.log(` -- LEVEL [ ${ln} ] FROM LEVEL SET [ ${ls} ] FOR [ ${iter} ] ITERATIONS --`)

	//solve level
	let r = run_keke(lvl.ascii,iter);
	let solution = r.s;
	let iterCt = r.i;
	let timeExec = r.t;


	//export to JSON if solution found
	jsonjs.exportReport(kekeAgent + "_REPORT.json", ls, ln, iterCt, timeExec,solution);

}

// SOLVE ALL LEVELS IN A LEVEL SET FOR A SET NUMBER OF ITERATIONS
function executeLevelSet(ls,iter){
	let lvlSet = jsonjs.getLevelSet(ls);

	console.log(`-- SOLVING [ ${lvlSet.length} ] LEVELS FROM LEVEL SET [ ${ls} ] FOR [ ${iter} ] ITERATIONS --`);

	for(let l=0;l<lvlSet.length;l++){
		let lvl = lvlSet[l];
		console.log(` LEVEL [ ${lvl.id} ] `)

		//solve level
		let r = run_keke(lvl.ascii,iter);
		let solution = r.s;
		let iterCt = r.i;
		let timeExec = r.t;

		

		//export to JSON if solution found
		jsonjs.exportReport(kekeAgent + "_REPORT.json", ls, lvl.id, iterCt, timeExec,solution);

		console.log("");
	}
}


function main(){
	//executeLevel(levelSetName,levelNum,5000)
	executeLevelSet(levelSetName,MAX_ITER);
}

main();
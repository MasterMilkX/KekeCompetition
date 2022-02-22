// JSON_IO.JS -- NODE.JS INTERFACE FOR IMPORTING LEVELS + REPORTS FROM JSON FILES
// Written by Milk
// 10-8-21


const fs = require('fs')


////////   CHECK EXISTENCE OF FILES   /////////

function agentExists(agent){return fs.existsSync("agents/"+agent+"_AGENT.js");}
function levSetExists(ls){return fs.existsSync("json_levels/"+ls+".json");}




/////////    LEVEL SET JSON I/O    //////////


// IMPORT LEVEL SETS FROM THE JSON DIRECTORY
function importLevelSets(){
	const jsonDir = 'json_levels/'
	let jsonFiles = fs.readdirSync(jsonDir);
	jsonFiles = jsonFiles.filter(x => x[0] != '.');
	return jsonFiles;
}	

// PARSE THE JSON FORMAT OF THE LEVELS 
function importLevels(lvlsetJSON){
	let path = 'json_levels/'+lvlsetJSON+".json";
	if (!fs.existsSync(path)){return null;}		//no level set found

	let j = fs.readFileSync(path);
	let lvlset = JSON.parse(j);
	return lvlset.levels;
}


// IMPORT THE SET OF LEVELS BY NAME
function getLevelSet(name){
	return importLevels(name);
}

// IMPORT THE LEVEL BY ITS ID NUMBER
function getLevelObj(ls, id){
	if(typeof(ls) == 'string'){
		ls = getLevelSet(ls);
	}

	if(ls == null){return null}

	for(let l=0;l<ls.length;l++){
		let lvl = ls[l];
		if (lvl.id == id){
			return lvl;
		}
	}
	return null;
}




/////////    AGENT I/O    //////////

// RETURNS A LIST OF POSSIBLE AGENTS TO USE
function getAgentList(){
	const agentDir = 'agents/';
	let agentJS = fs.readdirSync(agentDir);
	agentJS = agentJS.filter(x => x[0] != '.');
	return agentJS;
}

// RETURN AGENT JSON REPORT [in form of object]
function importAgentReport(agent){
	let path = 'reports/'+agent+"_REPORT.json";

	if (!fs.existsSync(path)){console.log(`ERROR: no report found @ ${path}`);return null}

	let j = fs.readFileSync(path);
	let report = JSON.parse(j);
	return report;
}

// RETURN AGENT JSON REPORT FOR SPECIFIC LEVEL SET [in form of object]
function importAgentLevelSetReport(agent, lvlSet){
	let r = importAgentReport(agent);
	if(r == null){return null}	//no report made yet so just return the level set length

	//search for the report
	for(let i=0;i<r.length;i++){
		let ls = r[i];
		if (ls["levelSet"] == lvlSet){
			return ls["levels"];
		}
	}
	console.log(`ERROR: Level set not found in agent json reort`)
	return null;
}

// EXPORT THE RESULT FROM SOLVING A LEVEL TO THE AGENT'S JSON FILE
function exportAgentReport(file,ls,levelID,iterCt,timeTaken,sol,winner){
	let curReport = [];
	let filepath = "./reports/"+file;

	//if it exists, read in the current report
	try {
	  if (fs.existsSync(filepath)) {
	    let j = fs.readFileSync(filepath, 'utf8', err => {
	    	if (err){
	    		console.log(err);
	    		return;
	    	}
	    });
	    if(j != ""){
	    	//console.log("-- REPORT -- ")
	    	//console.log(j)
			curReport = JSON.parse(j);
	    }
		
	  }
	}catch(err){
		console.log("UH OH!"); 
		console.log(err);
	}

	//search for old level set
	let lsObj = curReport.find(o => o.levelSet === ls);

	//nothing in report yet or level set not found
	if(curReport.length == 0 || lsObj == null){
		//make new level set object
		lsObj = {levelSet: ls, levels:[]};

		//add the level
		let lvl = {id: levelID, iterations: iterCt, time:timeTaken, solution:sol, won_level:winner};
		lsObj.levels.push(lvl);

		//add new levelset entry
		curReport.push(lsObj);
	}
	//add a new entry or update an old one
	else{
		let lvl = lsObj.levels.find(o => o.id == levelID);

		//add a new entry to the set
		if(lvl == null){
			lvl = {id: levelID, iterations: iterCt, time:timeTaken, solution:sol, won_level:winner};
			lsObj.levels.push(lvl);
		} 
		//update an old entry if newer is faster
		else if((lvl.time > timeTaken) || (lvl.solution == "" && sol != "")){
			lvl = {id: levelID, iterations: iterCt, time:timeTaken, solution:sol, won_level:winner};
			let lvlInd = lsObj.levels.map(o => o.id).indexOf(levelID);
			lsObj.levels[lvlInd] = lvl;
		}
	}

	//update levelset object
	let lsInd = curReport.map(o => o.levelSet).indexOf(ls);
	curReport[lsInd] = lsObj;

	//create JSON string
	let crJSON = JSON.stringify(curReport,null,2);
	//console.log(crJSON);


	//overwrite the JSON file
	fs.writeFileSync(filepath,crJSON,err => {
		if (err) {
		    console.error(err);
		    return;
	  	}
	});

}

// DELETES THE REPORT FOR THE ASSOCIATED AGENT + LEVEL SET
function deleteAgentLevelSetReport(agent, lvlSet){
	let curReport = [];
	let filepath = "./reports/"+agent+"_REPORT.json";

	//if it exists, read in the current report
	try {
	  if (fs.existsSync(filepath)) {
	    let j = fs.readFileSync(filepath, 'utf8', err => {
	    	if (err){
	    		console.log(err);
	    		return;
	    	}
	    });
	    if(j != ""){
	    	//console.log("-- REPORT -- ")
	    	//console.log(j)
			curReport = JSON.parse(j);
	    }
		
	  }
	}catch(err){
		console.log("UH OH!"); 
		console.log(err);
	}
	
	//remove levelset object if it exists
	let lsInd = curReport.map(o => o.levelSet).indexOf(lvlSet);
	curReport[lsInd] = {"levelSet":lvlSet, "levels":[]};

	//create JSON string
	let crJSON = JSON.stringify(curReport,null,2);

	//overwrite the JSON file
	fs.writeFileSync(filepath,crJSON,err => {
		if (err) {
		    console.error(err);
		    return;
	  	}
	});

}




module.exports = {
	//level set I/O
	importLevelSets : function(){return importLevelSets();},
	importLevels : function(j){return importLevels(j);},
	getLevelSet : function(n){return getLevelSet(n);},
	getLevel : function(ls,i){return getLevelObj(ls,i);},

	//agent I/O
	getAgentList : function(){return getAgentList();},
	importAgentReport: function(a){return importAgentReport(a);},
	importALSReport: function(a, l){return importAgentLevelSetReport(a, l);},
	exportReport: function(f,ls,id,i,t,s,w){exportAgentReport(f,ls,id,i,t,s,w);},
	deleteALSReport: function(a,l){return deleteAgentLevelSetReport(a,l);},

	//existence
	agent_exists : function(a){return agentExists(a);},
	level_set_exists : function(l){return levSetExists(l);}

}
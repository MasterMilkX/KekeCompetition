const fs = require('fs')

// IMPORT LEVEL SETS FROM THE JSON DIRECTORY
function importLevelSets(){
	const jsonDir = 'json_levels/'
	jsonFiles = fs.readdirSync(jsonDir);
	return jsonFiles;
}	

// PARSE THE JSON FORMAT OF THE LEVELS 
function importLevels(lvlsetJSON){
	let path = 'json_levels/'+lvlsetJSON+".json";
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
	for(let l=0;l<ls.length;l++){
		let lvl = ls[l];
		if (lvl.id == id){
			return lvl;
		}
	}
	return null;
}

// MAIN FUNCTION TO RUN THE CODE
function main(){
	let levelSets = importLevelSets();
	console.log(levelSets);
	let levels = importLevels(levelSets[1]);
	console.log(levels[0])
}

//main();

module.exports = {
	importLevelSets : function(){return importLevelSets();},
	importLevels : function(j){return importLevels(j);},
	getLevelSet : function(n){return getLevelSet(n);},
	getLevel : function(ls,i){return getLevelObj(ls,i);}

}
const fs = require('fs')

// IMPORT LEVEL SETS FROM THE JSON DIRECTORY
function importLevelSets(){
	const jsonDir = 'json_levels/'
	jsonFiles = fs.readdirSync(jsonDir);
	return jsonFiles;
}	

// PARSE THE JSON FORMAT OF THE LEVELS 
function importLevels(lvlsetJSON){
	let path = 'json_levels/'+lvlsetJSON;
	let j = fs.readFileSync(path);
	let lvlset = JSON.parse(j);
	return lvlset.levels;
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
	importLevels : function(j){return importLevels(j);}

}
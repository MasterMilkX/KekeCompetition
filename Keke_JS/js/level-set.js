const fs = require('fs')


function importLevelSets(){
	const jsonDir = 'json_levels/'

	jsonFiles = []
	fs.readdir(jsonDir, (err, files) => {
	    files.forEach(file => {
	        console.log(file);
	        jsonFiles.push(file)
	    });
	});

	return jsonFiles;
}	

function main(){
	importLevelSets();
}

main();
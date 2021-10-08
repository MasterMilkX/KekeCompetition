const fs = require('fs')

let filepath = './test.txt'

function test(){
	try {
	  if (fs.existsSync(filepath)) {
	    let j = fs.readFileSync(filepath, 'utf8');
	    console.log("-- FILE -- ")
	    console.log(j)
		
	  }else{
	  	console.log("nothing")
	  }
	}catch(err){
		console.log("UH OH!"); 
		console.log(err);
	}
}

function test2(){
	try {
	  if (fs.existsSync(filepath)) {
	    let j = fs.readFileSync(filepath, 'utf8');
	    console.log("-- FILE -- ")
	    console.log(j)
		
	  }else{
	  	console.log("nothing")
	  }
	}catch(err){
		console.log("UH OH!"); 
		console.log(err);
	}


	let j = {name:"milk", age:23, num:Math.floor(Math.random()*100)+1};

	//overwrite the JSON file
	fs.writeFile(filepath,JSON.stringify(j, null, 2),err => {
		if (err) {
		    console.error(err);
		    return;
	  	}
	});
}

test2();
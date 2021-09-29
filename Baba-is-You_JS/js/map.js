// MAP.JS - MAP-ELITES CHROMOSOME SCRIPTING
// Version 2.0
// Code by Milk 

//CHECKS IF AN ELEMENT IS IN AN ARRAY
function inArr(arr, e){
	if(arr.length == 0)
		return false;
	return arr.indexOf(e) !== -1
}

// RETURNS THE CHROMOSOME REPRESENTATION FOR THE LEVEL BASED ON THE INITIAL RULE SET AND SOLUTION RULESET
function getChromosomeRep(initRules, endRules){
	let rep = "";

	//rule A : X-IS-X
	rep += (hasReflexive(initRules) ? "1" : "0");
	rep += (hasReflexive(endRules) ? "1" : "0");

	//rule B : X-IS-Y
	rep += (hasTransform(initRules) ? "1" : "0");
	rep += (hasTransform(endRules) ? "1" : "0");

	//rule C : X-IS-PUSH
	rep += (hasRule(initRules, "x-is-push") ? "1" : "0");
	rep += (hasRule(endRules, "x-is-push") ? "1" : "0");

	//rule D : X-IS-MOVE
	rep += (hasRule(initRules, "x-is-move") ? "1" : "0");
	rep += (hasRule(endRules, "x-is-move") ? "1" : "0");

	//rule E : X-IS-STOP
	rep += (hasRule(initRules, "x-is-stop") ? "1" : "0");
	rep += (hasRule(endRules, "x-is-stop") ? "1" : "0");

	//rule F : X-IS-KILL
	rep += (hasRule(initRules, "x-is-kill") ? "1" : "0");
	rep += (hasRule(endRules, "x-is-kill") ? "1" : "0");

	//rule G : X-IS-SINK
	rep += (hasRule(initRules, "x-is-sink") ? "1" : "0");
	rep += (hasRule(endRules, "x-is-sink") ? "1" : "0");

	//rule H : X-IS-[PAIR OBJECT]
	rep += (hasPair(initRules) ? "1" : "0");
	rep += (hasPair(endRules) ? "1" : "0");

	//rule I : [X,Y]-IS-YOU
	rep += (hasMultiYou(initRules) ? "1" : "0");
	rep += (hasDiffYou(initRules, endRules) ? "1" : "0");

	return rep;
}

// CONVERTS STRING CHROMOSOME REPRESENTATION TO LITERAL OBJECTIVE LIST
function rep2Str(r){
	let s = [];
	if(r.includes("A"))
		s.push("x-is-x");
	if(r.includes("B"))
		s.push("x-is-y");
	if(r.includes("C"))
		s.push("x-is-push");
	if(r.includes("D"))
		s.push("x-is-move");
	if(r.includes("E"))
		s.push("x-is-stop");
	if(r.includes("F"))
		s.push("x-is-kill");
	if(r.includes("G"))
		s.push("x-is-sink");
	if(r.includes("H"))
		s.push("x-is-[pair]");
	if(r.includes("I"))
		s.push("[x,y]-is-you");

	return s;
}

// TRANSLATES THE CHROMOSOME BINARY REPRESENTATION TO A READABLE HUMAN FORMAT
function translateChromo(rep){
	let str = "";
	let ruleset = ["A","B","C","D","E","F","G","H","I"];
	for(let x=0;x<ruleset.length;x++){
		let combo = rep.substring(x*2,x*2+2);
		if (combo == "10")
			str += (str.length > 0 ? "_" : "") + (ruleset[x] + "1");
		else if(combo == "01")
			str += (str.length > 0 ? "_" : "") + (ruleset[x] + "2");
		else if(combo == "11")
			str += (str.length > 0 ? "_" : "") + (ruleset[x] + "12");
	}
	return (str == "" ? "NO-RULES" : str);
}

// CONVERTS STRING BASED CHROMOSOME REPRESENTATION TO BINARY STRING REPRESENTATION
function str2Rep(s){
	let ruleset = ["A","B","C","D","E","F","G","H","I"];
	let binStr = "";


	let parts = s.split("_");
	for(let r=0;r<ruleset.length;r++){
		if(inArr(parts, ruleset[r]+'1'))
			binStr += "10";
		else if(inArr(parts, ruleset[r]+'2'))
			binStr += "01";
		else if(inArr(parts, ruleset[r]+'12'))
			binStr += "11";
		else 
			binStr += "00";
	}
	return binStr;
}

// RETURNS THE FULL LIST OF CHROMOSOMES GIVEN SOME CONSTRAINTS
// i.e. constraintStr = "01..01..00..11..00..1." (regex)
function getFullChromoList(constraintStr){
	if(constraintStr == "")
		constraintStr = "..................";

	let chromoList = [];
	for(let c=0;c<262144;c++){
		chromoList.push((c).toString(2).padStart(18,"0"));
	}

	let re = new RegExp(constraintStr, "g");
	return chromoList.filter(c => c.match(re));
}

// REVERSES THE NUMBERS
function getFullChromoListRevr(constraintStr){
	let fcl = getFullChromoList(constraintStr);
	return fcl.map(x => x.split("").reverse().join(""));
}

// CHECKS IF A SPECIFIC RULE IS PRESENT IN A CHROMOSOME
function hasRule(ruleset, rule){
	for(let r=0;r<ruleset.length;r++){
		let parts = ruleset[r].split("-");
		parts[0] = "x";
		let genRule = parts.join("-");
		if(rule == genRule)
			return rule;
	}
	return false;
}

// CHECK IF HAS X-IS-X
function hasReflexive(ruleset){
	for(let r=0;r<ruleset.length;r++){
		let parts = ruleset[r].split("-");
		if(parts[0] == parts[2])
			return true;
	}
	return false;
}

// CHECK IF HAS X-IS-Y
function hasTransform(ruleset){
	for(let r=0;r<ruleset.length;r++){
		let parts = ruleset[r].split("-");
		let p1 = reverseChar(parts[0]+"_word");
		let p2 = reverseChar(parts[2]+"_word");
		if(p1 && p1.match(/[A-Z]/) && p2 && p2.match(/[A-Z]/) && (parts[0] != parts[2]))
			return true;
	}
	return false;
}

// CHECK IF HAS FEATURE PAIR-BASED RULES
function hasPair(ruleset){
	//turn into x-is-pair
	let newFeats = [];
	for(let f=0;f<featPairs.length;f++){
		let p = [];
		for(let g=0;g<2;g++){
			p.push("x-is-"+featPairs[f][g]);
		}
		newFeats.push(p);
	}

	//turn into x-is-___ rules
	let newRules = [];
	for(let r=0;r<ruleset.length;r++){
		let parts = ruleset[r].split("-");
		parts[0] = "x";
		let newRule = parts.join("-");
		newRules.push(newRule);
	}

	//check if the pairs exist
	for(let f=0;f<newFeats.length;f++){
		if(inArr(newRules, newFeats[f][0]) && inArr(newRules, newFeats[f][1]))
			return true;
	}

	return false;
}

// CHECK IF RULESET HAS MULTIPLE DIFFERENT X-IS-YOU
function hasMultiYou(ruleset){
	let yous = ruleset.filter(rule => rule.includes("-is-you"));
	let unique_yous = yous.filter((value, index, self) => {return self.indexOf(value) === index;});
	return unique_yous.length > 1;
}

// CHECK IF INITIAL RULES HAS DIFFERENT X-IS-YOU THAN Y-IS-YOU
function hasDiffYou(rulesA, rulesB){
	let yousA = rulesA.filter(rule => rule.includes("-is-you"));
	let yousB = rulesB.filter(rule => rule.includes("-is-you"));

	if(yousA.length == 0 || yousB.length == 0)
		return false;

	//different amount of X-IS-YOU
	if(yousA.length != yousB.length)
		return true;

	//check for consistency
	for(let r=0;r<yousA.length;r++){
		if(!inArr(yousB, yousA[r]))
			return true;
	}
	return false;
}
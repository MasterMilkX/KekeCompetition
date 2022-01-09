//import execution code
const execjs = require('./js/exec');

//parse parameters
let ls = process.argv[2];
let agent_file = process.argv[3];
let agent_name = agent_file.replace("_AGENT.js","")[0]; 

//run execution on level set
execjs.solveLevelSet()
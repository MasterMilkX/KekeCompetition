# KekeCompetition - JS Version

---
### Introduction
Framework for the Keke Competition - an AI competition for the puzzle game 'Baba is You'.
This version uses the JS implementation originally found on the [Baba is Y'all](http://equius.gil.engineering.nyu.edu/) website

### Requirements
* NodeJS
* Web-browser (preferably Google Chrome)
* Terminal
* A text editor (for creating agents)

### Installation
1. Clone this repository to your local machine
2. Download and install the package manager [NodeJS](https://nodejs.org/en/download/)
3. Open a terminal and navigate to the [KekeJS](.) folder
4. Run the command `npm install` to install the necessary packages found in the [package-lock.json](package-lock.json) file

### Usage
#### Start the server: 
1. Run the command `nodemon index-server.js`. 
2. In a browser, go to the URL `localhost:8080` 
    *Note*: this port number can be changed on _line 15_ in the [index-server.js](index-server.js) file. 
    There will be an error with NodeJS if the port is already in use.

### Quick Start
1. To create a new agent, copy the `empty_AGENT.js` file and rename it with the following convention: 
`[NAME]_AGENT.py`. 
2. Modify the `step()` and `init()` functions in the agent code.
3. In the evaluator app on your browser, select your agent from the dropdown on the right
4. Select the level set you want to test on from the dropdown on the right
5. Press 'Run Agent' to evaluate the levels from the selected level set

For more information, check the [competition wiki](https://github.com/MasterMilkX/KekeCompetition/wiki)

### License
[MIT](https://choosealicense.com/licenses/mit/)

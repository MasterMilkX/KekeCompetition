//Baba is Y'all mechanic/rule base
//Version: 2.0
//Code by Milk 

//assign ascii values to images
var map_key = {}
map_key['_'] = "border";
map_key[' '] = "empty";
//map_key['.'] = "empty";
map_key['b'] = "baba_obj";
map_key['B'] = "baba_word";
map_key['1'] = "is_word";
map_key['2'] = "you_word";
map_key['3'] = "win_word";
map_key['s'] = "skull_obj";
map_key['S'] = "skull_word";
map_key['f'] = "flag_obj";
map_key['F'] = "flag_word";
map_key['o'] = "floor_obj";
map_key['O'] = "floor_word";
map_key['a'] = "grass_obj";
map_key['A'] = "grass_word";
map_key['4'] = "kill_word";
map_key['l'] = "lava_obj";
map_key['L'] = "lava_word";
map_key['5'] = "push_word";
map_key['r'] = "rock_obj";
map_key['R'] = "rock_word";
map_key['6'] = "stop_word";
map_key['w'] = "wall_obj";
map_key['W'] = "wall_word";
map_key['7'] = "move_word";
map_key['8'] = "hot_word";
map_key['9'] = "melt_word";
map_key['k'] = "keke_obj";
map_key['K'] = "keke_word";
map_key['g'] = "goop_obj";
map_key['G'] = "goop_word";
map_key['0'] = "sink_word";
map_key['v'] = "love_obj";
map_key['V'] = "love_word";

var imgHash = {}

var features = ["hot", "melt", "open", "shut", "move"];
var featPairs = [["hot", "melt"], ["open", "shut"]];
/*
var featPairs = {};
featPairs["hot"] = "melt";
featPairs["melt"] = "hot";
featPairs["open"] = "shut";
featPairs["shut"] = "open";
*/

/*
var words = []
var phys = [];
var sort_phys = {};

var is_connectors = [];
var rules = [];
var rule_objs = [];
var rule_groups = {};

var players = [];
var automovers = [];
var winnables = [];
var pushables = [];
var stoppables = [];
var killers = [];
var featured = {};		//in the form %{feature} => [spr_a, spr_b, ...]
var overlaps = [];
var unoverlaps = [];
var sinkers = [];
*/

/*
var level1 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','B','1','2',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level2 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ','r',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','R','1','5',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','1','_'],
	['_','B','1','2',' ',' ',' ',' ','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level3 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ','r',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','R',' ',' ',' ',' ',' ','F','_'],
	['_',' ',' ','1',' ',' ',' ',' ','1','_'],
	['_','B','1','2',' ',' ',' ',' ','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level4 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ','r',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','F','_'],
	['_',' ',' ',' ','R',' ',' ',' ','1','_'],
	['_',' ','B','1','2',' ',' ',' ','3','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level5 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ','f',' ','_'],
	['_',' ',' ',' ',' ','B',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','1','_'],
	['_',' ','B','1','2',' ',' ','1','3','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level6 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ','W','1','6','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','w','w','w','w','w','w','w','w','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ','f',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','3','_'],
	['_','B','1','2',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level7 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','S','b',' ','s','s','s',' ','_'],
	['_',' ','1',' ',' ','s','f','s',' ','_'],
	['_',' ','4',' ',' ','s','s','s','F','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','1','_'],
	['_',' ','B','1','2',' ',' ',' ','3','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level8 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','r',' ',' ',' ','f',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','s','s','s','s','s','s','s','s','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','F','_'],
	['_',' ','R',' ',' ',' ','b',' ','1','_'],
	['_','B','1','2',' ',' ',' ',' ','3','_'],
	['_',' ',' ',' ','S','1','4',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level9 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ','B','1','2','_'],
	['_',' ','b',' ',' ',' ','1',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','9',' ',' ','_'],
	['_',' ',' ',' ',' ','k',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','K','1','8',' ',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level10 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ','B','1','2','_'],
	['_',' ','b',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ','5',' ','k',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','K','1','7',' ',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level11 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ','G','1','0','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','g','g','g','g','g','g','g','g','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ','f',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','3','_'],
	['_','B','1','2',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level12 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ','r',' ','G','1','0','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','g','g','g','g','g','g','g','g','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ','f',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','3','_'],
	['_','B','1','2',' ',' ','R','1','5','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

var level13 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ','S','1',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','F',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ','s',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','B','1','2',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]
var level14 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ','S','1',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','F',' ',' ','_'],
	['_',' ','S','1','S',' ',' ','s',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','B','1','2',' ',' ',' ','F','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]
*/

//movement
var level1 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','B','1','2',' ',' ','F','1','3','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//push words
var level2 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','B','1','2',' ',' ',' ','1','3','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','F',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//change rules
var level3 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ','B','1','2',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','1',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','3',' ',' ','b',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//different objects
var level4 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','B','1','3',' ',' ','F','1','2','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ','f',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','a',' ',' ',' ',' ','v',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','A','1','3',' ',' ','V','1','2','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//change sprites X-is-Y
var level5 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','B','1','2',' ',' ','F','1','3','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ','r',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ','R',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ','1','F','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//override change sprites X-is-X
var level6 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','B','1','2',' ',' ','F','1','3','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ','r',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','R','1','R',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','R','1','F','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//X-is-PUSH
var level7 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','B','1','2',' ',' ','F','1','3','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ','r','r',' ',' ',' ','_'],
	['_',' ',' ','r',' ','f','r',' ',' ','_'],
	['_',' ',' ','r',' ',' ','r',' ',' ','_'],
	['_',' ',' ',' ','r','r',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','R','1','5','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//X-IS-MOVE
/*
var level8 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','b',' ',' ',' ',' ',' ','f','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ','B',' ',' ',' ','k','_'],
	['_',' ',' ','K','1','7',' ',' ',' ','_'],
	['_',' ',' ',' ','2',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','F','1','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]
*/
var level8 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','K',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','1','k',' ','B',' ',' ','1','2','_'],
	['_','7',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ','b',' ','f',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','F','1','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//X-IS-STOP
var level9 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ','f',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','w','w','w','w','w','w','w','w','_'],
	['_',' ','W',' ',' ',' ',' ',' ',' ','_'],
	['_',' ','1',' ',' ','b',' ',' ',' ','_'],
	['_',' ','6',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','B','1','2',' ',' ','F','1','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//X-IS-KILL
var level10 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','S','1','4',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ','s','s','s',' ','_'],
	['_',' ','b',' ',' ','s','f','s',' ','_'],
	['_',' ',' ',' ',' ','s','s','s',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','B','1','2',' ',' ','F','1','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//X-IS-SINK
var level11 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','B','1','2','g','g',' ',' ',' ','_'],
	['_','F','1','3','g','g',' ','f',' ','_'],
	['_','g','b','g','g','g',' ',' ',' ','_'],
	['_','g',' ','g','g','g','g','g','g','_'],
	['_','g',' ','g','g','g','g','g','g','_'],
	['_','g',' ','g','g',' ',' ',' ',' ','_'],
	['_','g',' ',' ',' ',' ','G','1','0','_'],
	['_','g','g','g','g',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]
//X-IS-SINK 2
var level12 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_','B','1','2','g','g',' ',' ',' ','_'],
	['_','F','1','3','g','g',' ','f',' ','_'],
	['_','g','b','g','g','g',' ',' ',' ','_'],
	['_','g',' ','g','g','g','g','g','g','_'],
	['_','g',' ','g','g','g','g','g','g','_'],
	['_','G',' ','g','g','g',' ','r','r','_'],
	['_','1',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','0','R','1','5','g',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//X-IS-[PAIR]
var level13 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ','f',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','l','l','l','l','l','l','l','l','_'],
	['_','L',' ',' ',' ',' ',' ','B',' ','_'],
	['_','1',' ',' ',' ','b',' ','1',' ','_'],
	['_','8',' ',' ',' ',' ',' ','9',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','B','1','2',' ',' ','F','1','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]

//[X,Y]-IS-YOU
var level14 = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ','k',' ',' ','f',' ',' ','_'],
	['_','w','w','w','w','w','w','w','w','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','W','_'],
	['_',' ',' ','K',' ',' ','b',' ','1','_'],
	['_',' ',' ',' ',' ',' ',' ',' ','6','_'],
	['_','B','1','2',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ','F','1','3','_'],
	['_','_','_','_','_','_','_','_','_','_']
]


var blank_level = [
	['_','_','_','_','_','_','_','_','_','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_',' ',' ',' ',' ',' ',' ',' ',' ','_'],
	['_','_','_','_','_','_','_','_','_','_']
]


var demoLevels = [level1, level2, level3, level4, level5, level6, level7, level8, level9, level10, level11, level12, level13, level14]
var demoLevelChromos = ["000000000000000000","000011000000000000", "000000000000000001", "000000000000000000", "000000000000000000", "000000001000000000", "000000000010000000", "000000000011000001", "000000000000001000", "000001100000000000", "000000000000100000", "000011000000110000", "000100000000000000", "100100000000000000", ]

var oppDir = {};
oppDir["left"] = "right";
oppDir["right"] = "left";
oppDir["up"] = "down";
oppDir["down"] = "up";


function phys_obj(name, img, x, y){
	this.type = "phys";
	this.name = name;
	this.x = x;
	this.y = y;
	this.img = img;
	this.is_movable = false;
	this.is_stopped = false;
	this.feature = "";
	this.dir = "";
}

function word_obj(name, img, obj,x,y){
	this.type = "word";
	this.name = name;
	this.x = x;
	this.y = y;
	this.img = img;
	this.obj = obj;
	this.is_movable = true;
	this.is_stopped = false;
}

///////////////    GAME SPECIFIC FUNCTIONS   //////////////

//get all of the characters for a given level map and assign store their character images
function makeImgHash(){

	//iterate through each character
	var chars = Object.keys(map_key);
	for(var r=0;r<chars.length;r++){
			var charac = chars[r];
			//character not yet saved in the image hash - so make a new entry
			if(!(charac in imgHash)){
				var i = new Image();
				i.src = "img/" + map_key[charac] + ".png";
				var ir = false;
				i.onload = function(){ir = true;};
				var i_arr = [i, ir];
				imgHash[charac] = i_arr;
			}
		
	}
}

function reverseChar(val){
	return Object.keys(map_key).find(key => map_key[key] === (val));
}

//check if all of the characters for the map are image ready
function mapReady(){
	makeImgHash();
	var allChars = Object.keys(map_key);
	
	//iterate through each character
	for(var r=0;r<allChars.length;r++){
			var charac = allChars[r];
			var img = imgHash[charac];

			if(img == undefined){
				console.log("something is wrong: " + charac)
				return false;
			}

			if(!img[1]){
				img[0].onload = function(){img[1] = true};
				if(img[0].width !== 0)
					img[1] = true;
				else
					return false;
			}
		
	}
	return true;
}

//assign the sprite objects to actual objects
//function assignMapObjs(m, phys, words, sort_phys, is_connectors){
function assignMapObjs(parameters){
	//reset the parameters
	parameters.sort_phys = {};
	parameters.phys = [];
	parameters.words = [];
	parameters.is_connectors = [];

	//retrieve parameters
	let m = parameters.obj_map;
	let phys = parameters.phys;
	let words = parameters.words;
	let sort_phys = parameters.sort_phys;
	let is_connectors = parameters.is_connectors;

/*
	sort_phys = {};
	phys = [];
	words = [];
	is_connectors = [];
*/

	//check if the map has been made yet
	if(m.length == 0){
		console.log("ERROR: Map not initialized yet");
		return false;
	}

	for(var r=0;r<m.length;r++){
		for(var c=0;c<m[0].length;c++){
			var charac = m[r][c];

			var base_obj = map_key[charac].split("_")[0];

			//word-based object
			if(map_key[charac].includes("word")){
				var w = new word_obj(base_obj, imgHash[charac][0], undefined, c,r);

				//add the base object to the word representation if it exists
				if(Object.values(map_key).indexOf((base_obj+"_obj")) != -1){
					w.obj = base_obj;
				}

				//add any "is" words
				if(base_obj == "is"){
					is_connectors.push(w);
				}

				//replace character on obj_map
				m[r][c] = w;

				words.push(w);
			}
			//physical-based object
			else if(map_key[charac].includes("obj")){
				var o = new phys_obj(base_obj, imgHash[charac][0], c, r);

				phys.push(o);

				//replace character on obj_map
				m[r][c] = o;

				//add to the list of objects under a certain name
				if(!(base_obj in sort_phys)){
					sort_phys[base_obj] = [o];
				}else{
					sort_phys[base_obj].push(o);
				}
			}
		}
	}
}

function initEmptyMap(m){
	var nm = [];
	for(var r=0;r<m.length;r++){
		var nr = [];
		for(var c=0;c<m[0].length;c++){
			nr.push(' ');
		}
		nm.push(nr);
	}
	return nm;
}

//populates 2 seperate maps (background map and object pos map)
function splitMap(m){
	var bm = initEmptyMap(m);
	var om = initEmptyMap(m);
	for(var r=0;r<m.length;r++){
		for(var c=0;c<m[0].length;c++){
			var charac = m[r][c];
			var parts = map_key[charac].split("_");

			if(parts.length == 1){	//background
				bm[r][c] = charac;
				om[r][c] = ' ';
			}else{					//object
				bm[r][c] = ' ';
				om[r][c] = charac;
			}
		}
	}
	return [bm,om];
}

//turns layer map into a string
function showMap(m){
	var str = "";
	for(var r=0;r<m.length;r++){
		for(var c=0;c<m[0].length;c++){
			var o = m[r][c];
			if(o != " " && o != "_"){
				str += reverseChar(o.name+(o.type == "word" ? "_word" : "_obj"));
			}
			else
				str += (o == " " ? "." : "+");
		}
		str += "\n";
	}
	return str;
}

//turns ascii map into a string
function map2Str(m){
	var str = "";
	for(var r=0;r<m.length;r++){
		for(var c=0;c<m[0].length;c++){
			var o = m[r][c];
			if(o != " ")
				str += o
			else
				str += ".";
		}
		str += "\n";
	}
	str = str.replace(/\n$/, "");
	return str;
}

function doubleMap2Str(om, bm){
	var str = "";
	for(var r=0;r<om.length;r++){
		for(var c=0;c<om[0].length;c++){
			var o = om[r][c];
			var b = bm[r][c];
			if(r == 0 || c == 0 || r == om.length-1 || c == om[0].length-1)
				str += "_";
			else if(o == " " && b == " ")
				str += ".";
			else if(o == " ")
				str += reverseChar(b.name+(b.type == "word" ? "_word" : "_obj"));
			else
				str += reverseChar(o.name+(o.type == "word" ? "_word" : "_obj"));
		}
		str += "\n";
	}
	str = str.replace(/\n$/, "");
	return str;
}

//turns a string object back into a 2d array
function parseMap(ms){
	var newMap = [];
	var rows = ms.split("\n");
	for(var r=0;r<rows.length;r++){
		var allPush = rows[r].replace(/\./g, " ").split("");
		newMap.push(allPush);
	}
	return newMap;
}

function parseMapWH(ms, w,h){
	let newMap = [];
	for(let r=0;r<h;r++){
		let allPush = ms.substring(r*w,r*w+w).replace(/\./g, " ").split("");
		newMap.push(allPush);
	}
	return newMap;
}

//get the object at a certain position (using object map)
function objAtPos(x,y,om){
	return om[y][x];
}

function isWord(e){
	if(e.type == undefined)
		return false;
	return e.type == "word";
}

function isPhys(e){
	if(e.type == undefined)
		return false;
	return e.type == "phys";
}


//get all functioning rules based on the IS connectors
//function interpretRules(om, bm, is_connectors, rules, rule_objs, sort_phys, phys, words, p, am, w, u, s, k, n, o, uo, f){
function interpretRules(parameters){

	//reset the rules (since a word object was changed)
	parameters.rules = [];			
	parameters.rule_objs = [];

	//get all the paramaeters
	let om = parameters['obj_map'];
	let bm = parameters['back_map'];
	let is_connectors = parameters['is_connectors'];
	let rules = parameters['rules'];
	let rule_objs = parameters['rule_objs'];
	let sort_phys = parameters['sort_phys'];
	let phys = parameters['phys'];
	let words = parameters['words'];
	let p = parameters['players'];
	let am = parameters['auto_movers'];
	let w = parameters['winnables'];
	let u = parameters['pushables'];
	let s = parameters['stoppables'];
	let k = parameters['killers'];
	let n = parameters['sinkers'];
	let o = parameters['overlaps'];
	let uo = parameters['unoverlaps'];
	let f = parameters['featured'];


	for(var i=0;i<is_connectors.length;i++){
		var is = is_connectors[i];
		//horizontal pos
		var wordA = objAtPos(is.x-1,is.y, om);
		var wordB = objAtPos(is.x+1, is.y, om);
		if(isWord(wordA) && isWord(wordB)){
			//add a new rule if not already made
			var r = wordA.name + "-" + is.name + "-" + wordB.name;
			if(rules.indexOf(r) == -1){
				rules.push(r);
			}

			//add as a rule object
			rule_objs.push(wordA);
			rule_objs.push(is);
			rule_objs.push(wordB);

			//add group
			//rule_groups[r] = [wordA, is, wordB];
		}

		//vertical pos
		var wordC = objAtPos(is.x,is.y-1, om);
		var wordD = objAtPos(is.x, is.y+1, om);
		if(isWord(wordC) && isWord(wordD)){
			var r = wordC.name + "-" + is.name + "-" + wordD.name;
			if(rules.indexOf(r) == -1){
				rules.push(r);
			}

			//add as a rule object
			rule_objs.push(wordC);
			rule_objs.push(is);
			rule_objs.push(wordD);

			//add group
			//rule_groups[r] = [wordC, is, wordD];               
		}
	}

	//console.log(rules)

	//interpret sprite changing rules
	transformation(om, bm, rules, sort_phys, phys);

	//reset the objects
	resetAll(parameters);
}

/// OBJECT RULE ASSINGMENT ///

/*
function clearLevel(){
	phys = [];
	sort_phys = {};
	words = [];
	players = [];
	automovers = [];
	pushables = [];
	stoppables = [];
	overlaps = [];
	unoverlaps = [];
	killers = [];
	winnables = [];
	rules = [];
	rule_objs = [];
	rule_groups = {};
	is_connectors = [];
}
*/

function clearLevel(parameters){
	let props = Object.keys(parameters);
	for(let a=0;a<props.length;a++){
		let entry = parameters[props[a]];
		if(Array.isArray(entry))
			parameters[props[a]] = [];
		else
			parameters[props[a]] = {};
	}
}

//check if array contains string with a substring
function has(arr, ss){
	for(var i=0;i<arr.length;i++){
		if(arr[i].includes(ss))
			return true;
	}
	return false;
}

//reset all the properties of every object
function resetObjProps(phys){
	for(var p=0;p<phys.length;p++){
		phys[p].is_movable = false;
		phys[p].is_stopped = false;
		phys[p].feature = "";
	}
}

//function resetAll(bm, om, rules, sort_phys, phys, words, p, am, w, u, s, k, n, o, uo, f){
function resetAll(parameters){
	/*
	//get all the paramaeters
	let om = parameters['obj_map'];
	let bm = parameters['back_map'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];
	let phys = parameters['phys'];
	let words = parameters['words'];
	let p = parameters['players'];
	let am = parameters['auto_movers'];
	let w = parameters['winnables'];
	let u = parameters['pushables'];
	let s = parameters['stoppables'];
	let k = parameters['killers'];
	let n = parameters['sinkers'];
	let o = parameters['overlaps'];
	let uo = parameters['unoverlaps'];
	let f = parameters['featured'];
	*/

	//reset the objects
	resetObjProps(parameters.phys);
	setPlayers(parameters);
	setAutoMovers(parameters);
	setWins(parameters);
	setPushes(parameters);
	setStops(parameters);
	setKills(parameters);
	setSinks(parameters);
	setOverlaps(parameters);
	setFeatures(parameters);
}

//set the player objects
function setPlayers(parameters){
	parameters['players'] = [];
	let players = parameters['players'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];

	for(var r=0;r<rules.length;r++){
		if(rules[r].includes("you")){
			players.push.apply(players, sort_phys[rules[r].split("-")[0]]);
		}
	}

	//make all the players movable
	for(var p=0;p<players.length;p++){
		players[p].is_movable = true;
	}
}

//set the autonomously moving objects
function setAutoMovers(parameters){
	parameters['auto_movers'] = [];
	let automovers = parameters['auto_movers'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];

	for(var r=0;r<rules.length;r++){
		if(rules[r].includes("move")){
			automovers.push.apply(automovers, sort_phys[rules[r].split("-")[0]]);
		}
	}

	//make all the npcs movable and default direction
	for(var p=0;p<automovers.length;p++){
		automovers[p].is_movable = true;
		if(automovers[p].dir == "")		//set the direction if not already set
			automovers[p].dir = "right";
	}


}

//set the winning objects
//function setWins(winnables, rules, sort_phys){
function setWins(parameters){
	parameters['winnables'] = [];
	let winnables = parameters['winnables'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];

	for(var r=0;r<rules.length;r++){
		if(rules[r].includes("win")){
			winnables.push.apply(winnables, sort_phys[rules[r].split("-")[0]]);
		}
	}
}

//set the pushable objects
function setPushes(parameters){
	parameters['pushables'] = [];
	let pushables = parameters['pushables'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];

	for(var r=0;r<rules.length;r++){
		if(rules[r].includes("push")){
			pushables.push.apply(pushables, sort_phys[rules[r].split("-")[0]]);
		}
	}

	//make all the pushables movable
	for(var p=0;p<pushables.length;p++){
		pushables[p].is_movable = true;
	}
}

//set the stopping objects
function setStops(parameters){
	parameters['stoppables'] = [];
	let stoppables = parameters['stoppables'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];

	for(var r=0;r<rules.length;r++){
		if(rules[r].includes("stop")){
			stoppables.push.apply(stoppables, sort_phys[rules[r].split("-")[0]]);
		}
	}

	//make all the pushables movable
	for(var p=0;p<stoppables.length;p++){
		stoppables[p].is_stopped = true;
	}
}

//set the killable objects
function setKills(parameters){
	parameters['killers'] = [];
	let killers = parameters['killers'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];

	for(var r=0;r<rules.length;r++){
		if(rules[r].includes("kill") || rules[r].includes("sink")){
			killers.push.apply(killers, sort_phys[rules[r].split("-")[0]]);
		}
	}
}

function setSinks(parameters){
	parameters['sinkers'] = [];
	let sinkers = parameters['sinkers'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];

	for(var r=0;r<rules.length;r++){
		if(rules[r].includes("sink")){
			sinkers.push.apply(sinkers, sort_phys[rules[r].split("-")[0]]);
		}
	}
}

//objects that are unmovable but not stoppable
//function setOverlaps(bm, om, overlaps, unoverlaps, rules, phys, words){
function setOverlaps(parameters){
	parameters['overlaps'] = [];
	parameters['unoverlaps'] = [];

	let bm = parameters['back_map'];
	let om = parameters['obj_map'];
	let overlaps = parameters['overlaps'];
	let unoverlaps = parameters['unoverlaps'];
	let rules = parameters['rules'];
	let phys = parameters['phys'];
	let words = parameters['words'];

	for(var o=0;o<phys.length;o++){
		var p = phys[o];
		if(!p.is_movable && !p.is_stopped){
			overlaps.push(p);
			bm[p.y][p.x] = p;
			om[p.y][p.x] = ' ';
		}
		else {
			unoverlaps.push(p);
			om[p.y][p.x] = p;
			bm[p.y][p.x] = ' ';
		}
	}

	unoverlaps.push.apply(unoverlaps, words);
	//words will always be in the object layer
	for(var q=0;q<words.length;q++){
		var w = words[q];
		om[w.y][w.x] = w;
	}
}

//check if an object is overlapping another
function overlapped(a,b){
	return a == b || (a.x == b.x && a.y == b.y);
}

//check if the player has stepped on a kill object
function killed(players, killers){
	var dead = [];
	for(var p=0;p<players.length;p++){
		for(var k=0;k<killers.length;k++){
			if(overlapped(players[p],killers[k]))
				dead.push([players[p], killers[k]]);
		}
	}

	return dead;
}

function drowned(phys, sinkers){
	var dead = [];
	for(var p=0;p<phys.length;p++){
		for(var s=0;s<sinkers.length;s++){
			if((phys[p] != sinkers[s]) && (overlapped(phys[p], sinkers[s])))
				dead.push([phys[p], sinkers[s]]);
		}
	}
	return dead;
}

function destroyObjs(dead, parameters){
	let bm = parameters['back_map'];
	let om = parameters['obj_map'];
	let phys = parameters['phys'];
	let sort_phys = parameters['sort_phys']

	for(var k=0;k<dead.length;k++){
		//remove reference of the player and the murder object
		var p = dead[k][0];
		var o = dead[k][1];
		phys.splice(phys.indexOf(p),1)
		phys.splice(phys.indexOf(o),1)
		sort_phys[p.name].splice(sort_phys[p.name].indexOf(p),1);
		sort_phys[o.name].splice(sort_phys[o.name].indexOf(o),1);

		//clear the space
		bm[o.y][o.x] = ' ';
		om[p.y][p.x] = ' ';
	}

	//reset the objects
	if(dead.length > 0)
		resetAll(parameters);
}

//check if the player has entered a win state
function win(players, winnables){
	for(var p=0;p<players.length;p++){
		for(var w=0;w<winnables.length;w++){
			if(overlapped(players[p],winnables[w]))
				return true;
		}
	}
	return false;
}

//turns all of one object type into all of another object type
function transformation(om ,bm, rules, sort_phys, phys){
	//x-is-x takes priority and makes it immutable
	var xisx = [];
	for(var r=0;r<rules.length;r++){
		var parts = rules[r].split("-");
		if(parts[0] == parts[2] && (parts[0] in sort_phys))
			xisx.push(parts[0]);
	}

	//transform sprites (x-is-y == x becomes y)
	for(var r=0;r<rules.length;r++){
		var parts = rules[r].split("-");
		//turn all objects
		if((xisx.indexOf(parts[0]) == -1) && isObjWord(parts[0]) && isObjWord(parts[2]) ){// && Object.keys(sort_phys).includes(parts[2])){
			//console.log(parts[0] + " -> " + parts[2]);

			var allObjs = [];
			allObjs.push.apply(allObjs, sort_phys[parts[0]]);
			for(var s=0;s<allObjs.length;s++){
				//console.log(rules[r])
				changeSprite(allObjs[s], parts[2], om, bm, phys, sort_phys)
			}
		}
	}
}

//checks if the word represents an object group
function isObjWord(w){
	return reverseChar(w+"_obj") != undefined;
}

//changes a sprite from one thing to another
function changeSprite(o, w, om, bm, phys, sort_phys){
	var charac = reverseChar(w+"_obj");
	var o2 = new phys_obj(w, imgHash[charac][0], o.x, o.y);
	phys.push(o2);		//in with the new...
	
	//replace object on obj_map/back_map
	if(objAtPos(o.y, o.x, om) == o)
		om[o.y][o.x] = o2;
	else
		bm[o.y][o.x] = o2;

	//add to the list of objects under a certain name
	if(!(w in sort_phys)){
		sort_phys[w] = [o2];
	}else{
		sort_phys[w].push(o2);
	}

	phys.splice(phys.indexOf(o),1);	//...out with the old
	sort_phys[o.name].splice(sort_phys[o.name].indexOf(o),1);
}

//adds a feature to word groups based on ruleset
//function setFeatures(featured, rules, sort_phys){
function setFeatures(parameters){
	parameters['featured'] = {};
	let featured = parameters['featured'];
	let rules = parameters['rules'];
	let sort_phys = parameters['sort_phys'];

	//add a feature to the sprites (x-is-y == x has y feature)
	for(var r=0;r<rules.length;r++){
		var parts = rules[r].split("-");
		//add a feature to a sprite set
		if(features.indexOf(parts[2]) != -1 && (features.indexOf(parts[0]) == -1) && (parts[0] in sort_phys)){
			//no feature set yet so make a new array
			if(!(parts[2] in featured)){
				featured[parts[2]] = []
				featured[parts[2]].push(parts[0]);		
			}
			//or append it
			else{
				featured[parts[2]].push(parts[0]);
			}

			//set the physical objects' features
			var ps = sort_phys[parts[0]];
			for(var p=0;p<ps.length;ps++){
				sort_phys[parts[0]][p].feature = parts[2];
			}
		}
	}
}

//similar to killed() check if feat pairs are overlapped and destroy both
function badFeats(featured, sort_phys){
	var baddies = [];

	for(var fp=0;fp<featPairs.length;fp++){
		var pair = featPairs[fp];

		//check if both features have object sets
		if((pair[0] in featured) && (pair[1] in featured)){

			//get all of the sprites for each group
			var a_set = [];
			var b_set = [];

			for(var z=0;z<featured[pair[0]].length;z++){
				a_set.push.apply(a_set, sort_phys[featured[pair[0]][z]]);
			}
			for(var z=0;z<featured[pair[1]].length;z++){
				b_set.push.apply(b_set, sort_phys[featured[pair[1]][z]]);
			}

			//check for overlaps between objects
			for(var a=0;a<a_set.length;a++){
				for(var b=0;b<b_set.length;b++){
					if(overlapped(a_set[a], b_set[b]))
						baddies.push([a_set[a], b_set[b]]);
				}
			}
		}
	}

	return baddies;
}

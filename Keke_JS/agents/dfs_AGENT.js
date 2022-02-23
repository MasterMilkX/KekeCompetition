// BABA IS Y'ALL SOLVER - DFS TEMPLATE
// Version 1.0
// Code by Sarah

// get imports (NODEJS)
const simjs = require('../js/simulation');

const possActions = ['space', 'right', 'up', 'left', 'down'];

const stateSet = new Set();
const stack = [];

class Node {
  constructor(m, a, p, w, d) {
    this.mapRep = m;
    this.actionHistory = a;
    this.parent = p;
    this.won = w;
    this.died = d;
  }
}

function newState(kekeState, map) {
  simjs.clearLevel(kekeState);
  kekeState.orig_map = map;
  [kekeState.back_map, kekeState.obj_map] = simjs.splitMap(kekeState.orig_map);
  simjs.assignMapObjs(kekeState);
  simjs.interpretRules(kekeState);
}

function getChildNode(currState, action, parent) {
  // Append the child direction to the existing movement path.
  const nextActions = [];
  nextActions.push(...parent.actionHistory);
  nextActions.push(action);

  let won = false;
  let died = false;
  for (let a = 0, b = nextActions.length; a < b; a += 1) {
    const nextMove = simjs.nextMove(nextActions[a], currState);
    const nextState = nextMove.next_state;
    won = nextMove.won;
    if (nextState.players.length === 0) {
      won = false;
      died = true;
    }
  }

  const childMap = simjs.doubleMap2Str(currState.obj_map, currState.back_map);
  const child = new Node(childMap, nextActions, parent, won, died);
  return child;
}

function getChildren(parent, map) {
  const children = [];
  for (let i = 0, j = possActions.length; i < j; i += 1) {
    const currState = {};
    newState(currState, map);
    const childNode = getChildNode(currState, possActions[i], parent);
    if (!stateSet.has(childNode.mapRep) && !childNode.died) children.push(childNode);
  }
  return children;
}

// NEXT ITERATION STEP FOR SOLVING
function iterSolve(initState) {
  // PERFORM ITERATIVE CALCULATIONS HERE //
  //console.log(stack.length);
  if (stack.length > 0) {
    const parent = stack.pop();
    const children = getChildren(parent, initState.orig_map);
    for (let i = 0, j = children.length; i < j; i += 1) {
      stateSet.add(children[i].mapRep);
      if (children[i].won) return children[i].actionHistory;
    }
    stack.push(...children);
  }
  // return a sequence of actions or empty list
  return [];
}

function initStack(initState) {
  const parent = new Node(simjs.map2Str(initState.orig_map), [], null, false, false);
  stack.push(parent);
}

// VISIBLE FUNCTION FOR OTHER JS FILES (NODEJS)
module.exports = {
  step(initState) { return iterSolve(initState); },
  init(initState) { initStack(initState); },
  best_sol() { return (stack.length > 1 ? stack.pop().actionHistory : []); },
};

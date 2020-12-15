const {stringsInLineWithSeparator  } = require('../lib/input');

const input = stringsInLineWithSeparator().map(num => parseInt(num, 10));

console.log(`input: ${input}`);

// const LIMIT = 2020;
const LIMIT = 30000000;

let turn = 0;
let state = {
  memory:{},
  last: 0,
};
while (turn < LIMIT) {
  if (turn % 1000000 === 0) {
    console.log(`turn: ${turn}`);
  }
  let num;
  if (input.length) {
    num = input.shift();
  } else {
    
    if (state.memory[state.last].length === 1) {
      num = 0;
    } else {
      num = state.memory[state.last][1] - state.memory[state.last][0];
    }
  }

  state.memory[num] = state.memory[num] || [];
  state.memory[num].push(turn + 1);
  if (state.memory[num].length > 2) {
    state.memory[num].shift();
  }

  state.last = num;
  turn++;
}

console.log(`taskA: ${state.last}`);
const {stringsInLineWithSeparator  } = require('../lib/input');

const input = stringsInLineWithSeparator().map(num => parseInt(num, 10));

console.log(`input: ${input}`);

// const LIMIT = 2020;
const LIMIT = 30000000;

let turn = 0;
let state = {
  memory:{},
  last: -1,
};
while (turn < LIMIT) {
  if (turn % 1000000 === 0) {
    console.log(`turn: ${turn}`);
  }

  let num;
  if (input.length) {
    num = input.shift();
  } else {

    if (!state.memory[state.last]) {
      num = 0;
    } else {
      num = turn - state.memory[state.last];
    }
  }
  // console.log(num);
  state.memory[state.last] = turn;
  state.last = num;
  turn++;
}

console.log(`taskA: ${state.last}`);
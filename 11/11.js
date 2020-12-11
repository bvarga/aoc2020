const { stringsInLinesWithSeparator } = require('../lib/input');
const { Grid } = require('../lib/grid');
const { createContext } = require('vm');

const input = stringsInLinesWithSeparator('');

let grid = new Grid(input[0].length, input.length, (x,y) => {
  return {
    states: [input[y][x], input[y][x]],
  };
});

grid.print(cell => cell.states[0]);
console.log(' ');

const seeOccupiedA = (gx, gy, state) => {
  const occupied = [-1,0, 1].reduce((sum, x) => {
    return [-1,0, 1].reduce(( sum2, y) => {
      const incr =
        (x !== 0 || y !== 0) &&
        (gx + x >= 0) &&
        (gx + x < grid.sizeX) &&
        (gy + y >= 0) &&
        (gy + y < grid.sizeY) &&
        (grid.get(gx + x, gy + y).states[state] === '#') ? 1 : 0;
      return sum2 += incr;
    }, sum);
  }, 0);
  return occupied;
};

const step = (threshold, state, seeOccupied) => {
  const nextState = (state + 1) % 2;
  let changed = false;
  let count = 0;
  [...Array(grid.sizeX).keys()].forEach(gx => {
    [...Array(grid.sizeY).keys()].forEach(gy => {
      const occupied = seeOccupied(gx, gy, state);
      const st = grid.get(gx, gy);
      if (st.states[state] === 'L' && occupied === 0) {
        changed = true;
        st.states[nextState] = '#';
      } else if (st.states[state] === '#' && occupied >= threshold) {
        changed = true;
        st.states[nextState] = 'L';
      } else {
        st.states[nextState] = st.states[state];
      }
      count += st.states[nextState] === '#' ? 1 : 0;
    });
  });

//  grid.print((cell) => cell.states[nextState]);
//  console.log(' ');

  if (changed) {
    return step(threshold, nextState, seeOccupied);
  } else {
    return count;
  }
}

const taskA = step(4, 0, seeOccupiedA);
console.log(`task A: count: ${taskA}`);

const seeOccupiedB = (gx, gy, state) => {
  const occupied = [-1,0, 1].reduce((sum, x) => {
    return [-1,0, 1].reduce(( sum2, y) => {

      if (x === 0 && y === 0) {
        return sum2;
      }

      let cx = gx + x;
      let cy = gy + y;

      while (
        (cx >= 0) &&
        (cx < grid.sizeX) &&
        (cy >= 0) &&
        (cy < grid.sizeY)
       ) {
        let seat = grid.get(cx, cy).states[state];
        if (seat === '#') {
          return sum2 + 1;
        } else if (seat === 'L') {
          return sum2;
        }
        cx = cx + x;
        cy = cy + y;
       }
      return sum2;

    }, sum);
  }, 0);
  return occupied;
};

grid = new Grid(input[0].length, input.length, (x,y) => {
  return {
    states: [input[y][x], input[y][x]],
  };
});
const taskB = step(5, 0, seeOccupiedB);
console.log(`task B: count: ${taskB}`);
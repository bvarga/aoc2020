const { stringsInLinesWithSeparator } = require('../lib/input');
const { Grid } = require('../lib/grid');

const input = stringsInLinesWithSeparator('');

const grid = new Grid(input[0].length, input.length, (x, y) => {
  return input[y][x];
});

grid.print();

let dx = 3;
let dy = 1;

let x = 0;
let y = 0;
let trees = 0;
while ( y !== grid.sizeY - 1) {
  x += dx;
  y += dy;
  x = x % grid.sizeX;
  trees += grid.get(x, y) === '#' ? 1 : 0;
}

console.log(`A: trees: ${trees}`);

const treesB = [{ dx: 1, dy: 1}, { dx: 3, dy: 1}, { dx: 5, dy: 1}, { dx: 7, dy: 1}, { dx: 1, dy: 2}].reduce((acc, slope) => {
  let x = 0;
  let y = 0;
  let trees = 0;
  while ( y !== grid.sizeY - 1) {
    x += slope.dx;
    y += slope.dy;
    x = x % grid.sizeX;
    trees += grid.get(x, y) === '#' ? 1 : 0;
  }

  return acc *= trees;
}, 1);

console.log(`B: trees: ${treesB}`);
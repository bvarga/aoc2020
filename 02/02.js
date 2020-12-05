const { stringsInLinesWithSeparator } = require('../lib/input');

const input = stringsInLinesWithSeparator(' ');

const parsed = input.map(row => {
  const minMax = row[0].split('-');
  return {
    min: minMax[0],
    max: minMax[1],
    char: row[1][0],
    password: row[2],
  }
})

const validPasswordsA = parsed.filter(row => {
  let i = 0;
  let count = 0;
  while ( i < row.password.length && count <= row.max) {
    count += row.password[i] === row.char ? 1 : 0;
    i++;
  }
  return count >= row.min && count <= row.max;
});

console.log('A: Valid passwords count: ', validPasswordsA.length);

const validPasswordsB = parsed.filter(row => {
  return row.password[row.min - 1] === row.char ? row.password[row.max - 1] !== row.char : row.password[row.max - 1] === row.char;
});

console.log('B: Valid passwords count: ', validPasswordsB.length);

const { numbersInLines } = require('../lib/input');

const data = numbersInLines();
let input = data.sort((a,b) => a - b);
input.push(input[input.length - 1] + 3);
const resultA = input.reduce((acc, num, indx, arr) => {
  acc[ num - (indx === 0 ? 0 : arr[indx - 1])] += 1;
  return acc;
}, {
  1: 0,
  2: 0,
  3: 0,
});

console.log(`task A : ${resultA[3] * resultA[1]}`);
input.unshift(0);
console.log(`sorted: ${input}`);

const cache = {};
const calc = indx => {
  if (cache[indx]) {
    return cache[indx];
  }
  let i = indx + 1;
  let sum = 0;
  while ( i < input.length && input[i] <= input[indx] + 3) {
    sum += calc(i);
    i += 1;
  }
  const result = sum || 1;
  cache[indx] = result;
  return result;
};

const resultB = calc(0);

console.log(`Task B: ${resultB}`);
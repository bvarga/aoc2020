const { stringsInLines } = require('../lib/input');

const data = stringsInLines();

const preamble = 25;
const nums = data.map(num => parseInt(num, 10));

nums.forEach((num, indx, arr) => {
  if (indx < preamble) {
    return;
  }

  const prev = arr.slice(indx - preamble, indx);
  if (!prev.find(n => {
    return prev.includes(num - n)
  })) {

    let i = 0;
    let j = 0;
    let sum = 0;
    while (i < indx && sum !== num) {
      j = i;
      sum = 0;
      while (j < indx && sum < num) {
        sum += arr[j];
        j++;
      }
      i++;
    }

    if (sum === num) {
      let min = Infinity;
      let max = 0;
      for (let k = i - 1; k <= j - 1; k++) {
        min = Math.min(min, arr[k]);
        max = Math.max(max, arr[k]);
      }

      console.log(`task B:  ${min + max}`);
    }
    throw new Error(`Task A: invalid number: ${num}`);
  }

});

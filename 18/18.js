const { stringsInLines } = require('../lib/input');

const lines = stringsInLines().filter(line => line.length > 0).map(line => line.replace(/\s/g, ''));

const closing = (str, indx) => {
  if (str[indx] !== '(') {
    throw new Error(`Not a starting bracket "${str}" at index ${indx}`);
  }
  let pc = 1;
  indx +=1
  while (indx < str.length && pc !== 0) {
    pc += str[indx] === ')' ? -1 : str[indx] === '(' ? 1 : 0;
    indx += pc === 0 ? 0 : 1;
  }
  if (pc !== 0) {
    throw new Error(`can't find closing bracket for "${str}", indx: ${indx}`);
  }
  return indx;
}

const sum = (a,b) => a+b;
const multi = (a,b) => a*b;

const calc = (numbers, operators) => {
  let result = numbers.shift();
  while (operators.length > 0) {
    result = operators.shift()(result, numbers.shift());
  }
  return result;
};

const calc2 = (numbers, operators) => {
  while (operators.findIndex(op => op === sum) > -1) {
    let i = operators.findIndex(op => op === sum);
    let op = operators.splice(i, 1)[0];
    let num1 = numbers.splice(i, 1)[0];
    let num2 = numbers.splice(i, 1)[0];
    numbers.splice(i, 0, op(num1, num2));
  }

  let result = numbers.shift();
  while (operators.length > 0) {
    result = operators.shift()(result, numbers.shift());
  }
  return result;
};

const eval = (str, calc) => {
  // console.log(`evaluating: ${str}`);
  let numbers = [];
  let operators = [];

  indx = 0;
  while (indx < str.length) {
    let sindx = indx;
    while (indx < str.length && /\d/.test(str[indx])) {
      indx += 1;
    }
    if (str[indx] === '+' || str[indx] === '*') {
      if (sindx !== indx) {
        numbers.push(parseInt(str.substring(sindx, indx), 10));
      }
      operators.push(str[indx] === '+' ? sum : multi);
      indx += 1;
    } else if (str[indx] === '(') {
      let cl = closing(str, indx);
      let substr = str.substring(indx + 1, cl)
      let result = eval(substr, calc);
      numbers.push(result);
      indx = cl + 1;
    } else {
      numbers.push(parseInt(str.substring(sindx, indx), 10));
    }
  }
  let res  = calc(numbers, operators);
  //console.log(`${str} evaluated to: ${res}`);
  return res;
}

const resultA = lines.reduce((sum, line) => {
  return sum + eval(line, calc);
}, 0);
console.log(`taskA: ${resultA}`);

const resultB = lines.reduce((sum, line) => {
  return sum + eval(line, calc2);
}, 0);
console.log(`taskB: ${resultB}`);
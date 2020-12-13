const { stringsInLines } = require('../lib/input');

const data = stringsInLines();


const input = {
  ts: parseInt(data[0], 10),
  busses: data[1].split(',').filter(num => num !== 'x').map(num => parseInt(num, 10)),
};

const closest = input.busses.map(bus => {
  return {
    bus,
    ts: bus * Math.ceil(input.ts / bus) - input.ts,
  };
}).sort((a,b) => a.ts - b.ts);

console.log(`TaskA: ${closest[0].bus * closest[0].ts}`);

const inputB = data[1].split(',').reduce((acc, bus, indx) => {
  if (bus === 'x') {
    return acc;
  }
  acc.push([indx, parseInt(bus, 10)]);
  return acc;
}, []);

console.log(JSON.stringify(inputB));

const calc = (baseA, incrementA, baseB, incrementB, diff) => {
  let done = (baseB - baseA === diff);
  while (!done) {
    baseA += incrementA;
    if (baseB < baseA) {
      baseB += incrementB * Math.ceil((baseA - baseB) / incrementB);
    }
    while (baseB - baseA < diff) {
      baseB += incrementB;
    }
    done = (baseB - baseA === diff);
  }
  return {
    baseA,
    incrementA: incrementA * incrementB,
  };
}

let A = inputB.shift();
const result = inputB.reduce((acc, B) => {
  let baseB = 0;
  let incrementB = B[1];
  let diff = B[0];
  return calc(acc.baseA, acc.incrementA, baseB, incrementB, diff);
}, { baseA: 0, incrementA: A[1]});

console.log(`taskB: ${result.baseA}`);
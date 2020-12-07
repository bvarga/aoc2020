const { stringsInLines } = require('../lib/input');
const { Graph } = require('../lib/graph');
const { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } = require('constants');

const input = stringsInLines();


const graph = input.reduce((acc, rule) => {
  const data = rule.split(' contain ');
  const color = data[0].substr(0, data[0].indexOf(' bags'));

  acc[color] = acc[color] || {
    children: new Set(),
    parents: new Set(),
  };


  const subs = data[1].split(',');
  subs.forEach(sub => {
    const item = sub.trim().split(' ');
    const count = item.shift();
    if (count === 'no') {
      return;
    }
    item.pop();
    const subColor = item.join(' ');

    acc[subColor] = acc[subColor] || {
      children: new Set(),
      parents: new Set(),
      };

    acc[color].children.add(subColor);
    acc[subColor].parents.add(color);
  });

  return acc;
}, {});

const resultA = new Set();
const checked = new Set();

let toCheck = graph['shiny gold'].parents;
while (toCheck.size > 0) {
  let next = new Set();

  toCheck.forEach(color => {
    resultA.add(color);

    graph[color].parents.forEach(p => {
      if (!checked.has(p) && !resultA.has(p)) {
        next.add(p);
      }
    });
  });
  toCheck = next;
}

console.log(`A: ${resultA.size}`);


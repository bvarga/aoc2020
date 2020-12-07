const { stringsInLineWithSeparator } = require('../lib/input');

const input = stringsInLineWithSeparator('\n\n');

const answerA = input.map(group => {
  return group.split('\n');
}).map(group => {
  const set = new Set();
  group.forEach(person => {
    person.split('').forEach(char => set.add(char));
  });
  return set;
}).reduce((sum, set) => {
  return sum += set.size;
}, 0);

console.log(`Answer A: ${answerA}`);

const answerB = input.map(group => {
  return group.split('\n');
}).map(group => {

  const sets = group.map(person => person.split('').reduce((acc, char) => acc.add(char), new Set()));

  return sets.length === 1 ? sets[0].size : sets.reduce((a, b) => {
    return new Set(
      [...a].filter(x => b.has(x)));
  }).size;
}).reduce((sum, size) => {
  return sum += size;
}, 0);

console.log(`Answer B: ${answerB}`);
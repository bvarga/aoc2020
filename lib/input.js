const fs = require('fs');
const path = require('path');

const program = process.argv[1];
const argument = process.argv[2];

console.log(`Starting ${program} with input ${argument}`);

function rawInput() {
  return argument ? fs.readFileSync(path.join(path.dirname(program), argument), 'utf-8') : '';
}

function stringsInLines() {
  let raw = rawInput();
  let result = raw.split('\n');
  return result;
}

function stringsInLineWithSeparator(separator = ',') {
  let raw = rawInput();
  return raw.split(separator);
}

function stringsInLinesWithSeparator(separator = ',') {
  let raw = rawInput();
  return raw.split('\n').map(line => line.split(separator));
}

module.exports = {
  rawInput,
  stringsInLines: stringsInLines,
  stringsInLineWithSeparator: stringsInLineWithSeparator,
  stringsInLinesWithSeparator: stringsInLinesWithSeparator,
  numbersInLines: () => stringsInLines().map(n => parseInt(n, 10)),
  numbersInLineWithSeparator: separator => stringsInLineWithSeparator(separator).map(n => parseInt(n, 10)),
}
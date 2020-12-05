const { stringsInLines } = require('../lib/input');

const input = stringsInLines();

const seats = input.map(boardingPass => {
  const seat = boardingPass.split('').reduce((acc, char) => {
    if (char === 'F') {
      acc.rowMax -= (acc.rowMax - acc.rowMin + 1) / 2;
    } else if (char === 'B') {
      acc.rowMin += (acc.rowMax - acc.rowMin + 1) / 2;
    } else if (char === 'L') {
      acc.colMax -= (acc.colMax - acc.colMin + 1) / 2;
    } else if (char === 'R') {
      acc.colMin += (acc.colMax - acc.colMin + 1) / 2;
    }
    return acc;
  }, { rowMin: 0, rowMax: 127, colMin: 0, colMax: 7 });

  return seat.rowMin * 8 + seat.colMin;
})

const valueA = seats.reduce((max, seat) => {
  return Math.max(max, seat);
}, 0);

console.log(`Max seat num: ${valueA}`);

const seatSet = new Set(seats);


const valueB = [...new Array(976).keys()].find(seat => {
  return seatSet.has(seat - 1) && seatSet.has(seat + 1) && !seatSet.has(seat);
});

console.log(`your seat num: ${valueB}`);
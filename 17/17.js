const { stringsInLinesWithSeparator } = require('../lib/input');

const data = stringsInLinesWithSeparator('');

const LightGrid = (dimension = 3) => {
  const state = {};
  let active = 0;

  const getNeighbours = coordinates => {
    const delta = [-1,0,1];

    return delta.reduce((arr, dx) => {
      return delta.reduce((arr2, dy) => {
        return delta.reduce((arr3, dz) => {
          return delta.reduce((arr4, dw) => {
            if (dx !== 0 || dy !== 0 || dz !== 0 || dw !== 0) {
              const c = [
                coordinates[0] + dx,
                coordinates[1] + dy,
                coordinates[2] + dz,
                coordinates[3] + dw,
              ];
              const key = c.join('.');
              arr4.push({
                coordinate: c,
                key,
                data: state[key],
              });
            }
            return arr4;
          }, arr3);
        }, arr2);
      }, arr);
    }, []);
  }

  const add = (coordinates, data) => {
    state[coordinates.join('.')] = data;
    getNeighbours(coordinates).forEach(neighbour => {
      state[neighbour.key] = state[neighbour.key] || '.';
    });
    active += data === '#' ? 1 : 0;
  }

  const print = () => {
    console.log(`${JSON.stringify(state, null, 2)}`);
  };

  const data = () => {
    return Object.keys(state).reduce((acc, key) => {
      acc.push({
        coordinate: key.split('.').map(num => parseInt(num, 10)),
        key,
        data: state[key],
      });
      return acc;
    }, []);
  }

  const getActive = () => active;

  return {
    add,
    print,
    data,
    getNeighbours,
    getActive,
  };
};


const grid = LightGrid();

data.forEach((row, y) => {
  row.forEach((cell, x) => {
    grid.add([x, y, 0, 0], cell);
  });
})

// grid.print();
const step = grid => {
  const result = LightGrid();
  grid.data().forEach(cell => {
    const neighbours = grid.getNeighbours(cell.coordinate);
    const active = neighbours.reduce((acc, neighbour) => {
      return acc + (neighbour.data === '#' ? 1 : 0);
    }, 0);

    if (cell.data === '#' && (active === 2 || active === 3)) {
      result.add(cell.coordinate, '#');
    }
    if (cell.data === '.' && active === 3) {
      result.add(cell.coordinate, '#');
    }
  })
  return result;
}

const finalGrid = [...Array(6).keys()].reduce(acc => {
  return step(acc);
}, grid);

console.log(`taskB: ${finalGrid.getActive()}`);

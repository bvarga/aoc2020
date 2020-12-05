
class Grid {
  constructor(sizeX = 0, sizeY = 0, init) {
    this.sizeX = sizeX;
    this.sizeY = sizeY;

    let initializationFn = typeof init === 'function' ? init : (x, y) => (init);
    this.data = Array.from(Array(sizeY), (row, y) => Array.from(Array(sizeX)));

    this.data.forEach((row, y) => {
      row.forEach((cell, x) => {
        this.data[y][x] = initializationFn(x, y);
      });
    })
  }

  update(x, y, data) {
    this.data[y][x] = data;
  }

  get(x, y) {
    return this.data[y][x];
  }

  print(mapper) {
    let mapperFn = typeof mapper === 'function' ? mapper : (cell,x ,y) => (cell);
    this.data.forEach((row, y) => {
      let line = row.reduce((acc, cell, x) => acc + mapperFn(cell, x, y), '');
      console.log(line);
    });
  }
};

const DIRECTIONS = {
  n: {
    opposite: 's',
    left: 'w',
    right: 'e',
    dx: 0,
    dy: -1,
  },
  s: {
    opposite: 'n',
    left: 'e',
    right: 'w',
    dx: 0,
    dy: 1,
  },
  e: {
    opposite: 'w',
    left: 'n',
    right: 's',
    dx: 1,
    dy: 0,
  },
  w: {
    opposite: 'e',
    left: 's',
    right: 'n',
    dx: -1,
    dy: 0,
  },
}

class GridGraph {
  constructor(data) {
    // this.root = {
    //   neighbours: {},
    //   data: data,
    //   x: 0,
    //   y: 0,
    // };
    this.DIRECTIONS = DIRECTIONS;
    this.grid = {};
    this.border = {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity,
    };
  }

  addNeighbour(node, dir, data) {
    // .. do not use this, it's not correct. unfinished.

    return
    if (node.neighbours[dir]) {
      throw new Error(`Neighbour in direction ${dir} already exists for node ${JSON.stringify(node)}!`);
    }
    let newNode = {
      neighbours: {},
      data: data,
      x: node.x + DIRECTIONS[dir].dx,
      y: node.y + DIRECTIONS[dir].dy,
    }
    node.neighbours[dir] = newNode;
    node.neighbours[dir].neighbours[DIRECTIONS[dir].opposite] = node;
    this.grid[newNode.x] = this.grid[newNode.x] || {};
    this.grid[newNode.x][newNode.y] = newNode;

    // update borders
    this.border.minX = Math.min(this.border.minX, newNode.x);
    this.border.maxX = Math.max(this.border.maxX, newNode.x);
    this.border.minY = Math.min(this.border.minY, newNode.y);
    this.border.maxY = Math.max(this.border.maxY, newNode.y);
    return newNode;
  }

  _updateBorders(newNode) {
    // update borders
    this.border.minX = Math.min(this.border.minX, newNode.x);
    this.border.maxX = Math.max(this.border.maxX, newNode.x);
    this.border.minY = Math.min(this.border.minY, newNode.y);
    this.border.maxY = Math.max(this.border.maxY, newNode.y);
  }

  addNode(x, y, data) {
    if (this.getNode(x,y)) {
      throw new Error(`position ${x}, ${y} already occupied`);
    }

    let newNode = {
      neighbours: {},
      data: data,
      x: x,
      y: y,
    }
    this.grid[newNode.x] = this.grid[newNode.x] || {};
    this.grid[newNode.x][newNode.y] = newNode;
    this._updateBorders(newNode);
    return newNode;
  }

  getNode(x, y) {
    return this.grid[x] && this.grid[x][y] ? this.grid[x][y] : undefined;
  }

  print(fn) {
    let mapperFn = typeof fn === 'function' ? fn : (node,x ,y) => (node.data);
    for (let y = this.border.minY; y <= this.border.maxY; y++) {
      let line = '';
      for (let x = this.border.minX; x <= this.border.maxX; x++) {
        let node = this.getNode(x, y);
        line += typeof node === 'undefined' ? line + ' ' : mapperFn(node, x, y);
      }
      console.log(line);
    }
  }

  iterate(fn) {
    for (let y = this.border.minY; y <= this.border.maxY; y++) {
      for (let x = this.border.minX; x <= this.border.maxX; x++) {
        fn(this.getNode(x, y), x, y);
      }
    }
  }
}

module.exports = {
  Grid: Grid,
  GridGraph: GridGraph,
};
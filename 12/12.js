const { stringsInLines } = require('../lib/input');

const input = stringsInLines();

const directions = input.map(row => ({
  cmd: row[0],
  val: parseInt(row.substr(1), 10),
}));

const pos = directions.reduce((state, dir) => {
  const newState = {
    x: (dir.cmd === 'W' || dir.cmd === 'F' && (state.dir === 270 || state.dir === -90))
      ? state.x - dir.val
      : (dir.cmd === 'E' || dir.cmd === 'F' && (state.dir === 90 || state.dir === -270))
      ? state.x + dir.val
      : state.x,
    y: (dir.cmd === 'N' || dir.cmd === 'F' && (state.dir === 0 || state.dir === -0))
      ? state.y - dir.val
      : (dir.cmd === 'S' || dir.cmd === 'F' && (state.dir === 180 || state.dir === -180))
      ? state.y + dir.val
      : state.y,
    dir: dir.cmd === 'L'
      ? ((state.dir - dir.val) % 360)
      : dir.cmd === 'R'
      ? ((state.dir + dir.val) % 360)
      : state.dir,
  };
  // console.log(`step: ${JSON.stringify(dir)}, from: ${JSON.stringify(state)}, to: ${JSON.stringify(newState)}`);
  return newState;
}, {
  x: 0,
  y: 0,
  dir: 90,
});

console.log(`task A: ${Math.abs(pos.x) + Math.abs(pos.y)}`);

const resB = directions.reduce((state, dir) => {
  const newState = {...state};
  if (dir.cmd === 'W') {
    newState.wpx = state.wpx - dir.val;
  } else if (dir.cmd === 'E') {
    newState.wpx = state.wpx + dir.val;
  } else if (dir.cmd === 'N') {
    newState.wpy = state.wpy - dir.val;
  } else if (dir.cmd === 'S') {
    newState.wpy = state.wpy + dir.val;
  } else if (dir.cmd === 'F') {
    newState.x += dir.val * state.wpx;
    newState.y += dir.val * state.wpy;
  } else if (dir.cmd === 'R') {
    const r = dir.val % 360;
    if (r === 90) {
      newState.wpx = -1 * state.wpy;
      newState.wpy = 1 * state.wpx;
    } else if ( r === 180) {
      newState.wpx = -1 * state.wpx;
      newState.wpy = -1 * state.wpy;
    } else if (r === 270) {
      newState.wpx = 1 * state.wpy;
      newState.wpy = -1 * state.wpx;
    }
  } else if (dir.cmd === 'L') {
    const r = dir.val % 360;
    if (r === 90) {
      newState.wpx = 1 * state.wpy;
      newState.wpy = -1 * state.wpx;
    } else if ( r === 180) {
      newState.wpx = -1 * state.wpx;
      newState.wpy = -1 * state.wpy;
    } else if (r === 270) {
      newState.wpx = -1 * state.wpy;
      newState.wpy = 1 * state.wpx;
    }
  };
  // console.log(`step: ${JSON.stringify(dir)}, from: ${JSON.stringify(state)}, to: ${JSON.stringify(newState)}`);
  return newState;
}, {
  x: 0,
  y: 0,
  wpx: 10,
  wpy: -1,
});

console.log(`task B: ${Math.abs(resB.x) + Math.abs(resB.y)}`);
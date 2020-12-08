const { stringsInLinesWithSeparator } = require('../lib/input');

const data = stringsInLinesWithSeparator(' ');

const generateProgram = () => data.map(line => {
  return {
    cmd: line[0],
    param: parseInt(line[1], 10),
  };
});

const OPS = {
  nop: () => 1,
  acc: machine => {
    machine.reg.acc += machine.program[machine.pointer].param;
    return 1;
  },
  jmp: machine => {
    return machine.program[machine.pointer].param;
  },
};

const machine = {
  program: generateProgram(),
  pointer: 0,
  reg: {
    acc: 0,
  }
}

const run = machine => {
  while (machine.pointer >= 0 && machine.pointer < machine.program.length) {
    if (machine.program[machine.pointer].touched) {
      throw new Error('Infinite loop');
    }
    let delta = OPS[machine.program[machine.pointer].cmd](machine);
    machine.program[machine.pointer].touched = true;
    machine.pointer += delta;
  }
  return machine;
};

try {
  run(machine);
} catch (err) {
  console.log(`A: ${machine.reg.acc}`);
}
let found = false;

const programs = data.reduce((acc, line, index) => {
  if (line[0] === 'nop') {
    acc.push(generateProgram());
    acc[acc.length - 1][index].cmd = 'jmp'
  } else if (line[0] === 'jmp') {
    acc.push(generateProgram());
    acc[acc.length - 1][index].cmd = 'nop'
  }
  return acc;
}, []);

let i = 0;
while (!found && i < programs.length) {
  try {
    let machine = {
      program: programs[i],
      pointer: 0,
      reg: {
        acc: 0,
      }
    };
    run(machine);
    console.log(`B: ${machine.reg.acc}`);
    found = true;
  } catch (err) {
    i += 1;
  }
}

const { Transform } = require('stream');

const INSTRUCTION = {
  1: {
    params: 3,
    output: 2,
    proc: (instruction, computer) => {
      computer.setMemory(instruction.params[2], instruction.params[0] + instruction.params[1]);
      computer.addr += 4;
      return true;
    },
  },

  2: {
    params: 3,
    output: 2,
    proc: (instruction, computer) => {
      computer.setMemory(instruction.params[2], instruction.params[0] * instruction.params[1]);
      computer.addr += 4;
      return true;
    },
  },

  3: {
    params: 1,
    output: 0,
    proc: (instruction, computer) => {
      if (computer.inputCb) {
        let inputPromise = computer.inputCb();
        inputPromise.then(data => {
          computer.setMemory(instruction.params[0], data);
          computer.addr += 2;
          computer.step();
        });
        return false;
      };

      if (computer.input !== null) {
        computer.setMemory(instruction.params[0], computer.input.data);
        let cb = computer.input.cb;
        computer.input = null;
        computer.addr += 2;
        cb();
        return true;
      } else {
        computer.paused = true;
        if (computer.verbose) {
          console.log(`[${computer.name}] pausing`);
        }
        return false;
      }
    },
  },

  4: {
    params: 1,
    proc: (instruction, computer) => {
      if (computer.verbose) {
        console.log(`[${computer.name}] output: ${instruction.params[0]}`);
      }
      computer.push({ data: instruction.params[0]});
      computer.addr += 2;
      return true;
    },
  },

  5: {
    params: 2,
    proc: (instruction, computer) => {
       computer.addr = instruction.params[0] !== 0 ? instruction.params[1] : computer.addr + 3;
       return true;
    },
  },

  6: {
    params: 2,
    proc: (instruction, computer) => {
       computer.addr = instruction.params[0] === 0 ? instruction.params[1] : computer.addr + 3;
       return true;
    }
  },

  7: {
    params: 3,
    output: 2,
    proc: (instruction, computer) => {
      computer.setMemory(instruction.params[2], instruction.params[0] < instruction.params[1] ? 1 : 0);
      computer.addr += 4;
      return true;
    }
  },

  8: {
    params: 3,
    output: 2,
    proc: (instruction, computer) => {
      computer.setMemory(instruction.params[2], instruction.params[0] === instruction.params[1] ? 1 : 0);
      computer.addr += 4;
      return true;
    }
  },

  9: {
    params: 1,
    proc: (instruction, computer) => {
      computer.relativeBase += instruction.params[0];
      computer.addr += 2;
      return true;
    }
  },

  99: {
    params: 0,
    proc: (instruction, computer) => {
      if (computer.verbose) {
        console.log(`[${computer.name}] terminating program.`);
      }
      computer.terminate();
      return false;
    }
  }
};

class Instruction {
  constructor(intCode, verbose) {
    this.intCode = intCode;
    this.verbose = verbose;
    this.opcode = 0;
    this.modes = [];
    this.params = [];
    this.parseOpcode();
    this.parseParams();
  }

  parseOpcode() {
    let num = this.intCode.getMemory(this.intCode.addr);
    let digits = [];
    while (num > 0) {
      digits.push(num % 10);
      num = parseInt(num / 10);
    }
    this.opcode = digits[0] + (digits.length > 1 ? 10 * digits[1] : 0);
    this.modes = digits.slice(2);
  }

  // output param should be treated carefully.
  parseParams() {
    this.params = [...Array(INSTRUCTION[this.opcode].params)]
    .map((_,i) => {
      let param = this.intCode.getMemory(this.intCode.addr + i + 1);
      if ( i < this.modes.length && this.modes[i] === 2) {
        if (INSTRUCTION[this.opcode].output === i) {
          return param + this.intCode.relativeBase;
        }
        return this.intCode.getMemory(param + this.intCode.relativeBase);
      } else if ( i < this.modes.length && this.modes[i] === 1) {
        return param;
      } else {
        if (INSTRUCTION[this.opcode].output === i) {
          return param;
        }
        return this.intCode.getMemory(param);
      }
    });
  }

  run() {
    return INSTRUCTION[this.opcode].proc(this, this.intCode);
  }

  print() {
    if (!this.verbose) {
      return;
    }
    console.log('Instruction:');
    console.log(` instruction code: ${this.intCode.getMemory(this.intCode.addr)}`);
    console.log(`           opcode: ${this.opcode}`);
    console.log(`  parameter modes: ${JSON.stringify(this.modes)}`);
    console.log(`       parameters: ${JSON.stringify(this.params)}`);
  }
}

class IntCodeStream extends Transform{
  constructor(prog, name, inputCb, verbose) {
    super({
      highWaterMark: 1,
      readableObjectMode: true,
      writableObjectMode: true,
    });
    this.inputCb = inputCb;
    this.name = name;
    this.addr = 0;
    this.relativeBase = 0;
    this.input = null;
    this.inputs = [];
    this.verbose = verbose;
    this.paused = false;
    this.terminated = false;
    this.memory = prog.reduce((memory, value, index) => {
      memory[index] = value;
      return memory;
    }, {});
  }

  getMemory(addr) {
    if (addr < 0) {
      throw new Error(`[${this.name}] Invalid Address: ${addr}`);
    }
    return this.memory[addr] || 0;
  }

  setMemory(addr, data) {
    if (addr < 0) {
      throw new Error(`[${this.name}] Invalid Address: ${addr}`);
    }
    this.memory[addr] = data;
  }

  run() {
    if (this.verbose) {
      console.log(`[${this.name}] running program`);
    }
    this.step();
  }

  send(data) {
    this.write({ data: data });
  }

  step() {
    let instruction = new Instruction(this, this.verbose);
    instruction.print();
    if (instruction.run(this)) {
      process.nextTick(() => { this.step(); });
    }
  }

  terminate() {
    this.terminatd = true;
    this.emit('terminate');
  }

  _transform(data, encoding, callback) {
    if (this.terminated) {
      console.warn(`[${this.name}] computer terminated won't handle any input. input received: ${data.data}`);
      callback();
      return;
    }
    if (this.verbose) {
      console.log(`[${this.name}] input: ${data.data}`);
    }
    this.input = {
      data: data.data,
      cb: callback,
    };
    if (this.paused) {
      if (this.verbose) {
        console.log(`[${this.name}] resuming`);
      }
      process.nextTick(() => { this.step(); });
    }
  }

  _flush(callback) {
    if (this.verbose) {
      console.log(`[${this.name}] flush`);
    }
    callback();
  }
}

module.exports = {
  IntCodeStream: IntCodeStream,
  execute: (prog, name, verbose) => {
    return new Promise(resolve => {
      let computer = new IntCodeStream(prog, name, verbose);
      computer.on('terminate', () => {
        resolve(computer);
      });
      computer.run();
    });
  },
}
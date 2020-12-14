const { stringsInLines } = require('../lib/input');

const input = stringsInLines();

const machine = ( data, version = 2 ) => {
  const memory = {};
  let or = 0n;
  let and = 0n;

  let mask = '';
  let addresses = [];

  const maskFn = val => {
    return version === 1 ? ( ( val | or ) & and ) : val;
  };

  const program = data.map(line => {
    const values = line.split('=').map(value => value.trim());

    return values[0] === 'mask' ? ( version === 1 ? {
      cmd: 'mask',
      or: values[1].split('').reduceRight((sum, bit, indx, arr) => sum += bit === '1' ? (2n ** BigInt(arr.length - indx - 1)) : 0n, 0n),
      and: values[1].split('').reduceRight((sum, bit, indx, arr) => sum += bit !== '0' ? (2n ** BigInt(arr.length - indx - 1)) : 0n, 0n),
    } : {
        cmd: 'mask',
        or: values[1].split('').reduceRight((sum, bit, indx, arr) => sum += bit === '1' ? (2n ** BigInt(arr.length - indx - 1)) : 0n, 0n),
        mask: values[1],
      }
    ) : {
      cmd: 'set',
      addr: BigInt(values[0].match(/\[(.*?)\]/)[1], 10),
      val: BigInt(values[1].trim()),
    };
  });

  const calcAddr = (addr, mask) => {
    let i = mask.indexOf('X');
    if (i === -1) {
      addresses.push(addr);
      return;
    }

    const m = (2n ** BigInt(mask.length - i - 1));

    if ((addr & m) === m) {
      calcAddr(addr ^ m, mask.substring(0, i) + '0' + mask.substring(i + 1));
    } else {
      calcAddr(addr, mask.substring(0, i) + '0' + mask.substring(i + 1));
    }


    calcAddr(addr | m, mask.substring(0, i) + '1' + mask.substring(i + 1));
  };

  const run = () => {
    program.forEach( line => {
      if (version === 1) {
        if (line.cmd === 'mask') {
          or = line.or;
          and = line.and;
          return;
        }
        memory[line.addr] = maskFn(line.val);
        return;
      }
      /// version 2
      if (line.cmd === 'mask') {
        or = line.or;
        mask = line.mask;
        return;
      }

      addresses = [];
      calcAddr(line.addr | or, mask);
      addresses.forEach(addr => memory[addr] = line.val);
    });
  };

  return {
    run,
    memory,
  };
}

const mac = machine(input, 1);
mac.run();
const resultA = Object.keys(mac.memory).reduce((sum, key) => sum += mac.memory[key], 0n);
console.log(`Task A: ${resultA}`);

const macv2 = machine(input, 2);
macv2.run();
const resultB = Object.keys(macv2.memory).reduce((sum, key) => sum += macv2.memory[key], 0n);
console.log(`Task B: ${resultB}`);

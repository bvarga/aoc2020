const { stringsInLines } = require('../lib/input');

const data = stringsInLines();

const prepare = data => {
  let row = 0;
  let result = {
    field: {},
    nearbyTickets: [],
  }
  let part = 0;
  while (row < data.length) {
    if (data[row].trim() === '') {

    } else if (data[row].indexOf('your ticket:') > -1 || data[row].indexOf('nearby tickets:') > -1) {
      part++;
    } else if (part === 0) {
      const line = data[row].split(':');
      const rules = line[1].split(' or ');
      result.field[line[0]] = {
        intervals: [],
      };
      rules.forEach(rule => {
        const nums = rule.split('-').map(n => parseInt(n, 10));
        result.field[line[0]].intervals.push(nums);
      });
      result.field[line[0]].validator = num => {
        const res = result.field[line[0]].intervals.reduce((valid, intv) => {
          return valid || num >= intv[0] && num <= intv[1];
        }, false);
        return res;
      }
    } else if (part === 1) {
      result.myTicket = data[row].split(',').map(n => parseInt(n, 10));
    } else if (part === 2) {
      result.nearbyTickets.push(data[row].split(',').map(n => parseInt(n, 10)));
    }
    row++;
  }

  return result;
}

const input = prepare(data);

const isValidNumber = (num, fields) => {
  const res = !!Object.keys(fields).find(key => {
    return fields[key].validator(num)
  });
  return res;
}
const ticketErrorRate = (ticket, fields) => {
  return ticket.reduce(( sum, num) => {
    return sum += isValidNumber(num, fields) ? 0 : num;
  }, 0);
};

const resultA = input.nearbyTickets.reduce((sum, ticket) => {
  return sum += ticketErrorRate(ticket, input.field);
}, 0);

console.log(`TaskA: ${resultA}`);

input.validTickets = [input.myTicket].concat(input.nearbyTickets.filter(ticket => ticketErrorRate(ticket, input.field) === 0));
const possibilities = input.myTicket.map((_, pos) => {
  return Object.keys(input.field).filter(key => {
    const validator = input.field[key].validator;
    return input.validTickets.every(ticket => {
      const res = validator(ticket[pos]);
      return res;
    });
  });
});

const fieldCounts = items => items.reduce((sum, item) => sum += item.length, 0);

const occurance = items => {
  return items.reduce((acc, item) => {
    return item.reduce((acc2, item2) => {
      acc2[item2] = acc2[item2] || 0;
      acc2[item2] += 1;
      return acc2;
    }, acc);
  }, {});
};

const check = possibilities => {
  let items = possibilities.map(p => p.slice());
  let changed = true;
  while (changed) {
    let count = fieldCounts(items);
    const fixed = items.reduce((sum, field) => {
      if (field.length === 1) {
        sum.push(field[0]);
      }
      return sum;
    }, []);
    items = items.map(item => item.length === 1 ? item : item.filter(i => fixed.indexOf(i) === -1 ));
    const occ = occurance(items);
    items = items.map(item => {
      const fix = item.find(i => occ[i] === 1);
      return fix ? [fix] : item;
    });
    changed = count !== fieldCounts(items);
  }

  const taskB = items.reduce((multi, field, indx) => {
    return multi *= field.length > 0 && field[0].startsWith('departure') ? input.myTicket[indx] : 1;
  }, 1);

  console.log(`Task B: ${taskB}`);
}

check(possibilities);

const { stringsInLineWithSeparator } = require('../lib/input');

const passports = stringsInLineWithSeparator('\n\n');
const parsed = passports.map(pp => pp.split(/\n| /));

const validA = parsed.filter(pp => {

  const fields = pp.reduce((set, p) => {
    set.add(p.split(':')[0]);
    return set;
  }, new Set());

  return fields.has('byr') &&
    fields.has('iyr') &&
    fields.has('eyr') &&
    fields.has('hgt') &&
    fields.has('hcl') &&
    fields.has('ecl') &&
    fields.has('pid');
    // cid
});

console.log('Valid A: ', validA.length);

const validHgt = val => {
  return val.indexOf('cm') > -1
    ? (parseInt(val.substr(0, val.indexOf('cm')) ,10) >= 150 && parseInt(val.substr(0, val.indexOf('cm')) ,10) <= 193)
    : val.indexOf('in') > -1
    ? (parseInt(val.substr(0, val.indexOf('in')) ,10) >= 59 && parseInt(val.substr(0, val.indexOf('in')) ,10) <= 76)
    : false;
};

const validB = parsed.filter(pp => {
  const values = {};
  const fields = pp.reduce((set, p) => {
    const key = p.split(':')
    set.add(key[0]);
    values[key[0]] = key[1];
    return set;
  }, new Set());


  return fields.has('byr') && (parseInt(values.byr, 10) >= 1920) && (parseInt(values.byr, 10) <= 2020) &&
    fields.has('iyr') && (parseInt(values.iyr, 10) >= 2010) && (parseInt(values.iyr, 10) <= 2020) &&
    fields.has('eyr') && (parseInt(values.eyr, 10) >= 2020) && (parseInt(values.eyr, 10) <= 2030) &&
    fields.has('hgt') && validHgt(values.hgt) &&
    fields.has('hcl') && values.hcl.match(/^#[0-9a-f]{6}$/i) &&
    fields.has('ecl') && ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(values.ecl) &&
    fields.has('pid') && values.pid.match(/^[0-9]{9}$/i);
    // cid
});

console.log('Valid B: ', validB.length);
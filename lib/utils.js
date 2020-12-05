function increasingNumbers(numbers) {
  let val = -Infinity;
  let index = 0;
  while (index + 1 < numbers.length && numbers[index] <= numbers[index+1]) {
    index++;
  }
  return numbers.length === 1 || index === numbers.length - 1;
}

function adjacentDigits(digits) {
  return digits.reduce((acc, digit, index, digits) => {
    let previousDigit = index > 0 ? digits[index-1] : null;
    let currentDigit = digit;
    if (previousDigit === null) {
      acc[currentDigit] = [1];
    } else {
      if (previousDigit === currentDigit) {
        acc[previousDigit][acc[previousDigit].length - 1]++;
      } else {
        acc[currentDigit] = acc[currentDigit] || [];
        acc[currentDigit].push(1);
      }
    }
    return acc;
  }, {});
}

module.exports = {
  increasingNumbers: increasingNumbers,
  adjacentDigits: adjacentDigits,
}
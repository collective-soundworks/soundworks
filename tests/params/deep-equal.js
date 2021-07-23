const equal = require('fast-deep-equal');

console.log(equal(true, true));
console.log(equal('str', 'str'));
console.log(equal(1, 1));
console.log(equal(0.1, 0.1));
console.log(equal(['a', 'b', 'c'], ['a', 'b', 'c']));
console.log(equal({ a: true }, { a: true }));
console.log(equal({ a: true, b: [0, 1] }, { a: true, b: [0, 1] }));
console.log(equal({ a: true, b: [0, 1] }, { a: true, b: [0, 2] }));

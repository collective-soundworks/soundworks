'use strict';

class Utils {
  constructor() {

  }

  clearArray(a) {
    while (a.length > 0)
      a.pop();
  }

  createIdentityArray(n) {
    var a = [];
    for (let i = 0; i < n; i++) {
      a.push(i);
    }
    return a;
  }

  getRandomInt(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  }

}

module.exports = new Utils();
'use strict';

class Utils {
  constructor() {}

  getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
  }

  getMinOfArray(numArray) {
    return Math.min.apply(null, numArray);
  }
}

module.exports = new Utils();
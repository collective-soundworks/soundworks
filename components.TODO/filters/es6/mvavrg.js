/**
 * Moving avarage filter.
 *
 * @constructor
 * @param {number} size - The inittial filter size.
 */
 class Mvavrg {
  constructor(size) {
    this.__buffer = new Float32Array(size);
    this.__index = 0;
  }

  /**
   * Reset and (optionally) resize filter.
   *
   * @param {number|null} size - The new filter size (optional)
   */
  set size(size) {
    this.__buffer = new Float32Array(size);
    this.__index = 0;
  }

  get size() {
    return this.__buffer.length;
  }

  /**
   * Input and process value.
   *
   * @param {number} value - input value.
   * @returns filtered value
   */
  input(value) {
    this.__buffer[this.__index] = value;

    var sum = 0.0;

    for(var i = 0; i < this.__buffer.length; i++)
      sum += this.__buffer[i];

    this.__index = (this.__index + 1) % this.__buffer.length;

    return sum / this.__buffer.length;
  }
}

module.exports = Mvavrg;

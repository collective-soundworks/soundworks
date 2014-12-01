/**
 * Filter removing offset (combining 1st-order differentiator and integrtor)
 *
 * @constructor
 * @param {number} factor - feedback factor of integrator.
 */
class DiffInteg {
  constructor(factor = 0.98) {
    if(factor < 0)
      factor = 0.0;
    else if(factor > 1)
      factor = 1;

    this.factor = factor;

    this.last = null;
    this.output = 0;
  }

  /**
   * Input and process value.
   *
   * @param {number} value - input value.
   * @returns filtered value
   */
  input(value) {
    if(this.last !== null) {
      var diff = value - this.last;
      this.output = this.factor * (this.output + diff);
    } else {
      this.output = 0.0;
    }
    
    this.last = value;

    return this.output;
  }
}

module.exports = DiffInteg;

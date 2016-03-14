import Signal from './Signal';


/**
 * Call it's observers with true when all its added `Signal` instances are
 * setted to `true`, `false` otherwise.
 * @private
 */
export default class SignalAll extends Signal {
  constructor() {
    super();
    this._dependencies = new Set();
  }

  get length() {
    return this._dependencies.size;
  }

  add(signal) {
    this._dependencies.add(signal);

    signal.addObserver(() => {
      let value = true;

      for (let signal of this._dependencies)
        value = value && signal.get();

      super.set(value);
    });
  }

  set(value) { /* noop */ }
}

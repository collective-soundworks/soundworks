import Signal from './Signal';

/**
 * Compound signal that is `true` when all signals it depends on are `true`.
 * Dependencies are added through the `add` method.
 * @private
 */
class SignalAll extends Signal {
  constructor() {
    super();
    this._sources = new Set();
  }

  get length() {
    return this._sources.size;
  }

  add(signal) {
    this._sources.add(signal);

    signal.addObserver(() => {
      let value = true;

      for (let signal of this._sources) {
        value = value && signal.value;
      }

      super.value = value;
    });
  }
}

export default SignalAll;

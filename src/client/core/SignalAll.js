import Signal from './Signal';

/**
 * Compound signal that is `true` when all signals it depends on are `true`.
 * Dependencies are added through the `add` method.
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

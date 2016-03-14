/**
 *
 *
 */
export default class Signal {
  constructor() {
    this._state = false;
    this._observers = new Set();
  }

  set(value) {
    if (value !== this._state) {
      this._state = value;

      for (let observer of this._observers)
        observer(value);
    }
  }

  get() {
    return this._state;
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }
}

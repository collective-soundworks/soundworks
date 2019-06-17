/**
 * Lightweight EventEmitter mimicing node EventEmitter's API.
 */
class EventEmitter {
  constructor() {
    /**
     * Events
     * @name _events
     * @type {Map<String, Set>}
     * @instanceof Process
     * @private
     */
    this._events = new Map();
  }

  /**
   * Add a callback to a named event
   * @param {String} channel - Name of the event.
   * @param {Function} callback - Callback executed when the event is emitted.
   */
  addListener(channel, callback) {
    if (!this._events.has(channel))
      this._events.set(channel, new Set());

    const stack = this._events.get(channel);
    stack.add(callback);
  }

  /**
   * Remove a callback from a named event
   * @param {String} channel - Name of the event.
   * @param {Function} callback - Callback to remove.
   */
  removeListener(channel, callback) {
    const stack = this._events.get(channel);

    if (stack)
      stack.delete(callback);
  }

  /**
   * Emit a named event
   * @param {String} channel - Name of the event.
   * @param {...Mixed} args - Arguments to pass to the callback.
   */
  emit(channel, ...args) {
    const stack = this._events.get(channel);

    if (stack)
      stack.forEach((callback) => callback(...args));
  }
}

export default EventEmitter;

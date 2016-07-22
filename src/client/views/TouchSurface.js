/**
 * @todo
 * @note - some problems might occur between the way
 * this helper and the viewManager works...
 */
export default class TouchSurface {
  constructor($el) {
    this.$el = $el;
    this.touches = {};

    this._elBoundingRect = null;
    this._listeners = {};

    this._normX = 0;
    this._normY = 0;

    // cache bounding rect values
    window.addEventListener('resize', this._updateBoundingRect.bind(this));
    this._updateBoundingRect();

    // listen events
    this.$el.addEventListener('touchstart', this._handleTouch((id, x, y, t, e) => {
      this.touches[id] = [x, y];
      this._propagate('touchstart', id, x, y, t, e);
    }));

    this.$el.addEventListener('touchmove', this._handleTouch((id, x, y, t, e) => {
      this.touches[id] = [x, y];
      this._propagate('touchmove', id, x, y, t, e);
    }));

    this.$el.addEventListener('touchend', this._handleTouch((id, x, y, t, e) => {
      delete this.touches[id];
      this._propagate('touchend', id, x, y, t, e);
    }));

    this.$el.addEventListener('touchcancel', this._handleTouch((id, x, y, t, e) => {
      delete this.touches[id];
      this._propagate('touchend', id, x, y, t, e);
    }));
  }

  destroy() {
    this.$el.removeEventListener('touchstart', this._handleTouch);
    this.$el.removeEventListener('touchmove', this._handleTouch);
    this.$el.removeEventListener('touchend', this._handleTouch);
    this.$el.removeEventListener('touchcancel', this._handleTouch);
  }

  addListener(eventName, callback) {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }

    this._listeners[eventName].push(callback);
  }

  removeListener(eventName, callback) {
    const listeners = this._listeners[eventName];
    if (!listeners) { return; }

    const index = listeners.indexOf(callback);

    if (index !== -1)
      listeners.splice(index, 1);
  }

  _updateBoundingRect() {
    this._elBoundingRect = this.$el.getBoundingClientRect();
  }

  _handleTouch(callback) {
    return (e) => {
      // if `_updateBoundingRect` has not been been called or
      // has been called when $el was in `display:none` state
      if (!this._elBoundingRect || 
          (this._elBoundingRect.width === 0 && this._elBoundingRect.height === 0)) {
        this._updateBoundingRect();
      }

      const touches = e.changedTouches;
      const boundingRect = this._elBoundingRect;

      for (let i = 0; i < touches.length; i++) {
        const touchEvent = touches[i];
        const touchId = touchEvent.identifier;
        const relX = touchEvent.clientX - boundingRect.left;
        const relY = touchEvent.clientY - boundingRect.top;
        this._normX = relX / boundingRect.width;
        this._normY = relY / boundingRect.height;

        callback(touchId, this._normX, this._normY, touchEvent, e);
      }
    }
  }

  _propagate(eventName, touchId, normX, normY, touch, touchEvent) {
    const listeners = this._listeners[eventName];
    if (!listeners) { return; }

    listeners.forEach((listener) => listener(touchId, normX, normY, touch, touchEvent));
  }
}

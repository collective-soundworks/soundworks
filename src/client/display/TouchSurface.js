
export default class TouchSurface {
  constructor($el) {
    this.$el = $el;
    this.touches = {};

    this._elBoundingRect = null;
    this._listeners = {};

    // cache bounding rect values
    window.addEventListener('resize', this._updateBoundingRect.bind(this));
    this._updateBoundingRect();

    // listen events
    this.$el.addEventListener('touchstart', this._handleTouch((id, x, y, e) => {
      this.touches[id] = [x, y];
      this._propagate('touchstart', id, x, y, e);
    }));

    this.$el.addEventListener('touchmove', this._handleTouch((id, x, y, e) => {
      this.touches[id] = [x, y];
      this._propagate('touchmove', id, x, y, e);
    }));

    this.$el.addEventListener('touchend', this._handleTouch((id, x, y, e) => {
      delete this.touches[id];
      this._propagate('touchend', id, x, y, e);
    }));

    this.$el.addEventListener('touchcancel', this._handleTouch((id, x, y, e) => {
      delete this.touches[id];
      this._propagate('touchend', id, x, y, e);
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
    if (index >= 0) {
      listeners.splice(index, 1);
    }
  }

  _updateBoundingRect() {
    this._elBoundingRect = this.$el.getBoundingClientRect();
  }

  _getNormalizedCoordinates(touchEvent) {
    // @TODO should be cached for performance
    const boundingRect = this._elBoundingRect;

    const relX = touchEvent.clientX - boundingRect.left;
    const relY = touchEvent.clientY - boundingRect.top;
    const normX = relX / boundingRect.width;
    const normY = relY / boundingRect.height;

    return { normX, normY };
  }

  _handleTouch(callback) {
    return (e) => {
      e.preventDefault();
      const touches = e.changedTouches;

      for (let i = 0; i < touches.length; i++) {
        const touchEvent = touches[i];
        const touchId = touchEvent.identifier;
        const { normX, normY } = this._getNormalizedCoordinates(touchEvent);

        callback(touchId, normX, normY, touchEvent);
      }
    }
  }

  _propagate(eventName, touchId, normX, normY, touchEvent) {
    const listeners = this._listeners[eventName];
    if (!listeners) { return; }

    listeners.forEach((listener) => {
      listener(touchId, normX, normY, touchEvent)
    });
  }
}
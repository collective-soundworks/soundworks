/**
 * Helper to handle `touch` events on a given element. Decompose a multitouch
 * event in several parallel events, propagate normalized values according to
 * the size of the container.
 *
 * @param {Element} $el - Element to listen for `touch` events.
 *
 * @memberof module:soundworks/client
 */
class TouchSurface {
  constructor($el) {
    /**
     * Element to listen.
     *
     * @type {Element}
     * @name $el
     * @instance
     * @memberof  module:soundworks/client.TouchSurface
     */
    this.$el = $el;

    /**
     * Touch id, normalized position pairs for each current touches.
     *
     * @type {Number:<Array<Number>>}
     * @name touches
     * @instance
     * @memberof  module:soundworks/client.TouchSurface
     */
    this.touches = {};

    /**
     * Bounding rect of `this.$el`.
     *
     * @type {Object}
     * @name _elBoundingRect
     * @instance
     * @memberof  module:soundworks/client.TouchSurface
     * @private
     */
    this._elBoundingRect = null;

    /**
     * Registered callbacks.
     *
     * @type {Object}
     * @name _listeners
     * @instance
     * @memberof  module:soundworks/client.TouchSurface
     * @private
     */
    this._listeners = {};

    // cache bounding rect values and listen for window resize
    this._updateBoundingRect = this._updateBoundingRect.bind(this);
    window.addEventListener('resize', this._updateBoundingRect);
    this._updateBoundingRect();

    /** @private */
    this._handleTouchStart = this._handleTouch((id, x, y, t, e) => {
      this.touches[id] = [x, y];
      this._propagate('touchstart', id, x, y, t, e);
    });

    /** @private */
    this._handleTouchMove = this._handleTouch((id, x, y, t, e) => {
      this.touches[id] = [x, y];
      this._propagate('touchmove', id, x, y, t, e);
    });

    /** @private */
    this._handleTouchEnd = this._handleTouch((id, x, y, t, e) => {
      delete this.touches[id];
      this._propagate('touchend', id, x, y, t, e);
    });

    this.$el.addEventListener('touchstart', this._handleTouchStart);
    this.$el.addEventListener('touchmove', this._handleTouchMove);
    this.$el.addEventListener('touchend', this._handleTouchEnd);
    this.$el.addEventListener('touchcancel', this._handleTouchEnd);

    // fallback for mouse interactions
  }

  /**
   * Destroy the `TouchSurface`, remove all event listeners from `this.$el`
   * and delete all pointers.
   */
  destroy() {
    window.removeEventListener('resize', this._updateBoundingRect);
    this.$el.removeEventListener('touchstart', this._handleTouchStart);
    this.$el.removeEventListener('touchmove', this._handleTouchMove);
    this.$el.removeEventListener('touchend', this._handleTouchEnd);
    this.$el.removeEventListener('touchcancel', this._handleTouchEnd);
    // delete pointers
    this.$el = null;
    this.listeners = null;
  }

  /**
   * Update bounding rect of `this.$el`
   *
   * @private
   */
  _updateBoundingRect() {
    this._elBoundingRect = this.$el.getBoundingClientRect();
  }

  /**
   * Generic moethod to handle a touch event.
   *
   * @private
   */
  _handleTouch(callback) {
    return (e) => {
      e.preventDefault();
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
        const normX = relX / boundingRect.width;
        const normY = relY / boundingRect.height;

        callback(touchId, normX, normY, touchEvent, e);
      }
    }
  }

  /**
   * Propagate the touch event and normalized values to the listeners.
   *
   * @param {String} eventName - Type of event.
   * @param {Number} touchId - Id of the touch event.
   * @param {Number} normX - Normalized position of the touch in the x axis
   *  according to the width of the element.
   * @param {Number} normY - Normalized position of the touch in the y axis
   *  according to the height of the element.
   * @param {Object} touchEvent - Original touch event (`e.changedTouches[n]`).
   * @param {Object} originalEvent - Original event.
   * @private
   */
  _propagate(eventName, touchId, normX, normY, touchEvent, originalEvent) {
    const listeners = this._listeners[eventName];

    if (listeners.length) {
      listeners.forEach((listener) => {
        listener(touchId, normX, normY, touchEvent, originalEvent);
      });
    }
  }

  /**
   * Callback for touch events
   *
   * @callback module:soundworks/client.TouchSurface~EventListener
   * @param {Number} touchId - Id of the touch.
   * @param {Number} normX - Normalized position in the x axis.
   * @param {Number} normY - Normalized position in the y axis.
   * @param {Touch} touchEvent - The original Touch event.
   * @param {Event} originalEvent - The original event.
   */

  /**
   * Register a listener. __note: `touchcancel` is merge with `touchend`.
   *
   * @param {String} eventName - Name of the event to listen (`touchstart`,
   *  `touchend` or `touchmove`)
   * @param {module:soundworks/client.TouchSurface~EventListener} callback
   */
  addListener(eventName, callback) {
    if (!this._listeners[eventName])
      this._listeners[eventName] = [];

    this._listeners[eventName].push(callback);
  }

  /**
   * Remove a listener. __note: `touchcancel` is merge with `touchend`.
   *
   * @param {String} eventName - Name of the event to listen (`touchstart`,
   *  `touchend` or `touchmove`)
   * @param {module:soundworks/client.TouchSurface~EventListener} callback
   */
  removeListener(eventName, callback) {
    const listeners = this._listeners[eventName];
    if (!listeners) { return; }

    const index = listeners.indexOf(callback);

    if (index !== -1)
      listeners.splice(index, 1);
  }
}

export default TouchSurface;

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Helper to handle `touch` events on a given element. Decompose a multitouch
 * event in several parallel events, propagate normalized values according to
 * the size of the container.
 *
 * @param {Element} $el - Element to listen for `touch` events.
 *
 * @memberof module:soundworks/client
 */
var TouchSurface = function () {
  function TouchSurface($el) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, TouchSurface);

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

    this._normalizeCoordinates = options.normalizeCoordinates !== undefined ? options.normalizeCoordinates : true;

    // cache bounding rect values and listen for window resize
    this._updateBoundingRect = this._updateBoundingRect.bind(this);
    window.addEventListener('resize', this._updateBoundingRect);
    this._updateBoundingRect();

    /** @private */
    this._handleTouchStart = this._handleTouch(function (id, x, y, t, e) {
      _this.touches[id] = [x, y];
      _this._propagate('touchstart', id, x, y, t, e);
    });

    /** @private */
    this._handleTouchMove = this._handleTouch(function (id, x, y, t, e) {
      _this.touches[id] = [x, y];
      _this._propagate('touchmove', id, x, y, t, e);
    });

    /** @private */
    this._handleTouchEnd = this._handleTouch(function (id, x, y, t, e) {
      delete _this.touches[id];
      _this._propagate('touchend', id, x, y, t, e);
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


  (0, _createClass3.default)(TouchSurface, [{
    key: 'destroy',
    value: function destroy() {
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

  }, {
    key: '_updateBoundingRect',
    value: function _updateBoundingRect() {
      //this._elBoundingRect = this.$el.getBoundingClientRect();
      this._elBoundingRect = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    }

    /**
     * Generic moethod to handle a touch event.
     *
     * @private
     */

  }, {
    key: '_handleTouch',
    value: function _handleTouch(callback) {
      var _this2 = this;

      return function (e) {
        e.preventDefault();
        // if `_updateBoundingRect` has not been been called or
        // has been called when $el was in `display:none` state
        if (!_this2._elBoundingRect || _this2._elBoundingRect.width === 0 && _this2._elBoundingRect.height === 0) {
          _this2._updateBoundingRect();
        }

        var touches = e.changedTouches;
        var boundingRect = _this2._elBoundingRect;

        for (var i = 0; i < touches.length; i++) {
          var touchEvent = touches[i];
          var touchId = touchEvent.identifier;

          if (_this2._normalizeCoordinates) {
            var relX = touchEvent.clientX - boundingRect.left;
            var relY = touchEvent.clientY - boundingRect.top;
            var normX = relX / boundingRect.width;
            var normY = relY / boundingRect.height;
            callback(touchId, normX, normY, touchEvent, e);
          } else {
            callback(touchId, touchEvent.clientX, touchEvent.clientY, touchEvent, e);
          }
        }
      };
    }

    /**
     * Propagate the touch event and normalized values to the listeners.
     *
     * @param {String} eventName - Type of event.
     * @param {Number} touchId - Id of the touch event.
     * @param {Number} x - x-position (maybe normalized to the elements width depending on normalizeCoordinates option)
     * @param {Number} y - y-position (maybe normalized to the elements height depending on normalizeCoordinates option)
     *  according to the height of the element.
     * @param {Object} touchEvent - Original touch event (`e.changedTouches[n]`).
     * @param {Object} originalEvent - Original event.
     * @private
     */

  }, {
    key: '_propagate',
    value: function _propagate(eventName, touchId, x, y, touchEvent, originalEvent) {
      var listeners = this._listeners[eventName];

      if (listeners && listeners.length) {
        listeners.forEach(function (listener) {
          listener(touchId, x, y, touchEvent, originalEvent);
        });
      }
    }

    /**
     * Callback for touch events
     *
     * @callback module:soundworks/client.TouchSurface~EventListener
     * @param {Number} touchId - Id of the touch.
     * @param {Number} x - x-position (maybe normalized to the elements width depending on normalizeCoordinates option)
     * @param {Number} y - y-position (maybe normalized to the elements height depending on normalizeCoordinates option)
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

  }, {
    key: 'addListener',
    value: function addListener(eventName, callback) {
      if (!this._listeners[eventName]) this._listeners[eventName] = [];

      this._listeners[eventName].push(callback);
    }

    /**
     * Remove a listener. __note: `touchcancel` is merge with `touchend`.
     *
     * @param {String} eventName - Name of the event to listen (`touchstart`,
     *  `touchend` or `touchmove`)
     * @param {module:soundworks/client.TouchSurface~EventListener} callback
     */

  }, {
    key: 'removeListener',
    value: function removeListener(eventName, callback) {
      var listeners = this._listeners[eventName];
      if (!listeners) {
        return;
      }

      var index = listeners.indexOf(callback);

      if (index !== -1) listeners.splice(index, 1);
    }
  }]);
  return TouchSurface;
}();

exports.default = TouchSurface;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvdWNoU3VyZmFjZS5qcyJdLCJuYW1lcyI6WyJUb3VjaFN1cmZhY2UiLCIkZWwiLCJvcHRpb25zIiwidG91Y2hlcyIsIl9lbEJvdW5kaW5nUmVjdCIsIl9saXN0ZW5lcnMiLCJfbm9ybWFsaXplQ29vcmRpbmF0ZXMiLCJub3JtYWxpemVDb29yZGluYXRlcyIsInVuZGVmaW5lZCIsIl91cGRhdGVCb3VuZGluZ1JlY3QiLCJiaW5kIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9oYW5kbGVUb3VjaFN0YXJ0IiwiX2hhbmRsZVRvdWNoIiwiaWQiLCJ4IiwieSIsInQiLCJlIiwiX3Byb3BhZ2F0ZSIsIl9oYW5kbGVUb3VjaE1vdmUiLCJfaGFuZGxlVG91Y2hFbmQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXJzIiwidG9wIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0Iiwid2lkdGgiLCJpbm5lcldpZHRoIiwiaGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJjYWxsYmFjayIsInByZXZlbnREZWZhdWx0IiwiY2hhbmdlZFRvdWNoZXMiLCJib3VuZGluZ1JlY3QiLCJpIiwibGVuZ3RoIiwidG91Y2hFdmVudCIsInRvdWNoSWQiLCJpZGVudGlmaWVyIiwicmVsWCIsImNsaWVudFgiLCJyZWxZIiwiY2xpZW50WSIsIm5vcm1YIiwibm9ybVkiLCJldmVudE5hbWUiLCJvcmlnaW5hbEV2ZW50IiwiZm9yRWFjaCIsImxpc3RlbmVyIiwicHVzaCIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7SUFTTUEsWTtBQUNKLHdCQUFZQyxHQUFaLEVBQStCO0FBQUE7O0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQzdCOzs7Ozs7OztBQVFBLFNBQUtELEdBQUwsR0FBV0EsR0FBWDs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFLRSxPQUFMLEdBQWUsRUFBZjs7QUFFQTs7Ozs7Ozs7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M0QsRUFBdUVwQixDQUF2RTtBQUNEO0FBQ0Y7QUFDRixPQTFCRDtBQTJCRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OytCQVlXNkIsUyxFQUFXUixPLEVBQVN4QixDLEVBQUdDLEMsRUFBR3NCLFUsRUFBWVUsYSxFQUFlO0FBQzlELFVBQU16QixZQUFZLEtBQUtuQixVQUFMLENBQWdCMkMsU0FBaEIsQ0FBbEI7O0FBRUEsVUFBSXhCLGFBQWFBLFVBQVVjLE1BQTNCLEVBQW1DO0FBQ2pDZCxrQkFBVTBCLE9BQVYsQ0FBa0IsVUFBQ0MsUUFBRCxFQUFjO0FBQzlCQSxtQkFBU1gsT0FBVCxFQUFrQnhCLENBQWxCLEVBQXFCQyxDQUFyQixFQUF3QnNCLFVBQXhCLEVBQW9DVSxhQUFwQztBQUNELFNBRkQ7QUFHRDtBQUNGOztBQUVEOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7O2dDQU9ZRCxTLEVBQVdmLFEsRUFBVTtBQUMvQixVQUFJLENBQUMsS0FBSzVCLFVBQUwsQ0FBZ0IyQyxTQUFoQixDQUFMLEVBQ0UsS0FBSzNDLFVBQUwsQ0FBZ0IyQyxTQUFoQixJQUE2QixFQUE3Qjs7QUFFRixXQUFLM0MsVUFBTCxDQUFnQjJDLFNBQWhCLEVBQTJCSSxJQUEzQixDQUFnQ25CLFFBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7bUNBT2VlLFMsRUFBV2YsUSxFQUFVO0FBQ2xDLFVBQU1ULFlBQVksS0FBS25CLFVBQUwsQ0FBZ0IyQyxTQUFoQixDQUFsQjtBQUNBLFVBQUksQ0FBQ3hCLFNBQUwsRUFBZ0I7QUFBRTtBQUFTOztBQUUzQixVQUFNNkIsUUFBUTdCLFVBQVU4QixPQUFWLENBQWtCckIsUUFBbEIsQ0FBZDs7QUFFQSxVQUFJb0IsVUFBVSxDQUFDLENBQWYsRUFDRTdCLFVBQVUrQixNQUFWLENBQWlCRixLQUFqQixFQUF3QixDQUF4QjtBQUNIOzs7OztrQkFHWXJELFkiLCJmaWxlIjoiVG91Y2hTdXJmYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBIZWxwZXIgdG8gaGFuZGxlIGB0b3VjaGAgZXZlbnRzIG9uIGEgZ2l2ZW4gZWxlbWVudC4gRGVjb21wb3NlIGEgbXVsdGl0b3VjaFxuICogZXZlbnQgaW4gc2V2ZXJhbCBwYXJhbGxlbCBldmVudHMsIHByb3BhZ2F0ZSBub3JtYWxpemVkIHZhbHVlcyBhY2NvcmRpbmcgdG9cbiAqIHRoZSBzaXplIG9mIHRoZSBjb250YWluZXIuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSAkZWwgLSBFbGVtZW50IHRvIGxpc3RlbiBmb3IgYHRvdWNoYCBldmVudHMuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBUb3VjaFN1cmZhY2Uge1xuICBjb25zdHJ1Y3RvcigkZWwsIG9wdGlvbnMgPSB7fSkge1xuICAgIC8qKlxuICAgICAqIEVsZW1lbnQgdG8gbGlzdGVuLlxuICAgICAqXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICogQG5hbWUgJGVsXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mICBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVG91Y2hTdXJmYWNlXG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG5cbiAgICAvKipcbiAgICAgKiBUb3VjaCBpZCwgbm9ybWFsaXplZCBwb3NpdGlvbiBwYWlycyBmb3IgZWFjaCBjdXJyZW50IHRvdWNoZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyOjxBcnJheTxOdW1iZXI+Pn1cbiAgICAgKiBAbmFtZSB0b3VjaGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mICBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVG91Y2hTdXJmYWNlXG4gICAgICovXG4gICAgdGhpcy50b3VjaGVzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBCb3VuZGluZyByZWN0IG9mIGB0aGlzLiRlbGAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIF9lbEJvdW5kaW5nUmVjdFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiAgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlRvdWNoU3VyZmFjZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZWxCb3VuZGluZ1JlY3QgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIF9saXN0ZW5lcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXG4gICAgdGhpcy5fbm9ybWFsaXplQ29vcmRpbmF0ZXMgPSAob3B0aW9ucy5ub3JtYWxpemVDb29yZGluYXRlcyAhPT0gdW5kZWZpbmVkKSA/IG9wdGlvbnMubm9ybWFsaXplQ29vcmRpbmF0ZXMgOiB0cnVlO1xuXG4gICAgLy8gY2FjaGUgYm91bmRpbmcgcmVjdCB2YWx1ZXMgYW5kIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZVxuICAgIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdCA9IHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdC5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QpO1xuICAgIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdCgpO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5faGFuZGxlVG91Y2hTdGFydCA9IHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgdCwgZSkgPT4ge1xuICAgICAgdGhpcy50b3VjaGVzW2lkXSA9IFt4LCB5XTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2hzdGFydCcsIGlkLCB4LCB5LCB0LCBlKTtcbiAgICB9KTtcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIHRoaXMuX2hhbmRsZVRvdWNoTW92ZSA9IHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgdCwgZSkgPT4ge1xuICAgICAgdGhpcy50b3VjaGVzW2lkXSA9IFt4LCB5XTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2htb3ZlJywgaWQsIHgsIHksIHQsIGUpO1xuICAgIH0pO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5faGFuZGxlVG91Y2hFbmQgPSB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIHQsIGUpID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoZXNbaWRdO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaGVuZCcsIGlkLCB4LCB5LCB0LCBlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVUb3VjaE1vdmUpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2hFbmQpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5faGFuZGxlVG91Y2hFbmQpO1xuXG4gICAgLy8gZmFsbGJhY2sgZm9yIG1vdXNlIGludGVyYWN0aW9uc1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIGBUb3VjaFN1cmZhY2VgLCByZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVycyBmcm9tIGB0aGlzLiRlbGBcbiAgICogYW5kIGRlbGV0ZSBhbGwgcG9pbnRlcnMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVUb3VjaE1vdmUpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2hFbmQpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5faGFuZGxlVG91Y2hFbmQpO1xuICAgIC8vIGRlbGV0ZSBwb2ludGVyc1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLmxpc3RlbmVycyA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGJvdW5kaW5nIHJlY3Qgb2YgYHRoaXMuJGVsYFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VwZGF0ZUJvdW5kaW5nUmVjdCgpIHtcbiAgICAvL3RoaXMuX2VsQm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgdGhpcy5fZWxCb3VuZGluZ1JlY3QgPSB7XG4gICAgICB0b3A6IDAsXG4gICAgICBib3R0b206IDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgcmlnaHQ6IDAsXG4gICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4gICAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyaWMgbW9ldGhvZCB0byBoYW5kbGUgYSB0b3VjaCBldmVudC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oYW5kbGVUb3VjaChjYWxsYmFjaykge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gaWYgYF91cGRhdGVCb3VuZGluZ1JlY3RgIGhhcyBub3QgYmVlbiBiZWVuIGNhbGxlZCBvclxuICAgICAgLy8gaGFzIGJlZW4gY2FsbGVkIHdoZW4gJGVsIHdhcyBpbiBgZGlzcGxheTpub25lYCBzdGF0ZVxuICAgICAgaWYgKCF0aGlzLl9lbEJvdW5kaW5nUmVjdCB8fMKgXG4gICAgICAgICAgKHRoaXMuX2VsQm91bmRpbmdSZWN0LndpZHRoID09PSAwICYmIHRoaXMuX2VsQm91bmRpbmdSZWN0LmhlaWdodCA9PT0gMCkpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBlLmNoYW5nZWRUb3VjaGVzO1xuICAgICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy5fZWxCb3VuZGluZ1JlY3Q7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gdG91Y2hlc1tpXTtcbiAgICAgICAgY29uc3QgdG91Y2hJZCA9IHRvdWNoRXZlbnQuaWRlbnRpZmllcjtcblxuICAgICAgICBpZih0aGlzLl9ub3JtYWxpemVDb29yZGluYXRlcykge1xuICAgICAgICAgIGNvbnN0IHJlbFggPSB0b3VjaEV2ZW50LmNsaWVudFggLSBib3VuZGluZ1JlY3QubGVmdDtcbiAgICAgICAgICBjb25zdCByZWxZID0gdG91Y2hFdmVudC5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcbiAgICAgICAgICBjb25zdCBub3JtWCA9IHJlbFggLyBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgICAgICAgY29uc3Qgbm9ybVkgPSByZWxZIC8gYm91bmRpbmdSZWN0LmhlaWdodDtcbiAgICAgICAgICBjYWxsYmFjayh0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQsIGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKHRvdWNoSWQsIHRvdWNoRXZlbnQuY2xpZW50WCAsIHRvdWNoRXZlbnQuY2xpZW50WSwgdG91Y2hFdmVudCwgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgdG91Y2ggZXZlbnQgYW5kIG5vcm1hbGl6ZWQgdmFsdWVzIHRvIHRoZSBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgLSBUeXBlIG9mIGV2ZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdG91Y2hJZCAtIElkIG9mIHRoZSB0b3VjaCBldmVudC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggLSB4LXBvc2l0aW9uIChtYXliZSBub3JtYWxpemVkIHRvIHRoZSBlbGVtZW50cyB3aWR0aCBkZXBlbmRpbmcgb24gbm9ybWFsaXplQ29vcmRpbmF0ZXMgb3B0aW9uKVxuICAgKiBAcGFyYW0ge051bWJlcn0geSAtIHktcG9zaXRpb24gKG1heWJlIG5vcm1hbGl6ZWQgdG8gdGhlIGVsZW1lbnRzIGhlaWdodCBkZXBlbmRpbmcgb24gbm9ybWFsaXplQ29vcmRpbmF0ZXMgb3B0aW9uKVxuICAgKiAgYWNjb3JkaW5nIHRvIHRoZSBoZWlnaHQgb2YgdGhlIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b3VjaEV2ZW50IC0gT3JpZ2luYWwgdG91Y2ggZXZlbnQgKGBlLmNoYW5nZWRUb3VjaGVzW25dYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbEV2ZW50IC0gT3JpZ2luYWwgZXZlbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcHJvcGFnYXRlKGV2ZW50TmFtZSwgdG91Y2hJZCwgeCwgeSwgdG91Y2hFdmVudCwgb3JpZ2luYWxFdmVudCkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuXG4gICAgaWYgKGxpc3RlbmVycyAmJiBsaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgbGlzdGVuZXIodG91Y2hJZCwgeCwgeSwgdG91Y2hFdmVudCwgb3JpZ2luYWxFdmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIHRvdWNoIGV2ZW50c1xuICAgKlxuICAgKiBAY2FsbGJhY2sgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlRvdWNoU3VyZmFjZX5FdmVudExpc3RlbmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0b3VjaElkIC0gSWQgb2YgdGhlIHRvdWNoLlxuICAgKiBAcGFyYW0ge051bWJlcn0geCAtIHgtcG9zaXRpb24gKG1heWJlIG5vcm1hbGl6ZWQgdG8gdGhlIGVsZW1lbnRzIHdpZHRoIGRlcGVuZGluZyBvbiBub3JtYWxpemVDb29yZGluYXRlcyBvcHRpb24pXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0geS1wb3NpdGlvbiAobWF5YmUgbm9ybWFsaXplZCB0byB0aGUgZWxlbWVudHMgaGVpZ2h0IGRlcGVuZGluZyBvbiBub3JtYWxpemVDb29yZGluYXRlcyBvcHRpb24pXG4gICAqIEBwYXJhbSB7VG91Y2h9IHRvdWNoRXZlbnQgLSBUaGUgb3JpZ2luYWwgVG91Y2ggZXZlbnQuXG4gICAqIEBwYXJhbSB7RXZlbnR9IG9yaWdpbmFsRXZlbnQgLSBUaGUgb3JpZ2luYWwgZXZlbnQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyLiBfX25vdGU6IGB0b3VjaGNhbmNlbGAgaXMgbWVyZ2Ugd2l0aCBgdG91Y2hlbmRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIC0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIChgdG91Y2hzdGFydGAsXG4gICAqICBgdG91Y2hlbmRgIG9yIGB0b3VjaG1vdmVgKVxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2V+RXZlbnRMaXN0ZW5lcn0gY2FsbGJhY2tcbiAgICovXG4gIGFkZExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcblxuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyLiBfX25vdGU6IGB0b3VjaGNhbmNlbGAgaXMgbWVyZ2Ugd2l0aCBgdG91Y2hlbmRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIC0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIChgdG91Y2hzdGFydGAsXG4gICAqICBgdG91Y2hlbmRgIG9yIGB0b3VjaG1vdmVgKVxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2V+RXZlbnRMaXN0ZW5lcn0gY2FsbGJhY2tcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWxpc3RlbmVycykgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvdWNoU3VyZmFjZTtcbiJdfQ==
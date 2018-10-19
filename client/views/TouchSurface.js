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
      this._elBoundingRect = this.$el.getBoundingClientRect();

      // this has been introduced in 6c8234bb83d2df3e56f1b21a0caea4e4ef657eb4 and
      // breaks a lot of things... respecify the behavior when
      // normalizeCoordinates === false, because is not related to the given
      // element (this.$el) as implemented.
      // (the only app that depends on this option is probably coloop, so check it)
      // this._elBoundingRect = {
      //   top: 0,
      //   bottom: 0,
      //   left: 0,
      //   right: 0,
      //   width: window.innerWidth,
      //   height: window.innerHeight,
      // };
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvdWNoU3VyZmFjZS5qcyJdLCJuYW1lcyI6WyJUb3VjaFN1cmZhY2UiLCIkZWwiLCJvcHRpb25zIiwidG91Y2hlcyIsIl9lbEJvdW5kaW5nUmVjdCIsIl9saXN0ZW5lcnMiLCJfbm9ybWFsaXplQ29vcmRpbmF0ZXMiLCJub3JtYWxpemVDb29yZGluYXRlcyIsInVuZGVmaW5lZCIsIl91cGRhdGVCb3VuZGluZ1JlY3QiLCJiaW5kIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9oYW5kbGVUb3VjaFN0YXJ0IiwiX2hhbmRsZVRvdWNoIiwiaWQiLCJ4IiwieSIsInQiLCJlIiwiX3Byb3BhZ2F0ZSIsIl9oYW5kbGVUb3VjaE1vdmUiLCJfaGFuZGxlVG91Y2hFbmQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXJzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2FsbGJhY2siLCJwcmV2ZW50RGVmYXVsdCIsIndpZHRoIiwiaGVpZ2h0IiwiY2hhbmdlZFRvdWNoZXMiLCJib3VuZGluZ1JlY3QiLCJpIiwibGVuZ3RoIiwidG91Y2hFdmVudCIsInRvdWNoSWQiLCJpZGVudGlmaWVyIiwicmVsWCIsImNsaWVudFgiLCJsZWZ0IiwicmVsWSIsImNsaWVudFkiLCJ0b3AiLCJub3JtWCIsIm5vcm1ZIiwiZXZlbnROYW1lIiwib3JpZ2luYWxFdmVudCIsImZvckVhY2giLCJsaXN0ZW5lciIsInB1c2giLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7O0lBU01BLFk7QUFDSix3QkFBWUMsR0FBWixFQUErQjtBQUFBOztBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUM3Qjs7Ozs7Ozs7QUFRQSxTQUFLRCxHQUFMLEdBQVdBLEdBQVg7O0FBRUE7Ozs7Ozs7O0FBUUEsU0FBS0UsT0FBTCxHQUFlLEVBQWY7O0FBRUE7Ozs7Ozs7OztBQVNBLFNBQUtDLGVBQUwsR0FB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K0JBWVcwQixTLEVBQVdWLE8sRUFBU25CLEMsRUFBR0MsQyxFQUFHaUIsVSxFQUFZWSxhLEVBQWU7QUFDOUQsVUFBTXRCLFlBQVksS0FBS25CLFVBQUwsQ0FBZ0J3QyxTQUFoQixDQUFsQjs7QUFFQSxVQUFJckIsYUFBYUEsVUFBVVMsTUFBM0IsRUFBbUM7QUFDakNULGtCQUFVdUIsT0FBVixDQUFrQixVQUFDQyxRQUFELEVBQWM7QUFDOUJBLG1CQUFTYixPQUFULEVBQWtCbkIsQ0FBbEIsRUFBcUJDLENBQXJCLEVBQXdCaUIsVUFBeEIsRUFBb0NZLGFBQXBDO0FBQ0QsU0FGRDtBQUdEO0FBQ0Y7O0FBRUQ7Ozs7Ozs7Ozs7O0FBV0E7Ozs7Ozs7Ozs7Z0NBT1lELFMsRUFBV25CLFEsRUFBVTtBQUMvQixVQUFJLENBQUMsS0FBS3JCLFVBQUwsQ0FBZ0J3QyxTQUFoQixDQUFMLEVBQ0UsS0FBS3hDLFVBQUwsQ0FBZ0J3QyxTQUFoQixJQUE2QixFQUE3Qjs7QUFFRixXQUFLeEMsVUFBTCxDQUFnQndDLFNBQWhCLEVBQTJCSSxJQUEzQixDQUFnQ3ZCLFFBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7bUNBT2VtQixTLEVBQVduQixRLEVBQVU7QUFDbEMsVUFBTUYsWUFBWSxLQUFLbkIsVUFBTCxDQUFnQndDLFNBQWhCLENBQWxCO0FBQ0EsVUFBSSxDQUFDckIsU0FBTCxFQUFnQjtBQUFFO0FBQVM7O0FBRTNCLFVBQU0wQixRQUFRMUIsVUFBVTJCLE9BQVYsQ0FBa0J6QixRQUFsQixDQUFkOztBQUVBLFVBQUl3QixVQUFVLENBQUMsQ0FBZixFQUNFMUIsVUFBVTRCLE1BQVYsQ0FBaUJGLEtBQWpCLEVBQXdCLENBQXhCO0FBQ0g7Ozs7O2tCQUdZbEQsWSIsImZpbGUiOiJUb3VjaFN1cmZhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlciB0byBoYW5kbGUgYHRvdWNoYCBldmVudHMgb24gYSBnaXZlbiBlbGVtZW50LiBEZWNvbXBvc2UgYSBtdWx0aXRvdWNoXG4gKiBldmVudCBpbiBzZXZlcmFsIHBhcmFsbGVsIGV2ZW50cywgcHJvcGFnYXRlIG5vcm1hbGl6ZWQgdmFsdWVzIGFjY29yZGluZyB0b1xuICogdGhlIHNpemUgb2YgdGhlIGNvbnRhaW5lci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIEVsZW1lbnQgdG8gbGlzdGVuIGZvciBgdG91Y2hgIGV2ZW50cy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIFRvdWNoU3VyZmFjZSB7XG4gIGNvbnN0cnVjdG9yKCRlbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqXG4gICAgICogRWxlbWVudCB0byBsaXN0ZW4uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKiBAbmFtZSAkZWxcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2VcbiAgICAgKi9cbiAgICB0aGlzLiRlbCA9ICRlbDtcblxuICAgIC8qKlxuICAgICAqIFRvdWNoIGlkLCBub3JtYWxpemVkIHBvc2l0aW9uIHBhaXJzIGZvciBlYWNoIGN1cnJlbnQgdG91Y2hlcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXI6PEFycmF5PE51bWJlcj4+fVxuICAgICAqIEBuYW1lIHRvdWNoZXNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2VcbiAgICAgKi9cbiAgICB0aGlzLnRvdWNoZXMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIEJvdW5kaW5nIHJlY3Qgb2YgYHRoaXMuJGVsYC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgX2VsQm91bmRpbmdSZWN0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mICBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVG91Y2hTdXJmYWNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBSZWdpc3RlcmVkIGNhbGxiYWNrcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgX2xpc3RlbmVyc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiAgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlRvdWNoU3VyZmFjZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG5cbiAgICB0aGlzLl9ub3JtYWxpemVDb29yZGluYXRlcyA9IChvcHRpb25zLm5vcm1hbGl6ZUNvb3JkaW5hdGVzICE9PSB1bmRlZmluZWQpID8gb3B0aW9ucy5ub3JtYWxpemVDb29yZGluYXRlcyA6IHRydWU7XG5cbiAgICAvLyBjYWNoZSBib3VuZGluZyByZWN0IHZhbHVlcyBhbmQgbGlzdGVuIGZvciB3aW5kb3cgcmVzaXplXG4gICAgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0ID0gdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0LmJpbmQodGhpcyk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdCk7XG4gICAgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0KCk7XG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICB0aGlzLl9oYW5kbGVUb3VjaFN0YXJ0ID0gdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCB0LCBlKSA9PiB7XG4gICAgICB0aGlzLnRvdWNoZXNbaWRdID0gW3gsIHldO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaHN0YXJ0JywgaWQsIHgsIHksIHQsIGUpO1xuICAgIH0pO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5faGFuZGxlVG91Y2hNb3ZlID0gdGhpcy5faGFuZGxlVG91Y2goKGlkLCB4LCB5LCB0LCBlKSA9PiB7XG4gICAgICB0aGlzLnRvdWNoZXNbaWRdID0gW3gsIHldO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaG1vdmUnLCBpZCwgeCwgeSwgdCwgZSk7XG4gICAgfSk7XG5cbiAgICAvKiogQHByaXZhdGUgKi9cbiAgICB0aGlzLl9oYW5kbGVUb3VjaEVuZCA9IHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgdCwgZSkgPT4ge1xuICAgICAgZGVsZXRlIHRoaXMudG91Y2hlc1tpZF07XG4gICAgICB0aGlzLl9wcm9wYWdhdGUoJ3RvdWNoZW5kJywgaWQsIHgsIHksIHQsIGUpO1xuICAgIH0pO1xuXG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX2hhbmRsZVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX2hhbmRsZVRvdWNoTW92ZSk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9oYW5kbGVUb3VjaEVuZCk7XG4gICAgdGhpcy4kZWwuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9oYW5kbGVUb3VjaEVuZCk7XG5cbiAgICAvLyBmYWxsYmFjayBmb3IgbW91c2UgaW50ZXJhY3Rpb25zXG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSB0aGUgYFRvdWNoU3VyZmFjZWAsIHJlbW92ZSBhbGwgZXZlbnQgbGlzdGVuZXJzIGZyb20gYHRoaXMuJGVsYFxuICAgKiBhbmQgZGVsZXRlIGFsbCBwb2ludGVycy5cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuX2hhbmRsZVRvdWNoU3RhcnQpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRoaXMuX2hhbmRsZVRvdWNoTW92ZSk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB0aGlzLl9oYW5kbGVUb3VjaEVuZCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hjYW5jZWwnLCB0aGlzLl9oYW5kbGVUb3VjaEVuZCk7XG4gICAgLy8gZGVsZXRlIHBvaW50ZXJzXG4gICAgdGhpcy4kZWwgPSBudWxsO1xuICAgIHRoaXMubGlzdGVuZXJzID0gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYm91bmRpbmcgcmVjdCBvZiBgdGhpcy4kZWxgXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdXBkYXRlQm91bmRpbmdSZWN0KCkge1xuICAgIHRoaXMuX2VsQm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAvLyB0aGlzIGhhcyBiZWVuIGludHJvZHVjZWQgaW4gNmM4MjM0YmI4M2QyZGYzZTU2ZjFiMjFhMGNhZWE0ZTRlZjY1N2ViNCBhbmRcbiAgICAvLyBicmVha3MgYSBsb3Qgb2YgdGhpbmdzLi4uIHJlc3BlY2lmeSB0aGUgYmVoYXZpb3Igd2hlblxuICAgIC8vIG5vcm1hbGl6ZUNvb3JkaW5hdGVzID09PSBmYWxzZSwgYmVjYXVzZSBpcyBub3QgcmVsYXRlZCB0byB0aGUgZ2l2ZW5cbiAgICAvLyBlbGVtZW50ICh0aGlzLiRlbCkgYXMgaW1wbGVtZW50ZWQuXG4gICAgLy8gKHRoZSBvbmx5IGFwcCB0aGF0IGRlcGVuZHMgb24gdGhpcyBvcHRpb24gaXMgcHJvYmFibHkgY29sb29wLCBzbyBjaGVjayBpdClcbiAgICAvLyB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IHtcbiAgICAvLyAgIHRvcDogMCxcbiAgICAvLyAgIGJvdHRvbTogMCxcbiAgICAvLyAgIGxlZnQ6IDAsXG4gICAgLy8gICByaWdodDogMCxcbiAgICAvLyAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbiAgICAvLyAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuICAgIC8vIH07XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJpYyBtb2V0aG9kIHRvIGhhbmRsZSBhIHRvdWNoIGV2ZW50LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2hhbmRsZVRvdWNoKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIChlKSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAvLyBpZiBgX3VwZGF0ZUJvdW5kaW5nUmVjdGAgaGFzIG5vdCBiZWVuIGJlZW4gY2FsbGVkIG9yXG4gICAgICAvLyBoYXMgYmVlbiBjYWxsZWQgd2hlbiAkZWwgd2FzIGluIGBkaXNwbGF5Om5vbmVgIHN0YXRlXG4gICAgICBpZiAoIXRoaXMuX2VsQm91bmRpbmdSZWN0IHx8wqBcbiAgICAgICAgICAodGhpcy5fZWxCb3VuZGluZ1JlY3Qud2lkdGggPT09IDAgJiYgdGhpcy5fZWxCb3VuZGluZ1JlY3QuaGVpZ2h0ID09PSAwKSkge1xuICAgICAgICB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QoKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgdG91Y2hlcyA9IGUuY2hhbmdlZFRvdWNoZXM7XG4gICAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLl9lbEJvdW5kaW5nUmVjdDtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRvdWNoRXZlbnQgPSB0b3VjaGVzW2ldO1xuICAgICAgICBjb25zdCB0b3VjaElkID0gdG91Y2hFdmVudC5pZGVudGlmaWVyO1xuXG4gICAgICAgIGlmICh0aGlzLl9ub3JtYWxpemVDb29yZGluYXRlcykge1xuICAgICAgICAgIGNvbnN0IHJlbFggPSB0b3VjaEV2ZW50LmNsaWVudFggLSBib3VuZGluZ1JlY3QubGVmdDtcbiAgICAgICAgICBjb25zdCByZWxZID0gdG91Y2hFdmVudC5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcbiAgICAgICAgICBjb25zdCBub3JtWCA9IHJlbFggLyBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgICAgICAgY29uc3Qgbm9ybVkgPSByZWxZIC8gYm91bmRpbmdSZWN0LmhlaWdodDtcbiAgICAgICAgICBjYWxsYmFjayh0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQsIGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhbGxiYWNrKHRvdWNoSWQsIHRvdWNoRXZlbnQuY2xpZW50WCAsIHRvdWNoRXZlbnQuY2xpZW50WSwgdG91Y2hFdmVudCwgZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgdG91Y2ggZXZlbnQgYW5kIG5vcm1hbGl6ZWQgdmFsdWVzIHRvIHRoZSBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgLSBUeXBlIG9mIGV2ZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdG91Y2hJZCAtIElkIG9mIHRoZSB0b3VjaCBldmVudC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHggLSB4LXBvc2l0aW9uIChtYXliZSBub3JtYWxpemVkIHRvIHRoZSBlbGVtZW50cyB3aWR0aCBkZXBlbmRpbmcgb24gbm9ybWFsaXplQ29vcmRpbmF0ZXMgb3B0aW9uKVxuICAgKiBAcGFyYW0ge051bWJlcn0geSAtIHktcG9zaXRpb24gKG1heWJlIG5vcm1hbGl6ZWQgdG8gdGhlIGVsZW1lbnRzIGhlaWdodCBkZXBlbmRpbmcgb24gbm9ybWFsaXplQ29vcmRpbmF0ZXMgb3B0aW9uKVxuICAgKiAgYWNjb3JkaW5nIHRvIHRoZSBoZWlnaHQgb2YgdGhlIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b3VjaEV2ZW50IC0gT3JpZ2luYWwgdG91Y2ggZXZlbnQgKGBlLmNoYW5nZWRUb3VjaGVzW25dYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbEV2ZW50IC0gT3JpZ2luYWwgZXZlbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcHJvcGFnYXRlKGV2ZW50TmFtZSwgdG91Y2hJZCwgeCwgeSwgdG91Y2hFdmVudCwgb3JpZ2luYWxFdmVudCkge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuXG4gICAgaWYgKGxpc3RlbmVycyAmJiBsaXN0ZW5lcnMubGVuZ3RoKSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcbiAgICAgICAgbGlzdGVuZXIodG91Y2hJZCwgeCwgeSwgdG91Y2hFdmVudCwgb3JpZ2luYWxFdmVudCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIHRvdWNoIGV2ZW50c1xuICAgKlxuICAgKiBAY2FsbGJhY2sgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlRvdWNoU3VyZmFjZX5FdmVudExpc3RlbmVyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0b3VjaElkIC0gSWQgb2YgdGhlIHRvdWNoLlxuICAgKiBAcGFyYW0ge051bWJlcn0geCAtIHgtcG9zaXRpb24gKG1heWJlIG5vcm1hbGl6ZWQgdG8gdGhlIGVsZW1lbnRzIHdpZHRoIGRlcGVuZGluZyBvbiBub3JtYWxpemVDb29yZGluYXRlcyBvcHRpb24pXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB5IC0geS1wb3NpdGlvbiAobWF5YmUgbm9ybWFsaXplZCB0byB0aGUgZWxlbWVudHMgaGVpZ2h0IGRlcGVuZGluZyBvbiBub3JtYWxpemVDb29yZGluYXRlcyBvcHRpb24pXG4gICAqIEBwYXJhbSB7VG91Y2h9IHRvdWNoRXZlbnQgLSBUaGUgb3JpZ2luYWwgVG91Y2ggZXZlbnQuXG4gICAqIEBwYXJhbSB7RXZlbnR9IG9yaWdpbmFsRXZlbnQgLSBUaGUgb3JpZ2luYWwgZXZlbnQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyLiBfX25vdGU6IGB0b3VjaGNhbmNlbGAgaXMgbWVyZ2Ugd2l0aCBgdG91Y2hlbmRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIC0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIChgdG91Y2hzdGFydGAsXG4gICAqICBgdG91Y2hlbmRgIG9yIGB0b3VjaG1vdmVgKVxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2V+RXZlbnRMaXN0ZW5lcn0gY2FsbGJhY2tcbiAgICovXG4gIGFkZExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcblxuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyLiBfX25vdGU6IGB0b3VjaGNhbmNlbGAgaXMgbWVyZ2Ugd2l0aCBgdG91Y2hlbmRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIC0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIChgdG91Y2hzdGFydGAsXG4gICAqICBgdG91Y2hlbmRgIG9yIGB0b3VjaG1vdmVgKVxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2V+RXZlbnRMaXN0ZW5lcn0gY2FsbGJhY2tcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWxpc3RlbmVycykgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvdWNoU3VyZmFjZTtcbiJdfQ==
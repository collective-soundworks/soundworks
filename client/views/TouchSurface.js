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
          var relX = touchEvent.clientX - boundingRect.left;
          var relY = touchEvent.clientY - boundingRect.top;
          var normX = relX / boundingRect.width;
          var normY = relY / boundingRect.height;

          callback(touchId, normX, normY, touchEvent, e);
        }
      };
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

  }, {
    key: '_propagate',
    value: function _propagate(eventName, touchId, normX, normY, touchEvent, originalEvent) {
      var listeners = this._listeners[eventName];

      if (listeners && listeners.length) {
        listeners.forEach(function (listener) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlRvdWNoU3VyZmFjZS5qcyJdLCJuYW1lcyI6WyJUb3VjaFN1cmZhY2UiLCIkZWwiLCJ0b3VjaGVzIiwiX2VsQm91bmRpbmdSZWN0IiwiX2xpc3RlbmVycyIsIl91cGRhdGVCb3VuZGluZ1JlY3QiLCJiaW5kIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9oYW5kbGVUb3VjaFN0YXJ0IiwiX2hhbmRsZVRvdWNoIiwiaWQiLCJ4IiwieSIsInQiLCJlIiwiX3Byb3BhZ2F0ZSIsIl9oYW5kbGVUb3VjaE1vdmUiLCJfaGFuZGxlVG91Y2hFbmQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwibGlzdGVuZXJzIiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY2FsbGJhY2siLCJwcmV2ZW50RGVmYXVsdCIsIndpZHRoIiwiaGVpZ2h0IiwiY2hhbmdlZFRvdWNoZXMiLCJib3VuZGluZ1JlY3QiLCJpIiwibGVuZ3RoIiwidG91Y2hFdmVudCIsInRvdWNoSWQiLCJpZGVudGlmaWVyIiwicmVsWCIsImNsaWVudFgiLCJsZWZ0IiwicmVsWSIsImNsaWVudFkiLCJ0b3AiLCJub3JtWCIsIm5vcm1ZIiwiZXZlbnROYW1lIiwib3JpZ2luYWxFdmVudCIsImZvckVhY2giLCJsaXN0ZW5lciIsInB1c2giLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7O0lBU01BLFk7QUFDSix3QkFBWUMsR0FBWixFQUFpQjtBQUFBOztBQUFBOztBQUNmOzs7Ozs7OztBQVFBLFNBQUtBLEdBQUwsR0FBV0EsR0FBWDs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFLQyxPQUFMLEdBQWUsRUFBZjs7QUFFQTs7Ozs7Ozs7O0FBU0EsU0FBS0MsZUFBTCxHQUF1QixJQUF2Qjs7QUFFQTs7Ozs7Ozs7O0FBU0EsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjs7QUFFQTtBQUNBLFNBQUtDLG1CQUFMLEdBQTJCLEtBQUtBLG1CQUFMLENBQXlC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LFVBQUwsQ0FBZ0JxQyxTQUFoQixJQUE2QixFQUE3Qjs7QUFFRixXQUFLckMsVUFBTCxDQUFnQnFDLFNBQWhCLEVBQTJCSSxJQUEzQixDQUFnQ3ZCLFFBQWhDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7bUNBT2VtQixTLEVBQVduQixRLEVBQVU7QUFDbEMsVUFBTUYsWUFBWSxLQUFLaEIsVUFBTCxDQUFnQnFDLFNBQWhCLENBQWxCO0FBQ0EsVUFBSSxDQUFDckIsU0FBTCxFQUFnQjtBQUFFO0FBQVM7O0FBRTNCLFVBQU0wQixRQUFRMUIsVUFBVTJCLE9BQVYsQ0FBa0J6QixRQUFsQixDQUFkOztBQUVBLFVBQUl3QixVQUFVLENBQUMsQ0FBZixFQUNFMUIsVUFBVTRCLE1BQVYsQ0FBaUJGLEtBQWpCLEVBQXdCLENBQXhCO0FBQ0g7Ozs7O2tCQUdZOUMsWSIsImZpbGUiOiJUb3VjaFN1cmZhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEhlbHBlciB0byBoYW5kbGUgYHRvdWNoYCBldmVudHMgb24gYSBnaXZlbiBlbGVtZW50LiBEZWNvbXBvc2UgYSBtdWx0aXRvdWNoXG4gKiBldmVudCBpbiBzZXZlcmFsIHBhcmFsbGVsIGV2ZW50cywgcHJvcGFnYXRlIG5vcm1hbGl6ZWQgdmFsdWVzIGFjY29yZGluZyB0b1xuICogdGhlIHNpemUgb2YgdGhlIGNvbnRhaW5lci5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9ICRlbCAtIEVsZW1lbnQgdG8gbGlzdGVuIGZvciBgdG91Y2hgIGV2ZW50cy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIFRvdWNoU3VyZmFjZSB7XG4gIGNvbnN0cnVjdG9yKCRlbCkge1xuICAgIC8qKlxuICAgICAqIEVsZW1lbnQgdG8gbGlzdGVuLlxuICAgICAqXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICogQG5hbWUgJGVsXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mICBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVG91Y2hTdXJmYWNlXG4gICAgICovXG4gICAgdGhpcy4kZWwgPSAkZWw7XG5cbiAgICAvKipcbiAgICAgKiBUb3VjaCBpZCwgbm9ybWFsaXplZCBwb3NpdGlvbiBwYWlycyBmb3IgZWFjaCBjdXJyZW50IHRvdWNoZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyOjxBcnJheTxOdW1iZXI+Pn1cbiAgICAgKiBAbmFtZSB0b3VjaGVzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mICBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVG91Y2hTdXJmYWNlXG4gICAgICovXG4gICAgdGhpcy50b3VjaGVzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBCb3VuZGluZyByZWN0IG9mIGB0aGlzLiRlbGAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIF9lbEJvdW5kaW5nUmVjdFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiAgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlRvdWNoU3VyZmFjZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZWxCb3VuZGluZ1JlY3QgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogUmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIF9saXN0ZW5lcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuXG4gICAgLy8gY2FjaGUgYm91bmRpbmcgcmVjdCB2YWx1ZXMgYW5kIGxpc3RlbiBmb3Igd2luZG93IHJlc2l6ZVxuICAgIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdCA9IHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdC5iaW5kKHRoaXMpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QpO1xuICAgIHRoaXMuX3VwZGF0ZUJvdW5kaW5nUmVjdCgpO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5faGFuZGxlVG91Y2hTdGFydCA9IHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgdCwgZSkgPT4ge1xuICAgICAgdGhpcy50b3VjaGVzW2lkXSA9IFt4LCB5XTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2hzdGFydCcsIGlkLCB4LCB5LCB0LCBlKTtcbiAgICB9KTtcblxuICAgIC8qKiBAcHJpdmF0ZSAqL1xuICAgIHRoaXMuX2hhbmRsZVRvdWNoTW92ZSA9IHRoaXMuX2hhbmRsZVRvdWNoKChpZCwgeCwgeSwgdCwgZSkgPT4ge1xuICAgICAgdGhpcy50b3VjaGVzW2lkXSA9IFt4LCB5XTtcbiAgICAgIHRoaXMuX3Byb3BhZ2F0ZSgndG91Y2htb3ZlJywgaWQsIHgsIHksIHQsIGUpO1xuICAgIH0pO1xuXG4gICAgLyoqIEBwcml2YXRlICovXG4gICAgdGhpcy5faGFuZGxlVG91Y2hFbmQgPSB0aGlzLl9oYW5kbGVUb3VjaCgoaWQsIHgsIHksIHQsIGUpID0+IHtcbiAgICAgIGRlbGV0ZSB0aGlzLnRvdWNoZXNbaWRdO1xuICAgICAgdGhpcy5fcHJvcGFnYXRlKCd0b3VjaGVuZCcsIGlkLCB4LCB5LCB0LCBlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLiRlbC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVUb3VjaE1vdmUpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2hFbmQpO1xuICAgIHRoaXMuJGVsLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5faGFuZGxlVG91Y2hFbmQpO1xuXG4gICAgLy8gZmFsbGJhY2sgZm9yIG1vdXNlIGludGVyYWN0aW9uc1xuICB9XG5cbiAgLyoqXG4gICAqIERlc3Ryb3kgdGhlIGBUb3VjaFN1cmZhY2VgLCByZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVycyBmcm9tIGB0aGlzLiRlbGBcbiAgICogYW5kIGRlbGV0ZSBhbGwgcG9pbnRlcnMuXG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl91cGRhdGVCb3VuZGluZ1JlY3QpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLl9oYW5kbGVUb3VjaFN0YXJ0KTtcbiAgICB0aGlzLiRlbC5yZW1vdmVFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCB0aGlzLl9oYW5kbGVUb3VjaE1vdmUpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5faGFuZGxlVG91Y2hFbmQpO1xuICAgIHRoaXMuJGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RvdWNoY2FuY2VsJywgdGhpcy5faGFuZGxlVG91Y2hFbmQpO1xuICAgIC8vIGRlbGV0ZSBwb2ludGVyc1xuICAgIHRoaXMuJGVsID0gbnVsbDtcbiAgICB0aGlzLmxpc3RlbmVycyA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGJvdW5kaW5nIHJlY3Qgb2YgYHRoaXMuJGVsYFxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3VwZGF0ZUJvdW5kaW5nUmVjdCgpIHtcbiAgICB0aGlzLl9lbEJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyaWMgbW9ldGhvZCB0byBoYW5kbGUgYSB0b3VjaCBldmVudC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9oYW5kbGVUb3VjaChjYWxsYmFjaykge1xuICAgIHJldHVybiAoZSkgPT4ge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgLy8gaWYgYF91cGRhdGVCb3VuZGluZ1JlY3RgIGhhcyBub3QgYmVlbiBiZWVuIGNhbGxlZCBvclxuICAgICAgLy8gaGFzIGJlZW4gY2FsbGVkIHdoZW4gJGVsIHdhcyBpbiBgZGlzcGxheTpub25lYCBzdGF0ZVxuICAgICAgaWYgKCF0aGlzLl9lbEJvdW5kaW5nUmVjdCB8fMKgXG4gICAgICAgICAgKHRoaXMuX2VsQm91bmRpbmdSZWN0LndpZHRoID09PSAwICYmIHRoaXMuX2VsQm91bmRpbmdSZWN0LmhlaWdodCA9PT0gMCkpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlQm91bmRpbmdSZWN0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHRvdWNoZXMgPSBlLmNoYW5nZWRUb3VjaGVzO1xuICAgICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy5fZWxCb3VuZGluZ1JlY3Q7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0b3VjaEV2ZW50ID0gdG91Y2hlc1tpXTtcbiAgICAgICAgY29uc3QgdG91Y2hJZCA9IHRvdWNoRXZlbnQuaWRlbnRpZmllcjtcbiAgICAgICAgY29uc3QgcmVsWCA9IHRvdWNoRXZlbnQuY2xpZW50WCAtIGJvdW5kaW5nUmVjdC5sZWZ0O1xuICAgICAgICBjb25zdCByZWxZID0gdG91Y2hFdmVudC5jbGllbnRZIC0gYm91bmRpbmdSZWN0LnRvcDtcbiAgICAgICAgY29uc3Qgbm9ybVggPSByZWxYIC8gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgICAgICBjb25zdCBub3JtWSA9IHJlbFkgLyBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgICAgIGNhbGxiYWNrKHRvdWNoSWQsIG5vcm1YLCBub3JtWSwgdG91Y2hFdmVudCwgZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgdG91Y2ggZXZlbnQgYW5kIG5vcm1hbGl6ZWQgdmFsdWVzIHRvIHRoZSBsaXN0ZW5lcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgLSBUeXBlIG9mIGV2ZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdG91Y2hJZCAtIElkIG9mIHRoZSB0b3VjaCBldmVudC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1YIC0gTm9ybWFsaXplZCBwb3NpdGlvbiBvZiB0aGUgdG91Y2ggaW4gdGhlIHggYXhpc1xuICAgKiAgYWNjb3JkaW5nIHRvIHRoZSB3aWR0aCBvZiB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1ZIC0gTm9ybWFsaXplZCBwb3NpdGlvbiBvZiB0aGUgdG91Y2ggaW4gdGhlIHkgYXhpc1xuICAgKiAgYWNjb3JkaW5nIHRvIHRoZSBoZWlnaHQgb2YgdGhlIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB0b3VjaEV2ZW50IC0gT3JpZ2luYWwgdG91Y2ggZXZlbnQgKGBlLmNoYW5nZWRUb3VjaGVzW25dYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcmlnaW5hbEV2ZW50IC0gT3JpZ2luYWwgZXZlbnQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcHJvcGFnYXRlKGV2ZW50TmFtZSwgdG91Y2hJZCwgbm9ybVgsIG5vcm1ZLCB0b3VjaEV2ZW50LCBvcmlnaW5hbEV2ZW50KSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG5cbiAgICBpZiAobGlzdGVuZXJzICYmIGxpc3RlbmVycy5sZW5ndGgpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xuICAgICAgICBsaXN0ZW5lcih0b3VjaElkLCBub3JtWCwgbm9ybVksIHRvdWNoRXZlbnQsIG9yaWdpbmFsRXZlbnQpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciB0b3VjaCBldmVudHNcbiAgICpcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2V+RXZlbnRMaXN0ZW5lclxuICAgKiBAcGFyYW0ge051bWJlcn0gdG91Y2hJZCAtIElkIG9mIHRoZSB0b3VjaC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IG5vcm1YIC0gTm9ybWFsaXplZCBwb3NpdGlvbiBpbiB0aGUgeCBheGlzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gbm9ybVkgLSBOb3JtYWxpemVkIHBvc2l0aW9uIGluIHRoZSB5IGF4aXMuXG4gICAqIEBwYXJhbSB7VG91Y2h9IHRvdWNoRXZlbnQgLSBUaGUgb3JpZ2luYWwgVG91Y2ggZXZlbnQuXG4gICAqIEBwYXJhbSB7RXZlbnR9IG9yaWdpbmFsRXZlbnQgLSBUaGUgb3JpZ2luYWwgZXZlbnQuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyLiBfX25vdGU6IGB0b3VjaGNhbmNlbGAgaXMgbWVyZ2Ugd2l0aCBgdG91Y2hlbmRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIC0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIChgdG91Y2hzdGFydGAsXG4gICAqICBgdG91Y2hlbmRgIG9yIGB0b3VjaG1vdmVgKVxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2V+RXZlbnRMaXN0ZW5lcn0gY2FsbGJhY2tcbiAgICovXG4gIGFkZExpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcblxuICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyLiBfX25vdGU6IGB0b3VjaGNhbmNlbGAgaXMgbWVyZ2Ugd2l0aCBgdG91Y2hlbmRgLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIC0gTmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuIChgdG91Y2hzdGFydGAsXG4gICAqICBgdG91Y2hlbmRgIG9yIGB0b3VjaG1vdmVgKVxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5Ub3VjaFN1cmZhY2V+RXZlbnRMaXN0ZW5lcn0gY2FsbGJhY2tcbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGV2ZW50TmFtZSwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAoIWxpc3RlbmVycykgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvdWNoU3VyZmFjZTtcbiJdfQ==
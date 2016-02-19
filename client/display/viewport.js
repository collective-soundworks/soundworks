'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Set = require('babel-runtime/core-js/set')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _events = require('events');

/**
 * Service to track the viewport size and orientation.
 */

var Viewport = (function () {
  function Viewport() {
    var _this = this;

    _classCallCheck(this, Viewport);

    /**
     * Width of the viewport.
     * @type {Number}
     */
    this.width = null;

    /**
     * Height of the viewport.
     * @type {Number}
     */
    this.height = null;

    /**
     * Orientation of the viewport ('portrait'|'landscape').
     * @type {String}
     */
    this.orientation = null;

    /**
     * List of the callback to trigger when `resize` is triggered by the window.
     */
    this._callbacks = new _Set();

    // initialize service
    this._onResize = this._onResize.bind(this);
    // listen window events (is `DOMContentLoaded` usefull?)
    window.addEventListener('DOMContentLoaded', function () {
      return _this._onResize();
    });
    window.addEventListener('resize', this._onResize, false);
  }

  /**
   * Register a listener for the `window.resize` event. The callback is executed
   * with current values when registered.
   * @param {Function} callback - The callback to execute.
   */

  _createClass(Viewport, [{
    key: 'addResizeListener',
    value: function addResizeListener(callback) {
      this._callbacks.add(callback);
      // call immediatly with current values
      callback(this.width, this.height, this.orientation);
    }

    /**
     * Remove a listener for the `window.resize` event.
     * @param {Function} callback - The callback to remove.
     */
  }, {
    key: 'removeResizeListener',
    value: function removeResizeListener(callback) {
      this._callbacks['delete'](callback);
    }
  }, {
    key: '_onResize',
    value: function _onResize() {
      var _this2 = this;

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.orientation = this.width > this.height ? 'landscape' : 'portrait';

      this._callbacks.forEach(function (callback) {
        callback(_this2.width, _this2.height, _this2.orientation);
      });
    }
  }]);

  return Viewport;
})();

;

/**
 * Singleton for the whole application to be used as a service.
 * @type {Viewport}
 */
var viewport = new Viewport();

exports['default'] = viewport;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS92aWV3cG9ydC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7c0JBQTZCLFFBQVE7Ozs7OztJQUsvQixRQUFRO0FBQ0QsV0FEUCxRQUFRLEdBQ0U7OzswQkFEVixRQUFROzs7Ozs7QUFNVixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTWxCLFFBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNbkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7O0FBS3hCLFFBQUksQ0FBQyxVQUFVLEdBQUcsVUFBUyxDQUFDOzs7QUFHNUIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0MsVUFBTSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFO2FBQU0sTUFBSyxTQUFTLEVBQUU7S0FBQSxDQUFDLENBQUM7QUFDcEUsVUFBTSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzFEOzs7Ozs7OztlQTlCRyxRQUFROztXQXFDSywyQkFBQyxRQUFRLEVBQUU7QUFDMUIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTlCLGNBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQ3JEOzs7Ozs7OztXQU1tQiw4QkFBQyxRQUFRLEVBQUU7QUFDN0IsVUFBSSxDQUFDLFVBQVUsVUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ2xDOzs7V0FFUSxxQkFBRzs7O0FBQ1YsVUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQy9CLFVBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUNqQyxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxXQUFXLEdBQUcsVUFBVSxDQUFDOztBQUV2RSxVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUNwQyxnQkFBUSxDQUFDLE9BQUssS0FBSyxFQUFFLE9BQUssTUFBTSxFQUFFLE9BQUssV0FBVyxDQUFDLENBQUM7T0FDckQsQ0FBQyxDQUFDO0tBQ0o7OztTQTNERyxRQUFROzs7QUE0RGIsQ0FBQzs7Ozs7O0FBTUYsSUFBTSxRQUFRLEdBQUcsSUFBSSxRQUFRLEVBQUUsQ0FBQzs7cUJBRWpCLFFBQVEiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L3ZpZXdwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqXG4gKiBTZXJ2aWNlIHRvIHRyYWNrIHRoZSB2aWV3cG9ydCBzaXplIGFuZCBvcmllbnRhdGlvbi5cbiAqL1xuY2xhc3MgVmlld3BvcnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBPcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjYWxsYmFjayB0byB0cmlnZ2VyIHdoZW4gYHJlc2l6ZWAgaXMgdHJpZ2dlcmVkIGJ5IHRoZSB3aW5kb3cuXG4gICAgICovXG4gICAgdGhpcy5fY2FsbGJhY2tzID0gbmV3IFNldCgpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBzZXJ2aWNlXG4gICAgdGhpcy5fb25SZXNpemUgPSB0aGlzLl9vblJlc2l6ZS5iaW5kKHRoaXMpO1xuICAgIC8vIGxpc3RlbiB3aW5kb3cgZXZlbnRzIChpcyBgRE9NQ29udGVudExvYWRlZGAgdXNlZnVsbD8pXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB0aGlzLl9vblJlc2l6ZSgpKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemUsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGxpc3RlbmVyIGZvciB0aGUgYHdpbmRvdy5yZXNpemVgIGV2ZW50LiBUaGUgY2FsbGJhY2sgaXMgZXhlY3V0ZWRcbiAgICogd2l0aCBjdXJyZW50IHZhbHVlcyB3aGVuIHJlZ2lzdGVyZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUuXG4gICAqL1xuICBhZGRSZXNpemVMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5hZGQoY2FsbGJhY2spO1xuICAgIC8vIGNhbGwgaW1tZWRpYXRseSB3aXRoIGN1cnJlbnQgdmFsdWVzXG4gICAgY2FsbGJhY2sodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHRoaXMub3JpZW50YXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZvciB0aGUgYHdpbmRvdy5yZXNpemVgIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVSZXNpemVMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5kZWxldGUoY2FsbGJhY2spO1xuICB9XG5cbiAgX29uUmVzaXplKCkge1xuICAgIHRoaXMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gdGhpcy53aWR0aCA+IHRoaXMuaGVpZ2h0ID8gJ2xhbmRzY2FwZScgOiAncG9ydHJhaXQnO1xuXG4gICAgdGhpcy5fY2FsbGJhY2tzLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICBjYWxsYmFjayh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5vcmllbnRhdGlvbik7XG4gICAgfSk7XG4gIH1cbn07XG5cbi8qKlxuICogU2luZ2xldG9uIGZvciB0aGUgd2hvbGUgYXBwbGljYXRpb24gdG8gYmUgdXNlZCBhcyBhIHNlcnZpY2UuXG4gKiBAdHlwZSB7Vmlld3BvcnR9XG4gKi9cbmNvbnN0IHZpZXdwb3J0ID0gbmV3IFZpZXdwb3J0KCk7XG5cbmV4cG9ydCBkZWZhdWx0IHZpZXdwb3J0O1xuIl19
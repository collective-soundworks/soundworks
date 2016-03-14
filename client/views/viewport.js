'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service to track the viewport size and orientation.
 */
var viewport = {
  /**
   * Initialize the service, is called in `client._initViews`.
   * @private
   */

  init: function init() {
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
    this._callbacks = new _set2.default();

    // initialize service
    this._onResize = this._onResize.bind(this);

    this._onResize();
    window.addEventListener('resize', this._onResize, false);
  },


  /**
   * Register a listener for the `window.resize` event. The callback is executed
   * with current values when registered.
   * @param {Function} callback - The callback to execute.
   */
  addResizeListener: function addResizeListener(callback) {
    this._callbacks.add(callback);
    // call immediatly with current values
    callback(this.width, this.height, this.orientation);
  },


  /**
   * Remove a listener for the `window.resize` event.
   * @param {Function} callback - The callback to remove.
   */
  removeResizeListener: function removeResizeListener(callback) {
    this._callbacks.delete(callback);
  },


  /** @private */
  _onResize: function _onResize() {
    var _this = this;

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.orientation = this.width > this.height ? 'landscape' : 'portrait';

    this._callbacks.forEach(function (callback) {
      callback(_this.width, _this.height, _this.orientation);
    });
  }
};

exports.default = viewport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLElBQU0sV0FBVzs7Ozs7O0FBS2Ysd0JBQU87Ozs7O0FBS0wsU0FBSyxLQUFMLEdBQWEsSUFBYjs7Ozs7O0FBTEssUUFXTCxDQUFLLE1BQUwsR0FBYyxJQUFkOzs7Ozs7QUFYSyxRQWlCTCxDQUFLLFdBQUwsR0FBbUIsSUFBbkI7Ozs7O0FBakJLLFFBc0JMLENBQUssVUFBTCxHQUFrQixtQkFBbEI7OztBQXRCSyxRQXlCTCxDQUFLLFNBQUwsR0FBaUIsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixJQUFwQixDQUFqQixDQXpCSzs7QUEyQkwsU0FBSyxTQUFMLEdBM0JLO0FBNEJMLFdBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBSyxTQUFMLEVBQWdCLEtBQWxELEVBNUJLO0dBTFE7Ozs7Ozs7O0FBeUNmLGdEQUFrQixVQUFVO0FBQzFCLFNBQUssVUFBTCxDQUFnQixHQUFoQixDQUFvQixRQUFwQjs7QUFEMEIsWUFHMUIsQ0FBUyxLQUFLLEtBQUwsRUFBWSxLQUFLLE1BQUwsRUFBYSxLQUFLLFdBQUwsQ0FBbEMsQ0FIMEI7R0F6Q2I7Ozs7Ozs7QUFtRGYsc0RBQXFCLFVBQVU7QUFDN0IsU0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLFFBQXZCLEVBRDZCO0dBbkRoQjs7OztBQXdEZixrQ0FBWTs7O0FBQ1YsU0FBSyxLQUFMLEdBQWEsT0FBTyxVQUFQLENBREg7QUFFVixTQUFLLE1BQUwsR0FBYyxPQUFPLFdBQVAsQ0FGSjtBQUdWLFNBQUssV0FBTCxHQUFtQixLQUFLLEtBQUwsR0FBYSxLQUFLLE1BQUwsR0FBYyxXQUEzQixHQUF5QyxVQUF6QyxDQUhUOztBQUtWLFNBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QixVQUFDLFFBQUQsRUFBYztBQUNwQyxlQUFTLE1BQUssS0FBTCxFQUFZLE1BQUssTUFBTCxFQUFhLE1BQUssV0FBTCxDQUFsQyxDQURvQztLQUFkLENBQXhCLENBTFU7R0F4REc7Q0FBWDs7a0JBbUVTIiwiZmlsZSI6InZpZXdwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTZXJ2aWNlIHRvIHRyYWNrIHRoZSB2aWV3cG9ydCBzaXplIGFuZCBvcmllbnRhdGlvbi5cbiAqL1xuY29uc3Qgdmlld3BvcnQgPSB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2aWNlLCBpcyBjYWxsZWQgaW4gYGNsaWVudC5faW5pdFZpZXdzYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGluaXQoKSB7XG4gICAgLyoqXG4gICAgICogV2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBIZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgY2FsbGJhY2sgdG8gdHJpZ2dlciB3aGVuIGByZXNpemVgIGlzIHRyaWdnZXJlZCBieSB0aGUgd2luZG93LlxuICAgICAqL1xuICAgIHRoaXMuX2NhbGxiYWNrcyA9IG5ldyBTZXQoKTtcblxuICAgIC8vIGluaXRpYWxpemUgc2VydmljZVxuICAgIHRoaXMuX29uUmVzaXplID0gdGhpcy5fb25SZXNpemUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX29uUmVzaXplKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uUmVzaXplLCBmYWxzZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIHRoZSBgd2luZG93LnJlc2l6ZWAgZXZlbnQuIFRoZSBjYWxsYmFjayBpcyBleGVjdXRlZFxuICAgKiB3aXRoIGN1cnJlbnQgdmFsdWVzIHdoZW4gcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZS5cbiAgICovXG4gIGFkZFJlc2l6ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgLy8gY2FsbCBpbW1lZGlhdGx5IHdpdGggY3VycmVudCB2YWx1ZXNcbiAgICBjYWxsYmFjayh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5vcmllbnRhdGlvbik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZvciB0aGUgYHdpbmRvdy5yZXNpemVgIGV2ZW50LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVSZXNpemVMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5kZWxldGUoY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXNpemUoKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG5cbiAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLm9yaWVudGF0aW9uKTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZpZXdwb3J0O1xuIl19
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service to track the viewport size and orientation. All views are
 * automatically added as listeners of this helper via their
 * [`View#onResize`]{@link module:soundworks/client.View#onResize}
 *
 * @namespace
 * @memberof module:soundworks/client
 *
 * @see {@link module:soundworks/client.View#onResize}
 */
var viewport = {
  /**
   * Width of the viewport.
   * @type {Number}
   */
  width: null,

  /**
   * Height of the viewport.
   * @type {Number}
   */
  height: null,

  /**
   * Orientation of the viewport (`'portrait'|'landscape').
   * @type {String}
   */
  orientation: null,

  /**
   * List of the callback to trigger when `resize` is triggered by the window.
   * @type {Set}
   * @private
   */
  _callbacks: new _set2.default(),

  /**
   * Initialize the service, is called in `client._initViews`.
   * @private
   */
  init: function init() {
    this._onResize = this._onResize.bind(this);

    this._onResize();
    window.addEventListener('resize', this._onResize, false);
  },


  /**
   * @callback module:soundworks/client.viewport~resizeCallback
   * @param {Number} width - Width of the viewport.
   * @param {Number} height - Height of the viewport.
   * @param {String} orientation - Orientation of the viewport.
   */
  /**
   * Register a listener for the `window.resize` event. The callback is executed
   * with current values when registered.
   * @param {module:soundworks/client.viewport~resizeCallback} callback - Callback to execute.
   */
  addResizeListener: function addResizeListener(callback) {
    this._callbacks.add(callback);
    // execute immediatly with current values
    callback(this.width, this.height, this.orientation);
  },


  /**
   * Remove a listener for the `window.resize` event.
   * @param {module:soundworks/client.viewport~resizeCallback} callback - Callback to remove.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQSxJQUFNLFdBQVc7Ozs7O0FBS2YsU0FBTyxJQUFQOzs7Ozs7QUFNQSxVQUFRLElBQVI7Ozs7OztBQU1BLGVBQWEsSUFBYjs7Ozs7OztBQU9BLGNBQVksbUJBQVo7Ozs7OztBQU1BLHdCQUFPO0FBQ0wsU0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakIsQ0FESzs7QUFHTCxTQUFLLFNBQUwsR0FISztBQUlMLFdBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBSyxTQUFMLEVBQWdCLEtBQWxELEVBSks7R0E5QlE7Ozs7Ozs7Ozs7Ozs7O0FBZ0RmLGdEQUFrQixVQUFVO0FBQzFCLFNBQUssVUFBTCxDQUFnQixHQUFoQixDQUFvQixRQUFwQjs7QUFEMEIsWUFHMUIsQ0FBUyxLQUFLLEtBQUwsRUFBWSxLQUFLLE1BQUwsRUFBYSxLQUFLLFdBQUwsQ0FBbEMsQ0FIMEI7R0FoRGI7Ozs7Ozs7QUEwRGYsc0RBQXFCLFVBQVU7QUFDN0IsU0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLFFBQXZCLEVBRDZCO0dBMURoQjs7OztBQStEZixrQ0FBWTs7O0FBQ1YsU0FBSyxLQUFMLEdBQWEsT0FBTyxVQUFQLENBREg7QUFFVixTQUFLLE1BQUwsR0FBYyxPQUFPLFdBQVAsQ0FGSjtBQUdWLFNBQUssV0FBTCxHQUFtQixLQUFLLEtBQUwsR0FBYSxLQUFLLE1BQUwsR0FBYyxXQUEzQixHQUF5QyxVQUF6QyxDQUhUOztBQUtWLFNBQUssVUFBTCxDQUFnQixPQUFoQixDQUF3QixVQUFDLFFBQUQsRUFBYztBQUNwQyxlQUFTLE1BQUssS0FBTCxFQUFZLE1BQUssTUFBTCxFQUFhLE1BQUssV0FBTCxDQUFsQyxDQURvQztLQUFkLENBQXhCLENBTFU7R0EvREc7Q0FBWDs7a0JBMEVTIiwiZmlsZSI6InZpZXdwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTZXJ2aWNlIHRvIHRyYWNrIHRoZSB2aWV3cG9ydCBzaXplIGFuZCBvcmllbnRhdGlvbi4gQWxsIHZpZXdzIGFyZVxuICogYXV0b21hdGljYWxseSBhZGRlZCBhcyBsaXN0ZW5lcnMgb2YgdGhpcyBoZWxwZXIgdmlhIHRoZWlyXG4gKiBbYFZpZXcjb25SZXNpemVgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvblJlc2l6ZX1cbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjb25SZXNpemV9XG4gKi9cbmNvbnN0IHZpZXdwb3J0ID0ge1xuICAvKipcbiAgICogV2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgd2lkdGg6IG51bGwsXG5cbiAgLyoqXG4gICAqIEhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICBoZWlnaHQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoYCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgb3JpZW50YXRpb246IG51bGwsXG5cbiAgLyoqXG4gICAqIExpc3Qgb2YgdGhlIGNhbGxiYWNrIHRvIHRyaWdnZXIgd2hlbiBgcmVzaXplYCBpcyB0cmlnZ2VyZWQgYnkgdGhlIHdpbmRvdy5cbiAgICogQHR5cGUge1NldH1cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9jYWxsYmFja3M6IG5ldyBTZXQoKSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc2VydmljZSwgaXMgY2FsbGVkIGluIGBjbGllbnQuX2luaXRWaWV3c2AuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0KCkge1xuICAgIHRoaXMuX29uUmVzaXplID0gdGhpcy5fb25SZXNpemUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX29uUmVzaXplKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX29uUmVzaXplLCBmYWxzZSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQudmlld3BvcnR+cmVzaXplQ2FsbGJhY2tcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gV2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9yaWVudGF0aW9uIC0gT3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIHRoZSBgd2luZG93LnJlc2l6ZWAgZXZlbnQuIFRoZSBjYWxsYmFjayBpcyBleGVjdXRlZFxuICAgKiB3aXRoIGN1cnJlbnQgdmFsdWVzIHdoZW4gcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQudmlld3BvcnR+cmVzaXplQ2FsbGJhY2t9IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gZXhlY3V0ZS5cbiAgICovXG4gIGFkZFJlc2l6ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgLy8gZXhlY3V0ZSBpbW1lZGlhdGx5IHdpdGggY3VycmVudCB2YWx1ZXNcbiAgICBjYWxsYmFjayh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5vcmllbnRhdGlvbik7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZvciB0aGUgYHdpbmRvdy5yZXNpemVgIGV2ZW50LlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH5yZXNpemVDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVSZXNpemVMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2NhbGxiYWNrcy5kZWxldGUoY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXNpemUoKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG5cbiAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLm9yaWVudGF0aW9uKTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHZpZXdwb3J0O1xuIl19
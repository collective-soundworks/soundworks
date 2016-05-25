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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFVQSxJQUFNLFdBQVc7Ozs7O0FBS2YsU0FBTyxJQUxROzs7Ozs7QUFXZixVQUFRLElBWE87Ozs7OztBQWlCZixlQUFhLElBakJFOzs7Ozs7O0FBd0JmLGNBQVksbUJBeEJHOzs7Ozs7QUE4QmYsTUE5QmUsa0JBOEJSO0FBQ0wsU0FBSyxTQUFMLEdBQWlCLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsSUFBcEIsQ0FBakI7O0FBRUEsU0FBSyxTQUFMO0FBQ0EsV0FBTyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxLQUFLLFNBQXZDLEVBQWtELEtBQWxEO0FBQ0QsR0FuQ2M7Ozs7Ozs7Ozs7Ozs7O0FBZ0RmLG1CQWhEZSw2QkFnREcsUUFoREgsRUFnRGE7QUFDMUIsU0FBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLFFBQXBCOztBQUVBLGFBQVMsS0FBSyxLQUFkLEVBQXFCLEtBQUssTUFBMUIsRUFBa0MsS0FBSyxXQUF2QztBQUNELEdBcERjOzs7Ozs7O0FBMERmLHNCQTFEZSxnQ0EwRE0sUUExRE4sRUEwRGdCO0FBQzdCLFNBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixRQUF2QjtBQUNELEdBNURjOzs7O0FBK0RmLFdBL0RlLHVCQStESDtBQUFBOztBQUNWLFNBQUssS0FBTCxHQUFhLE9BQU8sVUFBcEI7QUFDQSxTQUFLLE1BQUwsR0FBYyxPQUFPLFdBQXJCO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssS0FBTCxHQUFhLEtBQUssTUFBbEIsR0FBMkIsV0FBM0IsR0FBeUMsVUFBNUQ7O0FBRUEsU0FBSyxVQUFMLENBQWdCLE9BQWhCLENBQXdCLFVBQUMsUUFBRCxFQUFjO0FBQ3BDLGVBQVMsTUFBSyxLQUFkLEVBQXFCLE1BQUssTUFBMUIsRUFBa0MsTUFBSyxXQUF2QztBQUNELEtBRkQ7QUFHRDtBQXZFYyxDQUFqQjs7a0JBMEVlLFEiLCJmaWxlIjoidmlld3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFNlcnZpY2UgdG8gdHJhY2sgdGhlIHZpZXdwb3J0IHNpemUgYW5kIG9yaWVudGF0aW9uLiBBbGwgdmlld3MgYXJlXG4gKiBhdXRvbWF0aWNhbGx5IGFkZGVkIGFzIGxpc3RlbmVycyBvZiB0aGlzIGhlbHBlciB2aWEgdGhlaXJcbiAqIFtgVmlldyNvblJlc2l6ZWBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I29uUmVzaXplfVxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvblJlc2l6ZX1cbiAqL1xuY29uc3Qgdmlld3BvcnQgPSB7XG4gIC8qKlxuICAgKiBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB3aWR0aDogbnVsbCxcblxuICAvKipcbiAgICogSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGhlaWdodDogbnVsbCxcblxuICAvKipcbiAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0IChgJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJykuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICBvcmllbnRhdGlvbjogbnVsbCxcblxuICAvKipcbiAgICogTGlzdCBvZiB0aGUgY2FsbGJhY2sgdG8gdHJpZ2dlciB3aGVuIGByZXNpemVgIGlzIHRyaWdnZXJlZCBieSB0aGUgd2luZG93LlxuICAgKiBAdHlwZSB7U2V0fVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NhbGxiYWNrczogbmV3IFNldCgpLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBzZXJ2aWNlLCBpcyBjYWxsZWQgaW4gYGNsaWVudC5faW5pdFZpZXdzYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGluaXQoKSB7XG4gICAgdGhpcy5fb25SZXNpemUgPSB0aGlzLl9vblJlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fb25SZXNpemUoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fb25SZXNpemUsIGZhbHNlKTtcbiAgfSxcblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH5yZXNpemVDYWxsYmFja1xuICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBIZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBPcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICAvKipcbiAgICogUmVnaXN0ZXIgYSBsaXN0ZW5lciBmb3IgdGhlIGB3aW5kb3cucmVzaXplYCBldmVudC4gVGhlIGNhbGxiYWNrIGlzIGV4ZWN1dGVkXG4gICAqIHdpdGggY3VycmVudCB2YWx1ZXMgd2hlbiByZWdpc3RlcmVkLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH5yZXNpemVDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBleGVjdXRlLlxuICAgKi9cbiAgYWRkUmVzaXplTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9jYWxsYmFja3MuYWRkKGNhbGxiYWNrKTtcbiAgICAvLyBleGVjdXRlIGltbWVkaWF0bHkgd2l0aCBjdXJyZW50IHZhbHVlc1xuICAgIGNhbGxiYWNrKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLm9yaWVudGF0aW9uKTtcbiAgfSxcblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZm9yIHRoZSBgd2luZG93LnJlc2l6ZWAgZXZlbnQuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdwb3J0fnJlc2l6ZUNhbGxiYWNrfSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmRlbGV0ZShjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlc2l6ZSgpIHtcbiAgICB0aGlzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IHRoaXMud2lkdGggPiB0aGlzLmhlaWdodCA/ICdsYW5kc2NhcGUnIDogJ3BvcnRyYWl0JztcblxuICAgIHRoaXMuX2NhbGxiYWNrcy5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgY2FsbGJhY2sodGhpcy53aWR0aCwgdGhpcy5oZWlnaHQsIHRoaXMub3JpZW50YXRpb24pO1xuICAgIH0pO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgdmlld3BvcnQ7XG4iXX0=
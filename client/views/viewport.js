'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _events = require('events');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Service to track the viewport size and orientation.
 */

var Viewport = function () {
  function Viewport() {
    var _this = this;

    (0, _classCallCheck3.default)(this, Viewport);

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


  (0, _createClass3.default)(Viewport, [{
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
      this._callbacks.delete(callback);
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
}();

;

/**
 * Singleton for the whole application to be used as a service.
 * @type {Viewport}
 */
var viewport = new Viewport();

exports.default = viewport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdwb3J0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7OztJQUtNO0FBQ0osV0FESSxRQUNKLEdBQWM7Ozt3Q0FEVixVQUNVOzs7Ozs7QUFLWixTQUFLLEtBQUwsR0FBYSxJQUFiOzs7Ozs7QUFMWSxRQVdaLENBQUssTUFBTCxHQUFjLElBQWQ7Ozs7OztBQVhZLFFBaUJaLENBQUssV0FBTCxHQUFtQixJQUFuQjs7Ozs7QUFqQlksUUFzQlosQ0FBSyxVQUFMLEdBQWtCLG1CQUFsQjs7O0FBdEJZLFFBeUJaLENBQUssU0FBTCxHQUFpQixLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLElBQXBCLENBQWpCOztBQXpCWSxVQTJCWixDQUFPLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QzthQUFNLE1BQUssU0FBTDtLQUFOLENBQTVDLENBM0JZO0FBNEJaLFdBQU8sZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBSyxTQUFMLEVBQWdCLEtBQWxELEVBNUJZO0dBQWQ7Ozs7Ozs7Ozs2QkFESTs7c0NBcUNjLFVBQVU7QUFDMUIsV0FBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLFFBQXBCOztBQUQwQixjQUcxQixDQUFTLEtBQUssS0FBTCxFQUFZLEtBQUssTUFBTCxFQUFhLEtBQUssV0FBTCxDQUFsQyxDQUgwQjs7Ozs7Ozs7Ozt5Q0FVUCxVQUFVO0FBQzdCLFdBQUssVUFBTCxDQUFnQixNQUFoQixDQUF1QixRQUF2QixFQUQ2Qjs7OztnQ0FJbkI7OztBQUNWLFdBQUssS0FBTCxHQUFhLE9BQU8sVUFBUCxDQURIO0FBRVYsV0FBSyxNQUFMLEdBQWMsT0FBTyxXQUFQLENBRko7QUFHVixXQUFLLFdBQUwsR0FBbUIsS0FBSyxLQUFMLEdBQWEsS0FBSyxNQUFMLEdBQWMsV0FBM0IsR0FBeUMsVUFBekMsQ0FIVDs7QUFLVixXQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBd0IsVUFBQyxRQUFELEVBQWM7QUFDcEMsaUJBQVMsT0FBSyxLQUFMLEVBQVksT0FBSyxNQUFMLEVBQWEsT0FBSyxXQUFMLENBQWxDLENBRG9DO09BQWQsQ0FBeEIsQ0FMVTs7O1NBbkRSOzs7QUE0REw7Ozs7OztBQU1ELElBQU0sV0FBVyxJQUFJLFFBQUosRUFBWDs7a0JBRVMiLCJmaWxlIjoidmlld3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gdHJhY2sgdGhlIHZpZXdwb3J0IHNpemUgYW5kIG9yaWVudGF0aW9uLlxuICovXG5jbGFzcyBWaWV3cG9ydCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJykuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNhbGxiYWNrIHRvIHRyaWdnZXIgd2hlbiBgcmVzaXplYCBpcyB0cmlnZ2VyZWQgYnkgdGhlIHdpbmRvdy5cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxsYmFja3MgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyBpbml0aWFsaXplIHNlcnZpY2VcbiAgICB0aGlzLl9vblJlc2l6ZSA9IHRoaXMuX29uUmVzaXplLmJpbmQodGhpcyk7XG4gICAgLy8gbGlzdGVuIHdpbmRvdyBldmVudHMgKGlzIGBET01Db250ZW50TG9hZGVkYCB1c2VmdWxsPylcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHRoaXMuX29uUmVzaXplKCkpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIHRoZSBgd2luZG93LnJlc2l6ZWAgZXZlbnQuIFRoZSBjYWxsYmFjayBpcyBleGVjdXRlZFxuICAgKiB3aXRoIGN1cnJlbnQgdmFsdWVzIHdoZW4gcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZS5cbiAgICovXG4gIGFkZFJlc2l6ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgLy8gY2FsbCBpbW1lZGlhdGx5IHdpdGggY3VycmVudCB2YWx1ZXNcbiAgICBjYWxsYmFjayh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5vcmllbnRhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZm9yIHRoZSBgd2luZG93LnJlc2l6ZWAgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cblxuICBfb25SZXNpemUoKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG5cbiAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLm9yaWVudGF0aW9uKTtcbiAgICB9KTtcbiAgfVxufTtcblxuLyoqXG4gKiBTaW5nbGV0b24gZm9yIHRoZSB3aG9sZSBhcHBsaWNhdGlvbiB0byBiZSB1c2VkIGFzIGEgc2VydmljZS5cbiAqIEB0eXBlIHtWaWV3cG9ydH1cbiAqL1xuY29uc3Qgdmlld3BvcnQgPSBuZXcgVmlld3BvcnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgdmlld3BvcnQ7XG4iXX0=
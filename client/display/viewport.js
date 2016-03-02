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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvdmlld3BvcnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O3NCQUE2QixRQUFROzs7Ozs7SUFLL0IsUUFBUTtBQUNELFdBRFAsUUFBUSxHQUNFOzs7MEJBRFYsUUFBUTs7Ozs7O0FBTVYsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1sQixRQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTW5CLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7OztBQUt4QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVMsQ0FBQzs7O0FBRzVCLFFBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNDLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRTthQUFNLE1BQUssU0FBUyxFQUFFO0tBQUEsQ0FBQyxDQUFDO0FBQ3BFLFVBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztHQUMxRDs7Ozs7Ozs7ZUE5QkcsUUFBUTs7V0FxQ0ssMkJBQUMsUUFBUSxFQUFFO0FBQzFCLFVBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU5QixjQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztLQUNyRDs7Ozs7Ozs7V0FNbUIsOEJBQUMsUUFBUSxFQUFFO0FBQzdCLFVBQUksQ0FBQyxVQUFVLFVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNsQzs7O1dBRVEscUJBQUc7OztBQUNWLFVBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUMvQixVQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7QUFDakMsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxHQUFHLFVBQVUsQ0FBQzs7QUFFdkUsVUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDcEMsZ0JBQVEsQ0FBQyxPQUFLLEtBQUssRUFBRSxPQUFLLE1BQU0sRUFBRSxPQUFLLFdBQVcsQ0FBQyxDQUFDO09BQ3JELENBQUMsQ0FBQztLQUNKOzs7U0EzREcsUUFBUTs7O0FBNERiLENBQUM7Ozs7OztBQU1GLElBQU0sUUFBUSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7O3FCQUVqQixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvdmlld3BvcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKipcbiAqIFNlcnZpY2UgdG8gdHJhY2sgdGhlIHZpZXdwb3J0IHNpemUgYW5kIG9yaWVudGF0aW9uLlxuICovXG5jbGFzcyBWaWV3cG9ydCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJykuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNhbGxiYWNrIHRvIHRyaWdnZXIgd2hlbiBgcmVzaXplYCBpcyB0cmlnZ2VyZWQgYnkgdGhlIHdpbmRvdy5cbiAgICAgKi9cbiAgICB0aGlzLl9jYWxsYmFja3MgPSBuZXcgU2V0KCk7XG5cbiAgICAvLyBpbml0aWFsaXplIHNlcnZpY2VcbiAgICB0aGlzLl9vblJlc2l6ZSA9IHRoaXMuX29uUmVzaXplLmJpbmQodGhpcyk7XG4gICAgLy8gbGlzdGVuIHdpbmRvdyBldmVudHMgKGlzIGBET01Db250ZW50TG9hZGVkYCB1c2VmdWxsPylcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHRoaXMuX29uUmVzaXplKCkpO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLl9vblJlc2l6ZSwgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbGlzdGVuZXIgZm9yIHRoZSBgd2luZG93LnJlc2l6ZWAgZXZlbnQuIFRoZSBjYWxsYmFjayBpcyBleGVjdXRlZFxuICAgKiB3aXRoIGN1cnJlbnQgdmFsdWVzIHdoZW4gcmVnaXN0ZXJlZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZS5cbiAgICovXG4gIGFkZFJlc2l6ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmFkZChjYWxsYmFjayk7XG4gICAgLy8gY2FsbCBpbW1lZGlhdGx5IHdpdGggY3VycmVudCB2YWx1ZXNcbiAgICBjYWxsYmFjayh0aGlzLndpZHRoLCB0aGlzLmhlaWdodCwgdGhpcy5vcmllbnRhdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZm9yIHRoZSBgd2luZG93LnJlc2l6ZWAgZXZlbnQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVJlc2l6ZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cblxuICBfb25SZXNpemUoKSB7XG4gICAgdGhpcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSB0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQgPyAnbGFuZHNjYXBlJyA6ICdwb3J0cmFpdCc7XG5cbiAgICB0aGlzLl9jYWxsYmFja3MuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcbiAgICAgIGNhbGxiYWNrKHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0LCB0aGlzLm9yaWVudGF0aW9uKTtcbiAgICB9KTtcbiAgfVxufTtcblxuLyoqXG4gKiBTaW5nbGV0b24gZm9yIHRoZSB3aG9sZSBhcHBsaWNhdGlvbiB0byBiZSB1c2VkIGFzIGEgc2VydmljZS5cbiAqIEB0eXBlIHtWaWV3cG9ydH1cbiAqL1xuY29uc3Qgdmlld3BvcnQgPSBuZXcgVmlld3BvcnQoKTtcblxuZXhwb3J0IGRlZmF1bHQgdmlld3BvcnQ7XG4iXX0=
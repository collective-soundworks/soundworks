"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class to extend in order to be used in conjonction with a
 * [`CanvasView`]{@link module:soundworks/client.CanvasView}. These classes
 * provide altogether a clean way to manage the `update` and `render` cycles
 * of an animation.
 *
 * @param {Number} [updatePeriod=0] - Logical time (in _second_) between
 *  each subsequent updates. If `0`, the update period is slaved on the
 *  `requestAnimationFrame` period (which is appriopriate for most of the
 *  use-cases).
 *
 * @memberof module:soundworks/client
 * @see {@link module:soundworks/client.CanvasView}
 */
var Canvas2dRenderer = function () {
  function Canvas2dRenderer() {
    var updatePeriod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    (0, _classCallCheck3.default)(this, Canvas2dRenderer);

    this.updatePeriod = updatePeriod;

    /**
     * Current (logical) time of the Canvas2dRenderer.
     *
     * @type {Number}
     * @name currentTime
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderer
     * @readonly
     */
    this.currentTime = null;

    /**
     * Current width of the canvas.
     *
     * @type {Number}
     * @name canvasWidth
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderer
     * @readonly
     */
    this.canvasWidth = 0;

    /**
     * Current height of the canvas.
     *
     * @type {Number}
     * @name canvasHeight
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderer
     * @readonly
     */
    this.canvasHeight = 0;

    /**
     * Orientation of the canvas.
     *
     * @type {String}
     * @name orientation
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderer
     * @readonly
     */
    this.orientation = null;
  }

  /** @private */


  (0, _createClass3.default)(Canvas2dRenderer, [{
    key: "onResize",
    value: function onResize(canvasWidth, canvasHeight, orientation) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
      this.orientation = orientation;
    }

    /**
     * Interface method called when the instance is added to a `CanvasView`.
     * `this.canvasWidth` and `this.canvasHeight` should be available at this
     * point.
     */

  }, {
    key: "init",
    value: function init() {}

    /**
     * Interface method that should host the code that updates the properties
     * of the Canvas2dRenderer (physics, etc.)
     *
     * @param {Number} dt - Logical time since the last update. If
     *  `this.updatePeriod` is equal to zero 0, `dt` is the elasped time since
     *  the last render.
     */

  }, {
    key: "update",
    value: function update(dt) {}

    /**
     * Interface method that should host the code that draw into the canvas.
     *
     * @param {CanvasRenderingContext2D} ctx - 2d context of the canvas.
     */

  }, {
    key: "render",
    value: function render(ctx) {}
  }]);
  return Canvas2dRenderer;
}();

exports.default = Canvas2dRenderer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhczJkUmVuZGVyZXIuanMiXSwibmFtZXMiOlsiQ2FudmFzMmRSZW5kZXJlciIsInVwZGF0ZVBlcmlvZCIsImN1cnJlbnRUaW1lIiwiY2FudmFzV2lkdGgiLCJjYW52YXNIZWlnaHQiLCJvcmllbnRhdGlvbiIsImR0IiwiY3R4Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7O0lBY01BLGdCO0FBQ0osOEJBQThCO0FBQUEsUUFBbEJDLFlBQWtCLHVFQUFILENBQUc7QUFBQTs7QUFDNUIsU0FBS0EsWUFBTCxHQUFvQkEsWUFBcEI7O0FBRUE7Ozs7Ozs7OztBQVNBLFNBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE7Ozs7Ozs7OztBQVNBLFNBQUtDLFdBQUwsR0FBbUIsQ0FBbkI7O0FBRUE7Ozs7Ozs7OztBQVNBLFNBQUtDLFlBQUwsR0FBb0IsQ0FBcEI7O0FBRUE7Ozs7Ozs7OztBQVNBLFNBQUtDLFdBQUwsR0FBbUIsSUFBbkI7QUFDRDs7QUFFRDs7Ozs7NkJBQ1NGLFcsRUFBYUMsWSxFQUFjQyxXLEVBQWE7QUFDL0MsV0FBS0YsV0FBTCxHQUFtQkEsV0FBbkI7QUFDQSxXQUFLQyxZQUFMLEdBQW9CQSxZQUFwQjtBQUNBLFdBQUtDLFdBQUwsR0FBbUJBLFdBQW5CO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzJCQUtPLENBQUU7O0FBRVQ7Ozs7Ozs7Ozs7OzJCQVFPQyxFLEVBQUksQ0FBRTs7QUFFYjs7Ozs7Ozs7MkJBS09DLEcsRUFBSyxDQUFFOzs7OztrQkFHRFAsZ0IiLCJmaWxlIjoiQ2FudmFzMmRSZW5kZXJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQmFzZSBjbGFzcyB0byBleHRlbmQgaW4gb3JkZXIgdG8gYmUgdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoIGFcbiAqIFtgQ2FudmFzVmlld2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNWaWV3fS4gVGhlc2UgY2xhc3Nlc1xuICogcHJvdmlkZSBhbHRvZ2V0aGVyIGEgY2xlYW4gd2F5IHRvIG1hbmFnZSB0aGUgYHVwZGF0ZWAgYW5kIGByZW5kZXJgIGN5Y2xlc1xuICogb2YgYW4gYW5pbWF0aW9uLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBbdXBkYXRlUGVyaW9kPTBdIC0gTG9naWNhbCB0aW1lIChpbiBfc2Vjb25kXykgYmV0d2VlblxuICogIGVhY2ggc3Vic2VxdWVudCB1cGRhdGVzLiBJZiBgMGAsIHRoZSB1cGRhdGUgcGVyaW9kIGlzIHNsYXZlZCBvbiB0aGVcbiAqICBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBwZXJpb2QgKHdoaWNoIGlzIGFwcHJpb3ByaWF0ZSBmb3IgbW9zdCBvZiB0aGVcbiAqICB1c2UtY2FzZXMpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNWaWV3fVxuICovXG5jbGFzcyBDYW52YXMyZFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IodXBkYXRlUGVyaW9kID0gMCkge1xuICAgIHRoaXMudXBkYXRlUGVyaW9kID0gdXBkYXRlUGVyaW9kO1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudCAobG9naWNhbCkgdGltZSBvZiB0aGUgQ2FudmFzMmRSZW5kZXJlci5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgY3VycmVudFRpbWVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhczJkUmVuZGVyZXJcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgd2lkdGggb2YgdGhlIGNhbnZhcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgY2FudmFzV2lkdGhcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhczJkUmVuZGVyZXJcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gMDtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgaGVpZ2h0IG9mIHRoZSBjYW52YXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIGNhbnZhc0hlaWdodFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzMmRSZW5kZXJlclxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gMDtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSBjYW52YXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBuYW1lIG9yaWVudGF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXMyZFJlbmRlcmVyXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25SZXNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gY2FudmFzV2lkdGg7XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSBjYW52YXNIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIGluc3RhbmNlIGlzIGFkZGVkIHRvIGEgYENhbnZhc1ZpZXdgLlxuICAgKiBgdGhpcy5jYW52YXNXaWR0aGAgYW5kIGB0aGlzLmNhbnZhc0hlaWdodGAgc2hvdWxkIGJlIGF2YWlsYWJsZSBhdCB0aGlzXG4gICAqIHBvaW50LlxuICAgKi9cbiAgaW5pdCgpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdGhhdCBzaG91bGQgaG9zdCB0aGUgY29kZSB0aGF0IHVwZGF0ZXMgdGhlIHByb3BlcnRpZXNcbiAgICogb2YgdGhlIENhbnZhczJkUmVuZGVyZXIgKHBoeXNpY3MsIGV0Yy4pXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIExvZ2ljYWwgdGltZSBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuIElmXG4gICAqICBgdGhpcy51cGRhdGVQZXJpb2RgIGlzIGVxdWFsIHRvIHplcm8gMCwgYGR0YCBpcyB0aGUgZWxhc3BlZCB0aW1lIHNpbmNlXG4gICAqICB0aGUgbGFzdCByZW5kZXIuXG4gICAqL1xuICB1cGRhdGUoZHQpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdGhhdCBzaG91bGQgaG9zdCB0aGUgY29kZSB0aGF0IGRyYXcgaW50byB0aGUgY2FudmFzLlxuICAgKlxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gMmQgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKi9cbiAgcmVuZGVyKGN0eCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FudmFzMmRSZW5kZXJlcjtcbiJdfQ==
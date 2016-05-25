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
 * Base class to implement in order to be used in conjonction with a
 * [`CanvasView`]{@link module:soundworks/client.CanvasView}. These classes
 * provide altogether a clean way to manage the `update` and `render` cycles
 * of an animation.
 *
 * @memberof module:soundworks/client
 * @see module:soundworks/client.CanvasView
 */

var Renderer = function () {
  /**
   * @param {Number} [updatePeriod=0] - Logical time (in _second_) between
   *  each subsequent update calls. If `0`, the update period is then slaved on
   *  the `requestAnimationFrame` period (which is appriopriate for most of the
   *  use-cases).
   */

  function Renderer() {
    var updatePeriod = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    (0, _classCallCheck3.default)(this, Renderer);

    this.updatePeriod = updatePeriod;

    /**
     * Current (logical) time of the renderer.
     * @type {Number}
     * @name currentTime
     * @instance
     * @memberof module:soundworks/client.Renderer
     * @readonly
     */
    this.currentTime = null;

    /**
     * Current width of the canvas.
     * @type {Number}
     * @name canvasWidth
     * @instance
     * @memberof module:soundworks/client.Renderer
     * @readonly
     */
    this.canvasWidth = 0;

    /**
     * Current height of the canvas.
     * @type {Number}
     * @name canvasHeight
     * @instance
     * @memberof module:soundworks/client.Renderer
     * @readonly
     */
    this.canvasHeight = 0;
  }

  /** @private */


  (0, _createClass3.default)(Renderer, [{
    key: "onResize",
    value: function onResize(canvasWidth, canvasHeight) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
    }

    /**
     * Interface method called when the instance is added to a `CanvasView`.
     * The width and height of the canvas should be available when the method
     * is called.
     */

  }, {
    key: "init",
    value: function init() {}

    /**
     * Interface Method to update the properties (physics, etc.) of the renderer.
     * @param {Number} dt - Logical time since the last update. If `this.updatePeriod`
     *  is equal to zero 0, `dt` is the elasped time since the last render.
     */

  }, {
    key: "update",
    value: function update(dt) {}

    /**
     * Interface method to draw into the canvas.
     * @param {CanvasRenderingContext2D} ctx - 2d context of the canvas.
     */

  }, {
    key: "render",
    value: function render(ctx) {}
  }]);
  return Renderer;
}();

exports.default = Renderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBU00sUTs7Ozs7Ozs7QUFPSixzQkFBOEI7QUFBQSxRQUFsQixZQUFrQix5REFBSCxDQUFHO0FBQUE7O0FBQzVCLFNBQUssWUFBTCxHQUFvQixZQUFwQjs7Ozs7Ozs7OztBQVVBLFNBQUssV0FBTCxHQUFtQixJQUFuQjs7Ozs7Ozs7OztBQVVBLFNBQUssV0FBTCxHQUFtQixDQUFuQjs7Ozs7Ozs7OztBQVVBLFNBQUssWUFBTCxHQUFvQixDQUFwQjtBQUNEOzs7Ozs7OzZCQUdRLFcsRUFBYSxZLEVBQWM7QUFDbEMsV0FBSyxXQUFMLEdBQW1CLFdBQW5CO0FBQ0EsV0FBSyxZQUFMLEdBQW9CLFlBQXBCO0FBQ0Q7Ozs7Ozs7Ozs7MkJBT00sQ0FBRTs7Ozs7Ozs7OzsyQkFPRixFLEVBQUksQ0FBRTs7Ozs7Ozs7OzJCQU1OLEcsRUFBSyxDQUFFOzs7OztrQkFHRCxRIiwiZmlsZSI6IlJlbmRlcmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGltcGxlbWVudCBpbiBvcmRlciB0byBiZSB1c2VkIGluIGNvbmpvbmN0aW9uIHdpdGggYVxuICogW2BDYW52YXNWaWV3YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd9LiBUaGVzZSBjbGFzc2VzXG4gKiBwcm92aWRlIGFsdG9nZXRoZXIgYSBjbGVhbiB3YXkgdG8gbWFuYWdlIHRoZSBgdXBkYXRlYCBhbmQgYHJlbmRlcmAgY3ljbGVzXG4gKiBvZiBhbiBhbmltYXRpb24uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQHNlZSBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld1xuICovXG5jbGFzcyBSZW5kZXJlciB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3VwZGF0ZVBlcmlvZD0wXSAtIExvZ2ljYWwgdGltZSAoaW4gX3NlY29uZF8pIGJldHdlZW5cbiAgICogIGVhY2ggc3Vic2VxdWVudCB1cGRhdGUgY2FsbHMuIElmIGAwYCwgdGhlIHVwZGF0ZSBwZXJpb2QgaXMgdGhlbiBzbGF2ZWQgb25cbiAgICogIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBwZXJpb2QgKHdoaWNoIGlzIGFwcHJpb3ByaWF0ZSBmb3IgbW9zdCBvZiB0aGVcbiAgICogIHVzZS1jYXNlcykuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1cGRhdGVQZXJpb2QgPSAwKSB7XG4gICAgdGhpcy51cGRhdGVQZXJpb2QgPSB1cGRhdGVQZXJpb2Q7XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IChsb2dpY2FsKSB0aW1lIG9mIHRoZSByZW5kZXJlci5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIGN1cnJlbnRUaW1lXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlclxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudCB3aWR0aCBvZiB0aGUgY2FudmFzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgY2FudmFzV2lkdGhcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyXG4gICAgICogQHJlYWRvbmx5XG4gICAgICovXG4gICAgdGhpcy5jYW52YXNXaWR0aCA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBDdXJyZW50IGhlaWdodCBvZiB0aGUgY2FudmFzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgY2FudmFzSGVpZ2h0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlclxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gMDtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblJlc2l6ZShjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0KSB7XG4gICAgdGhpcy5jYW52YXNXaWR0aCA9IGNhbnZhc1dpZHRoO1xuICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gY2FudmFzSGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgY2FsbGVkIHdoZW4gdGhlIGluc3RhbmNlIGlzIGFkZGVkIHRvIGEgYENhbnZhc1ZpZXdgLlxuICAgKiBUaGUgd2lkdGggYW5kIGhlaWdodCBvZiB0aGUgY2FudmFzIHNob3VsZCBiZSBhdmFpbGFibGUgd2hlbiB0aGUgbWV0aG9kXG4gICAqIGlzIGNhbGxlZC5cbiAgICovXG4gIGluaXQoKSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgTWV0aG9kIHRvIHVwZGF0ZSB0aGUgcHJvcGVydGllcyAocGh5c2ljcywgZXRjLikgb2YgdGhlIHJlbmRlcmVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBMb2dpY2FsIHRpbWUgc2luY2UgdGhlIGxhc3QgdXBkYXRlLiBJZiBgdGhpcy51cGRhdGVQZXJpb2RgXG4gICAqICBpcyBlcXVhbCB0byB6ZXJvIDAsIGBkdGAgaXMgdGhlIGVsYXNwZWQgdGltZSBzaW5jZSB0aGUgbGFzdCByZW5kZXIuXG4gICAqL1xuICB1cGRhdGUoZHQpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gZHJhdyBpbnRvIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSAyZCBjb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAqL1xuICByZW5kZXIoY3R4KSB7fVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJlcjtcbiJdfQ==
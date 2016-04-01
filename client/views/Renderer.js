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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBU007Ozs7Ozs7O0FBT0osV0FQSSxRQU9KLEdBQThCO1FBQWxCLHFFQUFlLGlCQUFHO3dDQVAxQixVQU8wQjs7QUFDNUIsU0FBSyxZQUFMLEdBQW9CLFlBQXBCOzs7Ozs7Ozs7O0FBRDRCLFFBVzVCLENBQUssV0FBTCxHQUFtQixJQUFuQjs7Ozs7Ozs7OztBQVg0QixRQXFCNUIsQ0FBSyxXQUFMLEdBQW1CLENBQW5COzs7Ozs7Ozs7O0FBckI0QixRQStCNUIsQ0FBSyxZQUFMLEdBQW9CLENBQXBCLENBL0I0QjtHQUE5Qjs7Ozs7NkJBUEk7OzZCQTBDSyxhQUFhLGNBQWM7QUFDbEMsV0FBSyxXQUFMLEdBQW1CLFdBQW5CLENBRGtDO0FBRWxDLFdBQUssWUFBTCxHQUFvQixZQUFwQixDQUZrQzs7Ozs7Ozs7Ozs7MkJBVTdCOzs7Ozs7Ozs7OzJCQU9BLElBQUk7Ozs7Ozs7OzsyQkFNSixLQUFLOztTQWpFUjs7O2tCQW9FUyIsImZpbGUiOiJSZW5kZXJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQmFzZSBjbGFzcyB0byBpbXBsZW1lbnQgaW4gb3JkZXIgdG8gYmUgdXNlZCBpbiBjb25qb25jdGlvbiB3aXRoIGFcbiAqIFtgQ2FudmFzVmlld2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNWaWV3fS4gVGhlc2UgY2xhc3Nlc1xuICogcHJvdmlkZSBhbHRvZ2V0aGVyIGEgY2xlYW4gd2F5IHRvIG1hbmFnZSB0aGUgYHVwZGF0ZWAgYW5kIGByZW5kZXJgIGN5Y2xlc1xuICogb2YgYW4gYW5pbWF0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBzZWUgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXdcbiAqL1xuY2xhc3MgUmVuZGVyZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt1cGRhdGVQZXJpb2Q9MF0gLSBMb2dpY2FsIHRpbWUgKGluIF9zZWNvbmRfKSBiZXR3ZWVuXG4gICAqICBlYWNoIHN1YnNlcXVlbnQgdXBkYXRlIGNhbGxzLiBJZiBgMGAsIHRoZSB1cGRhdGUgcGVyaW9kIGlzIHRoZW4gc2xhdmVkIG9uXG4gICAqICB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgcGVyaW9kICh3aGljaCBpcyBhcHByaW9wcmlhdGUgZm9yIG1vc3Qgb2YgdGhlXG4gICAqICB1c2UtY2FzZXMpLlxuICAgKi9cbiAgY29uc3RydWN0b3IodXBkYXRlUGVyaW9kID0gMCkge1xuICAgIHRoaXMudXBkYXRlUGVyaW9kID0gdXBkYXRlUGVyaW9kO1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudCAobG9naWNhbCkgdGltZSBvZiB0aGUgcmVuZGVyZXIuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbmFtZSBjdXJyZW50VGltZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUmVuZGVyZXJcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgd2lkdGggb2YgdGhlIGNhbnZhcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIGNhbnZhc1dpZHRoXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlclxuICAgICAqIEByZWFkb25seVxuICAgICAqL1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSAwO1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudCBoZWlnaHQgb2YgdGhlIGNhbnZhcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIGNhbnZhc0hlaWdodFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUmVuZGVyZXJcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKi9cbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IDA7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25SZXNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCkge1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSBjYW52YXNXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGNhbnZhc0hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBpbnN0YW5jZSBpcyBhZGRlZCB0byBhIGBDYW52YXNWaWV3YC5cbiAgICogVGhlIHdpZHRoIGFuZCBoZWlnaHQgb2YgdGhlIGNhbnZhcyBzaG91bGQgYmUgYXZhaWxhYmxlIHdoZW4gdGhlIG1ldGhvZFxuICAgKiBpcyBjYWxsZWQuXG4gICAqL1xuICBpbml0KCkge31cblxuICAvKipcbiAgICogSW50ZXJmYWNlIE1ldGhvZCB0byB1cGRhdGUgdGhlIHByb3BlcnRpZXMgKHBoeXNpY3MsIGV0Yy4pIG9mIHRoZSByZW5kZXJlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gTG9naWNhbCB0aW1lIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS4gSWYgYHRoaXMudXBkYXRlUGVyaW9kYFxuICAgKiAgaXMgZXF1YWwgdG8gemVybyAwLCBgZHRgIGlzIHRoZSBlbGFzcGVkIHRpbWUgc2luY2UgdGhlIGxhc3QgcmVuZGVyLlxuICAgKi9cbiAgdXBkYXRlKGR0KSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGRyYXcgaW50byB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gMmQgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKi9cbiAgcmVuZGVyKGN0eCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVuZGVyZXI7XG4iXX0=
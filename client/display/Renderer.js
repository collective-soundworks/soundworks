/**
 * The class to extend in order to create a new canvas renderer.
 * The child classes should implement the `init`, `update` and `render` interface methods.
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Renderer = (function () {
  /**
   * @param {Number} [updatePeriod=0] - The logical time (in second) between each subsequent update calls. If set to zero the `update` is bounded to the `render`
   */

  function Renderer() {
    var updatePeriod = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

    _classCallCheck(this, Renderer);

    this.updatePeriod = updatePeriod;
    this.currentTime = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
  }

  _createClass(Renderer, [{
    key: "onResize",
    value: function onResize(canvasWidth, canvasHeight) {
      this.canvasWidth = canvasWidth;
      this.canvasHeight = canvasHeight;
    }

    /**
     * Interface method called when the instance is added to a `RenderingGroup` instance. Canvas width and height are available here.
     */
  }, {
    key: "init",
    value: function init() {}

    /**
     * Interface Method to update the properties (physics, etc.) of the renderer.
     * @param {Number} dt - The logical time since the last update. If `this.updatePeriod` is equal to zero 0, `dt` is the elasped time since the last render.
     */
  }, {
    key: "update",
    value: function update(dt) {}

    /**
     * Interface method to draw into the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2d context of the canvas.
     */
  }, {
    key: "render",
    value: function render(ctx) {}
  }]);

  return Renderer;
})();

exports["default"] = Renderer;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvZGlzcGxheS9SZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUlxQixRQUFROzs7OztBQUloQixXQUpRLFFBQVEsR0FJRztRQUFsQixZQUFZLHlEQUFHLENBQUM7OzBCQUpULFFBQVE7O0FBS3pCLFFBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0dBQ3ZCOztlQVRrQixRQUFROztXQVduQixrQkFBQyxXQUFXLEVBQUUsWUFBWSxFQUFFO0FBQ2xDLFVBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0tBQ2xDOzs7Ozs7O1dBS0csZ0JBQUcsRUFBRTs7Ozs7Ozs7V0FNSCxnQkFBQyxFQUFFLEVBQUUsRUFBRTs7Ozs7Ozs7V0FNUCxnQkFBQyxHQUFHLEVBQUUsRUFBRTs7O1NBL0JLLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvZGlzcGxheS9SZW5kZXJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGNsYXNzIHRvIGV4dGVuZCBpbiBvcmRlciB0byBjcmVhdGUgYSBuZXcgY2FudmFzIHJlbmRlcmVyLlxuICogVGhlIGNoaWxkIGNsYXNzZXMgc2hvdWxkIGltcGxlbWVudCB0aGUgYGluaXRgLCBgdXBkYXRlYCBhbmQgYHJlbmRlcmAgaW50ZXJmYWNlIG1ldGhvZHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbdXBkYXRlUGVyaW9kPTBdIC0gVGhlIGxvZ2ljYWwgdGltZSAoaW4gc2Vjb25kKSBiZXR3ZWVuIGVhY2ggc3Vic2VxdWVudCB1cGRhdGUgY2FsbHMuIElmIHNldCB0byB6ZXJvIHRoZSBgdXBkYXRlYCBpcyBib3VuZGVkIHRvIHRoZSBgcmVuZGVyYFxuICAgKi9cbiAgY29uc3RydWN0b3IodXBkYXRlUGVyaW9kID0gMCkge1xuICAgIHRoaXMudXBkYXRlUGVyaW9kID0gdXBkYXRlUGVyaW9kO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSAwO1xuICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gMDtcbiAgfVxuXG4gIG9uUmVzaXplKGNhbnZhc1dpZHRoLCBjYW52YXNIZWlnaHQpIHtcbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gY2FudmFzV2lkdGg7XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSBjYW52YXNIZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgaW5zdGFuY2UgaXMgYWRkZWQgdG8gYSBgUmVuZGVyaW5nR3JvdXBgIGluc3RhbmNlLiBDYW52YXMgd2lkdGggYW5kIGhlaWdodCBhcmUgYXZhaWxhYmxlIGhlcmUuXG4gICAqL1xuICBpbml0KCkge31cblxuICAvKipcbiAgICogSW50ZXJmYWNlIE1ldGhvZCB0byB1cGRhdGUgdGhlIHByb3BlcnRpZXMgKHBoeXNpY3MsIGV0Yy4pIG9mIHRoZSByZW5kZXJlci5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gVGhlIGxvZ2ljYWwgdGltZSBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuIElmIGB0aGlzLnVwZGF0ZVBlcmlvZGAgaXMgZXF1YWwgdG8gemVybyAwLCBgZHRgIGlzIHRoZSBlbGFzcGVkIHRpbWUgc2luY2UgdGhlIGxhc3QgcmVuZGVyLlxuICAgKi9cbiAgdXBkYXRlKGR0KSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIHRvIGRyYXcgaW50byB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gVGhlIDJkIGNvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICovXG4gIHJlbmRlcihjdHgpIHt9XG59XG4iXX0=
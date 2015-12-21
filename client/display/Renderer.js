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
    key: "updateSize",
    value: function updateSize(canvasWidth, canvasHeight) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9SZW5kZXJlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQUlxQixRQUFROzs7OztBQUloQixXQUpRLFFBQVEsR0FJRztRQUFsQixZQUFZLHlEQUFHLENBQUM7OzBCQUpULFFBQVE7O0FBS3pCLFFBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0dBQ3ZCOztlQVRrQixRQUFROztXQVdqQixvQkFBQyxXQUFXLEVBQUUsWUFBWSxFQUFFO0FBQ3BDLFVBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQy9CLFVBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO0tBQ2xDOzs7Ozs7O1dBS0csZ0JBQUcsRUFBRTs7Ozs7Ozs7V0FNSCxnQkFBQyxFQUFFLEVBQUUsRUFBRTs7Ozs7Ozs7V0FNUCxnQkFBQyxHQUFHLEVBQUUsRUFBRTs7O1NBL0JLLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9SZW5kZXJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGNsYXNzIHRvIGV4dGVuZCBpbiBvcmRlciB0byBjcmVhdGUgYSBuZXcgY2FudmFzIHJlbmRlcmVyLlxuICogVGhlIGNoaWxkIGNsYXNzZXMgc2hvdWxkIGltcGxlbWVudCB0aGUgYGluaXRgLCBgdXBkYXRlYCBhbmQgYHJlbmRlcmAgaW50ZXJmYWNlIG1ldGhvZHMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmVyIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbdXBkYXRlUGVyaW9kPTBdIC0gVGhlIGxvZ2ljYWwgdGltZSAoaW4gc2Vjb25kKSBiZXR3ZWVuIGVhY2ggc3Vic2VxdWVudCB1cGRhdGUgY2FsbHMuIElmIHNldCB0byB6ZXJvIHRoZSBgdXBkYXRlYCBpcyBib3VuZGVkIHRvIHRoZSBgcmVuZGVyYFxuICAgKi9cbiAgY29uc3RydWN0b3IodXBkYXRlUGVyaW9kID0gMCkge1xuICAgIHRoaXMudXBkYXRlUGVyaW9kID0gdXBkYXRlUGVyaW9kO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBudWxsO1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSAwO1xuICAgIHRoaXMuY2FudmFzSGVpZ2h0ID0gMDtcbiAgfVxuXG4gIHVwZGF0ZVNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCkge1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSBjYW52YXNXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGNhbnZhc0hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBpbnN0YW5jZSBpcyBhZGRlZCB0byBhIGBSZW5kZXJpbmdHcm91cGAgaW5zdGFuY2UuIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBhdmFpbGFibGUgaGVyZS5cbiAgICovXG4gIGluaXQoKSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgTWV0aG9kIHRvIHVwZGF0ZSB0aGUgcHJvcGVydGllcyAocGh5c2ljcywgZXRjLikgb2YgdGhlIHJlbmRlcmVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgbG9naWNhbCB0aW1lIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS4gSWYgYHRoaXMudXBkYXRlUGVyaW9kYCBpcyBlcXVhbCB0byB6ZXJvIDAsIGBkdGAgaXMgdGhlIGVsYXNwZWQgdGltZSBzaW5jZSB0aGUgbGFzdCByZW5kZXIuXG4gICAqL1xuICB1cGRhdGUoZHQpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gZHJhdyBpbnRvIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBUaGUgMmQgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKi9cbiAgcmVuZGVyKGN0eCkge31cbn0iXX0=
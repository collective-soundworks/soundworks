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
 * The class to extend in order to create a new canvas renderer.
 * The child classes should implement the `init`, `update` and `render` interface methods.
 */

var Renderer = function () {
  /**
   * @param {Number} [updatePeriod=0] - The logical time (in second) between each subsequent update calls. If set to zero the `update` is bounded to the `render`
   */

  function Renderer() {
    var updatePeriod = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    (0, _classCallCheck3.default)(this, Renderer);

    this.updatePeriod = updatePeriod;
    this.currentTime = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
  }

  (0, _createClass3.default)(Renderer, [{
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
}();

exports.default = Renderer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlbmRlcmVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlxQjs7Ozs7QUFJbkIsV0FKbUIsUUFJbkIsR0FBOEI7UUFBbEIscUVBQWUsaUJBQUc7d0NBSlgsVUFJVzs7QUFDNUIsU0FBSyxZQUFMLEdBQW9CLFlBQXBCLENBRDRCO0FBRTVCLFNBQUssV0FBTCxHQUFtQixJQUFuQixDQUY0QjtBQUc1QixTQUFLLFdBQUwsR0FBbUIsQ0FBbkIsQ0FINEI7QUFJNUIsU0FBSyxZQUFMLEdBQW9CLENBQXBCLENBSjRCO0dBQTlCOzs2QkFKbUI7OzZCQVdWLGFBQWEsY0FBYztBQUNsQyxXQUFLLFdBQUwsR0FBbUIsV0FBbkIsQ0FEa0M7QUFFbEMsV0FBSyxZQUFMLEdBQW9CLFlBQXBCLENBRmtDOzs7Ozs7Ozs7MkJBUTdCOzs7Ozs7Ozs7MkJBTUEsSUFBSTs7Ozs7Ozs7OzJCQU1KLEtBQUs7O1NBL0JPIiwiZmlsZSI6IlJlbmRlcmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgY2xhc3MgdG8gZXh0ZW5kIGluIG9yZGVyIHRvIGNyZWF0ZSBhIG5ldyBjYW52YXMgcmVuZGVyZXIuXG4gKiBUaGUgY2hpbGQgY2xhc3NlcyBzaG91bGQgaW1wbGVtZW50IHRoZSBgaW5pdGAsIGB1cGRhdGVgIGFuZCBgcmVuZGVyYCBpbnRlcmZhY2UgbWV0aG9kcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt1cGRhdGVQZXJpb2Q9MF0gLSBUaGUgbG9naWNhbCB0aW1lIChpbiBzZWNvbmQpIGJldHdlZW4gZWFjaCBzdWJzZXF1ZW50IHVwZGF0ZSBjYWxscy4gSWYgc2V0IHRvIHplcm8gdGhlIGB1cGRhdGVgIGlzIGJvdW5kZWQgdG8gdGhlIGByZW5kZXJgXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1cGRhdGVQZXJpb2QgPSAwKSB7XG4gICAgdGhpcy51cGRhdGVQZXJpb2QgPSB1cGRhdGVQZXJpb2Q7XG4gICAgdGhpcy5jdXJyZW50VGltZSA9IG51bGw7XG4gICAgdGhpcy5jYW52YXNXaWR0aCA9IDA7XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSAwO1xuICB9XG5cbiAgb25SZXNpemUoY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCkge1xuICAgIHRoaXMuY2FudmFzV2lkdGggPSBjYW52YXNXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IGNhbnZhc0hlaWdodDtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgbWV0aG9kIGNhbGxlZCB3aGVuIHRoZSBpbnN0YW5jZSBpcyBhZGRlZCB0byBhIGBSZW5kZXJpbmdHcm91cGAgaW5zdGFuY2UuIENhbnZhcyB3aWR0aCBhbmQgaGVpZ2h0IGFyZSBhdmFpbGFibGUgaGVyZS5cbiAgICovXG4gIGluaXQoKSB7fVxuXG4gIC8qKlxuICAgKiBJbnRlcmZhY2UgTWV0aG9kIHRvIHVwZGF0ZSB0aGUgcHJvcGVydGllcyAocGh5c2ljcywgZXRjLikgb2YgdGhlIHJlbmRlcmVyLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgbG9naWNhbCB0aW1lIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS4gSWYgYHRoaXMudXBkYXRlUGVyaW9kYCBpcyBlcXVhbCB0byB6ZXJvIDAsIGBkdGAgaXMgdGhlIGVsYXNwZWQgdGltZSBzaW5jZSB0aGUgbGFzdCByZW5kZXIuXG4gICAqL1xuICB1cGRhdGUoZHQpIHt9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gZHJhdyBpbnRvIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBUaGUgMmQgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKi9cbiAgcmVuZGVyKGN0eCkge31cbn1cbiJdfQ==
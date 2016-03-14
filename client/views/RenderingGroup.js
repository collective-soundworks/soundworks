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
 * The main rendering loop handling the `requestAnimationFrame` and the `update` / `render` calls.
 * @private
 */
var loop = {
  renderingGroups: [],

  _isRunning: false,

  /**
   * @returns {Number} - The current time in seconds.
   */
  getTime: function getTime() {
    return 0.001 * (window.performance && window.performance.now ? window.performance.now() : new Date().getTime());
  },


  /**
   * Start the rendering loop if not started.
   */
  requireStart: function requireStart() {
    if (this._isRunning) {
      return;
    }
    this._isRunning = true;
    this.lastRenderTime = this.getTime();

    (function (self) {
      function loop() {
        var time = self.getTime();
        var dt = time - self.lastRenderTime;
        var renderingGroups = self.renderingGroups;

        for (var i = 0, l = renderingGroups.length; i < l; i++) {
          var group = renderingGroups[i];
          // let the group handle the updatePeriod of each renderer
          group.update(time, dt);
          group.render(dt); // forward `dt` for `preRender` method
        }

        self.lastRenderTime = time;
        self.rAFid = requestAnimationFrame(loop);
      }

      self.rAFid = requestAnimationFrame(loop);
    })(this);
  },


  /**
   * Stop the loop if no renderer are still present. If not abort.
   */
  requireStop: function requireStop() {
    // @todo - handle several parallel groups
    var shouldStop = true;

    for (var i = 0, l = this.renderingGroups.length; i < l; i++) {
      if (this.renderingGroups[i].renderers.length > 0) {
        shouldStop = false;
      }
    }

    if (shouldStop) {
      cancelAnimationFrame(this.rAFid);
      this._isRunning = false;
    }
  },


  /**
   * Add a rendering group to the loop.
   */
  registerRenderingGroup: function registerRenderingGroup(group) {
    this.renderingGroups.push(group);
  }
};

/**
 * This class allow to register several renderers on a single full screen canvas. Calls the `requireStart` and `requireStop` of the main rendering loop when a `Renderer` instance is added or removed.
 *
 * This class should be considered as private, and is hidden into the @link `CanvasView` for most of the usecases
 */

var RenderingGroup = function () {
  /**
   * The construcotr of a `RenderingGroup`.
   * @param {CanvasRenderingContext2D} ctx - The main canvas context in which the renderer should draw.
   */

  function RenderingGroup(ctx) {
    (0, _classCallCheck3.default)(this, RenderingGroup);

    this.ctx = ctx;
    this.renderers = [];
    // register the group into the loop
    loop.registerRenderingGroup(this);
  }

  /**
   * Updates the size of the canvas. Propagate values to all registered renderers.
   * @param {Number} viewportWidth - The width of the viewport.
   * @param {Number} viewportHeight - The height of the viewport.
   */


  (0, _createClass3.default)(RenderingGroup, [{
    key: "onResize",
    value: function onResize(viewportWidth, viewportHeight) {
      this.canvasWidth = viewportWidth;
      this.canvasHeight = viewportHeight;

      this.ctx.width = this.ctx.canvas.width = this.canvasWidth;
      this.ctx.height = this.ctx.canvas.height = this.canvasHeight;

      for (var i = 0, l = this.renderers.length; i < l; i++) {
        this.renderers[i].onResize(viewportWidth, viewportHeight);
      }
    }

    /**
     * Propagate the `update` to all registered renderers. The `update` method for each renderer is called according to their update period.
     * @param {Number} time - The current time.
     * @param {Number} dt - The delta time in seconds since the last update.
     */

  }, {
    key: "update",
    value: function update(time, dt) {
      var renderers = this.renderers;

      for (var i = 0, l = renderers.length; i < l; i++) {
        var renderer = renderers[i];
        var updatePeriod = renderer.updatePeriod;

        if (updatePeriod === 0) {
          renderer.update(dt);
          renderer.currentTime = time;
        } else {
          while (renderer.currentTime < time) {
            renderer.update(updatePeriod);
            renderer.currentTime += updatePeriod;
          }
        }
      }
    }

    /**
     * Entry point to apply global transformations to the canvas before each renderer is rendered.
     * @param {CanvasRenderingContext2D} ctx - The context of the canvas.
     * @param {Number} dt - The delta time in seconds since the last rendering loop (`requestAnimationFrame`).
     */

  }, {
    key: "preRender",
    value: function preRender(ctx, dt) {}

    /**
     * Propagate `render` method to all the registered renderers.
     * @param {Number} dt - The delta time in seconds since the last rendering loop (`requestAnimationFrame`).
     */

  }, {
    key: "render",
    value: function render(dt) {
      var ctx = this.ctx;
      var renderers = this.renderers;

      this.preRender(ctx, dt);

      for (var i = 0, l = renderers.length; i < l; i++) {
        renderers[i].render(ctx);
      }
    }

    /**
     * Add a `Renderer` instance to the group.
     * @param {Renderer} renderer - The renderer to add.
     */

  }, {
    key: "add",
    value: function add(renderer) {
      this.renderers.push(renderer);
      this.currentTime = loop.getTime();
      // update the current time of the renderer
      renderer.currentTime = this.currentTime;
      renderer.onResize(this.canvasWidth, this.canvasHeight);
      renderer.init();
      // if first renderer added, start the loop
      if (this.renderers.length === 1) loop.requireStart();
    }

    /**
     * Remove a `Renderer` instance from the group.
     * @param {Renderer} renderer - The renderer to remove.
     */

  }, {
    key: "remove",
    value: function remove(renderer) {
      var index = this.renderers.indexOf(renderer);

      if (index !== -1) {
        this.renderers.splice(index, 1);
        // if last renderer removed, stop the loop
        if (this.renderers.length === 0) loop.requireStop();
      }
    }
  }]);
  return RenderingGroup;
}();

exports.default = RenderingGroup;
//# sourceMappingURL=data:application/json;base64,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b0IsUUFBcEIsRUFEWTtBQUVaLFdBQUssV0FBTCxHQUFtQixLQUFLLE9BQUwsRUFBbkI7O0FBRlksY0FJWixDQUFTLFdBQVQsR0FBdUIsS0FBSyxXQUFMLENBSlg7QUFLWixlQUFTLFFBQVQsQ0FBa0IsS0FBSyxXQUFMLEVBQWtCLEtBQUssWUFBTCxDQUFwQyxDQUxZO0FBTVosZUFBUyxJQUFUOztBQU5ZLFVBUVIsS0FBSyxTQUFMLENBQWUsTUFBZixLQUEwQixDQUExQixFQUNGLEtBQUssWUFBTCxHQURGOzs7Ozs7Ozs7OzJCQVFLLFVBQVU7QUFDZixVQUFNLFFBQVEsS0FBSyxTQUFMLENBQWUsT0FBZixDQUF1QixRQUF2QixDQUFSLENBRFM7O0FBR2YsVUFBSSxVQUFVLENBQUMsQ0FBRCxFQUFJO0FBQ2hCLGFBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsS0FBdEIsRUFBNkIsQ0FBN0I7O0FBRGdCLFlBR1osS0FBSyxTQUFMLENBQWUsTUFBZixLQUEwQixDQUExQixFQUNGLEtBQUssV0FBTCxHQURGO09BSEY7OztTQWhHaUIiLCJmaWxlIjoiUmVuZGVyaW5nR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBtYWluIHJlbmRlcmluZyBsb29wIGhhbmRsaW5nIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBhbmQgdGhlIGB1cGRhdGVgIC8gYHJlbmRlcmAgY2FsbHMuXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBsb29wID0ge1xuICByZW5kZXJpbmdHcm91cHM6IFtdLFxuXG4gIF9pc1J1bm5pbmc6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSBjdXJyZW50IHRpbWUgaW4gc2Vjb25kcy5cbiAgICovXG4gIGdldFRpbWUoKSB7XG4gICAgcmV0dXJuIDAuMDAxICogKHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID9cbiAgICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHJlbmRlcmluZyBsb29wIGlmIG5vdCBzdGFydGVkLlxuICAgKi9cbiAgcmVxdWlyZVN0YXJ0KCkge1xuICAgIGlmICh0aGlzLl9pc1J1bm5pbmcpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5faXNSdW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmxhc3RSZW5kZXJUaW1lID0gdGhpcy5nZXRUaW1lKCk7XG5cbiAgICAoZnVuY3Rpb24oc2VsZikge1xuICAgICAgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgY29uc3QgdGltZSA9IHNlbGYuZ2V0VGltZSgpO1xuICAgICAgICBjb25zdCBkdCA9IHRpbWUgLSBzZWxmLmxhc3RSZW5kZXJUaW1lO1xuICAgICAgICBjb25zdCByZW5kZXJpbmdHcm91cHMgPSBzZWxmLnJlbmRlcmluZ0dyb3VwcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbmRlcmluZ0dyb3Vwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IHJlbmRlcmluZ0dyb3Vwc1tpXTtcbiAgICAgICAgICAvLyBsZXQgdGhlIGdyb3VwIGhhbmRsZSB0aGUgdXBkYXRlUGVyaW9kIG9mIGVhY2ggcmVuZGVyZXJcbiAgICAgICAgICBncm91cC51cGRhdGUodGltZSwgZHQpO1xuICAgICAgICAgIGdyb3VwLnJlbmRlcihkdCk7IC8vIGZvcndhcmQgYGR0YCBmb3IgYHByZVJlbmRlcmAgbWV0aG9kXG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmxhc3RSZW5kZXJUaW1lID0gdGltZTtcbiAgICAgICAgc2VsZi5yQUZpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5yQUZpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9KHRoaXMpKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RvcCB0aGUgbG9vcCBpZiBubyByZW5kZXJlciBhcmUgc3RpbGwgcHJlc2VudC4gSWYgbm90IGFib3J0LlxuICAgKi9cbiAgcmVxdWlyZVN0b3AoKSB7XG4gICAgLy8gQHRvZG8gLSBoYW5kbGUgc2V2ZXJhbCBwYXJhbGxlbCBncm91cHNcbiAgICBsZXQgc2hvdWxkU3RvcCA9IHRydWU7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucmVuZGVyaW5nR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRoaXMucmVuZGVyaW5nR3JvdXBzW2ldLnJlbmRlcmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNob3VsZFN0b3AgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkU3RvcCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZpZCk7XG4gICAgICB0aGlzLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmluZyBncm91cCB0byB0aGUgbG9vcC5cbiAgICovXG4gIHJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAoZ3JvdXApIHtcbiAgICB0aGlzLnJlbmRlcmluZ0dyb3Vwcy5wdXNoKGdyb3VwKTtcbiAgfVxufTtcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGFsbG93IHRvIHJlZ2lzdGVyIHNldmVyYWwgcmVuZGVyZXJzIG9uIGEgc2luZ2xlIGZ1bGwgc2NyZWVuIGNhbnZhcy4gQ2FsbHMgdGhlIGByZXF1aXJlU3RhcnRgIGFuZCBgcmVxdWlyZVN0b3BgIG9mIHRoZSBtYWluIHJlbmRlcmluZyBsb29wIHdoZW4gYSBgUmVuZGVyZXJgIGluc3RhbmNlIGlzIGFkZGVkIG9yIHJlbW92ZWQuXG4gKlxuICogVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBwcml2YXRlLCBhbmQgaXMgaGlkZGVuIGludG8gdGhlIEBsaW5rIGBDYW52YXNWaWV3YCBmb3IgbW9zdCBvZiB0aGUgdXNlY2FzZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyaW5nR3JvdXAge1xuICAvKipcbiAgICogVGhlIGNvbnN0cnVjb3RyIG9mIGEgYFJlbmRlcmluZ0dyb3VwYC5cbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIFRoZSBtYWluIGNhbnZhcyBjb250ZXh0IGluIHdoaWNoIHRoZSByZW5kZXJlciBzaG91bGQgZHJhdy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGN0eCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMucmVuZGVyZXJzID0gW107XG4gICAgLy8gcmVnaXN0ZXIgdGhlIGdyb3VwIGludG8gdGhlIGxvb3BcbiAgICBsb29wLnJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLiBQcm9wYWdhdGUgdmFsdWVzIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgdGhpcy5jYW52YXNXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSB2aWV3cG9ydEhlaWdodDtcblxuICAgIHRoaXMuY3R4LndpZHRoID0gdGhpcy5jdHguY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICB0aGlzLmN0eC5oZWlnaHQgPSB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucmVuZGVyZXJzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMucmVuZGVyZXJzW2ldLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGB1cGRhdGVgIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy4gVGhlIGB1cGRhdGVgIG1ldGhvZCBmb3IgZWFjaCByZW5kZXJlciBpcyBjYWxsZWQgYWNjb3JkaW5nIHRvIHRoZWlyIHVwZGF0ZSBwZXJpb2QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGhlIGN1cnJlbnQgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gVGhlIGRlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGUodGltZSwgZHQpIHtcbiAgICBjb25zdCByZW5kZXJlcnMgPSB0aGlzLnJlbmRlcmVycztcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVuZGVyZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgcmVuZGVyZXIgPSByZW5kZXJlcnNbaV07XG4gICAgICBjb25zdCB1cGRhdGVQZXJpb2QgPSByZW5kZXJlci51cGRhdGVQZXJpb2Q7XG5cbiAgICAgIGlmICh1cGRhdGVQZXJpb2QgPT09IDApIHtcbiAgICAgICAgcmVuZGVyZXIudXBkYXRlKGR0KTtcbiAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKHJlbmRlcmVyLmN1cnJlbnRUaW1lIDwgdGltZSkge1xuICAgICAgICAgIHJlbmRlcmVyLnVwZGF0ZSh1cGRhdGVQZXJpb2QpO1xuICAgICAgICAgIHJlbmRlcmVyLmN1cnJlbnRUaW1lICs9IHVwZGF0ZVBlcmlvZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCB0byBhcHBseSBnbG9iYWwgdHJhbnNmb3JtYXRpb25zIHRvIHRoZSBjYW52YXMgYmVmb3JlIGVhY2ggcmVuZGVyZXIgaXMgcmVuZGVyZWQuXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBUaGUgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgZGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZyBsb29wIChgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCkuXG4gICAqL1xuICBwcmVSZW5kZXIoY3R4LCBkdCkge31cblxuICAvKipcbiAgICogUHJvcGFnYXRlIGByZW5kZXJgIG1ldGhvZCB0byBhbGwgdGhlIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgZGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZyBsb29wIChgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCkuXG4gICAqL1xuICByZW5kZXIoZHQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCByZW5kZXJlcnMgPSB0aGlzLnJlbmRlcmVycztcblxuICAgIHRoaXMucHJlUmVuZGVyKGN0eCwgZHQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgcmVuZGVyZXJzW2ldLnJlbmRlcihjdHgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgdG8gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byBhZGQuXG4gICAqL1xuICBhZGQocmVuZGVyZXIpIHtcbiAgICB0aGlzLnJlbmRlcmVycy5wdXNoKHJlbmRlcmVyKTtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gbG9vcC5nZXRUaW1lKCk7XG4gICAgLy8gdXBkYXRlIHRoZSBjdXJyZW50IHRpbWUgb2YgdGhlIHJlbmRlcmVyXG4gICAgcmVuZGVyZXIuY3VycmVudFRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lO1xuICAgIHJlbmRlcmVyLm9uUmVzaXplKHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcbiAgICByZW5kZXJlci5pbml0KCk7XG4gICAgLy8gaWYgZmlyc3QgcmVuZGVyZXIgYWRkZWQsIHN0YXJ0IHRoZSBsb29wXG4gICAgaWYgKHRoaXMucmVuZGVyZXJzLmxlbmd0aCA9PT0gMSlcbiAgICAgIGxvb3AucmVxdWlyZVN0YXJ0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgYFJlbmRlcmVyYCBpbnN0YW5jZSBmcm9tIHRoZSBncm91cC5cbiAgICogQHBhcmFtIHtSZW5kZXJlcn0gcmVuZGVyZXIgLSBUaGUgcmVuZGVyZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlKHJlbmRlcmVyKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnJlbmRlcmVycy5pbmRleE9mKHJlbmRlcmVyKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMucmVuZGVyZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAvLyBpZiBsYXN0IHJlbmRlcmVyIHJlbW92ZWQsIHN0b3AgdGhlIGxvb3BcbiAgICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIGxvb3AucmVxdWlyZVN0b3AoKTtcbiAgICAgfVxuICB9XG59XG4iXX0=
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
 * This class allow to register several renderers on a single full screen
 * canvas. Calls the `requireStart` and `requireStop` of the main rendering
 * loop when a `Renderer` instance is added or removed.
 *
 * This class should be considered as private, and is hidden into the
 * {@link module:soundworks/client.CanvasView} for most of the usecases.
 */

var RenderingGroup = function () {
  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas context in which
   *  the renderer should draw.
   * @param {Boolean} [preservePixelRatio=false] - Define if the canvas should
   *  take account of the device pixel ratio for the drawing. When set to `true`,
   *  quality if favored over performance.
   */

  function RenderingGroup(ctx) {
    var preservePixelRatio = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
    (0, _classCallCheck3.default)(this, RenderingGroup);

    this.ctx = ctx;
    this.renderers = [];

    /**
     * Pixel ratio of the device, if `preservePixelRatio` is `false`,
     * this value is forced to 1
     * @type {Number}
     */
    this.pixelRatio = function (ctx) {
      var dPR = window.devicePixelRatio || 1;
      var bPR = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;

      return preservePixelRatio ? dPR / bPR : 1;
    }(this.ctx);

    // register the group into the loop
    loop.registerRenderingGroup(this);
  }

  /**
   * Updates the size of the canvas. Propagate values to all registered renderers.
   * @param {Number} viewportWidth - Width of the viewport.
   * @param {Number} viewportHeight - Height of the viewport.
   */


  (0, _createClass3.default)(RenderingGroup, [{
    key: "onResize",
    value: function onResize(viewportWidth, viewportHeight) {
      var ctx = this.ctx;
      var pixelRatio = this.pixelRatio;

      this.canvasWidth = viewportWidth * pixelRatio;
      this.canvasHeight = viewportHeight * pixelRatio;

      ctx.canvas.width = this.canvasWidth;
      ctx.canvas.height = this.canvasHeight;
      ctx.canvas.style.width = viewportWidth + "px";
      ctx.canvas.style.height = viewportHeight + "px";

      // ctx.scale(pixelRatio, pixelRatio);

      // propagate logical size to renderers
      for (var i = 0, l = this.renderers.length; i < l; i++) {
        this.renderers[i].onResize(this.canvasWidth, this.canvasHeight);
      }
    }

    /**
     * Propagate the `update` to all registered renderers. The `update` method
     * for each renderer is called according to their update period.
     * @param {Number} time - Current time.
     * @param {Number} dt - Delta time in seconds since the last update.
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
     * Entry point to apply global transformations to the canvas before each
     * renderer is rendered.
     * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
     * @param {Number} dt - Delta time in seconds since the last rendering
     *  loop (`requestAnimationFrame`).
     */

  }, {
    key: "preRender",
    value: function preRender(ctx, dt) {}

    /**
     * Propagate `render` method to all the registered renderers.
     * @param {Number} dt - Delta time in seconds since the last rendering
     *  loop (`requestAnimationFrame`).
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
     * @param {Renderer} renderer - Renderer to be added.
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
     * @param {Renderer} renderer - Eenderer to remove.
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
//# sourceMappingURL=data:application/json;base64,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OzJCQU9kLEUsRUFBSTtBQUNULFVBQU0sTUFBTSxLQUFLLEdBQWpCO0FBQ0EsVUFBTSxZQUFZLEtBQUssU0FBdkI7O0FBRUEsV0FBSyxTQUFMLENBQWUsR0FBZixFQUFvQixFQUFwQjs7QUFFQSxXQUFLLElBQUksSUFBSSxDQUFSLEVBQVcsSUFBSSxVQUFVLE1BQTlCLEVBQXNDLElBQUksQ0FBMUMsRUFBNkMsR0FBN0M7QUFDRSxrQkFBVSxDQUFWLEVBQWEsTUFBYixDQUFvQixHQUFwQjtBQURGO0FBRUQ7Ozs7Ozs7Ozt3QkFNRyxRLEVBQVU7QUFDWixXQUFLLFNBQUwsQ0FBZSxJQUFmLENBQW9CLFFBQXBCO0FBQ0EsV0FBSyxXQUFMLEdBQW1CLEtBQUssT0FBTCxFQUFuQjs7QUFFQSxlQUFTLFdBQVQsR0FBdUIsS0FBSyxXQUE1QjtBQUNBLGVBQVMsUUFBVCxDQUFrQixLQUFLLFdBQXZCLEVBQW9DLEtBQUssWUFBekM7QUFDQSxlQUFTLElBQVQ7O0FBRUEsVUFBSSxLQUFLLFNBQUwsQ0FBZSxNQUFmLEtBQTBCLENBQTlCLEVBQ0UsS0FBSyxZQUFMO0FBQ0g7Ozs7Ozs7OzsyQkFNTSxRLEVBQVU7QUFDZixVQUFNLFFBQVEsS0FBSyxTQUFMLENBQWUsT0FBZixDQUF1QixRQUF2QixDQUFkOztBQUVBLFVBQUksVUFBVSxDQUFDLENBQWYsRUFBa0I7QUFDaEIsYUFBSyxTQUFMLENBQWUsTUFBZixDQUFzQixLQUF0QixFQUE2QixDQUE3Qjs7QUFFQSxZQUFJLEtBQUssU0FBTCxDQUFlLE1BQWYsS0FBMEIsQ0FBOUIsRUFDRSxLQUFLLFdBQUw7QUFDRjtBQUNIOzs7OztrQkF0SWtCLGMiLCJmaWxlIjoiUmVuZGVyaW5nR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBtYWluIHJlbmRlcmluZyBsb29wIGhhbmRsaW5nIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBhbmQgdGhlIGB1cGRhdGVgIC8gYHJlbmRlcmAgY2FsbHMuXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBsb29wID0ge1xuICByZW5kZXJpbmdHcm91cHM6IFtdLFxuXG4gIF9pc1J1bm5pbmc6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSBjdXJyZW50IHRpbWUgaW4gc2Vjb25kcy5cbiAgICovXG4gIGdldFRpbWUoKSB7XG4gICAgcmV0dXJuIDAuMDAxICogKHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID9cbiAgICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHJlbmRlcmluZyBsb29wIGlmIG5vdCBzdGFydGVkLlxuICAgKi9cbiAgcmVxdWlyZVN0YXJ0KCkge1xuICAgIGlmICh0aGlzLl9pc1J1bm5pbmcpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5faXNSdW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmxhc3RSZW5kZXJUaW1lID0gdGhpcy5nZXRUaW1lKCk7XG5cbiAgICAoZnVuY3Rpb24oc2VsZikge1xuICAgICAgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgY29uc3QgdGltZSA9IHNlbGYuZ2V0VGltZSgpO1xuICAgICAgICBjb25zdCBkdCA9IHRpbWUgLSBzZWxmLmxhc3RSZW5kZXJUaW1lO1xuICAgICAgICBjb25zdCByZW5kZXJpbmdHcm91cHMgPSBzZWxmLnJlbmRlcmluZ0dyb3VwcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbmRlcmluZ0dyb3Vwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IHJlbmRlcmluZ0dyb3Vwc1tpXTtcbiAgICAgICAgICAvLyBsZXQgdGhlIGdyb3VwIGhhbmRsZSB0aGUgdXBkYXRlUGVyaW9kIG9mIGVhY2ggcmVuZGVyZXJcbiAgICAgICAgICBncm91cC51cGRhdGUodGltZSwgZHQpO1xuICAgICAgICAgIGdyb3VwLnJlbmRlcihkdCk7IC8vIGZvcndhcmQgYGR0YCBmb3IgYHByZVJlbmRlcmAgbWV0aG9kXG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmxhc3RSZW5kZXJUaW1lID0gdGltZTtcbiAgICAgICAgc2VsZi5yQUZpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5yQUZpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9KHRoaXMpKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RvcCB0aGUgbG9vcCBpZiBubyByZW5kZXJlciBhcmUgc3RpbGwgcHJlc2VudC4gSWYgbm90IGFib3J0LlxuICAgKi9cbiAgcmVxdWlyZVN0b3AoKSB7XG4gICAgLy8gQHRvZG8gLSBoYW5kbGUgc2V2ZXJhbCBwYXJhbGxlbCBncm91cHNcbiAgICBsZXQgc2hvdWxkU3RvcCA9IHRydWU7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucmVuZGVyaW5nR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRoaXMucmVuZGVyaW5nR3JvdXBzW2ldLnJlbmRlcmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNob3VsZFN0b3AgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkU3RvcCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZpZCk7XG4gICAgICB0aGlzLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmluZyBncm91cCB0byB0aGUgbG9vcC5cbiAgICovXG4gIHJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAoZ3JvdXApIHtcbiAgICB0aGlzLnJlbmRlcmluZ0dyb3Vwcy5wdXNoKGdyb3VwKTtcbiAgfVxufTtcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGFsbG93IHRvIHJlZ2lzdGVyIHNldmVyYWwgcmVuZGVyZXJzIG9uIGEgc2luZ2xlIGZ1bGwgc2NyZWVuXG4gKiBjYW52YXMuIENhbGxzIHRoZSBgcmVxdWlyZVN0YXJ0YCBhbmQgYHJlcXVpcmVTdG9wYCBvZiB0aGUgbWFpbiByZW5kZXJpbmdcbiAqIGxvb3Agd2hlbiBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgaXMgYWRkZWQgb3IgcmVtb3ZlZC5cbiAqXG4gKiBUaGlzIGNsYXNzIHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIHByaXZhdGUsIGFuZCBpcyBoaWRkZW4gaW50byB0aGVcbiAqIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld30gZm9yIG1vc3Qgb2YgdGhlIHVzZWNhc2VzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJpbmdHcm91cCB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gQ2FudmFzIGNvbnRleHQgaW4gd2hpY2hcbiAgICogIHRoZSByZW5kZXJlciBzaG91bGQgZHJhdy5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbcHJlc2VydmVQaXhlbFJhdGlvPWZhbHNlXSAtIERlZmluZSBpZiB0aGUgY2FudmFzIHNob3VsZFxuICAgKiAgdGFrZSBhY2NvdW50IG9mIHRoZSBkZXZpY2UgcGl4ZWwgcmF0aW8gZm9yIHRoZSBkcmF3aW5nLiBXaGVuIHNldCB0byBgdHJ1ZWAsXG4gICAqICBxdWFsaXR5IGlmIGZhdm9yZWQgb3ZlciBwZXJmb3JtYW5jZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGN0eCwgcHJlc2VydmVQaXhlbFJhdGlvID0gZmFsc2UpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnJlbmRlcmVycyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogUGl4ZWwgcmF0aW8gb2YgdGhlIGRldmljZSwgaWYgYHByZXNlcnZlUGl4ZWxSYXRpb2AgaXMgYGZhbHNlYCxcbiAgICAgKiB0aGlzIHZhbHVlIGlzIGZvcmNlZCB0byAxXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnBpeGVsUmF0aW8gPSAoZnVuY3Rpb24oY3R4KSB7XG4gICAgICBjb25zdCBkUFIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICAgICAgY29uc3QgYlBSID0gY3R4LndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgY3R4Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgY3R4Lm1zQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgICBjdHgub0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgY3R4LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcblxuICAgICAgcmV0dXJuIHByZXNlcnZlUGl4ZWxSYXRpbyA/IChkUFIgLyBiUFIpIDogMTtcbiAgICB9KHRoaXMuY3R4KSk7XG5cbiAgICAvLyByZWdpc3RlciB0aGUgZ3JvdXAgaW50byB0aGUgbG9vcFxuICAgIGxvb3AucmVnaXN0ZXJSZW5kZXJpbmdHcm91cCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzaXplIG9mIHRoZSBjYW52YXMuIFByb3BhZ2F0ZSB2YWx1ZXMgdG8gYWxsIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRXaWR0aCAtIFdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0SGVpZ2h0IC0gSGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgcGl4ZWxSYXRpbyA9IHRoaXMucGl4ZWxSYXRpbztcblxuICAgIHRoaXMuY2FudmFzV2lkdGggPSB2aWV3cG9ydFdpZHRoICogcGl4ZWxSYXRpbztcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IHZpZXdwb3J0SGVpZ2h0ICogcGl4ZWxSYXRpbztcblxuICAgIGN0eC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIGN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG4gICAgY3R4LmNhbnZhcy5zdHlsZS53aWR0aCA9IGAke3ZpZXdwb3J0V2lkdGh9cHhgO1xuICAgIGN0eC5jYW52YXMuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnRIZWlnaHR9cHhgO1xuXG4gICAgLy8gY3R4LnNjYWxlKHBpeGVsUmF0aW8sIHBpeGVsUmF0aW8pO1xuXG4gICAgLy8gcHJvcGFnYXRlIGxvZ2ljYWwgc2l6ZSB0byByZW5kZXJlcnNcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucmVuZGVyZXJzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMucmVuZGVyZXJzW2ldLm9uUmVzaXplKHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGB1cGRhdGVgIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy4gVGhlIGB1cGRhdGVgIG1ldGhvZFxuICAgKiBmb3IgZWFjaCByZW5kZXJlciBpcyBjYWxsZWQgYWNjb3JkaW5nIHRvIHRoZWlyIHVwZGF0ZSBwZXJpb2QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gQ3VycmVudCB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBEZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3QgdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlKHRpbWUsIGR0KSB7XG4gICAgY29uc3QgcmVuZGVyZXJzID0gdGhpcy5yZW5kZXJlcnM7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbmRlcmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGNvbnN0IHJlbmRlcmVyID0gcmVuZGVyZXJzW2ldO1xuICAgICAgY29uc3QgdXBkYXRlUGVyaW9kID0gcmVuZGVyZXIudXBkYXRlUGVyaW9kO1xuXG4gICAgICBpZiAodXBkYXRlUGVyaW9kID09PSAwKSB7XG4gICAgICAgIHJlbmRlcmVyLnVwZGF0ZShkdCk7XG4gICAgICAgIHJlbmRlcmVyLmN1cnJlbnRUaW1lID0gdGltZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdoaWxlIChyZW5kZXJlci5jdXJyZW50VGltZSA8IHRpbWUpIHtcbiAgICAgICAgICByZW5kZXJlci51cGRhdGUodXBkYXRlUGVyaW9kKTtcbiAgICAgICAgICByZW5kZXJlci5jdXJyZW50VGltZSArPSB1cGRhdGVQZXJpb2Q7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW50cnkgcG9pbnQgdG8gYXBwbHkgZ2xvYmFsIHRyYW5zZm9ybWF0aW9ucyB0byB0aGUgY2FudmFzIGJlZm9yZSBlYWNoXG4gICAqIHJlbmRlcmVyIGlzIHJlbmRlcmVkLlxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gQ29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBEZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3QgcmVuZGVyaW5nXG4gICAqICBsb29wIChgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCkuXG4gICAqL1xuICBwcmVSZW5kZXIoY3R4LCBkdCkge31cblxuICAvKipcbiAgICogUHJvcGFnYXRlIGByZW5kZXJgIG1ldGhvZCB0byBhbGwgdGhlIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBEZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3QgcmVuZGVyaW5nXG4gICAqICBsb29wIChgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCkuXG4gICAqL1xuICByZW5kZXIoZHQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCByZW5kZXJlcnMgPSB0aGlzLnJlbmRlcmVycztcblxuICAgIHRoaXMucHJlUmVuZGVyKGN0eCwgZHQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgcmVuZGVyZXJzW2ldLnJlbmRlcihjdHgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgdG8gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFJlbmRlcmVyIHRvIGJlIGFkZGVkLlxuICAgKi9cbiAgYWRkKHJlbmRlcmVyKSB7XG4gICAgdGhpcy5yZW5kZXJlcnMucHVzaChyZW5kZXJlcik7XG4gICAgdGhpcy5jdXJyZW50VGltZSA9IGxvb3AuZ2V0VGltZSgpO1xuICAgIC8vIHVwZGF0ZSB0aGUgY3VycmVudCB0aW1lIG9mIHRoZSByZW5kZXJlclxuICAgIHJlbmRlcmVyLmN1cnJlbnRUaW1lID0gdGhpcy5jdXJyZW50VGltZTtcbiAgICByZW5kZXJlci5vblJlc2l6ZSh0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gICAgcmVuZGVyZXIuaW5pdCgpO1xuICAgIC8vIGlmIGZpcnN0IHJlbmRlcmVyIGFkZGVkLCBzdGFydCB0aGUgbG9vcFxuICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDEpXG4gICAgICBsb29wLnJlcXVpcmVTdGFydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgZnJvbSB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gRWVuZGVyZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlKHJlbmRlcmVyKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnJlbmRlcmVycy5pbmRleE9mKHJlbmRlcmVyKTtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIHRoaXMucmVuZGVyZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAvLyBpZiBsYXN0IHJlbmRlcmVyIHJlbW92ZWQsIHN0b3AgdGhlIGxvb3BcbiAgICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDApXG4gICAgICAgIGxvb3AucmVxdWlyZVN0b3AoKTtcbiAgICAgfVxuICB9XG59XG4iXX0=
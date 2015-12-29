/**
 * The main rendering loop handling the `requestAnimationFrame` and the `update` / `render` calls.
 * @private
 */
"use strict";

var _createClass = require("babel-runtime/helpers/create-class")["default"];

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
    // console.log('=> Start canvas rendering loop');

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
      // console.log('=> Stop canvas rendering loop');
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

var RenderingGroup = (function () {
  /**
   * The construcotr of a `RenderingGroup`.
   * @param {CanvasRenderingContext2D} ctx - The main canvas context in which the renderer should draw.
   */

  function RenderingGroup(ctx) {
    _classCallCheck(this, RenderingGroup);

    this.ctx = ctx;
    this.renderers = [];
    // register the group into the loop
    loop.registerRenderingGroup(this);
  }

  /**
   * Updates the size of the canvas. Propagate values to all registered renderers.
   * @param {Number} viewportWidth - The width of the viewport.
   * @param {Number} viewportHeight - The height of the viewport.
   * @todo - rename to `resize` (same for renderers)
   */

  _createClass(RenderingGroup, [{
    key: "updateSize",
    value: function updateSize(viewportWidth, viewportHeight) {
      this.canvasWidth = viewportWidth;
      this.canvasHeight = viewportHeight;

      this.ctx.width = this.ctx.canvas.width = this.canvasWidth;
      this.ctx.height = this.ctx.canvas.height = this.canvasHeight;

      for (var i = 0, l = this.renderers.length; i < l; i++) {
        this.renderers[i].updateSize(viewportWidth, viewportHeight);
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
      renderer.updateSize(this.canvasWidth, this.canvasHeight);
      renderer.init();
      // if first renderer added, start the loop
      if (this.renderers.length === 1) {
        loop.requireStart();
      }
    }

    /**
     * Remove a `Renderer` instance from the group.
     * @param {Renderer} renderer - The renderer to remove.
     */
  }, {
    key: "remove",
    value: function remove(renderer) {
      var index = this.renderers.indexOf(renderer);
      if (index === -1) {
        return;
      }

      this.renderers.splice(index, 1);
      // if last renderer removed, stop the loop
      if (this.renderers.length === 0) {
        loop.requireStop();
      }
    }
  }]);

  return RenderingGroup;
})();

exports["default"] = RenderingGroup;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9SZW5kZXJpbmdHcm91cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBSUEsSUFBTSxJQUFJLEdBQUc7QUFDWCxpQkFBZSxFQUFFLEVBQUU7O0FBRW5CLFlBQVUsRUFBRSxLQUFLOzs7OztBQUtqQixTQUFPLEVBQUEsbUJBQUc7QUFDUixXQUFPLEtBQUssSUFBSSxNQUFNLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUMxRCxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUEsQUFBQyxDQUFDO0dBQ3BEOzs7OztBQUtELGNBQVksRUFBQSx3QkFBRztBQUNiLFFBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGFBQU87S0FBRTtBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7O0FBR3JDLEFBQUMsS0FBQSxVQUFTLElBQUksRUFBRTtBQUNkLGVBQVMsSUFBSSxHQUFHO0FBQ2QsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLFlBQU0sRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQ3RDLFlBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7O0FBRTdDLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdEQsY0FBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxlQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2Qixl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Q0Y7Ozs7Ozs7O1dBTUssZ0JBQUMsUUFBUSxFQUFFO0FBQ2YsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsVUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRTdCLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDL0IsWUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO09BQ3BCO0tBQ0Y7OztTQTFHa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1JlbmRlcmluZ0dyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiByZW5kZXJpbmcgbG9vcCBoYW5kbGluZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgYW5kIHRoZSBgdXBkYXRlYCAvIGByZW5kZXJgIGNhbGxzLlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgbG9vcCA9IHtcbiAgcmVuZGVyaW5nR3JvdXBzOiBbXSxcblxuICBfaXNSdW5uaW5nOiBmYWxzZSxcblxuICAvKipcbiAgICogQHJldHVybnMge051bWJlcn0gLSBUaGUgY3VycmVudCB0aW1lIGluIHNlY29uZHMuXG4gICAqL1xuICBnZXRUaW1lKCkge1xuICAgIHJldHVybiAwLjAwMSAqICh3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA/XG4gICAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSByZW5kZXJpbmcgbG9vcCBpZiBub3Qgc3RhcnRlZC5cbiAgICovXG4gIHJlcXVpcmVTdGFydCgpIHtcbiAgICBpZiAodGhpcy5faXNSdW5uaW5nKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX2lzUnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5sYXN0UmVuZGVyVGltZSA9IHRoaXMuZ2V0VGltZSgpO1xuICAgIC8vIGNvbnNvbGUubG9nKCc9PiBTdGFydCBjYW52YXMgcmVuZGVyaW5nIGxvb3AnKTtcblxuICAgIChmdW5jdGlvbihzZWxmKSB7XG4gICAgICBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICBjb25zdCB0aW1lID0gc2VsZi5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IGR0ID0gdGltZSAtIHNlbGYubGFzdFJlbmRlclRpbWU7XG4gICAgICAgIGNvbnN0IHJlbmRlcmluZ0dyb3VwcyA9IHNlbGYucmVuZGVyaW5nR3JvdXBzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVuZGVyaW5nR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGdyb3VwID0gcmVuZGVyaW5nR3JvdXBzW2ldO1xuICAgICAgICAgIC8vIGxldCB0aGUgZ3JvdXAgaGFuZGxlIHRoZSB1cGRhdGVQZXJpb2Qgb2YgZWFjaCByZW5kZXJlclxuICAgICAgICAgIGdyb3VwLnVwZGF0ZSh0aW1lLCBkdCk7XG4gICAgICAgICAgZ3JvdXAucmVuZGVyKGR0KTsgLy8gZm9yd2FyZCBgZHRgIGZvciBgcHJlUmVuZGVyYCBtZXRob2RcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYubGFzdFJlbmRlclRpbWUgPSB0aW1lO1xuICAgICAgICBzZWxmLnJBRmlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnJBRmlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH0odGhpcykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBsb29wIGlmIG5vIHJlbmRlcmVyIGFyZSBzdGlsbCBwcmVzZW50LiBJZiBub3QgYWJvcnQuXG4gICAqL1xuICByZXF1aXJlU3RvcCgpIHtcbiAgICAvLyBAdG9kbyAtIGhhbmRsZSBzZXZlcmFsIHBhcmFsbGVsIGdyb3Vwc1xuICAgIGxldCBzaG91bGRTdG9wID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJpbmdHcm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5yZW5kZXJpbmdHcm91cHNbaV0ucmVuZGVyZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2hvdWxkU3RvcCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaG91bGRTdG9wKSB7XG4gICAgICAvLyBjb25zb2xlLmxvZygnPT4gU3RvcCBjYW52YXMgcmVuZGVyaW5nIGxvb3AnKTtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuckFGaWQpO1xuICAgICAgdGhpcy5faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJpbmcgZ3JvdXAgdG8gdGhlIGxvb3AuXG4gICAqL1xuICByZWdpc3RlclJlbmRlcmluZ0dyb3VwKGdyb3VwKSB7XG4gICAgdGhpcy5yZW5kZXJpbmdHcm91cHMucHVzaChncm91cCk7XG4gIH1cbn07XG5cbi8qKlxuICogVGhpcyBjbGFzcyBhbGxvdyB0byByZWdpc3RlciBzZXZlcmFsIHJlbmRlcmVycyBvbiBhIHNpbmdsZSBmdWxsIHNjcmVlbiBjYW52YXMuIENhbGxzIHRoZSBgcmVxdWlyZVN0YXJ0YCBhbmQgYHJlcXVpcmVTdG9wYCBvZiB0aGUgbWFpbiByZW5kZXJpbmcgbG9vcCB3aGVuIGEgYFJlbmRlcmVyYCBpbnN0YW5jZSBpcyBhZGRlZCBvciByZW1vdmVkLlxuICpcbiAqIFRoaXMgY2xhc3Mgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXMgcHJpdmF0ZSwgYW5kIGlzIGhpZGRlbiBpbnRvIHRoZSBAbGluayBgQ2FudmFzVmlld2AgZm9yIG1vc3Qgb2YgdGhlIHVzZWNhc2VzXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlcmluZ0dyb3VwIHtcbiAgLyoqXG4gICAqIFRoZSBjb25zdHJ1Y290ciBvZiBhIGBSZW5kZXJpbmdHcm91cGAuXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBUaGUgbWFpbiBjYW52YXMgY29udGV4dCBpbiB3aGljaCB0aGUgcmVuZGVyZXIgc2hvdWxkIGRyYXcuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjdHgpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnJlbmRlcmVycyA9IFtdO1xuICAgIC8vIHJlZ2lzdGVyIHRoZSBncm91cCBpbnRvIHRoZSBsb29wXG4gICAgbG9vcC5yZWdpc3RlclJlbmRlcmluZ0dyb3VwKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHNpemUgb2YgdGhlIGNhbnZhcy4gUHJvcGFnYXRlIHZhbHVlcyB0byBhbGwgcmVnaXN0ZXJlZCByZW5kZXJlcnMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydFdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0SGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEB0b2RvIC0gcmVuYW1lIHRvIGByZXNpemVgIChzYW1lIGZvciByZW5kZXJlcnMpXG4gICAqL1xuICB1cGRhdGVTaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgdGhpcy5jYW52YXNXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSB2aWV3cG9ydEhlaWdodDtcblxuICAgIHRoaXMuY3R4LndpZHRoID0gdGhpcy5jdHguY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICB0aGlzLmN0eC5oZWlnaHQgPSB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5jYW52YXNIZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucmVuZGVyZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgdGhpcy5yZW5kZXJlcnNbaV0udXBkYXRlU2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHVwZGF0ZWAgdG8gYWxsIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLiBUaGUgYHVwZGF0ZWAgbWV0aG9kIGZvciBlYWNoIHJlbmRlcmVyIGlzIGNhbGxlZCBhY2NvcmRpbmcgdG8gdGhlaXIgdXBkYXRlIHBlcmlvZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgY3VycmVudCB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgZGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZSh0aW1lLCBkdCkge1xuICAgIGNvbnN0IHJlbmRlcmVycyA9IHRoaXMucmVuZGVyZXJzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHJlbmRlcmVyc1tpXTtcbiAgICAgIGNvbnN0IHVwZGF0ZVBlcmlvZCA9IHJlbmRlcmVyLnVwZGF0ZVBlcmlvZDtcblxuICAgICAgaWYgKHVwZGF0ZVBlcmlvZCA9PT0gMCkge1xuICAgICAgICByZW5kZXJlci51cGRhdGUoZHQpO1xuICAgICAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAocmVuZGVyZXIuY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgICAgcmVuZGVyZXIudXBkYXRlKHVwZGF0ZVBlcmlvZCk7XG4gICAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgKz0gdXBkYXRlUGVyaW9kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IHRvIGFwcGx5IGdsb2JhbCB0cmFuc2Zvcm1hdGlvbnMgdG8gdGhlIGNhbnZhcyBiZWZvcmUgZWFjaCByZW5kZXJlciBpcyByZW5kZXJlZC5cbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIFRoZSBjb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIFRoZSBkZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3QgcmVuZGVyaW5nIGxvb3AgKGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgKS5cbiAgICovXG4gIHByZVJlbmRlcihjdHgsIGR0KSB7fVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYHJlbmRlcmAgbWV0aG9kIHRvIGFsbCB0aGUgcmVnaXN0ZXJlZCByZW5kZXJlcnMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIFRoZSBkZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3QgcmVuZGVyaW5nIGxvb3AgKGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgKS5cbiAgICovXG4gIHJlbmRlcihkdCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHJlbmRlcmVycyA9IHRoaXMucmVuZGVyZXJzO1xuXG4gICAgdGhpcy5wcmVSZW5kZXIoY3R4LCBkdCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbmRlcmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHJlbmRlcmVyc1tpXS5yZW5kZXIoY3R4KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgYFJlbmRlcmVyYCBpbnN0YW5jZSB0byB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZChyZW5kZXJlcikge1xuICAgIHRoaXMucmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBsb29wLmdldFRpbWUoKTtcbiAgICAvLyB1cGRhdGUgdGhlIGN1cnJlbnQgdGltZSBvZiB0aGUgcmVuZGVyZXJcbiAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgcmVuZGVyZXIudXBkYXRlU2l6ZSh0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gICAgcmVuZGVyZXIuaW5pdCgpO1xuICAgIC8vIGlmIGZpcnN0IHJlbmRlcmVyIGFkZGVkLCBzdGFydCB0aGUgbG9vcFxuICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxvb3AucmVxdWlyZVN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgZnJvbSB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZShyZW5kZXJlcikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZW5kZXJlcnMuaW5kZXhPZihyZW5kZXJlcik7XG4gICAgaWYgKGluZGV4ID09PSAtMSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMucmVuZGVyZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgLy8gaWYgbGFzdCByZW5kZXJlciByZW1vdmVkLCBzdG9wIHRoZSBsb29wXG4gICAgaWYgKHRoaXMucmVuZGVyZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbG9vcC5yZXF1aXJlU3RvcCgpO1xuICAgIH1cbiAgfVxufSJdfQ==
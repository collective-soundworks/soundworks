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
   */

  _createClass(RenderingGroup, [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvUmVuZGVyaW5nR3JvdXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUlBLElBQU0sSUFBSSxHQUFHO0FBQ1gsaUJBQWUsRUFBRSxFQUFFOztBQUVuQixZQUFVLEVBQUUsS0FBSzs7Ozs7QUFLakIsU0FBTyxFQUFBLG1CQUFHO0FBQ1IsV0FBTyxLQUFLLElBQUksTUFBTSxDQUFDLFdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsR0FDMUQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFBLEFBQUMsQ0FBQztHQUNwRDs7Ozs7QUFLRCxjQUFZLEVBQUEsd0JBQUc7QUFDYixRQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7QUFBRSxhQUFPO0tBQUU7QUFDaEMsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7OztBQUdyQyxBQUFDLEtBQUEsVUFBUyxJQUFJLEVBQUU7QUFDZCxlQUFTLElBQUksR0FBRztBQUNkLFlBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM1QixZQUFNLEVBQUUsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQztBQUN0QyxZQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDOztBQUU3QyxhQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZUFBZSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3RELGNBQU0sS0FBSyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMs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QUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDL0IsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO09BQ3JCO0tBQ0Y7Ozs7Ozs7O1dBTUssZ0JBQUMsUUFBUSxFQUFFO0FBQ2YsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsVUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRTdCLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDL0IsWUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO09BQ3BCO0tBQ0Y7OztTQXpHa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvZGlzcGxheS9SZW5kZXJpbmdHcm91cC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIG1haW4gcmVuZGVyaW5nIGxvb3AgaGFuZGxpbmcgdGhlIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGFuZCB0aGUgYHVwZGF0ZWAgLyBgcmVuZGVyYCBjYWxscy5cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IGxvb3AgPSB7XG4gIHJlbmRlcmluZ0dyb3VwczogW10sXG5cbiAgX2lzUnVubmluZzogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gVGhlIGN1cnJlbnQgdGltZSBpbiBzZWNvbmRzLlxuICAgKi9cbiAgZ2V0VGltZSgpIHtcbiAgICByZXR1cm4gMC4wMDEgKiAod2luZG93LnBlcmZvcm1hbmNlICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgP1xuICAgICAgd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIDogbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgcmVuZGVyaW5nIGxvb3AgaWYgbm90IHN0YXJ0ZWQuXG4gICAqL1xuICByZXF1aXJlU3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuX2lzUnVubmluZykgeyByZXR1cm47IH1cbiAgICB0aGlzLl9pc1J1bm5pbmcgPSB0cnVlO1xuICAgIHRoaXMubGFzdFJlbmRlclRpbWUgPSB0aGlzLmdldFRpbWUoKTtcbiAgICAvLyBjb25zb2xlLmxvZygnPT4gU3RhcnQgY2FudmFzIHJlbmRlcmluZyBsb29wJyk7XG5cbiAgICAoZnVuY3Rpb24oc2VsZikge1xuICAgICAgZnVuY3Rpb24gbG9vcCgpIHtcbiAgICAgICAgY29uc3QgdGltZSA9IHNlbGYuZ2V0VGltZSgpO1xuICAgICAgICBjb25zdCBkdCA9IHRpbWUgLSBzZWxmLmxhc3RSZW5kZXJUaW1lO1xuICAgICAgICBjb25zdCByZW5kZXJpbmdHcm91cHMgPSBzZWxmLnJlbmRlcmluZ0dyb3VwcztcblxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbmRlcmluZ0dyb3Vwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBncm91cCA9IHJlbmRlcmluZ0dyb3Vwc1tpXTtcbiAgICAgICAgICAvLyBsZXQgdGhlIGdyb3VwIGhhbmRsZSB0aGUgdXBkYXRlUGVyaW9kIG9mIGVhY2ggcmVuZGVyZXJcbiAgICAgICAgICBncm91cC51cGRhdGUodGltZSwgZHQpO1xuICAgICAgICAgIGdyb3VwLnJlbmRlcihkdCk7IC8vIGZvcndhcmQgYGR0YCBmb3IgYHByZVJlbmRlcmAgbWV0aG9kXG4gICAgICAgIH1cblxuICAgICAgICBzZWxmLmxhc3RSZW5kZXJUaW1lID0gdGltZTtcbiAgICAgICAgc2VsZi5yQUZpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgIH1cblxuICAgICAgc2VsZi5yQUZpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9KHRoaXMpKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RvcCB0aGUgbG9vcCBpZiBubyByZW5kZXJlciBhcmUgc3RpbGwgcHJlc2VudC4gSWYgbm90IGFib3J0LlxuICAgKi9cbiAgcmVxdWlyZVN0b3AoKSB7XG4gICAgLy8gQHRvZG8gLSBoYW5kbGUgc2V2ZXJhbCBwYXJhbGxlbCBncm91cHNcbiAgICBsZXQgc2hvdWxkU3RvcCA9IHRydWU7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMucmVuZGVyaW5nR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKHRoaXMucmVuZGVyaW5nR3JvdXBzW2ldLnJlbmRlcmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHNob3VsZFN0b3AgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkU3RvcCkge1xuICAgICAgLy8gY29uc29sZS5sb2coJz0+IFN0b3AgY2FudmFzIHJlbmRlcmluZyBsb29wJyk7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJBRmlkKTtcbiAgICAgIHRoaXMuX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQWRkIGEgcmVuZGVyaW5nIGdyb3VwIHRvIHRoZSBsb29wLlxuICAgKi9cbiAgcmVnaXN0ZXJSZW5kZXJpbmdHcm91cChncm91cCkge1xuICAgIHRoaXMucmVuZGVyaW5nR3JvdXBzLnB1c2goZ3JvdXApO1xuICB9XG59O1xuXG4vKipcbiAqIFRoaXMgY2xhc3MgYWxsb3cgdG8gcmVnaXN0ZXIgc2V2ZXJhbCByZW5kZXJlcnMgb24gYSBzaW5nbGUgZnVsbCBzY3JlZW4gY2FudmFzLiBDYWxscyB0aGUgYHJlcXVpcmVTdGFydGAgYW5kIGByZXF1aXJlU3RvcGAgb2YgdGhlIG1haW4gcmVuZGVyaW5nIGxvb3Agd2hlbiBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgaXMgYWRkZWQgb3IgcmVtb3ZlZC5cbiAqXG4gKiBUaGlzIGNsYXNzIHNob3VsZCBiZSBjb25zaWRlcmVkIGFzIHByaXZhdGUsIGFuZCBpcyBoaWRkZW4gaW50byB0aGUgQGxpbmsgYENhbnZhc1ZpZXdgIGZvciBtb3N0IG9mIHRoZSB1c2VjYXNlc1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJpbmdHcm91cCB7XG4gIC8qKlxuICAgKiBUaGUgY29uc3RydWNvdHIgb2YgYSBgUmVuZGVyaW5nR3JvdXBgLlxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gVGhlIG1haW4gY2FudmFzIGNvbnRleHQgaW4gd2hpY2ggdGhlIHJlbmRlcmVyIHNob3VsZCBkcmF3LlxuICAgKi9cbiAgY29uc3RydWN0b3IoY3R4KSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5yZW5kZXJlcnMgPSBbXTtcbiAgICAvLyByZWdpc3RlciB0aGUgZ3JvdXAgaW50byB0aGUgbG9vcFxuICAgIGxvb3AucmVnaXN0ZXJSZW5kZXJpbmdHcm91cCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGVzIHRoZSBzaXplIG9mIHRoZSBjYW52YXMuIFByb3BhZ2F0ZSB2YWx1ZXMgdG8gYWxsIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRXaWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydEhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuXG4gICAgdGhpcy5jdHgud2lkdGggPSB0aGlzLmN0eC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIHRoaXMuY3R4LmhlaWdodCA9IHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyc1tpXS5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHVwZGF0ZWAgdG8gYWxsIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLiBUaGUgYHVwZGF0ZWAgbWV0aG9kIGZvciBlYWNoIHJlbmRlcmVyIGlzIGNhbGxlZCBhY2NvcmRpbmcgdG8gdGhlaXIgdXBkYXRlIHBlcmlvZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBUaGUgY3VycmVudCB0aW1lLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgZGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZSh0aW1lLCBkdCkge1xuICAgIGNvbnN0IHJlbmRlcmVycyA9IHRoaXMucmVuZGVyZXJzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHJlbmRlcmVyc1tpXTtcbiAgICAgIGNvbnN0IHVwZGF0ZVBlcmlvZCA9IHJlbmRlcmVyLnVwZGF0ZVBlcmlvZDtcblxuICAgICAgaWYgKHVwZGF0ZVBlcmlvZCA9PT0gMCkge1xuICAgICAgICByZW5kZXJlci51cGRhdGUoZHQpO1xuICAgICAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAocmVuZGVyZXIuY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgICAgcmVuZGVyZXIudXBkYXRlKHVwZGF0ZVBlcmlvZCk7XG4gICAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgKz0gdXBkYXRlUGVyaW9kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IHRvIGFwcGx5IGdsb2JhbCB0cmFuc2Zvcm1hdGlvbnMgdG8gdGhlIGNhbnZhcyBiZWZvcmUgZWFjaCByZW5kZXJlciBpcyByZW5kZXJlZC5cbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIFRoZSBjb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIFRoZSBkZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3QgcmVuZGVyaW5nIGxvb3AgKGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgKS5cbiAgICovXG4gIHByZVJlbmRlcihjdHgsIGR0KSB7fVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYHJlbmRlcmAgbWV0aG9kIHRvIGFsbCB0aGUgcmVnaXN0ZXJlZCByZW5kZXJlcnMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIFRoZSBkZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3QgcmVuZGVyaW5nIGxvb3AgKGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgKS5cbiAgICovXG4gIHJlbmRlcihkdCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHJlbmRlcmVycyA9IHRoaXMucmVuZGVyZXJzO1xuXG4gICAgdGhpcy5wcmVSZW5kZXIoY3R4LCBkdCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbmRlcmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHJlbmRlcmVyc1tpXS5yZW5kZXIoY3R4KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgYFJlbmRlcmVyYCBpbnN0YW5jZSB0byB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZChyZW5kZXJlcikge1xuICAgIHRoaXMucmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBsb29wLmdldFRpbWUoKTtcbiAgICAvLyB1cGRhdGUgdGhlIGN1cnJlbnQgdGltZSBvZiB0aGUgcmVuZGVyZXJcbiAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgcmVuZGVyZXIub25SZXNpemUodGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xuICAgIHJlbmRlcmVyLmluaXQoKTtcbiAgICAvLyBpZiBmaXJzdCByZW5kZXJlciBhZGRlZCwgc3RhcnQgdGhlIGxvb3BcbiAgICBpZiAodGhpcy5yZW5kZXJlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICBsb29wLnJlcXVpcmVTdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBgUmVuZGVyZXJgIGluc3RhbmNlIGZyb20gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmUocmVuZGVyZXIpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucmVuZGVyZXJzLmluZGV4T2YocmVuZGVyZXIpO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnJlbmRlcmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIC8vIGlmIGxhc3QgcmVuZGVyZXIgcmVtb3ZlZCwgc3RvcCB0aGUgbG9vcFxuICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIGxvb3AucmVxdWlyZVN0b3AoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
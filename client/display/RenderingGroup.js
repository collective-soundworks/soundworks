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
    key: "updateSize",
    value: function updateSize(viewportWidth, viewportHeight) {
      this.canvasWidth = viewportWidth;
      this.canvasHeight = viewportHeight;

      this.ctx.width = this.ctx.canvas.width = this.canvasWidth;
      this.ctx.height = this.ctx.canvas.height = this.canvasHeight;

      for (var i = 0, l = this.renderers.length; i < l; i++) {
        this.renderers[i].updateSize(width, height);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9SZW5kZXJpbmdHcm91cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBSUEsSUFBTSxJQUFJLEdBQUc7QUFDWCxpQkFBZSxFQUFFLEVBQUU7O0FBRW5CLFlBQVUsRUFBRSxLQUFLOzs7OztBQUtqQixTQUFPLEVBQUEsbUJBQUc7QUFDUixXQUFPLEtBQUssSUFBSSxNQUFNLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUMxRCxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUEsQUFBQyxDQUFDO0dBQ3BEOzs7OztBQUtELGNBQVksRUFBQSx3QkFBRztBQUNiLFFBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGFBQU87S0FBRTtBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7O0FBR3JDLEFBQUMsS0FBQSxVQUFTLElBQUksRUFBRTtBQUNkLGVBQVMsSUFBSSxHQUFHO0FBQ2QsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLFlBQU0sRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQ3RDLFlBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7O0FBRTdDLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdEQsY0FBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxlQUFLLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2Qixl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Rjs7Ozs7Ozs7V0FNSyxnQkFBQyxRQUFRLEVBQUU7QUFDZixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQyxVQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtBQUFFLGVBQU87T0FBRTs7QUFFN0IsVUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOztBQUVoQyxVQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMvQixZQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7T0FDcEI7S0FDRjs7O1NBekdrQixjQUFjOzs7cUJBQWQsY0FBYyIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvUmVuZGVyaW5nR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoZSBtYWluIHJlbmRlcmluZyBsb29wIGhhbmRsaW5nIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBhbmQgdGhlIGB1cGRhdGVgIC8gYHJlbmRlcmAgY2FsbHMuXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBsb29wID0ge1xuICByZW5kZXJpbmdHcm91cHM6IFtdLFxuXG4gIF9pc1J1bm5pbmc6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSAtIFRoZSBjdXJyZW50IHRpbWUgaW4gc2Vjb25kcy5cbiAgICovXG4gIGdldFRpbWUoKSB7XG4gICAgcmV0dXJuIDAuMDAxICogKHdpbmRvdy5wZXJmb3JtYW5jZSAmJiB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID9cbiAgICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RhcnQgdGhlIHJlbmRlcmluZyBsb29wIGlmIG5vdCBzdGFydGVkLlxuICAgKi9cbiAgcmVxdWlyZVN0YXJ0KCkge1xuICAgIGlmICh0aGlzLl9pc1J1bm5pbmcpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5faXNSdW5uaW5nID0gdHJ1ZTtcbiAgICB0aGlzLmxhc3RSZW5kZXJUaW1lID0gdGhpcy5nZXRUaW1lKCk7XG4gICAgLy8gY29uc29sZS5sb2coJz0+IFN0YXJ0IGNhbnZhcyByZW5kZXJpbmcgbG9vcCcpO1xuXG4gICAgKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBzZWxmLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgZHQgPSB0aW1lIC0gc2VsZi5sYXN0UmVuZGVyVGltZTtcbiAgICAgICAgY29uc3QgcmVuZGVyaW5nR3JvdXBzID0gc2VsZi5yZW5kZXJpbmdHcm91cHM7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJpbmdHcm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSByZW5kZXJpbmdHcm91cHNbaV07XG4gICAgICAgICAgLy8gbGV0IHRoZSBncm91cCBoYW5kbGUgdGhlIHVwZGF0ZVBlcmlvZCBvZiBlYWNoIHJlbmRlcmVyXG4gICAgICAgICAgZ3JvdXAudXBkYXRlKHRpbWUsIGR0KTtcbiAgICAgICAgICBncm91cC5yZW5kZXIoZHQpOyAvLyBmb3J3YXJkIGBkdGAgZm9yIGBwcmVSZW5kZXJgIG1ldGhvZFxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5sYXN0UmVuZGVyVGltZSA9IHRpbWU7XG4gICAgICAgIHNlbGYuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfSh0aGlzKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIGxvb3AgaWYgbm8gcmVuZGVyZXIgYXJlIHN0aWxsIHByZXNlbnQuIElmIG5vdCBhYm9ydC5cbiAgICovXG4gIHJlcXVpcmVTdG9wKCkge1xuICAgIC8vIEB0b2RvIC0gaGFuZGxlIHNldmVyYWwgcGFyYWxsZWwgZ3JvdXBzXG4gICAgbGV0IHNob3VsZFN0b3AgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJlbmRlcmluZ0dyb3Vwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnJlbmRlcmluZ0dyb3Vwc1tpXS5yZW5kZXJlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzaG91bGRTdG9wID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFN0b3ApIHtcbiAgICAgIC8vIGNvbnNvbGUubG9nKCc9PiBTdG9wIGNhbnZhcyByZW5kZXJpbmcgbG9vcCcpO1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZpZCk7XG4gICAgICB0aGlzLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmluZyBncm91cCB0byB0aGUgbG9vcC5cbiAgICovXG4gIHJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAoZ3JvdXApIHtcbiAgICB0aGlzLnJlbmRlcmluZ0dyb3Vwcy5wdXNoKGdyb3VwKTtcbiAgfVxufTtcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGFsbG93IHRvIHJlZ2lzdGVyIHNldmVyYWwgcmVuZGVyZXJzIG9uIGEgc2luZ2xlIGZ1bGwgc2NyZWVuIGNhbnZhcy4gQ2FsbHMgdGhlIGByZXF1aXJlU3RhcnRgIGFuZCBgcmVxdWlyZVN0b3BgIG9mIHRoZSBtYWluIHJlbmRlcmluZyBsb29wIHdoZW4gYSBgUmVuZGVyZXJgIGluc3RhbmNlIGlzIGFkZGVkIG9yIHJlbW92ZWQuXG4gKlxuICogVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBwcml2YXRlLCBhbmQgaXMgaGlkZGVuIGludG8gdGhlIEBsaW5rIGBDYW52YXNWaWV3YCBmb3IgbW9zdCBvZiB0aGUgdXNlY2FzZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyaW5nR3JvdXAge1xuICAvKipcbiAgICogVGhlIGNvbnN0cnVjb3RyIG9mIGEgYFJlbmRlcmluZ0dyb3VwYC5cbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIFRoZSBtYWluIGNhbnZhcyBjb250ZXh0IGluIHdoaWNoIHRoZSByZW5kZXJlciBzaG91bGQgZHJhdy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGN0eCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMucmVuZGVyZXJzID0gW107XG4gICAgLy8gcmVnaXN0ZXIgdGhlIGdyb3VwIGludG8gdGhlIGxvb3BcbiAgICBsb29wLnJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLiBQcm9wYWdhdGUgdmFsdWVzIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIHVwZGF0ZVNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuXG4gICAgdGhpcy5jdHgud2lkdGggPSB0aGlzLmN0eC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIHRoaXMuY3R4LmhlaWdodCA9IHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyc1tpXS51cGRhdGVTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGB1cGRhdGVgIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy4gVGhlIGB1cGRhdGVgIG1ldGhvZCBmb3IgZWFjaCByZW5kZXJlciBpcyBjYWxsZWQgYWNjb3JkaW5nIHRvIHRoZWlyIHVwZGF0ZSBwZXJpb2QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGhlIGN1cnJlbnQgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gVGhlIGRlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGUodGltZSwgZHQpIHtcbiAgICBjb25zdCByZW5kZXJlcnMgPSB0aGlzLnJlbmRlcmVycztcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVuZGVyZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgcmVuZGVyZXIgPSByZW5kZXJlcnNbaV07XG4gICAgICBjb25zdCB1cGRhdGVQZXJpb2QgPSByZW5kZXJlci51cGRhdGVQZXJpb2Q7XG5cbiAgICAgIGlmICh1cGRhdGVQZXJpb2QgPT09IDApIHtcbiAgICAgICAgcmVuZGVyZXIudXBkYXRlKGR0KTtcbiAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKHJlbmRlcmVyLmN1cnJlbnRUaW1lIDwgdGltZSkge1xuICAgICAgICAgIHJlbmRlcmVyLnVwZGF0ZSh1cGRhdGVQZXJpb2QpO1xuICAgICAgICAgIHJlbmRlcmVyLmN1cnJlbnRUaW1lICs9IHVwZGF0ZVBlcmlvZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCB0byBhcHBseSBnbG9iYWwgdHJhbnNmb3JtYXRpb25zIHRvIHRoZSBjYW52YXMgYmVmb3JlIGVhY2ggcmVuZGVyZXIgaXMgcmVuZGVyZWQuXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBUaGUgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgZGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZyBsb29wIChgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCkuXG4gICAqL1xuICBwcmVSZW5kZXIoY3R4LCBkdCkge31cblxuICAvKipcbiAgICogUHJvcGFnYXRlIGByZW5kZXJgIG1ldGhvZCB0byBhbGwgdGhlIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgZGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZyBsb29wIChgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCkuXG4gICAqL1xuICByZW5kZXIoZHQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCByZW5kZXJlcnMgPSB0aGlzLnJlbmRlcmVycztcblxuICAgIHRoaXMucHJlUmVuZGVyKGN0eCwgZHQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICByZW5kZXJlcnNbaV0ucmVuZGVyKGN0eCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgdG8gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byBhZGQuXG4gICAqL1xuICBhZGQocmVuZGVyZXIpIHtcbiAgICB0aGlzLnJlbmRlcmVycy5wdXNoKHJlbmRlcmVyKTtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gbG9vcC5nZXRUaW1lKCk7XG4gICAgLy8gdXBkYXRlIHRoZSBjdXJyZW50IHRpbWUgb2YgdGhlIHJlbmRlcmVyXG4gICAgcmVuZGVyZXIuY3VycmVudFRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lO1xuICAgIHJlbmRlcmVyLnVwZGF0ZVNpemUodGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xuICAgIHJlbmRlcmVyLmluaXQoKTtcbiAgICAvLyBpZiBmaXJzdCByZW5kZXJlciBhZGRlZCwgc3RhcnQgdGhlIGxvb3BcbiAgICBpZiAodGhpcy5yZW5kZXJlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICBsb29wLnJlcXVpcmVTdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBgUmVuZGVyZXJgIGluc3RhbmNlIGZyb20gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmUocmVuZGVyZXIpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucmVuZGVyZXJzLmluZGV4T2YocmVuZGVyZXIpO1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLnJlbmRlcmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIC8vIGlmIGxhc3QgcmVuZGVyZXIgcmVtb3ZlZCwgc3RvcCB0aGUgbG9vcFxuICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIGxvb3AucmVxdWlyZVN0b3AoKTtcbiAgICB9XG4gIH1cbn0iXX0=
/**
 * The main rendering loop handling the `requestAnimationFrame` and the `update` / `render` calls.
 * @private
 */
'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

Object.defineProperty(exports, '__esModule', {
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
    console.log('=> Start canvas rendering loop');

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
      console.log('=> Stop canvas rendering loop');

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
    key: 'updateSize',
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
    key: 'update',
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
    key: 'preRender',
    value: function preRender(ctx, dt) {}

    /**
     * Propagate `render` method to all the registered renderers.
     * @param {Number} dt - The delta time in seconds since the last rendering loop (`requestAnimationFrame`).
     */
  }, {
    key: 'render',
    value: function render(dt) {
      var ctx = this.ctx;
      var renderers = this.renderers;

      this.preRender(ctx, dt);

      for (var i = 0, l = renderers.length; i < l; i++) {
        renderers[i].render(ctx);
      }
    }

    /**
     * Add a `Renderer` instance to the `RenderingGroup`.
     * @param {Renderer} renderer - The renderer to add.
     */
  }, {
    key: 'add',
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
     * Remove a `Renderer` instance to the `RenderingGroup`.
     * @param {Renderer} renderer - The renderer to remove.
     */
  }, {
    key: 'remove',
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

exports['default'] = RenderingGroup;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9SZW5kZXJpbmdHcm91cC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBSUEsSUFBTSxJQUFJLEdBQUc7QUFDWCxpQkFBZSxFQUFFLEVBQUU7O0FBRW5CLFlBQVUsRUFBRSxLQUFLOzs7OztBQUtqQixTQUFPLEVBQUEsbUJBQUc7QUFDUixXQUFPLEtBQUssSUFBSSxNQUFNLENBQUMsV0FBVyxJQUFJLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxHQUMxRCxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUEsQUFBQyxDQUFDO0dBQ3BEOzs7OztBQUtELGNBQVksRUFBQSx3QkFBRztBQUNiLFFBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtBQUFFLGFBQU87S0FBRTtBQUNoQyxRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyQyxXQUFPLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7O0FBRTlDLEFBQUMsS0FBQSxVQUFTLElBQUksRUFBRTtBQUNkLGVBQVMsSUFBSSxHQUFHO0FBQ2QsWUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzVCLFlBQU0sRUFBRSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDO0FBQ3RDLFlBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7O0FBRTdDLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxlQUFlLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDdEQsY0FBTSxLQUFLLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVqQyxlQUFLLENBQUMs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VUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDL0IsWUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO09BQ3JCO0tBQ0Y7Ozs7Ozs7O1dBTUssZ0JBQUMsUUFBUSxFQUFFO0FBQ2YsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDL0MsVUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFBRSxlQUFPO09BQUU7O0FBRTdCLFVBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFaEMsVUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDL0IsWUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO09BQ3BCO0tBQ0Y7OztTQXpHa0IsY0FBYzs7O3FCQUFkLGNBQWMiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1JlbmRlcmluZ0dyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiByZW5kZXJpbmcgbG9vcCBoYW5kbGluZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgYW5kIHRoZSBgdXBkYXRlYCAvIGByZW5kZXJgIGNhbGxzLlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgbG9vcCA9IHtcbiAgcmVuZGVyaW5nR3JvdXBzOiBbXSxcblxuICBfaXNSdW5uaW5nOiBmYWxzZSxcblxuICAvKipcbiAgICogQHJldHVybnMge051bWJlcn0gLSBUaGUgY3VycmVudCB0aW1lIGluIHNlY29uZHMuXG4gICAqL1xuICBnZXRUaW1lKCkge1xuICAgIHJldHVybiAwLjAwMSAqICh3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA/XG4gICAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSByZW5kZXJpbmcgbG9vcCBpZiBub3Qgc3RhcnRlZC5cbiAgICovXG4gIHJlcXVpcmVTdGFydCgpIHtcbiAgICBpZiAodGhpcy5faXNSdW5uaW5nKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX2lzUnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5sYXN0UmVuZGVyVGltZSA9IHRoaXMuZ2V0VGltZSgpO1xuICAgIGNvbnNvbGUubG9nKCc9PiBTdGFydCBjYW52YXMgcmVuZGVyaW5nIGxvb3AnKTtcblxuICAgIChmdW5jdGlvbihzZWxmKSB7XG4gICAgICBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICBjb25zdCB0aW1lID0gc2VsZi5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IGR0ID0gdGltZSAtIHNlbGYubGFzdFJlbmRlclRpbWU7XG4gICAgICAgIGNvbnN0IHJlbmRlcmluZ0dyb3VwcyA9IHNlbGYucmVuZGVyaW5nR3JvdXBzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVuZGVyaW5nR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGdyb3VwID0gcmVuZGVyaW5nR3JvdXBzW2ldO1xuICAgICAgICAgIC8vIGxldCB0aGUgZ3JvdXAgaGFuZGxlIHRoZSB1cGRhdGVQZXJpb2Qgb2YgZWFjaCByZW5kZXJlclxuICAgICAgICAgIGdyb3VwLnVwZGF0ZSh0aW1lLCBkdCk7XG4gICAgICAgICAgZ3JvdXAucmVuZGVyKGR0KTsgLy8gZm9yd2FyZCBgZHRgIGZvciBgcHJlUmVuZGVyYCBtZXRob2RcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYubGFzdFJlbmRlclRpbWUgPSB0aW1lO1xuICAgICAgICBzZWxmLnJBRmlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnJBRmlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH0odGhpcykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBsb29wIGlmIG5vIHJlbmRlcmVyIGFyZSBzdGlsbCBwcmVzZW50LiBJZiBub3QgYWJvcnQuXG4gICAqL1xuICByZXF1aXJlU3RvcCgpIHtcbiAgICAvLyBAdG9kbyAtIGhhbmRsZSBzZXZlcmFsIHBhcmFsbGVsIGdyb3Vwc1xuICAgIGxldCBzaG91bGRTdG9wID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJpbmdHcm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5yZW5kZXJpbmdHcm91cHNbaV0ucmVuZGVyZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2hvdWxkU3RvcCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaG91bGRTdG9wKSB7XG4gICAgICBjb25zb2xlLmxvZygnPT4gU3RvcCBjYW52YXMgcmVuZGVyaW5nIGxvb3AnKTtcblxuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5yQUZpZCk7XG4gICAgICB0aGlzLl9pc1J1bm5pbmcgPSBmYWxzZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmluZyBncm91cCB0byB0aGUgbG9vcC5cbiAgICovXG4gIHJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAoZ3JvdXApIHtcbiAgICB0aGlzLnJlbmRlcmluZ0dyb3Vwcy5wdXNoKGdyb3VwKTtcbiAgfVxufTtcblxuLyoqXG4gKiBUaGlzIGNsYXNzIGFsbG93IHRvIHJlZ2lzdGVyIHNldmVyYWwgcmVuZGVyZXJzIG9uIGEgc2luZ2xlIGZ1bGwgc2NyZWVuIGNhbnZhcy4gQ2FsbHMgdGhlIGByZXF1aXJlU3RhcnRgIGFuZCBgcmVxdWlyZVN0b3BgIG9mIHRoZSBtYWluIHJlbmRlcmluZyBsb29wIHdoZW4gYSBgUmVuZGVyZXJgIGluc3RhbmNlIGlzIGFkZGVkIG9yIHJlbW92ZWQuXG4gKlxuICogVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBwcml2YXRlLCBhbmQgaXMgaGlkZGVuIGludG8gdGhlIEBsaW5rIGBDYW52YXNWaWV3YCBmb3IgbW9zdCBvZiB0aGUgdXNlY2FzZXNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyaW5nR3JvdXAge1xuICAvKipcbiAgICogVGhlIGNvbnN0cnVjb3RyIG9mIGEgYFJlbmRlcmluZ0dyb3VwYC5cbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIFRoZSBtYWluIGNhbnZhcyBjb250ZXh0IGluIHdoaWNoIHRoZSByZW5kZXJlciBzaG91bGQgZHJhdy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGN0eCkge1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgIHRoaXMucmVuZGVyZXJzID0gW107XG4gICAgLy8gcmVnaXN0ZXIgdGhlIGdyb3VwIGludG8gdGhlIGxvb3BcbiAgICBsb29wLnJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLiBQcm9wYWdhdGUgdmFsdWVzIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIHVwZGF0ZVNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuXG4gICAgdGhpcy5jdHgud2lkdGggPSB0aGlzLmN0eC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIHRoaXMuY3R4LmhlaWdodCA9IHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyc1tpXS51cGRhdGVTaXplKHdpZHRoLCBoZWlnaHQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgdGhlIGB1cGRhdGVgIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy4gVGhlIGB1cGRhdGVgIG1ldGhvZCBmb3IgZWFjaCByZW5kZXJlciBpcyBjYWxsZWQgYWNjb3JkaW5nIHRvIHRoZWlyIHVwZGF0ZSBwZXJpb2QuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0aW1lIC0gVGhlIGN1cnJlbnQgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gVGhlIGRlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGUodGltZSwgZHQpIHtcbiAgICBjb25zdCByZW5kZXJlcnMgPSB0aGlzLnJlbmRlcmVycztcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVuZGVyZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgcmVuZGVyZXIgPSByZW5kZXJlcnNbaV07XG4gICAgICBjb25zdCB1cGRhdGVQZXJpb2QgPSByZW5kZXJlci51cGRhdGVQZXJpb2Q7XG5cbiAgICAgIGlmICh1cGRhdGVQZXJpb2QgPT09IDApIHtcbiAgICAgICAgcmVuZGVyZXIudXBkYXRlKGR0KTtcbiAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKHJlbmRlcmVyLmN1cnJlbnRUaW1lIDwgdGltZSkge1xuICAgICAgICAgIHJlbmRlcmVyLnVwZGF0ZSh1cGRhdGVQZXJpb2QpO1xuICAgICAgICAgIHJlbmRlcmVyLmN1cnJlbnRUaW1lICs9IHVwZGF0ZVBlcmlvZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCB0byBhcHBseSBnbG9iYWwgdHJhbnNmb3JtYXRpb25zIHRvIHRoZSBjYW52YXMgYmVmb3JlIGVhY2ggcmVuZGVyZXIgaXMgcmVuZGVyZWQuXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBUaGUgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgZGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZyBsb29wIChgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCkuXG4gICAqL1xuICBwcmVSZW5kZXIoY3R4LCBkdCkge31cblxuICAvKipcbiAgICogUHJvcGFnYXRlIGByZW5kZXJgIG1ldGhvZCB0byBhbGwgdGhlIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBUaGUgZGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZyBsb29wIChgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCkuXG4gICAqL1xuICByZW5kZXIoZHQpIHtcbiAgICBjb25zdCBjdHggPSB0aGlzLmN0eDtcbiAgICBjb25zdCByZW5kZXJlcnMgPSB0aGlzLnJlbmRlcmVycztcblxuICAgIHRoaXMucHJlUmVuZGVyKGN0eCwgZHQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICByZW5kZXJlcnNbaV0ucmVuZGVyKGN0eCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgdG8gdGhlIGBSZW5kZXJpbmdHcm91cGAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZChyZW5kZXJlcikge1xuICAgIHRoaXMucmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBsb29wLmdldFRpbWUoKTtcbiAgICAvLyB1cGRhdGUgdGhlIGN1cnJlbnQgdGltZSBvZiB0aGUgcmVuZGVyZXJcbiAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgcmVuZGVyZXIudXBkYXRlU2l6ZSh0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gICAgcmVuZGVyZXIuaW5pdCgpO1xuICAgIC8vIGlmIGZpcnN0IHJlbmRlcmVyIGFkZGVkLCBzdGFydCB0aGUgbG9vcFxuICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxvb3AucmVxdWlyZVN0YXJ0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgdG8gdGhlIGBSZW5kZXJpbmdHcm91cGAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZShyZW5kZXJlcikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZW5kZXJlcnMuaW5kZXhPZihyZW5kZXJlcik7XG4gICAgaWYgKGluZGV4ID09PSAtMSkgeyByZXR1cm47IH1cblxuICAgIHRoaXMucmVuZGVyZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgLy8gaWYgbGFzdCByZW5kZXJlciByZW1vdmVkLCBzdG9wIHRoZSBsb29wXG4gICAgaWYgKHRoaXMucmVuZGVyZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgbG9vcC5yZXF1aXJlU3RvcCgpO1xuICAgIH1cbiAgfVxufSJdfQ==
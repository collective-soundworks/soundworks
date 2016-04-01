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
   * @param {Number} viewportWidth - Width of the viewport.
   * @param {Number} viewportHeight - Height of the viewport.
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
//# sourceMappingURL=data:application/json;base64,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QUFmLENBQW9CLFFBQXBCLEVBRFk7QUFFWixXQUFLLFdBQUwsR0FBbUIsS0FBSyxPQUFMLEVBQW5COztBQUZZLGNBSVosQ0FBUyxXQUFULEdBQXVCLEtBQUssV0FBTCxDQUpYO0FBS1osZUFBUyxRQUFULENBQWtCLEtBQUssV0FBTCxFQUFrQixLQUFLLFlBQUwsQ0FBcEMsQ0FMWTtBQU1aLGVBQVMsSUFBVDs7QUFOWSxVQVFSLEtBQUssU0FBTCxDQUFlLE1BQWYsS0FBMEIsQ0FBMUIsRUFDRixLQUFLLFlBQUwsR0FERjs7Ozs7Ozs7OzsyQkFRSyxVQUFVO0FBQ2YsVUFBTSxRQUFRLEtBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsUUFBdkIsQ0FBUixDQURTOztBQUdmLFVBQUksVUFBVSxDQUFDLENBQUQsRUFBSTtBQUNoQixhQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLEtBQXRCLEVBQTZCLENBQTdCOztBQURnQixZQUdaLEtBQUssU0FBTCxDQUFlLE1BQWYsS0FBMEIsQ0FBMUIsRUFDRixLQUFLLFdBQUwsR0FERjtPQUhGOzs7U0FwR2lCIiwiZmlsZSI6IlJlbmRlcmluZ0dyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiByZW5kZXJpbmcgbG9vcCBoYW5kbGluZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgYW5kIHRoZSBgdXBkYXRlYCAvIGByZW5kZXJgIGNhbGxzLlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgbG9vcCA9IHtcbiAgcmVuZGVyaW5nR3JvdXBzOiBbXSxcblxuICBfaXNSdW5uaW5nOiBmYWxzZSxcblxuICAvKipcbiAgICogQHJldHVybnMge051bWJlcn0gLSBUaGUgY3VycmVudCB0aW1lIGluIHNlY29uZHMuXG4gICAqL1xuICBnZXRUaW1lKCkge1xuICAgIHJldHVybiAwLjAwMSAqICh3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA/XG4gICAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSByZW5kZXJpbmcgbG9vcCBpZiBub3Qgc3RhcnRlZC5cbiAgICovXG4gIHJlcXVpcmVTdGFydCgpIHtcbiAgICBpZiAodGhpcy5faXNSdW5uaW5nKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX2lzUnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5sYXN0UmVuZGVyVGltZSA9IHRoaXMuZ2V0VGltZSgpO1xuXG4gICAgKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBzZWxmLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgZHQgPSB0aW1lIC0gc2VsZi5sYXN0UmVuZGVyVGltZTtcbiAgICAgICAgY29uc3QgcmVuZGVyaW5nR3JvdXBzID0gc2VsZi5yZW5kZXJpbmdHcm91cHM7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJpbmdHcm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSByZW5kZXJpbmdHcm91cHNbaV07XG4gICAgICAgICAgLy8gbGV0IHRoZSBncm91cCBoYW5kbGUgdGhlIHVwZGF0ZVBlcmlvZCBvZiBlYWNoIHJlbmRlcmVyXG4gICAgICAgICAgZ3JvdXAudXBkYXRlKHRpbWUsIGR0KTtcbiAgICAgICAgICBncm91cC5yZW5kZXIoZHQpOyAvLyBmb3J3YXJkIGBkdGAgZm9yIGBwcmVSZW5kZXJgIG1ldGhvZFxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5sYXN0UmVuZGVyVGltZSA9IHRpbWU7XG4gICAgICAgIHNlbGYuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfSh0aGlzKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIGxvb3AgaWYgbm8gcmVuZGVyZXIgYXJlIHN0aWxsIHByZXNlbnQuIElmIG5vdCBhYm9ydC5cbiAgICovXG4gIHJlcXVpcmVTdG9wKCkge1xuICAgIC8vIEB0b2RvIC0gaGFuZGxlIHNldmVyYWwgcGFyYWxsZWwgZ3JvdXBzXG4gICAgbGV0IHNob3VsZFN0b3AgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJlbmRlcmluZ0dyb3Vwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnJlbmRlcmluZ0dyb3Vwc1tpXS5yZW5kZXJlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzaG91bGRTdG9wID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFN0b3ApIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuckFGaWQpO1xuICAgICAgdGhpcy5faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJpbmcgZ3JvdXAgdG8gdGhlIGxvb3AuXG4gICAqL1xuICByZWdpc3RlclJlbmRlcmluZ0dyb3VwKGdyb3VwKSB7XG4gICAgdGhpcy5yZW5kZXJpbmdHcm91cHMucHVzaChncm91cCk7XG4gIH1cbn07XG5cbi8qKlxuICogVGhpcyBjbGFzcyBhbGxvdyB0byByZWdpc3RlciBzZXZlcmFsIHJlbmRlcmVycyBvbiBhIHNpbmdsZSBmdWxsIHNjcmVlblxuICogY2FudmFzLiBDYWxscyB0aGUgYHJlcXVpcmVTdGFydGAgYW5kIGByZXF1aXJlU3RvcGAgb2YgdGhlIG1haW4gcmVuZGVyaW5nXG4gKiBsb29wIHdoZW4gYSBgUmVuZGVyZXJgIGluc3RhbmNlIGlzIGFkZGVkIG9yIHJlbW92ZWQuXG4gKlxuICogVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBwcml2YXRlLCBhbmQgaXMgaGlkZGVuIGludG8gdGhlXG4gKiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd9IGZvciBtb3N0IG9mIHRoZSB1c2VjYXNlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyaW5nR3JvdXAge1xuICAvKipcbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIENhbnZhcyBjb250ZXh0IGluIHdoaWNoXG4gICAqICB0aGUgcmVuZGVyZXIgc2hvdWxkIGRyYXcuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjdHgpIHtcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLnJlbmRlcmVycyA9IFtdO1xuICAgIC8vIHJlZ2lzdGVyIHRoZSBncm91cCBpbnRvIHRoZSBsb29wXG4gICAgbG9vcC5yZWdpc3RlclJlbmRlcmluZ0dyb3VwKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIHNpemUgb2YgdGhlIGNhbnZhcy4gUHJvcGFnYXRlIHZhbHVlcyB0byBhbGwgcmVnaXN0ZXJlZCByZW5kZXJlcnMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydFdpZHRoIC0gV2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBIZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuICAgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB0aGlzLmNhbnZhc0hlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuXG4gICAgdGhpcy5jdHgud2lkdGggPSB0aGlzLmN0eC5jYW52YXMud2lkdGggPSB0aGlzLmNhbnZhc1dpZHRoO1xuICAgIHRoaXMuY3R4LmhlaWdodCA9IHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5yZW5kZXJlcnNbaV0ub25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSB0aGUgYHVwZGF0ZWAgdG8gYWxsIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLiBUaGUgYHVwZGF0ZWAgbWV0aG9kXG4gICAqIGZvciBlYWNoIHJlbmRlcmVyIGlzIGNhbGxlZCBhY2NvcmRpbmcgdG8gdGhlaXIgdXBkYXRlIHBlcmlvZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBDdXJyZW50IHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIERlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSB0aGUgbGFzdCB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGUodGltZSwgZHQpIHtcbiAgICBjb25zdCByZW5kZXJlcnMgPSB0aGlzLnJlbmRlcmVycztcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVuZGVyZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgY29uc3QgcmVuZGVyZXIgPSByZW5kZXJlcnNbaV07XG4gICAgICBjb25zdCB1cGRhdGVQZXJpb2QgPSByZW5kZXJlci51cGRhdGVQZXJpb2Q7XG5cbiAgICAgIGlmICh1cGRhdGVQZXJpb2QgPT09IDApIHtcbiAgICAgICAgcmVuZGVyZXIudXBkYXRlKGR0KTtcbiAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgPSB0aW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2hpbGUgKHJlbmRlcmVyLmN1cnJlbnRUaW1lIDwgdGltZSkge1xuICAgICAgICAgIHJlbmRlcmVyLnVwZGF0ZSh1cGRhdGVQZXJpb2QpO1xuICAgICAgICAgIHJlbmRlcmVyLmN1cnJlbnRUaW1lICs9IHVwZGF0ZVBlcmlvZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCB0byBhcHBseSBnbG9iYWwgdHJhbnNmb3JtYXRpb25zIHRvIHRoZSBjYW52YXMgYmVmb3JlIGVhY2hcbiAgICogcmVuZGVyZXIgaXMgcmVuZGVyZWQuXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBDb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIERlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSB0aGUgbGFzdCByZW5kZXJpbmdcbiAgICogIGxvb3AgKGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgKS5cbiAgICovXG4gIHByZVJlbmRlcihjdHgsIGR0KSB7fVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYHJlbmRlcmAgbWV0aG9kIHRvIGFsbCB0aGUgcmVnaXN0ZXJlZCByZW5kZXJlcnMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIERlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSB0aGUgbGFzdCByZW5kZXJpbmdcbiAgICogIGxvb3AgKGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgKS5cbiAgICovXG4gIHJlbmRlcihkdCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHJlbmRlcmVycyA9IHRoaXMucmVuZGVyZXJzO1xuXG4gICAgdGhpcy5wcmVSZW5kZXIoY3R4LCBkdCk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHJlbmRlcmVycy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICByZW5kZXJlcnNbaV0ucmVuZGVyKGN0eCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgYFJlbmRlcmVyYCBpbnN0YW5jZSB0byB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gUmVuZGVyZXIgdG8gYmUgYWRkZWQuXG4gICAqL1xuICBhZGQocmVuZGVyZXIpIHtcbiAgICB0aGlzLnJlbmRlcmVycy5wdXNoKHJlbmRlcmVyKTtcbiAgICB0aGlzLmN1cnJlbnRUaW1lID0gbG9vcC5nZXRUaW1lKCk7XG4gICAgLy8gdXBkYXRlIHRoZSBjdXJyZW50IHRpbWUgb2YgdGhlIHJlbmRlcmVyXG4gICAgcmVuZGVyZXIuY3VycmVudFRpbWUgPSB0aGlzLmN1cnJlbnRUaW1lO1xuICAgIHJlbmRlcmVyLm9uUmVzaXplKHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcbiAgICByZW5kZXJlci5pbml0KCk7XG4gICAgLy8gaWYgZmlyc3QgcmVuZGVyZXIgYWRkZWQsIHN0YXJ0IHRoZSBsb29wXG4gICAgaWYgKHRoaXMucmVuZGVyZXJzLmxlbmd0aCA9PT0gMSlcbiAgICAgIGxvb3AucmVxdWlyZVN0YXJ0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgYFJlbmRlcmVyYCBpbnN0YW5jZSBmcm9tIHRoZSBncm91cC5cbiAgICogQHBhcmFtIHtSZW5kZXJlcn0gcmVuZGVyZXIgLSBFZW5kZXJlciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmUocmVuZGVyZXIpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucmVuZGVyZXJzLmluZGV4T2YocmVuZGVyZXIpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5yZW5kZXJlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIC8vIGlmIGxhc3QgcmVuZGVyZXIgcmVtb3ZlZCwgc3RvcCB0aGUgbG9vcFxuICAgICAgaWYgKHRoaXMucmVuZGVyZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgbG9vcC5yZXF1aXJlU3RvcCgpO1xuICAgICB9XG4gIH1cbn1cbiJdfQ==
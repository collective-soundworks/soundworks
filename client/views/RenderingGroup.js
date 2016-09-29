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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlJlbmRlcmluZ0dyb3VwLmpzIl0sIm5hbWVzIjpbImxvb3AiLCJyZW5kZXJpbmdHcm91cHMiLCJfaXNSdW5uaW5nIiwiZ2V0VGltZSIsIndpbmRvdyIsInBlcmZvcm1hbmNlIiwibm93IiwiRGF0ZSIsInJlcXVpcmVTdGFydCIsImxhc3RSZW5kZXJUaW1lIiwic2VsZiIsInRpbWUiLCJkdCIsImkiLCJsIiwibGVuZ3RoIiwiZ3JvdXAiLCJ1cGRhdGUiLCJyZW5kZXIiLCJyQUZpZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInJlcXVpcmVTdG9wIiwic2hvdWxkU3RvcCIsInJlbmRlcmVycyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVnaXN0ZXJSZW5kZXJpbmdHcm91cCIsInB1c2giLCJSZW5kZXJpbmdHcm91cCIsImN0eCIsInByZXNlcnZlUGl4ZWxSYXRpbyIsInBpeGVsUmF0aW8iLCJkUFIiLCJkZXZpY2VQaXhlbFJhdGlvIiwiYlBSIiwid2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsIm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJtc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJvQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsImJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJ2aWV3cG9ydFdpZHRoIiwidmlld3BvcnRIZWlnaHQiLCJjYW52YXNXaWR0aCIsImNhbnZhc0hlaWdodCIsImNhbnZhcyIsIndpZHRoIiwiaGVpZ2h0Iiwic3R5bGUiLCJvblJlc2l6ZSIsInJlbmRlcmVyIiwidXBkYXRlUGVyaW9kIiwiY3VycmVudFRpbWUiLCJwcmVSZW5kZXIiLCJpbml0IiwiaW5kZXgiLCJpbmRleE9mIiwic3BsaWNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFJQSxJQUFNQSxPQUFPO0FBQ1hDLG1CQUFpQixFQUROOztBQUdYQyxjQUFZLEtBSEQ7O0FBS1g7OztBQUdBQyxTQVJXLHFCQVFEO0FBQ1IsV0FBTyxT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RjtBQUNIOzs7OztrQkF0SWtCTSxjIiwiZmlsZSI6IlJlbmRlcmluZ0dyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgbWFpbiByZW5kZXJpbmcgbG9vcCBoYW5kbGluZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgYW5kIHRoZSBgdXBkYXRlYCAvIGByZW5kZXJgIGNhbGxzLlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgbG9vcCA9IHtcbiAgcmVuZGVyaW5nR3JvdXBzOiBbXSxcblxuICBfaXNSdW5uaW5nOiBmYWxzZSxcblxuICAvKipcbiAgICogQHJldHVybnMge051bWJlcn0gLSBUaGUgY3VycmVudCB0aW1lIGluIHNlY29uZHMuXG4gICAqL1xuICBnZXRUaW1lKCkge1xuICAgIHJldHVybiAwLjAwMSAqICh3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA/XG4gICAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSByZW5kZXJpbmcgbG9vcCBpZiBub3Qgc3RhcnRlZC5cbiAgICovXG4gIHJlcXVpcmVTdGFydCgpIHtcbiAgICBpZiAodGhpcy5faXNSdW5uaW5nKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX2lzUnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5sYXN0UmVuZGVyVGltZSA9IHRoaXMuZ2V0VGltZSgpO1xuXG4gICAgKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBzZWxmLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgZHQgPSB0aW1lIC0gc2VsZi5sYXN0UmVuZGVyVGltZTtcbiAgICAgICAgY29uc3QgcmVuZGVyaW5nR3JvdXBzID0gc2VsZi5yZW5kZXJpbmdHcm91cHM7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJpbmdHcm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSByZW5kZXJpbmdHcm91cHNbaV07XG4gICAgICAgICAgLy8gbGV0IHRoZSBncm91cCBoYW5kbGUgdGhlIHVwZGF0ZVBlcmlvZCBvZiBlYWNoIHJlbmRlcmVyXG4gICAgICAgICAgZ3JvdXAudXBkYXRlKHRpbWUsIGR0KTtcbiAgICAgICAgICBncm91cC5yZW5kZXIoZHQpOyAvLyBmb3J3YXJkIGBkdGAgZm9yIGBwcmVSZW5kZXJgIG1ldGhvZFxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5sYXN0UmVuZGVyVGltZSA9IHRpbWU7XG4gICAgICAgIHNlbGYuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfSh0aGlzKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIGxvb3AgaWYgbm8gcmVuZGVyZXIgYXJlIHN0aWxsIHByZXNlbnQuIElmIG5vdCBhYm9ydC5cbiAgICovXG4gIHJlcXVpcmVTdG9wKCkge1xuICAgIC8vIEB0b2RvIC0gaGFuZGxlIHNldmVyYWwgcGFyYWxsZWwgZ3JvdXBzXG4gICAgbGV0IHNob3VsZFN0b3AgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJlbmRlcmluZ0dyb3Vwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnJlbmRlcmluZ0dyb3Vwc1tpXS5yZW5kZXJlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzaG91bGRTdG9wID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFN0b3ApIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuckFGaWQpO1xuICAgICAgdGhpcy5faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJpbmcgZ3JvdXAgdG8gdGhlIGxvb3AuXG4gICAqL1xuICByZWdpc3RlclJlbmRlcmluZ0dyb3VwKGdyb3VwKSB7XG4gICAgdGhpcy5yZW5kZXJpbmdHcm91cHMucHVzaChncm91cCk7XG4gIH1cbn07XG5cbi8qKlxuICogVGhpcyBjbGFzcyBhbGxvdyB0byByZWdpc3RlciBzZXZlcmFsIHJlbmRlcmVycyBvbiBhIHNpbmdsZSBmdWxsIHNjcmVlblxuICogY2FudmFzLiBDYWxscyB0aGUgYHJlcXVpcmVTdGFydGAgYW5kIGByZXF1aXJlU3RvcGAgb2YgdGhlIG1haW4gcmVuZGVyaW5nXG4gKiBsb29wIHdoZW4gYSBgUmVuZGVyZXJgIGluc3RhbmNlIGlzIGFkZGVkIG9yIHJlbW92ZWQuXG4gKlxuICogVGhpcyBjbGFzcyBzaG91bGQgYmUgY29uc2lkZXJlZCBhcyBwcml2YXRlLCBhbmQgaXMgaGlkZGVuIGludG8gdGhlXG4gKiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd9IGZvciBtb3N0IG9mIHRoZSB1c2VjYXNlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyaW5nR3JvdXAge1xuICAvKipcbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIENhbnZhcyBjb250ZXh0IGluIHdoaWNoXG4gICAqICB0aGUgcmVuZGVyZXIgc2hvdWxkIGRyYXcuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW3ByZXNlcnZlUGl4ZWxSYXRpbz1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIGNhbnZhcyBzaG91bGRcbiAgICogIHRha2UgYWNjb3VudCBvZiB0aGUgZGV2aWNlIHBpeGVsIHJhdGlvIGZvciB0aGUgZHJhd2luZy4gV2hlbiBzZXQgdG8gYHRydWVgLFxuICAgKiAgcXVhbGl0eSBpZiBmYXZvcmVkIG92ZXIgcGVyZm9ybWFuY2UuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihjdHgsIHByZXNlcnZlUGl4ZWxSYXRpbyA9IGZhbHNlKSB7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gICAgdGhpcy5yZW5kZXJlcnMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFBpeGVsIHJhdGlvIG9mIHRoZSBkZXZpY2UsIGlmIGBwcmVzZXJ2ZVBpeGVsUmF0aW9gIGlzIGBmYWxzZWAsXG4gICAgICogdGhpcyB2YWx1ZSBpcyBmb3JjZWQgdG8gMVxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5waXhlbFJhdGlvID0gKGZ1bmN0aW9uKGN0eCkge1xuICAgICAgY29uc3QgZFBSID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICAgIGNvbnN0IGJQUiA9IGN0eC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICAgIGN0eC5tb3pCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICAgIGN0eC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgY3R4Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICAgIGN0eC5iYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IDE7XG5cbiAgICAgIHJldHVybiBwcmVzZXJ2ZVBpeGVsUmF0aW8gPyAoZFBSIC8gYlBSKSA6IDE7XG4gICAgfSh0aGlzLmN0eCkpO1xuXG4gICAgLy8gcmVnaXN0ZXIgdGhlIGdyb3VwIGludG8gdGhlIGxvb3BcbiAgICBsb29wLnJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLiBQcm9wYWdhdGUgdmFsdWVzIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydEhlaWdodCAtIEhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCkge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHBpeGVsUmF0aW8gPSB0aGlzLnBpeGVsUmF0aW87XG5cbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gdmlld3BvcnRXaWR0aCAqIHBpeGVsUmF0aW87XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSB2aWV3cG9ydEhlaWdodCAqIHBpeGVsUmF0aW87XG5cbiAgICBjdHguY2FudmFzLndpZHRoID0gdGhpcy5jYW52YXNXaWR0aDtcbiAgICBjdHguY2FudmFzLmhlaWdodCA9IHRoaXMuY2FudmFzSGVpZ2h0O1xuICAgIGN0eC5jYW52YXMuc3R5bGUud2lkdGggPSBgJHt2aWV3cG9ydFdpZHRofXB4YDtcbiAgICBjdHguY2FudmFzLnN0eWxlLmhlaWdodCA9IGAke3ZpZXdwb3J0SGVpZ2h0fXB4YDtcblxuICAgIC8vIGN0eC5zY2FsZShwaXhlbFJhdGlvLCBwaXhlbFJhdGlvKTtcblxuICAgIC8vIHByb3BhZ2F0ZSBsb2dpY2FsIHNpemUgdG8gcmVuZGVyZXJzXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJlbmRlcmVycy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLnJlbmRlcmVyc1tpXS5vblJlc2l6ZSh0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gIH1cblxuICAvKipcbiAgICogUHJvcGFnYXRlIHRoZSBgdXBkYXRlYCB0byBhbGwgcmVnaXN0ZXJlZCByZW5kZXJlcnMuIFRoZSBgdXBkYXRlYCBtZXRob2RcbiAgICogZm9yIGVhY2ggcmVuZGVyZXIgaXMgY2FsbGVkIGFjY29yZGluZyB0byB0aGVpciB1cGRhdGUgcGVyaW9kLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdGltZSAtIEN1cnJlbnQgdGltZS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gRGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZSh0aW1lLCBkdCkge1xuICAgIGNvbnN0IHJlbmRlcmVycyA9IHRoaXMucmVuZGVyZXJzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHJlbmRlcmVyc1tpXTtcbiAgICAgIGNvbnN0IHVwZGF0ZVBlcmlvZCA9IHJlbmRlcmVyLnVwZGF0ZVBlcmlvZDtcblxuICAgICAgaWYgKHVwZGF0ZVBlcmlvZCA9PT0gMCkge1xuICAgICAgICByZW5kZXJlci51cGRhdGUoZHQpO1xuICAgICAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAocmVuZGVyZXIuY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgICAgcmVuZGVyZXIudXBkYXRlKHVwZGF0ZVBlcmlvZCk7XG4gICAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgKz0gdXBkYXRlUGVyaW9kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IHRvIGFwcGx5IGdsb2JhbCB0cmFuc2Zvcm1hdGlvbnMgdG8gdGhlIGNhbnZhcyBiZWZvcmUgZWFjaFxuICAgKiByZW5kZXJlciBpcyByZW5kZXJlZC5cbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIENvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gRGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZ1xuICAgKiAgbG9vcCAoYHJlcXVlc3RBbmltYXRpb25GcmFtZWApLlxuICAgKi9cbiAgcHJlUmVuZGVyKGN0eCwgZHQpIHt9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSBgcmVuZGVyYCBtZXRob2QgdG8gYWxsIHRoZSByZWdpc3RlcmVkIHJlbmRlcmVycy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gRGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZ1xuICAgKiAgbG9vcCAoYHJlcXVlc3RBbmltYXRpb25GcmFtZWApLlxuICAgKi9cbiAgcmVuZGVyKGR0KSB7XG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHg7XG4gICAgY29uc3QgcmVuZGVyZXJzID0gdGhpcy5yZW5kZXJlcnM7XG5cbiAgICB0aGlzLnByZVJlbmRlcihjdHgsIGR0KTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVuZGVyZXJzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHJlbmRlcmVyc1tpXS5yZW5kZXIoY3R4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBgUmVuZGVyZXJgIGluc3RhbmNlIHRvIHRoZSBncm91cC5cbiAgICogQHBhcmFtIHtSZW5kZXJlcn0gcmVuZGVyZXIgLSBSZW5kZXJlciB0byBiZSBhZGRlZC5cbiAgICovXG4gIGFkZChyZW5kZXJlcikge1xuICAgIHRoaXMucmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBsb29wLmdldFRpbWUoKTtcbiAgICAvLyB1cGRhdGUgdGhlIGN1cnJlbnQgdGltZSBvZiB0aGUgcmVuZGVyZXJcbiAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgcmVuZGVyZXIub25SZXNpemUodGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xuICAgIHJlbmRlcmVyLmluaXQoKTtcbiAgICAvLyBpZiBmaXJzdCByZW5kZXJlciBhZGRlZCwgc3RhcnQgdGhlIGxvb3BcbiAgICBpZiAodGhpcy5yZW5kZXJlcnMubGVuZ3RoID09PSAxKVxuICAgICAgbG9vcC5yZXF1aXJlU3RhcnQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBgUmVuZGVyZXJgIGluc3RhbmNlIGZyb20gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIEVlbmRlcmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZShyZW5kZXJlcikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZW5kZXJlcnMuaW5kZXhPZihyZW5kZXJlcik7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnJlbmRlcmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgLy8gaWYgbGFzdCByZW5kZXJlciByZW1vdmVkLCBzdG9wIHRoZSBsb29wXG4gICAgICBpZiAodGhpcy5yZW5kZXJlcnMubGVuZ3RoID09PSAwKVxuICAgICAgICBsb29wLnJlcXVpcmVTdG9wKCk7XG4gICAgIH1cbiAgfVxufVxuIl19
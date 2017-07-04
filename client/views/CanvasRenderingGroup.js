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
 * Rendering loop handling the `requestAnimationFrame` and the `update` /
 * `render` cycles.
 *
 * @private
 */
var loop = {
  renderingGroups: [],

  _isRunning: false,

  /**
   * @return {Number} - Current time in seconds.
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
 * Handle a group of renderers on a single full screen canvas.
 *
 * <span class="warning">This class is a property of
 * {@link module:soundworks/client.CanvasView} should be considered private.</span>
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context in which
 *  the renderer should draw.
 * @param {Boolean} [preservePixelRatio=false] - Define if the canvas should
 *  take account of the device pixel ratio for the drawing. When set to `true`,
 *  quality if favored over performance.
 *
 * @memberof module:soundworks/client
 */

var Canvas2dRenderingGroup = function () {
  function Canvas2dRenderingGroup(ctx) {
    var preservePixelRatio = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    (0, _classCallCheck3.default)(this, Canvas2dRenderingGroup);

    /**
     * 2d context of the canvas.
     *
     * @type {CanvasRenderingContext2D}
     * @name ctx
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderingGroup
     */
    this.ctx = ctx;

    /**
     * Stack of the registered renderers.
     *
     * @type {Array<module:soundworks/client.Renderer>}
     * @name renderers
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderingGroup
     */
    this.renderers = [];

    /**
     * Hooks executed at the beginning and end of each rAF call.
     * @private
     */
    this.preRender = null;
    this.postRender = null;

    /**
     * Pixel ratio of the device, set to 1 if `false`.
     *
     * @type {Number}
     * @name pixelRatio
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderingGroup
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
   * Updates the size of the canvas. Propagate new logical `width` and `height`
   * according to `this.pixelRatio` to all registered renderers.
   *
   * @param {Number} viewportWidth - Width of the viewport.
   * @param {Number} viewportHeight - Height of the viewport.
   * @param {Number} orientation - Orientation of the viewport.
   */


  (0, _createClass3.default)(Canvas2dRenderingGroup, [{
    key: "onResize",
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      var ctx = this.ctx;
      var pixelRatio = this.pixelRatio;

      this.canvasWidth = viewportWidth * pixelRatio;
      this.canvasHeight = viewportHeight * pixelRatio;
      this.orientation = orientation;

      ctx.canvas.width = this.canvasWidth;
      ctx.canvas.height = this.canvasHeight;
      ctx.canvas.style.width = viewportWidth + "px";
      ctx.canvas.style.height = viewportHeight + "px";

      // propagate logical size to renderers
      for (var i = 0, l = this.renderers.length; i < l; i++) {
        this.renderers[i].onResize(this.canvasWidth, this.canvasHeight, orientation);
      }
    }

    /**
     * Propagate `update` to all registered renderers. The `update` method
     * for each renderer is called according to their update period.
     *
     * @param {Number} time - Current time.
     * @param {Number} dt - Delta time in seconds since last update.
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
     * Propagate `render` to all the registered renderers.
     *
     * @param {Number} dt - Delta time in seconds since the last
     *  `requestAnimationFrame` call.
     */

  }, {
    key: "render",
    value: function render(dt) {
      var ctx = this.ctx,
          renderers = this.renderers;


      if (this.preRender !== null) this.preRender(ctx, dt, this.canvasWidth, this.canvasHeight);

      for (var i = 0, l = renderers.length; i < l; i++) {
        renderers[i].render(ctx);
      }if (this.postRender !== null) this.postRender(ctx, dt, this.canvasWidth, this.canvasHeight);
    }

    /**
     * Add a `Renderer` instance to the group.
     *
     * @param {module:soundworks/client.Renderer} renderer - Renderer to add to
     *  the group.
     */

  }, {
    key: "add",
    value: function add(renderer) {
      this.renderers.push(renderer);
      this.currentTime = loop.getTime();
      // update the current time of the renderer
      renderer.currentTime = this.currentTime;
      renderer.pixelRatio = this.pixelRatio;
      renderer.onResize(this.canvasWidth, this.canvasHeight, this.orientation);
      renderer.init();
      // if first renderer added, start the loop
      if (this.renderers.length === 1) loop.requireStart();
    }

    /**
     * Remove a `Renderer` instance from the group.
     *
     * @param {module:soundworks/client.Renderer} renderer - Renderer to remove
     *  from the group.
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
  return Canvas2dRenderingGroup;
}();

exports.default = Canvas2dRenderingGroup;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1JlbmRlcmluZ0dyb3VwLmpzIl0sIm5hbWVzIjpbImxvb3AiLCJyZW5kZXJpbmdHcm91cHMiLCJfaXNSdW5uaW5nIiwiZ2V0VGltZSIsIndpbmRvdyIsInBlcmZvcm1hbmNlIiwibm93IiwiRGF0ZSIsInJlcXVpcmVTdGFydCIsImxhc3RSZW5kZXJUaW1lIiwic2VsZiIsInRpbWUiLCJkdCIsImkiLCJsIiwibGVuZ3RoIiwiZ3JvdXAiLCJ1cGRhdGUiLCJyZW5kZXIiLCJyQUZpZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInJlcXVpcmVTdG9wIiwic2hvdWxkU3RvcCIsInJlbmRlcmVycyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVnaXN0ZXJSZW5kZXJpbmdHcm91cCIsInB1c2giLCJDYW52YXMyZFJlbmRlcmluZ0dyb3VwIiwiY3R4IiwicHJlc2VydmVQaXhlbFJhdGlvIiwicHJlUmVuZGVyIiwicG9zdFJlbmRlciIsInBpeGVsUmF0aW8iLCJkUFIiLCJkZXZpY2VQaXhlbFJhdGlvIiwiYlBSIiwid2Via2l0QmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsIm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJtc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJvQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyIsImJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJ2aWV3cG9ydFdpZHRoIiwidmlld3BvcnRIZWlnaHQiLCJvcmllbnRhdGlvbiIsImNhbnZhc1dpZHRoIiwiY2FudmFzSGVpZ2h0IiwiY2FudmFzIiwid2lkdGgiLCJoZWlnaHQiLCJzdHlsZSIsIm9uUmVzaXplIiwicmVuZGVyZXIiLCJ1cGRhdGVQZXJpb2QiLCJjdXJyZW50VGltZSIsImluaXQiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBTUEsSUFBTUEsT0FBTztBQUNYQyxtQkFBaUIsRUFETjs7QUFHWEMsY0FB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Q0FtQixlQUFTRCxRQUFULENBQWtCLEtBQUtOLFdBQXZCLEVBQW9DLEtBQUtDLFlBQXpDLEVBQXVELEtBQUtGLFdBQTVEO0FBQ0FRLGVBQVNHLElBQVQ7QUFDQTtBQUNBLFVBQUksS0FBSy9CLFNBQUwsQ0FBZVIsTUFBZixLQUEwQixDQUE5QixFQUNFZixLQUFLUSxZQUFMO0FBQ0g7O0FBRUQ7Ozs7Ozs7OzsyQkFNTzJDLFEsRUFBVTtBQUNmLFVBQU1JLFFBQVEsS0FBS2hDLFNBQUwsQ0FBZWlDLE9BQWYsQ0FBdUJMLFFBQXZCLENBQWQ7O0FBRUEsVUFBSUksVUFBVSxDQUFDLENBQWYsRUFBa0I7QUFDaEIsYUFBS2hDLFNBQUwsQ0FBZWtDLE1BQWYsQ0FBc0JGLEtBQXRCLEVBQTZCLENBQTdCO0FBQ0E7QUFDQSxZQUFJLEtBQUtoQyxTQUFMLENBQWVSLE1BQWYsS0FBMEIsQ0FBOUIsRUFDRWYsS0FBS3FCLFdBQUw7QUFDRjtBQUNIOzs7OztrQkFHWU0sc0IiLCJmaWxlIjoiQ2FudmFzUmVuZGVyaW5nR3JvdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJlbmRlcmluZyBsb29wIGhhbmRsaW5nIHRoZSBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBhbmQgdGhlIGB1cGRhdGVgIC9cbiAqIGByZW5kZXJgIGN5Y2xlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBsb29wID0ge1xuICByZW5kZXJpbmdHcm91cHM6IFtdLFxuXG4gIF9pc1J1bm5pbmc6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gQ3VycmVudCB0aW1lIGluIHNlY29uZHMuXG4gICAqL1xuICBnZXRUaW1lKCkge1xuICAgIHJldHVybiAwLjAwMSAqICh3aW5kb3cucGVyZm9ybWFuY2UgJiYgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA/XG4gICAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSByZW5kZXJpbmcgbG9vcCBpZiBub3Qgc3RhcnRlZC5cbiAgICovXG4gIHJlcXVpcmVTdGFydCgpIHtcbiAgICBpZiAodGhpcy5faXNSdW5uaW5nKSB7IHJldHVybjsgfVxuICAgIHRoaXMuX2lzUnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5sYXN0UmVuZGVyVGltZSA9IHRoaXMuZ2V0VGltZSgpO1xuXG4gICAgKGZ1bmN0aW9uKHNlbGYpIHtcbiAgICAgIGZ1bmN0aW9uIGxvb3AoKSB7XG4gICAgICAgIGNvbnN0IHRpbWUgPSBzZWxmLmdldFRpbWUoKTtcbiAgICAgICAgY29uc3QgZHQgPSB0aW1lIC0gc2VsZi5sYXN0UmVuZGVyVGltZTtcbiAgICAgICAgY29uc3QgcmVuZGVyaW5nR3JvdXBzID0gc2VsZi5yZW5kZXJpbmdHcm91cHM7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJpbmdHcm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZ3JvdXAgPSByZW5kZXJpbmdHcm91cHNbaV07XG4gICAgICAgICAgLy8gbGV0IHRoZSBncm91cCBoYW5kbGUgdGhlIHVwZGF0ZVBlcmlvZCBvZiBlYWNoIHJlbmRlcmVyXG4gICAgICAgICAgZ3JvdXAudXBkYXRlKHRpbWUsIGR0KTtcbiAgICAgICAgICBncm91cC5yZW5kZXIoZHQpOyAvLyBmb3J3YXJkIGBkdGAgZm9yIGBwcmVSZW5kZXJgIG1ldGhvZFxuICAgICAgICB9XG5cbiAgICAgICAgc2VsZi5sYXN0UmVuZGVyVGltZSA9IHRpbWU7XG4gICAgICAgIHNlbGYuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICB9XG5cbiAgICAgIHNlbGYuckFGaWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgfSh0aGlzKSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIGxvb3AgaWYgbm8gcmVuZGVyZXIgYXJlIHN0aWxsIHByZXNlbnQuIElmIG5vdCBhYm9ydC5cbiAgICovXG4gIHJlcXVpcmVTdG9wKCkge1xuICAgIC8vIEB0b2RvIC0gaGFuZGxlIHNldmVyYWwgcGFyYWxsZWwgZ3JvdXBzXG4gICAgbGV0IHNob3VsZFN0b3AgPSB0cnVlO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLnJlbmRlcmluZ0dyb3Vwcy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnJlbmRlcmluZ0dyb3Vwc1tpXS5yZW5kZXJlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICBzaG91bGRTdG9wID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZFN0b3ApIHtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuckFGaWQpO1xuICAgICAgdGhpcy5faXNSdW5uaW5nID0gZmFsc2U7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJpbmcgZ3JvdXAgdG8gdGhlIGxvb3AuXG4gICAqL1xuICByZWdpc3RlclJlbmRlcmluZ0dyb3VwKGdyb3VwKSB7XG4gICAgdGhpcy5yZW5kZXJpbmdHcm91cHMucHVzaChncm91cCk7XG4gIH1cbn07XG5cbi8qKlxuICogSGFuZGxlIGEgZ3JvdXAgb2YgcmVuZGVyZXJzIG9uIGEgc2luZ2xlIGZ1bGwgc2NyZWVuIGNhbnZhcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5UaGlzIGNsYXNzIGlzIGEgcHJvcGVydHkgb2ZcbiAqIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld30gc2hvdWxkIGJlIGNvbnNpZGVyZWQgcHJpdmF0ZS48L3NwYW4+XG4gKlxuICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIENhbnZhcyBjb250ZXh0IGluIHdoaWNoXG4gKiAgdGhlIHJlbmRlcmVyIHNob3VsZCBkcmF3LlxuICogQHBhcmFtIHtCb29sZWFufSBbcHJlc2VydmVQaXhlbFJhdGlvPWZhbHNlXSAtIERlZmluZSBpZiB0aGUgY2FudmFzIHNob3VsZFxuICogIHRha2UgYWNjb3VudCBvZiB0aGUgZGV2aWNlIHBpeGVsIHJhdGlvIGZvciB0aGUgZHJhd2luZy4gV2hlbiBzZXQgdG8gYHRydWVgLFxuICogIHF1YWxpdHkgaWYgZmF2b3JlZCBvdmVyIHBlcmZvcm1hbmNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgQ2FudmFzMmRSZW5kZXJpbmdHcm91cCB7XG4gIGNvbnN0cnVjdG9yKGN0eCwgcHJlc2VydmVQaXhlbFJhdGlvID0gZmFsc2UpIHtcbiAgICAvKipcbiAgICAgKiAyZCBjb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfVxuICAgICAqIEBuYW1lIGN0eFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzMmRSZW5kZXJpbmdHcm91cFxuICAgICAqL1xuICAgIHRoaXMuY3R4ID0gY3R4O1xuXG4gICAgLyoqXG4gICAgICogU3RhY2sgb2YgdGhlIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgICAqXG4gICAgICogQHR5cGUge0FycmF5PG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcj59XG4gICAgICogQG5hbWUgcmVuZGVyZXJzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXMyZFJlbmRlcmluZ0dyb3VwXG4gICAgICovXG4gICAgdGhpcy5yZW5kZXJlcnMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEhvb2tzIGV4ZWN1dGVkIGF0IHRoZSBiZWdpbm5pbmcgYW5kIGVuZCBvZiBlYWNoIHJBRiBjYWxsLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5wcmVSZW5kZXIgPSBudWxsO1xuICAgIHRoaXMucG9zdFJlbmRlciA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBQaXhlbCByYXRpbyBvZiB0aGUgZGV2aWNlLCBzZXQgdG8gMSBpZiBgZmFsc2VgLlxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbmFtZSBwaXhlbFJhdGlvXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXMyZFJlbmRlcmluZ0dyb3VwXG4gICAgICovXG4gICAgdGhpcy5waXhlbFJhdGlvID0gKGZ1bmN0aW9uKGN0eCkge1xuICAgICAgY29uc3QgZFBSID0gd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMTtcbiAgICAgIGNvbnN0IGJQUiA9IGN0eC53ZWJraXRCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICAgIGN0eC5tb3pCYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICAgIGN0eC5tc0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgY3R4Lm9CYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8XG4gICAgICAgIGN0eC5iYWNraW5nU3RvcmVQaXhlbFJhdGlvIHx8IDE7XG5cbiAgICAgIHJldHVybiBwcmVzZXJ2ZVBpeGVsUmF0aW8gPyAoZFBSIC8gYlBSKSA6IDE7XG4gICAgfSh0aGlzLmN0eCkpO1xuXG4gICAgLy8gcmVnaXN0ZXIgdGhlIGdyb3VwIGludG8gdGhlIGxvb3BcbiAgICBsb29wLnJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLiBQcm9wYWdhdGUgbmV3IGxvZ2ljYWwgYHdpZHRoYCBhbmQgYGhlaWdodGBcbiAgICogYWNjb3JkaW5nIHRvIGB0aGlzLnBpeGVsUmF0aW9gIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydEhlaWdodCAtIEhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcmllbnRhdGlvbiAtIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHBpeGVsUmF0aW8gPSB0aGlzLnBpeGVsUmF0aW87XG5cbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gdmlld3BvcnRXaWR0aCAqIHBpeGVsUmF0aW87XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSB2aWV3cG9ydEhlaWdodCAqIHBpeGVsUmF0aW87XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuXG4gICAgY3R4LmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjdHguY2FudmFzLnN0eWxlLndpZHRoID0gYCR7dmlld3BvcnRXaWR0aH1weGA7XG4gICAgY3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHt2aWV3cG9ydEhlaWdodH1weGA7XG5cbiAgICAvLyBwcm9wYWdhdGUgbG9naWNhbCBzaXplIHRvIHJlbmRlcmVyc1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5yZW5kZXJlcnNbaV0ub25SZXNpemUodGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYHVwZGF0ZWAgdG8gYWxsIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLiBUaGUgYHVwZGF0ZWAgbWV0aG9kXG4gICAqIGZvciBlYWNoIHJlbmRlcmVyIGlzIGNhbGxlZCBhY2NvcmRpbmcgdG8gdGhlaXIgdXBkYXRlIHBlcmlvZC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBDdXJyZW50IHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIERlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSBsYXN0IHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZSh0aW1lLCBkdCkge1xuICAgIGNvbnN0IHJlbmRlcmVycyA9IHRoaXMucmVuZGVyZXJzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHJlbmRlcmVyc1tpXTtcbiAgICAgIGNvbnN0IHVwZGF0ZVBlcmlvZCA9IHJlbmRlcmVyLnVwZGF0ZVBlcmlvZDtcblxuICAgICAgaWYgKHVwZGF0ZVBlcmlvZCA9PT0gMCkge1xuICAgICAgICByZW5kZXJlci51cGRhdGUoZHQpO1xuICAgICAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAocmVuZGVyZXIuY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgICAgcmVuZGVyZXIudXBkYXRlKHVwZGF0ZVBlcmlvZCk7XG4gICAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgKz0gdXBkYXRlUGVyaW9kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSBgcmVuZGVyYCB0byBhbGwgdGhlIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBEZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3RcbiAgICogIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGNhbGwuXG4gICAqL1xuICByZW5kZXIoZHQpIHtcbiAgICBjb25zdCB7IGN0eCwgcmVuZGVyZXJzIH0gPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMucHJlUmVuZGVyICE9PSBudWxsKVxuICAgICAgdGhpcy5wcmVSZW5kZXIoY3R4LCBkdCwgdGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQpO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgcmVuZGVyZXJzW2ldLnJlbmRlcihjdHgpO1xuXG4gICAgaWYgKHRoaXMucG9zdFJlbmRlciAhPT0gbnVsbClcbiAgICAgIHRoaXMucG9zdFJlbmRlcihjdHgsIGR0LCB0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgYFJlbmRlcmVyYCBpbnN0YW5jZSB0byB0aGUgZ3JvdXAuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyfSByZW5kZXJlciAtIFJlbmRlcmVyIHRvIGFkZCB0b1xuICAgKiAgdGhlIGdyb3VwLlxuICAgKi9cbiAgYWRkKHJlbmRlcmVyKSB7XG4gICAgdGhpcy5yZW5kZXJlcnMucHVzaChyZW5kZXJlcik7XG4gICAgdGhpcy5jdXJyZW50VGltZSA9IGxvb3AuZ2V0VGltZSgpO1xuICAgIC8vIHVwZGF0ZSB0aGUgY3VycmVudCB0aW1lIG9mIHRoZSByZW5kZXJlclxuICAgIHJlbmRlcmVyLmN1cnJlbnRUaW1lID0gdGhpcy5jdXJyZW50VGltZTtcbiAgICByZW5kZXJlci5waXhlbFJhdGlvID0gdGhpcy5waXhlbFJhdGlvO1xuICAgIHJlbmRlcmVyLm9uUmVzaXplKHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0LCB0aGlzLm9yaWVudGF0aW9uKTtcbiAgICByZW5kZXJlci5pbml0KCk7XG4gICAgLy8gaWYgZmlyc3QgcmVuZGVyZXIgYWRkZWQsIHN0YXJ0IHRoZSBsb29wXG4gICAgaWYgKHRoaXMucmVuZGVyZXJzLmxlbmd0aCA9PT0gMSlcbiAgICAgIGxvb3AucmVxdWlyZVN0YXJ0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgYFJlbmRlcmVyYCBpbnN0YW5jZSBmcm9tIHRoZSBncm91cC5cbiAgICpcbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUmVuZGVyZXJ9IHJlbmRlcmVyIC0gUmVuZGVyZXIgdG8gcmVtb3ZlXG4gICAqICBmcm9tIHRoZSBncm91cC5cbiAgICovXG4gIHJlbW92ZShyZW5kZXJlcikge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5yZW5kZXJlcnMuaW5kZXhPZihyZW5kZXJlcik7XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnJlbmRlcmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgLy8gaWYgbGFzdCByZW5kZXJlciByZW1vdmVkLCBzdG9wIHRoZSBsb29wXG4gICAgICBpZiAodGhpcy5yZW5kZXJlcnMubGVuZ3RoID09PSAwKVxuICAgICAgICBsb29wLnJlcXVpcmVTdG9wKCk7XG4gICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW52YXMyZFJlbmRlcmluZ0dyb3VwO1xuIl19
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
    var skipFrames = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
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

    this.frameCount = 0;
    this.frameModulo = skipFrames + 1;
    this.accumDt = 0;

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
      var accumDt = this.accumDt + dt;

      if (this.frameCount === 0) {
        var ctx = this.ctx,
            renderers = this.renderers;


        if (this.preRender !== null) this.preRender(ctx, accumDt, this.canvasWidth, this.canvasHeight);

        for (var i = 0, l = renderers.length; i < l; i++) {
          renderers[i].render(ctx);
        }if (this.postRender !== null) this.postRender(ctx, accumDt, this.canvasWidth, this.canvasHeight);

        accumDt = 0;
      }

      this.frameCount = (this.frameCount + 1) % this.frameModulo;
      this.accumDt = accumDt;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1JlbmRlcmluZ0dyb3VwLmpzIl0sIm5hbWVzIjpbImxvb3AiLCJyZW5kZXJpbmdHcm91cHMiLCJfaXNSdW5uaW5nIiwiZ2V0VGltZSIsIndpbmRvdyIsInBlcmZvcm1hbmNlIiwibm93IiwiRGF0ZSIsInJlcXVpcmVTdGFydCIsImxhc3RSZW5kZXJUaW1lIiwic2VsZiIsInRpbWUiLCJkdCIsImkiLCJsIiwibGVuZ3RoIiwiZ3JvdXAiLCJ1cGRhdGUiLCJyZW5kZXIiLCJyQUZpZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsInJlcXVpcmVTdG9wIiwic2hvdWxkU3RvcCIsInJlbmRlcmVycyIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwicmVnaXN0ZXJSZW5kZXJpbmdHcm91cCIsInB1c2giLCJDYW52YXMyZFJlbmRlcmluZ0dyb3VwIiwiY3R4IiwicHJlc2VydmVQaXhlbFJhdGlvIiwic2tpcEZyYW1lcyIsInByZVJlbmRlciIsInBvc3RSZW5kZXIiLCJwaXhlbFJhdGlvIiwiZFBSIiwiZGV2aWNlUGl4ZWxSYXRpbyIsImJQUiIsIndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJtb3pCYWNraW5nU3RvcmVQaXhlbFJhdGlvIiwibXNCYWNraW5nU3RvcmVQaXhlbFJhdGlvIiwib0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8iLCJiYWNraW5nU3RvcmVQaXhlbFJhdGlvIiwiZnJhbWVDb3VudCIsImZyYW1lTW9kdWxvIiwiYWNjdW1EdCIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsIm9yaWVudGF0aW9uIiwiY2FudmFzV2lkdGgiLCJjYW52YXNIZWlnaHQiLCJjYW52YXMiLCJ3aWR0aCIsImhlaWdodCIsInN0eWxlIiwib25SZXNpemUiLCJyZW5kZXJlciIsInVwZGF0ZVBlcmlvZCIsImN1cnJlbnRUaW1lIiwiaW5pdCIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztBQUFB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QkosR0FBaEIsRUFBcUJnQixPQUFyQixFQUE4QixLQUFLSSxXQUFuQyxFQUFnRCxLQUFLQyxZQUFyRDs7QUFFRkwsa0JBQVUsQ0FBVjtBQUNEOztBQUVELFdBQUtGLFVBQUwsR0FBa0IsQ0FBQyxLQUFLQSxVQUFMLEdBQWtCLENBQW5CLElBQXdCLEtBQUtDLFdBQS9DO0FBQ0EsV0FBS0MsT0FBTCxHQUFlQSxPQUFmO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNSVcsUSxFQUFVO0FBQ1osV0FBS2hDLFNBQUwsQ0FBZUcsSUFBZixDQUFvQjZCLFFBQXBCO0FBQ0EsV0FBS0UsV0FBTCxHQUFtQnpELEtBQUtHLE9BQUwsRUFBbkI7QUFDQTtBQUNBb0QsZUFBU0UsV0FBVCxHQUF1QixLQUFLQSxXQUE1QjtBQUNBRixlQUFTdEIsVUFBVCxHQUFzQixLQUFLQSxVQUEzQjtBQUNBc0IsZUFBU0QsUUFBVCxDQUFrQixLQUFLTixXQUF2QixFQUFvQyxLQUFLQyxZQUF6QyxFQUF1RCxLQUFLRixXQUE1RDtBQUNBUSxlQUFTRyxJQUFUO0FBQ0E7QUFDQSxVQUFJLEtBQUtuQyxTQUFMLENBQWVSLE1BQWYsS0FBMEIsQ0FBOUIsRUFDRWYsS0FBS1EsWUFBTDtBQUNIOztBQUVEOzs7Ozs7Ozs7MkJBTU8rQyxRLEVBQVU7QUFDZixVQUFNSSxRQUFRLEtBQUtwQyxTQUFMLENBQWVxQyxPQUFmLENBQXVCTCxRQUF2QixDQUFkOztBQUVBLFVBQUlJLFVBQVUsQ0FBQyxDQUFmLEVBQWtCO0FBQ2hCLGFBQUtwQyxTQUFMLENBQWVzQyxNQUFmLENBQXNCRixLQUF0QixFQUE2QixDQUE3QjtBQUNBO0FBQ0EsWUFBSSxLQUFLcEMsU0FBTCxDQUFlUixNQUFmLEtBQTBCLENBQTlCLEVBQ0VmLEtBQUtxQixXQUFMO0FBQ0g7QUFDRjs7Ozs7a0JBR1lNLHNCIiwiZmlsZSI6IkNhbnZhc1JlbmRlcmluZ0dyb3VwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZW5kZXJpbmcgbG9vcCBoYW5kbGluZyB0aGUgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgYW5kIHRoZSBgdXBkYXRlYCAvXG4gKiBgcmVuZGVyYCBjeWNsZXMuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgbG9vcCA9IHtcbiAgcmVuZGVyaW5nR3JvdXBzOiBbXSxcblxuICBfaXNSdW5uaW5nOiBmYWxzZSxcblxuICAvKipcbiAgICogQHJldHVybiB7TnVtYmVyfSAtIEN1cnJlbnQgdGltZSBpbiBzZWNvbmRzLlxuICAgKi9cbiAgZ2V0VGltZSgpIHtcbiAgICByZXR1cm4gMC4wMDEgKiAod2luZG93LnBlcmZvcm1hbmNlICYmIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgP1xuICAgICAgd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIDogbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgcmVuZGVyaW5nIGxvb3AgaWYgbm90IHN0YXJ0ZWQuXG4gICAqL1xuICByZXF1aXJlU3RhcnQoKSB7XG4gICAgaWYgKHRoaXMuX2lzUnVubmluZykgeyByZXR1cm47IH1cbiAgICB0aGlzLl9pc1J1bm5pbmcgPSB0cnVlO1xuICAgIHRoaXMubGFzdFJlbmRlclRpbWUgPSB0aGlzLmdldFRpbWUoKTtcblxuICAgIChmdW5jdGlvbihzZWxmKSB7XG4gICAgICBmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICBjb25zdCB0aW1lID0gc2VsZi5nZXRUaW1lKCk7XG4gICAgICAgIGNvbnN0IGR0ID0gdGltZSAtIHNlbGYubGFzdFJlbmRlclRpbWU7XG4gICAgICAgIGNvbnN0IHJlbmRlcmluZ0dyb3VwcyA9IHNlbGYucmVuZGVyaW5nR3JvdXBzO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVuZGVyaW5nR3JvdXBzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGdyb3VwID0gcmVuZGVyaW5nR3JvdXBzW2ldO1xuICAgICAgICAgIC8vIGxldCB0aGUgZ3JvdXAgaGFuZGxlIHRoZSB1cGRhdGVQZXJpb2Qgb2YgZWFjaCByZW5kZXJlclxuICAgICAgICAgIGdyb3VwLnVwZGF0ZSh0aW1lLCBkdCk7XG4gICAgICAgICAgZ3JvdXAucmVuZGVyKGR0KTsgLy8gZm9yd2FyZCBgZHRgIGZvciBgcHJlUmVuZGVyYCBtZXRob2RcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYubGFzdFJlbmRlclRpbWUgPSB0aW1lO1xuICAgICAgICBzZWxmLnJBRmlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgICAgfVxuXG4gICAgICBzZWxmLnJBRmlkID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH0odGhpcykpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBsb29wIGlmIG5vIHJlbmRlcmVyIGFyZSBzdGlsbCBwcmVzZW50LiBJZiBub3QgYWJvcnQuXG4gICAqL1xuICByZXF1aXJlU3RvcCgpIHtcbiAgICAvLyBAdG9kbyAtIGhhbmRsZSBzZXZlcmFsIHBhcmFsbGVsIGdyb3Vwc1xuICAgIGxldCBzaG91bGRTdG9wID0gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJpbmdHcm91cHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5yZW5kZXJpbmdHcm91cHNbaV0ucmVuZGVyZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgc2hvdWxkU3RvcCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzaG91bGRTdG9wKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLnJBRmlkKTtcbiAgICAgIHRoaXMuX2lzUnVubmluZyA9IGZhbHNlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQWRkIGEgcmVuZGVyaW5nIGdyb3VwIHRvIHRoZSBsb29wLlxuICAgKi9cbiAgcmVnaXN0ZXJSZW5kZXJpbmdHcm91cChncm91cCkge1xuICAgIHRoaXMucmVuZGVyaW5nR3JvdXBzLnB1c2goZ3JvdXApO1xuICB9XG59O1xuXG4vKipcbiAqIEhhbmRsZSBhIGdyb3VwIG9mIHJlbmRlcmVycyBvbiBhIHNpbmdsZSBmdWxsIHNjcmVlbiBjYW52YXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+VGhpcyBjbGFzcyBpcyBhIHByb3BlcnR5IG9mXG4gKiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd9IHNob3VsZCBiZSBjb25zaWRlcmVkIHByaXZhdGUuPC9zcGFuPlxuICpcbiAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBDYW52YXMgY29udGV4dCBpbiB3aGljaFxuICogIHRoZSByZW5kZXJlciBzaG91bGQgZHJhdy5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW3ByZXNlcnZlUGl4ZWxSYXRpbz1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIGNhbnZhcyBzaG91bGRcbiAqICB0YWtlIGFjY291bnQgb2YgdGhlIGRldmljZSBwaXhlbCByYXRpbyBmb3IgdGhlIGRyYXdpbmcuIFdoZW4gc2V0IHRvIGB0cnVlYCxcbiAqICBxdWFsaXR5IGlmIGZhdm9yZWQgb3ZlciBwZXJmb3JtYW5jZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIENhbnZhczJkUmVuZGVyaW5nR3JvdXAge1xuICBjb25zdHJ1Y3RvcihjdHgsIHByZXNlcnZlUGl4ZWxSYXRpbyA9IGZhbHNlLCBza2lwRnJhbWVzID0gMCkge1xuICAgIC8qKlxuICAgICAqIDJkIGNvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XG4gICAgICogQG5hbWUgY3R4XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXMyZFJlbmRlcmluZ0dyb3VwXG4gICAgICovXG4gICAgdGhpcy5jdHggPSBjdHg7XG5cbiAgICAvKipcbiAgICAgKiBTdGFjayBvZiB0aGUgcmVnaXN0ZXJlZCByZW5kZXJlcnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7QXJyYXk8bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyPn1cbiAgICAgKiBAbmFtZSByZW5kZXJlcnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhczJkUmVuZGVyaW5nR3JvdXBcbiAgICAgKi9cbiAgICB0aGlzLnJlbmRlcmVycyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogSG9va3MgZXhlY3V0ZWQgYXQgdGhlIGJlZ2lubmluZyBhbmQgZW5kIG9mIGVhY2ggckFGIGNhbGwuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnByZVJlbmRlciA9IG51bGw7XG4gICAgdGhpcy5wb3N0UmVuZGVyID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFBpeGVsIHJhdGlvIG9mIHRoZSBkZXZpY2UsIHNldCB0byAxIGlmIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIHBpeGVsUmF0aW9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhczJkUmVuZGVyaW5nR3JvdXBcbiAgICAgKi9cbiAgICB0aGlzLnBpeGVsUmF0aW8gPSAoZnVuY3Rpb24oY3R4KSB7XG4gICAgICBjb25zdCBkUFIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xuICAgICAgY29uc3QgYlBSID0gY3R4LndlYmtpdEJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgY3R4Lm1vekJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgY3R4Lm1zQmFja2luZ1N0b3JlUGl4ZWxSYXRpbyB8fFxuICAgICAgICBjdHgub0JhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHxcbiAgICAgICAgY3R4LmJhY2tpbmdTdG9yZVBpeGVsUmF0aW8gfHwgMTtcblxuICAgICAgcmV0dXJuIHByZXNlcnZlUGl4ZWxSYXRpbyA/IChkUFIgLyBiUFIpIDogMTtcbiAgICB9KHRoaXMuY3R4KSk7XG5cbiAgICB0aGlzLmZyYW1lQ291bnQgPSAwO1xuICAgIHRoaXMuZnJhbWVNb2R1bG8gPSBza2lwRnJhbWVzICsgMTtcbiAgICB0aGlzLmFjY3VtRHQgPSAwO1xuXG4gICAgLy8gcmVnaXN0ZXIgdGhlIGdyb3VwIGludG8gdGhlIGxvb3BcbiAgICBsb29wLnJlZ2lzdGVyUmVuZGVyaW5nR3JvdXAodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzLiBQcm9wYWdhdGUgbmV3IGxvZ2ljYWwgYHdpZHRoYCBhbmQgYGhlaWdodGBcbiAgICogYWNjb3JkaW5nIHRvIGB0aGlzLnBpeGVsUmF0aW9gIHRvIGFsbCByZWdpc3RlcmVkIHJlbmRlcmVycy5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydEhlaWdodCAtIEhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBvcmllbnRhdGlvbiAtIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydC5cbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuY3R4O1xuICAgIGNvbnN0IHBpeGVsUmF0aW8gPSB0aGlzLnBpeGVsUmF0aW87XG5cbiAgICB0aGlzLmNhbnZhc1dpZHRoID0gdmlld3BvcnRXaWR0aCAqIHBpeGVsUmF0aW87XG4gICAgdGhpcy5jYW52YXNIZWlnaHQgPSB2aWV3cG9ydEhlaWdodCAqIHBpeGVsUmF0aW87XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuXG4gICAgY3R4LmNhbnZhcy53aWR0aCA9IHRoaXMuY2FudmFzV2lkdGg7XG4gICAgY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLmNhbnZhc0hlaWdodDtcbiAgICBjdHguY2FudmFzLnN0eWxlLndpZHRoID0gYCR7dmlld3BvcnRXaWR0aH1weGA7XG4gICAgY3R4LmNhbnZhcy5zdHlsZS5oZWlnaHQgPSBgJHt2aWV3cG9ydEhlaWdodH1weGA7XG5cbiAgICAvLyBwcm9wYWdhdGUgbG9naWNhbCBzaXplIHRvIHJlbmRlcmVyc1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5yZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5yZW5kZXJlcnNbaV0ub25SZXNpemUodGhpcy5jYW52YXNXaWR0aCwgdGhpcy5jYW52YXNIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9wYWdhdGUgYHVwZGF0ZWAgdG8gYWxsIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLiBUaGUgYHVwZGF0ZWAgbWV0aG9kXG4gICAqIGZvciBlYWNoIHJlbmRlcmVyIGlzIGNhbGxlZCBhY2NvcmRpbmcgdG8gdGhlaXIgdXBkYXRlIHBlcmlvZC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHRpbWUgLSBDdXJyZW50IHRpbWUuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIERlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSBsYXN0IHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZSh0aW1lLCBkdCkge1xuICAgIGNvbnN0IHJlbmRlcmVycyA9IHRoaXMucmVuZGVyZXJzO1xuXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBjb25zdCByZW5kZXJlciA9IHJlbmRlcmVyc1tpXTtcbiAgICAgIGNvbnN0IHVwZGF0ZVBlcmlvZCA9IHJlbmRlcmVyLnVwZGF0ZVBlcmlvZDtcblxuICAgICAgaWYgKHVwZGF0ZVBlcmlvZCA9PT0gMCkge1xuICAgICAgICByZW5kZXJlci51cGRhdGUoZHQpO1xuICAgICAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRpbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aGlsZSAocmVuZGVyZXIuY3VycmVudFRpbWUgPCB0aW1lKSB7XG4gICAgICAgICAgcmVuZGVyZXIudXBkYXRlKHVwZGF0ZVBlcmlvZCk7XG4gICAgICAgICAgcmVuZGVyZXIuY3VycmVudFRpbWUgKz0gdXBkYXRlUGVyaW9kO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb3BhZ2F0ZSBgcmVuZGVyYCB0byBhbGwgdGhlIHJlZ2lzdGVyZWQgcmVuZGVyZXJzLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBEZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3RcbiAgICogIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgIGNhbGwuXG4gICAqL1xuICByZW5kZXIoZHQpIHtcbiAgICBsZXQgYWNjdW1EdCA9IHRoaXMuYWNjdW1EdCArIGR0O1xuXG4gICAgaWYgKHRoaXMuZnJhbWVDb3VudCA9PT0gMCkge1xuICAgICAgY29uc3QgeyBjdHgsIHJlbmRlcmVycyB9ID0gdGhpcztcblxuICAgICAgaWYgKHRoaXMucHJlUmVuZGVyICE9PSBudWxsKVxuICAgICAgICB0aGlzLnByZVJlbmRlcihjdHgsIGFjY3VtRHQsIHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDAsIGwgPSByZW5kZXJlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgICByZW5kZXJlcnNbaV0ucmVuZGVyKGN0eCk7XG5cbiAgICAgIGlmICh0aGlzLnBvc3RSZW5kZXIgIT09IG51bGwpXG4gICAgICAgIHRoaXMucG9zdFJlbmRlcihjdHgsIGFjY3VtRHQsIHRoaXMuY2FudmFzV2lkdGgsIHRoaXMuY2FudmFzSGVpZ2h0KTtcblxuICAgICAgYWNjdW1EdCA9IDA7XG4gICAgfVxuXG4gICAgdGhpcy5mcmFtZUNvdW50ID0gKHRoaXMuZnJhbWVDb3VudCArIDEpICUgdGhpcy5mcmFtZU1vZHVsbztcbiAgICB0aGlzLmFjY3VtRHQgPSBhY2N1bUR0O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgdG8gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn0gcmVuZGVyZXIgLSBSZW5kZXJlciB0byBhZGQgdG9cbiAgICogIHRoZSBncm91cC5cbiAgICovXG4gIGFkZChyZW5kZXJlcikge1xuICAgIHRoaXMucmVuZGVyZXJzLnB1c2gocmVuZGVyZXIpO1xuICAgIHRoaXMuY3VycmVudFRpbWUgPSBsb29wLmdldFRpbWUoKTtcbiAgICAvLyB1cGRhdGUgdGhlIGN1cnJlbnQgdGltZSBvZiB0aGUgcmVuZGVyZXJcbiAgICByZW5kZXJlci5jdXJyZW50VGltZSA9IHRoaXMuY3VycmVudFRpbWU7XG4gICAgcmVuZGVyZXIucGl4ZWxSYXRpbyA9IHRoaXMucGl4ZWxSYXRpbztcbiAgICByZW5kZXJlci5vblJlc2l6ZSh0aGlzLmNhbnZhc1dpZHRoLCB0aGlzLmNhbnZhc0hlaWdodCwgdGhpcy5vcmllbnRhdGlvbik7XG4gICAgcmVuZGVyZXIuaW5pdCgpO1xuICAgIC8vIGlmIGZpcnN0IHJlbmRlcmVyIGFkZGVkLCBzdGFydCB0aGUgbG9vcFxuICAgIGlmICh0aGlzLnJlbmRlcmVycy5sZW5ndGggPT09IDEpXG4gICAgICBsb29wLnJlcXVpcmVTdGFydCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGBSZW5kZXJlcmAgaW5zdGFuY2UgZnJvbSB0aGUgZ3JvdXAuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyfSByZW5kZXJlciAtIFJlbmRlcmVyIHRvIHJlbW92ZVxuICAgKiAgZnJvbSB0aGUgZ3JvdXAuXG4gICAqL1xuICByZW1vdmUocmVuZGVyZXIpIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMucmVuZGVyZXJzLmluZGV4T2YocmVuZGVyZXIpO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy5yZW5kZXJlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIC8vIGlmIGxhc3QgcmVuZGVyZXIgcmVtb3ZlZCwgc3RvcCB0aGUgbG9vcFxuICAgICAgaWYgKHRoaXMucmVuZGVyZXJzLmxlbmd0aCA9PT0gMClcbiAgICAgICAgbG9vcC5yZXF1aXJlU3RvcCgpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW52YXMyZFJlbmRlcmluZ0dyb3VwO1xuIl19
/**
 * Rendering loop handling the `requestAnimationFrame` and the `update` /
 * `render` cycles.
 *
 * @private
 */
const loop = {
  renderingGroups: [],

  _isRunning: false,

  /**
   * @return {Number} - Current time in seconds.
   */
  getTime() {
    return 0.001 * (window.performance && window.performance.now ?
      window.performance.now() : new Date().getTime());
  },

  /**
   * Start the rendering loop if not started.
   */
  requireStart() {
    if (this._isRunning) { return; }
    this._isRunning = true;
    this.lastRenderTime = this.getTime();

    (function(self) {
      function loop() {
        const time = self.getTime();
        const dt = time - self.lastRenderTime;
        const renderingGroups = self.renderingGroups;

        for (let i = 0, l = renderingGroups.length; i < l; i++) {
          const group = renderingGroups[i];
          // let the group handle the updatePeriod of each renderer
          group.update(time, dt);
          group.render(dt); // forward `dt` for `preRender` method
        }

        self.lastRenderTime = time;
        self.rAFid = requestAnimationFrame(loop);
      }

      self.rAFid = requestAnimationFrame(loop);
    }(this));
  },

  /**
   * Stop the loop if no renderer are still present. If not abort.
   */
  requireStop() {
    // @todo - handle several parallel groups
    let shouldStop = true;

    for (let i = 0, l = this.renderingGroups.length; i < l; i++) {
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
  registerRenderingGroup(group) {
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
class RenderingGroup {
  constructor(ctx, preservePixelRatio = false) {
    /**
     * 2d context of the canvas.
     *
     * @type {CanvasRenderingContext2D}
     * @name ctx
     * @instance
     * @memberof module:soundworks/client.RenderingGroup
     */
    this.ctx = ctx;

    /**
     * Stack of the registered renderers.
     *
     * @type {Array<module:soundworks/client.Renderer>}
     * @name renderers
     * @instance
     * @memberof module:soundworks/client.RenderingGroup
     */
    this.renderers = [];

    /**
     * Pixel ratio of the device, set to 1 if `false`.
     *
     * @type {Number}
     * @name pixelRatio
     * @instance
     * @memberof module:soundworks/client.RenderingGroup
     */
    this.pixelRatio = (function(ctx) {
      const dPR = window.devicePixelRatio || 1;
      const bPR = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;

      return preservePixelRatio ? (dPR / bPR) : 1;
    }(this.ctx));

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
  onResize(viewportWidth, viewportHeight, orientation) {
    const ctx = this.ctx;
    const pixelRatio = this.pixelRatio;

    this.canvasWidth = viewportWidth * pixelRatio;
    this.canvasHeight = viewportHeight * pixelRatio;

    ctx.canvas.width = this.canvasWidth;
    ctx.canvas.height = this.canvasHeight;
    ctx.canvas.style.width = `${viewportWidth}px`;
    ctx.canvas.style.height = `${viewportHeight}px`;

    // propagate logical size to renderers
    for (let i = 0, l = this.renderers.length; i < l; i++)
      this.renderers[i].onResize(this.canvasWidth, this.canvasHeight, orientation);
  }

  /**
   * Entry point to apply global transformations to the canvas before each
   * renderer is rendered.
   *
   * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
   * @param {Number} dt - Delta time in seconds since the last rendering
   *  loop (`requestAnimationFrame`).
   * @param {Number} canvasWidth - Current width of the canvas.
   * @param {Number} canvasHeight - Current height of the canvas.
   */
  preRender(ctx, dt, canvasWidth, canvasHeight) {}

  /**
   * Propagate `update` to all registered renderers. The `update` method
   * for each renderer is called according to their update period.
   *
   * @param {Number} time - Current time.
   * @param {Number} dt - Delta time in seconds since last update.
   */
  update(time, dt) {
    const renderers = this.renderers;

    for (let i = 0, l = renderers.length; i < l; i++) {
      const renderer = renderers[i];
      const updatePeriod = renderer.updatePeriod;

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
  render(dt) {
    const ctx = this.ctx;
    const renderers = this.renderers;

    this.preRender(ctx, dt, this.canvasWidth, this.canvasHeight);

    for (let i = 0, l = renderers.length; i < l; i++)
      renderers[i].render(ctx);
  }

  /**
   * Add a `Renderer` instance to the group.
   *
   * @param {module:soundworks/client.Renderer} renderer - Renderer to add to
   *  the group.
   */
  add(renderer) {
    this.renderers.push(renderer);
    this.currentTime = loop.getTime();
    // update the current time of the renderer
    renderer.currentTime = this.currentTime;
    renderer.pixelRatio = this.pixelRatio;
    renderer.onResize(this.canvasWidth, this.canvasHeight);
    renderer.init();
    // if first renderer added, start the loop
    if (this.renderers.length === 1)
      loop.requireStart();
  }

  /**
   * Remove a `Renderer` instance from the group.
   *
   * @param {module:soundworks/client.Renderer} renderer - Renderer to remove
   *  from the group.
   */
  remove(renderer) {
    const index = this.renderers.indexOf(renderer);

    if (index !== -1) {
      this.renderers.splice(index, 1);
      // if last renderer removed, stop the loop
      if (this.renderers.length === 0)
        loop.requireStop();
     }
  }
}

export default RenderingGroup;

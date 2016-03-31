/**
 * The main rendering loop handling the `requestAnimationFrame` and the `update` / `render` calls.
 * @private
 */
const loop = {
  renderingGroups: [],

  _isRunning: false,

  /**
   * @returns {Number} - The current time in seconds.
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
 * This class allow to register several renderers on a single full screen
 * canvas. Calls the `requireStart` and `requireStop` of the main rendering
 * loop when a `Renderer` instance is added or removed.
 *
 * This class should be considered as private, and is hidden into the
 * {@link module:soundworks/client.CanvasView} for most of the usecases.
 */
export default class RenderingGroup {
  /**
   * @param {CanvasRenderingContext2D} ctx - Canvas context in which
   *  the renderer should draw.
   */
  constructor(ctx) {
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
  onResize(viewportWidth, viewportHeight) {
    this.canvasWidth = viewportWidth;
    this.canvasHeight = viewportHeight;

    this.ctx.width = this.ctx.canvas.width = this.canvasWidth;
    this.ctx.height = this.ctx.canvas.height = this.canvasHeight;

    for (let i = 0, l = this.renderers.length; i < l; i++)
      this.renderers[i].onResize(viewportWidth, viewportHeight);
  }

  /**
   * Propagate the `update` to all registered renderers. The `update` method
   * for each renderer is called according to their update period.
   * @param {Number} time - Current time.
   * @param {Number} dt - Delta time in seconds since the last update.
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
   * Entry point to apply global transformations to the canvas before each
   * renderer is rendered.
   * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
   * @param {Number} dt - Delta time in seconds since the last rendering
   *  loop (`requestAnimationFrame`).
   */
  preRender(ctx, dt) {}

  /**
   * Propagate `render` method to all the registered renderers.
   * @param {Number} dt - Delta time in seconds since the last rendering
   *  loop (`requestAnimationFrame`).
   */
  render(dt) {
    const ctx = this.ctx;
    const renderers = this.renderers;

    this.preRender(ctx, dt);

    for (let i = 0, l = renderers.length; i < l; i++)
      renderers[i].render(ctx);
  }

  /**
   * Add a `Renderer` instance to the group.
   * @param {Renderer} renderer - Renderer to be added.
   */
  add(renderer) {
    this.renderers.push(renderer);
    this.currentTime = loop.getTime();
    // update the current time of the renderer
    renderer.currentTime = this.currentTime;
    renderer.onResize(this.canvasWidth, this.canvasHeight);
    renderer.init();
    // if first renderer added, start the loop
    if (this.renderers.length === 1)
      loop.requireStart();
  }

  /**
   * Remove a `Renderer` instance from the group.
   * @param {Renderer} renderer - Eenderer to remove.
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

/**
 * Base class to implement in order to be used in conjonction with a
 * [`CanvasView`]{@link module:soundworks/client.CanvasView}. These classes
 * provide altogether a clean way to manage the `update` and `render` cycles
 * of an animation.
 *
 * @memberof module:soundworks/client
 * @see module:soundworks/client.CanvasView
 */
class Renderer {
  /**
   * @param {Number} [updatePeriod=0] - Logical time (in _second_) between
   *  each subsequent update calls. If `0`, the update period is then slaved on
   *  the `requestAnimationFrame` period (which is appriopriate for most of the
   *  use-cases).
   */
  constructor(updatePeriod = 0) {
    this.updatePeriod = updatePeriod;

    /**
     * Current (logical) time of the renderer.
     * @type {Number}
     * @name currentTime
     * @instance
     * @memberof module:soundworks/client.Renderer
     * @readonly
     */
    this.currentTime = null;

    /**
     * Current width of the canvas.
     * @type {Number}
     * @name canvasWidth
     * @instance
     * @memberof module:soundworks/client.Renderer
     * @readonly
     */
    this.canvasWidth = 0;

    /**
     * Current height of the canvas.
     * @type {Number}
     * @name canvasHeight
     * @instance
     * @memberof module:soundworks/client.Renderer
     * @readonly
     */
    this.canvasHeight = 0;
  }

  /** @private */
  onResize(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  /**
   * Interface method called when the instance is added to a `CanvasView`.
   * The width and height of the canvas should be available when the method
   * is called.
   */
  init() {}

  /**
   * Interface Method to update the properties (physics, etc.) of the renderer.
   * @param {Number} dt - Logical time since the last update. If `this.updatePeriod`
   *  is equal to zero 0, `dt` is the elasped time since the last render.
   */
  update(dt) {}

  /**
   * Interface method to draw into the canvas.
   * @param {CanvasRenderingContext2D} ctx - 2d context of the canvas.
   */
  render(ctx) {}
}

export default Renderer;

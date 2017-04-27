/**
 * Base class to extend in order to be used in conjonction with a
 * [`CanvasView`]{@link module:soundworks/client.CanvasView}. These classes
 * provide altogether a clean way to manage the `update` and `render` cycles
 * of an animation.
 *
 * @param {Number} [updatePeriod=0] - Logical time (in _second_) between
 *  each subsequent updates. If `0`, the update period is slaved on the
 *  `requestAnimationFrame` period (which is appriopriate for most of the
 *  use-cases).
 *
 * @memberof module:soundworks/client
 * @see {@link module:soundworks/client.CanvasView}
 */
class Canvas2dRenderer {
  constructor(updatePeriod = 0) {
    this.updatePeriod = updatePeriod;

    /**
     * Current (logical) time of the Canvas2dRenderer.
     *
     * @type {Number}
     * @name currentTime
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderer
     * @readonly
     */
    this.currentTime = null;

    /**
     * Current width of the canvas.
     *
     * @type {Number}
     * @name canvasWidth
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderer
     * @readonly
     */
    this.canvasWidth = 0;

    /**
     * Current height of the canvas.
     *
     * @type {Number}
     * @name canvasHeight
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderer
     * @readonly
     */
    this.canvasHeight = 0;

    /**
     * Orientation of the canvas.
     *
     * @type {String}
     * @name orientation
     * @instance
     * @memberof module:soundworks/client.Canvas2dRenderer
     * @readonly
     */
    this.orientation = null;
  }

  /** @private */
  onResize(canvasWidth, canvasHeight, orientation) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.orientation = orientation;
  }

  /**
   * Interface method called when the instance is added to a `CanvasView`.
   * `this.canvasWidth` and `this.canvasHeight` should be available at this
   * point.
   */
  init() {}

  /**
   * Interface method that should host the code that updates the properties
   * of the Canvas2dRenderer (physics, etc.)
   *
   * @param {Number} dt - Logical time since the last update. If
   *  `this.updatePeriod` is equal to zero 0, `dt` is the elasped time since
   *  the last render.
   */
  update(dt) {}

  /**
   * Interface method that should host the code that draw into the canvas.
   *
   * @param {CanvasRenderingContext2D} ctx - 2d context of the canvas.
   */
  render(ctx) {}
}

export default Canvas2dRenderer;

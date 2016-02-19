/**
 * The class to extend in order to create a new canvas renderer.
 * The child classes should implement the `init`, `update` and `render` interface methods.
 */
export default class Renderer {
  /**
   * @param {Number} [updatePeriod=0] - The logical time (in second) between each subsequent update calls. If set to zero the `update` is bounded to the `render`
   */
  constructor(updatePeriod = 0) {
    this.updatePeriod = updatePeriod;
    this.currentTime = null;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
  }

  onResize(canvasWidth, canvasHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  /**
   * Interface method called when the instance is added to a `RenderingGroup` instance. Canvas width and height are available here.
   */
  init() {}

  /**
   * Interface Method to update the properties (physics, etc.) of the renderer.
   * @param {Number} dt - The logical time since the last update. If `this.updatePeriod` is equal to zero 0, `dt` is the elasped time since the last render.
   */
  update(dt) {}

  /**
   * Interface method to draw into the canvas.
   * @param {CanvasRenderingContext2D} ctx - The 2d context of the canvas.
   */
  render(ctx) {}
}

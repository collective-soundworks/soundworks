import SegmentedView from './SegmentedView';
import CanvasRenderingGroup from './CanvasRenderingGroup';


const defaultCanvasTemplate = `
  <canvas class="background"></canvas>
  <div class="foreground">
    <div class="section-top flex-middle"><%= top %></div>
    <div class="section-center flex-center"><%= center %></div>
    <div class="section-bottom flex-middle"><%= bottom %></div>
  </div>
`;

/**
 * View designed for experiences where 2d graphical rendering is needed.
 * The view is basically a `SegmentedView` with a `canvas` element in
 * the background and a set of helpers to handle the __renderers__ (objects
 * that draw something into the canvas).
 *
 * _<span class="warning">__WARNING__</span> Views should preferably by
 * created using the [`Experience#createView`]{@link module:soundworks/client.Experience#createView}
 * method._
 *
 * @param {String} template - Template of the view.
 * @param {Object} content - Object containing the variables used to populate
 *  the template. {@link module:soundworks/client.View#content}.
 * @param {Object} events - Listeners to install in the view
 *  {@link module:soundworks/client.View#events}.
 * @param {Object} options - Options of the view.
 *  {@link module:soundworks/client.View#options}.
 *
 * @memberof module:soundworks/client
 * @extends {module:soundworks/client.SegmentedView}
 *
 * @see {@link module:soundworks/client.View}
 * @see {@link module:soundworks/client.Renderer}
 */
class CanvasView extends SegmentedView {
  constructor(template, content, events, options) {
    template = template || defaultCanvasTemplate;
    options = Object.assign({
      preservePixelRatio: false,
    }, options);

    super(template, content, events, options);

    /**
     * Temporary stack the renderers when the view is not visible.
     *
     * @type {Set}
     * @name _rendererStack
     * @instance
     * @memberof module:soundworks/client.CanvasView
     * @private
     */
    this._rendererStack = new Set();

    /**
     * Flag to track the first `onRender` call.
     *
     * @type {Boolean}
     * @name _hasRenderedOnce
     * @instance
     * @memberof module:soundworks/client.CanvasView
     * @private
     */
    this._hasRenderedOnce = false;

    /**
     * Default rendering group.
     *
     * @type {module:soundworks/client.CanvasRenderingGroup}
     * @name _renderingGroup
     * @instance
     * @memberof module:soundworks/client.CanvasView
     * @private
     */
    this._renderingGroup = null;

    /**
     * Canvas DOM element to draw into.
     *
     * @type {Element}
     * @name $canvas
     * @instance
     * @memberof module:soundworks/client.$canvas
     */
    this.$canvas = null;

    /**
     * 2d context of the canvas.
     *
     * @type {CanvasRenderingContext2D}
     * @name $canvas
     * @instance
     * @memberof module:soundworks/client.$canvas
     */
    this.ctx = null;
  }

  get pixelRatio() {
    return this._renderingGroup.pixelRatio;
  }

  /** @private */
  onRender() {
    super.onRender();

    this.$canvas = this.$el.querySelector('canvas');
    this.ctx = this.$canvas.getContext('2d');

    // update the rendering group if the canvas instance has changed after a render
    if (this._renderingGroup)
      this._renderingGroup.ctx = this.ctx;

    if (!this._hasRenderedOnce) {
      const preservePixelRatio = this.options.preservePixelRatio
      this._renderingGroup = new CanvasRenderingGroup(this.ctx, preservePixelRatio);

      // prevent creating a new rendering group each time the view is re-rendered
      this._hasRenderedOnce = true;
      this.init();
    }
  }

  /**
   * Entry point called when the renderingGroup for the view is ready.
   * Basically allows to instanciate some renderers from inside the view.
   */
  init() {}

  /** @private */
  onResize(viewportWidth, viewportHeight, orientation) {
    super.onResize(viewportWidth, viewportHeight, orientation);
    this._renderingGroup.onResize(viewportWidth, viewportHeight, orientation);

    // add stacked renderers to the rendering group
    this._rendererStack.forEach((renderer) => this._renderingGroup.add(renderer));
    this._rendererStack.clear();
  }

  /**
   * Callback executed at the beginning of each `requestAnimationFrame`
   * cycle, before the execution of the renderers.
   * @callback module:soundworks/client.CanvasView~preRenderer
   *
   * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
   * @param {Number} dt - Delta time in seconds since last rendering.
   * @param {Number} canvasWidth - Current width of the canvas.
   * @param {Number} canvasHeight - Current height of the canvas.
   */
  /**
   * Register a function to execute at the beginning of each
   * `requestAnimationFrame` cycle.
   *
   * @param {module:soundworks/client.CanvasView~preRenderer} callback -
   *  Function to execute before each rendering cycle.
   */
  setPreRender(callback) {
    this._renderingGroup.preRender = callback;
  }

  /**
   * Callback executed at the end of each `requestAnimationFrame`
   * cycle, after the execution of the renderers.
   * @callback module:soundworks/client.CanvasView~postRenderer
   *
   * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
   * @param {Number} dt - Delta time in seconds since last rendering.
   * @param {Number} canvasWidth - Current width of the canvas.
   * @param {Number} canvasHeight - Current height of the canvas.
   */
  /**
   * Register a function to execute at the end of each
   * `requestAnimationFrame` cycle.
   *
   * @param {module:soundworks/client.CanvasView~postRenderer} callback -
   *  Function to execute before each rendering cycle.
   */
  setPostRender(callback) {
    this._renderingGroup.postRender = callback;
  }

  /**
   * Add a renderer to the `RenderingGroup`. The renderer is automatically
   * activated when added to the group.
   *
   * @param {module:soundworks/client.Renderer} renderer - Renderer to add.
   */
  addRenderer(renderer) {
    if (this.isVisible)
      this._renderingGroup.add(renderer);
    else
      this._rendererStack.add(renderer);
  }

  /**
   * Remove a renderer from the `RenderingGroup`. The renderer is automatically
   * disactivated when removed from the group.
   *
   * @param {module:soundworks/client.Renderer} renderer - Renderer to remove.
   */
  removeRenderer(renderer) {
    if (this.isVisible)
      this._renderingGroup.remove(renderer);
    else
      this._rendererStack.delete(renderer);
  }
}

export default CanvasView;

import SegmentedView from './SegmentedView';
import RenderingGroup from './RenderingGroup';


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
 * the background.
 *
 * @memberof module:soundworks/client
 * @extends {module:soundworks/client.SegmentedView}
 * @see {@link module:soundworks/client.View}
 * @see {@link module:soundworks/client.Renderer}
 */
class CanvasView extends SegmentedView {
  /**
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
   */
  constructor(template, content, events, options) {
    template = template || defaultCanvasTemplate;
    super(template, content, events, options);

    /**
     * Temporary stack the renderers when the view is not visible.
     * @type {Set}
     */
    this._rendererStack = new Set();
  }

  onRender() {
    super.onRender();

    /**
     * The canvas element to draw into.
     * @type {Element}
     */
    this.$canvas = this.$el.querySelector('canvas');

    /**
     * The 2d context of the canvas.
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = this.$canvas.getContext('2d');

    /**
     * The default rendering group.
     * @type {RenderingGroup}
     * @private
     */
    this._renderingGroup = new RenderingGroup(this.ctx);
  }

  onResize(viewportWidth, viewportHeight, orientation) {
    super.onResize(viewportWidth, viewportHeight, orientation);
    this._renderingGroup.onResize(viewportWidth, viewportHeight);

    // add stacked renderers to the rendering group
    this._rendererStack.forEach((renderer) => this._renderingGroup.add(renderer));
    this._rendererStack.clear();
  }

  /**
   * @callback module:soundworks/client.CanvasView~preRenderer
   * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
   * @param {Number} dt - Delta time in seconds since the last rendering cycle.
   */
  /**
   * Defines a function to be executed before all
   * [`Renderer#render`]{@link module:soundworks/client.Renderer#render}
   * at each cycle.
   * @param {module:soundworks/client.CanvasView~preRenderer} callback - Function
   *  to execute before aech rendering cycle.
   */
  setPreRender(callback) {
    this._renderingGroup.preRender = callback.bind(this._renderingGroup);
  }

  /**
   * Add a renderer to the `RenderingGroup`. The renderer is automatically
   * activated when added to the group.
   * @param {module:soundworks/client.Renderer} renderer - Renderer to add.
   */
  addRenderer(renderer) {
    if (this.isVisible)
      this._renderingGroup.add(renderer);
    else
      this._rendererStack.add(renderer);
  }

  /**
   * Add a renderer to the `RenderingGroup`. The renderer is automatically
   * disactivated when removed from the group.
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

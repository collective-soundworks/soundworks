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
 * A `SegmentedView` with a `canvas` element in the background. This view should mainly be used in preformances.
 */
export default class CanvasView extends SegmentedView {
  constructor(template, content, events, options) {
    template = template || defaultCanvasTemplate;
    super(template, content, events, options);
  }

  onRender() {
    super.onRender();

    /**
     * The canvas element to draw into
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
     */
    this._renderingGroup = new RenderingGroup(this.ctx);
  }

  onResize(viewportWidth, viewportHeight, orientation) {
    super.onResize(viewportWidth, viewportHeight, orientation);
    this._renderingGroup.onResize(viewportWidth, viewportHeight);
  }

  /**
   * Overrides the `preRender` interface method of the default `RenderingGroup` of the view. cf. @link `RenderingGroup~prerender`
   * @param {Function} callback - The function to use as a pre-render method.
   */
  setPreRender(callback) {
    this._renderingGroup.preRender = callback.bind(this._renderingGroup);
  }

  /**
   * Add a renderer to the `RenderingGroup`. The renderer is automaticcaly activated when added to the group.
   * @param {Renderer} renderer - The renderer to add.
   */
  addRenderer(renderer) {
    this._renderingGroup.add(renderer);
  }

  /**
   * Add a renderer to the `RenderingGroup`. The renderer is automaticcaly disactivated when removed from the group.
   * @param {Renderer} renderer - The renderer to remove.
   */
  removeRenderer(renderer) {
    this._renderingGroup.remove(renderer);
  }
}

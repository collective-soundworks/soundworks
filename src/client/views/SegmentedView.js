import View from './View';

const defaultTemplate = `
  <div class="section-top flex-middle"><p><%= top %></p></div>
  <div class="section-center flex-center"><p><%= center %></p></div>
  <div class="section-bottom flex-middle"><p><%= bottom %></p></div>
`;

/**
 * Create views which keep defined vertical ratios among elements. These ratios
 * are kept between the different parts in portrait and landscape orientation.
 * The default Segmented view defines a layout with 3 verticals parts.
 *
 * Others ratios can be defined by creating a new template and defining the
 * ratios of the different elements by overriding the `ratio` option.
 * The sum of all the ratios should be equal to 1.
 *
 * _<span class="warning">__WARNING__</span> Views should preferably by
 * created using {@link module:soundworks/client.Experience#createView}._
 *
 * @param {String} template - Template of the view.
 * @param {Object} content - Object containing the variables used to populate
 *  the template. {@link module:soundworks/client.View#content}.
 * @param {Object} events - Event listeners to install to the view
 *  {@link module:soundworks/client.View#events}.
 * @param {Object} options - Options of the view.
 *  {@link module:soundworks/client.View#options}.
 *
 * @memberof module:soundworks/client
 * @extends {module:soundworks/client.View}
 */
class SegmentedView extends View {
  constructor(template, content = {}, events = {}, options = {}) {
    // fallback on default template if `template = null`
    template = !template ? defaultTemplate : template;
    super(template, content, events, options);

    /**
     * Object associating selectors as defined in the given template associated
     * with their vertical ratio, the ratio is applyed in both 'portrait' and
     * 'landscape' orientation.
     *
     * @type {Object<String:Number>}
     * @name ratios
     * @instance
     * @memberof module:soundworks/client.SegmentedView
     */
    this.ratios = options.ratios || {
      '.section-top': 0.3,
      '.section-center': 0.5,
      '.section-bottom': 0.2,
    };

    /**
     * An object containing selectors defined in the template associated
     * with their vertical ratio, the ratio is applyed in both 'portrait'
     * and 'landscape' orientation.
     *
     * @type {Object<String:Element>}
     * @name ratios
     * @instance
     * @memberof module:soundworks/client.SegmentedView
     * @private
     */
    this._$sections = {};
  }

  /** @private */
  onRender() {
    Object.keys(this.ratios).forEach((sel) => {
      const $el = this.$el.querySelector(sel);

      if ($el === null)
        throw new Error(`Unknow selector "${sel}"`);

      this._$sections[sel] = $el;
    });
  }

  /** @private */
  onResize(width, height, orientation) {
    super.onResize(width, height, orientation);

    for (let sel in this.ratios) {
      const ratio = this.ratios[sel];
      const $el = this._$sections[sel];

      $el.style.minHeight = `${ratio * height}px`;
    }
  }
}

export default SegmentedView;

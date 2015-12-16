import View from './View';

const defaultTemplate = `
  <div class="section-top flex-middle"><%= top %></div>
  <div class="section-center flex-center"><%= center %></div>
  <div class="section-bottom flex-middle"><%= bottom %></div>
`;

/**
 * [client] - This constructor allow to create views which define vertical ratios among elements.
 * The ratios between the different parts are kept in protrait or landscape orientation.
 */
export default class SegmentedView extends View {
  constructor(template, content = {}, events = {}, options = {}) {
    // fallback on default template if `template = null`
    template = !template ? defaultTemplate : template;
    super(template, content, events, options);

    /**
     * An object containing selectors defined in the template associated with their vertical ratio, the ratio is applyed in both 'portrait' and 'landscape' orientation.
     * @type {Object<String:Number>}
     */
    this.ratios = options.ratios || {
      '.section-top': 0.3,
      '.section-center': 0.5,
      '.section-bottom': 0.2,
    };

    this._$sections = {};
  }

  onRender() {
    Object.keys(this.ratios).forEach((sel) => {
      const $el = this.$el.querySelector(sel);
      this._$sections[sel] = $el;
    });
  }

  onResize(orientation, width, height) {
    super.onResize(orientation, width, height);

    for (let sel in this.ratios) {
      const ratio = this.ratios[sel];
      const $el = this._$sections[sel];

      $el.style.height = `${ratio * height}px`;
    }
  }
}

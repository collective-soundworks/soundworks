import tmpl from 'lodash.template';
import viewport from './viewport';

/**
 * [client] - View.
 *
 * @todo
 */
export default class View {
  constructor(template, content = {}, events = {}, options = {}) {
    /**
     * A function created from the given `template`, to be called with `content` object.
     * @type {Function}
     */
    this.tmpl = tmpl(template);

    /**
     * Data to be used in order to populate the template.
     * @type {Object}
     */
    this.content = content;

    /**
     * Events to attach to the view. Each entry follows the convention:
     * `'eventName [cssSelector]': callbackFunction`
     * @type {Object}
     */
    this.events = events;

    /**
     * Orientation of the view ('portrait'|'landscape')
     * @type {String}
     */
    this.orientation = null;

    this.options = Object.assign({
      el: 'div',
      id: null,
      className: null,
    }, options);

    /**
     * The container element of the view. Defaults to `<div>`.
     * @type {Element}
     */
    this.$el = document.createElement(this.options.el);
    // listen viewport
    this.onResize = this.onResize.bind(this);
    viewport.on('resize', this.onResize);
  }

  /**
   * Render the view according to the given template and content.
   * @return {Element}
   */
  render() {
    const options = this.options;

    if (options.id) { this.$el.id = options.id; }

    if (options.className) {
      const classes = typeof options.className === 'string' ?
        [options.className] : options.className;

      classes.forEach(className => this.$el.classList.add(className));
    }

    const html = this.tmpl(this.content);
    this.$el.innerHTML = html;

    this.onRender();
    this._delegateEvents();
    return this.$el;
  }

  /**
   * Entry point for custom behavior (install plugin, ...) when the DOM of the view is ready.
   */
  onRender() {}

  /**
   * Remove events listeners and remove the view from it's container. Is automatically called in `Module~done`.
   */
  remove() {
    this._undelegateEvents();
    this.$el.parentNode.removeChild(this.$el);
  }

  /**
   * Callback for `viewport.resize` event. Maintain `$el` in sync with the viewport.
   * @param {String} orientation - The orientation of the viewport ('portrait'|'landscape')
   * @param {Number} width - The width of the viewport in pixels.
   * @param {Number} height - The height of the viewport in pixels.
   */
  onResize(orientation, width, height) {
    this.orientation = orientation;
    this.$el.classList.remove('portrait', 'landscape');
    this.$el.classList.add(orientation);
    this.$el.style.width = `${width}px`;
    this.$el.style.height = `${height}px`;
  }

  /**
   * Allow to install events after instanciation.
   * @param {Object} events - An object of events mimicing the Backbone's syntax.
   */
  installEvents(events, override = false) {
    this.events = override ? events : Object.assign(this.events, events);
    this._delegateEvents();
  }

  _delegateEvents() {
    for (let key in this.events) {
      const [event, selector] = key.split(/ +/);
      const callback = this.events[key];
      const $targets = !selector ? [this.$el] : this.$el.querySelectorAll(selector);

      Array.from($targets).forEach(($target) => {
        // don't add a listener twice, if render is called several times
        $target.removeEventListener(event, callback, false);
        $target.addEventListener(event, callback, false);
      });
    }
  }

  _undelegateEvents() {
    for (let key in this.events) {
      const [event, selector] = key.split(/ +/);
      const callback = this.events[key];
      const $targets = !selector ? [this.$el] : this.$el.querySelectorAll(selector);

      Array.from($targets).forEach(($target) => {
        $target.removeEventListener(event, callback, false);
      });
    }
  }
}
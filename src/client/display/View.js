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
     * Options of the View.
     * @type {Object}
     */
    this.options = Object.assign({
      el: 'div',
      id: null,
      className: null,
    }, options);

    /**
     * Priority of the view.
     * @type {Number}
     */
    this.priority = this.options.priority;

    /**
     * Orientation of the view ('portrait'|'landscape')
     * @type {String}
     */
    this.orientation = null;

    /**
     *
     */
    this.isVisible = false;

    this._components = {};

    /**
     * The container element of the view. Defaults to `<div>`.
     * @type {Element}
     */
    this.$el = document.createElement(this.options.el);

    this.onResize = this.onResize.bind(this);
  }

  /**
   * Add a compound view inside the current view.
   * @param {String} selector - A css selector matching an element of the template.
   * @param {View} view - The view to insert inside the selector.
   */
  setViewComponent(selector, view = null) {
    const prevView = this._components[selector];
    if (prevView instanceof View) { prevView.remove(); }

    if (view === null) {
      delete this._components[selector];
    } else {
      this._components[selector] = view;
    }
  }

  _executeViewComponentMethod(method) {
    for (let selector in this._components) {
      const view = this._components[selector];
      view[method]();
    }
  }


  _renderPartial(selector) {
    const $componentContainer = this.$el.querySelector(selector);
    const component = this._components[selector];
    $componentContainer.innerHTML = '';

    if (component) {
      component.render();
      component.appendTo($componentContainer);
      component.onRender();

      if (this.isVisible)
        component.onShow();
    } else {
      const html = this.tmpl(this.content);
      const $dummy = document.createElement('div');
      $dummy.innerHTML = html;
      $componentContainer.innerHTML = $dummy.querySelector(selector).innerHTML;
    }
  }

  _renderAll() {
    const options = this.options;

    if (options.id) { this.$el.id = options.id; }

    if (options.className) {
      const classes = typeof options.className === 'string' ?
        [options.className] : options.className;

      classes.forEach(className => this.$el.classList.add(className));
    }

    // if rerender, uninstall events before recreating the DOM
    this._undelegateEvents();

    const html = this.tmpl(this.content);
    this.$el.innerHTML = html;
    // must resize before child component
    this.onRender();
    viewport.addListener('resize', this.onResize);

    for (let selector in this._components)
      this._renderPartial(selector);

    this._delegateEvents();
  }

  /**
   * Render the view according to the given template and content.
   * @return {Element}
   */
  render(selector = null) {
    if (selector !== null) {
      this._renderPartial(selector);
    } else {
      this._renderAll();
    }
  }

  /**
   * Insert the view (`this.$el`) into the given element. Call `View~onShow` when done.
   * @param {Element} $parent - The element where the view should be inserted.
   */
  appendTo($parent) {
    this.$parent = $parent;
    $parent.appendChild(this.$el);
  }

  /**
   * Remove events listeners and remove the view from it's container. Is automatically called in `Module~done`.
   */
  remove() {
    this._executeViewComponentMethod('remove');

    this._undelegateEvents();
    this.$parent.removeChild(this.$el);

    viewport.removeListener('resize', this.onResize);

    this.isVisible = false;
  }

  /**
   * Hide the view.
   */
  hide() {
    this.$el.style.display = 'none';
    this.isVisible = false;

  }

  /**
   * Show the view.
   */
  show() {
    this.$el.style.display = 'block';
    this.isVisible = true;
    // parent must be in the DOM

    this._executeViewComponentMethod('onShow');
    this.onShow();
  }

  /**
   * Entry point for custom behavior (install plugin, ...) when the DOM of the view is ready.
   */
  onRender() {}

  /**
   * Entry point for custom behavior when the view is inserted into the DOM.
   */
  onShow() {}

  /**
   * Callback for `viewport.resize` event. Maintain `$el` in sync with the viewport.
   * @param {String} orientation - The orientation of the viewport ('portrait'|'landscape')
   * @param {Number} viewportWidth - The width of the viewport in pixels.
   * @param {Number} viewportHeight - The height of the viewport in pixels.
   */
  onResize(orientation, viewportWidth, viewportHeight) {
    this.orientation = orientation;
    this.$el.classList.remove('portrait', 'landscape');
    this.$el.classList.add(orientation);
    this.$el.style.width = `${viewportWidth}px`;
    this.$el.style.height = `${viewportHeight}px`;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
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
    this._executeViewComponentMethod('_delegateEvents');

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
    this._executeViewComponentMethod('_undelegateEvents');

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

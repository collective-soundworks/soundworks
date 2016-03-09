import tmpl from 'lodash.template';
import viewport from './viewport';
import Delegate from 'dom-delegate';


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
      priority: 0,
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
     * Defines if the view is visible or not.
     * @private
     */
    this.isVisible = false;

    /**
     * Store the components (sub-views) of the view.
     * @private
     */
    this._components = {};

    /**
     * reformatting of `this.events` for event delegation internal use.
     * @private
     */
    this._events = {};

    /**
     * The container element of the view. Defaults to `<div>`.
     * @type {Element}
     */
    this.$el = document.createElement(this.options.el);

    this._delegate = new Delegate(this.$el);
    this.onResize = this.onResize.bind(this);

    this.installEvents(this.events, false);
  }

  /**
   * Add or remove a compound view inside the current view.
   * @param {String} selector - A css selector matching an element of the template.
   * @param {View} [view=null] - The view to insert inside the selector. If set
   *  to `null` destroy the component.
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

  /**
   * Execute a method on all the `components` (sub-views).
   * @param {String} method - The name of the method to be executed.
   */
  _executeViewComponentMethod(method, ...args) {
    for (let selector in this._components) {
      const view = this._components[selector];
      view[method](...args);
    }
  }

  /**
   * Render partially the view according to the given selector. If the selector
   * is associated to a `component` (sub-views), the `component` is rendered.
   * @param {String} selector - A css selector matching an element of the view.
   */
  _renderPartial(selector) {
    const $componentContainer = this.$el.querySelector(selector);
    const component = this._components[selector];
    $componentContainer.innerHTML = '';

    if (component) {
      component.render();
      component.appendTo($componentContainer);
      component.onRender();

      if (this.isVisible)
        component.show();
      else
        component.hide();
    } else {
      const html = this.tmpl(this.content);
      const $tmp = document.createElement('div');
      $tmp.innerHTML = html;
      $componentContainer.innerHTML = $tmp.querySelector(selector).innerHTML;
      this.onRender();
    }
  }

  /**
   * Render the whole view and its component (sub-views).
   */
  _renderAll() {
    const options = this.options;
    // set id of the container id given
    if (options.id)
      this.$el.id = options.id;
    // set classes of the container if given
    if (options.className) {
      const className = options.className;
      const classes = typeof className === 'string' ? [className] : className;
      this.$el.classList.add(...classes);
    }

    // render template and insert it in the main element
    const html = this.tmpl(this.content);
    this.$el.innerHTML = html;
    this.onRender();

    for (let selector in this._components)
      this._renderPartial(selector);
  }

  // LIFE CYCLE METHODS ----------------------------------

  /**
   * Render the view according to the given template and content.
   * @param {String} [selector=null] - If specified render only the part of the
   *  view inside the matched element, if this element contains a component
   *  (sub-view), the component is rendered. Render all the view otherwise.
   * @return {Element}
   */
  render(selector = null) {
    if (selector !== null)
      this._renderPartial(selector);
    else
      this._renderAll();

    if (this.isVisible)
      this.onResize(viewport.width, viewport.height, viewport.orientation, true);
  }

  /**
   * Insert the view (`this.$el`) into the given element. Call `View~onShow` when done.
   * @param {Element} $parent - The element inside which the view is inserted.
   * @private
   */
  appendTo($parent) {
    this.$parent = $parent;
    $parent.appendChild(this.$el);
  }

  /**
   * Show the view .
   * @private - this method should only be used by the `viewManager`
   */
  show() {
    this.$el.style.display = 'block';
    this.isVisible = true;
    // must resize before child component
    this._delegateEvents();
    viewport.addResizeListener(this.onResize);

    this._executeViewComponentMethod('show');
  }

  /**
   * Hide the view and uninstall events.
   * @private - this method should only be used by the `viewManager`
   */
  hide() {
    this.$el.style.display = 'none';
    this.isVisible = false;

    this._undelegateEvents();
    viewport.removeResizeListener(this.onResize);

    this._executeViewComponentMethod('hide');
  }

  /**
   * Remove events listeners and remove the view from it's container.
   * @private - this method should only be used by the `viewManager`
   */
  remove() {
    this.hide();
    this.$el.remove();
    // this.$parent.removeChild(this.$el);
    this._executeViewComponentMethod('remove');
  }


  /**
   * Entry point when the DOM is ready. Is mainly exposed to cache some element.
   */
  onRender() {}

  /**
   * Callback for `viewport.resize` event. Maintain `$el` in sync with the viewport.
   * @param {String} orientation - The orientation of the viewport ('portrait'|'landscape')
   * @param {Number} viewportWidth - The width of the viewport in pixels.
   * @param {Number} viewportHeight - The height of the viewport in pixels.
   * @todo - move `orientation` to third argument
   * @todo - rename to `resize`
   */
  onResize(viewportWidth, viewportHeight, orientation, propagate = false) {
    this.$el.style.width = `${viewportWidth}px`;
    this.$el.style.height = `${viewportHeight}px`;
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;

    this.orientation = orientation;
    this.$el.classList.remove('portrait', 'landscape');
    this.$el.classList.add(orientation);
    // do not propagate to component as they are listening viewport's event too.
    if (propagate)
      this._executeViewComponentMethod('onResize', viewportWidth, viewportHeight, orientation);
  }

  // EVENTS ----------------------------------------

  /**
   * Allow to install events after instanciation.
   * @param {Object} events - An object of events mimicing the Backbone's syntax.
   * @param {Object} [averride=false] - If set true, replace the previous events
   *  with the ones given.
   */
  installEvents(events, override = false) {
    if (this.isVisible)
      this._undelegateEvents();

    this.events = override ? events : Object.assign(this.events, events);

    if (this.isVisible)
      this._delegateEvents();
  }

  /**
   * Add event listeners according to `this.events` object (which should
   * follow the Backbone's event syntax)
   */
  _delegateEvents() {
    // this._executeViewComponentMethod('_delegateEvents');
    for (let key in this.events) {
      const [event, selector] = key.split(/ +/);
      const callback = this.events[key];

      this._delegate.on(event, selector || null, callback);
    }
  }

  /**
   * Remove event listeners according to `this.events` object (which should
   * follow the Backbone's event syntax)
   */
  _undelegateEvents() {
    // this._executeViewComponentMethod('_undelegateEvents');
    this._delegate.off();
  }
}

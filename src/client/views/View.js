import tmpl from 'lodash.template';
import viewport from './viewport';
import Delegate from 'dom-delegate';

/**
 * Base class for the views.
 *
 * @memberof module:soundworks/client
 */
class View {
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
  constructor(template, content = {}, events = {}, options = {}) {
    /**
     * A function created from the given `template`, to be called with `content` object.
     * @type {Function}
     * @private
     */
    this.tmpl = tmpl(template);

    /**
     * Data to be used in order to populate the variables of the template.
     * @type {Object}
     * @name content
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.content = content;

    /**
     * Events to attach to the view. Each entry must follow the convention:
     * `'eventName [cssSelector]': callbackFunction`
     * @type {Object}
     * @name events
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.events = events;

    /**
     * Options of the View.
     * @type {Object}
     * @property {String} [el='div'] - String to be used as argument of
     *  `document.createElement` to create the container of the view (`this.$el`).
     * @property {String} [id=null] - String to used as the `id` of `this.$el`.
     * @property {Array<String>} [className=null] - Array of class to apply to
     *  `this.$el`.
     * @property {Array<String>} [priority=0] - Priority of the view, the view
     *  manager use this value to decide which view should be displayed first.
     * @name options
     * @instance
     * @memberof module:soundworks/client.View
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
     * @name priority
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.priority = this.options.priority;

    /**
     * Orientation of the view ('portrait'|'landscape')
     * @type {String}
     * @name orientation
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.orientation = null;

    /**
     * Indicates whether the view is currently visible or not.
     * @type {Boolean}
     * @name isVisible
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.isVisible = false;

    /**
     * If the view is a component, pointer to the parent view.
     * @type {module:soundworks/client.View}
     * @name parentView
     * @default null
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.parentView = null;

    /**
     * The container element of the view. Defaults to `<div>`.
     * @type {Element}
     * @name $el
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.$el = document.createElement(this.options.el);

    /**
     * Store the components (sub-views) of the view.
     * @private
     */
    this._components = {};

    this._delegate = new Delegate(this.$el);
    this.onResize = this.onResize.bind(this);

    this.installEvents(this.events, false);
  }

  /**
   * Add or remove a compound view inside the current view.
   * @param {String} selector - Css selector matching an element of the template.
   * @param {View} [view=null] - View to insert inside the selector. If `null`
   *  destroy the component.
   */
  setViewComponent(selector, view = null) {
    const prevView = this._components[selector];
    if (prevView instanceof View) { prevView.remove(); }

    if (view === null) {
      delete this._components[selector];
    } else {
      this._components[selector] = view;
      view.setParentView(this);
    }
  }

  /**
   * Sets the parent when is a component view.
   * @param {View} view - Parent view.
   *
   */
  setParentView(view) {
    this.parentView = view;
  }

  /**
   * Execute a method on all the `components` (sub-views).
   * @param {String} method - The name of the method to be executed.
   * @param {...Mixed} args - Arguments for the given method.
   * @private
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
   * @param {String} selector - Css selector matching an element of the view.
   * @private
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
   * @private
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
   * @param {String} [selector=null] - If not `null`, renders only the part of
   *  the view inside the matched element, if this element contains a component
   *  (sub-view), the component is rendered. Otherwise, render all the view .
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
   * Insert the view (`this.$el`) into the given element.
   * @param {Element} $parent - Element inside which the view must be inserted.
   * @private
   */
  appendTo($parent) {
    this.$parent = $parent;
    $parent.appendChild(this.$el);
  }

  /**
   * Show the view. This method should only be used by the `viewManager`.
   * @private
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
   * Hide the view and uninstall events. This method should only be used by
   * the `viewManager`.
   * @private
   */
  hide() {
    this.$el.style.display = 'none';
    this.isVisible = false;

    this._undelegateEvents();
    viewport.removeResizeListener(this.onResize);

    this._executeViewComponentMethod('hide');
  }

  /**
   * Cleanly remove the view from it's container. This method should only be
   * used by the `viewManager`.
   * @private
   */
  remove() {
    this.hide();
    this.$el.remove();
    this._executeViewComponentMethod('remove');
  }

  /**
   * Entry point when the DOM is created, is mainly exposed to cache some DOM
   * elements.
   */
  onRender() {}

  /**
   * Callback for `viewport.resize` event, it maintains `this.$el` size
   * to fit with the viewport size. The method is also called once when the
   * view is actually inserted in the DOM.
   *
   * @param {Number} viewportWidth - Width of the viewport _(in pixels)_.
   * @param {Number} viewportHeight - Height of the viewport _(in pixels)_.
   * @param {String} orientation - Orientation of the viewport.
   * @see {@link module:soundworks/client.viewport}
   */
  onResize(viewportWidth, viewportHeight, orientation, propagate = false) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.orientation = orientation;

    this.$el.style.width = `${viewportWidth}px`;
    this.$el.style.height = `${viewportHeight}px`;
    this.$el.classList.remove('portrait', 'landscape');
    this.$el.classList.add(orientation);

    if (propagate)
      this._executeViewComponentMethod('onResize', viewportWidth, viewportHeight, orientation);
  }

  // EVENTS ----------------------------------------

  /**
   * Install events on the view at any moment of its lifecycle.
   * @param {Object<String, Function>} events - An object of events.
   * @param {Boolean} [override=false] - Defines whether the previous events
   *  are replaced with the new ones.
   */
  installEvents(events, override = false) {
    if (this.isVisible)
      this._undelegateEvents();

    this.events = override ? events : Object.assign(this.events, events);

    if (this.isVisible)
      this._delegateEvents();
  }

  /**
   * Add event listeners on the view.
   * @todo - remove delegation ?
   * @private
   */
  _delegateEvents() {
    for (let key in this.events) {
      const [event, selector] = key.split(/ +/);
      const callback = this.events[key];

      this._delegate.on(event, selector || null, callback);
    }
  }

  /**
   * Remove event listeners from the view.
   * @todo - remove delegation ?
   * @private
   */
  _undelegateEvents() {
    this._delegate.off();
  }
}

export default View;

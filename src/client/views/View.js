import tmpl from 'lodash.template';
import viewport from './viewport';
import Delegate from 'dom-delegate';

/**
 * Interface required to create a soundworks compatible view.
 *
 * To comply with the soundwork's internal view system (cf. viewManager) any
 * view should implement an interface composed of 2 methods: `render` and `remove`
 *
 * @memberof module:soundworks/client
 * @interface AbstractView
 * @abstract
 *
 * @example
 * // minimal implementation of a soundworks compliant view
 * class MyView {
 *   constructor(text) {
 *     this.msg = msg;
 *     this.$el = document.createElement('div');
 *   }
 *
 *   render() {
 *     this.$el.innerHTML = `<h1>${this.msg}</h1>`;
 *     return this.$el;
 *   }
 *
 *   remove() {
 *     this.$el.remove();
 *   }
 * }
 */
/**
 * Method called when the view has to be updated. The returned DOM element
 * should contain the whole view content and should not be mutated during the
 * whole lifecycle of the view.
 *
 * @name render
 * @memberof module:soundworks/client.AbstractView
 * @function
 * @abstract
 * @instance
 *
 * @return {Element} - immutable DOM element containing the view.
 */
/**
 * Method called when the view is removed in the DOM by the `viewManager`.
 *
 * @name remove
 * @memberof module:soundworks/client.AbstractView
 * @function
 * @abstract
 * @instance
 */

/**
 * Base class for views.
 *
 * _<span class="warning">__WARNING__</span> Views should be created using
 * {@link module:soundworks/client.Activity#createView} method._
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
 */
class View {
  constructor(template, model = {}, events = {}, options = {}) {
    /**
     * Function created from the given `template`, to be executed with the
     * `content` object.
     *
     * @type {Function}
     * @name tmpl
     * @instance
     * @memberof module:soundworks/client.View
     * @private
     */
    this._tmpl = tmpl(template);

    /**
     * Data used to populate variables defined in the template.
     *
     * @type {Object}
     * @name content
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.model = model; // model

    /**
     * Events to attach to the view. The key / value pairs must follow the
     * convention: `'eventName [cssSelector]': callbackFunction`
     *
     * @type {Object}
     * @name events
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.events = events;

    /**
     * Options of the View.
     *
     * @type {Object}
     * @property {String} [el='div'] - Type of DOM element of the main container
     *  of the view. Basically the argument of `document.createElement`.
     * @property {String} [id=null] - Id of the main container.
     * @property {Array<String>} [className=null] - Classes of the main container.
     * @property {Array<String>} [priority=0] - Priority of the view. This value
     *  is used by the `viewManager` to define which view should appear first.
     * @name options
     * @instance
     * @memberof module:soundworks/client.View
     *
     * @see {@link module:soundworks/client.view#$el}
     * @see {@link module:soundworks/client.viewManager}
     */
    this.options = Object.assign({
      el: 'div',
      id: null,
      className: null,
    }, options);

    /**
     * Viewport width.
     *
     * @type {Number}
     * @name viewWidth
     * @instance
     * @memberof module:soundworks/client.View
     * @see {@link module:soundworks/client.viewport}
     */
    this.viewportWidth = null;

    /**
     * Viewport height.
     *
     * @type {Number}
     * @name viewWidth
     * @instance
     * @memberof module:soundworks/client.View
     * @see {@link module:soundworks/client.viewport}
     */
    this.viewportHeight = null;

    /**
     * Orientation of the view ('portrait'|'landscape')
     *
     * @type {String}
     * @name orientation
     * @instance
     * @memberof module:soundworks/client.View
     * @see {@link module:soundworks/client.viewport}
     */
    this.orientation = null;

    /**
     * Indicates if the view is visible or not.
     *
     * @type {Boolean}
     * @name isVisible
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.isVisible = false;

    /**
     * DOM element of the main container of the view. Defaults to `<div>`.
     *
     * @type {Element}
     * @name $el
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.$el = document.createElement(this.options.el);

    // initialize event delegation
    this._delegate = new Delegate(this.$el);
    this.onResize = this.onResize.bind(this);

    this.installEvents(this.events, false);
  }

  set template(template) {
    this._tmpl = tmpl(template);
  }

  appendTo($container) {
    $container.appendChild(this.$el);
  }

  /**
   * Partially re-render the view according to the given selector. If the
   * selector is associated to a `component`, the `component` is rendered.
   *
   * @param {String} selector - Css selector of the element to render. The
   *  element itself is not updated, only its content.
   * @private
   */
  _renderPartial(selector) {
    const $container = this.$el.querySelector(selector);

    if ($container === null)
      throw new Error(`selector ${selector} doesn't match any element`);

    const html = this._tmpl(this.model);
    const $tmp = document.createElement('div');

    $tmp.innerHTML = html;
    $container.innerHTML = $tmp.querySelector(selector).innerHTML;
    this.onRender();
  }

  /**
   * Render the whole view and its components.
   *
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
    const html = this._tmpl(this.model);
    this.$el.innerHTML = html;
    this.onRender();
  }

  // LIFE CYCLE METHODS ----------------------------------

  /**
   * Render the view according to the given template and content.
   *
   * @param {String} [selector=null] - If not `null`, renders only the part of
   *  the view inside the matched element. If this element contains a component
   *  (sub-view), the component is rendered. Render the whole view otherwise.
   */
  render(selector = null) {
    if (selector !== null)
      this._renderPartial(selector);
    else
      this._renderAll();

    if (!this.isVisible)
      this.show();
    else
      this.onResize(viewport.width, viewport.height, viewport.orientation);

    return this.$el;
  }

  /**
   * Show the view. Executed by the `viewManager`.
   *
   * @private
   */
  show() {
    this.$el.style.display = 'block';
    this.isVisible = true;
    // must resize before child component
    this._delegateEvents();
    viewport.addResizeListener(this.onResize);
  }

  /**
   * Hide the view and uninstall events. Executed by the `viewManager`.
   *
   * @private
   */
  hide() {
    this.$el.style.display = 'none';
    this.isVisible = false;

    this._undelegateEvents();
    viewport.removeResizeListener(this.onResize);
  }

  /**
   * Remove the view from it's container. Executed by the `viewManager`.
   * @private
   */
  remove() {
    this.hide();
    this.$el.remove();
  }

  /**
   * Interface method to extend, executed when the DOM is created.
   */
  onRender() {}

  /**
   * Callback executed on `resize` events. By default, maintains the size
   * of the container to fit the viewport size. The method is also executed when
   * the view is inserted in the DOM.
   *
   * @param {Number} viewportWidth - Width of the viewport.
   * @param {Number} viewportHeight - Height of the viewport.
   * @param {String} orientation - Orientation of the viewport.
   * @see {@link module:soundworks/client.viewport}
   */
  onResize(viewportWidth, viewportHeight, orientation) {
    this.viewportWidth = viewportWidth;
    this.viewportHeight = viewportHeight;
    this.orientation = orientation;

    this.$el.style.width = `${viewportWidth}px`;
    this.$el.style.height = `${viewportHeight}px`;
    this.$el.classList.remove('portrait', 'landscape');
    this.$el.classList.add(orientation);
  }

  // EVENTS ----------------------------------------

  /**
   * Install events on the view.
   *
   * @param {Object<String, Function>} events - An object of events.
   * @param {Boolean} [override=false] - Defines if the new events added to the
   *  the old one or if they replace them.
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
   *
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
   *
   * @private
   */
  _undelegateEvents() {
    this._delegate.off();
  }
}

export default View;

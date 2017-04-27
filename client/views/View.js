'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _lodash = require('lodash.template');

var _lodash2 = _interopRequireDefault(_lodash);

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

var _domDelegate = require('dom-delegate');

var _domDelegate2 = _interopRequireDefault(_domDelegate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * Method called when the view is inserted into the DOM by the service manager.
 *
 * @name show
 * @memberof module:soundworks/client.AbstractView
 * @function
 * @abstract
 * @instance
 *
 * @return {Element} - immutable DOM element containing the view.
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
var View = function () {
  function View(template) {
    var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck3.default)(this, View);

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
    this._tmpl = (0, _lodash2.default)(template);

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
    this.options = (0, _assign2.default)({
      el: 'div',
      id: null,
      className: null
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
    this._delegate = new _domDelegate2.default(this.$el);
    this.onResize = this.onResize.bind(this);

    this.installEvents(this.events, false);
  }

  (0, _createClass3.default)(View, [{
    key: 'appendTo',
    value: function appendTo($container) {
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

  }, {
    key: '_renderPartial',
    value: function _renderPartial(selector) {
      var $container = this.$el.querySelector(selector);

      if ($container === null) throw new Error('selector ' + selector + ' doesn\'t match any element');

      var html = this._tmpl(this.model);
      var $tmp = document.createElement('div');

      $tmp.innerHTML = html;
      $container.innerHTML = $tmp.querySelector(selector).innerHTML;
      this.onRender();
    }

    /**
     * Render the whole view and its components.
     *
     * @private
     */

  }, {
    key: '_renderAll',
    value: function _renderAll() {
      var options = this.options;
      // set id of the container id given
      if (options.id) this.$el.id = options.id;
      // set classes of the container if given
      if (options.className) {
        var _$el$classList;

        var className = options.className;
        var classes = typeof className === 'string' ? [className] : className;
        (_$el$classList = this.$el.classList).add.apply(_$el$classList, (0, _toConsumableArray3.default)(classes));
      }

      // render template and insert it in the main element
      var html = this._tmpl(this.model);
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

  }, {
    key: 'render',
    value: function render() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (selector !== null) this._renderPartial(selector);else this._renderAll();

      if (this.isVisible) this.onResize(_viewport2.default.width, _viewport2.default.height, _viewport2.default.orientation);

      return this.$el;
    }

    /**
     * Show the view. Executed by the `viewManager`.
     *
     * @private
     */

  }, {
    key: 'show',
    value: function show() {
      this.$el.style.display = 'block';
      this.isVisible = true;
      // must resize before child component
      this._delegateEvents();
      _viewport2.default.addResizeListener(this.onResize);
    }

    /**
     * Hide the view and uninstall events. Executed by the `viewManager`.
     *
     * @private
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.$el.style.display = 'none';
      this.isVisible = false;

      this._undelegateEvents();
      _viewport2.default.removeResizeListener(this.onResize);
    }

    /**
     * Remove the view from it's container. Executed by the `viewManager`.
     * @private
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.hide();
      this.$el.remove();
    }

    /**
     * Interface method to extend, executed when the DOM is created.
     */

  }, {
    key: 'onRender',
    value: function onRender() {}

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

  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;
      this.orientation = orientation;

      this.$el.style.width = viewportWidth + 'px';
      this.$el.style.height = viewportHeight + 'px';
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

  }, {
    key: 'installEvents',
    value: function installEvents(events) {
      var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (this.isVisible) this._undelegateEvents();

      this.events = override ? events : (0, _assign2.default)(this.events, events);

      if (this.isVisible) this._delegateEvents();
    }

    /**
     * Add event listeners on the view.
     *
     * @private
     */

  }, {
    key: '_delegateEvents',
    value: function _delegateEvents() {
      for (var key in this.events) {
        var _key$split = key.split(/ +/),
            _key$split2 = (0, _slicedToArray3.default)(_key$split, 2),
            event = _key$split2[0],
            selector = _key$split2[1];

        var callback = this.events[key];

        this._delegate.on(event, selector || null, callback);
      }
    }

    /**
     * Remove event listeners from the view.
     *
     * @private
     */

  }, {
    key: '_undelegateEvents',
    value: function _undelegateEvents() {
      this._delegate.off();
    }
  }, {
    key: 'template',
    set: function set(template) {
      this._tmpl = (0, _lodash2.default)(template);
    }
  }]);
  return View;
}();

exports.default = View;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZpZXcuanMiXSwibmFtZXMiOlsiVmlldyIsInRlbXBsYXRlIiwibW9kZWwiLCJldmVudHMiLCJvcHRpb25zIiwiX3RtcGwiLCJlbCIsImlkIiwiY2xhc3NOYW1lIiwidmlld3BvcnRXaWR0aCIsInZpZXdwb3J0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJpc1Zpc2libGUiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJfZGVsZWdhdGUiLCJvblJlc2l6ZSIsImJpbmQiLCJpbnN0YWxsRXZlbnRzIiwiJGNvbnRhaW5lciIsImFwcGVuZENoaWxkIiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yIiwiRXJyb3IiLCJodG1sIiwiJHRtcCIsImlubmVySFRNTCIsIm9uUmVuZGVyIiwiY2xhc3NlcyIsImNsYXNzTGlzdCIsImFkZCIsIl9yZW5kZXJQYXJ0aWFsIiwiX3JlbmRlckFsbCIsIndpZHRoIiwiaGVpZ2h0Iiwic3R5bGUiLCJkaXNwbGF5IiwiX2RlbGVnYXRlRXZlbnRzIiwiYWRkUmVzaXplTGlzdGVuZXIiLCJfdW5kZWxlZ2F0ZUV2ZW50cyIsInJlbW92ZVJlc2l6ZUxpc3RlbmVyIiwiaGlkZSIsInJlbW92ZSIsIm92ZXJyaWRlIiwia2V5Iiwic3BsaXQiLCJldmVudCIsImNhbGxiYWNrIiwib24iLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQTs7Ozs7Ozs7Ozs7QUFXQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQk1BLEk7QUFDSixnQkFBWUMsUUFBWixFQUE2RDtBQUFBLFFBQXZDQyxLQUF1Qyx1RUFBL0IsRUFBK0I7QUFBQSxRQUEzQkMsTUFBMkIsdUVBQWxCLEVBQWtCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQzNEOzs7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LFdBQUtyQyxNQUFMLEdBQWN5QyxXQUFXekMsTUFBWCxHQUFvQixzQkFBYyxLQUFLQSxNQUFuQixFQUEyQkEsTUFBM0IsQ0FBbEM7O0FBRUEsVUFBSSxLQUFLUyxTQUFULEVBQ0UsS0FBSzBCLGVBQUw7QUFDSDs7QUFFRDs7Ozs7Ozs7c0NBS2tCO0FBQ2hCLFdBQUssSUFBSU8sR0FBVCxJQUFnQixLQUFLMUMsTUFBckIsRUFBNkI7QUFBQSx5QkFDRDBDLElBQUlDLEtBQUosQ0FBVSxJQUFWLENBREM7QUFBQTtBQUFBLFlBQ3BCQyxLQURvQjtBQUFBLFlBQ2J6QixRQURhOztBQUUzQixZQUFNMEIsV0FBVyxLQUFLN0MsTUFBTCxDQUFZMEMsR0FBWixDQUFqQjs7QUFFQSxhQUFLN0IsU0FBTCxDQUFlaUMsRUFBZixDQUFrQkYsS0FBbEIsRUFBeUJ6QixZQUFZLElBQXJDLEVBQTJDMEIsUUFBM0M7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozt3Q0FLb0I7QUFDbEIsV0FBS2hDLFNBQUwsQ0FBZWtDLEdBQWY7QUFDRDs7O3NCQS9LWWpELFEsRUFBVTtBQUNyQixXQUFLSSxLQUFMLEdBQWEsc0JBQUtKLFFBQUwsQ0FBYjtBQUNEOzs7OztrQkFnTFlELEkiLCJmaWxlIjoiVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0bXBsIGZyb20gJ2xvZGFzaC50ZW1wbGF0ZSc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi92aWV3cG9ydCc7XG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnZG9tLWRlbGVnYXRlJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgcmVxdWlyZWQgdG8gY3JlYXRlIGEgc291bmR3b3JrcyBjb21wYXRpYmxlIHZpZXcuXG4gKlxuICogVG8gY29tcGx5IHdpdGggdGhlIHNvdW5kd29yaydzIGludGVybmFsIHZpZXcgc3lzdGVtIChjZi4gdmlld01hbmFnZXIpIGFueVxuICogdmlldyBzaG91bGQgaW1wbGVtZW50IGFuIGludGVyZmFjZSBjb21wb3NlZCBvZiAyIG1ldGhvZHM6IGByZW5kZXJgIGFuZCBgcmVtb3ZlYFxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RWaWV3XG4gKiBAYWJzdHJhY3RcbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gbWluaW1hbCBpbXBsZW1lbnRhdGlvbiBvZiBhIHNvdW5kd29ya3MgY29tcGxpYW50IHZpZXdcbiAqIGNsYXNzIE15VmlldyB7XG4gKiAgIGNvbnN0cnVjdG9yKHRleHQpIHtcbiAqICAgICB0aGlzLm1zZyA9IG1zZztcbiAqICAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICogICB9XG4gKlxuICogICByZW5kZXIoKSB7XG4gKiAgICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gYDxoMT4ke3RoaXMubXNnfTwvaDE+YDtcbiAqICAgICByZXR1cm4gdGhpcy4kZWw7XG4gKiAgIH1cbiAqXG4gKiAgIHJlbW92ZSgpIHtcbiAqICAgICB0aGlzLiRlbC5yZW1vdmUoKTtcbiAqICAgfVxuICogfVxuICovXG4vKipcbiAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgdmlldyBpcyBpbnNlcnRlZCBpbnRvIHRoZSBET00gYnkgdGhlIHNlcnZpY2UgbWFuYWdlci5cbiAqXG4gKiBAbmFtZSBzaG93XG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm4ge0VsZW1lbnR9IC0gaW1tdXRhYmxlIERPTSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIHZpZXcuXG4gKi9cbi8qKlxuICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSB2aWV3IGhhcyB0byBiZSB1cGRhdGVkLiBUaGUgcmV0dXJuZWQgRE9NIGVsZW1lbnRcbiAqIHNob3VsZCBjb250YWluIHRoZSB3aG9sZSB2aWV3IGNvbnRlbnQgYW5kIHNob3VsZCBub3QgYmUgbXV0YXRlZCBkdXJpbmcgdGhlXG4gKiB3aG9sZSBsaWZlY3ljbGUgb2YgdGhlIHZpZXcuXG4gKlxuICogQG5hbWUgcmVuZGVyXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICpcbiAqIEByZXR1cm4ge0VsZW1lbnR9IC0gaW1tdXRhYmxlIERPTSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIHZpZXcuXG4gKi9cbi8qKlxuICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSB2aWV3IGlzIHJlbW92ZWQgaW4gdGhlIERPTSBieSB0aGUgYHZpZXdNYW5hZ2VyYC5cbiAqXG4gKiBAbmFtZSByZW1vdmVcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKi9cblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB2aWV3cy5cbiAqXG4gKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFZpZXdzIHNob3VsZCBiZSBjcmVhdGVkIHVzaW5nXG4gKiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5I2NyZWF0ZVZpZXd9IG1ldGhvZC5fXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlIC0gVGVtcGxhdGUgb2YgdGhlIHZpZXcuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIE9iamVjdCBjb250YWluaW5nIHRoZSB2YXJpYWJsZXMgdXNlZCB0byBwb3B1bGF0ZVxuICogIHRoZSB0ZW1wbGF0ZS4ge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2NvbnRlbnR9LlxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIExpc3RlbmVycyB0byBpbnN0YWxsIGluIHRoZSB2aWV3XG4gKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2V2ZW50c30uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgb2YgdGhlIHZpZXcuXG4gKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I29wdGlvbnN9LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBtb2RlbCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqXG4gICAgICogRnVuY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBgdGVtcGxhdGVgLCB0byBiZSBleGVjdXRlZCB3aXRoIHRoZVxuICAgICAqIGBjb250ZW50YCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICogQG5hbWUgdG1wbFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fdG1wbCA9IHRtcGwodGVtcGxhdGUpO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSB1c2VkIHRvIHBvcHVsYXRlIHZhcmlhYmxlcyBkZWZpbmVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgY29udGVudFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDsgLy8gbW9kZWxcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuIFRoZSBrZXkgLyB2YWx1ZSBwYWlycyBtdXN0IGZvbGxvdyB0aGVcbiAgICAgKiBjb252ZW50aW9uOiBgJ2V2ZW50TmFtZSBbY3NzU2VsZWN0b3JdJzogY2FsbGJhY2tGdW5jdGlvbmBcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgZXZlbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBWaWV3LlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gW2VsPSdkaXYnXSAtIFR5cGUgb2YgRE9NIGVsZW1lbnQgb2YgdGhlIG1haW4gY29udGFpbmVyXG4gICAgICogIG9mIHRoZSB2aWV3LiBCYXNpY2FsbHkgdGhlIGFyZ3VtZW50IG9mIGBkb2N1bWVudC5jcmVhdGVFbGVtZW50YC5cbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gW2lkPW51bGxdIC0gSWQgb2YgdGhlIG1haW4gY29udGFpbmVyLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXk8U3RyaW5nPn0gW2NsYXNzTmFtZT1udWxsXSAtIENsYXNzZXMgb2YgdGhlIG1haW4gY29udGFpbmVyLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXk8U3RyaW5nPn0gW3ByaW9yaXR5PTBdIC0gUHJpb3JpdHkgb2YgdGhlIHZpZXcuIFRoaXMgdmFsdWVcbiAgICAgKiAgaXMgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYCB0byBkZWZpbmUgd2hpY2ggdmlldyBzaG91bGQgYXBwZWFyIGZpcnN0LlxuICAgICAqIEBuYW1lIG9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3IyRlbH1cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQudmlld01hbmFnZXJ9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBlbDogJ2RpdicsXG4gICAgICBpZDogbnVsbCxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFZpZXdwb3J0IHdpZHRoLlxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbmFtZSB2aWV3V2lkdGhcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQudmlld3BvcnR9XG4gICAgICovXG4gICAgdGhpcy52aWV3cG9ydFdpZHRoID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFZpZXdwb3J0IGhlaWdodC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgdmlld1dpZHRoXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdwb3J0fVxuICAgICAqL1xuICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXcgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAgICpcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBuYW1lIG9yaWVudGF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdwb3J0fVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHRoZSB2aWV3IGlzIHZpc2libGUgb3Igbm90LlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgaXNWaXNpYmxlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIERPTSBlbGVtZW50IG9mIHRoZSBtYWluIGNvbnRhaW5lciBvZiB0aGUgdmlldy4gRGVmYXVsdHMgdG8gYDxkaXY+YC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqIEBuYW1lICRlbFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMuZWwpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBldmVudCBkZWxlZ2F0aW9uXG4gICAgdGhpcy5fZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUodGhpcy4kZWwpO1xuICAgIHRoaXMub25SZXNpemUgPSB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmluc3RhbGxFdmVudHModGhpcy5ldmVudHMsIGZhbHNlKTtcbiAgfVxuXG4gIHNldCB0ZW1wbGF0ZSh0ZW1wbGF0ZSkge1xuICAgIHRoaXMuX3RtcGwgPSB0bXBsKHRlbXBsYXRlKTtcbiAgfVxuXG4gIGFwcGVuZFRvKCRjb250YWluZXIpIHtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJ0aWFsbHkgcmUtcmVuZGVyIHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gc2VsZWN0b3IuIElmIHRoZVxuICAgKiBzZWxlY3RvciBpcyBhc3NvY2lhdGVkIHRvIGEgYGNvbXBvbmVudGAsIHRoZSBgY29tcG9uZW50YCBpcyByZW5kZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIC0gQ3NzIHNlbGVjdG9yIG9mIHRoZSBlbGVtZW50IHRvIHJlbmRlci4gVGhlXG4gICAqICBlbGVtZW50IGl0c2VsZiBpcyBub3QgdXBkYXRlZCwgb25seSBpdHMgY29udGVudC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgaWYgKCRjb250YWluZXIgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlbGVjdG9yICR7c2VsZWN0b3J9IGRvZXNuJ3QgbWF0Y2ggYW55IGVsZW1lbnRgKTtcblxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLl90bXBsKHRoaXMubW9kZWwpO1xuICAgIGNvbnN0ICR0bXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICR0bXAuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAkY29udGFpbmVyLmlubmVySFRNTCA9ICR0bXAucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MO1xuICAgIHRoaXMub25SZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHdob2xlIHZpZXcgYW5kIGl0cyBjb21wb25lbnRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlbmRlckFsbCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIC8vIHNldCBpZCBvZiB0aGUgY29udGFpbmVyIGlkIGdpdmVuXG4gICAgaWYgKG9wdGlvbnMuaWQpXG4gICAgICB0aGlzLiRlbC5pZCA9IG9wdGlvbnMuaWQ7XG4gICAgLy8gc2V0IGNsYXNzZXMgb2YgdGhlIGNvbnRhaW5lciBpZiBnaXZlblxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XG4gICAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIGNsYXNzTmFtZSA9PT0gJ3N0cmluZycgPyBbY2xhc3NOYW1lXSA6IGNsYXNzTmFtZTtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIHRlbXBsYXRlIGFuZCBpbnNlcnQgaXQgaW4gdGhlIG1haW4gZWxlbWVudFxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLl90bXBsKHRoaXMubW9kZWwpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgdGhpcy5vblJlbmRlcigpO1xuICB9XG5cbiAgLy8gTElGRSBDWUNMRSBNRVRIT0RTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gdGVtcGxhdGUgYW5kIGNvbnRlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3I9bnVsbF0gLSBJZiBub3QgYG51bGxgLCByZW5kZXJzIG9ubHkgdGhlIHBhcnQgb2ZcbiAgICogIHRoZSB2aWV3IGluc2lkZSB0aGUgbWF0Y2hlZCBlbGVtZW50LiBJZiB0aGlzIGVsZW1lbnQgY29udGFpbnMgYSBjb21wb25lbnRcbiAgICogIChzdWItdmlldyksIHRoZSBjb21wb25lbnQgaXMgcmVuZGVyZWQuIFJlbmRlciB0aGUgd2hvbGUgdmlldyBvdGhlcndpc2UuXG4gICAqL1xuICByZW5kZXIoc2VsZWN0b3IgPSBudWxsKSB7XG4gICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLm9uUmVzaXplKHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQsIHZpZXdwb3J0Lm9yaWVudGF0aW9uKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSB2aWV3LiBFeGVjdXRlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNob3coKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgIC8vIG11c3QgcmVzaXplIGJlZm9yZSBjaGlsZCBjb21wb25lbnRcbiAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHZpZXdwb3J0LmFkZFJlc2l6ZUxpc3RlbmVyKHRoaXMub25SZXNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIHZpZXcgYW5kIHVuaW5zdGFsbCBldmVudHMuIEV4ZWN1dGVkIGJ5IHRoZSBgdmlld01hbmFnZXJgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQucmVtb3ZlUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSB2aWV3IGZyb20gaXQncyBjb250YWluZXIuIEV4ZWN1dGVkIGJ5IHRoZSBgdmlld01hbmFnZXJgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gZXh0ZW5kLCBleGVjdXRlZCB3aGVuIHRoZSBET00gaXMgY3JlYXRlZC5cbiAgICovXG4gIG9uUmVuZGVyKCkge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZXhlY3V0ZWQgb24gYHJlc2l6ZWAgZXZlbnRzLiBCeSBkZWZhdWx0LCBtYWludGFpbnMgdGhlIHNpemVcbiAgICogb2YgdGhlIGNvbnRhaW5lciB0byBmaXQgdGhlIHZpZXdwb3J0IHNpemUuIFRoZSBtZXRob2QgaXMgYWxzbyBleGVjdXRlZCB3aGVuXG4gICAqIHRoZSB2aWV3IGlzIGluc2VydGVkIGluIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydFdpZHRoIC0gV2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBIZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBPcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH1cbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcblxuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gYCR7dmlld3BvcnRXaWR0aH1weGA7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnRIZWlnaHR9cHhgO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcnRyYWl0JywgJ2xhbmRzY2FwZScpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQob3JpZW50YXRpb24pO1xuICB9XG5cbiAgLy8gRVZFTlRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogSW5zdGFsbCBldmVudHMgb24gdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0PFN0cmluZywgRnVuY3Rpb24+fSBldmVudHMgLSBBbiBvYmplY3Qgb2YgZXZlbnRzLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvdmVycmlkZT1mYWxzZV0gLSBEZWZpbmVzIGlmIHRoZSBuZXcgZXZlbnRzIGFkZGVkIHRvIHRoZVxuICAgKiAgdGhlIG9sZCBvbmUgb3IgaWYgdGhleSByZXBsYWNlIHRoZW0uXG4gICAqL1xuICBpbnN0YWxsRXZlbnRzKGV2ZW50cywgb3ZlcnJpZGUgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcblxuICAgIHRoaXMuZXZlbnRzID0gb3ZlcnJpZGUgPyBldmVudHMgOiBPYmplY3QuYXNzaWduKHRoaXMuZXZlbnRzLCBldmVudHMpO1xuXG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIG9uIHRoZSB2aWV3LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCBzZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG5cbiAgICAgIHRoaXMuX2RlbGVnYXRlLm9uKGV2ZW50LCBzZWxlY3RvciB8fMKgbnVsbCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5vZmYoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWaWV3O1xuIl19
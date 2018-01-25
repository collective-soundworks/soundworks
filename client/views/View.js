'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toArray2 = require('babel-runtime/helpers/toArray');

var _toArray3 = _interopRequireDefault(_toArray2);

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
    this._tmpl = null;

    this.template = template;

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
            _key$split2 = (0, _toArray3.default)(_key$split),
            event = _key$split2[0],
            selector = _key$split2.slice(1);

        var callback = this.events[key];

        this._delegate.on(event, selector.length ? selector.join(' ') : null, callback);
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
      try {
        this._tmpl = (0, _lodash2.default)(template);
      } catch (err) {
        throw new Error('Invalid template (make sure you do not use es6 syntax in Safari mobile): ' + template);
      }
    }
  }]);
  return View;
}();

exports.default = View;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZpZXcuanMiXSwibmFtZXMiOlsiVmlldyIsInRlbXBsYXRlIiwibW9kZWwiLCJldmVudHMiLCJvcHRpb25zIiwiX3RtcGwiLCJlbCIsImlkIiwiY2xhc3NOYW1lIiwidmlld3BvcnRXaWR0aCIsInZpZXdwb3J0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJpc1Zpc2libGUiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJfZGVsZWdhdGUiLCJvblJlc2l6ZSIsImJpbmQiLCJpbnN0YWxsRXZlbnRzIiwiJGNvbnRhaW5lciIsImFwcGVuZENoaWxkIiwic2VsZWN0b3IiLCJxdWVyeVNlbGVjdG9yIiwiRXJyb3IiLCJodG1sIiwiJHRtcCIsImlubmVySFRNTCIsIm9uUmVuZGVyIiwiY2xhc3NlcyIsImNsYXNzTGlzdCIsImFkZCIsIl9yZW5kZXJQYXJ0aWFsIiwiX3JlbmRlckFsbCIsIndpZHRoIiwiaGVpZ2h0Iiwic3R5bGUiLCJkaXNwbGF5IiwiX2RlbGVnYXRlRXZlbnRzIiwiYWRkUmVzaXplTGlzdGVuZXIiLCJfdW5kZWxlZ2F0ZUV2ZW50cyIsInJlbW92ZVJlc2l6ZUxpc3RlbmVyIiwiaGlkZSIsInJlbW92ZSIsIm92ZXJyaWRlIiwia2V5Iiwic3BsaXQiLCJldmVudCIsImNhbGxiYWNrIiwib24iLCJsZW5ndGgiLCJqb2luIiwib2ZmIiwiZXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkE7Ozs7Ozs7Ozs7O0FBV0E7Ozs7Ozs7Ozs7Ozs7QUFhQTs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7O0lBZ0JNQSxJO0FBQ0osZ0JBQVlDLFFBQVosRUFBNkQ7QUFBQSxRQUF2Q0MsS0FBdUMsdUVBQS9CLEVBQStCO0FBQUEsUUFBM0JDLE1BQTJCLHVFQUFsQixFQUFrQjtBQUFBLFFBQWRDLE9BQWMsdUVB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VUFBSSxLQUFLaEMsU0FBVCxFQUNFLEtBQUs0QixpQkFBTDs7QUFFRixXQUFLckMsTUFBTCxHQUFjeUMsV0FBV3pDLE1BQVgsR0FBb0Isc0JBQWMsS0FBS0EsTUFBbkIsRUFBMkJBLE1BQTNCLENBQWxDOztBQUVBLFVBQUksS0FBS1MsU0FBVCxFQUNFLEtBQUswQixlQUFMO0FBQ0g7O0FBRUQ7Ozs7Ozs7O3NDQUtrQjtBQUNoQixXQUFLLElBQUlPLEdBQVQsSUFBZ0IsS0FBSzFDLE1BQXJCLEVBQTZCO0FBQUEseUJBQ0UwQyxJQUFJQyxLQUFKLENBQVUsSUFBVixDQURGO0FBQUE7QUFBQSxZQUNwQkMsS0FEb0I7QUFBQSxZQUNWekIsUUFEVTs7QUFFM0IsWUFBTTBCLFdBQVcsS0FBSzdDLE1BQUwsQ0FBWTBDLEdBQVosQ0FBakI7O0FBRUEsYUFBSzdCLFNBQUwsQ0FBZWlDLEVBQWYsQ0FBa0JGLEtBQWxCLEVBQXlCekIsU0FBUzRCLE1BQVQsR0FBa0I1QixTQUFTNkIsSUFBVCxDQUFjLEdBQWQsQ0FBbEIsR0FBdUMsSUFBaEUsRUFBc0VILFFBQXRFO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7Ozs7d0NBS29CO0FBQ2xCLFdBQUtoQyxTQUFMLENBQWVvQyxHQUFmO0FBQ0Q7OztzQkFuTFluRCxRLEVBQVU7QUFDckIsVUFBSTtBQUNGLGFBQUtJLEtBQUwsR0FBYSxzQkFBS0osUUFBTCxDQUFiO0FBQ0QsT0FGRCxDQUVFLE9BQU1vRCxHQUFOLEVBQVc7QUFDWCxjQUFNLElBQUk3QixLQUFKLENBQVUsOEVBQThFdkIsUUFBeEYsQ0FBTjtBQUNEO0FBQ0Y7Ozs7O2tCQWdMWUQsSSIsImZpbGUiOiJWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRtcGwgZnJvbSAnbG9kYXNoLnRlbXBsYXRlJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuL3ZpZXdwb3J0JztcbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICdkb20tZGVsZWdhdGUnO1xuXG4vKipcbiAqIEludGVyZmFjZSByZXF1aXJlZCB0byBjcmVhdGUgYSBzb3VuZHdvcmtzIGNvbXBhdGlibGUgdmlldy5cbiAqXG4gKiBUbyBjb21wbHkgd2l0aCB0aGUgc291bmR3b3JrJ3MgaW50ZXJuYWwgdmlldyBzeXN0ZW0gKGNmLiB2aWV3TWFuYWdlcikgYW55XG4gKiB2aWV3IHNob3VsZCBpbXBsZW1lbnQgYW4gaW50ZXJmYWNlIGNvbXBvc2VkIG9mIDIgbWV0aG9kczogYHJlbmRlcmAgYW5kIGByZW1vdmVgXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGludGVyZmFjZSBBYnN0cmFjdFZpZXdcbiAqIEBhYnN0cmFjdFxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBtaW5pbWFsIGltcGxlbWVudGF0aW9uIG9mIGEgc291bmR3b3JrcyBjb21wbGlhbnQgdmlld1xuICogY2xhc3MgTXlWaWV3IHtcbiAqICAgY29uc3RydWN0b3IodGV4dCkge1xuICogICAgIHRoaXMubXNnID0gbXNnO1xuICogICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gKiAgIH1cbiAqXG4gKiAgIHJlbmRlcigpIHtcbiAqICAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBgPGgxPiR7dGhpcy5tc2d9PC9oMT5gO1xuICogICAgIHJldHVybiB0aGlzLiRlbDtcbiAqICAgfVxuICpcbiAqICAgcmVtb3ZlKCkge1xuICogICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICogICB9XG4gKiB9XG4gKi9cbi8qKlxuICogTWV0aG9kIGNhbGxlZCB3aGVuIHRoZSB2aWV3IGlzIGluc2VydGVkIGludG8gdGhlIERPTSBieSB0aGUgc2VydmljZSBtYW5hZ2VyLlxuICpcbiAqIEBuYW1lIHNob3dcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7RWxlbWVudH0gLSBpbW11dGFibGUgRE9NIGVsZW1lbnQgY29udGFpbmluZyB0aGUgdmlldy5cbiAqL1xuLyoqXG4gKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIHZpZXcgaGFzIHRvIGJlIHVwZGF0ZWQuIFRoZSByZXR1cm5lZCBET00gZWxlbWVudFxuICogc2hvdWxkIGNvbnRhaW4gdGhlIHdob2xlIHZpZXcgY29udGVudCBhbmQgc2hvdWxkIG5vdCBiZSBtdXRhdGVkIGR1cmluZyB0aGVcbiAqIHdob2xlIGxpZmVjeWNsZSBvZiB0aGUgdmlldy5cbiAqXG4gKiBAbmFtZSByZW5kZXJcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWJzdHJhY3RWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHJldHVybiB7RWxlbWVudH0gLSBpbW11dGFibGUgRE9NIGVsZW1lbnQgY29udGFpbmluZyB0aGUgdmlldy5cbiAqL1xuLyoqXG4gKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIHZpZXcgaXMgcmVtb3ZlZCBpbiB0aGUgRE9NIGJ5IHRoZSBgdmlld01hbmFnZXJgLlxuICpcbiAqIEBuYW1lIHJlbW92ZVxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqL1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHZpZXdzLlxuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVmlld3Mgc2hvdWxkIGJlIGNyZWF0ZWQgdXNpbmdcbiAqIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHkjY3JlYXRlVmlld30gbWV0aG9kLl9cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGVtcGxhdGUgLSBUZW1wbGF0ZSBvZiB0aGUgdmlldy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhcmlhYmxlcyB1c2VkIHRvIHBvcHVsYXRlXG4gKiAgdGhlIHRlbXBsYXRlLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjY29udGVudH0uXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gTGlzdGVuZXJzIHRvIGluc3RhbGwgaW4gdGhlIHZpZXdcbiAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjZXZlbnRzfS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgdmlldy5cbiAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjb3B0aW9uc30uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIG1vZGVsID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvKipcbiAgICAgKiBGdW5jdGlvbiBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGB0ZW1wbGF0ZWAsIHRvIGJlIGV4ZWN1dGVkIHdpdGggdGhlXG4gICAgICogYGNvbnRlbnRgIG9iamVjdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKiBAbmFtZSB0bXBsXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl90bXBsID0gbnVsbDtcblxuICAgIHRoaXMudGVtcGxhdGUgPSB0ZW1wbGF0ZTtcblxuICAgIC8qKlxuICAgICAqIERhdGEgdXNlZCB0byBwb3B1bGF0ZSB2YXJpYWJsZXMgZGVmaW5lZCBpbiB0aGUgdGVtcGxhdGUuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIGNvbnRlbnRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7IC8vIG1vZGVsXG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LiBUaGUga2V5IC8gdmFsdWUgcGFpcnMgbXVzdCBmb2xsb3cgdGhlXG4gICAgICogY29udmVudGlvbjogYCdldmVudE5hbWUgW2Nzc1NlbGVjdG9yXSc6IGNhbGxiYWNrRnVuY3Rpb25gXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIGV2ZW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgVmlldy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFtlbD0nZGl2J10gLSBUeXBlIG9mIERPTSBlbGVtZW50IG9mIHRoZSBtYWluIGNvbnRhaW5lclxuICAgICAqICBvZiB0aGUgdmlldy4gQmFzaWNhbGx5IHRoZSBhcmd1bWVudCBvZiBgZG9jdW1lbnQuY3JlYXRlRWxlbWVudGAuXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFtpZD1udWxsXSAtIElkIG9mIHRoZSBtYWluIGNvbnRhaW5lci5cbiAgICAgKiBAcHJvcGVydHkge0FycmF5PFN0cmluZz59IFtjbGFzc05hbWU9bnVsbF0gLSBDbGFzc2VzIG9mIHRoZSBtYWluIGNvbnRhaW5lci5cbiAgICAgKiBAcHJvcGVydHkge0FycmF5PFN0cmluZz59IFtwcmlvcml0eT0wXSAtIFByaW9yaXR5IG9mIHRoZSB2aWV3LiBUaGlzIHZhbHVlXG4gICAgICogIGlzIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmAgdG8gZGVmaW5lIHdoaWNoIHZpZXcgc2hvdWxkIGFwcGVhciBmaXJzdC5cbiAgICAgKiBAbmFtZSBvcHRpb25zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICpcbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQudmlldyMkZWx9XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdNYW5hZ2VyfVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZWw6ICdkaXYnLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBWaWV3cG9ydCB3aWR0aC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgdmlld1dpZHRoXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdwb3J0fVxuICAgICAqL1xuICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBWaWV3cG9ydCBoZWlnaHQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIHZpZXdXaWR0aFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH1cbiAgICAgKi9cbiAgICB0aGlzLnZpZXdwb3J0SGVpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgICAqXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbmFtZSBvcmllbnRhdGlvblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH1cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyBpZiB0aGUgdmlldyBpcyB2aXNpYmxlIG9yIG5vdC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBuYW1lIGlzVmlzaWJsZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBET00gZWxlbWVudCBvZiB0aGUgbWFpbiBjb250YWluZXIgb2YgdGhlIHZpZXcuIERlZmF1bHRzIHRvIGA8ZGl2PmAuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKiBAbmFtZSAkZWxcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5vcHRpb25zLmVsKTtcblxuICAgIC8vIGluaXRpYWxpemUgZXZlbnQgZGVsZWdhdGlvblxuICAgIHRoaXMuX2RlbGVnYXRlID0gbmV3IERlbGVnYXRlKHRoaXMuJGVsKTtcbiAgICB0aGlzLm9uUmVzaXplID0gdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHRoaXMuZXZlbnRzLCBmYWxzZSk7XG4gIH1cblxuICBzZXQgdGVtcGxhdGUodGVtcGxhdGUpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fdG1wbCA9IHRtcGwodGVtcGxhdGUpO1xuICAgIH0gY2F0Y2goZXJyKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGVtcGxhdGUgKG1ha2Ugc3VyZSB5b3UgZG8gbm90IHVzZSBlczYgc3ludGF4IGluIFNhZmFyaSBtb2JpbGUpOiAnICsgdGVtcGxhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGFwcGVuZFRvKCRjb250YWluZXIpIHtcbiAgICAkY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXJ0aWFsbHkgcmUtcmVuZGVyIHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gc2VsZWN0b3IuIElmIHRoZVxuICAgKiBzZWxlY3RvciBpcyBhc3NvY2lhdGVkIHRvIGEgYGNvbXBvbmVudGAsIHRoZSBgY29tcG9uZW50YCBpcyByZW5kZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIC0gQ3NzIHNlbGVjdG9yIG9mIHRoZSBlbGVtZW50IHRvIHJlbmRlci4gVGhlXG4gICAqICBlbGVtZW50IGl0c2VsZiBpcyBub3QgdXBkYXRlZCwgb25seSBpdHMgY29udGVudC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgJGNvbnRhaW5lciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuXG4gICAgaWYgKCRjb250YWluZXIgPT09IG51bGwpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNlbGVjdG9yICR7c2VsZWN0b3J9IGRvZXNuJ3QgbWF0Y2ggYW55IGVsZW1lbnRgKTtcblxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLl90bXBsKHRoaXMubW9kZWwpO1xuICAgIGNvbnN0ICR0bXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgICR0bXAuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAkY29udGFpbmVyLmlubmVySFRNTCA9ICR0bXAucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MO1xuICAgIHRoaXMub25SZW5kZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHdob2xlIHZpZXcgYW5kIGl0cyBjb21wb25lbnRzLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlbmRlckFsbCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIC8vIHNldCBpZCBvZiB0aGUgY29udGFpbmVyIGlkIGdpdmVuXG4gICAgaWYgKG9wdGlvbnMuaWQpXG4gICAgICB0aGlzLiRlbC5pZCA9IG9wdGlvbnMuaWQ7XG4gICAgLy8gc2V0IGNsYXNzZXMgb2YgdGhlIGNvbnRhaW5lciBpZiBnaXZlblxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XG4gICAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIGNsYXNzTmFtZSA9PT0gJ3N0cmluZycgPyBbY2xhc3NOYW1lXSA6IGNsYXNzTmFtZTtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIHRlbXBsYXRlIGFuZCBpbnNlcnQgaXQgaW4gdGhlIG1haW4gZWxlbWVudFxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLl90bXBsKHRoaXMubW9kZWwpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgdGhpcy5vblJlbmRlcigpO1xuICB9XG5cbiAgLy8gTElGRSBDWUNMRSBNRVRIT0RTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gdGVtcGxhdGUgYW5kIGNvbnRlbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3I9bnVsbF0gLSBJZiBub3QgYG51bGxgLCByZW5kZXJzIG9ubHkgdGhlIHBhcnQgb2ZcbiAgICogIHRoZSB2aWV3IGluc2lkZSB0aGUgbWF0Y2hlZCBlbGVtZW50LiBJZiB0aGlzIGVsZW1lbnQgY29udGFpbnMgYSBjb21wb25lbnRcbiAgICogIChzdWItdmlldyksIHRoZSBjb21wb25lbnQgaXMgcmVuZGVyZWQuIFJlbmRlciB0aGUgd2hvbGUgdmlldyBvdGhlcndpc2UuXG4gICAqL1xuICByZW5kZXIoc2VsZWN0b3IgPSBudWxsKSB7XG4gICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLm9uUmVzaXplKHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQsIHZpZXdwb3J0Lm9yaWVudGF0aW9uKTtcblxuICAgIHJldHVybiB0aGlzLiRlbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSB2aWV3LiBFeGVjdXRlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYC5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNob3coKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgIC8vIG11c3QgcmVzaXplIGJlZm9yZSBjaGlsZCBjb21wb25lbnRcbiAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHZpZXdwb3J0LmFkZFJlc2l6ZUxpc3RlbmVyKHRoaXMub25SZXNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIHZpZXcgYW5kIHVuaW5zdGFsbCBldmVudHMuIEV4ZWN1dGVkIGJ5IHRoZSBgdmlld01hbmFnZXJgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQucmVtb3ZlUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSB2aWV3IGZyb20gaXQncyBjb250YWluZXIuIEV4ZWN1dGVkIGJ5IHRoZSBgdmlld01hbmFnZXJgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEludGVyZmFjZSBtZXRob2QgdG8gZXh0ZW5kLCBleGVjdXRlZCB3aGVuIHRoZSBET00gaXMgY3JlYXRlZC5cbiAgICovXG4gIG9uUmVuZGVyKCkge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZXhlY3V0ZWQgb24gYHJlc2l6ZWAgZXZlbnRzLiBCeSBkZWZhdWx0LCBtYWludGFpbnMgdGhlIHNpemVcbiAgICogb2YgdGhlIGNvbnRhaW5lciB0byBmaXQgdGhlIHZpZXdwb3J0IHNpemUuIFRoZSBtZXRob2QgaXMgYWxzbyBleGVjdXRlZCB3aGVuXG4gICAqIHRoZSB2aWV3IGlzIGluc2VydGVkIGluIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydFdpZHRoIC0gV2lkdGggb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBIZWlnaHQgb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBPcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3cG9ydH1cbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcblxuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gYCR7dmlld3BvcnRXaWR0aH1weGA7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnRIZWlnaHR9cHhgO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcnRyYWl0JywgJ2xhbmRzY2FwZScpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQob3JpZW50YXRpb24pO1xuICB9XG5cbiAgLy8gRVZFTlRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogSW5zdGFsbCBldmVudHMgb24gdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0PFN0cmluZywgRnVuY3Rpb24+fSBldmVudHMgLSBBbiBvYmplY3Qgb2YgZXZlbnRzLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvdmVycmlkZT1mYWxzZV0gLSBEZWZpbmVzIGlmIHRoZSBuZXcgZXZlbnRzIGFkZGVkIHRvIHRoZVxuICAgKiAgdGhlIG9sZCBvbmUgb3IgaWYgdGhleSByZXBsYWNlIHRoZW0uXG4gICAqL1xuICBpbnN0YWxsRXZlbnRzKGV2ZW50cywgb3ZlcnJpZGUgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcblxuICAgIHRoaXMuZXZlbnRzID0gb3ZlcnJpZGUgPyBldmVudHMgOiBPYmplY3QuYXNzaWduKHRoaXMuZXZlbnRzLCBldmVudHMpO1xuXG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIG9uIHRoZSB2aWV3LlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCAuLi5zZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG5cbiAgICAgIHRoaXMuX2RlbGVnYXRlLm9uKGV2ZW50LCBzZWxlY3Rvci5sZW5ndGggPyBzZWxlY3Rvci5qb2luKCcgJykgOsKgbnVsbCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGZyb20gdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5vZmYoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWaWV3O1xuIl19
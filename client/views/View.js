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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZpZXcuanMiXSwibmFtZXMiOlsiVmlldyIsInRlbXBsYXRlIiwibW9kZWwiLCJldmVudHMiLCJvcHRpb25zIiwiX3RtcGwiLCJlbCIsImlkIiwiY2xhc3NOYW1lIiwidmlld3BvcnRXaWR0aCIsInZpZXdwb3J0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJpc1Zpc2libGUiLCIkZWwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJfZGVsZWdhdGUiLCJEZWxlZ2F0ZSIsIm9uUmVzaXplIiwiYmluZCIsImluc3RhbGxFdmVudHMiLCIkY29udGFpbmVyIiwiYXBwZW5kQ2hpbGQiLCJzZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3IiLCJFcnJvciIsImh0bWwiLCIkdG1wIiwiaW5uZXJIVE1MIiwib25SZW5kZXIiLCJjbGFzc2VzIiwiY2xhc3NMaXN0IiwiYWRkIiwiX3JlbmRlclBhcnRpYWwiLCJfcmVuZGVyQWxsIiwidmlld3BvcnQiLCJ3aWR0aCIsImhlaWdodCIsInN0eWxlIiwiZGlzcGxheSIsIl9kZWxlZ2F0ZUV2ZW50cyIsImFkZFJlc2l6ZUxpc3RlbmVyIiwiX3VuZGVsZWdhdGVFdmVudHMiLCJyZW1vdmVSZXNpemVMaXN0ZW5lciIsImhpZGUiLCJyZW1vdmUiLCJvdmVycmlkZSIsImtleSIsInNwbGl0IiwiZXZlbnQiLCJjYWxsYmFjayIsIm9uIiwibGVuZ3RoIiwiam9pbiIsIm9mZiIsImVyciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBOzs7Ozs7Ozs7OztBQVdBOzs7Ozs7Ozs7Ozs7O0FBYUE7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7Ozs7Ozs7OztJQWdCTUEsSTtBQUNKLGdCQUFZQyxRQUFaLEVBQTZEO0FBQUEsUUFBdkNDLEtBQXVDLHVFQUEvQixFQUErQjtBQUFBLFFBQTNCQyxNQUEyQix1RUFBbEIsRUFBa0I7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDM0Q7Ozs7Ozs7Ozs7QUFVQSxTQUFLQyxLQUFMLEdBQWEsSUFBYjs7QUFFQSxTQUFLSixRQUFMLEdBQWdCQSxRQUFoQjs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFLQyxLQUFMLEdBQWFBLEtBQWIsQ0F2QjJELENBdUJ2Qzs7QUFFcEI7Ozs7Ozs7OztBQVNBLFNBQUtDLE1BQUwsR0FBY0EsTUFBZDs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsU0FBS0MsT0FBTCxHQUFlLHNCQUFjO0FBQzNCRSxVQUFJLEtBRHVCO0FBRTNCQyxVQUFJLElBRnVCO0FBRzNCQyxpQkFBVztBQUhnQixLQUFkLEVBSVpKLE9BSlksQ0FBZjs7QUFNQTs7Ozs7Ozs7O0FBU0EsU0FBS0ssYUFBTCxHQUFxQixJQUFyQjs7QUFFQTs7Ozs7Ozs7O0FBU0EsU0FBS0MsY0FBTCxHQUFzQixJQUF0Qjs7QUFFQTs7Ozs7Ozs7O0FBU0EsU0FBS0MsV0FBTCxHQUFtQixJQUFuQjs7QUFFQTs7Ozs7Ozs7QUFRQSxTQUFLQyxTQUFMLEdBQWlCLEtBQWpCOztBQUVBOzs7Ozs7OztBQVFBLFNBQUtDLEdBQUwsR0FBV0MsU0FBU0MsYUFBVCxDQUF1QixLQUFLWCxPQUFMLENBQWFFLEVBQXBDLENBQVg7O0FBRUE7QUFDQSxTQUFLVSxTQUFMLEdBQWlCLElBQUlDLHFCQUFKLENBQWEsS0FBS0osR0FBbEIsQ0FBakI7QUFDQSxTQUFLSyxRQUFMLEdBQWdCLEtBQUtBLFFBQUwsQ0FBY0MsSUFBZCxDQUFtQixJQUFuQixDQUFoQjs7QUFFQSxTQUFLQyxhQUFMLENBQW1CLEtBQUtqQixNQUF4QixFQUFnQyxLQUFoQztBQUNEOzs7OzZCQVVRa0IsVSxFQUFZO0FBQ25CQSxpQkFBV0MsV0FBWCxDQUF1QixLQUFLVCxHQUE1QjtBQUNEOztBQUVEOzs7Ozs7Ozs7OzttQ0FRZVUsUSxFQUFVO0FBQ3ZCLFVBQU1GLGFBQWEsS0FBS1IsR0FBTCxDQUFTVyxhQUFULENBQXVCRCxRQUF2QixDQUFuQjs7QUFFQSxVQUFJRixlQUFlLElBQW5CLEVBQ0UsTUFBTSxJQUFJSSxLQUFKLGVBQXNCRixRQUF0QixpQ0FBTjs7QUFFRixVQUFNRyxPQUFPLEtBQUtyQixLQUFMLENBQVcsS0FBS0gsS0FBaEIsQ0FBYjtBQUNBLFVBQU15QixPQUFPYixTQUFTQyxhQUFULENBQXVCLEtBQXZCLENBQWI7O0FBRUFZLFdBQUtDLFNBQUwsR0FBaUJGLElBQWpCO0FBQ0FMLGlCQUFXTyxTQUFYLEdBQXVCRCxLQUFLSCxhQUFMLENBQW1CRCxRQUFuQixFQUE2QkssU0FBcEQ7QUFDQSxXQUFLQyxRQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2lDQUthO0FBQ1gsVUFBTXpCLFVBQVUsS0FBS0EsT0FBckI7QUFDQTtBQUNBLFVBQUlBLFFBQVFHLEVBQVosRUFDRSxLQUFLTSxHQUFMLENBQVNOLEVBQVQsR0FBY0gsUUFBUUcsRUFBdEI7QUFDRjtBQUNBLFVBQUlILFFBQVFJLFNBQVosRUFBdUI7QUFBQTs7QUFDckIsWUFBTUEsWUFBWUosUUFBUUksU0FBMUI7QUFDQSxZQUFNc0IsVUFBVSxPQUFPdEIsU0FBUCxLQUFxQixRQUFyQixHQUFnQyxDQUFDQSxTQUFELENBQWhDLEdBQThDQSxTQUE5RDtBQUNBLCtCQUFLSyxHQUFMLENBQVNrQixTQUFULEVBQW1CQyxHQUFuQix3REFBMEJGLE9BQTFCO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFNSixPQUFPLEtBQUtyQixLQUFMLENBQVcsS0FBS0gsS0FBaEIsQ0FBYjtBQUNBLFdBQUtXLEdBQUwsQ0FBU2UsU0FBVCxHQUFxQkYsSUFBckI7QUFDQSxXQUFLRyxRQUFMO0FBQ0Q7O0FBRUQ7O0FBRUE7Ozs7Ozs7Ozs7NkJBT3dCO0FBQUEsVUFBakJOLFFBQWlCLHVFQUFOLElBQU07O0FBQ3RCLFVBQUlBLGFBQWEsSUFBakIsRUFDRSxLQUFLVSxjQUFMLENBQW9CVixRQUFwQixFQURGLEtBR0UsS0FBS1csVUFBTDs7QUFFRixVQUFJLEtBQUt0QixTQUFULEVBQ0UsS0FBS00sUUFBTCxDQUFjaUIsbUJBQVNDLEtBQXZCLEVBQThCRCxtQkFBU0UsTUFBdkMsRUFBK0NGLG1CQUFTeEIsV0FBeEQ7O0FBRUYsYUFBTyxLQUFLRSxHQUFaO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzJCQUtPO0FBQ0wsV0FBS0EsR0FBTCxDQUFTeUIsS0FBVCxDQUFlQyxPQUFmLEdBQXlCLE9BQXpCO0FBQ0EsV0FBSzNCLFNBQUwsR0FBaUIsSUFBakI7QUFDQTtBQUNBLFdBQUs0QixlQUFMO0FBQ0FMLHlCQUFTTSxpQkFBVCxDQUEyQixLQUFLdkIsUUFBaEM7QUFDRDs7QUFFRDs7Ozs7Ozs7MkJBS087QUFDTCxXQUFLTCxHQUFMLENBQVN5QixLQUFULENBQWVDLE9BQWYsR0FBeUIsTUFBekI7QUFDQSxXQUFLM0IsU0FBTCxHQUFpQixLQUFqQjs7QUFFQSxXQUFLOEIsaUJBQUw7QUFDQVAseUJBQVNRLG9CQUFULENBQThCLEtBQUt6QixRQUFuQztBQUNEOztBQUVEOzs7Ozs7OzZCQUlTO0FBQ1AsV0FBSzBCLElBQUw7QUFDQSxXQUFLL0IsR0FBTCxDQUFTZ0MsTUFBVDtBQUNEOztBQUVEOzs7Ozs7K0JBR1csQ0FBRTs7QUFFYjs7Ozs7Ozs7Ozs7Ozs2QkFVU3BDLGEsRUFBZUMsYyxFQUFnQkMsVyxFQUFhO0FBQ25ELFdBQUtGLGFBQUwsR0FBcUJBLGFBQXJCO0FBQ0EsV0FBS0MsY0FBTCxHQUFzQkEsY0FBdEI7QUFDQSxXQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjs7QUFFQSxXQUFLRSxHQUFMLENBQVN5QixLQUFULENBQWVGLEtBQWYsR0FBMEIzQixhQUExQjtBQUNBLFdBQUtJLEdBQUwsQ0FBU3lCLEtBQVQsQ0FBZUQsTUFBZixHQUEyQjNCLGNBQTNCO0FBQ0EsV0FBS0csR0FBTCxDQUFTa0IsU0FBVCxDQUFtQmMsTUFBbkIsQ0FBMEIsVUFBMUIsRUFBc0MsV0FBdEM7QUFDQSxXQUFLaEMsR0FBTCxDQUFTa0IsU0FBVCxDQUFtQkMsR0FBbkIsQ0FBdUJyQixXQUF2QjtBQUNEOztBQUVEOztBQUVBOzs7Ozs7Ozs7O2tDQU9jUixNLEVBQTBCO0FBQUEsVUFBbEIyQyxRQUFrQix1RUFBUCxLQUFPOztBQUN0QyxVQUFJLEtBQUtsQyxTQUFULEVBQ0UsS0FBSzhCLGlCQUFMOztBQUVGLFdBQUt2QyxNQUFMLEdBQWMyQyxXQUFXM0MsTUFBWCxHQUFvQixzQkFBYyxLQUFLQSxNQUFuQixFQUEyQkEsTUFBM0IsQ0FBbEM7O0FBRUEsVUFBSSxLQUFLUyxTQUFULEVBQ0UsS0FBSzRCLGVBQUw7QUFDSDs7QUFFRDs7Ozs7Ozs7c0NBS2tCO0FBQ2hCLFdBQUssSUFBSU8sR0FBVCxJQUFnQixLQUFLNUMsTUFBckIsRUFBNkI7QUFBQSx5QkFDRTRDLElBQUlDLEtBQUosQ0FBVSxJQUFWLENBREY7QUFBQTtBQUFBLFlBQ3BCQyxLQURvQjtBQUFBLFlBQ1YxQixRQURVOztBQUUzQixZQUFNMkIsV0FBVyxLQUFLL0MsTUFBTCxDQUFZNEMsR0FBWixDQUFqQjs7QUFFQSxhQUFLL0IsU0FBTCxDQUFlbUMsRUFBZixDQUFrQkYsS0FBbEIsRUFBeUIxQixTQUFTNkIsTUFBVCxHQUFrQjdCLFNBQVM4QixJQUFULENBQWMsR0FBZCxDQUFsQixHQUF1QyxJQUFoRSxFQUFzRUgsUUFBdEU7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozt3Q0FLb0I7QUFDbEIsV0FBS2xDLFNBQUwsQ0FBZXNDLEdBQWY7QUFDRDs7O3NCQW5MWXJELFEsRUFBVTtBQUNyQixVQUFJO0FBQ0YsYUFBS0ksS0FBTCxHQUFhLHNCQUFLSixRQUFMLENBQWI7QUFDRCxPQUZELENBRUUsT0FBTXNELEdBQU4sRUFBVztBQUNYLGNBQU0sSUFBSTlCLEtBQUosQ0FBVSw4RUFBOEV4QixRQUF4RixDQUFOO0FBQ0Q7QUFDRjs7Ozs7a0JBZ0xZRCxJIiwiZmlsZSI6IlZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdG1wbCBmcm9tICdsb2Rhc2gudGVtcGxhdGUnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuaW1wb3J0IERlbGVnYXRlIGZyb20gJ2RvbS1kZWxlZ2F0ZSc7XG5cbi8qKlxuICogSW50ZXJmYWNlIHJlcXVpcmVkIHRvIGNyZWF0ZSBhIHNvdW5kd29ya3MgY29tcGF0aWJsZSB2aWV3LlxuICpcbiAqIFRvIGNvbXBseSB3aXRoIHRoZSBzb3VuZHdvcmsncyBpbnRlcm5hbCB2aWV3IHN5c3RlbSAoY2YuIHZpZXdNYW5hZ2VyKSBhbnlcbiAqIHZpZXcgc2hvdWxkIGltcGxlbWVudCBhbiBpbnRlcmZhY2UgY29tcG9zZWQgb2YgMiBtZXRob2RzOiBgcmVuZGVyYCBhbmQgYHJlbW92ZWBcbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAaW50ZXJmYWNlIEFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIG1pbmltYWwgaW1wbGVtZW50YXRpb24gb2YgYSBzb3VuZHdvcmtzIGNvbXBsaWFudCB2aWV3XG4gKiBjbGFzcyBNeVZpZXcge1xuICogICBjb25zdHJ1Y3Rvcih0ZXh0KSB7XG4gKiAgICAgdGhpcy5tc2cgPSBtc2c7XG4gKiAgICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAqICAgfVxuICpcbiAqICAgcmVuZGVyKCkge1xuICogICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGA8aDE+JHt0aGlzLm1zZ308L2gxPmA7XG4gKiAgICAgcmV0dXJuIHRoaXMuJGVsO1xuICogICB9XG4gKlxuICogICByZW1vdmUoKSB7XG4gKiAgICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gKiAgIH1cbiAqIH1cbiAqL1xuLyoqXG4gKiBNZXRob2QgY2FsbGVkIHdoZW4gdGhlIHZpZXcgaXMgaW5zZXJ0ZWQgaW50byB0aGUgRE9NIGJ5IHRoZSBzZXJ2aWNlIG1hbmFnZXIuXG4gKlxuICogQG5hbWUgc2hvd1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAtIGltbXV0YWJsZSBET00gZWxlbWVudCBjb250YWluaW5nIHRoZSB2aWV3LlxuICovXG4vKipcbiAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgdmlldyBoYXMgdG8gYmUgdXBkYXRlZC4gVGhlIHJldHVybmVkIERPTSBlbGVtZW50XG4gKiBzaG91bGQgY29udGFpbiB0aGUgd2hvbGUgdmlldyBjb250ZW50IGFuZCBzaG91bGQgbm90IGJlIG11dGF0ZWQgZHVyaW5nIHRoZVxuICogd2hvbGUgbGlmZWN5Y2xlIG9mIHRoZSB2aWV3LlxuICpcbiAqIEBuYW1lIHJlbmRlclxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdFZpZXdcbiAqIEBmdW5jdGlvblxuICogQGFic3RyYWN0XG4gKiBAaW5zdGFuY2VcbiAqXG4gKiBAcmV0dXJuIHtFbGVtZW50fSAtIGltbXV0YWJsZSBET00gZWxlbWVudCBjb250YWluaW5nIHRoZSB2aWV3LlxuICovXG4vKipcbiAqIE1ldGhvZCBjYWxsZWQgd2hlbiB0aGUgdmlldyBpcyByZW1vdmVkIGluIHRoZSBET00gYnkgdGhlIGB2aWV3TWFuYWdlcmAuXG4gKlxuICogQG5hbWUgcmVtb3ZlXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGZ1bmN0aW9uXG4gKiBAYWJzdHJhY3RcbiAqIEBpbnN0YW5jZVxuICovXG5cbi8qKlxuICogQmFzZSBjbGFzcyBmb3Igdmlld3MuXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBWaWV3cyBzaG91bGQgYmUgY3JlYXRlZCB1c2luZ1xuICoge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eSNjcmVhdGVWaWV3fSBtZXRob2QuX1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZSAtIFRlbXBsYXRlIG9mIHRoZSB2aWV3LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBPYmplY3QgY29udGFpbmluZyB0aGUgdmFyaWFibGVzIHVzZWQgdG8gcG9wdWxhdGVcbiAqICB0aGUgdGVtcGxhdGUuIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNjb250ZW50fS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBMaXN0ZW5lcnMgdG8gaW5zdGFsbCBpbiB0aGUgdmlld1xuICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNldmVudHN9LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSB2aWV3LlxuICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvcHRpb25zfS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgbW9kZWwgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8qKlxuICAgICAqIEZ1bmN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCwgdG8gYmUgZXhlY3V0ZWQgd2l0aCB0aGVcbiAgICAgKiBgY29udGVudGAgb2JqZWN0LlxuICAgICAqXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqIEBuYW1lIHRtcGxcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3RtcGwgPSBudWxsO1xuXG4gICAgdGhpcy50ZW1wbGF0ZSA9IHRlbXBsYXRlO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSB1c2VkIHRvIHBvcHVsYXRlIHZhcmlhYmxlcyBkZWZpbmVkIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgY29udGVudFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDsgLy8gbW9kZWxcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuIFRoZSBrZXkgLyB2YWx1ZSBwYWlycyBtdXN0IGZvbGxvdyB0aGVcbiAgICAgKiBjb252ZW50aW9uOiBgJ2V2ZW50TmFtZSBbY3NzU2VsZWN0b3JdJzogY2FsbGJhY2tGdW5jdGlvbmBcbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgZXZlbnRzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBWaWV3LlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gW2VsPSdkaXYnXSAtIFR5cGUgb2YgRE9NIGVsZW1lbnQgb2YgdGhlIG1haW4gY29udGFpbmVyXG4gICAgICogIG9mIHRoZSB2aWV3LiBCYXNpY2FsbHkgdGhlIGFyZ3VtZW50IG9mIGBkb2N1bWVudC5jcmVhdGVFbGVtZW50YC5cbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gW2lkPW51bGxdIC0gSWQgb2YgdGhlIG1haW4gY29udGFpbmVyLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXk8U3RyaW5nPn0gW2NsYXNzTmFtZT1udWxsXSAtIENsYXNzZXMgb2YgdGhlIG1haW4gY29udGFpbmVyLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXk8U3RyaW5nPn0gW3ByaW9yaXR5PTBdIC0gUHJpb3JpdHkgb2YgdGhlIHZpZXcuIFRoaXMgdmFsdWVcbiAgICAgKiAgaXMgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYCB0byBkZWZpbmUgd2hpY2ggdmlldyBzaG91bGQgYXBwZWFyIGZpcnN0LlxuICAgICAqIEBuYW1lIG9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKlxuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC52aWV3IyRlbH1cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQudmlld01hbmFnZXJ9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBlbDogJ2RpdicsXG4gICAgICBpZDogbnVsbCxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFZpZXdwb3J0IHdpZHRoLlxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbmFtZSB2aWV3V2lkdGhcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQudmlld3BvcnR9XG4gICAgICovXG4gICAgdGhpcy52aWV3cG9ydFdpZHRoID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFZpZXdwb3J0IGhlaWdodC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgdmlld1dpZHRoXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdwb3J0fVxuICAgICAqL1xuICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXcgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAgICpcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBuYW1lIG9yaWVudGF0aW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdwb3J0fVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIGlmIHRoZSB2aWV3IGlzIHZpc2libGUgb3Igbm90LlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgaXNWaXNpYmxlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIERPTSBlbGVtZW50IG9mIHRoZSBtYWluIGNvbnRhaW5lciBvZiB0aGUgdmlldy4gRGVmYXVsdHMgdG8gYDxkaXY+YC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqIEBuYW1lICRlbFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMuZWwpO1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBldmVudCBkZWxlZ2F0aW9uXG4gICAgdGhpcy5fZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUodGhpcy4kZWwpO1xuICAgIHRoaXMub25SZXNpemUgPSB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmluc3RhbGxFdmVudHModGhpcy5ldmVudHMsIGZhbHNlKTtcbiAgfVxuXG4gIHNldCB0ZW1wbGF0ZSh0ZW1wbGF0ZSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl90bXBsID0gdG1wbCh0ZW1wbGF0ZSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0ZW1wbGF0ZSAobWFrZSBzdXJlIHlvdSBkbyBub3QgdXNlIGVzNiBzeW50YXggaW4gU2FmYXJpIG1vYmlsZSk6ICcgKyB0ZW1wbGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgYXBwZW5kVG8oJGNvbnRhaW5lcikge1xuICAgICRjb250YWluZXIuYXBwZW5kQ2hpbGQodGhpcy4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhcnRpYWxseSByZS1yZW5kZXIgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBzZWxlY3Rvci4gSWYgdGhlXG4gICAqIHNlbGVjdG9yIGlzIGFzc29jaWF0ZWQgdG8gYSBgY29tcG9uZW50YCwgdGhlIGBjb21wb25lbnRgIGlzIHJlbmRlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBDc3Mgc2VsZWN0b3Igb2YgdGhlIGVsZW1lbnQgdG8gcmVuZGVyLiBUaGVcbiAgICogIGVsZW1lbnQgaXRzZWxmIGlzIG5vdCB1cGRhdGVkLCBvbmx5IGl0cyBjb250ZW50LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpIHtcbiAgICBjb25zdCAkY29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICBpZiAoJGNvbnRhaW5lciA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2VsZWN0b3IgJHtzZWxlY3Rvcn0gZG9lc24ndCBtYXRjaCBhbnkgZWxlbWVudGApO1xuXG4gICAgY29uc3QgaHRtbCA9IHRoaXMuX3RtcGwodGhpcy5tb2RlbCk7XG4gICAgY29uc3QgJHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgJHRtcC5pbm5lckhUTUwgPSBodG1sO1xuICAgICRjb250YWluZXIuaW5uZXJIVE1MID0gJHRtcC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5pbm5lckhUTUw7XG4gICAgdGhpcy5vblJlbmRlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgd2hvbGUgdmlldyBhbmQgaXRzIGNvbXBvbmVudHMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVuZGVyQWxsKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG4gICAgLy8gc2V0IGlkIG9mIHRoZSBjb250YWluZXIgaWQgZ2l2ZW5cbiAgICBpZiAob3B0aW9ucy5pZClcbiAgICAgIHRoaXMuJGVsLmlkID0gb3B0aW9ucy5pZDtcbiAgICAvLyBzZXQgY2xhc3NlcyBvZiB0aGUgY29udGFpbmVyIGlmIGdpdmVuXG4gICAgaWYgKG9wdGlvbnMuY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBvcHRpb25zLmNsYXNzTmFtZTtcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSB0eXBlb2YgY2xhc3NOYW1lID09PSAnc3RyaW5nJyA/IFtjbGFzc05hbWVdIDogY2xhc3NOYW1lO1xuICAgICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKTtcbiAgICB9XG5cbiAgICAvLyByZW5kZXIgdGVtcGxhdGUgYW5kIGluc2VydCBpdCBpbiB0aGUgbWFpbiBlbGVtZW50XG4gICAgY29uc3QgaHRtbCA9IHRoaXMuX3RtcGwodGhpcy5tb2RlbCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB0aGlzLm9uUmVuZGVyKCk7XG4gIH1cblxuICAvLyBMSUZFIENZQ0xFIE1FVEhPRFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiB0ZW1wbGF0ZSBhbmQgY29udGVudC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcj1udWxsXSAtIElmIG5vdCBgbnVsbGAsIHJlbmRlcnMgb25seSB0aGUgcGFydCBvZlxuICAgKiAgdGhlIHZpZXcgaW5zaWRlIHRoZSBtYXRjaGVkIGVsZW1lbnQuIElmIHRoaXMgZWxlbWVudCBjb250YWlucyBhIGNvbXBvbmVudFxuICAgKiAgKHN1Yi12aWV3KSwgdGhlIGNvbXBvbmVudCBpcyByZW5kZXJlZC4gUmVuZGVyIHRoZSB3aG9sZSB2aWV3IG90aGVyd2lzZS5cbiAgICovXG4gIHJlbmRlcihzZWxlY3RvciA9IG51bGwpIHtcbiAgICBpZiAoc2VsZWN0b3IgIT09IG51bGwpXG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9yZW5kZXJBbGwoKTtcblxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMub25SZXNpemUodmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCwgdmlld3BvcnQub3JpZW50YXRpb24pO1xuXG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIHZpZXcuIEV4ZWN1dGVkIGJ5IHRoZSBgdmlld01hbmFnZXJgLlxuICAgKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2hvdygpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgLy8gbXVzdCByZXNpemUgYmVmb3JlIGNoaWxkIGNvbXBvbmVudFxuICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQuYWRkUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBhbmQgdW5pbnN0YWxsIGV2ZW50cy4gRXhlY3V0ZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmAuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoaWRlKCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcbiAgICB2aWV3cG9ydC5yZW1vdmVSZXNpemVMaXN0ZW5lcih0aGlzLm9uUmVzaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIHZpZXcgZnJvbSBpdCdzIGNvbnRhaW5lci4gRXhlY3V0ZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmAuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gIH1cblxuICAvKipcbiAgICogSW50ZXJmYWNlIG1ldGhvZCB0byBleHRlbmQsIGV4ZWN1dGVkIHdoZW4gdGhlIERPTSBpcyBjcmVhdGVkLlxuICAgKi9cbiAgb25SZW5kZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBleGVjdXRlZCBvbiBgcmVzaXplYCBldmVudHMuIEJ5IGRlZmF1bHQsIG1haW50YWlucyB0aGUgc2l6ZVxuICAgKiBvZiB0aGUgY29udGFpbmVyIHRvIGZpdCB0aGUgdmlld3BvcnQgc2l6ZS4gVGhlIG1ldGhvZCBpcyBhbHNvIGV4ZWN1dGVkIHdoZW5cbiAgICogdGhlIHZpZXcgaXMgaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBXaWR0aCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydEhlaWdodCAtIEhlaWdodCBvZiB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcmllbnRhdGlvbiAtIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydC5cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdwb3J0fVxuICAgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgdGhpcy52aWV3cG9ydFdpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB0aGlzLnZpZXdwb3J0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuXG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSBgJHt2aWV3cG9ydFdpZHRofXB4YDtcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSBgJHt2aWV3cG9ydEhlaWdodH1weGA7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgncG9ydHJhaXQnLCAnbGFuZHNjYXBlJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZChvcmllbnRhdGlvbik7XG4gIH1cblxuICAvLyBFVkVOVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBJbnN0YWxsIGV2ZW50cyBvbiB0aGUgdmlldy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBGdW5jdGlvbj59IGV2ZW50cyAtIEFuIG9iamVjdCBvZiBldmVudHMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW292ZXJyaWRlPWZhbHNlXSAtIERlZmluZXMgaWYgdGhlIG5ldyBldmVudHMgYWRkZWQgdG8gdGhlXG4gICAqICB0aGUgb2xkIG9uZSBvciBpZiB0aGV5IHJlcGxhY2UgdGhlbS5cbiAgICovXG4gIGluc3RhbGxFdmVudHMoZXZlbnRzLCBvdmVycmlkZSA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuXG4gICAgdGhpcy5ldmVudHMgPSBvdmVycmlkZSA/IGV2ZW50cyA6IE9iamVjdC5hc3NpZ24odGhpcy5ldmVudHMsIGV2ZW50cyk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBldmVudCBsaXN0ZW5lcnMgb24gdGhlIHZpZXcuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICBjb25zdCBbZXZlbnQsIC4uLnNlbGVjdG9yXSA9IGtleS5zcGxpdCgvICsvKTtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5ldmVudHNba2V5XTtcblxuICAgICAgdGhpcy5fZGVsZWdhdGUub24oZXZlbnQsIHNlbGVjdG9yLmxlbmd0aCA/IHNlbGVjdG9yLmpvaW4oJyAnKSA6wqBudWxsLCBjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdmlldy5cbiAgICpcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91bmRlbGVnYXRlRXZlbnRzKCkge1xuICAgIHRoaXMuX2RlbGVnYXRlLm9mZigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZpZXc7XG4iXX0=
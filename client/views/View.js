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
 * Base class for the views.
 *
 * @memberof module:soundworks/client
 */
var View = function () {
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
  function View(template) {
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck3.default)(this, View);

    /**
     * A function created from the given `template`, to be called with `content` object.
     * @type {Function}
     * @private
     */
    this.tmpl = (0, _lodash2.default)(template);

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
     * @property {String} [id=null] - String to be used as the `id` of `this.$el`.
     * @property {Array<String>} [className=null] - Array of class to apply to
     *  `this.$el`.
     * @property {Array<String>} [priority=0] - Priority of the view, the view manager
     *  uses this value in order to decide which view should be displayed first.
     * @name options
     * @instance
     * @memberof module:soundworks/client.View
     */
    this.options = (0, _assign2.default)({
      el: 'div',
      id: null,
      className: null,
      priority: 0
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

    this._delegate = new _domDelegate2.default(this.$el);
    this.onResize = this.onResize.bind(this);

    this.installEvents(this.events, false);
  }

  /**
   * Add or remove a compound view inside the current view.
   * @param {String} selector - Css selector matching an element of the template.
   * @param {View} [view=null] - View to insert inside the selector. If `null`
   *  destroy the component.
   */


  (0, _createClass3.default)(View, [{
    key: 'setViewComponent',
    value: function setViewComponent(selector) {
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var prevView = this._components[selector];
      if (prevView instanceof View) {
        prevView.remove();
      }

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

  }, {
    key: 'setParentView',
    value: function setParentView(view) {
      this.parentView = view;
    }

    /**
     * Execute a method on all the `components` (sub-views).
     * @param {String} method - The name of the method to be executed.
     * @param {...Mixed} args - Arguments for the given method.
     * @private
     */

  }, {
    key: '_executeViewComponentMethod',
    value: function _executeViewComponentMethod(method) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var selector in this._components) {
        var view = this._components[selector];
        view[method].apply(view, args);
      }
    }

    /**
     * Render partially the view according to the given selector. If the selector
     * is associated to a `component` (sub-views), the `component` is rendered.
     * @param {String} selector - Css selector matching an element of the view.
     * @private
     */

  }, {
    key: '_renderPartial',
    value: function _renderPartial(selector) {
      var $componentContainer = this.$el.querySelector(selector);

      if ($componentContainer === null) throw new Error('selector ' + selector + ' doesn\'t match any element');

      var component = this._components[selector];
      $componentContainer.innerHTML = '';

      if (component) {
        component.render();
        component.appendTo($componentContainer);
        component.onRender();

        if (this.isVisible) component.show();else component.hide();
      } else {
        var html = this.tmpl(this.content);
        var $tmp = document.createElement('div');
        $tmp.innerHTML = html;
        $componentContainer.innerHTML = $tmp.querySelector(selector).innerHTML;
        this.onRender();
      }
    }

    /**
     * Render the whole view and its component (sub-views).
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
      var html = this.tmpl(this.content);
      this.$el.innerHTML = html;
      this.onRender();

      for (var selector in this._components) {
        this._renderPartial(selector);
      }
    }

    // LIFE CYCLE METHODS ----------------------------------

    /**
     * Render the view according to the given template and content.
     * @param {String} [selector=null] - If not `null`, renders only the part of
     *  the view inside the matched element. If this element contains a component
     *  (sub-view), the component is rendered. Renders all the view otherwise.
     */

  }, {
    key: 'render',
    value: function render() {
      var selector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (selector !== null) this._renderPartial(selector);else this._renderAll();

      if (this.isVisible) this.onResize(_viewport2.default.width, _viewport2.default.height, _viewport2.default.orientation, true);
    }

    /**
     * Insert the view (`this.$el`) into the given element.
     * @param {Element} $parent - Element inside which the view must be inserted.
     * @private
     */

  }, {
    key: 'appendTo',
    value: function appendTo($parent) {
      this.$parent = $parent;
      $parent.appendChild(this.$el);
    }

    /**
     * Show the view. This method should only be used by the `viewManager`.
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

      this._executeViewComponentMethod('show');
    }

    /**
     * Hide the view and uninstall events. This method should only be used by
     * the `viewManager`.
     * @private
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.$el.style.display = 'none';
      this.isVisible = false;

      this._undelegateEvents();
      _viewport2.default.removeResizeListener(this.onResize);

      this._executeViewComponentMethod('hide');
    }

    /**
     * Cleanly remove the view from it's container. This method should only be
     * used by the `viewManager`.
     * @private
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.hide();
      this.$el.remove();
      this._executeViewComponentMethod('remove');
    }

    /**
     * Entry point when the DOM is created, is mainly exposed to cache some DOM
     * elements.
     */

  }, {
    key: 'onRender',
    value: function onRender() {}

    /**
     * Callback for `viewport.resize` event, it maintains `this.$el` size
     * to fit the viewport size. The method is also called once when the
     * view is actually inserted into the DOM.
     *
     * @param {Number} viewportWidth - Width of the viewport _(in pixels)_.
     * @param {Number} viewportHeight - Height of the viewport _(in pixels)_.
     * @param {String} orientation - Orientation of the viewport.
     * @see {@link module:soundworks/client.viewport}
     */

  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      var propagate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;
      this.orientation = orientation;

      this.$el.style.width = viewportWidth + 'px';
      this.$el.style.height = viewportHeight + 'px';
      this.$el.classList.remove('portrait', 'landscape');
      this.$el.classList.add(orientation);

      if (propagate) this._executeViewComponentMethod('onResize', viewportWidth, viewportHeight, orientation);
    }

    // EVENTS ----------------------------------------

    /**
     * Install events on the view at any moment of its lifecycle.
     * @param {Object<String, Function>} events - An object of events.
     * @param {Boolean} [override=false] - Defines whether the previous events
     *  are replaced with the new ones.
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
     * @todo - remove delegation ?
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
     * @todo - remove delegation ?
     * @private
     */

  }, {
    key: '_undelegateEvents',
    value: function _undelegateEvents() {
      this._delegate.off();
    }
  }]);
  return View;
}();

exports.default = View;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlZpZXcuanMiXSwibmFtZXMiOlsiVmlldyIsInRlbXBsYXRlIiwiY29udGVudCIsImV2ZW50cyIsIm9wdGlvbnMiLCJ0bXBsIiwiZWwiLCJpZCIsImNsYXNzTmFtZSIsInByaW9yaXR5Iiwib3JpZW50YXRpb24iLCJpc1Zpc2libGUiLCJwYXJlbnRWaWV3IiwiJGVsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiX2NvbXBvbmVudHMiLCJfZGVsZWdhdGUiLCJvblJlc2l6ZSIsImJpbmQiLCJpbnN0YWxsRXZlbnRzIiwic2VsZWN0b3IiLCJ2aWV3IiwicHJldlZpZXciLCJyZW1vdmUiLCJzZXRQYXJlbnRWaWV3IiwibWV0aG9kIiwiYXJncyIsIiRjb21wb25lbnRDb250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwiRXJyb3IiLCJjb21wb25lbnQiLCJpbm5lckhUTUwiLCJyZW5kZXIiLCJhcHBlbmRUbyIsIm9uUmVuZGVyIiwic2hvdyIsImhpZGUiLCJodG1sIiwiJHRtcCIsImNsYXNzZXMiLCJjbGFzc0xpc3QiLCJhZGQiLCJfcmVuZGVyUGFydGlhbCIsIl9yZW5kZXJBbGwiLCJ3aWR0aCIsImhlaWdodCIsIiRwYXJlbnQiLCJhcHBlbmRDaGlsZCIsInN0eWxlIiwiZGlzcGxheSIsIl9kZWxlZ2F0ZUV2ZW50cyIsImFkZFJlc2l6ZUxpc3RlbmVyIiwiX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kIiwiX3VuZGVsZWdhdGVFdmVudHMiLCJyZW1vdmVSZXNpemVMaXN0ZW5lciIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsInByb3BhZ2F0ZSIsIm92ZXJyaWRlIiwia2V5Iiwic3BsaXQiLCJldmVudCIsImNhbGxiYWNrIiwib24iLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQTs7Ozs7SUFLTUEsSTtBQUNKOzs7Ozs7Ozs7Ozs7O0FBYUEsZ0JBQVlD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cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRtcGwgZnJvbSAnbG9kYXNoLnRlbXBsYXRlJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuL3ZpZXdwb3J0JztcbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICdkb20tZGVsZWdhdGUnO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgZm9yIHRoZSB2aWV3cy5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIFZpZXcge1xuICAvKipcbiAgICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBWaWV3cyBzaG91bGQgcHJlZmVyYWJseSBieVxuICAgKiBjcmVhdGVkIHVzaW5nIHRoZSBbYEV4cGVyaWVuY2UjY3JlYXRlVmlld2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5FeHBlcmllbmNlI2NyZWF0ZVZpZXd9XG4gICAqIG1ldGhvZC5fXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZSAtIFRlbXBsYXRlIG9mIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIE9iamVjdCBjb250YWluaW5nIHRoZSB2YXJpYWJsZXMgdXNlZCB0byBwb3B1bGF0ZVxuICAgKiAgdGhlIHRlbXBsYXRlLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjY29udGVudH0uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBMaXN0ZW5lcnMgdG8gaW5zdGFsbCBpbiB0aGUgdmlld1xuICAgKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2V2ZW50c30uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgdmlldy5cbiAgICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvcHRpb25zfS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCwgdG8gYmUgY2FsbGVkIHdpdGggYGNvbnRlbnRgIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLnRtcGwgPSB0bXBsKHRlbXBsYXRlKTtcblxuICAgIC8qKlxuICAgICAqIERhdGEgdG8gYmUgdXNlZCBpbiBvcmRlciB0byBwb3B1bGF0ZSB0aGUgdmFyaWFibGVzIG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIGNvbnRlbnRcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy4gRWFjaCBlbnRyeSBtdXN0IGZvbGxvdyB0aGUgY29udmVudGlvbjpcbiAgICAgKiBgJ2V2ZW50TmFtZSBbY3NzU2VsZWN0b3JdJzogY2FsbGJhY2tGdW5jdGlvbmBcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIGV2ZW50c1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgVmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbZWw9J2RpdiddIC0gU3RyaW5nIHRvIGJlIHVzZWQgYXMgYXJndW1lbnQgb2ZcbiAgICAgKiAgYGRvY3VtZW50LmNyZWF0ZUVsZW1lbnRgIHRvIGNyZWF0ZSB0aGUgY29udGFpbmVyIG9mIHRoZSB2aWV3IChgdGhpcy4kZWxgKS5cbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gW2lkPW51bGxdIC0gU3RyaW5nIHRvIGJlIHVzZWQgYXMgdGhlIGBpZGAgb2YgYHRoaXMuJGVsYC5cbiAgICAgKiBAcHJvcGVydHkge0FycmF5PFN0cmluZz59IFtjbGFzc05hbWU9bnVsbF0gLSBBcnJheSBvZiBjbGFzcyB0byBhcHBseSB0b1xuICAgICAqICBgdGhpcy4kZWxgLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXk8U3RyaW5nPn0gW3ByaW9yaXR5PTBdIC0gUHJpb3JpdHkgb2YgdGhlIHZpZXcsIHRoZSB2aWV3IG1hbmFnZXJcbiAgICAgKiAgdXNlcyB0aGlzIHZhbHVlIGluIG9yZGVyIHRvIGRlY2lkZSB3aGljaCB2aWV3IHNob3VsZCBiZSBkaXNwbGF5ZWQgZmlyc3QuXG4gICAgICogQG5hbWUgb3B0aW9uc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZWw6ICdkaXYnLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgICBwcmlvcml0eTogMCxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFByaW9yaXR5IG9mIHRoZSB2aWV3LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgcHJpb3JpdHlcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLnByaW9yaXR5ID0gdGhpcy5vcHRpb25zLnByaW9yaXR5O1xuXG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXcgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAbmFtZSBvcmllbnRhdGlvblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIHZpZXcgaXMgY3VycmVudGx5IHZpc2libGUgb3Igbm90LlxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqIEBuYW1lIGlzVmlzaWJsZVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgdmlldyBpcyBhIGNvbXBvbmVudCwgcG9pbnRlciB0byB0aGUgcGFyZW50IHZpZXcuXG4gICAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3fVxuICAgICAqIEBuYW1lIHBhcmVudFZpZXdcbiAgICAgKiBAZGVmYXVsdCBudWxsXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5wYXJlbnRWaWV3ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjb250YWluZXIgZWxlbWVudCBvZiB0aGUgdmlldy4gRGVmYXVsdHMgdG8gYDxkaXY+YC5cbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKiBAbmFtZSAkZWxcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5vcHRpb25zLmVsKTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIHRoZSBjb21wb25lbnRzIChzdWItdmlld3MpIG9mIHRoZSB2aWV3LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgdGhpcy5fZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUodGhpcy4kZWwpO1xuICAgIHRoaXMub25SZXNpemUgPSB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmluc3RhbGxFdmVudHModGhpcy5ldmVudHMsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgcmVtb3ZlIGEgY29tcG91bmQgdmlldyBpbnNpZGUgdGhlIGN1cnJlbnQgdmlldy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIC0gQ3NzIHNlbGVjdG9yIG1hdGNoaW5nIGFuIGVsZW1lbnQgb2YgdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0ge1ZpZXd9IFt2aWV3PW51bGxdIC0gVmlldyB0byBpbnNlcnQgaW5zaWRlIHRoZSBzZWxlY3Rvci4gSWYgYG51bGxgXG4gICAqICBkZXN0cm95IHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBzZXRWaWV3Q29tcG9uZW50KHNlbGVjdG9yLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByZXZWaWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgaWYgKHByZXZWaWV3IGluc3RhbmNlb2YgVmlldykgeyBwcmV2Vmlldy5yZW1vdmUoKTsgfVxuXG4gICAgaWYgKHZpZXcgPT09IG51bGwpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl0gPSB2aWV3O1xuICAgICAgdmlldy5zZXRQYXJlbnRWaWV3KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwYXJlbnQgd2hlbiBpcyBhIGNvbXBvbmVudCB2aWV3LlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBQYXJlbnQgdmlldy5cbiAgICpcbiAgICovXG4gIHNldFBhcmVudFZpZXcodmlldykge1xuICAgIHRoaXMucGFyZW50VmlldyA9IHZpZXc7XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIG1ldGhvZCBvbiBhbGwgdGhlIGBjb21wb25lbnRzYCAoc3ViLXZpZXdzKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCAtIFRoZSBuYW1lIG9mIHRoZSBtZXRob2QgdG8gYmUgZXhlY3V0ZWQuXG4gICAqIEBwYXJhbSB7Li4uTWl4ZWR9IGFyZ3MgLSBBcmd1bWVudHMgZm9yIHRoZSBnaXZlbiBtZXRob2QuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QobWV0aG9kLCAuLi5hcmdzKSB7XG4gICAgZm9yIChsZXQgc2VsZWN0b3IgaW4gdGhpcy5fY29tcG9uZW50cykge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgICAgdmlld1ttZXRob2RdKC4uLmFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgcGFydGlhbGx5IHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gc2VsZWN0b3IuIElmIHRoZSBzZWxlY3RvclxuICAgKiBpcyBhc3NvY2lhdGVkIHRvIGEgYGNvbXBvbmVudGAgKHN1Yi12aWV3cyksIHRoZSBgY29tcG9uZW50YCBpcyByZW5kZXJlZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIC0gQ3NzIHNlbGVjdG9yIG1hdGNoaW5nIGFuIGVsZW1lbnQgb2YgdGhlIHZpZXcuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVuZGVyUGFydGlhbChzZWxlY3Rvcikge1xuICAgIGNvbnN0ICRjb21wb25lbnRDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcblxuICAgIGlmICgkY29tcG9uZW50Q29udGFpbmVyID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzZWxlY3RvciAke3NlbGVjdG9yfSBkb2Vzbid0IG1hdGNoIGFueSBlbGVtZW50YCk7XG5cbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAkY29tcG9uZW50Q29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LnJlbmRlcigpO1xuICAgICAgY29tcG9uZW50LmFwcGVuZFRvKCRjb21wb25lbnRDb250YWluZXIpO1xuICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgICAgY29tcG9uZW50LnNob3coKTtcbiAgICAgIGVsc2VcbiAgICAgICAgY29tcG9uZW50LmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLmNvbnRlbnQpO1xuICAgICAgY29uc3QgJHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgJHRtcC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAkdG1wLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTDtcbiAgICAgIHRoaXMub25SZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB3aG9sZSB2aWV3IGFuZCBpdHMgY29tcG9uZW50IChzdWItdmlld3MpLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlbmRlckFsbCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIC8vIHNldCBpZCBvZiB0aGUgY29udGFpbmVyIGlkIGdpdmVuXG4gICAgaWYgKG9wdGlvbnMuaWQpXG4gICAgICB0aGlzLiRlbC5pZCA9IG9wdGlvbnMuaWQ7XG4gICAgLy8gc2V0IGNsYXNzZXMgb2YgdGhlIGNvbnRhaW5lciBpZiBnaXZlblxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XG4gICAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIGNsYXNzTmFtZSA9PT0gJ3N0cmluZycgPyBbY2xhc3NOYW1lXSA6IGNsYXNzTmFtZTtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIHRlbXBsYXRlIGFuZCBpbnNlcnQgaXQgaW4gdGhlIG1haW4gZWxlbWVudFxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHRoaXMub25SZW5kZXIoKTtcblxuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpXG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgfVxuXG4gIC8vIExJRkUgQ1lDTEUgTUVUSE9EUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHRlbXBsYXRlIGFuZCBjb250ZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3NlbGVjdG9yPW51bGxdIC0gSWYgbm90IGBudWxsYCwgcmVuZGVycyBvbmx5IHRoZSBwYXJ0IG9mXG4gICAqICB0aGUgdmlldyBpbnNpZGUgdGhlIG1hdGNoZWQgZWxlbWVudC4gSWYgdGhpcyBlbGVtZW50IGNvbnRhaW5zIGEgY29tcG9uZW50XG4gICAqICAoc3ViLXZpZXcpLCB0aGUgY29tcG9uZW50IGlzIHJlbmRlcmVkLiBSZW5kZXJzIGFsbCB0aGUgdmlldyBvdGhlcndpc2UuXG4gICAqL1xuICByZW5kZXIoc2VsZWN0b3IgPSBudWxsKSB7XG4gICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLm9uUmVzaXplKHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQsIHZpZXdwb3J0Lm9yaWVudGF0aW9uLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgdGhlIHZpZXcgKGB0aGlzLiRlbGApIGludG8gdGhlIGdpdmVuIGVsZW1lbnQuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHBhcmVudCAtIEVsZW1lbnQgaW5zaWRlIHdoaWNoIHRoZSB2aWV3IG11c3QgYmUgaW5zZXJ0ZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhcHBlbmRUbygkcGFyZW50KSB7XG4gICAgdGhpcy4kcGFyZW50ID0gJHBhcmVudDtcbiAgICAkcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSB2aWV3LiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IHRoZSBgdmlld01hbmFnZXJgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc2hvdygpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgLy8gbXVzdCByZXNpemUgYmVmb3JlIGNoaWxkIGNvbXBvbmVudFxuICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQuYWRkUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG5cbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnc2hvdycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIHZpZXcgYW5kIHVuaW5zdGFsbCBldmVudHMuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnlcbiAgICogdGhlIGB2aWV3TWFuYWdlcmAuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBoaWRlKCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcbiAgICB2aWV3cG9ydC5yZW1vdmVSZXNpemVMaXN0ZW5lcih0aGlzLm9uUmVzaXplKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdoaWRlJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW5seSByZW1vdmUgdGhlIHZpZXcgZnJvbSBpdCdzIGNvbnRhaW5lci4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmVcbiAgICogdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLiRlbC5yZW1vdmUoKTtcbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgncmVtb3ZlJyk7XG4gIH1cblxuICAvKipcbiAgICogRW50cnkgcG9pbnQgd2hlbiB0aGUgRE9NIGlzIGNyZWF0ZWQsIGlzIG1haW5seSBleHBvc2VkIHRvIGNhY2hlIHNvbWUgRE9NXG4gICAqIGVsZW1lbnRzLlxuICAgKi9cbiAgb25SZW5kZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgYHZpZXdwb3J0LnJlc2l6ZWAgZXZlbnQsIGl0IG1haW50YWlucyBgdGhpcy4kZWxgIHNpemVcbiAgICogdG8gZml0IHRoZSB2aWV3cG9ydCBzaXplLiBUaGUgbWV0aG9kIGlzIGFsc28gY2FsbGVkIG9uY2Ugd2hlbiB0aGVcbiAgICogdmlldyBpcyBhY3R1YWxseSBpbnNlcnRlZCBpbnRvIHRoZSBET00uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydFdpZHRoIC0gV2lkdGggb2YgdGhlIHZpZXdwb3J0IF8oaW4gcGl4ZWxzKV8uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydEhlaWdodCAtIEhlaWdodCBvZiB0aGUgdmlld3BvcnQgXyhpbiBwaXhlbHMpXy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9yaWVudGF0aW9uIC0gT3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0LlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQudmlld3BvcnR9XG4gICAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24sIHByb3BhZ2F0ZSA9IGZhbHNlKSB7XG4gICAgdGhpcy52aWV3cG9ydFdpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB0aGlzLnZpZXdwb3J0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQ7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuXG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSBgJHt2aWV3cG9ydFdpZHRofXB4YDtcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSBgJHt2aWV3cG9ydEhlaWdodH1weGA7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgncG9ydHJhaXQnLCAnbGFuZHNjYXBlJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZChvcmllbnRhdGlvbik7XG5cbiAgICBpZiAocHJvcGFnYXRlKVxuICAgICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ29uUmVzaXplJywgdmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgfVxuXG4gIC8vIEVWRU5UUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEluc3RhbGwgZXZlbnRzIG9uIHRoZSB2aWV3IGF0IGFueSBtb21lbnQgb2YgaXRzIGxpZmVjeWNsZS5cbiAgICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBGdW5jdGlvbj59IGV2ZW50cyAtIEFuIG9iamVjdCBvZiBldmVudHMuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW292ZXJyaWRlPWZhbHNlXSAtIERlZmluZXMgd2hldGhlciB0aGUgcHJldmlvdXMgZXZlbnRzXG4gICAqICBhcmUgcmVwbGFjZWQgd2l0aCB0aGUgbmV3IG9uZXMuXG4gICAqL1xuICBpbnN0YWxsRXZlbnRzKGV2ZW50cywgb3ZlcnJpZGUgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcblxuICAgIHRoaXMuZXZlbnRzID0gb3ZlcnJpZGUgPyBldmVudHMgOiBPYmplY3QuYXNzaWduKHRoaXMuZXZlbnRzLCBldmVudHMpO1xuXG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIG9uIHRoZSB2aWV3LlxuICAgKiBAdG9kbyAtIHJlbW92ZSBkZWxlZ2F0aW9uID9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuXG4gICAgICB0aGlzLl9kZWxlZ2F0ZS5vbihldmVudCwgc2VsZWN0b3IgfHzCoG51bGwsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBmcm9tIHRoZSB2aWV3LlxuICAgKiBAdG9kbyAtIHJlbW92ZSBkZWxlZ2F0aW9uID9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF91bmRlbGVnYXRlRXZlbnRzKCkge1xuICAgIHRoaXMuX2RlbGVnYXRlLm9mZigpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFZpZXc7XG4iXX0=
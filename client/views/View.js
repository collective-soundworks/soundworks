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
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
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
      var view = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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
      var selector = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

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
      var propagate = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

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
      var override = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

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
        var _key$split = key.split(/ +/);

        var _key$split2 = (0, _slicedToArray3.default)(_key$split, 2);

        var event = _key$split2[0];
        var selector = _key$split2[1];

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
//# sourceMappingURL=data:application/json;base64,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QUFJLFNBQUosRUFDRSxLQUFLLDJCQUFMLENBQWlDLFVBQWpDLEVBQTZDLGFBQTdDLEVBQTRELGNBQTVELEVBQTRFLFdBQTVFO0FBQ0g7Ozs7Ozs7Ozs7Ozs7a0NBVWEsTSxFQUEwQjtBQUFBLFVBQWxCLFFBQWtCLHlEQUFQLEtBQU87O0FBQ3RDLFVBQUksS0FBSyxTQUFULEVBQ0UsS0FBSyxpQkFBTDs7QUFFRixXQUFLLE1BQUwsR0FBYyxXQUFXLE1BQVgsR0FBb0Isc0JBQWMsS0FBSyxNQUFuQixFQUEyQixNQUEzQixDQUFsQzs7QUFFQSxVQUFJLEtBQUssU0FBVCxFQUNFLEtBQUssZUFBTDtBQUNIOzs7Ozs7Ozs7O3NDQU9pQjtBQUNoQixXQUFLLElBQUksR0FBVCxJQUFnQixLQUFLLE1BQXJCLEVBQTZCO0FBQUEseUJBQ0QsSUFBSSxLQUFKLENBQVUsSUFBVixDQURDOztBQUFBOztBQUFBLFlBQ3BCLEtBRG9CO0FBQUEsWUFDYixRQURhOztBQUUzQixZQUFNLFdBQVcsS0FBSyxNQUFMLENBQVksR0FBWixDQUFqQjs7QUFFQSxhQUFLLFNBQUwsQ0FBZSxFQUFmLENBQWtCLEtBQWxCLEVBQXlCLFlBQVksSUFBckMsRUFBMkMsUUFBM0M7QUFDRDtBQUNGOzs7Ozs7Ozs7O3dDQU9tQjtBQUNsQixXQUFLLFNBQUwsQ0FBZSxHQUFmO0FBQ0Q7Ozs7O2tCQUdZLEkiLCJmaWxlIjoiVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0bXBsIGZyb20gJ2xvZGFzaC50ZW1wbGF0ZSc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi92aWV3cG9ydCc7XG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnZG9tLWRlbGVnYXRlJztcblxuLyoqXG4gKiBCYXNlIGNsYXNzIGZvciB0aGUgdmlld3MuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBWaWV3IHtcbiAgLyoqXG4gICAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVmlld3Mgc2hvdWxkIHByZWZlcmFibHkgYnlcbiAgICogY3JlYXRlZCB1c2luZyB0aGUgW2BFeHBlcmllbmNlI2NyZWF0ZVZpZXdgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRXhwZXJpZW5jZSNjcmVhdGVWaWV3fVxuICAgKiBtZXRob2QuX1xuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGVtcGxhdGUgLSBUZW1wbGF0ZSBvZiB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBPYmplY3QgY29udGFpbmluZyB0aGUgdmFyaWFibGVzIHVzZWQgdG8gcG9wdWxhdGVcbiAgICogIHRoZSB0ZW1wbGF0ZS4ge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2NvbnRlbnR9LlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gTGlzdGVuZXJzIHRvIGluc3RhbGwgaW4gdGhlIHZpZXdcbiAgICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNldmVudHN9LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgb2YgdGhlIHZpZXcuXG4gICAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjb3B0aW9uc30uXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGB0ZW1wbGF0ZWAsIHRvIGJlIGNhbGxlZCB3aXRoIGBjb250ZW50YCBvYmplY3QuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy50bXBsID0gdG1wbCh0ZW1wbGF0ZSk7XG5cbiAgICAvKipcbiAgICAgKiBEYXRhIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gcG9wdWxhdGUgdGhlIHZhcmlhYmxlcyBvZiB0aGUgdGVtcGxhdGUuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBjb250ZW50XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuIEVhY2ggZW50cnkgbXVzdCBmb2xsb3cgdGhlIGNvbnZlbnRpb246XG4gICAgICogYCdldmVudE5hbWUgW2Nzc1NlbGVjdG9yXSc6IGNhbGxiYWNrRnVuY3Rpb25gXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBldmVudHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIFZpZXcuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge1N0cmluZ30gW2VsPSdkaXYnXSAtIFN0cmluZyB0byBiZSB1c2VkIGFzIGFyZ3VtZW50IG9mXG4gICAgICogIGBkb2N1bWVudC5jcmVhdGVFbGVtZW50YCB0byBjcmVhdGUgdGhlIGNvbnRhaW5lciBvZiB0aGUgdmlldyAoYHRoaXMuJGVsYCkuXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IFtpZD1udWxsXSAtIFN0cmluZyB0byBiZSB1c2VkIGFzIHRoZSBgaWRgIG9mIGB0aGlzLiRlbGAuXG4gICAgICogQHByb3BlcnR5IHtBcnJheTxTdHJpbmc+fSBbY2xhc3NOYW1lPW51bGxdIC0gQXJyYXkgb2YgY2xhc3MgdG8gYXBwbHkgdG9cbiAgICAgKiAgYHRoaXMuJGVsYC5cbiAgICAgKiBAcHJvcGVydHkge0FycmF5PFN0cmluZz59IFtwcmlvcml0eT0wXSAtIFByaW9yaXR5IG9mIHRoZSB2aWV3LCB0aGUgdmlldyBtYW5hZ2VyXG4gICAgICogIHVzZXMgdGhpcyB2YWx1ZSBpbiBvcmRlciB0byBkZWNpZGUgd2hpY2ggdmlldyBzaG91bGQgYmUgZGlzcGxheWVkIGZpcnN0LlxuICAgICAqIEBuYW1lIG9wdGlvbnNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGVsOiAnZGl2JyxcbiAgICAgIGlkOiBudWxsLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgcHJpb3JpdHk6IDAsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBQcmlvcml0eSBvZiB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqIEBuYW1lIHByaW9yaXR5XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy5wcmlvcml0eSA9IHRoaXMub3B0aW9ucy5wcmlvcml0eTtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQG5hbWUgb3JpZW50YXRpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSB2aWV3IGlzIGN1cnJlbnRseSB2aXNpYmxlIG9yIG5vdC5cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBpc1Zpc2libGVcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXdcbiAgICAgKi9cbiAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogSWYgdGhlIHZpZXcgaXMgYSBjb21wb25lbnQsIHBvaW50ZXIgdG8gdGhlIHBhcmVudCB2aWV3LlxuICAgICAqIEB0eXBlIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld31cbiAgICAgKiBAbmFtZSBwYXJlbnRWaWV3XG4gICAgICogQGRlZmF1bHQgbnVsbFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld1xuICAgICAqL1xuICAgIHRoaXMucGFyZW50VmlldyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGVsZW1lbnQgb2YgdGhlIHZpZXcuIERlZmF1bHRzIHRvIGA8ZGl2PmAuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICogQG5hbWUgJGVsXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5lbCk7XG5cbiAgICAvKipcbiAgICAgKiBTdG9yZSB0aGUgY29tcG9uZW50cyAoc3ViLXZpZXdzKSBvZiB0aGUgdmlldy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2NvbXBvbmVudHMgPSB7fTtcblxuICAgIHRoaXMuX2RlbGVnYXRlID0gbmV3IERlbGVnYXRlKHRoaXMuJGVsKTtcbiAgICB0aGlzLm9uUmVzaXplID0gdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHRoaXMuZXZlbnRzLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHJlbW92ZSBhIGNvbXBvdW5kIHZpZXcgaW5zaWRlIHRoZSBjdXJyZW50IHZpZXcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciAtIENzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHtWaWV3fSBbdmlldz1udWxsXSAtIFZpZXcgdG8gaW5zZXJ0IGluc2lkZSB0aGUgc2VsZWN0b3IuIElmIGBudWxsYFxuICAgKiAgZGVzdHJveSB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgc2V0Vmlld0NvbXBvbmVudChzZWxlY3RvciwgdmlldyA9IG51bGwpIHtcbiAgICBjb25zdCBwcmV2VmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgIGlmIChwcmV2VmlldyBpbnN0YW5jZW9mIFZpZXcpIHsgcHJldlZpZXcucmVtb3ZlKCk7IH1cblxuICAgIGlmICh2aWV3ID09PSBudWxsKSB7XG4gICAgICBkZWxldGUgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdID0gdmlldztcbiAgICAgIHZpZXcuc2V0UGFyZW50Vmlldyh0aGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcGFyZW50IHdoZW4gaXMgYSBjb21wb25lbnQgdmlldy5cbiAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gUGFyZW50IHZpZXcuXG4gICAqXG4gICAqL1xuICBzZXRQYXJlbnRWaWV3KHZpZXcpIHtcbiAgICB0aGlzLnBhcmVudFZpZXcgPSB2aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBtZXRob2Qgb24gYWxsIHRoZSBgY29tcG9uZW50c2AgKHN1Yi12aWV3cykuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgLSBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHRvIGJlIGV4ZWN1dGVkLlxuICAgKiBAcGFyYW0gey4uLk1peGVkfSBhcmdzIC0gQXJndW1lbnRzIGZvciB0aGUgZ2l2ZW4gbWV0aG9kLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKG1ldGhvZCwgLi4uYXJncykge1xuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAgIHZpZXdbbWV0aG9kXSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHBhcnRpYWxseSB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHNlbGVjdG9yLiBJZiB0aGUgc2VsZWN0b3JcbiAgICogaXMgYXNzb2NpYXRlZCB0byBhIGBjb21wb25lbnRgIChzdWItdmlld3MpLCB0aGUgYGNvbXBvbmVudGAgaXMgcmVuZGVyZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciAtIENzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB2aWV3LlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpIHtcbiAgICBjb25zdCAkY29tcG9uZW50Q29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG5cbiAgICBpZiAoJGNvbXBvbmVudENvbnRhaW5lciA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2VsZWN0b3IgJHtzZWxlY3Rvcn0gZG9lc24ndCBtYXRjaCBhbnkgZWxlbWVudGApO1xuXG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgIGNvbXBvbmVudC5hcHBlbmRUbygkY29tcG9uZW50Q29udGFpbmVyKTtcbiAgICAgIGNvbXBvbmVudC5vblJlbmRlcigpO1xuXG4gICAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICAgIGNvbXBvbmVudC5zaG93KCk7XG4gICAgICBlbHNlXG4gICAgICAgIGNvbXBvbmVudC5oaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICAgIGNvbnN0ICR0bXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICR0bXAuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICRjb21wb25lbnRDb250YWluZXIuaW5uZXJIVE1MID0gJHRtcC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5pbm5lckhUTUw7XG4gICAgICB0aGlzLm9uUmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgd2hvbGUgdmlldyBhbmQgaXRzIGNvbXBvbmVudCAoc3ViLXZpZXdzKS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZW5kZXJBbGwoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAvLyBzZXQgaWQgb2YgdGhlIGNvbnRhaW5lciBpZCBnaXZlblxuICAgIGlmIChvcHRpb25zLmlkKVxuICAgICAgdGhpcy4kZWwuaWQgPSBvcHRpb25zLmlkO1xuICAgIC8vIHNldCBjbGFzc2VzIG9mIHRoZSBjb250YWluZXIgaWYgZ2l2ZW5cbiAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3NOYW1lO1xuICAgICAgY29uc3QgY2xhc3NlcyA9IHR5cGVvZiBjbGFzc05hbWUgPT09ICdzdHJpbmcnID8gW2NsYXNzTmFtZV0gOiBjbGFzc05hbWU7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuICAgIH1cblxuICAgIC8vIHJlbmRlciB0ZW1wbGF0ZSBhbmQgaW5zZXJ0IGl0IGluIHRoZSBtYWluIGVsZW1lbnRcbiAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB0aGlzLm9uUmVuZGVyKCk7XG5cbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gIH1cblxuICAvLyBMSUZFIENZQ0xFIE1FVEhPRFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiB0ZW1wbGF0ZSBhbmQgY29udGVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcj1udWxsXSAtIElmIG5vdCBgbnVsbGAsIHJlbmRlcnMgb25seSB0aGUgcGFydCBvZlxuICAgKiAgdGhlIHZpZXcgaW5zaWRlIHRoZSBtYXRjaGVkIGVsZW1lbnQuIElmIHRoaXMgZWxlbWVudCBjb250YWlucyBhIGNvbXBvbmVudFxuICAgKiAgKHN1Yi12aWV3KSwgdGhlIGNvbXBvbmVudCBpcyByZW5kZXJlZC4gUmVuZGVycyBhbGwgdGhlIHZpZXcgb3RoZXJ3aXNlLlxuICAgKi9cbiAgcmVuZGVyKHNlbGVjdG9yID0gbnVsbCkge1xuICAgIGlmIChzZWxlY3RvciAhPT0gbnVsbClcbiAgICAgIHRoaXMuX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3JlbmRlckFsbCgpO1xuXG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5vblJlc2l6ZSh2aWV3cG9ydC53aWR0aCwgdmlld3BvcnQuaGVpZ2h0LCB2aWV3cG9ydC5vcmllbnRhdGlvbiwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IHRoZSB2aWV3IChgdGhpcy4kZWxgKSBpbnRvIHRoZSBnaXZlbiBlbGVtZW50LlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRwYXJlbnQgLSBFbGVtZW50IGluc2lkZSB3aGljaCB0aGUgdmlldyBtdXN0IGJlIGluc2VydGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXBwZW5kVG8oJHBhcmVudCkge1xuICAgIHRoaXMuJHBhcmVudCA9ICRwYXJlbnQ7XG4gICAgJHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogU2hvdyB0aGUgdmlldy4gVGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHNob3coKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgIC8vIG11c3QgcmVzaXplIGJlZm9yZSBjaGlsZCBjb21wb25lbnRcbiAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHZpZXdwb3J0LmFkZFJlc2l6ZUxpc3RlbmVyKHRoaXMub25SZXNpemUpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ3Nob3cnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3IGFuZCB1bmluc3RhbGwgZXZlbnRzLiBUaGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5XG4gICAqIHRoZSBgdmlld01hbmFnZXJgLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQucmVtb3ZlUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG5cbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnaGlkZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFubHkgcmVtb3ZlIHRoZSB2aWV3IGZyb20gaXQncyBjb250YWluZXIuIFRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlXG4gICAqIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmAuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ3JlbW92ZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IHdoZW4gdGhlIERPTSBpcyBjcmVhdGVkLCBpcyBtYWlubHkgZXhwb3NlZCB0byBjYWNoZSBzb21lIERPTVxuICAgKiBlbGVtZW50cy5cbiAgICovXG4gIG9uUmVuZGVyKCkge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGB2aWV3cG9ydC5yZXNpemVgIGV2ZW50LCBpdCBtYWludGFpbnMgYHRoaXMuJGVsYCBzaXplXG4gICAqIHRvIGZpdCB0aGUgdmlld3BvcnQgc2l6ZS4gVGhlIG1ldGhvZCBpcyBhbHNvIGNhbGxlZCBvbmNlIHdoZW4gdGhlXG4gICAqIHZpZXcgaXMgYWN0dWFsbHkgaW5zZXJ0ZWQgaW50byB0aGUgRE9NLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRXaWR0aCAtIFdpZHRoIG9mIHRoZSB2aWV3cG9ydCBfKGluIHBpeGVscylfLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBIZWlnaHQgb2YgdGhlIHZpZXdwb3J0IF8oaW4gcGl4ZWxzKV8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcmllbnRhdGlvbiAtIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydC5cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LnZpZXdwb3J0fVxuICAgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uLCBwcm9wYWdhdGUgPSBmYWxzZSkge1xuICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcblxuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gYCR7dmlld3BvcnRXaWR0aH1weGA7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnRIZWlnaHR9cHhgO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcnRyYWl0JywgJ2xhbmRzY2FwZScpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQob3JpZW50YXRpb24pO1xuXG4gICAgaWYgKHByb3BhZ2F0ZSlcbiAgICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdvblJlc2l6ZScsIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbik7XG4gIH1cblxuICAvLyBFVkVOVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBJbnN0YWxsIGV2ZW50cyBvbiB0aGUgdmlldyBhdCBhbnkgbW9tZW50IG9mIGl0cyBsaWZlY3ljbGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0PFN0cmluZywgRnVuY3Rpb24+fSBldmVudHMgLSBBbiBvYmplY3Qgb2YgZXZlbnRzLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvdmVycmlkZT1mYWxzZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIHByZXZpb3VzIGV2ZW50c1xuICAgKiAgYXJlIHJlcGxhY2VkIHdpdGggdGhlIG5ldyBvbmVzLlxuICAgKi9cbiAgaW5zdGFsbEV2ZW50cyhldmVudHMsIG92ZXJyaWRlID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IG92ZXJyaWRlID8gZXZlbnRzIDogT2JqZWN0LmFzc2lnbih0aGlzLmV2ZW50cywgZXZlbnRzKTtcblxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGV2ZW50IGxpc3RlbmVycyBvbiB0aGUgdmlldy5cbiAgICogQHRvZG8gLSByZW1vdmUgZGVsZWdhdGlvbiA/XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICBjb25zdCBbZXZlbnQsIHNlbGVjdG9yXSA9IGtleS5zcGxpdCgvICsvKTtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5ldmVudHNba2V5XTtcblxuICAgICAgdGhpcy5fZGVsZWdhdGUub24oZXZlbnQsIHNlbGVjdG9yIHx8wqBudWxsLCBjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgZnJvbSB0aGUgdmlldy5cbiAgICogQHRvZG8gLSByZW1vdmUgZGVsZWdhdGlvbiA/XG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5vZmYoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBWaWV3O1xuIl19
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
 * [client] - View.
 *
 * @todo
 */

var View = function () {
  function View(template) {
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    (0, _classCallCheck3.default)(this, View);

    /**
     * A function created from the given `template`, to be called with `content` object.
     * @type {Function}
     */
    this.tmpl = (0, _lodash2.default)(template);

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
    this.options = (0, _assign2.default)({
      el: 'div',
      id: null,
      className: null,
      priority: 0
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
     * If the view is a component, parent view.
     */
    this.parentView = null;

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

    this._delegate = new _domDelegate2.default(this.$el);
    this.onResize = this.onResize.bind(this);

    this.installEvents(this.events, false);
  }

  /**
   * Add or remove a compound view inside the current view.
   * @param {String} selector - A css selector matching an element of the template.
   * @param {View} [view=null] - The view to insert inside the selector. If set
   *  to `null` destroy the component.
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
     * @param {View} view - The parent view.
     */

  }, {
    key: 'setParentView',
    value: function setParentView(view) {
      this.parentView = view;
    }

    /**
     * Execute a method on all the `components` (sub-views).
     * @param {String} method - The name of the method to be executed.
     */

  }, {
    key: '_executeViewComponentMethod',
    value: function _executeViewComponentMethod(method) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      for (var selector in this._components) {
        var _view = this._components[selector];
        _view[method].apply(_view, args);
      }
    }

    /**
     * Render partially the view according to the given selector. If the selector
     * is associated to a `component` (sub-views), the `component` is rendered.
     * @param {String} selector - A css selector matching an element of the view.
     */

  }, {
    key: '_renderPartial',
    value: function _renderPartial(selector) {
      var $componentContainer = this.$el.querySelector(selector);
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
     * Render the view according to the given view template and content.
     * @param {String} [selector=null] - If specified render only the part of the
     *  view inside the matched element, if this element contains a component
     *  (sub-view), the component is rendered. Render all the view otherwise.
     * @return {Element}
     */

  }, {
    key: 'render',
    value: function render() {
      var selector = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (selector !== null) this._renderPartial(selector);else this._renderAll();

      if (this.isVisible) this.onResize(_viewport2.default.width, _viewport2.default.height, _viewport2.default.orientation, true);
    }

    /**
     * Insert the view (`this.$el`) into the given element. Call `View~onShow` when done.
     * @param {Element} $parent - The element inside which the view is inserted.
     * @private
     */

  }, {
    key: 'appendTo',
    value: function appendTo($parent) {
      this.$parent = $parent;
      $parent.appendChild(this.$el);
    }

    /**
     * Show the view .
     * @private - this method should only be used by the `viewManager`
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
     * Hide the view and uninstall events.
     * @private - this method should only be used by the `viewManager`
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
     * Remove events listeners and remove the view from it's container.
     * @private - this method should only be used by the `viewManager`
     */

  }, {
    key: 'remove',
    value: function remove() {
      this.hide();
      this.$el.remove();
      // this.$parent.removeChild(this.$el);
      this._executeViewComponentMethod('remove');
    }

    /**
     * Entry point when the DOM is ready. Is mainly exposed to cache some element.
     */

  }, {
    key: 'onRender',
    value: function onRender() {}

    /**
     * Callback for `viewport.resize` event. Maintain `$el` in sync with the viewport.
     * @param {String} orientation - The orientation of the viewport ('portrait'|'landscape')
     * @param {Number} viewportWidth - The width of the viewport in pixels.
     * @param {Number} viewportHeight - The height of the viewport in pixels.
     * @todo - move `orientation` to third argument
     * @todo - rename to `resize`
     */

  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      var propagate = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      this.$el.style.width = viewportWidth + 'px';
      this.$el.style.height = viewportHeight + 'px';
      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;

      this.orientation = orientation;
      this.$el.classList.remove('portrait', 'landscape');
      this.$el.classList.add(orientation);
      // do not propagate to component as they are listening viewport's event too.
      if (propagate) this._executeViewComponentMethod('onResize', viewportWidth, viewportHeight, orientation);
    }

    // EVENTS ----------------------------------------

    /**
     * Allow to install events after instanciation.
     * @param {Object} events - An object of events mimicing the Backbone's syntax.
     * @param {Object} [averride=false] - If set true, replace the previous events
     *  with the ones given.
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
     * Add event listeners according to `this.events` object (which should
     * follow the Backbone's event syntax)
     */

  }, {
    key: '_delegateEvents',
    value: function _delegateEvents() {
      for (var key in this.events) {
        var _key$split = key.split(/ +/);

        var _key$split2 = (0, _slicedToArray3.default)(_key$split, 2);

        var event = _key$split2[0];
        var _selector = _key$split2[1];

        var callback = this.events[key];

        this._delegate.on(event, _selector || null, callback);
      }
    }

    /**
     * Remove event listeners according to `this.events` object (which should
     * follow the Backbone's event syntax)
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
//# sourceMappingURL=data:application/json;base64,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QUFLLGNBQUwsR0FBc0IsY0FBdEIsQ0FKc0U7O0FBTXRFLFdBQUssV0FBTCxHQUFtQixXQUFuQixDQU5zRTtBQU90RSxXQUFLLEdBQUwsQ0FBUyxTQUFULENBQW1CLE1BQW5CLENBQTBCLFVBQTFCLEVBQXNDLFdBQXRDLEVBUHNFO0FBUXRFLFdBQUssR0FBTCxDQUFTLFNBQVQsQ0FBbUIsR0FBbkIsQ0FBdUIsV0FBdkI7O0FBUnNFLFVBVWxFLFNBQUosRUFDRSxLQUFLLDJCQUFMLENBQWlDLFVBQWpDLEVBQTZDLGFBQTdDLEVBQTRELGNBQTVELEVBQTRFLFdBQTVFLEVBREY7Ozs7Ozs7Ozs7Ozs7O2tDQVlZLFFBQTBCO1VBQWxCLGlFQUFXLHFCQUFPOztBQUN0QyxVQUFJLEtBQUssU0FBTCxFQUNGLEtBQUssaUJBQUwsR0FERjs7QUFHQSxXQUFLLE1BQUwsR0FBYyxXQUFXLE1BQVgsR0FBb0Isc0JBQWMsS0FBSyxNQUFMLEVBQWEsTUFBM0IsQ0FBcEIsQ0FKd0I7O0FBTXRDLFVBQUksS0FBSyxTQUFMLEVBQ0YsS0FBSyxlQUFMLEdBREY7Ozs7Ozs7Ozs7c0NBUWdCO0FBQ2hCLFdBQUssSUFBSSxHQUFKLElBQVcsS0FBSyxNQUFMLEVBQWE7eUJBQ0QsSUFBSSxLQUFKLENBQVUsSUFBVixFQURDOzs7O1lBQ3BCLHVCQURvQjtZQUNiLDJCQURhOztBQUUzQixZQUFNLFdBQVcsS0FBSyxNQUFMLENBQVksR0FBWixDQUFYLENBRnFCOztBQUkzQixhQUFLLFNBQUwsQ0FBZSxFQUFmLENBQWtCLEtBQWxCLEVBQXlCLGFBQVksSUFBWixFQUFrQixRQUEzQyxFQUoyQjtPQUE3Qjs7Ozs7Ozs7Ozt3Q0FZa0I7QUFDbEIsV0FBSyxTQUFMLENBQWUsR0FBZixHQURrQjs7O1NBM1NEIiwiZmlsZSI6IlZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdG1wbCBmcm9tICdsb2Rhc2gudGVtcGxhdGUnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuaW1wb3J0IERlbGVnYXRlIGZyb20gJ2RvbS1kZWxlZ2F0ZSc7XG5cbi8qKlxuICogW2NsaWVudF0gLSBWaWV3LlxuICpcbiAqIEB0b2RvXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGB0ZW1wbGF0ZWAsIHRvIGJlIGNhbGxlZCB3aXRoIGBjb250ZW50YCBvYmplY3QuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMudG1wbCA9IHRtcGwodGVtcGxhdGUpO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSB0byBiZSB1c2VkIGluIG9yZGVyIHRvIHBvcHVsYXRlIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LiBFYWNoIGVudHJ5IGZvbGxvd3MgdGhlIGNvbnZlbnRpb246XG4gICAgICogYCdldmVudE5hbWUgW2Nzc1NlbGVjdG9yXSc6IGNhbGxiYWNrRnVuY3Rpb25gXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIFZpZXcuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGVsOiAnZGl2JyxcbiAgICAgIGlkOiBudWxsLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgICAgcHJpb3JpdHk6IDAsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBQcmlvcml0eSBvZiB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucHJpb3JpdHkgPSB0aGlzLm9wdGlvbnMucHJpb3JpdHk7XG5cbiAgICAvKipcbiAgICAgKiBPcmllbnRhdGlvbiBvZiB0aGUgdmlldyAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJylcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBpZiB0aGUgdmlldyBpcyB2aXNpYmxlIG9yIG5vdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBJZiB0aGUgdmlldyBpcyBhIGNvbXBvbmVudCwgcGFyZW50IHZpZXcuXG4gICAgICovXG4gICAgdGhpcy5wYXJlbnRWaWV3ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIHRoZSBjb21wb25lbnRzIChzdWItdmlld3MpIG9mIHRoZSB2aWV3LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogcmVmb3JtYXR0aW5nIG9mIGB0aGlzLmV2ZW50c2AgZm9yIGV2ZW50IGRlbGVnYXRpb24gaW50ZXJuYWwgdXNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGVsZW1lbnQgb2YgdGhlIHZpZXcuIERlZmF1bHRzIHRvIGA8ZGl2PmAuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5lbCk7XG5cbiAgICB0aGlzLl9kZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSh0aGlzLiRlbCk7XG4gICAgdGhpcy5vblJlc2l6ZSA9IHRoaXMub25SZXNpemUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh0aGlzLmV2ZW50cywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciByZW1vdmUgYSBjb21wb3VuZCB2aWV3IGluc2lkZSB0aGUgY3VycmVudCB2aWV3LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBBIGNzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHtWaWV3fSBbdmlldz1udWxsXSAtIFRoZSB2aWV3IHRvIGluc2VydCBpbnNpZGUgdGhlIHNlbGVjdG9yLiBJZiBzZXRcbiAgICogIHRvIGBudWxsYCBkZXN0cm95IHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBzZXRWaWV3Q29tcG9uZW50KHNlbGVjdG9yLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByZXZWaWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgaWYgKHByZXZWaWV3IGluc3RhbmNlb2YgVmlldykgeyBwcmV2Vmlldy5yZW1vdmUoKTsgfVxuXG4gICAgaWYgKHZpZXcgPT09IG51bGwpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl0gPSB2aWV3O1xuICAgICAgdmlldy5zZXRQYXJlbnRWaWV3KHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwYXJlbnQgd2hlbiBpcyBhIGNvbXBvbmVudCB2aWV3LlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBUaGUgcGFyZW50IHZpZXcuXG4gICAqL1xuICBzZXRQYXJlbnRWaWV3KHZpZXcpIHtcbiAgICB0aGlzLnBhcmVudFZpZXcgPSB2aWV3O1xuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBtZXRob2Qgb24gYWxsIHRoZSBgY29tcG9uZW50c2AgKHN1Yi12aWV3cykuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgLSBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHRvIGJlIGV4ZWN1dGVkLlxuICAgKi9cbiAgX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKG1ldGhvZCwgLi4uYXJncykge1xuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAgIHZpZXdbbWV0aG9kXSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHBhcnRpYWxseSB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHNlbGVjdG9yLiBJZiB0aGUgc2VsZWN0b3JcbiAgICogaXMgYXNzb2NpYXRlZCB0byBhIGBjb21wb25lbnRgIChzdWItdmlld3MpLCB0aGUgYGNvbXBvbmVudGAgaXMgcmVuZGVyZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciAtIEEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIGFuIGVsZW1lbnQgb2YgdGhlIHZpZXcuXG4gICAqL1xuICBfcmVuZGVyUGFydGlhbChzZWxlY3Rvcikge1xuICAgIGNvbnN0ICRjb21wb25lbnRDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAkY29tcG9uZW50Q29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LnJlbmRlcigpO1xuICAgICAgY29tcG9uZW50LmFwcGVuZFRvKCRjb21wb25lbnRDb250YWluZXIpO1xuICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgICAgY29tcG9uZW50LnNob3coKTtcbiAgICAgIGVsc2VcbiAgICAgICAgY29tcG9uZW50LmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLmNvbnRlbnQpO1xuICAgICAgY29uc3QgJHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgJHRtcC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAkdG1wLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTDtcbiAgICAgIHRoaXMub25SZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB3aG9sZSB2aWV3IGFuZCBpdHMgY29tcG9uZW50IChzdWItdmlld3MpLlxuICAgKi9cbiAgX3JlbmRlckFsbCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIC8vIHNldCBpZCBvZiB0aGUgY29udGFpbmVyIGlkIGdpdmVuXG4gICAgaWYgKG9wdGlvbnMuaWQpXG4gICAgICB0aGlzLiRlbC5pZCA9IG9wdGlvbnMuaWQ7XG4gICAgLy8gc2V0IGNsYXNzZXMgb2YgdGhlIGNvbnRhaW5lciBpZiBnaXZlblxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XG4gICAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIGNsYXNzTmFtZSA9PT0gJ3N0cmluZycgPyBbY2xhc3NOYW1lXSA6IGNsYXNzTmFtZTtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIHRlbXBsYXRlIGFuZCBpbnNlcnQgaXQgaW4gdGhlIG1haW4gZWxlbWVudFxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHRoaXMub25SZW5kZXIoKTtcblxuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpXG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgfVxuXG4gIC8vIExJRkUgQ1lDTEUgTUVUSE9EUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHZpZXcgdGVtcGxhdGUgYW5kIGNvbnRlbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3I9bnVsbF0gLSBJZiBzcGVjaWZpZWQgcmVuZGVyIG9ubHkgdGhlIHBhcnQgb2YgdGhlXG4gICAqICB2aWV3IGluc2lkZSB0aGUgbWF0Y2hlZCBlbGVtZW50LCBpZiB0aGlzIGVsZW1lbnQgY29udGFpbnMgYSBjb21wb25lbnRcbiAgICogIChzdWItdmlldyksIHRoZSBjb21wb25lbnQgaXMgcmVuZGVyZWQuIFJlbmRlciBhbGwgdGhlIHZpZXcgb3RoZXJ3aXNlLlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgKi9cbiAgcmVuZGVyKHNlbGVjdG9yID0gbnVsbCkge1xuICAgIGlmIChzZWxlY3RvciAhPT0gbnVsbClcbiAgICAgIHRoaXMuX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3JlbmRlckFsbCgpO1xuXG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5vblJlc2l6ZSh2aWV3cG9ydC53aWR0aCwgdmlld3BvcnQuaGVpZ2h0LCB2aWV3cG9ydC5vcmllbnRhdGlvbiwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IHRoZSB2aWV3IChgdGhpcy4kZWxgKSBpbnRvIHRoZSBnaXZlbiBlbGVtZW50LiBDYWxsIGBWaWV3fm9uU2hvd2Agd2hlbiBkb25lLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRwYXJlbnQgLSBUaGUgZWxlbWVudCBpbnNpZGUgd2hpY2ggdGhlIHZpZXcgaXMgaW5zZXJ0ZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhcHBlbmRUbygkcGFyZW50KSB7XG4gICAgdGhpcy4kcGFyZW50ID0gJHBhcmVudDtcbiAgICAkcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSB2aWV3IC5cbiAgICogQHByaXZhdGUgLSB0aGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IHRoZSBgdmlld01hbmFnZXJgXG4gICAqL1xuICBzaG93KCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAvLyBtdXN0IHJlc2l6ZSBiZWZvcmUgY2hpbGQgY29tcG9uZW50XG4gICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgICB2aWV3cG9ydC5hZGRSZXNpemVMaXN0ZW5lcih0aGlzLm9uUmVzaXplKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdzaG93Jyk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBhbmQgdW5pbnN0YWxsIGV2ZW50cy5cbiAgICogQHByaXZhdGUgLSB0aGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IHRoZSBgdmlld01hbmFnZXJgXG4gICAqL1xuICBoaWRlKCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcbiAgICB2aWV3cG9ydC5yZW1vdmVSZXNpemVMaXN0ZW5lcih0aGlzLm9uUmVzaXplKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdoaWRlJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50cyBsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGUgdmlldyBmcm9tIGl0J3MgY29udGFpbmVyLlxuICAgKiBAcHJpdmF0ZSAtIHRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmBcbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLiRlbC5yZW1vdmUoKTtcbiAgICAvLyB0aGlzLiRwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy4kZWwpO1xuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdyZW1vdmUnKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IHdoZW4gdGhlIERPTSBpcyByZWFkeS4gSXMgbWFpbmx5IGV4cG9zZWQgdG8gY2FjaGUgc29tZSBlbGVtZW50LlxuICAgKi9cbiAgb25SZW5kZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgYHZpZXdwb3J0LnJlc2l6ZWAgZXZlbnQuIE1haW50YWluIGAkZWxgIGluIHN5bmMgd2l0aCB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcmllbnRhdGlvbiAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydFdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydEhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHZpZXdwb3J0IGluIHBpeGVscy5cbiAgICogQHRvZG8gLSBtb3ZlIGBvcmllbnRhdGlvbmAgdG8gdGhpcmQgYXJndW1lbnRcbiAgICogQHRvZG8gLSByZW5hbWUgdG8gYHJlc2l6ZWBcbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbiwgcHJvcGFnYXRlID0gZmFsc2UpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9IGAke3ZpZXdwb3J0V2lkdGh9cHhgO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9IGAke3ZpZXdwb3J0SGVpZ2h0fXB4YDtcbiAgICB0aGlzLnZpZXdwb3J0V2lkdGggPSB2aWV3cG9ydFdpZHRoO1xuICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSB2aWV3cG9ydEhlaWdodDtcblxuICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdwb3J0cmFpdCcsICdsYW5kc2NhcGUnKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKG9yaWVudGF0aW9uKTtcbiAgICAvLyBkbyBub3QgcHJvcGFnYXRlIHRvIGNvbXBvbmVudCBhcyB0aGV5IGFyZSBsaXN0ZW5pbmcgdmlld3BvcnQncyBldmVudCB0b28uXG4gICAgaWYgKHByb3BhZ2F0ZSlcbiAgICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdvblJlc2l6ZScsIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbik7XG4gIH1cblxuICAvLyBFVkVOVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBBbGxvdyB0byBpbnN0YWxsIGV2ZW50cyBhZnRlciBpbnN0YW5jaWF0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gQW4gb2JqZWN0IG9mIGV2ZW50cyBtaW1pY2luZyB0aGUgQmFja2JvbmUncyBzeW50YXguXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXZlcnJpZGU9ZmFsc2VdIC0gSWYgc2V0IHRydWUsIHJlcGxhY2UgdGhlIHByZXZpb3VzIGV2ZW50c1xuICAgKiAgd2l0aCB0aGUgb25lcyBnaXZlbi5cbiAgICovXG4gIGluc3RhbGxFdmVudHMoZXZlbnRzLCBvdmVycmlkZSA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuXG4gICAgdGhpcy5ldmVudHMgPSBvdmVycmlkZSA/IGV2ZW50cyA6IE9iamVjdC5hc3NpZ24odGhpcy5ldmVudHMsIGV2ZW50cyk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBldmVudCBsaXN0ZW5lcnMgYWNjb3JkaW5nIHRvIGB0aGlzLmV2ZW50c2Agb2JqZWN0ICh3aGljaCBzaG91bGRcbiAgICogZm9sbG93IHRoZSBCYWNrYm9uZSdzIGV2ZW50IHN5bnRheClcbiAgICovXG4gIF9kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuXG4gICAgICB0aGlzLl9kZWxlZ2F0ZS5vbihldmVudCwgc2VsZWN0b3IgfHzCoG51bGwsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMuZXZlbnRzYCBvYmplY3QgKHdoaWNoIHNob3VsZFxuICAgKiBmb2xsb3cgdGhlIEJhY2tib25lJ3MgZXZlbnQgc3ludGF4KVxuICAgKi9cbiAgX3VuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdGhpcy5fZGVsZWdhdGUub2ZmKCk7XG4gIH1cbn1cbiJdfQ==
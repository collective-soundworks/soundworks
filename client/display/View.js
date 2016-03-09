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
      }
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
     * Render the view according to the given template and content.
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
      // this._executeViewComponentMethod('_delegateEvents');
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
      // this._executeViewComponentMethod('_undelegateEvents');
      this._delegate.off();
    }
  }]);
  return View;
}();

exports.default = View;
//# sourceMappingURL=data:application/json;base64,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QVBzRTtBQVF0RSxXQUFLLEdBQUwsQ0FBUyxTQUFULENBQW1CLEdBQW5CLENBQXVCLFdBQXZCOztBQVJzRSxVQVVsRSxTQUFKLEVBQ0UsS0FBSywyQkFBTCxDQUFpQyxVQUFqQyxFQUE2QyxhQUE3QyxFQUE0RCxjQUE1RCxFQUE0RSxXQUE1RSxFQURGOzs7Ozs7Ozs7Ozs7OztrQ0FZWSxRQUEwQjtVQUFsQixpRUFBVyxxQkFBTzs7QUFDdEMsVUFBSSxLQUFLLFNBQUwsRUFDRixLQUFLLGlCQUFMLEdBREY7O0FBR0EsV0FBSyxNQUFMLEdBQWMsV0FBVyxNQUFYLEdBQW9CLHNCQUFjLEtBQUssTUFBTCxFQUFhLE1BQTNCLENBQXBCLENBSndCOztBQU10QyxVQUFJLEtBQUssU0FBTCxFQUNGLEtBQUssZUFBTCxHQURGOzs7Ozs7Ozs7O3NDQVFnQjs7QUFFaEIsV0FBSyxJQUFJLEdBQUosSUFBVyxLQUFLLE1BQUwsRUFBYTt5QkFDRCxJQUFJLEtBQUosQ0FBVSxJQUFWLEVBREM7Ozs7WUFDcEIsdUJBRG9CO1lBQ2IsMkJBRGE7O0FBRTNCLFlBQU0sV0FBVyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQVgsQ0FGcUI7O0FBSTNCLGFBQUssU0FBTCxDQUFlLEVBQWYsQ0FBa0IsS0FBbEIsRUFBeUIsYUFBWSxJQUFaLEVBQWtCLFFBQTNDLEVBSjJCO09BQTdCOzs7Ozs7Ozs7O3dDQVlrQjs7QUFFbEIsV0FBSyxTQUFMLENBQWUsR0FBZixHQUZrQjs7O1NBOVJEIiwiZmlsZSI6IlZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdG1wbCBmcm9tICdsb2Rhc2gudGVtcGxhdGUnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuaW1wb3J0IERlbGVnYXRlIGZyb20gJ2RvbS1kZWxlZ2F0ZSc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSAtIFZpZXcuXG4gKlxuICogQHRvZG9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCwgdG8gYmUgY2FsbGVkIHdpdGggYGNvbnRlbnRgIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy50bXBsID0gdG1wbCh0ZW1wbGF0ZSk7XG5cbiAgICAvKipcbiAgICAgKiBEYXRhIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gcG9wdWxhdGUgdGhlIHRlbXBsYXRlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuIEVhY2ggZW50cnkgZm9sbG93cyB0aGUgY29udmVudGlvbjpcbiAgICAgKiBgJ2V2ZW50TmFtZSBbY3NzU2VsZWN0b3JdJzogY2FsbGJhY2tGdW5jdGlvbmBcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgVmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZWw6ICdkaXYnLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgICBwcmlvcml0eTogMCxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFByaW9yaXR5IG9mIHRoZSB2aWV3LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5wcmlvcml0eSA9IHRoaXMub3B0aW9ucy5wcmlvcml0eTtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGlmIHRoZSB2aWV3IGlzIHZpc2libGUgb3Igbm90LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIHRoZSBjb21wb25lbnRzIChzdWItdmlld3MpIG9mIHRoZSB2aWV3LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogcmVmb3JtYXR0aW5nIG9mIGB0aGlzLmV2ZW50c2AgZm9yIGV2ZW50IGRlbGVnYXRpb24gaW50ZXJuYWwgdXNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGVsZW1lbnQgb2YgdGhlIHZpZXcuIERlZmF1bHRzIHRvIGA8ZGl2PmAuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5lbCk7XG5cbiAgICB0aGlzLl9kZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSh0aGlzLiRlbCk7XG4gICAgdGhpcy5vblJlc2l6ZSA9IHRoaXMub25SZXNpemUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh0aGlzLmV2ZW50cywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciByZW1vdmUgYSBjb21wb3VuZCB2aWV3IGluc2lkZSB0aGUgY3VycmVudCB2aWV3LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBBIGNzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHtWaWV3fSBbdmlldz1udWxsXSAtIFRoZSB2aWV3IHRvIGluc2VydCBpbnNpZGUgdGhlIHNlbGVjdG9yLiBJZiBzZXRcbiAgICogIHRvIGBudWxsYCBkZXN0cm95IHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBzZXRWaWV3Q29tcG9uZW50KHNlbGVjdG9yLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByZXZWaWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgaWYgKHByZXZWaWV3IGluc3RhbmNlb2YgVmlldykgeyBwcmV2Vmlldy5yZW1vdmUoKTsgfVxuXG4gICAgaWYgKHZpZXcgPT09IG51bGwpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl0gPSB2aWV3O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgbWV0aG9kIG9uIGFsbCB0aGUgYGNvbXBvbmVudHNgIChzdWItdmlld3MpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIC0gVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBiZSBleGVjdXRlZC5cbiAgICovXG4gIF9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgICB2aWV3W21ldGhvZF0oLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBwYXJ0aWFsbHkgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBzZWxlY3Rvci4gSWYgdGhlIHNlbGVjdG9yXG4gICAqIGlzIGFzc29jaWF0ZWQgdG8gYSBgY29tcG9uZW50YCAoc3ViLXZpZXdzKSwgdGhlIGBjb21wb25lbnRgIGlzIHJlbmRlcmVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBBIGNzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB2aWV3LlxuICAgKi9cbiAgX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpIHtcbiAgICBjb25zdCAkY29tcG9uZW50Q29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgIGNvbXBvbmVudC5hcHBlbmRUbygkY29tcG9uZW50Q29udGFpbmVyKTtcbiAgICAgIGNvbXBvbmVudC5vblJlbmRlcigpO1xuXG4gICAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICAgIGNvbXBvbmVudC5zaG93KCk7XG4gICAgICBlbHNlXG4gICAgICAgIGNvbXBvbmVudC5oaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICAgIGNvbnN0ICR0bXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICR0bXAuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICRjb21wb25lbnRDb250YWluZXIuaW5uZXJIVE1MID0gJHRtcC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5pbm5lckhUTUw7XG4gICAgICB0aGlzLm9uUmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgd2hvbGUgdmlldyBhbmQgaXRzIGNvbXBvbmVudCAoc3ViLXZpZXdzKS5cbiAgICovXG4gIF9yZW5kZXJBbGwoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAvLyBzZXQgaWQgb2YgdGhlIGNvbnRhaW5lciBpZCBnaXZlblxuICAgIGlmIChvcHRpb25zLmlkKVxuICAgICAgdGhpcy4kZWwuaWQgPSBvcHRpb25zLmlkO1xuICAgIC8vIHNldCBjbGFzc2VzIG9mIHRoZSBjb250YWluZXIgaWYgZ2l2ZW5cbiAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3NOYW1lO1xuICAgICAgY29uc3QgY2xhc3NlcyA9IHR5cGVvZiBjbGFzc05hbWUgPT09ICdzdHJpbmcnID8gW2NsYXNzTmFtZV0gOiBjbGFzc05hbWU7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuICAgIH1cblxuICAgIC8vIHJlbmRlciB0ZW1wbGF0ZSBhbmQgaW5zZXJ0IGl0IGluIHRoZSBtYWluIGVsZW1lbnRcbiAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB0aGlzLm9uUmVuZGVyKCk7XG5cbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gIH1cblxuICAvLyBMSUZFIENZQ0xFIE1FVEhPRFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiB0ZW1wbGF0ZSBhbmQgY29udGVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcj1udWxsXSAtIElmIHNwZWNpZmllZCByZW5kZXIgb25seSB0aGUgcGFydCBvZiB0aGVcbiAgICogIHZpZXcgaW5zaWRlIHRoZSBtYXRjaGVkIGVsZW1lbnQsIGlmIHRoaXMgZWxlbWVudCBjb250YWlucyBhIGNvbXBvbmVudFxuICAgKiAgKHN1Yi12aWV3KSwgdGhlIGNvbXBvbmVudCBpcyByZW5kZXJlZC4gUmVuZGVyIGFsbCB0aGUgdmlldyBvdGhlcndpc2UuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuICByZW5kZXIoc2VsZWN0b3IgPSBudWxsKSB7XG4gICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLm9uUmVzaXplKHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQsIHZpZXdwb3J0Lm9yaWVudGF0aW9uLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgdGhlIHZpZXcgKGB0aGlzLiRlbGApIGludG8gdGhlIGdpdmVuIGVsZW1lbnQuIENhbGwgYFZpZXd+b25TaG93YCB3aGVuIGRvbmUuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHBhcmVudCAtIFRoZSBlbGVtZW50IGluc2lkZSB3aGljaCB0aGUgdmlldyBpcyBpbnNlcnRlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFwcGVuZFRvKCRwYXJlbnQpIHtcbiAgICB0aGlzLiRwYXJlbnQgPSAkcGFyZW50O1xuICAgICRwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIHZpZXcgLlxuICAgKiBAcHJpdmF0ZSAtIHRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmBcbiAgICovXG4gIHNob3coKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgIC8vIG11c3QgcmVzaXplIGJlZm9yZSBjaGlsZCBjb21wb25lbnRcbiAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHZpZXdwb3J0LmFkZFJlc2l6ZUxpc3RlbmVyKHRoaXMub25SZXNpemUpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ3Nob3cnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3IGFuZCB1bmluc3RhbGwgZXZlbnRzLlxuICAgKiBAcHJpdmF0ZSAtIHRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmBcbiAgICovXG4gIGhpZGUoKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHZpZXdwb3J0LnJlbW92ZVJlc2l6ZUxpc3RlbmVyKHRoaXMub25SZXNpemUpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ2hpZGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXZlbnRzIGxpc3RlbmVycyBhbmQgcmVtb3ZlIHRoZSB2aWV3IGZyb20gaXQncyBjb250YWluZXIuXG4gICAqIEBwcml2YXRlIC0gdGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYFxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgIC8vIHRoaXMuJHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLiRlbCk7XG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ3JlbW92ZScpO1xuICB9XG5cblxuICAvKipcbiAgICogRW50cnkgcG9pbnQgd2hlbiB0aGUgRE9NIGlzIHJlYWR5LiBJcyBtYWlubHkgZXhwb3NlZCB0byBjYWNoZSBzb21lIGVsZW1lbnQuXG4gICAqL1xuICBvblJlbmRlcigpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBgdmlld3BvcnQucmVzaXplYCBldmVudC4gTWFpbnRhaW4gYCRlbGAgaW4gc3luYyB3aXRoIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9yaWVudGF0aW9uIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0IGluIHBpeGVscy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0SGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQgaW4gcGl4ZWxzLlxuICAgKiBAdG9kbyAtIG1vdmUgYG9yaWVudGF0aW9uYCB0byB0aGlyZCBhcmd1bWVudFxuICAgKiBAdG9kbyAtIHJlbmFtZSB0byBgcmVzaXplYFxuICAgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uLCBwcm9wYWdhdGUgPSBmYWxzZSkge1xuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gYCR7dmlld3BvcnRXaWR0aH1weGA7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnRIZWlnaHR9cHhgO1xuICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcnRyYWl0JywgJ2xhbmRzY2FwZScpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQob3JpZW50YXRpb24pO1xuICAgIC8vIGRvIG5vdCBwcm9wYWdhdGUgdG8gY29tcG9uZW50IGFzIHRoZXkgYXJlIGxpc3RlbmluZyB2aWV3cG9ydCdzIGV2ZW50IHRvby5cbiAgICBpZiAocHJvcGFnYXRlKVxuICAgICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ29uUmVzaXplJywgdmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgfVxuXG4gIC8vIEVWRU5UUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIGluc3RhbGwgZXZlbnRzIGFmdGVyIGluc3RhbmNpYXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBBbiBvYmplY3Qgb2YgZXZlbnRzIG1pbWljaW5nIHRoZSBCYWNrYm9uZSdzIHN5bnRheC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthdmVycmlkZT1mYWxzZV0gLSBJZiBzZXQgdHJ1ZSwgcmVwbGFjZSB0aGUgcHJldmlvdXMgZXZlbnRzXG4gICAqICB3aXRoIHRoZSBvbmVzIGdpdmVuLlxuICAgKi9cbiAgaW5zdGFsbEV2ZW50cyhldmVudHMsIG92ZXJyaWRlID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IG92ZXJyaWRlID8gZXZlbnRzIDogT2JqZWN0LmFzc2lnbih0aGlzLmV2ZW50cywgZXZlbnRzKTtcblxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGV2ZW50IGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMuZXZlbnRzYCBvYmplY3QgKHdoaWNoIHNob3VsZFxuICAgKiBmb2xsb3cgdGhlIEJhY2tib25lJ3MgZXZlbnQgc3ludGF4KVxuICAgKi9cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIC8vIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdfZGVsZWdhdGVFdmVudHMnKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuXG4gICAgICB0aGlzLl9kZWxlZ2F0ZS5vbihldmVudCwgc2VsZWN0b3IgfHzCoG51bGwsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMuZXZlbnRzYCBvYmplY3QgKHdoaWNoIHNob3VsZFxuICAgKiBmb2xsb3cgdGhlIEJhY2tib25lJ3MgZXZlbnQgc3ludGF4KVxuICAgKi9cbiAgX3VuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgLy8gdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ191bmRlbGVnYXRlRXZlbnRzJyk7XG4gICAgdGhpcy5fZGVsZWdhdGUub2ZmKCk7XG4gIH1cbn1cbiJdfQ==
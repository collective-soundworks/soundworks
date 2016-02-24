'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodashTemplate = require('lodash.template');

var _lodashTemplate2 = _interopRequireDefault(_lodashTemplate);

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

var _domDelegate = require('dom-delegate');

var _domDelegate2 = _interopRequireDefault(_domDelegate);

/**
 * [client] - View.
 *
 * @todo
 */

var View = (function () {
  function View(template) {
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, View);

    /**
     * A function created from the given `template`, to be called with `content` object.
     * @type {Function}
     */
    this.tmpl = (0, _lodashTemplate2['default'])(template);

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
    this.options = _Object$assign({
      el: 'div',
      id: null,
      className: null
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

    this._delegate = new _domDelegate2['default'](this.$el);
    this.onResize = this.onResize.bind(this);

    this.installEvents(this.events, false);
  }

  /**
   * Add or remove a compound view inside the current view.
   * @param {String} selector - A css selector matching an element of the template.
   * @param {View} [view=null] - The view to insert inside the selector. If set
   *  to `null` destroy the component.
   */

  _createClass(View, [{
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
        var view = this._components[selector];
        view[method].apply(view, args);
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
        (_$el$classList = this.$el.classList).add.apply(_$el$classList, _toConsumableArray(classes));
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

      if (this.isVisible) this.onResize(_viewport2['default'].width, _viewport2['default'].height, _viewport2['default'].orientation, true);
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
      _viewport2['default'].addResizeListener(this.onResize);

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
      _viewport2['default'].removeResizeListener(this.onResize);

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

      this.events = override ? events : _Object$assign(this.events, events);

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

        var _key$split2 = _slicedToArray(_key$split, 2);

        var _event = _key$split2[0];
        var selector = _key$split2[1];

        var callback = this.events[key];

        this._delegate.on(_event, selector || null, callback);
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
})();

exports['default'] = View;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvZGlzcGxheS9WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBaUIsaUJBQWlCOzs7O3dCQUNiLFlBQVk7Ozs7MkJBQ1osY0FBYzs7Ozs7Ozs7OztJQVFkLElBQUk7QUFDWixXQURRLElBQUksQ0FDWCxRQUFRLEVBQTJDO1FBQXpDLE9BQU8seURBQUcsRUFBRTtRQUFFLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRDFDLElBQUk7Ozs7OztBQU1yQixRQUFJLENBQUMsSUFBSSxHQUFHLGlDQUFLLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7QUFNM0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7QUFPdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Ozs7OztBQU1yQixRQUFJLENBQUMsT0FBTyxHQUFHLGVBQWM7QUFDM0IsUUFBRSxFQUFFLEtBQUs7QUFDVCxRQUFFLEVBQUUsSUFBSTtBQUNSLGVBQVMsRUFBRSxJQUFJO0tBQ2hCLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7OztBQU1aLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7Ozs7OztBQU10QyxRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTXhCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOzs7Ozs7QUFNdkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWxCLFFBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVuRCxRQUFJLENBQUMsU0FBUyxH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Ozs7Ozs7OztXQVVZLHVCQUFDLE1BQU0sRUFBb0I7VUFBbEIsUUFBUSx5REFBRyxLQUFLOztBQUNwQyxVQUFJLElBQUksQ0FBQyxTQUFTLEVBQ2hCLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUUzQixVQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsR0FBRyxNQUFNLEdBQUcsZUFBYyxJQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVyRSxVQUFJLElBQUksQ0FBQyxTQUFTLEVBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUMxQjs7Ozs7Ozs7V0FNYywyQkFBRzs7QUFFaEIsV0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO3lCQUNELEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDOzs7O1lBQWxDLE1BQUs7WUFBRSxRQUFROztBQUN0QixZQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVsQyxZQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxNQUFLLEVBQUUsUUFBUSxJQUFJLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztPQUN0RDtLQUNGOzs7Ozs7OztXQU1nQiw2QkFBRzs7QUFFbEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUN0Qjs7O1NBaFNrQixJQUFJOzs7cUJBQUosSUFBSSIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0bXBsIGZyb20gJ2xvZGFzaC50ZW1wbGF0ZSc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi92aWV3cG9ydCc7XG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnZG9tLWRlbGVnYXRlJztcblxuXG4vKipcbiAqIFtjbGllbnRdIC0gVmlldy5cbiAqXG4gKiBAdG9kb1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBgdGVtcGxhdGVgLCB0byBiZSBjYWxsZWQgd2l0aCBgY29udGVudGAgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICB0aGlzLnRtcGwgPSB0bXBsKHRlbXBsYXRlKTtcblxuICAgIC8qKlxuICAgICAqIERhdGEgdG8gYmUgdXNlZCBpbiBvcmRlciB0byBwb3B1bGF0ZSB0aGUgdGVtcGxhdGUuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy4gRWFjaCBlbnRyeSBmb2xsb3dzIHRoZSBjb252ZW50aW9uOlxuICAgICAqIGAnZXZlbnROYW1lIFtjc3NTZWxlY3Rvcl0nOiBjYWxsYmFja0Z1bmN0aW9uYFxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBWaWV3LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBlbDogJ2RpdicsXG4gICAgICBpZDogbnVsbCxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFByaW9yaXR5IG9mIHRoZSB2aWV3LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5wcmlvcml0eSA9IHRoaXMub3B0aW9ucy5wcmlvcml0eTtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGlmIHRoZSB2aWV3IGlzIHZpc2libGUgb3Igbm90LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIHRoZSBjb21wb25lbnRzIChzdWItdmlld3MpIG9mIHRoZSB2aWV3LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogcmVmb3JtYXR0aW5nIG9mIGB0aGlzLmV2ZW50c2AgZm9yIGV2ZW50IGRlbGVnYXRpb24gaW50ZXJuYWwgdXNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGVsZW1lbnQgb2YgdGhlIHZpZXcuIERlZmF1bHRzIHRvIGA8ZGl2PmAuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5lbCk7XG5cbiAgICB0aGlzLl9kZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSh0aGlzLiRlbCk7XG4gICAgdGhpcy5vblJlc2l6ZSA9IHRoaXMub25SZXNpemUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh0aGlzLmV2ZW50cywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciByZW1vdmUgYSBjb21wb3VuZCB2aWV3IGluc2lkZSB0aGUgY3VycmVudCB2aWV3LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBBIGNzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHtWaWV3fSBbdmlldz1udWxsXSAtIFRoZSB2aWV3IHRvIGluc2VydCBpbnNpZGUgdGhlIHNlbGVjdG9yLiBJZiBzZXRcbiAgICogIHRvIGBudWxsYCBkZXN0cm95IHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBzZXRWaWV3Q29tcG9uZW50KHNlbGVjdG9yLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByZXZWaWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgaWYgKHByZXZWaWV3IGluc3RhbmNlb2YgVmlldykgeyBwcmV2Vmlldy5yZW1vdmUoKTsgfVxuXG4gICAgaWYgKHZpZXcgPT09IG51bGwpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl0gPSB2aWV3O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgbWV0aG9kIG9uIGFsbCB0aGUgYGNvbXBvbmVudHNgIChzdWItdmlld3MpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIC0gVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBiZSBleGVjdXRlZC5cbiAgICovXG4gIF9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZChtZXRob2QsIC4uLmFyZ3MpIHtcbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgICB2aWV3W21ldGhvZF0oLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBwYXJ0aWFsbHkgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBzZWxlY3Rvci4gSWYgdGhlIHNlbGVjdG9yXG4gICAqIGlzIGFzc29jaWF0ZWQgdG8gYSBgY29tcG9uZW50YCAoc3ViLXZpZXdzKSwgdGhlIGBjb21wb25lbnRgIGlzIHJlbmRlcmVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBBIGNzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB2aWV3LlxuICAgKi9cbiAgX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpIHtcbiAgICBjb25zdCAkY29tcG9uZW50Q29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgIGNvbXBvbmVudC5hcHBlbmRUbygkY29tcG9uZW50Q29udGFpbmVyKTtcbiAgICAgIGNvbXBvbmVudC5vblJlbmRlcigpO1xuXG4gICAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICAgIGNvbXBvbmVudC5zaG93KCk7XG4gICAgICBlbHNlXG4gICAgICAgIGNvbXBvbmVudC5oaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICAgIGNvbnN0ICR0bXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICR0bXAuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICRjb21wb25lbnRDb250YWluZXIuaW5uZXJIVE1MID0gJHRtcC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5pbm5lckhUTUw7XG4gICAgICB0aGlzLm9uUmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgd2hvbGUgdmlldyBhbmQgaXRzIGNvbXBvbmVudCAoc3ViLXZpZXdzKS5cbiAgICovXG4gIF9yZW5kZXJBbGwoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAvLyBzZXQgaWQgb2YgdGhlIGNvbnRhaW5lciBpZCBnaXZlblxuICAgIGlmIChvcHRpb25zLmlkKVxuICAgICAgdGhpcy4kZWwuaWQgPSBvcHRpb25zLmlkO1xuICAgIC8vIHNldCBjbGFzc2VzIG9mIHRoZSBjb250YWluZXIgaWYgZ2l2ZW5cbiAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3NOYW1lO1xuICAgICAgY29uc3QgY2xhc3NlcyA9IHR5cGVvZiBjbGFzc05hbWUgPT09ICdzdHJpbmcnID8gW2NsYXNzTmFtZV0gOiBjbGFzc05hbWU7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuICAgIH1cblxuICAgIC8vIHJlbmRlciB0ZW1wbGF0ZSBhbmQgaW5zZXJ0IGl0IGluIHRoZSBtYWluIGVsZW1lbnRcbiAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB0aGlzLm9uUmVuZGVyKCk7XG5cbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gIH1cblxuICAvLyBMSUZFIENZQ0xFIE1FVEhPRFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiB0ZW1wbGF0ZSBhbmQgY29udGVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcj1udWxsXSAtIElmIHNwZWNpZmllZCByZW5kZXIgb25seSB0aGUgcGFydCBvZiB0aGVcbiAgICogIHZpZXcgaW5zaWRlIHRoZSBtYXRjaGVkIGVsZW1lbnQsIGlmIHRoaXMgZWxlbWVudCBjb250YWlucyBhIGNvbXBvbmVudFxuICAgKiAgKHN1Yi12aWV3KSwgdGhlIGNvbXBvbmVudCBpcyByZW5kZXJlZC4gUmVuZGVyIGFsbCB0aGUgdmlldyBvdGhlcndpc2UuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuICByZW5kZXIoc2VsZWN0b3IgPSBudWxsKSB7XG4gICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLm9uUmVzaXplKHZpZXdwb3J0LndpZHRoLCB2aWV3cG9ydC5oZWlnaHQsIHZpZXdwb3J0Lm9yaWVudGF0aW9uLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgdGhlIHZpZXcgKGB0aGlzLiRlbGApIGludG8gdGhlIGdpdmVuIGVsZW1lbnQuIENhbGwgYFZpZXd+b25TaG93YCB3aGVuIGRvbmUuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHBhcmVudCAtIFRoZSBlbGVtZW50IGluc2lkZSB3aGljaCB0aGUgdmlldyBpcyBpbnNlcnRlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGFwcGVuZFRvKCRwYXJlbnQpIHtcbiAgICB0aGlzLiRwYXJlbnQgPSAkcGFyZW50O1xuICAgICRwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIHZpZXcgLlxuICAgKiBAcHJpdmF0ZSAtIHRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmBcbiAgICovXG4gIHNob3coKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICAgIC8vIG11c3QgcmVzaXplIGJlZm9yZSBjaGlsZCBjb21wb25lbnRcbiAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHZpZXdwb3J0LmFkZFJlc2l6ZUxpc3RlbmVyKHRoaXMub25SZXNpemUpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ3Nob3cnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3IGFuZCB1bmluc3RhbGwgZXZlbnRzLlxuICAgKiBAcHJpdmF0ZSAtIHRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmBcbiAgICovXG4gIGhpZGUoKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHZpZXdwb3J0LnJlbW92ZVJlc2l6ZUxpc3RlbmVyKHRoaXMub25SZXNpemUpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ2hpZGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXZlbnRzIGxpc3RlbmVycyBhbmQgcmVtb3ZlIHRoZSB2aWV3IGZyb20gaXQncyBjb250YWluZXIuXG4gICAqIEBwcml2YXRlIC0gdGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYFxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuaGlkZSgpO1xuICAgIHRoaXMuJGVsLnJlbW92ZSgpO1xuICAgIC8vIHRoaXMuJHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLiRlbCk7XG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ3JlbW92ZScpO1xuICB9XG5cblxuICAvKipcbiAgICogRW50cnkgcG9pbnQgd2hlbiB0aGUgRE9NIGlzIHJlYWR5LiBJcyBtYWlubHkgZXhwb3NlZCB0byBjYWNoZSBzb21lIGVsZW1lbnQuXG4gICAqL1xuICBvblJlbmRlcigpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBgdmlld3BvcnQucmVzaXplYCBldmVudC4gTWFpbnRhaW4gYCRlbGAgaW4gc3luYyB3aXRoIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9yaWVudGF0aW9uIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0V2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0IGluIHBpeGVscy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZpZXdwb3J0SGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQgaW4gcGl4ZWxzLlxuICAgKiBAdG9kbyAtIG1vdmUgYG9yaWVudGF0aW9uYCB0byB0aGlyZCBhcmd1bWVudFxuICAgKiBAdG9kbyAtIHJlbmFtZSB0byBgcmVzaXplYFxuICAgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uLCBwcm9wYWdhdGUgPSBmYWxzZSkge1xuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gYCR7dmlld3BvcnRXaWR0aH1weGA7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnRIZWlnaHR9cHhgO1xuICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcnRyYWl0JywgJ2xhbmRzY2FwZScpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQob3JpZW50YXRpb24pO1xuICAgIC8vIGRvIG5vdCBwcm9wYWdhdGUgdG8gY29tcG9uZW50IGFzIHRoZXkgYXJlIGxpc3RlbmluZyB2aWV3cG9ydCdzIGV2ZW50IHRvby5cbiAgICBpZiAocHJvcGFnYXRlKVxuICAgICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ29uUmVzaXplJywgdmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgfVxuXG4gIC8vIEVWRU5UUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIGluc3RhbGwgZXZlbnRzIGFmdGVyIGluc3RhbmNpYXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBBbiBvYmplY3Qgb2YgZXZlbnRzIG1pbWljaW5nIHRoZSBCYWNrYm9uZSdzIHN5bnRheC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthdmVycmlkZT1mYWxzZV0gLSBJZiBzZXQgdHJ1ZSwgcmVwbGFjZSB0aGUgcHJldmlvdXMgZXZlbnRzXG4gICAqICB3aXRoIHRoZSBvbmVzIGdpdmVuLlxuICAgKi9cbiAgaW5zdGFsbEV2ZW50cyhldmVudHMsIG92ZXJyaWRlID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IG92ZXJyaWRlID8gZXZlbnRzIDogT2JqZWN0LmFzc2lnbih0aGlzLmV2ZW50cywgZXZlbnRzKTtcblxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGV2ZW50IGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMuZXZlbnRzYCBvYmplY3QgKHdoaWNoIHNob3VsZFxuICAgKiBmb2xsb3cgdGhlIEJhY2tib25lJ3MgZXZlbnQgc3ludGF4KVxuICAgKi9cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIC8vIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdfZGVsZWdhdGVFdmVudHMnKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuXG4gICAgICB0aGlzLl9kZWxlZ2F0ZS5vbihldmVudCwgc2VsZWN0b3IgfHzCoG51bGwsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMuZXZlbnRzYCBvYmplY3QgKHdoaWNoIHNob3VsZFxuICAgKiBmb2xsb3cgdGhlIEJhY2tib25lJ3MgZXZlbnQgc3ludGF4KVxuICAgKi9cbiAgX3VuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgLy8gdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ191bmRlbGVnYXRlRXZlbnRzJyk7XG4gICAgdGhpcy5fZGVsZWdhdGUub2ZmKCk7XG4gIH1cbn1cbiJdfQ==
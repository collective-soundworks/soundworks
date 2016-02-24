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
      for (var selector in this._components) {
        var view = this._components[selector];
        view[method]();
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

      // resize parent before rendering components children
      this.onResize(_viewport2['default'].width, _viewport2['default'].height, _viewport2['default'].orientation);

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
      this.$el.style.width = viewportWidth + 'px';
      this.$el.style.height = viewportHeight + 'px';
      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;

      this.orientation = orientation;
      this.$el.classList.remove('portrait', 'landscape');
      this.$el.classList.add(orientation);
      // do not propagate to component as they are listening viewport's event too.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvZGlzcGxheS9WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBaUIsaUJBQWlCOzs7O3dCQUNiLFlBQVk7Ozs7MkJBQ1osY0FBYzs7Ozs7Ozs7OztJQVFkLElBQUk7QUFDWixXQURRLElBQUksQ0FDWCxRQUFRLEVBQTJDO1FBQXpDLE9BQU8seURBQUcsRUFBRTtRQUFFLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRDFDLElBQUk7Ozs7OztBQU1yQixRQUFJLENBQUMsSUFBSSxHQUFHLGlDQUFLLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7QUFNM0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7QUFPdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Ozs7OztBQU1yQixRQUFJLENBQUMsT0FBTyxHQUFHLGVBQWM7QUFDM0IsUUFBRSxFQUFFLEtBQUs7QUFDVCxRQUFFLEVBQUUsSUFBSTtBQUNSLGVBQVMsRUFBRSxJQUFJO0tBQ2hCLEVBQUUsT0FBTyxDQUFDLENBQUM7Ozs7OztBQU1aLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7Ozs7OztBQU10QyxRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTXhCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOzs7Ozs7QUFNdkIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWxCLFFBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVuRCxRQUFJLENBQUMsU0FBUyxH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U0FBUyxFQUNoQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDMUI7Ozs7Ozs7O1dBTWMsMkJBQUc7O0FBRWhCLFdBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt5QkFDRCxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs7OztZQUFsQyxNQUFLO1lBQUUsUUFBUTs7QUFDdEIsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFbEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBSyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDdEQ7S0FDRjs7Ozs7Ozs7V0FNZ0IsNkJBQUc7O0FBRWxCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDdEI7OztTQTdSa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9kaXNwbGF5L1ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdG1wbCBmcm9tICdsb2Rhc2gudGVtcGxhdGUnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuaW1wb3J0IERlbGVnYXRlIGZyb20gJ2RvbS1kZWxlZ2F0ZSc7XG5cblxuLyoqXG4gKiBbY2xpZW50XSAtIFZpZXcuXG4gKlxuICogQHRvZG9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCwgdG8gYmUgY2FsbGVkIHdpdGggYGNvbnRlbnRgIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy50bXBsID0gdG1wbCh0ZW1wbGF0ZSk7XG5cbiAgICAvKipcbiAgICAgKiBEYXRhIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gcG9wdWxhdGUgdGhlIHRlbXBsYXRlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuIEVhY2ggZW50cnkgZm9sbG93cyB0aGUgY29udmVudGlvbjpcbiAgICAgKiBgJ2V2ZW50TmFtZSBbY3NzU2VsZWN0b3JdJzogY2FsbGJhY2tGdW5jdGlvbmBcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuXG4gICAgLyoqXG4gICAgICogT3B0aW9ucyBvZiB0aGUgVmlldy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZWw6ICdkaXYnLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBQcmlvcml0eSBvZiB0aGUgdmlldy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMucHJpb3JpdHkgPSB0aGlzLm9wdGlvbnMucHJpb3JpdHk7XG5cbiAgICAvKipcbiAgICAgKiBPcmllbnRhdGlvbiBvZiB0aGUgdmlldyAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJylcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBpZiB0aGUgdmlldyBpcyB2aXNpYmxlIG9yIG5vdC5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBTdG9yZSB0aGUgY29tcG9uZW50cyAoc3ViLXZpZXdzKSBvZiB0aGUgdmlldy5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2NvbXBvbmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIHJlZm9ybWF0dGluZyBvZiBgdGhpcy5ldmVudHNgIGZvciBldmVudCBkZWxlZ2F0aW9uIGludGVybmFsIHVzZS5cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lciBlbGVtZW50IG9mIHRoZSB2aWV3LiBEZWZhdWx0cyB0byBgPGRpdj5gLlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMuZWwpO1xuXG4gICAgdGhpcy5fZGVsZWdhdGUgPSBuZXcgRGVsZWdhdGUodGhpcy4kZWwpO1xuICAgIHRoaXMub25SZXNpemUgPSB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmluc3RhbGxFdmVudHModGhpcy5ldmVudHMsIGZhbHNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb3IgcmVtb3ZlIGEgY29tcG91bmQgdmlldyBpbnNpZGUgdGhlIGN1cnJlbnQgdmlldy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIC0gQSBjc3Mgc2VsZWN0b3IgbWF0Y2hpbmcgYW4gZWxlbWVudCBvZiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSB7Vmlld30gW3ZpZXc9bnVsbF0gLSBUaGUgdmlldyB0byBpbnNlcnQgaW5zaWRlIHRoZSBzZWxlY3Rvci4gSWYgc2V0XG4gICAqICB0byBgbnVsbGAgZGVzdHJveSB0aGUgY29tcG9uZW50LlxuICAgKi9cbiAgc2V0Vmlld0NvbXBvbmVudChzZWxlY3RvciwgdmlldyA9IG51bGwpIHtcbiAgICBjb25zdCBwcmV2VmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgIGlmIChwcmV2VmlldyBpbnN0YW5jZW9mIFZpZXcpIHsgcHJldlZpZXcucmVtb3ZlKCk7IH1cblxuICAgIGlmICh2aWV3ID09PSBudWxsKSB7XG4gICAgICBkZWxldGUgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdID0gdmlldztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRXhlY3V0ZSBhIG1ldGhvZCBvbiBhbGwgdGhlIGBjb21wb25lbnRzYCAoc3ViLXZpZXdzKS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG1ldGhvZCAtIFRoZSBuYW1lIG9mIHRoZSBtZXRob2QgdG8gYmUgZXhlY3V0ZWQuXG4gICAqL1xuICBfZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QobWV0aG9kKSB7XG4gICAgZm9yIChsZXQgc2VsZWN0b3IgaW4gdGhpcy5fY29tcG9uZW50cykge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgICAgdmlld1ttZXRob2RdKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBwYXJ0aWFsbHkgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBzZWxlY3Rvci4gSWYgdGhlIHNlbGVjdG9yXG4gICAqIGlzIGFzc29jaWF0ZWQgdG8gYSBgY29tcG9uZW50YCAoc3ViLXZpZXdzKSwgdGhlIGBjb21wb25lbnRgIGlzIHJlbmRlcmVkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBBIGNzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB2aWV3LlxuICAgKi9cbiAgX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpIHtcbiAgICBjb25zdCAkY29tcG9uZW50Q29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgIGNvbXBvbmVudC5hcHBlbmRUbygkY29tcG9uZW50Q29udGFpbmVyKTtcbiAgICAgIGNvbXBvbmVudC5vblJlbmRlcigpO1xuXG4gICAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICAgIGNvbXBvbmVudC5zaG93KCk7XG4gICAgICBlbHNlXG4gICAgICAgIGNvbXBvbmVudC5oaWRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICAgIGNvbnN0ICR0bXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICR0bXAuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICRjb21wb25lbnRDb250YWluZXIuaW5uZXJIVE1MID0gJHRtcC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5pbm5lckhUTUw7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgd2hvbGUgdmlldyBhbmQgaXRzIGNvbXBvbmVudCAoc3ViLXZpZXdzKS5cbiAgICovXG4gIF9yZW5kZXJBbGwoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcbiAgICAvLyBzZXQgaWQgb2YgdGhlIGNvbnRhaW5lciBpZCBnaXZlblxuICAgIGlmIChvcHRpb25zLmlkKVxuICAgICAgdGhpcy4kZWwuaWQgPSBvcHRpb25zLmlkO1xuICAgIC8vIHNldCBjbGFzc2VzIG9mIHRoZSBjb250YWluZXIgaWYgZ2l2ZW5cbiAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IG9wdGlvbnMuY2xhc3NOYW1lO1xuICAgICAgY29uc3QgY2xhc3NlcyA9IHR5cGVvZiBjbGFzc05hbWUgPT09ICdzdHJpbmcnID8gW2NsYXNzTmFtZV0gOiBjbGFzc05hbWU7XG4gICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXMpO1xuICAgIH1cblxuICAgIC8vIHJlbmRlciB0ZW1wbGF0ZSBhbmQgaW5zZXJ0IGl0IGluIHRoZSBtYWluIGVsZW1lbnRcbiAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICB0aGlzLm9uUmVuZGVyKCk7XG5cbiAgICAvLyByZXNpemUgcGFyZW50IGJlZm9yZSByZW5kZXJpbmcgY29tcG9uZW50cyBjaGlsZHJlblxuICAgIHRoaXMub25SZXNpemUodmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCwgdmlld3BvcnQub3JpZW50YXRpb24pO1xuXG4gICAgZm9yIChsZXQgc2VsZWN0b3IgaW4gdGhpcy5fY29tcG9uZW50cylcbiAgICAgIHRoaXMuX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpO1xuICB9XG5cbiAgLy8gTElGRSBDWUNMRSBNRVRIT0RTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gdGVtcGxhdGUgYW5kIGNvbnRlbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbc2VsZWN0b3I9bnVsbF0gLSBJZiBzcGVjaWZpZWQgcmVuZGVyIG9ubHkgdGhlIHBhcnQgb2YgdGhlXG4gICAqICB2aWV3IGluc2lkZSB0aGUgbWF0Y2hlZCBlbGVtZW50LCBpZiB0aGlzIGVsZW1lbnQgY29udGFpbnMgYSBjb21wb25lbnRcbiAgICogIChzdWItdmlldyksIHRoZSBjb21wb25lbnQgaXMgcmVuZGVyZWQuIFJlbmRlciBhbGwgdGhlIHZpZXcgb3RoZXJ3aXNlLlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgKi9cbiAgcmVuZGVyKHNlbGVjdG9yID0gbnVsbCkge1xuICAgIGlmIChzZWxlY3RvciAhPT0gbnVsbClcbiAgICAgIHRoaXMuX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3JlbmRlckFsbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCB0aGUgdmlldyAoYHRoaXMuJGVsYCkgaW50byB0aGUgZ2l2ZW4gZWxlbWVudC4gQ2FsbCBgVmlld35vblNob3dgIHdoZW4gZG9uZS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkcGFyZW50IC0gVGhlIGVsZW1lbnQgaW5zaWRlIHdoaWNoIHRoZSB2aWV3IGlzIGluc2VydGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXBwZW5kVG8oJHBhcmVudCkge1xuICAgIHRoaXMuJHBhcmVudCA9ICRwYXJlbnQ7XG4gICAgJHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogU2hvdyB0aGUgdmlldyAuXG4gICAqIEBwcml2YXRlIC0gdGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYFxuICAgKi9cbiAgc2hvdygpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgLy8gbXVzdCByZXNpemUgYmVmb3JlIGNoaWxkIGNvbXBvbmVudFxuICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQuYWRkUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG5cbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnc2hvdycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIHZpZXcgYW5kIHVuaW5zdGFsbCBldmVudHMuXG4gICAqIEBwcml2YXRlIC0gdGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYFxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQucmVtb3ZlUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG5cbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnaGlkZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudHMgbGlzdGVuZXJzIGFuZCByZW1vdmUgdGhlIHZpZXcgZnJvbSBpdCdzIGNvbnRhaW5lci5cbiAgICogQHByaXZhdGUgLSB0aGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IHRoZSBgdmlld01hbmFnZXJgXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gICAgLy8gdGhpcy4kcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuJGVsKTtcbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgncmVtb3ZlJyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCB3aGVuIHRoZSBET00gaXMgcmVhZHkuIElzIG1haW5seSBleHBvc2VkIHRvIGNhY2hlIHNvbWUgZWxlbWVudC5cbiAgICovXG4gIG9uUmVuZGVyKCkge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGB2aWV3cG9ydC5yZXNpemVgIGV2ZW50LiBNYWludGFpbiBgJGVsYCBpbiBzeW5jIHdpdGggdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRXaWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQgaW4gcGl4ZWxzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqIEB0b2RvIC0gbW92ZSBgb3JpZW50YXRpb25gIHRvIHRoaXJkIGFyZ3VtZW50XG4gICAqIEB0b2RvIC0gcmVuYW1lIHRvIGByZXNpemVgXG4gICAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9IGAke3ZpZXdwb3J0V2lkdGh9cHhgO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9IGAke3ZpZXdwb3J0SGVpZ2h0fXB4YDtcbiAgICB0aGlzLnZpZXdwb3J0V2lkdGggPSB2aWV3cG9ydFdpZHRoO1xuICAgIHRoaXMudmlld3BvcnRIZWlnaHQgPSB2aWV3cG9ydEhlaWdodDtcblxuICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdwb3J0cmFpdCcsICdsYW5kc2NhcGUnKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKG9yaWVudGF0aW9uKTtcbiAgICAvLyBkbyBub3QgcHJvcGFnYXRlIHRvIGNvbXBvbmVudCBhcyB0aGV5IGFyZSBsaXN0ZW5pbmcgdmlld3BvcnQncyBldmVudCB0b28uXG4gIH1cblxuICAvLyBFVkVOVFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBBbGxvdyB0byBpbnN0YWxsIGV2ZW50cyBhZnRlciBpbnN0YW5jaWF0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gQW4gb2JqZWN0IG9mIGV2ZW50cyBtaW1pY2luZyB0aGUgQmFja2JvbmUncyBzeW50YXguXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbYXZlcnJpZGU9ZmFsc2VdIC0gSWYgc2V0IHRydWUsIHJlcGxhY2UgdGhlIHByZXZpb3VzIGV2ZW50c1xuICAgKiAgd2l0aCB0aGUgb25lcyBnaXZlbi5cbiAgICovXG4gIGluc3RhbGxFdmVudHMoZXZlbnRzLCBvdmVycmlkZSA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuXG4gICAgdGhpcy5ldmVudHMgPSBvdmVycmlkZSA/IGV2ZW50cyA6IE9iamVjdC5hc3NpZ24odGhpcy5ldmVudHMsIGV2ZW50cyk7XG5cbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBldmVudCBsaXN0ZW5lcnMgYWNjb3JkaW5nIHRvIGB0aGlzLmV2ZW50c2Agb2JqZWN0ICh3aGljaCBzaG91bGRcbiAgICogZm9sbG93IHRoZSBCYWNrYm9uZSdzIGV2ZW50IHN5bnRheClcbiAgICovXG4gIF9kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICAvLyB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnX2RlbGVnYXRlRXZlbnRzJyk7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICBjb25zdCBbZXZlbnQsIHNlbGVjdG9yXSA9IGtleS5zcGxpdCgvICsvKTtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5ldmVudHNba2V5XTtcblxuICAgICAgdGhpcy5fZGVsZWdhdGUub24oZXZlbnQsIHNlbGVjdG9yIHx8wqBudWxsLCBjYWxsYmFjayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudCBsaXN0ZW5lcnMgYWNjb3JkaW5nIHRvIGB0aGlzLmV2ZW50c2Agb2JqZWN0ICh3aGljaCBzaG91bGRcbiAgICogZm9sbG93IHRoZSBCYWNrYm9uZSdzIGV2ZW50IHN5bnRheClcbiAgICovXG4gIF91bmRlbGVnYXRlRXZlbnRzKCkge1xuICAgIC8vIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdfdW5kZWxlZ2F0ZUV2ZW50cycpO1xuICAgIHRoaXMuX2RlbGVnYXRlLm9mZigpO1xuICB9XG59XG4iXX0=
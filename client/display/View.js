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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBQWlCLGlCQUFpQjs7Ozt3QkFDYixZQUFZOzs7OzJCQUNaLGNBQWM7Ozs7Ozs7Ozs7SUFRZCxJQUFJO0FBQ1osV0FEUSxJQUFJLENBQ1gsUUFBUSxFQUEyQztRQUF6QyxPQUFPLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQyxJQUFJOzs7Ozs7QUFNckIsUUFBSSxDQUFDLElBQUksR0FBRyxpQ0FBSyxRQUFRLENBQUMsQ0FBQzs7Ozs7O0FBTTNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7O0FBT3ZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzs7Ozs7QUFNckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFjO0FBQzNCLFFBQUUsRUFBRSxLQUFLO0FBQ1QsUUFBRSxFQUFFLElBQUk7QUFDUixlQUFTLEVBQUUsSUFBSTtLQUNoQixFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7QUFNWixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDOzs7Ozs7QUFNdEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7OztBQU14QixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7Ozs7O0FBTXZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7OztBQU1sQixRQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFF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Q0FBQyxDQUFDO0tBQzVGOzs7Ozs7Ozs7Ozs7V0FVWSx1QkFBQyxNQUFNLEVBQW9CO1VBQWxCLFFBQVEseURBQUcsS0FBSzs7QUFDcEMsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUNoQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLEdBQUcsTUFBTSxHQUFHLGVBQWMsSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFckUsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUNoQixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7S0FDMUI7Ozs7Ozs7O1dBTWMsMkJBQUc7O0FBRWhCLFdBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTt5QkFDRCxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs7OztZQUFsQyxNQUFLO1lBQUUsUUFBUTs7QUFDdEIsWUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFbEMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsTUFBSyxFQUFFLFFBQVEsSUFBSSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7T0FDdEQ7S0FDRjs7Ozs7Ozs7V0FNZ0IsNkJBQUc7O0FBRWxCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDdEI7OztTQWhTa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvZGlzcGxheS9WaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRtcGwgZnJvbSAnbG9kYXNoLnRlbXBsYXRlJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuL3ZpZXdwb3J0JztcbmltcG9ydCBEZWxlZ2F0ZSBmcm9tICdkb20tZGVsZWdhdGUnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gLSBWaWV3LlxuICpcbiAqIEB0b2RvXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGB0ZW1wbGF0ZWAsIHRvIGJlIGNhbGxlZCB3aXRoIGBjb250ZW50YCBvYmplY3QuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMudG1wbCA9IHRtcGwodGVtcGxhdGUpO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSB0byBiZSB1c2VkIGluIG9yZGVyIHRvIHBvcHVsYXRlIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LiBFYWNoIGVudHJ5IGZvbGxvd3MgdGhlIGNvbnZlbnRpb246XG4gICAgICogYCdldmVudE5hbWUgW2Nzc1NlbGVjdG9yXSc6IGNhbGxiYWNrRnVuY3Rpb25gXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIFZpZXcuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGVsOiAnZGl2JyxcbiAgICAgIGlkOiBudWxsLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogUHJpb3JpdHkgb2YgdGhlIHZpZXcuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnByaW9yaXR5ID0gdGhpcy5vcHRpb25zLnByaW9yaXR5O1xuXG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXcgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgaWYgdGhlIHZpZXcgaXMgdmlzaWJsZSBvciBub3QuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuXG4gICAgLyoqXG4gICAgICogU3RvcmUgdGhlIGNvbXBvbmVudHMgKHN1Yi12aWV3cykgb2YgdGhlIHZpZXcuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9jb21wb25lbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiByZWZvcm1hdHRpbmcgb2YgYHRoaXMuZXZlbnRzYCBmb3IgZXZlbnQgZGVsZWdhdGlvbiBpbnRlcm5hbCB1c2UuXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjb250YWluZXIgZWxlbWVudCBvZiB0aGUgdmlldy4gRGVmYXVsdHMgdG8gYDxkaXY+YC5cbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5vcHRpb25zLmVsKTtcblxuICAgIHRoaXMuX2RlbGVnYXRlID0gbmV3IERlbGVnYXRlKHRoaXMuJGVsKTtcbiAgICB0aGlzLm9uUmVzaXplID0gdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5pbnN0YWxsRXZlbnRzKHRoaXMuZXZlbnRzLCBmYWxzZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9yIHJlbW92ZSBhIGNvbXBvdW5kIHZpZXcgaW5zaWRlIHRoZSBjdXJyZW50IHZpZXcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciAtIEEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIGFuIGVsZW1lbnQgb2YgdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0ge1ZpZXd9IFt2aWV3PW51bGxdIC0gVGhlIHZpZXcgdG8gaW5zZXJ0IGluc2lkZSB0aGUgc2VsZWN0b3IuIElmIHNldFxuICAgKiAgdG8gYG51bGxgIGRlc3Ryb3kgdGhlIGNvbXBvbmVudC5cbiAgICovXG4gIHNldFZpZXdDb21wb25lbnQoc2VsZWN0b3IsIHZpZXcgPSBudWxsKSB7XG4gICAgY29uc3QgcHJldlZpZXcgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICBpZiAocHJldlZpZXcgaW5zdGFuY2VvZiBWaWV3KSB7IHByZXZWaWV3LnJlbW92ZSgpOyB9XG5cbiAgICBpZiAodmlldyA9PT0gbnVsbCkge1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXSA9IHZpZXc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEV4ZWN1dGUgYSBtZXRob2Qgb24gYWxsIHRoZSBgY29tcG9uZW50c2AgKHN1Yi12aWV3cykuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgLSBUaGUgbmFtZSBvZiB0aGUgbWV0aG9kIHRvIGJlIGV4ZWN1dGVkLlxuICAgKi9cbiAgX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKG1ldGhvZCwgLi4uYXJncykge1xuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAgIHZpZXdbbWV0aG9kXSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHBhcnRpYWxseSB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHNlbGVjdG9yLiBJZiB0aGUgc2VsZWN0b3JcbiAgICogaXMgYXNzb2NpYXRlZCB0byBhIGBjb21wb25lbnRgIChzdWItdmlld3MpLCB0aGUgYGNvbXBvbmVudGAgaXMgcmVuZGVyZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciAtIEEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIGFuIGVsZW1lbnQgb2YgdGhlIHZpZXcuXG4gICAqL1xuICBfcmVuZGVyUGFydGlhbChzZWxlY3Rvcikge1xuICAgIGNvbnN0ICRjb21wb25lbnRDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAkY29tcG9uZW50Q29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LnJlbmRlcigpO1xuICAgICAgY29tcG9uZW50LmFwcGVuZFRvKCRjb21wb25lbnRDb250YWluZXIpO1xuICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgICAgY29tcG9uZW50LnNob3coKTtcbiAgICAgIGVsc2VcbiAgICAgICAgY29tcG9uZW50LmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLmNvbnRlbnQpO1xuICAgICAgY29uc3QgJHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgJHRtcC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAkdG1wLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTDtcbiAgICAgIHRoaXMub25SZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB3aG9sZSB2aWV3IGFuZCBpdHMgY29tcG9uZW50IChzdWItdmlld3MpLlxuICAgKi9cbiAgX3JlbmRlckFsbCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIC8vIHNldCBpZCBvZiB0aGUgY29udGFpbmVyIGlkIGdpdmVuXG4gICAgaWYgKG9wdGlvbnMuaWQpXG4gICAgICB0aGlzLiRlbC5pZCA9IG9wdGlvbnMuaWQ7XG4gICAgLy8gc2V0IGNsYXNzZXMgb2YgdGhlIGNvbnRhaW5lciBpZiBnaXZlblxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XG4gICAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIGNsYXNzTmFtZSA9PT0gJ3N0cmluZycgPyBbY2xhc3NOYW1lXSA6IGNsYXNzTmFtZTtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIHRlbXBsYXRlIGFuZCBpbnNlcnQgaXQgaW4gdGhlIG1haW4gZWxlbWVudFxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHRoaXMub25SZW5kZXIoKTtcblxuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpXG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgfVxuXG4gIC8vIExJRkUgQ1lDTEUgTUVUSE9EUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHRlbXBsYXRlIGFuZCBjb250ZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3NlbGVjdG9yPW51bGxdIC0gSWYgc3BlY2lmaWVkIHJlbmRlciBvbmx5IHRoZSBwYXJ0IG9mIHRoZVxuICAgKiAgdmlldyBpbnNpZGUgdGhlIG1hdGNoZWQgZWxlbWVudCwgaWYgdGhpcyBlbGVtZW50IGNvbnRhaW5zIGEgY29tcG9uZW50XG4gICAqICAoc3ViLXZpZXcpLCB0aGUgY29tcG9uZW50IGlzIHJlbmRlcmVkLiBSZW5kZXIgYWxsIHRoZSB2aWV3IG90aGVyd2lzZS5cbiAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICovXG4gIHJlbmRlcihzZWxlY3RvciA9IG51bGwpIHtcbiAgICBpZiAoc2VsZWN0b3IgIT09IG51bGwpXG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9yZW5kZXJBbGwoKTtcblxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMub25SZXNpemUodmlld3BvcnQud2lkdGgsIHZpZXdwb3J0LmhlaWdodCwgdmlld3BvcnQub3JpZW50YXRpb24sIHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCB0aGUgdmlldyAoYHRoaXMuJGVsYCkgaW50byB0aGUgZ2l2ZW4gZWxlbWVudC4gQ2FsbCBgVmlld35vblNob3dgIHdoZW4gZG9uZS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkcGFyZW50IC0gVGhlIGVsZW1lbnQgaW5zaWRlIHdoaWNoIHRoZSB2aWV3IGlzIGluc2VydGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgYXBwZW5kVG8oJHBhcmVudCkge1xuICAgIHRoaXMuJHBhcmVudCA9ICRwYXJlbnQ7XG4gICAgJHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogU2hvdyB0aGUgdmlldyAuXG4gICAqIEBwcml2YXRlIC0gdGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYFxuICAgKi9cbiAgc2hvdygpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgLy8gbXVzdCByZXNpemUgYmVmb3JlIGNoaWxkIGNvbXBvbmVudFxuICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQuYWRkUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG5cbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnc2hvdycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIHZpZXcgYW5kIHVuaW5zdGFsbCBldmVudHMuXG4gICAqIEBwcml2YXRlIC0gdGhpcyBtZXRob2Qgc2hvdWxkIG9ubHkgYmUgdXNlZCBieSB0aGUgYHZpZXdNYW5hZ2VyYFxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQucmVtb3ZlUmVzaXplTGlzdGVuZXIodGhpcy5vblJlc2l6ZSk7XG5cbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnaGlkZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudHMgbGlzdGVuZXJzIGFuZCByZW1vdmUgdGhlIHZpZXcgZnJvbSBpdCdzIGNvbnRhaW5lci5cbiAgICogQHByaXZhdGUgLSB0aGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IHRoZSBgdmlld01hbmFnZXJgXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy4kZWwucmVtb3ZlKCk7XG4gICAgLy8gdGhpcy4kcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuJGVsKTtcbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgncmVtb3ZlJyk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCB3aGVuIHRoZSBET00gaXMgcmVhZHkuIElzIG1haW5seSBleHBvc2VkIHRvIGNhY2hlIHNvbWUgZWxlbWVudC5cbiAgICovXG4gIG9uUmVuZGVyKCkge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGB2aWV3cG9ydC5yZXNpemVgIGV2ZW50LiBNYWludGFpbiBgJGVsYCBpbiBzeW5jIHdpdGggdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRXaWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQgaW4gcGl4ZWxzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqIEB0b2RvIC0gbW92ZSBgb3JpZW50YXRpb25gIHRvIHRoaXJkIGFyZ3VtZW50XG4gICAqIEB0b2RvIC0gcmVuYW1lIHRvIGByZXNpemVgXG4gICAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24sIHByb3BhZ2F0ZSA9IGZhbHNlKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSBgJHt2aWV3cG9ydFdpZHRofXB4YDtcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSBgJHt2aWV3cG9ydEhlaWdodH1weGA7XG4gICAgdGhpcy52aWV3cG9ydFdpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB0aGlzLnZpZXdwb3J0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQ7XG5cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgncG9ydHJhaXQnLCAnbGFuZHNjYXBlJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZChvcmllbnRhdGlvbik7XG4gICAgLy8gZG8gbm90IHByb3BhZ2F0ZSB0byBjb21wb25lbnQgYXMgdGhleSBhcmUgbGlzdGVuaW5nIHZpZXdwb3J0J3MgZXZlbnQgdG9vLlxuICAgIGlmIChwcm9wYWdhdGUpXG4gICAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnb25SZXNpemUnLCB2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICB9XG5cbiAgLy8gRVZFTlRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogQWxsb3cgdG8gaW5zdGFsbCBldmVudHMgYWZ0ZXIgaW5zdGFuY2lhdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIEFuIG9iamVjdCBvZiBldmVudHMgbWltaWNpbmcgdGhlIEJhY2tib25lJ3Mgc3ludGF4LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW2F2ZXJyaWRlPWZhbHNlXSAtIElmIHNldCB0cnVlLCByZXBsYWNlIHRoZSBwcmV2aW91cyBldmVudHNcbiAgICogIHdpdGggdGhlIG9uZXMgZ2l2ZW4uXG4gICAqL1xuICBpbnN0YWxsRXZlbnRzKGV2ZW50cywgb3ZlcnJpZGUgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcblxuICAgIHRoaXMuZXZlbnRzID0gb3ZlcnJpZGUgPyBldmVudHMgOiBPYmplY3QuYXNzaWduKHRoaXMuZXZlbnRzLCBldmVudHMpO1xuXG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZXZlbnQgbGlzdGVuZXJzIGFjY29yZGluZyB0byBgdGhpcy5ldmVudHNgIG9iamVjdCAod2hpY2ggc2hvdWxkXG4gICAqIGZvbGxvdyB0aGUgQmFja2JvbmUncyBldmVudCBzeW50YXgpXG4gICAqL1xuICBfZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgLy8gdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ19kZWxlZ2F0ZUV2ZW50cycpO1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCBzZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG5cbiAgICAgIHRoaXMuX2RlbGVnYXRlLm9uKGV2ZW50LCBzZWxlY3RvciB8fMKgbnVsbCwgY2FsbGJhY2spO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXZlbnQgbGlzdGVuZXJzIGFjY29yZGluZyB0byBgdGhpcy5ldmVudHNgIG9iamVjdCAod2hpY2ggc2hvdWxkXG4gICAqIGZvbGxvdyB0aGUgQmFja2JvbmUncyBldmVudCBzeW50YXgpXG4gICAqL1xuICBfdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICAvLyB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnX3VuZGVsZWdhdGVFdmVudHMnKTtcbiAgICB0aGlzLl9kZWxlZ2F0ZS5vZmYoKTtcbiAgfVxufVxuIl19
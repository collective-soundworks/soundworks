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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBQWlCLGlCQUFpQjs7Ozt3QkFDYixZQUFZOzs7OzJCQUNaLGNBQWM7Ozs7Ozs7Ozs7SUFRZCxJQUFJO0FBQ1osV0FEUSxJQUFJLENBQ1gsUUFBUSxFQUEyQztRQUF6QyxPQUFPLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQyxJQUFJOzs7Ozs7QUFNckIsUUFBSSxDQUFDLElBQUksR0FBRyxpQ0FBSyxRQUFRLENBQUMsQ0FBQzs7Ozs7O0FBTTNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7O0FBT3ZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzs7Ozs7QUFNckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFjO0FBQzNCLFFBQUUsRUFBRSxLQUFLO0FBQ1QsUUFBRSxFQUFFLElBQUk7QUFDUixlQUFTLEVBQUUsSUFBSTtLQUNoQixFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7QUFNWixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDOzs7Ozs7QUFNdEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7OztBQU14QixRQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQzs7Ozs7O0FBTXZCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7OztBQU1sQixRQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFF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RXJFLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFDaEIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0tBQzFCOzs7Ozs7OztXQU1jLDJCQUFHOztBQUVoQixXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7eUJBQ0QsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Ozs7WUFBbEMsTUFBSztZQUFFLFFBQVE7O0FBQ3RCLFlBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWxDLFlBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLE1BQUssRUFBRSxRQUFRLElBQUksSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO09BQ3REO0tBQ0Y7Ozs7Ozs7O1dBTWdCLDZCQUFHOztBQUVsQixVQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ3RCOzs7U0E3UmtCLElBQUk7OztxQkFBSixJQUFJIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0bXBsIGZyb20gJ2xvZGFzaC50ZW1wbGF0ZSc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi92aWV3cG9ydCc7XG5pbXBvcnQgRGVsZWdhdGUgZnJvbSAnZG9tLWRlbGVnYXRlJztcblxuXG4vKipcbiAqIFtjbGllbnRdIC0gVmlldy5cbiAqXG4gKiBAdG9kb1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8qKlxuICAgICAqIEEgZnVuY3Rpb24gY3JlYXRlZCBmcm9tIHRoZSBnaXZlbiBgdGVtcGxhdGVgLCB0byBiZSBjYWxsZWQgd2l0aCBgY29udGVudGAgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtGdW5jdGlvbn1cbiAgICAgKi9cbiAgICB0aGlzLnRtcGwgPSB0bXBsKHRlbXBsYXRlKTtcblxuICAgIC8qKlxuICAgICAqIERhdGEgdG8gYmUgdXNlZCBpbiBvcmRlciB0byBwb3B1bGF0ZSB0aGUgdGVtcGxhdGUuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmNvbnRlbnQgPSBjb250ZW50O1xuXG4gICAgLyoqXG4gICAgICogRXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy4gRWFjaCBlbnRyeSBmb2xsb3dzIHRoZSBjb252ZW50aW9uOlxuICAgICAqIGAnZXZlbnROYW1lIFtjc3NTZWxlY3Rvcl0nOiBjYWxsYmFja0Z1bmN0aW9uYFxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5ldmVudHMgPSBldmVudHM7XG5cbiAgICAvKipcbiAgICAgKiBPcHRpb25zIG9mIHRoZSBWaWV3LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBlbDogJ2RpdicsXG4gICAgICBpZDogbnVsbCxcbiAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFByaW9yaXR5IG9mIHRoZSB2aWV3LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5wcmlvcml0eSA9IHRoaXMub3B0aW9ucy5wcmlvcml0eTtcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGlmIHRoZSB2aWV3IGlzIHZpc2libGUgb3Igbm90LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIFN0b3JlIHRoZSBjb21wb25lbnRzIChzdWItdmlld3MpIG9mIHRoZSB2aWV3LlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogcmVmb3JtYXR0aW5nIG9mIGB0aGlzLmV2ZW50c2AgZm9yIGV2ZW50IGRlbGVnYXRpb24gaW50ZXJuYWwgdXNlLlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGVsZW1lbnQgb2YgdGhlIHZpZXcuIERlZmF1bHRzIHRvIGA8ZGl2PmAuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5lbCk7XG5cbiAgICB0aGlzLl9kZWxlZ2F0ZSA9IG5ldyBEZWxlZ2F0ZSh0aGlzLiRlbCk7XG4gICAgdGhpcy5vblJlc2l6ZSA9IHRoaXMub25SZXNpemUuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuaW5zdGFsbEV2ZW50cyh0aGlzLmV2ZW50cywgZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBvciByZW1vdmUgYSBjb21wb3VuZCB2aWV3IGluc2lkZSB0aGUgY3VycmVudCB2aWV3LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBBIGNzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHtWaWV3fSBbdmlldz1udWxsXSAtIFRoZSB2aWV3IHRvIGluc2VydCBpbnNpZGUgdGhlIHNlbGVjdG9yLiBJZiBzZXRcbiAgICogIHRvIGBudWxsYCBkZXN0cm95IHRoZSBjb21wb25lbnQuXG4gICAqL1xuICBzZXRWaWV3Q29tcG9uZW50KHNlbGVjdG9yLCB2aWV3ID0gbnVsbCkge1xuICAgIGNvbnN0IHByZXZWaWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgaWYgKHByZXZWaWV3IGluc3RhbmNlb2YgVmlldykgeyBwcmV2Vmlldy5yZW1vdmUoKTsgfVxuXG4gICAgaWYgKHZpZXcgPT09IG51bGwpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl0gPSB2aWV3O1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGEgbWV0aG9kIG9uIGFsbCB0aGUgYGNvbXBvbmVudHNgIChzdWItdmlld3MpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbWV0aG9kIC0gVGhlIG5hbWUgb2YgdGhlIG1ldGhvZCB0byBiZSBleGVjdXRlZC5cbiAgICovXG4gIF9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZChtZXRob2QpIHtcbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgICB2aWV3W21ldGhvZF0oKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHBhcnRpYWxseSB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHNlbGVjdG9yLiBJZiB0aGUgc2VsZWN0b3JcbiAgICogaXMgYXNzb2NpYXRlZCB0byBhIGBjb21wb25lbnRgIChzdWItdmlld3MpLCB0aGUgYGNvbXBvbmVudGAgaXMgcmVuZGVyZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciAtIEEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIGFuIGVsZW1lbnQgb2YgdGhlIHZpZXcuXG4gICAqL1xuICBfcmVuZGVyUGFydGlhbChzZWxlY3Rvcikge1xuICAgIGNvbnN0ICRjb21wb25lbnRDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAkY29tcG9uZW50Q29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LnJlbmRlcigpO1xuICAgICAgY29tcG9uZW50LmFwcGVuZFRvKCRjb21wb25lbnRDb250YWluZXIpO1xuICAgICAgY29tcG9uZW50Lm9uUmVuZGVyKCk7XG5cbiAgICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgICAgY29tcG9uZW50LnNob3coKTtcbiAgICAgIGVsc2VcbiAgICAgICAgY29tcG9uZW50LmhpZGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLmNvbnRlbnQpO1xuICAgICAgY29uc3QgJHRtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgJHRtcC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAkdG1wLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB3aG9sZSB2aWV3IGFuZCBpdHMgY29tcG9uZW50IChzdWItdmlld3MpLlxuICAgKi9cbiAgX3JlbmRlckFsbCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuICAgIC8vIHNldCBpZCBvZiB0aGUgY29udGFpbmVyIGlkIGdpdmVuXG4gICAgaWYgKG9wdGlvbnMuaWQpXG4gICAgICB0aGlzLiRlbC5pZCA9IG9wdGlvbnMuaWQ7XG4gICAgLy8gc2V0IGNsYXNzZXMgb2YgdGhlIGNvbnRhaW5lciBpZiBnaXZlblxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgY2xhc3NOYW1lID0gb3B0aW9ucy5jbGFzc05hbWU7XG4gICAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIGNsYXNzTmFtZSA9PT0gJ3N0cmluZycgPyBbY2xhc3NOYW1lXSA6IGNsYXNzTmFtZTtcbiAgICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoLi4uY2xhc3Nlcyk7XG4gICAgfVxuXG4gICAgLy8gcmVuZGVyIHRlbXBsYXRlIGFuZCBpbnNlcnQgaXQgaW4gdGhlIG1haW4gZWxlbWVudFxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIHRoaXMub25SZW5kZXIoKTtcblxuICAgIC8vIHJlc2l6ZSBwYXJlbnQgYmVmb3JlIHJlbmRlcmluZyBjb21wb25lbnRzIGNoaWxkcmVuXG4gICAgdGhpcy5vblJlc2l6ZSh2aWV3cG9ydC53aWR0aCwgdmlld3BvcnQuaGVpZ2h0LCB2aWV3cG9ydC5vcmllbnRhdGlvbik7XG5cbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gIH1cblxuICAvLyBMSUZFIENZQ0xFIE1FVEhPRFMgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiB0ZW1wbGF0ZSBhbmQgY29udGVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcj1udWxsXSAtIElmIHNwZWNpZmllZCByZW5kZXIgb25seSB0aGUgcGFydCBvZiB0aGVcbiAgICogIHZpZXcgaW5zaWRlIHRoZSBtYXRjaGVkIGVsZW1lbnQsIGlmIHRoaXMgZWxlbWVudCBjb250YWlucyBhIGNvbXBvbmVudFxuICAgKiAgKHN1Yi12aWV3KSwgdGhlIGNvbXBvbmVudCBpcyByZW5kZXJlZC4gUmVuZGVyIGFsbCB0aGUgdmlldyBvdGhlcndpc2UuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuICByZW5kZXIoc2VsZWN0b3IgPSBudWxsKSB7XG4gICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKVxuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IHRoZSB2aWV3IChgdGhpcy4kZWxgKSBpbnRvIHRoZSBnaXZlbiBlbGVtZW50LiBDYWxsIGBWaWV3fm9uU2hvd2Agd2hlbiBkb25lLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRwYXJlbnQgLSBUaGUgZWxlbWVudCBpbnNpZGUgd2hpY2ggdGhlIHZpZXcgaXMgaW5zZXJ0ZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhcHBlbmRUbygkcGFyZW50KSB7XG4gICAgdGhpcy4kcGFyZW50ID0gJHBhcmVudDtcbiAgICAkcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuJGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSB2aWV3IC5cbiAgICogQHByaXZhdGUgLSB0aGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IHRoZSBgdmlld01hbmFnZXJgXG4gICAqL1xuICBzaG93KCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgICAvLyBtdXN0IHJlc2l6ZSBiZWZvcmUgY2hpbGQgY29tcG9uZW50XG4gICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgICB2aWV3cG9ydC5hZGRSZXNpemVMaXN0ZW5lcih0aGlzLm9uUmVzaXplKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdzaG93Jyk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldyBhbmQgdW5pbnN0YWxsIGV2ZW50cy5cbiAgICogQHByaXZhdGUgLSB0aGlzIG1ldGhvZCBzaG91bGQgb25seSBiZSB1c2VkIGJ5IHRoZSBgdmlld01hbmFnZXJgXG4gICAqL1xuICBoaWRlKCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcbiAgICB2aWV3cG9ydC5yZW1vdmVSZXNpemVMaXN0ZW5lcih0aGlzLm9uUmVzaXplKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdoaWRlJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50cyBsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGUgdmlldyBmcm9tIGl0J3MgY29udGFpbmVyLlxuICAgKiBAcHJpdmF0ZSAtIHRoaXMgbWV0aG9kIHNob3VsZCBvbmx5IGJlIHVzZWQgYnkgdGhlIGB2aWV3TWFuYWdlcmBcbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLiRlbC5yZW1vdmUoKTtcbiAgICAvLyB0aGlzLiRwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy4kZWwpO1xuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdyZW1vdmUnKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IHdoZW4gdGhlIERPTSBpcyByZWFkeS4gSXMgbWFpbmx5IGV4cG9zZWQgdG8gY2FjaGUgc29tZSBlbGVtZW50LlxuICAgKi9cbiAgb25SZW5kZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgYHZpZXdwb3J0LnJlc2l6ZWAgZXZlbnQuIE1haW50YWluIGAkZWxgIGluIHN5bmMgd2l0aCB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcmllbnRhdGlvbiAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydFdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2aWV3cG9ydEhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHZpZXdwb3J0IGluIHBpeGVscy5cbiAgICogQHRvZG8gLSBtb3ZlIGBvcmllbnRhdGlvbmAgdG8gdGhpcmQgYXJndW1lbnRcbiAgICogQHRvZG8gLSByZW5hbWUgdG8gYHJlc2l6ZWBcbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gYCR7dmlld3BvcnRXaWR0aH1weGA7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gYCR7dmlld3BvcnRIZWlnaHR9cHhgO1xuICAgIHRoaXMudmlld3BvcnRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgdGhpcy52aWV3cG9ydEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcnRyYWl0JywgJ2xhbmRzY2FwZScpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQob3JpZW50YXRpb24pO1xuICAgIC8vIGRvIG5vdCBwcm9wYWdhdGUgdG8gY29tcG9uZW50IGFzIHRoZXkgYXJlIGxpc3RlbmluZyB2aWV3cG9ydCdzIGV2ZW50IHRvby5cbiAgfVxuXG4gIC8vIEVWRU5UUyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIGluc3RhbGwgZXZlbnRzIGFmdGVyIGluc3RhbmNpYXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBBbiBvYmplY3Qgb2YgZXZlbnRzIG1pbWljaW5nIHRoZSBCYWNrYm9uZSdzIHN5bnRheC5cbiAgICogQHBhcmFtIHtPYmplY3R9IFthdmVycmlkZT1mYWxzZV0gLSBJZiBzZXQgdHJ1ZSwgcmVwbGFjZSB0aGUgcHJldmlvdXMgZXZlbnRzXG4gICAqICB3aXRoIHRoZSBvbmVzIGdpdmVuLlxuICAgKi9cbiAgaW5zdGFsbEV2ZW50cyhldmVudHMsIG92ZXJyaWRlID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICB0aGlzLmV2ZW50cyA9IG92ZXJyaWRlID8gZXZlbnRzIDogT2JqZWN0LmFzc2lnbih0aGlzLmV2ZW50cywgZXZlbnRzKTtcblxuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGV2ZW50IGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMuZXZlbnRzYCBvYmplY3QgKHdoaWNoIHNob3VsZFxuICAgKiBmb2xsb3cgdGhlIEJhY2tib25lJ3MgZXZlbnQgc3ludGF4KVxuICAgKi9cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIC8vIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdfZGVsZWdhdGVFdmVudHMnKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuXG4gICAgICB0aGlzLl9kZWxlZ2F0ZS5vbihldmVudCwgc2VsZWN0b3IgfHzCoG51bGwsIGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50IGxpc3RlbmVycyBhY2NvcmRpbmcgdG8gYHRoaXMuZXZlbnRzYCBvYmplY3QgKHdoaWNoIHNob3VsZFxuICAgKiBmb2xsb3cgdGhlIEJhY2tib25lJ3MgZXZlbnQgc3ludGF4KVxuICAgKi9cbiAgX3VuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgLy8gdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ191bmRlbGVnYXRlRXZlbnRzJyk7XG4gICAgdGhpcy5fZGVsZWdhdGUub2ZmKCk7XG4gIH1cbn1cbiJdfQ==
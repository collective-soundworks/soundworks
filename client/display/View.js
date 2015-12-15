'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodashTemplate = require('lodash.template');

var _lodashTemplate2 = _interopRequireDefault(_lodashTemplate);

var _viewport = require('./viewport');

var _viewport2 = _interopRequireDefault(_viewport);

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
     * Orientation of the view ('portrait'|'landscape')
     * @type {String}
     */
    this.orientation = null;

    this.options = _Object$assign({
      el: 'div',
      id: null,
      className: null
    }, options);

    this._components = {};

    /**
     * The container element of the view. Defaults to `<div>`.
     * @type {Element}
     */
    this.$el = document.createElement(this.options.el);

    this.onResize = this.onResize.bind(this);
  }

  /**
   * Add a compound view inside the current view.
   * @param {String} selector - A css selector matching an element of the template.
   * @param {View} view - The view to insert inside the selector.
   */

  _createClass(View, [{
    key: 'setViewComponent',
    value: function setViewComponent(selector, view) {
      var prevView = this._components[selector];
      if (prevView instanceof View) {
        prevView.remove();
      }

      this._components[selector] = view;
    }
  }, {
    key: '_executeViewComponentMethod',
    value: function _executeViewComponentMethod(method) {
      for (var selector in this._components) {
        var view = this._components[selector];
        view[method]();
      }
    }
  }, {
    key: '_renderPartial',
    value: function _renderPartial(selector) {
      var $componentContainer = this.$el.querySelector(selector);
      var component = this._components[selector];
      $componentContainer.innerHTML = '';

      if (component) {
        component.render();
        component.appendTo($componentContainer);
      } else {
        var html = this.tmpl(this.content);
        var $dummy = document.createElement('div');
        $dummy.innerHTML = html;
        $componentContainer.innerHTML = $dummy.querySelector(selector).innerHTML;
      }
    }
  }, {
    key: '_renderAll',
    value: function _renderAll() {
      var _this = this;

      var options = this.options;

      if (options.id) {
        this.$el.id = options.id;
      }

      if (options.className) {
        var classes = typeof options.className === 'string' ? [options.className] : options.className;

        classes.forEach(function (className) {
          return _this.$el.classList.add(className);
        });
      }

      // if rerender, uninstall events before recreating the DOM
      this._undelegateEvents();

      var html = this.tmpl(this.content);
      this.$el.innerHTML = html;
      // must resize before child component
      this.onRender();
      _viewport2['default'].addListener('resize', this.onResize);

      for (var selector in this._components) {
        this._renderPartial(selector);
      }

      this._delegateEvents();
    }

    /**
     * Render the view according to the given template and content.
     * @return {Element}
     */
  }, {
    key: 'render',
    value: function render() {
      var selector = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (selector !== null) {
        this._renderPartial(selector);
      } else {
        this._renderAll();
      }
    }

    /**
     * Insert the view (`this.$el`) into the given element. Call `View~onShow` when done.
     * @param {Element} $parent - The element where the view should be inserted.
     */
  }, {
    key: 'appendTo',
    value: function appendTo($parent) {
      this.$parent = $parent;
      $parent.appendChild(this.$el);

      this._executeViewComponentMethod('onShow');
      this.onShow();
    }

    /**
     * Remove events listeners and remove the view from it's container. Is automatically called in `Module~done`.
     */
  }, {
    key: 'remove',
    value: function remove() {
      this._executeViewComponentMethod('remove');

      this._undelegateEvents();
      this.$parent.removeChild(this.$el);

      _viewport2['default'].removeListener('resize', this.onResize);
    }

    /**
     * Hide the view.
     */
  }, {
    key: 'hide',
    value: function hide() {
      this.$el.style.display = 'none';
      this.isVisible = false;
    }

    /**
     * Show the view.
     */
  }, {
    key: 'show',
    value: function show() {
      this.$el.style.display = 'block';
      this.isVisible = true;
    }

    /**
     * Entry point for custom behavior (install plugin, ...) when the DOM of the view is ready.
     */
  }, {
    key: 'onRender',
    value: function onRender() {}

    /**
     * Entry point for custom behavior when the view is inserted into the DOM.
     */
  }, {
    key: 'onShow',
    value: function onShow() {}

    /**
     * Callback for `viewport.resize` event. Maintain `$el` in sync with the viewport.
     * @param {String} orientation - The orientation of the viewport ('portrait'|'landscape')
     * @param {Number} width - The width of the viewport in pixels.
     * @param {Number} height - The height of the viewport in pixels.
     */
  }, {
    key: 'onResize',
    value: function onResize(orientation, width, height) {
      this.orientation = orientation;
      this.$el.classList.remove('portrait', 'landscape');
      this.$el.classList.add(orientation);
      this.$el.style.width = width + 'px';
      this.$el.style.height = height + 'px';
    }

    /**
     * Allow to install events after instanciation.
     * @param {Object} events - An object of events mimicing the Backbone's syntax.
     */
  }, {
    key: 'installEvents',
    value: function installEvents(events) {
      var override = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

      this.events = override ? events : _Object$assign(this.events, events);
      this._delegateEvents();
    }
  }, {
    key: '_delegateEvents',
    value: function _delegateEvents() {
      var _this2 = this;

      this._executeViewComponentMethod('_delegateEvents');

      var _loop = function (key) {
        var _key$split = key.split(/ +/);

        var _key$split2 = _slicedToArray(_key$split, 2);

        var event = _key$split2[0];
        var selector = _key$split2[1];

        var callback = _this2.events[key];
        var $targets = !selector ? [_this2.$el] : _this2.$el.querySelectorAll(selector);

        _Array$from($targets).forEach(function ($target) {
          // don't add a listener twice, if render is called several times
          $target.removeEventListener(event, callback, false);
          $target.addEventListener(event, callback, false);
        });
      };

      for (var key in this.events) {
        _loop(key);
      }
    }
  }, {
    key: '_undelegateEvents',
    value: function _undelegateEvents() {
      var _this3 = this;

      this._executeViewComponentMethod('_undelegateEvents');

      var _loop2 = function (key) {
        var _key$split3 = key.split(/ +/);

        var _key$split32 = _slicedToArray(_key$split3, 2);

        var event = _key$split32[0];
        var selector = _key$split32[1];

        var callback = _this3.events[key];
        var $targets = !selector ? [_this3.$el] : _this3.$el.querySelectorAll(selector);

        _Array$from($targets).forEach(function ($target) {
          $target.removeEventListener(event, callback, false);
        });
      };

      for (var key in this.events) {
        _loop2(key);
      }
    }
  }]);

  return View;
})();

exports['default'] = View;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBQWlCLGlCQUFpQjs7Ozt3QkFDYixZQUFZOzs7Ozs7Ozs7O0lBT1osSUFBSTtBQUNaLFdBRFEsSUFBSSxDQUNYLFFBQVEsRUFBMkM7UUFBekMsT0FBTyx5REFBRyxFQUFFO1FBQUUsTUFBTSx5REFBRyxFQUFFO1FBQUUsT0FBTyx5REFBRyxFQUFFOzswQkFEMUMsSUFBSTs7Ozs7O0FBTXJCLFFBQUksQ0FBQyxJQUFJLEdBQUcsaUNBQUssUUFBUSxDQUFDLENBQUM7Ozs7OztBQU0zQixRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQzs7Ozs7OztBQU92QixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQzs7Ozs7O0FBTXJCLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztBQUV4QixRQUFJLENBQUMsT0FBTyxHQUFHLGVBQWM7QUFDM0IsUUFBRSxFQUFFLEtBQUs7QUFDVCxRQUFFLEVBQUUsSUFBSTtBQUNSLGVBQVMsRUFBRSxJQUFJO0tBQ2hCLEVBQUUsT0FBTyxDQUFDLENBQUM7O0FBRVosUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFbkQsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxQzs7Ozs7Ozs7ZUExQ2tCLElBQUk7O1dBaURQLDBCQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUU7QUFDL0IsVUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM1QyxVQUFJLFFBQVEsWUFBWSxJQUFJLEVBQUU7QUFBRSxnQkFBUSxDQUFD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WUFBRSxRQUFROztBQUN0QixZQUFNLFFBQVEsR0FBRyxPQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxZQUFNLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLE9BQUssR0FBRyxDQUFDLEdBQUcsT0FBSyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTlFLG9CQUFXLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUN4QyxpQkFBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDOzs7QUFQTCxXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7ZUFBcEIsR0FBRztPQVFYO0tBQ0Y7OztTQTdOa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRtcGwgZnJvbSAnbG9kYXNoLnRlbXBsYXRlJztcbmltcG9ydCB2aWV3cG9ydCBmcm9tICcuL3ZpZXdwb3J0JztcblxuLyoqXG4gKiBbY2xpZW50XSAtIFZpZXcuXG4gKlxuICogQHRvZG9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCwgdG8gYmUgY2FsbGVkIHdpdGggYGNvbnRlbnRgIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy50bXBsID0gdG1wbCh0ZW1wbGF0ZSk7XG5cbiAgICAvKipcbiAgICAgKiBEYXRhIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gcG9wdWxhdGUgdGhlIHRlbXBsYXRlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuIEVhY2ggZW50cnkgZm9sbG93cyB0aGUgY29udmVudGlvbjpcbiAgICAgKiBgJ2V2ZW50TmFtZSBbY3NzU2VsZWN0b3JdJzogY2FsbGJhY2tGdW5jdGlvbmBcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuXG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXcgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZWw6ICdkaXYnLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9jb21wb25lbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGVsZW1lbnQgb2YgdGhlIHZpZXcuIERlZmF1bHRzIHRvIGA8ZGl2PmAuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5lbCk7XG5cbiAgICB0aGlzLm9uUmVzaXplID0gdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbXBvdW5kIHZpZXcgaW5zaWRlIHRoZSBjdXJyZW50IHZpZXcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciAtIEEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIGFuIGVsZW1lbnQgb2YgdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBUaGUgdmlldyB0byBpbnNlcnQgaW5zaWRlIHRoZSBzZWxlY3Rvci5cbiAgICovXG4gIHNldFZpZXdDb21wb25lbnQoc2VsZWN0b3IsIHZpZXcpIHtcbiAgICBjb25zdCBwcmV2VmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgIGlmIChwcmV2VmlldyBpbnN0YW5jZW9mIFZpZXcpIHsgcHJldlZpZXcucmVtb3ZlKCk7IH1cblxuICAgIHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdID0gdmlldztcbiAgfVxuXG4gIF9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZChtZXRob2QpIHtcbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKSB7XG4gICAgICBjb25zdCB2aWV3ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgICB2aWV3W21ldGhvZF0oKTtcbiAgICB9XG4gIH1cblxuXG4gIF9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKSB7XG4gICAgY29uc3QgJGNvbXBvbmVudENvbnRhaW5lciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgICRjb21wb25lbnRDb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG5cbiAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICBjb21wb25lbnQucmVuZGVyKCk7XG4gICAgICBjb21wb25lbnQuYXBwZW5kVG8oJGNvbXBvbmVudENvbnRhaW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICAgIGNvbnN0ICRkdW1teSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgJGR1bW15LmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAkY29tcG9uZW50Q29udGFpbmVyLmlubmVySFRNTCA9ICRkdW1teS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKS5pbm5lckhUTUw7XG4gICAgfVxuICB9XG5cbiAgX3JlbmRlckFsbCgpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMuaWQpIHsgdGhpcy4kZWwuaWQgPSBvcHRpb25zLmlkOyB9XG5cbiAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSB0eXBlb2Ygb3B0aW9ucy5jbGFzc05hbWUgPT09ICdzdHJpbmcnID9cbiAgICAgICAgW29wdGlvbnMuY2xhc3NOYW1lXSA6IG9wdGlvbnMuY2xhc3NOYW1lO1xuXG4gICAgICBjbGFzc2VzLmZvckVhY2goY2xhc3NOYW1lID0+IHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSk7XG4gICAgfVxuXG4gICAgLy8gaWYgcmVyZW5kZXIsIHVuaW5zdGFsbCBldmVudHMgYmVmb3JlIHJlY3JlYXRpbmcgdGhlIERPTVxuICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcblxuICAgIGNvbnN0IGh0bWwgPSB0aGlzLnRtcGwodGhpcy5jb250ZW50KTtcbiAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgIC8vIG11c3QgcmVzaXplIGJlZm9yZSBjaGlsZCBjb21wb25lbnRcbiAgICB0aGlzLm9uUmVuZGVyKCk7XG4gICAgdmlld3BvcnQuYWRkTGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpO1xuXG4gICAgZm9yIChsZXQgc2VsZWN0b3IgaW4gdGhpcy5fY29tcG9uZW50cykge1xuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gICAgfVxuXG4gICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiB0ZW1wbGF0ZSBhbmQgY29udGVudC5cbiAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICovXG4gIHJlbmRlcihzZWxlY3RvciA9IG51bGwpIHtcbiAgICBpZiAoc2VsZWN0b3IgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9yZW5kZXJBbGwoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW5zZXJ0IHRoZSB2aWV3IChgdGhpcy4kZWxgKSBpbnRvIHRoZSBnaXZlbiBlbGVtZW50LiBDYWxsIGBWaWV3fm9uU2hvd2Agd2hlbiBkb25lLlxuICAgKiBAcGFyYW0ge0VsZW1lbnR9ICRwYXJlbnQgLSBUaGUgZWxlbWVudCB3aGVyZSB0aGUgdmlldyBzaG91bGQgYmUgaW5zZXJ0ZWQuXG4gICAqL1xuICBhcHBlbmRUbygkcGFyZW50KSB7XG4gICAgdGhpcy4kcGFyZW50ID0gJHBhcmVudDtcbiAgICAkcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuJGVsKTtcblxuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdvblNob3cnKTtcbiAgICB0aGlzLm9uU2hvdygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudHMgbGlzdGVuZXJzIGFuZCByZW1vdmUgdGhlIHZpZXcgZnJvbSBpdCdzIGNvbnRhaW5lci4gSXMgYXV0b21hdGljYWxseSBjYWxsZWQgaW4gYE1vZHVsZX5kb25lYC5cbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgncmVtb3ZlJyk7XG5cbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgdGhpcy4kcGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuJGVsKTtcblxuICAgIHZpZXdwb3J0LnJlbW92ZUxpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3LlxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogU2hvdyB0aGUgdmlldy5cbiAgICovXG4gIHNob3coKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IGZvciBjdXN0b20gYmVoYXZpb3IgKGluc3RhbGwgcGx1Z2luLCAuLi4pIHdoZW4gdGhlIERPTSBvZiB0aGUgdmlldyBpcyByZWFkeS5cbiAgICovXG4gIG9uUmVuZGVyKCkge31cblxuICAvKipcbiAgICogRW50cnkgcG9pbnQgZm9yIGN1c3RvbSBiZWhhdmlvciB3aGVuIHRoZSB2aWV3IGlzIGluc2VydGVkIGludG8gdGhlIERPTS5cbiAgICovXG4gIG9uU2hvdygpIHt9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBgdmlld3BvcnQucmVzaXplYCBldmVudC4gTWFpbnRhaW4gYCRlbGAgaW4gc3luYyB3aXRoIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9yaWVudGF0aW9uIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqL1xuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdwb3J0cmFpdCcsICdsYW5kc2NhcGUnKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKG9yaWVudGF0aW9uKTtcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIGluc3RhbGwgZXZlbnRzIGFmdGVyIGluc3RhbmNpYXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBBbiBvYmplY3Qgb2YgZXZlbnRzIG1pbWljaW5nIHRoZSBCYWNrYm9uZSdzIHN5bnRheC5cbiAgICovXG4gIGluc3RhbGxFdmVudHMoZXZlbnRzLCBvdmVycmlkZSA9IGZhbHNlKSB7XG4gICAgdGhpcy5ldmVudHMgPSBvdmVycmlkZSA/IGV2ZW50cyA6IE9iamVjdC5hc3NpZ24odGhpcy5ldmVudHMsIGV2ZW50cyk7XG4gICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgfVxuXG4gIF9kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnX2RlbGVnYXRlRXZlbnRzJyk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuICAgICAgY29uc3QgJHRhcmdldHMgPSAhc2VsZWN0b3IgPyBbdGhpcy4kZWxdIDogdGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgICAgIEFycmF5LmZyb20oJHRhcmdldHMpLmZvckVhY2goKCR0YXJnZXQpID0+IHtcbiAgICAgICAgLy8gZG9uJ3QgYWRkIGEgbGlzdGVuZXIgdHdpY2UsIGlmIHJlbmRlciBpcyBjYWxsZWQgc2V2ZXJhbCB0aW1lc1xuICAgICAgICAkdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgICR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF91bmRlbGVnYXRlRXZlbnRzKCkge1xuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdfdW5kZWxlZ2F0ZUV2ZW50cycpO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICBjb25zdCBbZXZlbnQsIHNlbGVjdG9yXSA9IGtleS5zcGxpdCgvICsvKTtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5ldmVudHNba2V5XTtcbiAgICAgIGNvbnN0ICR0YXJnZXRzID0gIXNlbGVjdG9yID8gW3RoaXMuJGVsXSA6IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgICBBcnJheS5mcm9tKCR0YXJnZXRzKS5mb3JFYWNoKCgkdGFyZ2V0KSA9PiB7XG4gICAgICAgICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSJdfQ==
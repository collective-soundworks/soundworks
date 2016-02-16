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
     *
     */
    this.isVisible = false;

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

      this.isVisible = false;
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
      // parent must be in the DOM

      this._executeViewComponentMethod('onShow');
      this.onShow();
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
     * @param {Number} viewportWidth - The width of the viewport in pixels.
     * @param {Number} viewportHeight - The height of the viewport in pixels.
     */
  }, {
    key: 'onResize',
    value: function onResize(orientation, viewportWidth, viewportHeight) {
      this.orientation = orientation;
      this.$el.classList.remove('portrait', 'landscape');
      this.$el.classList.add(orientation);
      this.$el.style.width = viewportWidth + 'px';
      this.$el.style.height = viewportHeight + 'px';
      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBaUIsaUJBQWlCOzs7O3dCQUNiLFlBQVk7Ozs7Ozs7Ozs7SUFRWixJQUFJO0FBQ1osV0FEUSxJQUFJLENBQ1gsUUFBUSxFQUEyQztRQUF6QyxPQUFPLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQyxJQUFJOzs7Ozs7QUFNckIsUUFBSSxDQUFDLElBQUksR0FBRyxpQ0FBSyxRQUFRLENBQUMsQ0FBQzs7Ozs7O0FBTTNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7O0FBT3ZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzs7Ozs7QUFNckIsUUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFjO0FBQzNCLFFBQUUsRUFBRSxLQUFLO0FBQ1QsUUFBRSxFQUFFLElBQUk7QUFDUixlQUFTLEVBQUUsSUFBSTtLQUNoQixFQUFFLE9BQU8sQ0FBQyxDQUFDOzs7Ozs7QUFNWixRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDOzs7Ozs7QUFNdEMsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7O0FBS3hCLFFBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDOztBQUV2QixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTXRCLFFBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVuRCxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFDOzs7Ozs7OztlQXpEa0IsSUFBSTs7V0FnRVAsMEJBQUMsUUFBUSxFQUFlO1VBQWIsSUFB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QUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDcEQsaUJBQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ2xELENBQUMsQ0FBQzs7O0FBVEwsV0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2NBQXBCLEdBQUc7T0FVWDtLQUNGOzs7V0FFZ0IsNkJBQUc7OztBQUNsQixVQUFJLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7NkJBRTdDLEdBQUc7MEJBQ2dCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDOzs7O1lBQWxDLEtBQUs7WUFBRSxRQUFROztBQUN0QixZQUFNLFFBQVEsR0FBRyxPQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxZQUFNLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLE9BQUssR0FBRyxDQUFDLEdBQUcsT0FBSyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTlFLG9CQUFXLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUN4QyxpQkFBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDOzs7QUFQTCxXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7ZUFBcEIsR0FBRztPQVFYO0tBQ0Y7OztTQXRQa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdG1wbCBmcm9tICdsb2Rhc2gudGVtcGxhdGUnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuXG5cbi8qKlxuICogW2NsaWVudF0gLSBWaWV3LlxuICpcbiAqIEB0b2RvXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGB0ZW1wbGF0ZWAsIHRvIGJlIGNhbGxlZCB3aXRoIGBjb250ZW50YCBvYmplY3QuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMudG1wbCA9IHRtcGwodGVtcGxhdGUpO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSB0byBiZSB1c2VkIGluIG9yZGVyIHRvIHBvcHVsYXRlIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LiBFYWNoIGVudHJ5IGZvbGxvd3MgdGhlIGNvbnZlbnRpb246XG4gICAgICogYCdldmVudE5hbWUgW2Nzc1NlbGVjdG9yXSc6IGNhbGxiYWNrRnVuY3Rpb25gXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcblxuICAgIC8qKlxuICAgICAqIE9wdGlvbnMgb2YgdGhlIFZpZXcuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGVsOiAnZGl2JyxcbiAgICAgIGlkOiBudWxsLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogUHJpb3JpdHkgb2YgdGhlIHZpZXcuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnByaW9yaXR5ID0gdGhpcy5vcHRpb25zLnByaW9yaXR5O1xuXG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXcgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqXG4gICAgICovXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcblxuICAgIHRoaXMuX2NvbXBvbmVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjb250YWluZXIgZWxlbWVudCBvZiB0aGUgdmlldy4gRGVmYXVsdHMgdG8gYDxkaXY+YC5cbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5vcHRpb25zLmVsKTtcblxuICAgIHRoaXMub25SZXNpemUgPSB0aGlzLm9uUmVzaXplLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29tcG91bmQgdmlldyBpbnNpZGUgdGhlIGN1cnJlbnQgdmlldy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yIC0gQSBjc3Mgc2VsZWN0b3IgbWF0Y2hpbmcgYW4gZWxlbWVudCBvZiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSB7Vmlld30gdmlldyAtIFRoZSB2aWV3IHRvIGluc2VydCBpbnNpZGUgdGhlIHNlbGVjdG9yLlxuICAgKi9cbiAgc2V0Vmlld0NvbXBvbmVudChzZWxlY3RvciwgdmlldyA9IG51bGwpIHtcbiAgICBjb25zdCBwcmV2VmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgIGlmIChwcmV2VmlldyBpbnN0YW5jZW9mIFZpZXcpIHsgcHJldlZpZXcucmVtb3ZlKCk7IH1cblxuICAgIGlmICh2aWV3ID09PSBudWxsKSB7XG4gICAgICBkZWxldGUgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdID0gdmlldztcbiAgICB9XG4gIH1cblxuICBfZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QobWV0aG9kKSB7XG4gICAgZm9yIChsZXQgc2VsZWN0b3IgaW4gdGhpcy5fY29tcG9uZW50cykge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgICAgdmlld1ttZXRob2RdKCk7XG4gICAgfVxuICB9XG5cblxuICBfcmVuZGVyUGFydGlhbChzZWxlY3Rvcikge1xuICAgIGNvbnN0ICRjb21wb25lbnRDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAkY29tcG9uZW50Q29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LnJlbmRlcigpO1xuICAgICAgY29tcG9uZW50LmFwcGVuZFRvKCRjb21wb25lbnRDb250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgICBjb25zdCAkZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICRkdW1teS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAkZHVtbXkucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MO1xuICAgIH1cbiAgfVxuXG4gIF9yZW5kZXJBbGwoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zLmlkKSB7IHRoaXMuJGVsLmlkID0gb3B0aW9ucy5pZDsgfVxuXG4gICAgaWYgKG9wdGlvbnMuY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIG9wdGlvbnMuY2xhc3NOYW1lID09PSAnc3RyaW5nJyA/XG4gICAgICAgIFtvcHRpb25zLmNsYXNzTmFtZV0gOiBvcHRpb25zLmNsYXNzTmFtZTtcblxuICAgICAgY2xhc3Nlcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkpO1xuICAgIH1cblxuICAgIC8vIGlmIHJlcmVuZGVyLCB1bmluc3RhbGwgZXZlbnRzIGJlZm9yZSByZWNyZWF0aW5nIHRoZSBET01cbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAvLyBtdXN0IHJlc2l6ZSBiZWZvcmUgY2hpbGQgY29tcG9uZW50XG4gICAgdGhpcy5vblJlbmRlcigpO1xuICAgIHZpZXdwb3J0LmFkZExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKTtcblxuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpIHtcbiAgICAgIHRoaXMuX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gdGVtcGxhdGUgYW5kIGNvbnRlbnQuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuICByZW5kZXIoc2VsZWN0b3IgPSBudWxsKSB7XG4gICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCB0aGUgdmlldyAoYHRoaXMuJGVsYCkgaW50byB0aGUgZ2l2ZW4gZWxlbWVudC4gQ2FsbCBgVmlld35vblNob3dgIHdoZW4gZG9uZS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkcGFyZW50IC0gVGhlIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXcgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKi9cbiAgYXBwZW5kVG8oJHBhcmVudCkge1xuICAgIHRoaXMuJHBhcmVudCA9ICRwYXJlbnQ7XG4gICAgJHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLiRlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50cyBsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGUgdmlldyBmcm9tIGl0J3MgY29udGFpbmVyLiBJcyBhdXRvbWF0aWNhbGx5IGNhbGxlZCBpbiBgTW9kdWxlfmRvbmVgLlxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdyZW1vdmUnKTtcblxuICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcbiAgICB0aGlzLiRwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy4kZWwpO1xuXG4gICAgdmlld3BvcnQucmVtb3ZlTGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpO1xuXG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBIaWRlIHRoZSB2aWV3LlxuICAgKi9cbiAgaGlkZSgpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSB2aWV3LlxuICAgKi9cbiAgc2hvdygpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gICAgLy8gcGFyZW50IG11c3QgYmUgaW4gdGhlIERPTVxuXG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ29uU2hvdycpO1xuICAgIHRoaXMub25TaG93KCk7XG4gIH1cblxuICAvKipcbiAgICogRW50cnkgcG9pbnQgZm9yIGN1c3RvbSBiZWhhdmlvciAoaW5zdGFsbCBwbHVnaW4sIC4uLikgd2hlbiB0aGUgRE9NIG9mIHRoZSB2aWV3IGlzIHJlYWR5LlxuICAgKi9cbiAgb25SZW5kZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCBmb3IgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIHZpZXcgaXMgaW5zZXJ0ZWQgaW50byB0aGUgRE9NLlxuICAgKi9cbiAgb25TaG93KCkge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGB2aWV3cG9ydC5yZXNpemVgIGV2ZW50LiBNYWludGFpbiBgJGVsYCBpbiBzeW5jIHdpdGggdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRXaWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQgaW4gcGl4ZWxzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gdmlld3BvcnRIZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqL1xuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgdmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgncG9ydHJhaXQnLCAnbGFuZHNjYXBlJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZChvcmllbnRhdGlvbik7XG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSBgJHt2aWV3cG9ydFdpZHRofXB4YDtcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSBgJHt2aWV3cG9ydEhlaWdodH1weGA7XG4gICAgdGhpcy52aWV3cG9ydFdpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB0aGlzLnZpZXdwb3J0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQ7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgdG8gaW5zdGFsbCBldmVudHMgYWZ0ZXIgaW5zdGFuY2lhdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIEFuIG9iamVjdCBvZiBldmVudHMgbWltaWNpbmcgdGhlIEJhY2tib25lJ3Mgc3ludGF4LlxuICAgKi9cbiAgaW5zdGFsbEV2ZW50cyhldmVudHMsIG92ZXJyaWRlID0gZmFsc2UpIHtcbiAgICB0aGlzLmV2ZW50cyA9IG92ZXJyaWRlID8gZXZlbnRzIDogT2JqZWN0LmFzc2lnbih0aGlzLmV2ZW50cywgZXZlbnRzKTtcbiAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICB9XG5cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdfZGVsZWdhdGVFdmVudHMnKTtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCBzZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG4gICAgICBjb25zdCAkdGFyZ2V0cyA9ICFzZWxlY3RvciA/IFt0aGlzLiRlbF0gOiB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgQXJyYXkuZnJvbSgkdGFyZ2V0cykuZm9yRWFjaCgoJHRhcmdldCkgPT4ge1xuICAgICAgICAvLyBkb24ndCBhZGQgYSBsaXN0ZW5lciB0d2ljZSwgaWYgcmVuZGVyIGlzIGNhbGxlZCBzZXZlcmFsIHRpbWVzXG4gICAgICAgICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgJHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3VuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ191bmRlbGVnYXRlRXZlbnRzJyk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuICAgICAgY29uc3QgJHRhcmdldHMgPSAhc2VsZWN0b3IgPyBbdGhpcy4kZWxdIDogdGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgICAgIEFycmF5LmZyb20oJHRhcmdldHMpLmZvckVhY2goKCR0YXJnZXQpID0+IHtcbiAgICAgICAgJHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=
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

// https://gist.github.com/paulirish/1579671
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
// (function() {
//     var lastTime = 0;
//     var vendors = ['ms', 'moz', 'webkit', 'o'];
//     for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
//         window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
//         window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
//                                    || window[vendors[x]+'CancelRequestAnimationFrame'];
//     }

//     if (!window.requestAnimationFrame)
//         window.requestAnimationFrame = function(callback, element) {
//             var currTime = new Date().getTime();
//             var timeToCall = Math.max(0, 16 - (currTime - lastTime));
//             var id = window.setTimeout(function() { callback(currTime + timeToCall); },
//               timeToCall);
//             lastTime = currTime + timeToCall;
//             return id;
//         };

//     if (!window.cancelAnimationFrame)
//         window.cancelAnimationFrame = function(id) {
//             clearTimeout(id);
//         };
// }());

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBQWlCLGlCQUFpQjs7Ozt3QkFDYixZQUFZOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1DWixJQUFJO0FBQ1osV0FEUSxJQUFJLENBQ1gsUUFBUSxFQUEyQztRQUF6QyxPQUFPLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQyxJQUFJOzs7Ozs7QUFNckIsUUFBSSxDQUFDLElBQUksR0FBRyxpQ0FBSyxRQUFRLENBQUMsQ0FBQzs7Ozs7O0FBTTNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7O0FBT3ZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzs7Ozs7QUFNckIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxPQUFPLEdBQUcsZUFBYztBQUMzQixRQUFFLEVBQUUsS0FBSztBQUNULFFBQUUsRUFBRSxJQUFJO0FBQ1IsZUFBUyxFQUFFLElBQUk7S0FDaEIsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFWixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTXRCLFFBQUksQ0FBQyxHQUFHLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVuRCxRQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFDOzs7Ozs7OztlQTFDa0IsSUFBSTs7V0FpRFAsMEJBQUMsUUFBUSxFQUFFLElBQUksRUFBRTtBQUMvQixVQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzVDLFVBQUksUUFBUSxZQUFZLElBQUks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Ozs7QUFDbEIsVUFBSSxDQUFDLDJCQUEyQixDQUFDLG1CQUFtQixDQUFDLENBQUM7OzZCQUU3QyxHQUFHOzBCQUNnQixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs7OztZQUFsQyxLQUFLO1lBQUUsUUFBUTs7QUFDdEIsWUFBTSxRQUFRLEdBQUcsT0FBSyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsWUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxPQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQUssR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU5RSxvQkFBVyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDeEMsaUJBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3JELENBQUMsQ0FBQzs7O0FBUEwsV0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2VBQXBCLEdBQUc7T0FRWDtLQUNGOzs7U0FqT2tCLElBQUk7OztxQkFBSixJQUFJIiwiZmlsZSI6InNyYy9zZXJ2ZXIvY29tbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0bXBsIGZyb20gJ2xvZGFzaC50ZW1wbGF0ZSc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi92aWV3cG9ydCc7XG5cbi8vIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxXG4vLyByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGwgYnkgRXJpayBNw7ZsbGVyLiBmaXhlcyBmcm9tIFBhdWwgSXJpc2ggYW5kIFRpbm8gWmlqZGVsXG4vLyBNSVQgbGljZW5zZVxuLy8gKGZ1bmN0aW9uKCkge1xuLy8gICAgIHZhciBsYXN0VGltZSA9IDA7XG4vLyAgICAgdmFyIHZlbmRvcnMgPSBbJ21zJywgJ21veicsICd3ZWJraXQnLCAnbyddO1xuLy8gICAgIGZvcih2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4vLyAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4vLyAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxBbmltYXRpb25GcmFtZSddXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHx8IHdpbmRvd1t2ZW5kb3JzW3hdKydDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnXTtcbi8vICAgICB9XG5cbi8vICAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4vLyAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihjYWxsYmFjaywgZWxlbWVudCkge1xuLy8gICAgICAgICAgICAgdmFyIGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4vLyAgICAgICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbi8vICAgICAgICAgICAgIHZhciBpZCA9IHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkgeyBjYWxsYmFjayhjdXJyVGltZSArIHRpbWVUb0NhbGwpOyB9LFxuLy8gICAgICAgICAgICAgICB0aW1lVG9DYWxsKTtcbi8vICAgICAgICAgICAgIGxhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xuLy8gICAgICAgICAgICAgcmV0dXJuIGlkO1xuLy8gICAgICAgICB9O1xuXG4vLyAgICAgaWYgKCF3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUpXG4vLyAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uKGlkKSB7XG4vLyAgICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuLy8gICAgICAgICB9O1xuLy8gfSgpKTtcblxuLyoqXG4gKiBbY2xpZW50XSAtIFZpZXcuXG4gKlxuICogQHRvZG9cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvKipcbiAgICAgKiBBIGZ1bmN0aW9uIGNyZWF0ZWQgZnJvbSB0aGUgZ2l2ZW4gYHRlbXBsYXRlYCwgdG8gYmUgY2FsbGVkIHdpdGggYGNvbnRlbnRgIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7RnVuY3Rpb259XG4gICAgICovXG4gICAgdGhpcy50bXBsID0gdG1wbCh0ZW1wbGF0ZSk7XG5cbiAgICAvKipcbiAgICAgKiBEYXRhIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gcG9wdWxhdGUgdGhlIHRlbXBsYXRlLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5jb250ZW50ID0gY29udGVudDtcblxuICAgIC8qKlxuICAgICAqIEV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuIEVhY2ggZW50cnkgZm9sbG93cyB0aGUgY29udmVudGlvbjpcbiAgICAgKiBgJ2V2ZW50TmFtZSBbY3NzU2VsZWN0b3JdJzogY2FsbGJhY2tGdW5jdGlvbmBcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZXZlbnRzID0gZXZlbnRzO1xuXG4gICAgLyoqXG4gICAgICogT3JpZW50YXRpb24gb2YgdGhlIHZpZXcgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm9yaWVudGF0aW9uID0gbnVsbDtcblxuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgZWw6ICdkaXYnLFxuICAgICAgaWQ6IG51bGwsXG4gICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9jb21wb25lbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBUaGUgY29udGFpbmVyIGVsZW1lbnQgb2YgdGhlIHZpZXcuIERlZmF1bHRzIHRvIGA8ZGl2PmAuXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRoaXMub3B0aW9ucy5lbCk7XG5cbiAgICB0aGlzLm9uUmVzaXplID0gdGhpcy5vblJlc2l6ZS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbXBvdW5kIHZpZXcgaW5zaWRlIHRoZSBjdXJyZW50IHZpZXcuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvciAtIEEgY3NzIHNlbGVjdG9yIG1hdGNoaW5nIGFuIGVsZW1lbnQgb2YgdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0ge1ZpZXd9IHZpZXcgLSBUaGUgdmlldyB0byBpbnNlcnQgaW5zaWRlIHRoZSBzZWxlY3Rvci5cbiAgICovXG4gIHNldFZpZXdDb21wb25lbnQoc2VsZWN0b3IsIHZpZXcpIHtcbiAgICBjb25zdCBwcmV2VmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgIGlmIChwcmV2VmlldyBpbnN0YW5jZW9mIFZpZXcpIHsgcHJldlZpZXcucmVtb3ZlKCk7IH1cblxuICAgIGlmICh2aWV3ID09PSBudWxsKSB7XG4gICAgICBkZWxldGUgdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdID0gdmlldztcbiAgICB9XG4gIH1cblxuICBfZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QobWV0aG9kKSB7XG4gICAgZm9yIChsZXQgc2VsZWN0b3IgaW4gdGhpcy5fY29tcG9uZW50cykge1xuICAgICAgY29uc3QgdmlldyA9IHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgICAgdmlld1ttZXRob2RdKCk7XG4gICAgfVxuICB9XG5cblxuICBfcmVuZGVyUGFydGlhbChzZWxlY3Rvcikge1xuICAgIGNvbnN0ICRjb21wb25lbnRDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAkY29tcG9uZW50Q29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuXG4gICAgaWYgKGNvbXBvbmVudCkge1xuICAgICAgY29tcG9uZW50LnJlbmRlcigpO1xuICAgICAgY29tcG9uZW50LmFwcGVuZFRvKCRjb21wb25lbnRDb250YWluZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgICBjb25zdCAkZHVtbXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICRkdW1teS5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAkZHVtbXkucXVlcnlTZWxlY3RvcihzZWxlY3RvcikuaW5uZXJIVE1MO1xuICAgIH1cbiAgfVxuXG4gIF9yZW5kZXJBbGwoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zLmlkKSB7IHRoaXMuJGVsLmlkID0gb3B0aW9ucy5pZDsgfVxuXG4gICAgaWYgKG9wdGlvbnMuY2xhc3NOYW1lKSB7XG4gICAgICBjb25zdCBjbGFzc2VzID0gdHlwZW9mIG9wdGlvbnMuY2xhc3NOYW1lID09PSAnc3RyaW5nJyA/XG4gICAgICAgIFtvcHRpb25zLmNsYXNzTmFtZV0gOiBvcHRpb25zLmNsYXNzTmFtZTtcblxuICAgICAgY2xhc3Nlcy5mb3JFYWNoKGNsYXNzTmFtZSA9PiB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkpO1xuICAgIH1cblxuICAgIC8vIGlmIHJlcmVuZGVyLCB1bmluc3RhbGwgZXZlbnRzIGJlZm9yZSByZWNyZWF0aW5nIHRoZSBET01cbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICBjb25zdCBodG1sID0gdGhpcy50bXBsKHRoaXMuY29udGVudCk7XG4gICAgdGhpcy4kZWwuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAvLyBtdXN0IHJlc2l6ZSBiZWZvcmUgY2hpbGQgY29tcG9uZW50XG4gICAgdGhpcy5vblJlbmRlcigpO1xuICAgIHZpZXdwb3J0LmFkZExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKTtcblxuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpIHtcbiAgICAgIHRoaXMuX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSB2aWV3IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gdGVtcGxhdGUgYW5kIGNvbnRlbnQuXG4gICAqIEByZXR1cm4ge0VsZW1lbnR9XG4gICAqL1xuICByZW5kZXIoc2VsZWN0b3IgPSBudWxsKSB7XG4gICAgaWYgKHNlbGVjdG9yICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fcmVuZGVyQWxsKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluc2VydCB0aGUgdmlldyAoYHRoaXMuJGVsYCkgaW50byB0aGUgZ2l2ZW4gZWxlbWVudC4gQ2FsbCBgVmlld35vblNob3dgIHdoZW4gZG9uZS5cbiAgICogQHBhcmFtIHtFbGVtZW50fSAkcGFyZW50IC0gVGhlIGVsZW1lbnQgd2hlcmUgdGhlIHZpZXcgc2hvdWxkIGJlIGluc2VydGVkLlxuICAgKi9cbiAgYXBwZW5kVG8oJHBhcmVudCkge1xuICAgIHRoaXMuJHBhcmVudCA9ICRwYXJlbnQ7XG4gICAgJHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLiRlbCk7XG5cbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnb25TaG93Jyk7XG4gICAgdGhpcy5vblNob3coKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZXZlbnRzIGxpc3RlbmVycyBhbmQgcmVtb3ZlIHRoZSB2aWV3IGZyb20gaXQncyBjb250YWluZXIuIElzIGF1dG9tYXRpY2FsbHkgY2FsbGVkIGluIGBNb2R1bGV+ZG9uZWAuXG4gICAqL1xuICByZW1vdmUoKSB7XG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ3JlbW92ZScpO1xuXG4gICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuICAgIHRoaXMuJHBhcmVudC5yZW1vdmVDaGlsZCh0aGlzLiRlbCk7XG5cbiAgICB2aWV3cG9ydC5yZW1vdmVMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vblJlc2l6ZSk7XG4gIH1cblxuICAvKipcbiAgICogSGlkZSB0aGUgdmlldy5cbiAgICovXG4gIGhpZGUoKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3cgdGhlIHZpZXcuXG4gICAqL1xuICBzaG93KCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMuaXNWaXNpYmxlID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCBmb3IgY3VzdG9tIGJlaGF2aW9yIChpbnN0YWxsIHBsdWdpbiwgLi4uKSB3aGVuIHRoZSBET00gb2YgdGhlIHZpZXcgaXMgcmVhZHkuXG4gICAqL1xuICBvblJlbmRlcigpIHt9XG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IGZvciBjdXN0b20gYmVoYXZpb3Igd2hlbiB0aGUgdmlldyBpcyBpbnNlcnRlZCBpbnRvIHRoZSBET00uXG4gICAqL1xuICBvblNob3coKSB7fVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBmb3IgYHZpZXdwb3J0LnJlc2l6ZWAgZXZlbnQuIE1haW50YWluIGAkZWxgIGluIHN5bmMgd2l0aCB0aGUgdmlld3BvcnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcmllbnRhdGlvbiAtIFRoZSBvcmllbnRhdGlvbiBvZiB0aGUgdmlld3BvcnQgKCdwb3J0cmFpdCd8J2xhbmRzY2FwZScpXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgdmlld3BvcnQgaW4gcGl4ZWxzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgdmlld3BvcnQgaW4gcGl4ZWxzLlxuICAgKi9cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICB0aGlzLm9yaWVudGF0aW9uID0gb3JpZW50YXRpb247XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LnJlbW92ZSgncG9ydHJhaXQnLCAnbGFuZHNjYXBlJyk7XG4gICAgdGhpcy4kZWwuY2xhc3NMaXN0LmFkZChvcmllbnRhdGlvbik7XG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSBgJHt3aWR0aH1weGA7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gYCR7aGVpZ2h0fXB4YDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyB0byBpbnN0YWxsIGV2ZW50cyBhZnRlciBpbnN0YW5jaWF0aW9uLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gQW4gb2JqZWN0IG9mIGV2ZW50cyBtaW1pY2luZyB0aGUgQmFja2JvbmUncyBzeW50YXguXG4gICAqL1xuICBpbnN0YWxsRXZlbnRzKGV2ZW50cywgb3ZlcnJpZGUgPSBmYWxzZSkge1xuICAgIHRoaXMuZXZlbnRzID0gb3ZlcnJpZGUgPyBldmVudHMgOiBPYmplY3QuYXNzaWduKHRoaXMuZXZlbnRzLCBldmVudHMpO1xuICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gIH1cblxuICBfZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ19kZWxlZ2F0ZUV2ZW50cycpO1xuXG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICBjb25zdCBbZXZlbnQsIHNlbGVjdG9yXSA9IGtleS5zcGxpdCgvICsvKTtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5ldmVudHNba2V5XTtcbiAgICAgIGNvbnN0ICR0YXJnZXRzID0gIXNlbGVjdG9yID8gW3RoaXMuJGVsXSA6IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgICBBcnJheS5mcm9tKCR0YXJnZXRzKS5mb3JFYWNoKCgkdGFyZ2V0KSA9PiB7XG4gICAgICAgIC8vIGRvbid0IGFkZCBhIGxpc3RlbmVyIHR3aWNlLCBpZiByZW5kZXIgaXMgY2FsbGVkIHNldmVyYWwgdGltZXNcbiAgICAgICAgJHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgICAkdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBfdW5kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICB0aGlzLl9leGVjdXRlVmlld0NvbXBvbmVudE1ldGhvZCgnX3VuZGVsZWdhdGVFdmVudHMnKTtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCBzZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG4gICAgICBjb25zdCAkdGFyZ2V0cyA9ICFzZWxlY3RvciA/IFt0aGlzLiRlbF0gOiB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgQXJyYXkuZnJvbSgkdGFyZ2V0cykuZm9yRWFjaCgoJHRhcmdldCkgPT4ge1xuICAgICAgICAkdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0iXX0=
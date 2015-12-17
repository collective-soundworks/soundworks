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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBaUIsaUJBQWlCOzs7O3dCQUNiLFlBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUNaLElBQUk7QUFDWixXQURRLElBQUksQ0FDWCxRQUFRLEVBQTJDO1FBQXpDLE9BQU8seURBQUcsRUFBRTtRQUFFLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRDFDLElBQUk7Ozs7OztBQU1yQixRQUFJLENBQUMsSUFBSSxHQUFHLGlDQUFLLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7QUFNM0IsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7QUFPdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Ozs7OztBQU1yQixRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQzs7QUFFeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxlQUFjO0FBQzNCLFFBQUUsRUFBRSxLQUFLO0FBQ1QsUUFBRSxFQUFFLElBQUk7QUFDUixlQUFTLEVBQUUsSUFBSTtLQUNoQixFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUVaLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRW5ELFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUM7Ozs7Ozs7O2VBMUNrQixJQUFJOztXQWlEUCwwQkFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFO0FBQy9CLFVBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUMsVUFBSSxRQUFRLFlB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Z0IsNkJBQUc7OztBQUNsQixVQUFJLENBQUMsMkJBQTJCLENBQUMsbUJBQW1CLENBQUMsQ0FBQzs7NkJBRTdDLEdBQUc7MEJBQ2dCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDOzs7O1lBQWxDLEtBQUs7WUFBRSxRQUFROztBQUN0QixZQUFNLFFBQVEsR0FBRyxPQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxZQUFNLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLE9BQUssR0FBRyxDQUFDLEdBQUcsT0FBSyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTlFLG9CQUFXLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUN4QyxpQkFBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDOzs7QUFQTCxXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7ZUFBcEIsR0FBRztPQVFYO0tBQ0Y7OztTQWpPa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdG1wbCBmcm9tICdsb2Rhc2gudGVtcGxhdGUnO1xuaW1wb3J0IHZpZXdwb3J0IGZyb20gJy4vdmlld3BvcnQnO1xuXG4vLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MVxuLy8gcmVxdWVzdEFuaW1hdGlvbkZyYW1lIHBvbHlmaWxsIGJ5IEVyaWsgTcO2bGxlci4gZml4ZXMgZnJvbSBQYXVsIElyaXNoIGFuZCBUaW5vIFppamRlbFxuLy8gTUlUIGxpY2Vuc2Vcbi8vIChmdW5jdGlvbigpIHtcbi8vICAgICB2YXIgbGFzdFRpbWUgPSAwO1xuLy8gICAgIHZhciB2ZW5kb3JzID0gWydtcycsICdtb3onLCAnd2Via2l0JywgJ28nXTtcbi8vICAgICBmb3IodmFyIHggPSAwOyB4IDwgdmVuZG9ycy5sZW5ndGggJiYgIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWU7ICsreCkge1xuLy8gICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gd2luZG93W3ZlbmRvcnNbeF0rJ1JlcXVlc3RBbmltYXRpb25GcmFtZSddO1xuLy8gICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsQW5pbWF0aW9uRnJhbWUnXVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCB3aW5kb3dbdmVuZG9yc1t4XSsnQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lJ107XG4vLyAgICAgfVxuXG4vLyAgICAgaWYgKCF3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuLy8gICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24oY2FsbGJhY2ssIGVsZW1lbnQpIHtcbi8vICAgICAgICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuLy8gICAgICAgICAgICAgdmFyIHRpbWVUb0NhbGwgPSBNYXRoLm1heCgwLCAxNiAtIChjdXJyVGltZSAtIGxhc3RUaW1lKSk7XG4vLyAgICAgICAgICAgICB2YXIgaWQgPSB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHsgY2FsbGJhY2soY3VyclRpbWUgKyB0aW1lVG9DYWxsKTsgfSxcbi8vICAgICAgICAgICAgICAgdGltZVRvQ2FsbCk7XG4vLyAgICAgICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbi8vICAgICAgICAgICAgIHJldHVybiBpZDtcbi8vICAgICAgICAgfTtcblxuLy8gICAgIGlmICghd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKVxuLy8gICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgPSBmdW5jdGlvbihpZCkge1xuLy8gICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbi8vICAgICAgICAgfTtcbi8vIH0oKSk7XG5cbi8qKlxuICogW2NsaWVudF0gLSBWaWV3LlxuICpcbiAqIEB0b2RvXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGB0ZW1wbGF0ZWAsIHRvIGJlIGNhbGxlZCB3aXRoIGBjb250ZW50YCBvYmplY3QuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMudG1wbCA9IHRtcGwodGVtcGxhdGUpO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSB0byBiZSB1c2VkIGluIG9yZGVyIHRvIHBvcHVsYXRlIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LiBFYWNoIGVudHJ5IGZvbGxvd3MgdGhlIGNvbnZlbnRpb246XG4gICAgICogYCdldmVudE5hbWUgW2Nzc1NlbGVjdG9yXSc6IGNhbGxiYWNrRnVuY3Rpb25gXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGVsOiAnZGl2JyxcbiAgICAgIGlkOiBudWxsLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lciBlbGVtZW50IG9mIHRoZSB2aWV3LiBEZWZhdWx0cyB0byBgPGRpdj5gLlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMuZWwpO1xuXG4gICAgdGhpcy5vblJlc2l6ZSA9IHRoaXMub25SZXNpemUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBjb21wb3VuZCB2aWV3IGluc2lkZSB0aGUgY3VycmVudCB2aWV3LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgLSBBIGNzcyBzZWxlY3RvciBtYXRjaGluZyBhbiBlbGVtZW50IG9mIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHtWaWV3fSB2aWV3IC0gVGhlIHZpZXcgdG8gaW5zZXJ0IGluc2lkZSB0aGUgc2VsZWN0b3IuXG4gICAqL1xuICBzZXRWaWV3Q29tcG9uZW50KHNlbGVjdG9yLCB2aWV3KSB7XG4gICAgY29uc3QgcHJldlZpZXcgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICBpZiAocHJldlZpZXcgaW5zdGFuY2VvZiBWaWV3KSB7IHByZXZWaWV3LnJlbW92ZSgpOyB9XG5cbiAgICBpZiAodmlldyA9PT0gbnVsbCkge1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbXBvbmVudHNbc2VsZWN0b3JdO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXSA9IHZpZXc7XG4gICAgfVxuICB9XG5cbiAgX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKG1ldGhvZCkge1xuICAgIGZvciAobGV0IHNlbGVjdG9yIGluIHRoaXMuX2NvbXBvbmVudHMpIHtcbiAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLl9jb21wb25lbnRzW3NlbGVjdG9yXTtcbiAgICAgIHZpZXdbbWV0aG9kXSgpO1xuICAgIH1cbiAgfVxuXG5cbiAgX3JlbmRlclBhcnRpYWwoc2VsZWN0b3IpIHtcbiAgICBjb25zdCAkY29tcG9uZW50Q29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgY29uc3QgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tzZWxlY3Rvcl07XG4gICAgJGNvbXBvbmVudENvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcblxuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGNvbXBvbmVudC5yZW5kZXIoKTtcbiAgICAgIGNvbXBvbmVudC5hcHBlbmRUbygkY29tcG9uZW50Q29udGFpbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLmNvbnRlbnQpO1xuICAgICAgY29uc3QgJGR1bW15ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAkZHVtbXkuaW5uZXJIVE1MID0gaHRtbDtcbiAgICAgICRjb21wb25lbnRDb250YWluZXIuaW5uZXJIVE1MID0gJGR1bW15LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpLmlubmVySFRNTDtcbiAgICB9XG4gIH1cblxuICBfcmVuZGVyQWxsKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucy5pZCkgeyB0aGlzLiRlbC5pZCA9IG9wdGlvbnMuaWQ7IH1cblxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgY2xhc3NlcyA9IHR5cGVvZiBvcHRpb25zLmNsYXNzTmFtZSA9PT0gJ3N0cmluZycgP1xuICAgICAgICBbb3B0aW9ucy5jbGFzc05hbWVdIDogb3B0aW9ucy5jbGFzc05hbWU7XG5cbiAgICAgIGNsYXNzZXMuZm9yRWFjaChjbGFzc05hbWUgPT4gdGhpcy4kZWwuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpKTtcbiAgICB9XG5cbiAgICAvLyBpZiByZXJlbmRlciwgdW5pbnN0YWxsIGV2ZW50cyBiZWZvcmUgcmVjcmVhdGluZyB0aGUgRE9NXG4gICAgdGhpcy5fdW5kZWxlZ2F0ZUV2ZW50cygpO1xuXG4gICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLmNvbnRlbnQpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGh0bWw7XG4gICAgLy8gbXVzdCByZXNpemUgYmVmb3JlIGNoaWxkIGNvbXBvbmVudFxuICAgIHRoaXMub25SZW5kZXIoKTtcbiAgICB2aWV3cG9ydC5hZGRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vblJlc2l6ZSk7XG5cbiAgICBmb3IgKGxldCBzZWxlY3RvciBpbiB0aGlzLl9jb21wb25lbnRzKSB7XG4gICAgICB0aGlzLl9yZW5kZXJQYXJ0aWFsKHNlbGVjdG9yKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgdmlldyBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIHRlbXBsYXRlIGFuZCBjb250ZW50LlxuICAgKiBAcmV0dXJuIHtFbGVtZW50fVxuICAgKi9cbiAgcmVuZGVyKHNlbGVjdG9yID0gbnVsbCkge1xuICAgIGlmIChzZWxlY3RvciAhPT0gbnVsbCkge1xuICAgICAgdGhpcy5fcmVuZGVyUGFydGlhbChzZWxlY3Rvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX3JlbmRlckFsbCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbnNlcnQgdGhlIHZpZXcgKGB0aGlzLiRlbGApIGludG8gdGhlIGdpdmVuIGVsZW1lbnQuIENhbGwgYFZpZXd+b25TaG93YCB3aGVuIGRvbmUuXG4gICAqIEBwYXJhbSB7RWxlbWVudH0gJHBhcmVudCAtIFRoZSBlbGVtZW50IHdoZXJlIHRoZSB2aWV3IHNob3VsZCBiZSBpbnNlcnRlZC5cbiAgICovXG4gIGFwcGVuZFRvKCRwYXJlbnQpIHtcbiAgICB0aGlzLiRwYXJlbnQgPSAkcGFyZW50O1xuICAgICRwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy4kZWwpO1xuXG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ29uU2hvdycpO1xuICAgIHRoaXMub25TaG93KCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGV2ZW50cyBsaXN0ZW5lcnMgYW5kIHJlbW92ZSB0aGUgdmlldyBmcm9tIGl0J3MgY29udGFpbmVyLiBJcyBhdXRvbWF0aWNhbGx5IGNhbGxlZCBpbiBgTW9kdWxlfmRvbmVgLlxuICAgKi9cbiAgcmVtb3ZlKCkge1xuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdyZW1vdmUnKTtcblxuICAgIHRoaXMuX3VuZGVsZWdhdGVFdmVudHMoKTtcbiAgICB0aGlzLiRwYXJlbnQucmVtb3ZlQ2hpbGQodGhpcy4kZWwpO1xuXG4gICAgdmlld3BvcnQucmVtb3ZlTGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIHZpZXcuXG4gICAqL1xuICBoaWRlKCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaG93IHRoZSB2aWV3LlxuICAgKi9cbiAgc2hvdygpIHtcbiAgICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogRW50cnkgcG9pbnQgZm9yIGN1c3RvbSBiZWhhdmlvciAoaW5zdGFsbCBwbHVnaW4sIC4uLikgd2hlbiB0aGUgRE9NIG9mIHRoZSB2aWV3IGlzIHJlYWR5LlxuICAgKi9cbiAgb25SZW5kZXIoKSB7fVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCBmb3IgY3VzdG9tIGJlaGF2aW9yIHdoZW4gdGhlIHZpZXcgaXMgaW5zZXJ0ZWQgaW50byB0aGUgRE9NLlxuICAgKi9cbiAgb25TaG93KCkge31cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZm9yIGB2aWV3cG9ydC5yZXNpemVgIGV2ZW50LiBNYWludGFpbiBgJGVsYCBpbiBzeW5jIHdpdGggdGhlIHZpZXdwb3J0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3JpZW50YXRpb24gLSBUaGUgb3JpZW50YXRpb24gb2YgdGhlIHZpZXdwb3J0ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIHZpZXdwb3J0IGluIHBpeGVscy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIHZpZXdwb3J0IGluIHBpeGVscy5cbiAgICovXG4gIG9uUmVzaXplKG9yaWVudGF0aW9uLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG9yaWVudGF0aW9uO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5yZW1vdmUoJ3BvcnRyYWl0JywgJ2xhbmRzY2FwZScpO1xuICAgIHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQob3JpZW50YXRpb24pO1xuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gYCR7d2lkdGh9cHhgO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9IGAke2hlaWdodH1weGA7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgdG8gaW5zdGFsbCBldmVudHMgYWZ0ZXIgaW5zdGFuY2lhdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIEFuIG9iamVjdCBvZiBldmVudHMgbWltaWNpbmcgdGhlIEJhY2tib25lJ3Mgc3ludGF4LlxuICAgKi9cbiAgaW5zdGFsbEV2ZW50cyhldmVudHMsIG92ZXJyaWRlID0gZmFsc2UpIHtcbiAgICB0aGlzLmV2ZW50cyA9IG92ZXJyaWRlID8gZXZlbnRzIDogT2JqZWN0LmFzc2lnbih0aGlzLmV2ZW50cywgZXZlbnRzKTtcbiAgICB0aGlzLl9kZWxlZ2F0ZUV2ZW50cygpO1xuICB9XG5cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIHRoaXMuX2V4ZWN1dGVWaWV3Q29tcG9uZW50TWV0aG9kKCdfZGVsZWdhdGVFdmVudHMnKTtcblxuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCBzZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG4gICAgICBjb25zdCAkdGFyZ2V0cyA9ICFzZWxlY3RvciA/IFt0aGlzLiRlbF0gOiB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgQXJyYXkuZnJvbSgkdGFyZ2V0cykuZm9yRWFjaCgoJHRhcmdldCkgPT4ge1xuICAgICAgICAvLyBkb24ndCBhZGQgYSBsaXN0ZW5lciB0d2ljZSwgaWYgcmVuZGVyIGlzIGNhbGxlZCBzZXZlcmFsIHRpbWVzXG4gICAgICAgICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgJHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3VuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgdGhpcy5fZXhlY3V0ZVZpZXdDb21wb25lbnRNZXRob2QoJ191bmRlbGVnYXRlRXZlbnRzJyk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuICAgICAgY29uc3QgJHRhcmdldHMgPSAhc2VsZWN0b3IgPyBbdGhpcy4kZWxdIDogdGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgICAgIEFycmF5LmZyb20oJHRhcmdldHMpLmZvckVhY2goKCR0YXJnZXQpID0+IHtcbiAgICAgICAgJHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59Il19
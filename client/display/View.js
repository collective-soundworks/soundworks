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

    /**
     * The container element of the view. Defaults to `<div>`.
     * @type {Element}
     */
    this.$el = document.createElement(this.options.el);

    this.onResize = this.onResize.bind(this);
  }

  /**
   * Render the view according to the given template and content.
   * @return {Element}
   */

  _createClass(View, [{
    key: 'render',
    value: function render() {
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

      var html = this.tmpl(this.content);
      this.$el.innerHTML = html;

      this.onRender();
      this._delegateEvents();
      // listen viewport orientation
      _viewport2['default'].addListener('resize', this.onResize);

      return this.$el;
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.$el.style.visibility = 'hidden';
    }
  }, {
    key: 'show',
    value: function show() {
      this.$el.style.visibility = 'visible';
    }

    /**
     * Entry point for custom behavior (install plugin, ...) when the DOM of the view is ready.
     */
  }, {
    key: 'onRender',
    value: function onRender() {}

    /**
     * Remove events listeners and remove the view from it's container. Is automatically called in `Module~done`.
     */
  }, {
    key: 'remove',
    value: function remove() {
      this._undelegateEvents();
      _viewport2['default'].removeListener('resize', this.onResize);
      this.$el.parentNode.removeChild(this.$el);
    }

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

      this._undelegateEvents();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBaUIsaUJBQWlCOzs7O3dCQUNiLFlBQVk7Ozs7Ozs7Ozs7SUFPWixJQUFJO0FBQ1osV0FEUSxJQUFJLENBQ1gsUUFBUSxFQUEyQztRQUF6QyxPQUFPLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQyxJQUFJOzs7Ozs7QUFNckIsUUFBSSxDQUFDLElBQUksR0FBRyxpQ0FBSyxRQUFRLENBQUMsQ0FBQzs7Ozs7O0FBTTNCLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7Ozs7O0FBT3ZCLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOzs7Ozs7QUFNckIsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxPQUFPLEdBQUcsZUFBYztBQUMzQixRQUFFLEVBQUUsS0FBSztBQUNULFFBQUUsRUFBRSxJQUFJO0FBQ1IsZUFBUyxFQUFFLElBQUk7S0FDaEIsRUFBRSxPQUFPLENBQUMsQ0FBQzs7Ozs7O0FBTVosUUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRW5ELFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUM7Ozs7Ozs7ZUF4Q2tCLElBQUk7O1dBOENqQixrQkFBRzs7O0FBQ1AsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQzs7QUFFN0IsVUFBSSxPQUFPLENBQUMsRUFBRSxFQUFFO0FBQUUsWUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQztPQUFFOztBQUU3QyxVQUFJLE9BQU8sQ0FBQyxTQUFT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LFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsRCxDQUFDLENBQUM7OztBQVRMLFdBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtjQUFwQixHQUFHO09BVVg7S0FDRjs7O1dBRWdCLDZCQUFHOzs7NkJBQ1QsR0FBRzswQkFDZ0IsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7Ozs7WUFBbEMsS0FBSztZQUFFLFFBQVE7O0FBQ3RCLFlBQU0sUUFBUSxHQUFHLE9BQUssTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ2xDLFlBQU0sUUFBUSxHQUFHLENBQUMsUUFBUSxHQUFHLENBQUMsT0FBSyxHQUFHLENBQUMsR0FBRyxPQUFLLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFOUUsb0JBQVcsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQ3hDLGlCQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNyRCxDQUFDLENBQUM7OztBQVBMLFdBQUssSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtlQUFwQixHQUFHO09BUVg7S0FDRjs7O1NBNUlrQixJQUFJOzs7cUJBQUosSUFBSSIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0bXBsIGZyb20gJ2xvZGFzaC50ZW1wbGF0ZSc7XG5pbXBvcnQgdmlld3BvcnQgZnJvbSAnLi92aWV3cG9ydCc7XG5cbi8qKlxuICogW2NsaWVudF0gLSBWaWV3LlxuICpcbiAqIEB0b2RvXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgLyoqXG4gICAgICogQSBmdW5jdGlvbiBjcmVhdGVkIGZyb20gdGhlIGdpdmVuIGB0ZW1wbGF0ZWAsIHRvIGJlIGNhbGxlZCB3aXRoIGBjb250ZW50YCBvYmplY3QuXG4gICAgICogQHR5cGUge0Z1bmN0aW9ufVxuICAgICAqL1xuICAgIHRoaXMudG1wbCA9IHRtcGwodGVtcGxhdGUpO1xuXG4gICAgLyoqXG4gICAgICogRGF0YSB0byBiZSB1c2VkIGluIG9yZGVyIHRvIHBvcHVsYXRlIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY29udGVudCA9IGNvbnRlbnQ7XG5cbiAgICAvKipcbiAgICAgKiBFdmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LiBFYWNoIGVudHJ5IGZvbGxvd3MgdGhlIGNvbnZlbnRpb246XG4gICAgICogYCdldmVudE5hbWUgW2Nzc1NlbGVjdG9yXSc6IGNhbGxiYWNrRnVuY3Rpb25gXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcblxuICAgIC8qKlxuICAgICAqIE9yaWVudGF0aW9uIG9mIHRoZSB2aWV3ICgncG9ydHJhaXQnfCdsYW5kc2NhcGUnKVxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5vcmllbnRhdGlvbiA9IG51bGw7XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGVsOiAnZGl2JyxcbiAgICAgIGlkOiBudWxsLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNvbnRhaW5lciBlbGVtZW50IG9mIHRoZSB2aWV3LiBEZWZhdWx0cyB0byBgPGRpdj5gLlxuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLm9wdGlvbnMuZWwpO1xuXG4gICAgdGhpcy5vblJlc2l6ZSA9IHRoaXMub25SZXNpemUuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIHZpZXcgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiB0ZW1wbGF0ZSBhbmQgY29udGVudC5cbiAgICogQHJldHVybiB7RWxlbWVudH1cbiAgICovXG4gIHJlbmRlcigpIHtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMuaWQpIHsgdGhpcy4kZWwuaWQgPSBvcHRpb25zLmlkOyB9XG5cbiAgICBpZiAob3B0aW9ucy5jbGFzc05hbWUpIHtcbiAgICAgIGNvbnN0IGNsYXNzZXMgPSB0eXBlb2Ygb3B0aW9ucy5jbGFzc05hbWUgPT09ICdzdHJpbmcnID9cbiAgICAgICAgW29wdGlvbnMuY2xhc3NOYW1lXSA6IG9wdGlvbnMuY2xhc3NOYW1lO1xuXG4gICAgICBjbGFzc2VzLmZvckVhY2goY2xhc3NOYW1lID0+IHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKSk7XG4gICAgfVxuXG4gICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLmNvbnRlbnQpO1xuICAgIHRoaXMuJGVsLmlubmVySFRNTCA9IGh0bWw7XG5cbiAgICB0aGlzLm9uUmVuZGVyKCk7XG4gICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgICAvLyBsaXN0ZW4gdmlld3BvcnQgb3JpZW50YXRpb25cbiAgICB2aWV3cG9ydC5hZGRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5vblJlc2l6ZSk7XG5cbiAgICByZXR1cm4gdGhpcy4kZWw7XG4gIH1cblxuICBoaWRlKCkge1xuICAgIHRoaXMuJGVsLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgfVxuXG4gIHNob3coKSB7XG4gICAgdGhpcy4kZWwuc3R5bGUudmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcbiAgfVxuXG4gIC8qKlxuICAgKiBFbnRyeSBwb2ludCBmb3IgY3VzdG9tIGJlaGF2aW9yIChpbnN0YWxsIHBsdWdpbiwgLi4uKSB3aGVuIHRoZSBET00gb2YgdGhlIHZpZXcgaXMgcmVhZHkuXG4gICAqL1xuICBvblJlbmRlcigpIHt9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBldmVudHMgbGlzdGVuZXJzIGFuZCByZW1vdmUgdGhlIHZpZXcgZnJvbSBpdCdzIGNvbnRhaW5lci4gSXMgYXV0b21hdGljYWxseSBjYWxsZWQgaW4gYE1vZHVsZX5kb25lYC5cbiAgICovXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgdmlld3BvcnQucmVtb3ZlTGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMub25SZXNpemUpO1xuICAgIHRoaXMuJGVsLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy4kZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGZvciBgdmlld3BvcnQucmVzaXplYCBldmVudC4gTWFpbnRhaW4gYCRlbGAgaW4gc3luYyB3aXRoIHRoZSB2aWV3cG9ydC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9yaWVudGF0aW9uIC0gVGhlIG9yaWVudGF0aW9uIG9mIHRoZSB2aWV3cG9ydCAoJ3BvcnRyYWl0J3wnbGFuZHNjYXBlJylcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHdpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSB2aWV3cG9ydCBpbiBwaXhlbHMuXG4gICAqL1xuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCkge1xuICAgIHRoaXMub3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QucmVtb3ZlKCdwb3J0cmFpdCcsICdsYW5kc2NhcGUnKTtcbiAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKG9yaWVudGF0aW9uKTtcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9IGAke3dpZHRofXB4YDtcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIGluc3RhbGwgZXZlbnRzIGFmdGVyIGluc3RhbmNpYXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBBbiBvYmplY3Qgb2YgZXZlbnRzIG1pbWljaW5nIHRoZSBCYWNrYm9uZSdzIHN5bnRheC5cbiAgICovXG4gIGluc3RhbGxFdmVudHMoZXZlbnRzLCBvdmVycmlkZSA9IGZhbHNlKSB7XG4gICAgdGhpcy5ldmVudHMgPSBvdmVycmlkZSA/IGV2ZW50cyA6IE9iamVjdC5hc3NpZ24odGhpcy5ldmVudHMsIGV2ZW50cyk7XG4gICAgdGhpcy5fZGVsZWdhdGVFdmVudHMoKTtcbiAgfVxuXG4gIF9kZWxlZ2F0ZUV2ZW50cygpIHtcbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5ldmVudHMpIHtcbiAgICAgIGNvbnN0IFtldmVudCwgc2VsZWN0b3JdID0ga2V5LnNwbGl0KC8gKy8pO1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLmV2ZW50c1trZXldO1xuICAgICAgY29uc3QgJHRhcmdldHMgPSAhc2VsZWN0b3IgPyBbdGhpcy4kZWxdIDogdGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG5cbiAgICAgIEFycmF5LmZyb20oJHRhcmdldHMpLmZvckVhY2goKCR0YXJnZXQpID0+IHtcbiAgICAgICAgLy8gZG9uJ3QgYWRkIGEgbGlzdGVuZXIgdHdpY2UsIGlmIHJlbmRlciBpcyBjYWxsZWQgc2V2ZXJhbCB0aW1lc1xuICAgICAgICAkdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICAgICR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIF91bmRlbGVnYXRlRXZlbnRzKCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCBzZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG4gICAgICBjb25zdCAkdGFyZ2V0cyA9ICFzZWxlY3RvciA/IFt0aGlzLiRlbF0gOiB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgQXJyYXkuZnJvbSgkdGFyZ2V0cykuZm9yRWFjaCgoJHRhcmdldCkgPT4ge1xuICAgICAgICAkdGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGNhbGxiYWNrLCBmYWxzZSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn0iXX0=
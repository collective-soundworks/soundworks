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

/**
 * @todo - write doc
 */

var View = (function () {
  function View(tmplStr) {
    var model = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, View);

    this.tmpl = (0, _lodashTemplate2['default'])(tmplStr);
    this.model = model;
    this.events = events;
    this.options = _Object$assign({
      el: 'div',
      id: null,
      className: null
    }, options);

    // create container in memory
    this.$el = document.createElement(this.options.el);
  }

  /**
   * @return {DOMElement}
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
          _this.$el.classList.add(className);
        });
      }

      var html = this.tmpl(this.model);
      this.$el.innerHTML = html;

      this.onRender();
      this._delegateEvents();
      return this.$el;
    }

    // entry point when DOM is ready
  }, {
    key: 'onRender',
    value: function onRender() {}
  }, {
    key: 'remove',
    value: function remove() {
      this._undelegateEvents();
      this.$el.parentNode.removeChild(this.$el);
    }

    // show() {
    //   this.$el.style.display = 'block';
    // }

    // hide() {
    //   this.$el.style.display = 'none';
    // }

  }, {
    key: '_delegateEvents',
    value: function _delegateEvents() {
      var _this2 = this;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9WaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs4QkFBcUIsaUJBQWlCOzs7Ozs7OztJQUtqQixJQUFJO0FBQ1osV0FEUSxJQUFJLENBQ1gsT0FBTyxFQUF5QztRQUF2QyxLQUFLLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUR2QyxJQUFJOztBQUVyQixRQUFJLENBQUMsSUFBSSxHQUFHLGlDQUFTLE9BQU8sQ0FBQyxDQUFDO0FBQzlCLFFBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFFBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLFFBQUksQ0FBQyxPQUFPLEdBQUcsZUFBYztBQUMzQixRQUFFLEVBQUUsS0FBSztBQUNULFFBQUUsRUFBRSxJQUFJO0FBQ1IsZUFBUyxFQUFFLElBQUk7S0FDaEIsRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBR1osUUFBSSxDQUFDLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7R0FDcEQ7Ozs7OztlQWJrQixJQUFJOztXQWtCakIsa0JBQUc7OztBQUNQLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7O0FBRTdCLFVBQUksT0FBTyxDQUFDLEVBQUUsRUFBRTtBQUFFLFlBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7T0FBRTs7QUFFN0MsVUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO0FBQ3JCLFlBQU0sT0FBTyxHQUFHLE9BQU8sT0FBTyxDQUFDLFNBQVMsS0FBSyxRQUFRLEdBQ25ELENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7O0FBRTFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsVUFBQyxTQUFTLEVBQUs7QUFBRSxnQkFBSyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUFFLENBQUMsQ0FBQztPQUN4RTs7QUFFRCxVQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuQyxVQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O0FBRTFCLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoQixVQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDdkIsYUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0tBQ2pCOzs7OztXQUdPLG9CQUFHLEVBQUU7OztXQUVQLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7QUFDekIsVUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMzQzs7Ozs7Ozs7Ozs7O1dBVWMsMkJBQUc7Ozs0QkFDUCxHQUFHO3lCQUNnQixHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQzs7OztZQUFsQyxLQUFLO1lBQUUsUUFBUTs7QUFDdEIsWUFBTSxRQUFRLEdBQUcsT0FBSyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsWUFBTSxRQUFRLEdBQUcsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxPQUFLLEdBQUcsQ0FBQyxHQUFHLE9BQUssR0FBRyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU5RSxvQkFBVyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7O0FBRXhDLGlCQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNwRCxpQkFBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEQsQ0FBQyxDQUFDOzs7QUFUTCxXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Y0FBcEIsR0FBRztPQVVYO0tBQ0Y7OztXQUVnQiw2QkFBRzs7OzZCQUNULEdBQUc7MEJBQ2dCLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDOzs7O1lBQWxDLEtBQUs7WUFBRSxRQUFROztBQUN0QixZQUFNLFFBQVEsR0FBRyxPQUFLLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxZQUFNLFFBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxDQUFDLE9BQUssR0FBRyxDQUFDLEdBQUcsT0FBSyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTlFLG9CQUFXLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBSztBQUN4QyxpQkFBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckQsQ0FBQyxDQUFDOzs7QUFQTCxXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7ZUFBcEIsR0FBRztPQVFYO0tBQ0Y7OztTQTlFa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdGVtcGxhdGUgZnJvbSAnbG9kYXNoLnRlbXBsYXRlJztcblxuLyoqXG4gKiBAdG9kbyAtIHdyaXRlIGRvY1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgY29uc3RydWN0b3IodG1wbFN0ciwgbW9kZWwgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMudG1wbCA9IHRlbXBsYXRlKHRtcGxTdHIpO1xuICAgIHRoaXMubW9kZWwgPSBtb2RlbDtcbiAgICB0aGlzLmV2ZW50cyA9IGV2ZW50cztcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIGVsOiAnZGl2JyxcbiAgICAgIGlkOiBudWxsLFxuICAgICAgY2xhc3NOYW1lOiBudWxsLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgLy8gY3JlYXRlIGNvbnRhaW5lciBpbiBtZW1vcnlcbiAgICB0aGlzLiRlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5vcHRpb25zLmVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtET01FbGVtZW50fVxuICAgKi9cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucy5pZCkgeyB0aGlzLiRlbC5pZCA9IG9wdGlvbnMuaWQ7IH1cblxuICAgIGlmIChvcHRpb25zLmNsYXNzTmFtZSkge1xuICAgICAgY29uc3QgY2xhc3NlcyA9IHR5cGVvZiBvcHRpb25zLmNsYXNzTmFtZSA9PT0gJ3N0cmluZycgP1xuICAgICAgICBbb3B0aW9ucy5jbGFzc05hbWVdIDogb3B0aW9ucy5jbGFzc05hbWU7XG5cbiAgICAgIGNsYXNzZXMuZm9yRWFjaCgoY2xhc3NOYW1lKSA9PiB7IHRoaXMuJGVsLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTsgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaHRtbCA9IHRoaXMudG1wbCh0aGlzLm1vZGVsKTtcbiAgICB0aGlzLiRlbC5pbm5lckhUTUwgPSBodG1sO1xuXG4gICAgdGhpcy5vblJlbmRlcigpO1xuICAgIHRoaXMuX2RlbGVnYXRlRXZlbnRzKCk7XG4gICAgcmV0dXJuIHRoaXMuJGVsO1xuICB9XG5cbiAgLy8gZW50cnkgcG9pbnQgd2hlbiBET00gaXMgcmVhZHlcbiAgb25SZW5kZXIoKSB7fVxuXG4gIHJlbW92ZSgpIHtcbiAgICB0aGlzLl91bmRlbGVnYXRlRXZlbnRzKCk7XG4gICAgdGhpcy4kZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLiRlbCk7XG4gIH1cblxuICAvLyBzaG93KCkge1xuICAvLyAgIHRoaXMuJGVsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAvLyB9XG5cbiAgLy8gaGlkZSgpIHtcbiAgLy8gICB0aGlzLiRlbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAvLyB9XG5cbiAgX2RlbGVnYXRlRXZlbnRzKCkge1xuICAgIGZvciAobGV0IGtleSBpbiB0aGlzLmV2ZW50cykge1xuICAgICAgY29uc3QgW2V2ZW50LCBzZWxlY3Rvcl0gPSBrZXkuc3BsaXQoLyArLyk7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMuZXZlbnRzW2tleV07XG4gICAgICBjb25zdCAkdGFyZ2V0cyA9ICFzZWxlY3RvciA/IFt0aGlzLiRlbF0gOiB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKTtcblxuICAgICAgQXJyYXkuZnJvbSgkdGFyZ2V0cykuZm9yRWFjaCgoJHRhcmdldCkgPT4ge1xuICAgICAgICAvLyBkb24ndCBhZGQgYSBsaXN0ZW5lciB0d2ljZSwgaWYgcmVuZGVyIGlzIGNhbGxlZCBzZXZlcmFsIHRpbWVzXG4gICAgICAgICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgICAgJHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBjYWxsYmFjaywgZmFsc2UpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgX3VuZGVsZWdhdGVFdmVudHMoKSB7XG4gICAgZm9yIChsZXQga2V5IGluIHRoaXMuZXZlbnRzKSB7XG4gICAgICBjb25zdCBbZXZlbnQsIHNlbGVjdG9yXSA9IGtleS5zcGxpdCgvICsvKTtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5ldmVudHNba2V5XTtcbiAgICAgIGNvbnN0ICR0YXJnZXRzID0gIXNlbGVjdG9yID8gW3RoaXMuJGVsXSA6IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gICAgICBBcnJheS5mcm9tKCR0YXJnZXRzKS5mb3JFYWNoKCgkdGFyZ2V0KSA9PiB7XG4gICAgICAgICR0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgY2FsbGJhY2ssIGZhbHNlKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufSJdfQ==
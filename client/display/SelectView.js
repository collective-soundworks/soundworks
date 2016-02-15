'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

var defaultTemplate = '\n  <option class="small"><%= instructions %></option>\n  <% entries.forEach((entry) => { %>\n    <option value="<%= entry.index %>"><%= entry.label %></option>\n  <% }) %>\n';

var SelectView = (function (_View) {
  _inherits(SelectView, _View);

  function SelectView(content) {
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SelectView);

    options = _Object$assign({ el: 'select', className: 'select' }, options);
    _get(Object.getPrototypeOf(SelectView.prototype), 'constructor', this).call(this, defaultTemplate, content, events, options);

    this.entries = content.entries;
  }

  _createClass(SelectView, [{
    key: 'onResize',
    value: function onResize() {}
  }, {
    key: 'enableIndex',
    value: function enableIndex(index) {
      var $option = this.$el.querySelector('option[value="' + index + '"]');
      if ($option) $option.removeAttribute('disabled');
    }
  }, {
    key: 'disableIndex',
    value: function disableIndex(index) {
      var $option = this.$el.querySelector('option[value="' + index + '"]');
      if ($option) $option.setAttribute('disabled', 'disabled');
    }
  }, {
    key: 'value',
    get: function get() {
      var index = parseInt(this.$el.value);
      var entry = this.entries.find(function (entry) {
        return entry.index === index;
      });
      return entry || null;
    }
  }]);

  return SelectView;
})(_View3['default']);

exports['default'] = SelectView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TZWxlY3RWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLGVBQWUsbUxBS3BCLENBQUM7O0lBRW1CLFVBQVU7WUFBVixVQUFVOztBQUNsQixXQURRLFVBQVUsQ0FDakIsT0FBTyxFQUE2QjtRQUEzQixNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQzQixVQUFVOztBQUUzQixXQUFPLEdBQUcsZUFBYyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hFLCtCQUhpQixVQUFVLDZDQUdyQixlQUFlLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7O0FBRWpELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztHQUNoQzs7ZUFOa0IsVUFBVTs7V0FRckIsb0JBQUcsRUFBRTs7O1dBUUYscUJBQUMsS0FBSyxFQUFFO0FBQ2pCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxvQkFBa0IsS0FBSyxRQUFLLENBQUM7QUFDbkUsVUFBSSxPQUFPLEVBQ1QsT0FBTyxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztLQUN2Qzs7O1dBRVcsc0JBQUMsS0FBSyxFQUFFO0FBQ2xCLFVBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxvQkFBa0IsS0FBSyxRQUFLLENBQUM7QUFDbkUsVUFBSSxPQUFPLEVBQ1QsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7S0FDaEQ7OztTQWhCUSxlQUFHO0FBQ1YsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkMsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsVUFBQSxLQUFLO2VBQUksS0FBSyxDQUFDLEtBQUssS0FBSyxLQUFLO09BQUEsQ0FBQyxDQUFDO0FBQ2hFLGFBQU8sS0FBSyxJQUFJLElBQUksQ0FBQztLQUN0Qjs7O1NBZGtCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9TZWxlY3RWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3QgZGVmYXVsdFRlbXBsYXRlID0gYFxuICA8b3B0aW9uIGNsYXNzPVwic21hbGxcIj48JT0gaW5zdHJ1Y3Rpb25zICU+PC9vcHRpb24+XG4gIDwlIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHsgJT5cbiAgICA8b3B0aW9uIHZhbHVlPVwiPCU9IGVudHJ5LmluZGV4ICU+XCI+PCU9IGVudHJ5LmxhYmVsICU+PC9vcHRpb24+XG4gIDwlIH0pICU+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnQsIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGVsOiAnc2VsZWN0JywgY2xhc3NOYW1lOiAnc2VsZWN0JyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcihkZWZhdWx0VGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmVudHJpZXMgPSBjb250ZW50LmVudHJpZXM7XG4gIH1cblxuICBvblJlc2l6ZSgpIHt9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQodGhpcy4kZWwudmFsdWUpO1xuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5lbnRyaWVzLmZpbmQoZW50cnkgPT4gZW50cnkuaW5kZXggPT09IGluZGV4KTtcbiAgICByZXR1cm4gZW50cnkgfHzCoG51bGw7XG4gIH1cblxuICBlbmFibGVJbmRleChpbmRleCkge1xuICAgIGNvbnN0ICRvcHRpb24gPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGBvcHRpb25bdmFsdWU9XCIke2luZGV4fVwiXWApO1xuICAgIGlmICgkb3B0aW9uKVxuICAgICAgJG9wdGlvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIH1cblxuICBkaXNhYmxlSW5kZXgoaW5kZXgpIHtcbiAgICBjb25zdCAkb3B0aW9uID0gdGhpcy4kZWwucXVlcnlTZWxlY3Rvcihgb3B0aW9uW3ZhbHVlPVwiJHtpbmRleH1cIl1gKTtcbiAgICBpZiAoJG9wdGlvbilcbiAgICAgICRvcHRpb24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICB9XG59XG4iXX0=
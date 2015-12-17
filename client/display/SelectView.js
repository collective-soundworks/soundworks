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

var defaultTemplate = '\n  <option class="small"><%= instructions %></option>\n  <% entries.forEach((entry) => { %>\n    <option value="<%= entry.index %>">\n      <%= entry.label %>\n    </option>\n  <% }) %>\n';

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TZWxlY3RWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLGVBQWUsaU1BT3BCLENBQUM7O0lBRW1CLFVBQVU7WUFBVixVQUFVOztBQUNsQixXQURRLFVBQVUsQ0FDakIsT0FBTyxFQUE2QjtRQUEzQixNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQzQixVQUFVOztBQUUzQixXQUFPLEdBQUcsZUFBYyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hFLCtCQUhpQixVQUFVLDZDQUdyQixlQUFlLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7O0FBRWpELFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztHQUNoQzs7ZUFOa0IsVUFBVTs7V0FRckIsb0JBQUcsRUFBRTs7O1NBRUosZUFBRztBQUNWLFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSztPQUFBLENBQUMsQ0FBQztBQUNoRSxhQUFPLEtBQUssSUFBSSxJQUFJLENBQUM7S0FDdEI7OztTQWRrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvU2VsZWN0Vmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPG9wdGlvbiBjbGFzcz1cInNtYWxsXCI+PCU9IGluc3RydWN0aW9ucyAlPjwvb3B0aW9uPlxuICA8JSBlbnRyaWVzLmZvckVhY2goKGVudHJ5KSA9PiB7ICU+XG4gICAgPG9wdGlvbiB2YWx1ZT1cIjwlPSBlbnRyeS5pbmRleCAlPlwiPlxuICAgICAgPCU9IGVudHJ5LmxhYmVsICU+XG4gICAgPC9vcHRpb24+XG4gIDwlIH0pICU+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnQsIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGVsOiAnc2VsZWN0JywgY2xhc3NOYW1lOiAnc2VsZWN0JyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcihkZWZhdWx0VGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmVudHJpZXMgPSBjb250ZW50LmVudHJpZXM7XG4gIH1cblxuICBvblJlc2l6ZSgpIHt9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQodGhpcy4kZWwudmFsdWUpO1xuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5lbnRyaWVzLmZpbmQoZW50cnkgPT4gZW50cnkuaW5kZXggPT09IGluZGV4KTtcbiAgICByZXR1cm4gZW50cnkgfHzCoG51bGw7XG4gIH1cbn1cbiJdfQ==
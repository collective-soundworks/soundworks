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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvU2VsZWN0Vmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQWlCLFFBQVE7Ozs7QUFFekIsSUFBTSxlQUFlLG1MQUtwQixDQUFDOztJQUVtQixVQUFVO1lBQVYsVUFBVTs7QUFDbEIsV0FEUSxVQUFVLENBQ2pCLE9BQU8sRUFBNkI7UUFBM0IsTUFBTSx5REFBRyxFQUFFO1FBQUUsT0FBTyx5REFBRyxFQUFFOzswQkFEM0IsVUFBVTs7QUFFM0IsV0FBTyxHQUFHLGVBQWMsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4RSwrQkFIaUIsVUFBVSw2Q0FHckIsZUFBZSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOztBQUVqRCxRQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7R0FDaEM7O2VBTmtCLFVBQVU7O1dBUXJCLG9CQUFHLEVBQUU7OztXQVFGLHFCQUFDLEtBQUssRUFBRTtBQUNqQixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsb0JBQWtCLEtBQUssUUFBSyxDQUFDO0FBQ25FLFVBQUksT0FBTyxFQUNULE9BQU8sQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDdkM7OztXQUVXLHNCQUFDLEtBQUssRUFBRTtBQUNsQixVQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsb0JBQWtCLEtBQUssUUFBSyxDQUFDO0FBQ25FLFVBQUksT0FBTyxFQUNULE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0tBQ2hEOzs7U0FoQlEsZUFBRztBQUNWLFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUEsS0FBSztlQUFJLEtBQUssQ0FBQyxLQUFLLEtBQUssS0FBSztPQUFBLENBQUMsQ0FBQztBQUNoRSxhQUFPLEtBQUssSUFBSSxJQUFJLENBQUM7S0FDdEI7OztTQWRrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9kaXNwbGF5L1NlbGVjdFZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBgXG4gIDxvcHRpb24gY2xhc3M9XCJzbWFsbFwiPjwlPSBpbnN0cnVjdGlvbnMgJT48L29wdGlvbj5cbiAgPCUgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4geyAlPlxuICAgIDxvcHRpb24gdmFsdWU9XCI8JT0gZW50cnkuaW5kZXggJT5cIj48JT0gZW50cnkubGFiZWwgJT48L29wdGlvbj5cbiAgPCUgfSkgJT5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IoY29udGVudCwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZWw6ICdzZWxlY3QnLCBjbGFzc05hbWU6ICdzZWxlY3QnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKGRlZmF1bHRUZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuZW50cmllcyA9IGNvbnRlbnQuZW50cmllcztcbiAgfVxuXG4gIG9uUmVzaXplKCkge31cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludCh0aGlzLiRlbC52YWx1ZSk7XG4gICAgY29uc3QgZW50cnkgPSB0aGlzLmVudHJpZXMuZmluZChlbnRyeSA9PiBlbnRyeS5pbmRleCA9PT0gaW5kZXgpO1xuICAgIHJldHVybiBlbnRyeSB8fMKgbnVsbDtcbiAgfVxuXG4gIGVuYWJsZUluZGV4KGluZGV4KSB7XG4gICAgY29uc3QgJG9wdGlvbiA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYG9wdGlvblt2YWx1ZT1cIiR7aW5kZXh9XCJdYCk7XG4gICAgaWYgKCRvcHRpb24pXG4gICAgICAkb3B0aW9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIGRpc2FibGVJbmRleChpbmRleCkge1xuICAgIGNvbnN0ICRvcHRpb24gPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGBvcHRpb25bdmFsdWU9XCIke2luZGV4fVwiXWApO1xuICAgIGlmICgkb3B0aW9uKVxuICAgICAgJG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gIH1cbn1cbiJdfQ==
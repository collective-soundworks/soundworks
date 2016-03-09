'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTemplate = '\n  <option class="small"><%= instructions %></option>\n  <% entries.forEach(function(entry) { %>\n    <option value="<%= entry.index %>"><%= entry.label %></option>\n  <% }); %>\n';

var SelectView = function (_View) {
  (0, _inherits3.default)(SelectView, _View);

  function SelectView(content) {
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    (0, _classCallCheck3.default)(this, SelectView);

    options = (0, _assign2.default)({ el: 'select', className: 'select' }, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SelectView).call(this, defaultTemplate, content, events, options));

    _this.entries = content.entries;
    return _this;
  }

  (0, _createClass3.default)(SelectView, [{
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
}(_View3.default);

exports.default = SelectView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlbGVjdFZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU0sd01BQU47O0lBT3FCOzs7QUFDbkIsV0FEbUIsVUFDbkIsQ0FBWSxPQUFaLEVBQWdEO1FBQTNCLCtEQUFTLGtCQUFrQjtRQUFkLGdFQUFVLGtCQUFJO3dDQUQ3QixZQUM2Qjs7QUFDOUMsY0FBVSxzQkFBYyxFQUFFLElBQUksUUFBSixFQUFjLFdBQVcsUUFBWCxFQUE5QixFQUFxRCxPQUFyRCxDQUFWLENBRDhDOzs2RkFEN0IsdUJBR1gsaUJBQWlCLFNBQVMsUUFBUSxVQUZNOztBQUk5QyxVQUFLLE9BQUwsR0FBZSxRQUFRLE9BQVIsQ0FKK0I7O0dBQWhEOzs2QkFEbUI7OytCQVFSOzs7Z0NBUUMsT0FBTztBQUNqQixVQUFNLFVBQVUsS0FBSyxHQUFMLENBQVMsYUFBVCxvQkFBd0MsWUFBeEMsQ0FBVixDQURXO0FBRWpCLFVBQUksT0FBSixFQUNFLFFBQVEsZUFBUixDQUF3QixVQUF4QixFQURGOzs7O2lDQUlXLE9BQU87QUFDbEIsVUFBTSxVQUFVLEtBQUssR0FBTCxDQUFTLGFBQVQsb0JBQXdDLFlBQXhDLENBQVYsQ0FEWTtBQUVsQixVQUFJLE9BQUosRUFDRSxRQUFRLFlBQVIsQ0FBcUIsVUFBckIsRUFBaUMsVUFBakMsRUFERjs7Ozt3QkFkVTtBQUNWLFVBQU0sUUFBUSxTQUFTLEtBQUssR0FBTCxDQUFTLEtBQVQsQ0FBakIsQ0FESTtBQUVWLFVBQU0sUUFBUSxLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCO2VBQVMsTUFBTSxLQUFOLEtBQWdCLEtBQWhCO09BQVQsQ0FBMUIsQ0FGSTtBQUdWLGFBQU8sU0FBUyxJQUFULENBSEc7OztTQVZPIiwiZmlsZSI6IlNlbGVjdFZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBgXG4gIDxvcHRpb24gY2xhc3M9XCJzbWFsbFwiPjwlPSBpbnN0cnVjdGlvbnMgJT48L29wdGlvbj5cbiAgPCUgZW50cmllcy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7ICU+XG4gICAgPG9wdGlvbiB2YWx1ZT1cIjwlPSBlbnRyeS5pbmRleCAlPlwiPjwlPSBlbnRyeS5sYWJlbCAlPjwvb3B0aW9uPlxuICA8JSB9KTsgJT5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlbGVjdFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IoY29udGVudCwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgZWw6ICdzZWxlY3QnLCBjbGFzc05hbWU6ICdzZWxlY3QnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKGRlZmF1bHRUZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIHRoaXMuZW50cmllcyA9IGNvbnRlbnQuZW50cmllcztcbiAgfVxuXG4gIG9uUmVzaXplKCkge31cblxuICBnZXQgdmFsdWUoKSB7XG4gICAgY29uc3QgaW5kZXggPSBwYXJzZUludCh0aGlzLiRlbC52YWx1ZSk7XG4gICAgY29uc3QgZW50cnkgPSB0aGlzLmVudHJpZXMuZmluZChlbnRyeSA9PiBlbnRyeS5pbmRleCA9PT0gaW5kZXgpO1xuICAgIHJldHVybiBlbnRyeSB8fMKgbnVsbDtcbiAgfVxuXG4gIGVuYWJsZUluZGV4KGluZGV4KSB7XG4gICAgY29uc3QgJG9wdGlvbiA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYG9wdGlvblt2YWx1ZT1cIiR7aW5kZXh9XCJdYCk7XG4gICAgaWYgKCRvcHRpb24pXG4gICAgICAkb3B0aW9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIGRpc2FibGVJbmRleChpbmRleCkge1xuICAgIGNvbnN0ICRvcHRpb24gPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGBvcHRpb25bdmFsdWU9XCIke2luZGV4fVwiXWApO1xuICAgIGlmICgkb3B0aW9uKVxuICAgICAgJG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gIH1cbn1cbiJdfQ==
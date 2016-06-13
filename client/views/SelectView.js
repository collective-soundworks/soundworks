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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlbGVjdFZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU0sd01BQU47O0lBT3FCLFU7OztBQUNuQixzQkFBWSxPQUFaLEVBQWdEO0FBQUEsUUFBM0IsTUFBMkIseURBQWxCLEVBQWtCO0FBQUEsUUFBZCxPQUFjLHlEQUFKLEVBQUk7QUFBQTs7QUFDOUMsY0FBVSxzQkFBYyxFQUFFLElBQUksUUFBTixFQUFnQixXQUFXLFFBQTNCLEVBQWQsRUFBcUQsT0FBckQsQ0FBVjs7QUFEOEMsb0hBRXhDLGVBRndDLEVBRXZCLE9BRnVCLEVBRWQsTUFGYyxFQUVOLE9BRk07O0FBSTlDLFVBQUssT0FBTCxHQUFlLFFBQVEsT0FBdkI7QUFKOEM7QUFLL0M7Ozs7K0JBRVUsQ0FBRTs7O2dDQVFELEssRUFBTztBQUNqQixVQUFNLFVBQVUsS0FBSyxHQUFMLENBQVMsYUFBVCxvQkFBd0MsS0FBeEMsUUFBaEI7QUFDQSxVQUFJLE9BQUosRUFDRSxRQUFRLGVBQVIsQ0FBd0IsVUFBeEI7QUFDSDs7O2lDQUVZLEssRUFBTztBQUNsQixVQUFNLFVBQVUsS0FBSyxHQUFMLENBQVMsYUFBVCxvQkFBd0MsS0FBeEMsUUFBaEI7QUFDQSxVQUFJLE9BQUosRUFDRSxRQUFRLFlBQVIsQ0FBcUIsVUFBckIsRUFBaUMsVUFBakM7QUFDSDs7O3dCQWhCVztBQUNWLFVBQU0sUUFBUSxTQUFTLEtBQUssR0FBTCxDQUFTLEtBQWxCLENBQWQ7QUFDQSxVQUFNLFFBQVEsS0FBSyxPQUFMLENBQWEsSUFBYixDQUFrQjtBQUFBLGVBQVMsTUFBTSxLQUFOLEtBQWdCLEtBQXpCO0FBQUEsT0FBbEIsQ0FBZDtBQUNBLGFBQU8sU0FBUyxJQUFoQjtBQUNEOzs7OztrQkFka0IsVSIsImZpbGUiOiJTZWxlY3RWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3QgZGVmYXVsdFRlbXBsYXRlID0gYFxuICA8b3B0aW9uIGNsYXNzPVwic21hbGxcIj48JT0gaW5zdHJ1Y3Rpb25zICU+PC9vcHRpb24+XG4gIDwlIGVudHJpZXMuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkgeyAlPlxuICAgIDxvcHRpb24gdmFsdWU9XCI8JT0gZW50cnkuaW5kZXggJT5cIj48JT0gZW50cnkubGFiZWwgJT48L29wdGlvbj5cbiAgPCUgfSk7ICU+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWxlY3RWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKGNvbnRlbnQsIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGVsOiAnc2VsZWN0JywgY2xhc3NOYW1lOiAnc2VsZWN0JyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcihkZWZhdWx0VGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmVudHJpZXMgPSBjb250ZW50LmVudHJpZXM7XG4gIH1cblxuICBvblJlc2l6ZSgpIHt9XG5cbiAgZ2V0IHZhbHVlKCkge1xuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQodGhpcy4kZWwudmFsdWUpO1xuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5lbnRyaWVzLmZpbmQoZW50cnkgPT4gZW50cnkuaW5kZXggPT09IGluZGV4KTtcbiAgICByZXR1cm4gZW50cnkgfHzCoG51bGw7XG4gIH1cblxuICBlbmFibGVJbmRleChpbmRleCkge1xuICAgIGNvbnN0ICRvcHRpb24gPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGBvcHRpb25bdmFsdWU9XCIke2luZGV4fVwiXWApO1xuICAgIGlmICgkb3B0aW9uKVxuICAgICAgJG9wdGlvbi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gIH1cblxuICBkaXNhYmxlSW5kZXgoaW5kZXgpIHtcbiAgICBjb25zdCAkb3B0aW9uID0gdGhpcy4kZWwucXVlcnlTZWxlY3Rvcihgb3B0aW9uW3ZhbHVlPVwiJHtpbmRleH1cIl1gKTtcbiAgICBpZiAoJG9wdGlvbilcbiAgICAgICRvcHRpb24uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsICdkaXNhYmxlZCcpO1xuICB9XG59XG4iXX0=
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

var _View2 = require('../views/View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTemplate = '\n  <option class="small"><%= instructions %></option>\n  <% entries.forEach(function(entry) { %>\n    <option value="<%= entry.index %>"><%= entry.label %></option>\n  <% }); %>\n';

/**
 * View with a drop down list.
 *
 * @memberof module:soundworks/client
 */

var SelectView = function (_View) {
  (0, _inherits3.default)(SelectView, _View);

  function SelectView(content) {
    var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    (0, _classCallCheck3.default)(this, SelectView);

    options = (0, _assign2.default)({ el: 'select', className: 'select' }, options);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SelectView.__proto__ || (0, _getPrototypeOf2.default)(SelectView)).call(this, defaultTemplate, content, events, options));

    _this.entries = content.entries;
    return _this;
  }

  /**
   * why noop ?
   * @private
   */


  (0, _createClass3.default)(SelectView, [{
    key: 'onResize',
    value: function onResize() {}

    /**
     * Return the entry corresponding to the selected item.
     */

  }, {
    key: 'enableIndex',


    /**
     * Enable selection of a specific item.
     *
     * @param {Number} index - Index of the entry.
     */
    value: function enableIndex(index) {
      var $option = this.$el.querySelector('option[value="' + index + '"]');
      if ($option) $option.removeAttribute('disabled');
    }

    /**
     * Disable selection of a specific item.
     *
     * @param {Number} index - Index of the entry.
     */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlbGVjdFZpZXcuanMiXSwibmFtZXMiOlsiZGVmYXVsdFRlbXBsYXRlIiwiU2VsZWN0VmlldyIsImNvbnRlbnQiLCJldmVudHMiLCJvcHRpb25zIiwiZWwiLCJjbGFzc05hbWUiLCJlbnRyaWVzIiwiaW5kZXgiLCIkb3B0aW9uIiwiJGVsIiwicXVlcnlTZWxlY3RvciIsInJlbW92ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInBhcnNlSW50IiwidmFsdWUiLCJlbnRyeSIsImZpbmQiLCJWaWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsd01BQU47O0FBUUE7Ozs7OztJQUtNQyxVOzs7QUFDSixzQkFBWUMsT0FBWixFQUFnRDtBQUFBLFFBQTNCQyxNQUEyQix1RUFBbEIsRUFBa0I7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDOUNBLGNBQVUsc0JBQWMsRUFBRUMsSUFBSSxRQUFOLEVBQWdCQyxXQUFXLFFBQTNCLEVBQWQsRUFBcURGLE9BQXJELENBQVY7O0FBRDhDLDhJQUV4Q0osZUFGd0MsRUFFdkJFLE9BRnVCLEVBRWRDLE1BRmMsRUFFTkMsT0FGTTs7QUFJOUMsVUFBS0csT0FBTCxHQUFlTCxRQUFRSyxPQUF2QjtBQUo4QztBQUsvQzs7QUFFRDs7Ozs7Ozs7K0JBSVcsQ0FBRTs7QUFFYjs7Ozs7Ozs7QUFTQTs7Ozs7Z0NBS1lDLEssRUFBTztBQUNqQixVQUFNQyxVQUFVLEtBQUtDLEdBQUwsQ0FBU0MsYUFBVCxvQkFBd0NILEtBQXhDLFFBQWhCO0FBQ0EsVUFBSUMsT0FBSixFQUNFQSxRQUFRRyxlQUFSLENBQXdCLFVBQXhCO0FBQ0g7O0FBRUQ7Ozs7Ozs7O2lDQUthSixLLEVBQU87QUFDbEIsVUFBTUMsVUFBVSxLQUFLQyxHQUFMLENBQVNDLGFBQVQsb0JBQXdDSCxLQUF4QyxRQUFoQjtBQUNBLFVBQUlDLE9BQUosRUFDRUEsUUFBUUksWUFBUixDQUFxQixVQUFyQixFQUFpQyxVQUFqQztBQUNIOzs7d0JBMUJXO0FBQ1YsVUFBTUwsUUFBUU0sU0FBUyxLQUFLSixHQUFMLENBQVNLLEtBQWxCLENBQWQ7QUFDQSxVQUFNQyxRQUFRLEtBQUtULE9BQUwsQ0FBYVUsSUFBYixDQUFrQjtBQUFBLGVBQVNELE1BQU1SLEtBQU4sS0FBZ0JBLEtBQXpCO0FBQUEsT0FBbEIsQ0FBZDtBQUNBLGFBQU9RLFNBQVMsSUFBaEI7QUFDRDs7O0VBckJzQkUsYzs7a0JBOENWakIsVSIsImZpbGUiOiJTZWxlY3RWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi4vdmlld3MvVmlldyc7XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPG9wdGlvbiBjbGFzcz1cInNtYWxsXCI+PCU9IGluc3RydWN0aW9ucyAlPjwvb3B0aW9uPlxuICA8JSBlbnRyaWVzLmZvckVhY2goZnVuY3Rpb24oZW50cnkpIHsgJT5cbiAgICA8b3B0aW9uIHZhbHVlPVwiPCU9IGVudHJ5LmluZGV4ICU+XCI+PCU9IGVudHJ5LmxhYmVsICU+PC9vcHRpb24+XG4gIDwlIH0pOyAlPlxuYDtcblxuXG4vKipcbiAqIFZpZXcgd2l0aCBhIGRyb3AgZG93biBsaXN0LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgU2VsZWN0VmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcihjb250ZW50LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBlbDogJ3NlbGVjdCcsIGNsYXNzTmFtZTogJ3NlbGVjdCcgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIoZGVmYXVsdFRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5lbnRyaWVzID0gY29udGVudC5lbnRyaWVzO1xuICB9XG5cbiAgLyoqXG4gICAqIHdoeSBub29wID9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUmVzaXplKCkge31cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBlbnRyeSBjb3JyZXNwb25kaW5nIHRvIHRoZSBzZWxlY3RlZCBpdGVtLlxuICAgKi9cbiAgZ2V0IHZhbHVlKCkge1xuICAgIGNvbnN0IGluZGV4ID0gcGFyc2VJbnQodGhpcy4kZWwudmFsdWUpO1xuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5lbnRyaWVzLmZpbmQoZW50cnkgPT4gZW50cnkuaW5kZXggPT09IGluZGV4KTtcbiAgICByZXR1cm4gZW50cnkgfHzCoG51bGw7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlIHNlbGVjdGlvbiBvZiBhIHNwZWNpZmljIGl0ZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBlbnRyeS5cbiAgICovXG4gIGVuYWJsZUluZGV4KGluZGV4KSB7XG4gICAgY29uc3QgJG9wdGlvbiA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYG9wdGlvblt2YWx1ZT1cIiR7aW5kZXh9XCJdYCk7XG4gICAgaWYgKCRvcHRpb24pXG4gICAgICAkb3B0aW9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlIHNlbGVjdGlvbiBvZiBhIHNwZWNpZmljIGl0ZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIEluZGV4IG9mIHRoZSBlbnRyeS5cbiAgICovXG4gIGRpc2FibGVJbmRleChpbmRleCkge1xuICAgIGNvbnN0ICRvcHRpb24gPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGBvcHRpb25bdmFsdWU9XCIke2luZGV4fVwiXWApO1xuICAgIGlmICgkb3B0aW9uKVxuICAgICAgJG9wdGlvbi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgJ2Rpc2FibGVkJyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VsZWN0VmlldztcbiJdfQ==
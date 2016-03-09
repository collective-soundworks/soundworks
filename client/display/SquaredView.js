'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTemplate = '\n  <div class="section-square flex-middle"></div>\n  <div class="section-float flex-middle"></div>\n';

var SquaredView = function (_View) {
  (0, _inherits3.default)(SquaredView, _View);

  function SquaredView(template) {
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    (0, _classCallCheck3.default)(this, SquaredView);

    template = !template ? defaultTemplate : template;

    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SquaredView).call(this, template, content, events, options));
  }

  (0, _createClass3.default)(SquaredView, [{
    key: 'onRender',
    value: function onRender() {
      this.$square = this.$el.querySelector('.section-square');
      this.$float = this.$el.querySelector('.section-float');

      this.$square.style.float = 'left';
      this.$float.style.float = 'left';
    }
  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SquaredView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);

      var size = void 0,
          floatHeight = void 0,
          floatWidth = void 0;

      if (orientation === 'portrait') {
        size = viewportWidth;
        floatHeight = viewportHeight - size;
        floatWidth = viewportWidth;
      } else {
        size = viewportHeight;
        floatHeight = viewportHeight;
        floatWidth = viewportWidth - size;
      }

      this.$square.style.width = size + 'px';
      this.$square.style.height = size + 'px';

      this.$float.style.width = floatWidth + 'px';
      this.$float.style.height = floatHeight + 'px';
    }
  }]);
  return SquaredView;
}(_View3.default);

exports.default = SquaredView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNxdWFyZWRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFHQSxJQUFNLHlIQUFOOztJQUtxQjs7O0FBQ25CLFdBRG1CLFdBQ25CLENBQVksUUFBWixFQUErRDtRQUF6QyxnRUFBVSxrQkFBK0I7UUFBM0IsK0RBQVMsa0JBQWtCO1FBQWQsZ0VBQVUsa0JBQUk7d0NBRDVDLGFBQzRDOztBQUM3RCxlQUFXLENBQUMsUUFBRCxHQUFZLGVBQVosR0FBOEIsUUFBOUIsQ0FEa0Q7O3dGQUQ1Qyx3QkFJWCxVQUFVLFNBQVMsUUFBUSxVQUg0QjtHQUEvRDs7NkJBRG1COzsrQkFPUjtBQUNULFdBQUssT0FBTCxHQUFlLEtBQUssR0FBTCxDQUFTLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWYsQ0FEUztBQUVULFdBQUssTUFBTCxHQUFjLEtBQUssR0FBTCxDQUFTLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQWQsQ0FGUzs7QUFJVCxXQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLEtBQW5CLEdBQTJCLE1BQTNCLENBSlM7QUFLVCxXQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLEtBQWxCLEdBQTBCLE1BQTFCLENBTFM7Ozs7NkJBUUYsZUFBZSxnQkFBZ0IsYUFBYTtBQUNuRCx1REFoQmlCLHFEQWdCRixlQUFlLGdCQUFnQixZQUE5QyxDQURtRDs7QUFHbkQsVUFBSSxhQUFKO1VBQVUsb0JBQVY7VUFBdUIsbUJBQXZCLENBSG1EOztBQUtuRCxVQUFJLGdCQUFnQixVQUFoQixFQUE0QjtBQUM5QixlQUFPLGFBQVAsQ0FEOEI7QUFFOUIsc0JBQWMsaUJBQWlCLElBQWpCLENBRmdCO0FBRzlCLHFCQUFhLGFBQWIsQ0FIOEI7T0FBaEMsTUFJTztBQUNMLGVBQU8sY0FBUCxDQURLO0FBRUwsc0JBQWMsY0FBZCxDQUZLO0FBR0wscUJBQWEsZ0JBQWdCLElBQWhCLENBSFI7T0FKUDs7QUFVQSxXQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLEtBQW5CLEdBQThCLFdBQTlCLENBZm1EO0FBZ0JuRCxXQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLE1BQW5CLEdBQStCLFdBQS9CLENBaEJtRDs7QUFrQm5ELFdBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsS0FBbEIsR0FBNkIsaUJBQTdCLENBbEJtRDtBQW1CbkQsV0FBSyxNQUFMLENBQVksS0FBWixDQUFrQixNQUFsQixHQUE4QixrQkFBOUIsQ0FuQm1EOzs7U0FmbEMiLCJmaWxlIjoiU3F1YXJlZFZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tc3F1YXJlIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWZsb2F0IGZsZXgtbWlkZGxlXCI+PC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVkVmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGVtcGxhdGUgPSAhdGVtcGxhdGUgPyBkZWZhdWx0VGVtcGxhdGUgOiB0ZW1wbGF0ZTtcblxuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kc3F1YXJlID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgdGhpcy4kZmxvYXQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1mbG9hdCcpO1xuXG4gICAgdGhpcy4kc3F1YXJlLnN0eWxlLmZsb2F0ID0gJ2xlZnQnO1xuICAgIHRoaXMuJGZsb2F0LnN0eWxlLmZsb2F0ID0gJ2xlZnQnO1xuICB9XG5cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKTtcblxuICAgIGxldCBzaXplLCBmbG9hdEhlaWdodCwgZmxvYXRXaWR0aDtcblxuICAgIGlmIChvcmllbnRhdGlvbiA9PT0gJ3BvcnRyYWl0Jykge1xuICAgICAgc2l6ZSA9IHZpZXdwb3J0V2lkdGg7XG4gICAgICBmbG9hdEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0IC0gc2l6ZTtcbiAgICAgIGZsb2F0V2lkdGggPSB2aWV3cG9ydFdpZHRoO1xuICAgIH0gZWxzZSB7XG4gICAgICBzaXplID0gdmlld3BvcnRIZWlnaHQ7XG4gICAgICBmbG9hdEhlaWdodCA9IHZpZXdwb3J0SGVpZ2h0O1xuICAgICAgZmxvYXRXaWR0aCA9IHZpZXdwb3J0V2lkdGggLSBzaXplO1xuICAgIH1cblxuICAgIHRoaXMuJHNxdWFyZS5zdHlsZS53aWR0aCA9IGAke3NpemV9cHhgO1xuICAgIHRoaXMuJHNxdWFyZS5zdHlsZS5oZWlnaHQgPSBgJHtzaXplfXB4YDtcblxuICAgIHRoaXMuJGZsb2F0LnN0eWxlLndpZHRoID0gYCR7ZmxvYXRXaWR0aH1weGA7XG4gICAgdGhpcy4kZmxvYXQuc3R5bGUuaGVpZ2h0ID0gYCR7ZmxvYXRIZWlnaHR9cHhgO1xuICB9XG59XG4iXX0=
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
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck3.default)(this, SquaredView);

    template = !template ? defaultTemplate : template;

    return (0, _possibleConstructorReturn3.default)(this, (SquaredView.__proto__ || (0, _getPrototypeOf2.default)(SquaredView)).call(this, template, content, events, options));
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
      (0, _get3.default)(SquaredView.prototype.__proto__ || (0, _getPrototypeOf2.default)(SquaredView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNxdWFyZWRWaWV3LmpzIl0sIm5hbWVzIjpbImRlZmF1bHRUZW1wbGF0ZSIsIlNxdWFyZWRWaWV3IiwidGVtcGxhdGUiLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsIiRzcXVhcmUiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiJGZsb2F0Iiwic3R5bGUiLCJmbG9hdCIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2l6ZSIsImZsb2F0SGVpZ2h0IiwiZmxvYXRXaWR0aCIsIndpZHRoIiwiaGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBR0EsSUFBTUEseUhBQU47O0lBS3FCQyxXOzs7QUFDbkIsdUJBQVlDLFFBQVosRUFBK0Q7QUFBQSxRQUF6Q0MsT0FBeUMsdUVBQS9CLEVBQStCO0FBQUEsUUFBM0JDLE1BQTJCLHVFQUFsQixFQUFrQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUM3REgsZUFBVyxDQUFDQSxRQUFELEdBQVlGLGVBQVosR0FBOEJFLFFBQXpDOztBQUQ2RCwySUFHdkRBLFFBSHVELEVBRzdDQyxPQUg2QyxFQUdwQ0MsTUFIb0MsRUFHNUJDLE9BSDRCO0FBSTlEOzs7OytCQUVVO0FBQ1QsV0FBS0MsT0FBTCxHQUFlLEtBQUtDLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixpQkFBdkIsQ0FBZjtBQUNBLFdBQUtDLE1BQUwsR0FBYyxLQUFLRixHQUFMLENBQVNDLGFBQVQsQ0FBdUIsZ0JBQXZCLENBQWQ7O0FBRUEsV0FBS0YsT0FBTCxDQUFhSSxLQUFiLENBQW1CQyxLQUFuQixHQUEyQixNQUEzQjtBQUNBLFdBQUtGLE1BQUwsQ0FBWUMsS0FBWixDQUFrQkMsS0FBbEIsR0FBMEIsTUFBMUI7QUFDRDs7OzZCQUVRQyxhLEVBQWVDLGMsRUFBZ0JDLFcsRUFBYTtBQUNuRCwrSUFBZUYsYUFBZixFQUE4QkMsY0FBOUIsRUFBOENDLFdBQTlDOztBQUVBLFVBQUlDLGFBQUo7QUFBQSxVQUFVQyxvQkFBVjtBQUFBLFVBQXVCQyxtQkFBdkI7O0FBRUEsVUFBSUgsZ0JBQWdCLFVBQXBCLEVBQWdDO0FBQzlCQyxlQUFPSCxhQUFQO0FBQ0FJLHNCQUFjSCxpQkFBaUJFLElBQS9CO0FBQ0FFLHFCQUFhTCxhQUFiO0FBQ0QsT0FKRCxNQUlPO0FBQ0xHLGVBQU9GLGNBQVA7QUFDQUcsc0JBQWNILGNBQWQ7QUFDQUkscUJBQWFMLGdCQUFnQkcsSUFBN0I7QUFDRDs7QUFFRCxXQUFLVCxPQUFMLENBQWFJLEtBQWIsQ0FBbUJRLEtBQW5CLEdBQThCSCxJQUE5QjtBQUNBLFdBQUtULE9BQUwsQ0FBYUksS0FBYixDQUFtQlMsTUFBbkIsR0FBK0JKLElBQS9COztBQUVBLFdBQUtOLE1BQUwsQ0FBWUMsS0FBWixDQUFrQlEsS0FBbEIsR0FBNkJELFVBQTdCO0FBQ0EsV0FBS1IsTUFBTCxDQUFZQyxLQUFaLENBQWtCUyxNQUFsQixHQUE4QkgsV0FBOUI7QUFDRDs7Ozs7a0JBbkNrQmYsVyIsImZpbGUiOiJTcXVhcmVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cblxuY29uc3QgZGVmYXVsdFRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1zcXVhcmUgZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tZmxvYXQgZmxleC1taWRkbGVcIj48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZWRWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0ZW1wbGF0ZSA9ICF0ZW1wbGF0ZSA/IGRlZmF1bHRUZW1wbGF0ZSA6IHRlbXBsYXRlO1xuXG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRzcXVhcmUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICB0aGlzLiRmbG9hdCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLWZsb2F0Jyk7XG5cbiAgICB0aGlzLiRzcXVhcmUuc3R5bGUuZmxvYXQgPSAnbGVmdCc7XG4gICAgdGhpcy4kZmxvYXQuc3R5bGUuZmxvYXQgPSAnbGVmdCc7XG4gIH1cblxuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgbGV0IHNpemUsIGZsb2F0SGVpZ2h0LCBmbG9hdFdpZHRoO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XG4gICAgICBzaXplID0gdmlld3BvcnRXaWR0aDtcbiAgICAgIGZsb2F0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQgLSBzaXplO1xuICAgICAgZmxvYXRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpemUgPSB2aWV3cG9ydEhlaWdodDtcbiAgICAgIGZsb2F0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQ7XG4gICAgICBmbG9hdFdpZHRoID0gdmlld3BvcnRXaWR0aCAtIHNpemU7XG4gICAgfVxuXG4gICAgdGhpcy4kc3F1YXJlLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgdGhpcy4kc3F1YXJlLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuXG4gICAgdGhpcy4kZmxvYXQuc3R5bGUud2lkdGggPSBgJHtmbG9hdFdpZHRofXB4YDtcbiAgICB0aGlzLiRmbG9hdC5zdHlsZS5oZWlnaHQgPSBgJHtmbG9hdEhlaWdodH1weGA7XG4gIH1cbn1cbiJdfQ==
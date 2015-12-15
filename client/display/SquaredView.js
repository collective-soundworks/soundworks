'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

var defaultTemplate = '\n  <div class="section-square"></div>\n  <div class="section-float"></div>\n';

var SquaredView = (function (_View) {
  _inherits(SquaredView, _View);

  function SquaredView(template) {
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, SquaredView);

    template = !template ? defaultTemplate : template;

    _get(Object.getPrototypeOf(SquaredView.prototype), 'constructor', this).call(this, template, content, events, options);
  }

  _createClass(SquaredView, [{
    key: 'onRender',
    value: function onRender() {
      this.$square = this.$el.querySelector('.section-square');
      this.$float = this.$el.querySelector('.section-float');

      this.$square.style.float = 'left';
      this.$float.style.float = 'left';
    }
  }, {
    key: 'onResize',
    value: function onResize(orientation, width, height) {
      _get(Object.getPrototypeOf(SquaredView.prototype), 'onResize', this).call(this, orientation, width, height);

      var size = undefined,
          floatHeight = undefined,
          floatWidth = undefined;

      if (orientation === 'portrait') {
        size = width;
        floatHeight = height - size;
        floatWidth = width;
      } else {
        size = height;
        floatHeight = height;
        floatWidth = width - size;
      }

      this.$square.style.width = size + 'px';
      this.$square.style.height = size + 'px';

      this.$float.style.width = floatWidth + 'px';
      this.$float.style.height = floatHeight + 'px';
    }
  }]);

  return SquaredView;
})(_View3['default']);

exports['default'] = SquaredView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcXVhcmVkVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0FBR3pCLElBQU0sZUFBZSxrRkFHcEIsQ0FBQzs7SUFFbUIsV0FBVztZQUFYLFdBQVc7O0FBQ25CLFdBRFEsV0FBVyxDQUNsQixRQUFRLEVBQTJDO1FBQXpDLE9BQU8seURBQUcsRUFBRTtRQUFFLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRDFDLFdBQVc7O0FBRTVCLFlBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxlQUFlLEdBQUcsUUFBUSxDQUFDOztBQUVsRCwrQkFKaUIsV0FBVyw2Q0FJdEIsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO0dBQzNDOztlQUxrQixXQUFXOztXQU90QixvQkFBRztBQUNULFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXZELFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFDbEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztLQUNsQzs7O1dBRU8sa0JBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsaUNBaEJpQixXQUFXLDBDQWdCYixXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTs7QUFFM0MsVUFBSSxJQUFJLFlBQUE7VUFBRSxXQUFXLFlBQUE7VUFBRSxVQUFVLFlBQUEsQ0FBQzs7QUFFbEMsVUFBSSxXQUFXLEtBQUssVUFBVSxFQUFFO0FBQzlCLFlBQUksR0FBRyxLQUFLLENBQUM7QUFDYixtQkFBVyxHQUFHLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDNUIsa0JBQVUsR0FBRyxLQUFLLENBQUM7T0FDcEIsTUFBTTtBQUNMLFlBQUksR0FBRyxNQUFNLENBQUM7QUFDZCxtQkFBVyxHQUFHLE1BQU0sQ0FBQztBQUNyQixrQkFBVSxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7T0FDM0I7O0FBRUQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLElBQUksT0FBSSxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxJQUFJLE9BQUksQ0FBQzs7QUFFeEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLFVBQVUsT0FBSSxDQUFDO0FBQzVDLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxXQUFXLE9BQUksQ0FBQztLQUMvQzs7O1NBbkNrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvU3F1YXJlZFZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tc3F1YXJlXCI+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWZsb2F0XCI+PC9kaXY+XG5gO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVkVmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGVtcGxhdGUgPSAhdGVtcGxhdGUgPyBkZWZhdWx0VGVtcGxhdGUgOiB0ZW1wbGF0ZTtcblxuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kc3F1YXJlID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tc3F1YXJlJyk7XG4gICAgdGhpcy4kZmxvYXQgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1mbG9hdCcpO1xuXG4gICAgdGhpcy4kc3F1YXJlLnN0eWxlLmZsb2F0ID0gJ2xlZnQnO1xuICAgIHRoaXMuJGZsb2F0LnN0eWxlLmZsb2F0ID0gJ2xlZnQnO1xuICB9XG5cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzdXBlci5vblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBsZXQgc2l6ZSwgZmxvYXRIZWlnaHQsIGZsb2F0V2lkdGg7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdwb3J0cmFpdCcpIHtcbiAgICAgIHNpemUgPSB3aWR0aDtcbiAgICAgIGZsb2F0SGVpZ2h0ID0gaGVpZ2h0IC0gc2l6ZTtcbiAgICAgIGZsb2F0V2lkdGggPSB3aWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2l6ZSA9IGhlaWdodDtcbiAgICAgIGZsb2F0SGVpZ2h0ID0gaGVpZ2h0O1xuICAgICAgZmxvYXRXaWR0aCA9IHdpZHRoIC0gc2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLiRzcXVhcmUuc3R5bGUud2lkdGggPSBgJHtzaXplfXB4YDtcbiAgICB0aGlzLiRzcXVhcmUuc3R5bGUuaGVpZ2h0ID0gYCR7c2l6ZX1weGA7XG5cbiAgICB0aGlzLiRmbG9hdC5zdHlsZS53aWR0aCA9IGAke2Zsb2F0V2lkdGh9cHhgO1xuICAgIHRoaXMuJGZsb2F0LnN0eWxlLmhlaWdodCA9IGAke2Zsb2F0SGVpZ2h0fXB4YDtcbiAgfVxufVxuIl19
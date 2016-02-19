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

var defaultTemplate = '\n  <div class="section-square flex-middle"></div>\n  <div class="section-float flex-middle"></div>\n';

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
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      _get(Object.getPrototypeOf(SquaredView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);

      var size = undefined,
          floatHeight = undefined,
          floatWidth = undefined;

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
})(_View3['default']);

exports['default'] = SquaredView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcXVhcmVkVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0FBR3pCLElBQU0sZUFBZSwwR0FHcEIsQ0FBQzs7SUFFbUIsV0FBVztZQUFYLFdBQVc7O0FBQ25CLFdBRFEsV0FBVyxDQUNsQixRQUFRLEVBQTJDO1FBQXpDLE9BQU8seURBQUcsRUFBRTtRQUFFLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRDFDLFdBQVc7O0FBRTVCLFlBQVEsR0FBRyxDQUFDLFFBQVEsR0FBRyxlQUFlLEdBQUcsUUFBUSxDQUFDOztBQUVsRCwrQkFKaUIsV0FBVyw2Q0FJdEIsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO0dBQzNDOztlQUxrQixXQUFXOztXQU90QixvQkFBRztBQUNULFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRXZELFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7QUFDbEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztLQUNsQzs7O1dBRU8sa0JBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUU7QUFDbkQsaUNBaEJpQixXQUFXLDBDQWdCYixhQUFhLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRTs7QUFFM0QsVUFBSSxJQUFJLFlBQUE7VUFBRSxXQUFXLFlBQUE7VUFBRSxVQUFVLFlBQUEsQ0FBQzs7QUFFbEMsVUFBSSxXQUFXLEtBQUssVUFBVSxFQUFFO0FBQzlCLFlBQUksR0FBRyxhQUFhLENBQUM7QUFDckIsbUJBQVcsR0FBRyxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBQ3BDLGtCQUFVLEdBQUcsYUFBYSxDQUFDO09BQzVCLE1BQU07QUFDTCxZQUFJLEdBQUcsY0FBYyxDQUFDO0FBQ3RCLG1CQUFXLEdBQUcsY0FBYyxDQUFDO0FBQzdCLGtCQUFVLEdBQUcsYUFBYSxHQUFHLElBQUksQ0FBQztPQUNuQzs7QUFFRCxVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQU0sSUFBSSxPQUFJLENBQUM7QUFDdkMsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFNLElBQUksT0FBSSxDQUFDOztBQUV4QyxVQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQU0sVUFBVSxPQUFJLENBQUM7QUFDNUMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFNLFdBQVcsT0FBSSxDQUFDO0tBQy9DOzs7U0FuQ2tCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9TcXVhcmVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cblxuY29uc3QgZGVmYXVsdFRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1zcXVhcmUgZmxleC1taWRkbGVcIj48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tZmxvYXQgZmxleC1taWRkbGVcIj48L2Rpdj5cbmA7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZWRWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0ZW1wbGF0ZSA9ICF0ZW1wbGF0ZSA/IGRlZmF1bHRUZW1wbGF0ZSA6IHRlbXBsYXRlO1xuXG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRzcXVhcmUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc2VjdGlvbi1zcXVhcmUnKTtcbiAgICB0aGlzLiRmbG9hdCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLWZsb2F0Jyk7XG5cbiAgICB0aGlzLiRzcXVhcmUuc3R5bGUuZmxvYXQgPSAnbGVmdCc7XG4gICAgdGhpcy4kZmxvYXQuc3R5bGUuZmxvYXQgPSAnbGVmdCc7XG4gIH1cblxuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgbGV0IHNpemUsIGZsb2F0SGVpZ2h0LCBmbG9hdFdpZHRoO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XG4gICAgICBzaXplID0gdmlld3BvcnRXaWR0aDtcbiAgICAgIGZsb2F0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQgLSBzaXplO1xuICAgICAgZmxvYXRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpemUgPSB2aWV3cG9ydEhlaWdodDtcbiAgICAgIGZsb2F0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQ7XG4gICAgICBmbG9hdFdpZHRoID0gdmlld3BvcnRXaWR0aCAtIHNpemU7XG4gICAgfVxuXG4gICAgdGhpcy4kc3F1YXJlLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgdGhpcy4kc3F1YXJlLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuXG4gICAgdGhpcy4kZmxvYXQuc3R5bGUud2lkdGggPSBgJHtmbG9hdFdpZHRofXB4YDtcbiAgICB0aGlzLiRmbG9hdC5zdHlsZS5oZWlnaHQgPSBgJHtmbG9hdEhlaWdodH1weGA7XG4gIH1cbn1cbiJdfQ==
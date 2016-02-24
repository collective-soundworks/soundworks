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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvU3F1YXJlZFZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUd6QixJQUFNLGVBQWUsMEdBR3BCLENBQUM7O0lBRW1CLFdBQVc7WUFBWCxXQUFXOztBQUNuQixXQURRLFdBQVcsQ0FDbEIsUUFBUSxFQUEyQztRQUF6QyxPQUFPLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQyxXQUFXOztBQUU1QixZQUFRLEdBQUcsQ0FBQyxRQUFRLEdBQUcsZUFBZSxHQUFHLFFBQVEsQ0FBQzs7QUFFbEQsK0JBSmlCLFdBQVcsNkNBSXRCLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtHQUMzQzs7ZUFMa0IsV0FBVzs7V0FPdEIsb0JBQUc7QUFDVCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOztBQUV2RCxVQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7S0FDbEM7OztXQUVPLGtCQUFDLGFBQWEsRUFBRSxjQUFjLEVBQUUsV0FBVyxFQUFFO0FBQ25ELGlDQWhCaUIsV0FBVywwQ0FnQmIsYUFBYSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUU7O0FBRTNELFVBQUksSUFBSSxZQUFBO1VBQUUsV0FBVyxZQUFBO1VBQUUsVUFBVSxZQUFBLENBQUM7O0FBRWxDLFVBQUksV0FBVyxLQUFLLFVBQVUsRUFBRTtBQUM5QixZQUFJLEdBQUcsYUFBYSxDQUFDO0FBQ3JCLG1CQUFXLEdBQUcsY0FBYyxHQUFHLElBQUksQ0FBQztBQUNwQyxrQkFBVSxHQUFHLGFBQWEsQ0FBQztPQUM1QixNQUFNO0FBQ0wsWUFBSSxHQUFHLGNBQWMsQ0FBQztBQUN0QixtQkFBVyxHQUFHLGNBQWMsQ0FBQztBQUM3QixrQkFBVSxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUM7T0FDbkM7O0FBRUQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLElBQUksT0FBSSxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxJQUFJLE9BQUksQ0FBQzs7QUFFeEMsVUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFNLFVBQVUsT0FBSSxDQUFDO0FBQzVDLFVBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxXQUFXLE9BQUksQ0FBQztLQUMvQzs7O1NBbkNrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9kaXNwbGF5L1NxdWFyZWRWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuXG5jb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBgXG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXNxdWFyZSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1mbG9hdCBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuYDtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlZFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIHRlbXBsYXRlID0gIXRlbXBsYXRlID8gZGVmYXVsdFRlbXBsYXRlIDogdGVtcGxhdGU7XG5cbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJHNxdWFyZSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgIHRoaXMuJGZsb2F0ID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tZmxvYXQnKTtcblxuICAgIHRoaXMuJHNxdWFyZS5zdHlsZS5mbG9hdCA9ICdsZWZ0JztcbiAgICB0aGlzLiRmbG9hdC5zdHlsZS5mbG9hdCA9ICdsZWZ0JztcbiAgfVxuXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbik7XG5cbiAgICBsZXQgc2l6ZSwgZmxvYXRIZWlnaHQsIGZsb2F0V2lkdGg7XG5cbiAgICBpZiAob3JpZW50YXRpb24gPT09ICdwb3J0cmFpdCcpIHtcbiAgICAgIHNpemUgPSB2aWV3cG9ydFdpZHRoO1xuICAgICAgZmxvYXRIZWlnaHQgPSB2aWV3cG9ydEhlaWdodCAtIHNpemU7XG4gICAgICBmbG9hdFdpZHRoID0gdmlld3BvcnRXaWR0aDtcbiAgICB9IGVsc2Uge1xuICAgICAgc2l6ZSA9IHZpZXdwb3J0SGVpZ2h0O1xuICAgICAgZmxvYXRIZWlnaHQgPSB2aWV3cG9ydEhlaWdodDtcbiAgICAgIGZsb2F0V2lkdGggPSB2aWV3cG9ydFdpZHRoIC0gc2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLiRzcXVhcmUuc3R5bGUud2lkdGggPSBgJHtzaXplfXB4YDtcbiAgICB0aGlzLiRzcXVhcmUuc3R5bGUuaGVpZ2h0ID0gYCR7c2l6ZX1weGA7XG5cbiAgICB0aGlzLiRmbG9hdC5zdHlsZS53aWR0aCA9IGAke2Zsb2F0V2lkdGh9cHhgO1xuICAgIHRoaXMuJGZsb2F0LnN0eWxlLmhlaWdodCA9IGAke2Zsb2F0SGVpZ2h0fXB4YDtcbiAgfVxufVxuIl19
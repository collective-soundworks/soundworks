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

var _View2 = require('../views/View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTemplate = '\n  <div class="section-square flex-middle"></div>\n  <div class="section-float flex-middle"></div>\n';

/**
 * A view that define a squared zone of maximum size on the top of the screen
 * in `portrait` orientation or on the left of the screen in 'landscape'
 * orientation.
 *
 * @param {String} template - Template of the view.
 * @param {Object} content - Object containing the variables used to populate
 *  the template. {@link module:soundworks/client.View#content}.
 * @param {Object} events - Listeners to install in the view
 *  {@link module:soundworks/client.View#events}.
 * @param {Object} options - Options of the view.
 *  {@link module:soundworks/client.View#options}.
 *
 * @memberof module:soundworks/client
 */

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

  /** @private */


  (0, _createClass3.default)(SquaredView, [{
    key: 'onRender',
    value: function onRender() {
      this.$square = this.$el.querySelector('.section-square');
      this.$float = this.$el.querySelector('.section-float');

      this.$square.style.float = 'left';
      this.$float.style.float = 'left';
    }

    /** @private */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNxdWFyZWRWaWV3LmpzIl0sIm5hbWVzIjpbImRlZmF1bHRUZW1wbGF0ZSIsIlNxdWFyZWRWaWV3IiwidGVtcGxhdGUiLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsIiRzcXVhcmUiLCIkZWwiLCJxdWVyeVNlbGVjdG9yIiwiJGZsb2F0Iiwic3R5bGUiLCJmbG9hdCIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsIm9yaWVudGF0aW9uIiwic2l6ZSIsImZsb2F0SGVpZ2h0IiwiZmxvYXRXaWR0aCIsIndpZHRoIiwiaGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEseUhBQU47O0FBS0E7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlTUMsVzs7O0FBQ0osdUJBQVlDLFFBQVosRUFBK0Q7QUFBQSxRQUF6Q0MsT0FBeUMsdUVBQS9CLEVBQStCO0FBQUEsUUFBM0JDLE1BQTJCLHVFQUFsQixFQUFrQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUM3REgsZUFBVyxDQUFDQSxRQUFELEdBQVlGLGVBQVosR0FBOEJFLFFBQXpDOztBQUQ2RCwySUFHdkRBLFFBSHVELEVBRzdDQyxPQUg2QyxFQUdwQ0MsTUFIb0MsRUFHNUJDLE9BSDRCO0FBSTlEOztBQUVEOzs7OzsrQkFDVztBQUNULFdBQUtDLE9BQUwsR0FBZSxLQUFLQyxHQUFMLENBQVNDLGFBQVQsQ0FBdUIsaUJBQXZCLENBQWY7QUFDQSxXQUFLQyxNQUFMLEdBQWMsS0FBS0YsR0FBTCxDQUFTQyxhQUFULENBQXVCLGdCQUF2QixDQUFkOztBQUVBLFdBQUtGLE9BQUwsQ0FBYUksS0FBYixDQUFtQkMsS0FBbkIsR0FBMkIsTUFBM0I7QUFDQSxXQUFLRixNQUFMLENBQVlDLEtBQVosQ0FBa0JDLEtBQWxCLEdBQTBCLE1BQTFCO0FBQ0Q7O0FBRUQ7Ozs7NkJBQ1NDLGEsRUFBZUMsYyxFQUFnQkMsVyxFQUFhO0FBQ25ELCtJQUFlRixhQUFmLEVBQThCQyxjQUE5QixFQUE4Q0MsV0FBOUM7O0FBRUEsVUFBSUMsYUFBSjtBQUFBLFVBQVVDLG9CQUFWO0FBQUEsVUFBdUJDLG1CQUF2Qjs7QUFFQSxVQUFJSCxnQkFBZ0IsVUFBcEIsRUFBZ0M7QUFDOUJDLGVBQU9ILGFBQVA7QUFDQUksc0JBQWNILGlCQUFpQkUsSUFBL0I7QUFDQUUscUJBQWFMLGFBQWI7QUFDRCxPQUpELE1BSU87QUFDTEcsZUFBT0YsY0FBUDtBQUNBRyxzQkFBY0gsY0FBZDtBQUNBSSxxQkFBYUwsZ0JBQWdCRyxJQUE3QjtBQUNEOztBQUVELFdBQUtULE9BQUwsQ0FBYUksS0FBYixDQUFtQlEsS0FBbkIsR0FBOEJILElBQTlCO0FBQ0EsV0FBS1QsT0FBTCxDQUFhSSxLQUFiLENBQW1CUyxNQUFuQixHQUErQkosSUFBL0I7O0FBRUEsV0FBS04sTUFBTCxDQUFZQyxLQUFaLENBQWtCUSxLQUFsQixHQUE2QkQsVUFBN0I7QUFDQSxXQUFLUixNQUFMLENBQVlDLEtBQVosQ0FBa0JTLE1BQWxCLEdBQThCSCxXQUE5QjtBQUNEOzs7OztrQkFHWWYsVyIsImZpbGUiOiJTcXVhcmVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4uL3ZpZXdzL1ZpZXcnO1xuXG5jb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBgXG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXNxdWFyZSBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1mbG9hdCBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuYDtcblxuLyoqXG4gKiBBIHZpZXcgdGhhdCBkZWZpbmUgYSBzcXVhcmVkIHpvbmUgb2YgbWF4aW11bSBzaXplIG9uIHRoZSB0b3Agb2YgdGhlIHNjcmVlblxuICogaW4gYHBvcnRyYWl0YCBvcmllbnRhdGlvbiBvciBvbiB0aGUgbGVmdCBvZiB0aGUgc2NyZWVuIGluICdsYW5kc2NhcGUnXG4gKiBvcmllbnRhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGVtcGxhdGUgLSBUZW1wbGF0ZSBvZiB0aGUgdmlldy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhcmlhYmxlcyB1c2VkIHRvIHBvcHVsYXRlXG4gKiAgdGhlIHRlbXBsYXRlLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjY29udGVudH0uXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gTGlzdGVuZXJzIHRvIGluc3RhbGwgaW4gdGhlIHZpZXdcbiAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjZXZlbnRzfS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgdmlldy5cbiAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjb3B0aW9uc30uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBTcXVhcmVkVmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGVtcGxhdGUgPSAhdGVtcGxhdGUgPyBkZWZhdWx0VGVtcGxhdGUgOiB0ZW1wbGF0ZTtcblxuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJHNxdWFyZSA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zZWN0aW9uLXNxdWFyZScpO1xuICAgIHRoaXMuJGZsb2F0ID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnNlY3Rpb24tZmxvYXQnKTtcblxuICAgIHRoaXMuJHNxdWFyZS5zdHlsZS5mbG9hdCA9ICdsZWZ0JztcbiAgICB0aGlzLiRmbG9hdC5zdHlsZS5mbG9hdCA9ICdsZWZ0JztcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgbGV0IHNpemUsIGZsb2F0SGVpZ2h0LCBmbG9hdFdpZHRoO1xuXG4gICAgaWYgKG9yaWVudGF0aW9uID09PSAncG9ydHJhaXQnKSB7XG4gICAgICBzaXplID0gdmlld3BvcnRXaWR0aDtcbiAgICAgIGZsb2F0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQgLSBzaXplO1xuICAgICAgZmxvYXRXaWR0aCA9IHZpZXdwb3J0V2lkdGg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNpemUgPSB2aWV3cG9ydEhlaWdodDtcbiAgICAgIGZsb2F0SGVpZ2h0ID0gdmlld3BvcnRIZWlnaHQ7XG4gICAgICBmbG9hdFdpZHRoID0gdmlld3BvcnRXaWR0aCAtIHNpemU7XG4gICAgfVxuXG4gICAgdGhpcy4kc3F1YXJlLnN0eWxlLndpZHRoID0gYCR7c2l6ZX1weGA7XG4gICAgdGhpcy4kc3F1YXJlLnN0eWxlLmhlaWdodCA9IGAke3NpemV9cHhgO1xuXG4gICAgdGhpcy4kZmxvYXQuc3R5bGUud2lkdGggPSBgJHtmbG9hdFdpZHRofXB4YDtcbiAgICB0aGlzLiRmbG9hdC5zdHlsZS5oZWlnaHQgPSBgJHtmbG9hdEhlaWdodH1weGA7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3F1YXJlZFZpZXc7XG4iXX0=
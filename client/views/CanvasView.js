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

var _SegmentedView2 = require('./SegmentedView');

var _SegmentedView3 = _interopRequireDefault(_SegmentedView2);

var _RenderingGroup = require('./RenderingGroup');

var _RenderingGroup2 = _interopRequireDefault(_RenderingGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultCanvasTemplate = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"><%= top %></div>\n    <div class="section-center flex-center"><%= center %></div>\n    <div class="section-bottom flex-middle"><%= bottom %></div>\n  </div>\n';

/**
 * A `SegmentedView` with a `canvas` element in the background. This view should mainly be used in preformances.
 */

var CanvasView = function (_SegmentedView) {
  (0, _inherits3.default)(CanvasView, _SegmentedView);

  function CanvasView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, CanvasView);

    template = template || defaultCanvasTemplate;
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CanvasView).call(this, template, content, events, options));
  }

  (0, _createClass3.default)(CanvasView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(CanvasView.prototype), 'onRender', this).call(this);

      /**
       * The canvas element to draw into
       * @type {Element}
       */
      this.$canvas = this.$el.querySelector('canvas');

      /**
       * The 2d context of the canvas.
       * @type {CanvasRenderingContext2D}
       */
      this.ctx = this.$canvas.getContext('2d');

      /**
       * The default rendering group.
       * @type {RenderingGroup}
       */
      this._renderingGroup = new _RenderingGroup2.default(this.ctx);
    }
  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(CanvasView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
      this._renderingGroup.onResize(viewportWidth, viewportHeight);
    }

    /**
     * Overrides the `preRender` interface method of the default `RenderingGroup` of the view. cf. @link `RenderingGroup~prerender`
     * @param {Function} callback - The function to use as a pre-render method.
     */

  }, {
    key: 'setPreRender',
    value: function setPreRender(callback) {
      this._renderingGroup.preRender = callback.bind(this._renderingGroup);
    }

    /**
     * Add a renderer to the `RenderingGroup`. The renderer is automaticcaly activated when added to the group.
     * @param {Renderer} renderer - The renderer to add.
     */

  }, {
    key: 'addRenderer',
    value: function addRenderer(renderer) {
      this._renderingGroup.add(renderer);
    }

    /**
     * Add a renderer to the `RenderingGroup`. The renderer is automaticcaly disactivated when removed from the group.
     * @param {Renderer} renderer - The renderer to remove.
     */

  }, {
    key: 'removeRenderer',
    value: function removeRenderer(renderer) {
      this._renderingGroup.remove(renderer);
    }
  }]);
  return CanvasView;
}(_SegmentedView3.default);

exports.default = CanvasView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTSx1U0FBTjs7Ozs7O0lBWXFCOzs7QUFDbkIsV0FEbUIsVUFDbkIsQ0FBWSxRQUFaLEVBQXNCLE9BQXRCLEVBQStCLE1BQS9CLEVBQXVDLE9BQXZDLEVBQWdEO3dDQUQ3QixZQUM2Qjs7QUFDOUMsZUFBVyxZQUFZLHFCQUFaLENBRG1DO3dGQUQ3Qix1QkFHWCxVQUFVLFNBQVMsUUFBUSxVQUZhO0dBQWhEOzs2QkFEbUI7OytCQU1SO0FBQ1QsdURBUGlCLG1EQU9qQjs7Ozs7O0FBRFMsVUFPVCxDQUFLLE9BQUwsR0FBZSxLQUFLLEdBQUwsQ0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7Ozs7OztBQVBTLFVBYVQsQ0FBSyxHQUFMLEdBQVcsS0FBSyxPQUFMLENBQWEsVUFBYixDQUF3QixJQUF4QixDQUFYOzs7Ozs7QUFiUyxVQW1CVCxDQUFLLGVBQUwsR0FBdUIsNkJBQW1CLEtBQUssR0FBTCxDQUExQyxDQW5CUzs7Ozs2QkFzQkYsZUFBZSxnQkFBZ0IsYUFBYTtBQUNuRCx1REE3QmlCLG9EQTZCRixlQUFlLGdCQUFnQixZQUE5QyxDQURtRDtBQUVuRCxXQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBOEIsYUFBOUIsRUFBNkMsY0FBN0MsRUFGbUQ7Ozs7Ozs7Ozs7aUNBU3hDLFVBQVU7QUFDckIsV0FBSyxlQUFMLENBQXFCLFNBQXJCLEdBQWlDLFNBQVMsSUFBVCxDQUFjLEtBQUssZUFBTCxDQUEvQyxDQURxQjs7Ozs7Ozs7OztnQ0FRWCxVQUFVO0FBQ3BCLFdBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5QixRQUF6QixFQURvQjs7Ozs7Ozs7OzttQ0FRUCxVQUFVO0FBQ3ZCLFdBQUssZUFBTCxDQUFxQixNQUFyQixDQUE0QixRQUE1QixFQUR1Qjs7O1NBckROIiwiZmlsZSI6IkNhbnZhc1ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vUmVuZGVyaW5nR3JvdXAnO1xuXG5cbmNvbnN0IGRlZmF1bHRDYW52YXNUZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj48JT0gdG9wICU+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+PCU9IGNlbnRlciAlPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwlPSBib3R0b20gJT48L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG4vKipcbiAqIEEgYFNlZ21lbnRlZFZpZXdgIHdpdGggYSBgY2FudmFzYCBlbGVtZW50IGluIHRoZSBiYWNrZ3JvdW5kLiBUaGlzIHZpZXcgc2hvdWxkIG1haW5seSBiZSB1c2VkIGluIHByZWZvcm1hbmNlcy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzVmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZSB8fCBkZWZhdWx0Q2FudmFzVGVtcGxhdGU7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICBzdXBlci5vblJlbmRlcigpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGNhbnZhcyBlbGVtZW50IHRvIGRyYXcgaW50b1xuICAgICAqIEB0eXBlIHtFbGVtZW50fVxuICAgICAqL1xuICAgIHRoaXMuJGNhbnZhcyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIDJkIGNvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICAgKiBAdHlwZSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfVxuICAgICAqL1xuICAgIHRoaXMuY3R4ID0gdGhpcy4kY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgZGVmYXVsdCByZW5kZXJpbmcgZ3JvdXAuXG4gICAgICogQHR5cGUge1JlbmRlcmluZ0dyb3VwfVxuICAgICAqL1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwID0gbmV3IFJlbmRlcmluZ0dyb3VwKHRoaXMuY3R4KTtcbiAgfVxuXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbik7XG4gICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAub25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgYHByZVJlbmRlcmAgaW50ZXJmYWNlIG1ldGhvZCBvZiB0aGUgZGVmYXVsdCBgUmVuZGVyaW5nR3JvdXBgIG9mIHRoZSB2aWV3LiBjZi4gQGxpbmsgYFJlbmRlcmluZ0dyb3VwfnByZXJlbmRlcmBcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdG8gdXNlIGFzIGEgcHJlLXJlbmRlciBtZXRob2QuXG4gICAqL1xuICBzZXRQcmVSZW5kZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5wcmVSZW5kZXIgPSBjYWxsYmFjay5iaW5kKHRoaXMuX3JlbmRlcmluZ0dyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJlciB0byB0aGUgYFJlbmRlcmluZ0dyb3VwYC4gVGhlIHJlbmRlcmVyIGlzIGF1dG9tYXRpY2NhbHkgYWN0aXZhdGVkIHdoZW4gYWRkZWQgdG8gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byBhZGQuXG4gICAqL1xuICBhZGRSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLmFkZChyZW5kZXJlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVuZGVyZXIgdG8gdGhlIGBSZW5kZXJpbmdHcm91cGAuIFRoZSByZW5kZXJlciBpcyBhdXRvbWF0aWNjYWx5IGRpc2FjdGl2YXRlZCB3aGVuIHJlbW92ZWQgZnJvbSB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVJlbmRlcmVyKHJlbmRlcmVyKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAucmVtb3ZlKHJlbmRlcmVyKTtcbiAgfVxufVxuIl19
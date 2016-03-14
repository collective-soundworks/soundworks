'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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


    /**
     * Temporary stack the renderers when the view is not shown.
     * @type {Set}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CanvasView).call(this, template, content, events, options));

    _this._rendererStack = new _set2.default();
    return _this;
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
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(CanvasView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
      this._renderingGroup.onResize(viewportWidth, viewportHeight);

      // add stacked renderers to the rendering group
      this._rendererStack.forEach(function (renderer) {
        return _this2._renderingGroup.add(renderer);
      });
      this._rendererStack.clear();
    }

    /**
     * Overrides the `preRender` interface method of the default `RenderingGroup`
     * of the view. cf. @link `RenderingGroup~prerender`
     * @param {Function} callback - The function to use as a pre-render method.
     */

  }, {
    key: 'setPreRender',
    value: function setPreRender(callback) {
      this._renderingGroup.preRender = callback.bind(this._renderingGroup);
    }

    /**
     * Add a renderer to the `RenderingGroup`. The renderer is automaticcaly
     * activated when added to the group.
     * @param {Renderer} renderer - The renderer to add.
     */

  }, {
    key: 'addRenderer',
    value: function addRenderer(renderer) {
      if (this.isVisible) this._renderingGroup.add(renderer);else this._rendererStack.add(renderer);
    }

    /**
     * Add a renderer to the `RenderingGroup`. The renderer is automaticcaly
     * disactivated when removed from the group.
     * @param {Renderer} renderer - The renderer to remove.
     */

  }, {
    key: 'removeRenderer',
    value: function removeRenderer(renderer) {
      if (this.isVisible) this._renderingGroup.remove(renderer);else this._rendererStack.delete(renderer);
    }
  }]);
  return CanvasView;
}(_SegmentedView3.default);

exports.default = CanvasView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU0sdVNBQU47Ozs7OztJQVlxQjs7O0FBQ25CLFdBRG1CLFVBQ25CLENBQVksUUFBWixFQUFzQixPQUF0QixFQUErQixNQUEvQixFQUF1QyxPQUF2QyxFQUFnRDt3Q0FEN0IsWUFDNkI7O0FBQzlDLGVBQVcsWUFBWSxxQkFBWixDQURtQzs7Ozs7Ozs7NkZBRDdCLHVCQUdYLFVBQVUsU0FBUyxRQUFRLFVBRmE7O0FBUTlDLFVBQUssY0FBTCxHQUFzQixtQkFBdEIsQ0FSOEM7O0dBQWhEOzs2QkFEbUI7OytCQVlSO0FBQ1QsdURBYmlCLG1EQWFqQjs7Ozs7O0FBRFMsVUFPVCxDQUFLLE9BQUwsR0FBZSxLQUFLLEdBQUwsQ0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7Ozs7OztBQVBTLFVBYVQsQ0FBSyxHQUFMLEdBQVcsS0FBSyxPQUFMLENBQWEsVUFBYixDQUF3QixJQUF4QixDQUFYOzs7Ozs7QUFiUyxVQW1CVCxDQUFLLGVBQUwsR0FBdUIsNkJBQW1CLEtBQUssR0FBTCxDQUExQyxDQW5CUzs7Ozs2QkFzQkYsZUFBZSxnQkFBZ0IsYUFBYTs7O0FBQ25ELHVEQW5DaUIsb0RBbUNGLGVBQWUsZ0JBQWdCLFlBQTlDLENBRG1EO0FBRW5ELFdBQUssZUFBTCxDQUFxQixRQUFyQixDQUE4QixhQUE5QixFQUE2QyxjQUE3Qzs7O0FBRm1ELFVBS25ELENBQUssY0FBTCxDQUFvQixPQUFwQixDQUE0QixVQUFDLFFBQUQ7ZUFBYyxPQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsUUFBekI7T0FBZCxDQUE1QixDQUxtRDtBQU1uRCxXQUFLLGNBQUwsQ0FBb0IsS0FBcEIsR0FObUQ7Ozs7Ozs7Ozs7O2lDQWN4QyxVQUFVO0FBQ3JCLFdBQUssZUFBTCxDQUFxQixTQUFyQixHQUFpQyxTQUFTLElBQVQsQ0FBYyxLQUFLLGVBQUwsQ0FBL0MsQ0FEcUI7Ozs7Ozs7Ozs7O2dDQVNYLFVBQVU7QUFDcEIsVUFBSSxLQUFLLFNBQUwsRUFDRixLQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsUUFBekIsRUFERixLQUdFLEtBQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixRQUF4QixFQUhGOzs7Ozs7Ozs7OzttQ0FXYSxVQUFVO0FBQ3ZCLFVBQUksS0FBSyxTQUFMLEVBQ0YsS0FBSyxlQUFMLENBQXFCLE1BQXJCLENBQTRCLFFBQTVCLEVBREYsS0FHRSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsUUFBM0IsRUFIRjs7O1NBdEVpQiIsImZpbGUiOiJDYW52YXNWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBSZW5kZXJpbmdHcm91cCBmcm9tICcuL1JlbmRlcmluZ0dyb3VwJztcblxuXG5jb25zdCBkZWZhdWx0Q2FudmFzVGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PCU9IHRvcCAlPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPjwlPSBjZW50ZXIgJT48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj48JT0gYm90dG9tICU+PC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuLyoqXG4gKiBBIGBTZWdtZW50ZWRWaWV3YCB3aXRoIGEgYGNhbnZhc2AgZWxlbWVudCBpbiB0aGUgYmFja2dyb3VuZC4gVGhpcyB2aWV3IHNob3VsZCBtYWlubHkgYmUgdXNlZCBpbiBwcmVmb3JtYW5jZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc1ZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgfHwgZGVmYXVsdENhbnZhc1RlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGVtcG9yYXJ5IHN0YWNrIHRoZSByZW5kZXJlcnMgd2hlbiB0aGUgdmlldyBpcyBub3Qgc2hvd24uXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKi9cbiAgICB0aGlzLl9yZW5kZXJlclN0YWNrID0gbmV3IFNldCgpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYW52YXMgZWxlbWVudCB0byBkcmF3IGludG9cbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRjYW52YXMgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSAyZCBjb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAgICogQHR5cGUge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH1cbiAgICAgKi9cbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgcmVuZGVyaW5nIGdyb3VwLlxuICAgICAqIEB0eXBlIHtSZW5kZXJpbmdHcm91cH1cbiAgICAgKi9cbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cCA9IG5ldyBSZW5kZXJpbmdHcm91cCh0aGlzLmN0eCk7XG4gIH1cblxuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KTtcblxuICAgIC8vIGFkZCBzdGFja2VkIHJlbmRlcmVycyB0byB0aGUgcmVuZGVyaW5nIGdyb3VwXG4gICAgdGhpcy5fcmVuZGVyZXJTdGFjay5mb3JFYWNoKChyZW5kZXJlcikgPT4gdGhpcy5fcmVuZGVyaW5nR3JvdXAuYWRkKHJlbmRlcmVyKSk7XG4gICAgdGhpcy5fcmVuZGVyZXJTdGFjay5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgYHByZVJlbmRlcmAgaW50ZXJmYWNlIG1ldGhvZCBvZiB0aGUgZGVmYXVsdCBgUmVuZGVyaW5nR3JvdXBgXG4gICAqIG9mIHRoZSB2aWV3LiBjZi4gQGxpbmsgYFJlbmRlcmluZ0dyb3VwfnByZXJlbmRlcmBcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdG8gdXNlIGFzIGEgcHJlLXJlbmRlciBtZXRob2QuXG4gICAqL1xuICBzZXRQcmVSZW5kZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5wcmVSZW5kZXIgPSBjYWxsYmFjay5iaW5kKHRoaXMuX3JlbmRlcmluZ0dyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJlciB0byB0aGUgYFJlbmRlcmluZ0dyb3VwYC4gVGhlIHJlbmRlcmVyIGlzIGF1dG9tYXRpY2NhbHlcbiAgICogYWN0aXZhdGVkIHdoZW4gYWRkZWQgdG8gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byBhZGQuXG4gICAqL1xuICBhZGRSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLmFkZChyZW5kZXJlcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyZXJTdGFjay5hZGQocmVuZGVyZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmVyIHRvIHRoZSBgUmVuZGVyaW5nR3JvdXBgLiBUaGUgcmVuZGVyZXIgaXMgYXV0b21hdGljY2FseVxuICAgKiBkaXNhY3RpdmF0ZWQgd2hlbiByZW1vdmVkIGZyb20gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnJlbW92ZShyZW5kZXJlcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyZXJTdGFjay5kZWxldGUocmVuZGVyZXIpO1xuICB9XG59XG4iXX0=
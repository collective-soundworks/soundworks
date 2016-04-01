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
 * View designed for experiences where 2d graphical rendering is needed.
 * The view is basically a `SegmentedView` with a `canvas` element in
 * the background.
 *
 * @memberof module:soundworks/client
 * @extends {module:soundworks/client.SegmentedView}
 * @see {@link module:soundworks/client.View}
 * @see {@link module:soundworks/client.Renderer}
 */

var CanvasView = function (_SegmentedView) {
  (0, _inherits3.default)(CanvasView, _SegmentedView);

  /**
   * _<span class="warning">__WARNING__</span> Views should preferably by
   * created using the [`Experience#createView`]{@link module:soundworks/client.Experience#createView}
   * method._
   *
   * @param {String} template - Template of the view.
   * @param {Object} content - Object containing the variables used to populate
   *  the template. {@link module:soundworks/client.View#content}.
   * @param {Object} events - Listeners to install in the view
   *  {@link module:soundworks/client.View#events}.
   * @param {Object} options - Options of the view.
   *  {@link module:soundworks/client.View#options}.
   */

  function CanvasView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, CanvasView);

    template = template || defaultCanvasTemplate;


    /**
     * Temporary stack the renderers when the view is not visible.
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
       * The canvas element to draw into.
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
       * @private
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
     * @callback module:soundworks/client.CanvasView~preRenderer
     * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
     * @param {Number} dt - Delta time in seconds since the last rendering cycle.
     */
    /**
     * Defines a function to be executed before all
     * [`Renderer#render`]{@link module:soundworks/client.Renderer#render}
     * at each cycle.
     * @param {module:soundworks/client.CanvasView~preRenderer} callback - Function
     *  to execute before aech rendering cycle.
     */

  }, {
    key: 'setPreRender',
    value: function setPreRender(callback) {
      this._renderingGroup.preRender = callback.bind(this._renderingGroup);
    }

    /**
     * Add a renderer to the `RenderingGroup`. The renderer is automatically
     * activated when added to the group.
     * @param {module:soundworks/client.Renderer} renderer - Renderer to add.
     */

  }, {
    key: 'addRenderer',
    value: function addRenderer(renderer) {
      if (this.isVisible) this._renderingGroup.add(renderer);else this._rendererStack.add(renderer);
    }

    /**
     * Add a renderer to the `RenderingGroup`. The renderer is automatically
     * disactivated when removed from the group.
     * @param {module:soundworks/client.Renderer} renderer - Renderer to remove.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU0sdVNBQU47Ozs7Ozs7Ozs7Ozs7SUFtQk07Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY0osV0FkSSxVQWNKLENBQVksUUFBWixFQUFzQixPQUF0QixFQUErQixNQUEvQixFQUF1QyxPQUF2QyxFQUFnRDt3Q0FkNUMsWUFjNEM7O0FBQzlDLGVBQVcsWUFBWSxxQkFBWixDQURtQzs7Ozs7Ozs7NkZBZDVDLHVCQWdCSSxVQUFVLFNBQVMsUUFBUSxVQUZhOztBQVE5QyxVQUFLLGNBQUwsR0FBc0IsbUJBQXRCLENBUjhDOztHQUFoRDs7NkJBZEk7OytCQXlCTztBQUNULHVEQTFCRSxtREEwQkY7Ozs7OztBQURTLFVBT1QsQ0FBSyxPQUFMLEdBQWUsS0FBSyxHQUFMLENBQVMsYUFBVCxDQUF1QixRQUF2QixDQUFmOzs7Ozs7QUFQUyxVQWFULENBQUssR0FBTCxHQUFXLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBd0IsSUFBeEIsQ0FBWDs7Ozs7OztBQWJTLFVBb0JULENBQUssZUFBTCxHQUF1Qiw2QkFBbUIsS0FBSyxHQUFMLENBQTFDLENBcEJTOzs7OzZCQXVCRixlQUFlLGdCQUFnQixhQUFhOzs7QUFDbkQsdURBakRFLG9EQWlEYSxlQUFlLGdCQUFnQixZQUE5QyxDQURtRDtBQUVuRCxXQUFLLGVBQUwsQ0FBcUIsUUFBckIsQ0FBOEIsYUFBOUIsRUFBNkMsY0FBN0M7OztBQUZtRCxVQUtuRCxDQUFLLGNBQUwsQ0FBb0IsT0FBcEIsQ0FBNEIsVUFBQyxRQUFEO2VBQWMsT0FBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLFFBQXpCO09BQWQsQ0FBNUIsQ0FMbUQ7QUFNbkQsV0FBSyxjQUFMLENBQW9CLEtBQXBCLEdBTm1EOzs7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBcUJ4QyxVQUFVO0FBQ3JCLFdBQUssZUFBTCxDQUFxQixTQUFyQixHQUFpQyxTQUFTLElBQVQsQ0FBYyxLQUFLLGVBQUwsQ0FBL0MsQ0FEcUI7Ozs7Ozs7Ozs7O2dDQVNYLFVBQVU7QUFDcEIsVUFBSSxLQUFLLFNBQUwsRUFDRixLQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsUUFBekIsRUFERixLQUdFLEtBQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixRQUF4QixFQUhGOzs7Ozs7Ozs7OzttQ0FXYSxVQUFVO0FBQ3ZCLFVBQUksS0FBSyxTQUFMLEVBQ0YsS0FBSyxlQUFMLENBQXFCLE1BQXJCLENBQTRCLFFBQTVCLEVBREYsS0FHRSxLQUFLLGNBQUwsQ0FBb0IsTUFBcEIsQ0FBMkIsUUFBM0IsRUFIRjs7O1NBM0ZFOzs7a0JBa0dTIiwiZmlsZSI6IkNhbnZhc1ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vUmVuZGVyaW5nR3JvdXAnO1xuXG5cbmNvbnN0IGRlZmF1bHRDYW52YXNUZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj48JT0gdG9wICU+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+PCU9IGNlbnRlciAlPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwlPSBib3R0b20gJT48L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG4vKipcbiAqIFZpZXcgZGVzaWduZWQgZm9yIGV4cGVyaWVuY2VzIHdoZXJlIDJkIGdyYXBoaWNhbCByZW5kZXJpbmcgaXMgbmVlZGVkLlxuICogVGhlIHZpZXcgaXMgYmFzaWNhbGx5IGEgYFNlZ21lbnRlZFZpZXdgIHdpdGggYSBgY2FudmFzYCBlbGVtZW50IGluXG4gKiB0aGUgYmFja2dyb3VuZC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNlZ21lbnRlZFZpZXd9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld31cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn1cbiAqL1xuY2xhc3MgQ2FudmFzVmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICAvKipcbiAgICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBWaWV3cyBzaG91bGQgcHJlZmVyYWJseSBieVxuICAgKiBjcmVhdGVkIHVzaW5nIHRoZSBbYEV4cGVyaWVuY2UjY3JlYXRlVmlld2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5FeHBlcmllbmNlI2NyZWF0ZVZpZXd9XG4gICAqIG1ldGhvZC5fXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZSAtIFRlbXBsYXRlIG9mIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIE9iamVjdCBjb250YWluaW5nIHRoZSB2YXJpYWJsZXMgdXNlZCB0byBwb3B1bGF0ZVxuICAgKiAgdGhlIHRlbXBsYXRlLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjY29udGVudH0uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBMaXN0ZW5lcnMgdG8gaW5zdGFsbCBpbiB0aGUgdmlld1xuICAgKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2V2ZW50c30uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgdmlldy5cbiAgICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvcHRpb25zfS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8IGRlZmF1bHRDYW52YXNUZW1wbGF0ZTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFRlbXBvcmFyeSBzdGFjayB0aGUgcmVuZGVyZXJzIHdoZW4gdGhlIHZpZXcgaXMgbm90IHZpc2libGUuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKi9cbiAgICB0aGlzLl9yZW5kZXJlclN0YWNrID0gbmV3IFNldCgpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYW52YXMgZWxlbWVudCB0byBkcmF3IGludG8uXG4gICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICovXG4gICAgdGhpcy4kY2FudmFzID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgMmQgY29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XG4gICAgICovXG4gICAgdGhpcy5jdHggPSB0aGlzLiRjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBkZWZhdWx0IHJlbmRlcmluZyBncm91cC5cbiAgICAgKiBAdHlwZSB7UmVuZGVyaW5nR3JvdXB9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cCA9IG5ldyBSZW5kZXJpbmdHcm91cCh0aGlzLmN0eCk7XG4gIH1cblxuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KTtcblxuICAgIC8vIGFkZCBzdGFja2VkIHJlbmRlcmVycyB0byB0aGUgcmVuZGVyaW5nIGdyb3VwXG4gICAgdGhpcy5fcmVuZGVyZXJTdGFjay5mb3JFYWNoKChyZW5kZXJlcikgPT4gdGhpcy5fcmVuZGVyaW5nR3JvdXAuYWRkKHJlbmRlcmVyKSk7XG4gICAgdGhpcy5fcmVuZGVyZXJTdGFjay5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld35wcmVSZW5kZXJlclxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gQ29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBEZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgdGhlIGxhc3QgcmVuZGVyaW5nIGN5Y2xlLlxuICAgKi9cbiAgLyoqXG4gICAqIERlZmluZXMgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBiZWZvcmUgYWxsXG4gICAqIFtgUmVuZGVyZXIjcmVuZGVyYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyI3JlbmRlcn1cbiAgICogYXQgZWFjaCBjeWNsZS5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld35wcmVSZW5kZXJlcn0gY2FsbGJhY2sgLSBGdW5jdGlvblxuICAgKiAgdG8gZXhlY3V0ZSBiZWZvcmUgYWVjaCByZW5kZXJpbmcgY3ljbGUuXG4gICAqL1xuICBzZXRQcmVSZW5kZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5wcmVSZW5kZXIgPSBjYWxsYmFjay5iaW5kKHRoaXMuX3JlbmRlcmluZ0dyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJlciB0byB0aGUgYFJlbmRlcmluZ0dyb3VwYC4gVGhlIHJlbmRlcmVyIGlzIGF1dG9tYXRpY2FsbHlcbiAgICogYWN0aXZhdGVkIHdoZW4gYWRkZWQgdG8gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn0gcmVuZGVyZXIgLSBSZW5kZXJlciB0byBhZGQuXG4gICAqL1xuICBhZGRSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLmFkZChyZW5kZXJlcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyZXJTdGFjay5hZGQocmVuZGVyZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmVyIHRvIHRoZSBgUmVuZGVyaW5nR3JvdXBgLiBUaGUgcmVuZGVyZXIgaXMgYXV0b21hdGljYWxseVxuICAgKiBkaXNhY3RpdmF0ZWQgd2hlbiByZW1vdmVkIGZyb20gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn0gcmVuZGVyZXIgLSBSZW5kZXJlciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnJlbW92ZShyZW5kZXJlcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyZXJTdGFjay5kZWxldGUocmVuZGVyZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbnZhc1ZpZXc7XG4iXX0=
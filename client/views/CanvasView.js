'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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
    options = (0, _assign2.default)({
      preservePixelRatio: false
    }, options);

    /**
     * Temporary stack the renderers when the view is not visible.
     * @type {Set}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(CanvasView).call(this, template, content, events, options));

    _this._rendererStack = new _set2.default();

    /**
     * Flag to track the first `render` call
     * @type {Boolean}
     */
    _this._hasRenderedOnce = false;
    return _this;
  }

  (0, _createClass3.default)(CanvasView, [{
    key: 'onRender',
    value: function onRender() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(CanvasView.prototype), 'onRender', this).call(this);

      if (!this._hasRenderedOnce) {
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

        // prevent creating a new rendering group each time the view is rendered
        this._hasRenderedOnce = true;
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNLHVTQUFOOzs7Ozs7Ozs7Ozs7O0lBbUJNLFU7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY0osc0JBQVksUUFBWixFQUFzQixPQUF0QixFQUErQixNQUEvQixFQUF1QyxPQUF2QyxFQUFnRDtBQUFBOztBQUM5QyxlQUFXLFlBQVkscUJBQXZCO0FBQ0EsY0FBVSxzQkFBYztBQUN0QiwwQkFBb0I7QUFERSxLQUFkLEVBRVAsT0FGTyxDQUFWOzs7Ozs7O0FBRjhDLG9IQU14QyxRQU53QyxFQU05QixPQU44QixFQU1yQixNQU5xQixFQU1iLE9BTmE7O0FBWTlDLFVBQUssY0FBTCxHQUFzQixtQkFBdEI7Ozs7OztBQU1BLFVBQUssZ0JBQUwsR0FBd0IsS0FBeEI7QUFsQjhDO0FBbUIvQzs7OzsrQkFFVTtBQUNUOztBQUVBLFVBQUksQ0FBQyxLQUFLLGdCQUFWLEVBQTRCOzs7OztBQUsxQixhQUFLLE9BQUwsR0FBZSxLQUFLLEdBQUwsQ0FBUyxhQUFULENBQXVCLFFBQXZCLENBQWY7Ozs7OztBQU1BLGFBQUssR0FBTCxHQUFXLEtBQUssT0FBTCxDQUFhLFVBQWIsQ0FBd0IsSUFBeEIsQ0FBWDs7Ozs7OztBQU9BLGFBQUssZUFBTCxHQUF1Qiw2QkFBbUIsS0FBSyxHQUF4QixDQUF2Qjs7O0FBR0EsYUFBSyxnQkFBTCxHQUF3QixJQUF4QjtBQUNEO0FBQ0Y7Ozs2QkFFUSxhLEVBQWUsYyxFQUFnQixXLEVBQWE7QUFBQTs7QUFDbkQsMkdBQWUsYUFBZixFQUE4QixjQUE5QixFQUE4QyxXQUE5QztBQUNBLFdBQUssZUFBTCxDQUFxQixRQUFyQixDQUE4QixhQUE5QixFQUE2QyxjQUE3Qzs7O0FBR0EsV0FBSyxjQUFMLENBQW9CLE9BQXBCLENBQTRCLFVBQUMsUUFBRDtBQUFBLGVBQWMsT0FBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLFFBQXpCLENBQWQ7QUFBQSxPQUE1QjtBQUNBLFdBQUssY0FBTCxDQUFvQixLQUFwQjtBQUNEOzs7Ozs7Ozs7Ozs7Ozs7OztpQ0FjWSxRLEVBQVU7QUFDckIsV0FBSyxlQUFMLENBQXFCLFNBQXJCLEdBQWlDLFNBQVMsSUFBVCxDQUFjLEtBQUssZUFBbkIsQ0FBakM7QUFDRDs7Ozs7Ozs7OztnQ0FPVyxRLEVBQVU7QUFDcEIsVUFBSSxLQUFLLFNBQVQsRUFDRSxLQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsUUFBekIsRUFERixLQUdFLEtBQUssY0FBTCxDQUFvQixHQUFwQixDQUF3QixRQUF4QjtBQUNIOzs7Ozs7Ozs7O21DQU9jLFEsRUFBVTtBQUN2QixVQUFJLEtBQUssU0FBVCxFQUNFLEtBQUssZUFBTCxDQUFxQixNQUFyQixDQUE0QixRQUE1QixFQURGLEtBR0UsS0FBSyxjQUFMLENBQW9CLE1BQXBCLENBQTJCLFFBQTNCO0FBQ0g7Ozs7O2tCQUdZLFUiLCJmaWxlIjoiQ2FudmFzVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9SZW5kZXJpbmdHcm91cCc7XG5cblxuY29uc3QgZGVmYXVsdENhbnZhc1RlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjwlPSB0b3AgJT48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj48JT0gY2VudGVyICU+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PCU9IGJvdHRvbSAlPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbi8qKlxuICogVmlldyBkZXNpZ25lZCBmb3IgZXhwZXJpZW5jZXMgd2hlcmUgMmQgZ3JhcGhpY2FsIHJlbmRlcmluZyBpcyBuZWVkZWQuXG4gKiBUaGUgdmlldyBpcyBiYXNpY2FsbHkgYSBgU2VnbWVudGVkVmlld2Agd2l0aCBhIGBjYW52YXNgIGVsZW1lbnQgaW5cbiAqIHRoZSBiYWNrZ3JvdW5kLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleHRlbmRzIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2VnbWVudGVkVmlld31cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3fVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyfVxuICovXG5jbGFzcyBDYW52YXNWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIC8qKlxuICAgKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFZpZXdzIHNob3VsZCBwcmVmZXJhYmx5IGJ5XG4gICAqIGNyZWF0ZWQgdXNpbmcgdGhlIFtgRXhwZXJpZW5jZSNjcmVhdGVWaWV3YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkV4cGVyaWVuY2UjY3JlYXRlVmlld31cbiAgICogbWV0aG9kLl9cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlIC0gVGVtcGxhdGUgb2YgdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhcmlhYmxlcyB1c2VkIHRvIHBvcHVsYXRlXG4gICAqICB0aGUgdGVtcGxhdGUuIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNjb250ZW50fS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIExpc3RlbmVycyB0byBpbnN0YWxsIGluIHRoZSB2aWV3XG4gICAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjZXZlbnRzfS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSB2aWV3LlxuICAgKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I29wdGlvbnN9LlxuICAgKi9cbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgfHwgZGVmYXVsdENhbnZhc1RlbXBsYXRlO1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgIHByZXNlcnZlUGl4ZWxSYXRpbzogZmFsc2UsXG4gICAgfSwgb3B0aW9ucyk7XG5cbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFRlbXBvcmFyeSBzdGFjayB0aGUgcmVuZGVyZXJzIHdoZW4gdGhlIHZpZXcgaXMgbm90IHZpc2libGUuXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKi9cbiAgICB0aGlzLl9yZW5kZXJlclN0YWNrID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogRmxhZyB0byB0cmFjayB0aGUgZmlyc3QgYHJlbmRlcmAgY2FsbFxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX2hhc1JlbmRlcmVkT25jZSA9IGZhbHNlO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcblxuICAgIGlmICghdGhpcy5faGFzUmVuZGVyZWRPbmNlKSB7XG4gICAgICAvKipcbiAgICAgICAqIFRoZSBjYW52YXMgZWxlbWVudCB0byBkcmF3IGludG8uXG4gICAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgICAqL1xuICAgICAgdGhpcy4kY2FudmFzID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIDJkIGNvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XG4gICAgICAgKi9cbiAgICAgIHRoaXMuY3R4ID0gdGhpcy4kY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbiAgICAgIC8qKlxuICAgICAgICogVGhlIGRlZmF1bHQgcmVuZGVyaW5nIGdyb3VwLlxuICAgICAgICogQHR5cGUge1JlbmRlcmluZ0dyb3VwfVxuICAgICAgICogQHByaXZhdGVcbiAgICAgICAqL1xuICAgICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAgPSBuZXcgUmVuZGVyaW5nR3JvdXAodGhpcy5jdHgpO1xuXG4gICAgICAvLyBwcmV2ZW50IGNyZWF0aW5nIGEgbmV3IHJlbmRlcmluZyBncm91cCBlYWNoIHRpbWUgdGhlIHZpZXcgaXMgcmVuZGVyZWRcbiAgICAgIHRoaXMuX2hhc1JlbmRlcmVkT25jZSA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCk7XG5cbiAgICAvLyBhZGQgc3RhY2tlZCByZW5kZXJlcnMgdG8gdGhlIHJlbmRlcmluZyBncm91cFxuICAgIHRoaXMuX3JlbmRlcmVyU3RhY2suZm9yRWFjaCgocmVuZGVyZXIpID0+IHRoaXMuX3JlbmRlcmluZ0dyb3VwLmFkZChyZW5kZXJlcikpO1xuICAgIHRoaXMuX3JlbmRlcmVyU3RhY2suY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd+cHJlUmVuZGVyZXJcbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIENvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gRGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIHRoZSBsYXN0IHJlbmRlcmluZyBjeWNsZS5cbiAgICovXG4gIC8qKlxuICAgKiBEZWZpbmVzIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYmVmb3JlIGFsbFxuICAgKiBbYFJlbmRlcmVyI3JlbmRlcmBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlciNyZW5kZXJ9XG4gICAqIGF0IGVhY2ggY3ljbGUuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd+cHJlUmVuZGVyZXJ9IGNhbGxiYWNrIC0gRnVuY3Rpb25cbiAgICogIHRvIGV4ZWN1dGUgYmVmb3JlIGFlY2ggcmVuZGVyaW5nIGN5Y2xlLlxuICAgKi9cbiAgc2V0UHJlUmVuZGVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAucHJlUmVuZGVyID0gY2FsbGJhY2suYmluZCh0aGlzLl9yZW5kZXJpbmdHcm91cCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVuZGVyZXIgdG8gdGhlIGBSZW5kZXJpbmdHcm91cGAuIFRoZSByZW5kZXJlciBpcyBhdXRvbWF0aWNhbGx5XG4gICAqIGFjdGl2YXRlZCB3aGVuIGFkZGVkIHRvIHRoZSBncm91cC5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUmVuZGVyZXJ9IHJlbmRlcmVyIC0gUmVuZGVyZXIgdG8gYWRkLlxuICAgKi9cbiAgYWRkUmVuZGVyZXIocmVuZGVyZXIpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5hZGQocmVuZGVyZXIpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3JlbmRlcmVyU3RhY2suYWRkKHJlbmRlcmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJlciB0byB0aGUgYFJlbmRlcmluZ0dyb3VwYC4gVGhlIHJlbmRlcmVyIGlzIGF1dG9tYXRpY2FsbHlcbiAgICogZGlzYWN0aXZhdGVkIHdoZW4gcmVtb3ZlZCBmcm9tIHRoZSBncm91cC5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUmVuZGVyZXJ9IHJlbmRlcmVyIC0gUmVuZGVyZXIgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUmVuZGVyZXIocmVuZGVyZXIpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5yZW1vdmUocmVuZGVyZXIpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3JlbmRlcmVyU3RhY2suZGVsZXRlKHJlbmRlcmVyKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBDYW52YXNWaWV3O1xuIl19
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

var _CanvasRenderingGroup = require('./CanvasRenderingGroup');

var _CanvasRenderingGroup2 = _interopRequireDefault(_CanvasRenderingGroup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultCanvasTemplate = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"><%= top %></div>\n    <div class="section-center flex-center"><%= center %></div>\n    <div class="section-bottom flex-middle"><%= bottom %></div>\n  </div>\n';

/**
 * View designed for experiences where 2d graphical rendering is needed.
 * The view is basically a `SegmentedView` with a `canvas` element in
 * the background and a set of helpers to handle the __renderers__ (objects
 * that draw something into the canvas).
 *
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
 *
 * @memberof module:soundworks/client
 * @extends {module:soundworks/client.SegmentedView}
 *
 * @see {@link module:soundworks/client.View}
 * @see {@link module:soundworks/client.Renderer}
 */

var CanvasView = function (_SegmentedView) {
  (0, _inherits3.default)(CanvasView, _SegmentedView);

  function CanvasView(template, content, events, options) {
    (0, _classCallCheck3.default)(this, CanvasView);

    template = template || defaultCanvasTemplate;
    options = (0, _assign2.default)({
      preservePixelRatio: false
    }, options);

    /**
     * Temporary stack the renderers when the view is not visible.
     *
     * @type {Set}
     * @name _rendererStack
     * @instance
     * @memberof module:soundworks/client.CanvasView
     * @private
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (CanvasView.__proto__ || (0, _getPrototypeOf2.default)(CanvasView)).call(this, template, content, events, options));

    _this._rendererStack = new _set2.default();

    /**
     * Flag to track the first `onRender` call.
     *
     * @type {Boolean}
     * @name _hasRenderedOnce
     * @instance
     * @memberof module:soundworks/client.CanvasView
     * @private
     */
    _this._hasRenderedOnce = false;

    /**
     * Default rendering group.
     *
     * @type {module:soundworks/client.CanvasRenderingGroup}
     * @name _renderingGroup
     * @instance
     * @memberof module:soundworks/client.CanvasView
     * @private
     */
    _this._renderingGroup = null;

    /**
     * Canvas DOM element to draw into.
     *
     * @type {Element}
     * @name $canvas
     * @instance
     * @memberof module:soundworks/client.$canvas
     */
    _this.$canvas = null;

    /**
     * 2d context of the canvas.
     *
     * @type {CanvasRenderingContext2D}
     * @name $canvas
     * @instance
     * @memberof module:soundworks/client.$canvas
     */
    _this.ctx = null;
    return _this;
  }

  (0, _createClass3.default)(CanvasView, [{
    key: 'onRender',


    /** @private */
    value: function onRender() {
      (0, _get3.default)(CanvasView.prototype.__proto__ || (0, _getPrototypeOf2.default)(CanvasView.prototype), 'onRender', this).call(this);

      this.$canvas = this.$el.querySelector('canvas');
      this.ctx = this.$canvas.getContext('2d');

      // update the rendering group if the canvas instance has changed after a render
      if (this._renderingGroup) this._renderingGroup.ctx = this.ctx;

      if (!this._hasRenderedOnce) {
        var preservePixelRatio = this.options.preservePixelRatio;
        this._renderingGroup = new _CanvasRenderingGroup2.default(this.ctx, preservePixelRatio);

        // prevent creating a new rendering group each time the view is re-rendered
        this._hasRenderedOnce = true;
        this.init();
      }
    }

    /**
     * Entry point called when the renderingGroup for the view is ready.
     * Basically allows to instanciate some renderers from inside the view.
     */

  }, {
    key: 'init',
    value: function init() {}

    /** @private */

  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      var _this2 = this;

      (0, _get3.default)(CanvasView.prototype.__proto__ || (0, _getPrototypeOf2.default)(CanvasView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
      this._renderingGroup.onResize(viewportWidth, viewportHeight, orientation);

      // add stacked renderers to the rendering group
      this._rendererStack.forEach(function (renderer) {
        return _this2._renderingGroup.add(renderer);
      });
      this._rendererStack.clear();
    }

    /**
     * Callback executed at the beginning of each `requestAnimationFrame`
     * cycle, before the execution of the renderers.
     * @callback module:soundworks/client.CanvasView~preRenderer
     *
     * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
     * @param {Number} dt - Delta time in seconds since last rendering.
     * @param {Number} canvasWidth - Current width of the canvas.
     * @param {Number} canvasHeight - Current height of the canvas.
     */
    /**
     * Register a function to execute at the beginning of each
     * `requestAnimationFrame` cycle.
     *
     * @param {module:soundworks/client.CanvasView~preRenderer} callback -
     *  Function to execute before each rendering cycle.
     */

  }, {
    key: 'setPreRender',
    value: function setPreRender(callback) {
      this._renderingGroup.preRender = callback;
    }

    /**
     * Callback executed at the end of each `requestAnimationFrame`
     * cycle, after the execution of the renderers.
     * @callback module:soundworks/client.CanvasView~postRenderer
     *
     * @param {CanvasRenderingContext2D} ctx - Context of the canvas.
     * @param {Number} dt - Delta time in seconds since last rendering.
     * @param {Number} canvasWidth - Current width of the canvas.
     * @param {Number} canvasHeight - Current height of the canvas.
     */
    /**
     * Register a function to execute at the end of each
     * `requestAnimationFrame` cycle.
     *
     * @param {module:soundworks/client.CanvasView~postRenderer} callback -
     *  Function to execute before each rendering cycle.
     */

  }, {
    key: 'setPostRender',
    value: function setPostRender(callback) {
      this._renderingGroup.postRender = callback;
    }

    /**
     * Add a renderer to the `RenderingGroup`. The renderer is automatically
     * activated when added to the group.
     *
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
     *
     * @param {module:soundworks/client.Renderer} renderer - Renderer to remove.
     */

  }, {
    key: 'removeRenderer',
    value: function removeRenderer(renderer) {
      if (this.isVisible) this._renderingGroup.remove(renderer);else this._rendererStack.delete(renderer);
    }
  }, {
    key: 'pixelRatio',
    get: function get() {
      return this._renderingGroup.pixelRatio;
    }
  }]);
  return CanvasView;
}(_SegmentedView3.default);

exports.default = CanvasView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1ZpZXcuanMiXSwibmFtZXMiOlsiZGVmYXVsdENhbnZhc1RlbXBsYXRlIiwiQ2FudmFzVmlldyIsInRlbXBsYXRlIiwiY29udGVudCIsImV2ZW50cyIsIm9wdGlvbnMiLCJwcmVzZXJ2ZVBpeGVsUmF0aW8iLCJfcmVuZGVyZXJTdGFjayIsIl9oYXNSZW5kZXJlZE9uY2UiLCJfcmVuZGVyaW5nR3JvdXAiLCIkY2FudmFzIiwiY3R4IiwiJGVsIiwicXVlcnlTZWxlY3RvciIsImdldENvbnRleHQiLCJpbml0Iiwidmlld3BvcnRXaWR0aCIsInZpZXdwb3J0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJvblJlc2l6ZSIsImZvckVhY2giLCJyZW5kZXJlciIsImFkZCIsImNsZWFyIiwiY2FsbGJhY2siLCJwcmVSZW5kZXIiLCJwb3N0UmVuZGVyIiwiaXNWaXNpYmxlIiwicmVtb3ZlIiwiZGVsZXRlIiwicGl4ZWxSYXRpbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSx1U0FBTjs7QUFTQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXdCTUMsVTs7O0FBQ0osc0JBQVlDLFFBQVosRUFBc0JDLE9BQXRCLEVBQStCQyxNQUEvQixFQUF1Q0MsT0FBdkMsRUFBZ0Q7QUFBQTs7QUFDOUNILGVBQVdBLFlBQVlGLHFCQUF2QjtBQUNBSyxjQUFVLHNCQUFjO0FBQ3RCQywwQkFBb0I7QUFERSxLQUFkLEVBRVBELE9BRk8sQ0FBVjs7QUFNQTs7Ozs7Ozs7O0FBUjhDLDhJQU14Q0gsUUFOd0MsRUFNOUJDLE9BTjhCLEVBTXJCQyxNQU5xQixFQU1iQyxPQU5hOztBQWlCOUMsVUFBS0UsY0FBTCxHQUFzQixtQkFBdEI7O0FBRUE7Ozs7Ozs7OztBQVNBLFVBQUtDLGdCQUFMLEdBQXdCLEtBQXhCOztBQUVBOzs7Ozs7Ozs7QUFTQSxVQUFLQyxlQUFMLEdBQXVCLElBQXZCOztBQUVBOzs7Ozs7OztBQVFBLFVBQUtDLE9BQUwsR0FBZSxJQUFmOztBQUVBOzs7Ozs7OztBQVFBLFVBQUtDLEdBQUwsR0FBVyxJQUFYO0FBM0Q4QztBQTREL0M7Ozs7OztBQU1EOytCQUNXO0FBQ1Q7O0FBRUEsV0FBS0QsT0FBTCxHQUFlLEtBQUtFLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFmO0FBQ0EsV0FBS0YsR0FBTCxHQUFXLEtBQUtELE9BQUwsQ0FBYUksVUFBYixDQUF3QixJQUF4QixDQUFYOztBQUVBO0FBQ0EsVUFBSSxLQUFLTCxlQUFULEVBQ0UsS0FBS0EsZUFBTCxDQUFxQkUsR0FBckIsR0FBMkIsS0FBS0EsR0FBaEM7O0FBRUYsVUFBSSxDQUFDLEtBQUtILGdCQUFWLEVBQTRCO0FBQzFCLFlBQU1GLHFCQUFxQixLQUFLRCxPQUFMLENBQWFDLGtCQUF4QztBQUNBLGFBQUtHLGVBQUwsR0FBdUIsbUNBQXlCLEtBQUtFLEdBQTlCLEVBQW1DTCxrQkFBbkMsQ0FBdkI7O0FBRUE7QUFDQSxhQUFLRSxnQkFBTCxHQUF3QixJQUF4QjtBQUNBLGFBQUtPLElBQUw7QUFDRDtBQUNGOztBQUVEOzs7Ozs7OzJCQUlPLENBQUU7O0FBRVQ7Ozs7NkJBQ1NDLGEsRUFBZUMsYyxFQUFnQkMsVyxFQUFhO0FBQUE7O0FBQ25ELDZJQUFlRixhQUFmLEVBQThCQyxjQUE5QixFQUE4Q0MsV0FBOUM7QUFDQSxXQUFLVCxlQUFMLENBQXFCVSxRQUFyQixDQUE4QkgsYUFBOUIsRUFBNkNDLGNBQTdDLEVBQTZEQyxXQUE3RDs7QUFFQTtBQUNBLFdBQUtYLGNBQUwsQ0FBb0JhLE9BQXBCLENBQTRCLFVBQUNDLFFBQUQ7QUFBQSxlQUFjLE9BQUtaLGVBQUwsQ0FBcUJhLEdBQXJCLENBQXlCRCxRQUF6QixDQUFkO0FBQUEsT0FBNUI7QUFDQSxXQUFLZCxjQUFMLENBQW9CZ0IsS0FBcEI7QUFDRDs7QUFFRDs7Ozs7Ozs7OztBQVVBOzs7Ozs7Ozs7O2lDQU9hQyxRLEVBQVU7QUFDckIsV0FBS2YsZUFBTCxDQUFxQmdCLFNBQXJCLEdBQWlDRCxRQUFqQztBQUNEOztBQUVEOzs7Ozs7Ozs7O0FBVUE7Ozs7Ozs7Ozs7a0NBT2NBLFEsRUFBVTtBQUN0QixXQUFLZixlQUFMLENBQXFCaUIsVUFBckIsR0FBa0NGLFFBQWxDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztnQ0FNWUgsUSxFQUFVO0FBQ3BCLFVBQUksS0FBS00sU0FBVCxFQUNFLEtBQUtsQixlQUFMLENBQXFCYSxHQUFyQixDQUF5QkQsUUFBekIsRUFERixLQUdFLEtBQUtkLGNBQUwsQ0FBb0JlLEdBQXBCLENBQXdCRCxRQUF4QjtBQUNIOztBQUVEOzs7Ozs7Ozs7bUNBTWVBLFEsRUFBVTtBQUN2QixVQUFJLEtBQUtNLFNBQVQsRUFDRSxLQUFLbEIsZUFBTCxDQUFxQm1CLE1BQXJCLENBQTRCUCxRQUE1QixFQURGLEtBR0UsS0FBS2QsY0FBTCxDQUFvQnNCLE1BQXBCLENBQTJCUixRQUEzQjtBQUNIOzs7d0JBM0dnQjtBQUNmLGFBQU8sS0FBS1osZUFBTCxDQUFxQnFCLFVBQTVCO0FBQ0Q7Ozs7O2tCQTRHWTdCLFUiLCJmaWxlIjoiQ2FudmFzVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgQ2FudmFzUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9DYW52YXNSZW5kZXJpbmdHcm91cCc7XG5cblxuY29uc3QgZGVmYXVsdENhbnZhc1RlbXBsYXRlID0gYFxuICA8Y2FudmFzIGNsYXNzPVwiYmFja2dyb3VuZFwiPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwiZm9yZWdyb3VuZFwiPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjwlPSB0b3AgJT48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj48JT0gY2VudGVyICU+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PCU9IGJvdHRvbSAlPjwvZGl2PlxuICA8L2Rpdj5cbmA7XG5cbi8qKlxuICogVmlldyBkZXNpZ25lZCBmb3IgZXhwZXJpZW5jZXMgd2hlcmUgMmQgZ3JhcGhpY2FsIHJlbmRlcmluZyBpcyBuZWVkZWQuXG4gKiBUaGUgdmlldyBpcyBiYXNpY2FsbHkgYSBgU2VnbWVudGVkVmlld2Agd2l0aCBhIGBjYW52YXNgIGVsZW1lbnQgaW5cbiAqIHRoZSBiYWNrZ3JvdW5kIGFuZCBhIHNldCBvZiBoZWxwZXJzIHRvIGhhbmRsZSB0aGUgX19yZW5kZXJlcnNfXyAob2JqZWN0c1xuICogdGhhdCBkcmF3IHNvbWV0aGluZyBpbnRvIHRoZSBjYW52YXMpLlxuICpcbiAqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVmlld3Mgc2hvdWxkIHByZWZlcmFibHkgYnlcbiAqIGNyZWF0ZWQgdXNpbmcgdGhlIFtgRXhwZXJpZW5jZSNjcmVhdGVWaWV3YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkV4cGVyaWVuY2UjY3JlYXRlVmlld31cbiAqIG1ldGhvZC5fXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlIC0gVGVtcGxhdGUgb2YgdGhlIHZpZXcuXG4gKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIE9iamVjdCBjb250YWluaW5nIHRoZSB2YXJpYWJsZXMgdXNlZCB0byBwb3B1bGF0ZVxuICogIHRoZSB0ZW1wbGF0ZS4ge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2NvbnRlbnR9LlxuICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIExpc3RlbmVycyB0byBpbnN0YWxsIGluIHRoZSB2aWV3XG4gKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2V2ZW50c30uXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgb2YgdGhlIHZpZXcuXG4gKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I29wdGlvbnN9LlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleHRlbmRzIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2VnbWVudGVkVmlld31cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld31cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn1cbiAqL1xuY2xhc3MgQ2FudmFzVmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKSB7XG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZSB8fCBkZWZhdWx0Q2FudmFzVGVtcGxhdGU7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe1xuICAgICAgcHJlc2VydmVQaXhlbFJhdGlvOiBmYWxzZSxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGVtcG9yYXJ5IHN0YWNrIHRoZSByZW5kZXJlcnMgd2hlbiB0aGUgdmlldyBpcyBub3QgdmlzaWJsZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQG5hbWUgX3JlbmRlcmVyU3RhY2tcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3JlbmRlcmVyU3RhY2sgPSBuZXcgU2V0KCk7XG5cbiAgICAvKipcbiAgICAgKiBGbGFnIHRvIHRyYWNrIHRoZSBmaXJzdCBgb25SZW5kZXJgIGNhbGwuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBfaGFzUmVuZGVyZWRPbmNlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNWaWV3XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9oYXNSZW5kZXJlZE9uY2UgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgcmVuZGVyaW5nIGdyb3VwLlxuICAgICAqXG4gICAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNSZW5kZXJpbmdHcm91cH1cbiAgICAgKiBAbmFtZSBfcmVuZGVyaW5nR3JvdXBcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIENhbnZhcyBET00gZWxlbWVudCB0byBkcmF3IGludG8uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKiBAbmFtZSAkY2FudmFzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC4kY2FudmFzXG4gICAgICovXG4gICAgdGhpcy4kY2FudmFzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIDJkIGNvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XG4gICAgICogQG5hbWUgJGNhbnZhc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuJGNhbnZhc1xuICAgICAqL1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgfVxuXG4gIGdldCBwaXhlbFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJpbmdHcm91cC5waXhlbFJhdGlvO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLiRjYW52YXMgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSByZW5kZXJpbmcgZ3JvdXAgaWYgdGhlIGNhbnZhcyBpbnN0YW5jZSBoYXMgY2hhbmdlZCBhZnRlciBhIHJlbmRlclxuICAgIGlmICh0aGlzLl9yZW5kZXJpbmdHcm91cClcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLmN0eCA9IHRoaXMuY3R4O1xuXG4gICAgaWYgKCF0aGlzLl9oYXNSZW5kZXJlZE9uY2UpIHtcbiAgICAgIGNvbnN0IHByZXNlcnZlUGl4ZWxSYXRpbyA9IHRoaXMub3B0aW9ucy5wcmVzZXJ2ZVBpeGVsUmF0aW9cbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwID0gbmV3IENhbnZhc1JlbmRlcmluZ0dyb3VwKHRoaXMuY3R4LCBwcmVzZXJ2ZVBpeGVsUmF0aW8pO1xuXG4gICAgICAvLyBwcmV2ZW50IGNyZWF0aW5nIGEgbmV3IHJlbmRlcmluZyBncm91cCBlYWNoIHRpbWUgdGhlIHZpZXcgaXMgcmUtcmVuZGVyZWRcbiAgICAgIHRoaXMuX2hhc1JlbmRlcmVkT25jZSA9IHRydWU7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW50cnkgcG9pbnQgY2FsbGVkIHdoZW4gdGhlIHJlbmRlcmluZ0dyb3VwIGZvciB0aGUgdmlldyBpcyByZWFkeS5cbiAgICogQmFzaWNhbGx5IGFsbG93cyB0byBpbnN0YW5jaWF0ZSBzb21lIHJlbmRlcmVycyBmcm9tIGluc2lkZSB0aGUgdmlldy5cbiAgICovXG4gIGluaXQoKSB7fVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbik7XG5cbiAgICAvLyBhZGQgc3RhY2tlZCByZW5kZXJlcnMgdG8gdGhlIHJlbmRlcmluZyBncm91cFxuICAgIHRoaXMuX3JlbmRlcmVyU3RhY2suZm9yRWFjaCgocmVuZGVyZXIpID0+IHRoaXMuX3JlbmRlcmluZ0dyb3VwLmFkZChyZW5kZXJlcikpO1xuICAgIHRoaXMuX3JlbmRlcmVyU3RhY2suY2xlYXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBleGVjdXRlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGVhY2ggYHJlcXVlc3RBbmltYXRpb25GcmFtZWBcbiAgICogY3ljbGUsIGJlZm9yZSB0aGUgZXhlY3V0aW9uIG9mIHRoZSByZW5kZXJlcnMuXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld35wcmVSZW5kZXJlclxuICAgKlxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gQ29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBEZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgbGFzdCByZW5kZXJpbmcuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNXaWR0aCAtIEN1cnJlbnQgd2lkdGggb2YgdGhlIGNhbnZhcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc0hlaWdodCAtIEN1cnJlbnQgaGVpZ2h0IG9mIHRoZSBjYW52YXMuXG4gICAqL1xuICAvKipcbiAgICogUmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBleGVjdXRlIGF0IHRoZSBiZWdpbm5pbmcgb2YgZWFjaFxuICAgKiBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBjeWNsZS5cbiAgICpcbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld35wcmVSZW5kZXJlcn0gY2FsbGJhY2sgLVxuICAgKiAgRnVuY3Rpb24gdG8gZXhlY3V0ZSBiZWZvcmUgZWFjaCByZW5kZXJpbmcgY3ljbGUuXG4gICAqL1xuICBzZXRQcmVSZW5kZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5wcmVSZW5kZXIgPSBjYWxsYmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBleGVjdXRlZCBhdCB0aGUgZW5kIG9mIGVhY2ggYHJlcXVlc3RBbmltYXRpb25GcmFtZWBcbiAgICogY3ljbGUsIGFmdGVyIHRoZSBleGVjdXRpb24gb2YgdGhlIHJlbmRlcmVycy5cbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNWaWV3fnBvc3RSZW5kZXJlclxuICAgKlxuICAgKiBAcGFyYW0ge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH0gY3R4IC0gQ29udGV4dCBvZiB0aGUgY2FudmFzLlxuICAgKiBAcGFyYW0ge051bWJlcn0gZHQgLSBEZWx0YSB0aW1lIGluIHNlY29uZHMgc2luY2UgbGFzdCByZW5kZXJpbmcuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNXaWR0aCAtIEN1cnJlbnQgd2lkdGggb2YgdGhlIGNhbnZhcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGNhbnZhc0hlaWdodCAtIEN1cnJlbnQgaGVpZ2h0IG9mIHRoZSBjYW52YXMuXG4gICAqL1xuICAvKipcbiAgICogUmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBleGVjdXRlIGF0IHRoZSBlbmQgb2YgZWFjaFxuICAgKiBgcmVxdWVzdEFuaW1hdGlvbkZyYW1lYCBjeWNsZS5cbiAgICpcbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld35wb3N0UmVuZGVyZXJ9IGNhbGxiYWNrIC1cbiAgICogIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgYmVmb3JlIGVhY2ggcmVuZGVyaW5nIGN5Y2xlLlxuICAgKi9cbiAgc2V0UG9zdFJlbmRlcihjYWxsYmFjaykge1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnBvc3RSZW5kZXIgPSBjYWxsYmFjaztcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJlciB0byB0aGUgYFJlbmRlcmluZ0dyb3VwYC4gVGhlIHJlbmRlcmVyIGlzIGF1dG9tYXRpY2FsbHlcbiAgICogYWN0aXZhdGVkIHdoZW4gYWRkZWQgdG8gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn0gcmVuZGVyZXIgLSBSZW5kZXJlciB0byBhZGQuXG4gICAqL1xuICBhZGRSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLmFkZChyZW5kZXJlcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyZXJTdGFjay5hZGQocmVuZGVyZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmVyIHRvIHRoZSBgUmVuZGVyaW5nR3JvdXBgLiBUaGUgcmVuZGVyZXIgaXMgYXV0b21hdGljYWxseVxuICAgKiBkaXNhY3RpdmF0ZWQgd2hlbiByZW1vdmVkIGZyb20gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn0gcmVuZGVyZXIgLSBSZW5kZXJlciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnJlbW92ZShyZW5kZXJlcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyZXJTdGFjay5kZWxldGUocmVuZGVyZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbnZhc1ZpZXc7XG4iXX0=
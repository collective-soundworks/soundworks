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
      preservePixelRatio: false,
      skipFrames: 0
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
        var skipFrames = this.options.skipFrames;
        this._renderingGroup = new _CanvasRenderingGroup2.default(this.ctx, preservePixelRatio, skipFrames);

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
     * Remove a renderer from the `RenderingGroup`. The renderer is automatically
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1ZpZXcuanMiXSwibmFtZXMiOlsiZGVmYXVsdENhbnZhc1RlbXBsYXRlIiwiQ2FudmFzVmlldyIsInRlbXBsYXRlIiwiY29udGVudCIsImV2ZW50cyIsIm9wdGlvbnMiLCJwcmVzZXJ2ZVBpeGVsUmF0aW8iLCJza2lwRnJhbWVzIiwiX3JlbmRlcmVyU3RhY2siLCJfaGFzUmVuZGVyZWRPbmNlIiwiX3JlbmRlcmluZ0dyb3VwIiwiJGNhbnZhcyIsImN0eCIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCJnZXRDb250ZXh0IiwiQ2FudmFzUmVuZGVyaW5nR3JvdXAiLCJpbml0Iiwidmlld3BvcnRXaWR0aCIsInZpZXdwb3J0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJvblJlc2l6ZSIsImZvckVhY2giLCJyZW5kZXJlciIsImFkZCIsImNsZWFyIiwiY2FsbGJhY2siLCJwcmVSZW5kZXIiLCJwb3N0UmVuZGVyIiwiaXNWaXNpYmxlIiwicmVtb3ZlIiwiZGVsZXRlIiwicGl4ZWxSYXRpbyIsIlNlZ21lbnRlZFZpZXciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTUEsdVNBQU47O0FBU0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF3Qk1DLFU7OztBQUNKLHNCQUFZQyxRQUFaLEVBQXNCQyxPQUF0QixFQUErQkMsTUFBL0IsRUFBdUNDLE9BQXZDLEVBQWdEO0FBQUE7O0FBQzlDSCxlQUFXQSxZQUFZRixxQkFBdkI7QUFDQUssY0FBVSxzQkFBYztBQUN0QkMsMEJBQW9CLEtBREU7QUFFdEJDLGtCQUFZO0FBRlUsS0FBZCxFQUdQRixPQUhPLENBQVY7O0FBT0E7Ozs7Ozs7OztBQVQ4Qyw4SUFPeENILFFBUHdDLEVBTzlCQyxPQVA4QixFQU9yQkMsTUFQcUIsRUFPYkMsT0FQYTs7QUFrQjlDLFVBQUtHLGNBQUwsR0FBc0IsbUJBQXRCOztBQUVBOzs7Ozs7Ozs7QUFTQSxVQUFLQyxnQkFBTCxHQUF3QixLQUF4Qjs7QUFFQTs7Ozs7Ozs7O0FBU0EsVUFBS0MsZUFBTCxHQUF1QixJQUF2Qjs7QUFFQTs7Ozs7Ozs7QUFRQSxVQUFLQyxPQUFMLEdBQWUsSUFBZjs7QUFFQTs7Ozs7Ozs7QUFRQSxVQUFLQyxHQUFMLEdBQVcsSUFBWDtBQTVEOEM7QUE2RC9DOzs7Ozs7QUFNRDsrQkFDVztBQUNUOztBQUVBLFdBQUtELE9BQUwsR0FBZSxLQUFLRSxHQUFMLENBQVNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBZjtBQUNBLFdBQUtGLEdBQUwsR0FBVyxLQUFLRCxPQUFMLENBQWFJLFVBQWIsQ0FBd0IsSUFBeEIsQ0FBWDs7QUFFQTtBQUNBLFVBQUksS0FBS0wsZUFBVCxFQUNFLEtBQUtBLGVBQUwsQ0FBcUJFLEdBQXJCLEdBQTJCLEtBQUtBLEdBQWhDOztBQUVGLFVBQUksQ0FBQyxLQUFLSCxnQkFBVixFQUE0QjtBQUMxQixZQUFNSCxxQkFBcUIsS0FBS0QsT0FBTCxDQUFhQyxrQkFBeEM7QUFDQSxZQUFNQyxhQUFhLEtBQUtGLE9BQUwsQ0FBYUUsVUFBaEM7QUFDQSxhQUFLRyxlQUFMLEdBQXVCLElBQUlNLDhCQUFKLENBQXlCLEtBQUtKLEdBQTlCLEVBQW1DTixrQkFBbkMsRUFBdURDLFVBQXZELENBQXZCOztBQUVBO0FBQ0EsYUFBS0UsZ0JBQUwsR0FBd0IsSUFBeEI7QUFDQSxhQUFLUSxJQUFMO0FBQ0Q7QUFDRjs7QUFFRDs7Ozs7OzsyQkFJTyxDQUFFOztBQUVUOzs7OzZCQUNTQyxhLEVBQWVDLGMsRUFBZ0JDLFcsRUFBYTtBQUFBOztBQUNuRCw2SUFBZUYsYUFBZixFQUE4QkMsY0FBOUIsRUFBOENDLFdBQTlDO0FBQ0EsV0FBS1YsZUFBTCxDQUFxQlcsUUFBckIsQ0FBOEJILGFBQTlCLEVBQTZDQyxjQUE3QyxFQUE2REMsV0FBN0Q7O0FBRUE7QUFDQSxXQUFLWixjQUFMLENBQW9CYyxPQUFwQixDQUE0QixVQUFDQyxRQUFEO0FBQUEsZUFBYyxPQUFLYixlQUFMLENBQXFCYyxHQUFyQixDQUF5QkQsUUFBekIsQ0FBZDtBQUFBLE9BQTVCO0FBQ0EsV0FBS2YsY0FBTCxDQUFvQmlCLEtBQXBCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztpQ0FPYUMsUSxFQUFVO0FBQ3JCLFdBQUtoQixlQUFMLENBQXFCaUIsU0FBckIsR0FBaUNELFFBQWpDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7QUFVQTs7Ozs7Ozs7OztrQ0FPY0EsUSxFQUFVO0FBQ3RCLFdBQUtoQixlQUFMLENBQXFCa0IsVUFBckIsR0FBa0NGLFFBQWxDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OztnQ0FNWUgsUSxFQUFVO0FBQ3BCLFVBQUksS0FBS00sU0FBVCxFQUNFLEtBQUtuQixlQUFMLENBQXFCYyxHQUFyQixDQUF5QkQsUUFBekIsRUFERixLQUdFLEtBQUtmLGNBQUwsQ0FBb0JnQixHQUFwQixDQUF3QkQsUUFBeEI7QUFDSDs7QUFFRDs7Ozs7Ozs7O21DQU1lQSxRLEVBQVU7QUFDdkIsVUFBSSxLQUFLTSxTQUFULEVBQ0UsS0FBS25CLGVBQUwsQ0FBcUJvQixNQUFyQixDQUE0QlAsUUFBNUIsRUFERixLQUdFLEtBQUtmLGNBQUwsQ0FBb0J1QixNQUFwQixDQUEyQlIsUUFBM0I7QUFDSDs7O3dCQTVHZ0I7QUFDZixhQUFPLEtBQUtiLGVBQUwsQ0FBcUJzQixVQUE1QjtBQUNEOzs7RUFsRXNCQyx1Qjs7a0JBK0tWaEMsVSIsImZpbGUiOiJDYW52YXNWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBDYW52YXNSZW5kZXJpbmdHcm91cCBmcm9tICcuL0NhbnZhc1JlbmRlcmluZ0dyb3VwJztcblxuXG5jb25zdCBkZWZhdWx0Q2FudmFzVGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PCU9IHRvcCAlPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPjwlPSBjZW50ZXIgJT48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj48JT0gYm90dG9tICU+PC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuLyoqXG4gKiBWaWV3IGRlc2lnbmVkIGZvciBleHBlcmllbmNlcyB3aGVyZSAyZCBncmFwaGljYWwgcmVuZGVyaW5nIGlzIG5lZWRlZC5cbiAqIFRoZSB2aWV3IGlzIGJhc2ljYWxseSBhIGBTZWdtZW50ZWRWaWV3YCB3aXRoIGEgYGNhbnZhc2AgZWxlbWVudCBpblxuICogdGhlIGJhY2tncm91bmQgYW5kIGEgc2V0IG9mIGhlbHBlcnMgdG8gaGFuZGxlIHRoZSBfX3JlbmRlcmVyc19fIChvYmplY3RzXG4gKiB0aGF0IGRyYXcgc29tZXRoaW5nIGludG8gdGhlIGNhbnZhcykuXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBWaWV3cyBzaG91bGQgcHJlZmVyYWJseSBieVxuICogY3JlYXRlZCB1c2luZyB0aGUgW2BFeHBlcmllbmNlI2NyZWF0ZVZpZXdgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRXhwZXJpZW5jZSNjcmVhdGVWaWV3fVxuICogbWV0aG9kLl9cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdGVtcGxhdGUgLSBUZW1wbGF0ZSBvZiB0aGUgdmlldy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhcmlhYmxlcyB1c2VkIHRvIHBvcHVsYXRlXG4gKiAgdGhlIHRlbXBsYXRlLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjY29udGVudH0uXG4gKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gTGlzdGVuZXJzIHRvIGluc3RhbGwgaW4gdGhlIHZpZXdcbiAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjZXZlbnRzfS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgdmlldy5cbiAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjb3B0aW9uc30uXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TZWdtZW50ZWRWaWV3fVxuICpcbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3fVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyfVxuICovXG5jbGFzcyBDYW52YXNWaWV3IGV4dGVuZHMgU2VnbWVudGVkVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8IGRlZmF1bHRDYW52YXNUZW1wbGF0ZTtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBwcmVzZXJ2ZVBpeGVsUmF0aW86IGZhbHNlLFxuICAgICAgc2tpcEZyYW1lczogMCxcbiAgICB9LCBvcHRpb25zKTtcblxuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGVtcG9yYXJ5IHN0YWNrIHRoZSByZW5kZXJlcnMgd2hlbiB0aGUgdmlldyBpcyBub3QgdmlzaWJsZS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQG5hbWUgX3JlbmRlcmVyU3RhY2tcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3JlbmRlcmVyU3RhY2sgPSBuZXcgU2V0KCk7XG5cbiAgICAvKipcbiAgICAgKiBGbGFnIHRvIHRyYWNrIHRoZSBmaXJzdCBgb25SZW5kZXJgIGNhbGwuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBfaGFzUmVuZGVyZWRPbmNlXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNWaWV3XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9oYXNSZW5kZXJlZE9uY2UgPSBmYWxzZTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgcmVuZGVyaW5nIGdyb3VwLlxuICAgICAqXG4gICAgICogQHR5cGUge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNSZW5kZXJpbmdHcm91cH1cbiAgICAgKiBAbmFtZSBfcmVuZGVyaW5nR3JvdXBcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXdcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIENhbnZhcyBET00gZWxlbWVudCB0byBkcmF3IGludG8uXG4gICAgICpcbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKiBAbmFtZSAkY2FudmFzXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC4kY2FudmFzXG4gICAgICovXG4gICAgdGhpcy4kY2FudmFzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIDJkIGNvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XG4gICAgICogQG5hbWUgJGNhbnZhc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuJGNhbnZhc1xuICAgICAqL1xuICAgIHRoaXMuY3R4ID0gbnVsbDtcbiAgfVxuXG4gIGdldCBwaXhlbFJhdGlvKCkge1xuICAgIHJldHVybiB0aGlzLl9yZW5kZXJpbmdHcm91cC5waXhlbFJhdGlvO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG5cbiAgICB0aGlzLiRjYW52YXMgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgLy8gdXBkYXRlIHRoZSByZW5kZXJpbmcgZ3JvdXAgaWYgdGhlIGNhbnZhcyBpbnN0YW5jZSBoYXMgY2hhbmdlZCBhZnRlciBhIHJlbmRlclxuICAgIGlmICh0aGlzLl9yZW5kZXJpbmdHcm91cClcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLmN0eCA9IHRoaXMuY3R4O1xuXG4gICAgaWYgKCF0aGlzLl9oYXNSZW5kZXJlZE9uY2UpIHtcbiAgICAgIGNvbnN0IHByZXNlcnZlUGl4ZWxSYXRpbyA9IHRoaXMub3B0aW9ucy5wcmVzZXJ2ZVBpeGVsUmF0aW87XG4gICAgICBjb25zdCBza2lwRnJhbWVzID0gdGhpcy5vcHRpb25zLnNraXBGcmFtZXM7XG4gICAgICB0aGlzLl9yZW5kZXJpbmdHcm91cCA9IG5ldyBDYW52YXNSZW5kZXJpbmdHcm91cCh0aGlzLmN0eCwgcHJlc2VydmVQaXhlbFJhdGlvLCBza2lwRnJhbWVzKTtcblxuICAgICAgLy8gcHJldmVudCBjcmVhdGluZyBhIG5ldyByZW5kZXJpbmcgZ3JvdXAgZWFjaCB0aW1lIHRoZSB2aWV3IGlzIHJlLXJlbmRlcmVkXG4gICAgICB0aGlzLl9oYXNSZW5kZXJlZE9uY2UgPSB0cnVlO1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEVudHJ5IHBvaW50IGNhbGxlZCB3aGVuIHRoZSByZW5kZXJpbmdHcm91cCBmb3IgdGhlIHZpZXcgaXMgcmVhZHkuXG4gICAqIEJhc2ljYWxseSBhbGxvd3MgdG8gaW5zdGFuY2lhdGUgc29tZSByZW5kZXJlcnMgZnJvbSBpbnNpZGUgdGhlIHZpZXcuXG4gICAqL1xuICBpbml0KCkge31cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgLy8gYWRkIHN0YWNrZWQgcmVuZGVyZXJzIHRvIHRoZSByZW5kZXJpbmcgZ3JvdXBcbiAgICB0aGlzLl9yZW5kZXJlclN0YWNrLmZvckVhY2goKHJlbmRlcmVyKSA9PiB0aGlzLl9yZW5kZXJpbmdHcm91cC5hZGQocmVuZGVyZXIpKTtcbiAgICB0aGlzLl9yZW5kZXJlclN0YWNrLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZXhlY3V0ZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBlYWNoIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgXG4gICAqIGN5Y2xlLCBiZWZvcmUgdGhlIGV4ZWN1dGlvbiBvZiB0aGUgcmVuZGVyZXJzLlxuICAgKiBAY2FsbGJhY2sgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd+cHJlUmVuZGVyZXJcbiAgICpcbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIENvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gRGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIGxhc3QgcmVuZGVyaW5nLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY2FudmFzV2lkdGggLSBDdXJyZW50IHdpZHRoIG9mIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNIZWlnaHQgLSBDdXJyZW50IGhlaWdodCBvZiB0aGUgY2FudmFzLlxuICAgKi9cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhdCB0aGUgYmVnaW5uaW5nIG9mIGVhY2hcbiAgICogYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgY3ljbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd+cHJlUmVuZGVyZXJ9IGNhbGxiYWNrIC1cbiAgICogIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgYmVmb3JlIGVhY2ggcmVuZGVyaW5nIGN5Y2xlLlxuICAgKi9cbiAgc2V0UHJlUmVuZGVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAucHJlUmVuZGVyID0gY2FsbGJhY2s7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgZXhlY3V0ZWQgYXQgdGhlIGVuZCBvZiBlYWNoIGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgXG4gICAqIGN5Y2xlLCBhZnRlciB0aGUgZXhlY3V0aW9uIG9mIHRoZSByZW5kZXJlcnMuXG4gICAqIEBjYWxsYmFjayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2FudmFzVmlld35wb3N0UmVuZGVyZXJcbiAgICpcbiAgICogQHBhcmFtIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9IGN0eCAtIENvbnRleHQgb2YgdGhlIGNhbnZhcy5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGR0IC0gRGVsdGEgdGltZSBpbiBzZWNvbmRzIHNpbmNlIGxhc3QgcmVuZGVyaW5nLlxuICAgKiBAcGFyYW0ge051bWJlcn0gY2FudmFzV2lkdGggLSBDdXJyZW50IHdpZHRoIG9mIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBjYW52YXNIZWlnaHQgLSBDdXJyZW50IGhlaWdodCBvZiB0aGUgY2FudmFzLlxuICAgKi9cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhdCB0aGUgZW5kIG9mIGVhY2hcbiAgICogYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgY3ljbGUuXG4gICAqXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNhbnZhc1ZpZXd+cG9zdFJlbmRlcmVyfSBjYWxsYmFjayAtXG4gICAqICBGdW5jdGlvbiB0byBleGVjdXRlIGJlZm9yZSBlYWNoIHJlbmRlcmluZyBjeWNsZS5cbiAgICovXG4gIHNldFBvc3RSZW5kZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5wb3N0UmVuZGVyID0gY2FsbGJhY2s7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVuZGVyZXIgdG8gdGhlIGBSZW5kZXJpbmdHcm91cGAuIFRoZSByZW5kZXJlciBpcyBhdXRvbWF0aWNhbGx5XG4gICAqIGFjdGl2YXRlZCB3aGVuIGFkZGVkIHRvIHRoZSBncm91cC5cbiAgICpcbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUmVuZGVyZXJ9IHJlbmRlcmVyIC0gUmVuZGVyZXIgdG8gYWRkLlxuICAgKi9cbiAgYWRkUmVuZGVyZXIocmVuZGVyZXIpIHtcbiAgICBpZiAodGhpcy5pc1Zpc2libGUpXG4gICAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5hZGQocmVuZGVyZXIpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3JlbmRlcmVyU3RhY2suYWRkKHJlbmRlcmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByZW5kZXJlciBmcm9tIHRoZSBgUmVuZGVyaW5nR3JvdXBgLiBUaGUgcmVuZGVyZXIgaXMgYXV0b21hdGljYWxseVxuICAgKiBkaXNhY3RpdmF0ZWQgd2hlbiByZW1vdmVkIGZyb20gdGhlIGdyb3VwLlxuICAgKlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn0gcmVuZGVyZXIgLSBSZW5kZXJlciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIGlmICh0aGlzLmlzVmlzaWJsZSlcbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnJlbW92ZShyZW5kZXJlcik7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcmVuZGVyZXJTdGFjay5kZWxldGUocmVuZGVyZXIpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENhbnZhc1ZpZXc7XG4iXX0=
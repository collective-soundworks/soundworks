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
    var _this = (0, _possibleConstructorReturn3.default)(this, (CanvasView.__proto__ || (0, _getPrototypeOf2.default)(CanvasView)).call(this, template, content, events, options));

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
      (0, _get3.default)(CanvasView.prototype.__proto__ || (0, _getPrototypeOf2.default)(CanvasView.prototype), 'onRender', this).call(this);

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
        this._renderingGroup = new _RenderingGroup2.default(this.ctx, this.options.preservePixelRatio);

        // prevent creating a new rendering group each time the view is re-rendered
        this._hasRenderedOnce = true;
      }
    }
  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      var _this2 = this;

      (0, _get3.default)(CanvasView.prototype.__proto__ || (0, _getPrototypeOf2.default)(CanvasView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNhbnZhc1ZpZXcuanMiXSwibmFtZXMiOlsiZGVmYXVsdENhbnZhc1RlbXBsYXRlIiwiQ2FudmFzVmlldyIsInRlbXBsYXRlIiwiY29udGVudCIsImV2ZW50cyIsIm9wdGlvbnMiLCJwcmVzZXJ2ZVBpeGVsUmF0aW8iLCJfcmVuZGVyZXJTdGFjayIsIl9oYXNSZW5kZXJlZE9uY2UiLCIkY2FudmFzIiwiJGVsIiwicXVlcnlTZWxlY3RvciIsImN0eCIsImdldENvbnRleHQiLCJfcmVuZGVyaW5nR3JvdXAiLCJ2aWV3cG9ydFdpZHRoIiwidmlld3BvcnRIZWlnaHQiLCJvcmllbnRhdGlvbiIsIm9uUmVzaXplIiwiZm9yRWFjaCIsInJlbmRlcmVyIiwiYWRkIiwiY2xlYXIiLCJjYWxsYmFjayIsInByZVJlbmRlciIsImJpbmQiLCJpc1Zpc2libGUiLCJyZW1vdmUiLCJkZWxldGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTUEsdVNBQU47O0FBU0E7Ozs7Ozs7Ozs7O0lBVU1DLFU7OztBQUNKOzs7Ozs7Ozs7Ozs7O0FBYUEsc0JBQVlDLFFBQVosRUFBc0JDLE9BQXRCLEVBQStCQyxNQUEvQixFQUF1Q0MsT0FBdkMsRUFBZ0Q7QUFBQTs7QUFDOUNILGVBQVdBLFlBQVlGLHFCQUF2QjtBQUNBSyxjQUFVLHNCQUFjO0FBQ3RCQywwQkFBb0I7QUFERSxLQUFkLEVBRVBELE9BRk8sQ0FBVjs7QUFNQTs7OztBQVI4Qyw4SUFNeENILFFBTndDLEVBTTlCQyxPQU44QixFQU1yQkMsTUFOcUIsRUFNYkMsT0FOYTs7QUFZOUMsVUFBS0UsY0FBTCxHQUFzQixtQkFBdEI7O0FBRUE7Ozs7QUFJQSxVQUFLQyxnQkFBTCxHQUF3QixLQUF4QjtBQWxCOEM7QUFtQi9DOzs7OytCQUVVO0FBQ1Q7O0FBRUEsVUFBSSxDQUFDLEtBQUtBLGdCQUFWLEVBQTRCO0FBQzFCOzs7O0FBSUEsYUFBS0MsT0FBTCxHQUFlLEtBQUtDLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QixRQUF2QixDQUFmOztBQUVBOzs7O0FBSUEsYUFBS0MsR0FBTCxHQUFXLEtBQUtILE9BQUwsQ0FBYUksVUFBYixDQUF3QixJQUF4QixDQUFYOztBQUVBOzs7OztBQUtBLGFBQUtDLGVBQUwsR0FBdUIsNkJBQW1CLEtBQUtGLEdBQXhCLEVBQTZCLEtBQUtQLE9BQUwsQ0FBYUMsa0JBQTFDLENBQXZCOztBQUVBO0FBQ0EsYUFBS0UsZ0JBQUwsR0FBd0IsSUFBeEI7QUFDRDtBQUNGOzs7NkJBRVFPLGEsRUFBZUMsYyxFQUFnQkMsVyxFQUFhO0FBQUE7O0FBQ25ELDZJQUFlRixhQUFmLEVBQThCQyxjQUE5QixFQUE4Q0MsV0FBOUM7QUFDQSxXQUFLSCxlQUFMLENBQXFCSSxRQUFyQixDQUE4QkgsYUFBOUIsRUFBNkNDLGNBQTdDOztBQUVBO0FBQ0EsV0FBS1QsY0FBTCxDQUFvQlksT0FBcEIsQ0FBNEIsVUFBQ0MsUUFBRDtBQUFBLGVBQWMsT0FBS04sZUFBTCxDQUFxQk8sR0FBckIsQ0FBeUJELFFBQXpCLENBQWQ7QUFBQSxPQUE1QjtBQUNBLFdBQUtiLGNBQUwsQ0FBb0JlLEtBQXBCO0FBQ0Q7O0FBRUQ7Ozs7O0FBS0E7Ozs7Ozs7Ozs7aUNBT2FDLFEsRUFBVTtBQUNyQixXQUFLVCxlQUFMLENBQXFCVSxTQUFyQixHQUFpQ0QsU0FBU0UsSUFBVCxDQUFjLEtBQUtYLGVBQW5CLENBQWpDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2dDQUtZTSxRLEVBQVU7QUFDcEIsVUFBSSxLQUFLTSxTQUFULEVBQ0UsS0FBS1osZUFBTCxDQUFxQk8sR0FBckIsQ0FBeUJELFFBQXpCLEVBREYsS0FHRSxLQUFLYixjQUFMLENBQW9CYyxHQUFwQixDQUF3QkQsUUFBeEI7QUFDSDs7QUFFRDs7Ozs7Ozs7bUNBS2VBLFEsRUFBVTtBQUN2QixVQUFJLEtBQUtNLFNBQVQsRUFDRSxLQUFLWixlQUFMLENBQXFCYSxNQUFyQixDQUE0QlAsUUFBNUIsRUFERixLQUdFLEtBQUtiLGNBQUwsQ0FBb0JxQixNQUFwQixDQUEyQlIsUUFBM0I7QUFDSDs7Ozs7a0JBR1luQixVIiwiZmlsZSI6IkNhbnZhc1ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VnbWVudGVkVmlldyBmcm9tICcuL1NlZ21lbnRlZFZpZXcnO1xuaW1wb3J0IFJlbmRlcmluZ0dyb3VwIGZyb20gJy4vUmVuZGVyaW5nR3JvdXAnO1xuXG5cbmNvbnN0IGRlZmF1bHRDYW52YXNUZW1wbGF0ZSA9IGBcbiAgPGNhbnZhcyBjbGFzcz1cImJhY2tncm91bmRcIj48L2NhbnZhcz5cbiAgPGRpdiBjbGFzcz1cImZvcmVncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj48JT0gdG9wICU+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+PCU9IGNlbnRlciAlPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPjwlPSBib3R0b20gJT48L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG4vKipcbiAqIFZpZXcgZGVzaWduZWQgZm9yIGV4cGVyaWVuY2VzIHdoZXJlIDJkIGdyYXBoaWNhbCByZW5kZXJpbmcgaXMgbmVlZGVkLlxuICogVGhlIHZpZXcgaXMgYmFzaWNhbGx5IGEgYFNlZ21lbnRlZFZpZXdgIHdpdGggYSBgY2FudmFzYCBlbGVtZW50IGluXG4gKiB0aGUgYmFja2dyb3VuZC5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNlZ21lbnRlZFZpZXd9XG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld31cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5SZW5kZXJlcn1cbiAqL1xuY2xhc3MgQ2FudmFzVmlldyBleHRlbmRzIFNlZ21lbnRlZFZpZXcge1xuICAvKipcbiAgICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBWaWV3cyBzaG91bGQgcHJlZmVyYWJseSBieVxuICAgKiBjcmVhdGVkIHVzaW5nIHRoZSBbYEV4cGVyaWVuY2UjY3JlYXRlVmlld2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5FeHBlcmllbmNlI2NyZWF0ZVZpZXd9XG4gICAqIG1ldGhvZC5fXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZSAtIFRlbXBsYXRlIG9mIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIE9iamVjdCBjb250YWluaW5nIHRoZSB2YXJpYWJsZXMgdXNlZCB0byBwb3B1bGF0ZVxuICAgKiAgdGhlIHRlbXBsYXRlLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjY29udGVudH0uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBMaXN0ZW5lcnMgdG8gaW5zdGFsbCBpbiB0aGUgdmlld1xuICAgKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2V2ZW50c30uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgdmlldy5cbiAgICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvcHRpb25zfS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpIHtcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlIHx8IGRlZmF1bHRDYW52YXNUZW1wbGF0ZTtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICBwcmVzZXJ2ZVBpeGVsUmF0aW86IGZhbHNlLFxuICAgIH0sIG9wdGlvbnMpO1xuXG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUZW1wb3Jhcnkgc3RhY2sgdGhlIHJlbmRlcmVycyB3aGVuIHRoZSB2aWV3IGlzIG5vdCB2aXNpYmxlLlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICovXG4gICAgdGhpcy5fcmVuZGVyZXJTdGFjayA9IG5ldyBTZXQoKTtcblxuICAgIC8qKlxuICAgICAqIEZsYWcgdG8gdHJhY2sgdGhlIGZpcnN0IGByZW5kZXJgIGNhbGxcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9oYXNSZW5kZXJlZE9uY2UgPSBmYWxzZTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIHN1cGVyLm9uUmVuZGVyKCk7XG5cbiAgICBpZiAoIXRoaXMuX2hhc1JlbmRlcmVkT25jZSkge1xuICAgICAgLyoqXG4gICAgICAgKiBUaGUgY2FudmFzIGVsZW1lbnQgdG8gZHJhdyBpbnRvLlxuICAgICAgICogQHR5cGUge0VsZW1lbnR9XG4gICAgICAgKi9cbiAgICAgIHRoaXMuJGNhbnZhcyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSAyZCBjb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAgICAgKiBAdHlwZSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfVxuICAgICAgICovXG4gICAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAvKipcbiAgICAgICAqIFRoZSBkZWZhdWx0IHJlbmRlcmluZyBncm91cC5cbiAgICAgICAqIEB0eXBlIHtSZW5kZXJpbmdHcm91cH1cbiAgICAgICAqIEBwcml2YXRlXG4gICAgICAgKi9cbiAgICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwID0gbmV3IFJlbmRlcmluZ0dyb3VwKHRoaXMuY3R4LCB0aGlzLm9wdGlvbnMucHJlc2VydmVQaXhlbFJhdGlvKTtcblxuICAgICAgLy8gcHJldmVudCBjcmVhdGluZyBhIG5ldyByZW5kZXJpbmcgZ3JvdXAgZWFjaCB0aW1lIHRoZSB2aWV3IGlzIHJlLXJlbmRlcmVkXG4gICAgICB0aGlzLl9oYXNSZW5kZXJlZE9uY2UgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbik7XG4gICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAub25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpO1xuXG4gICAgLy8gYWRkIHN0YWNrZWQgcmVuZGVyZXJzIHRvIHRoZSByZW5kZXJpbmcgZ3JvdXBcbiAgICB0aGlzLl9yZW5kZXJlclN0YWNrLmZvckVhY2goKHJlbmRlcmVyKSA9PiB0aGlzLl9yZW5kZXJpbmdHcm91cC5hZGQocmVuZGVyZXIpKTtcbiAgICB0aGlzLl9yZW5kZXJlclN0YWNrLmNsZWFyKCk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNWaWV3fnByZVJlbmRlcmVyXG4gICAqIEBwYXJhbSB7Q2FudmFzUmVuZGVyaW5nQ29udGV4dDJEfSBjdHggLSBDb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkdCAtIERlbHRhIHRpbWUgaW4gc2Vjb25kcyBzaW5jZSB0aGUgbGFzdCByZW5kZXJpbmcgY3ljbGUuXG4gICAqL1xuICAvKipcbiAgICogRGVmaW5lcyBhIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIGJlZm9yZSBhbGxcbiAgICogW2BSZW5kZXJlciNyZW5kZXJgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUmVuZGVyZXIjcmVuZGVyfVxuICAgKiBhdCBlYWNoIGN5Y2xlLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5DYW52YXNWaWV3fnByZVJlbmRlcmVyfSBjYWxsYmFjayAtIEZ1bmN0aW9uXG4gICAqICB0byBleGVjdXRlIGJlZm9yZSBhZWNoIHJlbmRlcmluZyBjeWNsZS5cbiAgICovXG4gIHNldFByZVJlbmRlcihjYWxsYmFjaykge1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnByZVJlbmRlciA9IGNhbGxiYWNrLmJpbmQodGhpcy5fcmVuZGVyaW5nR3JvdXApO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmVyIHRvIHRoZSBgUmVuZGVyaW5nR3JvdXBgLiBUaGUgcmVuZGVyZXIgaXMgYXV0b21hdGljYWxseVxuICAgKiBhY3RpdmF0ZWQgd2hlbiBhZGRlZCB0byB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyfSByZW5kZXJlciAtIFJlbmRlcmVyIHRvIGFkZC5cbiAgICovXG4gIGFkZFJlbmRlcmVyKHJlbmRlcmVyKSB7XG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAuYWRkKHJlbmRlcmVyKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9yZW5kZXJlclN0YWNrLmFkZChyZW5kZXJlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVuZGVyZXIgdG8gdGhlIGBSZW5kZXJpbmdHcm91cGAuIFRoZSByZW5kZXJlciBpcyBhdXRvbWF0aWNhbGx5XG4gICAqIGRpc2FjdGl2YXRlZCB3aGVuIHJlbW92ZWQgZnJvbSB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlJlbmRlcmVyfSByZW5kZXJlciAtIFJlbmRlcmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVJlbmRlcmVyKHJlbmRlcmVyKSB7XG4gICAgaWYgKHRoaXMuaXNWaXNpYmxlKVxuICAgICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAucmVtb3ZlKHJlbmRlcmVyKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9yZW5kZXJlclN0YWNrLmRlbGV0ZShyZW5kZXJlcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2FudmFzVmlldztcbiJdfQ==
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _SegmentedView2 = require('./SegmentedView');

var _SegmentedView3 = _interopRequireDefault(_SegmentedView2);

var _RenderingGroup = require('./RenderingGroup');

var _RenderingGroup2 = _interopRequireDefault(_RenderingGroup);

var defaultCanvasTemplate = '\n  <canvas class="background"></canvas>\n  <div class="foreground">\n    <div class="section-top flex-middle"><%= top %></div>\n    <div class="section-center flex-center"><%= center %></div>\n    <div class="section-bottom flex-middle"><%= bottom %></div>\n  </div>\n';

/**
 * A `SegmentedView` with a `canvas` element in the background. This view should mainly be used in preformances.
 */

var CanvasView = (function (_SegmentedView) {
  _inherits(CanvasView, _SegmentedView);

  function CanvasView(template, content, events, options) {
    _classCallCheck(this, CanvasView);

    template = template || defaultCanvasTemplate;
    _get(Object.getPrototypeOf(CanvasView.prototype), 'constructor', this).call(this, template, content, events, options);
  }

  _createClass(CanvasView, [{
    key: 'onRender',
    value: function onRender() {
      _get(Object.getPrototypeOf(CanvasView.prototype), 'onRender', this).call(this);

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
      this._renderingGroup = new _RenderingGroup2['default'](this.ctx);
    }
  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      _get(Object.getPrototypeOf(CanvasView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
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
})(_SegmentedView3['default']);

exports['default'] = CanvasView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvQ2FudmFzVmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzhCQUEwQixpQkFBaUI7Ozs7OEJBQ2hCLGtCQUFrQjs7OztBQUc3QyxJQUFNLHFCQUFxQixrUkFPMUIsQ0FBQzs7Ozs7O0lBS21CLFVBQVU7WUFBVixVQUFVOztBQUNsQixXQURRLFVBQVUsQ0FDakIsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzBCQUQ3QixVQUFVOztBQUUzQixZQUFRLEdBQUcsUUFBUSxJQUFJLHFCQUFxQixDQUFDO0FBQzdDLCtCQUhpQixVQUFVLDZDQUdyQixRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7R0FDM0M7O2VBSmtCLFVBQVU7O1dBTXJCLG9CQUFHO0FBQ1QsaUNBUGlCLFVBQVUsMENBT1Y7Ozs7OztBQU1qQixVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7Ozs7QUFNaEQsVUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7Ozs7O0FBTXpDLFVBQUksQ0FBQyxlQUFlLEdBQUcsZ0NBQW1CLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNyRDs7O1dBRU8sa0JBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxXQUFXLEVBQUU7QUFDbkQsaUNBN0JpQixVQUFVLDBDQTZCWixhQUFhLEVBQUUsY0FBYyxFQUFFLFdBQVcsRUFBRTtBQUMzRCxVQUFJLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7S0FDOUQ7Ozs7Ozs7O1dBTVcsc0JBQUMsUUFBUSxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxlQUFlLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQ3RFOzs7Ozs7OztXQU1VLHFCQUFDLFFBQVEsRUFBRTtBQUNwQixVQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNwQzs7Ozs7Ozs7V0FNYSx3QkFBQyxRQUFRLEVBQUU7QUFDdkIsVUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkM7OztTQXZEa0IsVUFBVTs7O3FCQUFWLFVBQVUiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9jbGllbnQvZGlzcGxheS9DYW52YXNWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlZ21lbnRlZFZpZXcgZnJvbSAnLi9TZWdtZW50ZWRWaWV3JztcbmltcG9ydCBSZW5kZXJpbmdHcm91cCBmcm9tICcuL1JlbmRlcmluZ0dyb3VwJztcblxuXG5jb25zdCBkZWZhdWx0Q2FudmFzVGVtcGxhdGUgPSBgXG4gIDxjYW52YXMgY2xhc3M9XCJiYWNrZ3JvdW5kXCI+PC9jYW52YXM+XG4gIDxkaXYgY2xhc3M9XCJmb3JlZ3JvdW5kXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PCU9IHRvcCAlPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPjwlPSBjZW50ZXIgJT48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj48JT0gYm90dG9tICU+PC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuLyoqXG4gKiBBIGBTZWdtZW50ZWRWaWV3YCB3aXRoIGEgYGNhbnZhc2AgZWxlbWVudCBpbiB0aGUgYmFja2dyb3VuZC4gVGhpcyB2aWV3IHNob3VsZCBtYWlubHkgYmUgdXNlZCBpbiBwcmVmb3JtYW5jZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc1ZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgfHwgZGVmYXVsdENhbnZhc1RlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYW52YXMgZWxlbWVudCB0byBkcmF3IGludG9cbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRjYW52YXMgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSAyZCBjb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAgICogQHR5cGUge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH1cbiAgICAgKi9cbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgcmVuZGVyaW5nIGdyb3VwLlxuICAgICAqIEB0eXBlIHtSZW5kZXJpbmdHcm91cH1cbiAgICAgKi9cbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cCA9IG5ldyBSZW5kZXJpbmdHcm91cCh0aGlzLmN0eCk7XG4gIH1cblxuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZXMgdGhlIGBwcmVSZW5kZXJgIGludGVyZmFjZSBtZXRob2Qgb2YgdGhlIGRlZmF1bHQgYFJlbmRlcmluZ0dyb3VwYCBvZiB0aGUgdmlldy4gY2YuIEBsaW5rIGBSZW5kZXJpbmdHcm91cH5wcmVyZW5kZXJgXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGZ1bmN0aW9uIHRvIHVzZSBhcyBhIHByZS1yZW5kZXIgbWV0aG9kLlxuICAgKi9cbiAgc2V0UHJlUmVuZGVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAucHJlUmVuZGVyID0gY2FsbGJhY2suYmluZCh0aGlzLl9yZW5kZXJpbmdHcm91cCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVuZGVyZXIgdG8gdGhlIGBSZW5kZXJpbmdHcm91cGAuIFRoZSByZW5kZXJlciBpcyBhdXRvbWF0aWNjYWx5IGFjdGl2YXRlZCB3aGVuIGFkZGVkIHRvIHRoZSBncm91cC5cbiAgICogQHBhcmFtIHtSZW5kZXJlcn0gcmVuZGVyZXIgLSBUaGUgcmVuZGVyZXIgdG8gYWRkLlxuICAgKi9cbiAgYWRkUmVuZGVyZXIocmVuZGVyZXIpIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5hZGQocmVuZGVyZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIHJlbmRlcmVyIHRvIHRoZSBgUmVuZGVyaW5nR3JvdXBgLiBUaGUgcmVuZGVyZXIgaXMgYXV0b21hdGljY2FseSBkaXNhY3RpdmF0ZWQgd2hlbiByZW1vdmVkIGZyb20gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnJlbW92ZShyZW5kZXJlcik7XG4gIH1cbn1cbiJdfQ==
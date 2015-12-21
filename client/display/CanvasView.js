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

var defaultCanvasTemplate = '\n  <canvas></canvas>\n  <div class="top">\n    <div class="section-top flex-middle"><%= top %></div>\n    <div class="section-center flex-center"><%= center %></div>\n    <div class="section-bottom"><%= bottom %></div>\n  </div>\n';

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
    value: function onResize(orientation, viewportWidth, viewportHeight) {
      _get(Object.getPrototypeOf(CanvasView.prototype), 'onResize', this).call(this, orientation, viewportWidth, viewportHeight);
      this._renderingGroup.updateSize(viewportWidth, viewportHeight);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9DYW52YXNWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OEJBQTBCLGlCQUFpQjs7Ozs4QkFDaEIsa0JBQWtCOzs7O0FBRzdDLElBQU0scUJBQXFCLDRPQU8xQixDQUFDOzs7Ozs7SUFLbUIsVUFBVTtZQUFWLFVBQVU7O0FBQ2xCLFdBRFEsVUFBVSxDQUNqQixRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7MEJBRDdCLFVBQVU7O0FBRTNCLFlBQVEsR0FBRyxRQUFRLElBQUkscUJBQXFCLENBQUM7QUFDN0MsK0JBSGlCLFVBQVUsNkNBR3JCLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtHQUMzQzs7ZUFKa0IsVUFBVTs7V0FNckIsb0JBQUc7QUFDVCxpQ0FQaUIsVUFBVSwwQ0FPVjs7Ozs7O0FBTWpCLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Ozs7OztBQU1oRCxVQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOzs7Ozs7QUFNekMsVUFBSSxDQUFDLGVBQWUsR0FBRyxnQ0FBbUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3JEOzs7V0FFTyxrQkFBQyxXQUFXLEVBQUUsYUFBYSxFQUFFLGNBQWMsRUFBRTtBQUNuRCxpQ0E3QmlCLFVBQVUsMENBNkJaLFdBQVcsRUFBRSxhQUFhLEVBQUUsY0FBYyxFQUFFO0FBQzNELFVBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztLQUNoRTs7Ozs7Ozs7V0FNVyxzQkFBQyxRQUFRLEVBQUU7QUFDckIsVUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDdEU7Ozs7Ozs7O1dBTVUscUJBQUMsUUFBUSxFQUFFO0FBQ3BCLFVBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3BDOzs7Ozs7OztXQU1hLHdCQUFDLFFBQVEsRUFBRTtBQUN2QixVQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN2Qzs7O1NBdkRrQixVQUFVOzs7cUJBQVYsVUFBVSIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvQ2FudmFzVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZWdtZW50ZWRWaWV3IGZyb20gJy4vU2VnbWVudGVkVmlldyc7XG5pbXBvcnQgUmVuZGVyaW5nR3JvdXAgZnJvbSAnLi9SZW5kZXJpbmdHcm91cCc7XG5cblxuY29uc3QgZGVmYXVsdENhbnZhc1RlbXBsYXRlID0gYFxuICA8Y2FudmFzPjwvY2FudmFzPlxuICA8ZGl2IGNsYXNzPVwidG9wXCI+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PCU9IHRvcCAlPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPjwlPSBjZW50ZXIgJT48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48JT0gYm90dG9tICU+PC9kaXY+XG4gIDwvZGl2PlxuYDtcblxuLyoqXG4gKiBBIGBTZWdtZW50ZWRWaWV3YCB3aXRoIGEgYGNhbnZhc2AgZWxlbWVudCBpbiB0aGUgYmFja2dyb3VuZC4gVGhpcyB2aWV3IHNob3VsZCBtYWlubHkgYmUgdXNlZCBpbiBwcmVmb3JtYW5jZXMuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc1ZpZXcgZXh0ZW5kcyBTZWdtZW50ZWRWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucykge1xuICAgIHRlbXBsYXRlID0gdGVtcGxhdGUgfHwgZGVmYXVsdENhbnZhc1RlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgc3VwZXIub25SZW5kZXIoKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBjYW52YXMgZWxlbWVudCB0byBkcmF3IGludG9cbiAgICAgKiBAdHlwZSB7RWxlbWVudH1cbiAgICAgKi9cbiAgICB0aGlzLiRjYW52YXMgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdjYW52YXMnKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSAyZCBjb250ZXh0IG9mIHRoZSBjYW52YXMuXG4gICAgICogQHR5cGUge0NhbnZhc1JlbmRlcmluZ0NvbnRleHQyRH1cbiAgICAgKi9cbiAgICB0aGlzLmN0eCA9IHRoaXMuJGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGRlZmF1bHQgcmVuZGVyaW5nIGdyb3VwLlxuICAgICAqIEB0eXBlIHtSZW5kZXJpbmdHcm91cH1cbiAgICAgKi9cbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cCA9IG5ldyBSZW5kZXJpbmdHcm91cCh0aGlzLmN0eCk7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgdmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpIHtcbiAgICBzdXBlci5vblJlc2l6ZShvcmllbnRhdGlvbiwgdmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpO1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLnVwZGF0ZVNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgYHByZVJlbmRlcmAgaW50ZXJmYWNlIG1ldGhvZCBvZiB0aGUgZGVmYXVsdCBgUmVuZGVyaW5nR3JvdXBgIG9mIHRoZSB2aWV3LiBjZi4gQGxpbmsgYFJlbmRlcmluZ0dyb3VwfnByZXJlbmRlcmBcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdG8gdXNlIGFzIGEgcHJlLXJlbmRlciBtZXRob2QuXG4gICAqL1xuICBzZXRQcmVSZW5kZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9yZW5kZXJpbmdHcm91cC5wcmVSZW5kZXIgPSBjYWxsYmFjay5iaW5kKHRoaXMuX3JlbmRlcmluZ0dyb3VwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZW5kZXJlciB0byB0aGUgYFJlbmRlcmluZ0dyb3VwYC4gVGhlIHJlbmRlcmVyIGlzIGF1dG9tYXRpY2NhbHkgYWN0aXZhdGVkIHdoZW4gYWRkZWQgdG8gdGhlIGdyb3VwLlxuICAgKiBAcGFyYW0ge1JlbmRlcmVyfSByZW5kZXJlciAtIFRoZSByZW5kZXJlciB0byBhZGQuXG4gICAqL1xuICBhZGRSZW5kZXJlcihyZW5kZXJlcikge1xuICAgIHRoaXMuX3JlbmRlcmluZ0dyb3VwLmFkZChyZW5kZXJlcik7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVuZGVyZXIgdG8gdGhlIGBSZW5kZXJpbmdHcm91cGAuIFRoZSByZW5kZXJlciBpcyBhdXRvbWF0aWNjYWx5IGRpc2FjdGl2YXRlZCB3aGVuIHJlbW92ZWQgZnJvbSB0aGUgZ3JvdXAuXG4gICAqIEBwYXJhbSB7UmVuZGVyZXJ9IHJlbmRlcmVyIC0gVGhlIHJlbmRlcmVyIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVJlbmRlcmVyKHJlbmRlcmVyKSB7XG4gICAgdGhpcy5fcmVuZGVyaW5nR3JvdXAucmVtb3ZlKHJlbmRlcmVyKTtcbiAgfVxufSJdfQ==
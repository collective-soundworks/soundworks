'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

var defaultTemplate = '\n  <div class="section-top"><%= top %></div>\n  <div class="section-center"><%= center %></div>\n  <div class="section-bottom"><%= bottom %></div>\n';

/**
 * [client] - This constructor allow to create views which define vertical ratios among elements.
 * The ratios between the different parts are kept in protrait or landscape orientation.
 */

var SegmentedView = (function (_View) {
  _inherits(SegmentedView, _View);

  function SegmentedView(template) {
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, SegmentedView);

    // fallback on default template if `template = null`
    template = !template ? defaultTemplate : template;
    _get(Object.getPrototypeOf(SegmentedView.prototype), 'constructor', this).call(this, template, content, events, options);

    /**
     * An object containing selectors defined in the template associated with their vertical ratio, the ratio is applyed in both 'portrait' and 'landscape' orientation.
     * @type {Object<String: Number>}
     */
    this.ratios = options.ratios || {
      '.section-top': 0.3,
      '.section-center': 0.5,
      '.section-bottom': 0.2
    };

    this._$sections = {};
  }

  _createClass(SegmentedView, [{
    key: 'onRender',
    value: function onRender() {
      var _this = this;

      _Object$keys(this.ratios).forEach(function (sel) {
        var $el = _this.$el.querySelector(sel);
        _this._$sections[sel] = $el;
      });
    }
  }, {
    key: 'onResize',
    value: function onResize(orientation, width, height) {
      _get(Object.getPrototypeOf(SegmentedView.prototype), 'onResize', this).call(this, orientation, width, height);

      for (var sel in this.ratios) {
        var ratio = this.ratios[sel];
        var $el = this._$sections[sel];

        $el.style.height = ratio * height + 'px';
      }
    }
  }]);

  return SegmentedView;
})(_View3['default']);

exports['default'] = SegmentedView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TZWdtZW50ZWRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLGVBQWUsMEpBSXBCLENBQUM7Ozs7Ozs7SUFNbUIsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxDQUNwQixRQUFRLEVBQTJDO1FBQXpDLE9BQU8seURBQUcsRUFBRTtRQUFFLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRDFDLGFBQWE7OztBQUc5QixZQUFRLEdBQUcsQ0FBQyxRQUFRLEdBQUcsZUFBZSxHQUFHLFFBQVEsQ0FBQztBQUNsRCwrQkFKaUIsYUFBYSw2Q0FJeEIsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzs7Ozs7QUFNMUMsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJO0FBQzlCLG9CQUFjLEVBQUUsR0FBRztBQUNuQix1QkFBaUIsRUFBRSxHQUFHO0FBQ3RCLHVCQUFpQixFQUFFLEdBQUc7S0FDdkIsQ0FBQzs7QUFFRixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUN0Qjs7ZUFqQmtCLGFBQWE7O1dBbUJ4QixvQkFBRzs7O0FBQ1QsbUJBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN4QyxZQUFNLEdBQUcsR0FBRyxNQUFLLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsY0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQzVCLENBQUMsQ0FBQztLQUNKOzs7V0FFTyxrQkFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNuQyxpQ0EzQmlCLGFBQWEsMENBMkJmLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFOztBQUUzQyxXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDM0IsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVqQyxXQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxLQUFLLEdBQUcsTUFBTSxPQUFJLENBQUM7T0FDMUM7S0FDRjs7O1NBbkNrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvU2VnbWVudGVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+PCU9IHRvcCAlPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXJcIj48JT0gY2VudGVyICU+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwlPSBib3R0b20gJT48L2Rpdj5cbmA7XG5cbi8qKlxuICogW2NsaWVudF0gLSBUaGlzIGNvbnN0cnVjdG9yIGFsbG93IHRvIGNyZWF0ZSB2aWV3cyB3aGljaCBkZWZpbmUgdmVydGljYWwgcmF0aW9zIGFtb25nIGVsZW1lbnRzLlxuICogVGhlIHJhdGlvcyBiZXR3ZWVuIHRoZSBkaWZmZXJlbnQgcGFydHMgYXJlIGtlcHQgaW4gcHJvdHJhaXQgb3IgbGFuZHNjYXBlIG9yaWVudGF0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50ZWRWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvLyBmYWxsYmFjayBvbiBkZWZhdWx0IHRlbXBsYXRlIGlmIGB0ZW1wbGF0ZSA9IG51bGxgXG4gICAgdGVtcGxhdGUgPSAhdGVtcGxhdGUgPyBkZWZhdWx0VGVtcGxhdGUgOiB0ZW1wbGF0ZTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCBjb250YWluaW5nIHNlbGVjdG9ycyBkZWZpbmVkIGluIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggdGhlaXIgdmVydGljYWwgcmF0aW8sIHRoZSByYXRpbyBpcyBhcHBseWVkIGluIGJvdGggJ3BvcnRyYWl0JyBhbmQgJ2xhbmRzY2FwZScgb3JpZW50YXRpb24uXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmc6IE51bWJlcj59XG4gICAgICovXG4gICAgdGhpcy5yYXRpb3MgPSBvcHRpb25zLnJhdGlvcyB8fMKge1xuICAgICAgJy5zZWN0aW9uLXRvcCc6IDAuMyxcbiAgICAgICcuc2VjdGlvbi1jZW50ZXInOiAwLjUsXG4gICAgICAnLnNlY3Rpb24tYm90dG9tJzogMC4yLFxuICAgIH07XG5cbiAgICB0aGlzLl8kc2VjdGlvbnMgPSB7fTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMucmF0aW9zKS5mb3JFYWNoKChzZWwpID0+IHtcbiAgICAgIGNvbnN0ICRlbCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcbiAgICAgIHRoaXMuXyRzZWN0aW9uc1tzZWxdID0gJGVsO1xuICAgIH0pO1xuICB9XG5cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzdXBlci5vblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBmb3IgKGxldCBzZWwgaW4gdGhpcy5yYXRpb3MpIHtcbiAgICAgIGNvbnN0IHJhdGlvID0gdGhpcy5yYXRpb3Nbc2VsXTtcbiAgICAgIGNvbnN0ICRlbCA9IHRoaXMuXyRzZWN0aW9uc1tzZWxdO1xuXG4gICAgICAkZWwuc3R5bGUuaGVpZ2h0ID0gYCR7cmF0aW8gKiBoZWlnaHR9cHhgO1xuICAgIH1cbiAgfVxufSJdfQ==
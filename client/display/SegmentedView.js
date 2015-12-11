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

  function SegmentedView(template, content) {
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, SegmentedView);

    // fallback on default template if `template = null`
    template = template === null ? defaultTemplate : template;

    _get(Object.getPrototypeOf(SegmentedView.prototype), 'constructor', this).call(this, template, content, events, options);

    if (this.template === null) {
      this.template = defaultTemplate;
    }

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
        this._$sections[sel].style.height = ratio * height + 'px';
      }
    }
  }]);

  return SegmentedView;
})(_View3['default']);

exports['default'] = SegmentedView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TZWdtZW50ZWRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLGVBQWUsMEpBSXBCLENBQUM7Ozs7Ozs7SUFNbUIsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxDQUNwQixRQUFRLEVBQUUsT0FBTyxFQUE2QjtRQUEzQixNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQURyQyxhQUFhOzs7QUFHOUIsWUFBUSxHQUFHLFFBQVEsS0FBSyxJQUFJLEdBQUcsZUFBZSxHQUFHLFFBQVEsQ0FBQzs7QUFFMUQsK0JBTGlCLGFBQWEsNkNBS3hCLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFMUMsUUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtBQUMxQixVQUFJLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQztLQUNqQzs7Ozs7O0FBTUQsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJO0FBQzlCLG9CQUFjLEVBQUUsR0FBRztBQUNuQix1QkFBaUIsRUFBRSxHQUFHO0FBQ3RCLHVCQUFpQixFQUFFLEdBQUc7S0FDdkIsQ0FBQzs7QUFFRixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUN0Qjs7ZUF0QmtCLGFBQWE7O1dBd0J4QixvQkFBRzs7O0FBQ1QsbUJBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN4QyxZQUFNLEdBQUcsR0FBRyxNQUFLLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsY0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQzVCLENBQUMsQ0FBQztLQUNKOzs7V0FFTyxrQkFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNuQyxpQ0FoQ2lCLGFBQWEsMENBZ0NmLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFOztBQUUzQyxXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDM0IsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixZQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQU0sS0FBSyxHQUFHLE1BQU0sT0FBSSxDQUFDO09BQzNEO0tBQ0Y7OztTQXRDa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1NlZ21lbnRlZFZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCBkZWZhdWx0VGVtcGxhdGUgPSBgXG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwlPSB0b3AgJT48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyXCI+PCU9IGNlbnRlciAlPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48JT0gYm90dG9tICU+PC9kaXY+XG5gO1xuXG4vKipcbiAqIFtjbGllbnRdIC0gVGhpcyBjb25zdHJ1Y3RvciBhbGxvdyB0byBjcmVhdGUgdmlld3Mgd2hpY2ggZGVmaW5lIHZlcnRpY2FsIHJhdGlvcyBhbW9uZyBlbGVtZW50cy5cbiAqIFRoZSByYXRpb3MgYmV0d2VlbiB0aGUgZGlmZmVyZW50IHBhcnRzIGFyZSBrZXB0IGluIHByb3RyYWl0IG9yIGxhbmRzY2FwZSBvcmllbnRhdGlvbi5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VnbWVudGVkVmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGZhbGxiYWNrIG9uIGRlZmF1bHQgdGVtcGxhdGUgaWYgYHRlbXBsYXRlID0gbnVsbGBcbiAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlID09PSBudWxsID8gZGVmYXVsdFRlbXBsYXRlIDogdGVtcGxhdGU7XG5cbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIGlmICh0aGlzLnRlbXBsYXRlID09PSBudWxsKSB7XG4gICAgICB0aGlzLnRlbXBsYXRlID0gZGVmYXVsdFRlbXBsYXRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCBjb250YWluaW5nIHNlbGVjdG9ycyBkZWZpbmVkIGluIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggdGhlaXIgdmVydGljYWwgcmF0aW8sIHRoZSByYXRpbyBpcyBhcHBseWVkIGluIGJvdGggJ3BvcnRyYWl0JyBhbmQgJ2xhbmRzY2FwZScgb3JpZW50YXRpb24uXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmc6IE51bWJlcj59XG4gICAgICovXG4gICAgdGhpcy5yYXRpb3MgPSBvcHRpb25zLnJhdGlvcyB8fMKge1xuICAgICAgJy5zZWN0aW9uLXRvcCc6IDAuMyxcbiAgICAgICcuc2VjdGlvbi1jZW50ZXInOiAwLjUsXG4gICAgICAnLnNlY3Rpb24tYm90dG9tJzogMC4yLFxuICAgIH07XG5cbiAgICB0aGlzLl8kc2VjdGlvbnMgPSB7fTtcbiAgfVxuXG4gIG9uUmVuZGVyKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMucmF0aW9zKS5mb3JFYWNoKChzZWwpID0+IHtcbiAgICAgIGNvbnN0ICRlbCA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3Ioc2VsKTtcbiAgICAgIHRoaXMuXyRzZWN0aW9uc1tzZWxdID0gJGVsO1xuICAgIH0pO1xuICB9XG5cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHdpZHRoLCBoZWlnaHQpIHtcbiAgICBzdXBlci5vblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCk7XG5cbiAgICBmb3IgKGxldCBzZWwgaW4gdGhpcy5yYXRpb3MpIHtcbiAgICAgIGNvbnN0IHJhdGlvID0gdGhpcy5yYXRpb3Nbc2VsXTtcbiAgICAgIHRoaXMuXyRzZWN0aW9uc1tzZWxdLnN0eWxlLmhlaWdodCA9IGAke3JhdGlvICogaGVpZ2h0fXB4YDtcbiAgICB9XG4gIH1cbn0iXX0=
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
      // console.log(ori)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TZWdtZW50ZWRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLGVBQWUsMEpBSXBCLENBQUM7Ozs7Ozs7SUFNbUIsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxDQUNwQixRQUFRLEVBQUUsT0FBTyxFQUE2QjtRQUEzQixNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQURyQyxhQUFhOzs7QUFHOUIsWUFBUSxHQUFHLFFBQVEsS0FBSyxJQUFJLEdBQUcsZUFBZSxHQUFHLFFBQVEsQ0FBQzs7QUFFMUQsK0JBTGlCLGFBQWEsNkNBS3hCLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTs7QUFFMUMsUUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtBQUMxQixVQUFJLENBQUMsUUFBUSxHQUFHLGVBQWUsQ0FBQztLQUNqQzs7Ozs7O0FBTUQsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJO0FBQzlCLG9CQUFjLEVBQUUsR0FBRztBQUNuQix1QkFBaUIsRUFBRSxHQUFHO0FBQ3RCLHVCQUFpQixFQUFFLEdBQUc7S0FDdkIsQ0FBQzs7QUFFRixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUN0Qjs7ZUF0QmtCLGFBQWE7O1dBd0J4QixvQkFBRzs7O0FBQ1QsbUJBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN4QyxZQUFNLEdBQUcsR0FBRyxNQUFLLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsY0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQzVCLENBQUMsQ0FBQztLQUNKOzs7V0FFTyxrQkFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTs7QUFFbkMsaUNBakNpQixhQUFhLDBDQWlDZixXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTs7QUFFM0MsV0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQzNCLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsWUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFNLEtBQUssR0FBRyxNQUFNLE9BQUksQ0FBQztPQUMzRDtLQUNGOzs7U0F2Q2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9TZWdtZW50ZWRWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3QgZGVmYXVsdFRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48JT0gdG9wICU+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlclwiPjwlPSBjZW50ZXIgJT48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PCU9IGJvdHRvbSAlPjwvZGl2PlxuYDtcblxuLyoqXG4gKiBbY2xpZW50XSAtIFRoaXMgY29uc3RydWN0b3IgYWxsb3cgdG8gY3JlYXRlIHZpZXdzIHdoaWNoIGRlZmluZSB2ZXJ0aWNhbCByYXRpb3MgYW1vbmcgZWxlbWVudHMuXG4gKiBUaGUgcmF0aW9zIGJldHdlZW4gdGhlIGRpZmZlcmVudCBwYXJ0cyBhcmUga2VwdCBpbiBwcm90cmFpdCBvciBsYW5kc2NhcGUgb3JpZW50YXRpb24uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRlZFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvLyBmYWxsYmFjayBvbiBkZWZhdWx0IHRlbXBsYXRlIGlmIGB0ZW1wbGF0ZSA9IG51bGxgXG4gICAgdGVtcGxhdGUgPSB0ZW1wbGF0ZSA9PT0gbnVsbCA/IGRlZmF1bHRUZW1wbGF0ZSA6IHRlbXBsYXRlO1xuXG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICBpZiAodGhpcy50ZW1wbGF0ZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy50ZW1wbGF0ZSA9IGRlZmF1bHRUZW1wbGF0ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbiBvYmplY3QgY29udGFpbmluZyBzZWxlY3RvcnMgZGVmaW5lZCBpbiB0aGUgdGVtcGxhdGUgYXNzb2NpYXRlZCB3aXRoIHRoZWlyIHZlcnRpY2FsIHJhdGlvLCB0aGUgcmF0aW8gaXMgYXBwbHllZCBpbiBib3RoICdwb3J0cmFpdCcgYW5kICdsYW5kc2NhcGUnIG9yaWVudGF0aW9uLlxuICAgICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nOiBOdW1iZXI+fVxuICAgICAqL1xuICAgIHRoaXMucmF0aW9zID0gb3B0aW9ucy5yYXRpb3MgfHzCoHtcbiAgICAgICcuc2VjdGlvbi10b3AnOiAwLjMsXG4gICAgICAnLnNlY3Rpb24tY2VudGVyJzogMC41LFxuICAgICAgJy5zZWN0aW9uLWJvdHRvbSc6IDAuMixcbiAgICB9O1xuXG4gICAgdGhpcy5fJHNlY3Rpb25zID0ge307XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJhdGlvcykuZm9yRWFjaCgoc2VsKSA9PiB7XG4gICAgICBjb25zdCAkZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgICB0aGlzLl8kc2VjdGlvbnNbc2VsXSA9ICRlbDtcbiAgICB9KTtcbiAgfVxuXG4gIG9uUmVzaXplKG9yaWVudGF0aW9uLCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgLy8gY29uc29sZS5sb2cob3JpKVxuICAgIHN1cGVyLm9uUmVzaXplKG9yaWVudGF0aW9uLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGZvciAobGV0IHNlbCBpbiB0aGlzLnJhdGlvcykge1xuICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLnJhdGlvc1tzZWxdO1xuICAgICAgdGhpcy5fJHNlY3Rpb25zW3NlbF0uc3R5bGUuaGVpZ2h0ID0gYCR7cmF0aW8gKiBoZWlnaHR9cHhgO1xuICAgIH1cbiAgfVxufSJdfQ==
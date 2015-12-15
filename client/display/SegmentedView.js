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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQWlCLFFBQVE7Ozs7QUFFekIsSUFBTSxlQUFlLDBKQUlwQixDQUFDOzs7Ozs7O0lBTW1CLGFBQWE7WUFBYixhQUFhOztBQUNyQixXQURRLGFBQWEsQ0FDcEIsUUFBUSxFQUEyQztRQUF6QyxPQUFPLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQUQxQyxhQUFhOzs7QUFHOUIsWUFBUSxHQUFHLENBQUMsUUFBUSxHQUFHLGVBQWUsR0FBRyxRQUFRLENBQUM7QUFDbEQsK0JBSmlCLGFBQWEsNkNBSXhCLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTs7Ozs7O0FBTTFDLFFBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSTtBQUM5QixvQkFBYyxFQUFFLEdBQUc7QUFDbkIsdUJBQWlCLEVBQUUsR0FBRztBQUN0Qix1QkFBaUIsRUFBRSxHQUFHO0tBQ3ZCLENBQUM7O0FBRUYsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7R0FDdEI7O2VBakJrQixhQUFhOztXQW1CeEIsb0JBQUc7OztBQUNULG1CQUFZLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDeEMsWUFBTSxHQUFHLEdBQUcsTUFBSyxHQUFHLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3hDLGNBQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztPQUM1QixDQUFDLENBQUM7S0FDSjs7O1dBRU8sa0JBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDbkMsaUNBM0JpQixhQUFhLDBDQTJCZixXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTs7QUFFM0MsV0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQzNCLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDL0IsWUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFakMsV0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQU0sS0FBSyxHQUFHLE1BQU0sT0FBSSxDQUFDO09BQzFDO0tBQ0Y7OztTQW5Da0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3QgZGVmYXVsdFRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48JT0gdG9wICU+PC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlclwiPjwlPSBjZW50ZXIgJT48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PCU9IGJvdHRvbSAlPjwvZGl2PlxuYDtcblxuLyoqXG4gKiBbY2xpZW50XSAtIFRoaXMgY29uc3RydWN0b3IgYWxsb3cgdG8gY3JlYXRlIHZpZXdzIHdoaWNoIGRlZmluZSB2ZXJ0aWNhbCByYXRpb3MgYW1vbmcgZWxlbWVudHMuXG4gKiBUaGUgcmF0aW9zIGJldHdlZW4gdGhlIGRpZmZlcmVudCBwYXJ0cyBhcmUga2VwdCBpbiBwcm90cmFpdCBvciBsYW5kc2NhcGUgb3JpZW50YXRpb24uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlZ21lbnRlZFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGZhbGxiYWNrIG9uIGRlZmF1bHQgdGVtcGxhdGUgaWYgYHRlbXBsYXRlID0gbnVsbGBcbiAgICB0ZW1wbGF0ZSA9ICF0ZW1wbGF0ZSA/IGRlZmF1bHRUZW1wbGF0ZSA6IHRlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgc2VsZWN0b3JzIGRlZmluZWQgaW4gdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCB0aGVpciB2ZXJ0aWNhbCByYXRpbywgdGhlIHJhdGlvIGlzIGFwcGx5ZWQgaW4gYm90aCAncG9ydHJhaXQnIGFuZCAnbGFuZHNjYXBlJyBvcmllbnRhdGlvbi5cbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZzogTnVtYmVyPn1cbiAgICAgKi9cbiAgICB0aGlzLnJhdGlvcyA9IG9wdGlvbnMucmF0aW9zIHx8wqB7XG4gICAgICAnLnNlY3Rpb24tdG9wJzogMC4zLFxuICAgICAgJy5zZWN0aW9uLWNlbnRlcic6IDAuNSxcbiAgICAgICcuc2VjdGlvbi1ib3R0b20nOiAwLjIsXG4gICAgfTtcblxuICAgIHRoaXMuXyRzZWN0aW9ucyA9IHt9O1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5yYXRpb3MpLmZvckVhY2goKHNlbCkgPT4ge1xuICAgICAgY29uc3QgJGVsID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgICAgdGhpcy5fJHNlY3Rpb25zW3NlbF0gPSAkZWw7XG4gICAgfSk7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCkge1xuICAgIHN1cGVyLm9uUmVzaXplKG9yaWVudGF0aW9uLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGZvciAobGV0IHNlbCBpbiB0aGlzLnJhdGlvcykge1xuICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLnJhdGlvc1tzZWxdO1xuICAgICAgY29uc3QgJGVsID0gdGhpcy5fJHNlY3Rpb25zW3NlbF07XG5cbiAgICAgICRlbC5zdHlsZS5oZWlnaHQgPSBgJHtyYXRpbyAqIGhlaWdodH1weGA7XG4gICAgfVxuICB9XG59Il19
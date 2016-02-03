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

var defaultTemplate = '\n  <div class="section-top flex-middle"><p><%= top %></p></div>\n  <div class="section-center flex-center"><p><%= center %></p></div>\n  <div class="section-bottom flex-middle"><p><%= bottom %></p></div>\n';

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
     * @type {Object<String:Number>}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TZWdtZW50ZWRWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLGVBQWUsbU5BSXBCLENBQUM7Ozs7Ozs7SUFNbUIsYUFBYTtZQUFiLGFBQWE7O0FBQ3JCLFdBRFEsYUFBYSxDQUNwQixRQUFRLEVBQTJDO1FBQXpDLE9BQU8seURBQUcsRUFBRTtRQUFFLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBRDFDLGFBQWE7OztBQUc5QixZQUFRLEdBQUcsQ0FBQyxRQUFRLEdBQUcsZUFBZSxHQUFHLFFBQVEsQ0FBQztBQUNsRCwrQkFKaUIsYUFBYSw2Q0FJeEIsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOzs7Ozs7QUFNMUMsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJO0FBQzlCLG9CQUFjLEVBQUUsR0FBRztBQUNuQix1QkFBaUIsRUFBRSxHQUFHO0FBQ3RCLHVCQUFpQixFQUFFLEdBQUc7S0FDdkIsQ0FBQzs7QUFFRixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUN0Qjs7ZUFqQmtCLGFBQWE7O1dBbUJ4QixvQkFBRzs7O0FBQ1QsbUJBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUN4QyxZQUFNLEdBQUcsR0FBRyxNQUFLLEdBQUcsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEMsY0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO09BQzVCLENBQUMsQ0FBQztLQUNKOzs7V0FFTyxrQkFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNuQyxpQ0EzQmlCLGFBQWEsMENBMkJmLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFOztBQUUzQyxXQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7QUFDM0IsWUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQixZQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVqQyxXQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxLQUFLLEdBQUcsTUFBTSxPQUFJLENBQUM7T0FDMUM7S0FDRjs7O1NBbkNrQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvU2VnbWVudGVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PHA+PCU9IHRvcCAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+PHA+PCU9IGNlbnRlciAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PHA+PCU9IGJvdHRvbSAlPjwvcD48L2Rpdj5cbmA7XG5cbi8qKlxuICogW2NsaWVudF0gLSBUaGlzIGNvbnN0cnVjdG9yIGFsbG93IHRvIGNyZWF0ZSB2aWV3cyB3aGljaCBkZWZpbmUgdmVydGljYWwgcmF0aW9zIGFtb25nIGVsZW1lbnRzLlxuICogVGhlIHJhdGlvcyBiZXR3ZWVuIHRoZSBkaWZmZXJlbnQgcGFydHMgYXJlIGtlcHQgaW4gcHJvdHJhaXQgb3IgbGFuZHNjYXBlIG9yaWVudGF0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50ZWRWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvLyBmYWxsYmFjayBvbiBkZWZhdWx0IHRlbXBsYXRlIGlmIGB0ZW1wbGF0ZSA9IG51bGxgXG4gICAgdGVtcGxhdGUgPSAhdGVtcGxhdGUgPyBkZWZhdWx0VGVtcGxhdGUgOiB0ZW1wbGF0ZTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCBjb250YWluaW5nIHNlbGVjdG9ycyBkZWZpbmVkIGluIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggdGhlaXIgdmVydGljYWwgcmF0aW8sIHRoZSByYXRpbyBpcyBhcHBseWVkIGluIGJvdGggJ3BvcnRyYWl0JyBhbmQgJ2xhbmRzY2FwZScgb3JpZW50YXRpb24uXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmc6TnVtYmVyPn1cbiAgICAgKi9cbiAgICB0aGlzLnJhdGlvcyA9IG9wdGlvbnMucmF0aW9zIHx8wqB7XG4gICAgICAnLnNlY3Rpb24tdG9wJzogMC4zLFxuICAgICAgJy5zZWN0aW9uLWNlbnRlcic6IDAuNSxcbiAgICAgICcuc2VjdGlvbi1ib3R0b20nOiAwLjIsXG4gICAgfTtcblxuICAgIHRoaXMuXyRzZWN0aW9ucyA9IHt9O1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5yYXRpb3MpLmZvckVhY2goKHNlbCkgPT4ge1xuICAgICAgY29uc3QgJGVsID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgICAgdGhpcy5fJHNlY3Rpb25zW3NlbF0gPSAkZWw7XG4gICAgfSk7XG4gIH1cblxuICBvblJlc2l6ZShvcmllbnRhdGlvbiwgd2lkdGgsIGhlaWdodCkge1xuICAgIHN1cGVyLm9uUmVzaXplKG9yaWVudGF0aW9uLCB3aWR0aCwgaGVpZ2h0KTtcblxuICAgIGZvciAobGV0IHNlbCBpbiB0aGlzLnJhdGlvcykge1xuICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLnJhdGlvc1tzZWxdO1xuICAgICAgY29uc3QgJGVsID0gdGhpcy5fJHNlY3Rpb25zW3NlbF07XG5cbiAgICAgICRlbC5zdHlsZS5oZWlnaHQgPSBgJHtyYXRpbyAqIGhlaWdodH1weGA7XG4gICAgfVxuICB9XG59XG4iXX0=
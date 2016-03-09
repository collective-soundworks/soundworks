'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

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

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultTemplate = '\n  <div class="section-top flex-middle"><p><%= top %></p></div>\n  <div class="section-center flex-center"><p><%= center %></p></div>\n  <div class="section-bottom flex-middle"><p><%= bottom %></p></div>\n';

/**
 * [client] - This constructor allow to create views which define vertical ratios among elements.
 * The ratios between the different parts are kept in protrait or landscape orientation.
 */

var SegmentedView = function (_View) {
  (0, _inherits3.default)(SegmentedView, _View);

  function SegmentedView(template) {
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
    (0, _classCallCheck3.default)(this, SegmentedView);

    // fallback on default template if `template = null`
    template = !template ? defaultTemplate : template;


    /**
     * An object containing selectors defined in the template associated with their vertical ratio, the ratio is applyed in both 'portrait' and 'landscape' orientation.
     * @type {Object<String:Number>}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SegmentedView).call(this, template, content, events, options));

    _this.ratios = options.ratios || {
      '.section-top': 0.3,
      '.section-center': 0.5,
      '.section-bottom': 0.2
    };

    _this._$sections = {};
    return _this;
  }

  (0, _createClass3.default)(SegmentedView, [{
    key: 'onRender',
    value: function onRender() {
      var _this2 = this;

      (0, _keys2.default)(this.ratios).forEach(function (sel) {
        var $el = _this2.$el.querySelector(sel);
        _this2._$sections[sel] = $el;
      });
    }
  }, {
    key: 'onResize',
    value: function onResize(width, height, orientation) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SegmentedView.prototype), 'onResize', this).call(this, width, height, orientation);

      for (var sel in this.ratios) {
        var ratio = this.ratios[sel];
        var $el = this._$sections[sel];

        $el.style.height = ratio * height + 'px';
      }
    }
  }]);
  return SegmentedView;
}(_View3.default);

exports.default = SegmentedView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRlZFZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNLGtPQUFOOzs7Ozs7O0lBVXFCOzs7QUFDbkIsV0FEbUIsYUFDbkIsQ0FBWSxRQUFaLEVBQStEO1FBQXpDLGdFQUFVLGtCQUErQjtRQUEzQiwrREFBUyxrQkFBa0I7UUFBZCxnRUFBVSxrQkFBSTt3Q0FENUMsZUFDNEM7OztBQUU3RCxlQUFXLENBQUMsUUFBRCxHQUFZLGVBQVosR0FBOEIsUUFBOUIsQ0FGa0Q7Ozs7Ozs7OzZGQUQ1QywwQkFJWCxVQUFVLFNBQVMsUUFBUSxVQUg0Qjs7QUFTN0QsVUFBSyxNQUFMLEdBQWMsUUFBUSxNQUFSLElBQWtCO0FBQzlCLHNCQUFnQixHQUFoQjtBQUNBLHlCQUFtQixHQUFuQjtBQUNBLHlCQUFtQixHQUFuQjtLQUhZLENBVCtDOztBQWU3RCxVQUFLLFVBQUwsR0FBa0IsRUFBbEIsQ0FmNkQ7O0dBQS9EOzs2QkFEbUI7OytCQW1CUjs7O0FBQ1QsMEJBQVksS0FBSyxNQUFMLENBQVosQ0FBeUIsT0FBekIsQ0FBaUMsVUFBQyxHQUFELEVBQVM7QUFDeEMsWUFBTSxNQUFNLE9BQUssR0FBTCxDQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBTixDQURrQztBQUV4QyxlQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsSUFBdUIsR0FBdkIsQ0FGd0M7T0FBVCxDQUFqQyxDQURTOzs7OzZCQU9GLE9BQU8sUUFBUSxhQUFhO0FBQ25DLHVEQTNCaUIsdURBMkJGLE9BQU8sUUFBUSxZQUE5QixDQURtQzs7QUFHbkMsV0FBSyxJQUFJLEdBQUosSUFBVyxLQUFLLE1BQUwsRUFBYTtBQUMzQixZQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksR0FBWixDQUFSLENBRHFCO0FBRTNCLFlBQU0sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBTixDQUZxQjs7QUFJM0IsWUFBSSxLQUFKLENBQVUsTUFBVixHQUFzQixRQUFRLE1BQVIsT0FBdEIsQ0FKMkI7T0FBN0I7OztTQTdCaUIiLCJmaWxlIjoiU2VnbWVudGVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PHA+PCU9IHRvcCAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+PHA+PCU9IGNlbnRlciAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PHA+PCU9IGJvdHRvbSAlPjwvcD48L2Rpdj5cbmA7XG5cbi8qKlxuICogW2NsaWVudF0gLSBUaGlzIGNvbnN0cnVjdG9yIGFsbG93IHRvIGNyZWF0ZSB2aWV3cyB3aGljaCBkZWZpbmUgdmVydGljYWwgcmF0aW9zIGFtb25nIGVsZW1lbnRzLlxuICogVGhlIHJhdGlvcyBiZXR3ZWVuIHRoZSBkaWZmZXJlbnQgcGFydHMgYXJlIGtlcHQgaW4gcHJvdHJhaXQgb3IgbGFuZHNjYXBlIG9yaWVudGF0aW9uLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZWdtZW50ZWRWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvLyBmYWxsYmFjayBvbiBkZWZhdWx0IHRlbXBsYXRlIGlmIGB0ZW1wbGF0ZSA9IG51bGxgXG4gICAgdGVtcGxhdGUgPSAhdGVtcGxhdGUgPyBkZWZhdWx0VGVtcGxhdGUgOiB0ZW1wbGF0ZTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCBjb250YWluaW5nIHNlbGVjdG9ycyBkZWZpbmVkIGluIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggdGhlaXIgdmVydGljYWwgcmF0aW8sIHRoZSByYXRpbyBpcyBhcHBseWVkIGluIGJvdGggJ3BvcnRyYWl0JyBhbmQgJ2xhbmRzY2FwZScgb3JpZW50YXRpb24uXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmc6TnVtYmVyPn1cbiAgICAgKi9cbiAgICB0aGlzLnJhdGlvcyA9IG9wdGlvbnMucmF0aW9zIHx8wqB7XG4gICAgICAnLnNlY3Rpb24tdG9wJzogMC4zLFxuICAgICAgJy5zZWN0aW9uLWNlbnRlcic6IDAuNSxcbiAgICAgICcuc2VjdGlvbi1ib3R0b20nOiAwLjIsXG4gICAgfTtcblxuICAgIHRoaXMuXyRzZWN0aW9ucyA9IHt9O1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5yYXRpb3MpLmZvckVhY2goKHNlbCkgPT4ge1xuICAgICAgY29uc3QgJGVsID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgICAgdGhpcy5fJHNlY3Rpb25zW3NlbF0gPSAkZWw7XG4gICAgfSk7XG4gIH1cblxuICBvblJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKTtcblxuICAgIGZvciAobGV0IHNlbCBpbiB0aGlzLnJhdGlvcykge1xuICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLnJhdGlvc1tzZWxdO1xuICAgICAgY29uc3QgJGVsID0gdGhpcy5fJHNlY3Rpb25zW3NlbF07XG5cbiAgICAgICRlbC5zdHlsZS5oZWlnaHQgPSBgJHtyYXRpbyAqIGhlaWdodH1weGA7XG4gICAgfVxuICB9XG59XG4iXX0=
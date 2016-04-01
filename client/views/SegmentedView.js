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
 * Create views which keep defined vertical ratios among elements. These ratios
 * are kept between the different parts in portrait and landscape orientation.
 * The default Segmented view defines a layout with 3 verticals parts.
 *
 * Others ratios can be defined by creating a new template and defining the
 * ratios of the different elements by defining the ratio entry in the options.
 * The sum of all the ratios should be equal to 1.
 *
 * @memberof module:soundworks/client
 * @extends {module:soundworks/client.View}
 */

var SegmentedView = function (_View) {
  (0, _inherits3.default)(SegmentedView, _View);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRlZFZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNLGtPQUFOOzs7Ozs7Ozs7Ozs7Ozs7SUFrQk07Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY0osV0FkSSxhQWNKLENBQVksUUFBWixFQUErRDtRQUF6QyxnRUFBVSxrQkFBK0I7UUFBM0IsK0RBQVMsa0JBQWtCO1FBQWQsZ0VBQVUsa0JBQUk7d0NBZDNELGVBYzJEOzs7QUFFN0QsZUFBVyxDQUFDLFFBQUQsR0FBWSxlQUFaLEdBQThCLFFBQTlCLENBRmtEOzs7Ozs7Ozs2RkFkM0QsMEJBaUJJLFVBQVUsU0FBUyxRQUFRLFVBSDRCOztBQVM3RCxVQUFLLE1BQUwsR0FBYyxRQUFRLE1BQVIsSUFBa0I7QUFDOUIsc0JBQWdCLEdBQWhCO0FBQ0EseUJBQW1CLEdBQW5CO0FBQ0EseUJBQW1CLEdBQW5CO0tBSFksQ0FUK0M7O0FBZTdELFVBQUssVUFBTCxHQUFrQixFQUFsQixDQWY2RDs7R0FBL0Q7OzZCQWRJOzsrQkFnQ087OztBQUNULDBCQUFZLEtBQUssTUFBTCxDQUFaLENBQXlCLE9BQXpCLENBQWlDLFVBQUMsR0FBRCxFQUFTO0FBQ3hDLFlBQU0sTUFBTSxPQUFLLEdBQUwsQ0FBUyxhQUFULENBQXVCLEdBQXZCLENBQU4sQ0FEa0M7QUFFeEMsZUFBSyxVQUFMLENBQWdCLEdBQWhCLElBQXVCLEdBQXZCLENBRndDO09BQVQsQ0FBakMsQ0FEUzs7Ozs2QkFPRixPQUFPLFFBQVEsYUFBYTtBQUNuQyx1REF4Q0UsdURBd0NhLE9BQU8sUUFBUSxZQUE5QixDQURtQzs7QUFHbkMsV0FBSyxJQUFJLEdBQUosSUFBVyxLQUFLLE1BQUwsRUFBYTtBQUMzQixZQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksR0FBWixDQUFSLENBRHFCO0FBRTNCLFlBQU0sTUFBTSxLQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBTixDQUZxQjs7QUFJM0IsWUFBSSxLQUFKLENBQVUsTUFBVixHQUFzQixRQUFRLE1BQVIsT0FBdEIsQ0FKMkI7T0FBN0I7OztTQTFDRTs7O2tCQW1EUyIsImZpbGUiOiJTZWdtZW50ZWRWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3QgZGVmYXVsdFRlbXBsYXRlID0gYFxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj48cD48JT0gdG9wICU+PC9wPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj48cD48JT0gY2VudGVyICU+PC9wPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj48cD48JT0gYm90dG9tICU+PC9wPjwvZGl2PlxuYDtcblxuLyoqXG4gKiBDcmVhdGUgdmlld3Mgd2hpY2gga2VlcCBkZWZpbmVkIHZlcnRpY2FsIHJhdGlvcyBhbW9uZyBlbGVtZW50cy4gVGhlc2UgcmF0aW9zXG4gKiBhcmUga2VwdCBiZXR3ZWVuIHRoZSBkaWZmZXJlbnQgcGFydHMgaW4gcG9ydHJhaXQgYW5kIGxhbmRzY2FwZSBvcmllbnRhdGlvbi5cbiAqIFRoZSBkZWZhdWx0IFNlZ21lbnRlZCB2aWV3IGRlZmluZXMgYSBsYXlvdXQgd2l0aCAzIHZlcnRpY2FscyBwYXJ0cy5cbiAqXG4gKiBPdGhlcnMgcmF0aW9zIGNhbiBiZSBkZWZpbmVkIGJ5IGNyZWF0aW5nIGEgbmV3IHRlbXBsYXRlIGFuZCBkZWZpbmluZyB0aGVcbiAqIHJhdGlvcyBvZiB0aGUgZGlmZmVyZW50IGVsZW1lbnRzIGJ5IGRlZmluaW5nIHRoZSByYXRpbyBlbnRyeSBpbiB0aGUgb3B0aW9ucy5cbiAqIFRoZSBzdW0gb2YgYWxsIHRoZSByYXRpb3Mgc2hvdWxkIGJlIGVxdWFsIHRvIDEuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3fVxuICovXG5jbGFzcyBTZWdtZW50ZWRWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFZpZXdzIHNob3VsZCBwcmVmZXJhYmx5IGJ5XG4gICAqIGNyZWF0ZWQgdXNpbmcgdGhlIFtgRXhwZXJpZW5jZSNjcmVhdGVWaWV3YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkV4cGVyaWVuY2UjY3JlYXRlVmlld31cbiAgICogbWV0aG9kLl9cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlIC0gVGVtcGxhdGUgb2YgdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhcmlhYmxlcyB1c2VkIHRvIHBvcHVsYXRlXG4gICAqICB0aGUgdGVtcGxhdGUuIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNjb250ZW50fS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIExpc3RlbmVycyB0byBpbnN0YWxsIGluIHRoZSB2aWV3XG4gICAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjZXZlbnRzfS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSB2aWV3LlxuICAgKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I29wdGlvbnN9LlxuICAgKi9cbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGZhbGxiYWNrIG9uIGRlZmF1bHQgdGVtcGxhdGUgaWYgYHRlbXBsYXRlID0gbnVsbGBcbiAgICB0ZW1wbGF0ZSA9ICF0ZW1wbGF0ZSA/IGRlZmF1bHRUZW1wbGF0ZSA6IHRlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgc2VsZWN0b3JzIGRlZmluZWQgaW4gdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCB0aGVpciB2ZXJ0aWNhbCByYXRpbywgdGhlIHJhdGlvIGlzIGFwcGx5ZWQgaW4gYm90aCAncG9ydHJhaXQnIGFuZCAnbGFuZHNjYXBlJyBvcmllbnRhdGlvbi5cbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZzpOdW1iZXI+fVxuICAgICAqL1xuICAgIHRoaXMucmF0aW9zID0gb3B0aW9ucy5yYXRpb3MgfHzCoHtcbiAgICAgICcuc2VjdGlvbi10b3AnOiAwLjMsXG4gICAgICAnLnNlY3Rpb24tY2VudGVyJzogMC41LFxuICAgICAgJy5zZWN0aW9uLWJvdHRvbSc6IDAuMixcbiAgICB9O1xuXG4gICAgdGhpcy5fJHNlY3Rpb25zID0ge307XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJhdGlvcykuZm9yRWFjaCgoc2VsKSA9PiB7XG4gICAgICBjb25zdCAkZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgICB0aGlzLl8kc2VjdGlvbnNbc2VsXSA9ICRlbDtcbiAgICB9KTtcbiAgfVxuXG4gIG9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgZm9yIChsZXQgc2VsIGluIHRoaXMucmF0aW9zKSB7XG4gICAgICBjb25zdCByYXRpbyA9IHRoaXMucmF0aW9zW3NlbF07XG4gICAgICBjb25zdCAkZWwgPSB0aGlzLl8kc2VjdGlvbnNbc2VsXTtcblxuICAgICAgJGVsLnN0eWxlLmhlaWdodCA9IGAke3JhdGlvICogaGVpZ2h0fXB4YDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VnbWVudGVkVmlldztcbiJdfQ==
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
 * ratios of the different elements by overriding the `ratio` option.
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
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck3.default)(this, SegmentedView);

    // fallback on default template if `template = null`
    template = !template ? defaultTemplate : template;

    /**
     * An object containing selectors defined in the template associated with their vertical ratio, the ratio is applyed in both 'portrait' and 'landscape' orientation.
     * @type {Object<String:Number>}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (SegmentedView.__proto__ || (0, _getPrototypeOf2.default)(SegmentedView)).call(this, template, content, events, options));

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
      (0, _get3.default)(SegmentedView.prototype.__proto__ || (0, _getPrototypeOf2.default)(SegmentedView.prototype), 'onResize', this).call(this, width, height, orientation);

      for (var sel in this.ratios) {
        var ratio = this.ratios[sel];
        var $el = this._$sections[sel];

        $el.style.minHeight = ratio * height + 'px';
      }
    }
  }]);
  return SegmentedView;
}(_View3.default);

exports.default = SegmentedView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRlZFZpZXcuanMiXSwibmFtZXMiOlsiZGVmYXVsdFRlbXBsYXRlIiwiU2VnbWVudGVkVmlldyIsInRlbXBsYXRlIiwiY29udGVudCIsImV2ZW50cyIsIm9wdGlvbnMiLCJyYXRpb3MiLCJfJHNlY3Rpb25zIiwiZm9yRWFjaCIsInNlbCIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCJ3aWR0aCIsImhlaWdodCIsIm9yaWVudGF0aW9uIiwicmF0aW8iLCJzdHlsZSIsIm1pbkhlaWdodCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxrT0FBTjs7QUFNQTs7Ozs7Ozs7Ozs7OztJQVlNQyxhOzs7QUFDSjs7Ozs7Ozs7Ozs7OztBQWFBLHlCQUFZQyxRQUFaLEVBQStEO0FBQUEsUUFBekNDLE9BQXlDLHVFQUEvQixFQUErQjtBQUFBLFFBQTNCQyxNQUEyQix1RUFBbEIsRUFBa0I7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDN0Q7QUFDQUgsZUFBVyxDQUFDQSxRQUFELEdBQVlGLGVBQVosR0FBOEJFLFFBQXpDOztBQUdBOzs7O0FBTDZELG9KQUd2REEsUUFIdUQsRUFHN0NDLE9BSDZDLEVBR3BDQyxNQUhvQyxFQUc1QkMsT0FINEI7O0FBUzdELFVBQUtDLE1BQUwsR0FBY0QsUUFBUUMsTUFBUixJQUFrQjtBQUM5QixzQkFBZ0IsR0FEYztBQUU5Qix5QkFBbUIsR0FGVztBQUc5Qix5QkFBbUI7QUFIVyxLQUFoQzs7QUFNQSxVQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBZjZEO0FBZ0I5RDs7OzsrQkFFVTtBQUFBOztBQUNULDBCQUFZLEtBQUtELE1BQWpCLEVBQXlCRSxPQUF6QixDQUFpQyxVQUFDQyxHQUFELEVBQVM7QUFDeEMsWUFBTUMsTUFBTSxPQUFLQSxHQUFMLENBQVNDLGFBQVQsQ0FBdUJGLEdBQXZCLENBQVo7QUFDQSxlQUFLRixVQUFMLENBQWdCRSxHQUFoQixJQUF1QkMsR0FBdkI7QUFDRCxPQUhEO0FBSUQ7Ozs2QkFFUUUsSyxFQUFPQyxNLEVBQVFDLFcsRUFBYTtBQUNuQyxtSkFBZUYsS0FBZixFQUFzQkMsTUFBdEIsRUFBOEJDLFdBQTlCOztBQUVBLFdBQUssSUFBSUwsR0FBVCxJQUFnQixLQUFLSCxNQUFyQixFQUE2QjtBQUMzQixZQUFNUyxRQUFRLEtBQUtULE1BQUwsQ0FBWUcsR0FBWixDQUFkO0FBQ0EsWUFBTUMsTUFBTSxLQUFLSCxVQUFMLENBQWdCRSxHQUFoQixDQUFaOztBQUVBQyxZQUFJTSxLQUFKLENBQVVDLFNBQVYsR0FBeUJGLFFBQVFGLE1BQWpDO0FBQ0Q7QUFDRjs7Ozs7a0JBR1laLGEiLCJmaWxlIjoiU2VnbWVudGVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PHA+PCU9IHRvcCAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+PHA+PCU9IGNlbnRlciAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PHA+PCU9IGJvdHRvbSAlPjwvcD48L2Rpdj5cbmA7XG5cbi8qKlxuICogQ3JlYXRlIHZpZXdzIHdoaWNoIGtlZXAgZGVmaW5lZCB2ZXJ0aWNhbCByYXRpb3MgYW1vbmcgZWxlbWVudHMuIFRoZXNlIHJhdGlvc1xuICogYXJlIGtlcHQgYmV0d2VlbiB0aGUgZGlmZmVyZW50IHBhcnRzIGluIHBvcnRyYWl0IGFuZCBsYW5kc2NhcGUgb3JpZW50YXRpb24uXG4gKiBUaGUgZGVmYXVsdCBTZWdtZW50ZWQgdmlldyBkZWZpbmVzIGEgbGF5b3V0IHdpdGggMyB2ZXJ0aWNhbHMgcGFydHMuXG4gKlxuICogT3RoZXJzIHJhdGlvcyBjYW4gYmUgZGVmaW5lZCBieSBjcmVhdGluZyBhIG5ldyB0ZW1wbGF0ZSBhbmQgZGVmaW5pbmcgdGhlXG4gKiByYXRpb3Mgb2YgdGhlIGRpZmZlcmVudCBlbGVtZW50cyBieSBvdmVycmlkaW5nIHRoZSBgcmF0aW9gIG9wdGlvbi5cbiAqIFRoZSBzdW0gb2YgYWxsIHRoZSByYXRpb3Mgc2hvdWxkIGJlIGVxdWFsIHRvIDEuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMge21vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3fVxuICovXG5jbGFzcyBTZWdtZW50ZWRWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFZpZXdzIHNob3VsZCBwcmVmZXJhYmx5IGJ5XG4gICAqIGNyZWF0ZWQgdXNpbmcgdGhlIFtgRXhwZXJpZW5jZSNjcmVhdGVWaWV3YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkV4cGVyaWVuY2UjY3JlYXRlVmlld31cbiAgICogbWV0aG9kLl9cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IHRlbXBsYXRlIC0gVGVtcGxhdGUgb2YgdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjb250ZW50IC0gT2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhcmlhYmxlcyB1c2VkIHRvIHBvcHVsYXRlXG4gICAqICB0aGUgdGVtcGxhdGUuIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNjb250ZW50fS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIExpc3RlbmVycyB0byBpbnN0YWxsIGluIHRoZSB2aWV3XG4gICAqICB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjZXZlbnRzfS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSB2aWV3LlxuICAgKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I29wdGlvbnN9LlxuICAgKi9cbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGZhbGxiYWNrIG9uIGRlZmF1bHQgdGVtcGxhdGUgaWYgYHRlbXBsYXRlID0gbnVsbGBcbiAgICB0ZW1wbGF0ZSA9ICF0ZW1wbGF0ZSA/IGRlZmF1bHRUZW1wbGF0ZSA6IHRlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogQW4gb2JqZWN0IGNvbnRhaW5pbmcgc2VsZWN0b3JzIGRlZmluZWQgaW4gdGhlIHRlbXBsYXRlIGFzc29jaWF0ZWQgd2l0aCB0aGVpciB2ZXJ0aWNhbCByYXRpbywgdGhlIHJhdGlvIGlzIGFwcGx5ZWQgaW4gYm90aCAncG9ydHJhaXQnIGFuZCAnbGFuZHNjYXBlJyBvcmllbnRhdGlvbi5cbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZzpOdW1iZXI+fVxuICAgICAqL1xuICAgIHRoaXMucmF0aW9zID0gb3B0aW9ucy5yYXRpb3MgfHzCoHtcbiAgICAgICcuc2VjdGlvbi10b3AnOiAwLjMsXG4gICAgICAnLnNlY3Rpb24tY2VudGVyJzogMC41LFxuICAgICAgJy5zZWN0aW9uLWJvdHRvbSc6IDAuMixcbiAgICB9O1xuXG4gICAgdGhpcy5fJHNlY3Rpb25zID0ge307XG4gIH1cblxuICBvblJlbmRlcigpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJhdGlvcykuZm9yRWFjaCgoc2VsKSA9PiB7XG4gICAgICBjb25zdCAkZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgICB0aGlzLl8kc2VjdGlvbnNbc2VsXSA9ICRlbDtcbiAgICB9KTtcbiAgfVxuXG4gIG9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pO1xuXG4gICAgZm9yIChsZXQgc2VsIGluIHRoaXMucmF0aW9zKSB7XG4gICAgICBjb25zdCByYXRpbyA9IHRoaXMucmF0aW9zW3NlbF07XG4gICAgICBjb25zdCAkZWwgPSB0aGlzLl8kc2VjdGlvbnNbc2VsXTtcblxuICAgICAgJGVsLnN0eWxlLm1pbkhlaWdodCA9IGAke3JhdGlvICogaGVpZ2h0fXB4YDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VnbWVudGVkVmlldztcbiJdfQ==
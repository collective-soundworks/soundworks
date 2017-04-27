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
 * _<span class="warning">__WARNING__</span> Views should be created using
 * {@link module:soundworks/client.Activity#createView} method._
 *
 * @param {String} template - Template of the view.
 * @param {Object} content - Object containing the variables used to populate
 *  the template. {@link module:soundworks/client.View#content}.
 * @param {Object} events - Event listeners to install to the view
 *  {@link module:soundworks/client.View#events}.
 * @param {Object} options - Options of the view.
 *  {@link module:soundworks/client.View#options}.
 *
 * @memberof module:soundworks/client
 * @extends {module:soundworks/client.View}
 */

var SegmentedView = function (_View) {
  (0, _inherits3.default)(SegmentedView, _View);

  function SegmentedView(template) {
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck3.default)(this, SegmentedView);

    // fallback on default template if `template = null`
    template = !template ? defaultTemplate : template;

    /**
     * Object associating selectors as defined in the given template associated
     * with their vertical ratio, the ratio is applyed in both 'portrait' and
     * 'landscape' orientation.
     *
     * @type {Object<String:Number>}
     * @name ratios
     * @instance
     * @memberof module:soundworks/client.SegmentedView
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (SegmentedView.__proto__ || (0, _getPrototypeOf2.default)(SegmentedView)).call(this, template, content, events, options));

    _this.ratios = options.ratios || {
      '.section-top': 0.3,
      '.section-center': 0.5,
      '.section-bottom': 0.2
    };

    /**
     * An object containing selectors defined in the template associated
     * with their vertical ratio, the ratio is applyed in both 'portrait'
     * and 'landscape' orientation.
     *
     * @type {Object<String:Element>}
     * @name ratios
     * @instance
     * @memberof module:soundworks/client.SegmentedView
     * @private
     */
    _this._$sections = {};
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SegmentedView, [{
    key: 'onRender',
    value: function onRender() {
      var _this2 = this;

      (0, _keys2.default)(this.ratios).forEach(function (sel) {
        var $el = _this2.$el.querySelector(sel);

        if ($el === null) throw new Error('Unknow selector "' + sel + '"');

        _this2._$sections[sel] = $el;
      });
    }

    /** @private */

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRlZFZpZXcuanMiXSwibmFtZXMiOlsiZGVmYXVsdFRlbXBsYXRlIiwiU2VnbWVudGVkVmlldyIsInRlbXBsYXRlIiwiY29udGVudCIsImV2ZW50cyIsIm9wdGlvbnMiLCJyYXRpb3MiLCJfJHNlY3Rpb25zIiwiZm9yRWFjaCIsInNlbCIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCJFcnJvciIsIndpZHRoIiwiaGVpZ2h0Iiwib3JpZW50YXRpb24iLCJyYXRpbyIsInN0eWxlIiwibWluSGVpZ2h0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7OztBQUVBLElBQU1BLGtPQUFOOztBQU1BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUF1Qk1DLGE7OztBQUNKLHlCQUFZQyxRQUFaLEVBQStEO0FBQUEsUUFBekNDLE9BQXlDLHVFQUEvQixFQUErQjtBQUFBLFFBQTNCQyxNQUEyQix1RUFBbEIsRUFBa0I7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDN0Q7QUFDQUgsZUFBVyxDQUFDQSxRQUFELEdBQVlGLGVBQVosR0FBOEJFLFFBQXpDOztBQUdBOzs7Ozs7Ozs7O0FBTDZELG9KQUd2REEsUUFIdUQsRUFHN0NDLE9BSDZDLEVBR3BDQyxNQUhvQyxFQUc1QkMsT0FINEI7O0FBZTdELFVBQUtDLE1BQUwsR0FBY0QsUUFBUUMsTUFBUixJQUFrQjtBQUM5QixzQkFBZ0IsR0FEYztBQUU5Qix5QkFBbUIsR0FGVztBQUc5Qix5QkFBbUI7QUFIVyxLQUFoQzs7QUFNQTs7Ozs7Ozs7Ozs7QUFXQSxVQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBaEM2RDtBQWlDOUQ7O0FBRUQ7Ozs7OytCQUNXO0FBQUE7O0FBQ1QsMEJBQVksS0FBS0QsTUFBakIsRUFBeUJFLE9BQXpCLENBQWlDLFVBQUNDLEdBQUQsRUFBUztBQUN4QyxZQUFNQyxNQUFNLE9BQUtBLEdBQUwsQ0FBU0MsYUFBVCxDQUF1QkYsR0FBdkIsQ0FBWjs7QUFFQSxZQUFJQyxRQUFRLElBQVosRUFDRSxNQUFNLElBQUlFLEtBQUosdUJBQThCSCxHQUE5QixPQUFOOztBQUVGLGVBQUtGLFVBQUwsQ0FBZ0JFLEdBQWhCLElBQXVCQyxHQUF2QjtBQUNELE9BUEQ7QUFRRDs7QUFFRDs7Ozs2QkFDU0csSyxFQUFPQyxNLEVBQVFDLFcsRUFBYTtBQUNuQyxtSkFBZUYsS0FBZixFQUFzQkMsTUFBdEIsRUFBOEJDLFdBQTlCOztBQUVBLFdBQUssSUFBSU4sR0FBVCxJQUFnQixLQUFLSCxNQUFyQixFQUE2QjtBQUMzQixZQUFNVSxRQUFRLEtBQUtWLE1BQUwsQ0FBWUcsR0FBWixDQUFkO0FBQ0EsWUFBTUMsTUFBTSxLQUFLSCxVQUFMLENBQWdCRSxHQUFoQixDQUFaOztBQUVBQyxZQUFJTyxLQUFKLENBQVVDLFNBQVYsR0FBeUJGLFFBQVFGLE1BQWpDO0FBQ0Q7QUFDRjs7Ozs7a0JBR1liLGEiLCJmaWxlIjoiU2VnbWVudGVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PHA+PCU9IHRvcCAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+PHA+PCU9IGNlbnRlciAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PHA+PCU9IGJvdHRvbSAlPjwvcD48L2Rpdj5cbmA7XG5cbi8qKlxuICogQ3JlYXRlIHZpZXdzIHdoaWNoIGtlZXAgZGVmaW5lZCB2ZXJ0aWNhbCByYXRpb3MgYW1vbmcgZWxlbWVudHMuIFRoZXNlIHJhdGlvc1xuICogYXJlIGtlcHQgYmV0d2VlbiB0aGUgZGlmZmVyZW50IHBhcnRzIGluIHBvcnRyYWl0IGFuZCBsYW5kc2NhcGUgb3JpZW50YXRpb24uXG4gKiBUaGUgZGVmYXVsdCBTZWdtZW50ZWQgdmlldyBkZWZpbmVzIGEgbGF5b3V0IHdpdGggMyB2ZXJ0aWNhbHMgcGFydHMuXG4gKlxuICogT3RoZXJzIHJhdGlvcyBjYW4gYmUgZGVmaW5lZCBieSBjcmVhdGluZyBhIG5ldyB0ZW1wbGF0ZSBhbmQgZGVmaW5pbmcgdGhlXG4gKiByYXRpb3Mgb2YgdGhlIGRpZmZlcmVudCBlbGVtZW50cyBieSBvdmVycmlkaW5nIHRoZSBgcmF0aW9gIG9wdGlvbi5cbiAqIFRoZSBzdW0gb2YgYWxsIHRoZSByYXRpb3Mgc2hvdWxkIGJlIGVxdWFsIHRvIDEuXG4gKlxuICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBWaWV3cyBzaG91bGQgYmUgY3JlYXRlZCB1c2luZ1xuICoge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eSNjcmVhdGVWaWV3fSBtZXRob2QuX1xuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZSAtIFRlbXBsYXRlIG9mIHRoZSB2aWV3LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBPYmplY3QgY29udGFpbmluZyB0aGUgdmFyaWFibGVzIHVzZWQgdG8gcG9wdWxhdGVcbiAqICB0aGUgdGVtcGxhdGUuIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNjb250ZW50fS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBFdmVudCBsaXN0ZW5lcnMgdG8gaW5zdGFsbCB0byB0aGUgdmlld1xuICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNldmVudHN9LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSB2aWV3LlxuICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvcHRpb25zfS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyB7bW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXd9XG4gKi9cbmNsYXNzIFNlZ21lbnRlZFZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgY29uc3RydWN0b3IodGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIC8vIGZhbGxiYWNrIG9uIGRlZmF1bHQgdGVtcGxhdGUgaWYgYHRlbXBsYXRlID0gbnVsbGBcbiAgICB0ZW1wbGF0ZSA9ICF0ZW1wbGF0ZSA/IGRlZmF1bHRUZW1wbGF0ZSA6IHRlbXBsYXRlO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogT2JqZWN0IGFzc29jaWF0aW5nIHNlbGVjdG9ycyBhcyBkZWZpbmVkIGluIHRoZSBnaXZlbiB0ZW1wbGF0ZSBhc3NvY2lhdGVkXG4gICAgICogd2l0aCB0aGVpciB2ZXJ0aWNhbCByYXRpbywgdGhlIHJhdGlvIGlzIGFwcGx5ZWQgaW4gYm90aCAncG9ydHJhaXQnIGFuZFxuICAgICAqICdsYW5kc2NhcGUnIG9yaWVudGF0aW9uLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmc6TnVtYmVyPn1cbiAgICAgKiBAbmFtZSByYXRpb3NcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNlZ21lbnRlZFZpZXdcbiAgICAgKi9cbiAgICB0aGlzLnJhdGlvcyA9IG9wdGlvbnMucmF0aW9zIHx8wqB7XG4gICAgICAnLnNlY3Rpb24tdG9wJzogMC4zLFxuICAgICAgJy5zZWN0aW9uLWNlbnRlcic6IDAuNSxcbiAgICAgICcuc2VjdGlvbi1ib3R0b20nOiAwLjIsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCBjb250YWluaW5nIHNlbGVjdG9ycyBkZWZpbmVkIGluIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkXG4gICAgICogd2l0aCB0aGVpciB2ZXJ0aWNhbCByYXRpbywgdGhlIHJhdGlvIGlzIGFwcGx5ZWQgaW4gYm90aCAncG9ydHJhaXQnXG4gICAgICogYW5kICdsYW5kc2NhcGUnIG9yaWVudGF0aW9uLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmc6RWxlbWVudD59XG4gICAgICogQG5hbWUgcmF0aW9zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TZWdtZW50ZWRWaWV3XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl8kc2VjdGlvbnMgPSB7fTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblJlbmRlcigpIHtcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJhdGlvcykuZm9yRWFjaCgoc2VsKSA9PiB7XG4gICAgICBjb25zdCAkZWwgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKHNlbCk7XG5cbiAgICAgIGlmICgkZWwgPT09IG51bGwpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgVW5rbm93IHNlbGVjdG9yIFwiJHtzZWx9XCJgKTtcblxuICAgICAgdGhpcy5fJHNlY3Rpb25zW3NlbF0gPSAkZWw7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25SZXNpemUod2lkdGgsIGhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbik7XG5cbiAgICBmb3IgKGxldCBzZWwgaW4gdGhpcy5yYXRpb3MpIHtcbiAgICAgIGNvbnN0IHJhdGlvID0gdGhpcy5yYXRpb3Nbc2VsXTtcbiAgICAgIGNvbnN0ICRlbCA9IHRoaXMuXyRzZWN0aW9uc1tzZWxdO1xuXG4gICAgICAkZWwuc3R5bGUubWluSGVpZ2h0ID0gYCR7cmF0aW8gKiBoZWlnaHR9cHhgO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZWdtZW50ZWRWaWV3O1xuIl19
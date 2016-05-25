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

        $el.style.minHeight = ratio * height + 'px';
      }
    }
  }]);
  return SegmentedView;
}(_View3.default);

exports.default = SegmentedView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlZ21lbnRlZFZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNLGtPQUFOOzs7Ozs7Ozs7Ozs7Ozs7SUFrQk0sYTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjSix5QkFBWSxRQUFaLEVBQStEO0FBQUEsUUFBekMsT0FBeUMseURBQS9CLEVBQStCO0FBQUEsUUFBM0IsTUFBMkIseURBQWxCLEVBQWtCO0FBQUEsUUFBZCxPQUFjLHlEQUFKLEVBQUk7QUFBQTs7O0FBRTdELGVBQVcsQ0FBQyxRQUFELEdBQVksZUFBWixHQUE4QixRQUF6Qzs7Ozs7Ozs7QUFGNkQsdUhBR3ZELFFBSHVELEVBRzdDLE9BSDZDLEVBR3BDLE1BSG9DLEVBRzVCLE9BSDRCOztBQVM3RCxVQUFLLE1BQUwsR0FBYyxRQUFRLE1BQVIsSUFBa0I7QUFDOUIsc0JBQWdCLEdBRGM7QUFFOUIseUJBQW1CLEdBRlc7QUFHOUIseUJBQW1CO0FBSFcsS0FBaEM7O0FBTUEsVUFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBZjZEO0FBZ0I5RDs7OzsrQkFFVTtBQUFBOztBQUNULDBCQUFZLEtBQUssTUFBakIsRUFBeUIsT0FBekIsQ0FBaUMsVUFBQyxHQUFELEVBQVM7QUFDeEMsWUFBTSxNQUFNLE9BQUssR0FBTCxDQUFTLGFBQVQsQ0FBdUIsR0FBdkIsQ0FBWjtBQUNBLGVBQUssVUFBTCxDQUFnQixHQUFoQixJQUF1QixHQUF2QjtBQUNELE9BSEQ7QUFJRDs7OzZCQUVRLEssRUFBTyxNLEVBQVEsVyxFQUFhO0FBQ25DLDhHQUFlLEtBQWYsRUFBc0IsTUFBdEIsRUFBOEIsV0FBOUI7O0FBRUEsV0FBSyxJQUFJLEdBQVQsSUFBZ0IsS0FBSyxNQUFyQixFQUE2QjtBQUMzQixZQUFNLFFBQVEsS0FBSyxNQUFMLENBQVksR0FBWixDQUFkO0FBQ0EsWUFBTSxNQUFNLEtBQUssVUFBTCxDQUFnQixHQUFoQixDQUFaOztBQUVBLFlBQUksS0FBSixDQUFVLFNBQVYsR0FBeUIsUUFBUSxNQUFqQztBQUNEO0FBQ0Y7Ozs7O2tCQUdZLGEiLCJmaWxlIjoiU2VnbWVudGVkVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IGRlZmF1bHRUZW1wbGF0ZSA9IGBcbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PHA+PCU9IHRvcCAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+PHA+PCU9IGNlbnRlciAlPjwvcD48L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+PHA+PCU9IGJvdHRvbSAlPjwvcD48L2Rpdj5cbmA7XG5cbi8qKlxuICogQ3JlYXRlIHZpZXdzIHdoaWNoIGtlZXAgZGVmaW5lZCB2ZXJ0aWNhbCByYXRpb3MgYW1vbmcgZWxlbWVudHMuIFRoZXNlIHJhdGlvc1xuICogYXJlIGtlcHQgYmV0d2VlbiB0aGUgZGlmZmVyZW50IHBhcnRzIGluIHBvcnRyYWl0IGFuZCBsYW5kc2NhcGUgb3JpZW50YXRpb24uXG4gKiBUaGUgZGVmYXVsdCBTZWdtZW50ZWQgdmlldyBkZWZpbmVzIGEgbGF5b3V0IHdpdGggMyB2ZXJ0aWNhbHMgcGFydHMuXG4gKlxuICogT3RoZXJzIHJhdGlvcyBjYW4gYmUgZGVmaW5lZCBieSBjcmVhdGluZyBhIG5ldyB0ZW1wbGF0ZSBhbmQgZGVmaW5pbmcgdGhlXG4gKiByYXRpb3Mgb2YgdGhlIGRpZmZlcmVudCBlbGVtZW50cyBieSBkZWZpbmluZyB0aGUgcmF0aW8gZW50cnkgaW4gdGhlIG9wdGlvbnMuXG4gKiBUaGUgc3VtIG9mIGFsbCB0aGUgcmF0aW9zIHNob3VsZCBiZSBlcXVhbCB0byAxLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleHRlbmRzIHttb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlld31cbiAqL1xuY2xhc3MgU2VnbWVudGVkVmlldyBleHRlbmRzIFZpZXcge1xuICAvKipcbiAgICogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBWaWV3cyBzaG91bGQgcHJlZmVyYWJseSBieVxuICAgKiBjcmVhdGVkIHVzaW5nIHRoZSBbYEV4cGVyaWVuY2UjY3JlYXRlVmlld2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5FeHBlcmllbmNlI2NyZWF0ZVZpZXd9XG4gICAqIG1ldGhvZC5fXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZSAtIFRlbXBsYXRlIG9mIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gY29udGVudCAtIE9iamVjdCBjb250YWluaW5nIHRoZSB2YXJpYWJsZXMgdXNlZCB0byBwb3B1bGF0ZVxuICAgKiAgdGhlIHRlbXBsYXRlLiB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlZpZXcjY29udGVudH0uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBMaXN0ZW5lcnMgdG8gaW5zdGFsbCBpbiB0aGUgdmlld1xuICAgKiAge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5WaWV3I2V2ZW50c30uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgdmlldy5cbiAgICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvcHRpb25zfS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICAvLyBmYWxsYmFjayBvbiBkZWZhdWx0IHRlbXBsYXRlIGlmIGB0ZW1wbGF0ZSA9IG51bGxgXG4gICAgdGVtcGxhdGUgPSAhdGVtcGxhdGUgPyBkZWZhdWx0VGVtcGxhdGUgOiB0ZW1wbGF0ZTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIEFuIG9iamVjdCBjb250YWluaW5nIHNlbGVjdG9ycyBkZWZpbmVkIGluIHRoZSB0ZW1wbGF0ZSBhc3NvY2lhdGVkIHdpdGggdGhlaXIgdmVydGljYWwgcmF0aW8sIHRoZSByYXRpbyBpcyBhcHBseWVkIGluIGJvdGggJ3BvcnRyYWl0JyBhbmQgJ2xhbmRzY2FwZScgb3JpZW50YXRpb24uXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmc6TnVtYmVyPn1cbiAgICAgKi9cbiAgICB0aGlzLnJhdGlvcyA9IG9wdGlvbnMucmF0aW9zIHx8wqB7XG4gICAgICAnLnNlY3Rpb24tdG9wJzogMC4zLFxuICAgICAgJy5zZWN0aW9uLWNlbnRlcic6IDAuNSxcbiAgICAgICcuc2VjdGlvbi1ib3R0b20nOiAwLjIsXG4gICAgfTtcblxuICAgIHRoaXMuXyRzZWN0aW9ucyA9IHt9O1xuICB9XG5cbiAgb25SZW5kZXIoKSB7XG4gICAgT2JqZWN0LmtleXModGhpcy5yYXRpb3MpLmZvckVhY2goKHNlbCkgPT4ge1xuICAgICAgY29uc3QgJGVsID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcihzZWwpO1xuICAgICAgdGhpcy5fJHNlY3Rpb25zW3NlbF0gPSAkZWw7XG4gICAgfSk7XG4gIH1cblxuICBvblJlc2l6ZSh3aWR0aCwgaGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHdpZHRoLCBoZWlnaHQsIG9yaWVudGF0aW9uKTtcblxuICAgIGZvciAobGV0IHNlbCBpbiB0aGlzLnJhdGlvcykge1xuICAgICAgY29uc3QgcmF0aW8gPSB0aGlzLnJhdGlvc1tzZWxdO1xuICAgICAgY29uc3QgJGVsID0gdGhpcy5fJHNlY3Rpb25zW3NlbF07XG5cbiAgICAgICRlbC5zdHlsZS5taW5IZWlnaHQgPSBgJHtyYXRpbyAqIGhlaWdodH1weGA7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlZ21lbnRlZFZpZXc7XG4iXX0=
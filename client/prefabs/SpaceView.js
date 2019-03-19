'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _View2 = require('../views/View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var svgTemplate = '\n<div class="svg-container">\n  <svg></svg>\n</div>';

var ns = 'http://www.w3.org/2000/svg';

/**
 * A view that render an `area` object (as defined in server configuration).
 *
 * @param {String} template - Template of the view.
 * @param {Object} content - Object containing the variables used to populate
 *  the template. {@link module:soundworks/client.View#content}.
 * @param {Object} events - Listeners to install in the view
 *  {@link module:soundworks/client.View#events}.
 * @param {Object} options - Options of the view.
 *  {@link module:soundworks/client.View#options}.
 *
 * @memberof module:soundworks/client
 */

var SpaceView = function (_View) {
  (0, _inherits3.default)(SpaceView, _View);

  function SpaceView() {
    var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : svgTemplate;
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck3.default)(this, SpaceView);

    options = (0, _assign2.default)({ className: 'space' }, options);

    /**
     * The area to display.
     *
     * @type {Object}
     * @property {Number} area.width - Width of the area.
     * @property {Number} area.height - Height of the area.
     * @property {String} area.background - Optionnal background image to
     *  display in background.
     * @name area
     * @instance
     * @memberof module:soundworks/client.SpaceView
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (SpaceView.__proto__ || (0, _getPrototypeOf2.default)(SpaceView)).call(this, template, content, events, options));

    _this.area = null;

    /**
     * Width of the rendered area in pixels.
     *
     * @type {Number}
     * @name areaWidth
     * @instance
     * @memberof module:soundworks/client.SpaceView
     */
    _this.areaWidth = null;

    /**
     * Height of the rendered area in pixels.
     *
     * @type {Number}
     * @name areaHeight
     * @instance
     * @memberof module:soundworks/client.SpaceView
     */
    _this.areaHeight = null;

    /**
     * Map associating `$shapes` and their relative `point` object.
     *
     * @type {Map}
     * @name shapePointMap
     * @instance
     * @memberof module:soundworks/client.SpaceView
     */
    _this.shapePointMap = new _map2.default();

    /**
     * Expose a Map of the $shapes and their relative line object.
     * @type {Map}
     * @private
     */
    _this.shapeLineMap = new _map2.default();

    _this._renderedPoints = new _map2.default();
    _this._renderedLines = new _map2.default();
    return _this;
  }

  /**
   * Set the `area` to be renderered.
   *
   * @type {Object} area - Object describing the area, generally defined in
   *  server configuration.
   * @property {Number} area.width - Width of the area.
   * @property {Number} area.height - Height of the area.
   * @property {String} area.background - Optionnal background image to
     *  display in background.
   */


  (0, _createClass3.default)(SpaceView, [{
    key: 'setArea',
    value: function setArea(area) {
      this.area = area;
    }

    /** @private */

  }, {
    key: 'onRender',
    value: function onRender() {
      this.$svgContainer = this.$el.querySelector('.svg-container');
      this.$svg = this.$el.querySelector('svg');
      this.addDefinitions();
      this.renderArea();
    }

    /** @private */

  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      (0, _get3.default)(SpaceView.prototype.__proto__ || (0, _getPrototypeOf2.default)(SpaceView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
      // override size to match parent size if component of another view
      this.$el.style.width = '100%';
      this.$el.style.height = '100%';

      this.renderArea();
    }

    /**
     * Add svg definitions.
     *
     * @private
     */

  }, {
    key: 'addDefinitions',
    value: function addDefinitions() {
      this.$defs = document.createElementNS(ns, 'defs');

      var markerArrow = '\n      <marker id="marker-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">\n          <path d="M0,0 L0,10 L10,5 L0,0" class="marker-arrow" />\n      </marker>\n    ';

      this.$defs.innerHTML = markerArrow;
      this.$svg.insertBefore(this.$defs, this.$svg.firstChild);
    }

    /**
     * Update the displayed area, according to changes in `area` definition or
     * if a `resize` event has been trigerred.
     */

  }, {
    key: 'renderArea',
    value: function renderArea() {
      var area = this.area;
      // use `this.$el` size instead of `this.$parent` size to ignore parent padding
      var boundingRect = this.$el.getBoundingClientRect();
      var containerWidth = boundingRect.width;
      var containerHeight = boundingRect.height;

      this.ratio = Math.min(containerWidth / area.width, containerHeight / area.height);
      var svgWidth = area.width * this.ratio;
      var svgHeight = area.height * this.ratio;

      var top = (containerHeight - svgHeight) / 2;
      var left = (containerWidth - svgWidth) / 2;

      this.$svgContainer.style.width = svgWidth + 'px';
      this.$svgContainer.style.height = svgHeight + 'px';
      this.$svg.setAttribute('width', svgWidth);
      this.$svg.setAttribute('height', svgHeight);
      // center the svg into the parent
      this.$svgContainer.style.position = 'absolute';
      this.$svgContainer.style.top = top + 'px';
      this.$svgContainer.style.left = left + 'px';

      this.$svg.style.position = 'absolute';
      this.$svg.style.top = '0px';
      this.$svg.style.left = '0px';

      // display background if any
      if (area.background) {
        this.$el.style.backgroundImage = 'url(' + area.background + ')';
        this.$el.style.backgroundPosition = '50% 50%';
        this.$el.style.backgroundRepeat = 'no-repeat';
        this.$el.style.backgroundSize = 'contain';
        // force $svg to be transparent
        this.$svg.style.backgroundColor = 'transparent';
      }

      // update existing points position
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(this.shapePointMap), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2),
              $shape = _step$value[0],
              point = _step$value[1];

          this.updatePoint(point);
        } // expose the size of the area in pixel
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.areaWidth = svgWidth;
      this.areaHeight = svgHeight;
    }

    /**
     * Method used to render a specific point. Override this method to display
     * points with user defined shapes. The shape returned by this method is
     * inserted into the `svg` element.
     *
     * @param {Object} point - Point to render.
     * @param {String|Number} point.id - Unique identifier for the point.
     * @param {Number} point.x - Value in the x axis in the area coordinate system.
     * @param {Number} point.y - Value in the y axis in the area coordinate system.
     * @param {Number} [point.radius=0.3] - Radius of the point (relative to the
     *  area width and height).
     * @param {String} [point.color=undefined] - Optionnal color of the point.
     */

  }, {
    key: 'renderPoint',
    value: function renderPoint(point) {
      var $shape = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if ($shape === null) {
        $shape = document.createElementNS(ns, 'circle');
        $shape.classList.add('point');
      }

      $shape.setAttribute('data-id', point.id);
      $shape.setAttribute('cx', '' + point.x * this.ratio);
      $shape.setAttribute('cy', '' + point.y * this.ratio);
      $shape.setAttribute('r', point.radius || 8); // radius is relative to area size

      if (point.color) $shape.style.fill = point.color;

      var method = point.selected ? 'add' : 'remove';
      $shape.classList[method]('selected');

      return $shape;
    }

    /**
     * Replace all the existing points with the given array of points.
     *
     * @param {Array<Object>} points - Points to render.
     */

  }, {
    key: 'setPoints',
    value: function setPoints(points) {
      this.clearPoints();
      this.addPoints(points);
    }

    /**
     * Delete all points.
     */

  }, {
    key: 'clearPoints',
    value: function clearPoints() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this._renderedPoints.keys()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var id = _step2.value;

          this.deletePoint(id);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }

    /**
     * Add new points to the area.
     *
     * @param {Array<Object>} points - New points to add to the view.
     */

  }, {
    key: 'addPoints',
    value: function addPoints(points) {
      var _this2 = this;

      points.forEach(function (point) {
        return _this2.addPoint(point);
      });
    }

    /**
     * Add a new point to the area.
     *
     * @param {Object} point - New point to add to the view.
     */

  }, {
    key: 'addPoint',
    value: function addPoint(point) {
      var $shape = this.renderPoint(point);
      this.$svg.appendChild($shape);
      this._renderedPoints.set(point.id, $shape);
      // map for easier retrieving of the point
      this.shapePointMap.set($shape, point);
    }

    /**
     * Update a point.
     *
     * @param {Object} point - Point to update.
     */

  }, {
    key: 'updatePoint',
    value: function updatePoint(point) {
      var $shape = this._renderedPoints.get(point.id);
      this.renderPoint(point, $shape);
    }

    /**
     * Delete a point.
     *
     * @param {String|Number} id - Id of the point to delete.
     */

  }, {
    key: 'deletePoint',
    value: function deletePoint(id) {
      var $shape = this._renderedPoints.get(id);
      this.$svg.removeChild($shape);
      this._renderedPoints.delete(id);
      // map for easier retrieving of the point
      this.shapePointMap.delete($shape);
    }
  }]);
  return SpaceView;
}(_View3.default);

exports.default = SpaceView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNwYWNlVmlldy5qcyJdLCJuYW1lcyI6WyJzdmdUZW1wbGF0ZSIsIm5zIiwiU3BhY2VWaWV3IiwidGVtcGxhdGUiLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsImNsYXNzTmFtZSIsImFyZWEiLCJhcmVhV2lkdGgiLCJhcmVhSGVpZ2h0Iiwic2hhcGVQb2ludE1hcCIsInNoYXBlTGluZU1hcCIsIl9yZW5kZXJlZFBvaW50cyIsIl9yZW5kZXJlZExpbmVzIiwiJHN2Z0NvbnRhaW5lciIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCIkc3ZnIiwiYWRkRGVmaW5pdGlvbnMiLCJyZW5kZXJBcmVhIiwidmlld3BvcnRXaWR0aCIsInZpZXdwb3J0SGVpZ2h0Iiwib3JpZW50YXRpb24iLCJzdHlsZSIsIndpZHRoIiwiaGVpZ2h0IiwiJGRlZnMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnROUyIsIm1hcmtlckFycm93IiwiaW5uZXJIVE1MIiwiaW5zZXJ0QmVmb3JlIiwiZmlyc3RDaGlsZCIsImJvdW5kaW5nUmVjdCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImNvbnRhaW5lcldpZHRoIiwiY29udGFpbmVySGVpZ2h0IiwicmF0aW8iLCJNYXRoIiwibWluIiwic3ZnV2lkdGgiLCJzdmdIZWlnaHQiLCJ0b3AiLCJsZWZ0Iiwic2V0QXR0cmlidXRlIiwicG9zaXRpb24iLCJiYWNrZ3JvdW5kIiwiYmFja2dyb3VuZEltYWdlIiwiYmFja2dyb3VuZFBvc2l0aW9uIiwiYmFja2dyb3VuZFJlcGVhdCIsImJhY2tncm91bmRTaXplIiwiYmFja2dyb3VuZENvbG9yIiwiJHNoYXBlIiwicG9pbnQiLCJ1cGRhdGVQb2ludCIsImNsYXNzTGlzdCIsImFkZCIsImlkIiwieCIsInkiLCJyYWRpdXMiLCJjb2xvciIsImZpbGwiLCJtZXRob2QiLCJzZWxlY3RlZCIsInBvaW50cyIsImNsZWFyUG9pbnRzIiwiYWRkUG9pbnRzIiwia2V5cyIsImRlbGV0ZVBvaW50IiwiZm9yRWFjaCIsImFkZFBvaW50IiwicmVuZGVyUG9pbnQiLCJhcHBlbmRDaGlsZCIsInNldCIsImdldCIsInJlbW92ZUNoaWxkIiwiZGVsZXRlIiwiVmlldyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFQSxJQUFNQSxvRUFBTjs7QUFLQSxJQUFNQyxLQUFLLDRCQUFYOztBQUVBOzs7Ozs7Ozs7Ozs7OztJQWFNQyxTOzs7QUFDSix1QkFBNkU7QUFBQSxRQUFqRUMsUUFBaUUsdUVBQXRESCxXQUFzRDtBQUFBLFFBQXpDSSxPQUF5Qyx1RUFBL0IsRUFBK0I7QUFBQSxRQUEzQkMsTUFBMkIsdUVBQWxCLEVBQWtCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQzNFQSxjQUFVLHNCQUFjLEVBQUVDLFdBQVcsT0FBYixFQUFkLEVBQXNDRCxPQUF0QyxDQUFWOztBQUdBOzs7Ozs7Ozs7Ozs7QUFKMkUsNElBRXJFSCxRQUZxRSxFQUUzREMsT0FGMkQsRUFFbERDLE1BRmtELEVBRTFDQyxPQUYwQzs7QUFnQjNFLFVBQUtFLElBQUwsR0FBWSxJQUFaOztBQUVBOzs7Ozs7OztBQVFBLFVBQUtDLFNBQUwsR0FBaUIsSUFBakI7O0FBRUE7Ozs7Ozs7O0FBUUEsVUFBS0MsVUFBTCxHQUFrQixJQUFsQjs7QUFFQTs7Ozs7Ozs7QUFRQSxVQUFLQyxhQUFMLEdBQXFCLG1CQUFyQjs7QUFFQTs7Ozs7QUFLQSxVQUFLQyxZQUFMLEdBQW9CLG1CQUFwQjs7QUFFQSxVQUFLQyxlQUFMLEdBQXVCLG1CQUF2QjtBQUNBLFVBQUtDLGNBQUwsR0FBc0IsbUJBQXRCO0FBeEQyRTtBQXlENUU7O0FBRUQ7Ozs7Ozs7Ozs7Ozs7OzRCQVVRTixJLEVBQU07QUFDWixXQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDRDs7QUFFRDs7OzsrQkFDVztBQUNULFdBQUtPLGFBQUwsR0FBcUIsS0FBS0MsR0FBTCxDQUFTQyxhQUFULENBQXVCLGdCQUF2QixDQUFy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QUFMLENBQXFCK0QsR0FBckIsQ0FBeUJsQixFQUF6QixDQUFmO0FBQ0EsV0FBS3hDLElBQUwsQ0FBVTJELFdBQVYsQ0FBc0J4QixNQUF0QjtBQUNBLFdBQUt4QyxlQUFMLENBQXFCaUUsTUFBckIsQ0FBNEJwQixFQUE1QjtBQUNBO0FBQ0EsV0FBSy9DLGFBQUwsQ0FBbUJtRSxNQUFuQixDQUEwQnpCLE1BQTFCO0FBQ0Q7OztFQTlQcUIwQixjOztrQkFpUVQ3RSxTIiwiZmlsZSI6IlNwYWNlVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4uL3ZpZXdzL1ZpZXcnO1xuXG5jb25zdCBzdmdUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJzdmctY29udGFpbmVyXCI+XG4gIDxzdmc+PC9zdmc+XG48L2Rpdj5gO1xuXG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cbi8qKlxuICogQSB2aWV3IHRoYXQgcmVuZGVyIGFuIGBhcmVhYCBvYmplY3QgKGFzIGRlZmluZWQgaW4gc2VydmVyIGNvbmZpZ3VyYXRpb24pLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSB0ZW1wbGF0ZSAtIFRlbXBsYXRlIG9mIHRoZSB2aWV3LlxuICogQHBhcmFtIHtPYmplY3R9IGNvbnRlbnQgLSBPYmplY3QgY29udGFpbmluZyB0aGUgdmFyaWFibGVzIHVzZWQgdG8gcG9wdWxhdGVcbiAqICB0aGUgdGVtcGxhdGUuIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNjb250ZW50fS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBMaXN0ZW5lcnMgdG8gaW5zdGFsbCBpbiB0aGUgdmlld1xuICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNldmVudHN9LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSB2aWV3LlxuICogIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuVmlldyNvcHRpb25zfS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIFNwYWNlVmlldyBleHRlbmRzIFZpZXcge1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSA9IHN2Z1RlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNsYXNzTmFtZTogJ3NwYWNlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhcmVhIHRvIGRpc3BsYXkuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBhcmVhLndpZHRoIC0gV2lkdGggb2YgdGhlIGFyZWEuXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFyZWEuaGVpZ2h0IC0gSGVpZ2h0IG9mIHRoZSBhcmVhLlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBhcmVhLmJhY2tncm91bmQgLSBPcHRpb25uYWwgYmFja2dyb3VuZCBpbWFnZSB0b1xuICAgICAqICBkaXNwbGF5IGluIGJhY2tncm91bmQuXG4gICAgICogQG5hbWUgYXJlYVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU3BhY2VWaWV3XG4gICAgICovXG4gICAgdGhpcy5hcmVhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSByZW5kZXJlZCBhcmVhIGluIHBpeGVscy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQG5hbWUgYXJlYVdpZHRoXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TcGFjZVZpZXdcbiAgICAgKi9cbiAgICB0aGlzLmFyZWFXaWR0aCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBIZWlnaHQgb2YgdGhlIHJlbmRlcmVkIGFyZWEgaW4gcGl4ZWxzLlxuICAgICAqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAbmFtZSBhcmVhSGVpZ2h0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TcGFjZVZpZXdcbiAgICAgKi9cbiAgICB0aGlzLmFyZWFIZWlnaHQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTWFwIGFzc29jaWF0aW5nIGAkc2hhcGVzYCBhbmQgdGhlaXIgcmVsYXRpdmUgYHBvaW50YCBvYmplY3QuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqIEBuYW1lIHNoYXBlUG9pbnRNYXBcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNwYWNlVmlld1xuICAgICAqL1xuICAgIHRoaXMuc2hhcGVQb2ludE1hcCA9IG5ldyBNYXAoKTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgbGluZSBvYmplY3QuXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVMaW5lTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fcmVuZGVyZWRMaW5lcyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGBhcmVhYCB0byBiZSByZW5kZXJlcmVkLlxuICAgKlxuICAgKiBAdHlwZSB7T2JqZWN0fSBhcmVhIC0gT2JqZWN0IGRlc2NyaWJpbmcgdGhlIGFyZWEsIGdlbmVyYWxseSBkZWZpbmVkIGluXG4gICAqICBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFyZWEud2lkdGggLSBXaWR0aCBvZiB0aGUgYXJlYS5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGFyZWEuaGVpZ2h0IC0gSGVpZ2h0IG9mIHRoZSBhcmVhLlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gYXJlYS5iYWNrZ3JvdW5kIC0gT3B0aW9ubmFsIGJhY2tncm91bmQgaW1hZ2UgdG9cbiAgICAgKiAgZGlzcGxheSBpbiBiYWNrZ3JvdW5kLlxuICAgKi9cbiAgc2V0QXJlYShhcmVhKSB7XG4gICAgdGhpcy5hcmVhID0gYXJlYTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRzdmdDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc3ZnLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuJHN2ZyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgIHRoaXMuYWRkRGVmaW5pdGlvbnMoKTtcbiAgICB0aGlzLnJlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICAgIC8vIG92ZXJyaWRlIHNpemUgdG8gbWF0Y2ggcGFyZW50IHNpemUgaWYgY29tcG9uZW50IG9mIGFub3RoZXIgdmlld1xuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblxuICAgIHRoaXMucmVuZGVyQXJlYSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBzdmcgZGVmaW5pdGlvbnMuXG4gICAqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBhZGREZWZpbml0aW9ucygpIHtcbiAgICB0aGlzLiRkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgY29uc3QgbWFya2VyQXJyb3cgPSBgXG4gICAgICA8bWFya2VyIGlkPVwibWFya2VyLWFycm93XCIgbWFya2VyV2lkdGg9XCIxMFwiIG1hcmtlckhlaWdodD1cIjEwXCIgcmVmWD1cIjVcIiByZWZZPVwiNVwiIG9yaWVudD1cImF1dG9cIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTAsMCBMMCwxMCBMMTAsNSBMMCwwXCIgY2xhc3M9XCJtYXJrZXItYXJyb3dcIiAvPlxuICAgICAgPC9tYXJrZXI+XG4gICAgYDtcblxuICAgIHRoaXMuJGRlZnMuaW5uZXJIVE1MID0gbWFya2VyQXJyb3c7XG4gICAgdGhpcy4kc3ZnLmluc2VydEJlZm9yZSh0aGlzLiRkZWZzLCB0aGlzLiRzdmcuZmlyc3RDaGlsZCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBkaXNwbGF5ZWQgYXJlYSwgYWNjb3JkaW5nIHRvIGNoYW5nZXMgaW4gYGFyZWFgIGRlZmluaXRpb24gb3JcbiAgICogaWYgYSBgcmVzaXplYCBldmVudCBoYXMgYmVlbiB0cmlnZXJyZWQuXG4gICAqL1xuICByZW5kZXJBcmVhKCkge1xuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmFyZWE7XG4gICAgLy8gdXNlIGB0aGlzLiRlbGAgc2l6ZSBpbnN0ZWFkIG9mIGB0aGlzLiRwYXJlbnRgIHNpemUgdG8gaWdub3JlIHBhcmVudCBwYWRkaW5nXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIHRoaXMucmF0aW8gPSBNYXRoLm1pbihjb250YWluZXJXaWR0aCAvIGFyZWEud2lkdGgsIGNvbnRhaW5lckhlaWdodCAvIGFyZWEuaGVpZ2h0KTtcbiAgICBjb25zdCBzdmdXaWR0aCA9IGFyZWEud2lkdGggKiB0aGlzLnJhdGlvO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGFyZWEuaGVpZ2h0ICogdGhpcy5yYXRpbztcblxuICAgIGNvbnN0IHRvcCA9IChjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMjtcbiAgICBjb25zdCBsZWZ0ID0gKGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMjtcblxuICAgIHRoaXMuJHN2Z0NvbnRhaW5lci5zdHlsZS53aWR0aCA9IHN2Z1dpZHRoICsgJ3B4JztcbiAgICB0aGlzLiRzdmdDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gc3ZnSGVpZ2h0ICsgJ3B4JztcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgIC8vIGNlbnRlciB0aGUgc3ZnIGludG8gdGhlIHBhcmVudFxuICAgIHRoaXMuJHN2Z0NvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy4kc3ZnQ29udGFpbmVyLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgdGhpcy4kc3ZnQ29udGFpbmVyLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcblxuICAgIHRoaXMuJHN2Zy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnRvcCA9IGAwcHhgO1xuICAgIHRoaXMuJHN2Zy5zdHlsZS5sZWZ0ID0gYDBweGA7XG5cbiAgICAvLyBkaXNwbGF5IGJhY2tncm91bmQgaWYgYW55XG4gICAgaWYgKGFyZWEuYmFja2dyb3VuZCkge1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2FyZWEuYmFja2dyb3VuZH0pYDtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuICAgICAgLy8gZm9yY2UgJHN2ZyB0byBiZSB0cmFuc3BhcmVudFxuICAgICAgdGhpcy4kc3ZnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCc7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGV4aXN0aW5nIHBvaW50cyBwb3NpdGlvblxuICAgIGZvciAobGV0IFskc2hhcGUsIHBvaW50XSBvZiB0aGlzLnNoYXBlUG9pbnRNYXApXG4gICAgICB0aGlzLnVwZGF0ZVBvaW50KHBvaW50KTtcblxuICAgIC8vIGV4cG9zZSB0aGUgc2l6ZSBvZiB0aGUgYXJlYSBpbiBwaXhlbFxuICAgIHRoaXMuYXJlYVdpZHRoID0gc3ZnV2lkdGg7XG4gICAgdGhpcy5hcmVhSGVpZ2h0ID0gc3ZnSGVpZ2h0O1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB1c2VkIHRvIHJlbmRlciBhIHNwZWNpZmljIHBvaW50LiBPdmVycmlkZSB0aGlzIG1ldGhvZCB0byBkaXNwbGF5XG4gICAqIHBvaW50cyB3aXRoIHVzZXIgZGVmaW5lZCBzaGFwZXMuIFRoZSBzaGFwZSByZXR1cm5lZCBieSB0aGlzIG1ldGhvZCBpc1xuICAgKiBpbnNlcnRlZCBpbnRvIHRoZSBgc3ZnYCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBQb2ludCB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gcG9pbnQuaWQgLSBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHBvaW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9pbnQueCAtIFZhbHVlIGluIHRoZSB4IGF4aXMgaW4gdGhlIGFyZWEgY29vcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludC55IC0gVmFsdWUgaW4gdGhlIHkgYXhpcyBpbiB0aGUgYXJlYSBjb29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb2ludC5yYWRpdXM9MC4zXSAtIFJhZGl1cyBvZiB0aGUgcG9pbnQgKHJlbGF0aXZlIHRvIHRoZVxuICAgKiAgYXJlYSB3aWR0aCBhbmQgaGVpZ2h0KS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtwb2ludC5jb2xvcj11bmRlZmluZWRdIC0gT3B0aW9ubmFsIGNvbG9yIG9mIHRoZSBwb2ludC5cbiAgICovXG4gIHJlbmRlclBvaW50KHBvaW50LCAkc2hhcGUgPSBudWxsKSB7XG4gICAgaWYgKCRzaGFwZSA9PT0gbnVsbCkge1xuICAgICAgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgncG9pbnQnKTtcbiAgICB9XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgcG9pbnQuaWQpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9pbnQueCAqIHRoaXMucmF0aW99YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb2ludC55ICogdGhpcy5yYXRpb31gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9pbnQucmFkaXVzIHx8wqA4KTsgLy8gcmFkaXVzIGlzIHJlbGF0aXZlIHRvIGFyZWEgc2l6ZVxuXG4gICAgaWYgKHBvaW50LmNvbG9yKVxuICAgICAgJHNoYXBlLnN0eWxlLmZpbGwgPSBwb2ludC5jb2xvcjtcblxuICAgIGNvbnN0IG1ldGhvZCA9IHBvaW50LnNlbGVjdGVkID8gJ2FkZCcgOiAncmVtb3ZlJztcbiAgICAkc2hhcGUuY2xhc3NMaXN0W21ldGhvZF0oJ3NlbGVjdGVkJyk7XG5cbiAgICByZXR1cm4gJHNoYXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBwb2ludHMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgcG9pbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvaW50cyAtIFBvaW50cyB0byByZW5kZXIuXG4gICAqL1xuICBzZXRQb2ludHMocG9pbnRzKSB7XG4gICAgdGhpcy5jbGVhclBvaW50cygpO1xuICAgIHRoaXMuYWRkUG9pbnRzKHBvaW50cyk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlIGFsbCBwb2ludHMuXG4gICAqL1xuICBjbGVhclBvaW50cygpIHtcbiAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZFBvaW50cy5rZXlzKCkpXG4gICAgICB0aGlzLmRlbGV0ZVBvaW50KGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IHBvaW50cyB0byB0aGUgYXJlYS5cbiAgICpcbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBwb2ludHMgLSBOZXcgcG9pbnRzIHRvIGFkZCB0byB0aGUgdmlldy5cbiAgICovXG4gIGFkZFBvaW50cyhwb2ludHMpIHtcbiAgICBwb2ludHMuZm9yRWFjaChwb2ludCA9PiB0aGlzLmFkZFBvaW50KHBvaW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IHBvaW50IHRvIHRoZSBhcmVhLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBOZXcgcG9pbnQgdG8gYWRkIHRvIHRoZSB2aWV3LlxuICAgKi9cbiAgYWRkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlclBvaW50KHBvaW50KTtcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5zZXQocG9pbnQuaWQsICRzaGFwZSk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuc2V0KCRzaGFwZSwgcG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIHBvaW50LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBQb2ludCB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGVQb2ludChwb2ludCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9pbnRzLmdldChwb2ludC5pZCk7XG4gICAgdGhpcy5yZW5kZXJQb2ludChwb2ludCwgJHNoYXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGUgYSBwb2ludC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBpZCAtIElkIG9mIHRoZSBwb2ludCB0byBkZWxldGUuXG4gICAqL1xuICBkZWxldGVQb2ludChpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9pbnRzLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuZGVsZXRlKGlkKTtcbiAgICAvLyBtYXAgZm9yIGVhc2llciByZXRyaWV2aW5nIG9mIHRoZSBwb2ludFxuICAgIHRoaXMuc2hhcGVQb2ludE1hcC5kZWxldGUoJHNoYXBlKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTcGFjZVZpZXc7XG4iXX0=
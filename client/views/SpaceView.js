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

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var svgTemplate = '\n<div class="svg-container">\n  <svg></svg>\n</div>';

var ns = 'http://www.w3.org/2000/svg';

var SpaceView = function (_View) {
  (0, _inherits3.default)(SpaceView, _View);

  /**
   * Returns a new space instance.
   * @param {Object} area - The area to represent, should be defined by a `width`, an `height` and an optionnal background.
   * @param {Object} events - The events to attach to the view.
   * @param {Object} options - @todo
   */
  function SpaceView() {
    var template = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : svgTemplate;
    var content = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var events = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck3.default)(this, SpaceView);

    options = (0, _assign2.default)({ className: 'space' }, options);

    /**
     * The area to display.
     * @type {Object}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (SpaceView.__proto__ || (0, _getPrototypeOf2.default)(SpaceView)).call(this, template, content, events, options));

    _this.area = null;

    /**
     * The width of the rendered area in pixels.
     * @type {Number}
     */
    _this.areaWidth = null;

    /**
     * The height of the rendered area in pixels.
     * @type {Number}
     */
    _this.areaHeight = null;

    /**
     * Expose a Map of the $shapes and their relative point object.
     * @type {Map}
     */
    _this.shapePointMap = new _map2.default();

    /**
     * Expose a Map of the $shapes and their relative line object.
     * @type {Map}
     */
    _this.shapeLineMap = new _map2.default();

    _this._renderedPoints = new _map2.default();
    _this._renderedLines = new _map2.default();
    return _this;
  }

  /**
   * Define the area to be renderer.
   * @type {Object} area - On object describing the area to render, generally
   *  defined in server configuration.
   * @attribute {Number} area.width - The width of the area.
   * @attribute {Number} area.height - The height of the area.
   */


  (0, _createClass3.default)(SpaceView, [{
    key: 'setArea',
    value: function setArea(area) {
      this.area = area;
    }

    /** @inheritdoc */

  }, {
    key: 'onRender',
    value: function onRender() {
      this.$svgContainer = this.$el.querySelector('.svg-container');
      this.$svg = this.$el.querySelector('svg');
      this.addDefinitions();
      this._renderArea();
    }

    /** @inheritdoc */

  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      (0, _get3.default)(SpaceView.prototype.__proto__ || (0, _getPrototypeOf2.default)(SpaceView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
      // override size to match parent size if component of another view
      if (this.parentView) {
        this.$el.style.width = '100%';
        this.$el.style.height = '100%';
      }

      this._renderArea();
    }

    /**
     * @private
     * @note - don't expose for now.
     */

  }, {
    key: 'addDefinitions',
    value: function addDefinitions() {
      this.$defs = document.createElementNS(ns, 'defs');

      // const markerCircle = `
      //   <marker id="marker-circle" markerWidth="7" markerHeight="7" refX="4" refY="4" >
      //       <circle cx="4" cy="4" r="3" class="marker-circle" />
      //   </marker>
      // `;

      var markerArrow = '\n      <marker id="marker-arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">\n          <path d="M0,0 L0,10 L10,5 L0,0" class="marker-arrow" />\n      </marker>\n    ';

      this.$defs.innerHTML = markerArrow;
      this.$svg.insertBefore(this.$defs, this.$svg.firstChild);
    }

    /** @private */

  }, {
    key: '_renderArea',
    value: function _renderArea() {
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
      // this.$svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
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
        }

        // expose the size of the area in pixel
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

      // update area for markers
      // const markers = Array.from(this.$defs.querySelectorAll('marker'));
      // markers.forEach((marker) => {
      //   marker.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
      // });
    }

    /**
     * The method used to render a specific point. This method should be
     * overriden to display a point with a user defined shape. These shapes
     * are appended to the `svg` element.
     *
     * @param {Object} point - The point to render.
     * @param {String|Number} point.id - An unique identifier for the point.
     * @param {Number} point.x - The point in the x axis in the area cordinate system.
     * @param {Number} point.y - The point in the y axis in the area cordinate system.
     * @param {Number} [point.radius=0.3] - The radius of the point (relative to the
     *  area width and height).
     * @param {String} [point.color=undefined] - If specified, the color of the point.
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
     * Replace all the existing points with the given array of point.
     * @param {Array<Object>} points - The new points to render.
     */

  }, {
    key: 'setPoints',
    value: function setPoints(points) {
      this.clearPoints();
      this.addPoints(points);
    }

    /**
     * Clear all the displayed points.
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
     * @param {Array<Object>} points - The new points to render.
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
     * @param {Object} point - The new point to render.
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
     * Update a rendered point.
     * @param {Object} point - The point to update.
     */

  }, {
    key: 'updatePoint',
    value: function updatePoint(point) {
      var $shape = this._renderedPoints.get(point.id);
      this.renderPoint(point, $shape);
    }

    /**
     * Remove a rendered point.
     * @param {String|Number} id - The id of the point to delete.
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

    // @todo - refactor with new viewbox
    // @todo - remove code duplication in update

    //  /**
    //   * The method used to render a specific line. This method should be overriden to display a point with a user defined shape. These shapes are prepended to the `svg` element
    //   * @param {Object} line - The line to render.
    //   * @param {String|Number} line.id - An unique identifier for the line.
    //   * @param {Object} line.tail - The point where the line should begin.
    //   * @param {Object} line.head - The point where the line should end.
    //   * @param {Boolean} [line.directed=false] - Defines whether the line should be directed or not.
    //   * @param {String} [line.color=undefined] - If specified, the color of the line.
    //   */
    //  renderLine(line) {
    //    const tail = line.tail;
    //    const head = line.head;
    //
    //    const $shape = document.createElementNS(ns, 'polyline');
    //    $shape.classList.add('line');
    //    $shape.setAttribute('data-id', line.id);
    //
    //    const points = [
    //      `${tail.x},${tail.y}`,
    //      `${(tail.x + head.x) / 2},${(tail.y + head.y) / 2}`,
    //      `${head.x},${head.y}`
    //    ];
    //
    //    $shape.setAttribute('points', points.join(' '));
    //    $shape.setAttribute('vector-effect', 'non-scaling-stroke');
    //
    //    if (line.color)
    //      $shape.style.stroke = line.color;
    //
    //    if (line.directed)
    //      $shape.classList.add('arrow');
    //
    //    return $shape;
    //  }
    //
    //  /**
    //   * Replace all the existing lines with the given array of line.
    //   * @param {Array<Object>} lines - The new lines to render.
    //   */
    //  setLines(lines) {
    //    this.clearLines();
    //    this.addLines(lines);
    //  }
    //
    //  /**
    //   * Clear all the displayed lines.
    //   */
    //  clearLines() {
    //    for (let id of this._renderedLines.keys()) {
    //      this.deleteLine(id);
    //    }
    //  }
    //
    //  /**
    //   * Add new lines to the area.
    //   * @param {Array<Object>} lines - The new lines to render.
    //   */
    //  addLines(lines) {
    //    lines.forEach(line => this.addLine(line));
    //  }
    //
    //  /**
    //   * Add a new line to the area.
    //   * @param {Object} line - The new line to render.
    //   */
    //  addLine(line) {
    //    const $shape = this.renderLine(line);
    //    // insert just after the <defs> tag
    //    // this.$svg.insertBefore($shape, this.$svg.firstChild.nextSibling);
    //    this.$svg.appendChild($shape);
    //
    //    this._renderedLines.set(line.id, $shape);
    //    this.shapeLineMap.set($shape, line);
    //  }
    //
    //  /**
    //   * Update a rendered line.
    //   * @param {Object} line - The line to update.
    //   */
    //  updateLine(line) {
    //    const $shape = this._renderedLines.get(line.id);
    //    const tail = line.tail;
    //    const head = line.head;
    //
    //    const points = [
    //      `${tail.x},${tail.y}`,
    //      `${(tail.x + head.x) / 2},${(tail.y + head.y) / 2}`,
    //      `${head.x},${head.y}`
    //    ];
    //
    //    $shape.setAttribute('points', points.join(' '));
    //  }
    //
    //  /**
    //   * Remove a rendered line.
    //   * @param {String|Number} id - The id of the line to delete.
    //   */
    //  deleteLine(id) {
    //    const $shape = this._renderedLines.get(id);
    //    this.$svg.removeChild($shape);
    //
    //    this._renderedLines.delete(id);
    //    this.shapeLineMap.delete($shape);
    //  }

  }]);
  return SpaceView;
}(_View3.default);

exports.default = SpaceView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNwYWNlVmlldy5qcyJdLCJuYW1lcyI6WyJzdmdUZW1wbGF0ZSIsIm5zIiwiU3BhY2VWaWV3IiwidGVtcGxhdGUiLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsImNsYXNzTmFtZSIsImFyZWEiLCJhcmVhV2lkdGgiLCJhcmVhSGVpZ2h0Iiwic2hhcGVQb2ludE1hcCIsInNoYXBlTGluZU1hcCIsIl9yZW5kZXJlZFBvaW50cyIsIl9yZW5kZXJlZExpbmVzIiwiJHN2Z0NvbnRhaW5lciIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCIkc3ZnIiwiYWRkRGVmaW5pdGlvbnMiLCJfcmVuZGVyQXJlYSIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsIm9yaWVudGF0aW9uIiwicGFyZW50VmlldyIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCIkZGVmcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwibWFya2VyQXJyb3ciLCJpbm5lckhUTUwiLCJpbnNlcnRCZWZvcmUiLCJmaXJzdENoaWxkIiwiYm91bmRpbmdSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY29udGFpbmVyV2lkdGgiLCJjb250YWluZXJIZWlnaHQiLCJyYXRpbyIsIk1hdGgiLCJtaW4iLCJzdmdXaWR0aCIsInN2Z0hlaWdodCIsInRvcCIsImxlZnQiLCJzZXRBdHRyaWJ1dGUiLCJwb3NpdGlvbiIsImJhY2tncm91bmQiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJiYWNrZ3JvdW5kUmVwZWF0IiwiYmFja2dyb3VuZFNpemUiLCJiYWNrZ3JvdW5kQ29sb3IiLCIkc2hhcGUiLCJwb2ludCIsInVwZGF0ZVBvaW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiaWQiLCJ4IiwieSIsInJhZGl1cyIsImNvbG9yIiwiZmlsbCIsIm1ldGhvZCIsInNlbGVjdGVkIiwicG9pbnRzIiwiY2xlYXJQb2ludHMiLCJhZGRQb2ludHMiLCJrZXlzIiwiZGVsZXRlUG9pbnQiLCJmb3JFYWNoIiwiYWRkUG9pbnQiLCJyZW5kZXJQb2ludCIsImFwcGVuZENoaWxkIiwic2V0IiwiZ2V0IiwicmVtb3ZlQ2hpbGQiLCJkZWxldGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsb0VBQU47O0FBS0EsSUFBTUMsS0FBSyw0QkFBWDs7SUFHcUJDLFM7OztBQUNuQjs7Ozs7O0FBTUEsdUJBQTZFO0FBQUEsUUFBakVDLFFBQWlFLHVFQUF0REgsV0FBc0Q7QUFBQSxRQUF6Q0ksT0FBeUMsdUVBQS9CLEVBQStCO0FBQUEsUUFBM0JDLE1BQTJCLHVFQUFsQixFQUFrQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUMzRUEsY0FBVSxzQkFBYyxFQUFFQyxXQUFXLE9BQWIsRUFBZCxFQUFzQ0QsT0FBdEMsQ0FBVjs7QUFHQTs7OztBQUoyRSw0SUFFckVILFFBRnFFLEVBRTNEQyxPQUYyRCxFQUVsREMsTUFGa0QsRUFFMUNDLE9BRjBDOztBQVEzRSxVQUFLRSxJQUFMLEdBQVksSUFBWjs7QUFFQTs7OztBQUlBLFVBQUtDLFNBQUwsR0FBaUIsSUFBakI7O0FBRUE7Ozs7QUFJQSxVQUFLQyxVQUFMLEdBQWtCLElBQWxCOztBQUVBOzs7O0FBSUEsVUFBS0MsYUFBTCxHQUFxQixtQkFBckI7O0FBRUE7Ozs7QUFJQSxVQUFLQyxZQUFMLEdBQW9CLG1CQUFwQjs7QUFFQSxVQUFLQyxlQUFMLEdBQXVCLG1CQUF2QjtBQUNBLFVBQUtDLGNBQUwsR0FBc0IsbUJBQXRCO0FBbkMyRTtBQW9DNUU7O0FBRUQ7Ozs7Ozs7Ozs7OzRCQU9RTixJLEVBQU07QUFDWixXQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDRDs7QUFFRDs7OzsrQkFDVztBQUNULFdBQUtPLGFBQUwsR0FBcUIsS0FBS0MsR0FBTCxDQUFTQyxhQUFULENBQXVCLGdCQUF2QixDQUFyQjtBQUNBLFdBQUtDLElBQUwsR0FBWSxL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QWpCLEVBQXdCRCxNQUF4QjtBQUNEOztBQUVEOzs7Ozs7O2dDQUlZSyxFLEVBQUk7QUFDZCxVQUFNTCxTQUFTLEtBQUt6QyxlQUFMLENBQXFCZ0UsR0FBckIsQ0FBeUJsQixFQUF6QixDQUFmO0FBQ0EsV0FBS3pDLElBQUwsQ0FBVTRELFdBQVYsQ0FBc0J4QixNQUF0QjtBQUNBLFdBQUt6QyxlQUFMLENBQXFCa0UsTUFBckIsQ0FBNEJwQixFQUE1QjtBQUNBO0FBQ0EsV0FBS2hELGFBQUwsQ0FBbUJvRSxNQUFuQixDQUEwQnpCLE1BQTFCO0FBQ0Q7O0FBR0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7a0JBbldxQnBELFMiLCJmaWxlIjoiU3BhY2VWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3Qgc3ZnVGVtcGxhdGUgPSBgXG48ZGl2IGNsYXNzPVwic3ZnLWNvbnRhaW5lclwiPlxuICA8c3ZnPjwvc3ZnPlxuPC9kaXY+YDtcblxuY29uc3QgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYWNlVmlldyBleHRlbmRzIFZpZXcge1xuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBzcGFjZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgYXJlYSB0byByZXByZXNlbnQsIHNob3VsZCBiZSBkZWZpbmVkIGJ5IGEgYHdpZHRoYCwgYW4gYGhlaWdodGAgYW5kIGFuIG9wdGlvbm5hbCBiYWNrZ3JvdW5kLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gVGhlIGV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQHRvZG9cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlID0gc3ZnVGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgY2xhc3NOYW1lOiAnc3BhY2UnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFyZWEgdG8gZGlzcGxheS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuYXJlYSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgd2lkdGggb2YgdGhlIHJlbmRlcmVkIGFyZWEgaW4gcGl4ZWxzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hcmVhV2lkdGggPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGhlaWdodCBvZiB0aGUgcmVuZGVyZWQgYXJlYSBpbiBwaXhlbHMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmFyZWFIZWlnaHQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGEgTWFwIG9mIHRoZSAkc2hhcGVzIGFuZCB0aGVpciByZWxhdGl2ZSBwb2ludCBvYmplY3QuXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKi9cbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgYSBNYXAgb2YgdGhlICRzaGFwZXMgYW5kIHRoZWlyIHJlbGF0aXZlIGxpbmUgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICovXG4gICAgdGhpcy5zaGFwZUxpbmVNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9yZW5kZXJlZExpbmVzID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSB0aGUgYXJlYSB0byBiZSByZW5kZXJlci5cbiAgICogQHR5cGUge09iamVjdH0gYXJlYSAtIE9uIG9iamVjdCBkZXNjcmliaW5nIHRoZSBhcmVhIHRvIHJlbmRlciwgZ2VuZXJhbGx5XG4gICAqICBkZWZpbmVkIGluIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IGFyZWEud2lkdGggLSBUaGUgd2lkdGggb2YgdGhlIGFyZWEuXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gYXJlYS5oZWlnaHQgLSBUaGUgaGVpZ2h0IG9mIHRoZSBhcmVhLlxuICAgKi9cbiAgc2V0QXJlYShhcmVhKSB7XG4gICAgdGhpcy5hcmVhID0gYXJlYTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRzdmdDb250YWluZXIgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCcuc3ZnLWNvbnRhaW5lcicpO1xuICAgIHRoaXMuJHN2ZyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgIHRoaXMuYWRkRGVmaW5pdGlvbnMoKTtcbiAgICB0aGlzLl9yZW5kZXJBcmVhKCk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgICAvLyBvdmVycmlkZSBzaXplIHRvIG1hdGNoIHBhcmVudCBzaXplIGlmIGNvbXBvbmVudCBvZiBhbm90aGVyIHZpZXdcbiAgICBpZiAodGhpcy5wYXJlbnRWaWV3KSB7XG4gICAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICB9XG5cbiAgICB0aGlzLl9yZW5kZXJBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQG5vdGUgLSBkb24ndCBleHBvc2UgZm9yIG5vdy5cbiAgICovXG4gIGFkZERlZmluaXRpb25zKCkge1xuICAgIHRoaXMuJGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICAvLyBjb25zdCBtYXJrZXJDaXJjbGUgPSBgXG4gICAgLy8gICA8bWFya2VyIGlkPVwibWFya2VyLWNpcmNsZVwiIG1hcmtlcldpZHRoPVwiN1wiIG1hcmtlckhlaWdodD1cIjdcIiByZWZYPVwiNFwiIHJlZlk9XCI0XCIgPlxuICAgIC8vICAgICAgIDxjaXJjbGUgY3g9XCI0XCIgY3k9XCI0XCIgcj1cIjNcIiBjbGFzcz1cIm1hcmtlci1jaXJjbGVcIiAvPlxuICAgIC8vICAgPC9tYXJrZXI+XG4gICAgLy8gYDtcblxuICAgIGNvbnN0IG1hcmtlckFycm93ID0gYFxuICAgICAgPG1hcmtlciBpZD1cIm1hcmtlci1hcnJvd1wiIG1hcmtlcldpZHRoPVwiMTBcIiBtYXJrZXJIZWlnaHQ9XCIxMFwiIHJlZlg9XCI1XCIgcmVmWT1cIjVcIiBvcmllbnQ9XCJhdXRvXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0wLDAgTDAsMTAgTDEwLDUgTDAsMFwiIGNsYXNzPVwibWFya2VyLWFycm93XCIgLz5cbiAgICAgIDwvbWFya2VyPlxuICAgIGA7XG5cbiAgICB0aGlzLiRkZWZzLmlubmVySFRNTCA9IG1hcmtlckFycm93O1xuICAgIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUodGhpcy4kZGVmcywgdGhpcy4kc3ZnLmZpcnN0Q2hpbGQpO1xuICB9XG5cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3JlbmRlckFyZWEoKSB7XG4gICAgY29uc3QgYXJlYSA9IHRoaXMuYXJlYTtcbiAgICAvLyB1c2UgYHRoaXMuJGVsYCBzaXplIGluc3RlYWQgb2YgYHRoaXMuJHBhcmVudGAgc2l6ZSB0byBpZ25vcmUgcGFyZW50IHBhZGRpbmdcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgdGhpcy5yYXRpbyA9IE1hdGgubWluKGNvbnRhaW5lcldpZHRoIC8gYXJlYS53aWR0aCwgY29udGFpbmVySGVpZ2h0IC8gYXJlYS5oZWlnaHQpO1xuICAgIGNvbnN0IHN2Z1dpZHRoID0gYXJlYS53aWR0aCAqIHRoaXMucmF0aW87XG4gICAgY29uc3Qgc3ZnSGVpZ2h0ID0gYXJlYS5oZWlnaHQgKiB0aGlzLnJhdGlvO1xuXG4gICAgY29uc3QgdG9wID0gKGNvbnRhaW5lckhlaWdodCAtIHN2Z0hlaWdodCkgLyAyO1xuICAgIGNvbnN0IGxlZnQgPSAoY29udGFpbmVyV2lkdGggLSBzdmdXaWR0aCkgLyAyO1xuXG4gICAgdGhpcy4kc3ZnQ29udGFpbmVyLnN0eWxlLndpZHRoID0gc3ZnV2lkdGggKyAncHgnO1xuICAgIHRoaXMuJHN2Z0NvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBzdmdIZWlnaHQgKyAncHgnO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc3ZnV2lkdGgpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgLy8gdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmdXaWR0aH0gJHtzdmdIZWlnaHR9YCk7XG4gICAgLy8gY2VudGVyIHRoZSBzdmcgaW50byB0aGUgcGFyZW50XG4gICAgdGhpcy4kc3ZnQ29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLiRzdmdDb250YWluZXIuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbiAgICB0aGlzLiRzdmdDb250YWluZXIuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuXG4gICAgdGhpcy4kc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLiRzdmcuc3R5bGUudG9wID0gYDBweGA7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLmxlZnQgPSBgMHB4YDtcblxuICAgIC8vIGRpc3BsYXkgYmFja2dyb3VuZCBpZiBhbnlcbiAgICBpZiAoYXJlYS5iYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7YXJlYS5iYWNrZ3JvdW5kfSlgO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbic7XG4gICAgICAvLyBmb3JjZSAkc3ZnIHRvIGJlIHRyYW5zcGFyZW50XG4gICAgICB0aGlzLiRzdmcuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3RyYW5zcGFyZW50JztcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZXhpc3RpbmcgcG9pbnRzIHBvc2l0aW9uXG4gICAgZm9yIChsZXQgWyRzaGFwZSwgcG9pbnRdIG9mIHRoaXMuc2hhcGVQb2ludE1hcCkge1xuICAgICAgdGhpcy51cGRhdGVQb2ludChwb2ludClcbiAgICB9XG5cbiAgICAvLyBleHBvc2UgdGhlIHNpemUgb2YgdGhlIGFyZWEgaW4gcGl4ZWxcbiAgICB0aGlzLmFyZWFXaWR0aCA9IHN2Z1dpZHRoO1xuICAgIHRoaXMuYXJlYUhlaWdodCA9IHN2Z0hlaWdodDtcblxuICAgIC8vIHVwZGF0ZSBhcmVhIGZvciBtYXJrZXJzXG4gICAgLy8gY29uc3QgbWFya2VycyA9IEFycmF5LmZyb20odGhpcy4kZGVmcy5xdWVyeVNlbGVjdG9yQWxsKCdtYXJrZXInKSk7XG4gICAgLy8gbWFya2Vycy5mb3JFYWNoKChtYXJrZXIpID0+IHtcbiAgICAvLyAgIG1hcmtlci5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7c3ZnV2lkdGh9ICR7c3ZnSGVpZ2h0fWApO1xuICAgIC8vIH0pO1xuICB9XG5cblxuICAvKipcbiAgICogVGhlIG1ldGhvZCB1c2VkIHRvIHJlbmRlciBhIHNwZWNpZmljIHBvaW50LiBUaGlzIG1ldGhvZCBzaG91bGQgYmVcbiAgICogb3ZlcnJpZGVuIHRvIGRpc3BsYXkgYSBwb2ludCB3aXRoIGEgdXNlciBkZWZpbmVkIHNoYXBlLiBUaGVzZSBzaGFwZXNcbiAgICogYXJlIGFwcGVuZGVkIHRvIHRoZSBgc3ZnYCBlbGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHBvaW50LmlkIC0gQW4gdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBwb2ludC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnggLSBUaGUgcG9pbnQgaW4gdGhlIHggYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9pbnQueSAtIFRoZSBwb2ludCBpbiB0aGUgeSBheGlzIGluIHRoZSBhcmVhIGNvcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9pbnQucmFkaXVzPTAuM10gLSBUaGUgcmFkaXVzIG9mIHRoZSBwb2ludCAocmVsYXRpdmUgdG8gdGhlXG4gICAqICBhcmVhIHdpZHRoIGFuZCBoZWlnaHQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BvaW50LmNvbG9yPXVuZGVmaW5lZF0gLSBJZiBzcGVjaWZpZWQsIHRoZSBjb2xvciBvZiB0aGUgcG9pbnQuXG4gICAqL1xuICByZW5kZXJQb2ludChwb2ludCwgJHNoYXBlID0gbnVsbCkge1xuICAgIGlmICgkc2hhcGUgPT09IG51bGwpIHtcbiAgICAgICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ3BvaW50Jyk7XG4gICAgfVxuXG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIHBvaW50LmlkKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3BvaW50LnggKiB0aGlzLnJhdGlvfWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9pbnQueSAqIHRoaXMucmF0aW99YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvaW50LnJhZGl1cyB8fMKgOCk7IC8vIHJhZGl1cyBpcyByZWxhdGl2ZSB0byBhcmVhIHNpemVcblxuICAgIGlmIChwb2ludC5jb2xvcilcbiAgICAgICRzaGFwZS5zdHlsZS5maWxsID0gcG9pbnQuY29sb3I7XG5cbiAgICBjb25zdCBtZXRob2QgPSBwb2ludC5zZWxlY3RlZCA/ICdhZGQnIDogJ3JlbW92ZSc7XG4gICAgJHNoYXBlLmNsYXNzTGlzdFttZXRob2RdKCdzZWxlY3RlZCcpO1xuXG4gICAgcmV0dXJuICRzaGFwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCB0aGUgZXhpc3RpbmcgcG9pbnRzIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIHBvaW50LlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvaW50cyAtIFRoZSBuZXcgcG9pbnRzIHRvIHJlbmRlci5cbiAgICovXG4gIHNldFBvaW50cyhwb2ludHMpIHtcbiAgICB0aGlzLmNsZWFyUG9pbnRzKClcbiAgICB0aGlzLmFkZFBvaW50cyhwb2ludHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIHBvaW50cy5cbiAgICovXG4gIGNsZWFyUG9pbnRzKCkge1xuICAgIGZvciAobGV0IGlkIG9mIHRoaXMuX3JlbmRlcmVkUG9pbnRzLmtleXMoKSkge1xuICAgICAgdGhpcy5kZWxldGVQb2ludChpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgcG9pbnRzIHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvaW50cyAtIFRoZSBuZXcgcG9pbnRzIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvaW50cyhwb2ludHMpIHtcbiAgICBwb2ludHMuZm9yRWFjaChwb2ludCA9PiB0aGlzLmFkZFBvaW50KHBvaW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IHBvaW50IHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgbmV3IHBvaW50IHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJQb2ludChwb2ludCk7XG4gICAgdGhpcy4kc3ZnLmFwcGVuZENoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuc2V0KHBvaW50LmlkLCAkc2hhcGUpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvaW50XG4gICAgdGhpcy5zaGFwZVBvaW50TWFwLnNldCgkc2hhcGUsIHBvaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSByZW5kZXJlZCBwb2ludC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZVBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb2ludHMuZ2V0KHBvaW50LmlkKTtcbiAgICB0aGlzLnJlbmRlclBvaW50KHBvaW50LCAkc2hhcGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoZSBwb2ludCB0byBkZWxldGUuXG4gICAqL1xuICBkZWxldGVQb2ludChpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9pbnRzLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuZGVsZXRlKGlkKTtcbiAgICAvLyBtYXAgZm9yIGVhc2llciByZXRyaWV2aW5nIG9mIHRoZSBwb2ludFxuICAgIHRoaXMuc2hhcGVQb2ludE1hcC5kZWxldGUoJHNoYXBlKTtcbiAgfVxuXG5cbi8vIEB0b2RvIC0gcmVmYWN0b3Igd2l0aCBuZXcgdmlld2JveFxuLy8gQHRvZG8gLSByZW1vdmUgY29kZSBkdXBsaWNhdGlvbiBpbiB1cGRhdGVcblxuLy8gIC8qKlxuLy8gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBsaW5lLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIHRvIGRpc3BsYXkgYSBwb2ludCB3aXRoIGEgdXNlciBkZWZpbmVkIHNoYXBlLiBUaGVzZSBzaGFwZXMgYXJlIHByZXBlbmRlZCB0byB0aGUgYHN2Z2AgZWxlbWVudFxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gcmVuZGVyLlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gbGluZS5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgbGluZS5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZS50YWlsIC0gVGhlIHBvaW50IHdoZXJlIHRoZSBsaW5lIHNob3VsZCBiZWdpbi5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZS5oZWFkIC0gVGhlIHBvaW50IHdoZXJlIHRoZSBsaW5lIHNob3VsZCBlbmQuXG4vLyAgICogQHBhcmFtIHtCb29sZWFufSBbbGluZS5kaXJlY3RlZD1mYWxzZV0gLSBEZWZpbmVzIHdoZXRoZXIgdGhlIGxpbmUgc2hvdWxkIGJlIGRpcmVjdGVkIG9yIG5vdC5cbi8vICAgKiBAcGFyYW0ge1N0cmluZ30gW2xpbmUuY29sb3I9dW5kZWZpbmVkXSAtIElmIHNwZWNpZmllZCwgdGhlIGNvbG9yIG9mIHRoZSBsaW5lLlxuLy8gICAqL1xuLy8gIHJlbmRlckxpbmUobGluZSkge1xuLy8gICAgY29uc3QgdGFpbCA9IGxpbmUudGFpbDtcbi8vICAgIGNvbnN0IGhlYWQgPSBsaW5lLmhlYWQ7XG4vL1xuLy8gICAgY29uc3QgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncG9seWxpbmUnKTtcbi8vICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdsaW5lJyk7XG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgbGluZS5pZCk7XG4vL1xuLy8gICAgY29uc3QgcG9pbnRzID0gW1xuLy8gICAgICBgJHt0YWlsLnh9LCR7dGFpbC55fWAsXG4vLyAgICAgIGAkeyh0YWlsLnggKyBoZWFkLngpIC8gMn0sJHsodGFpbC55ICsgaGVhZC55KSAvIDJ9YCxcbi8vICAgICAgYCR7aGVhZC54fSwke2hlYWQueX1gXG4vLyAgICBdO1xuLy9cbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIHBvaW50cy5qb2luKCcgJykpO1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgndmVjdG9yLWVmZmVjdCcsICdub24tc2NhbGluZy1zdHJva2UnKTtcbi8vXG4vLyAgICBpZiAobGluZS5jb2xvcilcbi8vICAgICAgJHNoYXBlLnN0eWxlLnN0cm9rZSA9IGxpbmUuY29sb3I7XG4vL1xuLy8gICAgaWYgKGxpbmUuZGlyZWN0ZWQpXG4vLyAgICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdhcnJvdycpO1xuLy9cbi8vICAgIHJldHVybiAkc2hhcGU7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBSZXBsYWNlIGFsbCB0aGUgZXhpc3RpbmcgbGluZXMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgbGluZS5cbi8vICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGxpbmVzIC0gVGhlIG5ldyBsaW5lcyB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgc2V0TGluZXMobGluZXMpIHtcbi8vICAgIHRoaXMuY2xlYXJMaW5lcygpO1xuLy8gICAgdGhpcy5hZGRMaW5lcyhsaW5lcyk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBDbGVhciBhbGwgdGhlIGRpc3BsYXllZCBsaW5lcy5cbi8vICAgKi9cbi8vICBjbGVhckxpbmVzKCkge1xuLy8gICAgZm9yIChsZXQgaWQgb2YgdGhpcy5fcmVuZGVyZWRMaW5lcy5rZXlzKCkpIHtcbi8vICAgICAgdGhpcy5kZWxldGVMaW5lKGlkKTtcbi8vICAgIH1cbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIEFkZCBuZXcgbGluZXMgdG8gdGhlIGFyZWEuXG4vLyAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBsaW5lcyAtIFRoZSBuZXcgbGluZXMgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIGFkZExpbmVzKGxpbmVzKSB7XG4vLyAgICBsaW5lcy5mb3JFYWNoKGxpbmUgPT4gdGhpcy5hZGRMaW5lKGxpbmUpKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIEFkZCBhIG5ldyBsaW5lIHRvIHRoZSBhcmVhLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIG5ldyBsaW5lIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBhZGRMaW5lKGxpbmUpIHtcbi8vICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMucmVuZGVyTGluZShsaW5lKTtcbi8vICAgIC8vIGluc2VydCBqdXN0IGFmdGVyIHRoZSA8ZGVmcz4gdGFnXG4vLyAgICAvLyB0aGlzLiRzdmcuaW5zZXJ0QmVmb3JlKCRzaGFwZSwgdGhpcy4kc3ZnLmZpcnN0Q2hpbGQubmV4dFNpYmxpbmcpO1xuLy8gICAgdGhpcy4kc3ZnLmFwcGVuZENoaWxkKCRzaGFwZSk7XG4vL1xuLy8gICAgdGhpcy5fcmVuZGVyZWRMaW5lcy5zZXQobGluZS5pZCwgJHNoYXBlKTtcbi8vICAgIHRoaXMuc2hhcGVMaW5lTWFwLnNldCgkc2hhcGUsIGxpbmUpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogVXBkYXRlIGEgcmVuZGVyZWQgbGluZS5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBsaW5lIHRvIHVwZGF0ZS5cbi8vICAgKi9cbi8vICB1cGRhdGVMaW5lKGxpbmUpIHtcbi8vICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkTGluZXMuZ2V0KGxpbmUuaWQpO1xuLy8gICAgY29uc3QgdGFpbCA9IGxpbmUudGFpbDtcbi8vICAgIGNvbnN0IGhlYWQgPSBsaW5lLmhlYWQ7XG4vL1xuLy8gICAgY29uc3QgcG9pbnRzID0gW1xuLy8gICAgICBgJHt0YWlsLnh9LCR7dGFpbC55fWAsXG4vLyAgICAgIGAkeyh0YWlsLnggKyBoZWFkLngpIC8gMn0sJHsodGFpbC55ICsgaGVhZC55KSAvIDJ9YCxcbi8vICAgICAgYCR7aGVhZC54fSwke2hlYWQueX1gXG4vLyAgICBdO1xuLy9cbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIHBvaW50cy5qb2luKCcgJykpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogUmVtb3ZlIGEgcmVuZGVyZWQgbGluZS5cbi8vICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoZSBsaW5lIHRvIGRlbGV0ZS5cbi8vICAgKi9cbi8vICBkZWxldGVMaW5lKGlkKSB7XG4vLyAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZExpbmVzLmdldChpZCk7XG4vLyAgICB0aGlzLiRzdmcucmVtb3ZlQ2hpbGQoJHNoYXBlKTtcbi8vXG4vLyAgICB0aGlzLl9yZW5kZXJlZExpbmVzLmRlbGV0ZShpZCk7XG4vLyAgICB0aGlzLnNoYXBlTGluZU1hcC5kZWxldGUoJHNoYXBlKTtcbi8vICB9XG59XG4iXX0=
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
    var template = arguments.length <= 0 || arguments[0] === undefined ? svgTemplate : arguments[0];
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
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
          var _step$value = (0, _slicedToArray3.default)(_step.value, 2);

          var $shape = _step$value[0];
          var point = _step$value[1];

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
      var $shape = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNwYWNlVmlldy5qcyJdLCJuYW1lcyI6WyJzdmdUZW1wbGF0ZSIsIm5zIiwiU3BhY2VWaWV3IiwidGVtcGxhdGUiLCJjb250ZW50IiwiZXZlbnRzIiwib3B0aW9ucyIsImNsYXNzTmFtZSIsImFyZWEiLCJhcmVhV2lkdGgiLCJhcmVhSGVpZ2h0Iiwic2hhcGVQb2ludE1hcCIsInNoYXBlTGluZU1hcCIsIl9yZW5kZXJlZFBvaW50cyIsIl9yZW5kZXJlZExpbmVzIiwiJHN2Z0NvbnRhaW5lciIsIiRlbCIsInF1ZXJ5U2VsZWN0b3IiLCIkc3ZnIiwiYWRkRGVmaW5pdGlvbnMiLCJfcmVuZGVyQXJlYSIsInZpZXdwb3J0V2lkdGgiLCJ2aWV3cG9ydEhlaWdodCIsIm9yaWVudGF0aW9uIiwicGFyZW50VmlldyIsInN0eWxlIiwid2lkdGgiLCJoZWlnaHQiLCIkZGVmcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwibWFya2VyQXJyb3ciLCJpbm5lckhUTUwiLCJpbnNlcnRCZWZvcmUiLCJmaXJzdENoaWxkIiwiYm91bmRpbmdSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiY29udGFpbmVyV2lkdGgiLCJjb250YWluZXJIZWlnaHQiLCJyYXRpbyIsIk1hdGgiLCJtaW4iLCJzdmdXaWR0aCIsInN2Z0hlaWdodCIsInRvcCIsImxlZnQiLCJzZXRBdHRyaWJ1dGUiLCJwb3NpdGlvbiIsImJhY2tncm91bmQiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJiYWNrZ3JvdW5kUG9zaXRpb24iLCJiYWNrZ3JvdW5kUmVwZWF0IiwiYmFja2dyb3VuZFNpemUiLCJiYWNrZ3JvdW5kQ29sb3IiLCIkc2hhcGUiLCJwb2ludCIsInVwZGF0ZVBvaW50IiwiY2xhc3NMaXN0IiwiYWRkIiwiaWQiLCJ4IiwieSIsInJhZGl1cyIsImNvbG9yIiwiZmlsbCIsIm1ldGhvZCIsInNlbGVjdGVkIiwicG9pbnRzIiwiY2xlYXJQb2ludHMiLCJhZGRQb2ludHMiLCJrZXlzIiwiZGVsZXRlUG9pbnQiLCJmb3JFYWNoIiwiYWRkUG9pbnQiLCJyZW5kZXJQb2ludCIsImFwcGVuZENoaWxkIiwic2V0IiwiZ2V0IiwicmVtb3ZlQ2hpbGQiLCJkZWxldGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0FBRUEsSUFBTUEsb0VBQU47O0FBS0EsSUFBTUMsS0FBSyw0QkFBWDs7SUFHcUJDLFM7OztBQUNuQjs7Ozs7O0FBTUEsdUJBQTZFO0FBQUEsUUFBakVDLFFBQWlFLHlEQUF0REgsV0FBc0Q7QUFBQSxRQUF6Q0ksT0FBeUMseURBQS9CLEVBQStCO0FBQUEsUUFBM0JDLE1BQTJCLHlEQUFsQixFQUFrQjtBQUFBLFFBQWRDLE9BQWMseURBQUosRUFBSTtBQUFBOztBQUMzRUEsY0FBVSxzQkFBYyxFQUFFQyxXQUFXLE9BQWIsRUFBZCxFQUFzQ0QsT0FBdEMsQ0FBVjs7QUFHQTs7OztBQUoyRSw0SUFFckVILFFBRnFFLEVBRTNEQyxPQUYyRCxFQUVsREMsTUFGa0QsRUFFMUNDLE9BRjBDOztBQVEzRSxVQUFLRSxJQUFMLEdBQVksSUFBWjs7QUFFQTs7OztBQUlBLFVBQUtDLFNBQUwsR0FBaUIsSUFBakI7O0FBRUE7Ozs7QUFJQSxVQUFLQyxVQUFMLEdBQWtCLElBQWxCOztBQUVBOzs7O0FBSUEsVUFBS0MsYUFBTCxHQUFxQixtQkFBckI7O0FBRUE7Ozs7QUFJQSxVQUFLQyxZQUFMLEdBQW9CLG1CQUFwQjs7QUFFQSxVQUFLQyxlQUFMLEdBQXVCLG1CQUF2QjtBQUNBLFVBQUtDLGNBQUwsR0FBc0IsbUJBQXRCO0FBbkMyRTtBQW9DNUU7O0FBRUQ7Ozs7Ozs7Ozs7OzRCQU9RTixJLEVBQU07QUFDWixXQUFLQSxJQUFMLEdBQVlBLElBQVo7QUFDRDs7QUFFRDs7OzsrQkFDVztBQUNULFdBQUtPLGFBQUwsR0FBcUIsS0FBS0MsR0FBTCxDQUFTQyxhQUFULENBQXVCLGdCQUF2QixDQUFyQjtBQUNBLFdBQUtDLElBQUwsR0FBWSxL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QUFqQixFQUF3QkQsTUFBeEI7QUFDRDs7QUFFRDs7Ozs7OztnQ0FJWUssRSxFQUFJO0FBQ2QsVUFBTUwsU0FBUyxLQUFLekMsZUFBTCxDQUFxQmdFLEdBQXJCLENBQXlCbEIsRUFBekIsQ0FBZjtBQUNBLFdBQUt6QyxJQUFMLENBQVU0RCxXQUFWLENBQXNCeEIsTUFBdEI7QUFDQSxXQUFLekMsZUFBTCxDQUFxQmtFLE1BQXJCLENBQTRCcEIsRUFBNUI7QUFDQTtBQUNBLFdBQUtoRCxhQUFMLENBQW1Cb0UsTUFBbkIsQ0FBMEJ6QixNQUExQjtBQUNEOztBQUdIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O2tCQW5XcUJwRCxTIiwiZmlsZSI6IlNwYWNlVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IHN2Z1RlbXBsYXRlID0gYFxuPGRpdiBjbGFzcz1cInN2Zy1jb250YWluZXJcIj5cbiAgPHN2Zz48L3N2Zz5cbjwvZGl2PmA7XG5cbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGFjZVZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBuZXcgc3BhY2UgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgdG8gcmVwcmVzZW50LCBzaG91bGQgYmUgZGVmaW5lZCBieSBhIGB3aWR0aGAsIGFuIGBoZWlnaHRgIGFuZCBhbiBvcHRpb25uYWwgYmFja2dyb3VuZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIFRoZSBldmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEB0b2RvXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSA9IHN2Z1RlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNsYXNzTmFtZTogJ3NwYWNlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhcmVhIHRvIGRpc3BsYXkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmFyZWEgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogVGhlIHdpZHRoIG9mIHRoZSByZW5kZXJlZCBhcmVhIGluIHBpeGVscy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYXJlYVdpZHRoID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIHJlbmRlcmVkIGFyZWEgaW4gcGl4ZWxzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hcmVhSGVpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgcG9pbnQgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICovXG4gICAgdGhpcy5zaGFwZVBvaW50TWFwID0gbmV3IE1hcCgpO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGEgTWFwIG9mIHRoZSAkc2hhcGVzIGFuZCB0aGVpciByZWxhdGl2ZSBsaW5lIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVMaW5lTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fcmVuZGVyZWRMaW5lcyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgdGhlIGFyZWEgdG8gYmUgcmVuZGVyZXIuXG4gICAqIEB0eXBlIHtPYmplY3R9IGFyZWEgLSBPbiBvYmplY3QgZGVzY3JpYmluZyB0aGUgYXJlYSB0byByZW5kZXIsIGdlbmVyYWxseVxuICAgKiAgZGVmaW5lZCBpbiBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBhcmVhLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IGFyZWEuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgYXJlYS5cbiAgICovXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kc3ZnQ29udGFpbmVyID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvcignLnN2Zy1jb250YWluZXInKTtcbiAgICB0aGlzLiRzdmcgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICB0aGlzLmFkZERlZmluaXRpb25zKCk7XG4gICAgdGhpcy5fcmVuZGVyQXJlYSgpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbik7XG4gICAgLy8gb3ZlcnJpZGUgc2l6ZSB0byBtYXRjaCBwYXJlbnQgc2l6ZSBpZiBjb21wb25lbnQgb2YgYW5vdGhlciB2aWV3XG4gICAgaWYgKHRoaXMucGFyZW50Vmlldykge1xuICAgICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG4gICAgfVxuXG4gICAgdGhpcy5fcmVuZGVyQXJlYSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBub3RlIC0gZG9uJ3QgZXhwb3NlIGZvciBub3cuXG4gICAqL1xuICBhZGREZWZpbml0aW9ucygpIHtcbiAgICB0aGlzLiRkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgLy8gY29uc3QgbWFya2VyQ2lyY2xlID0gYFxuICAgIC8vICAgPG1hcmtlciBpZD1cIm1hcmtlci1jaXJjbGVcIiBtYXJrZXJXaWR0aD1cIjdcIiBtYXJrZXJIZWlnaHQ9XCI3XCIgcmVmWD1cIjRcIiByZWZZPVwiNFwiID5cbiAgICAvLyAgICAgICA8Y2lyY2xlIGN4PVwiNFwiIGN5PVwiNFwiIHI9XCIzXCIgY2xhc3M9XCJtYXJrZXItY2lyY2xlXCIgLz5cbiAgICAvLyAgIDwvbWFya2VyPlxuICAgIC8vIGA7XG5cbiAgICBjb25zdCBtYXJrZXJBcnJvdyA9IGBcbiAgICAgIDxtYXJrZXIgaWQ9XCJtYXJrZXItYXJyb3dcIiBtYXJrZXJXaWR0aD1cIjEwXCIgbWFya2VySGVpZ2h0PVwiMTBcIiByZWZYPVwiNVwiIHJlZlk9XCI1XCIgb3JpZW50PVwiYXV0b1wiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMCwwIEwwLDEwIEwxMCw1IEwwLDBcIiBjbGFzcz1cIm1hcmtlci1hcnJvd1wiIC8+XG4gICAgICA8L21hcmtlcj5cbiAgICBgO1xuXG4gICAgdGhpcy4kZGVmcy5pbm5lckhUTUwgPSBtYXJrZXJBcnJvdztcbiAgICB0aGlzLiRzdmcuaW5zZXJ0QmVmb3JlKHRoaXMuJGRlZnMsIHRoaXMuJHN2Zy5maXJzdENoaWxkKTtcbiAgfVxuXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9yZW5kZXJBcmVhKCkge1xuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmFyZWE7XG4gICAgLy8gdXNlIGB0aGlzLiRlbGAgc2l6ZSBpbnN0ZWFkIG9mIGB0aGlzLiRwYXJlbnRgIHNpemUgdG8gaWdub3JlIHBhcmVudCBwYWRkaW5nXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIHRoaXMucmF0aW8gPSBNYXRoLm1pbihjb250YWluZXJXaWR0aCAvIGFyZWEud2lkdGgsIGNvbnRhaW5lckhlaWdodCAvIGFyZWEuaGVpZ2h0KTtcbiAgICBjb25zdCBzdmdXaWR0aCA9IGFyZWEud2lkdGggKiB0aGlzLnJhdGlvO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGFyZWEuaGVpZ2h0ICogdGhpcy5yYXRpbztcblxuICAgIGNvbnN0IHRvcCA9IChjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMjtcbiAgICBjb25zdCBsZWZ0ID0gKGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMjtcblxuICAgIHRoaXMuJHN2Z0NvbnRhaW5lci5zdHlsZS53aWR0aCA9IHN2Z1dpZHRoICsgJ3B4JztcbiAgICB0aGlzLiRzdmdDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gc3ZnSGVpZ2h0ICsgJ3B4JztcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgIC8vIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7c3ZnV2lkdGh9ICR7c3ZnSGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciB0aGUgc3ZnIGludG8gdGhlIHBhcmVudFxuICAgIHRoaXMuJHN2Z0NvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy4kc3ZnQ29udGFpbmVyLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgdGhpcy4kc3ZnQ29udGFpbmVyLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcblxuICAgIHRoaXMuJHN2Zy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnRvcCA9IGAwcHhgO1xuICAgIHRoaXMuJHN2Zy5zdHlsZS5sZWZ0ID0gYDBweGA7XG5cbiAgICAvLyBkaXNwbGF5IGJhY2tncm91bmQgaWYgYW55XG4gICAgaWYgKGFyZWEuYmFja2dyb3VuZCkge1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2FyZWEuYmFja2dyb3VuZH0pYDtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuICAgICAgLy8gZm9yY2UgJHN2ZyB0byBiZSB0cmFuc3BhcmVudFxuICAgICAgdGhpcy4kc3ZnLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICd0cmFuc3BhcmVudCc7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGV4aXN0aW5nIHBvaW50cyBwb3NpdGlvblxuICAgIGZvciAobGV0IFskc2hhcGUsIHBvaW50XSBvZiB0aGlzLnNoYXBlUG9pbnRNYXApIHtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnQocG9pbnQpXG4gICAgfVxuXG4gICAgLy8gZXhwb3NlIHRoZSBzaXplIG9mIHRoZSBhcmVhIGluIHBpeGVsXG4gICAgdGhpcy5hcmVhV2lkdGggPSBzdmdXaWR0aDtcbiAgICB0aGlzLmFyZWFIZWlnaHQgPSBzdmdIZWlnaHQ7XG5cbiAgICAvLyB1cGRhdGUgYXJlYSBmb3IgbWFya2Vyc1xuICAgIC8vIGNvbnN0IG1hcmtlcnMgPSBBcnJheS5mcm9tKHRoaXMuJGRlZnMucXVlcnlTZWxlY3RvckFsbCgnbWFya2VyJykpO1xuICAgIC8vIG1hcmtlcnMuZm9yRWFjaCgobWFya2VyKSA9PiB7XG4gICAgLy8gICBtYXJrZXIuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke3N2Z1dpZHRofSAke3N2Z0hlaWdodH1gKTtcbiAgICAvLyB9KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBwb2ludC4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlXG4gICAqIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzXG4gICAqIGFyZSBhcHBlbmRlZCB0byB0aGUgYHN2Z2AgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwb2ludC5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgcG9pbnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludC54IC0gVGhlIHBvaW50IGluIHRoZSB4IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnkgLSBUaGUgcG9pbnQgaW4gdGhlIHkgYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvaW50LnJhZGl1cz0wLjNdIC0gVGhlIHJhZGl1cyBvZiB0aGUgcG9pbnQgKHJlbGF0aXZlIHRvIHRoZVxuICAgKiAgYXJlYSB3aWR0aCBhbmQgaGVpZ2h0KS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtwb2ludC5jb2xvcj11bmRlZmluZWRdIC0gSWYgc3BlY2lmaWVkLCB0aGUgY29sb3Igb2YgdGhlIHBvaW50LlxuICAgKi9cbiAgcmVuZGVyUG9pbnQocG9pbnQsICRzaGFwZSA9IG51bGwpIHtcbiAgICBpZiAoJHNoYXBlID09PSBudWxsKSB7XG4gICAgICAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdjaXJjbGUnKTtcbiAgICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdwb2ludCcpO1xuICAgIH1cblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBwb2ludC5pZCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3gnLCBgJHtwb2ludC54ICogdGhpcy5yYXRpb31gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeScsIGAke3BvaW50LnkgKiB0aGlzLnJhdGlvfWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3InLCBwb2ludC5yYWRpdXMgfHzCoDgpOyAvLyByYWRpdXMgaXMgcmVsYXRpdmUgdG8gYXJlYSBzaXplXG5cbiAgICBpZiAocG9pbnQuY29sb3IpXG4gICAgICAkc2hhcGUuc3R5bGUuZmlsbCA9IHBvaW50LmNvbG9yO1xuXG4gICAgY29uc3QgbWV0aG9kID0gcG9pbnQuc2VsZWN0ZWQgPyAnYWRkJyA6ICdyZW1vdmUnO1xuICAgICRzaGFwZS5jbGFzc0xpc3RbbWV0aG9kXSgnc2VsZWN0ZWQnKTtcblxuICAgIHJldHVybiAkc2hhcGU7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbGwgdGhlIGV4aXN0aW5nIHBvaW50cyB3aXRoIHRoZSBnaXZlbiBhcnJheSBvZiBwb2ludC5cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBwb2ludHMgLSBUaGUgbmV3IHBvaW50cyB0byByZW5kZXIuXG4gICAqL1xuICBzZXRQb2ludHMocG9pbnRzKSB7XG4gICAgdGhpcy5jbGVhclBvaW50cygpXG4gICAgdGhpcy5hZGRQb2ludHMocG9pbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbGwgdGhlIGRpc3BsYXllZCBwb2ludHMuXG4gICAqL1xuICBjbGVhclBvaW50cygpIHtcbiAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZFBvaW50cy5rZXlzKCkpIHtcbiAgICAgIHRoaXMuZGVsZXRlUG9pbnQoaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IHBvaW50cyB0byB0aGUgYXJlYS5cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBwb2ludHMgLSBUaGUgbmV3IHBvaW50cyB0byByZW5kZXIuXG4gICAqL1xuICBhZGRQb2ludHMocG9pbnRzKSB7XG4gICAgcG9pbnRzLmZvckVhY2gocG9pbnQgPT4gdGhpcy5hZGRQb2ludChwb2ludCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBwb2ludCB0byB0aGUgYXJlYS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIG5ldyBwb2ludCB0byByZW5kZXIuXG4gICAqL1xuICBhZGRQb2ludChwb2ludCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMucmVuZGVyUG9pbnQocG9pbnQpO1xuICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzLnNldChwb2ludC5pZCwgJHNoYXBlKTtcbiAgICAvLyBtYXAgZm9yIGVhc2llciByZXRyaWV2aW5nIG9mIHRoZSBwb2ludFxuICAgIHRoaXMuc2hhcGVQb2ludE1hcC5zZXQoJHNoYXBlLCBwb2ludCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgcmVuZGVyZWQgcG9pbnQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBwb2ludCB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGVQb2ludChwb2ludCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9pbnRzLmdldChwb2ludC5pZCk7XG4gICAgdGhpcy5yZW5kZXJQb2ludChwb2ludCwgJHNoYXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByZW5kZXJlZCBwb2ludC5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBpZCAtIFRoZSBpZCBvZiB0aGUgcG9pbnQgdG8gZGVsZXRlLlxuICAgKi9cbiAgZGVsZXRlUG9pbnQoaWQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvaW50cy5nZXQoaWQpO1xuICAgIHRoaXMuJHN2Zy5yZW1vdmVDaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzLmRlbGV0ZShpZCk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuZGVsZXRlKCRzaGFwZSk7XG4gIH1cblxuXG4vLyBAdG9kbyAtIHJlZmFjdG9yIHdpdGggbmV3IHZpZXdib3hcbi8vIEB0b2RvIC0gcmVtb3ZlIGNvZGUgZHVwbGljYXRpb24gaW4gdXBkYXRlXG5cbi8vICAvKipcbi8vICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgbGluZS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzIGFyZSBwcmVwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnRcbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBsaW5lIHRvIHJlbmRlci5cbi8vICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGxpbmUuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGxpbmUuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUudGFpbCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgYmVnaW4uXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUuaGVhZCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgZW5kLlxuLy8gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xpbmUuZGlyZWN0ZWQ9ZmFsc2VdIC0gRGVmaW5lcyB3aGV0aGVyIHRoZSBsaW5lIHNob3VsZCBiZSBkaXJlY3RlZCBvciBub3QuXG4vLyAgICogQHBhcmFtIHtTdHJpbmd9IFtsaW5lLmNvbG9yPXVuZGVmaW5lZF0gLSBJZiBzcGVjaWZpZWQsIHRoZSBjb2xvciBvZiB0aGUgbGluZS5cbi8vICAgKi9cbi8vICByZW5kZXJMaW5lKGxpbmUpIHtcbi8vICAgIGNvbnN0IHRhaWwgPSBsaW5lLnRhaWw7XG4vLyAgICBjb25zdCBoZWFkID0gbGluZS5oZWFkO1xuLy9cbi8vICAgIGNvbnN0ICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3BvbHlsaW5lJyk7XG4vLyAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnbGluZScpO1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIGxpbmUuaWQpO1xuLy9cbi8vICAgIGNvbnN0IHBvaW50cyA9IFtcbi8vICAgICAgYCR7dGFpbC54fSwke3RhaWwueX1gLFxuLy8gICAgICBgJHsodGFpbC54ICsgaGVhZC54KSAvIDJ9LCR7KHRhaWwueSArIGhlYWQueSkgLyAyfWAsXG4vLyAgICAgIGAke2hlYWQueH0sJHtoZWFkLnl9YFxuLy8gICAgXTtcbi8vXG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBwb2ludHMuam9pbignICcpKTtcbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3ZlY3Rvci1lZmZlY3QnLCAnbm9uLXNjYWxpbmctc3Ryb2tlJyk7XG4vL1xuLy8gICAgaWYgKGxpbmUuY29sb3IpXG4vLyAgICAgICRzaGFwZS5zdHlsZS5zdHJva2UgPSBsaW5lLmNvbG9yO1xuLy9cbi8vICAgIGlmIChsaW5lLmRpcmVjdGVkKVxuLy8gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnYXJyb3cnKTtcbi8vXG4vLyAgICByZXR1cm4gJHNoYXBlO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogUmVwbGFjZSBhbGwgdGhlIGV4aXN0aW5nIGxpbmVzIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIGxpbmUuXG4vLyAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBsaW5lcyAtIFRoZSBuZXcgbGluZXMgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIHNldExpbmVzKGxpbmVzKSB7XG4vLyAgICB0aGlzLmNsZWFyTGluZXMoKTtcbi8vICAgIHRoaXMuYWRkTGluZXMobGluZXMpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgbGluZXMuXG4vLyAgICovXG4vLyAgY2xlYXJMaW5lcygpIHtcbi8vICAgIGZvciAobGV0IGlkIG9mIHRoaXMuX3JlbmRlcmVkTGluZXMua2V5cygpKSB7XG4vLyAgICAgIHRoaXMuZGVsZXRlTGluZShpZCk7XG4vLyAgICB9XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBBZGQgbmV3IGxpbmVzIHRvIHRoZSBhcmVhLlxuLy8gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBhZGRMaW5lcyhsaW5lcykge1xuLy8gICAgbGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMuYWRkTGluZShsaW5lKSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBBZGQgYSBuZXcgbGluZSB0byB0aGUgYXJlYS5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBuZXcgbGluZSB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgYWRkTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlckxpbmUobGluZSk7XG4vLyAgICAvLyBpbnNlcnQganVzdCBhZnRlciB0aGUgPGRlZnM+IHRhZ1xuLy8gICAgLy8gdGhpcy4kc3ZnLmluc2VydEJlZm9yZSgkc2hhcGUsIHRoaXMuJHN2Zy5maXJzdENoaWxkLm5leHRTaWJsaW5nKTtcbi8vICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuLy9cbi8vICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuc2V0KGxpbmUuaWQsICRzaGFwZSk7XG4vLyAgICB0aGlzLnNoYXBlTGluZU1hcC5zZXQoJHNoYXBlLCBsaW5lKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIGxpbmUuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbGluZSB0byB1cGRhdGUuXG4vLyAgICovXG4vLyAgdXBkYXRlTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZExpbmVzLmdldChsaW5lLmlkKTtcbi8vICAgIGNvbnN0IHRhaWwgPSBsaW5lLnRhaWw7XG4vLyAgICBjb25zdCBoZWFkID0gbGluZS5oZWFkO1xuLy9cbi8vICAgIGNvbnN0IHBvaW50cyA9IFtcbi8vICAgICAgYCR7dGFpbC54fSwke3RhaWwueX1gLFxuLy8gICAgICBgJHsodGFpbC54ICsgaGVhZC54KSAvIDJ9LCR7KHRhaWwueSArIGhlYWQueSkgLyAyfWAsXG4vLyAgICAgIGAke2hlYWQueH0sJHtoZWFkLnl9YFxuLy8gICAgXTtcbi8vXG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBwb2ludHMuam9pbignICcpKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFJlbW92ZSBhIHJlbmRlcmVkIGxpbmUuXG4vLyAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBpZCAtIFRoZSBpZCBvZiB0aGUgbGluZSB0byBkZWxldGUuXG4vLyAgICovXG4vLyAgZGVsZXRlTGluZShpZCkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQoaWQpO1xuLy8gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG4vL1xuLy8gICAgdGhpcy5fcmVuZGVyZWRMaW5lcy5kZWxldGUoaWQpO1xuLy8gICAgdGhpcy5zaGFwZUxpbmVNYXAuZGVsZXRlKCRzaGFwZSk7XG4vLyAgfVxufVxuIl19
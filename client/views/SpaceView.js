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

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SpaceView).call(this, template, content, events, options));

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
      (0, _get3.default)((0, _getPrototypeOf2.default)(SpaceView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
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
//# sourceMappingURL=data:application/json;base64,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QUFBQTs7QUFDaEIsYUFBTyxPQUFQLENBQWU7QUFBQSxlQUFTLE9BQUssUUFBTCxDQUFjLEtBQWQsQ0FBVDtBQUFBLE9BQWY7QUFDRDs7Ozs7Ozs7OzZCQU1RLEssRUFBTztBQUNkLFVBQU0sU0FBUyxLQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBZjtBQUNBLFdBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsTUFBdEI7QUFDQSxXQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsTUFBTSxFQUEvQixFQUFtQyxNQUFuQzs7QUFFQSxXQUFLLGFBQUwsQ0FBbUIsR0FBbkIsQ0FBdUIsTUFBdkIsRUFBK0IsS0FBL0I7QUFDRDs7Ozs7Ozs7O2dDQU1XLEssRUFBTztBQUNqQixVQUFNLFNBQVMsS0FBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLE1BQU0sRUFBL0IsQ0FBZjtBQUNBLFdBQUssV0FBTCxDQUFpQixLQUFqQixFQUF3QixNQUF4QjtBQUNEOzs7Ozs7Ozs7Z0NBTVcsRSxFQUFJO0FBQ2QsVUFBTSxTQUFTLEtBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5QixFQUF6QixDQUFmO0FBQ0EsV0FBSyxJQUFMLENBQVUsV0FBVixDQUFzQixNQUF0QjtBQUNBLFdBQUssZUFBTCxDQUFxQixNQUFyQixDQUE0QixFQUE1Qjs7QUFFQSxXQUFLLGFBQUwsQ0FBbUIsTUFBbkIsQ0FBMEIsTUFBMUI7QUFDRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQXRQa0IsUyIsImZpbGUiOiJTcGFjZVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCBzdmdUZW1wbGF0ZSA9IGBcbjxkaXYgY2xhc3M9XCJzdmctY29udGFpbmVyXCI+XG4gIDxzdmc+PC9zdmc+XG48L2Rpdj5gO1xuXG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHNwYWNlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIHRvIHJlcHJlc2VudCwgc2hvdWxkIGJlIGRlZmluZWQgYnkgYSBgd2lkdGhgLCBhbiBgaGVpZ2h0YCBhbmQgYW4gb3B0aW9ubmFsIGJhY2tncm91bmQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBUaGUgZXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBAdG9kb1xuICAgKi9cbiAgY29uc3RydWN0b3IodGVtcGxhdGUgPSBzdmdUZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjbGFzc05hbWU6ICdzcGFjZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYXJlYSB0byBkaXNwbGF5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hcmVhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB3aWR0aCBvZiB0aGUgcmVuZGVyZWQgYXJlYSBpbiBwaXhlbHMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmFyZWFXaWR0aCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaGVpZ2h0IG9mIHRoZSByZW5kZXJlZCBhcmVhIGluIHBpeGVscy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYXJlYUhlaWdodCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgYSBNYXAgb2YgdGhlICRzaGFwZXMgYW5kIHRoZWlyIHJlbGF0aXZlIHBvaW50IG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVQb2ludE1hcCA9IG5ldyBNYXAoKTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgbGluZSBvYmplY3QuXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKi9cbiAgICB0aGlzLnNoYXBlTGluZU1hcCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX3JlbmRlcmVkTGluZXMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBhcmVhIHRvIGJlIHJlbmRlcmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fSBhcmVhIC0gT24gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGFyZWEgdG8gcmVuZGVyLCBnZW5lcmFsbHlcbiAgICogIGRlZmluZWQgaW4gc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gYXJlYS53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBhcmVhLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGFyZWEuXG4gICAqL1xuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJHN2Z0NvbnRhaW5lciA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJy5zdmctY29udGFpbmVyJyk7XG4gICAgdGhpcy4kc3ZnID0gdGhpcy4kZWwucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgdGhpcy5hZGREZWZpbml0aW9ucygpO1xuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICAgIC8vIG92ZXJyaWRlIHNpemUgdG8gbWF0Y2ggcGFyZW50IHNpemUgaWYgY29tcG9uZW50IG9mIGFub3RoZXIgdmlld1xuICAgIGlmICh0aGlzLnBhcmVudFZpZXcpIHtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAbm90ZSAtIGRvbid0IGV4cG9zZSBmb3Igbm93LlxuICAgKi9cbiAgYWRkRGVmaW5pdGlvbnMoKSB7XG4gICAgdGhpcy4kZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIC8vIGNvbnN0IG1hcmtlckNpcmNsZSA9IGBcbiAgICAvLyAgIDxtYXJrZXIgaWQ9XCJtYXJrZXItY2lyY2xlXCIgbWFya2VyV2lkdGg9XCI3XCIgbWFya2VySGVpZ2h0PVwiN1wiIHJlZlg9XCI0XCIgcmVmWT1cIjRcIiA+XG4gICAgLy8gICAgICAgPGNpcmNsZSBjeD1cIjRcIiBjeT1cIjRcIiByPVwiM1wiIGNsYXNzPVwibWFya2VyLWNpcmNsZVwiIC8+XG4gICAgLy8gICA8L21hcmtlcj5cbiAgICAvLyBgO1xuXG4gICAgY29uc3QgbWFya2VyQXJyb3cgPSBgXG4gICAgICA8bWFya2VyIGlkPVwibWFya2VyLWFycm93XCIgbWFya2VyV2lkdGg9XCIxMFwiIG1hcmtlckhlaWdodD1cIjEwXCIgcmVmWD1cIjVcIiByZWZZPVwiNVwiIG9yaWVudD1cImF1dG9cIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTAsMCBMMCwxMCBMMTAsNSBMMCwwXCIgY2xhc3M9XCJtYXJrZXItYXJyb3dcIiAvPlxuICAgICAgPC9tYXJrZXI+XG4gICAgYDtcblxuICAgIHRoaXMuJGRlZnMuaW5uZXJIVE1MID0gbWFya2VyQXJyb3c7XG4gICAgdGhpcy4kc3ZnLmluc2VydEJlZm9yZSh0aGlzLiRkZWZzLCB0aGlzLiRzdmcuZmlyc3RDaGlsZCk7XG4gIH1cblxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcmVuZGVyQXJlYSgpIHtcbiAgICBjb25zdCBhcmVhID0gdGhpcy5hcmVhO1xuICAgIC8vIHVzZSBgdGhpcy4kZWxgIHNpemUgaW5zdGVhZCBvZiBgdGhpcy4kcGFyZW50YCBzaXplIHRvIGlnbm9yZSBwYXJlbnQgcGFkZGluZ1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICB0aGlzLnJhdGlvID0gTWF0aC5taW4oY29udGFpbmVyV2lkdGggLyBhcmVhLndpZHRoLCBjb250YWluZXJIZWlnaHQgLyBhcmVhLmhlaWdodCk7XG4gICAgY29uc3Qgc3ZnV2lkdGggPSBhcmVhLndpZHRoICogdGhpcy5yYXRpbztcbiAgICBjb25zdCBzdmdIZWlnaHQgPSBhcmVhLmhlaWdodCAqIHRoaXMucmF0aW87XG5cbiAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gc3ZnSGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgbGVmdCA9IChjb250YWluZXJXaWR0aCAtIHN2Z1dpZHRoKSAvIDI7XG5cbiAgICB0aGlzLiRzdmdDb250YWluZXIuc3R5bGUud2lkdGggPSBzdmdXaWR0aCArICdweCc7XG4gICAgdGhpcy4kc3ZnQ29udGFpbmVyLnN0eWxlLmhlaWdodCA9IHN2Z0hlaWdodCArICdweCc7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzdmdXaWR0aCk7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc3ZnSGVpZ2h0KTtcbiAgICAvLyB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke3N2Z1dpZHRofSAke3N2Z0hlaWdodH1gKTtcbiAgICAvLyBjZW50ZXIgdGhlIHN2ZyBpbnRvIHRoZSBwYXJlbnRcbiAgICB0aGlzLiRzdmdDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMuJHN2Z0NvbnRhaW5lci5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgIHRoaXMuJHN2Z0NvbnRhaW5lci5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG5cbiAgICB0aGlzLiRzdmcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMuJHN2Zy5zdHlsZS50b3AgPSBgMHB4YDtcbiAgICB0aGlzLiRzdmcuc3R5bGUubGVmdCA9IGAwcHhgO1xuXG4gICAgLy8gZGlzcGxheSBiYWNrZ3JvdW5kIGlmIGFueVxuICAgIGlmIChhcmVhLmJhY2tncm91bmQpIHtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHthcmVhLmJhY2tncm91bmR9KWA7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb250YWluJztcbiAgICAgIC8vIGZvcmNlICRzdmcgdG8gYmUgdHJhbnNwYXJlbnRcbiAgICAgIHRoaXMuJHN2Zy5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAndHJhbnNwYXJlbnQnO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBleGlzdGluZyBwb2ludHMgcG9zaXRpb25cbiAgICBmb3IgKGxldCBbJHNoYXBlLCBwb2ludF0gb2YgdGhpcy5zaGFwZVBvaW50TWFwKSB7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50KHBvaW50KVxuICAgIH1cblxuICAgIC8vIGV4cG9zZSB0aGUgc2l6ZSBvZiB0aGUgYXJlYSBpbiBwaXhlbFxuICAgIHRoaXMuYXJlYVdpZHRoID0gc3ZnV2lkdGg7XG4gICAgdGhpcy5hcmVhSGVpZ2h0ID0gc3ZnSGVpZ2h0O1xuXG4gICAgLy8gdXBkYXRlIGFyZWEgZm9yIG1hcmtlcnNcbiAgICAvLyBjb25zdCBtYXJrZXJzID0gQXJyYXkuZnJvbSh0aGlzLiRkZWZzLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hcmtlcicpKTtcbiAgICAvLyBtYXJrZXJzLmZvckVhY2goKG1hcmtlcikgPT4ge1xuICAgIC8vICAgbWFya2VyLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmdXaWR0aH0gJHtzdmdIZWlnaHR9YCk7XG4gICAgLy8gfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgcG9pbnQuIFRoaXMgbWV0aG9kIHNob3VsZCBiZVxuICAgKiBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvaW50IHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuIFRoZXNlIHNoYXBlc1xuICAgKiBhcmUgYXBwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBwb2ludCB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gcG9pbnQuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHBvaW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9pbnQueCAtIFRoZSBwb2ludCBpbiB0aGUgeCBheGlzIGluIHRoZSBhcmVhIGNvcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludC55IC0gVGhlIHBvaW50IGluIHRoZSB5IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb2ludC5yYWRpdXM9MC4zXSAtIFRoZSByYWRpdXMgb2YgdGhlIHBvaW50IChyZWxhdGl2ZSB0byB0aGVcbiAgICogIGFyZWEgd2lkdGggYW5kIGhlaWdodCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcG9pbnQuY29sb3I9dW5kZWZpbmVkXSAtIElmIHNwZWNpZmllZCwgdGhlIGNvbG9yIG9mIHRoZSBwb2ludC5cbiAgICovXG4gIHJlbmRlclBvaW50KHBvaW50LCAkc2hhcGUgPSBudWxsKSB7XG4gICAgaWYgKCRzaGFwZSA9PT0gbnVsbCkge1xuICAgICAgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgncG9pbnQnKTtcbiAgICB9XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgcG9pbnQuaWQpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9pbnQueCAqIHRoaXMucmF0aW99YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb2ludC55ICogdGhpcy5yYXRpb31gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9pbnQucmFkaXVzIHx8wqA4KTsgLy8gcmFkaXVzIGlzIHJlbGF0aXZlIHRvIGFyZWEgc2l6ZVxuXG4gICAgaWYgKHBvaW50LmNvbG9yKVxuICAgICAgJHNoYXBlLnN0eWxlLmZpbGwgPSBwb2ludC5jb2xvcjtcblxuICAgIGNvbnN0IG1ldGhvZCA9IHBvaW50LnNlbGVjdGVkID8gJ2FkZCcgOiAncmVtb3ZlJztcbiAgICAkc2hhcGUuY2xhc3NMaXN0W21ldGhvZF0oJ3NlbGVjdGVkJyk7XG5cbiAgICByZXR1cm4gJHNoYXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBwb2ludHMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgcG9pbnQuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgc2V0UG9pbnRzKHBvaW50cykge1xuICAgIHRoaXMuY2xlYXJQb2ludHMoKVxuICAgIHRoaXMuYWRkUG9pbnRzKHBvaW50cyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgcG9pbnRzLlxuICAgKi9cbiAgY2xlYXJQb2ludHMoKSB7XG4gICAgZm9yIChsZXQgaWQgb2YgdGhpcy5fcmVuZGVyZWRQb2ludHMua2V5cygpKSB7XG4gICAgICB0aGlzLmRlbGV0ZVBvaW50KGlkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5ldyBwb2ludHMgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnRzKHBvaW50cykge1xuICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHRoaXMuYWRkUG9pbnQocG9pbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgcG9pbnQgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBuZXcgcG9pbnQgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlclBvaW50KHBvaW50KTtcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5zZXQocG9pbnQuaWQsICRzaGFwZSk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuc2V0KCRzaGFwZSwgcG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvaW50cy5nZXQocG9pbnQuaWQpO1xuICAgIHRoaXMucmVuZGVyUG9pbnQocG9pbnQsICRzaGFwZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgcmVuZGVyZWQgcG9pbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIHBvaW50IHRvIGRlbGV0ZS5cbiAgICovXG4gIGRlbGV0ZVBvaW50KGlkKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb2ludHMuZ2V0KGlkKTtcbiAgICB0aGlzLiRzdmcucmVtb3ZlQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5kZWxldGUoaWQpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvaW50XG4gICAgdGhpcy5zaGFwZVBvaW50TWFwLmRlbGV0ZSgkc2hhcGUpO1xuICB9XG5cblxuLy8gQHRvZG8gLSByZWZhY3RvciB3aXRoIG5ldyB2aWV3Ym94XG4vLyBAdG9kbyAtIHJlbW92ZSBjb2RlIGR1cGxpY2F0aW9uIGluIHVwZGF0ZVxuXG4vLyAgLyoqXG4vLyAgICogVGhlIG1ldGhvZCB1c2VkIHRvIHJlbmRlciBhIHNwZWNpZmljIGxpbmUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvaW50IHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuIFRoZXNlIHNoYXBlcyBhcmUgcHJlcGVuZGVkIHRvIHRoZSBgc3ZnYCBlbGVtZW50XG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbGluZSB0byByZW5kZXIuXG4vLyAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBsaW5lLmlkIC0gQW4gdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBsaW5lLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lLnRhaWwgLSBUaGUgcG9pbnQgd2hlcmUgdGhlIGxpbmUgc2hvdWxkIGJlZ2luLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lLmhlYWQgLSBUaGUgcG9pbnQgd2hlcmUgdGhlIGxpbmUgc2hvdWxkIGVuZC5cbi8vICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtsaW5lLmRpcmVjdGVkPWZhbHNlXSAtIERlZmluZXMgd2hldGhlciB0aGUgbGluZSBzaG91bGQgYmUgZGlyZWN0ZWQgb3Igbm90LlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfSBbbGluZS5jb2xvcj11bmRlZmluZWRdIC0gSWYgc3BlY2lmaWVkLCB0aGUgY29sb3Igb2YgdGhlIGxpbmUuXG4vLyAgICovXG4vLyAgcmVuZGVyTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdwb2x5bGluZScpO1xuLy8gICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2xpbmUnKTtcbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBsaW5lLmlkKTtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCd2ZWN0b3ItZWZmZWN0JywgJ25vbi1zY2FsaW5nLXN0cm9rZScpO1xuLy9cbi8vICAgIGlmIChsaW5lLmNvbG9yKVxuLy8gICAgICAkc2hhcGUuc3R5bGUuc3Ryb2tlID0gbGluZS5jb2xvcjtcbi8vXG4vLyAgICBpZiAobGluZS5kaXJlY3RlZClcbi8vICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2Fycm93Jyk7XG4vL1xuLy8gICAgcmV0dXJuICRzaGFwZTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBsaW5lcyB3aXRoIHRoZSBnaXZlbiBhcnJheSBvZiBsaW5lLlxuLy8gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBzZXRMaW5lcyhsaW5lcykge1xuLy8gICAgdGhpcy5jbGVhckxpbmVzKCk7XG4vLyAgICB0aGlzLmFkZExpbmVzKGxpbmVzKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIGxpbmVzLlxuLy8gICAqL1xuLy8gIGNsZWFyTGluZXMoKSB7XG4vLyAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZExpbmVzLmtleXMoKSkge1xuLy8gICAgICB0aGlzLmRlbGV0ZUxpbmUoaWQpO1xuLy8gICAgfVxuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIG5ldyBsaW5lcyB0byB0aGUgYXJlYS5cbi8vICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGxpbmVzIC0gVGhlIG5ldyBsaW5lcyB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgYWRkTGluZXMobGluZXMpIHtcbi8vICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB0aGlzLmFkZExpbmUobGluZSkpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIGEgbmV3IGxpbmUgdG8gdGhlIGFyZWEuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbmV3IGxpbmUgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIGFkZExpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJMaW5lKGxpbmUpO1xuLy8gICAgLy8gaW5zZXJ0IGp1c3QgYWZ0ZXIgdGhlIDxkZWZzPiB0YWdcbi8vICAgIC8vIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUoJHNoYXBlLCB0aGlzLiRzdmcuZmlyc3RDaGlsZC5uZXh0U2libGluZyk7XG4vLyAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbi8vXG4vLyAgICB0aGlzLl9yZW5kZXJlZExpbmVzLnNldChsaW5lLmlkLCAkc2hhcGUpO1xuLy8gICAgdGhpcy5zaGFwZUxpbmVNYXAuc2V0KCRzaGFwZSwgbGluZSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBVcGRhdGUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gdXBkYXRlLlxuLy8gICAqL1xuLy8gIHVwZGF0ZUxpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQobGluZS5pZCk7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBSZW1vdmUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIGxpbmUgdG8gZGVsZXRlLlxuLy8gICAqL1xuLy8gIGRlbGV0ZUxpbmUoaWQpIHtcbi8vICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkTGluZXMuZ2V0KGlkKTtcbi8vICAgIHRoaXMuJHN2Zy5yZW1vdmVDaGlsZCgkc2hhcGUpO1xuLy9cbi8vICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuZGVsZXRlKGlkKTtcbi8vICAgIHRoaXMuc2hhcGVMaW5lTWFwLmRlbGV0ZSgkc2hhcGUpO1xuLy8gIH1cbn1cbiJdfQ==
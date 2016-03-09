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

var svgTemplate = '<svg></svg>';
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

  (0, _createClass3.default)(SpaceView, [{
    key: 'setArea',
    value: function setArea(area) {
      this.area = area;
    }

    /**
     * Apply style and cache elements when rendered.
     * @private
     */

  }, {
    key: 'onRender',
    value: function onRender() {
      this.$svg = this.$el.querySelector('svg');
      this.addDefinitions();
      this._renderArea();
    }

    /**
     * Update the area when inserted in the DOM.
     * @private
     */

  }, {
    key: 'onResize',
    value: function onResize(viewportWidth, viewportHeight, orientation) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SpaceView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
      // override size to match parent size
      this.$el.style.width = '100%';
      this.$el.style.height = '100%';

      this._renderArea();
    }

    /**
     * Add definitions into the `<defs>` tag of `this.$svg` to allow to draw directed graphs from css
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

    /**
     * Render the area.
     * @private
     */

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

      this.$svg.setAttribute('width', svgWidth);
      this.$svg.setAttribute('height', svgHeight);
      // this.$svg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
      // center the svg into the parent
      this.$svg.style.position = 'relative';
      this.$svg.style.top = top + 'px';
      this.$svg.style.left = left + 'px';

      // display background if any
      if (area.background) {
        this.$el.style.backgroundImage = area.background;
        this.$el.style.backgroundPosition = '50% 50%';
        this.$el.style.backgroundRepeat = 'no-repeat';
        this.$el.style.backgroundSize = 'cover';
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

        // update area for markers
        // const markers = Array.from(this.$defs.querySelectorAll('marker'));
        // markers.forEach((marker) => {
        //   marker.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
        // });
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
    }

    /**
     * The method used to render a specific point. This method should be overriden to display a point with a user defined shape. These shapes are appended to the `svg` element
     * @param {Object} point - The point to render.
     * @param {String|Number} point.id - An unique identifier for the point.
     * @param {Number} point.x - The point in the x axis in the area cordinate system.
     * @param {Number} point.y - The point in the y axis in the area cordinate system.
     * @param {Number} [point.radius=0.3] - The radius of the point (relative to the area width and height).
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

    // @todo - refactor with new viewbox + remove code duplication in update.
    //  /**
    //   * The method used to render a specific line. This method should be overriden to display a point with a user defined shape. These shapes are prepended to the `svg` element
    //   * @param {Object} line - The line to render.
    //   * @param {String|Number} line.id - An unique identifier for the line.
    //   * @param {Object} line.tail - The point where the line should begin.
    //   * @param {Object} line.head - The point where the line should end.
    //   * @param {Boolean} [line.directed=false] - Defines if the line should be directed or not.
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
//# sourceMappingURL=data:application/json;base64,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LElBQUk7QUFDZCxVQUFNLFNBQVMsS0FBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLEVBQXpCLENBQVQsQ0FEUTtBQUVkLFdBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsTUFBdEIsRUFGYztBQUdkLFdBQUssZUFBTCxDQUFxQixNQUFyQixDQUE0QixFQUE1Qjs7QUFIYyxVQUtkLENBQUssYUFBTCxDQUFtQixNQUFuQixDQUEwQixNQUExQixFQUxjOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQWxORyIsImZpbGUiOiJTcGFjZVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCBzdmdUZW1wbGF0ZSA9IGA8c3ZnPjwvc3ZnPmA7XG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHNwYWNlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIHRvIHJlcHJlc2VudCwgc2hvdWxkIGJlIGRlZmluZWQgYnkgYSBgd2lkdGhgLCBhbiBgaGVpZ2h0YCBhbmQgYW4gb3B0aW9ubmFsIGJhY2tncm91bmQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBUaGUgZXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBAdG9kb1xuICAgKi9cbiAgY29uc3RydWN0b3IodGVtcGxhdGUgPSBzdmdUZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjbGFzc05hbWU6ICdzcGFjZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYXJlYSB0byBkaXNwbGF5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hcmVhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgcG9pbnQgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICovXG4gICAgdGhpcy5zaGFwZVBvaW50TWFwID0gbmV3IE1hcCgpO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGEgTWFwIG9mIHRoZSAkc2hhcGVzIGFuZCB0aGVpciByZWxhdGl2ZSBsaW5lIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVMaW5lTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fcmVuZGVyZWRMaW5lcyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgc3R5bGUgYW5kIGNhY2hlIGVsZW1lbnRzIHdoZW4gcmVuZGVyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRzdmcgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICB0aGlzLmFkZERlZmluaXRpb25zKCk7XG4gICAgdGhpcy5fcmVuZGVyQXJlYSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgYXJlYSB3aGVuIGluc2VydGVkIGluIHRoZSBET00uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICAgIC8vIG92ZXJyaWRlIHNpemUgdG8gbWF0Y2ggcGFyZW50IHNpemVcbiAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICB0aGlzLiRlbC5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XG5cbiAgICB0aGlzLl9yZW5kZXJBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGRlZmluaXRpb25zIGludG8gdGhlIGA8ZGVmcz5gIHRhZyBvZiBgdGhpcy4kc3ZnYCB0byBhbGxvdyB0byBkcmF3IGRpcmVjdGVkIGdyYXBocyBmcm9tIGNzc1xuICAgKi9cbiAgYWRkRGVmaW5pdGlvbnMoKSB7XG4gICAgdGhpcy4kZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIC8vIGNvbnN0IG1hcmtlckNpcmNsZSA9IGBcbiAgICAvLyAgIDxtYXJrZXIgaWQ9XCJtYXJrZXItY2lyY2xlXCIgbWFya2VyV2lkdGg9XCI3XCIgbWFya2VySGVpZ2h0PVwiN1wiIHJlZlg9XCI0XCIgcmVmWT1cIjRcIiA+XG4gICAgLy8gICAgICAgPGNpcmNsZSBjeD1cIjRcIiBjeT1cIjRcIiByPVwiM1wiIGNsYXNzPVwibWFya2VyLWNpcmNsZVwiIC8+XG4gICAgLy8gICA8L21hcmtlcj5cbiAgICAvLyBgO1xuXG4gICAgY29uc3QgbWFya2VyQXJyb3cgPSBgXG4gICAgICA8bWFya2VyIGlkPVwibWFya2VyLWFycm93XCIgbWFya2VyV2lkdGg9XCIxMFwiIG1hcmtlckhlaWdodD1cIjEwXCIgcmVmWD1cIjVcIiByZWZZPVwiNVwiIG9yaWVudD1cImF1dG9cIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTAsMCBMMCwxMCBMMTAsNSBMMCwwXCIgY2xhc3M9XCJtYXJrZXItYXJyb3dcIiAvPlxuICAgICAgPC9tYXJrZXI+XG4gICAgYDtcblxuICAgIHRoaXMuJGRlZnMuaW5uZXJIVE1MID0gbWFya2VyQXJyb3c7XG4gICAgdGhpcy4kc3ZnLmluc2VydEJlZm9yZSh0aGlzLiRkZWZzLCB0aGlzLiRzdmcuZmlyc3RDaGlsZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGFyZWEuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVuZGVyQXJlYSgpIHtcbiAgICBjb25zdCBhcmVhID0gdGhpcy5hcmVhO1xuICAgIC8vIHVzZSBgdGhpcy4kZWxgIHNpemUgaW5zdGVhZCBvZiBgdGhpcy4kcGFyZW50YCBzaXplIHRvIGlnbm9yZSBwYXJlbnQgcGFkZGluZ1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICB0aGlzLnJhdGlvID0gTWF0aC5taW4oY29udGFpbmVyV2lkdGggLyBhcmVhLndpZHRoLCBjb250YWluZXJIZWlnaHQgLyBhcmVhLmhlaWdodCk7XG4gICAgY29uc3Qgc3ZnV2lkdGggPSBhcmVhLndpZHRoICogdGhpcy5yYXRpbztcbiAgICBjb25zdCBzdmdIZWlnaHQgPSBhcmVhLmhlaWdodCAqIHRoaXMucmF0aW87XG5cbiAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gc3ZnSGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgbGVmdCA9IChjb250YWluZXJXaWR0aCAtIHN2Z1dpZHRoKSAvIDI7XG5cbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgIC8vIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7c3ZnV2lkdGh9ICR7c3ZnSGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciB0aGUgc3ZnIGludG8gdGhlIHBhcmVudFxuICAgIHRoaXMuJHN2Zy5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcblxuICAgIC8vIGRpc3BsYXkgYmFja2dyb3VuZCBpZiBhbnlcbiAgICBpZiAoYXJlYS5iYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBhcmVhLmJhY2tncm91bmQ7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb3Zlcic7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGV4aXN0aW5nIHBvaW50cyBwb3NpdGlvblxuICAgIGZvciAobGV0IFskc2hhcGUsIHBvaW50XSBvZiB0aGlzLnNoYXBlUG9pbnRNYXApIHtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnQocG9pbnQpXG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGFyZWEgZm9yIG1hcmtlcnNcbiAgICAvLyBjb25zdCBtYXJrZXJzID0gQXJyYXkuZnJvbSh0aGlzLiRkZWZzLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hcmtlcicpKTtcbiAgICAvLyBtYXJrZXJzLmZvckVhY2goKG1hcmtlcikgPT4ge1xuICAgIC8vICAgbWFya2VyLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmdXaWR0aH0gJHtzdmdIZWlnaHR9YCk7XG4gICAgLy8gfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgcG9pbnQuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvaW50IHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuIFRoZXNlIHNoYXBlcyBhcmUgYXBwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwb2ludC5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgcG9pbnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludC54IC0gVGhlIHBvaW50IGluIHRoZSB4IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnkgLSBUaGUgcG9pbnQgaW4gdGhlIHkgYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvaW50LnJhZGl1cz0wLjNdIC0gVGhlIHJhZGl1cyBvZiB0aGUgcG9pbnQgKHJlbGF0aXZlIHRvIHRoZSBhcmVhIHdpZHRoIGFuZCBoZWlnaHQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BvaW50LmNvbG9yPXVuZGVmaW5lZF0gLSBJZiBzcGVjaWZpZWQsIHRoZSBjb2xvciBvZiB0aGUgcG9pbnQuXG4gICAqL1xuICByZW5kZXJQb2ludChwb2ludCwgJHNoYXBlID0gbnVsbCkge1xuICAgIGlmICgkc2hhcGUgPT09IG51bGwpIHtcbiAgICAgICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ3BvaW50Jyk7XG4gICAgfVxuXG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIHBvaW50LmlkKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3BvaW50LnggKiB0aGlzLnJhdGlvfWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9pbnQueSAqIHRoaXMucmF0aW99YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvaW50LnJhZGl1cyB8fMKgOCk7IC8vIHJhZGl1cyBpcyByZWxhdGl2ZSB0byBhcmVhIHNpemVcblxuICAgIGlmIChwb2ludC5jb2xvcilcbiAgICAgICRzaGFwZS5zdHlsZS5maWxsID0gcG9pbnQuY29sb3I7XG5cbiAgICBjb25zdCBtZXRob2QgPSBwb2ludC5zZWxlY3RlZCA/ICdhZGQnIDogJ3JlbW92ZSc7XG4gICAgJHNoYXBlLmNsYXNzTGlzdFttZXRob2RdKCdzZWxlY3RlZCcpO1xuXG4gICAgcmV0dXJuICRzaGFwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCB0aGUgZXhpc3RpbmcgcG9pbnRzIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIHBvaW50LlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvaW50cyAtIFRoZSBuZXcgcG9pbnRzIHRvIHJlbmRlci5cbiAgICovXG4gIHNldFBvaW50cyhwb2ludHMpIHtcbiAgICB0aGlzLmNsZWFyUG9pbnRzKClcbiAgICB0aGlzLmFkZFBvaW50cyhwb2ludHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIHBvaW50cy5cbiAgICovXG4gIGNsZWFyUG9pbnRzKCkge1xuICAgIGZvciAobGV0IGlkIG9mIHRoaXMuX3JlbmRlcmVkUG9pbnRzLmtleXMoKSkge1xuICAgICAgdGhpcy5kZWxldGVQb2ludChpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgcG9pbnRzIHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvaW50cyAtIFRoZSBuZXcgcG9pbnRzIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvaW50cyhwb2ludHMpIHtcbiAgICBwb2ludHMuZm9yRWFjaChwb2ludCA9PiB0aGlzLmFkZFBvaW50KHBvaW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IHBvaW50IHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgbmV3IHBvaW50IHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJQb2ludChwb2ludCk7XG4gICAgdGhpcy4kc3ZnLmFwcGVuZENoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuc2V0KHBvaW50LmlkLCAkc2hhcGUpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvaW50XG4gICAgdGhpcy5zaGFwZVBvaW50TWFwLnNldCgkc2hhcGUsIHBvaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSByZW5kZXJlZCBwb2ludC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZVBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb2ludHMuZ2V0KHBvaW50LmlkKTtcbiAgICB0aGlzLnJlbmRlclBvaW50KHBvaW50LCAkc2hhcGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoZSBwb2ludCB0byBkZWxldGUuXG4gICAqL1xuICBkZWxldGVQb2ludChpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9pbnRzLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuZGVsZXRlKGlkKTtcbiAgICAvLyBtYXAgZm9yIGVhc2llciByZXRyaWV2aW5nIG9mIHRoZSBwb2ludFxuICAgIHRoaXMuc2hhcGVQb2ludE1hcC5kZWxldGUoJHNoYXBlKTtcbiAgfVxuXG5cbi8vIEB0b2RvIC0gcmVmYWN0b3Igd2l0aCBuZXcgdmlld2JveCArIHJlbW92ZSBjb2RlIGR1cGxpY2F0aW9uIGluIHVwZGF0ZS5cbi8vICAvKipcbi8vICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgbGluZS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzIGFyZSBwcmVwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnRcbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBsaW5lIHRvIHJlbmRlci5cbi8vICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGxpbmUuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGxpbmUuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUudGFpbCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgYmVnaW4uXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUuaGVhZCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgZW5kLlxuLy8gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xpbmUuZGlyZWN0ZWQ9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGluZSBzaG91bGQgYmUgZGlyZWN0ZWQgb3Igbm90LlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfSBbbGluZS5jb2xvcj11bmRlZmluZWRdIC0gSWYgc3BlY2lmaWVkLCB0aGUgY29sb3Igb2YgdGhlIGxpbmUuXG4vLyAgICovXG4vLyAgcmVuZGVyTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdwb2x5bGluZScpO1xuLy8gICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2xpbmUnKTtcbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBsaW5lLmlkKTtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCd2ZWN0b3ItZWZmZWN0JywgJ25vbi1zY2FsaW5nLXN0cm9rZScpO1xuLy9cbi8vICAgIGlmIChsaW5lLmNvbG9yKVxuLy8gICAgICAkc2hhcGUuc3R5bGUuc3Ryb2tlID0gbGluZS5jb2xvcjtcbi8vXG4vLyAgICBpZiAobGluZS5kaXJlY3RlZClcbi8vICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2Fycm93Jyk7XG4vL1xuLy8gICAgcmV0dXJuICRzaGFwZTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBsaW5lcyB3aXRoIHRoZSBnaXZlbiBhcnJheSBvZiBsaW5lLlxuLy8gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBzZXRMaW5lcyhsaW5lcykge1xuLy8gICAgdGhpcy5jbGVhckxpbmVzKCk7XG4vLyAgICB0aGlzLmFkZExpbmVzKGxpbmVzKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIGxpbmVzLlxuLy8gICAqL1xuLy8gIGNsZWFyTGluZXMoKSB7XG4vLyAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZExpbmVzLmtleXMoKSkge1xuLy8gICAgICB0aGlzLmRlbGV0ZUxpbmUoaWQpO1xuLy8gICAgfVxuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIG5ldyBsaW5lcyB0byB0aGUgYXJlYS5cbi8vICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGxpbmVzIC0gVGhlIG5ldyBsaW5lcyB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgYWRkTGluZXMobGluZXMpIHtcbi8vICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB0aGlzLmFkZExpbmUobGluZSkpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIGEgbmV3IGxpbmUgdG8gdGhlIGFyZWEuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbmV3IGxpbmUgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIGFkZExpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJMaW5lKGxpbmUpO1xuLy8gICAgLy8gaW5zZXJ0IGp1c3QgYWZ0ZXIgdGhlIDxkZWZzPiB0YWdcbi8vICAgIC8vIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUoJHNoYXBlLCB0aGlzLiRzdmcuZmlyc3RDaGlsZC5uZXh0U2libGluZyk7XG4vLyAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbi8vXG4vLyAgICB0aGlzLl9yZW5kZXJlZExpbmVzLnNldChsaW5lLmlkLCAkc2hhcGUpO1xuLy8gICAgdGhpcy5zaGFwZUxpbmVNYXAuc2V0KCRzaGFwZSwgbGluZSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBVcGRhdGUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gdXBkYXRlLlxuLy8gICAqL1xuLy8gIHVwZGF0ZUxpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQobGluZS5pZCk7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBSZW1vdmUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIGxpbmUgdG8gZGVsZXRlLlxuLy8gICAqL1xuLy8gIGRlbGV0ZUxpbmUoaWQpIHtcbi8vICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkTGluZXMuZ2V0KGlkKTtcbi8vICAgIHRoaXMuJHN2Zy5yZW1vdmVDaGlsZCgkc2hhcGUpO1xuLy9cbi8vICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuZGVsZXRlKGlkKTtcbi8vICAgIHRoaXMuc2hhcGVMaW5lTWFwLmRlbGV0ZSgkc2hhcGUpO1xuLy8gIH1cbn1cbiJdfQ==
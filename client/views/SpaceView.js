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
     * The with of the rendered area in pixels.
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
//# sourceMappingURL=data:application/json;base64,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QixNQUFNLEVBQS9CLENBQWY7QUFDQSxXQUFLLFdBQUwsQ0FBaUIsS0FBakIsRUFBd0IsTUFBeEI7QUFDRDs7Ozs7Ozs7O2dDQU1XLEUsRUFBSTtBQUNkLFVBQU0sU0FBUyxLQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsRUFBekIsQ0FBZjtBQUNBLFdBQUssSUFBTCxDQUFVLFdBQVYsQ0FBc0IsTUFBdEI7QUFDQSxXQUFLLGVBQUwsQ0FBcUIsTUFBckIsQ0FBNEIsRUFBNUI7O0FBRUEsV0FBSyxhQUFMLENBQW1CLE1BQW5CLENBQTBCLE1BQTFCO0FBQ0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkE3T2tCLFMiLCJmaWxlIjoiU3BhY2VWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3Qgc3ZnVGVtcGxhdGUgPSBgPHN2Zz48L3N2Zz5gO1xuY29uc3QgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYWNlVmlldyBleHRlbmRzIFZpZXcge1xuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBzcGFjZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgYXJlYSB0byByZXByZXNlbnQsIHNob3VsZCBiZSBkZWZpbmVkIGJ5IGEgYHdpZHRoYCwgYW4gYGhlaWdodGAgYW5kIGFuIG9wdGlvbm5hbCBiYWNrZ3JvdW5kLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gVGhlIGV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQHRvZG9cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlID0gc3ZnVGVtcGxhdGUsIGNvbnRlbnQgPSB7fSwgZXZlbnRzID0ge30sIG9wdGlvbnMgPSB7fSkge1xuICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHsgY2xhc3NOYW1lOiAnc3BhY2UnIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKHRlbXBsYXRlLCBjb250ZW50LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFyZWEgdG8gZGlzcGxheS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuYXJlYSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgd2l0aCBvZiB0aGUgcmVuZGVyZWQgYXJlYSBpbiBwaXhlbHMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmFyZWFXaWR0aCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaGVpZ2h0IG9mIHRoZSByZW5kZXJlZCBhcmVhIGluIHBpeGVscy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYXJlYUhlaWdodCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgYSBNYXAgb2YgdGhlICRzaGFwZXMgYW5kIHRoZWlyIHJlbGF0aXZlIHBvaW50IG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVQb2ludE1hcCA9IG5ldyBNYXAoKTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgbGluZSBvYmplY3QuXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKi9cbiAgICB0aGlzLnNoYXBlTGluZU1hcCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX3JlbmRlcmVkTGluZXMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBhcmVhIHRvIGJlIHJlbmRlcmVyLlxuICAgKiBAdHlwZSB7T2JqZWN0fSBhcmVhIC0gT24gb2JqZWN0IGRlc2NyaWJpbmcgdGhlIGFyZWEgdG8gcmVuZGVyLCBnZW5lcmFsbHlcbiAgICogIGRlZmluZWQgaW4gc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBhdHRyaWJ1dGUge051bWJlcn0gYXJlYS53aWR0aCAtIFRoZSB3aWR0aCBvZiB0aGUgYXJlYS5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBhcmVhLmhlaWdodCAtIFRoZSBoZWlnaHQgb2YgdGhlIGFyZWEuXG4gICAqL1xuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJHN2ZyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgIHRoaXMuYWRkRGVmaW5pdGlvbnMoKTtcbiAgICB0aGlzLl9yZW5kZXJBcmVhKCk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgb25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKSB7XG4gICAgc3VwZXIub25SZXNpemUodmlld3BvcnRXaWR0aCwgdmlld3BvcnRIZWlnaHQsIG9yaWVudGF0aW9uKTtcbiAgICAvLyBvdmVycmlkZSBzaXplIHRvIG1hdGNoIHBhcmVudCBzaXplIGlmIGNvbXBvbmVudCBvZiBhbm90aGVyIHZpZXdcbiAgICBpZiAodGhpcy5wYXJlbnRWaWV3KSB7XG4gICAgICB0aGlzLiRlbC5zdHlsZS53aWR0aCA9ICcxMDAlJztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcbiAgICB9XG5cbiAgICB0aGlzLl9yZW5kZXJBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICogQG5vdGUgLSBkb24ndCBleHBvc2UgZm9yIG5vdy5cbiAgICovXG4gIGFkZERlZmluaXRpb25zKCkge1xuICAgIHRoaXMuJGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICAvLyBjb25zdCBtYXJrZXJDaXJjbGUgPSBgXG4gICAgLy8gICA8bWFya2VyIGlkPVwibWFya2VyLWNpcmNsZVwiIG1hcmtlcldpZHRoPVwiN1wiIG1hcmtlckhlaWdodD1cIjdcIiByZWZYPVwiNFwiIHJlZlk9XCI0XCIgPlxuICAgIC8vICAgICAgIDxjaXJjbGUgY3g9XCI0XCIgY3k9XCI0XCIgcj1cIjNcIiBjbGFzcz1cIm1hcmtlci1jaXJjbGVcIiAvPlxuICAgIC8vICAgPC9tYXJrZXI+XG4gICAgLy8gYDtcblxuICAgIGNvbnN0IG1hcmtlckFycm93ID0gYFxuICAgICAgPG1hcmtlciBpZD1cIm1hcmtlci1hcnJvd1wiIG1hcmtlcldpZHRoPVwiMTBcIiBtYXJrZXJIZWlnaHQ9XCIxMFwiIHJlZlg9XCI1XCIgcmVmWT1cIjVcIiBvcmllbnQ9XCJhdXRvXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0wLDAgTDAsMTAgTDEwLDUgTDAsMFwiIGNsYXNzPVwibWFya2VyLWFycm93XCIgLz5cbiAgICAgIDwvbWFya2VyPlxuICAgIGA7XG5cbiAgICB0aGlzLiRkZWZzLmlubmVySFRNTCA9IG1hcmtlckFycm93O1xuICAgIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUodGhpcy4kZGVmcywgdGhpcy4kc3ZnLmZpcnN0Q2hpbGQpO1xuICB9XG5cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3JlbmRlckFyZWEoKSB7XG4gICAgY29uc3QgYXJlYSA9IHRoaXMuYXJlYTtcbiAgICAvLyB1c2UgYHRoaXMuJGVsYCBzaXplIGluc3RlYWQgb2YgYHRoaXMuJHBhcmVudGAgc2l6ZSB0byBpZ25vcmUgcGFyZW50IHBhZGRpbmdcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG4gICAgdGhpcy5yYXRpbyA9IE1hdGgubWluKGNvbnRhaW5lcldpZHRoIC8gYXJlYS53aWR0aCwgY29udGFpbmVySGVpZ2h0IC8gYXJlYS5oZWlnaHQpO1xuICAgIGNvbnN0IHN2Z1dpZHRoID0gYXJlYS53aWR0aCAqIHRoaXMucmF0aW87XG4gICAgY29uc3Qgc3ZnSGVpZ2h0ID0gYXJlYS5oZWlnaHQgKiB0aGlzLnJhdGlvO1xuXG4gICAgY29uc3QgdG9wID0gKGNvbnRhaW5lckhlaWdodCAtIHN2Z0hlaWdodCkgLyAyO1xuICAgIGNvbnN0IGxlZnQgPSAoY29udGFpbmVyV2lkdGggLSBzdmdXaWR0aCkgLyAyO1xuXG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzdmdXaWR0aCk7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc3ZnSGVpZ2h0KTtcbiAgICAvLyB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke3N2Z1dpZHRofSAke3N2Z0hlaWdodH1gKTtcbiAgICAvLyBjZW50ZXIgdGhlIHN2ZyBpbnRvIHRoZSBwYXJlbnRcbiAgICB0aGlzLiRzdmcuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xuICAgIHRoaXMuJHN2Zy5zdHlsZS50b3AgPSBgJHt0b3B9cHhgO1xuICAgIHRoaXMuJHN2Zy5zdHlsZS5sZWZ0ID0gYCR7bGVmdH1weGA7XG5cbiAgICAvLyBkaXNwbGF5IGJhY2tncm91bmQgaWYgYW55XG4gICAgaWYgKGFyZWEuYmFja2dyb3VuZCkge1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYXJlYS5iYWNrZ3JvdW5kO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY292ZXInO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSBleGlzdGluZyBwb2ludHMgcG9zaXRpb25cbiAgICBmb3IgKGxldCBbJHNoYXBlLCBwb2ludF0gb2YgdGhpcy5zaGFwZVBvaW50TWFwKSB7XG4gICAgICB0aGlzLnVwZGF0ZVBvaW50KHBvaW50KVxuICAgIH1cblxuICAgIC8vIGV4cG9zZSB0aGUgc2l6ZSBvZiB0aGUgYXJlYSBpbiBwaXhlbFxuICAgIHRoaXMuYXJlYVdpZHRoID0gc3ZnV2lkdGg7XG4gICAgdGhpcy5hcmVhSGVpZ2h0ID0gc3ZnSGVpZ2h0O1xuXG4gICAgLy8gdXBkYXRlIGFyZWEgZm9yIG1hcmtlcnNcbiAgICAvLyBjb25zdCBtYXJrZXJzID0gQXJyYXkuZnJvbSh0aGlzLiRkZWZzLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hcmtlcicpKTtcbiAgICAvLyBtYXJrZXJzLmZvckVhY2goKG1hcmtlcikgPT4ge1xuICAgIC8vICAgbWFya2VyLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmdXaWR0aH0gJHtzdmdIZWlnaHR9YCk7XG4gICAgLy8gfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgcG9pbnQuIFRoaXMgbWV0aG9kIHNob3VsZCBiZVxuICAgKiBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvaW50IHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuIFRoZXNlIHNoYXBlc1xuICAgKiBhcmUgYXBwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBwb2ludCB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gcG9pbnQuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIHBvaW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9pbnQueCAtIFRoZSBwb2ludCBpbiB0aGUgeCBheGlzIGluIHRoZSBhcmVhIGNvcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludC55IC0gVGhlIHBvaW50IGluIHRoZSB5IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtwb2ludC5yYWRpdXM9MC4zXSAtIFRoZSByYWRpdXMgb2YgdGhlIHBvaW50IChyZWxhdGl2ZSB0byB0aGVcbiAgICogIGFyZWEgd2lkdGggYW5kIGhlaWdodCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcG9pbnQuY29sb3I9dW5kZWZpbmVkXSAtIElmIHNwZWNpZmllZCwgdGhlIGNvbG9yIG9mIHRoZSBwb2ludC5cbiAgICovXG4gIHJlbmRlclBvaW50KHBvaW50LCAkc2hhcGUgPSBudWxsKSB7XG4gICAgaWYgKCRzaGFwZSA9PT0gbnVsbCkge1xuICAgICAgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgncG9pbnQnKTtcbiAgICB9XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgcG9pbnQuaWQpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9pbnQueCAqIHRoaXMucmF0aW99YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb2ludC55ICogdGhpcy5yYXRpb31gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9pbnQucmFkaXVzIHx8wqA4KTsgLy8gcmFkaXVzIGlzIHJlbGF0aXZlIHRvIGFyZWEgc2l6ZVxuXG4gICAgaWYgKHBvaW50LmNvbG9yKVxuICAgICAgJHNoYXBlLnN0eWxlLmZpbGwgPSBwb2ludC5jb2xvcjtcblxuICAgIGNvbnN0IG1ldGhvZCA9IHBvaW50LnNlbGVjdGVkID8gJ2FkZCcgOiAncmVtb3ZlJztcbiAgICAkc2hhcGUuY2xhc3NMaXN0W21ldGhvZF0oJ3NlbGVjdGVkJyk7XG5cbiAgICByZXR1cm4gJHNoYXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBwb2ludHMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgcG9pbnQuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgc2V0UG9pbnRzKHBvaW50cykge1xuICAgIHRoaXMuY2xlYXJQb2ludHMoKVxuICAgIHRoaXMuYWRkUG9pbnRzKHBvaW50cyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgcG9pbnRzLlxuICAgKi9cbiAgY2xlYXJQb2ludHMoKSB7XG4gICAgZm9yIChsZXQgaWQgb2YgdGhpcy5fcmVuZGVyZWRQb2ludHMua2V5cygpKSB7XG4gICAgICB0aGlzLmRlbGV0ZVBvaW50KGlkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5ldyBwb2ludHMgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnRzKHBvaW50cykge1xuICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHRoaXMuYWRkUG9pbnQocG9pbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgcG9pbnQgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBuZXcgcG9pbnQgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlclBvaW50KHBvaW50KTtcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5zZXQocG9pbnQuaWQsICRzaGFwZSk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuc2V0KCRzaGFwZSwgcG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvaW50cy5nZXQocG9pbnQuaWQpO1xuICAgIHRoaXMucmVuZGVyUG9pbnQocG9pbnQsICRzaGFwZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgcmVuZGVyZWQgcG9pbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIHBvaW50IHRvIGRlbGV0ZS5cbiAgICovXG4gIGRlbGV0ZVBvaW50KGlkKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb2ludHMuZ2V0KGlkKTtcbiAgICB0aGlzLiRzdmcucmVtb3ZlQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5kZWxldGUoaWQpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvaW50XG4gICAgdGhpcy5zaGFwZVBvaW50TWFwLmRlbGV0ZSgkc2hhcGUpO1xuICB9XG5cblxuLy8gQHRvZG8gLSByZWZhY3RvciB3aXRoIG5ldyB2aWV3Ym94XG4vLyBAdG9kbyAtIHJlbW92ZSBjb2RlIGR1cGxpY2F0aW9uIGluIHVwZGF0ZVxuXG4vLyAgLyoqXG4vLyAgICogVGhlIG1ldGhvZCB1c2VkIHRvIHJlbmRlciBhIHNwZWNpZmljIGxpbmUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvaW50IHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuIFRoZXNlIHNoYXBlcyBhcmUgcHJlcGVuZGVkIHRvIHRoZSBgc3ZnYCBlbGVtZW50XG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbGluZSB0byByZW5kZXIuXG4vLyAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBsaW5lLmlkIC0gQW4gdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBsaW5lLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lLnRhaWwgLSBUaGUgcG9pbnQgd2hlcmUgdGhlIGxpbmUgc2hvdWxkIGJlZ2luLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lLmhlYWQgLSBUaGUgcG9pbnQgd2hlcmUgdGhlIGxpbmUgc2hvdWxkIGVuZC5cbi8vICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtsaW5lLmRpcmVjdGVkPWZhbHNlXSAtIERlZmluZXMgd2hldGhlciB0aGUgbGluZSBzaG91bGQgYmUgZGlyZWN0ZWQgb3Igbm90LlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfSBbbGluZS5jb2xvcj11bmRlZmluZWRdIC0gSWYgc3BlY2lmaWVkLCB0aGUgY29sb3Igb2YgdGhlIGxpbmUuXG4vLyAgICovXG4vLyAgcmVuZGVyTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdwb2x5bGluZScpO1xuLy8gICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2xpbmUnKTtcbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBsaW5lLmlkKTtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCd2ZWN0b3ItZWZmZWN0JywgJ25vbi1zY2FsaW5nLXN0cm9rZScpO1xuLy9cbi8vICAgIGlmIChsaW5lLmNvbG9yKVxuLy8gICAgICAkc2hhcGUuc3R5bGUuc3Ryb2tlID0gbGluZS5jb2xvcjtcbi8vXG4vLyAgICBpZiAobGluZS5kaXJlY3RlZClcbi8vICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2Fycm93Jyk7XG4vL1xuLy8gICAgcmV0dXJuICRzaGFwZTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBsaW5lcyB3aXRoIHRoZSBnaXZlbiBhcnJheSBvZiBsaW5lLlxuLy8gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBzZXRMaW5lcyhsaW5lcykge1xuLy8gICAgdGhpcy5jbGVhckxpbmVzKCk7XG4vLyAgICB0aGlzLmFkZExpbmVzKGxpbmVzKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIGxpbmVzLlxuLy8gICAqL1xuLy8gIGNsZWFyTGluZXMoKSB7XG4vLyAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZExpbmVzLmtleXMoKSkge1xuLy8gICAgICB0aGlzLmRlbGV0ZUxpbmUoaWQpO1xuLy8gICAgfVxuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIG5ldyBsaW5lcyB0byB0aGUgYXJlYS5cbi8vICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGxpbmVzIC0gVGhlIG5ldyBsaW5lcyB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgYWRkTGluZXMobGluZXMpIHtcbi8vICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB0aGlzLmFkZExpbmUobGluZSkpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIGEgbmV3IGxpbmUgdG8gdGhlIGFyZWEuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbmV3IGxpbmUgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIGFkZExpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJMaW5lKGxpbmUpO1xuLy8gICAgLy8gaW5zZXJ0IGp1c3QgYWZ0ZXIgdGhlIDxkZWZzPiB0YWdcbi8vICAgIC8vIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUoJHNoYXBlLCB0aGlzLiRzdmcuZmlyc3RDaGlsZC5uZXh0U2libGluZyk7XG4vLyAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbi8vXG4vLyAgICB0aGlzLl9yZW5kZXJlZExpbmVzLnNldChsaW5lLmlkLCAkc2hhcGUpO1xuLy8gICAgdGhpcy5zaGFwZUxpbmVNYXAuc2V0KCRzaGFwZSwgbGluZSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBVcGRhdGUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gdXBkYXRlLlxuLy8gICAqL1xuLy8gIHVwZGF0ZUxpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQobGluZS5pZCk7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBSZW1vdmUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIGxpbmUgdG8gZGVsZXRlLlxuLy8gICAqL1xuLy8gIGRlbGV0ZUxpbmUoaWQpIHtcbi8vICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkTGluZXMuZ2V0KGlkKTtcbi8vICAgIHRoaXMuJHN2Zy5yZW1vdmVDaGlsZCgkc2hhcGUpO1xuLy9cbi8vICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuZGVsZXRlKGlkKTtcbi8vICAgIHRoaXMuc2hhcGVMaW5lTWFwLmRlbGV0ZSgkc2hhcGUpO1xuLy8gIH1cbn1cbiJdfQ==
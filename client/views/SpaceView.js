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
//# sourceMappingURL=data:application/json;base64,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QW1CLEdBQW5CLENBQXVCLE1BQXZCLEVBQStCLEtBQS9CLEVBTGM7Ozs7Ozs7Ozs7Z0NBWUosT0FBTztBQUNqQixVQUFNLFNBQVMsS0FBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLE1BQU0sRUFBTixDQUFsQyxDQURXO0FBRWpCLFdBQUssV0FBTCxDQUFpQixLQUFqQixFQUF3QixNQUF4QixFQUZpQjs7Ozs7Ozs7OztnQ0FTUCxJQUFJO0FBQ2QsVUFBTSxTQUFTLEtBQUssZUFBTCxDQUFxQixHQUFyQixDQUF5QixFQUF6QixDQUFULENBRFE7QUFFZCxXQUFLLElBQUwsQ0FBVSxXQUFWLENBQXNCLE1BQXRCLEVBRmM7QUFHZCxXQUFLLGVBQUwsQ0FBcUIsTUFBckIsQ0FBNEIsRUFBNUI7O0FBSGMsVUFLZCxDQUFLLGFBQUwsQ0FBbUIsTUFBbkIsQ0FBMEIsTUFBMUIsRUFMYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQXZPRyIsImZpbGUiOiJTcGFjZVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCBzdmdUZW1wbGF0ZSA9IGA8c3ZnPjwvc3ZnPmA7XG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHNwYWNlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIHRvIHJlcHJlc2VudCwgc2hvdWxkIGJlIGRlZmluZWQgYnkgYSBgd2lkdGhgLCBhbiBgaGVpZ2h0YCBhbmQgYW4gb3B0aW9ubmFsIGJhY2tncm91bmQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBUaGUgZXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBAdG9kb1xuICAgKi9cbiAgY29uc3RydWN0b3IodGVtcGxhdGUgPSBzdmdUZW1wbGF0ZSwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjbGFzc05hbWU6ICdzcGFjZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGVtcGxhdGUsIGNvbnRlbnQsIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYXJlYSB0byBkaXNwbGF5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hcmVhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSB3aXRoIG9mIHRoZSByZW5kZXJlZCBhcmVhIGluIHBpeGVscy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuYXJlYVdpZHRoID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBoZWlnaHQgb2YgdGhlIHJlbmRlcmVkIGFyZWEgaW4gcGl4ZWxzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5hcmVhSGVpZ2h0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgcG9pbnQgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICovXG4gICAgdGhpcy5zaGFwZVBvaW50TWFwID0gbmV3IE1hcCgpO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGEgTWFwIG9mIHRoZSAkc2hhcGVzIGFuZCB0aGVpciByZWxhdGl2ZSBsaW5lIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVMaW5lTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fcmVuZGVyZWRMaW5lcyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgdGhlIGFyZWEgdG8gYmUgcmVuZGVyZXIuXG4gICAqIEB0eXBlIHtPYmplY3R9IGFyZWEgLSBPbiBvYmplY3QgZGVzY3JpYmluZyB0aGUgYXJlYSB0byByZW5kZXIsIGdlbmVyYWxseVxuICAgKiAgZGVmaW5lZCBpbiBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogQGF0dHJpYnV0ZSB7TnVtYmVyfSBhcmVhLndpZHRoIC0gVGhlIHdpZHRoIG9mIHRoZSBhcmVhLlxuICAgKiBAYXR0cmlidXRlIHtOdW1iZXJ9IGFyZWEuaGVpZ2h0IC0gVGhlIGhlaWdodCBvZiB0aGUgYXJlYS5cbiAgICovXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kc3ZnID0gdGhpcy4kZWwucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgdGhpcy5hZGREZWZpbml0aW9ucygpO1xuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBvblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pIHtcbiAgICBzdXBlci5vblJlc2l6ZSh2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCwgb3JpZW50YXRpb24pO1xuICAgIC8vIG92ZXJyaWRlIHNpemUgdG8gbWF0Y2ggcGFyZW50IHNpemUgaWYgY29tcG9uZW50IG9mIGFub3RoZXIgdmlld1xuICAgIGlmICh0aGlzLnBhcmVudFZpZXcpIHtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuICAgIH1cblxuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAbm90ZSAtIGRvbid0IGV4cG9zZSBmb3Igbm93LlxuICAgKi9cbiAgYWRkRGVmaW5pdGlvbnMoKSB7XG4gICAgdGhpcy4kZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIC8vIGNvbnN0IG1hcmtlckNpcmNsZSA9IGBcbiAgICAvLyAgIDxtYXJrZXIgaWQ9XCJtYXJrZXItY2lyY2xlXCIgbWFya2VyV2lkdGg9XCI3XCIgbWFya2VySGVpZ2h0PVwiN1wiIHJlZlg9XCI0XCIgcmVmWT1cIjRcIiA+XG4gICAgLy8gICAgICAgPGNpcmNsZSBjeD1cIjRcIiBjeT1cIjRcIiByPVwiM1wiIGNsYXNzPVwibWFya2VyLWNpcmNsZVwiIC8+XG4gICAgLy8gICA8L21hcmtlcj5cbiAgICAvLyBgO1xuXG4gICAgY29uc3QgbWFya2VyQXJyb3cgPSBgXG4gICAgICA8bWFya2VyIGlkPVwibWFya2VyLWFycm93XCIgbWFya2VyV2lkdGg9XCIxMFwiIG1hcmtlckhlaWdodD1cIjEwXCIgcmVmWD1cIjVcIiByZWZZPVwiNVwiIG9yaWVudD1cImF1dG9cIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTAsMCBMMCwxMCBMMTAsNSBMMCwwXCIgY2xhc3M9XCJtYXJrZXItYXJyb3dcIiAvPlxuICAgICAgPC9tYXJrZXI+XG4gICAgYDtcblxuICAgIHRoaXMuJGRlZnMuaW5uZXJIVE1MID0gbWFya2VyQXJyb3c7XG4gICAgdGhpcy4kc3ZnLmluc2VydEJlZm9yZSh0aGlzLiRkZWZzLCB0aGlzLiRzdmcuZmlyc3RDaGlsZCk7XG4gIH1cblxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfcmVuZGVyQXJlYSgpIHtcbiAgICBjb25zdCBhcmVhID0gdGhpcy5hcmVhO1xuICAgIC8vIHVzZSBgdGhpcy4kZWxgIHNpemUgaW5zdGVhZCBvZiBgdGhpcy4kcGFyZW50YCBzaXplIHRvIGlnbm9yZSBwYXJlbnQgcGFkZGluZ1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICB0aGlzLnJhdGlvID0gTWF0aC5taW4oY29udGFpbmVyV2lkdGggLyBhcmVhLndpZHRoLCBjb250YWluZXJIZWlnaHQgLyBhcmVhLmhlaWdodCk7XG4gICAgY29uc3Qgc3ZnV2lkdGggPSBhcmVhLndpZHRoICogdGhpcy5yYXRpbztcbiAgICBjb25zdCBzdmdIZWlnaHQgPSBhcmVhLmhlaWdodCAqIHRoaXMucmF0aW87XG5cbiAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gc3ZnSGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgbGVmdCA9IChjb250YWluZXJXaWR0aCAtIHN2Z1dpZHRoKSAvIDI7XG5cbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgIC8vIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7c3ZnV2lkdGh9ICR7c3ZnSGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciB0aGUgc3ZnIGludG8gdGhlIHBhcmVudFxuICAgIHRoaXMuJHN2Zy5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcblxuICAgIC8vIGRpc3BsYXkgYmFja2dyb3VuZCBpZiBhbnlcbiAgICBpZiAoYXJlYS5iYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBhcmVhLmJhY2tncm91bmQ7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb3Zlcic7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGV4aXN0aW5nIHBvaW50cyBwb3NpdGlvblxuICAgIGZvciAobGV0IFskc2hhcGUsIHBvaW50XSBvZiB0aGlzLnNoYXBlUG9pbnRNYXApIHtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnQocG9pbnQpXG4gICAgfVxuXG4gICAgLy8gZXhwb3NlIHRoZSBzaXplIG9mIHRoZSBhcmVhIGluIHBpeGVsXG4gICAgdGhpcy5hcmVhV2lkdGggPSBzdmdXaWR0aDtcbiAgICB0aGlzLmFyZWFIZWlnaHQgPSBzdmdIZWlnaHQ7XG5cbiAgICAvLyB1cGRhdGUgYXJlYSBmb3IgbWFya2Vyc1xuICAgIC8vIGNvbnN0IG1hcmtlcnMgPSBBcnJheS5mcm9tKHRoaXMuJGRlZnMucXVlcnlTZWxlY3RvckFsbCgnbWFya2VyJykpO1xuICAgIC8vIG1hcmtlcnMuZm9yRWFjaCgobWFya2VyKSA9PiB7XG4gICAgLy8gICBtYXJrZXIuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke3N2Z1dpZHRofSAke3N2Z0hlaWdodH1gKTtcbiAgICAvLyB9KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBwb2ludC4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlXG4gICAqIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzXG4gICAqIGFyZSBhcHBlbmRlZCB0byB0aGUgYHN2Z2AgZWxlbWVudC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwb2ludC5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgcG9pbnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludC54IC0gVGhlIHBvaW50IGluIHRoZSB4IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnkgLSBUaGUgcG9pbnQgaW4gdGhlIHkgYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvaW50LnJhZGl1cz0wLjNdIC0gVGhlIHJhZGl1cyBvZiB0aGUgcG9pbnQgKHJlbGF0aXZlIHRvIHRoZVxuICAgKiAgYXJlYSB3aWR0aCBhbmQgaGVpZ2h0KS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtwb2ludC5jb2xvcj11bmRlZmluZWRdIC0gSWYgc3BlY2lmaWVkLCB0aGUgY29sb3Igb2YgdGhlIHBvaW50LlxuICAgKi9cbiAgcmVuZGVyUG9pbnQocG9pbnQsICRzaGFwZSA9IG51bGwpIHtcbiAgICBpZiAoJHNoYXBlID09PSBudWxsKSB7XG4gICAgICAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdjaXJjbGUnKTtcbiAgICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdwb2ludCcpO1xuICAgIH1cblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBwb2ludC5pZCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3gnLCBgJHtwb2ludC54ICogdGhpcy5yYXRpb31gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeScsIGAke3BvaW50LnkgKiB0aGlzLnJhdGlvfWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3InLCBwb2ludC5yYWRpdXMgfHzCoDgpOyAvLyByYWRpdXMgaXMgcmVsYXRpdmUgdG8gYXJlYSBzaXplXG5cbiAgICBpZiAocG9pbnQuY29sb3IpXG4gICAgICAkc2hhcGUuc3R5bGUuZmlsbCA9IHBvaW50LmNvbG9yO1xuXG4gICAgY29uc3QgbWV0aG9kID0gcG9pbnQuc2VsZWN0ZWQgPyAnYWRkJyA6ICdyZW1vdmUnO1xuICAgICRzaGFwZS5jbGFzc0xpc3RbbWV0aG9kXSgnc2VsZWN0ZWQnKTtcblxuICAgIHJldHVybiAkc2hhcGU7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbGwgdGhlIGV4aXN0aW5nIHBvaW50cyB3aXRoIHRoZSBnaXZlbiBhcnJheSBvZiBwb2ludC5cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBwb2ludHMgLSBUaGUgbmV3IHBvaW50cyB0byByZW5kZXIuXG4gICAqL1xuICBzZXRQb2ludHMocG9pbnRzKSB7XG4gICAgdGhpcy5jbGVhclBvaW50cygpXG4gICAgdGhpcy5hZGRQb2ludHMocG9pbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbGwgdGhlIGRpc3BsYXllZCBwb2ludHMuXG4gICAqL1xuICBjbGVhclBvaW50cygpIHtcbiAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZFBvaW50cy5rZXlzKCkpIHtcbiAgICAgIHRoaXMuZGVsZXRlUG9pbnQoaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IHBvaW50cyB0byB0aGUgYXJlYS5cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBwb2ludHMgLSBUaGUgbmV3IHBvaW50cyB0byByZW5kZXIuXG4gICAqL1xuICBhZGRQb2ludHMocG9pbnRzKSB7XG4gICAgcG9pbnRzLmZvckVhY2gocG9pbnQgPT4gdGhpcy5hZGRQb2ludChwb2ludCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBwb2ludCB0byB0aGUgYXJlYS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIG5ldyBwb2ludCB0byByZW5kZXIuXG4gICAqL1xuICBhZGRQb2ludChwb2ludCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMucmVuZGVyUG9pbnQocG9pbnQpO1xuICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzLnNldChwb2ludC5pZCwgJHNoYXBlKTtcbiAgICAvLyBtYXAgZm9yIGVhc2llciByZXRyaWV2aW5nIG9mIHRoZSBwb2ludFxuICAgIHRoaXMuc2hhcGVQb2ludE1hcC5zZXQoJHNoYXBlLCBwb2ludCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIGEgcmVuZGVyZWQgcG9pbnQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBwb2ludCB0byB1cGRhdGUuXG4gICAqL1xuICB1cGRhdGVQb2ludChwb2ludCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9pbnRzLmdldChwb2ludC5pZCk7XG4gICAgdGhpcy5yZW5kZXJQb2ludChwb2ludCwgJHNoYXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByZW5kZXJlZCBwb2ludC5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBpZCAtIFRoZSBpZCBvZiB0aGUgcG9pbnQgdG8gZGVsZXRlLlxuICAgKi9cbiAgZGVsZXRlUG9pbnQoaWQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvaW50cy5nZXQoaWQpO1xuICAgIHRoaXMuJHN2Zy5yZW1vdmVDaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzLmRlbGV0ZShpZCk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuZGVsZXRlKCRzaGFwZSk7XG4gIH1cblxuXG4vLyBAdG9kbyAtIHJlZmFjdG9yIHdpdGggbmV3IHZpZXdib3hcbi8vIEB0b2RvIC0gcmVtb3ZlIGNvZGUgZHVwbGljYXRpb24gaW4gdXBkYXRlXG5cbi8vICAvKipcbi8vICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgbGluZS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzIGFyZSBwcmVwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnRcbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBsaW5lIHRvIHJlbmRlci5cbi8vICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGxpbmUuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGxpbmUuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUudGFpbCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgYmVnaW4uXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUuaGVhZCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgZW5kLlxuLy8gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xpbmUuZGlyZWN0ZWQ9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGluZSBzaG91bGQgYmUgZGlyZWN0ZWQgb3Igbm90LlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfSBbbGluZS5jb2xvcj11bmRlZmluZWRdIC0gSWYgc3BlY2lmaWVkLCB0aGUgY29sb3Igb2YgdGhlIGxpbmUuXG4vLyAgICovXG4vLyAgcmVuZGVyTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdwb2x5bGluZScpO1xuLy8gICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2xpbmUnKTtcbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBsaW5lLmlkKTtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCd2ZWN0b3ItZWZmZWN0JywgJ25vbi1zY2FsaW5nLXN0cm9rZScpO1xuLy9cbi8vICAgIGlmIChsaW5lLmNvbG9yKVxuLy8gICAgICAkc2hhcGUuc3R5bGUuc3Ryb2tlID0gbGluZS5jb2xvcjtcbi8vXG4vLyAgICBpZiAobGluZS5kaXJlY3RlZClcbi8vICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2Fycm93Jyk7XG4vL1xuLy8gICAgcmV0dXJuICRzaGFwZTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBsaW5lcyB3aXRoIHRoZSBnaXZlbiBhcnJheSBvZiBsaW5lLlxuLy8gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBzZXRMaW5lcyhsaW5lcykge1xuLy8gICAgdGhpcy5jbGVhckxpbmVzKCk7XG4vLyAgICB0aGlzLmFkZExpbmVzKGxpbmVzKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIGxpbmVzLlxuLy8gICAqL1xuLy8gIGNsZWFyTGluZXMoKSB7XG4vLyAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZExpbmVzLmtleXMoKSkge1xuLy8gICAgICB0aGlzLmRlbGV0ZUxpbmUoaWQpO1xuLy8gICAgfVxuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIG5ldyBsaW5lcyB0byB0aGUgYXJlYS5cbi8vICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGxpbmVzIC0gVGhlIG5ldyBsaW5lcyB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgYWRkTGluZXMobGluZXMpIHtcbi8vICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB0aGlzLmFkZExpbmUobGluZSkpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIGEgbmV3IGxpbmUgdG8gdGhlIGFyZWEuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbmV3IGxpbmUgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIGFkZExpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJMaW5lKGxpbmUpO1xuLy8gICAgLy8gaW5zZXJ0IGp1c3QgYWZ0ZXIgdGhlIDxkZWZzPiB0YWdcbi8vICAgIC8vIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUoJHNoYXBlLCB0aGlzLiRzdmcuZmlyc3RDaGlsZC5uZXh0U2libGluZyk7XG4vLyAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbi8vXG4vLyAgICB0aGlzLl9yZW5kZXJlZExpbmVzLnNldChsaW5lLmlkLCAkc2hhcGUpO1xuLy8gICAgdGhpcy5zaGFwZUxpbmVNYXAuc2V0KCRzaGFwZSwgbGluZSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBVcGRhdGUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gdXBkYXRlLlxuLy8gICAqL1xuLy8gIHVwZGF0ZUxpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQobGluZS5pZCk7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBSZW1vdmUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIGxpbmUgdG8gZGVsZXRlLlxuLy8gICAqL1xuLy8gIGRlbGV0ZUxpbmUoaWQpIHtcbi8vICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkTGluZXMuZ2V0KGlkKTtcbi8vICAgIHRoaXMuJHN2Zy5yZW1vdmVDaGlsZCgkc2hhcGUpO1xuLy9cbi8vICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuZGVsZXRlKGlkKTtcbi8vICAgIHRoaXMuc2hhcGVMaW5lTWFwLmRlbGV0ZSgkc2hhcGUpO1xuLy8gIH1cbn1cbiJdfQ==
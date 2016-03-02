'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

var svgTemplate = '<svg></svg>';
var ns = 'http://www.w3.org/2000/svg';

var SpaceView = (function (_View) {
  _inherits(SpaceView, _View);

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

    _classCallCheck(this, SpaceView);

    options = _Object$assign({ className: 'space' }, options);
    _get(Object.getPrototypeOf(SpaceView.prototype), 'constructor', this).call(this, template, content, events, options);

    /**
     * The area to display.
     * @type {Object}
     */
    this.area = null;

    /**
     * Expose a Map of the $shapes and their relative point object.
     * @type {Map}
     */
    this.shapePointMap = new _Map();

    /**
     * Expose a Map of the $shapes and their relative line object.
     * @type {Map}
     */
    this.shapeLineMap = new _Map();

    this._renderedPoints = new _Map();
    this._renderedLines = new _Map();
  }

  _createClass(SpaceView, [{
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
      _get(Object.getPrototypeOf(SpaceView.prototype), 'onResize', this).call(this, viewportWidth, viewportHeight, orientation);
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
        for (var _iterator = _getIterator(this.shapePointMap), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _slicedToArray(_step.value, 2);

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
          if (!_iteratorNormalCompletion && _iterator['return']) {
            _iterator['return']();
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
        for (var _iterator2 = _getIterator(this._renderedPoints.keys()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var id = _step2.value;

          this.deletePoint(id);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2['return']) {
            _iterator2['return']();
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
      var _this = this;

      points.forEach(function (point) {
        return _this.addPoint(point);
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
      this._renderedPoints['delete'](id);
      // map for easier retrieving of the point
      this.shapePointMap['delete']($shape);
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
})(_View3['default']);

exports['default'] = SpaceView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2Rpc3BsYXkvU3BhY2VWaWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFBaUIsUUFBUTs7OztBQUV6QixJQUFNLFdBQVcsZ0JBQWdCLENBQUM7QUFDbEMsSUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUM7O0lBR25CLFNBQVM7WUFBVCxTQUFTOzs7Ozs7Ozs7QUFPakIsV0FQUSxTQUFTLEdBT2lEO1FBQWpFLFFBQVEseURBQUcsV0FBVztRQUFFLE9BQU8seURBQUcsRUFBRTtRQUFFLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBUHhELFNBQVM7O0FBUTFCLFdBQU8sR0FBRyxlQUFjLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELCtCQVRpQixTQUFTLDZDQVNwQixRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7Ozs7OztBQU0xQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxhQUFhLEdBQUcsVUFBUyxDQUFDOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxVQUFTLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxlQUFlLEdBQUcsVUFBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBUyxDQUFDO0dBQ2pDOztlQS9Ca0IsU0FBUzs7V0FpQ3JCLGlCQUFDLElBQUksRUFBRTtBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCOzs7Ozs7OztXQU1PLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMx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TyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ25DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBeE5rQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9kaXNwbGF5L1NwYWNlVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IHN2Z1RlbXBsYXRlID0gYDxzdmc+PC9zdmc+YDtcbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGFjZVZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBuZXcgc3BhY2UgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgdG8gcmVwcmVzZW50LCBzaG91bGQgYmUgZGVmaW5lZCBieSBhIGB3aWR0aGAsIGFuIGBoZWlnaHRgIGFuZCBhbiBvcHRpb25uYWwgYmFja2dyb3VuZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIFRoZSBldmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEB0b2RvXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih0ZW1wbGF0ZSA9IHN2Z1RlbXBsYXRlLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNsYXNzTmFtZTogJ3NwYWNlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwgY29udGVudCwgZXZlbnRzLCBvcHRpb25zKTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBhcmVhIHRvIGRpc3BsYXkuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLmFyZWEgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGEgTWFwIG9mIHRoZSAkc2hhcGVzIGFuZCB0aGVpciByZWxhdGl2ZSBwb2ludCBvYmplY3QuXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKi9cbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgYSBNYXAgb2YgdGhlICRzaGFwZXMgYW5kIHRoZWlyIHJlbGF0aXZlIGxpbmUgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICovXG4gICAgdGhpcy5zaGFwZUxpbmVNYXAgPSBuZXcgTWFwKCk7XG5cbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9yZW5kZXJlZExpbmVzID0gbmV3IE1hcCgpO1xuICB9XG5cbiAgc2V0QXJlYShhcmVhKSB7XG4gICAgdGhpcy5hcmVhID0gYXJlYTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBzdHlsZSBhbmQgY2FjaGUgZWxlbWVudHMgd2hlbiByZW5kZXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJHN2ZyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgIHRoaXMuYWRkRGVmaW5pdGlvbnMoKTtcbiAgICB0aGlzLl9yZW5kZXJBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBhcmVhIHdoZW4gaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbikge1xuICAgIHN1cGVyLm9uUmVzaXplKHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0LCBvcmllbnRhdGlvbik7XG4gICAgLy8gb3ZlcnJpZGUgc2l6ZSB0byBtYXRjaCBwYXJlbnQgc2l6ZVxuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblxuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZGVmaW5pdGlvbnMgaW50byB0aGUgYDxkZWZzPmAgdGFnIG9mIGB0aGlzLiRzdmdgIHRvIGFsbG93IHRvIGRyYXcgZGlyZWN0ZWQgZ3JhcGhzIGZyb20gY3NzXG4gICAqL1xuICBhZGREZWZpbml0aW9ucygpIHtcbiAgICB0aGlzLiRkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgLy8gY29uc3QgbWFya2VyQ2lyY2xlID0gYFxuICAgIC8vICAgPG1hcmtlciBpZD1cIm1hcmtlci1jaXJjbGVcIiBtYXJrZXJXaWR0aD1cIjdcIiBtYXJrZXJIZWlnaHQ9XCI3XCIgcmVmWD1cIjRcIiByZWZZPVwiNFwiID5cbiAgICAvLyAgICAgICA8Y2lyY2xlIGN4PVwiNFwiIGN5PVwiNFwiIHI9XCIzXCIgY2xhc3M9XCJtYXJrZXItY2lyY2xlXCIgLz5cbiAgICAvLyAgIDwvbWFya2VyPlxuICAgIC8vIGA7XG5cbiAgICBjb25zdCBtYXJrZXJBcnJvdyA9IGBcbiAgICAgIDxtYXJrZXIgaWQ9XCJtYXJrZXItYXJyb3dcIiBtYXJrZXJXaWR0aD1cIjEwXCIgbWFya2VySGVpZ2h0PVwiMTBcIiByZWZYPVwiNVwiIHJlZlk9XCI1XCIgb3JpZW50PVwiYXV0b1wiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMCwwIEwwLDEwIEwxMCw1IEwwLDBcIiBjbGFzcz1cIm1hcmtlci1hcnJvd1wiIC8+XG4gICAgICA8L21hcmtlcj5cbiAgICBgO1xuXG4gICAgdGhpcy4kZGVmcy5pbm5lckhUTUwgPSBtYXJrZXJBcnJvdztcbiAgICB0aGlzLiRzdmcuaW5zZXJ0QmVmb3JlKHRoaXMuJGRlZnMsIHRoaXMuJHN2Zy5maXJzdENoaWxkKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgYXJlYS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9yZW5kZXJBcmVhKCkge1xuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmFyZWE7XG4gICAgLy8gdXNlIGB0aGlzLiRlbGAgc2l6ZSBpbnN0ZWFkIG9mIGB0aGlzLiRwYXJlbnRgIHNpemUgdG8gaWdub3JlIHBhcmVudCBwYWRkaW5nXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIHRoaXMucmF0aW8gPSBNYXRoLm1pbihjb250YWluZXJXaWR0aCAvIGFyZWEud2lkdGgsIGNvbnRhaW5lckhlaWdodCAvIGFyZWEuaGVpZ2h0KTtcbiAgICBjb25zdCBzdmdXaWR0aCA9IGFyZWEud2lkdGggKiB0aGlzLnJhdGlvO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGFyZWEuaGVpZ2h0ICogdGhpcy5yYXRpbztcblxuICAgIGNvbnN0IHRvcCA9IChjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMjtcbiAgICBjb25zdCBsZWZ0ID0gKGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMjtcblxuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc3ZnV2lkdGgpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgLy8gdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmdXaWR0aH0gJHtzdmdIZWlnaHR9YCk7XG4gICAgLy8gY2VudGVyIHRoZSBzdmcgaW50byB0aGUgcGFyZW50XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB0aGlzLiRzdmcuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbiAgICB0aGlzLiRzdmcuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuXG4gICAgLy8gZGlzcGxheSBiYWNrZ3JvdW5kIGlmIGFueVxuICAgIGlmIChhcmVhLmJhY2tncm91bmQpIHtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGFyZWEuYmFja2dyb3VuZDtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvdmVyJztcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgZXhpc3RpbmcgcG9pbnRzIHBvc2l0aW9uXG4gICAgZm9yIChsZXQgWyRzaGFwZSwgcG9pbnRdIG9mIHRoaXMuc2hhcGVQb2ludE1hcCkge1xuICAgICAgdGhpcy51cGRhdGVQb2ludChwb2ludClcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYXJlYSBmb3IgbWFya2Vyc1xuICAgIC8vIGNvbnN0IG1hcmtlcnMgPSBBcnJheS5mcm9tKHRoaXMuJGRlZnMucXVlcnlTZWxlY3RvckFsbCgnbWFya2VyJykpO1xuICAgIC8vIG1hcmtlcnMuZm9yRWFjaCgobWFya2VyKSA9PiB7XG4gICAgLy8gICBtYXJrZXIuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke3N2Z1dpZHRofSAke3N2Z0hlaWdodH1gKTtcbiAgICAvLyB9KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBwb2ludC4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzIGFyZSBhcHBlbmRlZCB0byB0aGUgYHN2Z2AgZWxlbWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHBvaW50LmlkIC0gQW4gdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBwb2ludC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnggLSBUaGUgcG9pbnQgaW4gdGhlIHggYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9pbnQueSAtIFRoZSBwb2ludCBpbiB0aGUgeSBheGlzIGluIHRoZSBhcmVhIGNvcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9pbnQucmFkaXVzPTAuM10gLSBUaGUgcmFkaXVzIG9mIHRoZSBwb2ludCAocmVsYXRpdmUgdG8gdGhlIGFyZWEgd2lkdGggYW5kIGhlaWdodCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcG9pbnQuY29sb3I9dW5kZWZpbmVkXSAtIElmIHNwZWNpZmllZCwgdGhlIGNvbG9yIG9mIHRoZSBwb2ludC5cbiAgICovXG4gIHJlbmRlclBvaW50KHBvaW50LCAkc2hhcGUgPSBudWxsKSB7XG4gICAgaWYgKCRzaGFwZSA9PT0gbnVsbCkge1xuICAgICAgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgncG9pbnQnKTtcbiAgICB9XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgcG9pbnQuaWQpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9pbnQueCAqIHRoaXMucmF0aW99YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb2ludC55ICogdGhpcy5yYXRpb31gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9pbnQucmFkaXVzIHx8wqA4KTsgLy8gcmFkaXVzIGlzIHJlbGF0aXZlIHRvIGFyZWEgc2l6ZVxuXG4gICAgaWYgKHBvaW50LmNvbG9yKVxuICAgICAgJHNoYXBlLnN0eWxlLmZpbGwgPSBwb2ludC5jb2xvcjtcblxuICAgIGNvbnN0IG1ldGhvZCA9IHBvaW50LnNlbGVjdGVkID8gJ2FkZCcgOiAncmVtb3ZlJztcbiAgICAkc2hhcGUuY2xhc3NMaXN0W21ldGhvZF0oJ3NlbGVjdGVkJyk7XG5cbiAgICByZXR1cm4gJHNoYXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBwb2ludHMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgcG9pbnQuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgc2V0UG9pbnRzKHBvaW50cykge1xuICAgIHRoaXMuY2xlYXJQb2ludHMoKVxuICAgIHRoaXMuYWRkUG9pbnRzKHBvaW50cyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgcG9pbnRzLlxuICAgKi9cbiAgY2xlYXJQb2ludHMoKSB7XG4gICAgZm9yIChsZXQgaWQgb2YgdGhpcy5fcmVuZGVyZWRQb2ludHMua2V5cygpKSB7XG4gICAgICB0aGlzLmRlbGV0ZVBvaW50KGlkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5ldyBwb2ludHMgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnRzKHBvaW50cykge1xuICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHRoaXMuYWRkUG9pbnQocG9pbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgcG9pbnQgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBuZXcgcG9pbnQgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlclBvaW50KHBvaW50KTtcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5zZXQocG9pbnQuaWQsICRzaGFwZSk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuc2V0KCRzaGFwZSwgcG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvaW50cy5nZXQocG9pbnQuaWQpO1xuICAgIHRoaXMucmVuZGVyUG9pbnQocG9pbnQsICRzaGFwZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgcmVuZGVyZWQgcG9pbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIHBvaW50IHRvIGRlbGV0ZS5cbiAgICovXG4gIGRlbGV0ZVBvaW50KGlkKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb2ludHMuZ2V0KGlkKTtcbiAgICB0aGlzLiRzdmcucmVtb3ZlQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5kZWxldGUoaWQpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvaW50XG4gICAgdGhpcy5zaGFwZVBvaW50TWFwLmRlbGV0ZSgkc2hhcGUpO1xuICB9XG5cblxuLy8gQHRvZG8gLSByZWZhY3RvciB3aXRoIG5ldyB2aWV3Ym94ICsgcmVtb3ZlIGNvZGUgZHVwbGljYXRpb24gaW4gdXBkYXRlLlxuLy8gIC8qKlxuLy8gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBsaW5lLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIHRvIGRpc3BsYXkgYSBwb2ludCB3aXRoIGEgdXNlciBkZWZpbmVkIHNoYXBlLiBUaGVzZSBzaGFwZXMgYXJlIHByZXBlbmRlZCB0byB0aGUgYHN2Z2AgZWxlbWVudFxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gcmVuZGVyLlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gbGluZS5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgbGluZS5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZS50YWlsIC0gVGhlIHBvaW50IHdoZXJlIHRoZSBsaW5lIHNob3VsZCBiZWdpbi5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZS5oZWFkIC0gVGhlIHBvaW50IHdoZXJlIHRoZSBsaW5lIHNob3VsZCBlbmQuXG4vLyAgICogQHBhcmFtIHtCb29sZWFufSBbbGluZS5kaXJlY3RlZD1mYWxzZV0gLSBEZWZpbmVzIGlmIHRoZSBsaW5lIHNob3VsZCBiZSBkaXJlY3RlZCBvciBub3QuXG4vLyAgICogQHBhcmFtIHtTdHJpbmd9IFtsaW5lLmNvbG9yPXVuZGVmaW5lZF0gLSBJZiBzcGVjaWZpZWQsIHRoZSBjb2xvciBvZiB0aGUgbGluZS5cbi8vICAgKi9cbi8vICByZW5kZXJMaW5lKGxpbmUpIHtcbi8vICAgIGNvbnN0IHRhaWwgPSBsaW5lLnRhaWw7XG4vLyAgICBjb25zdCBoZWFkID0gbGluZS5oZWFkO1xuLy9cbi8vICAgIGNvbnN0ICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3BvbHlsaW5lJyk7XG4vLyAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnbGluZScpO1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIGxpbmUuaWQpO1xuLy9cbi8vICAgIGNvbnN0IHBvaW50cyA9IFtcbi8vICAgICAgYCR7dGFpbC54fSwke3RhaWwueX1gLFxuLy8gICAgICBgJHsodGFpbC54ICsgaGVhZC54KSAvIDJ9LCR7KHRhaWwueSArIGhlYWQueSkgLyAyfWAsXG4vLyAgICAgIGAke2hlYWQueH0sJHtoZWFkLnl9YFxuLy8gICAgXTtcbi8vXG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBwb2ludHMuam9pbignICcpKTtcbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3ZlY3Rvci1lZmZlY3QnLCAnbm9uLXNjYWxpbmctc3Ryb2tlJyk7XG4vL1xuLy8gICAgaWYgKGxpbmUuY29sb3IpXG4vLyAgICAgICRzaGFwZS5zdHlsZS5zdHJva2UgPSBsaW5lLmNvbG9yO1xuLy9cbi8vICAgIGlmIChsaW5lLmRpcmVjdGVkKVxuLy8gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnYXJyb3cnKTtcbi8vXG4vLyAgICByZXR1cm4gJHNoYXBlO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogUmVwbGFjZSBhbGwgdGhlIGV4aXN0aW5nIGxpbmVzIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIGxpbmUuXG4vLyAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBsaW5lcyAtIFRoZSBuZXcgbGluZXMgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIHNldExpbmVzKGxpbmVzKSB7XG4vLyAgICB0aGlzLmNsZWFyTGluZXMoKTtcbi8vICAgIHRoaXMuYWRkTGluZXMobGluZXMpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgbGluZXMuXG4vLyAgICovXG4vLyAgY2xlYXJMaW5lcygpIHtcbi8vICAgIGZvciAobGV0IGlkIG9mIHRoaXMuX3JlbmRlcmVkTGluZXMua2V5cygpKSB7XG4vLyAgICAgIHRoaXMuZGVsZXRlTGluZShpZCk7XG4vLyAgICB9XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBBZGQgbmV3IGxpbmVzIHRvIHRoZSBhcmVhLlxuLy8gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBhZGRMaW5lcyhsaW5lcykge1xuLy8gICAgbGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMuYWRkTGluZShsaW5lKSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBBZGQgYSBuZXcgbGluZSB0byB0aGUgYXJlYS5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBuZXcgbGluZSB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgYWRkTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlckxpbmUobGluZSk7XG4vLyAgICAvLyBpbnNlcnQganVzdCBhZnRlciB0aGUgPGRlZnM+IHRhZ1xuLy8gICAgLy8gdGhpcy4kc3ZnLmluc2VydEJlZm9yZSgkc2hhcGUsIHRoaXMuJHN2Zy5maXJzdENoaWxkLm5leHRTaWJsaW5nKTtcbi8vICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuLy9cbi8vICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuc2V0KGxpbmUuaWQsICRzaGFwZSk7XG4vLyAgICB0aGlzLnNoYXBlTGluZU1hcC5zZXQoJHNoYXBlLCBsaW5lKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIGxpbmUuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbGluZSB0byB1cGRhdGUuXG4vLyAgICovXG4vLyAgdXBkYXRlTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZExpbmVzLmdldChsaW5lLmlkKTtcbi8vICAgIGNvbnN0IHRhaWwgPSBsaW5lLnRhaWw7XG4vLyAgICBjb25zdCBoZWFkID0gbGluZS5oZWFkO1xuLy9cbi8vICAgIGNvbnN0IHBvaW50cyA9IFtcbi8vICAgICAgYCR7dGFpbC54fSwke3RhaWwueX1gLFxuLy8gICAgICBgJHsodGFpbC54ICsgaGVhZC54KSAvIDJ9LCR7KHRhaWwueSArIGhlYWQueSkgLyAyfWAsXG4vLyAgICAgIGAke2hlYWQueH0sJHtoZWFkLnl9YFxuLy8gICAgXTtcbi8vXG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBwb2ludHMuam9pbignICcpKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFJlbW92ZSBhIHJlbmRlcmVkIGxpbmUuXG4vLyAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBpZCAtIFRoZSBpZCBvZiB0aGUgbGluZSB0byBkZWxldGUuXG4vLyAgICovXG4vLyAgZGVsZXRlTGluZShpZCkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQoaWQpO1xuLy8gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG4vL1xuLy8gICAgdGhpcy5fcmVuZGVyZWRMaW5lcy5kZWxldGUoaWQpO1xuLy8gICAgdGhpcy5zaGFwZUxpbmVNYXAuZGVsZXRlKCRzaGFwZSk7XG4vLyAgfVxufVxuIl19
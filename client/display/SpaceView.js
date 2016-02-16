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
    var template = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var content = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var events = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    _classCallCheck(this, SpaceView);

    options = _Object$assign({ className: 'space' }, options);
    _get(Object.getPrototypeOf(SpaceView.prototype), 'constructor', this).call(this, template || svgTemplate, {}, events, options);

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
    value: function onResize(orientation, viewportWidth, viewportHeight) {
      _get(Object.getPrototypeOf(SpaceView.prototype), 'onResize', this).call(this, orientation, viewportWidth, viewportHeight);
      // override size to match parent size
      this.$el.style.width = '100%';
      this.$el.style.height = '100%';

      this._renderArea();
    }

    /**
     * Update the area when inserted in the DOM.
     * @private
     */
  }, {
    key: 'onShow',
    value: function onShow() {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0FBRXpCLElBQU0sV0FBVyxnQkFBZ0IsQ0FBQztBQUNsQyxJQUFNLEVBQUUsR0FBRyw0QkFBNEIsQ0FBQzs7SUFHbkIsU0FBUztZQUFULFNBQVM7Ozs7Ozs7OztBQU9qQixXQVBRLFNBQVMsR0FPMEM7UUFBMUQsUUFBUSx5REFBRyxJQUFJO1FBQUUsT0FBTyx5REFBRyxFQUFFO1FBQUUsTUFBTSx5REFBRyxFQUFFO1FBQUUsT0FBTyx5REFBRyxFQUFFOzswQkFQakQsU0FBUzs7QUFRMUIsV0FBTyxHQUFHLGVBQWMsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDekQsK0JBVGlCLFNBQVMsNkNBU3BCLFFBQVEsSUFBSSxXQUFXLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7Ozs7OztBQU1wRCxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxhQUFhLEdBQUcsVUFBUyxDQUFDOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxVQUFTLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxlQUFlLEdBQUcsVUFBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBUyxDQUFDO0dBQ2pDOztlQS9Ca0IsU0FBUzs7V0FpQ3JCLGlCQUFDLElBQUksRUFBRTtBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2xCOzs7Ozs7OztXQU1PLG9CQUFHO0FBQ1QsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxVQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdEIsVUFBSSxDQUFDLFdBQVcsRUFBRSxD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TyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ25DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBak9rQixTQUFTOzs7cUJBQVQsU0FBUyIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvU3BhY2VWaWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcblxuY29uc3Qgc3ZnVGVtcGxhdGUgPSBgPHN2Zz48L3N2Zz5gO1xuY29uc3QgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYWNlVmlldyBleHRlbmRzIFZpZXcge1xuICAvKipcbiAgICogUmV0dXJucyBhIG5ldyBzcGFjZSBpbnN0YW5jZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBUaGUgYXJlYSB0byByZXByZXNlbnQsIHNob3VsZCBiZSBkZWZpbmVkIGJ5IGEgYHdpZHRoYCwgYW4gYGhlaWdodGAgYW5kIGFuIG9wdGlvbm5hbCBiYWNrZ3JvdW5kLlxuICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnRzIC0gVGhlIGV2ZW50cyB0byBhdHRhY2ggdG8gdGhlIHZpZXcuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gQHRvZG9cbiAgICovXG4gIGNvbnN0cnVjdG9yKHRlbXBsYXRlID0gbnVsbCwgY29udGVudCA9IHt9LCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjbGFzc05hbWU6ICdzcGFjZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGVtcGxhdGUgfHwgc3ZnVGVtcGxhdGUsIHt9LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFyZWEgdG8gZGlzcGxheS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuYXJlYSA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgYSBNYXAgb2YgdGhlICRzaGFwZXMgYW5kIHRoZWlyIHJlbGF0aXZlIHBvaW50IG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVQb2ludE1hcCA9IG5ldyBNYXAoKTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgbGluZSBvYmplY3QuXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKi9cbiAgICB0aGlzLnNoYXBlTGluZU1hcCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX3JlbmRlcmVkTGluZXMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICBzZXRBcmVhKGFyZWEpIHtcbiAgICB0aGlzLmFyZWEgPSBhcmVhO1xuICB9XG5cbiAgLyoqXG4gICAqIEFwcGx5IHN0eWxlIGFuZCBjYWNoZSBlbGVtZW50cyB3aGVuIHJlbmRlcmVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25SZW5kZXIoKSB7XG4gICAgdGhpcy4kc3ZnID0gdGhpcy4kZWwucXVlcnlTZWxlY3Rvcignc3ZnJyk7XG4gICAgdGhpcy5hZGREZWZpbml0aW9ucygpO1xuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGFyZWEgd2hlbiBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgc3VwZXIub25SZXNpemUob3JpZW50YXRpb24sIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KTtcbiAgICAvLyBvdmVycmlkZSBzaXplIHRvIG1hdGNoIHBhcmVudCBzaXplXG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuXG4gICAgdGhpcy5fcmVuZGVyQXJlYSgpO1xuICB9XG5cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBhcmVhIHdoZW4gaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLl9yZW5kZXJBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGRlZmluaXRpb25zIGludG8gdGhlIGA8ZGVmcz5gIHRhZyBvZiBgdGhpcy4kc3ZnYCB0byBhbGxvdyB0byBkcmF3IGRpcmVjdGVkIGdyYXBocyBmcm9tIGNzc1xuICAgKi9cbiAgYWRkRGVmaW5pdGlvbnMoKSB7XG4gICAgdGhpcy4kZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIC8vIGNvbnN0IG1hcmtlckNpcmNsZSA9IGBcbiAgICAvLyAgIDxtYXJrZXIgaWQ9XCJtYXJrZXItY2lyY2xlXCIgbWFya2VyV2lkdGg9XCI3XCIgbWFya2VySGVpZ2h0PVwiN1wiIHJlZlg9XCI0XCIgcmVmWT1cIjRcIiA+XG4gICAgLy8gICAgICAgPGNpcmNsZSBjeD1cIjRcIiBjeT1cIjRcIiByPVwiM1wiIGNsYXNzPVwibWFya2VyLWNpcmNsZVwiIC8+XG4gICAgLy8gICA8L21hcmtlcj5cbiAgICAvLyBgO1xuXG4gICAgY29uc3QgbWFya2VyQXJyb3cgPSBgXG4gICAgICA8bWFya2VyIGlkPVwibWFya2VyLWFycm93XCIgbWFya2VyV2lkdGg9XCIxMFwiIG1hcmtlckhlaWdodD1cIjEwXCIgcmVmWD1cIjVcIiByZWZZPVwiNVwiIG9yaWVudD1cImF1dG9cIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTAsMCBMMCwxMCBMMTAsNSBMMCwwXCIgY2xhc3M9XCJtYXJrZXItYXJyb3dcIiAvPlxuICAgICAgPC9tYXJrZXI+XG4gICAgYDtcblxuICAgIHRoaXMuJGRlZnMuaW5uZXJIVE1MID0gbWFya2VyQXJyb3c7XG4gICAgdGhpcy4kc3ZnLmluc2VydEJlZm9yZSh0aGlzLiRkZWZzLCB0aGlzLiRzdmcuZmlyc3RDaGlsZCk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGFyZWEuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVuZGVyQXJlYSgpIHtcbiAgICBjb25zdCBhcmVhID0gdGhpcy5hcmVhO1xuICAgIC8vIHVzZSBgdGhpcy4kZWxgIHNpemUgaW5zdGVhZCBvZiBgdGhpcy4kcGFyZW50YCBzaXplIHRvIGlnbm9yZSBwYXJlbnQgcGFkZGluZ1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cbiAgICB0aGlzLnJhdGlvID0gTWF0aC5taW4oY29udGFpbmVyV2lkdGggLyBhcmVhLndpZHRoLCBjb250YWluZXJIZWlnaHQgLyBhcmVhLmhlaWdodCk7XG4gICAgY29uc3Qgc3ZnV2lkdGggPSBhcmVhLndpZHRoICogdGhpcy5yYXRpbztcbiAgICBjb25zdCBzdmdIZWlnaHQgPSBhcmVhLmhlaWdodCAqIHRoaXMucmF0aW87XG5cbiAgICBjb25zdCB0b3AgPSAoY29udGFpbmVySGVpZ2h0IC0gc3ZnSGVpZ2h0KSAvIDI7XG4gICAgY29uc3QgbGVmdCA9IChjb250YWluZXJXaWR0aCAtIHN2Z1dpZHRoKSAvIDI7XG5cbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgIC8vIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7c3ZnV2lkdGh9ICR7c3ZnSGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciB0aGUgc3ZnIGludG8gdGhlIHBhcmVudFxuICAgIHRoaXMuJHN2Zy5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gICAgdGhpcy4kc3ZnLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcblxuICAgIC8vIGRpc3BsYXkgYmFja2dyb3VuZCBpZiBhbnlcbiAgICBpZiAoYXJlYS5iYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBhcmVhLmJhY2tncm91bmQ7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb3Zlcic7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGV4aXN0aW5nIHBvaW50cyBwb3NpdGlvblxuICAgIGZvciAobGV0IFskc2hhcGUsIHBvaW50XSBvZiB0aGlzLnNoYXBlUG9pbnRNYXApIHtcbiAgICAgIHRoaXMudXBkYXRlUG9pbnQocG9pbnQpXG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGFyZWEgZm9yIG1hcmtlcnNcbiAgICAvLyBjb25zdCBtYXJrZXJzID0gQXJyYXkuZnJvbSh0aGlzLiRkZWZzLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hcmtlcicpKTtcbiAgICAvLyBtYXJrZXJzLmZvckVhY2goKG1hcmtlcikgPT4ge1xuICAgIC8vICAgbWFya2VyLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmdXaWR0aH0gJHtzdmdIZWlnaHR9YCk7XG4gICAgLy8gfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgcG9pbnQuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvaW50IHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuIFRoZXNlIHNoYXBlcyBhcmUgYXBwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwb2ludC5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgcG9pbnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludC54IC0gVGhlIHBvaW50IGluIHRoZSB4IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnkgLSBUaGUgcG9pbnQgaW4gdGhlIHkgYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvaW50LnJhZGl1cz0wLjNdIC0gVGhlIHJhZGl1cyBvZiB0aGUgcG9pbnQgKHJlbGF0aXZlIHRvIHRoZSBhcmVhIHdpZHRoIGFuZCBoZWlnaHQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BvaW50LmNvbG9yPXVuZGVmaW5lZF0gLSBJZiBzcGVjaWZpZWQsIHRoZSBjb2xvciBvZiB0aGUgcG9pbnQuXG4gICAqL1xuICByZW5kZXJQb2ludChwb2ludCwgJHNoYXBlID0gbnVsbCkge1xuICAgIGlmICgkc2hhcGUgPT09IG51bGwpIHtcbiAgICAgICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ3BvaW50Jyk7XG4gICAgfVxuXG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIHBvaW50LmlkKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3BvaW50LnggKiB0aGlzLnJhdGlvfWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9pbnQueSAqIHRoaXMucmF0aW99YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvaW50LnJhZGl1cyB8fMKgOCk7IC8vIHJhZGl1cyBpcyByZWxhdGl2ZSB0byBhcmVhIHNpemVcblxuICAgIGlmIChwb2ludC5jb2xvcilcbiAgICAgICRzaGFwZS5zdHlsZS5maWxsID0gcG9pbnQuY29sb3I7XG5cbiAgICBjb25zdCBtZXRob2QgPSBwb2ludC5zZWxlY3RlZCA/ICdhZGQnIDogJ3JlbW92ZSc7XG4gICAgJHNoYXBlLmNsYXNzTGlzdFttZXRob2RdKCdzZWxlY3RlZCcpO1xuXG4gICAgcmV0dXJuICRzaGFwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCB0aGUgZXhpc3RpbmcgcG9pbnRzIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIHBvaW50LlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvaW50cyAtIFRoZSBuZXcgcG9pbnRzIHRvIHJlbmRlci5cbiAgICovXG4gIHNldFBvaW50cyhwb2ludHMpIHtcbiAgICB0aGlzLmNsZWFyUG9pbnRzKClcbiAgICB0aGlzLmFkZFBvaW50cyhwb2ludHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIHBvaW50cy5cbiAgICovXG4gIGNsZWFyUG9pbnRzKCkge1xuICAgIGZvciAobGV0IGlkIG9mIHRoaXMuX3JlbmRlcmVkUG9pbnRzLmtleXMoKSkge1xuICAgICAgdGhpcy5kZWxldGVQb2ludChpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgcG9pbnRzIHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IHBvaW50cyAtIFRoZSBuZXcgcG9pbnRzIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvaW50cyhwb2ludHMpIHtcbiAgICBwb2ludHMuZm9yRWFjaChwb2ludCA9PiB0aGlzLmFkZFBvaW50KHBvaW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IHBvaW50IHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgbmV3IHBvaW50IHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJQb2ludChwb2ludCk7XG4gICAgdGhpcy4kc3ZnLmFwcGVuZENoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuc2V0KHBvaW50LmlkLCAkc2hhcGUpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvaW50XG4gICAgdGhpcy5zaGFwZVBvaW50TWFwLnNldCgkc2hhcGUsIHBvaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSByZW5kZXJlZCBwb2ludC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZVBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb2ludHMuZ2V0KHBvaW50LmlkKTtcbiAgICB0aGlzLnJlbmRlclBvaW50KHBvaW50LCAkc2hhcGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoZSBwb2ludCB0byBkZWxldGUuXG4gICAqL1xuICBkZWxldGVQb2ludChpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9pbnRzLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuZGVsZXRlKGlkKTtcbiAgICAvLyBtYXAgZm9yIGVhc2llciByZXRyaWV2aW5nIG9mIHRoZSBwb2ludFxuICAgIHRoaXMuc2hhcGVQb2ludE1hcC5kZWxldGUoJHNoYXBlKTtcbiAgfVxuXG5cbi8vIEB0b2RvIC0gcmVmYWN0b3Igd2l0aCBuZXcgdmlld2JveCArIHJlbW92ZSBjb2RlIGR1cGxpY2F0aW9uIGluIHVwZGF0ZS5cbi8vICAvKipcbi8vICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgbGluZS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzIGFyZSBwcmVwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnRcbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBsaW5lIHRvIHJlbmRlci5cbi8vICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGxpbmUuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGxpbmUuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUudGFpbCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgYmVnaW4uXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUuaGVhZCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgZW5kLlxuLy8gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xpbmUuZGlyZWN0ZWQ9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGluZSBzaG91bGQgYmUgZGlyZWN0ZWQgb3Igbm90LlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfSBbbGluZS5jb2xvcj11bmRlZmluZWRdIC0gSWYgc3BlY2lmaWVkLCB0aGUgY29sb3Igb2YgdGhlIGxpbmUuXG4vLyAgICovXG4vLyAgcmVuZGVyTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdwb2x5bGluZScpO1xuLy8gICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2xpbmUnKTtcbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBsaW5lLmlkKTtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCd2ZWN0b3ItZWZmZWN0JywgJ25vbi1zY2FsaW5nLXN0cm9rZScpO1xuLy9cbi8vICAgIGlmIChsaW5lLmNvbG9yKVxuLy8gICAgICAkc2hhcGUuc3R5bGUuc3Ryb2tlID0gbGluZS5jb2xvcjtcbi8vXG4vLyAgICBpZiAobGluZS5kaXJlY3RlZClcbi8vICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2Fycm93Jyk7XG4vL1xuLy8gICAgcmV0dXJuICRzaGFwZTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBsaW5lcyB3aXRoIHRoZSBnaXZlbiBhcnJheSBvZiBsaW5lLlxuLy8gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBzZXRMaW5lcyhsaW5lcykge1xuLy8gICAgdGhpcy5jbGVhckxpbmVzKCk7XG4vLyAgICB0aGlzLmFkZExpbmVzKGxpbmVzKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIENsZWFyIGFsbCB0aGUgZGlzcGxheWVkIGxpbmVzLlxuLy8gICAqL1xuLy8gIGNsZWFyTGluZXMoKSB7XG4vLyAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZExpbmVzLmtleXMoKSkge1xuLy8gICAgICB0aGlzLmRlbGV0ZUxpbmUoaWQpO1xuLy8gICAgfVxuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIG5ldyBsaW5lcyB0byB0aGUgYXJlYS5cbi8vICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGxpbmVzIC0gVGhlIG5ldyBsaW5lcyB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgYWRkTGluZXMobGluZXMpIHtcbi8vICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB0aGlzLmFkZExpbmUobGluZSkpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQWRkIGEgbmV3IGxpbmUgdG8gdGhlIGFyZWEuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbmV3IGxpbmUgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIGFkZExpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJMaW5lKGxpbmUpO1xuLy8gICAgLy8gaW5zZXJ0IGp1c3QgYWZ0ZXIgdGhlIDxkZWZzPiB0YWdcbi8vICAgIC8vIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUoJHNoYXBlLCB0aGlzLiRzdmcuZmlyc3RDaGlsZC5uZXh0U2libGluZyk7XG4vLyAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbi8vXG4vLyAgICB0aGlzLl9yZW5kZXJlZExpbmVzLnNldChsaW5lLmlkLCAkc2hhcGUpO1xuLy8gICAgdGhpcy5zaGFwZUxpbmVNYXAuc2V0KCRzaGFwZSwgbGluZSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBVcGRhdGUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gdXBkYXRlLlxuLy8gICAqL1xuLy8gIHVwZGF0ZUxpbmUobGluZSkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQobGluZS5pZCk7XG4vLyAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuLy8gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcbi8vXG4vLyAgICBjb25zdCBwb2ludHMgPSBbXG4vLyAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbi8vICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuLy8gICAgICBgJHtoZWFkLnh9LCR7aGVhZC55fWBcbi8vICAgIF07XG4vL1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncG9pbnRzJywgcG9pbnRzLmpvaW4oJyAnKSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBSZW1vdmUgYSByZW5kZXJlZCBsaW5lLlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIGxpbmUgdG8gZGVsZXRlLlxuLy8gICAqL1xuLy8gIGRlbGV0ZUxpbmUoaWQpIHtcbi8vICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkTGluZXMuZ2V0KGlkKTtcbi8vICAgIHRoaXMuJHN2Zy5yZW1vdmVDaGlsZCgkc2hhcGUpO1xuLy9cbi8vICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuZGVsZXRlKGlkKTtcbi8vICAgIHRoaXMuc2hhcGVMaW5lTWFwLmRlbGV0ZSgkc2hhcGUpO1xuLy8gIH1cbn1cbiJdfQ==
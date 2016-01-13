'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _View2 = require('./View');

var _View3 = _interopRequireDefault(_View2);

var template = '<svg></svg>';
var ns = 'http://www.w3.org/2000/svg';

var SpaceView = (function (_View) {
  _inherits(SpaceView, _View);

  /**
   * Returns a new space instance.
   * @param {Object} area - The area to represent, should be defined by a `width`, an `height` and an optionnal background.
   * @param {Object} events - The events to attach to the view.
   * @param {Object} options - @todo
   * @param {Object} [options.isSubView=false] - Don't automatically point the view inside it's container (is needed when inserted in a module with css flex behavior).
   * @todo - `options.isSubView` should be removed and handled through css flex.
   */

  function SpaceView(area) {
    var events = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, SpaceView);

    options = _Object$assign({ className: 'space' }, options);
    _get(Object.getPrototypeOf(SpaceView.prototype), 'constructor', this).call(this, template, {}, events, options);

    /**
     * The area to display.
     * @type {Object}
     */
    this.area = area;

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

  /**
   * Apply style and cache elements when rendered.
   * @private
   */

  _createClass(SpaceView, [{
    key: 'onRender',
    value: function onRender() {
      this.$svg = this.$el.querySelector('svg');
      this.addDefinitions();
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
     * Update the area when inserted in the DOM.
     * @private
     */
  }, {
    key: 'onShow',
    value: function onShow() {
      this._setArea();
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

      this._setArea();
    }

    /**
     * Render the area.
     * @private
     */
  }, {
    key: '_setArea',
    value: function _setArea() {
      if (!this.$parent) {
        return;
      }

      var area = this.area;
      // use `this.$el` size instead of `this.$parent` size to ignore parent padding
      var boundingRect = this.$el.getBoundingClientRect();
      var containerWidth = boundingRect.width;
      var containerHeight = boundingRect.height;

      var ratio = (function () {
        return containerWidth < containerHeight ? containerWidth / area.width : containerHeight / area.height;
      })();

      var svgWidth = area.width * ratio;
      var svgHeight = area.height * ratio;

      this.$svg.setAttribute('width', svgWidth);
      this.$svg.setAttribute('height', svgHeight);
      this.$svg.setAttribute('viewBox', '0 0 ' + area.width + ' ' + area.height);
      // center the svg into the parent
      this.$svg.style.point = 'relative';

      // display background if any
      if (area.background) {
        this.$el.style.backgroundImage = area.background;
        this.$el.style.backgroundPoint = '50% 50%';
        this.$el.style.backgroundRepeat = 'no-repeat';
        this.$el.style.backgroundSize = 'cover';
      }

      // update area for markers
      var markers = _Array$from(this.$defs.querySelectorAll('marker'));
      markers.forEach(function (marker) {
        marker.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
      });
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
      var $shape = document.createElementNS(ns, 'circle');
      $shape.classList.add('point');

      $shape.setAttribute('data-id', point.id);
      $shape.setAttribute('cx', '' + point.x);
      $shape.setAttribute('cy', '' + point.y);
      $shape.setAttribute('r', point.radius || 0.3); // radius is relative to area size

      if (point.color) $shape.style.fill = point.color;

      if (point.selected) $shape.classList.add('selected');

      return $shape;
    }

    /**
     * The method used to render a specific line. This method should be overriden to display a point with a user defined shape. These shapes are prepended to the `svg` element
     * @param {Object} line - The line to render.
     * @param {String|Number} line.id - An unique identifier for the line.
     * @param {Object} line.tail - The point where the line should begin.
     * @param {Object} line.head - The point where the line should end.
     * @param {Boolean} [line.directed=false] - Defines if the line should be directed or not.
     * @param {String} [line.color=undefined] - If specified, the color of the line.
     */
  }, {
    key: 'renderLine',
    value: function renderLine(line) {
      var tail = line.tail;
      var head = line.head;

      var $shape = document.createElementNS(ns, 'polyline');
      $shape.classList.add('line');
      $shape.setAttribute('data-id', line.id);

      var points = [tail.x + ',' + tail.y, (tail.x + head.x) / 2 + ',' + (tail.y + head.y) / 2, head.x + ',' + head.y];

      $shape.setAttribute('points', points.join(' '));
      $shape.setAttribute('vector-effect', 'non-scaling-stroke');

      if (line.color) $shape.style.stroke = line.color;

      if (line.directed) $shape.classList.add('arrow');

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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(this._renderedPoints.keys()), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var id = _step.value;

          this.deletePoint(id);
        }
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

      $shape.setAttribute('cx', '' + point.x);
      $shape.setAttribute('cy', '' + point.y);
      $shape.setAttribute('r', point.radius || 0.3);
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

    /**
     * Replace all the existing lines with the given array of line.
     * @param {Array<Object>} lines - The new lines to render.
     */
  }, {
    key: 'setLines',
    value: function setLines(lines) {
      this.clearLines();
      this.addLines(lines);
    }

    /**
     * Clear all the displayed lines.
     */
  }, {
    key: 'clearLines',
    value: function clearLines() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _getIterator(this._renderedLines.keys()), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var id = _step2.value;

          this.deleteLine(id);
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
     * Add new lines to the area.
     * @param {Array<Object>} lines - The new lines to render.
     */
  }, {
    key: 'addLines',
    value: function addLines(lines) {
      var _this2 = this;

      lines.forEach(function (line) {
        return _this2.addLine(line);
      });
    }

    /**
     * Add a new line to the area.
     * @param {Object} line - The new line to render.
     */
  }, {
    key: 'addLine',
    value: function addLine(line) {
      var $shape = this.renderLine(line);
      // insert just after the <defs> tag
      // this.$svg.insertBefore($shape, this.$svg.firstChild.nextSibling);
      this.$svg.appendChild($shape);

      this._renderedLines.set(line.id, $shape);
      this.shapeLineMap.set($shape, line);
    }

    /**
     * Update a rendered line.
     * @param {Object} line - The line to update.
     */
  }, {
    key: 'updateLine',
    value: function updateLine(line) {
      var $shape = this._renderedLines.get(line.id);
      var tail = line.tail;
      var head = line.head;

      var points = [tail.x + ',' + tail.y, (tail.x + head.x) / 2 + ',' + (tail.y + head.y) / 2, head.x + ',' + head.y];

      $shape.setAttribute('points', points.join(' '));
    }

    /**
     * Remove a rendered line.
     * @param {String|Number} id - The id of the line to delete.
     */
  }, {
    key: 'deleteLine',
    value: function deleteLine(id) {
      var $shape = this._renderedLines.get(id);
      this.$svg.removeChild($shape);

      this._renderedLines['delete'](id);
      this.shapeLineMap['delete']($shape);
    }
  }]);

  return SpaceView;
})(_View3['default']);

exports['default'] = SpaceView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0FBRXpCLElBQU0sUUFBUSxnQkFBZ0IsQ0FBQztBQUMvQixJQUFNLEVBQUUsR0FBRyw0QkFBNEIsQ0FBQzs7SUFHbkIsU0FBUztZQUFULFNBQVM7Ozs7Ozs7Ozs7O0FBU2pCLFdBVFEsU0FBUyxDQVNoQixJQUFJLEVBQTZCO1FBQTNCLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBVHhCLFNBQVM7O0FBVTFCLFdBQU8sR0FBRyxlQUFjLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELCtCQVhpQixTQUFTLDZDQVdwQixRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7Ozs7OztBQU1yQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxhQUFhLEdBQUcsVUFBUyxDQUFDOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxVQUFTLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxlQUFlLEdBQUcsVUFBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBUyxDQUFDO0dBQ2pDOzs7Ozs7O2VBakNrQixTQUFTOztXQXVDcEIsb0JBQUc7QUFDVCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7Ozs7OztXQUthLDBCQUFHO0FBQ2YsVUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRbEQsVUFBTSxXQUFXLG9NQUloQixDQUFDOztB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QUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ2pEOzs7Ozs7OztXQU1TLG9CQUFDLEVBQUUsRUFBRTtBQUNiLFVBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNDLFVBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUU5QixVQUFJLENBQUMsY0FBYyxVQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0IsVUFBSSxDQUFDLFlBQVksVUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2xDOzs7U0FyVWtCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGA8c3ZnPjwvc3ZnPmA7XG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHNwYWNlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIHRvIHJlcHJlc2VudCwgc2hvdWxkIGJlIGRlZmluZWQgYnkgYSBgd2lkdGhgLCBhbiBgaGVpZ2h0YCBhbmQgYW4gb3B0aW9ubmFsIGJhY2tncm91bmQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBUaGUgZXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBAdG9kb1xuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuaXNTdWJWaWV3PWZhbHNlXSAtIERvbid0IGF1dG9tYXRpY2FsbHkgcG9pbnQgdGhlIHZpZXcgaW5zaWRlIGl0J3MgY29udGFpbmVyIChpcyBuZWVkZWQgd2hlbiBpbnNlcnRlZCBpbiBhIG1vZHVsZSB3aXRoIGNzcyBmbGV4IGJlaGF2aW9yKS5cbiAgICogQHRvZG8gLSBgb3B0aW9ucy5pc1N1YlZpZXdgIHNob3VsZCBiZSByZW1vdmVkIGFuZCBoYW5kbGVkIHRocm91Z2ggY3NzIGZsZXguXG4gICAqL1xuICBjb25zdHJ1Y3RvcihhcmVhLCBldmVudHMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyBjbGFzc05hbWU6ICdzcGFjZScgfSwgb3B0aW9ucyk7XG4gICAgc3VwZXIodGVtcGxhdGUsIHt9LCBldmVudHMsIG9wdGlvbnMpO1xuXG4gICAgLyoqXG4gICAgICogVGhlIGFyZWEgdG8gZGlzcGxheS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG5cbiAgICAvKipcbiAgICAgKiBFeHBvc2UgYSBNYXAgb2YgdGhlICRzaGFwZXMgYW5kIHRoZWlyIHJlbGF0aXZlIHBvaW50IG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVQb2ludE1hcCA9IG5ldyBNYXAoKTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgbGluZSBvYmplY3QuXG4gICAgICogQHR5cGUge01hcH1cbiAgICAgKi9cbiAgICB0aGlzLnNoYXBlTGluZU1hcCA9IG5ldyBNYXAoKTtcblxuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX3JlbmRlcmVkTGluZXMgPSBuZXcgTWFwKCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgc3R5bGUgYW5kIGNhY2hlIGVsZW1lbnRzIHdoZW4gcmVuZGVyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRzdmcgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICB0aGlzLmFkZERlZmluaXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGRlZmluaXRpb25zIGludG8gdGhlIGA8ZGVmcz5gIHRhZyBvZiBgdGhpcy4kc3ZnYCB0byBhbGxvdyB0byBkcmF3IGRpcmVjdGVkIGdyYXBocyBmcm9tIGNzc1xuICAgKi9cbiAgYWRkRGVmaW5pdGlvbnMoKSB7XG4gICAgdGhpcy4kZGVmcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2RlZnMnKTtcblxuICAgIC8vIGNvbnN0IG1hcmtlckNpcmNsZSA9IGBcbiAgICAvLyAgIDxtYXJrZXIgaWQ9XCJtYXJrZXItY2lyY2xlXCIgbWFya2VyV2lkdGg9XCI3XCIgbWFya2VySGVpZ2h0PVwiN1wiIHJlZlg9XCI0XCIgcmVmWT1cIjRcIiA+XG4gICAgLy8gICAgICAgPGNpcmNsZSBjeD1cIjRcIiBjeT1cIjRcIiByPVwiM1wiIGNsYXNzPVwibWFya2VyLWNpcmNsZVwiIC8+XG4gICAgLy8gICA8L21hcmtlcj5cbiAgICAvLyBgO1xuXG4gICAgY29uc3QgbWFya2VyQXJyb3cgPSBgXG4gICAgICA8bWFya2VyIGlkPVwibWFya2VyLWFycm93XCIgbWFya2VyV2lkdGg9XCIxMFwiIG1hcmtlckhlaWdodD1cIjEwXCIgcmVmWD1cIjVcIiByZWZZPVwiNVwiIG9yaWVudD1cImF1dG9cIj5cbiAgICAgICAgICA8cGF0aCBkPVwiTTAsMCBMMCwxMCBMMTAsNSBMMCwwXCIgY2xhc3M9XCJtYXJrZXItYXJyb3dcIiAvPlxuICAgICAgPC9tYXJrZXI+XG4gICAgYDtcblxuICAgIHRoaXMuJGRlZnMuaW5uZXJIVE1MID0gbWFya2VyQXJyb3c7XG4gICAgdGhpcy4kc3ZnLmluc2VydEJlZm9yZSh0aGlzLiRkZWZzLCB0aGlzLiRzdmcuZmlyc3RDaGlsZCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBhcmVhIHdoZW4gaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLl9zZXRBcmVhKCk7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBhcmVhIHdoZW4gaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUmVzaXplKG9yaWVudGF0aW9uLCB2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCkge1xuICAgIHN1cGVyLm9uUmVzaXplKG9yaWVudGF0aW9uLCB2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCk7XG4gICAgLy8gb3ZlcnJpZGUgc2l6ZSB0byBtYXRjaCBwYXJlbnQgc2l6ZVxuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblxuICAgIHRoaXMuX3NldEFyZWEoKTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgYXJlYS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9zZXRBcmVhKCkge1xuICAgIGlmICghdGhpcy4kcGFyZW50KSB7IHJldHVybjsgfVxuXG4gICAgY29uc3QgYXJlYSA9IHRoaXMuYXJlYTtcbiAgICAvLyB1c2UgYHRoaXMuJGVsYCBzaXplIGluc3RlYWQgb2YgYHRoaXMuJHBhcmVudGAgc2l6ZSB0byBpZ25vcmUgcGFyZW50IHBhZGRpbmdcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLiRlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuXG5cbiAgICBjb25zdCByYXRpbyA9ICgoKSA9PiB7XG4gICAgICByZXR1cm4gKGNvbnRhaW5lcldpZHRoIDwgY29udGFpbmVySGVpZ2h0KSA/XG4gICAgICAgIGNvbnRhaW5lcldpZHRoIC8gYXJlYS53aWR0aCA6XG4gICAgICAgIGNvbnRhaW5lckhlaWdodCAvIGFyZWEuaGVpZ2h0O1xuICAgIH0pKCk7XG5cbiAgICBjb25zdCBzdmdXaWR0aCA9IGFyZWEud2lkdGggKiByYXRpbztcbiAgICBjb25zdCBzdmdIZWlnaHQgPSBhcmVhLmhlaWdodCAqIHJhdGlvO1xuXG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCBzdmdXaWR0aCk7XG4gICAgdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgnaGVpZ2h0Jywgc3ZnSGVpZ2h0KTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke2FyZWEud2lkdGh9ICR7YXJlYS5oZWlnaHR9YCk7XG4gICAgLy8gY2VudGVyIHRoZSBzdmcgaW50byB0aGUgcGFyZW50XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnBvaW50ID0gJ3JlbGF0aXZlJztcblxuICAgIC8vIGRpc3BsYXkgYmFja2dyb3VuZCBpZiBhbnlcbiAgICBpZiAoYXJlYS5iYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBhcmVhLmJhY2tncm91bmQ7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUG9pbnQgPSAnNTAlIDUwJSc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLiRlbC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb3Zlcic7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIGFyZWEgZm9yIG1hcmtlcnNcbiAgICBjb25zdCBtYXJrZXJzID0gQXJyYXkuZnJvbSh0aGlzLiRkZWZzLnF1ZXJ5U2VsZWN0b3JBbGwoJ21hcmtlcicpKTtcbiAgICBtYXJrZXJzLmZvckVhY2goKG1hcmtlcikgPT4ge1xuICAgICAgbWFya2VyLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmdXaWR0aH0gJHtzdmdIZWlnaHR9YCk7XG4gICAgfSk7XG4gIH1cblxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgcG9pbnQuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvaW50IHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuIFRoZXNlIHNoYXBlcyBhcmUgYXBwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHJlbmRlci5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBwb2ludC5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgcG9pbnQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBwb2ludC54IC0gVGhlIHBvaW50IGluIHRoZSB4IGF4aXMgaW4gdGhlIGFyZWEgY29yZGluYXRlIHN5c3RlbS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnkgLSBUaGUgcG9pbnQgaW4gdGhlIHkgYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3BvaW50LnJhZGl1cz0wLjNdIC0gVGhlIHJhZGl1cyBvZiB0aGUgcG9pbnQgKHJlbGF0aXZlIHRvIHRoZSBhcmVhIHdpZHRoIGFuZCBoZWlnaHQpLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW3BvaW50LmNvbG9yPXVuZGVmaW5lZF0gLSBJZiBzcGVjaWZpZWQsIHRoZSBjb2xvciBvZiB0aGUgcG9pbnQuXG4gICAqL1xuICByZW5kZXJQb2ludChwb2ludCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdwb2ludCcpO1xuXG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIHBvaW50LmlkKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeCcsIGAke3BvaW50Lnh9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb2ludC55fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3InLCBwb2ludC5yYWRpdXMgfHzCoDAuMyk7IC8vIHJhZGl1cyBpcyByZWxhdGl2ZSB0byBhcmVhIHNpemVcblxuICAgIGlmIChwb2ludC5jb2xvcilcbiAgICAgICRzaGFwZS5zdHlsZS5maWxsID0gcG9pbnQuY29sb3I7XG5cbiAgICBpZiAocG9pbnQuc2VsZWN0ZWQpXG4gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcblxuICAgIHJldHVybiAkc2hhcGU7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1ldGhvZCB1c2VkIHRvIHJlbmRlciBhIHNwZWNpZmljIGxpbmUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gdG8gZGlzcGxheSBhIHBvaW50IHdpdGggYSB1c2VyIGRlZmluZWQgc2hhcGUuIFRoZXNlIHNoYXBlcyBhcmUgcHJlcGVuZGVkIHRvIHRoZSBgc3ZnYCBlbGVtZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGxpbmUuaWQgLSBBbiB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGxpbmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lLnRhaWwgLSBUaGUgcG9pbnQgd2hlcmUgdGhlIGxpbmUgc2hvdWxkIGJlZ2luLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbGluZS5oZWFkIC0gVGhlIHBvaW50IHdoZXJlIHRoZSBsaW5lIHNob3VsZCBlbmQuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW2xpbmUuZGlyZWN0ZWQ9ZmFsc2VdIC0gRGVmaW5lcyBpZiB0aGUgbGluZSBzaG91bGQgYmUgZGlyZWN0ZWQgb3Igbm90LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW2xpbmUuY29sb3I9dW5kZWZpbmVkXSAtIElmIHNwZWNpZmllZCwgdGhlIGNvbG9yIG9mIHRoZSBsaW5lLlxuICAgKi9cbiAgcmVuZGVyTGluZShsaW5lKSB7XG4gICAgY29uc3QgdGFpbCA9IGxpbmUudGFpbDtcbiAgICBjb25zdCBoZWFkID0gbGluZS5oZWFkO1xuXG4gICAgY29uc3QgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAncG9seWxpbmUnKTtcbiAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnbGluZScpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtaWQnLCBsaW5lLmlkKTtcblxuICAgIGNvbnN0IHBvaW50cyA9IFtcbiAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbiAgICAgIGAkeyh0YWlsLnggKyBoZWFkLngpIC8gMn0sJHsodGFpbC55ICsgaGVhZC55KSAvIDJ9YCxcbiAgICAgIGAke2hlYWQueH0sJHtoZWFkLnl9YFxuICAgIF07XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBwb2ludHMuam9pbignICcpKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCd2ZWN0b3ItZWZmZWN0JywgJ25vbi1zY2FsaW5nLXN0cm9rZScpO1xuXG4gICAgaWYgKGxpbmUuY29sb3IpXG4gICAgICAkc2hhcGUuc3R5bGUuc3Ryb2tlID0gbGluZS5jb2xvcjtcblxuICAgIGlmIChsaW5lLmRpcmVjdGVkKVxuICAgICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ2Fycm93Jyk7XG5cbiAgICByZXR1cm4gJHNoYXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBwb2ludHMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgcG9pbnQuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgc2V0UG9pbnRzKHBvaW50cykge1xuICAgIHRoaXMuY2xlYXJQb2ludHMoKVxuICAgIHRoaXMuYWRkUG9pbnRzKHBvaW50cyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgcG9pbnRzLlxuICAgKi9cbiAgY2xlYXJQb2ludHMoKSB7XG4gICAgZm9yIChsZXQgaWQgb2YgdGhpcy5fcmVuZGVyZWRQb2ludHMua2V5cygpKSB7XG4gICAgICB0aGlzLmRlbGV0ZVBvaW50KGlkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5ldyBwb2ludHMgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnRzKHBvaW50cykge1xuICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHRoaXMuYWRkUG9pbnQocG9pbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgcG9pbnQgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBuZXcgcG9pbnQgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlclBvaW50KHBvaW50KTtcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5zZXQocG9pbnQuaWQsICRzaGFwZSk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuc2V0KCRzaGFwZSwgcG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvaW50cy5nZXQocG9pbnQuaWQpO1xuXG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3gnLCBgJHtwb2ludC54fWApO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N5JywgYCR7cG9pbnQueX1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9pbnQucmFkaXVzIHx8wqAwLjMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoZSBwb2ludCB0byBkZWxldGUuXG4gICAqL1xuICBkZWxldGVQb2ludChpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkUG9pbnRzLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuZGVsZXRlKGlkKTtcbiAgICAvLyBtYXAgZm9yIGVhc2llciByZXRyaWV2aW5nIG9mIHRoZSBwb2ludFxuICAgIHRoaXMuc2hhcGVQb2ludE1hcC5kZWxldGUoJHNoYXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXBsYWNlIGFsbCB0aGUgZXhpc3RpbmcgbGluZXMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgbGluZS5cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBsaW5lcyAtIFRoZSBuZXcgbGluZXMgdG8gcmVuZGVyLlxuICAgKi9cbiAgc2V0TGluZXMobGluZXMpIHtcbiAgICB0aGlzLmNsZWFyTGluZXMoKTtcbiAgICB0aGlzLmFkZExpbmVzKGxpbmVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbGwgdGhlIGRpc3BsYXllZCBsaW5lcy5cbiAgICovXG4gIGNsZWFyTGluZXMoKSB7XG4gICAgZm9yIChsZXQgaWQgb2YgdGhpcy5fcmVuZGVyZWRMaW5lcy5rZXlzKCkpIHtcbiAgICAgIHRoaXMuZGVsZXRlTGluZShpZCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBuZXcgbGluZXMgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZExpbmVzKGxpbmVzKSB7XG4gICAgbGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMuYWRkTGluZShsaW5lKSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IGxpbmUgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIG5ldyBsaW5lIHRvIHJlbmRlci5cbiAgICovXG4gIGFkZExpbmUobGluZSkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMucmVuZGVyTGluZShsaW5lKTtcbiAgICAvLyBpbnNlcnQganVzdCBhZnRlciB0aGUgPGRlZnM+IHRhZ1xuICAgIC8vIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUoJHNoYXBlLCB0aGlzLiRzdmcuZmlyc3RDaGlsZC5uZXh0U2libGluZyk7XG4gICAgdGhpcy4kc3ZnLmFwcGVuZENoaWxkKCRzaGFwZSk7XG5cbiAgICB0aGlzLl9yZW5kZXJlZExpbmVzLnNldChsaW5lLmlkLCAkc2hhcGUpO1xuICAgIHRoaXMuc2hhcGVMaW5lTWFwLnNldCgkc2hhcGUsIGxpbmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIGxpbmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlTGluZShsaW5lKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQobGluZS5pZCk7XG4gICAgY29uc3QgdGFpbCA9IGxpbmUudGFpbDtcbiAgICBjb25zdCBoZWFkID0gbGluZS5oZWFkO1xuXG4gICAgY29uc3QgcG9pbnRzID0gW1xuICAgICAgYCR7dGFpbC54fSwke3RhaWwueX1gLFxuICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuICAgICAgYCR7aGVhZC54fSwke2hlYWQueX1gXG4gICAgXTtcblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIHBvaW50cy5qb2luKCcgJykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIHJlbmRlcmVkIGxpbmUuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIGxpbmUgdG8gZGVsZXRlLlxuICAgKi9cbiAgZGVsZXRlTGluZShpZCkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkTGluZXMuZ2V0KGlkKTtcbiAgICB0aGlzLiRzdmcucmVtb3ZlQ2hpbGQoJHNoYXBlKTtcblxuICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuZGVsZXRlKGlkKTtcbiAgICB0aGlzLnNoYXBlTGluZU1hcC5kZWxldGUoJHNoYXBlKTtcbiAgfVxufVxuIl19
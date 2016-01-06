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

      console.log(points);
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
      this.$svg.removechild($shape);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQUFpQixRQUFROzs7O0FBRXpCLElBQU0sUUFBUSxnQkFBZ0IsQ0FBQztBQUMvQixJQUFNLEVBQUUsR0FBRyw0QkFBNEIsQ0FBQzs7SUFHbkIsU0FBUztZQUFULFNBQVM7Ozs7Ozs7Ozs7O0FBU2pCLFdBVFEsU0FBUyxDQVNoQixJQUFJLEVBQTZCO1FBQTNCLE1BQU0seURBQUcsRUFBRTtRQUFFLE9BQU8seURBQUcsRUFBRTs7MEJBVHhCLFNBQVM7O0FBVTFCLFdBQU8sR0FBRyxlQUFjLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3pELCtCQVhpQixTQUFTLDZDQVdwQixRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7Ozs7OztBQU1yQyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxhQUFhLEdBQUcsVUFBUyxDQUFDOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLFlBQVksR0FBRyxVQUFTLENBQUM7O0FBRTlCLFFBQUksQ0FBQyxlQUFlLEdBQUcsVUFBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxjQUFjLEdBQUcsVUFBUyxDQUFDO0dBQ2pDOzs7Ozs7O2VBakNrQixTQUFTOztXQXVDcEIsb0JBQUc7QUFDVCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7Ozs7OztXQUthLDBCQUFHO0FBQ2YsVUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7QUFRbEQsVUFBTSxXQUFXLG9NQUloQixDQUFDOztB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QUksSUFBSSxDQUFDLENBQUMsQ0FDcEIsQ0FBQzs7QUFFRixZQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDakQ7Ozs7Ozs7O1dBTVMsb0JBQUMsRUFBRSxFQUFFO0FBQ2IsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDM0MsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTlCLFVBQUksQ0FBQyxjQUFjLFVBQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUMvQixVQUFJLENBQUMsWUFBWSxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbEM7OztTQXRVa0IsU0FBUzs7O3FCQUFULFNBQVMiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L1NwYWNlVmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XG5cbmNvbnN0IHRlbXBsYXRlID0gYDxzdmc+PC9zdmc+YDtcbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGFjZVZpZXcgZXh0ZW5kcyBWaWV3IHtcbiAgLyoqXG4gICAqIFJldHVybnMgYSBuZXcgc3BhY2UgaW5zdGFuY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhIC0gVGhlIGFyZWEgdG8gcmVwcmVzZW50LCBzaG91bGQgYmUgZGVmaW5lZCBieSBhIGB3aWR0aGAsIGFuIGBoZWlnaHRgIGFuZCBhbiBvcHRpb25uYWwgYmFja2dyb3VuZC5cbiAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50cyAtIFRoZSBldmVudHMgdG8gYXR0YWNoIHRvIHRoZSB2aWV3LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIEB0b2RvXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5pc1N1YlZpZXc9ZmFsc2VdIC0gRG9uJ3QgYXV0b21hdGljYWxseSBwb2ludCB0aGUgdmlldyBpbnNpZGUgaXQncyBjb250YWluZXIgKGlzIG5lZWRlZCB3aGVuIGluc2VydGVkIGluIGEgbW9kdWxlIHdpdGggY3NzIGZsZXggYmVoYXZpb3IpLlxuICAgKiBAdG9kbyAtIGBvcHRpb25zLmlzU3ViVmlld2Agc2hvdWxkIGJlIHJlbW92ZWQgYW5kIGhhbmRsZWQgdGhyb3VnaCBjc3MgZmxleC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGFyZWEsIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNsYXNzTmFtZTogJ3NwYWNlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0ZW1wbGF0ZSwge30sIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYXJlYSB0byBkaXNwbGF5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hcmVhID0gYXJlYTtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgcG9pbnQgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICovXG4gICAgdGhpcy5zaGFwZVBvaW50TWFwID0gbmV3IE1hcCgpO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGEgTWFwIG9mIHRoZSAkc2hhcGVzIGFuZCB0aGVpciByZWxhdGl2ZSBsaW5lIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVMaW5lTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fcmVuZGVyZWRMaW5lcyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBseSBzdHlsZSBhbmQgY2FjaGUgZWxlbWVudHMgd2hlbiByZW5kZXJlZC5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUmVuZGVyKCkge1xuICAgIHRoaXMuJHN2ZyA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpO1xuICAgIHRoaXMuYWRkRGVmaW5pdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZGVmaW5pdGlvbnMgaW50byB0aGUgYDxkZWZzPmAgdGFnIG9mIGB0aGlzLiRzdmdgIHRvIGFsbG93IHRvIGRyYXcgZGlyZWN0ZWQgZ3JhcGhzIGZyb20gY3NzXG4gICAqL1xuICBhZGREZWZpbml0aW9ucygpIHtcbiAgICB0aGlzLiRkZWZzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZGVmcycpO1xuXG4gICAgLy8gY29uc3QgbWFya2VyQ2lyY2xlID0gYFxuICAgIC8vICAgPG1hcmtlciBpZD1cIm1hcmtlci1jaXJjbGVcIiBtYXJrZXJXaWR0aD1cIjdcIiBtYXJrZXJIZWlnaHQ9XCI3XCIgcmVmWD1cIjRcIiByZWZZPVwiNFwiID5cbiAgICAvLyAgICAgICA8Y2lyY2xlIGN4PVwiNFwiIGN5PVwiNFwiIHI9XCIzXCIgY2xhc3M9XCJtYXJrZXItY2lyY2xlXCIgLz5cbiAgICAvLyAgIDwvbWFya2VyPlxuICAgIC8vIGA7XG5cbiAgICBjb25zdCBtYXJrZXJBcnJvdyA9IGBcbiAgICAgIDxtYXJrZXIgaWQ9XCJtYXJrZXItYXJyb3dcIiBtYXJrZXJXaWR0aD1cIjEwXCIgbWFya2VySGVpZ2h0PVwiMTBcIiByZWZYPVwiNVwiIHJlZlk9XCI1XCIgb3JpZW50PVwiYXV0b1wiPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMCwwIEwwLDEwIEwxMCw1IEwwLDBcIiBjbGFzcz1cIm1hcmtlci1hcnJvd1wiIC8+XG4gICAgICA8L21hcmtlcj5cbiAgICBgO1xuXG4gICAgdGhpcy4kZGVmcy5pbm5lckhUTUwgPSBtYXJrZXJBcnJvdztcbiAgICB0aGlzLiRzdmcuaW5zZXJ0QmVmb3JlKHRoaXMuJGRlZnMsIHRoaXMuJHN2Zy5maXJzdENoaWxkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGFyZWEgd2hlbiBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25TaG93KCkge1xuICAgIHRoaXMuX3NldEFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgdGhlIGFyZWEgd2hlbiBpbnNlcnRlZCBpbiB0aGUgRE9NLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25SZXNpemUob3JpZW50YXRpb24sIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KSB7XG4gICAgc3VwZXIub25SZXNpemUob3JpZW50YXRpb24sIHZpZXdwb3J0V2lkdGgsIHZpZXdwb3J0SGVpZ2h0KTtcbiAgICAvLyBvdmVycmlkZSBzaXplIHRvIG1hdGNoIHBhcmVudCBzaXplXG4gICAgdGhpcy4kZWwuc3R5bGUud2lkdGggPSAnMTAwJSc7XG4gICAgdGhpcy4kZWwuc3R5bGUuaGVpZ2h0ID0gJzEwMCUnO1xuXG4gICAgdGhpcy5fc2V0QXJlYSgpO1xuICB9XG5cblxuICAvKipcbiAgICogUmVuZGVyIHRoZSBhcmVhLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NldEFyZWEoKSB7XG4gICAgaWYgKCF0aGlzLiRwYXJlbnQpIHsgcmV0dXJuOyB9XG5cbiAgICBjb25zdCBhcmVhID0gdGhpcy5hcmVhO1xuICAgIC8vIHVzZSBgdGhpcy4kZWxgIHNpemUgaW5zdGVhZCBvZiBgdGhpcy4kcGFyZW50YCBzaXplIHRvIGlnbm9yZSBwYXJlbnQgcGFkZGluZ1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuJGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG5cblxuICAgIGNvbnN0IHJhdGlvID0gKCgpID0+IHtcbiAgICAgIHJldHVybiAoY29udGFpbmVyV2lkdGggPCBjb250YWluZXJIZWlnaHQpID9cbiAgICAgICAgY29udGFpbmVyV2lkdGggLyBhcmVhLndpZHRoIDpcbiAgICAgICAgY29udGFpbmVySGVpZ2h0IC8gYXJlYS5oZWlnaHQ7XG4gICAgfSkoKTtcblxuICAgIGNvbnN0IHN2Z1dpZHRoID0gYXJlYS53aWR0aCAqIHJhdGlvO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGFyZWEuaGVpZ2h0ICogcmF0aW87XG5cbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLiRzdmcuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3ZpZXdCb3gnLCBgMCAwICR7YXJlYS53aWR0aH0gJHthcmVhLmhlaWdodH1gKTtcbiAgICAvLyBjZW50ZXIgdGhlIHN2ZyBpbnRvIHRoZSBwYXJlbnRcbiAgICB0aGlzLiRzdmcuc3R5bGUucG9pbnQgPSAncmVsYXRpdmUnO1xuXG4gICAgLy8gZGlzcGxheSBiYWNrZ3JvdW5kIGlmIGFueVxuICAgIGlmIChhcmVhLmJhY2tncm91bmQpIHtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGFyZWEuYmFja2dyb3VuZDtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRQb2ludCA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvdmVyJztcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYXJlYSBmb3IgbWFya2Vyc1xuICAgIGNvbnN0IG1hcmtlcnMgPSBBcnJheS5mcm9tKHRoaXMuJGRlZnMucXVlcnlTZWxlY3RvckFsbCgnbWFya2VyJykpO1xuICAgIG1hcmtlcnMuZm9yRWFjaCgobWFya2VyKSA9PiB7XG4gICAgICBtYXJrZXIuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke3N2Z1dpZHRofSAke3N2Z0hlaWdodH1gKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBwb2ludC4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzIGFyZSBhcHBlbmRlZCB0byB0aGUgYHN2Z2AgZWxlbWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHBvaW50LmlkIC0gQW4gdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBwb2ludC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnggLSBUaGUgcG9pbnQgaW4gdGhlIHggYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9pbnQueSAtIFRoZSBwb2ludCBpbiB0aGUgeSBheGlzIGluIHRoZSBhcmVhIGNvcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9pbnQucmFkaXVzPTAuM10gLSBUaGUgcmFkaXVzIG9mIHRoZSBwb2ludCAocmVsYXRpdmUgdG8gdGhlIGFyZWEgd2lkdGggYW5kIGhlaWdodCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcG9pbnQuY29sb3I9dW5kZWZpbmVkXSAtIElmIHNwZWNpZmllZCwgdGhlIGNvbG9yIG9mIHRoZSBwb2ludC5cbiAgICovXG4gIHJlbmRlclBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgJHNoYXBlLmNsYXNzTGlzdC5hZGQoJ3BvaW50Jyk7XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgcG9pbnQuaWQpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9pbnQueH1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeScsIGAke3BvaW50Lnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvaW50LnJhZGl1cyB8fMKgMC4zKTsgLy8gcmFkaXVzIGlzIHJlbGF0aXZlIHRvIGFyZWEgc2l6ZVxuXG4gICAgaWYgKHBvaW50LmNvbG9yKVxuICAgICAgJHNoYXBlLnN0eWxlLmZpbGwgPSBwb2ludC5jb2xvcjtcblxuICAgIGlmIChwb2ludC5zZWxlY3RlZClcbiAgICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuXG4gICAgcmV0dXJuICRzaGFwZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbWV0aG9kIHVzZWQgdG8gcmVuZGVyIGEgc3BlY2lmaWMgbGluZS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzIGFyZSBwcmVwZW5kZWQgdG8gdGhlIGBzdmdgIGVsZW1lbnRcbiAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbGluZSB0byByZW5kZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gbGluZS5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgbGluZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUudGFpbCAtIFRoZSBwb2ludCB3aGVyZSB0aGUgbGluZSBzaG91bGQgYmVnaW4uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lLmhlYWQgLSBUaGUgcG9pbnQgd2hlcmUgdGhlIGxpbmUgc2hvdWxkIGVuZC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbbGluZS5kaXJlY3RlZD1mYWxzZV0gLSBEZWZpbmVzIGlmIHRoZSBsaW5lIHNob3VsZCBiZSBkaXJlY3RlZCBvciBub3QuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbGluZS5jb2xvcj11bmRlZmluZWRdIC0gSWYgc3BlY2lmaWVkLCB0aGUgY29sb3Igb2YgdGhlIGxpbmUuXG4gICAqL1xuICByZW5kZXJMaW5lKGxpbmUpIHtcbiAgICBjb25zdCB0YWlsID0gbGluZS50YWlsO1xuICAgIGNvbnN0IGhlYWQgPSBsaW5lLmhlYWQ7XG5cbiAgICBjb25zdCAkc2hhcGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdwb2x5bGluZScpO1xuICAgICRzaGFwZS5jbGFzc0xpc3QuYWRkKCdsaW5lJyk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIGxpbmUuaWQpO1xuXG4gICAgY29uc3QgcG9pbnRzID0gW1xuICAgICAgYCR7dGFpbC54fSwke3RhaWwueX1gLFxuICAgICAgYCR7KHRhaWwueCArIGhlYWQueCkgLyAyfSwkeyh0YWlsLnkgKyBoZWFkLnkpIC8gMn1gLFxuICAgICAgYCR7aGVhZC54fSwke2hlYWQueX1gXG4gICAgXTtcblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3BvaW50cycsIHBvaW50cy5qb2luKCcgJykpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3ZlY3Rvci1lZmZlY3QnLCAnbm9uLXNjYWxpbmctc3Ryb2tlJyk7XG5cbiAgICBpZiAobGluZS5jb2xvcilcbiAgICAgICRzaGFwZS5zdHlsZS5zdHJva2UgPSBsaW5lLmNvbG9yO1xuXG4gICAgaWYgKGxpbmUuZGlyZWN0ZWQpXG4gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnYXJyb3cnKTtcblxuICAgIHJldHVybiAkc2hhcGU7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbGwgdGhlIGV4aXN0aW5nIHBvaW50cyB3aXRoIHRoZSBnaXZlbiBhcnJheSBvZiBwb2ludC5cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBwb2ludHMgLSBUaGUgbmV3IHBvaW50cyB0byByZW5kZXIuXG4gICAqL1xuICBzZXRQb2ludHMocG9pbnRzKSB7XG4gICAgdGhpcy5jbGVhclBvaW50cygpXG4gICAgdGhpcy5hZGRQb2ludHMocG9pbnRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciBhbGwgdGhlIGRpc3BsYXllZCBwb2ludHMuXG4gICAqL1xuICBjbGVhclBvaW50cygpIHtcbiAgICBmb3IgKGxldCBpZCBvZiB0aGlzLl9yZW5kZXJlZFBvaW50cy5rZXlzKCkpIHtcbiAgICAgIHRoaXMuZGVsZXRlUG9pbnQoaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IHBvaW50cyB0byB0aGUgYXJlYS5cbiAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBwb2ludHMgLSBUaGUgbmV3IHBvaW50cyB0byByZW5kZXIuXG4gICAqL1xuICBhZGRQb2ludHMocG9pbnRzKSB7XG4gICAgY29uc29sZS5sb2cocG9pbnRzKTtcbiAgICBwb2ludHMuZm9yRWFjaChwb2ludCA9PiB0aGlzLmFkZFBvaW50KHBvaW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbmV3IHBvaW50IHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgbmV3IHBvaW50IHRvIHJlbmRlci5cbiAgICovXG4gIGFkZFBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5yZW5kZXJQb2ludChwb2ludCk7XG4gICAgdGhpcy4kc3ZnLmFwcGVuZENoaWxkKCRzaGFwZSk7XG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMuc2V0KHBvaW50LmlkLCAkc2hhcGUpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvaW50XG4gICAgdGhpcy5zaGFwZVBvaW50TWFwLnNldCgkc2hhcGUsIHBvaW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSByZW5kZXJlZCBwb2ludC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvaW50IC0gVGhlIHBvaW50IHRvIHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZVBvaW50KHBvaW50KSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb2ludHMuZ2V0KHBvaW50LmlkKTtcblxuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9pbnQueH1gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdjeScsIGAke3BvaW50Lnl9YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgncicsIHBvaW50LnJhZGl1cyB8fMKgMC4zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByZW5kZXJlZCBwb2ludC5cbiAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBpZCAtIFRoZSBpZCBvZiB0aGUgcG9pbnQgdG8gZGVsZXRlLlxuICAgKi9cbiAgZGVsZXRlUG9pbnQoaWQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvaW50cy5nZXQoaWQpO1xuICAgIHRoaXMuJHN2Zy5yZW1vdmVjaGlsZCgkc2hhcGUpO1xuICAgIHRoaXMuX3JlbmRlcmVkUG9pbnRzLmRlbGV0ZShpZCk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuZGVsZXRlKCRzaGFwZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVwbGFjZSBhbGwgdGhlIGV4aXN0aW5nIGxpbmVzIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIGxpbmUuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbiAgICovXG4gIHNldExpbmVzKGxpbmVzKSB7XG4gICAgdGhpcy5jbGVhckxpbmVzKCk7XG4gICAgdGhpcy5hZGRMaW5lcyhsaW5lcyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgbGluZXMuXG4gICAqL1xuICBjbGVhckxpbmVzKCkge1xuICAgIGZvciAobGV0IGlkIG9mIHRoaXMuX3JlbmRlcmVkTGluZXMua2V5cygpKSB7XG4gICAgICB0aGlzLmRlbGV0ZUxpbmUoaWQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgbmV3IGxpbmVzIHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge0FycmF5PE9iamVjdD59IGxpbmVzIC0gVGhlIG5ldyBsaW5lcyB0byByZW5kZXIuXG4gICAqL1xuICBhZGRMaW5lcyhsaW5lcykge1xuICAgIGxpbmVzLmZvckVhY2gobGluZSA9PiB0aGlzLmFkZExpbmUobGluZSkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIG5ldyBsaW5lIHRvIHRoZSBhcmVhLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBuZXcgbGluZSB0byByZW5kZXIuXG4gICAqL1xuICBhZGRMaW5lKGxpbmUpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlckxpbmUobGluZSk7XG4gICAgLy8gaW5zZXJ0IGp1c3QgYWZ0ZXIgdGhlIDxkZWZzPiB0YWdcbiAgICAvLyB0aGlzLiRzdmcuaW5zZXJ0QmVmb3JlKCRzaGFwZSwgdGhpcy4kc3ZnLmZpcnN0Q2hpbGQubmV4dFNpYmxpbmcpO1xuICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRMaW5lcy5zZXQobGluZS5pZCwgJHNoYXBlKTtcbiAgICB0aGlzLnNoYXBlTGluZU1hcC5zZXQoJHNoYXBlLCBsaW5lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVcGRhdGUgYSByZW5kZXJlZCBsaW5lLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBsaW5lIHRvIHVwZGF0ZS5cbiAgICovXG4gIHVwZGF0ZUxpbmUobGluZSkge1xuICAgIGNvbnN0ICRzaGFwZSA9IHRoaXMuX3JlbmRlcmVkTGluZXMuZ2V0KGxpbmUuaWQpO1xuICAgIGNvbnN0IHRhaWwgPSBsaW5lLnRhaWw7XG4gICAgY29uc3QgaGVhZCA9IGxpbmUuaGVhZDtcblxuICAgIGNvbnN0IHBvaW50cyA9IFtcbiAgICAgIGAke3RhaWwueH0sJHt0YWlsLnl9YCxcbiAgICAgIGAkeyh0YWlsLnggKyBoZWFkLngpIC8gMn0sJHsodGFpbC55ICsgaGVhZC55KSAvIDJ9YCxcbiAgICAgIGAke2hlYWQueH0sJHtoZWFkLnl9YFxuICAgIF07XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBwb2ludHMuam9pbignICcpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSByZW5kZXJlZCBsaW5lLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IGlkIC0gVGhlIGlkIG9mIHRoZSBsaW5lIHRvIGRlbGV0ZS5cbiAgICovXG4gIGRlbGV0ZUxpbmUoaWQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZExpbmVzLmdldChpZCk7XG4gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG5cbiAgICB0aGlzLl9yZW5kZXJlZExpbmVzLmRlbGV0ZShpZCk7XG4gICAgdGhpcy5zaGFwZUxpbmVNYXAuZGVsZXRlKCRzaGFwZSk7XG4gIH1cbn1cbiJdfQ==
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _Map = require('babel-runtime/core-js/map')['default'];

var _getIterator = require('babel-runtime/core-js/get-iterator')['default'];

var _Array$from = require('babel-runtime/core-js/array/from')['default'];

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
      this._renderArea();

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
     * Render the area.
     * @private
     */
  }, {
    key: '_renderArea',
    value: function _renderArea() {
      // if (!this.$parent) { return; }

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
      var $shape = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if ($shape === null) {
        $shape = document.createElementNS(ns, 'circle');
        $shape.classList.add('point');
      }

      $shape.setAttribute('data-id', point.id);
      $shape.setAttribute('cx', '' + point.x * this.ratio);
      $shape.setAttribute('cy', '' + point.y * this.ratio);
      $shape.setAttribute('r', point.radius || 5); // radius is relative to area size

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQWlCLFFBQVE7Ozs7QUFFekIsSUFBTSxXQUFXLGdCQUFnQixDQUFDO0FBQ2xDLElBQU0sRUFBRSxHQUFHLDRCQUE0QixDQUFDOztJQUduQixTQUFTO1lBQVQsU0FBUzs7Ozs7Ozs7O0FBT2pCLFdBUFEsU0FBUyxHQU8wQztRQUExRCxRQUFRLHlEQUFHLElBQUk7UUFBRSxPQUFPLHlEQUFHLEVBQUU7UUFBRSxNQUFNLHlEQUFHLEVBQUU7UUFBRSxPQUFPLHlEQUFHLEVBQUU7OzBCQVBqRCxTQUFTOztBQVExQixXQUFPLEdBQUcsZUFBYyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6RCwrQkFUaUIsU0FBUyw2Q0FTcEIsUUFBUSxJQUFJLFdBQVcsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTs7Ozs7O0FBTXBELFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOzs7Ozs7QUFNakIsUUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFTLENBQUM7Ozs7OztBQU0vQixRQUFJLENBQUMsWUFBWSxHQUFHLFVBQVMsQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLGVBQWUsR0FBRyxVQUFTLENBQUM7QUFDakMsUUFBSSxDQUFDLGNBQWMsR0FBRyxVQUFTLENBQUM7R0FDakM7O2VBL0JrQixTQUFTOztXQWlDckIsaUJBQUMsSUFBSSxFQUFFO0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDbEI7Ozs7Ozs7O1dBTU8sb0JBQUc7QUFDVCxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN0QixVQUFJLENBQUMsV0FBVyxFQUFF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RSxFQUFFO0FBQ2QsVUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsVUFBSSxDQUFDLGVBQWUsVUFBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUVoQyxVQUFJLENBQUMsYUFBYSxVQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FoT2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6InNyYy9jbGllbnQvZGlzcGxheS9TcGFjZVZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xuXG5jb25zdCBzdmdUZW1wbGF0ZSA9IGA8c3ZnPjwvc3ZnPmA7XG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2VWaWV3IGV4dGVuZHMgVmlldyB7XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgbmV3IHNwYWNlIGluc3RhbmNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gYXJlYSAtIFRoZSBhcmVhIHRvIHJlcHJlc2VudCwgc2hvdWxkIGJlIGRlZmluZWQgYnkgYSBgd2lkdGhgLCBhbiBgaGVpZ2h0YCBhbmQgYW4gb3B0aW9ubmFsIGJhY2tncm91bmQuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudHMgLSBUaGUgZXZlbnRzIHRvIGF0dGFjaCB0byB0aGUgdmlldy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBAdG9kb1xuICAgKi9cbiAgY29uc3RydWN0b3IodGVtcGxhdGUgPSBudWxsLCBjb250ZW50ID0ge30sIGV2ZW50cyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGNsYXNzTmFtZTogJ3NwYWNlJyB9LCBvcHRpb25zKTtcbiAgICBzdXBlcih0ZW1wbGF0ZSB8fCBzdmdUZW1wbGF0ZSwge30sIGV2ZW50cywgb3B0aW9ucyk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgYXJlYSB0byBkaXNwbGF5LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5hcmVhID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEV4cG9zZSBhIE1hcCBvZiB0aGUgJHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRpdmUgcG9pbnQgb2JqZWN0LlxuICAgICAqIEB0eXBlIHtNYXB9XG4gICAgICovXG4gICAgdGhpcy5zaGFwZVBvaW50TWFwID0gbmV3IE1hcCgpO1xuXG4gICAgLyoqXG4gICAgICogRXhwb3NlIGEgTWFwIG9mIHRoZSAkc2hhcGVzIGFuZCB0aGVpciByZWxhdGl2ZSBsaW5lIG9iamVjdC5cbiAgICAgKiBAdHlwZSB7TWFwfVxuICAgICAqL1xuICAgIHRoaXMuc2hhcGVMaW5lTWFwID0gbmV3IE1hcCgpO1xuXG4gICAgdGhpcy5fcmVuZGVyZWRQb2ludHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5fcmVuZGVyZWRMaW5lcyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIHNldEFyZWEoYXJlYSkge1xuICAgIHRoaXMuYXJlYSA9IGFyZWE7XG4gIH1cblxuICAvKipcbiAgICogQXBwbHkgc3R5bGUgYW5kIGNhY2hlIGVsZW1lbnRzIHdoZW4gcmVuZGVyZWQuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblJlbmRlcigpIHtcbiAgICB0aGlzLiRzdmcgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKCdzdmcnKTtcbiAgICB0aGlzLmFkZERlZmluaXRpb25zKCk7XG4gICAgdGhpcy5fcmVuZGVyQXJlYSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBkZWZpbml0aW9ucyBpbnRvIHRoZSBgPGRlZnM+YCB0YWcgb2YgYHRoaXMuJHN2Z2AgdG8gYWxsb3cgdG8gZHJhdyBkaXJlY3RlZCBncmFwaHMgZnJvbSBjc3NcbiAgICovXG4gIGFkZERlZmluaXRpb25zKCkge1xuICAgIHRoaXMuJGRlZnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdkZWZzJyk7XG5cbiAgICAvLyBjb25zdCBtYXJrZXJDaXJjbGUgPSBgXG4gICAgLy8gICA8bWFya2VyIGlkPVwibWFya2VyLWNpcmNsZVwiIG1hcmtlcldpZHRoPVwiN1wiIG1hcmtlckhlaWdodD1cIjdcIiByZWZYPVwiNFwiIHJlZlk9XCI0XCIgPlxuICAgIC8vICAgICAgIDxjaXJjbGUgY3g9XCI0XCIgY3k9XCI0XCIgcj1cIjNcIiBjbGFzcz1cIm1hcmtlci1jaXJjbGVcIiAvPlxuICAgIC8vICAgPC9tYXJrZXI+XG4gICAgLy8gYDtcblxuICAgIGNvbnN0IG1hcmtlckFycm93ID0gYFxuICAgICAgPG1hcmtlciBpZD1cIm1hcmtlci1hcnJvd1wiIG1hcmtlcldpZHRoPVwiMTBcIiBtYXJrZXJIZWlnaHQ9XCIxMFwiIHJlZlg9XCI1XCIgcmVmWT1cIjVcIiBvcmllbnQ9XCJhdXRvXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0wLDAgTDAsMTAgTDEwLDUgTDAsMFwiIGNsYXNzPVwibWFya2VyLWFycm93XCIgLz5cbiAgICAgIDwvbWFya2VyPlxuICAgIGA7XG5cbiAgICB0aGlzLiRkZWZzLmlubmVySFRNTCA9IG1hcmtlckFycm93O1xuICAgIHRoaXMuJHN2Zy5pbnNlcnRCZWZvcmUodGhpcy4kZGVmcywgdGhpcy4kc3ZnLmZpcnN0Q2hpbGQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgYXJlYSB3aGVuIGluc2VydGVkIGluIHRoZSBET00uXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvblNob3coKSB7XG4gICAgdGhpcy5fcmVuZGVyQXJlYSgpO1xuXG4gICAgZm9yIChsZXQgWyRzaGFwZSwgcG9pbnRdIG9mIHRoaXMuc2hhcGVQb2ludE1hcCkge1xuICAgICAgdGhpcy51cGRhdGVQb2ludChwb2ludClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBhcmVhIHdoZW4gaW5zZXJ0ZWQgaW4gdGhlIERPTS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uUmVzaXplKG9yaWVudGF0aW9uLCB2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCkge1xuICAgIHN1cGVyLm9uUmVzaXplKG9yaWVudGF0aW9uLCB2aWV3cG9ydFdpZHRoLCB2aWV3cG9ydEhlaWdodCk7XG4gICAgLy8gb3ZlcnJpZGUgc2l6ZSB0byBtYXRjaCBwYXJlbnQgc2l6ZVxuICAgIHRoaXMuJGVsLnN0eWxlLndpZHRoID0gJzEwMCUnO1xuICAgIHRoaXMuJGVsLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblxuICAgIHRoaXMuX3JlbmRlckFyZWEoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIGFyZWEuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBfcmVuZGVyQXJlYSgpIHtcbiAgICAvLyBpZiAoIXRoaXMuJHBhcmVudCkgeyByZXR1cm47IH1cblxuICAgIGNvbnN0IGFyZWEgPSB0aGlzLmFyZWE7XG4gICAgLy8gdXNlIGB0aGlzLiRlbGAgc2l6ZSBpbnN0ZWFkIG9mIGB0aGlzLiRwYXJlbnRgIHNpemUgdG8gaWdub3JlIHBhcmVudCBwYWRkaW5nXG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy4kZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcblxuICAgIHRoaXMucmF0aW8gPSBNYXRoLm1pbihjb250YWluZXJXaWR0aCAvIGFyZWEud2lkdGgsIGNvbnRhaW5lckhlaWdodCAvIGFyZWEuaGVpZ2h0KTtcbiAgICBjb25zdCBzdmdXaWR0aCA9IGFyZWEud2lkdGggKiB0aGlzLnJhdGlvO1xuICAgIGNvbnN0IHN2Z0hlaWdodCA9IGFyZWEuaGVpZ2h0ICogdGhpcy5yYXRpbztcblxuICAgIGNvbnN0IHRvcCA9IChjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMjtcbiAgICBjb25zdCBsZWZ0ID0gKGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMjtcblxuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgc3ZnV2lkdGgpO1xuICAgIHRoaXMuJHN2Zy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgLy8gdGhpcy4kc3ZnLnNldEF0dHJpYnV0ZSgndmlld0JveCcsIGAwIDAgJHtzdmdXaWR0aH0gJHtzdmdIZWlnaHR9YCk7XG4gICAgLy8gY2VudGVyIHRoZSBzdmcgaW50byB0aGUgcGFyZW50XG4gICAgdGhpcy4kc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ3JlbGF0aXZlJztcbiAgICB0aGlzLiRzdmcuc3R5bGUudG9wID0gYCR7dG9wfXB4YDtcbiAgICB0aGlzLiRzdmcuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuXG4gICAgLy8gZGlzcGxheSBiYWNrZ3JvdW5kIGlmIGFueVxuICAgIGlmIChhcmVhLmJhY2tncm91bmQpIHtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGFyZWEuYmFja2dyb3VuZDtcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAgIHRoaXMuJGVsLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvdmVyJztcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYXJlYSBmb3IgbWFya2Vyc1xuICAgIGNvbnN0IG1hcmtlcnMgPSBBcnJheS5mcm9tKHRoaXMuJGRlZnMucXVlcnlTZWxlY3RvckFsbCgnbWFya2VyJykpO1xuICAgIG1hcmtlcnMuZm9yRWFjaCgobWFya2VyKSA9PiB7XG4gICAgICBtYXJrZXIuc2V0QXR0cmlidXRlKCd2aWV3Qm94JywgYDAgMCAke3N2Z1dpZHRofSAke3N2Z0hlaWdodH1gKTtcbiAgICB9KTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBwb2ludC4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiB0byBkaXNwbGF5IGEgcG9pbnQgd2l0aCBhIHVzZXIgZGVmaW5lZCBzaGFwZS4gVGhlc2Ugc2hhcGVzIGFyZSBhcHBlbmRlZCB0byB0aGUgYHN2Z2AgZWxlbWVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gcmVuZGVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ9IHBvaW50LmlkIC0gQW4gdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBwb2ludC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvaW50LnggLSBUaGUgcG9pbnQgaW4gdGhlIHggYXhpcyBpbiB0aGUgYXJlYSBjb3JkaW5hdGUgc3lzdGVtLlxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9pbnQueSAtIFRoZSBwb2ludCBpbiB0aGUgeSBheGlzIGluIHRoZSBhcmVhIGNvcmRpbmF0ZSBzeXN0ZW0uXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbcG9pbnQucmFkaXVzPTAuM10gLSBUaGUgcmFkaXVzIG9mIHRoZSBwb2ludCAocmVsYXRpdmUgdG8gdGhlIGFyZWEgd2lkdGggYW5kIGhlaWdodCkuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbcG9pbnQuY29sb3I9dW5kZWZpbmVkXSAtIElmIHNwZWNpZmllZCwgdGhlIGNvbG9yIG9mIHRoZSBwb2ludC5cbiAgICovXG4gIHJlbmRlclBvaW50KHBvaW50LCAkc2hhcGUgPSBudWxsKSB7XG4gICAgaWYgKCRzaGFwZSA9PT0gbnVsbCkge1xuICAgICAgJHNoYXBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgncG9pbnQnKTtcbiAgICB9XG5cbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdkYXRhLWlkJywgcG9pbnQuaWQpO1xuICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ2N4JywgYCR7cG9pbnQueCAqIHRoaXMucmF0aW99YCk7XG4gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnY3knLCBgJHtwb2ludC55ICogdGhpcy5yYXRpb31gKTtcbiAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdyJywgcG9pbnQucmFkaXVzIHx8wqA1KTsgLy8gcmFkaXVzIGlzIHJlbGF0aXZlIHRvIGFyZWEgc2l6ZVxuXG4gICAgaWYgKHBvaW50LmNvbG9yKVxuICAgICAgJHNoYXBlLnN0eWxlLmZpbGwgPSBwb2ludC5jb2xvcjtcblxuICAgIGNvbnN0IG1ldGhvZCA9IHBvaW50LnNlbGVjdGVkID8gJ2FkZCcgOiAncmVtb3ZlJztcbiAgICAkc2hhcGUuY2xhc3NMaXN0W21ldGhvZF0oJ3NlbGVjdGVkJyk7XG5cbiAgICByZXR1cm4gJHNoYXBlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcGxhY2UgYWxsIHRoZSBleGlzdGluZyBwb2ludHMgd2l0aCB0aGUgZ2l2ZW4gYXJyYXkgb2YgcG9pbnQuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgc2V0UG9pbnRzKHBvaW50cykge1xuICAgIHRoaXMuY2xlYXJQb2ludHMoKVxuICAgIHRoaXMuYWRkUG9pbnRzKHBvaW50cyk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgcG9pbnRzLlxuICAgKi9cbiAgY2xlYXJQb2ludHMoKSB7XG4gICAgZm9yIChsZXQgaWQgb2YgdGhpcy5fcmVuZGVyZWRQb2ludHMua2V5cygpKSB7XG4gICAgICB0aGlzLmRlbGV0ZVBvaW50KGlkKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIG5ldyBwb2ludHMgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gcG9pbnRzIC0gVGhlIG5ldyBwb2ludHMgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnRzKHBvaW50cykge1xuICAgIHBvaW50cy5mb3JFYWNoKHBvaW50ID0+IHRoaXMuYWRkUG9pbnQocG9pbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBuZXcgcG9pbnQgdG8gdGhlIGFyZWEuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb2ludCAtIFRoZSBuZXcgcG9pbnQgdG8gcmVuZGVyLlxuICAgKi9cbiAgYWRkUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlclBvaW50KHBvaW50KTtcbiAgICB0aGlzLiRzdmcuYXBwZW5kQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5zZXQocG9pbnQuaWQsICRzaGFwZSk7XG4gICAgLy8gbWFwIGZvciBlYXNpZXIgcmV0cmlldmluZyBvZiB0aGUgcG9pbnRcbiAgICB0aGlzLnNoYXBlUG9pbnRNYXAuc2V0KCRzaGFwZSwgcG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIHBvaW50LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9pbnQgLSBUaGUgcG9pbnQgdG8gdXBkYXRlLlxuICAgKi9cbiAgdXBkYXRlUG9pbnQocG9pbnQpIHtcbiAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZFBvaW50cy5nZXQocG9pbnQuaWQpO1xuICAgIHRoaXMucmVuZGVyUG9pbnQocG9pbnQsICRzaGFwZSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgcmVuZGVyZWQgcG9pbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gaWQgLSBUaGUgaWQgb2YgdGhlIHBvaW50IHRvIGRlbGV0ZS5cbiAgICovXG4gIGRlbGV0ZVBvaW50KGlkKSB7XG4gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRQb2ludHMuZ2V0KGlkKTtcbiAgICB0aGlzLiRzdmcucmVtb3ZlQ2hpbGQoJHNoYXBlKTtcbiAgICB0aGlzLl9yZW5kZXJlZFBvaW50cy5kZWxldGUoaWQpO1xuICAgIC8vIG1hcCBmb3IgZWFzaWVyIHJldHJpZXZpbmcgb2YgdGhlIHBvaW50XG4gICAgdGhpcy5zaGFwZVBvaW50TWFwLmRlbGV0ZSgkc2hhcGUpO1xuICB9XG5cblxuLy8gQHRvZG8gLSByZWZhY3RvciB3aXRoIG5ldyB2aWV3Ym94ICsgcmVtb3ZlIGNvZGUgZHVwbGljYXRpb24gaW4gdXBkYXRlLlxuLy8gIC8qKlxuLy8gICAqIFRoZSBtZXRob2QgdXNlZCB0byByZW5kZXIgYSBzcGVjaWZpYyBsaW5lLiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIHRvIGRpc3BsYXkgYSBwb2ludCB3aXRoIGEgdXNlciBkZWZpbmVkIHNoYXBlLiBUaGVzZSBzaGFwZXMgYXJlIHByZXBlbmRlZCB0byB0aGUgYHN2Z2AgZWxlbWVudFxuLy8gICAqIEBwYXJhbSB7T2JqZWN0fSBsaW5lIC0gVGhlIGxpbmUgdG8gcmVuZGVyLlxuLy8gICAqIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gbGluZS5pZCAtIEFuIHVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgbGluZS5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZS50YWlsIC0gVGhlIHBvaW50IHdoZXJlIHRoZSBsaW5lIHNob3VsZCBiZWdpbi5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZS5oZWFkIC0gVGhlIHBvaW50IHdoZXJlIHRoZSBsaW5lIHNob3VsZCBlbmQuXG4vLyAgICogQHBhcmFtIHtCb29sZWFufSBbbGluZS5kaXJlY3RlZD1mYWxzZV0gLSBEZWZpbmVzIGlmIHRoZSBsaW5lIHNob3VsZCBiZSBkaXJlY3RlZCBvciBub3QuXG4vLyAgICogQHBhcmFtIHtTdHJpbmd9IFtsaW5lLmNvbG9yPXVuZGVmaW5lZF0gLSBJZiBzcGVjaWZpZWQsIHRoZSBjb2xvciBvZiB0aGUgbGluZS5cbi8vICAgKi9cbi8vICByZW5kZXJMaW5lKGxpbmUpIHtcbi8vICAgIGNvbnN0IHRhaWwgPSBsaW5lLnRhaWw7XG4vLyAgICBjb25zdCBoZWFkID0gbGluZS5oZWFkO1xuLy9cbi8vICAgIGNvbnN0ICRzaGFwZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3BvbHlsaW5lJyk7XG4vLyAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnbGluZScpO1xuLy8gICAgJHNoYXBlLnNldEF0dHJpYnV0ZSgnZGF0YS1pZCcsIGxpbmUuaWQpO1xuLy9cbi8vICAgIGNvbnN0IHBvaW50cyA9IFtcbi8vICAgICAgYCR7dGFpbC54fSwke3RhaWwueX1gLFxuLy8gICAgICBgJHsodGFpbC54ICsgaGVhZC54KSAvIDJ9LCR7KHRhaWwueSArIGhlYWQueSkgLyAyfWAsXG4vLyAgICAgIGAke2hlYWQueH0sJHtoZWFkLnl9YFxuLy8gICAgXTtcbi8vXG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBwb2ludHMuam9pbignICcpKTtcbi8vICAgICRzaGFwZS5zZXRBdHRyaWJ1dGUoJ3ZlY3Rvci1lZmZlY3QnLCAnbm9uLXNjYWxpbmctc3Ryb2tlJyk7XG4vL1xuLy8gICAgaWYgKGxpbmUuY29sb3IpXG4vLyAgICAgICRzaGFwZS5zdHlsZS5zdHJva2UgPSBsaW5lLmNvbG9yO1xuLy9cbi8vICAgIGlmIChsaW5lLmRpcmVjdGVkKVxuLy8gICAgICAkc2hhcGUuY2xhc3NMaXN0LmFkZCgnYXJyb3cnKTtcbi8vXG4vLyAgICByZXR1cm4gJHNoYXBlO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogUmVwbGFjZSBhbGwgdGhlIGV4aXN0aW5nIGxpbmVzIHdpdGggdGhlIGdpdmVuIGFycmF5IG9mIGxpbmUuXG4vLyAgICogQHBhcmFtIHtBcnJheTxPYmplY3Q+fSBsaW5lcyAtIFRoZSBuZXcgbGluZXMgdG8gcmVuZGVyLlxuLy8gICAqL1xuLy8gIHNldExpbmVzKGxpbmVzKSB7XG4vLyAgICB0aGlzLmNsZWFyTGluZXMoKTtcbi8vICAgIHRoaXMuYWRkTGluZXMobGluZXMpO1xuLy8gIH1cbi8vXG4vLyAgLyoqXG4vLyAgICogQ2xlYXIgYWxsIHRoZSBkaXNwbGF5ZWQgbGluZXMuXG4vLyAgICovXG4vLyAgY2xlYXJMaW5lcygpIHtcbi8vICAgIGZvciAobGV0IGlkIG9mIHRoaXMuX3JlbmRlcmVkTGluZXMua2V5cygpKSB7XG4vLyAgICAgIHRoaXMuZGVsZXRlTGluZShpZCk7XG4vLyAgICB9XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBBZGQgbmV3IGxpbmVzIHRvIHRoZSBhcmVhLlxuLy8gICAqIEBwYXJhbSB7QXJyYXk8T2JqZWN0Pn0gbGluZXMgLSBUaGUgbmV3IGxpbmVzIHRvIHJlbmRlci5cbi8vICAgKi9cbi8vICBhZGRMaW5lcyhsaW5lcykge1xuLy8gICAgbGluZXMuZm9yRWFjaChsaW5lID0+IHRoaXMuYWRkTGluZShsaW5lKSk7XG4vLyAgfVxuLy9cbi8vICAvKipcbi8vICAgKiBBZGQgYSBuZXcgbGluZSB0byB0aGUgYXJlYS5cbi8vICAgKiBAcGFyYW0ge09iamVjdH0gbGluZSAtIFRoZSBuZXcgbGluZSB0byByZW5kZXIuXG4vLyAgICovXG4vLyAgYWRkTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCAkc2hhcGUgPSB0aGlzLnJlbmRlckxpbmUobGluZSk7XG4vLyAgICAvLyBpbnNlcnQganVzdCBhZnRlciB0aGUgPGRlZnM+IHRhZ1xuLy8gICAgLy8gdGhpcy4kc3ZnLmluc2VydEJlZm9yZSgkc2hhcGUsIHRoaXMuJHN2Zy5maXJzdENoaWxkLm5leHRTaWJsaW5nKTtcbi8vICAgIHRoaXMuJHN2Zy5hcHBlbmRDaGlsZCgkc2hhcGUpO1xuLy9cbi8vICAgIHRoaXMuX3JlbmRlcmVkTGluZXMuc2V0KGxpbmUuaWQsICRzaGFwZSk7XG4vLyAgICB0aGlzLnNoYXBlTGluZU1hcC5zZXQoJHNoYXBlLCBsaW5lKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFVwZGF0ZSBhIHJlbmRlcmVkIGxpbmUuXG4vLyAgICogQHBhcmFtIHtPYmplY3R9IGxpbmUgLSBUaGUgbGluZSB0byB1cGRhdGUuXG4vLyAgICovXG4vLyAgdXBkYXRlTGluZShsaW5lKSB7XG4vLyAgICBjb25zdCAkc2hhcGUgPSB0aGlzLl9yZW5kZXJlZExpbmVzLmdldChsaW5lLmlkKTtcbi8vICAgIGNvbnN0IHRhaWwgPSBsaW5lLnRhaWw7XG4vLyAgICBjb25zdCBoZWFkID0gbGluZS5oZWFkO1xuLy9cbi8vICAgIGNvbnN0IHBvaW50cyA9IFtcbi8vICAgICAgYCR7dGFpbC54fSwke3RhaWwueX1gLFxuLy8gICAgICBgJHsodGFpbC54ICsgaGVhZC54KSAvIDJ9LCR7KHRhaWwueSArIGhlYWQueSkgLyAyfWAsXG4vLyAgICAgIGAke2hlYWQueH0sJHtoZWFkLnl9YFxuLy8gICAgXTtcbi8vXG4vLyAgICAkc2hhcGUuc2V0QXR0cmlidXRlKCdwb2ludHMnLCBwb2ludHMuam9pbignICcpKTtcbi8vICB9XG4vL1xuLy8gIC8qKlxuLy8gICAqIFJlbW92ZSBhIHJlbmRlcmVkIGxpbmUuXG4vLyAgICogQHBhcmFtIHtTdHJpbmd8TnVtYmVyfSBpZCAtIFRoZSBpZCBvZiB0aGUgbGluZSB0byBkZWxldGUuXG4vLyAgICovXG4vLyAgZGVsZXRlTGluZShpZCkge1xuLy8gICAgY29uc3QgJHNoYXBlID0gdGhpcy5fcmVuZGVyZWRMaW5lcy5nZXQoaWQpO1xuLy8gICAgdGhpcy4kc3ZnLnJlbW92ZUNoaWxkKCRzaGFwZSk7XG4vL1xuLy8gICAgdGhpcy5fcmVuZGVyZWRMaW5lcy5kZWxldGUoaWQpO1xuLy8gICAgdGhpcy5zaGFwZUxpbmVNYXAuZGVsZXRlKCRzaGFwZSk7XG4vLyAgfVxufVxuIl19
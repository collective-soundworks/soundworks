'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _ClientModule2 = require('./ClientModule');

var _ClientModule3 = _interopRequireDefault(_ClientModule2);

var ns = 'http://www.w3.org/2000/svg';

/**
 * [client] Render a set of positions (i.e. coordinates with optional labels) graphically.
 *
 * The module never has a view (it displays the graphical representation in a `div` passed in as an argument of the {@link Space#display} method).
 *
 * The module finishes its initialization immediately.
 *
 * @example const space = new Space();
 * space.display(container);
 */

var Space = (function (_ClientModule) {
  _inherits(Space, _ClientModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='space'] Name of the module.
   * @param {Boolean} [options.fitContainer=false] Indicates whether the graphical representation fits the container size or not.
   * @param {Boolean} [options.listenTouchEvent=false] Indicates whether to setup a listener on the space graphical representation or not.
   */

  function Space() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Space);

    _get(Object.getPrototypeOf(Space.prototype), 'constructor', this).call(this, options.name || 'space');

    this._width = 10;
    this._height = 10;

    this._fitContainer = options.fitContainer || false;
    this._listenTouchEvent = options.listenTouchEvent || false;

    this._xFactor = 1;
    this._yFactor = 1;

    // map between shapes and their related positions
    this._shapePositionMap = [];
    this._positionIndexShapeMap = {};
  }

  /**
   * Start the module.
   * @private
   */

  _createClass(Space, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Space.prototype), 'start', this).call(this);
      this.done();
    }

    /**
     * Restart the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Space.prototype), 'restart', this).call(this);
      this.done();
    }

    /**
     * Reset the module.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      this._shapePositionMap = [];
      this._positionIndexShapeMap = {};
      this._container.innerHTML = '';
    }

    /**
     * Display a graphical representation of the space.
     * @param {DOMElement} container Container to append the representation to.
     * @param {Array} positions List of positions to display.
     * @param {Object} [options={}] Options.
     * @param {String} [options.transform] Indicates which transformation to aply to the representation. Possible values are:
     * - `'rotate180'`: rotates the representation by 180 degrees.
     * @todo Big problem with the container (_container --> only one of them, while we should be able to use the display method on several containers)
     */
  }, {
    key: 'display',
    value: function display(container) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      this._container = container;
      this._container.classList.add('space');
      this._renderingOptions = options;

      this._width = options.width;
      this._height = options.height;

      if (options.background) {
        this._container.style.backgroundImage = 'url(' + options.background + ')';
        this._container.style.backgroundPosition = '50% 50%';
        this._container.style.backgroundRepeat = 'no-repeat';
        this._container.style.backgroundSize = 'contain';
      }

      var svg = document.createElementNS(ns, 'svg');
      var group = document.createElementNS(ns, 'g');

      svg.appendChild(group);
      this._container.appendChild(svg);

      this._svg = svg;
      this._group = group;

      this.resize(this._container);

      this.done();
    }

    /**
     * Display an array of positions.
     * @param {Object[]} positions Positions to display.
     * @param {Number} size Size of the positions to display.
     */
  }, {
    key: 'displayPositions',
    value: function displayPositions(positions, size) {
      var _this = this;

      // clean surface
      this.removeAllPositions();

      positions.forEach(function (position) {
        _this.addPosition(position, size);
      });

      // add listeners
      if (this._listenTouchEvent) {
        this._container.addEventListener('touchstart', function (e) {
          e.preventDefault();
          var dots = _this._shapePositionMap.map(function (entry) {
            return entry.dot;
          });
          var target = e.target;

          // Could probably be simplified...
          while (target !== _this._container) {
            if (dots.indexOf(target) !== -1) {
              for (var i = 0; i < _this._shapePositionMap; i++) {
                var entry = _this._shapePositionMap[i];
                if (target === entry.dot) {
                  var position = entry.position;
                  _this.emit('select', position);
                }
              }
            }

            target = target.parentNode;
          }
        });
      }
    }

    /**
     * Adds a position to the display.
     * @param {Object} position Position to add.
     * @param {Number} size Size of the position to draw.
     */
  }, {
    key: 'addPosition',
    value: function addPosition(position, size) {
      var radius = size / 2;
      var coordinates = position.coordinates;
      var index = position.index;

      var dot = document.createElementNS(ns, 'circle');
      dot.setAttributeNS(null, 'r', radius / this._ratio);
      dot.setAttributeNS(null, 'cx', coordinates[0] * this._width);
      dot.setAttributeNS(null, 'cy', coordinates[1] * this._height);
      dot.style.fill = 'steelblue';

      this._group.appendChild(dot);
      this._shapePositionMap.push({ dot: dot, position: position });
      this._positionIndexShapeMap[index] = dot;
    }

    /**
     * Removes a position from the display.
     * @param {Number} index of position to remove.
     */
  }, {
    key: 'removePosition',
    value: function removePosition(index) {
      var el = this._positionIndexShapeMap[index];
      this._group.removeChild(el);
    }

    /**
     * Remove all the positions displayed.
     */
  }, {
    key: 'removeAllPositions',
    value: function removeAllPositions() {
      while (this._group.firstChild) {
        this._group.removeChild(this._group.firstChild);
      }
    }

    /**
     * Resize the SVG element.
     */
  }, {
    key: 'resize',
    value: function resize() {
      var _this2 = this;

      var boundingRect = this._container.getBoundingClientRect();
      var containerWidth = boundingRect.width;
      var containerHeight = boundingRect.height;
      // force adaptation to container size

      var ratio = (function () {
        return _this2._width > _this2._height ? containerWidth / _this2._width : containerHeight / _this2._height;
      })();

      var svgWidth = this._width * ratio;
      var svgHeight = this._height * ratio;

      if (this._fitContainer) {
        svgWidth = containerWidth;
        svgHeight = containerHeight;
      }

      var offsetLeft = (containerWidth - svgWidth) / 2;
      var offsetTop = (containerHeight - svgHeight) / 2;

      this._svg.setAttributeNS(null, 'width', svgWidth);
      this._svg.setAttributeNS(null, 'height', svgHeight);
      // use space coordinates
      this._svg.setAttributeNS(null, 'viewBox', '0 0 ' + this._width + ' ' + this._height);
      // center svg in container
      this._svg.style.position = 'absolute';
      this._svg.style.left = offsetLeft + 'px';
      this._svg.style.top = offsetTop + 'px';

      // apply rotations
      if (this._renderingOptions.transform) {
        switch (this._renderingOptions.transform) {
          case 'rotate180':
            this._container.setAttribute('data-xfactor', -1);
            this._container.setAttribute('data-yfactor', -1);
            // const transform = `rotate(180, ${svgWidth / 2}, ${svgHeight / 2})`;
            var transform = 'rotate(180, 0.5, 0.5)';
            this._group.setAttributeNS(null, 'transform', transform);
            break;
        }
      }

      /**
       * Left offset of the SVG element.
       * @type {Number}
       */
      this.svgOffsetLeft = offsetLeft;

      /**
       * Top offset of the SVG element.
       * @type {Number}
       */
      this.svgOffsetTop = offsetTop;

      /**
       * Width of the SVG element.
       * @type {Number}
       */
      this.svgWidth = svgWidth;

      /**
       * Height of the SVG element.
       * @type {Number}
       */
      this.svgHeight = svgHeight;

      this._ratio = ratio;
    }
  }]);

  return Space;
})(_ClientModule3['default']);

exports['default'] = Space;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7QUFFekMsSUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUM7Ozs7Ozs7Ozs7Ozs7SUFZbkIsS0FBSztZQUFMLEtBQUs7Ozs7Ozs7OztBQU9iLFdBUFEsS0FBSyxHQU9FO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxLQUFLOztBQVF0QiwrQkFSaUIsS0FBSyw2Q0FRaEIsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsYUFBYSxHQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSyxBQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGlCQUFpQixHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLEFBQUMsQ0FBQzs7QUFFN0QsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7OztBQUdsQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7Ozs7Ozs7ZUF0QmtCLEtBQUs7O1dBNEJuQixpQkFBRztBQUNOLGlDQTdCaUIsS0FBSyx1Q0E2QlI7QUFDZCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7Ozs7Ozs7V0FNTSxtQkFBRztBQUNSLGlDQXRDaUIsS0FBSyx5Q0FzQ047QUFDaEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7Ozs7Ozs7O1dBTUksaUJBQUc7QUFDTixVQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFVBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7QUFDakMsVUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0tBQ2hDOzs7Ozs7Ozs7Ozs7O1dBV00saUJBQUMsU0FBUyxFQUFnQjtVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDN0IsVUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7QUFDNUIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxpQkFBaUIsR0FBRyxPQUFPLENBQUM7O0FBRWpDLFVBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQztBQUM1QixVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0FBRTlCLFVBQUksT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUN0QixZQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxlQUFlLFlBQVUsT0FBTyxDQUFDLFVBQVUsTUFBRyxDQUFDO0FBQ3JFLFlBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGtCQUFrQixHQUFHLFNBQVMsQ0FBQztBQUNyRCxZQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsR0FBRyxXQUFXLENBQUM7QUFDckQsWUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLFNBQVMsQ0FBQztPQUNsRDs7QUFFRCxVQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRCxVQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQzs7QUFFaEQsU0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixVQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFakMsVUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7QUFDaEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7O0FBRXBCLFVBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDOztBQUU3QixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7Ozs7Ozs7O1dBT2UsMEJBQUMsU0FBUyxFQUFFLElBQUksRUFBRTs7OztBQUVoQyxVQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzs7QUFFMUIsZUFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVEsRUFBSztBQUM5QixjQUFLLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDbEMsQ0FBQyxDQUFDOzs7QUFHSCxVQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtBQUMxQixZQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFlBQVksRUFBRSxVQUFDLENBQUMsRUFBSztBQUNwRCxXQUFDLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbkIsY0FBTSxJQUFJLEdBQUcsTUFBSyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsVUFBQyxLQUFLLEVBQUs7QUFBRSxtQkFBTyxLQUFLLENBQUMsR0FBRyxDQUFBO1dBQUUsQ0FBQyxDQUFDO0FBQ3pFLGNBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7OztBQUd0QixpQkFBTyxNQUFNLEtBQUssTUFBSyxVQUFVLEVBQUU7QUFDakMsZ0JBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMvQixtQkFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQUssaUJBQWlCLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDL0Msb0JBQU0sS0FBSyxHQUFHLE1BQUssaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsb0JBQUksTUFBTSxLQUFLLEtBQUssQ0FBQyxHQUFHLEVBQUU7QUFDeEIsc0JBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUM7QUFDaEMsd0JBQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztpQkFDL0I7ZUFDRjthQUNGOztBQUVELGtCQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQztXQUM1QjtTQUNGLENBQUMsQ0FBQztPQUNKO0tBQ0Y7Ozs7Ozs7OztXQU9VLHFCQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUU7QUFDMUIsVUFBTSxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN4QixVQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDO0FBQ3pDLFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7O0FBRTdCLFVBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ25ELFNBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BELFNBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdELFNBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzlELFNBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFdBQVcsQ0FBQzs7QUFFN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDN0IsVUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBSCxHQUFHLEVBQUUsUUFBUSxFQUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUMxQzs7Ozs7Ozs7V0FNYSx3QkFBQyxLQUFLLEVBQUU7QUFDcEIsVUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlDLFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQzdCOzs7Ozs7O1dBS2lCLDhCQUFHO0FBQ25CLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7QUFDN0IsWUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztPQUNqRDtLQUNGOzs7Ozs7O1dBS0ssa0JBQUc7OztBQUNQLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsQ0FBQztBQUM3RCxVQUFNLGNBQWMsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDO0FBQzFDLFVBQU0sZUFBZSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7OztBQUc1QyxVQUFNLEtBQUssR0FBRyxDQUFDLFlBQU07QUFDbkIsZUFBTyxBQUFDLE9BQUssTUFBTSxHQUFHLE9BQUssT0FBTyxHQUNoQyxjQUFjLEdBQUcsT0FBSyxNQUFNLEdBQzVCLGVBQWUsR0FBRyxPQUFLLE9BQU8sQ0FBQztPQUNsQyxDQUFBLEVBQUcsQ0FBQzs7QUFFTCxVQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztBQUNuQyxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQzs7QUFFckMsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLGdCQUFRLEdBQUcsY0FBYyxDQUFDO0FBQzFCLGlCQUFTLEdBQUcsZUFBZSxDQUFDO09BQzdCOztBQUVELFVBQU0sVUFBVSxHQUFHLENBQUMsY0FBYyxHQUFHLFFBQVEsQ0FBQSxHQUFJLENBQUMsQ0FBQztBQUNuRCxVQUFNLFNBQVMsR0FBRyxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUEsR0FBSSxDQUFDLENBQUM7O0FBRXBELFVBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEQsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFNBQVMsV0FBUyxJQUFJLENBQUMsTUFBTSxTQUFJLElBQUksQ0FBQyxPQUFPLENBQUcsQ0FBQzs7QUFFaEYsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUN0QyxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQU0sVUFBVSxPQUFJLENBQUM7QUFDekMsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFNLFNBQVMsT0FBSSxDQUFDOzs7QUFHdkMsVUFBSSxJQUFJLENBQUMsaUJBQWlCLENBQUMsU0FBUyxFQUFFO0FBQ3BDLGdCQUFRLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO0FBQ3RDLGVBQUssV0FBVztBQUNkLGdCQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqRCxnQkFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7O0FBRWpELGdCQUFNLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztBQUMxQyxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN6RCxrQkFBTTtBQUFBLFNBQ1Q7T0FDRjs7Ozs7O0FBTUQsVUFBSSxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUM7Ozs7OztBQU1oQyxVQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQzs7Ozs7O0FBTTlCLFVBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDOzs7Ozs7QUFNekIsVUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7O0FBRTNCLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0tBQ3JCOzs7U0FoUGtCLEtBQUs7OztxQkFBTCxLQUFLIiwiZmlsZSI6InNyYy9jbGllbnQvU3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBDbGllbnRNb2R1bGUgZnJvbSAnLi9DbGllbnRNb2R1bGUnO1xuXG5jb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cbi8qKlxuICogW2NsaWVudF0gUmVuZGVyIGEgc2V0IG9mIHBvc2l0aW9ucyAoaS5lLiBjb29yZGluYXRlcyB3aXRoIG9wdGlvbmFsIGxhYmVscykgZ3JhcGhpY2FsbHkuXG4gKlxuICogVGhlIG1vZHVsZSBuZXZlciBoYXMgYSB2aWV3IChpdCBkaXNwbGF5cyB0aGUgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIGluIGEgYGRpdmAgcGFzc2VkIGluIGFzIGFuIGFyZ3VtZW50IG9mIHRoZSB7QGxpbmsgU3BhY2UjZGlzcGxheX0gbWV0aG9kKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseS5cbiAqXG4gKiBAZXhhbXBsZSBjb25zdCBzcGFjZSA9IG5ldyBTcGFjZSgpO1xuICogc3BhY2UuZGlzcGxheShjb250YWluZXIpO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGFjZSBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzcGFjZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maXRDb250YWluZXI9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gZml0cyB0aGUgY29udGFpbmVyIHNpemUgb3Igbm90LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmxpc3RlblRvdWNoRXZlbnQ9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIHNldHVwIGEgbGlzdGVuZXIgb24gdGhlIHNwYWNlIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdzcGFjZScpO1xuXG4gICAgdGhpcy5fd2lkdGggPSAxMDtcbiAgICB0aGlzLl9oZWlnaHQgPSAxMDtcblxuICAgIHRoaXMuX2ZpdENvbnRhaW5lciA9IChvcHRpb25zLmZpdENvbnRhaW5lciB8fMKgZmFsc2UpO1xuICAgIHRoaXMuX2xpc3RlblRvdWNoRXZlbnQgPSAob3B0aW9ucy5saXN0ZW5Ub3VjaEV2ZW50IHx8IGZhbHNlKTtcblxuICAgIHRoaXMuX3hGYWN0b3IgPSAxO1xuICAgIHRoaXMuX3lGYWN0b3IgPSAxO1xuXG4gICAgLy8gbWFwIGJldHdlZW4gc2hhcGVzIGFuZCB0aGVpciByZWxhdGVkIHBvc2l0aW9uc1xuICAgIHRoaXMuX3NoYXBlUG9zaXRpb25NYXAgPSBbXTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXAgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcCA9IFtdO1xuICAgIHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcCA9IHt9O1xuICAgIHRoaXMuX2NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzcGFjZS5cbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBjb250YWluZXIgQ29udGFpbmVyIHRvIGFwcGVuZCB0aGUgcmVwcmVzZW50YXRpb24gdG8uXG4gICAqIEBwYXJhbSB7QXJyYXl9IHBvc2l0aW9ucyBMaXN0IG9mIHBvc2l0aW9ucyB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50cmFuc2Zvcm1dIEluZGljYXRlcyB3aGljaCB0cmFuc2Zvcm1hdGlvbiB0byBhcGx5IHRvIHRoZSByZXByZXNlbnRhdGlvbi4gUG9zc2libGUgdmFsdWVzIGFyZTpcbiAgICogLSBgJ3JvdGF0ZTE4MCdgOiByb3RhdGVzIHRoZSByZXByZXNlbnRhdGlvbiBieSAxODAgZGVncmVlcy5cbiAgICogQHRvZG8gQmlnIHByb2JsZW0gd2l0aCB0aGUgY29udGFpbmVyIChfY29udGFpbmVyIC0tPiBvbmx5IG9uZSBvZiB0aGVtLCB3aGlsZSB3ZSBzaG91bGQgYmUgYWJsZSB0byB1c2UgdGhlIGRpc3BsYXkgbWV0aG9kIG9uIHNldmVyYWwgY29udGFpbmVycylcbiAgICovXG4gIGRpc3BsYXkoY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5fY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NwYWNlJyk7XG4gICAgdGhpcy5fcmVuZGVyaW5nT3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICB0aGlzLl93aWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgdGhpcy5faGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG5cbiAgICBpZiAob3B0aW9ucy5iYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke29wdGlvbnMuYmFja2dyb3VuZH0pYDtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuICAgIH1cblxuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGdyb3VwKTtcbiAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnKTtcblxuICAgIHRoaXMuX3N2ZyA9IHN2ZztcbiAgICB0aGlzLl9ncm91cCA9IGdyb3VwO1xuXG4gICAgdGhpcy5yZXNpemUodGhpcy5fY29udGFpbmVyKTtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgYW4gYXJyYXkgb2YgcG9zaXRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBwb3NpdGlvbnMgUG9zaXRpb25zIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplIFNpemUgb2YgdGhlIHBvc2l0aW9ucyB0byBkaXNwbGF5LlxuICAgKi9cbiAgZGlzcGxheVBvc2l0aW9ucyhwb3NpdGlvbnMsIHNpemUpIHtcbiAgICAvLyBjbGVhbiBzdXJmYWNlXG4gICAgdGhpcy5yZW1vdmVBbGxQb3NpdGlvbnMoKTtcblxuICAgIHBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgICAgdGhpcy5hZGRQb3NpdGlvbihwb3NpdGlvbiwgc2l6ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgbGlzdGVuZXJzXG4gICAgaWYgKHRoaXMuX2xpc3RlblRvdWNoRXZlbnQpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBkb3RzID0gdGhpcy5fc2hhcGVQb3NpdGlvbk1hcC5tYXAoKGVudHJ5KSA9PiB7IHJldHVybiBlbnRyeS5kb3QgfSk7XG4gICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgICAgICAvLyBDb3VsZCBwcm9iYWJseSBiZSBzaW1wbGlmaWVkLi4uXG4gICAgICAgIHdoaWxlICh0YXJnZXQgIT09IHRoaXMuX2NvbnRhaW5lcikge1xuICAgICAgICAgIGlmIChkb3RzLmluZGV4T2YodGFyZ2V0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fc2hhcGVQb3NpdGlvbk1hcFtpXTtcbiAgICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gZW50cnkuZG90KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBlbnRyeS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3NlbGVjdCcsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvc2l0aW9uIHRvIHRoZSBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gUG9zaXRpb24gdG8gYWRkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSBTaXplIG9mIHRoZSBwb3NpdGlvbiB0byBkcmF3LlxuICAgKi9cbiAgYWRkUG9zaXRpb24ocG9zaXRpb24sIHNpemUpIHtcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gMjtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIGNvbnN0IGluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG5cbiAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdjaXJjbGUnKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCByYWRpdXMgLyB0aGlzLl9yYXRpbyk7XG4gICAgZG90LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeCcsIGNvb3JkaW5hdGVzWzBdICogdGhpcy5fd2lkdGgpO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY3knLCBjb29yZGluYXRlc1sxXSAqIHRoaXMuX2hlaWdodCk7XG4gICAgZG90LnN0eWxlLmZpbGwgPSAnc3RlZWxibHVlJztcblxuICAgIHRoaXMuX2dyb3VwLmFwcGVuZENoaWxkKGRvdCk7XG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcC5wdXNoKHsgZG90LCBwb3NpdGlvbiB9KTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXBbaW5kZXhdID0gZG90O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBwb3NpdGlvbiBmcm9tIHRoZSBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggb2YgcG9zaXRpb24gdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUG9zaXRpb24oaW5kZXgpIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcFtpbmRleF07XG4gICAgdGhpcy5fZ3JvdXAucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIHBvc2l0aW9ucyBkaXNwbGF5ZWQuXG4gICAqL1xuICByZW1vdmVBbGxQb3NpdGlvbnMoKSB7XG4gICAgd2hpbGUgKHRoaXMuX2dyb3VwLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuX2dyb3VwLnJlbW92ZUNoaWxkKHRoaXMuX2dyb3VwLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNpemUgdGhlIFNWRyBlbGVtZW50LlxuICAgKi9cbiAgcmVzaXplKCkge1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuX2NvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuICAgIC8vIGZvcmNlIGFkYXB0YXRpb24gdG8gY29udGFpbmVyIHNpemVcblxuICAgIGNvbnN0IHJhdGlvID0gKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy5fd2lkdGggPiB0aGlzLl9oZWlnaHQpID9cbiAgICAgICAgY29udGFpbmVyV2lkdGggLyB0aGlzLl93aWR0aCA6XG4gICAgICAgIGNvbnRhaW5lckhlaWdodCAvIHRoaXMuX2hlaWdodDtcbiAgICB9KSgpO1xuXG4gICAgbGV0IHN2Z1dpZHRoID0gdGhpcy5fd2lkdGggKiByYXRpbztcbiAgICBsZXQgc3ZnSGVpZ2h0ID0gdGhpcy5faGVpZ2h0ICogcmF0aW87XG5cbiAgICBpZiAodGhpcy5fZml0Q29udGFpbmVyKSB7XG4gICAgICBzdmdXaWR0aCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgc3ZnSGVpZ2h0ID0gY29udGFpbmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGNvbnN0IG9mZnNldExlZnQgPSAoY29udGFpbmVyV2lkdGggLSBzdmdXaWR0aCkgLyAyO1xuICAgIGNvbnN0IG9mZnNldFRvcCA9IChjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMjtcblxuICAgIHRoaXMuX3N2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBzdmdXaWR0aCk7XG4gICAgdGhpcy5fc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgICAvLyB1c2Ugc3BhY2UgY29vcmRpbmF0ZXNcbiAgICB0aGlzLl9zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdCb3gnLCBgMCAwICR7dGhpcy5fd2lkdGh9ICR7dGhpcy5faGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciBzdmcgaW4gY29udGFpbmVyXG4gICAgdGhpcy5fc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLl9zdmcuc3R5bGUubGVmdCA9IGAke29mZnNldExlZnR9cHhgO1xuICAgIHRoaXMuX3N2Zy5zdHlsZS50b3AgPSBgJHtvZmZzZXRUb3B9cHhgO1xuXG4gICAgLy8gYXBwbHkgcm90YXRpb25zXG4gICAgaWYgKHRoaXMuX3JlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuX3JlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICAgIGNhc2UgJ3JvdGF0ZTE4MCc6XG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS14ZmFjdG9yJywgLTEpO1xuICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEteWZhY3RvcicsIC0xKTtcbiAgICAgICAgICAvLyBjb25zdCB0cmFuc2Zvcm0gPSBgcm90YXRlKDE4MCwgJHtzdmdXaWR0aCAvIDJ9LCAke3N2Z0hlaWdodCAvIDJ9KWA7XG4gICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gJ3JvdGF0ZSgxODAsIDAuNSwgMC41KSc7XG4gICAgICAgICAgdGhpcy5fZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGVmdCBvZmZzZXQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdPZmZzZXRMZWZ0ID0gb2Zmc2V0TGVmdDtcblxuICAgIC8qKlxuICAgICAqIFRvcCBvZmZzZXQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdPZmZzZXRUb3AgPSBvZmZzZXRUb3A7XG5cbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z1dpZHRoID0gc3ZnV2lkdGg7XG5cbiAgICAvKipcbiAgICAgKiBIZWlnaHQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdIZWlnaHQgPSBzdmdIZWlnaHQ7XG5cbiAgICB0aGlzLl9yYXRpbyA9IHJhdGlvO1xuICB9XG59XG4iXX0=
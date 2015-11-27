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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

var ns = 'http://www.w3.org/2000/svg';

/**
 * [client] Render a {@link Setup} data graphically.
 *
 * The module never has a view (it displays the graphical representation in a `div` passed in as an argument of the {@link Space#display} method).
 *
 * The module finishes its initialization immediately.
 */

var Space = (function (_Module) {
  _inherits(Space, _Module);

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

    /**
     * Relative width of the setup.
     * @type {Number}
     */
    this.width = 1;

    /**
     * Relative height of the setup.
     * @type {Number}
     */
    this.height = 1;

    this._fitContainer = options.fitContainer || false;
    this._listenTouchEvent = options.listenTouchEvent || false;

    // this.spacing = 1;
    // this.labels = [];
    // this.coordinates = [];

    /**
     * Type of the setup (values currently supported: `'matrix'`, `'surface'`).
     * @type {String}
     * @todo Remove?
     */
    this.type = undefined;

    /**
     * URL of the background image (if any).
     * @type {String}
     */
    this.background = null;

    this._xFactor = 1;
    this._yFactor = 1;

    // map between shapes and their related positions
    this._shapePositionMap = [];
    this._positionIndexShapeMap = {};
  }

  // TODO note -> modfiy here

  _createClass(Space, [{
    key: '_initSetup',
    value: function _initSetup(setup) {
      this.width = setup.width;
      this.height = setup.height;
      // this.spacing = setup.spacing;
      // this.labels = setup.labels;
      // this.coordinates = setup.coordinates;
      this.type = setup.type;
      this.background = setup.background;

      this.done();
    }

    /**
     * Start the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(Space.prototype), 'start', this).call(this);
      this.done();
      // client.receive('setup:init', this._onSetupInit);
      // client.send('setup:request');
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
      // client.removeListener('setup:init', this._onSetupInit);
      this._container.innerHTML = '';
    }

    /**
     * Display a graphical representation of the setup.
     * @param {ClientSetup} setup Setup to display.
     * @param {DOMElement} container Container to append the setup representation to.
     * @param {Object} [options={}] Options.
     * @param {String} [options.transform] Indicates which transformation to aply to the representation. Possible values are:
     * - `'rotate180'`: rotates the representation by 180 degrees.
     * @todo Big problem with the container (_container --> only one of them, while we should be able to use the display method on several containers)
     */
  }, {
    key: 'display',
    value: function display(setup, container) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this._initSetup(setup);
      this._container = container;
      this._container.classList.add('space');
      this._renderingOptions = options;

      if (options.showBackground) {
        this._container.style.backgroundImage = 'url(' + this.background + ')';
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
    }

    /**
     * Resize the SVG element.
     */
  }, {
    key: 'resize',
    value: function resize() {
      var _this = this;

      var boundingRect = this._container.getBoundingClientRect();
      var containerWidth = boundingRect.width;
      var containerHeight = boundingRect.height;
      // force adaptation to container size

      var ratio = (function () {
        return _this.width > _this.height ? containerWidth / _this.width : containerHeight / _this.height;
      })();

      var svgWidth = this.width * ratio;
      var svgHeight = this.height * ratio;

      if (this._fitContainer) {
        svgWidth = containerWidth;
        svgHeight = containerHeight;
      }

      var offsetLeft = (containerWidth - svgWidth) / 2;
      var offsetTop = (containerHeight - svgHeight) / 2;

      this._svg.setAttributeNS(null, 'width', svgWidth);
      this._svg.setAttributeNS(null, 'height', svgHeight);
      // use setup coordinates
      this._svg.setAttributeNS(null, 'viewBox', '0 0 ' + this.width + ' ' + this.height);
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

    /**
     * Display an array of positions.
     * @param {Object[]} positions Positions to display.
     * @param {Number} size Size of the positions to display.
     */
  }, {
    key: 'displayPositions',
    value: function displayPositions(positions, size) {
      var _this2 = this;

      // clean surface
      this.removeAllPositions();

      positions.forEach(function (position) {
        _this2.addPosition(position, size);
      });

      // add listeners
      if (this._listenTouchEvent) {
        this._container.addEventListener('touchstart', function (e) {
          e.preventDefault();
          var dots = _this2._shapePositionMap.map(function (entry) {
            return entry.dot;
          });
          var target = e.target;

          // Could probably be simplified...
          while (target !== _this2._container) {
            if (dots.indexOf(target) !== -1) {
              for (var i = 0; i < _this2._shapePositionMap; i++) {
                var entry = _this2._shapePositionMap[i];
                if (target === entry.dot) {
                  var position = entry.position;
                  _this2.emit('select', position);
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
      dot.setAttributeNS(null, 'cx', coordinates[0] * this.width);
      dot.setAttributeNS(null, 'cy', coordinates[1] * this.height);
      dot.style.fill = 'steelblue';

      this._group.appendChild(dot);
      this._shapePositionMap.push({ dot: dot, position: position });
      this._positionIndexShapeMap[index] = dot;
    }

    /**
     * Removes a position from the display.
     * @param {Object} position Position to remove.
     */
  }, {
    key: 'removePosition',
    value: function removePosition(position) {
      var el = this._positionIndexShapeMap[position.index];
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
  }]);

  return Space;
})(_Module3['default']);

exports['default'] = Space;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0FBRTdCLElBQU0sRUFBRSxHQUFHLDRCQUE0QixDQUFDOzs7Ozs7Ozs7O0lBU25CLEtBQUs7WUFBTCxLQUFLOzs7Ozs7Ozs7QUFPYixXQVBRLEtBQUssR0FPRTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsS0FBSzs7QUFRdEIsK0JBUmlCLEtBQUssNkNBUWhCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsYUFBYSxHQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSyxBQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGlCQUFpQixHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLEFBQUMsQ0FBQzs7Ozs7Ozs7Ozs7QUFXN0QsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7OztBQUdsQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7Ozs7ZUFoRGtCLEtBQUs7O1dBbURkLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDekIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOzs7O0FBSTNCLFVBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN2QixVQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7O0FBRW5DLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7Ozs7OztXQU1JLGlCQUFHO0FBQ04saUNBcEVpQixLQUFLLHVDQW9FUjtBQUNkLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7O0tBR2I7Ozs7Ozs7O1dBTU0sbUJBQUc7QUFDUixpQ0EvRWlCLEtBQUsseUNBK0VOO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7Ozs7OztXQU1JLGlCQUFHO0FBQ04sVUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM1QixVQUFJLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDOztBQUVqQyxVQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7S0FDaEM7Ozs7Ozs7Ozs7Ozs7V0FXTSxpQkFBQyxLQUFLLEVBQUUsU0FBUyxFQUFnQjtVQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDcEMsVUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixVQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM1QixVQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDdkMsVUFBSSxDQUFDLGlCQUFpQixHQUFHLE9BQU8sQ0FBQzs7QUFFakMsVUFBSSxPQUFPLENBQUMsY0FBYyxFQUFFO0FBQzFCLFlBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGVBQWUsWUFBVSxJQUFJLENBQUMsVUFBVSxNQUFHLENBQUM7QUFDbEUsWUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEdBQUcsU0FBUyxDQUFDO0FBQ3JELFlBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLGdCQUFnQixHQUFHLFdBQVcsQ0FBQztBQUNyRCxZQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO09BQ2xEOztBQUVELFVBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2hELFVBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUVoRCxTQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVqQyxVQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNoQixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7QUFFcEIsVUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDOUI7Ozs7Ozs7V0FLSyxrQkFBRzs7O0FBQ1AsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdELFVBQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7QUFDMUMsVUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQzs7O0FBRzVDLFVBQU0sS0FBSyxHQUFHLENBQUMsWUFBTTtBQUNuQixlQUFPLEFBQUMsTUFBSyxLQUFLLEdBQUcsTUFBSyxNQUFNLEdBQzlCLGNBQWMsR0FBRyxNQUFLLEtBQUssR0FDM0IsZUFBZSxHQUFHLE1BQUssTUFBTSxDQUFDO09BQ2pDLENBQUEsRUFBRyxDQUFDOztBQUVMLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztBQUVwQyxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsZ0JBQVEsR0FBRyxjQUFjLENBQUM7QUFDMUIsaUJBQVMsR0FBRyxlQUFlLENBQUM7T0FDN0I7O0FBRUQsVUFBTSxVQUFVLEdBQUcsQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQ25ELFVBQU0sU0FBUyxHQUFHLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQSxHQUFJLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNsRCxVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUVwRCxVQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxXQUFTLElBQUksQ0FBQyxLQUFLLFNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBRyxDQUFDOztBQUU5RSxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ3RDLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBTSxVQUFVLE9BQUksQ0FBQztBQUN6QyxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQU0sU0FBUyxPQUFJLENBQUM7OztBQUd2QyxVQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUU7QUFDcEMsZ0JBQVEsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVM7QUFDdEMsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pELGdCQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFFakQsZ0JBQU0sU0FBUyxHQUFHLHVCQUF1QixDQUFDO0FBQzFDLGdCQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3pELGtCQUFNO0FBQUEsU0FDVDtPQUNGOzs7Ozs7QUFNRCxVQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQzs7Ozs7O0FBTWhDLFVBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDOzs7Ozs7QUFNOUIsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7Ozs7OztBQU16QixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7S0FDckI7Ozs7Ozs7OztXQU9lLDBCQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUU7Ozs7QUFFaEMsVUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7O0FBRTFCLGVBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDOUIsZUFBSyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2xDLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDcEQsV0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLGNBQU0sSUFBSSxHQUFHLE9BQUssaUJBQWlCLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQUUsbUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQTtXQUFFLENBQUMsQ0FBQztBQUN6RSxjQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOzs7QUFHdEIsaUJBQU8sTUFBTSxLQUFLLE9BQUssVUFBVSxFQUFFO0FBQ2pDLGdCQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDL0IsbUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFLLGlCQUFpQixFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9DLG9CQUFNLEtBQUssR0FBRyxPQUFLLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hDLG9CQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ3hCLHNCQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO0FBQ2hDLHlCQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7aUJBQy9CO2VBQ0Y7YUFDRjs7QUFFRCxrQkFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7V0FDNUI7U0FDRixDQUFDLENBQUM7T0FDSjtLQUNGOzs7Ozs7Ozs7V0FPVSxxQkFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFO0FBQzFCLFVBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7QUFDeEIsVUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztBQUN6QyxVQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDOztBQUU3QixVQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCxTQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwRCxTQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1RCxTQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3RCxTQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7O0FBRTdCLFVBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLFVBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTWEsd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDN0I7Ozs7Ozs7V0FLaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUM3QixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2pEO0tBQ0Y7OztTQXRSa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NsaWVudC9TcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuLyoqXG4gKiBbY2xpZW50XSBSZW5kZXIgYSB7QGxpbmsgU2V0dXB9IGRhdGEgZ3JhcGhpY2FsbHkuXG4gKlxuICogVGhlIG1vZHVsZSBuZXZlciBoYXMgYSB2aWV3IChpdCBkaXNwbGF5cyB0aGUgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIGluIGEgYGRpdmAgcGFzc2VkIGluIGFzIGFuIGFyZ3VtZW50IG9mIHRoZSB7QGxpbmsgU3BhY2UjZGlzcGxheX0gbWV0aG9kKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2UgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3BhY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZml0Q29udGFpbmVyPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIGZpdHMgdGhlIGNvbnRhaW5lciBzaXplIG9yIG5vdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5saXN0ZW5Ub3VjaEV2ZW50PWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0byBzZXR1cCBhIGxpc3RlbmVyIG9uIHRoZSBzcGFjZSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8wqAnc3BhY2UnKTtcblxuICAgIC8qKlxuICAgICAqIFJlbGF0aXZlIHdpZHRoIG9mIHRoZSBzZXR1cC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSAxO1xuXG4gICAgLyoqXG4gICAgICogUmVsYXRpdmUgaGVpZ2h0IG9mIHRoZSBzZXR1cC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gMTtcblxuICAgIHRoaXMuX2ZpdENvbnRhaW5lciA9IChvcHRpb25zLmZpdENvbnRhaW5lciB8fMKgZmFsc2UpO1xuICAgIHRoaXMuX2xpc3RlblRvdWNoRXZlbnQgPSAob3B0aW9ucy5saXN0ZW5Ub3VjaEV2ZW50IHx8IGZhbHNlKTtcblxuICAgIC8vIHRoaXMuc3BhY2luZyA9IDE7XG4gICAgLy8gdGhpcy5sYWJlbHMgPSBbXTtcbiAgICAvLyB0aGlzLmNvb3JkaW5hdGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUeXBlIG9mIHRoZSBzZXR1cCAodmFsdWVzIGN1cnJlbnRseSBzdXBwb3J0ZWQ6IGAnbWF0cml4J2AsIGAnc3VyZmFjZSdgKS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEB0b2RvIFJlbW92ZT9cbiAgICAgKi9cbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBVUkwgb2YgdGhlIGJhY2tncm91bmQgaW1hZ2UgKGlmIGFueSkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmJhY2tncm91bmQgPSBudWxsO1xuXG4gICAgdGhpcy5feEZhY3RvciA9IDE7XG4gICAgdGhpcy5feUZhY3RvciA9IDE7XG5cbiAgICAvLyBtYXAgYmV0d2VlbiBzaGFwZXMgYW5kIHRoZWlyIHJlbGF0ZWQgcG9zaXRpb25zXG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcCA9IFtdO1xuICAgIHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcCA9IHt9O1xuICB9XG5cbiAgLy8gVE9ETyBub3RlIC0+IG1vZGZpeSBoZXJlXG4gIF9pbml0U2V0dXAoc2V0dXApIHtcbiAgICB0aGlzLndpZHRoID0gc2V0dXAud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBzZXR1cC5oZWlnaHQ7XG4gICAgLy8gdGhpcy5zcGFjaW5nID0gc2V0dXAuc3BhY2luZztcbiAgICAvLyB0aGlzLmxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICAvLyB0aGlzLmNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgdGhpcy50eXBlID0gc2V0dXAudHlwZTtcbiAgICB0aGlzLmJhY2tncm91bmQgPSBzZXR1cC5iYWNrZ3JvdW5kO1xuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gICAgLy8gY2xpZW50LnJlY2VpdmUoJ3NldHVwOmluaXQnLCB0aGlzLl9vblNldHVwSW5pdCk7XG4gICAgLy8gY2xpZW50LnNlbmQoJ3NldHVwOnJlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcCA9IFtdO1xuICAgIHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcCA9IHt9O1xuICAgIC8vIGNsaWVudC5yZW1vdmVMaXN0ZW5lcignc2V0dXA6aW5pdCcsIHRoaXMuX29uU2V0dXBJbml0KTtcbiAgICB0aGlzLl9jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheSBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEBwYXJhbSB7Q2xpZW50U2V0dXB9IHNldHVwIFNldHVwIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gY29udGFpbmVyIENvbnRhaW5lciB0byBhcHBlbmQgdGhlIHNldHVwIHJlcHJlc2VudGF0aW9uIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50cmFuc2Zvcm1dIEluZGljYXRlcyB3aGljaCB0cmFuc2Zvcm1hdGlvbiB0byBhcGx5IHRvIHRoZSByZXByZXNlbnRhdGlvbi4gUG9zc2libGUgdmFsdWVzIGFyZTpcbiAgICogLSBgJ3JvdGF0ZTE4MCdgOiByb3RhdGVzIHRoZSByZXByZXNlbnRhdGlvbiBieSAxODAgZGVncmVlcy5cbiAgICogQHRvZG8gQmlnIHByb2JsZW0gd2l0aCB0aGUgY29udGFpbmVyIChfY29udGFpbmVyIC0tPiBvbmx5IG9uZSBvZiB0aGVtLCB3aGlsZSB3ZSBzaG91bGQgYmUgYWJsZSB0byB1c2UgdGhlIGRpc3BsYXkgbWV0aG9kIG9uIHNldmVyYWwgY29udGFpbmVycylcbiAgICovXG4gIGRpc3BsYXkoc2V0dXAsIGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5faW5pdFNldHVwKHNldHVwKTtcbiAgICB0aGlzLl9jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5fY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NwYWNlJyk7XG4gICAgdGhpcy5fcmVuZGVyaW5nT3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucy5zaG93QmFja2dyb3VuZCkge1xuICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHt0aGlzLmJhY2tncm91bmR9KWA7XG4gICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb250YWluJztcbiAgICB9XG5cbiAgICBjb25zdCBzdmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdzdmcnKTtcbiAgICBjb25zdCBncm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2cnKTtcblxuICAgIHN2Zy5hcHBlbmRDaGlsZChncm91cCk7XG4gICAgdGhpcy5fY29udGFpbmVyLmFwcGVuZENoaWxkKHN2Zyk7XG5cbiAgICB0aGlzLl9zdmcgPSBzdmc7XG4gICAgdGhpcy5fZ3JvdXAgPSBncm91cDtcblxuICAgIHRoaXMucmVzaXplKHRoaXMuX2NvbnRhaW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUmVzaXplIHRoZSBTVkcgZWxlbWVudC5cbiAgICovXG4gIHJlc2l6ZSgpIHtcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLl9jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcbiAgICAvLyBmb3JjZSBhZGFwdGF0aW9uIHRvIGNvbnRhaW5lciBzaXplXG5cbiAgICBjb25zdCByYXRpbyA9ICgoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMud2lkdGggPiB0aGlzLmhlaWdodCkgP1xuICAgICAgICBjb250YWluZXJXaWR0aCAvIHRoaXMud2lkdGggOlxuICAgICAgICBjb250YWluZXJIZWlnaHQgLyB0aGlzLmhlaWdodDtcbiAgICB9KSgpO1xuXG4gICAgbGV0IHN2Z1dpZHRoID0gdGhpcy53aWR0aCAqIHJhdGlvO1xuICAgIGxldCBzdmdIZWlnaHQgPSB0aGlzLmhlaWdodCAqIHJhdGlvO1xuXG4gICAgaWYgKHRoaXMuX2ZpdENvbnRhaW5lcikge1xuICAgICAgc3ZnV2lkdGggPSBjb250YWluZXJXaWR0aDtcbiAgICAgIHN2Z0hlaWdodCA9IGNvbnRhaW5lckhlaWdodDtcbiAgICB9XG5cbiAgICBjb25zdCBvZmZzZXRMZWZ0ID0gKGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMjtcbiAgICBjb25zdCBvZmZzZXRUb3AgPSAoY29udGFpbmVySGVpZ2h0IC0gc3ZnSGVpZ2h0KSAvIDI7XG5cbiAgICB0aGlzLl9zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgc3ZnV2lkdGgpO1xuICAgIHRoaXMuX3N2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0Jywgc3ZnSGVpZ2h0KTtcbiAgICAgLy8gdXNlIHNldHVwIGNvb3JkaW5hdGVzXG4gICAgdGhpcy5fc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Qm94JywgYDAgMCAke3RoaXMud2lkdGh9ICR7dGhpcy5oZWlnaHR9YCk7XG4gICAgLy8gY2VudGVyIHN2ZyBpbiBjb250YWluZXJcbiAgICB0aGlzLl9zdmcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMuX3N2Zy5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0TGVmdH1weGA7XG4gICAgdGhpcy5fc3ZnLnN0eWxlLnRvcCA9IGAke29mZnNldFRvcH1weGA7XG5cbiAgICAvLyBhcHBseSByb3RhdGlvbnNcbiAgICBpZiAodGhpcy5fcmVuZGVyaW5nT3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgICAgIHN3aXRjaCAodGhpcy5fcmVuZGVyaW5nT3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgICAgICAgY2FzZSAncm90YXRlMTgwJzpcbiAgICAgICAgICB0aGlzLl9jb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXhmYWN0b3InLCAtMSk7XG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS15ZmFjdG9yJywgLTEpO1xuICAgICAgICAgIC8vIGNvbnN0IHRyYW5zZm9ybSA9IGByb3RhdGUoMTgwLCAke3N2Z1dpZHRoIC8gMn0sICR7c3ZnSGVpZ2h0IC8gMn0pYDtcbiAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSAncm90YXRlKDE4MCwgMC41LCAwLjUpJztcbiAgICAgICAgICB0aGlzLl9ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMZWZ0IG9mZnNldCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z09mZnNldExlZnQgPSBvZmZzZXRMZWZ0O1xuXG4gICAgLyoqXG4gICAgICogVG9wIG9mZnNldCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z09mZnNldFRvcCA9IG9mZnNldFRvcDtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnV2lkdGggPSBzdmdXaWR0aDtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z0hlaWdodCA9IHN2Z0hlaWdodDtcblxuICAgIHRoaXMuX3JhdGlvID0gcmF0aW87XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheSBhbiBhcnJheSBvZiBwb3NpdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IHBvc2l0aW9ucyBQb3NpdGlvbnMgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNpemUgU2l6ZSBvZiB0aGUgcG9zaXRpb25zIHRvIGRpc3BsYXkuXG4gICAqL1xuICBkaXNwbGF5UG9zaXRpb25zKHBvc2l0aW9ucywgc2l6ZSkge1xuICAgIC8vIGNsZWFuIHN1cmZhY2VcbiAgICB0aGlzLnJlbW92ZUFsbFBvc2l0aW9ucygpO1xuXG4gICAgcG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICB0aGlzLmFkZFBvc2l0aW9uKHBvc2l0aW9uLCBzaXplKTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBsaXN0ZW5lcnNcbiAgICBpZiAodGhpcy5fbGlzdGVuVG91Y2hFdmVudCkge1xuICAgICAgdGhpcy5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGRvdHMgPSB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwLm1hcCgoZW50cnkpID0+IHsgcmV0dXJuIGVudHJ5LmRvdCB9KTtcbiAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgICAgIC8vIENvdWxkIHByb2JhYmx5IGJlIHNpbXBsaWZpZWQuLi5cbiAgICAgICAgd2hpbGUgKHRhcmdldCAhPT0gdGhpcy5fY29udGFpbmVyKSB7XG4gICAgICAgICAgaWYgKGRvdHMuaW5kZXhPZih0YXJnZXQpICE9PSAtMSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwW2ldO1xuICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09PSBlbnRyeS5kb3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGVudHJ5LnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnc2VsZWN0JywgcG9zaXRpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcG9zaXRpb24gdG8gdGhlIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiBQb3NpdGlvbiB0byBhZGQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplIFNpemUgb2YgdGhlIHBvc2l0aW9uIHRvIGRyYXcuXG4gICAqL1xuICBhZGRQb3NpdGlvbihwb3NpdGlvbiwgc2l6ZSkge1xuICAgIGNvbnN0IHJhZGl1cyA9IHNpemUgLyAyO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gcG9zaXRpb24uY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcblxuICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHJhZGl1cyAvIHRoaXMuX3JhdGlvKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2N4JywgY29vcmRpbmF0ZXNbMF0gKiB0aGlzLndpZHRoKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2N5JywgY29vcmRpbmF0ZXNbMV0gKiB0aGlzLmhlaWdodCk7XG4gICAgZG90LnN0eWxlLmZpbGwgPSAnc3RlZWxibHVlJztcblxuICAgIHRoaXMuX2dyb3VwLmFwcGVuZENoaWxkKGRvdCk7XG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcC5wdXNoKHsgZG90LCBwb3NpdGlvbiB9KTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXBbaW5kZXhdID0gZG90O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBwb3NpdGlvbiBmcm9tIHRoZSBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gUG9zaXRpb24gdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcFtwb3NpdGlvbi5pbmRleF07XG4gICAgdGhpcy5fZ3JvdXAucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIHBvc2l0aW9ucyBkaXNwbGF5ZWQuXG4gICAqL1xuICByZW1vdmVBbGxQb3NpdGlvbnMoKSB7XG4gICAgd2hpbGUgKHRoaXMuX2dyb3VwLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuX2dyb3VwLnJlbW92ZUNoaWxkKHRoaXMuX2dyb3VwLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfVxufVxuIl19
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var ns = 'http://www.w3.org/2000/svg';

var client = require('./client');
var ClientModule = require('./ClientModule');
// import client from './client.es6.js';
// import ClientModule from './ClientModule.es6.js';

/**
 * The {@link ClientSpace} displays the setup upon request.
 */

var ClientSpace = (function (_ClientModule) {
  _inherits(ClientSpace, _ClientModule);

  // export default class ClientSpace extends ClientModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='space'] Name of the module.
   * @param {Boolean} [options.fitContainer=false] Indicates whether the graphical representation fits the container size or not.
   * @param {Boolean} [options.listenTouchEvent=false] Indicates whether to setup a listener on the space graphical representation or not.
   */

  function ClientSpace() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientSpace);

    _get(Object.getPrototypeOf(ClientSpace.prototype), 'constructor', this).call(this, options.name || 'space');

    /**
     * Relative width of the setup.
     * @type {Number}
     */
    this.width = 1;

    /**
     * Relative heigth of the setup.
     * @type {Number}
     */
    this.height = 1;

    this._fitContainer = options.fitContainer || false;
    this._listenTouchEvent = options.listenTouchEvent || false;

    // this.spacing = 1;
    // this.labels = [];
    // this.coordinates = [];
    this.type = undefined;

    this._xFactor = 1;
    this._yFactor = 1;

    // map between shapes and their related positions
    this.shapePositionMap = [];
    this.positionIndexShapeMap = {};
  }

  // TODO note -> modfiy here

  _createClass(ClientSpace, [{
    key: 'initSetup',
    value: function initSetup(setup) {
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
     * Starts the module.
     * @private
     */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientSpace.prototype), 'start', this).call(this);
      this.done();
      // client.receive('setup:init', this._onSetupInit);
      // client.send('setup:request');
    }

    /**
     * Restarts the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(ClientSpace.prototype), 'restart', this).call(this);
      this.done();
    }

    /**
     * Resets the module.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      this.shapePositionMap = [];
      this.positionIndexShapeMap = {};
      // client.removeListener('setup:init', this._onSetupInit);
      this.container.innerHTML = '';
    }

    /**
     * The `display` method displays a graphical representation of the setup.
     * @param {ClientSetup} setup Setup to display.
     * @param {DOMElement} container Container to append the setup representation to.
     * @param {Object} [options={}] Options.
     * @param {String} [options.transform] Indicates which transformation to aply to the representation. Possible values are:
     * - `'rotate180'`: rotates the representation by 180 degrees.
     */
  }, {
    key: 'display',
    value: function display(setup, container) {
      var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      this.initSetup(setup);
      this.container = container;
      this.container.classList.add('space');
      this.renderingOptions = options;

      if (options.showBackground) {
        this.container.style.backgroundImage = 'url(' + this.background + ')';
        this.container.style.backgroundPosition = '50% 50%';
        this.container.style.backgroundRepeat = 'no-repeat';
        this.container.style.backgroundSize = 'contain';
      }

      var svg = document.createElementNS(ns, 'svg');
      var group = document.createElementNS(ns, 'g');

      svg.appendChild(group);
      this.container.appendChild(svg);

      this.svg = svg;
      this.group = group;

      this._resize(this.container);
    }
  }, {
    key: '_resize',
    value: function _resize() {
      var _this = this;

      var boundingRect = this.container.getBoundingClientRect();
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

      this.svg.setAttributeNS(null, 'width', svgWidth);
      this.svg.setAttributeNS(null, 'height', svgHeight);
      // use setup coordinates
      this.svg.setAttributeNS(null, 'viewBox', '0 0 ' + this.width + ' ' + this.height);
      // center svg in container
      this.svg.style.position = 'absolute';
      this.svg.style.left = offsetLeft + 'px';
      this.svg.style.top = offsetTop + 'px';

      // apply rotations
      if (this.renderingOptions.transform) {
        switch (this.renderingOptions.transform) {
          case 'rotate180':
            this.container.setAttribute('data-xfactor', -1);
            this.container.setAttribute('data-yfactor', -1);
            var transform = 'rotate(180, ' + svgWidth / 2 + ', ' + svgHeight / 2 + ')';
            this.group.setAttributeNS(null, 'transform', transform);
            break;
        }
      }

      this.svgOffsetLeft = offsetLeft;
      this.svgOffsetTop = offsetTop;
      this.svgWidth = svgWidth;
      this.svgHeight = svgHeight;

      this.ratio = ratio;
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
        this.container.addEventListener('touchstart', function (e) {
          e.preventDefault();
          var dots = _this2.shapePositionMap.map(function (entry) {
            return entry.dot;
          });
          var target = e.target;

          // Could probably be simplified...
          while (target !== _this2.container) {
            if (dots.indexOf(target) !== -1) {
              for (var i = 0; i < _this2.shapePositionMap; i++) {
                var entry = _this2.shapePositionMap[i];
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
      dot.setAttributeNS(null, 'r', radius / this.ratio);
      dot.setAttributeNS(null, 'cx', coordinates[0] * this.width);
      dot.setAttributeNS(null, 'cy', coordinates[1] * this.height);
      dot.style.fill = 'steelblue';

      this.group.appendChild(dot);
      this.shapePositionMap.push({ dot: dot, position: position });
      this.positionIndexShapeMap[index] = dot;
    }

    /**
     * Removes a position from the display.
     * @param {Object} position Position to remove.
     */
  }, {
    key: 'removePosition',
    value: function removePosition(position) {
      var el = this.positionIndexShapeMap[position.index];
      this.group.removeChild(el);
    }

    /**
     * Remove all the positions displayed.
     */
  }, {
    key: 'removeAllPositions',
    value: function removeAllPositions() {
      while (this.group.firstChild) {
        this.group.removeChild(this.group.firstChild);
      }
    }
  }]);

  return ClientSpace;
})(ClientModule);

module.exports = ClientSpace;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQU0sRUFBRSxHQUFHLDRCQUE0QixDQUFDOztBQUV4QyxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbkMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7Ozs7O0lBT3pDLFdBQVc7WUFBWCxXQUFXOzs7Ozs7Ozs7OztBQVNKLFdBVFAsV0FBVyxHQVNXO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFUcEIsV0FBVzs7QUFVYiwrQkFWRSxXQUFXLDZDQVVQLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsYUFBYSxHQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSyxBQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGlCQUFpQixHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLEFBQUMsQ0FBQzs7Ozs7QUFLN0QsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDOzs7QUFHbEIsUUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUMzQixRQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDO0dBQ2pDOzs7O2VBdENHLFdBQVc7O1dBeUNOLG1CQUFDLEtBQUssRUFBRTtBQUNmLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztBQUN6QixVQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7Ozs7QUFJM0IsVUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ3ZCLFVBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7Ozs7Ozs7O1dBTUksaUJBQUc7QUFDTixpQ0ExREUsV0FBVyx1Q0EwREM7QUFDZCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7OztLQUdiOzs7Ozs7OztXQU1NLG1CQUFHO0FBQ1IsaUNBckVFLFdBQVcseUNBcUVHO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7Ozs7OztXQU1JLGlCQUFHO0FBQ04sVUFBSSxDQUFDLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztBQUMzQixVQUFJLENBQUMscUJBQXFCLEdBQUcsRUFBRSxDQUFDOztBQUVoQyxVQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7S0FDL0I7Ozs7Ozs7Ozs7OztXQVVNLGlCQUFDLEtBQUssRUFBRSxTQUFTLEVBQWdCO1VBQWQsT0FBTyx5REFBRyxFQUFFOztBQUNwQyxVQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN0QyxVQUFJLENBQUMsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDOztBQUVoQyxVQUFJLE9BQU8sQ0FBQyxjQUFjLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsZUFBZSxZQUFVLElBQUksQ0FBQyxVQUFVLE1BQUcsQ0FBQztBQUNqRSxZQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLENBQUM7QUFDcEQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEdBQUcsV0FBVyxDQUFDO0FBQ3BELFlBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7T0FDakQ7O0FBRUQsVUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEQsVUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7O0FBRWhELFNBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2YsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRW5CLFVBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzlCOzs7V0FFTSxtQkFBRzs7O0FBQ1IsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0FBQzVELFVBQU0sY0FBYyxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7QUFDMUMsVUFBTSxlQUFlLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQzs7O0FBRzVDLFVBQU0sS0FBSyxHQUFHLENBQUMsWUFBTTtBQUNuQixlQUFPLEFBQUMsTUFBSyxLQUFLLEdBQUcsTUFBSyxNQUFNLEdBQzlCLGNBQWMsR0FBRyxNQUFLLEtBQUssR0FDM0IsZUFBZSxHQUFHLE1BQUssTUFBTSxDQUFDO09BQ2pDLENBQUEsRUFBRyxDQUFDOztBQUVMLFVBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLFVBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztBQUVwQyxVQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7QUFDdEIsZ0JBQVEsR0FBRyxjQUFjLENBQUM7QUFDMUIsaUJBQVMsR0FBRyxlQUFlLENBQUM7T0FDN0I7O0FBRUQsVUFBTSxVQUFVLEdBQUcsQ0FBQyxjQUFjLEdBQUcsUUFBUSxDQUFBLEdBQUksQ0FBQyxDQUFDO0FBQ25ELFVBQU0sU0FBUyxHQUFHLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQSxHQUFJLENBQUMsQ0FBQzs7QUFFcEQsVUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDOztBQUVuRCxVQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxXQUFTLElBQUksQ0FBQyxLQUFLLFNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBRyxDQUFDOztBQUU3RSxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO0FBQ3JDLFVBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBTSxVQUFVLE9BQUksQ0FBQztBQUN4QyxVQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQU0sU0FBUyxPQUFJLENBQUM7OztBQUd0QyxVQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUU7QUFDbkMsZ0JBQVEsSUFBSSxDQUFDLGdCQUFnQixDQUFDLFNBQVM7QUFDckMsZUFBSyxXQUFXO0FBQ2QsZ0JBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hELGdCQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNoRCxnQkFBTSxTQUFTLG9CQUFrQixRQUFRLEdBQUcsQ0FBQyxVQUFLLFNBQVMsR0FBRyxDQUFDLE1BQUcsQ0FBQztBQUNuRSxnQkFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUN4RCxrQkFBTTtBQUFBLFNBQ1Q7T0FDRjs7QUFFRCxVQUFJLENBQUMsYUFBYSxHQUFHLFVBQVUsQ0FBQztBQUNoQyxVQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztBQUM5QixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzs7QUFFM0IsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDcEI7Ozs7Ozs7OztXQU9lLDBCQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUU7Ozs7QUFFaEMsVUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQUM7O0FBRTFCLGVBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRLEVBQUs7QUFDOUIsZUFBSyxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2xDLENBQUMsQ0FBQzs7O0FBR0gsVUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7QUFDMUIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsVUFBQyxDQUFDLEVBQUs7QUFDbkQsV0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ25CLGNBQU0sSUFBSSxHQUFHLE9BQUssZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFVBQUMsS0FBSyxFQUFLO0FBQUUsbUJBQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQTtXQUFFLENBQUMsQ0FBQztBQUN4RSxjQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDOzs7QUFHdEIsaUJBQU8sTUFBTSxLQUFLLE9BQUssU0FBUyxFQUFFO0FBQ2hDLGdCQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDL0IsbUJBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFLLGdCQUFnQixFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLG9CQUFNLEtBQUssR0FBRyxPQUFLLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLG9CQUFJLE1BQU0sS0FBSyxLQUFLLENBQUMsR0FBRyxFQUFFO0FBQ3hCLHNCQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO0FBQ2hDLHlCQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7aUJBQy9CO2VBQ0Y7YUFDRjs7QUFFRCxrQkFBTSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7V0FDNUI7U0FDRixDQUFDLENBQUM7T0FDSjtLQUNGOzs7Ozs7Ozs7V0FPVSxxQkFBQyxRQUFRLEVBQUUsSUFBSSxFQUFFO0FBQzFCLFVBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7QUFDeEIsVUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQztBQUN6QyxVQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDOztBQUU3QixVQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNuRCxTQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNuRCxTQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM1RCxTQUFHLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3RCxTQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxXQUFXLENBQUM7O0FBRTdCLFVBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUgsR0FBRyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQzlDLFVBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7S0FDekM7Ozs7Ozs7O1dBTWEsd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQU0sRUFBRSxHQUFHLElBQUksQ0FBRSxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDNUI7Ozs7Ozs7V0FLaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRTtBQUM1QixZQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQy9DO0tBQ0Y7OztTQXBQRyxXQUFXO0dBQVMsWUFBWTs7QUF1UHRDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDIiwiZmlsZSI6InNyYy9jbGllbnQvU3BhY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBucyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG5cbmNvbnN0IGNsaWVudCA9IHJlcXVpcmUoJy4vY2xpZW50Jyk7XG5jb25zdCBDbGllbnRNb2R1bGUgPSByZXF1aXJlKCcuL0NsaWVudE1vZHVsZScpO1xuLy8gaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudC5lczYuanMnO1xuLy8gaW1wb3J0IENsaWVudE1vZHVsZSBmcm9tICcuL0NsaWVudE1vZHVsZS5lczYuanMnO1xuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50U3BhY2V9IGRpc3BsYXlzIHRoZSBzZXR1cCB1cG9uIHJlcXVlc3QuXG4gKi9cbmNsYXNzIENsaWVudFNwYWNlIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbi8vIGV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFNwYWNlIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzcGFjZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maXRDb250YWluZXI9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gZml0cyB0aGUgY29udGFpbmVyIHNpemUgb3Igbm90LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmxpc3RlblRvdWNoRXZlbnQ9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIHNldHVwIGEgbGlzdGVuZXIgb24gdGhlIHNwYWNlIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdzcGFjZScpO1xuXG4gICAgLyoqXG4gICAgICogUmVsYXRpdmUgd2lkdGggb2YgdGhlIHNldHVwLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBSZWxhdGl2ZSBoZWlndGggb2YgdGhlIHNldHVwLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSAxO1xuXG4gICAgdGhpcy5fZml0Q29udGFpbmVyID0gKG9wdGlvbnMuZml0Q29udGFpbmVyIHx8wqBmYWxzZSk7XG4gICAgdGhpcy5fbGlzdGVuVG91Y2hFdmVudCA9IChvcHRpb25zLmxpc3RlblRvdWNoRXZlbnQgfHwgZmFsc2UpO1xuXG4gICAgLy8gdGhpcy5zcGFjaW5nID0gMTtcbiAgICAvLyB0aGlzLmxhYmVscyA9IFtdO1xuICAgIC8vIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLl94RmFjdG9yID0gMTtcbiAgICB0aGlzLl95RmFjdG9yID0gMTtcblxuICAgIC8vIG1hcCBiZXR3ZWVuIHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRlZCBwb3NpdGlvbnNcbiAgICB0aGlzLnNoYXBlUG9zaXRpb25NYXAgPSBbXTtcbiAgICB0aGlzLnBvc2l0aW9uSW5kZXhTaGFwZU1hcCA9IHt9O1xuICB9XG5cbiAgLy8gVE9ETyBub3RlIC0+IG1vZGZpeSBoZXJlXG4gIGluaXRTZXR1cChzZXR1cCkge1xuICAgIHRoaXMud2lkdGggPSBzZXR1cC53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IHNldHVwLmhlaWdodDtcbiAgICAvLyB0aGlzLnNwYWNpbmcgPSBzZXR1cC5zcGFjaW5nO1xuICAgIC8vIHRoaXMubGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIC8vIHRoaXMuY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcbiAgICB0aGlzLnR5cGUgPSBzZXR1cC50eXBlO1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IHNldHVwLmJhY2tncm91bmQ7XG5cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gICAgLy8gY2xpZW50LnJlY2VpdmUoJ3NldHVwOmluaXQnLCB0aGlzLl9vblNldHVwSW5pdCk7XG4gICAgLy8gY2xpZW50LnNlbmQoJ3NldHVwOnJlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLnNoYXBlUG9zaXRpb25NYXAgPSBbXTtcbiAgICB0aGlzLnBvc2l0aW9uSW5kZXhTaGFwZU1hcCA9IHt9O1xuICAgIC8vIGNsaWVudC5yZW1vdmVMaXN0ZW5lcignc2V0dXA6aW5pdCcsIHRoaXMuX29uU2V0dXBJbml0KTtcbiAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYGRpc3BsYXlgIG1ldGhvZCBkaXNwbGF5cyBhIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgc2V0dXAuXG4gICAqIEBwYXJhbSB7Q2xpZW50U2V0dXB9IHNldHVwIFNldHVwIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7RE9NRWxlbWVudH0gY29udGFpbmVyIENvbnRhaW5lciB0byBhcHBlbmQgdGhlIHNldHVwIHJlcHJlc2VudGF0aW9uIHRvLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy50cmFuc2Zvcm1dIEluZGljYXRlcyB3aGljaCB0cmFuc2Zvcm1hdGlvbiB0byBhcGx5IHRvIHRoZSByZXByZXNlbnRhdGlvbi4gUG9zc2libGUgdmFsdWVzIGFyZTpcbiAgICogLSBgJ3JvdGF0ZTE4MCdgOiByb3RhdGVzIHRoZSByZXByZXNlbnRhdGlvbiBieSAxODAgZGVncmVlcy5cbiAgICovXG4gIGRpc3BsYXkoc2V0dXAsIGNvbnRhaW5lciwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5pbml0U2V0dXAoc2V0dXApO1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NwYWNlJyk7XG4gICAgdGhpcy5yZW5kZXJpbmdPcHRpb25zID0gb3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zLnNob3dCYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7dGhpcy5iYWNrZ3JvdW5kfSlgO1xuICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbic7XG4gICAgfVxuXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHN2Zyk7XG5cbiAgICB0aGlzLnN2ZyA9IHN2ZztcbiAgICB0aGlzLmdyb3VwID0gZ3JvdXA7XG5cbiAgICB0aGlzLl9yZXNpemUodGhpcy5jb250YWluZXIpO1xuICB9XG5cbiAgX3Jlc2l6ZSgpIHtcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuICAgIC8vIGZvcmNlIGFkYXB0YXRpb24gdG8gY29udGFpbmVyIHNpemVcblxuICAgIGNvbnN0IHJhdGlvID0gKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy53aWR0aCA+IHRoaXMuaGVpZ2h0KSA/XG4gICAgICAgIGNvbnRhaW5lcldpZHRoIC8gdGhpcy53aWR0aCA6XG4gICAgICAgIGNvbnRhaW5lckhlaWdodCAvIHRoaXMuaGVpZ2h0O1xuICAgIH0pKCk7XG5cbiAgICBsZXQgc3ZnV2lkdGggPSB0aGlzLndpZHRoICogcmF0aW87XG4gICAgbGV0IHN2Z0hlaWdodCA9IHRoaXMuaGVpZ2h0ICogcmF0aW87XG5cbiAgICBpZiAodGhpcy5fZml0Q29udGFpbmVyKSB7XG4gICAgICBzdmdXaWR0aCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgc3ZnSGVpZ2h0ID0gY29udGFpbmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGNvbnN0IG9mZnNldExlZnQgPSAoY29udGFpbmVyV2lkdGggLSBzdmdXaWR0aCkgLyAyO1xuICAgIGNvbnN0IG9mZnNldFRvcCA9IChjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMjtcblxuICAgIHRoaXMuc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLnN2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0Jywgc3ZnSGVpZ2h0KTtcbiAgICAgLy8gdXNlIHNldHVwIGNvb3JkaW5hdGVzXG4gICAgdGhpcy5zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdCb3gnLCBgMCAwICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcbiAgICAvLyBjZW50ZXIgc3ZnIGluIGNvbnRhaW5lclxuICAgIHRoaXMuc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLnN2Zy5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0TGVmdH1weGA7XG4gICAgdGhpcy5zdmcuc3R5bGUudG9wID0gYCR7b2Zmc2V0VG9wfXB4YDtcblxuICAgIC8vIGFwcGx5IHJvdGF0aW9uc1xuICAgIGlmICh0aGlzLnJlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMucmVuZGVyaW5nT3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgICAgICAgY2FzZSAncm90YXRlMTgwJzpcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEteGZhY3RvcicsIC0xKTtcbiAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEteWZhY3RvcicsIC0xKTtcbiAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBgcm90YXRlKDE4MCwgJHtzdmdXaWR0aCAvIDJ9LCAke3N2Z0hlaWdodCAvIDJ9KWA7XG4gICAgICAgICAgdGhpcy5ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnN2Z09mZnNldExlZnQgPSBvZmZzZXRMZWZ0O1xuICAgIHRoaXMuc3ZnT2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuICAgIHRoaXMuc3ZnV2lkdGggPSBzdmdXaWR0aDtcbiAgICB0aGlzLnN2Z0hlaWdodCA9IHN2Z0hlaWdodDtcblxuICAgIHRoaXMucmF0aW8gPSByYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IGFuIGFycmF5IG9mIHBvc2l0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3RbXX0gcG9zaXRpb25zIFBvc2l0aW9ucyB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSBTaXplIG9mIHRoZSBwb3NpdGlvbnMgdG8gZGlzcGxheS5cbiAgICovXG4gIGRpc3BsYXlQb3NpdGlvbnMocG9zaXRpb25zLCBzaXplKSB7XG4gICAgLy8gY2xlYW4gc3VyZmFjZVxuICAgIHRoaXMucmVtb3ZlQWxsUG9zaXRpb25zKCk7XG5cbiAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIHRoaXMuYWRkUG9zaXRpb24ocG9zaXRpb24sIHNpemUpO1xuICAgIH0pO1xuXG4gICAgLy8gYWRkIGxpc3RlbmVyc1xuICAgIGlmICh0aGlzLl9saXN0ZW5Ub3VjaEV2ZW50KSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBkb3RzID0gdGhpcy5zaGFwZVBvc2l0aW9uTWFwLm1hcCgoZW50cnkpID0+IHsgcmV0dXJuIGVudHJ5LmRvdCB9KTtcbiAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgICAgIC8vIENvdWxkIHByb2JhYmx5IGJlIHNpbXBsaWZpZWQuLi5cbiAgICAgICAgd2hpbGUgKHRhcmdldCAhPT0gdGhpcy5jb250YWluZXIpIHtcbiAgICAgICAgICBpZiAoZG90cy5pbmRleE9mKHRhcmdldCkgIT09IC0xKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVQb3NpdGlvbk1hcDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5zaGFwZVBvc2l0aW9uTWFwW2ldO1xuICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09PSBlbnRyeS5kb3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGVudHJ5LnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnc2VsZWN0JywgcG9zaXRpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcG9zaXRpb24gdG8gdGhlIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiBQb3NpdGlvbiB0byBhZGQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplIFNpemUgb2YgdGhlIHBvc2l0aW9uIHRvIGRyYXcuXG4gICAqL1xuICBhZGRQb3NpdGlvbihwb3NpdGlvbiwgc2l6ZSkge1xuICAgIGNvbnN0IHJhZGl1cyA9IHNpemUgLyAyO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gcG9zaXRpb24uY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcblxuICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHJhZGl1cyAvIHRoaXMucmF0aW8pO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY3gnLCBjb29yZGluYXRlc1swXSAqIHRoaXMud2lkdGgpO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY3knLCBjb29yZGluYXRlc1sxXSAqIHRoaXMuaGVpZ2h0KTtcbiAgICBkb3Quc3R5bGUuZmlsbCA9ICdzdGVlbGJsdWUnO1xuXG4gICAgdGhpcy5ncm91cC5hcHBlbmRDaGlsZChkb3QpO1xuICAgIHRoaXMuc2hhcGVQb3NpdGlvbk1hcC5wdXNoKHsgZG90LCBwb3NpdGlvbiB9KTtcbiAgICB0aGlzLnBvc2l0aW9uSW5kZXhTaGFwZU1hcFtpbmRleF0gPSBkb3Q7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHBvc2l0aW9uIGZyb20gdGhlIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiBQb3NpdGlvbiB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGNvbnN0IGVsID0gdGhpcy4gcG9zaXRpb25JbmRleFNoYXBlTWFwW3Bvc2l0aW9uLmluZGV4XTtcbiAgICB0aGlzLmdyb3VwLnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBwb3NpdGlvbnMgZGlzcGxheWVkLlxuICAgKi9cbiAgcmVtb3ZlQWxsUG9zaXRpb25zKCkge1xuICAgIHdoaWxlICh0aGlzLmdyb3VwLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuZ3JvdXAucmVtb3ZlQ2hpbGQodGhpcy5ncm91cC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRTcGFjZTtcbiJdfQ==
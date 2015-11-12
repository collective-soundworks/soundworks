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
 * The {@link Space} displays the setup upon request.
 */

var Space = (function (_Module) {
  _inherits(Space, _Module);

  /**
   * Creates an instance of the class.
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
     * Starts the module.
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
     * Restarts the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Space.prototype), 'restart', this).call(this);
      this.done();
    }

    /**
     * Resets the module.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      this._shapePositionMap = [];
      this._positionIndexShapeMap = {};
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

      this._initSetup(setup);
      this.container = container;
      this.container.classList.add('space');
      this._renderingOptions = options;

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

      this._svg = svg;
      this._group = group;

      this.resize(this.container);
    }

    /**
     * Resize the SVG element.
     */
  }, {
    key: 'resize',
    value: function resize() {
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
            this.container.setAttribute('data-xfactor', -1);
            this.container.setAttribute('data-yfactor', -1);
            var transform = 'rotate(180, ' + svgWidth / 2 + ', ' + svgHeight / 2 + ')';
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
        this.container.addEventListener('touchstart', function (e) {
          e.preventDefault();
          var dots = _this2._shapePositionMap.map(function (entry) {
            return entry.dot;
          });
          var target = e.target;

          // Could probably be simplified...
          while (target !== _this2.container) {
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
      var el = this.positionIndexShapeMap[position.index];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0FBRTdCLElBQU0sRUFBRSxHQUFHLDRCQUE0QixDQUFDOzs7Ozs7SUFNbkIsS0FBSztZQUFMLEtBQUs7Ozs7Ozs7Ozs7QUFRYixXQVJRLEtBQUssR0FRRTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUkwsS0FBSzs7QUFTdEIsK0JBVGlCLEtBQUssNkNBU2hCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsYUFBYSxHQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSyxBQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGlCQUFpQixHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLEFBQUMsQ0FBQzs7Ozs7Ozs7Ozs7QUFXN0QsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7OztBQUdsQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7Ozs7ZUFqRGtCLEtBQUs7O1dBb0RkLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDekIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOzs7O0FBSTNCLFVBQUksQ0FBQyxJQUFJLEdB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LEVBQUgsR0FBRyxFQUFFLFFBQVEsRUFBUixRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTWEsd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQU0sRUFBRSxHQUFHLElBQUksQ0FBRSxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDN0I7Ozs7Ozs7V0FLaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUM3QixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2pEO0tBQ0Y7OztTQXJSa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NsaWVudC9TcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgU3BhY2V9IGRpc3BsYXlzIHRoZSBzZXR1cCB1cG9uIHJlcXVlc3QuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYWNlIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzcGFjZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maXRDb250YWluZXI9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gZml0cyB0aGUgY29udGFpbmVyIHNpemUgb3Igbm90LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmxpc3RlblRvdWNoRXZlbnQ9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIHNldHVwIGEgbGlzdGVuZXIgb24gdGhlIHNwYWNlIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdzcGFjZScpO1xuXG4gICAgLyoqXG4gICAgICogUmVsYXRpdmUgd2lkdGggb2YgdGhlIHNldHVwLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBSZWxhdGl2ZSBoZWlnaHQgb2YgdGhlIHNldHVwLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSAxO1xuXG4gICAgdGhpcy5fZml0Q29udGFpbmVyID0gKG9wdGlvbnMuZml0Q29udGFpbmVyIHx8wqBmYWxzZSk7XG4gICAgdGhpcy5fbGlzdGVuVG91Y2hFdmVudCA9IChvcHRpb25zLmxpc3RlblRvdWNoRXZlbnQgfHwgZmFsc2UpO1xuXG4gICAgLy8gdGhpcy5zcGFjaW5nID0gMTtcbiAgICAvLyB0aGlzLmxhYmVscyA9IFtdO1xuICAgIC8vIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFR5cGUgb2YgdGhlIHNldHVwICh2YWx1ZXMgY3VycmVudGx5IHN1cHBvcnRlZDogYCdtYXRyaXgnYCwgYCdzdXJmYWNlJ2ApLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQHRvZG8gUmVtb3ZlP1xuICAgICAqL1xuICAgIHRoaXMudHlwZSA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFVSTCBvZiB0aGUgYmFja2dyb3VuZCBpbWFnZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IG51bGw7XG5cbiAgICB0aGlzLl94RmFjdG9yID0gMTtcbiAgICB0aGlzLl95RmFjdG9yID0gMTtcblxuICAgIC8vIG1hcCBiZXR3ZWVuIHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRlZCBwb3NpdGlvbnNcbiAgICB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwID0gW107XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwID0ge307XG4gIH1cblxuICAvLyBUT0RPIG5vdGUgLT4gbW9kZml5IGhlcmVcbiAgX2luaXRTZXR1cChzZXR1cCkge1xuICAgIHRoaXMud2lkdGggPSBzZXR1cC53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IHNldHVwLmhlaWdodDtcbiAgICAvLyB0aGlzLnNwYWNpbmcgPSBzZXR1cC5zcGFjaW5nO1xuICAgIC8vIHRoaXMubGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIC8vIHRoaXMuY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcbiAgICB0aGlzLnR5cGUgPSBzZXR1cC50eXBlO1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IHNldHVwLmJhY2tncm91bmQ7XG5cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gICAgLy8gY2xpZW50LnJlY2VpdmUoJ3NldHVwOmluaXQnLCB0aGlzLl9vblNldHVwSW5pdCk7XG4gICAgLy8gY2xpZW50LnNlbmQoJ3NldHVwOnJlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwID0gW107XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwID0ge307XG4gICAgLy8gY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdzZXR1cDppbml0JywgdGhpcy5fb25TZXR1cEluaXQpO1xuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBgZGlzcGxheWAgbWV0aG9kIGRpc3BsYXlzIGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtDbGllbnRTZXR1cH0gc2V0dXAgU2V0dXAgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBjb250YWluZXIgQ29udGFpbmVyIHRvIGFwcGVuZCB0aGUgc2V0dXAgcmVwcmVzZW50YXRpb24gdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRyYW5zZm9ybV0gSW5kaWNhdGVzIHdoaWNoIHRyYW5zZm9ybWF0aW9uIHRvIGFwbHkgdG8gdGhlIHJlcHJlc2VudGF0aW9uLiBQb3NzaWJsZSB2YWx1ZXMgYXJlOlxuICAgKiAtIGAncm90YXRlMTgwJ2A6IHJvdGF0ZXMgdGhlIHJlcHJlc2VudGF0aW9uIGJ5IDE4MCBkZWdyZWVzLlxuICAgKi9cbiAgZGlzcGxheShzZXR1cCwgY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9pbml0U2V0dXAoc2V0dXApO1xuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3NwYWNlJyk7XG4gICAgdGhpcy5fcmVuZGVyaW5nT3B0aW9ucyA9IG9wdGlvbnM7XG5cbiAgICBpZiAob3B0aW9ucy5zaG93QmFja2dyb3VuZCkge1xuICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3RoaXMuYmFja2dyb3VuZH0pYDtcbiAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuICAgIH1cblxuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGdyb3VwKTtcbiAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgdGhpcy5fc3ZnID0gc3ZnO1xuICAgIHRoaXMuX2dyb3VwID0gZ3JvdXA7XG5cbiAgICB0aGlzLnJlc2l6ZSh0aGlzLmNvbnRhaW5lcik7XG4gIH1cblxuICAvKipcbiAgICogUmVzaXplIHRoZSBTVkcgZWxlbWVudC5cbiAgICovXG4gIHJlc2l6ZSgpIHtcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLmNvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuICAgIC8vIGZvcmNlIGFkYXB0YXRpb24gdG8gY29udGFpbmVyIHNpemVcblxuICAgIGNvbnN0IHJhdGlvID0gKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy53aWR0aCA+IHRoaXMuaGVpZ2h0KSA/XG4gICAgICAgIGNvbnRhaW5lcldpZHRoIC8gdGhpcy53aWR0aCA6XG4gICAgICAgIGNvbnRhaW5lckhlaWdodCAvIHRoaXMuaGVpZ2h0O1xuICAgIH0pKCk7XG5cbiAgICBsZXQgc3ZnV2lkdGggPSB0aGlzLndpZHRoICogcmF0aW87XG4gICAgbGV0IHN2Z0hlaWdodCA9IHRoaXMuaGVpZ2h0ICogcmF0aW87XG5cbiAgICBpZiAodGhpcy5fZml0Q29udGFpbmVyKSB7XG4gICAgICBzdmdXaWR0aCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgc3ZnSGVpZ2h0ID0gY29udGFpbmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGNvbnN0IG9mZnNldExlZnQgPSAoY29udGFpbmVyV2lkdGggLSBzdmdXaWR0aCkgLyAyO1xuICAgIGNvbnN0IG9mZnNldFRvcCA9IChjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMjtcblxuICAgIHRoaXMuX3N2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBzdmdXaWR0aCk7XG4gICAgdGhpcy5fc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgICAvLyB1c2Ugc2V0dXAgY29vcmRpbmF0ZXNcbiAgICB0aGlzLl9zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdCb3gnLCBgMCAwICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcbiAgICAvLyBjZW50ZXIgc3ZnIGluIGNvbnRhaW5lclxuICAgIHRoaXMuX3N2Zy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy5fc3ZnLnN0eWxlLmxlZnQgPSBgJHtvZmZzZXRMZWZ0fXB4YDtcbiAgICB0aGlzLl9zdmcuc3R5bGUudG9wID0gYCR7b2Zmc2V0VG9wfXB4YDtcblxuICAgIC8vIGFwcGx5IHJvdGF0aW9uc1xuICAgIGlmICh0aGlzLl9yZW5kZXJpbmdPcHRpb25zLnRyYW5zZm9ybSkge1xuICAgICAgc3dpdGNoICh0aGlzLl9yZW5kZXJpbmdPcHRpb25zLnRyYW5zZm9ybSkge1xuICAgICAgICBjYXNlICdyb3RhdGUxODAnOlxuICAgICAgICAgIHRoaXMuY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS14ZmFjdG9yJywgLTEpO1xuICAgICAgICAgIHRoaXMuY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS15ZmFjdG9yJywgLTEpO1xuICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IGByb3RhdGUoMTgwLCAke3N2Z1dpZHRoIC8gMn0sICR7c3ZnSGVpZ2h0IC8gMn0pYDtcbiAgICAgICAgICB0aGlzLl9ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMZWZ0IG9mZnNldCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z09mZnNldExlZnQgPSBvZmZzZXRMZWZ0O1xuXG4gICAgLyoqXG4gICAgICogVG9wIG9mZnNldCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z09mZnNldFRvcCA9IG9mZnNldFRvcDtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnV2lkdGggPSBzdmdXaWR0aDtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z0hlaWdodCA9IHN2Z0hlaWdodDtcblxuICAgIHRoaXMuX3JhdGlvID0gcmF0aW87XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheSBhbiBhcnJheSBvZiBwb3NpdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IHBvc2l0aW9ucyBQb3NpdGlvbnMgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNpemUgU2l6ZSBvZiB0aGUgcG9zaXRpb25zIHRvIGRpc3BsYXkuXG4gICAqL1xuICBkaXNwbGF5UG9zaXRpb25zKHBvc2l0aW9ucywgc2l6ZSkge1xuICAgIC8vIGNsZWFuIHN1cmZhY2VcbiAgICB0aGlzLnJlbW92ZUFsbFBvc2l0aW9ucygpO1xuXG4gICAgcG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICB0aGlzLmFkZFBvc2l0aW9uKHBvc2l0aW9uLCBzaXplKTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBsaXN0ZW5lcnNcbiAgICBpZiAodGhpcy5fbGlzdGVuVG91Y2hFdmVudCkge1xuICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZG90cyA9IHRoaXMuX3NoYXBlUG9zaXRpb25NYXAubWFwKChlbnRyeSkgPT4geyByZXR1cm4gZW50cnkuZG90IH0pO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgLy8gQ291bGQgcHJvYmFibHkgYmUgc2ltcGxpZmllZC4uLlxuICAgICAgICB3aGlsZSAodGFyZ2V0ICE9PSB0aGlzLmNvbnRhaW5lcikge1xuICAgICAgICAgIGlmIChkb3RzLmluZGV4T2YodGFyZ2V0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fc2hhcGVQb3NpdGlvbk1hcFtpXTtcbiAgICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gZW50cnkuZG90KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBlbnRyeS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3NlbGVjdCcsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvc2l0aW9uIHRvIHRoZSBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gUG9zaXRpb24gdG8gYWRkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSBTaXplIG9mIHRoZSBwb3NpdGlvbiB0byBkcmF3LlxuICAgKi9cbiAgYWRkUG9zaXRpb24ocG9zaXRpb24sIHNpemUpIHtcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gMjtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIGNvbnN0IGluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG5cbiAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdjaXJjbGUnKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCByYWRpdXMgLyB0aGlzLl9yYXRpbyk7XG4gICAgZG90LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeCcsIGNvb3JkaW5hdGVzWzBdICogdGhpcy53aWR0aCk7XG4gICAgZG90LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeScsIGNvb3JkaW5hdGVzWzFdICogdGhpcy5oZWlnaHQpO1xuICAgIGRvdC5zdHlsZS5maWxsID0gJ3N0ZWVsYmx1ZSc7XG5cbiAgICB0aGlzLl9ncm91cC5hcHBlbmRDaGlsZChkb3QpO1xuICAgIHRoaXMuX3NoYXBlUG9zaXRpb25NYXAucHVzaCh7IGRvdCwgcG9zaXRpb24gfSk7XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwW2luZGV4XSA9IGRvdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgcG9zaXRpb24gZnJvbSB0aGUgZGlzcGxheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIFBvc2l0aW9uIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLiBwb3NpdGlvbkluZGV4U2hhcGVNYXBbcG9zaXRpb24uaW5kZXhdO1xuICAgIHRoaXMuX2dyb3VwLnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBwb3NpdGlvbnMgZGlzcGxheWVkLlxuICAgKi9cbiAgcmVtb3ZlQWxsUG9zaXRpb25zKCkge1xuICAgIHdoaWxlICh0aGlzLl9ncm91cC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLl9ncm91cC5yZW1vdmVDaGlsZCh0aGlzLl9ncm91cC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
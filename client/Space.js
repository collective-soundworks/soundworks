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
 *
 * @example const setup = new Setup();
 * const space = new Space();
 * const container = document.getElementById('#spaceContainer');
 *
 * space.display(setup, container);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0FBRTdCLElBQU0sRUFBRSxHQUFHLDRCQUE0QixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0lBZW5CLEtBQUs7WUFBTCxLQUFLOzs7Ozs7Ozs7QUFPYixXQVBRLEtBQUssR0FPRTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUEwsS0FBSzs7QUFRdEIsK0JBUmlCLEtBQUssNkNBUWhCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsYUFBYSxHQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSyxBQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGlCQUFpQixHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLEFBQUMsQ0FBQzs7Ozs7Ozs7Ozs7QUFXN0QsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7OztBQUdsQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7Ozs7ZUFoRGtCLEtBQUs7O1dBbURkLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDekIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOzs7O0FBSTNCLFVBQUksQ0FB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UixRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTWEsd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDN0I7Ozs7Ozs7V0FLaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUM3QixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2pEO0tBQ0Y7OztTQXRSa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NsaWVudC9TcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuLyoqXG4gKiBbY2xpZW50XSBSZW5kZXIgYSB7QGxpbmsgU2V0dXB9IGRhdGEgZ3JhcGhpY2FsbHkuXG4gKlxuICogVGhlIG1vZHVsZSBuZXZlciBoYXMgYSB2aWV3IChpdCBkaXNwbGF5cyB0aGUgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIGluIGEgYGRpdmAgcGFzc2VkIGluIGFzIGFuIGFyZ3VtZW50IG9mIHRoZSB7QGxpbmsgU3BhY2UjZGlzcGxheX0gbWV0aG9kKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGZpbmlzaGVzIGl0cyBpbml0aWFsaXphdGlvbiBpbW1lZGlhdGVseS5cbiAqXG4gKiBAZXhhbXBsZSBjb25zdCBzZXR1cCA9IG5ldyBTZXR1cCgpO1xuICogY29uc3Qgc3BhY2UgPSBuZXcgU3BhY2UoKTtcbiAqIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcjc3BhY2VDb250YWluZXInKTtcbiAqXG4gKiBzcGFjZS5kaXNwbGF5KHNldHVwLCBjb250YWluZXIpO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGFjZSBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzcGFjZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maXRDb250YWluZXI9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gZml0cyB0aGUgY29udGFpbmVyIHNpemUgb3Igbm90LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmxpc3RlblRvdWNoRXZlbnQ9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIHNldHVwIGEgbGlzdGVuZXIgb24gdGhlIHNwYWNlIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdzcGFjZScpO1xuXG4gICAgLyoqXG4gICAgICogUmVsYXRpdmUgd2lkdGggb2YgdGhlIHNldHVwLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBSZWxhdGl2ZSBoZWlnaHQgb2YgdGhlIHNldHVwLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSAxO1xuXG4gICAgdGhpcy5fZml0Q29udGFpbmVyID0gKG9wdGlvbnMuZml0Q29udGFpbmVyIHx8wqBmYWxzZSk7XG4gICAgdGhpcy5fbGlzdGVuVG91Y2hFdmVudCA9IChvcHRpb25zLmxpc3RlblRvdWNoRXZlbnQgfHwgZmFsc2UpO1xuXG4gICAgLy8gdGhpcy5zcGFjaW5nID0gMTtcbiAgICAvLyB0aGlzLmxhYmVscyA9IFtdO1xuICAgIC8vIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFR5cGUgb2YgdGhlIHNldHVwICh2YWx1ZXMgY3VycmVudGx5IHN1cHBvcnRlZDogYCdtYXRyaXgnYCwgYCdzdXJmYWNlJ2ApLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQHRvZG8gUmVtb3ZlP1xuICAgICAqL1xuICAgIHRoaXMudHlwZSA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFVSTCBvZiB0aGUgYmFja2dyb3VuZCBpbWFnZSAoaWYgYW55KS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IG51bGw7XG5cbiAgICB0aGlzLl94RmFjdG9yID0gMTtcbiAgICB0aGlzLl95RmFjdG9yID0gMTtcblxuICAgIC8vIG1hcCBiZXR3ZWVuIHNoYXBlcyBhbmQgdGhlaXIgcmVsYXRlZCBwb3NpdGlvbnNcbiAgICB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwID0gW107XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwID0ge307XG4gIH1cblxuICAvLyBUT0RPIG5vdGUgLT4gbW9kZml5IGhlcmVcbiAgX2luaXRTZXR1cChzZXR1cCkge1xuICAgIHRoaXMud2lkdGggPSBzZXR1cC53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IHNldHVwLmhlaWdodDtcbiAgICAvLyB0aGlzLnNwYWNpbmcgPSBzZXR1cC5zcGFjaW5nO1xuICAgIC8vIHRoaXMubGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIC8vIHRoaXMuY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcbiAgICB0aGlzLnR5cGUgPSBzZXR1cC50eXBlO1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IHNldHVwLmJhY2tncm91bmQ7XG5cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgICAvLyBjbGllbnQucmVjZWl2ZSgnc2V0dXA6aW5pdCcsIHRoaXMuX29uU2V0dXBJbml0KTtcbiAgICAvLyBjbGllbnQuc2VuZCgnc2V0dXA6cmVxdWVzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwID0gW107XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwID0ge307XG4gICAgLy8gY2xpZW50LnJlbW92ZUxpc3RlbmVyKCdzZXR1cDppbml0JywgdGhpcy5fb25TZXR1cEluaXQpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5pbm5lckhUTUwgPSAnJztcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IGEgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtDbGllbnRTZXR1cH0gc2V0dXAgU2V0dXAgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtET01FbGVtZW50fSBjb250YWluZXIgQ29udGFpbmVyIHRvIGFwcGVuZCB0aGUgc2V0dXAgcmVwcmVzZW50YXRpb24gdG8uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRyYW5zZm9ybV0gSW5kaWNhdGVzIHdoaWNoIHRyYW5zZm9ybWF0aW9uIHRvIGFwbHkgdG8gdGhlIHJlcHJlc2VudGF0aW9uLiBQb3NzaWJsZSB2YWx1ZXMgYXJlOlxuICAgKiAtIGAncm90YXRlMTgwJ2A6IHJvdGF0ZXMgdGhlIHJlcHJlc2VudGF0aW9uIGJ5IDE4MCBkZWdyZWVzLlxuICAgKiBAdG9kbyBCaWcgcHJvYmxlbSB3aXRoIHRoZSBjb250YWluZXIgKF9jb250YWluZXIgLS0+IG9ubHkgb25lIG9mIHRoZW0sIHdoaWxlIHdlIHNob3VsZCBiZSBhYmxlIHRvIHVzZSB0aGUgZGlzcGxheSBtZXRob2Qgb24gc2V2ZXJhbCBjb250YWluZXJzKVxuICAgKi9cbiAgZGlzcGxheShzZXR1cCwgY29udGFpbmVyLCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLl9pbml0U2V0dXAoc2V0dXApO1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLl9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3BhY2UnKTtcbiAgICB0aGlzLl9yZW5kZXJpbmdPcHRpb25zID0gb3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zLnNob3dCYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3RoaXMuYmFja2dyb3VuZH0pYDtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuICAgIH1cblxuICAgIGNvbnN0IHN2ZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ3N2ZycpO1xuICAgIGNvbnN0IGdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnZycpO1xuXG4gICAgc3ZnLmFwcGVuZENoaWxkKGdyb3VwKTtcbiAgICB0aGlzLl9jb250YWluZXIuYXBwZW5kQ2hpbGQoc3ZnKTtcblxuICAgIHRoaXMuX3N2ZyA9IHN2ZztcbiAgICB0aGlzLl9ncm91cCA9IGdyb3VwO1xuXG4gICAgdGhpcy5yZXNpemUodGhpcy5fY29udGFpbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNpemUgdGhlIFNWRyBlbGVtZW50LlxuICAgKi9cbiAgcmVzaXplKCkge1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuX2NvbnRhaW5lci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBjb250YWluZXJXaWR0aCA9IGJvdW5kaW5nUmVjdC53aWR0aDtcbiAgICBjb25zdCBjb250YWluZXJIZWlnaHQgPSBib3VuZGluZ1JlY3QuaGVpZ2h0O1xuICAgIC8vIGZvcmNlIGFkYXB0YXRpb24gdG8gY29udGFpbmVyIHNpemVcblxuICAgIGNvbnN0IHJhdGlvID0gKCgpID0+IHtcbiAgICAgIHJldHVybiAodGhpcy53aWR0aCA+IHRoaXMuaGVpZ2h0KSA/XG4gICAgICAgIGNvbnRhaW5lcldpZHRoIC8gdGhpcy53aWR0aCA6XG4gICAgICAgIGNvbnRhaW5lckhlaWdodCAvIHRoaXMuaGVpZ2h0O1xuICAgIH0pKCk7XG5cbiAgICBsZXQgc3ZnV2lkdGggPSB0aGlzLndpZHRoICogcmF0aW87XG4gICAgbGV0IHN2Z0hlaWdodCA9IHRoaXMuaGVpZ2h0ICogcmF0aW87XG5cbiAgICBpZiAodGhpcy5fZml0Q29udGFpbmVyKSB7XG4gICAgICBzdmdXaWR0aCA9IGNvbnRhaW5lcldpZHRoO1xuICAgICAgc3ZnSGVpZ2h0ID0gY29udGFpbmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGNvbnN0IG9mZnNldExlZnQgPSAoY29udGFpbmVyV2lkdGggLSBzdmdXaWR0aCkgLyAyO1xuICAgIGNvbnN0IG9mZnNldFRvcCA9IChjb250YWluZXJIZWlnaHQgLSBzdmdIZWlnaHQpIC8gMjtcblxuICAgIHRoaXMuX3N2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnd2lkdGgnLCBzdmdXaWR0aCk7XG4gICAgdGhpcy5fc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICdoZWlnaHQnLCBzdmdIZWlnaHQpO1xuICAgICAvLyB1c2Ugc2V0dXAgY29vcmRpbmF0ZXNcbiAgICB0aGlzLl9zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3ZpZXdCb3gnLCBgMCAwICR7dGhpcy53aWR0aH0gJHt0aGlzLmhlaWdodH1gKTtcbiAgICAvLyBjZW50ZXIgc3ZnIGluIGNvbnRhaW5lclxuICAgIHRoaXMuX3N2Zy5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgdGhpcy5fc3ZnLnN0eWxlLmxlZnQgPSBgJHtvZmZzZXRMZWZ0fXB4YDtcbiAgICB0aGlzLl9zdmcuc3R5bGUudG9wID0gYCR7b2Zmc2V0VG9wfXB4YDtcblxuICAgIC8vIGFwcGx5IHJvdGF0aW9uc1xuICAgIGlmICh0aGlzLl9yZW5kZXJpbmdPcHRpb25zLnRyYW5zZm9ybSkge1xuICAgICAgc3dpdGNoICh0aGlzLl9yZW5kZXJpbmdPcHRpb25zLnRyYW5zZm9ybSkge1xuICAgICAgICBjYXNlICdyb3RhdGUxODAnOlxuICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEteGZhY3RvcicsIC0xKTtcbiAgICAgICAgICB0aGlzLl9jb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXlmYWN0b3InLCAtMSk7XG4gICAgICAgICAgLy8gY29uc3QgdHJhbnNmb3JtID0gYHJvdGF0ZSgxODAsICR7c3ZnV2lkdGggLyAyfSwgJHtzdmdIZWlnaHQgLyAyfSlgO1xuICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9ICdyb3RhdGUoMTgwLCAwLjUsIDAuNSknO1xuICAgICAgICAgIHRoaXMuX2dyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExlZnQgb2Zmc2V0IG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnT2Zmc2V0TGVmdCA9IG9mZnNldExlZnQ7XG5cbiAgICAvKipcbiAgICAgKiBUb3Agb2Zmc2V0IG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnT2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuXG4gICAgLyoqXG4gICAgICogV2lkdGggb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdXaWR0aCA9IHN2Z1dpZHRoO1xuXG4gICAgLyoqXG4gICAgICogSGVpZ2h0IG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnSGVpZ2h0ID0gc3ZnSGVpZ2h0O1xuXG4gICAgdGhpcy5fcmF0aW8gPSByYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IGFuIGFycmF5IG9mIHBvc2l0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3RbXX0gcG9zaXRpb25zIFBvc2l0aW9ucyB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSBTaXplIG9mIHRoZSBwb3NpdGlvbnMgdG8gZGlzcGxheS5cbiAgICovXG4gIGRpc3BsYXlQb3NpdGlvbnMocG9zaXRpb25zLCBzaXplKSB7XG4gICAgLy8gY2xlYW4gc3VyZmFjZVxuICAgIHRoaXMucmVtb3ZlQWxsUG9zaXRpb25zKCk7XG5cbiAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIHRoaXMuYWRkUG9zaXRpb24ocG9zaXRpb24sIHNpemUpO1xuICAgIH0pO1xuXG4gICAgLy8gYWRkIGxpc3RlbmVyc1xuICAgIGlmICh0aGlzLl9saXN0ZW5Ub3VjaEV2ZW50KSB7XG4gICAgICB0aGlzLl9jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIChlKSA9PiB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgZG90cyA9IHRoaXMuX3NoYXBlUG9zaXRpb25NYXAubWFwKChlbnRyeSkgPT4geyByZXR1cm4gZW50cnkuZG90IH0pO1xuICAgICAgICBsZXQgdGFyZ2V0ID0gZS50YXJnZXQ7XG5cbiAgICAgICAgLy8gQ291bGQgcHJvYmFibHkgYmUgc2ltcGxpZmllZC4uLlxuICAgICAgICB3aGlsZSAodGFyZ2V0ICE9PSB0aGlzLl9jb250YWluZXIpIHtcbiAgICAgICAgICBpZiAoZG90cy5pbmRleE9mKHRhcmdldCkgIT09IC0xKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3NoYXBlUG9zaXRpb25NYXA7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCBlbnRyeSA9IHRoaXMuX3NoYXBlUG9zaXRpb25NYXBbaV07XG4gICAgICAgICAgICAgIGlmICh0YXJnZXQgPT09IGVudHJ5LmRvdCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gZW50cnkucG9zaXRpb247XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KCdzZWxlY3QnLCBwb3NpdGlvbik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwb3NpdGlvbiB0byB0aGUgZGlzcGxheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIFBvc2l0aW9uIHRvIGFkZC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNpemUgU2l6ZSBvZiB0aGUgcG9zaXRpb24gdG8gZHJhdy5cbiAgICovXG4gIGFkZFBvc2l0aW9uKHBvc2l0aW9uLCBzaXplKSB7XG4gICAgY29uc3QgcmFkaXVzID0gc2l6ZSAvIDI7XG4gICAgY29uc3QgY29vcmRpbmF0ZXMgPSBwb3NpdGlvbi5jb29yZGluYXRlcztcbiAgICBjb25zdCBpbmRleCA9IHBvc2l0aW9uLmluZGV4O1xuXG4gICAgY29uc3QgZG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnY2lyY2xlJyk7XG4gICAgZG90LnNldEF0dHJpYnV0ZU5TKG51bGwsICdyJywgcmFkaXVzIC8gdGhpcy5fcmF0aW8pO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY3gnLCBjb29yZGluYXRlc1swXSAqIHRoaXMud2lkdGgpO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnY3knLCBjb29yZGluYXRlc1sxXSAqIHRoaXMuaGVpZ2h0KTtcbiAgICBkb3Quc3R5bGUuZmlsbCA9ICdzdGVlbGJsdWUnO1xuXG4gICAgdGhpcy5fZ3JvdXAuYXBwZW5kQ2hpbGQoZG90KTtcbiAgICB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwLnB1c2goeyBkb3QsIHBvc2l0aW9uIH0pO1xuICAgIHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcFtpbmRleF0gPSBkb3Q7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHBvc2l0aW9uIGZyb20gdGhlIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiBQb3NpdGlvbiB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVQb3NpdGlvbihwb3NpdGlvbikge1xuICAgIGNvbnN0IGVsID0gdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwW3Bvc2l0aW9uLmluZGV4XTtcbiAgICB0aGlzLl9ncm91cC5yZW1vdmVDaGlsZChlbCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCB0aGUgcG9zaXRpb25zIGRpc3BsYXllZC5cbiAgICovXG4gIHJlbW92ZUFsbFBvc2l0aW9ucygpIHtcbiAgICB3aGlsZSAodGhpcy5fZ3JvdXAuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy5fZ3JvdXAucmVtb3ZlQ2hpbGQodGhpcy5fZ3JvdXAuZmlyc3RDaGlsZCk7XG4gICAgfVxuICB9XG59XG4iXX0=
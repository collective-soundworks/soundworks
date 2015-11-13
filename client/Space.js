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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0FBRTdCLElBQU0sRUFBRSxHQUFHLDRCQUE0QixDQUFDOzs7Ozs7SUFNbkIsS0FBSztZQUFMLEtBQUs7Ozs7Ozs7Ozs7QUFRYixXQVJRLEtBQUssR0FRRTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUkwsS0FBSzs7QUFTdEIsK0JBVGlCLEtBQUssNkNBU2hCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsYUFBYSxHQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSyxBQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGlCQUFpQixHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLEFBQUMsQ0FBQzs7Ozs7Ozs7Ozs7QUFXN0QsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7OztBQUdsQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7Ozs7ZUFqRGtCLEtBQUs7O1dBb0RkLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDekIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOzs7O0FBSTNCLFVBQUksQ0FBQyxJQUFJLEdB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RSxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUMxQzs7Ozs7Ozs7V0FNYSx3QkFBQyxRQUFRLEVBQUU7QUFDdkIsVUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2RCxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM3Qjs7Ozs7OztXQUtpQiw4QkFBRztBQUNuQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQzdCLFlBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDakQ7S0FDRjs7O1NBdFJrQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJzcmMvY2xpZW50L1NwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuY29uc3QgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBTcGFjZX0gZGlzcGxheXMgdGhlIHNldHVwIHVwb24gcmVxdWVzdC5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2UgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3NwYWNlJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmZpdENvbnRhaW5lcj1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBmaXRzIHRoZSBjb250YWluZXIgc2l6ZSBvciBub3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubGlzdGVuVG91Y2hFdmVudD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gc2V0dXAgYSBsaXN0ZW5lciBvbiB0aGUgc3BhY2UgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3NwYWNlJyk7XG5cbiAgICAvKipcbiAgICAgKiBSZWxhdGl2ZSB3aWR0aCBvZiB0aGUgc2V0dXAuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gMTtcblxuICAgIC8qKlxuICAgICAqIFJlbGF0aXZlIGhlaWdodCBvZiB0aGUgc2V0dXAuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IDE7XG5cbiAgICB0aGlzLl9maXRDb250YWluZXIgPSAob3B0aW9ucy5maXRDb250YWluZXIgfHzCoGZhbHNlKTtcbiAgICB0aGlzLl9saXN0ZW5Ub3VjaEV2ZW50ID0gKG9wdGlvbnMubGlzdGVuVG91Y2hFdmVudCB8fCBmYWxzZSk7XG5cbiAgICAvLyB0aGlzLnNwYWNpbmcgPSAxO1xuICAgIC8vIHRoaXMubGFiZWxzID0gW107XG4gICAgLy8gdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogVHlwZSBvZiB0aGUgc2V0dXAgKHZhbHVlcyBjdXJyZW50bHkgc3VwcG9ydGVkOiBgJ21hdHJpeCdgLCBgJ3N1cmZhY2UnYCkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAdG9kbyBSZW1vdmU/XG4gICAgICovXG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVVJMIG9mIHRoZSBiYWNrZ3JvdW5kIGltYWdlIChpZiBhbnkpLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gbnVsbDtcblxuICAgIHRoaXMuX3hGYWN0b3IgPSAxO1xuICAgIHRoaXMuX3lGYWN0b3IgPSAxO1xuXG4gICAgLy8gbWFwIGJldHdlZW4gc2hhcGVzIGFuZCB0aGVpciByZWxhdGVkIHBvc2l0aW9uc1xuICAgIHRoaXMuX3NoYXBlUG9zaXRpb25NYXAgPSBbXTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXAgPSB7fTtcbiAgfVxuXG4gIC8vIFRPRE8gbm90ZSAtPiBtb2RmaXkgaGVyZVxuICBfaW5pdFNldHVwKHNldHVwKSB7XG4gICAgdGhpcy53aWR0aCA9IHNldHVwLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gc2V0dXAuaGVpZ2h0O1xuICAgIC8vIHRoaXMuc3BhY2luZyA9IHNldHVwLnNwYWNpbmc7XG4gICAgLy8gdGhpcy5sYWJlbHMgPSBzZXR1cC5sYWJlbHM7XG4gICAgLy8gdGhpcy5jb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuICAgIHRoaXMudHlwZSA9IHNldHVwLnR5cGU7XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gc2V0dXAuYmFja2dyb3VuZDtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgICAvLyBjbGllbnQucmVjZWl2ZSgnc2V0dXA6aW5pdCcsIHRoaXMuX29uU2V0dXBJbml0KTtcbiAgICAvLyBjbGllbnQuc2VuZCgnc2V0dXA6cmVxdWVzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX3NoYXBlUG9zaXRpb25NYXAgPSBbXTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXAgPSB7fTtcbiAgICAvLyBjbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3NldHVwOmluaXQnLCB0aGlzLl9vblNldHVwSW5pdCk7XG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGBkaXNwbGF5YCBtZXRob2QgZGlzcGxheXMgYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge0NsaWVudFNldHVwfSBzZXR1cCBTZXR1cCB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBDb250YWluZXIgdG8gYXBwZW5kIHRoZSBzZXR1cCByZXByZXNlbnRhdGlvbiB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudHJhbnNmb3JtXSBJbmRpY2F0ZXMgd2hpY2ggdHJhbnNmb3JtYXRpb24gdG8gYXBseSB0byB0aGUgcmVwcmVzZW50YXRpb24uIFBvc3NpYmxlIHZhbHVlcyBhcmU6XG4gICAqIC0gYCdyb3RhdGUxODAnYDogcm90YXRlcyB0aGUgcmVwcmVzZW50YXRpb24gYnkgMTgwIGRlZ3JlZXMuXG4gICAqL1xuICBkaXNwbGF5KHNldHVwLCBjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2luaXRTZXR1cChzZXR1cCk7XG4gICAgdGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG4gICAgdGhpcy5jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3BhY2UnKTtcbiAgICB0aGlzLl9yZW5kZXJpbmdPcHRpb25zID0gb3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zLnNob3dCYWNrZ3JvdW5kKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7dGhpcy5iYWNrZ3JvdW5kfSlgO1xuICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbic7XG4gICAgfVxuXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHN2Zyk7XG5cbiAgICB0aGlzLl9zdmcgPSBzdmc7XG4gICAgdGhpcy5fZ3JvdXAgPSBncm91cDtcblxuICAgIHRoaXMucmVzaXplKHRoaXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNpemUgdGhlIFNWRyBlbGVtZW50LlxuICAgKi9cbiAgcmVzaXplKCkge1xuICAgIGNvbnN0IGJvdW5kaW5nUmVjdCA9IHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG4gICAgLy8gZm9yY2UgYWRhcHRhdGlvbiB0byBjb250YWluZXIgc2l6ZVxuXG4gICAgY29uc3QgcmF0aW8gPSAoKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQpID9cbiAgICAgICAgY29udGFpbmVyV2lkdGggLyB0aGlzLndpZHRoIDpcbiAgICAgICAgY29udGFpbmVySGVpZ2h0IC8gdGhpcy5oZWlnaHQ7XG4gICAgfSkoKTtcblxuICAgIGxldCBzdmdXaWR0aCA9IHRoaXMud2lkdGggKiByYXRpbztcbiAgICBsZXQgc3ZnSGVpZ2h0ID0gdGhpcy5oZWlnaHQgKiByYXRpbztcblxuICAgIGlmICh0aGlzLl9maXRDb250YWluZXIpIHtcbiAgICAgIHN2Z1dpZHRoID0gY29udGFpbmVyV2lkdGg7XG4gICAgICBzdmdIZWlnaHQgPSBjb250YWluZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb2Zmc2V0TGVmdCA9IChjb250YWluZXJXaWR0aCAtIHN2Z1dpZHRoKSAvIDI7XG4gICAgY29uc3Qgb2Zmc2V0VG9wID0gKGNvbnRhaW5lckhlaWdodCAtIHN2Z0hlaWdodCkgLyAyO1xuXG4gICAgdGhpcy5fc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLl9zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgIC8vIHVzZSBzZXR1cCBjb29yZGluYXRlc1xuICAgIHRoaXMuX3N2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld0JveCcsIGAwIDAgJHt0aGlzLndpZHRofSAke3RoaXMuaGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciBzdmcgaW4gY29udGFpbmVyXG4gICAgdGhpcy5fc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLl9zdmcuc3R5bGUubGVmdCA9IGAke29mZnNldExlZnR9cHhgO1xuICAgIHRoaXMuX3N2Zy5zdHlsZS50b3AgPSBgJHtvZmZzZXRUb3B9cHhgO1xuXG4gICAgLy8gYXBwbHkgcm90YXRpb25zXG4gICAgaWYgKHRoaXMuX3JlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuX3JlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICAgIGNhc2UgJ3JvdGF0ZTE4MCc6XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXhmYWN0b3InLCAtMSk7XG4gICAgICAgICAgdGhpcy5jb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXlmYWN0b3InLCAtMSk7XG4gICAgICAgICAgLy8gY29uc3QgdHJhbnNmb3JtID0gYHJvdGF0ZSgxODAsICR7c3ZnV2lkdGggLyAyfSwgJHtzdmdIZWlnaHQgLyAyfSlgO1xuICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9ICdyb3RhdGUoMTgwLCAwLjUsIDAuNSknO1xuICAgICAgICAgIHRoaXMuX2dyb3VwLnNldEF0dHJpYnV0ZU5TKG51bGwsICd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExlZnQgb2Zmc2V0IG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnT2Zmc2V0TGVmdCA9IG9mZnNldExlZnQ7XG5cbiAgICAvKipcbiAgICAgKiBUb3Agb2Zmc2V0IG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnT2Zmc2V0VG9wID0gb2Zmc2V0VG9wO1xuXG4gICAgLyoqXG4gICAgICogV2lkdGggb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdXaWR0aCA9IHN2Z1dpZHRoO1xuXG4gICAgLyoqXG4gICAgICogSGVpZ2h0IG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnSGVpZ2h0ID0gc3ZnSGVpZ2h0O1xuXG4gICAgdGhpcy5fcmF0aW8gPSByYXRpbztcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5IGFuIGFycmF5IG9mIHBvc2l0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3RbXX0gcG9zaXRpb25zIFBvc2l0aW9ucyB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSBTaXplIG9mIHRoZSBwb3NpdGlvbnMgdG8gZGlzcGxheS5cbiAgICovXG4gIGRpc3BsYXlQb3NpdGlvbnMocG9zaXRpb25zLCBzaXplKSB7XG4gICAgLy8gY2xlYW4gc3VyZmFjZVxuICAgIHRoaXMucmVtb3ZlQWxsUG9zaXRpb25zKCk7XG5cbiAgICBwb3NpdGlvbnMuZm9yRWFjaCgocG9zaXRpb24pID0+IHtcbiAgICAgIHRoaXMuYWRkUG9zaXRpb24ocG9zaXRpb24sIHNpemUpO1xuICAgIH0pO1xuXG4gICAgLy8gYWRkIGxpc3RlbmVyc1xuICAgIGlmICh0aGlzLl9saXN0ZW5Ub3VjaEV2ZW50KSB7XG4gICAgICB0aGlzLmNvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBkb3RzID0gdGhpcy5fc2hhcGVQb3NpdGlvbk1hcC5tYXAoKGVudHJ5KSA9PiB7IHJldHVybiBlbnRyeS5kb3QgfSk7XG4gICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgICAgICAvLyBDb3VsZCBwcm9iYWJseSBiZSBzaW1wbGlmaWVkLi4uXG4gICAgICAgIHdoaWxlICh0YXJnZXQgIT09IHRoaXMuY29udGFpbmVyKSB7XG4gICAgICAgICAgaWYgKGRvdHMuaW5kZXhPZih0YXJnZXQpICE9PSAtMSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwW2ldO1xuICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09PSBlbnRyeS5kb3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGVudHJ5LnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnc2VsZWN0JywgcG9zaXRpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcG9zaXRpb24gdG8gdGhlIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiBQb3NpdGlvbiB0byBhZGQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplIFNpemUgb2YgdGhlIHBvc2l0aW9uIHRvIGRyYXcuXG4gICAqL1xuICBhZGRQb3NpdGlvbihwb3NpdGlvbiwgc2l6ZSkge1xuICAgIGNvbnN0IHJhZGl1cyA9IHNpemUgLyAyO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gcG9zaXRpb24uY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcblxuICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHJhZGl1cyAvIHRoaXMuX3JhdGlvKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2N4JywgY29vcmRpbmF0ZXNbMF0gKiB0aGlzLndpZHRoKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2N5JywgY29vcmRpbmF0ZXNbMV0gKiB0aGlzLmhlaWdodCk7XG4gICAgZG90LnN0eWxlLmZpbGwgPSAnc3RlZWxibHVlJztcblxuICAgIHRoaXMuX2dyb3VwLmFwcGVuZENoaWxkKGRvdCk7XG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcC5wdXNoKHsgZG90LCBwb3NpdGlvbiB9KTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXBbaW5kZXhdID0gZG90O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBwb3NpdGlvbiBmcm9tIHRoZSBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gUG9zaXRpb24gdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUG9zaXRpb24ocG9zaXRpb24pIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcFtwb3NpdGlvbi5pbmRleF07XG4gICAgdGhpcy5fZ3JvdXAucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIHBvc2l0aW9ucyBkaXNwbGF5ZWQuXG4gICAqL1xuICByZW1vdmVBbGxQb3NpdGlvbnMoKSB7XG4gICAgd2hpbGUgKHRoaXMuX2dyb3VwLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuX2dyb3VwLnJlbW92ZUNoaWxkKHRoaXMuX2dyb3VwLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfVxufVxuIl19
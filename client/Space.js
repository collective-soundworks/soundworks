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
})(_ClientModule3['default']);

exports['default'] = Space;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFSLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQztLQUMxQzs7Ozs7Ozs7V0FNYSx3QkFBQyxRQUFRLEVBQUU7QUFDdkIsVUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2RCxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUM3Qjs7Ozs7OztXQUtpQiw4QkFBRztBQUNuQixhQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFO0FBQzdCLFlBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDakQ7S0FDRjs7O1NBdFJrQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJzcmMvY2xpZW50L1NwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuY29uc3QgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG4vKipcbiAqIFtjbGllbnRdIFJlbmRlciBhIHtAbGluayBTZXR1cH0gZGF0YSBncmFwaGljYWxseS5cbiAqXG4gKiBUaGUgbW9kdWxlIG5ldmVyIGhhcyBhIHZpZXcgKGl0IGRpc3BsYXlzIHRoZSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gaW4gYSBgZGl2YCBwYXNzZWQgaW4gYXMgYW4gYXJndW1lbnQgb2YgdGhlIHtAbGluayBTcGFjZSNkaXNwbGF5fSBtZXRob2QpLlxuICpcbiAqIFRoZSBtb2R1bGUgZmluaXNoZXMgaXRzIGluaXRpYWxpemF0aW9uIGltbWVkaWF0ZWx5LlxuICpcbiAqIEBleGFtcGxlIGNvbnN0IHNldHVwID0gbmV3IFNldHVwKCk7XG4gKiBjb25zdCBzcGFjZSA9IG5ldyBTcGFjZSgpO1xuICogY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJyNzcGFjZUNvbnRhaW5lcicpO1xuICpcbiAqIHNwYWNlLmRpc3BsYXkoc2V0dXAsIGNvbnRhaW5lcik7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwYWNlIGV4dGVuZHMgQ2xpZW50TW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3NwYWNlJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmZpdENvbnRhaW5lcj1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBmaXRzIHRoZSBjb250YWluZXIgc2l6ZSBvciBub3QuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMubGlzdGVuVG91Y2hFdmVudD1mYWxzZV0gSW5kaWNhdGVzIHdoZXRoZXIgdG8gc2V0dXAgYSBsaXN0ZW5lciBvbiB0aGUgc3BhY2UgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIG9yIG5vdC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fMKgJ3NwYWNlJyk7XG5cbiAgICAvKipcbiAgICAgKiBSZWxhdGl2ZSB3aWR0aCBvZiB0aGUgc2V0dXAuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gMTtcblxuICAgIC8qKlxuICAgICAqIFJlbGF0aXZlIGhlaWdodCBvZiB0aGUgc2V0dXAuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IDE7XG5cbiAgICB0aGlzLl9maXRDb250YWluZXIgPSAob3B0aW9ucy5maXRDb250YWluZXIgfHzCoGZhbHNlKTtcbiAgICB0aGlzLl9saXN0ZW5Ub3VjaEV2ZW50ID0gKG9wdGlvbnMubGlzdGVuVG91Y2hFdmVudCB8fCBmYWxzZSk7XG5cbiAgICAvLyB0aGlzLnNwYWNpbmcgPSAxO1xuICAgIC8vIHRoaXMubGFiZWxzID0gW107XG4gICAgLy8gdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogVHlwZSBvZiB0aGUgc2V0dXAgKHZhbHVlcyBjdXJyZW50bHkgc3VwcG9ydGVkOiBgJ21hdHJpeCdgLCBgJ3N1cmZhY2UnYCkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAdG9kbyBSZW1vdmU/XG4gICAgICovXG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVVJMIG9mIHRoZSBiYWNrZ3JvdW5kIGltYWdlIChpZiBhbnkpLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gbnVsbDtcblxuICAgIHRoaXMuX3hGYWN0b3IgPSAxO1xuICAgIHRoaXMuX3lGYWN0b3IgPSAxO1xuXG4gICAgLy8gbWFwIGJldHdlZW4gc2hhcGVzIGFuZCB0aGVpciByZWxhdGVkIHBvc2l0aW9uc1xuICAgIHRoaXMuX3NoYXBlUG9zaXRpb25NYXAgPSBbXTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXAgPSB7fTtcbiAgfVxuXG4gIC8vIFRPRE8gbm90ZSAtPiBtb2RmaXkgaGVyZVxuICBfaW5pdFNldHVwKHNldHVwKSB7XG4gICAgdGhpcy53aWR0aCA9IHNldHVwLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gc2V0dXAuaGVpZ2h0O1xuICAgIC8vIHRoaXMuc3BhY2luZyA9IHNldHVwLnNwYWNpbmc7XG4gICAgLy8gdGhpcy5sYWJlbHMgPSBzZXR1cC5sYWJlbHM7XG4gICAgLy8gdGhpcy5jb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuICAgIHRoaXMudHlwZSA9IHNldHVwLnR5cGU7XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gc2V0dXAuYmFja2dyb3VuZDtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICAgIC8vIGNsaWVudC5yZWNlaXZlKCdzZXR1cDppbml0JywgdGhpcy5fb25TZXR1cEluaXQpO1xuICAgIC8vIGNsaWVudC5zZW5kKCdzZXR1cDpyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydCB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX3NoYXBlUG9zaXRpb25NYXAgPSBbXTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXAgPSB7fTtcbiAgICAvLyBjbGllbnQucmVtb3ZlTGlzdGVuZXIoJ3NldHVwOmluaXQnLCB0aGlzLl9vblNldHVwSW5pdCk7XG4gICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge0NsaWVudFNldHVwfSBzZXR1cCBTZXR1cCB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBDb250YWluZXIgdG8gYXBwZW5kIHRoZSBzZXR1cCByZXByZXNlbnRhdGlvbiB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudHJhbnNmb3JtXSBJbmRpY2F0ZXMgd2hpY2ggdHJhbnNmb3JtYXRpb24gdG8gYXBseSB0byB0aGUgcmVwcmVzZW50YXRpb24uIFBvc3NpYmxlIHZhbHVlcyBhcmU6XG4gICAqIC0gYCdyb3RhdGUxODAnYDogcm90YXRlcyB0aGUgcmVwcmVzZW50YXRpb24gYnkgMTgwIGRlZ3JlZXMuXG4gICAqIEB0b2RvIEJpZyBwcm9ibGVtIHdpdGggdGhlIGNvbnRhaW5lciAoX2NvbnRhaW5lciAtLT4gb25seSBvbmUgb2YgdGhlbSwgd2hpbGUgd2Ugc2hvdWxkIGJlIGFibGUgdG8gdXNlIHRoZSBkaXNwbGF5IG1ldGhvZCBvbiBzZXZlcmFsIGNvbnRhaW5lcnMpXG4gICAqL1xuICBkaXNwbGF5KHNldHVwLCBjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2luaXRTZXR1cChzZXR1cCk7XG4gICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcGFjZScpO1xuICAgIHRoaXMuX3JlbmRlcmluZ09wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMuc2hvd0JhY2tncm91bmQpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7dGhpcy5iYWNrZ3JvdW5kfSlgO1xuICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbic7XG4gICAgfVxuXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgdGhpcy5fc3ZnID0gc3ZnO1xuICAgIHRoaXMuX2dyb3VwID0gZ3JvdXA7XG5cbiAgICB0aGlzLnJlc2l6ZSh0aGlzLl9jb250YWluZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2l6ZSB0aGUgU1ZHIGVsZW1lbnQuXG4gICAqL1xuICByZXNpemUoKSB7XG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy5fY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG4gICAgLy8gZm9yY2UgYWRhcHRhdGlvbiB0byBjb250YWluZXIgc2l6ZVxuXG4gICAgY29uc3QgcmF0aW8gPSAoKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQpID9cbiAgICAgICAgY29udGFpbmVyV2lkdGggLyB0aGlzLndpZHRoIDpcbiAgICAgICAgY29udGFpbmVySGVpZ2h0IC8gdGhpcy5oZWlnaHQ7XG4gICAgfSkoKTtcblxuICAgIGxldCBzdmdXaWR0aCA9IHRoaXMud2lkdGggKiByYXRpbztcbiAgICBsZXQgc3ZnSGVpZ2h0ID0gdGhpcy5oZWlnaHQgKiByYXRpbztcblxuICAgIGlmICh0aGlzLl9maXRDb250YWluZXIpIHtcbiAgICAgIHN2Z1dpZHRoID0gY29udGFpbmVyV2lkdGg7XG4gICAgICBzdmdIZWlnaHQgPSBjb250YWluZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb2Zmc2V0TGVmdCA9IChjb250YWluZXJXaWR0aCAtIHN2Z1dpZHRoKSAvIDI7XG4gICAgY29uc3Qgb2Zmc2V0VG9wID0gKGNvbnRhaW5lckhlaWdodCAtIHN2Z0hlaWdodCkgLyAyO1xuXG4gICAgdGhpcy5fc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLl9zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgIC8vIHVzZSBzZXR1cCBjb29yZGluYXRlc1xuICAgIHRoaXMuX3N2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld0JveCcsIGAwIDAgJHt0aGlzLndpZHRofSAke3RoaXMuaGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciBzdmcgaW4gY29udGFpbmVyXG4gICAgdGhpcy5fc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLl9zdmcuc3R5bGUubGVmdCA9IGAke29mZnNldExlZnR9cHhgO1xuICAgIHRoaXMuX3N2Zy5zdHlsZS50b3AgPSBgJHtvZmZzZXRUb3B9cHhgO1xuXG4gICAgLy8gYXBwbHkgcm90YXRpb25zXG4gICAgaWYgKHRoaXMuX3JlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuX3JlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICAgIGNhc2UgJ3JvdGF0ZTE4MCc6XG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS14ZmFjdG9yJywgLTEpO1xuICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEteWZhY3RvcicsIC0xKTtcbiAgICAgICAgICAvLyBjb25zdCB0cmFuc2Zvcm0gPSBgcm90YXRlKDE4MCwgJHtzdmdXaWR0aCAvIDJ9LCAke3N2Z0hlaWdodCAvIDJ9KWA7XG4gICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gJ3JvdGF0ZSgxODAsIDAuNSwgMC41KSc7XG4gICAgICAgICAgdGhpcy5fZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGVmdCBvZmZzZXQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdPZmZzZXRMZWZ0ID0gb2Zmc2V0TGVmdDtcblxuICAgIC8qKlxuICAgICAqIFRvcCBvZmZzZXQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdPZmZzZXRUb3AgPSBvZmZzZXRUb3A7XG5cbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z1dpZHRoID0gc3ZnV2lkdGg7XG5cbiAgICAvKipcbiAgICAgKiBIZWlnaHQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdIZWlnaHQgPSBzdmdIZWlnaHQ7XG5cbiAgICB0aGlzLl9yYXRpbyA9IHJhdGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgYW4gYXJyYXkgb2YgcG9zaXRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBwb3NpdGlvbnMgUG9zaXRpb25zIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplIFNpemUgb2YgdGhlIHBvc2l0aW9ucyB0byBkaXNwbGF5LlxuICAgKi9cbiAgZGlzcGxheVBvc2l0aW9ucyhwb3NpdGlvbnMsIHNpemUpIHtcbiAgICAvLyBjbGVhbiBzdXJmYWNlXG4gICAgdGhpcy5yZW1vdmVBbGxQb3NpdGlvbnMoKTtcblxuICAgIHBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgICAgdGhpcy5hZGRQb3NpdGlvbihwb3NpdGlvbiwgc2l6ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgbGlzdGVuZXJzXG4gICAgaWYgKHRoaXMuX2xpc3RlblRvdWNoRXZlbnQpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBkb3RzID0gdGhpcy5fc2hhcGVQb3NpdGlvbk1hcC5tYXAoKGVudHJ5KSA9PiB7IHJldHVybiBlbnRyeS5kb3QgfSk7XG4gICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgICAgICAvLyBDb3VsZCBwcm9iYWJseSBiZSBzaW1wbGlmaWVkLi4uXG4gICAgICAgIHdoaWxlICh0YXJnZXQgIT09IHRoaXMuX2NvbnRhaW5lcikge1xuICAgICAgICAgIGlmIChkb3RzLmluZGV4T2YodGFyZ2V0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fc2hhcGVQb3NpdGlvbk1hcFtpXTtcbiAgICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gZW50cnkuZG90KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBlbnRyeS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3NlbGVjdCcsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvc2l0aW9uIHRvIHRoZSBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gUG9zaXRpb24gdG8gYWRkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSBTaXplIG9mIHRoZSBwb3NpdGlvbiB0byBkcmF3LlxuICAgKi9cbiAgYWRkUG9zaXRpb24ocG9zaXRpb24sIHNpemUpIHtcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gMjtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIGNvbnN0IGluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG5cbiAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdjaXJjbGUnKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCByYWRpdXMgLyB0aGlzLl9yYXRpbyk7XG4gICAgZG90LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeCcsIGNvb3JkaW5hdGVzWzBdICogdGhpcy53aWR0aCk7XG4gICAgZG90LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeScsIGNvb3JkaW5hdGVzWzFdICogdGhpcy5oZWlnaHQpO1xuICAgIGRvdC5zdHlsZS5maWxsID0gJ3N0ZWVsYmx1ZSc7XG5cbiAgICB0aGlzLl9ncm91cC5hcHBlbmRDaGlsZChkb3QpO1xuICAgIHRoaXMuX3NoYXBlUG9zaXRpb25NYXAucHVzaCh7IGRvdCwgcG9zaXRpb24gfSk7XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwW2luZGV4XSA9IGRvdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgcG9zaXRpb24gZnJvbSB0aGUgZGlzcGxheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIFBvc2l0aW9uIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXBbcG9zaXRpb24uaW5kZXhdO1xuICAgIHRoaXMuX2dyb3VwLnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBwb3NpdGlvbnMgZGlzcGxheWVkLlxuICAgKi9cbiAgcmVtb3ZlQWxsUG9zaXRpb25zKCkge1xuICAgIHdoaWxlICh0aGlzLl9ncm91cC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLl9ncm91cC5yZW1vdmVDaGlsZCh0aGlzLl9ncm91cC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
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
 * The {@link Space} module graphically renders a {@link Setup} data.
 */

var Space = (function (_Module) {
  _inherits(Space, _Module);

  /**
   * Create an instance of the class.
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
      this._container.innerHTML = '';
    }

    /**
     * The `display` method displays a graphical representation of the setup.
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7O0FBRTdCLElBQU0sRUFBRSxHQUFHLDRCQUE0QixDQUFDOzs7Ozs7SUFLbkIsS0FBSztZQUFMLEtBQUs7Ozs7Ozs7Ozs7QUFRYixXQVJRLEtBQUssR0FRRTtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBUkwsS0FBSzs7QUFTdEIsK0JBVGlCLEtBQUssNkNBU2hCLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxFQUFFOzs7Ozs7QUFNL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztBQUVoQixRQUFJLENBQUMsYUFBYSxHQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSyxBQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGlCQUFpQixHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLEFBQUMsQ0FBQzs7Ozs7Ozs7Ozs7QUFXN0QsUUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Ozs7OztBQU10QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQzs7QUFFdkIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7OztBQUdsQixRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxzQkFBc0IsR0FBRyxFQUFFLENBQUM7R0FDbEM7Ozs7ZUFqRGtCLEtBQUs7O1dBb0RkLG9CQUFDLEtBQUssRUFBRTtBQUNoQixVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7QUFDekIsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDOzs7O0FBSTNCLFVBQUksQ0FBQyxJQUFJLEdB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QUUsQ0FBQyxDQUFDO0FBQy9DLFVBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7S0FDMUM7Ozs7Ozs7O1dBTWEsd0JBQUMsUUFBUSxFQUFFO0FBQ3ZCLFVBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDN0I7Ozs7Ozs7V0FLaUIsOEJBQUc7QUFDbkIsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtBQUM3QixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ2pEO0tBQ0Y7OztTQXZSa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NsaWVudC9TcGFjZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cbmNvbnN0IG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJztcblxuLyoqXG4gKiBUaGUge0BsaW5rIFNwYWNlfSBtb2R1bGUgZ3JhcGhpY2FsbHkgcmVuZGVycyBhIHtAbGluayBTZXR1cH0gZGF0YS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3BhY2UgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc3BhY2UnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMuZml0Q29udGFpbmVyPWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgZ3JhcGhpY2FsIHJlcHJlc2VudGF0aW9uIGZpdHMgdGhlIGNvbnRhaW5lciBzaXplIG9yIG5vdC5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5saXN0ZW5Ub3VjaEV2ZW50PWZhbHNlXSBJbmRpY2F0ZXMgd2hldGhlciB0byBzZXR1cCBhIGxpc3RlbmVyIG9uIHRoZSBzcGFjZSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb3Igbm90LlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8wqAnc3BhY2UnKTtcblxuICAgIC8qKlxuICAgICAqIFJlbGF0aXZlIHdpZHRoIG9mIHRoZSBzZXR1cC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSAxO1xuXG4gICAgLyoqXG4gICAgICogUmVsYXRpdmUgaGVpZ2h0IG9mIHRoZSBzZXR1cC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gMTtcblxuICAgIHRoaXMuX2ZpdENvbnRhaW5lciA9IChvcHRpb25zLmZpdENvbnRhaW5lciB8fMKgZmFsc2UpO1xuICAgIHRoaXMuX2xpc3RlblRvdWNoRXZlbnQgPSAob3B0aW9ucy5saXN0ZW5Ub3VjaEV2ZW50IHx8IGZhbHNlKTtcblxuICAgIC8vIHRoaXMuc3BhY2luZyA9IDE7XG4gICAgLy8gdGhpcy5sYWJlbHMgPSBbXTtcbiAgICAvLyB0aGlzLmNvb3JkaW5hdGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUeXBlIG9mIHRoZSBzZXR1cCAodmFsdWVzIGN1cnJlbnRseSBzdXBwb3J0ZWQ6IGAnbWF0cml4J2AsIGAnc3VyZmFjZSdgKS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEB0b2RvIFJlbW92ZT9cbiAgICAgKi9cbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBVUkwgb2YgdGhlIGJhY2tncm91bmQgaW1hZ2UgKGlmIGFueSkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmJhY2tncm91bmQgPSBudWxsO1xuXG4gICAgdGhpcy5feEZhY3RvciA9IDE7XG4gICAgdGhpcy5feUZhY3RvciA9IDE7XG5cbiAgICAvLyBtYXAgYmV0d2VlbiBzaGFwZXMgYW5kIHRoZWlyIHJlbGF0ZWQgcG9zaXRpb25zXG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcCA9IFtdO1xuICAgIHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcCA9IHt9O1xuICB9XG5cbiAgLy8gVE9ETyBub3RlIC0+IG1vZGZpeSBoZXJlXG4gIF9pbml0U2V0dXAoc2V0dXApIHtcbiAgICB0aGlzLndpZHRoID0gc2V0dXAud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBzZXR1cC5oZWlnaHQ7XG4gICAgLy8gdGhpcy5zcGFjaW5nID0gc2V0dXAuc3BhY2luZztcbiAgICAvLyB0aGlzLmxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICAvLyB0aGlzLmNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgdGhpcy50eXBlID0gc2V0dXAudHlwZTtcbiAgICB0aGlzLmJhY2tncm91bmQgPSBzZXR1cC5iYWNrZ3JvdW5kO1xuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICAgIC8vIGNsaWVudC5yZWNlaXZlKCdzZXR1cDppbml0JywgdGhpcy5fb25TZXR1cEluaXQpO1xuICAgIC8vIGNsaWVudC5zZW5kKCdzZXR1cDpyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcCA9IFtdO1xuICAgIHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcCA9IHt9O1xuICAgIC8vIGNsaWVudC5yZW1vdmVMaXN0ZW5lcignc2V0dXA6aW5pdCcsIHRoaXMuX29uU2V0dXBJbml0KTtcbiAgICB0aGlzLl9jb250YWluZXIuaW5uZXJIVE1MID0gJyc7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGBkaXNwbGF5YCBtZXRob2QgZGlzcGxheXMgYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNldHVwLlxuICAgKiBAcGFyYW0ge0NsaWVudFNldHVwfSBzZXR1cCBTZXR1cCB0byBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBDb250YWluZXIgdG8gYXBwZW5kIHRoZSBzZXR1cCByZXByZXNlbnRhdGlvbiB0by5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMudHJhbnNmb3JtXSBJbmRpY2F0ZXMgd2hpY2ggdHJhbnNmb3JtYXRpb24gdG8gYXBseSB0byB0aGUgcmVwcmVzZW50YXRpb24uIFBvc3NpYmxlIHZhbHVlcyBhcmU6XG4gICAqIC0gYCdyb3RhdGUxODAnYDogcm90YXRlcyB0aGUgcmVwcmVzZW50YXRpb24gYnkgMTgwIGRlZ3JlZXMuXG4gICAqIEB0b2RvIEJpZyBwcm9ibGVtIHdpdGggdGhlIGNvbnRhaW5lciAoX2NvbnRhaW5lciAtLT4gb25seSBvbmUgb2YgdGhlbSwgd2hpbGUgd2Ugc2hvdWxkIGJlIGFibGUgdG8gdXNlIHRoZSBkaXNwbGF5IG1ldGhvZCBvbiBzZXZlcmFsIGNvbnRhaW5lcnMpXG4gICAqL1xuICBkaXNwbGF5KHNldHVwLCBjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2luaXRTZXR1cChzZXR1cCk7XG4gICAgdGhpcy5fY29udGFpbmVyID0gY29udGFpbmVyO1xuICAgIHRoaXMuX2NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCdzcGFjZScpO1xuICAgIHRoaXMuX3JlbmRlcmluZ09wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMuc2hvd0JhY2tncm91bmQpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7dGhpcy5iYWNrZ3JvdW5kfSlgO1xuICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbic7XG4gICAgfVxuXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgdGhpcy5fc3ZnID0gc3ZnO1xuICAgIHRoaXMuX2dyb3VwID0gZ3JvdXA7XG5cbiAgICB0aGlzLnJlc2l6ZSh0aGlzLl9jb250YWluZXIpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2l6ZSB0aGUgU1ZHIGVsZW1lbnQuXG4gICAqL1xuICByZXNpemUoKSB7XG4gICAgY29uc3QgYm91bmRpbmdSZWN0ID0gdGhpcy5fY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gYm91bmRpbmdSZWN0LndpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IGJvdW5kaW5nUmVjdC5oZWlnaHQ7XG4gICAgLy8gZm9yY2UgYWRhcHRhdGlvbiB0byBjb250YWluZXIgc2l6ZVxuXG4gICAgY29uc3QgcmF0aW8gPSAoKCkgPT4ge1xuICAgICAgcmV0dXJuICh0aGlzLndpZHRoID4gdGhpcy5oZWlnaHQpID9cbiAgICAgICAgY29udGFpbmVyV2lkdGggLyB0aGlzLndpZHRoIDpcbiAgICAgICAgY29udGFpbmVySGVpZ2h0IC8gdGhpcy5oZWlnaHQ7XG4gICAgfSkoKTtcblxuICAgIGxldCBzdmdXaWR0aCA9IHRoaXMud2lkdGggKiByYXRpbztcbiAgICBsZXQgc3ZnSGVpZ2h0ID0gdGhpcy5oZWlnaHQgKiByYXRpbztcblxuICAgIGlmICh0aGlzLl9maXRDb250YWluZXIpIHtcbiAgICAgIHN2Z1dpZHRoID0gY29udGFpbmVyV2lkdGg7XG4gICAgICBzdmdIZWlnaHQgPSBjb250YWluZXJIZWlnaHQ7XG4gICAgfVxuXG4gICAgY29uc3Qgb2Zmc2V0TGVmdCA9IChjb250YWluZXJXaWR0aCAtIHN2Z1dpZHRoKSAvIDI7XG4gICAgY29uc3Qgb2Zmc2V0VG9wID0gKGNvbnRhaW5lckhlaWdodCAtIHN2Z0hlaWdodCkgLyAyO1xuXG4gICAgdGhpcy5fc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd3aWR0aCcsIHN2Z1dpZHRoKTtcbiAgICB0aGlzLl9zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ2hlaWdodCcsIHN2Z0hlaWdodCk7XG4gICAgIC8vIHVzZSBzZXR1cCBjb29yZGluYXRlc1xuICAgIHRoaXMuX3N2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndmlld0JveCcsIGAwIDAgJHt0aGlzLndpZHRofSAke3RoaXMuaGVpZ2h0fWApO1xuICAgIC8vIGNlbnRlciBzdmcgaW4gY29udGFpbmVyXG4gICAgdGhpcy5fc3ZnLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0aGlzLl9zdmcuc3R5bGUubGVmdCA9IGAke29mZnNldExlZnR9cHhgO1xuICAgIHRoaXMuX3N2Zy5zdHlsZS50b3AgPSBgJHtvZmZzZXRUb3B9cHhgO1xuXG4gICAgLy8gYXBwbHkgcm90YXRpb25zXG4gICAgaWYgKHRoaXMuX3JlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICBzd2l0Y2ggKHRoaXMuX3JlbmRlcmluZ09wdGlvbnMudHJhbnNmb3JtKSB7XG4gICAgICAgIGNhc2UgJ3JvdGF0ZTE4MCc6XG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS14ZmFjdG9yJywgLTEpO1xuICAgICAgICAgIHRoaXMuX2NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ2RhdGEteWZhY3RvcicsIC0xKTtcbiAgICAgICAgICAvLyBjb25zdCB0cmFuc2Zvcm0gPSBgcm90YXRlKDE4MCwgJHtzdmdXaWR0aCAvIDJ9LCAke3N2Z0hlaWdodCAvIDJ9KWA7XG4gICAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gJ3JvdGF0ZSgxODAsIDAuNSwgMC41KSc7XG4gICAgICAgICAgdGhpcy5fZ3JvdXAuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3RyYW5zZm9ybScsIHRyYW5zZm9ybSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTGVmdCBvZmZzZXQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdPZmZzZXRMZWZ0ID0gb2Zmc2V0TGVmdDtcblxuICAgIC8qKlxuICAgICAqIFRvcCBvZmZzZXQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdPZmZzZXRUb3AgPSBvZmZzZXRUb3A7XG5cbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z1dpZHRoID0gc3ZnV2lkdGg7XG5cbiAgICAvKipcbiAgICAgKiBIZWlnaHQgb2YgdGhlIFNWRyBlbGVtZW50LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zdmdIZWlnaHQgPSBzdmdIZWlnaHQ7XG5cbiAgICB0aGlzLl9yYXRpbyA9IHJhdGlvO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgYW4gYXJyYXkgb2YgcG9zaXRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBwb3NpdGlvbnMgUG9zaXRpb25zIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplIFNpemUgb2YgdGhlIHBvc2l0aW9ucyB0byBkaXNwbGF5LlxuICAgKi9cbiAgZGlzcGxheVBvc2l0aW9ucyhwb3NpdGlvbnMsIHNpemUpIHtcbiAgICAvLyBjbGVhbiBzdXJmYWNlXG4gICAgdGhpcy5yZW1vdmVBbGxQb3NpdGlvbnMoKTtcblxuICAgIHBvc2l0aW9ucy5mb3JFYWNoKChwb3NpdGlvbikgPT4ge1xuICAgICAgdGhpcy5hZGRQb3NpdGlvbihwb3NpdGlvbiwgc2l6ZSk7XG4gICAgfSk7XG5cbiAgICAvLyBhZGQgbGlzdGVuZXJzXG4gICAgaWYgKHRoaXMuX2xpc3RlblRvdWNoRXZlbnQpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgKGUpID0+IHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBkb3RzID0gdGhpcy5fc2hhcGVQb3NpdGlvbk1hcC5tYXAoKGVudHJ5KSA9PiB7IHJldHVybiBlbnRyeS5kb3QgfSk7XG4gICAgICAgIGxldCB0YXJnZXQgPSBlLnRhcmdldDtcblxuICAgICAgICAvLyBDb3VsZCBwcm9iYWJseSBiZSBzaW1wbGlmaWVkLi4uXG4gICAgICAgIHdoaWxlICh0YXJnZXQgIT09IHRoaXMuX2NvbnRhaW5lcikge1xuICAgICAgICAgIGlmIChkb3RzLmluZGV4T2YodGFyZ2V0KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fc2hhcGVQb3NpdGlvbk1hcFtpXTtcbiAgICAgICAgICAgICAgaWYgKHRhcmdldCA9PT0gZW50cnkuZG90KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBlbnRyeS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoJ3NlbGVjdCcsIHBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHBvc2l0aW9uIHRvIHRoZSBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge09iamVjdH0gcG9zaXRpb24gUG9zaXRpb24gdG8gYWRkLlxuICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSBTaXplIG9mIHRoZSBwb3NpdGlvbiB0byBkcmF3LlxuICAgKi9cbiAgYWRkUG9zaXRpb24ocG9zaXRpb24sIHNpemUpIHtcbiAgICBjb25zdCByYWRpdXMgPSBzaXplIC8gMjtcbiAgICBjb25zdCBjb29yZGluYXRlcyA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzO1xuICAgIGNvbnN0IGluZGV4ID0gcG9zaXRpb24uaW5kZXg7XG5cbiAgICBjb25zdCBkb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdjaXJjbGUnKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ3InLCByYWRpdXMgLyB0aGlzLl9yYXRpbyk7XG4gICAgZG90LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeCcsIGNvb3JkaW5hdGVzWzBdICogdGhpcy53aWR0aCk7XG4gICAgZG90LnNldEF0dHJpYnV0ZU5TKG51bGwsICdjeScsIGNvb3JkaW5hdGVzWzFdICogdGhpcy5oZWlnaHQpO1xuICAgIGRvdC5zdHlsZS5maWxsID0gJ3N0ZWVsYmx1ZSc7XG5cbiAgICB0aGlzLl9ncm91cC5hcHBlbmRDaGlsZChkb3QpO1xuICAgIHRoaXMuX3NoYXBlUG9zaXRpb25NYXAucHVzaCh7IGRvdCwgcG9zaXRpb24gfSk7XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwW2luZGV4XSA9IGRvdDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGEgcG9zaXRpb24gZnJvbSB0aGUgZGlzcGxheS5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBvc2l0aW9uIFBvc2l0aW9uIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVBvc2l0aW9uKHBvc2l0aW9uKSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXBbcG9zaXRpb24uaW5kZXhdO1xuICAgIHRoaXMuX2dyb3VwLnJlbW92ZUNoaWxkKGVsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBwb3NpdGlvbnMgZGlzcGxheWVkLlxuICAgKi9cbiAgcmVtb3ZlQWxsUG9zaXRpb25zKCkge1xuICAgIHdoaWxlICh0aGlzLl9ncm91cC5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLl9ncm91cC5yZW1vdmVDaGlsZCh0aGlzLl9ncm91cC5maXJzdENoaWxkKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
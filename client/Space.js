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
 * space.display(positions, container);
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

    this.width = 10;
    this.height = 10;

    this._fitContainer = options.fitContainer || false;
    this._listenTouchEvent = options.listenTouchEvent || false;

    // this.spacing = 1;
    // this.labels = [];
    // this.coordinates = [];

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
      // use space coordinates
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
  }]);

  return Space;
})(_ClientModule3['default']);

exports['default'] = Space;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvU3BhY2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozs2QkFDSixnQkFBZ0I7Ozs7QUFFekMsSUFBTSxFQUFFLEdBQUcsNEJBQTRCLENBQUM7Ozs7Ozs7Ozs7Ozs7SUFZbkIsS0FBSztZQUFMLEtBQUs7Ozs7Ozs7OztBQU9iLFdBUFEsS0FBSyxHQU9FO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFQTCxLQUFLOztBQVF0QiwrQkFSaUIsS0FBSyw2Q0FRaEIsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUU7O0FBRS9CLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFFBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOztBQUVqQixRQUFJLENBQUMsYUFBYSxHQUFJLE9BQU8sQ0FBQyxZQUFZLElBQUksS0FBSyxBQUFDLENBQUM7QUFDckQsUUFBSSxDQUFDLGlCQUFpQixHQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxLQUFLLEFBQUMsQ0FBQzs7Ozs7O0FBTTdELFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDOzs7QUFHbEIsUUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM1QixRQUFJLENBQUMsc0JBQXNCLEdBQUcsRUFBRSxDQUFDO0dBQ2xDOzs7Ozs7O2VBMUJrQixLQUFLOztXQWdDbkIsaUJBQUc7QUFDTixpQ0FqQ2lCLEtBQUssdUNBaUNSO0FBQ2QsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7Ozs7Ozs7O1dBTU0sbUJBQUc7QUFDUixpQ0ExQ2lCLEtBQUsseUNBMENOO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7Ozs7OztXQU1JLGlCQUFHO0FBQ04sVUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM1QixVQUFJLENB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Rjs7O1NBalBrQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJzcmMvY2xpZW50L1NwYWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgQ2xpZW50TW9kdWxlIGZyb20gJy4vQ2xpZW50TW9kdWxlJztcblxuY29uc3QgbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuXG4vKipcbiAqIFtjbGllbnRdIFJlbmRlciBhIHNldCBvZiBwb3NpdGlvbnMgKGkuZS4gY29vcmRpbmF0ZXMgd2l0aCBvcHRpb25hbCBsYWJlbHMpIGdyYXBoaWNhbGx5LlxuICpcbiAqIFRoZSBtb2R1bGUgbmV2ZXIgaGFzIGEgdmlldyAoaXQgZGlzcGxheXMgdGhlIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBpbiBhIGBkaXZgIHBhc3NlZCBpbiBhcyBhbiBhcmd1bWVudCBvZiB0aGUge0BsaW5rIFNwYWNlI2Rpc3BsYXl9IG1ldGhvZCkuXG4gKlxuICogVGhlIG1vZHVsZSBmaW5pc2hlcyBpdHMgaW5pdGlhbGl6YXRpb24gaW1tZWRpYXRlbHkuXG4gKlxuICogQGV4YW1wbGUgY29uc3Qgc3BhY2UgPSBuZXcgU3BhY2UoKTtcbiAqIHNwYWNlLmRpc3BsYXkocG9zaXRpb25zLCBjb250YWluZXIpO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcGFjZSBleHRlbmRzIENsaWVudE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzcGFjZSddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5maXRDb250YWluZXI9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRoZSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gZml0cyB0aGUgY29udGFpbmVyIHNpemUgb3Igbm90LlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmxpc3RlblRvdWNoRXZlbnQ9ZmFsc2VdIEluZGljYXRlcyB3aGV0aGVyIHRvIHNldHVwIGEgbGlzdGVuZXIgb24gdGhlIHNwYWNlIGdyYXBoaWNhbCByZXByZXNlbnRhdGlvbiBvciBub3QuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHzCoCdzcGFjZScpO1xuXG4gICAgdGhpcy53aWR0aCA9IDEwO1xuICAgIHRoaXMuaGVpZ2h0ID0gMTA7XG5cbiAgICB0aGlzLl9maXRDb250YWluZXIgPSAob3B0aW9ucy5maXRDb250YWluZXIgfHzCoGZhbHNlKTtcbiAgICB0aGlzLl9saXN0ZW5Ub3VjaEV2ZW50ID0gKG9wdGlvbnMubGlzdGVuVG91Y2hFdmVudCB8fCBmYWxzZSk7XG5cbiAgICAvLyB0aGlzLnNwYWNpbmcgPSAxO1xuICAgIC8vIHRoaXMubGFiZWxzID0gW107XG4gICAgLy8gdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuXG4gICAgdGhpcy5feEZhY3RvciA9IDE7XG4gICAgdGhpcy5feUZhY3RvciA9IDE7XG5cbiAgICAvLyBtYXAgYmV0d2VlbiBzaGFwZXMgYW5kIHRoZWlyIHJlbGF0ZWQgcG9zaXRpb25zXG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcCA9IFtdO1xuICAgIHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcCA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnQgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwID0gW107XG4gICAgdGhpcy5fcG9zaXRpb25JbmRleFNoYXBlTWFwID0ge307XG4gICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc3BsYXkgYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIHNwYWNlLlxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lciBDb250YWluZXIgdG8gYXBwZW5kIHRoZSByZXByZXNlbnRhdGlvbiB0by5cbiAgICogQHBhcmFtIHtBcnJheX0gcG9zaXRpb25zIExpc3Qgb2YgcG9zaXRpb25zIHRvIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLnRyYW5zZm9ybV0gSW5kaWNhdGVzIHdoaWNoIHRyYW5zZm9ybWF0aW9uIHRvIGFwbHkgdG8gdGhlIHJlcHJlc2VudGF0aW9uLiBQb3NzaWJsZSB2YWx1ZXMgYXJlOlxuICAgKiAtIGAncm90YXRlMTgwJ2A6IHJvdGF0ZXMgdGhlIHJlcHJlc2VudGF0aW9uIGJ5IDE4MCBkZWdyZWVzLlxuICAgKiBAdG9kbyBCaWcgcHJvYmxlbSB3aXRoIHRoZSBjb250YWluZXIgKF9jb250YWluZXIgLS0+IG9ubHkgb25lIG9mIHRoZW0sIHdoaWxlIHdlIHNob3VsZCBiZSBhYmxlIHRvIHVzZSB0aGUgZGlzcGxheSBtZXRob2Qgb24gc2V2ZXJhbCBjb250YWluZXJzKVxuICAgKi9cbiAgZGlzcGxheShjb250YWluZXIsIG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX2NvbnRhaW5lciA9IGNvbnRhaW5lcjtcbiAgICB0aGlzLl9jb250YWluZXIuY2xhc3NMaXN0LmFkZCgnc3BhY2UnKTtcbiAgICB0aGlzLl9yZW5kZXJpbmdPcHRpb25zID0gb3B0aW9ucztcblxuICAgIGlmIChvcHRpb25zLmJhY2tncm91bmQpIHtcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7b3B0aW9ucy5iYWNrZ3JvdW5kfSlgO1xuICAgICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gICAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbic7XG4gICAgfVxuXG4gICAgY29uc3Qgc3ZnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5zLCAnc3ZnJyk7XG4gICAgY29uc3QgZ3JvdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMobnMsICdnJyk7XG5cbiAgICBzdmcuYXBwZW5kQ2hpbGQoZ3JvdXApO1xuICAgIHRoaXMuX2NvbnRhaW5lci5hcHBlbmRDaGlsZChzdmcpO1xuXG4gICAgdGhpcy5fc3ZnID0gc3ZnO1xuICAgIHRoaXMuX2dyb3VwID0gZ3JvdXA7XG5cbiAgICB0aGlzLnJlc2l6ZSh0aGlzLl9jb250YWluZXIpO1xuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzaXplIHRoZSBTVkcgZWxlbWVudC5cbiAgICovXG4gIHJlc2l6ZSgpIHtcbiAgICBjb25zdCBib3VuZGluZ1JlY3QgPSB0aGlzLl9jb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgY29udGFpbmVyV2lkdGggPSBib3VuZGluZ1JlY3Qud2lkdGg7XG4gICAgY29uc3QgY29udGFpbmVySGVpZ2h0ID0gYm91bmRpbmdSZWN0LmhlaWdodDtcbiAgICAvLyBmb3JjZSBhZGFwdGF0aW9uIHRvIGNvbnRhaW5lciBzaXplXG5cbiAgICBjb25zdCByYXRpbyA9ICgoKSA9PiB7XG4gICAgICByZXR1cm4gKHRoaXMud2lkdGggPiB0aGlzLmhlaWdodCkgP1xuICAgICAgICBjb250YWluZXJXaWR0aCAvIHRoaXMud2lkdGggOlxuICAgICAgICBjb250YWluZXJIZWlnaHQgLyB0aGlzLmhlaWdodDtcbiAgICB9KSgpO1xuXG4gICAgbGV0IHN2Z1dpZHRoID0gdGhpcy53aWR0aCAqIHJhdGlvO1xuICAgIGxldCBzdmdIZWlnaHQgPSB0aGlzLmhlaWdodCAqIHJhdGlvO1xuXG4gICAgaWYgKHRoaXMuX2ZpdENvbnRhaW5lcikge1xuICAgICAgc3ZnV2lkdGggPSBjb250YWluZXJXaWR0aDtcbiAgICAgIHN2Z0hlaWdodCA9IGNvbnRhaW5lckhlaWdodDtcbiAgICB9XG5cbiAgICBjb25zdCBvZmZzZXRMZWZ0ID0gKGNvbnRhaW5lcldpZHRoIC0gc3ZnV2lkdGgpIC8gMjtcbiAgICBjb25zdCBvZmZzZXRUb3AgPSAoY29udGFpbmVySGVpZ2h0IC0gc3ZnSGVpZ2h0KSAvIDI7XG5cbiAgICB0aGlzLl9zdmcuc2V0QXR0cmlidXRlTlMobnVsbCwgJ3dpZHRoJywgc3ZnV2lkdGgpO1xuICAgIHRoaXMuX3N2Zy5zZXRBdHRyaWJ1dGVOUyhudWxsLCAnaGVpZ2h0Jywgc3ZnSGVpZ2h0KTtcbiAgICAgLy8gdXNlIHNwYWNlIGNvb3JkaW5hdGVzXG4gICAgdGhpcy5fc3ZnLnNldEF0dHJpYnV0ZU5TKG51bGwsICd2aWV3Qm94JywgYDAgMCAke3RoaXMud2lkdGh9ICR7dGhpcy5oZWlnaHR9YCk7XG4gICAgLy8gY2VudGVyIHN2ZyBpbiBjb250YWluZXJcbiAgICB0aGlzLl9zdmcuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIHRoaXMuX3N2Zy5zdHlsZS5sZWZ0ID0gYCR7b2Zmc2V0TGVmdH1weGA7XG4gICAgdGhpcy5fc3ZnLnN0eWxlLnRvcCA9IGAke29mZnNldFRvcH1weGA7XG5cbiAgICAvLyBhcHBseSByb3RhdGlvbnNcbiAgICBpZiAodGhpcy5fcmVuZGVyaW5nT3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgICAgIHN3aXRjaCAodGhpcy5fcmVuZGVyaW5nT3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgICAgICAgY2FzZSAncm90YXRlMTgwJzpcbiAgICAgICAgICB0aGlzLl9jb250YWluZXIuc2V0QXR0cmlidXRlKCdkYXRhLXhmYWN0b3InLCAtMSk7XG4gICAgICAgICAgdGhpcy5fY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnZGF0YS15ZmFjdG9yJywgLTEpO1xuICAgICAgICAgIC8vIGNvbnN0IHRyYW5zZm9ybSA9IGByb3RhdGUoMTgwLCAke3N2Z1dpZHRoIC8gMn0sICR7c3ZnSGVpZ2h0IC8gMn0pYDtcbiAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSAncm90YXRlKDE4MCwgMC41LCAwLjUpJztcbiAgICAgICAgICB0aGlzLl9ncm91cC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAndHJhbnNmb3JtJywgdHJhbnNmb3JtKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBMZWZ0IG9mZnNldCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z09mZnNldExlZnQgPSBvZmZzZXRMZWZ0O1xuXG4gICAgLyoqXG4gICAgICogVG9wIG9mZnNldCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z09mZnNldFRvcCA9IG9mZnNldFRvcDtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSBTVkcgZWxlbWVudC5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3ZnV2lkdGggPSBzdmdXaWR0aDtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgU1ZHIGVsZW1lbnQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnN2Z0hlaWdodCA9IHN2Z0hlaWdodDtcblxuICAgIHRoaXMuX3JhdGlvID0gcmF0aW87XG4gIH1cblxuICAvKipcbiAgICogRGlzcGxheSBhbiBhcnJheSBvZiBwb3NpdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IHBvc2l0aW9ucyBQb3NpdGlvbnMgdG8gZGlzcGxheS5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNpemUgU2l6ZSBvZiB0aGUgcG9zaXRpb25zIHRvIGRpc3BsYXkuXG4gICAqL1xuICBkaXNwbGF5UG9zaXRpb25zKHBvc2l0aW9ucywgc2l6ZSkge1xuICAgIC8vIGNsZWFuIHN1cmZhY2VcbiAgICB0aGlzLnJlbW92ZUFsbFBvc2l0aW9ucygpO1xuXG4gICAgcG9zaXRpb25zLmZvckVhY2goKHBvc2l0aW9uKSA9PiB7XG4gICAgICB0aGlzLmFkZFBvc2l0aW9uKHBvc2l0aW9uLCBzaXplKTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCBsaXN0ZW5lcnNcbiAgICBpZiAodGhpcy5fbGlzdGVuVG91Y2hFdmVudCkge1xuICAgICAgdGhpcy5fY29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCAoZSkgPT4ge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGRvdHMgPSB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwLm1hcCgoZW50cnkpID0+IHsgcmV0dXJuIGVudHJ5LmRvdCB9KTtcbiAgICAgICAgbGV0IHRhcmdldCA9IGUudGFyZ2V0O1xuXG4gICAgICAgIC8vIENvdWxkIHByb2JhYmx5IGJlIHNpbXBsaWZpZWQuLi5cbiAgICAgICAgd2hpbGUgKHRhcmdldCAhPT0gdGhpcy5fY29udGFpbmVyKSB7XG4gICAgICAgICAgaWYgKGRvdHMuaW5kZXhPZih0YXJnZXQpICE9PSAtMSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLl9zaGFwZVBvc2l0aW9uTWFwW2ldO1xuICAgICAgICAgICAgICBpZiAodGFyZ2V0ID09PSBlbnRyeS5kb3QpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IGVudHJ5LnBvc2l0aW9uO1xuICAgICAgICAgICAgICAgIHRoaXMuZW1pdCgnc2VsZWN0JywgcG9zaXRpb24pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcG9zaXRpb24gdG8gdGhlIGRpc3BsYXkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwb3NpdGlvbiBQb3NpdGlvbiB0byBhZGQuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzaXplIFNpemUgb2YgdGhlIHBvc2l0aW9uIHRvIGRyYXcuXG4gICAqL1xuICBhZGRQb3NpdGlvbihwb3NpdGlvbiwgc2l6ZSkge1xuICAgIGNvbnN0IHJhZGl1cyA9IHNpemUgLyAyO1xuICAgIGNvbnN0IGNvb3JkaW5hdGVzID0gcG9zaXRpb24uY29vcmRpbmF0ZXM7XG4gICAgY29uc3QgaW5kZXggPSBwb3NpdGlvbi5pbmRleDtcblxuICAgIGNvbnN0IGRvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhucywgJ2NpcmNsZScpO1xuICAgIGRvdC5zZXRBdHRyaWJ1dGVOUyhudWxsLCAncicsIHJhZGl1cyAvIHRoaXMuX3JhdGlvKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2N4JywgY29vcmRpbmF0ZXNbMF0gKiB0aGlzLndpZHRoKTtcbiAgICBkb3Quc2V0QXR0cmlidXRlTlMobnVsbCwgJ2N5JywgY29vcmRpbmF0ZXNbMV0gKiB0aGlzLmhlaWdodCk7XG4gICAgZG90LnN0eWxlLmZpbGwgPSAnc3RlZWxibHVlJztcblxuICAgIHRoaXMuX2dyb3VwLmFwcGVuZENoaWxkKGRvdCk7XG4gICAgdGhpcy5fc2hhcGVQb3NpdGlvbk1hcC5wdXNoKHsgZG90LCBwb3NpdGlvbiB9KTtcbiAgICB0aGlzLl9wb3NpdGlvbkluZGV4U2hhcGVNYXBbaW5kZXhdID0gZG90O1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgYSBwb3NpdGlvbiBmcm9tIHRoZSBkaXNwbGF5LlxuICAgKiBAcGFyYW0ge051bWJlcn0gaW5kZXggb2YgcG9zaXRpb24gdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUG9zaXRpb24oaW5kZXgpIHtcbiAgICBjb25zdCBlbCA9IHRoaXMuX3Bvc2l0aW9uSW5kZXhTaGFwZU1hcFtpbmRleF07XG4gICAgdGhpcy5fZ3JvdXAucmVtb3ZlQ2hpbGQoZWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIHBvc2l0aW9ucyBkaXNwbGF5ZWQuXG4gICAqL1xuICByZW1vdmVBbGxQb3NpdGlvbnMoKSB7XG4gICAgd2hpbGUgKHRoaXMuX2dyb3VwLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMuX2dyb3VwLnJlbW92ZUNoaWxkKHRoaXMuX2dyb3VwLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfVxufVxuIl19
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

/**
 * The {@link Setup} module retrieves the setup information from the server.
 * It never has a view.
 * (For rendering the setup graphically, see {@link ClientSpace}.)
 *
 * The `Setup` module requires the SASS partial `sass/_77-setup.scss`.
 */

var Setup = (function (_Module) {
  _inherits(Setup, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='setup'] Name of the module.
   */

  function Setup() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Setup);

    _get(Object.getPrototypeOf(Setup.prototype), 'constructor', this).call(this, options.name || 'setup', false);

    /**
     * Width of the setup (in meters).
     * @type {Number}
     */
    this.width = 1;

    /**
     * Height of the setup (in meters).
     * @type {Number}
     */
    this.height = 1;

    /**
     * Default spacing between positions (in meters).
     * @type {Number}
     */
    this.spacing = 1;

    /**
     * Array of the positions' labels.
     * @type {String[]}
     */
    this.labels = [];

    /**
     * Array of the positions' coordinates (in the format `[x:Number, y:Number]`).
     * @type {Array[]}
     */
    this.coordinates = [];

    /**
     * Type of the setup (values currently supported: `'matrix'`, `'surface'`).
     * @type {String}
     * @todo Remove?
     */
    this.type = undefined;

    this._xFactor = 1;
    this._yFactor = 1;

    this._init = this._init.bind(this);
  }

  _createClass(Setup, [{
    key: '_init',
    value: function _init(setup) {
      this.width = setup.width;
      this.height = setup.height;
      this.spacing = setup.spacing;
      this.labels = setup.labels;
      this.coordinates = setup.coordinates;
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
      _get(Object.getPrototypeOf(Setup.prototype), 'start', this).call(this);

      _client2['default'].receive(this.name + ':init', this._init);
      _client2['default'].send(this.name + ':request');
      console.log(_client2['default'], this.name, ':request??');
    }

    /**
     * Restarts the module.
     * @private
     */
  }, {
    key: 'restart',
    value: function restart() {
      _get(Object.getPrototypeOf(Setup.prototype), 'restart', this).call(this);
      this.done();
    }

    /**
     * Resets the module.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(Setup.prototype), 'reset', this).call(this);
      _client2['default'].removeListener(this.name + ':init', this._init);
    }

    /**
     * Returns the number of positions in the setup.
     * @return {Number} Number of positions in the setup.
     */
  }, {
    key: 'getNumPositions',
    value: function getNumPositions() {
      if (this.labels.length || this.coordinates.length) {
        var numLabels = this.labels.length || Infinity;
        var numCoordinates = this.coordinates.length || Infinity;

        return Math.min(numLabels, numCoordinates);
      }

      return 0;
    }

    // display(div, options = {}) {
    //   div.classList.add('setup');

    //   if (options && options.transform){
    //     switch (options.transform) {
    //       case 'rotate180':
    //         div.setAttribute('data-xfactor', -1);
    //         div.setAttribute('data-yfactor', -1);
    //         break;

    //       case 'flipX':
    //         div.setAttribute('data-xfactor', -1);
    //         div.setAttribute('data-yfactor', 1);
    //         break;

    //       case 'flipY':
    //         div.setAttribute('data-xfactor', 1);
    //         div.setAttribute('data-yfactor', -1);
    //         break;

    //       default:
    //         div.setAttribute('data-xfactor', 1);
    //         div.setAttribute('data-yfactor', 1);
    //         break;
    //     }
    //   }

    //   let heightWidthRatio = this.height / this.width;
    //   let screenHeight = window.innerHeight;
    //   let screenWidth = window.innerWidth;
    //   let screenRatio = screenHeight / screenWidth;
    //   let heightPx, widthPx;

    //   if (screenRatio > heightWidthRatio) { // TODO: refine sizes, with container, etc.
    //     heightPx = screenWidth * heightWidthRatio;
    //     widthPx = screenWidth;
    //   } else {
    //     heightPx = screenHeight;
    //     widthPx = screenHeight / heightWidthRatio;
    //   }

    //   div.style.height = heightPx + "px";
    //   div.style.width = widthPx + "px";

    //   // add background
    //   if (options.showBackground) {
    //     div.style.backgroundImage = `url(${this.background})`;
    //     div.style.backgroundPosition = '50% 50%';
    //     div.style.backgroundRepeat = 'no-repeat';
    //     div.style.backgroundSize = 'contain';
    //   }

    //   switch (this.type) {
    //     case 'matrix':
    //       let positionWidth = widthPx / this.width * this.spacing;
    //       let positionHeight = heightPx / this.height * this.spacing;
    //       let positionSize = 0.75 * Math.min(positionWidth, positionHeight);
    //       let coordinates = this.coordinates;

    //       this.addPositionPlaceholders(div, coordinates, positionSize);
    //       break;

    //     case 'surface':
    //       // todo
    //       break;
    //   }

    // }

    // addPositionPlaceholders(div, coordinates, size) {
    //   let containerHeight = div.offsetHeight;
    //   let containerWidth = div.offsetWidth;

    //   for (let i = 0; i < coordinates.length; i++) {
    //     let position = document.createElement('div');
    //     position.classList.add('position');

    //     let xOffset = position.coordinates[0] * containerWidth;
    //     let yOffset = position.coordinates[1] * containerHeight;
    //     let xFactor = parseInt(div.dataset.xfactor);
    //     let yFactor = parseInt(div.dataset.yfactor);

    //     position.setAttribute('data-index', i);
    //     position.style.height = size + "px";
    //     position.style.width = size + "px";
    //     positionDiv.style.left = 0.5 * containerWidth - (0.5 * containerWidth - xOffset) * xFactor - size * 0.5 + "px";
    //     positionDiv.style.top = 0.5 * containerHeight - (0.5 * containerHeight - yOffset) * yFactor - size * 0.5 + "px";

    //     div.appendChild(position);
    //   }
    // }

    // addPositions(div, positions, size) {
    //   let containerHeight = div.offsetHeight;
    //   let containerWidth = div.offsetWidth;

    //   for (let position of positions) {
    //     let positionDiv = document.createElement('div');
    //     positionDiv.classList.add('position');
    //     positionDiv.classList.add('player');

    //     let xOffset = position.coordinates[0] * containerWidth;
    //     let yOffset = position.coordinates[1] * containerHeight;
    //     let xFactor = parseInt(div.dataset.xfactor);
    //     let yFactor = parseInt(div.dataset.yfactor);

    //     positionDiv.setAttribute('data-index', position.index);
    //     positionDiv.style.height = size + "px";
    //     positionDiv.style.width = size + "px";
    //     positionDiv.style.left = 0.5 * containerWidth - (0.5 * containerWidth - xOffset) * xFactor - size * 0.5 + "px";
    //     positionDiv.style.top = 0.5 * containerHeight - (0.5 * containerHeight - yOffset) * yFactor - size * 0.5 + "px";

    //     div.appendChild(positionDiv);
    //   }
    // }

    // removePositions(div, positions) { // TODO: remove div;
    //   for (let position of positions) {
    //     let positionDiv = document.querySelector('[data-index="' + position.index + '"]');
    //     if (!!positionDiv)
    //       positionDiv.parentNode.removeChild(positionDiv);
    //   }
    // }

    // removeAllPositions(div) {
    //   let positions = div.querySelectorAll('.player');
    //   for (let i = 0; i < positions.length; i++) {
    //     div.removeChild(positions[i]);
    //   }
    // }

    // addClassToPosition(div, index, className) {
    //   var positions = Array.prototype.slice.call(div.childNodes); // .childNode returns a NodeList
    //   var positionIndex = positions.map((t) => parseInt(t.dataset.index)).indexOf(index);
    //   var position = positions[positionIndex];

    //   if (position)
    //     position.classList.add(className);
    // }

    // removeClassFromPosition(div, index, className) {
    //   var positions = Array.prototype.slice.call(div.childNodes); // .childNode returns a NodeList
    //   var positionIndex = positions.map((t) => parseInt(t.dataset.index)).indexOf(index);
    //   var position = positions[positionIndex];

    //   if (position)
    //     position.classList.remove(className);
    // }
  }]);

  return Setup;
})(_Module3['default']);

exports['default'] = Setup;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QUFDO0tBQ1Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1NBM0drQixLQUFLOzs7cUJBQUwsS0FBSyIsImZpbGUiOiJzcmMvY2xpZW50L1NldHVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgU2V0dXB9IG1vZHVsZSByZXRyaWV2ZXMgdGhlIHNldHVwIGluZm9ybWF0aW9uIGZyb20gdGhlIHNlcnZlci5cbiAqIEl0IG5ldmVyIGhhcyBhIHZpZXcuXG4gKiAoRm9yIHJlbmRlcmluZyB0aGUgc2V0dXAgZ3JhcGhpY2FsbHksIHNlZSB7QGxpbmsgQ2xpZW50U3BhY2V9LilcbiAqXG4gKiBUaGUgYFNldHVwYCBtb2R1bGUgcmVxdWlyZXMgdGhlIFNBU1MgcGFydGlhbCBgc2Fzcy9fNzctc2V0dXAuc2Nzc2AuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNldHVwIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzZXR1cCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc2V0dXAnLCBmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgc2V0dXAgKGluIG1ldGVycykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gMTtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgc2V0dXAgKGluIG1ldGVycykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0IHNwYWNpbmcgYmV0d2VlbiBwb3NpdGlvbnMgKGluIG1ldGVycykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnNwYWNpbmcgPSAxO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgdGhlIHBvc2l0aW9ucycgbGFiZWxzLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVscyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgdGhlIHBvc2l0aW9ucycgY29vcmRpbmF0ZXMgKGluIHRoZSBmb3JtYXQgYFt4Ok51bWJlciwgeTpOdW1iZXJdYCkuXG4gICAgICogQHR5cGUge0FycmF5W119XG4gICAgICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogVHlwZSBvZiB0aGUgc2V0dXAgKHZhbHVlcyBjdXJyZW50bHkgc3VwcG9ydGVkOiBgJ21hdHJpeCdgLCBgJ3N1cmZhY2UnYCkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAdG9kbyBSZW1vdmU/XG4gICAgICovXG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5feEZhY3RvciA9IDE7XG4gICAgdGhpcy5feUZhY3RvciA9IDE7XG5cbiAgICB0aGlzLl9pbml0ID0gdGhpcy5faW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX2luaXQoc2V0dXApIHtcbiAgICB0aGlzLndpZHRoID0gc2V0dXAud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBzZXR1cC5oZWlnaHQ7XG4gICAgdGhpcy5zcGFjaW5nID0gc2V0dXAuc3BhY2luZztcbiAgICB0aGlzLmxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgdGhpcy50eXBlID0gc2V0dXAudHlwZTtcbiAgICB0aGlzLmJhY2tncm91bmQgPSBzZXR1cC5iYWNrZ3JvdW5kO1xuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY2xpZW50LnJlY2VpdmUodGhpcy5uYW1lICsgJzppbml0JywgdGhpcy5faW5pdCk7XG4gICAgY2xpZW50LnNlbmQodGhpcy5uYW1lICsgJzpyZXF1ZXN0Jyk7XG4gICAgY29uc29sZS5sb2coY2xpZW50LCB0aGlzLm5hbWUsICc6cmVxdWVzdD8/Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICBjbGllbnQucmVtb3ZlTGlzdGVuZXIodGhpcy5uYW1lICsgJzppbml0JywgdGhpcy5faW5pdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHBvc2l0aW9ucyBpbiB0aGUgc2V0dXAuXG4gICAqIEByZXR1cm4ge051bWJlcn0gTnVtYmVyIG9mIHBvc2l0aW9ucyBpbiB0aGUgc2V0dXAuXG4gICAqL1xuICBnZXROdW1Qb3NpdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMubGFiZWxzLmxlbmd0aCB8fCB0aGlzLmNvb3JkaW5hdGVzLmxlbmd0aCkge1xuICAgICAgdmFyIG51bUxhYmVscyA9IHRoaXMubGFiZWxzLmxlbmd0aCB8fCBJbmZpbml0eTtcbiAgICAgIHZhciBudW1Db29yZGluYXRlcyA9IHRoaXMuY29vcmRpbmF0ZXMubGVuZ3RoIHx8IEluZmluaXR5O1xuXG4gICAgICByZXR1cm4gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvLyBkaXNwbGF5KGRpdiwgb3B0aW9ucyA9IHt9KSB7XG4gIC8vICAgZGl2LmNsYXNzTGlzdC5hZGQoJ3NldHVwJyk7XG5cbiAgLy8gICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRyYW5zZm9ybSl7XG4gIC8vICAgICBzd2l0Y2ggKG9wdGlvbnMudHJhbnNmb3JtKSB7XG4gIC8vICAgICAgIGNhc2UgJ3JvdGF0ZTE4MCc6XG4gIC8vICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS14ZmFjdG9yJywgLTEpO1xuICAvLyAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEteWZhY3RvcicsIC0xKTtcbiAgLy8gICAgICAgICBicmVhaztcblxuICAvLyAgICAgICBjYXNlICdmbGlwWCc6XG4gIC8vICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS14ZmFjdG9yJywgLTEpO1xuICAvLyAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEteWZhY3RvcicsIDEpO1xuICAvLyAgICAgICAgIGJyZWFrO1xuXG4gIC8vICAgICAgIGNhc2UgJ2ZsaXBZJzpcbiAgLy8gICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXhmYWN0b3InLCAxKTtcbiAgLy8gICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXlmYWN0b3InLCAtMSk7XG4gIC8vICAgICAgICAgYnJlYWs7XG5cbiAgLy8gICAgICAgZGVmYXVsdDpcbiAgLy8gICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXhmYWN0b3InLCAxKTtcbiAgLy8gICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXlmYWN0b3InLCAxKTtcbiAgLy8gICAgICAgICBicmVhaztcbiAgLy8gICAgIH1cbiAgLy8gICB9XG5cbiAgLy8gICBsZXQgaGVpZ2h0V2lkdGhSYXRpbyA9IHRoaXMuaGVpZ2h0IC8gdGhpcy53aWR0aDtcbiAgLy8gICBsZXQgc2NyZWVuSGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAvLyAgIGxldCBzY3JlZW5XaWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAvLyAgIGxldCBzY3JlZW5SYXRpbyA9IHNjcmVlbkhlaWdodCAvIHNjcmVlbldpZHRoO1xuICAvLyAgIGxldCBoZWlnaHRQeCwgd2lkdGhQeDtcblxuICAvLyAgIGlmIChzY3JlZW5SYXRpbyA+IGhlaWdodFdpZHRoUmF0aW8pIHsgLy8gVE9ETzogcmVmaW5lIHNpemVzLCB3aXRoIGNvbnRhaW5lciwgZXRjLlxuICAvLyAgICAgaGVpZ2h0UHggPSBzY3JlZW5XaWR0aCAqIGhlaWdodFdpZHRoUmF0aW87XG4gIC8vICAgICB3aWR0aFB4ID0gc2NyZWVuV2lkdGg7XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgIGhlaWdodFB4ID0gc2NyZWVuSGVpZ2h0O1xuICAvLyAgICAgd2lkdGhQeCA9IHNjcmVlbkhlaWdodCAvIGhlaWdodFdpZHRoUmF0aW87XG4gIC8vICAgfVxuXG4gIC8vICAgZGl2LnN0eWxlLmhlaWdodCA9IGhlaWdodFB4ICsgXCJweFwiO1xuICAvLyAgIGRpdi5zdHlsZS53aWR0aCA9IHdpZHRoUHggKyBcInB4XCI7XG5cbiAgLy8gICAvLyBhZGQgYmFja2dyb3VuZFxuICAvLyAgIGlmIChvcHRpb25zLnNob3dCYWNrZ3JvdW5kKSB7XG4gIC8vICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke3RoaXMuYmFja2dyb3VuZH0pYDtcbiAgLy8gICAgIGRpdi5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSAnNTAlIDUwJSc7XG4gIC8vICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9ICduby1yZXBlYXQnO1xuICAvLyAgICAgZGl2LnN0eWxlLmJhY2tncm91bmRTaXplID0gJ2NvbnRhaW4nO1xuICAvLyAgIH1cblxuICAvLyAgIHN3aXRjaCAodGhpcy50eXBlKSB7XG4gIC8vICAgICBjYXNlICdtYXRyaXgnOlxuICAvLyAgICAgICBsZXQgcG9zaXRpb25XaWR0aCA9IHdpZHRoUHggLyB0aGlzLndpZHRoICogdGhpcy5zcGFjaW5nO1xuICAvLyAgICAgICBsZXQgcG9zaXRpb25IZWlnaHQgPSBoZWlnaHRQeCAvIHRoaXMuaGVpZ2h0ICogdGhpcy5zcGFjaW5nO1xuICAvLyAgICAgICBsZXQgcG9zaXRpb25TaXplID0gMC43NSAqIE1hdGgubWluKHBvc2l0aW9uV2lkdGgsIHBvc2l0aW9uSGVpZ2h0KTtcbiAgLy8gICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdGhpcy5jb29yZGluYXRlcztcblxuICAvLyAgICAgICB0aGlzLmFkZFBvc2l0aW9uUGxhY2Vob2xkZXJzKGRpdiwgY29vcmRpbmF0ZXMsIHBvc2l0aW9uU2l6ZSk7XG4gIC8vICAgICAgIGJyZWFrO1xuXG4gIC8vICAgICBjYXNlICdzdXJmYWNlJzpcbiAgLy8gICAgICAgLy8gdG9kb1xuICAvLyAgICAgICBicmVhaztcbiAgLy8gICB9XG5cbiAgLy8gfVxuXG4gIC8vIGFkZFBvc2l0aW9uUGxhY2Vob2xkZXJzKGRpdiwgY29vcmRpbmF0ZXMsIHNpemUpIHtcbiAgLy8gICBsZXQgY29udGFpbmVySGVpZ2h0ID0gZGl2Lm9mZnNldEhlaWdodDtcbiAgLy8gICBsZXQgY29udGFpbmVyV2lkdGggPSBkaXYub2Zmc2V0V2lkdGg7XG5cbiAgLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSsrKSB7XG4gIC8vICAgICBsZXQgcG9zaXRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgLy8gICAgIHBvc2l0aW9uLmNsYXNzTGlzdC5hZGQoJ3Bvc2l0aW9uJyk7XG5cbiAgLy8gICAgIGxldCB4T2Zmc2V0ID0gcG9zaXRpb24uY29vcmRpbmF0ZXNbMF0gKiBjb250YWluZXJXaWR0aDtcbiAgLy8gICAgIGxldCB5T2Zmc2V0ID0gcG9zaXRpb24uY29vcmRpbmF0ZXNbMV0gKiBjb250YWluZXJIZWlnaHQ7XG4gIC8vICAgICBsZXQgeEZhY3RvciA9IHBhcnNlSW50KGRpdi5kYXRhc2V0LnhmYWN0b3IpO1xuICAvLyAgICAgbGV0IHlGYWN0b3IgPSBwYXJzZUludChkaXYuZGF0YXNldC55ZmFjdG9yKTtcblxuICAvLyAgICAgcG9zaXRpb24uc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgaSk7XG4gIC8vICAgICBwb3NpdGlvbi5zdHlsZS5oZWlnaHQgPSBzaXplICsgXCJweFwiO1xuICAvLyAgICAgcG9zaXRpb24uc3R5bGUud2lkdGggPSBzaXplICsgXCJweFwiO1xuICAvLyAgICAgcG9zaXRpb25EaXYuc3R5bGUubGVmdCA9IDAuNSAqIGNvbnRhaW5lcldpZHRoIC0gKDAuNSAqIGNvbnRhaW5lcldpZHRoIC0geE9mZnNldCkgKiB4RmFjdG9yIC0gc2l6ZSAqIDAuNSArIFwicHhcIjtcbiAgLy8gICAgIHBvc2l0aW9uRGl2LnN0eWxlLnRvcCA9IDAuNSAqIGNvbnRhaW5lckhlaWdodCAtICgwLjUgKiBjb250YWluZXJIZWlnaHQgLSB5T2Zmc2V0KSAqIHlGYWN0b3IgLSBzaXplICogMC41ICsgXCJweFwiO1xuXG4gIC8vICAgICBkaXYuYXBwZW5kQ2hpbGQocG9zaXRpb24pO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGFkZFBvc2l0aW9ucyhkaXYsIHBvc2l0aW9ucywgc2l6ZSkge1xuICAvLyAgIGxldCBjb250YWluZXJIZWlnaHQgPSBkaXYub2Zmc2V0SGVpZ2h0O1xuICAvLyAgIGxldCBjb250YWluZXJXaWR0aCA9IGRpdi5vZmZzZXRXaWR0aDtcblxuICAvLyAgIGZvciAobGV0IHBvc2l0aW9uIG9mIHBvc2l0aW9ucykge1xuICAvLyAgICAgbGV0IHBvc2l0aW9uRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIC8vICAgICBwb3NpdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdwb3NpdGlvbicpO1xuICAvLyAgICAgcG9zaXRpb25EaXYuY2xhc3NMaXN0LmFkZCgncGxheWVyJyk7XG5cbiAgLy8gICAgIGxldCB4T2Zmc2V0ID0gcG9zaXRpb24uY29vcmRpbmF0ZXNbMF0gKiBjb250YWluZXJXaWR0aDtcbiAgLy8gICAgIGxldCB5T2Zmc2V0ID0gcG9zaXRpb24uY29vcmRpbmF0ZXNbMV0gKiBjb250YWluZXJIZWlnaHQ7XG4gIC8vICAgICBsZXQgeEZhY3RvciA9IHBhcnNlSW50KGRpdi5kYXRhc2V0LnhmYWN0b3IpO1xuICAvLyAgICAgbGV0IHlGYWN0b3IgPSBwYXJzZUludChkaXYuZGF0YXNldC55ZmFjdG9yKTtcblxuICAvLyAgICAgcG9zaXRpb25EaXYuc2V0QXR0cmlidXRlKCdkYXRhLWluZGV4JywgcG9zaXRpb24uaW5kZXgpO1xuICAvLyAgICAgcG9zaXRpb25EaXYuc3R5bGUuaGVpZ2h0ID0gc2l6ZSArIFwicHhcIjtcbiAgLy8gICAgIHBvc2l0aW9uRGl2LnN0eWxlLndpZHRoID0gc2l6ZSArIFwicHhcIjtcbiAgLy8gICAgIHBvc2l0aW9uRGl2LnN0eWxlLmxlZnQgPSAwLjUgKiBjb250YWluZXJXaWR0aCAtICgwLjUgKiBjb250YWluZXJXaWR0aCAtIHhPZmZzZXQpICogeEZhY3RvciAtIHNpemUgKiAwLjUgKyBcInB4XCI7XG4gIC8vICAgICBwb3NpdGlvbkRpdi5zdHlsZS50b3AgPSAwLjUgKiBjb250YWluZXJIZWlnaHQgLSAoMC41ICogY29udGFpbmVySGVpZ2h0IC0geU9mZnNldCkgKiB5RmFjdG9yIC0gc2l6ZSAqIDAuNSArIFwicHhcIjtcblxuICAvLyAgICAgZGl2LmFwcGVuZENoaWxkKHBvc2l0aW9uRGl2KTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyByZW1vdmVQb3NpdGlvbnMoZGl2LCBwb3NpdGlvbnMpIHsgLy8gVE9ETzogcmVtb3ZlIGRpdjtcbiAgLy8gICBmb3IgKGxldCBwb3NpdGlvbiBvZiBwb3NpdGlvbnMpIHtcbiAgLy8gICAgIGxldCBwb3NpdGlvbkRpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWluZGV4PVwiJyArIHBvc2l0aW9uLmluZGV4ICsgJ1wiXScpO1xuICAvLyAgICAgaWYgKCEhcG9zaXRpb25EaXYpXG4gIC8vICAgICAgIHBvc2l0aW9uRGl2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQocG9zaXRpb25EaXYpO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIHJlbW92ZUFsbFBvc2l0aW9ucyhkaXYpIHtcbiAgLy8gICBsZXQgcG9zaXRpb25zID0gZGl2LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wbGF5ZXInKTtcbiAgLy8gICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAvLyAgICAgZGl2LnJlbW92ZUNoaWxkKHBvc2l0aW9uc1tpXSk7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gYWRkQ2xhc3NUb1Bvc2l0aW9uKGRpdiwgaW5kZXgsIGNsYXNzTmFtZSkge1xuICAvLyAgIHZhciBwb3NpdGlvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkaXYuY2hpbGROb2Rlcyk7IC8vIC5jaGlsZE5vZGUgcmV0dXJucyBhIE5vZGVMaXN0XG4gIC8vICAgdmFyIHBvc2l0aW9uSW5kZXggPSBwb3NpdGlvbnMubWFwKCh0KSA9PiBwYXJzZUludCh0LmRhdGFzZXQuaW5kZXgpKS5pbmRleE9mKGluZGV4KTtcbiAgLy8gICB2YXIgcG9zaXRpb24gPSBwb3NpdGlvbnNbcG9zaXRpb25JbmRleF07XG5cbiAgLy8gICBpZiAocG9zaXRpb24pXG4gIC8vICAgICBwb3NpdGlvbi5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gIC8vIH1cblxuICAvLyByZW1vdmVDbGFzc0Zyb21Qb3NpdGlvbihkaXYsIGluZGV4LCBjbGFzc05hbWUpIHtcbiAgLy8gICB2YXIgcG9zaXRpb25zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZGl2LmNoaWxkTm9kZXMpOyAvLyAuY2hpbGROb2RlIHJldHVybnMgYSBOb2RlTGlzdFxuICAvLyAgIHZhciBwb3NpdGlvbkluZGV4ID0gcG9zaXRpb25zLm1hcCgodCkgPT4gcGFyc2VJbnQodC5kYXRhc2V0LmluZGV4KSkuaW5kZXhPZihpbmRleCk7XG4gIC8vICAgdmFyIHBvc2l0aW9uID0gcG9zaXRpb25zW3Bvc2l0aW9uSW5kZXhdO1xuXG4gIC8vICAgaWYgKHBvc2l0aW9uKVxuICAvLyAgICAgcG9zaXRpb24uY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAvLyB9XG59XG4iXX0=
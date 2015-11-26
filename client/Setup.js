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
 * (To rendering the setup graphically, see {@link ClientSpace}.)
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

    /**
     * Background image URL.
     * @type {String}
     */
    this.background = undefined;

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
//# sourceMappingURL=data:application/json;base64,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Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztTQWhIa0IsS0FBSzs7O3FCQUFMLEtBQUsiLCJmaWxlIjoic3JjL2NsaWVudC9TZXR1cC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IE1vZHVsZSBmcm9tICcuL01vZHVsZSc7XG5cblxuLyoqXG4gKiBUaGUge0BsaW5rIFNldHVwfSBtb2R1bGUgcmV0cmlldmVzIHRoZSBzZXR1cCBpbmZvcm1hdGlvbiBmcm9tIHRoZSBzZXJ2ZXIuXG4gKiBJdCBuZXZlciBoYXMgYSB2aWV3LlxuICogKFRvIHJlbmRlcmluZyB0aGUgc2V0dXAgZ3JhcGhpY2FsbHksIHNlZSB7QGxpbmsgQ2xpZW50U3BhY2V9LilcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2V0dXAgZXh0ZW5kcyBNb2R1bGUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IFtvcHRpb25zLm5hbWU9J3NldHVwJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lIHx8ICdzZXR1cCcsIGZhbHNlKTtcblxuICAgIC8qKlxuICAgICAqIFdpZHRoIG9mIHRoZSBzZXR1cCAoaW4gbWV0ZXJzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMud2lkdGggPSAxO1xuXG4gICAgLyoqXG4gICAgICogSGVpZ2h0IG9mIHRoZSBzZXR1cCAoaW4gbWV0ZXJzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuaGVpZ2h0ID0gMTtcblxuICAgIC8qKlxuICAgICAqIERlZmF1bHQgc3BhY2luZyBiZXR3ZWVuIHBvc2l0aW9ucyAoaW4gbWV0ZXJzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuc3BhY2luZyA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgcG9zaXRpb25zJyBsYWJlbHMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWxzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBBcnJheSBvZiB0aGUgcG9zaXRpb25zJyBjb29yZGluYXRlcyAoaW4gdGhlIGZvcm1hdCBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gKS5cbiAgICAgKiBAdHlwZSB7QXJyYXlbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUeXBlIG9mIHRoZSBzZXR1cCAodmFsdWVzIGN1cnJlbnRseSBzdXBwb3J0ZWQ6IGAnbWF0cml4J2AsIGAnc3VyZmFjZSdgKS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEB0b2RvIFJlbW92ZT9cbiAgICAgKi9cbiAgICB0aGlzLnR5cGUgPSB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBCYWNrZ3JvdW5kIGltYWdlIFVSTC5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IHVuZGVmaW5lZDtcblxuICAgIHRoaXMuX3hGYWN0b3IgPSAxO1xuICAgIHRoaXMuX3lGYWN0b3IgPSAxO1xuXG4gICAgdGhpcy5faW5pdCA9IHRoaXMuX2luaXQuYmluZCh0aGlzKTtcbiAgfVxuXG4gIF9pbml0KHNldHVwKSB7XG4gICAgdGhpcy53aWR0aCA9IHNldHVwLndpZHRoO1xuICAgIHRoaXMuaGVpZ2h0ID0gc2V0dXAuaGVpZ2h0O1xuICAgIHRoaXMuc3BhY2luZyA9IHNldHVwLnNwYWNpbmc7XG4gICAgdGhpcy5sYWJlbHMgPSBzZXR1cC5sYWJlbHM7XG4gICAgdGhpcy5jb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuICAgIHRoaXMudHlwZSA9IHNldHVwLnR5cGU7XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gc2V0dXAuYmFja2dyb3VuZDtcblxuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNsaWVudC5yZWNlaXZlKHRoaXMubmFtZSArICc6aW5pdCcsIHRoaXMuX2luaXQpO1xuICAgIGNsaWVudC5zZW5kKHRoaXMubmFtZSArICc6cmVxdWVzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXN0YXJ0KCkge1xuICAgIHN1cGVyLnJlc3RhcnQoKTtcbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHN1cGVyLnJlc2V0KCk7XG4gICAgY2xpZW50LnJlbW92ZUxpc3RlbmVyKHRoaXMubmFtZSArICc6aW5pdCcsIHRoaXMuX2luaXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwb3NpdGlvbnMgaW4gdGhlIHNldHVwLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IE51bWJlciBvZiBwb3NpdGlvbnMgaW4gdGhlIHNldHVwLlxuICAgKi9cbiAgZ2V0TnVtUG9zaXRpb25zKCkge1xuICAgIGlmICh0aGlzLmxhYmVscy5sZW5ndGggfHwgdGhpcy5jb29yZGluYXRlcy5sZW5ndGgpIHtcbiAgICAgIHZhciBudW1MYWJlbHMgPSB0aGlzLmxhYmVscy5sZW5ndGggfHwgSW5maW5pdHk7XG4gICAgICB2YXIgbnVtQ29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzLmxlbmd0aCB8fCBJbmZpbml0eTtcblxuICAgICAgcmV0dXJuIE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpO1xuICAgIH1cblxuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLy8gZGlzcGxheShkaXYsIG9wdGlvbnMgPSB7fSkge1xuICAvLyAgIGRpdi5jbGFzc0xpc3QuYWRkKCdzZXR1cCcpO1xuXG4gIC8vICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy50cmFuc2Zvcm0pe1xuICAvLyAgICAgc3dpdGNoIChvcHRpb25zLnRyYW5zZm9ybSkge1xuICAvLyAgICAgICBjYXNlICdyb3RhdGUxODAnOlxuICAvLyAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEteGZhY3RvcicsIC0xKTtcbiAgLy8gICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXlmYWN0b3InLCAtMSk7XG4gIC8vICAgICAgICAgYnJlYWs7XG5cbiAgLy8gICAgICAgY2FzZSAnZmxpcFgnOlxuICAvLyAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEteGZhY3RvcicsIC0xKTtcbiAgLy8gICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXlmYWN0b3InLCAxKTtcbiAgLy8gICAgICAgICBicmVhaztcblxuICAvLyAgICAgICBjYXNlICdmbGlwWSc6XG4gIC8vICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS14ZmFjdG9yJywgMSk7XG4gIC8vICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS15ZmFjdG9yJywgLTEpO1xuICAvLyAgICAgICAgIGJyZWFrO1xuXG4gIC8vICAgICAgIGRlZmF1bHQ6XG4gIC8vICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS14ZmFjdG9yJywgMSk7XG4gIC8vICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS15ZmFjdG9yJywgMSk7XG4gIC8vICAgICAgICAgYnJlYWs7XG4gIC8vICAgICB9XG4gIC8vICAgfVxuXG4gIC8vICAgbGV0IGhlaWdodFdpZHRoUmF0aW8gPSB0aGlzLmhlaWdodCAvIHRoaXMud2lkdGg7XG4gIC8vICAgbGV0IHNjcmVlbkhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgLy8gICBsZXQgc2NyZWVuV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgLy8gICBsZXQgc2NyZWVuUmF0aW8gPSBzY3JlZW5IZWlnaHQgLyBzY3JlZW5XaWR0aDtcbiAgLy8gICBsZXQgaGVpZ2h0UHgsIHdpZHRoUHg7XG5cbiAgLy8gICBpZiAoc2NyZWVuUmF0aW8gPiBoZWlnaHRXaWR0aFJhdGlvKSB7IC8vIFRPRE86IHJlZmluZSBzaXplcywgd2l0aCBjb250YWluZXIsIGV0Yy5cbiAgLy8gICAgIGhlaWdodFB4ID0gc2NyZWVuV2lkdGggKiBoZWlnaHRXaWR0aFJhdGlvO1xuICAvLyAgICAgd2lkdGhQeCA9IHNjcmVlbldpZHRoO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICBoZWlnaHRQeCA9IHNjcmVlbkhlaWdodDtcbiAgLy8gICAgIHdpZHRoUHggPSBzY3JlZW5IZWlnaHQgLyBoZWlnaHRXaWR0aFJhdGlvO1xuICAvLyAgIH1cblxuICAvLyAgIGRpdi5zdHlsZS5oZWlnaHQgPSBoZWlnaHRQeCArIFwicHhcIjtcbiAgLy8gICBkaXYuc3R5bGUud2lkdGggPSB3aWR0aFB4ICsgXCJweFwiO1xuXG4gIC8vICAgLy8gYWRkIGJhY2tncm91bmRcbiAgLy8gICBpZiAob3B0aW9ucy5zaG93QmFja2dyb3VuZCkge1xuICAvLyAgICAgZGl2LnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IGB1cmwoJHt0aGlzLmJhY2tncm91bmR9KWA7XG4gIC8vICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZFBvc2l0aW9uID0gJzUwJSA1MCUnO1xuICAvLyAgICAgZGl2LnN0eWxlLmJhY2tncm91bmRSZXBlYXQgPSAnbm8tcmVwZWF0JztcbiAgLy8gICAgIGRpdi5zdHlsZS5iYWNrZ3JvdW5kU2l6ZSA9ICdjb250YWluJztcbiAgLy8gICB9XG5cbiAgLy8gICBzd2l0Y2ggKHRoaXMudHlwZSkge1xuICAvLyAgICAgY2FzZSAnbWF0cml4JzpcbiAgLy8gICAgICAgbGV0IHBvc2l0aW9uV2lkdGggPSB3aWR0aFB4IC8gdGhpcy53aWR0aCAqIHRoaXMuc3BhY2luZztcbiAgLy8gICAgICAgbGV0IHBvc2l0aW9uSGVpZ2h0ID0gaGVpZ2h0UHggLyB0aGlzLmhlaWdodCAqIHRoaXMuc3BhY2luZztcbiAgLy8gICAgICAgbGV0IHBvc2l0aW9uU2l6ZSA9IDAuNzUgKiBNYXRoLm1pbihwb3NpdGlvbldpZHRoLCBwb3NpdGlvbkhlaWdodCk7XG4gIC8vICAgICAgIGxldCBjb29yZGluYXRlcyA9IHRoaXMuY29vcmRpbmF0ZXM7XG5cbiAgLy8gICAgICAgdGhpcy5hZGRQb3NpdGlvblBsYWNlaG9sZGVycyhkaXYsIGNvb3JkaW5hdGVzLCBwb3NpdGlvblNpemUpO1xuICAvLyAgICAgICBicmVhaztcblxuICAvLyAgICAgY2FzZSAnc3VyZmFjZSc6XG4gIC8vICAgICAgIC8vIHRvZG9cbiAgLy8gICAgICAgYnJlYWs7XG4gIC8vICAgfVxuXG4gIC8vIH1cblxuICAvLyBhZGRQb3NpdGlvblBsYWNlaG9sZGVycyhkaXYsIGNvb3JkaW5hdGVzLCBzaXplKSB7XG4gIC8vICAgbGV0IGNvbnRhaW5lckhlaWdodCA9IGRpdi5vZmZzZXRIZWlnaHQ7XG4gIC8vICAgbGV0IGNvbnRhaW5lcldpZHRoID0gZGl2Lm9mZnNldFdpZHRoO1xuXG4gIC8vICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb29yZGluYXRlcy5sZW5ndGg7IGkrKykge1xuICAvLyAgICAgbGV0IHBvc2l0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIC8vICAgICBwb3NpdGlvbi5jbGFzc0xpc3QuYWRkKCdwb3NpdGlvbicpO1xuXG4gIC8vICAgICBsZXQgeE9mZnNldCA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzWzBdICogY29udGFpbmVyV2lkdGg7XG4gIC8vICAgICBsZXQgeU9mZnNldCA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzWzFdICogY29udGFpbmVySGVpZ2h0O1xuICAvLyAgICAgbGV0IHhGYWN0b3IgPSBwYXJzZUludChkaXYuZGF0YXNldC54ZmFjdG9yKTtcbiAgLy8gICAgIGxldCB5RmFjdG9yID0gcGFyc2VJbnQoZGl2LmRhdGFzZXQueWZhY3Rvcik7XG5cbiAgLy8gICAgIHBvc2l0aW9uLnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIGkpO1xuICAvLyAgICAgcG9zaXRpb24uc3R5bGUuaGVpZ2h0ID0gc2l6ZSArIFwicHhcIjtcbiAgLy8gICAgIHBvc2l0aW9uLnN0eWxlLndpZHRoID0gc2l6ZSArIFwicHhcIjtcbiAgLy8gICAgIHBvc2l0aW9uRGl2LnN0eWxlLmxlZnQgPSAwLjUgKiBjb250YWluZXJXaWR0aCAtICgwLjUgKiBjb250YWluZXJXaWR0aCAtIHhPZmZzZXQpICogeEZhY3RvciAtIHNpemUgKiAwLjUgKyBcInB4XCI7XG4gIC8vICAgICBwb3NpdGlvbkRpdi5zdHlsZS50b3AgPSAwLjUgKiBjb250YWluZXJIZWlnaHQgLSAoMC41ICogY29udGFpbmVySGVpZ2h0IC0geU9mZnNldCkgKiB5RmFjdG9yIC0gc2l6ZSAqIDAuNSArIFwicHhcIjtcblxuICAvLyAgICAgZGl2LmFwcGVuZENoaWxkKHBvc2l0aW9uKTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyBhZGRQb3NpdGlvbnMoZGl2LCBwb3NpdGlvbnMsIHNpemUpIHtcbiAgLy8gICBsZXQgY29udGFpbmVySGVpZ2h0ID0gZGl2Lm9mZnNldEhlaWdodDtcbiAgLy8gICBsZXQgY29udGFpbmVyV2lkdGggPSBkaXYub2Zmc2V0V2lkdGg7XG5cbiAgLy8gICBmb3IgKGxldCBwb3NpdGlvbiBvZiBwb3NpdGlvbnMpIHtcbiAgLy8gICAgIGxldCBwb3NpdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAvLyAgICAgcG9zaXRpb25EaXYuY2xhc3NMaXN0LmFkZCgncG9zaXRpb24nKTtcbiAgLy8gICAgIHBvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ3BsYXllcicpO1xuXG4gIC8vICAgICBsZXQgeE9mZnNldCA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzWzBdICogY29udGFpbmVyV2lkdGg7XG4gIC8vICAgICBsZXQgeU9mZnNldCA9IHBvc2l0aW9uLmNvb3JkaW5hdGVzWzFdICogY29udGFpbmVySGVpZ2h0O1xuICAvLyAgICAgbGV0IHhGYWN0b3IgPSBwYXJzZUludChkaXYuZGF0YXNldC54ZmFjdG9yKTtcbiAgLy8gICAgIGxldCB5RmFjdG9yID0gcGFyc2VJbnQoZGl2LmRhdGFzZXQueWZhY3Rvcik7XG5cbiAgLy8gICAgIHBvc2l0aW9uRGl2LnNldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcsIHBvc2l0aW9uLmluZGV4KTtcbiAgLy8gICAgIHBvc2l0aW9uRGl2LnN0eWxlLmhlaWdodCA9IHNpemUgKyBcInB4XCI7XG4gIC8vICAgICBwb3NpdGlvbkRpdi5zdHlsZS53aWR0aCA9IHNpemUgKyBcInB4XCI7XG4gIC8vICAgICBwb3NpdGlvbkRpdi5zdHlsZS5sZWZ0ID0gMC41ICogY29udGFpbmVyV2lkdGggLSAoMC41ICogY29udGFpbmVyV2lkdGggLSB4T2Zmc2V0KSAqIHhGYWN0b3IgLSBzaXplICogMC41ICsgXCJweFwiO1xuICAvLyAgICAgcG9zaXRpb25EaXYuc3R5bGUudG9wID0gMC41ICogY29udGFpbmVySGVpZ2h0IC0gKDAuNSAqIGNvbnRhaW5lckhlaWdodCAtIHlPZmZzZXQpICogeUZhY3RvciAtIHNpemUgKiAwLjUgKyBcInB4XCI7XG5cbiAgLy8gICAgIGRpdi5hcHBlbmRDaGlsZChwb3NpdGlvbkRpdik7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gcmVtb3ZlUG9zaXRpb25zKGRpdiwgcG9zaXRpb25zKSB7IC8vIFRPRE86IHJlbW92ZSBkaXY7XG4gIC8vICAgZm9yIChsZXQgcG9zaXRpb24gb2YgcG9zaXRpb25zKSB7XG4gIC8vICAgICBsZXQgcG9zaXRpb25EaXYgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1pbmRleD1cIicgKyBwb3NpdGlvbi5pbmRleCArICdcIl0nKTtcbiAgLy8gICAgIGlmICghIXBvc2l0aW9uRGl2KVxuICAvLyAgICAgICBwb3NpdGlvbkRpdi5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHBvc2l0aW9uRGl2KTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyByZW1vdmVBbGxQb3NpdGlvbnMoZGl2KSB7XG4gIC8vICAgbGV0IHBvc2l0aW9ucyA9IGRpdi5xdWVyeVNlbGVjdG9yQWxsKCcucGxheWVyJyk7XG4gIC8vICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgLy8gICAgIGRpdi5yZW1vdmVDaGlsZChwb3NpdGlvbnNbaV0pO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIGFkZENsYXNzVG9Qb3NpdGlvbihkaXYsIGluZGV4LCBjbGFzc05hbWUpIHtcbiAgLy8gICB2YXIgcG9zaXRpb25zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZGl2LmNoaWxkTm9kZXMpOyAvLyAuY2hpbGROb2RlIHJldHVybnMgYSBOb2RlTGlzdFxuICAvLyAgIHZhciBwb3NpdGlvbkluZGV4ID0gcG9zaXRpb25zLm1hcCgodCkgPT4gcGFyc2VJbnQodC5kYXRhc2V0LmluZGV4KSkuaW5kZXhPZihpbmRleCk7XG4gIC8vICAgdmFyIHBvc2l0aW9uID0gcG9zaXRpb25zW3Bvc2l0aW9uSW5kZXhdO1xuXG4gIC8vICAgaWYgKHBvc2l0aW9uKVxuICAvLyAgICAgcG9zaXRpb24uY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAvLyB9XG5cbiAgLy8gcmVtb3ZlQ2xhc3NGcm9tUG9zaXRpb24oZGl2LCBpbmRleCwgY2xhc3NOYW1lKSB7XG4gIC8vICAgdmFyIHBvc2l0aW9ucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRpdi5jaGlsZE5vZGVzKTsgLy8gLmNoaWxkTm9kZSByZXR1cm5zIGEgTm9kZUxpc3RcbiAgLy8gICB2YXIgcG9zaXRpb25JbmRleCA9IHBvc2l0aW9ucy5tYXAoKHQpID0+IHBhcnNlSW50KHQuZGF0YXNldC5pbmRleCkpLmluZGV4T2YoaW5kZXgpO1xuICAvLyAgIHZhciBwb3NpdGlvbiA9IHBvc2l0aW9uc1twb3NpdGlvbkluZGV4XTtcblxuICAvLyAgIGlmIChwb3NpdGlvbilcbiAgLy8gICAgIHBvc2l0aW9uLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgLy8gfVxufVxuIl19
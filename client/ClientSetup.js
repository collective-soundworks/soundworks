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
 * The {@link ClientSetup} module retrieves the setup information from the server.
 * It never has a view.
 * (To rendering the setup graphically, see {@link ClientSpace}.)
 */

var ClientSetup = (function (_Module) {
  _inherits(ClientSetup, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [options.name='setup'] Name of the module.
   */

  function ClientSetup() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ClientSetup);

    _get(Object.getPrototypeOf(ClientSetup.prototype), 'constructor', this).call(this, options.name || 'setup', false);

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

  _createClass(ClientSetup, [{
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
      _get(Object.getPrototypeOf(ClientSetup.prototype), 'start', this).call(this);

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
      _get(Object.getPrototypeOf(ClientSetup.prototype), 'restart', this).call(this);
      this.done();
    }

    /**
     * Resets the module.
     * @private
     */
  }, {
    key: 'reset',
    value: function reset() {
      _get(Object.getPrototypeOf(ClientSetup.prototype), 'reset', this).call(this);
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

  return ClientSetup;
})(_Module3['default']);

exports['default'] = ClientSetup;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7O0lBUVIsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7O0FBTW5CLFdBTlEsV0FBVyxHQU1KO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxXQUFXOztBQU81QiwrQkFQaUIsV0FBVyw2Q0FPdEIsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUUsS0FBSyxFQUFFOzs7Ozs7QUFNdEMsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFNaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBT3RCLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7O0FBRTVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDOztBQUVsQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BDOztlQXhEa0IsV0FBVzs7V0EwRHpCLGVBQUMsS0FBSyxFQUFFO0FBQ1gsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3pCLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUMzQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUNyQyxVQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDdkIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDOztBQUVuQyxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7Ozs7Ozs7V0FNSSxpQkFBRztBQUNOLGlDQTNFaUIsV0FBVyx1Q0EyRWQ7O0FBRWQsMEJBQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCwwQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsQ0FBQztLQUNyQzs7Ozs7Ozs7V0FNTSxtQkFBRztBQUNSLGlDQXRGaUIsV0FBVyx5Q0FzRlo7QUFDaEIsVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7Ozs7Ozs7O1dBTUksaUJBQUc7QUFDTixpQ0EvRmlCLFdBQVcsdUNBK0ZkO0FBQ2QsMEJBQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN4RDs7Ozs7Ozs7V0FNYywyQkFBRztBQUNoQixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ2pELFlBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQztBQUMvQyxZQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUM7O0FBRXpELGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7T0FDNUM7O0FBRUQsYUFBTyxDQUFDLENBQUM7S0FDVjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7U0FoSGtCLFdBQVc7OztxQkFBWCxXQUFXIiwiZmlsZSI6InNyYy9jbGllbnQvQ2xpZW50U2V0dXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBDbGllbnRTZXR1cH0gbW9kdWxlIHJldHJpZXZlcyB0aGUgc2V0dXAgaW5mb3JtYXRpb24gZnJvbSB0aGUgc2VydmVyLlxuICogSXQgbmV2ZXIgaGFzIGEgdmlldy5cbiAqIChUbyByZW5kZXJpbmcgdGhlIHNldHVwIGdyYXBoaWNhbGx5LCBzZWUge0BsaW5rIENsaWVudFNwYWNlfS4pXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudFNldHVwIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbb3B0aW9ucy5uYW1lPSdzZXR1cCddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc2V0dXAnLCBmYWxzZSk7XG5cbiAgICAvKipcbiAgICAgKiBXaWR0aCBvZiB0aGUgc2V0dXAgKGluIG1ldGVycykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLndpZHRoID0gMTtcblxuICAgIC8qKlxuICAgICAqIEhlaWdodCBvZiB0aGUgc2V0dXAgKGluIG1ldGVycykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmhlaWdodCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBEZWZhdWx0IHNwYWNpbmcgYmV0d2VlbiBwb3NpdGlvbnMgKGluIG1ldGVycykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnNwYWNpbmcgPSAxO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgdGhlIHBvc2l0aW9ucycgbGFiZWxzLlxuICAgICAqIEB0eXBlIHtTdHJpbmdbXX1cbiAgICAgKi9cbiAgICB0aGlzLmxhYmVscyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogQXJyYXkgb2YgdGhlIHBvc2l0aW9ucycgY29vcmRpbmF0ZXMgKGluIHRoZSBmb3JtYXQgYFt4Ok51bWJlciwgeTpOdW1iZXJdYCkuXG4gICAgICogQHR5cGUge0FycmF5W119XG4gICAgICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogVHlwZSBvZiB0aGUgc2V0dXAgKHZhbHVlcyBjdXJyZW50bHkgc3VwcG9ydGVkOiBgJ21hdHJpeCdgLCBgJ3N1cmZhY2UnYCkuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAdG9kbyBSZW1vdmU/XG4gICAgICovXG4gICAgdGhpcy50eXBlID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogQmFja2dyb3VuZCBpbWFnZSBVUkwuXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmJhY2tncm91bmQgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLl94RmFjdG9yID0gMTtcbiAgICB0aGlzLl95RmFjdG9yID0gMTtcblxuICAgIHRoaXMuX2luaXQgPSB0aGlzLl9pbml0LmJpbmQodGhpcyk7XG4gIH1cblxuICBfaW5pdChzZXR1cCkge1xuICAgIHRoaXMud2lkdGggPSBzZXR1cC53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IHNldHVwLmhlaWdodDtcbiAgICB0aGlzLnNwYWNpbmcgPSBzZXR1cC5zcGFjaW5nO1xuICAgIHRoaXMubGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcbiAgICB0aGlzLnR5cGUgPSBzZXR1cC50eXBlO1xuICAgIHRoaXMuYmFja2dyb3VuZCA9IHNldHVwLmJhY2tncm91bmQ7XG5cbiAgICB0aGlzLmRvbmUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjbGllbnQucmVjZWl2ZSh0aGlzLm5hbWUgKyAnOmluaXQnLCB0aGlzLl9pbml0KTtcbiAgICBjbGllbnQuc2VuZCh0aGlzLm5hbWUgKyAnOnJlcXVlc3QnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXN0YXJ0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzdGFydCgpIHtcbiAgICBzdXBlci5yZXN0YXJ0KCk7XG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBzdXBlci5yZXNldCgpO1xuICAgIGNsaWVudC5yZW1vdmVMaXN0ZW5lcih0aGlzLm5hbWUgKyAnOmluaXQnLCB0aGlzLl9pbml0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgcG9zaXRpb25zIGluIHRoZSBzZXR1cC5cbiAgICogQHJldHVybiB7TnVtYmVyfSBOdW1iZXIgb2YgcG9zaXRpb25zIGluIHRoZSBzZXR1cC5cbiAgICovXG4gIGdldE51bVBvc2l0aW9ucygpIHtcbiAgICBpZiAodGhpcy5sYWJlbHMubGVuZ3RoIHx8IHRoaXMuY29vcmRpbmF0ZXMubGVuZ3RoKSB7XG4gICAgICB2YXIgbnVtTGFiZWxzID0gdGhpcy5sYWJlbHMubGVuZ3RoIHx8IEluZmluaXR5O1xuICAgICAgdmFyIG51bUNvb3JkaW5hdGVzID0gdGhpcy5jb29yZGluYXRlcy5sZW5ndGggfHwgSW5maW5pdHk7XG5cbiAgICAgIHJldHVybiBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIGRpc3BsYXkoZGl2LCBvcHRpb25zID0ge30pIHtcbiAgLy8gICBkaXYuY2xhc3NMaXN0LmFkZCgnc2V0dXAnKTtcblxuICAvLyAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMudHJhbnNmb3JtKXtcbiAgLy8gICAgIHN3aXRjaCAob3B0aW9ucy50cmFuc2Zvcm0pIHtcbiAgLy8gICAgICAgY2FzZSAncm90YXRlMTgwJzpcbiAgLy8gICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXhmYWN0b3InLCAtMSk7XG4gIC8vICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS15ZmFjdG9yJywgLTEpO1xuICAvLyAgICAgICAgIGJyZWFrO1xuXG4gIC8vICAgICAgIGNhc2UgJ2ZsaXBYJzpcbiAgLy8gICAgICAgICBkaXYuc2V0QXR0cmlidXRlKCdkYXRhLXhmYWN0b3InLCAtMSk7XG4gIC8vICAgICAgICAgZGl2LnNldEF0dHJpYnV0ZSgnZGF0YS15ZmFjdG9yJywgMSk7XG4gIC8vICAgICAgICAgYnJlYWs7XG5cbiAgLy8gICAgICAgY2FzZSAnZmxpcFknOlxuICAvLyAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEteGZhY3RvcicsIDEpO1xuICAvLyAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEteWZhY3RvcicsIC0xKTtcbiAgLy8gICAgICAgICBicmVhaztcblxuICAvLyAgICAgICBkZWZhdWx0OlxuICAvLyAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEteGZhY3RvcicsIDEpO1xuICAvLyAgICAgICAgIGRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEteWZhY3RvcicsIDEpO1xuICAvLyAgICAgICAgIGJyZWFrO1xuICAvLyAgICAgfVxuICAvLyAgIH1cblxuICAvLyAgIGxldCBoZWlnaHRXaWR0aFJhdGlvID0gdGhpcy5oZWlnaHQgLyB0aGlzLndpZHRoO1xuICAvLyAgIGxldCBzY3JlZW5IZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIC8vICAgbGV0IHNjcmVlbldpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIC8vICAgbGV0IHNjcmVlblJhdGlvID0gc2NyZWVuSGVpZ2h0IC8gc2NyZWVuV2lkdGg7XG4gIC8vICAgbGV0IGhlaWdodFB4LCB3aWR0aFB4O1xuXG4gIC8vICAgaWYgKHNjcmVlblJhdGlvID4gaGVpZ2h0V2lkdGhSYXRpbykgeyAvLyBUT0RPOiByZWZpbmUgc2l6ZXMsIHdpdGggY29udGFpbmVyLCBldGMuXG4gIC8vICAgICBoZWlnaHRQeCA9IHNjcmVlbldpZHRoICogaGVpZ2h0V2lkdGhSYXRpbztcbiAgLy8gICAgIHdpZHRoUHggPSBzY3JlZW5XaWR0aDtcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgaGVpZ2h0UHggPSBzY3JlZW5IZWlnaHQ7XG4gIC8vICAgICB3aWR0aFB4ID0gc2NyZWVuSGVpZ2h0IC8gaGVpZ2h0V2lkdGhSYXRpbztcbiAgLy8gICB9XG5cbiAgLy8gICBkaXYuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0UHggKyBcInB4XCI7XG4gIC8vICAgZGl2LnN0eWxlLndpZHRoID0gd2lkdGhQeCArIFwicHhcIjtcblxuICAvLyAgIC8vIGFkZCBiYWNrZ3JvdW5kXG4gIC8vICAgaWYgKG9wdGlvbnMuc2hvd0JhY2tncm91bmQpIHtcbiAgLy8gICAgIGRpdi5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSBgdXJsKCR7dGhpcy5iYWNrZ3JvdW5kfSlgO1xuICAvLyAgICAgZGl2LnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9ICc1MCUgNTAlJztcbiAgLy8gICAgIGRpdi5zdHlsZS5iYWNrZ3JvdW5kUmVwZWF0ID0gJ25vLXJlcGVhdCc7XG4gIC8vICAgICBkaXYuc3R5bGUuYmFja2dyb3VuZFNpemUgPSAnY29udGFpbic7XG4gIC8vICAgfVxuXG4gIC8vICAgc3dpdGNoICh0aGlzLnR5cGUpIHtcbiAgLy8gICAgIGNhc2UgJ21hdHJpeCc6XG4gIC8vICAgICAgIGxldCBwb3NpdGlvbldpZHRoID0gd2lkdGhQeCAvIHRoaXMud2lkdGggKiB0aGlzLnNwYWNpbmc7XG4gIC8vICAgICAgIGxldCBwb3NpdGlvbkhlaWdodCA9IGhlaWdodFB4IC8gdGhpcy5oZWlnaHQgKiB0aGlzLnNwYWNpbmc7XG4gIC8vICAgICAgIGxldCBwb3NpdGlvblNpemUgPSAwLjc1ICogTWF0aC5taW4ocG9zaXRpb25XaWR0aCwgcG9zaXRpb25IZWlnaHQpO1xuICAvLyAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzO1xuXG4gIC8vICAgICAgIHRoaXMuYWRkUG9zaXRpb25QbGFjZWhvbGRlcnMoZGl2LCBjb29yZGluYXRlcywgcG9zaXRpb25TaXplKTtcbiAgLy8gICAgICAgYnJlYWs7XG5cbiAgLy8gICAgIGNhc2UgJ3N1cmZhY2UnOlxuICAvLyAgICAgICAvLyB0b2RvXG4gIC8vICAgICAgIGJyZWFrO1xuICAvLyAgIH1cblxuICAvLyB9XG5cbiAgLy8gYWRkUG9zaXRpb25QbGFjZWhvbGRlcnMoZGl2LCBjb29yZGluYXRlcywgc2l6ZSkge1xuICAvLyAgIGxldCBjb250YWluZXJIZWlnaHQgPSBkaXYub2Zmc2V0SGVpZ2h0O1xuICAvLyAgIGxldCBjb250YWluZXJXaWR0aCA9IGRpdi5vZmZzZXRXaWR0aDtcblxuICAvLyAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29vcmRpbmF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgLy8gICAgIGxldCBwb3NpdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAvLyAgICAgcG9zaXRpb24uY2xhc3NMaXN0LmFkZCgncG9zaXRpb24nKTtcblxuICAvLyAgICAgbGV0IHhPZmZzZXQgPSBwb3NpdGlvbi5jb29yZGluYXRlc1swXSAqIGNvbnRhaW5lcldpZHRoO1xuICAvLyAgICAgbGV0IHlPZmZzZXQgPSBwb3NpdGlvbi5jb29yZGluYXRlc1sxXSAqIGNvbnRhaW5lckhlaWdodDtcbiAgLy8gICAgIGxldCB4RmFjdG9yID0gcGFyc2VJbnQoZGl2LmRhdGFzZXQueGZhY3Rvcik7XG4gIC8vICAgICBsZXQgeUZhY3RvciA9IHBhcnNlSW50KGRpdi5kYXRhc2V0LnlmYWN0b3IpO1xuXG4gIC8vICAgICBwb3NpdGlvbi5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBpKTtcbiAgLy8gICAgIHBvc2l0aW9uLnN0eWxlLmhlaWdodCA9IHNpemUgKyBcInB4XCI7XG4gIC8vICAgICBwb3NpdGlvbi5zdHlsZS53aWR0aCA9IHNpemUgKyBcInB4XCI7XG4gIC8vICAgICBwb3NpdGlvbkRpdi5zdHlsZS5sZWZ0ID0gMC41ICogY29udGFpbmVyV2lkdGggLSAoMC41ICogY29udGFpbmVyV2lkdGggLSB4T2Zmc2V0KSAqIHhGYWN0b3IgLSBzaXplICogMC41ICsgXCJweFwiO1xuICAvLyAgICAgcG9zaXRpb25EaXYuc3R5bGUudG9wID0gMC41ICogY29udGFpbmVySGVpZ2h0IC0gKDAuNSAqIGNvbnRhaW5lckhlaWdodCAtIHlPZmZzZXQpICogeUZhY3RvciAtIHNpemUgKiAwLjUgKyBcInB4XCI7XG5cbiAgLy8gICAgIGRpdi5hcHBlbmRDaGlsZChwb3NpdGlvbik7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gYWRkUG9zaXRpb25zKGRpdiwgcG9zaXRpb25zLCBzaXplKSB7XG4gIC8vICAgbGV0IGNvbnRhaW5lckhlaWdodCA9IGRpdi5vZmZzZXRIZWlnaHQ7XG4gIC8vICAgbGV0IGNvbnRhaW5lcldpZHRoID0gZGl2Lm9mZnNldFdpZHRoO1xuXG4gIC8vICAgZm9yIChsZXQgcG9zaXRpb24gb2YgcG9zaXRpb25zKSB7XG4gIC8vICAgICBsZXQgcG9zaXRpb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgLy8gICAgIHBvc2l0aW9uRGl2LmNsYXNzTGlzdC5hZGQoJ3Bvc2l0aW9uJyk7XG4gIC8vICAgICBwb3NpdGlvbkRpdi5jbGFzc0xpc3QuYWRkKCdwbGF5ZXInKTtcblxuICAvLyAgICAgbGV0IHhPZmZzZXQgPSBwb3NpdGlvbi5jb29yZGluYXRlc1swXSAqIGNvbnRhaW5lcldpZHRoO1xuICAvLyAgICAgbGV0IHlPZmZzZXQgPSBwb3NpdGlvbi5jb29yZGluYXRlc1sxXSAqIGNvbnRhaW5lckhlaWdodDtcbiAgLy8gICAgIGxldCB4RmFjdG9yID0gcGFyc2VJbnQoZGl2LmRhdGFzZXQueGZhY3Rvcik7XG4gIC8vICAgICBsZXQgeUZhY3RvciA9IHBhcnNlSW50KGRpdi5kYXRhc2V0LnlmYWN0b3IpO1xuXG4gIC8vICAgICBwb3NpdGlvbkRpdi5zZXRBdHRyaWJ1dGUoJ2RhdGEtaW5kZXgnLCBwb3NpdGlvbi5pbmRleCk7XG4gIC8vICAgICBwb3NpdGlvbkRpdi5zdHlsZS5oZWlnaHQgPSBzaXplICsgXCJweFwiO1xuICAvLyAgICAgcG9zaXRpb25EaXYuc3R5bGUud2lkdGggPSBzaXplICsgXCJweFwiO1xuICAvLyAgICAgcG9zaXRpb25EaXYuc3R5bGUubGVmdCA9IDAuNSAqIGNvbnRhaW5lcldpZHRoIC0gKDAuNSAqIGNvbnRhaW5lcldpZHRoIC0geE9mZnNldCkgKiB4RmFjdG9yIC0gc2l6ZSAqIDAuNSArIFwicHhcIjtcbiAgLy8gICAgIHBvc2l0aW9uRGl2LnN0eWxlLnRvcCA9IDAuNSAqIGNvbnRhaW5lckhlaWdodCAtICgwLjUgKiBjb250YWluZXJIZWlnaHQgLSB5T2Zmc2V0KSAqIHlGYWN0b3IgLSBzaXplICogMC41ICsgXCJweFwiO1xuXG4gIC8vICAgICBkaXYuYXBwZW5kQ2hpbGQocG9zaXRpb25EaXYpO1xuICAvLyAgIH1cbiAgLy8gfVxuXG4gIC8vIHJlbW92ZVBvc2l0aW9ucyhkaXYsIHBvc2l0aW9ucykgeyAvLyBUT0RPOiByZW1vdmUgZGl2O1xuICAvLyAgIGZvciAobGV0IHBvc2l0aW9uIG9mIHBvc2l0aW9ucykge1xuICAvLyAgICAgbGV0IHBvc2l0aW9uRGl2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtaW5kZXg9XCInICsgcG9zaXRpb24uaW5kZXggKyAnXCJdJyk7XG4gIC8vICAgICBpZiAoISFwb3NpdGlvbkRpdilcbiAgLy8gICAgICAgcG9zaXRpb25EaXYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChwb3NpdGlvbkRpdik7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLy8gcmVtb3ZlQWxsUG9zaXRpb25zKGRpdikge1xuICAvLyAgIGxldCBwb3NpdGlvbnMgPSBkaXYucXVlcnlTZWxlY3RvckFsbCgnLnBsYXllcicpO1xuICAvLyAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gIC8vICAgICBkaXYucmVtb3ZlQ2hpbGQocG9zaXRpb25zW2ldKTtcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvLyBhZGRDbGFzc1RvUG9zaXRpb24oZGl2LCBpbmRleCwgY2xhc3NOYW1lKSB7XG4gIC8vICAgdmFyIHBvc2l0aW9ucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRpdi5jaGlsZE5vZGVzKTsgLy8gLmNoaWxkTm9kZSByZXR1cm5zIGEgTm9kZUxpc3RcbiAgLy8gICB2YXIgcG9zaXRpb25JbmRleCA9IHBvc2l0aW9ucy5tYXAoKHQpID0+IHBhcnNlSW50KHQuZGF0YXNldC5pbmRleCkpLmluZGV4T2YoaW5kZXgpO1xuICAvLyAgIHZhciBwb3NpdGlvbiA9IHBvc2l0aW9uc1twb3NpdGlvbkluZGV4XTtcblxuICAvLyAgIGlmIChwb3NpdGlvbilcbiAgLy8gICAgIHBvc2l0aW9uLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgLy8gfVxuXG4gIC8vIHJlbW92ZUNsYXNzRnJvbVBvc2l0aW9uKGRpdiwgaW5kZXgsIGNsYXNzTmFtZSkge1xuICAvLyAgIHZhciBwb3NpdGlvbnMgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChkaXYuY2hpbGROb2Rlcyk7IC8vIC5jaGlsZE5vZGUgcmV0dXJucyBhIE5vZGVMaXN0XG4gIC8vICAgdmFyIHBvc2l0aW9uSW5kZXggPSBwb3NpdGlvbnMubWFwKCh0KSA9PiBwYXJzZUludCh0LmRhdGFzZXQuaW5kZXgpKS5pbmRleE9mKGluZGV4KTtcbiAgLy8gICB2YXIgcG9zaXRpb24gPSBwb3NpdGlvbnNbcG9zaXRpb25JbmRleF07XG5cbiAgLy8gICBpZiAocG9zaXRpb24pXG4gIC8vICAgICBwb3NpdGlvbi5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gIC8vIH1cbn1cbiJdfQ==
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

      this.receive('init', this._init);
      this.send('request');
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
      this.removeListener('init', this._init);
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
  }]);

  return ClientSetup;
})(_Module3['default']);

exports['default'] = ClientSetup;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50U2V0dXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFBbUIsVUFBVTs7Ozt1QkFDVixVQUFVOzs7Ozs7Ozs7O0lBUVIsV0FBVztZQUFYLFdBQVc7Ozs7Ozs7O0FBTW5CLFdBTlEsV0FBVyxHQU1KO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxXQUFXOztBQU81QiwrQkFQaUIsV0FBVyw2Q0FPdEIsT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLEVBQUUsS0FBSyxFQUFFOzs7Ozs7QUFNdEMsUUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1mLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFNaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1qQixRQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWpCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBT3RCLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDOzs7Ozs7QUFNdEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7O0FBRTVCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDOztBQUVsQixRQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ3BDOztlQXhEa0IsV0FBVzs7V0EwRHpCLGVBQUMsS0FBSyxFQUFFO0FBQ1gsVUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO0FBQ3pCLFVBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUMzQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztBQUNyQyxVQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDdkIsVUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDOztBQUVuQyxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7Ozs7Ozs7V0FNSSxpQkFBRztBQUNOLGlDQTNFaUIsV0FBVyx1Q0EyRWQ7O0FBRWQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ2pDLFVBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDdEI7Ozs7Ozs7O1dBTU0sbUJBQUc7QUFDUixpQ0F0RmlCLFdBQVcseUNBc0ZaO0FBQ2hCLFVBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNiOzs7Ozs7OztXQU1JLGlCQUFHO0FBQ04saUNBL0ZpQixXQUFXLHVDQStGZDtBQUNkLFVBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUN6Qzs7Ozs7Ozs7V0FNYywyQkFBRztBQUNoQixVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ2pELFlBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQztBQUMvQyxZQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sSUFBSSxRQUFRLENBQUM7O0FBRXpELGVBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsY0FBYyxDQUFDLENBQUM7T0FDNUM7O0FBRUQsYUFBTyxDQUFDLENBQUM7S0FDVjs7O1NBaEhrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiJzcmMvY2xpZW50L0NsaWVudFNldHVwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgQ2xpZW50U2V0dXB9IG1vZHVsZSByZXRyaWV2ZXMgdGhlIHNldHVwIGluZm9ybWF0aW9uIGZyb20gdGhlIHNlcnZlci5cbiAqIEl0IG5ldmVyIGhhcyBhIHZpZXcuXG4gKiAoVG8gcmVuZGVyaW5nIHRoZSBzZXR1cCBncmFwaGljYWxseSwgc2VlIHtAbGluayBDbGllbnRTcGFjZX0uKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnRTZXR1cCBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW29wdGlvbnMubmFtZT0nc2V0dXAnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3NldHVwJywgZmFsc2UpO1xuXG4gICAgLyoqXG4gICAgICogV2lkdGggb2YgdGhlIHNldHVwIChpbiBtZXRlcnMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy53aWR0aCA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBIZWlnaHQgb2YgdGhlIHNldHVwIChpbiBtZXRlcnMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5oZWlnaHQgPSAxO1xuXG4gICAgLyoqXG4gICAgICogRGVmYXVsdCBzcGFjaW5nIGJldHdlZW4gcG9zaXRpb25zIChpbiBtZXRlcnMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5zcGFjaW5nID0gMTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHRoZSBwb3NpdGlvbnMnIGxhYmVscy5cbiAgICAgKiBAdHlwZSB7U3RyaW5nW119XG4gICAgICovXG4gICAgdGhpcy5sYWJlbHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIEFycmF5IG9mIHRoZSBwb3NpdGlvbnMnIGNvb3JkaW5hdGVzIChpbiB0aGUgZm9ybWF0IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWApLlxuICAgICAqIEB0eXBlIHtBcnJheVtdfVxuICAgICAqL1xuICAgIHRoaXMuY29vcmRpbmF0ZXMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFR5cGUgb2YgdGhlIHNldHVwICh2YWx1ZXMgY3VycmVudGx5IHN1cHBvcnRlZDogYCdtYXRyaXgnYCwgYCdzdXJmYWNlJ2ApLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICogQHRvZG8gUmVtb3ZlP1xuICAgICAqL1xuICAgIHRoaXMudHlwZSA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIEJhY2tncm91bmQgaW1hZ2UgVVJMLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5feEZhY3RvciA9IDE7XG4gICAgdGhpcy5feUZhY3RvciA9IDE7XG5cbiAgICB0aGlzLl9pbml0ID0gdGhpcy5faW5pdC5iaW5kKHRoaXMpO1xuICB9XG5cbiAgX2luaXQoc2V0dXApIHtcbiAgICB0aGlzLndpZHRoID0gc2V0dXAud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBzZXR1cC5oZWlnaHQ7XG4gICAgdGhpcy5zcGFjaW5nID0gc2V0dXAuc3BhY2luZztcbiAgICB0aGlzLmxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICB0aGlzLmNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgdGhpcy50eXBlID0gc2V0dXAudHlwZTtcbiAgICB0aGlzLmJhY2tncm91bmQgPSBzZXR1cC5iYWNrZ3JvdW5kO1xuXG4gICAgdGhpcy5kb25lKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnRzIHRoZSBtb2R1bGUuXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5yZWNlaXZlKCdpbml0JywgdGhpcy5faW5pdCk7XG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0Jyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzdGFydHMgdGhlIG1vZHVsZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc3RhcnQoKSB7XG4gICAgc3VwZXIucmVzdGFydCgpO1xuICAgIHRoaXMuZG9uZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgbW9kdWxlLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgc3VwZXIucmVzZXQoKTtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdpbml0JywgdGhpcy5faW5pdCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIHBvc2l0aW9ucyBpbiB0aGUgc2V0dXAuXG4gICAqIEByZXR1cm4ge051bWJlcn0gTnVtYmVyIG9mIHBvc2l0aW9ucyBpbiB0aGUgc2V0dXAuXG4gICAqL1xuICBnZXROdW1Qb3NpdGlvbnMoKSB7XG4gICAgaWYgKHRoaXMubGFiZWxzLmxlbmd0aCB8fCB0aGlzLmNvb3JkaW5hdGVzLmxlbmd0aCkge1xuICAgICAgdmFyIG51bUxhYmVscyA9IHRoaXMubGFiZWxzLmxlbmd0aCB8fCBJbmZpbml0eTtcbiAgICAgIHZhciBudW1Db29yZGluYXRlcyA9IHRoaXMuY29vcmRpbmF0ZXMubGVuZ3RoIHx8IEluZmluaXR5O1xuXG4gICAgICByZXR1cm4gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cbiJdfQ==
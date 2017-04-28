'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * API of a compliant view for the `locator` service.
 *
 * @memberof module:soundworks/client
 * @interface AbstractLocatorView
 * @extends module:soundworks/client.AbstractView
 * @abstract
 */
/**
 * Set and display the `area` definition (as defined in server configuration).
 *
 * @name setArea
 * @memberof module:soundworks/client.AbstractLocatorView
 * @function
 * @abstract
 * @instance
 *
 * @param {Object} area - Area defintion as declared in server configuration.
 * @param {Number} area.width - With of the area.
 * @param {Number} area.height - Height of the area.
 * @param {Number} [area.labels=[]] - Labels of the position.
 * @param {Number} [area.coordinates=[]] - Coordinates of the area.
 */
/**
 * Register the callback to be executed when the user select a position.
 *
 * @name setSelectCallback
 * @memberof module:soundworks/client.AbstractLocatorView
 * @function
 * @abstract
 * @instance
 *
 * @param {selectCallback} callback - Callback to be executed
 *  when a position is selected. This callback should be called with the `index`,
 * `label` and `coordinates` of the requested position.
 */

/**
 * Callback to execute when the user select a position.
 *
 * @callback
 * @name selectCallback
 * @memberof module:soundworks/client.AbstractLocatorView
 * @param {Number} index - Index of the selected location.
 * @param {String} label - Label of the selected location if any.
 * @param {Array<Number>} coordinates - Coordinates (`[x, y]`) of the selected
 *  location if any.
 */

var SERVICE_ID = 'service:locator';

/**
 * Interface for the client `'locator'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'placer'`]{@link module:soundworks/client.Placer}
 * and [`'checkin'`]{@link module:soundworks/client.Checkin} services.
 *
 * The `'locator'` service allows a client to give its approximate location inside
 * a graphical representation of the `area` as defined in the server's `setup`
 * configuration member.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Locator}*__
 *
 * @see {@link module:soundworks/client.Placer}
 * @see {@link module:soundworks/client.Checkin}
 *
 * @param {Object} options
 * @param {Boolean} [options.random=false] - Defines whether the location is
 *  set randomly (mainly for development purposes).
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.locator = this.require('locator');
 */

var Locator = function (_Service) {
  (0, _inherits3.default)(Locator, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Locator() {
    (0, _classCallCheck3.default)(this, Locator);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Locator.__proto__ || (0, _getPrototypeOf2.default)(Locator)).call(this, SERVICE_ID, true));

    var defaults = {
      random: false,
      viewPriority: 6
    };

    _this.configure(defaults);

    _this._sharedConfig = _this.require('shared-config');

    _this._onAknowledgeResponse = _this._onAknowledgeResponse.bind(_this);
    _this._sendCoordinates = _this._sendCoordinates.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Locator, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(Locator.prototype.__proto__ || (0, _getPrototypeOf2.default)(Locator.prototype), 'start', this).call(this);
      this.show();

      this.send('request');
      this.receive('acknowledge', this._onAknowledgeResponse);
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(Locator.prototype.__proto__ || (0, _getPrototypeOf2.default)(Locator.prototype), 'stop', this).call(this);
      this.removeListener('acknowledge', this._onAknowledgeResponse);
      this.hide();
    }

    /**
     * @private
     * @param {Object} areaConfigPath - Path to the area in the configuration.
     */

  }, {
    key: '_onAknowledgeResponse',
    value: function _onAknowledgeResponse(areaConfigPath) {
      if (this.options.random) {
        var x = Math.random() * area.width;
        var y = Math.random() * area.height;
        this._sendCoordinates(x, y);
      } else {
        var _area = this._sharedConfig.get(areaConfigPath);
        this.view.setArea(_area);
        this.view.setSelectCallback(this._sendCoordinates);
      }
    }

    /**
     * Send coordinates to the server.
     * @private
     * @param {Number} x - The `x` coordinate of the client.
     * @param {Number} y - The `y` coordinate of the client.
     */

  }, {
    key: '_sendCoordinates',
    value: function _sendCoordinates(x, y) {
      _client2.default.coordinates = [x, y];

      this.send('coordinates', _client2.default.coordinates);
      this.ready();
    }
  }]);
  return Locator;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Locator);

exports.default = Locator;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkxvY2F0b3IuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkxvY2F0b3IiLCJkZWZhdWx0cyIsInJhbmRvbSIsInZpZXdQcmlvcml0eSIsImNvbmZpZ3VyZSIsIl9zaGFyZWRDb25maWciLCJyZXF1aXJlIiwiX29uQWtub3dsZWRnZVJlc3BvbnNlIiwiYmluZCIsIl9zZW5kQ29vcmRpbmF0ZXMiLCJzaG93Iiwic2VuZCIsInJlY2VpdmUiLCJyZW1vdmVMaXN0ZW5lciIsImhpZGUiLCJhcmVhQ29uZmlnUGF0aCIsIm9wdGlvbnMiLCJ4IiwiTWF0aCIsImFyZWEiLCJ3aWR0aCIsInkiLCJoZWlnaHQiLCJnZXQiLCJ2aWV3Iiwic2V0QXJlYSIsInNldFNlbGVjdENhbGxiYWNrIiwiY29vcmRpbmF0ZXMiLCJyZWFkeSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7OztBQVFBOzs7Ozs7Ozs7Ozs7Ozs7QUFlQTs7Ozs7Ozs7Ozs7Ozs7QUFjQTs7Ozs7Ozs7Ozs7O0FBWUEsSUFBTUEsYUFBYSxpQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBeUJNQyxPOzs7QUFDSjtBQUNBLHFCQUFjO0FBQUE7O0FBQUEsd0lBQ05ELFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1FLFdBQVc7QUFDZkMsY0FBUSxLQURPO0FBRWZDLG9CQUFjO0FBRkMsS0FBakI7O0FBS0EsVUFBS0MsU0FBTCxDQUFlSCxRQUFmOztBQUVBLFVBQUtJLGFBQUwsR0FBcUIsTUFBS0MsT0FBTCxDQUFhLGVBQWIsQ0FBckI7O0FBRUEsVUFBS0MscUJBQUwsR0FBNkIsTUFBS0EscUJBQUwsQ0FBMkJDLElBQTNCLE9BQTdCO0FBQ0EsVUFBS0MsZ0JBQUwsR0FBd0IsTUFBS0EsZ0JBQUwsQ0FBc0JELElBQXRCLE9BQXhCO0FBYlk7QUFjYjs7QUFFRDs7Ozs7NEJBQ1E7QUFDTjtBQUNBLFdBQUtFLElBQUw7O0FBRUEsV0FBS0MsSUFBTCxDQUFVLFNBQVY7QUFDQSxXQUFLQyxPQUFMLENBQWEsYUFBYixFQUE0QixLQUFLTCxxQkFBakM7QUFDRDs7QUFFRDs7OzsyQkFDTztBQUNMO0FBQ0EsV0FBS00sY0FBTCxDQUFvQixhQUFwQixFQUFtQyxLQUFLTixxQkFBeEM7QUFDQSxXQUFLTyxJQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7MENBSXNCQyxjLEVBQWdCO0FBQ3BDLFVBQUksS0FBS0MsT0FBTCxDQUFhZCxNQUFqQixFQUF5QjtBQUN2QixZQUFNZSxJQUFJQyxLQUFLaEIsTUFBTCxLQUFnQmlCLEtBQUtDLEtBQS9CO0FBQ0EsWUFBTUMsSUFBSUgsS0FBS2hCLE1BQUwsS0FBZ0JpQixLQUFLRyxNQUEvQjtBQUNBLGFBQUtiLGdCQUFMLENBQXNCUSxDQUF0QixFQUF5QkksQ0FBekI7QUFDRCxPQUpELE1BSU87QUFDTCxZQUFNRixRQUFPLEtBQUtkLGFBQUwsQ0FBbUJrQixHQUFuQixDQUF1QlIsY0FBdkIsQ0FBYjtBQUNBLGFBQUtTLElBQUwsQ0FBVUMsT0FBVixDQUFrQk4sS0FBbEI7QUFDQSxhQUFLSyxJQUFMLENBQVVFLGlCQUFWLENBQTRCLEtBQUtqQixnQkFBakM7QUFDRDtBQUNGOztBQUVEOzs7Ozs7Ozs7cUNBTWlCUSxDLEVBQUdJLEMsRUFBRztBQUNyQix1QkFBT00sV0FBUCxHQUFxQixDQUFDVixDQUFELEVBQUlJLENBQUosQ0FBckI7O0FBRUEsV0FBS1YsSUFBTCxDQUFVLGFBQVYsRUFBeUIsaUJBQU9nQixXQUFoQztBQUNBLFdBQUtDLEtBQUw7QUFDRDs7Ozs7QUFHSCx5QkFBZUMsUUFBZixDQUF3QjlCLFVBQXhCLEVBQW9DQyxPQUFwQzs7a0JBRWVBLE8iLCJmaWxlIjoiTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi4vY29yZS9jbGllbnQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuLyoqXG4gKiBBUEkgb2YgYSBjb21wbGlhbnQgdmlldyBmb3IgdGhlIGBsb2NhdG9yYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBpbnRlcmZhY2UgQWJzdHJhY3RMb2NhdG9yVmlld1xuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFic3RyYWN0Vmlld1xuICogQGFic3RyYWN0XG4gKi9cbi8qKlxuICogU2V0IGFuZCBkaXNwbGF5IHRoZSBgYXJlYWAgZGVmaW5pdGlvbiAoYXMgZGVmaW5lZCBpbiBzZXJ2ZXIgY29uZmlndXJhdGlvbikuXG4gKlxuICogQG5hbWUgc2V0QXJlYVxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdExvY2F0b3JWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGFyZWEgLSBBcmVhIGRlZmludGlvbiBhcyBkZWNsYXJlZCBpbiBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLndpZHRoIC0gV2l0aCBvZiB0aGUgYXJlYS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBhcmVhLmhlaWdodCAtIEhlaWdodCBvZiB0aGUgYXJlYS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbYXJlYS5sYWJlbHM9W11dIC0gTGFiZWxzIG9mIHRoZSBwb3NpdGlvbi5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbYXJlYS5jb29yZGluYXRlcz1bXV0gLSBDb29yZGluYXRlcyBvZiB0aGUgYXJlYS5cbiAqL1xuLyoqXG4gKiBSZWdpc3RlciB0aGUgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGUgdXNlciBzZWxlY3QgYSBwb3NpdGlvbi5cbiAqXG4gKiBAbmFtZSBzZXRTZWxlY3RDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdExvY2F0b3JWaWV3XG4gKiBAZnVuY3Rpb25cbiAqIEBhYnN0cmFjdFxuICogQGluc3RhbmNlXG4gKlxuICogQHBhcmFtIHtzZWxlY3RDYWxsYmFja30gY2FsbGJhY2sgLSBDYWxsYmFjayB0byBiZSBleGVjdXRlZFxuICogIHdoZW4gYSBwb3NpdGlvbiBpcyBzZWxlY3RlZC4gVGhpcyBjYWxsYmFjayBzaG91bGQgYmUgY2FsbGVkIHdpdGggdGhlIGBpbmRleGAsXG4gKiBgbGFiZWxgIGFuZCBgY29vcmRpbmF0ZXNgIG9mIHRoZSByZXF1ZXN0ZWQgcG9zaXRpb24uXG4gKi9cblxuLyoqXG4gKiBDYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIHVzZXIgc2VsZWN0IGEgcG9zaXRpb24uXG4gKlxuICogQGNhbGxiYWNrXG4gKiBAbmFtZSBzZWxlY3RDYWxsYmFja1xuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BYnN0cmFjdExvY2F0b3JWaWV3XG4gKiBAcGFyYW0ge051bWJlcn0gaW5kZXggLSBJbmRleCBvZiB0aGUgc2VsZWN0ZWQgbG9jYXRpb24uXG4gKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBMYWJlbCBvZiB0aGUgc2VsZWN0ZWQgbG9jYXRpb24gaWYgYW55LlxuICogQHBhcmFtIHtBcnJheTxOdW1iZXI+fSBjb29yZGluYXRlcyAtIENvb3JkaW5hdGVzIChgW3gsIHldYCkgb2YgdGhlIHNlbGVjdGVkXG4gKiAgbG9jYXRpb24gaWYgYW55LlxuICovXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpsb2NhdG9yJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdsb2NhdG9yJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgb25lIG9mIHRoZSBwcm92aWRlZCBzZXJ2aWNlcyBhaW1lZCBhdCBpZGVudGlmeWluZyBjbGllbnRzIGluc2lkZVxuICogdGhlIGV4cGVyaWVuY2UgYWxvbmcgd2l0aCB0aGUgW2AncGxhY2VyJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5QbGFjZXJ9XG4gKiBhbmQgW2AnY2hlY2tpbidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQ2hlY2tpbn0gc2VydmljZXMuXG4gKlxuICogVGhlIGAnbG9jYXRvcidgIHNlcnZpY2UgYWxsb3dzIGEgY2xpZW50IHRvIGdpdmUgaXRzIGFwcHJveGltYXRlIGxvY2F0aW9uIGluc2lkZVxuICogYSBncmFwaGljYWwgcmVwcmVzZW50YXRpb24gb2YgdGhlIGBhcmVhYCBhcyBkZWZpbmVkIGluIHRoZSBzZXJ2ZXIncyBgc2V0dXBgXG4gKiBjb25maWd1cmF0aW9uIG1lbWJlci5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuUGxhY2VyfVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkNoZWNraW59XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnNcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmFuZG9tPWZhbHNlXSAtIERlZmluZXMgd2hldGhlciB0aGUgbG9jYXRpb24gaXNcbiAqICBzZXQgcmFuZG9tbHkgKG1haW5seSBmb3IgZGV2ZWxvcG1lbnQgcHVycG9zZXMpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubG9jYXRvciA9IHRoaXMucmVxdWlyZSgnbG9jYXRvcicpO1xuICovXG5jbGFzcyBMb2NhdG9yIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHJhbmRvbTogZmFsc2UsXG4gICAgICB2aWV3UHJpb3JpdHk6IDYsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuXG4gICAgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UgPSB0aGlzLl9vbkFrbm93bGVkZ2VSZXNwb25zZS5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyA9IHRoaXMuX3NlbmRDb29yZGluYXRlcy5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgdGhpcy5zaG93KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnKTtcbiAgICB0aGlzLnJlY2VpdmUoJ2Fja25vd2xlZGdlJywgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoJ2Fja25vd2xlZGdlJywgdGhpcy5fb25Ba25vd2xlZGdlUmVzcG9uc2UpO1xuICAgIHRoaXMuaGlkZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhcmVhQ29uZmlnUGF0aCAtIFBhdGggdG8gdGhlIGFyZWEgaW4gdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqL1xuICBfb25Ba25vd2xlZGdlUmVzcG9uc2UoYXJlYUNvbmZpZ1BhdGgpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLnJhbmRvbSkge1xuICAgICAgY29uc3QgeCA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLndpZHRoO1xuICAgICAgY29uc3QgeSA9IE1hdGgucmFuZG9tKCkgKiBhcmVhLmhlaWdodDtcbiAgICAgIHRoaXMuX3NlbmRDb29yZGluYXRlcyh4LCB5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXJlYSA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQoYXJlYUNvbmZpZ1BhdGgpO1xuICAgICAgdGhpcy52aWV3LnNldEFyZWEoYXJlYSk7XG4gICAgICB0aGlzLnZpZXcuc2V0U2VsZWN0Q2FsbGJhY2sodGhpcy5fc2VuZENvb3JkaW5hdGVzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBjb29yZGluYXRlcyB0byB0aGUgc2VydmVyLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0geCAtIFRoZSBgeGAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge051bWJlcn0geSAtIFRoZSBgeWAgY29vcmRpbmF0ZSBvZiB0aGUgY2xpZW50LlxuICAgKi9cbiAgX3NlbmRDb29yZGluYXRlcyh4LCB5KSB7XG4gICAgY2xpZW50LmNvb3JkaW5hdGVzID0gW3gsIHldO1xuXG4gICAgdGhpcy5zZW5kKCdjb29yZGluYXRlcycsIGNsaWVudC5jb29yZGluYXRlcyk7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIExvY2F0b3IpO1xuXG5leHBvcnQgZGVmYXVsdCBMb2NhdG9yO1xuIl19
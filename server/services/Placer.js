'use strict';

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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _helpers = require('../../utils/helpers');

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:placer';
var maxCapacity = 9999;

/**
 * Interface of the server `'placer'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/server.Locator}
 * and [`'checkin'`]{@link module:soundworks/server.Checkin} services.
 *
 * The placer service is suited for situations where the experience has a set of
 * predefined places (located or not) and shall refuse clients when all places
 * are already associated with a client.
 * The definition of the capacity, maximum clients per available positions,
 * optionnal labels and coordinates used by the service, must be defined in the
 * `setup` entry of the server configuration and must follow the format specified
 * in {@link module:soundworks/server.appConfig.setup}. If no labels are provided
 * the service generate incrementals numbers matching the given capacity.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Placer}*__
 *
 * @see {@link module:soundworks/server.Locator}
 * @see {@link module:soundworks/server.Checkin}
 *
 * @memberof module:soundworks/server
 * @example
 * // initialize the server with a custom setup
 * const setup = {
 *   capacity: 8,
 *   labels: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
 * };
 * soundworks.server.init({ setup });
 *
 * // inside the experience constructor
 * this.placer = this.require('placer');
 */

var Placer = function (_Activity) {
  (0, _inherits3.default)(Placer, _Activity);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Placer() {
    (0, _classCallCheck3.default)(this, Placer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Placer).call(this, SERVICE_ID));

    var defaults = {
      setupConfigItem: 'setup'
    };

    _this.configure(defaults);
    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Placer, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Placer.prototype), 'start', this).call(this);

      var setupConfigItem = this.options.setupConfigItem;

      /**
       * Setup defining dimensions and predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = this._sharedConfigService.get(setupConfigItem);

      if (!this.setup.maxClientsPerPosition) this.setup.maxClientsPerPosition = 1;

      /**
       * Maximum number of places.
       * @type {Number}
       */
      this.capacity = (0, _helpers.getOpt)(this.setup.capacity, Infinity, 1);

      if (this.setup) {
        var setup = this.setup;
        var maxClientsPerPosition = setup.maxClientsPerPosition;
        var numLabels = setup.labels ? setup.labels.length : Infinity;
        var numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
        var numPositions = Math.min(numLabels, numCoordinates) * maxClientsPerPosition;

        if (this.capacity > numPositions) this.capacity = numPositions;
      }

      if (this.capacity > maxCapacity) this.capacity = maxCapacity;

      /**
       * List of clients checked in with corresponing indices.
       * @type {Object<Number, Array>}
       */
      this.clients = {};

      /**
       * Number of connected clients.
       * @type {Number}
       */
      this.numClients = 0;

      /**
       * List of the indexes of the disabled positions.
       * @type {Array}
       */
      this.disabledPositions = [];

      // update config capacity with computed one
      this.setup.capacity = this.capacity;

      // add path to shared config requirements for all client type
      this.clientTypes.forEach(function (clientType) {
        _this2._sharedConfigService.share(setupConfigItem, clientType);
      });
    }

    /**
     * Store the client in a given position.
     * @private
     * @param {Number} positionIndex - Index of chosen position.
     * @param {Object} client - Client associated to the position.
     * @returns {Boolean} - `true` if succeed, `false` if not.
     */

  }, {
    key: '_storeClientPosition',
    value: function _storeClientPosition(positionIndex, client) {
      if (!this.clients[positionIndex]) this.clients[positionIndex] = [];

      var list = this.clients[positionIndex];

      if (list.length < this.setup.maxClientsPerPosition && this.numClients < this.capacity) {
        list.push(client);
        this.numClients += 1;

        // if last available place for this position, lock it
        if (list.length >= this.setup.maxClientsPerPosition) this.disabledPositions.push(positionIndex);

        return true;
      }

      return false;
    }

    /**
     * Remove the client from a given position.
     * @private
     * @param {Number} positionIndex - Index of chosen position.
     * @param {Object} client - Client associated to the position.
     */

  }, {
    key: '_removeClientPosition',
    value: function _removeClientPosition(positionIndex, client) {
      var list = this.clients[positionIndex] || [];
      var clientIndex = list.indexOf(client);

      if (clientIndex !== -1) {
        list.splice(clientIndex, 1);
        // check if the list was marked as disabled
        if (list.length < this.setup.maxClientsPerPosition) {
          var disabledIndex = this.disabledPositions.indexOf(positionIndex);

          if (disabledIndex !== -1) this.disabledPositions.splice(disabledIndex, 1);
        }

        this.numClients -= 1;
      }
    }

    /** @private */

  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this3 = this;

      return function () {
        var setupConfigItem = _this3.options.setupConfigItem;
        var disabledPositions = _this3.disabledPositions;
        // aknowledge
        if (_this3.numClients < _this3.setup.capacity) _this3.send(client, 'aknowlegde', setupConfigItem, disabledPositions);else _this3.send('reject', disabledPositions);
      };
    }

    /** @private */

  }, {
    key: '_onPosition',
    value: function _onPosition(client) {
      var _this4 = this;

      return function (index, label, coordinates) {
        var success = _this4._storeClientPosition(index, client);

        if (success) {
          client.index = index;
          client.label = label;
          client.coordinates = coordinates;

          _this4.send(client, 'confirm', index, label, coordinates);
          // @todo - check if something more subtile than a broadcast can be done.
          _this4.broadcast(null, client, 'client-joined', _this4.disabledPositions);
        } else {
          _this4.send(client, 'reject', _this4.disabledPositions);
        }
      };
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Placer.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'position', this._onPosition(client));
    }

    /** @private */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Placer.prototype), 'disconnect', this).call(this, client);

      this._removeClientPosition(client.index, client);
      // @todo - check if something more subtile than a broadcast can be done.
      this.broadcast(null, client, 'client-leaved', this.disabledPositions);
    }
  }]);
  return Placer;
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, Placer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBsYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFFQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGdCQUFuQjtBQUNBLElBQU0sY0FBYyxJQUFwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUNNLE07Ozs7O0FBRUosb0JBQWM7QUFBQTs7QUFBQSxnSEFDTixVQURNOztBQUdaLFFBQU0sV0FBVztBQUNmLHVCQUFpQjtBQURGLEtBQWpCOztBQUlBLFVBQUssU0FBTCxDQUFlLFFBQWY7QUFDQSxVQUFLLG9CQUFMLEdBQTRCLE1BQUssT0FBTCxDQUFhLGVBQWIsQ0FBNUI7QUFSWTtBQVNiOzs7Ozs7OzRCQUdPO0FBQUE7O0FBQ047O0FBRUEsVUFBTSxrQkFBa0IsS0FBSyxPQUFMLENBQWEsZUFBckM7Ozs7OztBQU1BLFdBQUssS0FBTCxHQUFhLEtBQUssb0JBQUwsQ0FBMEIsR0FBMUIsQ0FBOEIsZUFBOUIsQ0FBYjs7QUFFQSxVQUFJLENBQUMsS0FBSyxLQUFMLENBQVcscUJBQWhCLEVBQ0UsS0FBSyxLQUFMLENBQVcscUJBQVgsR0FBbUMsQ0FBbkM7Ozs7OztBQU1GLFdBQUssUUFBTCxHQUFnQixxQkFBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixFQUE0QixRQUE1QixFQUFzQyxDQUF0QyxDQUFoQjs7QUFFQSxVQUFJLEtBQUssS0FBVCxFQUFnQjtBQUNkLFlBQU0sUUFBUSxLQUFLLEtBQW5CO0FBQ0EsWUFBTSx3QkFBd0IsTUFBTSxxQkFBcEM7QUFDQSxZQUFNLFlBQVksTUFBTSxNQUFOLEdBQWUsTUFBTSxNQUFOLENBQWEsTUFBNUIsR0FBcUMsUUFBdkQ7QUFDQSxZQUFNLGlCQUFpQixNQUFNLFdBQU4sR0FBb0IsTUFBTSxXQUFOLENBQWtCLE1BQXRDLEdBQStDLFFBQXRFO0FBQ0EsWUFBTSxlQUFlLEtBQUssR0FBTCxDQUFTLFNBQVQsRUFBb0IsY0FBcEIsSUFBc0MscUJBQTNEOztBQUVBLFlBQUksS0FBSyxRQUFMLEdBQWdCLFlBQXBCLEVBQ0UsS0FBSyxRQUFMLEdBQWdCLFlBQWhCO0FBQ0g7O0FBRUQsVUFBSSxLQUFLLFFBQUwsR0FBZ0IsV0FBcEIsRUFDRSxLQUFLLFFBQUwsR0FBZ0IsV0FBaEI7Ozs7OztBQU1GLFdBQUssT0FBTCxHQUFlLEVBQWY7Ozs7OztBQU1BLFdBQUssVUFBTCxHQUFrQixDQUFsQjs7Ozs7O0FBTUEsV0FBSyxpQkFBTCxHQUF5QixFQUF6Qjs7O0FBR0EsV0FBSyxLQUFMLENBQVcsUUFBWCxHQUFzQixLQUFLLFFBQTNCOzs7QUFHQSxXQUFLLFdBQUwsQ0FBaUIsT0FBakIsQ0FBeUIsVUFBQyxVQUFELEVBQWdCO0FBQ3ZDLGVBQUssb0JBQUwsQ0FBMEIsS0FBMUIsQ0FBZ0MsZUFBaEMsRUFBaUQsVUFBakQ7QUFDRCxPQUZEO0FBR0Q7Ozs7Ozs7Ozs7Ozt5Q0FTb0IsYSxFQUFlLE0sRUFBUTtBQUMxQyxVQUFJLENBQUMsS0FBSyxPQUFMLENBQWEsYUFBYixDQUFMLEVBQ0UsS0FBSyxPQUFMLENBQWEsYUFBYixJQUE4QixFQUE5Qjs7QUFFRixVQUFNLE9BQU8sS0FBSyxPQUFMLENBQWEsYUFBYixDQUFiOztBQUVBLFVBQUksS0FBSyxNQUFMLEdBQWMsS0FBSyxLQUFMLENBQVcscUJBQXpCLElBQ0EsS0FBSyxVQUFMLEdBQWtCLEtBQUssUUFEM0IsRUFFRTtBQUNBLGFBQUssSUFBTCxDQUFVLE1BQVY7QUFDQSxhQUFLLFVBQUwsSUFBbUIsQ0FBbkI7OztBQUdBLFlBQUksS0FBSyxNQUFMLElBQWUsS0FBSyxLQUFMLENBQVcscUJBQTlCLEVBQ0UsS0FBSyxpQkFBTCxDQUF1QixJQUF2QixDQUE0QixhQUE1Qjs7QUFFRixlQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQVA7QUFDRDs7Ozs7Ozs7Ozs7MENBUXFCLGEsRUFBZSxNLEVBQVE7QUFDM0MsVUFBTSxPQUFPLEtBQUssT0FBTCxDQUFhLGFBQWIsS0FBK0IsRUFBNUM7QUFDQSxVQUFNLGNBQWMsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFwQjs7QUFFQSxVQUFJLGdCQUFnQixDQUFDLENBQXJCLEVBQXdCO0FBQ3RCLGFBQUssTUFBTCxDQUFZLFdBQVosRUFBeUIsQ0FBekI7O0FBRUEsWUFBSSxLQUFLLE1BQUwsR0FBYyxLQUFLLEtBQUwsQ0FBVyxxQkFBN0IsRUFBb0Q7QUFDbEQsY0FBTSxnQkFBZ0IsS0FBSyxpQkFBTCxDQUF1QixPQUF2QixDQUErQixhQUEvQixDQUF0Qjs7QUFFQSxjQUFJLGtCQUFrQixDQUFDLENBQXZCLEVBQ0UsS0FBSyxpQkFBTCxDQUF1QixNQUF2QixDQUE4QixhQUE5QixFQUE2QyxDQUE3QztBQUNIOztBQUVELGFBQUssVUFBTCxJQUFtQixDQUFuQjtBQUNEO0FBQ0Y7Ozs7OzsrQkFHVSxNLEVBQVE7QUFBQTs7QUFDakIsYUFBTyxZQUFNO0FBQ1gsWUFBTSxrQkFBa0IsT0FBSyxPQUFMLENBQWEsZUFBckM7QUFDQSxZQUFNLG9CQUFvQixPQUFLLGlCQUEvQjs7QUFFQSxZQUFJLE9BQUssVUFBTCxHQUFrQixPQUFLLEtBQUwsQ0FBVyxRQUFqQyxFQUNFLE9BQUssSUFBTCxDQUFVLE1BQVYsRUFBa0IsWUFBbEIsRUFBZ0MsZUFBaEMsRUFBaUQsaUJBQWpELEVBREYsS0FHRSxPQUFLLElBQUwsQ0FBVSxRQUFWLEVBQW9CLGlCQUFwQjtBQUNILE9BUkQ7QUFTRDs7Ozs7O2dDQUdXLE0sRUFBUTtBQUFBOztBQUNsQixhQUFPLFVBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxXQUFmLEVBQStCO0FBQ3BDLFlBQU0sVUFBVSxPQUFLLG9CQUFMLENBQTBCLEtBQTFCLEVBQWlDLE1BQWpDLENBQWhCOztBQUVBLFlBQUksT0FBSixFQUFhO0FBQ1gsaUJBQU8sS0FBUCxHQUFlLEtBQWY7QUFDQSxpQkFBTyxLQUFQLEdBQWUsS0FBZjtBQUNBLGlCQUFPLFdBQVAsR0FBcUIsV0FBckI7O0FBRUEsaUJBQUssSUFBTCxDQUFVLE1BQVYsRUFBa0IsU0FBbEIsRUFBNkIsS0FBN0IsRUFBb0MsS0FBcEMsRUFBMkMsV0FBM0M7O0FBRUEsaUJBQUssU0FBTCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsZUFBN0IsRUFBOEMsT0FBSyxpQkFBbkQ7QUFDRCxTQVJELE1BUU87QUFDTCxpQkFBSyxJQUFMLENBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QixPQUFLLGlCQUFqQztBQUNEO0FBQ0YsT0FkRDtBQWVEOzs7Ozs7NEJBR08sTSxFQUFRO0FBQ2Qsc0dBQWMsTUFBZDs7QUFFQSxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFNBQXJCLEVBQWdDLEtBQUssVUFBTCxDQUFnQixNQUFoQixDQUFoQztBQUNBLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsVUFBckIsRUFBaUMsS0FBSyxXQUFMLENBQWlCLE1BQWpCLENBQWpDO0FBQ0Q7Ozs7OzsrQkFHVSxNLEVBQVE7QUFDakIseUdBQWlCLE1BQWpCOztBQUVBLFdBQUsscUJBQUwsQ0FBMkIsT0FBTyxLQUFsQyxFQUF5QyxNQUF6Qzs7QUFFQSxXQUFLLFNBQUwsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQTZCLGVBQTdCLEVBQThDLEtBQUssaUJBQW5EO0FBQ0Q7Ozs7O0FBR0gseUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxNQUFwQyIsImZpbGUiOiJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcblxuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGFjZXInO1xuY29uc3QgbWF4Q2FwYWNpdHkgPSA5OTk5O1xuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgc2VydmVyIGAncGxhY2VyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgaXMgb25lIG9mIHRoZSBwcm92aWRlZCBzZXJ2aWNlcyBhaW1lZCBhdCBpZGVudGlmeWluZyBjbGllbnRzIGluc2lkZVxuICogdGhlIGV4cGVyaWVuY2UgYWxvbmcgd2l0aCB0aGUgW2AnbG9jYXRvcidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn1cbiAqIGFuZCBbYCdjaGVja2luJ2Bde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufSBzZXJ2aWNlcy5cbiAqXG4gKiBUaGUgcGxhY2VyIHNlcnZpY2UgaXMgc3VpdGVkIGZvciBzaXR1YXRpb25zIHdoZXJlIHRoZSBleHBlcmllbmNlIGhhcyBhIHNldCBvZlxuICogcHJlZGVmaW5lZCBwbGFjZXMgKGxvY2F0ZWQgb3Igbm90KSBhbmQgc2hhbGwgcmVmdXNlIGNsaWVudHMgd2hlbiBhbGwgcGxhY2VzXG4gKiBhcmUgYWxyZWFkeSBhc3NvY2lhdGVkIHdpdGggYSBjbGllbnQuXG4gKiBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgY2FwYWNpdHksIG1heGltdW0gY2xpZW50cyBwZXIgYXZhaWxhYmxlIHBvc2l0aW9ucyxcbiAqIG9wdGlvbm5hbCBsYWJlbHMgYW5kIGNvb3JkaW5hdGVzIHVzZWQgYnkgdGhlIHNlcnZpY2UsIG11c3QgYmUgZGVmaW5lZCBpbiB0aGVcbiAqIGBzZXR1cGAgZW50cnkgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGFuZCBtdXN0IGZvbGxvdyB0aGUgZm9ybWF0IHNwZWNpZmllZFxuICogaW4ge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5hcHBDb25maWcuc2V0dXB9LiBJZiBubyBsYWJlbHMgYXJlIHByb3ZpZGVkXG4gKiB0aGUgc2VydmljZSBnZW5lcmF0ZSBpbmNyZW1lbnRhbHMgbnVtYmVycyBtYXRjaGluZyB0aGUgZ2l2ZW4gY2FwYWNpdHkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufVxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCBhIGN1c3RvbSBzZXR1cFxuICogY29uc3Qgc2V0dXAgPSB7XG4gKiAgIGNhcGFjaXR5OiA4LFxuICogICBsYWJlbHM6IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJ10sXG4gKiB9O1xuICogc291bmR3b3Jrcy5zZXJ2ZXIuaW5pdCh7IHNldHVwIH0pO1xuICpcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5wbGFjZXIgPSB0aGlzLnJlcXVpcmUoJ3BsYWNlcicpO1xuICovXG5jbGFzcyBQbGFjZXIgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNldHVwQ29uZmlnSXRlbTogJ3NldHVwJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3Qgc2V0dXBDb25maWdJdGVtID0gdGhpcy5vcHRpb25zLnNldHVwQ29uZmlnSXRlbTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldChzZXR1cENvbmZpZ0l0ZW0pO1xuXG4gICAgaWYgKCF0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgIHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMTtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5zZXR1cC5jYXBhY2l0eSwgSW5maW5pdHksIDEpO1xuXG4gICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgIGNvbnN0IG1heENsaWVudHNQZXJQb3NpdGlvbiA9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbjtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpICogbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG1heENhcGFjaXR5KVxuICAgICAgdGhpcy5jYXBhY2l0eSA9IG1heENhcGFjaXR5O1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBjbGllbnRzIGNoZWNrZWQgaW4gd2l0aCBjb3JyZXNwb25pbmcgaW5kaWNlcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0PE51bWJlciwgQXJyYXk+fVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTnVtYmVyIG9mIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5udW1DbGllbnRzID0gMDtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuXG4gICAgLy8gdXBkYXRlIGNvbmZpZyBjYXBhY2l0eSB3aXRoIGNvbXB1dGVkIG9uZVxuICAgIHRoaXMuc2V0dXAuY2FwYWNpdHkgPSB0aGlzLmNhcGFjaXR5O1xuXG4gICAgLy8gYWRkIHBhdGggdG8gc2hhcmVkIGNvbmZpZyByZXF1aXJlbWVudHMgZm9yIGFsbCBjbGllbnQgdHlwZVxuICAgIHRoaXMuY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5zaGFyZShzZXR1cENvbmZpZ0l0ZW0sIGNsaWVudFR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIHRoZSBjbGllbnQgaW4gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uSW5kZXggLSBJbmRleCBvZiBjaG9zZW4gcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGllbnQgLSBDbGllbnQgYXNzb2NpYXRlZCB0byB0aGUgcG9zaXRpb24uXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSAtIGB0cnVlYCBpZiBzdWNjZWVkLCBgZmFsc2VgIGlmIG5vdC5cbiAgICovXG4gIF9zdG9yZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGlmICghdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdKVxuICAgICAgdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdID0gW107XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoIDwgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24gJiZcbiAgICAgICAgdGhpcy5udW1DbGllbnRzIDwgdGhpcy5jYXBhY2l0eVxuICAgICkge1xuICAgICAgbGlzdC5wdXNoKGNsaWVudCk7XG4gICAgICB0aGlzLm51bUNsaWVudHMgKz0gMTtcblxuICAgICAgLy8gaWYgbGFzdCBhdmFpbGFibGUgcGxhY2UgZm9yIHRoaXMgcG9zaXRpb24sIGxvY2sgaXRcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA+PSB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb25JbmRleCAtIEluZGV4IG9mIGNob3NlbiBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNsaWVudCAtIENsaWVudCBhc3NvY2lhdGVkIHRvIHRoZSBwb3NpdGlvbi5cbiAgICovXG4gIF9yZW1vdmVDbGllbnRQb3NpdGlvbihwb3NpdGlvbkluZGV4LCBjbGllbnQpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdIHx8wqBbXTtcbiAgICBjb25zdCBjbGllbnRJbmRleCA9IGxpc3QuaW5kZXhPZihjbGllbnQpO1xuXG4gICAgaWYgKGNsaWVudEluZGV4ICE9PSAtMSkge1xuICAgICAgbGlzdC5zcGxpY2UoY2xpZW50SW5kZXgsIDEpO1xuICAgICAgLy8gY2hlY2sgaWYgdGhlIGxpc3Qgd2FzIG1hcmtlZCBhcyBkaXNhYmxlZFxuICAgICAgaWYgKGxpc3QubGVuZ3RoIDwgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgZGlzYWJsZWRJbmRleCA9IHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbkluZGV4KTtcblxuICAgICAgICBpZiAoZGlzYWJsZWRJbmRleCAhPT0gLTEpXG4gICAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5zcGxpY2UoZGlzYWJsZWRJbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubnVtQ2xpZW50cyAtPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBzZXR1cENvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuc2V0dXBDb25maWdJdGVtO1xuICAgICAgY29uc3QgZGlzYWJsZWRQb3NpdGlvbnMgPSB0aGlzLmRpc2FibGVkUG9zaXRpb25zO1xuICAgICAgLy8gYWtub3dsZWRnZVxuICAgICAgaWYgKHRoaXMubnVtQ2xpZW50cyA8IHRoaXMuc2V0dXAuY2FwYWNpdHkpXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdha25vd2xlZ2RlJywgc2V0dXBDb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VuZCgncmVqZWN0JywgZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvbihjbGllbnQpIHtcbiAgICByZXR1cm4gKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLl9zdG9yZUNsaWVudFBvc2l0aW9uKGluZGV4LCBjbGllbnQpO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgY2xpZW50LmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maXJtJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lLlxuICAgICAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtam9pbmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVqZWN0JywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvbihjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMuX3JlbW92ZUNsaWVudFBvc2l0aW9uKGNsaWVudC5pbmRleCwgY2xpZW50KTtcbiAgICAvLyBAdG9kbyAtIGNoZWNrIGlmIHNvbWV0aGluZyBtb3JlIHN1YnRpbGUgdGhhbiBhIGJyb2FkY2FzdCBjYW4gYmUgZG9uZS5cbiAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtbGVhdmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhY2VyKTtcbiJdfQ==
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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _helpers = require('../../utils/helpers');

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:placer';
var maxCapacity = 9999;

/**
 * Interface for the server `'placer'` service.
 *
 * This service is one of the provided services aimed at identifying clients inside
 * the experience along with the [`'locator'`]{@link module:soundworks/server.Locator}
 * and [`'checkin'`]{@link module:soundworks/server.Checkin} services.
 *
 * The placer service is well-suited for situations where the experience has a set of
 * predefined places (located or not) and shall refuse clients when all places
 * are already assigned to a client.
 * The capacity, maximum clients per available positions, optionnal labels
 * and coordinates used by the service, should be defined in the `setup`
 * entry of the server configuration and must follow the format specified in
 * {@link module:soundworks/server.appConfig.setup}. If no label is provided
 * the service will generate incremental numbers matching the given capacity.
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

var Placer = function (_Service) {
  (0, _inherits3.default)(Placer, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Placer() {
    (0, _classCallCheck3.default)(this, Placer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Placer).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'setup'
    };

    _this.configure(defaults);
    _this._sharedConfig = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Placer, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Placer.prototype), 'start', this).call(this);
      var configItem = this.options.configItem;

      /**
       * Setup defining dimensions and predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = this._sharedConfig.get(configItem);

      if (this.setup === null) throw new Error('"service:placer": server.config.' + configItem + ' is not defined');

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
       * List of clients checked in with corresponding indices.
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
        _this2._sharedConfig.share(_this2.options.configItem, clientType);
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
        var configItem = _this3.options.configItem;
        var disabledPositions = _this3.disabledPositions;
        // aknowledge
        if (_this3.numClients < _this3.setup.capacity) _this3.send(client, 'aknowlegde', configItem, disabledPositions);else _this3.send('reject', disabledPositions);
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
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Placer);
//# sourceMappingURL=data:application/json;base64,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ZSxLQUFmO0FBQ0EsaUJBQU8sV0FBUCxHQUFxQixXQUFyQjs7QUFFQSxpQkFBSyxJQUFMLENBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixLQUE3QixFQUFvQyxLQUFwQyxFQUEyQyxXQUEzQzs7QUFFQSxpQkFBSyxTQUFMLENBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QixlQUE3QixFQUE4QyxPQUFLLGlCQUFuRDtBQUNELFNBUkQsTUFRTztBQUNMLGlCQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE9BQUssaUJBQWpDO0FBQ0Q7QUFDRixPQWREO0FBZUQ7Ozs7Ozs0QkFHTyxNLEVBQVE7QUFDZCxzR0FBYyxNQUFkOztBQUVBLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQWhDO0FBQ0EsV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixVQUFyQixFQUFpQyxLQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBakM7QUFDRDs7Ozs7OytCQUdVLE0sRUFBUTtBQUNqQix5R0FBaUIsTUFBakI7O0FBRUEsV0FBSyxxQkFBTCxDQUEyQixPQUFPLEtBQWxDLEVBQXlDLE1BQXpDOztBQUVBLFdBQUssU0FBTCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsZUFBN0IsRUFBOEMsS0FBSyxpQkFBbkQ7QUFDRDs7Ozs7QUFHSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE1BQXBDIiwiZmlsZSI6IlBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcblxuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGFjZXInO1xuY29uc3QgbWF4Q2FwYWNpdHkgPSA5OTk5O1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ3BsYWNlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGlzIG9uZSBvZiB0aGUgcHJvdmlkZWQgc2VydmljZXMgYWltZWQgYXQgaWRlbnRpZnlpbmcgY2xpZW50cyBpbnNpZGVcbiAqIHRoZSBleHBlcmllbmNlIGFsb25nIHdpdGggdGhlIFtgJ2xvY2F0b3InYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkxvY2F0b3J9XG4gKiBhbmQgW2AnY2hlY2tpbidgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2hlY2tpbn0gc2VydmljZXMuXG4gKlxuICogVGhlIHBsYWNlciBzZXJ2aWNlIGlzIHdlbGwtc3VpdGVkIGZvciBzaXR1YXRpb25zIHdoZXJlIHRoZSBleHBlcmllbmNlIGhhcyBhIHNldCBvZlxuICogcHJlZGVmaW5lZCBwbGFjZXMgKGxvY2F0ZWQgb3Igbm90KSBhbmQgc2hhbGwgcmVmdXNlIGNsaWVudHMgd2hlbiBhbGwgcGxhY2VzXG4gKiBhcmUgYWxyZWFkeSBhc3NpZ25lZCB0byBhIGNsaWVudC5cbiAqIFRoZSBjYXBhY2l0eSwgbWF4aW11bSBjbGllbnRzIHBlciBhdmFpbGFibGUgcG9zaXRpb25zLCBvcHRpb25uYWwgbGFiZWxzXG4gKiBhbmQgY29vcmRpbmF0ZXMgdXNlZCBieSB0aGUgc2VydmljZSwgc2hvdWxkIGJlIGRlZmluZWQgaW4gdGhlIGBzZXR1cGBcbiAqIGVudHJ5IG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBhbmQgbXVzdCBmb2xsb3cgdGhlIGZvcm1hdCBzcGVjaWZpZWQgaW5cbiAqIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuYXBwQ29uZmlnLnNldHVwfS4gSWYgbm8gbGFiZWwgaXMgcHJvdmlkZWRcbiAqIHRoZSBzZXJ2aWNlIHdpbGwgZ2VuZXJhdGUgaW5jcmVtZW50YWwgbnVtYmVycyBtYXRjaGluZyB0aGUgZ2l2ZW4gY2FwYWNpdHkuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlBsYWNlcn0qX19cbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTG9jYXRvcn1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DaGVja2lufVxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbml0aWFsaXplIHRoZSBzZXJ2ZXIgd2l0aCBhIGN1c3RvbSBzZXR1cFxuICogY29uc3Qgc2V0dXAgPSB7XG4gKiAgIGNhcGFjaXR5OiA4LFxuICogICBsYWJlbHM6IFsnYScsICdiJywgJ2MnLCAnZCcsICdlJywgJ2YnLCAnZycsICdoJ10sXG4gKiB9O1xuICogc291bmR3b3Jrcy5zZXJ2ZXIuaW5pdCh7IHNldHVwIH0pO1xuICpcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5wbGFjZXIgPSB0aGlzLnJlcXVpcmUoJ3BsYWNlcicpO1xuICovXG5jbGFzcyBQbGFjZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29uZmlnSXRlbTogJ3NldHVwJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgY29uc3QgY29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5jb25maWdJdGVtO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgZGVmaW5pbmcgZGltZW5zaW9ucyBhbmQgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQoY29uZmlnSXRlbSk7XG5cbiAgICBpZiAodGhpcy5zZXR1cCA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXCJzZXJ2aWNlOnBsYWNlclwiOiBzZXJ2ZXIuY29uZmlnLiR7Y29uZmlnSXRlbX0gaXMgbm90IGRlZmluZWRgKTtcblxuICAgIGlmICghdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pXG4gICAgICB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gZ2V0T3B0KHRoaXMuc2V0dXAuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIGlmICh0aGlzLnNldHVwKSB7XG4gICAgICBjb25zdCBzZXR1cCA9IHRoaXMuc2V0dXA7XG4gICAgICBjb25zdCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSBzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb247XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKSAqIG1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBtYXhDYXBhY2l0eSlcbiAgICAgIHRoaXMuY2FwYWNpdHkgPSBtYXhDYXBhY2l0eTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgY2xpZW50cyBjaGVja2VkIGluIHdpdGggY29ycmVzcG9uZGluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtPYmplY3Q8TnVtYmVyLCBBcnJheT59XG4gICAgICovXG4gICAgdGhpcy5jbGllbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgb2YgY29ubmVjdGVkIGNsaWVudHMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm51bUNsaWVudHMgPSAwO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgaW5kZXhlcyBvZiB0aGUgZGlzYWJsZWQgcG9zaXRpb25zLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLmRpc2FibGVkUG9zaXRpb25zID0gW107XG5cbiAgICAvLyB1cGRhdGUgY29uZmlnIGNhcGFjaXR5IHdpdGggY29tcHV0ZWQgb25lXG4gICAgdGhpcy5zZXR1cC5jYXBhY2l0eSA9IHRoaXMuY2FwYWNpdHk7XG5cbiAgICAvLyBhZGQgcGF0aCB0byBzaGFyZWQgY29uZmlnIHJlcXVpcmVtZW50cyBmb3IgYWxsIGNsaWVudCB0eXBlXG4gICAgdGhpcy5jbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLl9zaGFyZWRDb25maWcuc2hhcmUodGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW0sIGNsaWVudFR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIHRoZSBjbGllbnQgaW4gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHBvc2l0aW9uSW5kZXggLSBJbmRleCBvZiBjaG9zZW4gcG9zaXRpb24uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBjbGllbnQgLSBDbGllbnQgYXNzb2NpYXRlZCB0byB0aGUgcG9zaXRpb24uXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSAtIGB0cnVlYCBpZiBzdWNjZWVkLCBgZmFsc2VgIGlmIG5vdC5cbiAgICovXG4gIF9zdG9yZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGlmICghdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdKVxuICAgICAgdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdID0gW107XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoIDwgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24gJiZcbiAgICAgICAgdGhpcy5udW1DbGllbnRzIDwgdGhpcy5jYXBhY2l0eVxuICAgICkge1xuICAgICAgbGlzdC5wdXNoKGNsaWVudCk7XG4gICAgICB0aGlzLm51bUNsaWVudHMgKz0gMTtcblxuICAgICAgLy8gaWYgbGFzdCBhdmFpbGFibGUgcGxhY2UgZm9yIHRoaXMgcG9zaXRpb24sIGxvY2sgaXRcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA+PSB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge051bWJlcn0gcG9zaXRpb25JbmRleCAtIEluZGV4IG9mIGNob3NlbiBwb3NpdGlvbi5cbiAgICogQHBhcmFtIHtPYmplY3R9IGNsaWVudCAtIENsaWVudCBhc3NvY2lhdGVkIHRvIHRoZSBwb3NpdGlvbi5cbiAgICovXG4gIF9yZW1vdmVDbGllbnRQb3NpdGlvbihwb3NpdGlvbkluZGV4LCBjbGllbnQpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdIHx8wqBbXTtcbiAgICBjb25zdCBjbGllbnRJbmRleCA9IGxpc3QuaW5kZXhPZihjbGllbnQpO1xuXG4gICAgaWYgKGNsaWVudEluZGV4ICE9PSAtMSkge1xuICAgICAgbGlzdC5zcGxpY2UoY2xpZW50SW5kZXgsIDEpO1xuICAgICAgLy8gY2hlY2sgaWYgdGhlIGxpc3Qgd2FzIG1hcmtlZCBhcyBkaXNhYmxlZFxuICAgICAgaWYgKGxpc3QubGVuZ3RoIDwgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgZGlzYWJsZWRJbmRleCA9IHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbkluZGV4KTtcblxuICAgICAgICBpZiAoZGlzYWJsZWRJbmRleCAhPT0gLTEpXG4gICAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5zcGxpY2UoZGlzYWJsZWRJbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubnVtQ2xpZW50cyAtPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBjb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW07XG4gICAgICBjb25zdCBkaXNhYmxlZFBvc2l0aW9ucyA9IHRoaXMuZGlzYWJsZWRQb3NpdGlvbnM7XG4gICAgICAvLyBha25vd2xlZGdlXG4gICAgICBpZiAodGhpcy5udW1DbGllbnRzIDwgdGhpcy5zZXR1cC5jYXBhY2l0eSlcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2Frbm93bGVnZGUnLCBjb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VuZCgncmVqZWN0JywgZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvbihjbGllbnQpIHtcbiAgICByZXR1cm4gKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLl9zdG9yZUNsaWVudFBvc2l0aW9uKGluZGV4LCBjbGllbnQpO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgY2xpZW50LmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maXJtJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lLlxuICAgICAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtam9pbmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVqZWN0JywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvbihjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMuX3JlbW92ZUNsaWVudFBvc2l0aW9uKGNsaWVudC5pbmRleCwgY2xpZW50KTtcbiAgICAvLyBAdG9kbyAtIGNoZWNrIGlmIHNvbWV0aGluZyBtb3JlIHN1YnRpbGUgdGhhbiBhIGJyb2FkY2FzdCBjYW4gYmUgZG9uZS5cbiAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtbGVhdmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhY2VyKTtcbiJdfQ==
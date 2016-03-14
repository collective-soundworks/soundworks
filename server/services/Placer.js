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
 * [server] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 * This service consumme a setup as defined in the server configuration
 * (see {@link src/server/core/server.js~appConfig} for details).
 *
 * (See also {@link src/client/services/ClientPlacer.js~ClientPlacer} on the client side)
 */

var Placer = function (_Activity) {
  (0, _inherits3.default)(Placer, _Activity);

  function Placer() {
    (0, _classCallCheck3.default)(this, Placer);


    /**
     * @type {Object} defaults - Defaults options of the service
     * @attribute {String} [defaults.setupConfigItem='setup'] - The path to the server's setup
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Placer).call(this, SERVICE_ID));

    var defaults = {
      setupConfigItem: 'setup'
    };

    _this.configure(defaults);
    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @inheritdoc */


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
        _this2._sharedConfigService.addItem(setupConfigItem, clientType);
      });
    }

    /**
     * Store the client in a given position.
     * @returns {Boolean} - `true` if succeed, `false` if not
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

    /** @inheritdoc */

  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Placer.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'position', this._onPosition(client));
    }

    /** @inheritdoc */

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
//# sourceMappingURL=data:application/json;base64,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QUFpQyxNQUFqQyxDQUFWLENBRDhCOztBQUdwQyxZQUFJLE9BQUosRUFBYTtBQUNYLGlCQUFPLEtBQVAsR0FBZSxLQUFmLENBRFc7QUFFWCxpQkFBTyxLQUFQLEdBQWUsS0FBZixDQUZXO0FBR1gsaUJBQU8sV0FBUCxHQUFxQixXQUFyQixDQUhXOztBQUtYLGlCQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFNBQWxCLEVBQTZCLEtBQTdCLEVBQW9DLEtBQXBDLEVBQTJDLFdBQTNDOztBQUxXLGdCQU9YLENBQUssU0FBTCxDQUFlLElBQWYsRUFBcUIsTUFBckIsRUFBNkIsZUFBN0IsRUFBOEMsT0FBSyxpQkFBTCxDQUE5QyxDQVBXO1NBQWIsTUFRTztBQUNMLGlCQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE9BQUssaUJBQUwsQ0FBNUIsQ0FESztTQVJQO09BSEssQ0FEVzs7Ozs7Ozs0QkFtQlosUUFBUTtBQUNkLHVEQWhLRSwrQ0FnS1ksT0FBZCxDQURjOztBQUdkLFdBQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBSyxVQUFMLENBQWdCLE1BQWhCLENBQWhDLEVBSGM7QUFJZCxXQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLFVBQXJCLEVBQWlDLEtBQUssV0FBTCxDQUFpQixNQUFqQixDQUFqQyxFQUpjOzs7Ozs7OytCQVFMLFFBQVE7QUFDakIsdURBeEtFLGtEQXdLZSxPQUFqQixDQURpQjs7QUFHakIsV0FBSyxxQkFBTCxDQUEyQixPQUFPLEtBQVAsRUFBYyxNQUF6Qzs7QUFIaUIsVUFLakIsQ0FBSyxTQUFMLENBQWUsSUFBZixFQUFxQixNQUFyQixFQUE2QixlQUE3QixFQUE4QyxLQUFLLGlCQUFMLENBQTlDLENBTGlCOzs7U0F2S2Y7OztBQWdMTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLE1BQXBDIiwiZmlsZSI6IlBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuXG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYWNlcic7XG5jb25zdCBtYXhDYXBhY2l0eSA9IDk5OTk7XG5cbi8qKlxuICogW3NlcnZlcl0gQWxsb3cgdG8gc2VsZWN0IGEgcGxhY2Ugd2l0aGluIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICogVGhpcyBzZXJ2aWNlIGNvbnN1bW1lIGEgc2V0dXAgYXMgZGVmaW5lZCBpbiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb25cbiAqIChzZWUge0BsaW5rIHNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanN+YXBwQ29uZmlnfSBmb3IgZGV0YWlscykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFBsYWNlci5qc35DbGllbnRQbGFjZXJ9IG9uIHRoZSBjbGllbnQgc2lkZSlcbiAqL1xuY2xhc3MgUGxhY2VyIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9IGRlZmF1bHRzIC0gRGVmYXVsdHMgb3B0aW9ucyBvZiB0aGUgc2VydmljZVxuICAgICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2RlZmF1bHRzLnNldHVwQ29uZmlnSXRlbT0nc2V0dXAnXSAtIFRoZSBwYXRoIHRvIHRoZSBzZXJ2ZXIncyBzZXR1cFxuICAgICAqICBjb25maWd1cmF0aW9uIGVudHJ5IChzZWUge0BsaW5rIHNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanN+YXBwQ29uZmlnfSBmb3IgZGV0YWlscykuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzZXR1cENvbmZpZ0l0ZW06ICdzZXR1cCcsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNvbnN0IHNldHVwQ29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5zZXR1cENvbmZpZ0l0ZW07XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBkZWZpbmluZyBkaW1lbnNpb25zIGFuZCBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQoc2V0dXBDb25maWdJdGVtKTtcblxuICAgIGlmICghdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pXG4gICAgICB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gZ2V0T3B0KHRoaXMuc2V0dXAuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIGlmICh0aGlzLnNldHVwKSB7XG4gICAgICBjb25zdCBzZXR1cCA9IHRoaXMuc2V0dXA7XG4gICAgICBjb25zdCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSBzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb247XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKSAqIG1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBtYXhDYXBhY2l0eSlcbiAgICAgIHRoaXMuY2FwYWNpdHkgPSBtYXhDYXBhY2l0eTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgY2xpZW50cyBjaGVja2VkIGluIHdpdGggY29ycmVzcG9uaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge09iamVjdDxOdW1iZXIsIEFycmF5Pn1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubnVtQ2xpZW50cyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBpbmRleGVzIG9mIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMgPSBbXTtcblxuICAgIC8vIHVwZGF0ZSBjb25maWcgY2FwYWNpdHkgd2l0aCBjb21wdXRlZCBvbmVcbiAgICB0aGlzLnNldHVwLmNhcGFjaXR5ID0gdGhpcy5jYXBhY2l0eTtcblxuICAgIC8vIGFkZCBwYXRoIHRvIHNoYXJlZCBjb25maWcgcmVxdWlyZW1lbnRzIGZvciBhbGwgY2xpZW50IHR5cGVcbiAgICB0aGlzLmNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuYWRkSXRlbShzZXR1cENvbmZpZ0l0ZW0sIGNsaWVudFR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIHRoZSBjbGllbnQgaW4gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IC0gYHRydWVgIGlmIHN1Y2NlZWQsIGBmYWxzZWAgaWYgbm90XG4gICAqL1xuICBfc3RvcmVDbGllbnRQb3NpdGlvbihwb3NpdGlvbkluZGV4LCBjbGllbnQpIHtcbiAgICBpZiAoIXRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSlcbiAgICAgIHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSA9IFtdO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XTtcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA8IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uICYmXG4gICAgICAgIHRoaXMubnVtQ2xpZW50cyA8IHRoaXMuY2FwYWNpdHlcbiAgICApIHtcbiAgICAgIGxpc3QucHVzaChjbGllbnQpO1xuICAgICAgdGhpcy5udW1DbGllbnRzICs9IDE7XG5cbiAgICAgIC8vIGlmIGxhc3QgYXZhaWxhYmxlIHBsYWNlIGZvciB0aGlzIHBvc2l0aW9uLCBsb2NrIGl0XG4gICAgICBpZiAobGlzdC5sZW5ndGggPj0gdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pXG4gICAgICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMucHVzaChwb3NpdGlvbkluZGV4KTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICovXG4gIF9yZW1vdmVDbGllbnRQb3NpdGlvbihwb3NpdGlvbkluZGV4LCBjbGllbnQpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdIHx8wqBbXTtcbiAgICBjb25zdCBjbGllbnRJbmRleCA9IGxpc3QuaW5kZXhPZihjbGllbnQpO1xuXG4gICAgaWYgKGNsaWVudEluZGV4ICE9PSAtMSkge1xuICAgICAgbGlzdC5zcGxpY2UoY2xpZW50SW5kZXgsIDEpO1xuICAgICAgLy8gY2hlY2sgaWYgdGhlIGxpc3Qgd2FzIG1hcmtlZCBhcyBkaXNhYmxlZFxuICAgICAgaWYgKGxpc3QubGVuZ3RoIDwgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgZGlzYWJsZWRJbmRleCA9IHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbkluZGV4KTtcblxuICAgICAgICBpZiAoZGlzYWJsZWRJbmRleCAhPT0gLTEpXG4gICAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5zcGxpY2UoZGlzYWJsZWRJbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubnVtQ2xpZW50cyAtPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBzZXR1cENvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuc2V0dXBDb25maWdJdGVtO1xuICAgICAgY29uc3QgZGlzYWJsZWRQb3NpdGlvbnMgPSB0aGlzLmRpc2FibGVkUG9zaXRpb25zO1xuICAgICAgLy8gYWtub3dsZWRnZVxuICAgICAgaWYgKHRoaXMubnVtQ2xpZW50cyA8IHRoaXMuc2V0dXAuY2FwYWNpdHkpXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdha25vd2xlZ2RlJywgc2V0dXBDb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VuZCgncmVqZWN0JywgZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvbihjbGllbnQpIHtcbiAgICByZXR1cm4gKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLl9zdG9yZUNsaWVudFBvc2l0aW9uKGluZGV4LCBjbGllbnQpO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgY2xpZW50LmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maXJtJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lLlxuICAgICAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtam9pbmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVqZWN0JywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvbihjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMuX3JlbW92ZUNsaWVudFBvc2l0aW9uKGNsaWVudC5pbmRleCwgY2xpZW50KTtcbiAgICAvLyBAdG9kbyAtIGNoZWNrIGlmIHNvbWV0aGluZyBtb3JlIHN1YnRpbGUgdGhhbiBhIGJyb2FkY2FzdCBjYW4gYmUgZG9uZS5cbiAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtbGVhdmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgUGxhY2VyKTtcbiJdfQ==
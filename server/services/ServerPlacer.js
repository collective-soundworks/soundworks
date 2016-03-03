'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _utilsHelpers = require('../../utils/helpers');

var _coreServer = require('../core/server');

var _coreServer2 = _interopRequireDefault(_coreServer);

var SERVICE_ID = 'service:placer';
var maxCapacity = 9999;

/**
 * [server] Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 * This service consumme a setup as defined in the server configuration
 * (see {@link src/server/core/server.js~appConfig} for details).
 *
 * (See also {@link src/client/services/ClientPlacer.js~ClientPlacer} on the client side)
 */

var ServerPlacer = (function (_ServerActivity) {
  _inherits(ServerPlacer, _ServerActivity);

  function ServerPlacer() {
    _classCallCheck(this, ServerPlacer);

    _get(Object.getPrototypeOf(ServerPlacer.prototype), 'constructor', this).call(this, SERVICE_ID);

    /**
     * @type {Object} defaults - Defaults options of the service
     * @attribute {String} [defaults.setupConfigItem='setup'] - The path to the server's setup
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */
    var defaults = {
      setupConfigItem: 'setup'
    };

    this.configure(defaults);
    this._sharedConfigService = this.require('shared-config');
  }

  /** @inheritdoc */

  _createClass(ServerPlacer, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'start', this).call(this);

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
      this.capacity = (0, _utilsHelpers.getOpt)(this.setup.capacity, Infinity, 1);

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
        _this._sharedConfigService.addItem(setupConfigItem, clientType);
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
      var _this2 = this;

      return function () {
        var setupConfigItem = _this2.options.setupConfigItem;
        var disabledPositions = _this2.disabledPositions;
        // aknowledge
        if (_this2.numClients < _this2.setup.capacity) _this2.send(client, 'aknowlegde', setupConfigItem, disabledPositions);else _this2.send('reject', disabledPositions);
      };
    }

    /** @private */
  }, {
    key: '_onPosition',
    value: function _onPosition(client) {
      var _this3 = this;

      return function (index, label, coordinates) {
        var success = _this3._storeClientPosition(index, client);

        if (success) {
          client.index = index;
          client.label = label;
          client.coordinates = coordinates;

          _this3.send(client, 'confirm', index, label, coordinates);
          // @todo - check if something more subtile than a broadcast can be done.
          _this3.broadcast(null, client, 'client-joined', _this3.disabledPositions);
        } else {
          _this3.send(client, 'reject', _this3.disabledPositions);
        }
      };
    }

    /** @inheritdoc */
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'position', this._onPosition(client));
    }

    /** @inheritdoc */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'disconnect', this).call(this, client);

      this._removeClientPosition(client.index, client);
      // @todo - check if something more subtile than a broadcast can be done.
      this.broadcast(null, client, 'client-leaved', this.disabledPositions);
    }
  }]);

  return ServerPlacer;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerPlacer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7O3dDQUNsQiw4QkFBOEI7Ozs7NEJBQ3hDLHFCQUFxQjs7MEJBRXpCLGdCQUFnQjs7OztBQUVuQyxJQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztBQUNwQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7SUFTbkIsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLEdBQ0Y7MEJBRFYsWUFBWTs7QUFFZCwrQkFGRSxZQUFZLDZDQUVSLFVBQVUsRUFBRTs7Ozs7OztBQU9sQixRQUFNLFFBQVEsR0FBRztBQUNmLHFCQUFlLEVBQUUsT0FBTztLQUN6QixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7R0FDM0Q7Ozs7ZUFmRyxZQUFZOztXQWtCWCxpQkFBRzs7O0FBQ04saUNBbkJFLFlBQVksdUNBbUJBOztBQUVkLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDOzs7Ozs7QUFNckQsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDOztBQUU1RCxVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7Ozs7OztBQU12QyxVQUFJLENBQUMsUUFBUSxHQUFHLDBCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FB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RDtPQUNGLENBQUE7S0FDRjs7Ozs7V0FHTSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0FoS0UsWUFBWSx5Q0FnS0EsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDNUQ7Ozs7O1dBR1Msb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQXhLRSxZQUFZLDRDQXdLRyxNQUFNLEVBQUU7O0FBRXpCLFVBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVqRCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3ZFOzs7U0E3S0csWUFBWTs7O0FBZ0xsQixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclBsYWNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuXG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYWNlcic7XG5jb25zdCBtYXhDYXBhY2l0eSA9IDk5OTk7XG5cbi8qKlxuICogW3NlcnZlcl0gQWxsb3cgdG8gc2VsZWN0IGEgcGxhY2Ugd2l0aGluIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICogVGhpcyBzZXJ2aWNlIGNvbnN1bW1lIGEgc2V0dXAgYXMgZGVmaW5lZCBpbiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb25cbiAqIChzZWUge0BsaW5rIHNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanN+YXBwQ29uZmlnfSBmb3IgZGV0YWlscykuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudFBsYWNlci5qc35DbGllbnRQbGFjZXJ9IG9uIHRoZSBjbGllbnQgc2lkZSlcbiAqL1xuY2xhc3MgU2VydmVyUGxhY2VyIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9IGRlZmF1bHRzIC0gRGVmYXVsdHMgb3B0aW9ucyBvZiB0aGUgc2VydmljZVxuICAgICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2RlZmF1bHRzLnNldHVwQ29uZmlnSXRlbT0nc2V0dXAnXSAtIFRoZSBwYXRoIHRvIHRoZSBzZXJ2ZXIncyBzZXR1cFxuICAgICAqICBjb25maWd1cmF0aW9uIGVudHJ5IChzZWUge0BsaW5rIHNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanN+YXBwQ29uZmlnfSBmb3IgZGV0YWlscykuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzZXR1cENvbmZpZ0l0ZW06ICdzZXR1cCcsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNvbnN0IHNldHVwQ29uZmlnSXRlbSA9IHRoaXMub3B0aW9ucy5zZXR1cENvbmZpZ0l0ZW07XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBkZWZpbmluZyBkaW1lbnNpb25zIGFuZCBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQoc2V0dXBDb25maWdJdGVtKTtcblxuICAgIGlmICghdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pXG4gICAgICB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gZ2V0T3B0KHRoaXMuc2V0dXAuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIGlmICh0aGlzLnNldHVwKSB7XG4gICAgICBjb25zdCBzZXR1cCA9IHRoaXMuc2V0dXA7XG4gICAgICBjb25zdCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSBzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb247XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKSAqIG1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBtYXhDYXBhY2l0eSlcbiAgICAgIHRoaXMuY2FwYWNpdHkgPSBtYXhDYXBhY2l0eTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgY2xpZW50cyBjaGVja2VkIGluIHdpdGggY29ycmVzcG9uaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge09iamVjdDxOdW1iZXIsIEFycmF5Pn1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubnVtQ2xpZW50cyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBpbmRleGVzIG9mIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMgPSBbXTtcblxuICAgIC8vIHVwZGF0ZSBjb25maWcgY2FwYWNpdHkgd2l0aCBjb21wdXRlZCBvbmVcbiAgICB0aGlzLnNldHVwLmNhcGFjaXR5ID0gdGhpcy5jYXBhY2l0eTtcblxuICAgIC8vIGFkZCBwYXRoIHRvIHNoYXJlZCBjb25maWcgcmVxdWlyZW1lbnRzIGZvciBhbGwgY2xpZW50IHR5cGVcbiAgICB0aGlzLmNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuYWRkSXRlbShzZXR1cENvbmZpZ0l0ZW0sIGNsaWVudFR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIHRoZSBjbGllbnQgaW4gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IC0gYHRydWVgIGlmIHN1Y2NlZWQsIGBmYWxzZWAgaWYgbm90XG4gICAqL1xuICBfc3RvcmVDbGllbnRQb3NpdGlvbihwb3NpdGlvbkluZGV4LCBjbGllbnQpIHtcbiAgICBpZiAoIXRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSlcbiAgICAgIHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSA9IFtdO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XTtcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA8IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uICYmXG4gICAgICAgIHRoaXMubnVtQ2xpZW50cyA8IHRoaXMuY2FwYWNpdHlcbiAgICApIHtcbiAgICAgIGxpc3QucHVzaChjbGllbnQpO1xuICAgICAgdGhpcy5udW1DbGllbnRzICs9IDE7XG5cbiAgICAgIC8vIGlmIGxhc3QgYXZhaWxhYmxlIHBsYWNlIGZvciB0aGlzIHBvc2l0aW9uLCBsb2NrIGl0XG4gICAgICBpZiAobGlzdC5sZW5ndGggPj0gdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pXG4gICAgICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMucHVzaChwb3NpdGlvbkluZGV4KTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgY2xpZW50IGZyb20gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICovXG4gIF9yZW1vdmVDbGllbnRQb3NpdGlvbihwb3NpdGlvbkluZGV4LCBjbGllbnQpIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdIHx8wqBbXTtcbiAgICBjb25zdCBjbGllbnRJbmRleCA9IGxpc3QuaW5kZXhPZihjbGllbnQpO1xuXG4gICAgaWYgKGNsaWVudEluZGV4ICE9PSAtMSkge1xuICAgICAgbGlzdC5zcGxpY2UoY2xpZW50SW5kZXgsIDEpO1xuICAgICAgLy8gY2hlY2sgaWYgdGhlIGxpc3Qgd2FzIG1hcmtlZCBhcyBkaXNhYmxlZFxuICAgICAgaWYgKGxpc3QubGVuZ3RoIDwgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pIHtcbiAgICAgICAgY29uc3QgZGlzYWJsZWRJbmRleCA9IHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMuaW5kZXhPZihwb3NpdGlvbkluZGV4KTtcblxuICAgICAgICBpZiAoZGlzYWJsZWRJbmRleCAhPT0gLTEpXG4gICAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5zcGxpY2UoZGlzYWJsZWRJbmRleCwgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubnVtQ2xpZW50cyAtPSAxO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBzZXR1cENvbmZpZ0l0ZW0gPSB0aGlzLm9wdGlvbnMuc2V0dXBDb25maWdJdGVtO1xuICAgICAgY29uc3QgZGlzYWJsZWRQb3NpdGlvbnMgPSB0aGlzLmRpc2FibGVkUG9zaXRpb25zO1xuICAgICAgLy8gYWtub3dsZWRnZVxuICAgICAgaWYgKHRoaXMubnVtQ2xpZW50cyA8IHRoaXMuc2V0dXAuY2FwYWNpdHkpXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdha25vd2xlZ2RlJywgc2V0dXBDb25maWdJdGVtLCBkaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VuZCgncmVqZWN0JywgZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvbihjbGllbnQpIHtcbiAgICByZXR1cm4gKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLl9zdG9yZUNsaWVudFBvc2l0aW9uKGluZGV4LCBjbGllbnQpO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgY2xpZW50LmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maXJtJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lLlxuICAgICAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtam9pbmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVqZWN0JywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvbihjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMuX3JlbW92ZUNsaWVudFBvc2l0aW9uKGNsaWVudC5pbmRleCwgY2xpZW50KTtcbiAgICAvLyBAdG9kbyAtIGNoZWNrIGlmIHNvbWV0aGluZyBtb3JlIHN1YnRpbGUgdGhhbiBhIGJyb2FkY2FzdCBjYW4gYmUgZG9uZS5cbiAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtbGVhdmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyUGxhY2VyKTtcbiJdfQ==
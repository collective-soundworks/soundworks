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
     * @attribute {String} [defaults.setupConfigPath='setup'] - The path to the server's setup
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */
    var defaults = {
      setupConfigPath: 'setup'
    };

    this.configure(defaults);
    this._sharedConfigService = this.require('shared-config');
  }

  /** @inheritdoc */

  _createClass(ServerPlacer, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'start', this).call(this);

      var setupConfigPath = this.options.setupConfigPath;
      var setupConfig = this._sharedConfigService.get(setupConfigPath)[setupConfigPath];

      /**
       * Setup defining dimensions and predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = setupConfig;

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
      setupConfig.capacity = this.capacity;
      this._sharedConfigService.addItem(setupConfigPath, this.clientTypes);
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
      var _this = this;

      return function () {
        var setup = _this.setup;
        var area = undefined;
        var labels = undefined;
        var coordinates = undefined;

        if (setup) {
          labels = setup.labels;
          coordinates = setup.coordinates;
          area = setup.area;
        }

        // aknowledge
        if (_this.numClients < setup.capacity) _this.send(client, 'aknowlegde', _this.options.setupConfigPath, _this.disabledPositions);else _this.send('reject', _this.disabledPositions);
      };
    }

    /** @private */
  }, {
    key: '_onPosition',
    value: function _onPosition(client) {
      var _this2 = this;

      return function (index, label, coordinates) {
        var success = _this2._storeClientPosition(index, client);

        if (success) {
          client.index = index;
          client.label = label;
          client.coordinates = coordinates;

          _this2.send(client, 'confirm', index, label, coordinates);
          // @todo - check if something more subtile than a broadcast can be done.
          _this2.broadcast(null, client, 'client-joined', _this2.disabledPositions);
        } else {
          _this2.send(client, 'reject', _this2.disabledPositions);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7O3dDQUNsQiw4QkFBOEI7Ozs7NEJBQ3hDLHFCQUFxQjs7MEJBRXpCLGdCQUFnQjs7OztBQUVuQyxJQUFNLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztBQUNwQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7SUFTbkIsWUFBWTtZQUFaLFlBQVk7O0FBQ0wsV0FEUCxZQUFZLEdBQ0Y7MEJBRFYsWUFBWTs7QUFFZCwrQkFGRSxZQUFZLDZDQUVSLFVBQVUsRUFBRTs7Ozs7OztBQU9sQixRQUFNLFFBQVEsR0FBRztBQUNmLHFCQUFlLEVBQUUsT0FBTztLQUN6QixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7R0FDM0Q7Ozs7ZUFmRyxZQUFZOztXQWtCWCxpQkFBRztBQUNOLGlDQW5CRSxZQUFZLHVDQW1CQTs7QUFFZCxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztBQUNyRCxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7Ozs7QUFNcEYsVUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7O0FBRXpCLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixFQUNuQyxJQUFJLENBQUMsS0FBSyxDQUFDLHFCQUFxQixHQUFHLENBQUMsQ0FBQzs7Ozs7O0FBTXZDLFVBQUksQ0FBQyxRQUFRLEdBQUcsMEJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFD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UyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLE9BQUssaUJBQWlCLENBQUMsQ0FBQztTQUN2RSxNQUFNO0FBQ0wsaUJBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBSyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3JEO09BQ0YsQ0FBQTtLQUNGOzs7OztXQUdNLGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQXRLRSxZQUFZLHlDQXNLQSxNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUM1RDs7Ozs7V0FHUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBOUtFLFlBQVksNENBOEtHLE1BQU0sRUFBRTs7QUFFekIsVUFBSSxDQUFDLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRWpELFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDdkU7OztTQW5MRyxZQUFZOzs7QUFzTGxCLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5cbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6cGxhY2VyJztcbmNvbnN0IG1heENhcGFjaXR5ID0gOTk5OTtcblxuLyoqXG4gKiBbc2VydmVyXSBBbGxvdyB0byBzZWxlY3QgYSBwbGFjZSB3aXRoaW4gYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKiBUaGlzIHNlcnZpY2UgY29uc3VtbWUgYSBzZXR1cCBhcyBkZWZpbmVkIGluIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvblxuICogKHNlZSB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL3NlcnZlci5qc35hcHBDb25maWd9IGZvciBkZXRhaWxzKS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50UGxhY2VyLmpzfkNsaWVudFBsYWNlcn0gb24gdGhlIGNsaWVudCBzaWRlKVxuICovXG5jbGFzcyBTZXJ2ZXJQbGFjZXIgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge09iamVjdH0gZGVmYXVsdHMgLSBEZWZhdWx0cyBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlXG4gICAgICogQGF0dHJpYnV0ZSB7U3RyaW5nfSBbZGVmYXVsdHMuc2V0dXBDb25maWdQYXRoPSdzZXR1cCddIC0gVGhlIHBhdGggdG8gdGhlIHNlcnZlcidzIHNldHVwXG4gICAgICogIGNvbmZpZ3VyYXRpb24gZW50cnkgKHNlZSB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL3NlcnZlci5qc35hcHBDb25maWd9IGZvciBkZXRhaWxzKS5cbiAgICAgKi9cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIHNldHVwQ29uZmlnUGF0aDogJ3NldHVwJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3Qgc2V0dXBDb25maWdQYXRoID0gdGhpcy5vcHRpb25zLnNldHVwQ29uZmlnUGF0aDtcbiAgICBjb25zdCBzZXR1cENvbmZpZyA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KHNldHVwQ29uZmlnUGF0aClbc2V0dXBDb25maWdQYXRoXTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSBzZXR1cENvbmZpZztcblxuICAgIGlmICghdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24pXG4gICAgICB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiA9IDE7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gZ2V0T3B0KHRoaXMuc2V0dXAuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIGlmICh0aGlzLnNldHVwKSB7XG4gICAgICBjb25zdCBzZXR1cCA9IHRoaXMuc2V0dXA7XG4gICAgICBjb25zdCBtYXhDbGllbnRzUGVyUG9zaXRpb24gPSBzZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb247XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKSAqIG1heENsaWVudHNQZXJQb3NpdGlvbjtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBtYXhDYXBhY2l0eSlcbiAgICAgIHRoaXMuY2FwYWNpdHkgPSBtYXhDYXBhY2l0eTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgY2xpZW50cyBjaGVja2VkIGluIHdpdGggY29ycmVzcG9uaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge09iamVjdDxOdW1iZXIsIEFycmF5Pn1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSB7fTtcblxuICAgIC8qKlxuICAgICAqIE51bWJlciBvZiBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMubnVtQ2xpZW50cyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBpbmRleGVzIG9mIHRoZSBkaXNhYmxlZCBwb3NpdGlvbnMuXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqL1xuICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMgPSBbXTtcblxuICAgIC8vIHVwZGF0ZSBjb25maWcgY2FwYWNpdHkgd2l0aCBjb21wdXRlZCBvbmVcbiAgICBzZXR1cENvbmZpZy5jYXBhY2l0eSA9IHRoaXMuY2FwYWNpdHk7XG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5hZGRJdGVtKHNldHVwQ29uZmlnUGF0aCwgdGhpcy5jbGllbnRUeXBlcyk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgdGhlIGNsaWVudCBpbiBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgc3VjY2VlZCwgYGZhbHNlYCBpZiBub3RcbiAgICovXG4gIF9zdG9yZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGlmICghdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdKVxuICAgICAgdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdID0gW107XG5cbiAgICBjb25zdCBsaXN0ID0gdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoIDwgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24gJiZcbiAgICAgICAgdGhpcy5udW1DbGllbnRzIDwgdGhpcy5jYXBhY2l0eVxuICAgICkge1xuICAgICAgbGlzdC5wdXNoKGNsaWVudCk7XG4gICAgICB0aGlzLm51bUNsaWVudHMgKz0gMTtcblxuICAgICAgLy8gaWYgbGFzdCBhdmFpbGFibGUgcGxhY2UgZm9yIHRoaXMgcG9zaXRpb24sIGxvY2sgaXRcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA+PSB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKi9cbiAgX3JlbW92ZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0gfHzCoFtdO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gbGlzdC5pbmRleE9mKGNsaWVudCk7XG5cbiAgICBpZiAoY2xpZW50SW5kZXggIT09IC0xKSB7XG4gICAgICBsaXN0LnNwbGljZShjbGllbnRJbmRleCwgMSk7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgbGlzdCB3YXMgbWFya2VkIGFzIGRpc2FibGVkXG4gICAgICBpZiAobGlzdC5sZW5ndGggPCB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbikge1xuICAgICAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5pbmRleE9mKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICAgIGlmIChkaXNhYmxlZEluZGV4ICE9PSAtMSlcbiAgICAgICAgICB0aGlzLmRpc2FibGVkUG9zaXRpb25zLnNwbGljZShkaXNhYmxlZEluZGV4LCAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5udW1DbGllbnRzIC09IDE7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgIGxldCBhcmVhID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IGxhYmVscyA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgIGxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICAgICAgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcbiAgICAgICAgYXJlYSA9IHNldHVwLmFyZWE7XG4gICAgICB9XG5cbiAgICAgIC8vIGFrbm93bGVkZ2VcbiAgICAgIGlmICh0aGlzLm51bUNsaWVudHMgPCBzZXR1cC5jYXBhY2l0eSlcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2Frbm93bGVnZGUnLCB0aGlzLm9wdGlvbnMuc2V0dXBDb25maWdQYXRoLCB0aGlzLmRpc2FibGVkUG9zaXRpb25zKTtcbiAgICAgIGVsc2VcbiAgICAgICAgdGhpcy5zZW5kKCdyZWplY3QnLCB0aGlzLmRpc2FibGVkUG9zaXRpb25zKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUG9zaXRpb24oY2xpZW50KSB7XG4gICAgcmV0dXJuIChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgICBjb25zdCBzdWNjZXNzID0gdGhpcy5fc3RvcmVDbGllbnRQb3NpdGlvbihpbmRleCwgY2xpZW50KTtcblxuICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGNsaWVudC5sYWJlbCA9IGxhYmVsO1xuICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlybScsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICAgICAgICAvLyBAdG9kbyAtIGNoZWNrIGlmIHNvbWV0aGluZyBtb3JlIHN1YnRpbGUgdGhhbiBhIGJyb2FkY2FzdCBjYW4gYmUgZG9uZS5cbiAgICAgICAgdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAnY2xpZW50LWpvaW5lZCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3JlamVjdCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb24oY2xpZW50KSk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLl9yZW1vdmVDbGllbnRQb3NpdGlvbihjbGllbnQuaW5kZXgsIGNsaWVudCk7XG4gICAgLy8gQHRvZG8gLSBjaGVjayBpZiBzb21ldGhpbmcgbW9yZSBzdWJ0aWxlIHRoYW4gYSBicm9hZGNhc3QgY2FuIGJlIGRvbmUuXG4gICAgdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAnY2xpZW50LWxlYXZlZCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlclBsYWNlcik7XG4iXX0=
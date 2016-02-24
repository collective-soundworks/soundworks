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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclBsYWNlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozt3Q0FDbEIsOEJBQThCOzs7OzRCQUN4QyxxQkFBcUI7OzBCQUV6QixnQkFBZ0I7Ozs7QUFFbkMsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7QUFDcEMsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Ozs7O0lBU25CLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxHQUNGOzBCQURWLFlBQVk7O0FBRWQsK0JBRkUsWUFBWSw2Q0FFUixVQUFVLEVBQUU7Ozs7Ozs7QUFPbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixxQkFBZSxFQUFFLE9BQU87S0FDekIsQ0FBQzs7QUFFRixRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQzNEOzs7O2VBZkcsWUFBWTs7V0FrQlgsaUJBQUc7QUFDTixpQ0FuQkUsWUFBWSx1Q0FtQkE7O0FBRWQsVUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUM7QUFDckQsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7Ozs7O0FBTXBGLFVBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDOztBQUV6QixVQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLENBQUM7Ozs7OztBQU12QyxVQUFJLENBQUMsUUFBUSxH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QUUsU0FBUyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7O0FBRXhELGlCQUFLLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxPQUFLLGlCQUFpQixDQUFDLENBQUM7U0FDdkUsTUFBTTtBQUNMLGlCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQUssaUJBQWlCLENBQUMsQ0FBQztTQUNyRDtPQUNGLENBQUE7S0FDRjs7Ozs7V0FHTSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0F0S0UsWUFBWSx5Q0FzS0EsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDNUQ7Ozs7O1dBR1Msb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQTlLRSxZQUFZLDRDQThLRyxNQUFNLEVBQUU7O0FBRXpCLFVBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVqRCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0tBQ3ZFOzs7U0FuTEcsWUFBWTs7O0FBc0xsQixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcblxuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGFjZXInO1xuY29uc3QgbWF4Q2FwYWNpdHkgPSA5OTk5O1xuXG4vKipcbiAqIFtzZXJ2ZXJdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqIFRoaXMgc2VydmljZSBjb25zdW1tZSBhIHNldHVwIGFzIGRlZmluZWQgaW4gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uXG4gKiAoc2VlIHtAbGluayBzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzfmFwcENvbmZpZ30gZm9yIGRldGFpbHMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRQbGFjZXIuanN+Q2xpZW50UGxhY2VyfSBvbiB0aGUgY2xpZW50IHNpZGUpXG4gKi9cbmNsYXNzIFNlcnZlclBsYWNlciBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBkZWZhdWx0cyAtIERlZmF1bHRzIG9wdGlvbnMgb2YgdGhlIHNlcnZpY2VcbiAgICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtkZWZhdWx0cy5zZXR1cENvbmZpZ1BhdGg9J3NldHVwJ10gLSBUaGUgcGF0aCB0byB0aGUgc2VydmVyJ3Mgc2V0dXBcbiAgICAgKiAgY29uZmlndXJhdGlvbiBlbnRyeSAoc2VlIHtAbGluayBzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzfmFwcENvbmZpZ30gZm9yIGRldGFpbHMpLlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2V0dXBDb25maWdQYXRoOiAnc2V0dXAnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBjb25zdCBzZXR1cENvbmZpZ1BhdGggPSB0aGlzLm9wdGlvbnMuc2V0dXBDb25maWdQYXRoO1xuICAgIGNvbnN0IHNldHVwQ29uZmlnID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQoc2V0dXBDb25maWdQYXRoKVtzZXR1cENvbmZpZ1BhdGhdO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgZGVmaW5pbmcgZGltZW5zaW9ucyBhbmQgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IHNldHVwQ29uZmlnO1xuXG4gICAgaWYgKCF0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgIHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uID0gMTtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5zZXR1cC5jYXBhY2l0eSwgSW5maW5pdHksIDEpO1xuXG4gICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgIGNvbnN0IG1heENsaWVudHNQZXJQb3NpdGlvbiA9IHNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbjtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpICogbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG1heENhcGFjaXR5KVxuICAgICAgdGhpcy5jYXBhY2l0eSA9IG1heENhcGFjaXR5O1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBjbGllbnRzIGNoZWNrZWQgaW4gd2l0aCBjb3JyZXNwb25pbmcgaW5kaWNlcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0PE51bWJlciwgQXJyYXk+fVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTnVtYmVyIG9mIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5udW1DbGllbnRzID0gMDtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuXG4gICAgLy8gdXBkYXRlIGNvbmZpZyBjYXBhY2l0eSB3aXRoIGNvbXB1dGVkIG9uZVxuICAgIHNldHVwQ29uZmlnLmNhcGFjaXR5ID0gdGhpcy5jYXBhY2l0eTtcbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmFkZEl0ZW0oc2V0dXBDb25maWdQYXRoLCB0aGlzLmNsaWVudFR5cGVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgY2xpZW50IGluIGEgZ2l2ZW4gcG9zaXRpb24uXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSAtIGB0cnVlYCBpZiBzdWNjZWVkLCBgZmFsc2VgIGlmIG5vdFxuICAgKi9cbiAgX3N0b3JlQ2xpZW50UG9zaXRpb24ocG9zaXRpb25JbmRleCwgY2xpZW50KSB7XG4gICAgaWYgKCF0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0pXG4gICAgICB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0gPSBbXTtcblxuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF07XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPCB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbiAmJlxuICAgICAgICB0aGlzLm51bUNsaWVudHMgPCB0aGlzLmNhcGFjaXR5XG4gICAgKSB7XG4gICAgICBsaXN0LnB1c2goY2xpZW50KTtcbiAgICAgIHRoaXMubnVtQ2xpZW50cyArPSAxO1xuXG4gICAgICAvLyBpZiBsYXN0IGF2YWlsYWJsZSBwbGFjZSBmb3IgdGhpcyBwb3NpdGlvbiwgbG9jayBpdFxuICAgICAgaWYgKGxpc3QubGVuZ3RoID49IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uKVxuICAgICAgICB0aGlzLmRpc2FibGVkUG9zaXRpb25zLnB1c2gocG9zaXRpb25JbmRleCk7XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIGNsaWVudCBmcm9tIGEgZ2l2ZW4gcG9zaXRpb24uXG4gICAqL1xuICBfcmVtb3ZlQ2xpZW50UG9zaXRpb24ocG9zaXRpb25JbmRleCwgY2xpZW50KSB7XG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSB8fMKgW107XG4gICAgY29uc3QgY2xpZW50SW5kZXggPSBsaXN0LmluZGV4T2YoY2xpZW50KTtcblxuICAgIGlmIChjbGllbnRJbmRleCAhPT0gLTEpIHtcbiAgICAgIGxpc3Quc3BsaWNlKGNsaWVudEluZGV4LCAxKTtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBsaXN0IHdhcyBtYXJrZWQgYXMgZGlzYWJsZWRcbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA8IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRpc2FibGVkSW5kZXggPSB0aGlzLmRpc2FibGVkUG9zaXRpb25zLmluZGV4T2YocG9zaXRpb25JbmRleCk7XG5cbiAgICAgICAgaWYgKGRpc2FibGVkSW5kZXggIT09IC0xKVxuICAgICAgICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMuc3BsaWNlKGRpc2FibGVkSW5kZXgsIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm51bUNsaWVudHMgLT0gMTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgbGV0IGFyZWEgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgbGFiZWxzID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoc2V0dXApIHtcbiAgICAgICAgbGFiZWxzID0gc2V0dXAubGFiZWxzO1xuICAgICAgICBjb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzO1xuICAgICAgICBhcmVhID0gc2V0dXAuYXJlYTtcbiAgICAgIH1cblxuICAgICAgLy8gYWtub3dsZWRnZVxuICAgICAgaWYgKHRoaXMubnVtQ2xpZW50cyA8IHNldHVwLmNhcGFjaXR5KVxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnYWtub3dsZWdkZScsIHRoaXMub3B0aW9ucy5zZXR1cENvbmZpZ1BhdGgsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNlbmQoJ3JlamVjdCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvbihjbGllbnQpIHtcbiAgICByZXR1cm4gKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLl9zdG9yZUNsaWVudFBvc2l0aW9uKGluZGV4LCBjbGllbnQpO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgY2xpZW50LmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maXJtJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lLlxuICAgICAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtam9pbmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVqZWN0JywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Bvc2l0aW9uJywgdGhpcy5fb25Qb3NpdGlvbihjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMuX3JlbW92ZUNsaWVudFBvc2l0aW9uKGNsaWVudC5pbmRleCwgY2xpZW50KTtcbiAgICAvLyBAdG9kbyAtIGNoZWNrIGlmIHNvbWV0aGluZyBtb3JlIHN1YnRpbGUgdGhhbiBhIGJyb2FkY2FzdCBjYW4gYmUgZG9uZS5cbiAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdjbGllbnQtbGVhdmVkJywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyUGxhY2VyKTtcbiJdfQ==
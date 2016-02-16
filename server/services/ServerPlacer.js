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
     * @attribute {String} [defaults.setupPath='setup'] - The path to the server's setup
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */
    var defaults = {
      setupPath: 'setup'
    };

    this.configure(defaults);
    this.sharedConfig = this.require('shared-config');
  }

  /** @inheritdoc */

  _createClass(ServerPlacer, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'start', this).call(this);

      var setupPath = this.options.setupPath;
      var setupConfig = this.sharedConfig.get(setupPath);

      /**
       * Setup defining dimensions and predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = setupConfig[setupPath];

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
    }

    /**
     * Store the client in a given position.
     * @returns {Boolean} - `true` if succeed, `false` if not
     */
  }, {
    key: '_storeClientPosition',
    value: function _storeClientPosition(positionIndex, client) {
      if (positionIndex) {
        if (!this.clients[positionIndex]) this.clients[positionIndex] = [];

        var list = this.clients[positionIndex];

        if (list.length < this.setup.maxClientsPerPosition && this.numClients < this.capacity) {
          list.push(client);
          this.numClients += 1;
          // if last available place for this position, lock it
          if (list.length >= this.setup.maxClientsPerPosition) this.disabledPositions.push(positionIndex);

          return true;
        }
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
        var capacity = _this.capacity;
        var setup = _this.setup;
        var area = undefined;
        var labels = undefined;
        var coordinates = undefined;

        if (setup) {
          labels = setup.labels;
          coordinates = setup.coordinates;
          area = setup.area;
        }

        if (_this.numClients < capacity) _this.send(client, 'setup', capacity, labels, coordinates, area, _this.disabledPositions);else _this.send('reject', _this.disabledPositions);
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
          _this2.broadcast(null, client, 'disable-index', index);
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
      this.broadcast(null, client, 'enable-index', client.index);
    }
  }]);

  return ServerPlacer;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerPlacer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7O3dDQUNsQiw4QkFBOEI7Ozs7NEJBQ3hDLHFCQUFxQjs7QUFFNUMsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7QUFDcEMsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7Ozs7Ozs7O0lBU25CLFlBQVk7WUFBWixZQUFZOztBQUNMLFdBRFAsWUFBWSxHQUNGOzBCQURWLFlBQVk7O0FBRWQsK0JBRkUsWUFBWSw2Q0FFUixVQUFVLEVBQUU7Ozs7Ozs7QUFPbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixlQUFTLEVBQUUsT0FBTztLQUNuQixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQ25EOzs7O2VBZkcsWUFBWTs7V0FrQlgsaUJBQUc7QUFDTixpQ0FuQkUsWUFBWSx1Q0FtQkE7O0FBRWQsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDekMsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Ozs7OztBQU1yRCxVQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFcEMsVUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLEVBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMscUJBQXFCLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFNdkMsVUFBSSxDQUFDLFFBQVEsR0FBRywwQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRXpELFVBQUksSUFBSSxDQUFD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LENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFLLGlCQUFpQixDQUFDLENBQUM7U0FDckQ7T0FDRixDQUFBO0tBQ0Y7Ozs7O1dBR00saUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBbktFLFlBQVkseUNBbUtBLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzVEOzs7OztXQUdTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0EzS0UsWUFBWSw0Q0EyS0csTUFBTSxFQUFFOztBQUV6QixVQUFJLENBQUMscUJBQXFCLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzs7QUFFakQsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUQ7OztTQWhMRyxZQUFZOzs7QUFtTGxCLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyUGxhY2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpwbGFjZXInO1xuY29uc3QgbWF4Q2FwYWNpdHkgPSA5OTk5O1xuXG4vKipcbiAqIFtzZXJ2ZXJdIEFsbG93IHRvIHNlbGVjdCBhIHBsYWNlIHdpdGhpbiBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqIFRoaXMgc2VydmljZSBjb25zdW1tZSBhIHNldHVwIGFzIGRlZmluZWQgaW4gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uXG4gKiAoc2VlIHtAbGluayBzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzfmFwcENvbmZpZ30gZm9yIGRldGFpbHMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRQbGFjZXIuanN+Q2xpZW50UGxhY2VyfSBvbiB0aGUgY2xpZW50IHNpZGUpXG4gKi9cbmNsYXNzIFNlcnZlclBsYWNlciBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBkZWZhdWx0cyAtIERlZmF1bHRzIG9wdGlvbnMgb2YgdGhlIHNlcnZpY2VcbiAgICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtkZWZhdWx0cy5zZXR1cFBhdGg9J3NldHVwJ10gLSBUaGUgcGF0aCB0byB0aGUgc2VydmVyJ3Mgc2V0dXBcbiAgICAgKiAgY29uZmlndXJhdGlvbiBlbnRyeSAoc2VlIHtAbGluayBzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzfmFwcENvbmZpZ30gZm9yIGRldGFpbHMpLlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2V0dXBQYXRoOiAnc2V0dXAnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgdGhpcy5zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3Qgc2V0dXBQYXRoID0gdGhpcy5vcHRpb25zLnNldHVwUGF0aDtcbiAgICBjb25zdCBzZXR1cENvbmZpZyA9IHRoaXMuc2hhcmVkQ29uZmlnLmdldChzZXR1cFBhdGgpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgZGVmaW5pbmcgZGltZW5zaW9ucyBhbmQgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IHNldHVwQ29uZmlnW3NldHVwUGF0aF07XG5cbiAgICBpZiAoIXRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uKVxuICAgICAgdGhpcy5zZXR1cC5tYXhDbGllbnRzUGVyUG9zaXRpb24gPSAxO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5jYXBhY2l0eSA9IGdldE9wdCh0aGlzLnNldHVwLmNhcGFjaXR5LCBJbmZpbml0eSwgMSk7XG5cbiAgICBpZiAodGhpcy5zZXR1cCkge1xuICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgY29uc3QgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuICAgICAgY29uc3QgbnVtTGFiZWxzID0gc2V0dXAubGFiZWxzID8gc2V0dXAubGFiZWxzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtUG9zaXRpb25zID0gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcykgKiBtYXhDbGllbnRzUGVyUG9zaXRpb247XG5cbiAgICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gbnVtUG9zaXRpb25zKVxuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gbnVtUG9zaXRpb25zO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gbWF4Q2FwYWNpdHkpXG4gICAgICB0aGlzLmNhcGFjaXR5ID0gbWF4Q2FwYWNpdHk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIGNsaWVudHMgY2hlY2tlZCBpbiB3aXRoIGNvcnJlc3BvbmluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtPYmplY3Q8TnVtYmVyLCBBcnJheT59XG4gICAgICovXG4gICAgdGhpcy5jbGllbnRzID0ge307XG5cbiAgICAvKipcbiAgICAgKiBOdW1iZXIgb2YgY29ubmVjdGVkIGNsaWVudHMuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm51bUNsaWVudHMgPSAwO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgaW5kZXhlcyBvZiB0aGUgZGlzYWJsZWQgcG9zaXRpb25zLlxuICAgICAqIEB0eXBlIHtBcnJheX1cbiAgICAgKi9cbiAgICB0aGlzLmRpc2FibGVkUG9zaXRpb25zID0gW107XG4gIH1cblxuICAvKipcbiAgICogU3RvcmUgdGhlIGNsaWVudCBpbiBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgc3VjY2VlZCwgYGZhbHNlYCBpZiBub3RcbiAgICovXG4gIF9zdG9yZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGlmIChwb3NpdGlvbkluZGV4KSB7XG4gICAgICBpZiAoIXRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSlcbiAgICAgICAgdGhpcy5jbGllbnRzW3Bvc2l0aW9uSW5kZXhdID0gW107XG5cbiAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF07XG5cbiAgICAgIGlmIChsaXN0Lmxlbmd0aCA8IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uICYmXG4gICAgICAgICAgdGhpcy5udW1DbGllbnRzIDwgdGhpcy5jYXBhY2l0eVxuICAgICAgKSB7XG4gICAgICAgIGxpc3QucHVzaChjbGllbnQpO1xuICAgICAgICB0aGlzLm51bUNsaWVudHMgKz0gMTtcbiAgICAgICAgLy8gaWYgbGFzdCBhdmFpbGFibGUgcGxhY2UgZm9yIHRoaXMgcG9zaXRpb24sIGxvY2sgaXRcbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID49IHRoaXMuc2V0dXAubWF4Q2xpZW50c1BlclBvc2l0aW9uKVxuICAgICAgICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMucHVzaChwb3NpdGlvbkluZGV4KTtcblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKi9cbiAgX3JlbW92ZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0gfHzCoFtdO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gbGlzdC5pbmRleE9mKGNsaWVudCk7XG5cbiAgICBpZiAoY2xpZW50SW5kZXggIT09IC0xKSB7XG4gICAgICBsaXN0LnNwbGljZShjbGllbnRJbmRleCwgMSk7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgbGlzdCB3YXMgbWFya2VkIGFzIGRpc2FibGVkXG4gICAgICBpZiAobGlzdC5sZW5ndGggPCB0aGlzLnNldHVwLm1heENsaWVudHNQZXJQb3NpdGlvbikge1xuICAgICAgICBjb25zdCBkaXNhYmxlZEluZGV4ID0gdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5pbmRleE9mKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICAgIGlmIChkaXNhYmxlZEluZGV4ICE9PSAtMSlcbiAgICAgICAgICB0aGlzLmRpc2FibGVkUG9zaXRpb25zLnNwbGljZShkaXNhYmxlZEluZGV4LCAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5udW1DbGllbnRzIC09IDE7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGNvbnN0IGNhcGFjaXR5ID0gdGhpcy5jYXBhY2l0eTtcbiAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgIGxldCBhcmVhID0gdW5kZWZpbmVkO1xuICAgICAgbGV0IGxhYmVscyA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgIGxhYmVscyA9IHNldHVwLmxhYmVscztcbiAgICAgICAgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcztcbiAgICAgICAgYXJlYSA9IHNldHVwLmFyZWE7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLm51bUNsaWVudHMgPCBjYXBhY2l0eSlcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3NldHVwJywgY2FwYWNpdHksIGxhYmVscywgY29vcmRpbmF0ZXMsIGFyZWEsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgICAgZWxzZVxuICAgICAgICB0aGlzLnNlbmQoJ3JlamVjdCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Qb3NpdGlvbihjbGllbnQpIHtcbiAgICByZXR1cm4gKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IHN1Y2Nlc3MgPSB0aGlzLl9zdG9yZUNsaWVudFBvc2l0aW9uKGluZGV4LCBjbGllbnQpO1xuXG4gICAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgICBjbGllbnQuaW5kZXggPSBpbmRleDtcbiAgICAgICAgY2xpZW50LmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maXJtJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lLlxuICAgICAgICB0aGlzLmJyb2FkY2FzdChudWxsLCBjbGllbnQsICdkaXNhYmxlLWluZGV4JywgaW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3JlamVjdCcsIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb24oY2xpZW50KSk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLl9yZW1vdmVDbGllbnRQb3NpdGlvbihjbGllbnQuaW5kZXgsIGNsaWVudCk7XG4gICAgLy8gQHRvZG8gLSBjaGVjayBpZiBzb21ldGhpbmcgbW9yZSBzdWJ0aWxlIHRoYW4gYSBicm9hZGNhc3QgY2FuIGJlIGRvbmUuXG4gICAgdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAnZW5hYmxlLWluZGV4JywgY2xpZW50LmluZGV4KTtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJQbGFjZXIpO1xuIl19
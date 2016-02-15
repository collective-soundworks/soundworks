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
 * Allow to select a place within a set of predefined positions (i.e. labels and/or coordinates).
 *
 * (See also {@link src/client/services/ClientPlacer.js~ClientPlacer} on the client side.)
 */

var ServerPlacer = (function (_ServerActivity) {
  _inherits(ServerPlacer, _ServerActivity);

  /**
   * Creates an instance of the class.
   *
   * @todo move this doc somewhere else.
   * @param {Object} [options.setup] Setup defining dimensions and predefined positions (labels and/or coordinates).
   * @param {String[]} [options.setup.width] Width of the setup.
   * @param {String[]} [options.setup.height] Height of the setup.
   * @param {String[]} [options.setup.background] Background (image) of the setup.
   * @param {String[]} [options.setup.labels] List of predefined labels.
   * @param {Array[]} [options.setup.coordinates] List of predefined coordinates given as an array `[x:Number, y:Number]`.
   * @param {Number} [options.capacity=Infinity] Maximum number of places (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   */

  function ServerPlacer() {
    _classCallCheck(this, ServerPlacer);

    _get(Object.getPrototypeOf(ServerPlacer.prototype), 'constructor', this).call(this, SERVICE_ID);

    var defaults = {
      setup: {},
      capacity: maxCapacity,
      maxClientsPerPosition: 1
    };

    this.configure(defaults);
  }

  _createClass(ServerPlacer, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'start', this).call(this);
      /**
       * Setup defining dimensions and predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = this.options.setup;

      /**
       * Maximum number of places.
       * @type {Number}
       */
      this.capacity = (0, _utilsHelpers.getOpt)(this.options.capacity, Infinity, 1);

      if (this.setup) {
        var setup = this.setup;
        var maxClientsPerPosition = this.options.maxClientsPerPosition;
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
      if (!this.clients[positionIndex]) this.clients[positionIndex] = [];

      var list = this.clients[positionIndex];

      if (list.length < this.options.maxClientsPerPosition && this.numClients < this.capacity) {
        list.push(client);
        this.numClients += 1;
        // if last available place for this position, lock it
        if (list.length >= this.options.maxClientsPerPosition) this.disabledPositions.push(positionIndex);

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
        if (list.length < this.options.maxClientsPerPosition) {
          var disabledIndex = this.disabledPositions.indexOf(positionIndex);

          if (disabledIndex !== -1) this.disabledPositions.splice(disabledIndex, 1);
        }

        this.numClients -= 1;
      }
    }
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
          area = {
            width: setup.width,
            height: setup.height,
            background: setup.background
          };
        }

        if (_this.numClients < capacity) _this.send(client, 'setup', capacity, labels, coordinates, area, _this.disabledPositions);else _this.send('reject', _this.disabledPositions);
      };
    }
  }, {
    key: '_onPosition',
    value: function _onPosition(client) {
      var _this2 = this;

      return function (index, label, coords) {
        var success = _this2._storeClientPosition(index, client);

        if (success) {
          client.index = index;
          client.label = label;
          client.coordinates = coords;

          _this2.send(client, 'confirm');
          // @todo - check if something more subtile than a broadcast can be done
          _this2.broadcast(null, client, 'disable-index', index);
        } else {
          _this2.send(client, 'reject', _this2.disabledPositions);
        }
      };
    }

    /**
     * @private
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'position', this._onPosition(client));
    }

    /**
     * @private
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerPlacer.prototype), 'disconnect', this).call(this, client);

      this._removeClientPosition(client.index, client);
      // @todo - check if something more subtile than a broadcast can be done
      this.broadcast(null, client, 'enable-index', client.index);
    }
  }]);

  return ServerPlacer;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerPlacer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyUGxhY2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7O3dDQUNsQiw4QkFBOEI7Ozs7NEJBQ3hDLHFCQUFxQjs7QUFFNUMsSUFBTSxVQUFVLEdBQUcsZ0JBQWdCLENBQUM7QUFDcEMsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDOzs7Ozs7OztJQU9uQixZQUFZO1lBQVosWUFBWTs7Ozs7Ozs7Ozs7Ozs7O0FBYUwsV0FiUCxZQUFZLEdBYUY7MEJBYlYsWUFBWTs7QUFjZCwrQkFkRSxZQUFZLDZDQWNSLFVBQVUsRUFBRTs7QUFFbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixXQUFLLEVBQUUsRUFBRTtBQUNULGNBQVEsRUFBRSxXQUFXO0FBQ3JCLDJCQUFxQixFQUFFLENBQUM7S0FDekIsQ0FBQTs7QUFFRCxRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQzFCOztlQXZCRyxZQUFZOztXQXlCWCxpQkFBRztBQUNOLGlDQTFCRSxZQUFZLHVDQTBCQTs7Ozs7QUFLZCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDOzs7Ozs7QUFNaEMsVUFBSSxDQUFDLFFBQVEsR0FBRywwQkFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTNELFVBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLFlBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDekIsWUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixDQUFDO0FBQ2pFLFlBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ2hFLFlBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQy9FLFlBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxHQUFHLHFCQUFxQixDQUFDOztBQUVqRixZQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxFQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztPQUNoQzs7QUFFRCxVQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsV0FBVyxFQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLFdBQVcsQ0FBQzs7Ozs7O0FBTTlCLFVBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFNbEIsVUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7Ozs7OztBQU1wQixVQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0tBQzdCOzs7Ozs7OztXQU1tQiw4QkFBQyxhQUFhLEVBQUUsTUFBTSxFQUFFO0FBQzFDLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxFQUM5QixJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFbkMsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFekMsVUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMscUJBQXFCLElBQ2hELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFDakM7QUFDQSxZQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2xCLFlBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDOztBQUVyQixZQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFDbkQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFN0MsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxhQUFPLEtBQUssQ0FBQztLQUNkOzs7Ozs7O1dBS29CLCtCQUFDLGFBQWEsRUFBRSxNQUFNLEVBQUU7QUFDM0MsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDL0MsVUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFekMsVUFBSSxXQUFXLEtBQUssQ0FBQyxDQUFDLEVBQUU7QUFDdEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRTVCLFlBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFO0FBQ3BELGNBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXBFLGNBQUksYUFBYSxLQUFLLENBQUMsQ0FBQyxFQUN0QixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRDs7QUFFRCxZQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQztPQUN0QjtLQUNGOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7OztBQUNqQixhQUFPLFlBQU07QUFDWCxZQUFNLFFBQVEsR0FBRyxNQUFLLFFBQVEsQ0FBQztBQUMvQixZQUFNLEtBQUssR0FBRyxNQUFLLEtBQUssQ0FBQztBQUN6QixZQUFJLElBQUksR0FBRyxTQUFTLENBQUM7QUFDckIsWUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3ZCLFlBQUksV0FBVyxHQUFHLFNBQVMsQ0FBQzs7QUFFNUIsWUFBSSxLQUFLLEVBQUU7QUFDVCxnQkFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7QUFDdEIscUJBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO0FBQ2hDLGNBQUksR0FBRztBQUNMLGlCQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsa0JBQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtBQUNwQixzQkFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1dBQzdCLENBQUE7U0FDRjs7QUFFRCxZQUFJLE1BQUssVUFBVSxHQUFHLFFBQVEsRUFDNUIsTUFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsTUFBSyxpQkFBaUIsQ0FBQyxDQUFDLEtBRXhGLE1BQUssSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFLLGlCQUFpQixDQUFDLENBQUM7T0FDL0MsQ0FBQTtLQUNGOzs7V0FFVSxxQkFBQyxNQUFNLEVBQUU7OztBQUNsQixhQUFPLFVBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUs7QUFDL0IsWUFBTSxPQUFPLEdBQUcsT0FBSyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBRXpELFlBQUksT0FBTyxFQUFFO0FBQ1gsZ0JBQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLGdCQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNyQixnQkFBTSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7O0FBRTVCLGlCQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7O0FBRTdCLGlCQUFLLFNBQVMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN0RCxNQUFNO0FBQ0wsaUJBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBSyxpQkFBaUIsQ0FBQyxDQUFDO1NBQ3JEO09BQ0YsQ0FBQTtLQUNGOzs7Ozs7O1dBS00saUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBcktFLFlBQVkseUNBcUtBLE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQzVEOzs7Ozs7O1dBS1Msb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQS9LRSxZQUFZLDRDQStLRyxNQUFNLEVBQUU7O0FBRXpCLFVBQUksQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDOztBQUVqRCxVQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM1RDs7O1NBcExHLFlBQVk7OztBQXVMbEIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUMiLCJmaWxlIjoic3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJQbGFjZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnBsYWNlcic7XG5jb25zdCBtYXhDYXBhY2l0eSA9IDk5OTk7XG5cbi8qKlxuICogQWxsb3cgdG8gc2VsZWN0IGEgcGxhY2Ugd2l0aGluIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRQbGFjZXIuanN+Q2xpZW50UGxhY2VyfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5jbGFzcyBTZXJ2ZXJQbGFjZXIgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICpcbiAgICogQHRvZG8gbW92ZSB0aGlzIGRvYyBzb21ld2hlcmUgZWxzZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNldHVwXSBTZXR1cCBkZWZpbmluZyBkaW1lbnNpb25zIGFuZCBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLnNldHVwLndpZHRoXSBXaWR0aCBvZiB0aGUgc2V0dXAuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLnNldHVwLmhlaWdodF0gSGVpZ2h0IG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc2V0dXAuYmFja2dyb3VuZF0gQmFja2dyb3VuZCAoaW1hZ2UpIG9mIHRoZSBzZXR1cC5cbiAgICogQHBhcmFtIHtTdHJpbmdbXX0gW29wdGlvbnMuc2V0dXAubGFiZWxzXSBMaXN0IG9mIHByZWRlZmluZWQgbGFiZWxzLlxuICAgKiBAcGFyYW0ge0FycmF5W119IFtvcHRpb25zLnNldHVwLmNvb3JkaW5hdGVzXSBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMgZ2l2ZW4gYXMgYW4gYXJyYXkgYFt4Ok51bWJlciwgeTpOdW1iZXJdYC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNhcGFjaXR5PUluZmluaXR5XSBNYXhpbXVtIG51bWJlciBvZiBwbGFjZXMgKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2YgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcyBkZWZpbmVkIGJ5IHRoZSBzZXR1cCkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgc2V0dXA6IHt9LFxuICAgICAgY2FwYWNpdHk6IG1heENhcGFjaXR5LFxuICAgICAgbWF4Q2xpZW50c1BlclBvc2l0aW9uOiAxLFxuICAgIH1cblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gICAgLyoqXG4gICAgICogU2V0dXAgZGVmaW5pbmcgZGltZW5zaW9ucyBhbmQgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IHRoaXMub3B0aW9ucy5zZXR1cDtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcy5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5vcHRpb25zLmNhcGFjaXR5LCBJbmZpbml0eSwgMSk7XG5cbiAgICBpZiAodGhpcy5zZXR1cCkge1xuICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgY29uc3QgbWF4Q2xpZW50c1BlclBvc2l0aW9uID0gdGhpcy5vcHRpb25zLm1heENsaWVudHNQZXJQb3NpdGlvbjtcbiAgICAgIGNvbnN0IG51bUxhYmVscyA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVscy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bUNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICAgIGNvbnN0IG51bVBvc2l0aW9ucyA9IE1hdGgubWluKG51bUxhYmVscywgbnVtQ29vcmRpbmF0ZXMpICogbWF4Q2xpZW50c1BlclBvc2l0aW9uO1xuXG4gICAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG51bVBvc2l0aW9ucylcbiAgICAgICAgdGhpcy5jYXBhY2l0eSA9IG51bVBvc2l0aW9ucztcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jYXBhY2l0eSA+IG1heENhcGFjaXR5KVxuICAgICAgdGhpcy5jYXBhY2l0eSA9IG1heENhcGFjaXR5O1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBjbGllbnRzIGNoZWNrZWQgaW4gd2l0aCBjb3JyZXNwb25pbmcgaW5kaWNlcy5cbiAgICAgKiBAdHlwZSB7T2JqZWN0PE51bWJlciwgQXJyYXk+fVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTnVtYmVyIG9mIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5udW1DbGllbnRzID0gMDtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGluZGV4ZXMgb2YgdGhlIGRpc2FibGVkIHBvc2l0aW9ucy5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyA9IFtdO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3JlIHRoZSBjbGllbnQgaW4gYSBnaXZlbiBwb3NpdGlvbi5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IC0gYHRydWVgIGlmIHN1Y2NlZWQsIGBmYWxzZWAgaWYgbm90XG4gICAqL1xuICBfc3RvcmVDbGllbnRQb3NpdGlvbihwb3NpdGlvbkluZGV4LCBjbGllbnQpIHtcbiAgICBpZiAoIXRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSlcbiAgICAgIHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XSA9IFtdO1xuXG4gICAgY29uc3QgbGlzdCA9IHRoaXMuY2xpZW50c1twb3NpdGlvbkluZGV4XTtcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA8IHRoaXMub3B0aW9ucy5tYXhDbGllbnRzUGVyUG9zaXRpb24gJiZcbiAgICAgICAgdGhpcy5udW1DbGllbnRzIDwgdGhpcy5jYXBhY2l0eVxuICAgICkge1xuICAgICAgbGlzdC5wdXNoKGNsaWVudCk7XG4gICAgICB0aGlzLm51bUNsaWVudHMgKz0gMTtcbiAgICAgIC8vIGlmIGxhc3QgYXZhaWxhYmxlIHBsYWNlIGZvciB0aGlzIHBvc2l0aW9uLCBsb2NrIGl0XG4gICAgICBpZiAobGlzdC5sZW5ndGggPj0gdGhpcy5vcHRpb25zLm1heENsaWVudHNQZXJQb3NpdGlvbilcbiAgICAgICAgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucy5wdXNoKHBvc2l0aW9uSW5kZXgpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBjbGllbnQgZnJvbSBhIGdpdmVuIHBvc2l0aW9uLlxuICAgKi9cbiAgX3JlbW92ZUNsaWVudFBvc2l0aW9uKHBvc2l0aW9uSW5kZXgsIGNsaWVudCkge1xuICAgIGNvbnN0IGxpc3QgPSB0aGlzLmNsaWVudHNbcG9zaXRpb25JbmRleF0gfHzCoFtdO1xuICAgIGNvbnN0IGNsaWVudEluZGV4ID0gbGlzdC5pbmRleE9mKGNsaWVudCk7XG5cbiAgICBpZiAoY2xpZW50SW5kZXggIT09IC0xKSB7XG4gICAgICBsaXN0LnNwbGljZShjbGllbnRJbmRleCwgMSk7XG4gICAgICAvLyBjaGVjayBpZiB0aGUgbGlzdCB3YXMgbWFya2VkIGFzIGRpc2FibGVkXG4gICAgICBpZiAobGlzdC5sZW5ndGggPCB0aGlzLm9wdGlvbnMubWF4Q2xpZW50c1BlclBvc2l0aW9uKSB7XG4gICAgICAgIGNvbnN0IGRpc2FibGVkSW5kZXggPSB0aGlzLmRpc2FibGVkUG9zaXRpb25zLmluZGV4T2YocG9zaXRpb25JbmRleCk7XG5cbiAgICAgICAgaWYgKGRpc2FibGVkSW5kZXggIT09IC0xKVxuICAgICAgICAgIHRoaXMuZGlzYWJsZWRQb3NpdGlvbnMuc3BsaWNlKGRpc2FibGVkSW5kZXgsIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm51bUNsaWVudHMgLT0gMTtcbiAgICB9XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBjYXBhY2l0eSA9IHRoaXMuY2FwYWNpdHk7XG4gICAgICBjb25zdCBzZXR1cCA9IHRoaXMuc2V0dXA7XG4gICAgICBsZXQgYXJlYSA9IHVuZGVmaW5lZDtcbiAgICAgIGxldCBsYWJlbHMgPSB1bmRlZmluZWQ7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChzZXR1cCkge1xuICAgICAgICBsYWJlbHMgPSBzZXR1cC5sYWJlbHM7XG4gICAgICAgIGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXM7XG4gICAgICAgIGFyZWEgPSB7XG4gICAgICAgICAgd2lkdGg6IHNldHVwLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogc2V0dXAuaGVpZ2h0LFxuICAgICAgICAgIGJhY2tncm91bmQ6IHNldHVwLmJhY2tncm91bmQsXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMubnVtQ2xpZW50cyA8IGNhcGFjaXR5KVxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnc2V0dXAnLCBjYXBhY2l0eSwgbGFiZWxzLCBjb29yZGluYXRlcywgYXJlYSwgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICBlbHNlXG4gICAgICAgIHRoaXMuc2VuZCgncmVqZWN0JywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgX29uUG9zaXRpb24oY2xpZW50KSB7XG4gICAgcmV0dXJuIChpbmRleCwgbGFiZWwsIGNvb3JkcykgPT4ge1xuICAgICAgY29uc3Qgc3VjY2VzcyA9IHRoaXMuX3N0b3JlQ2xpZW50UG9zaXRpb24oaW5kZXgsIGNsaWVudCk7XG5cbiAgICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICAgIGNsaWVudC5pbmRleCA9IGluZGV4O1xuICAgICAgICBjbGllbnQubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maXJtJyk7XG4gICAgICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lXG4gICAgICAgIHRoaXMuYnJvYWRjYXN0KG51bGwsIGNsaWVudCwgJ2Rpc2FibGUtaW5kZXgnLCBpbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncmVqZWN0JywgdGhpcy5kaXNhYmxlZFBvc2l0aW9ucyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdwb3NpdGlvbicsIHRoaXMuX29uUG9zaXRpb24oY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5fcmVtb3ZlQ2xpZW50UG9zaXRpb24oY2xpZW50LmluZGV4LCBjbGllbnQpO1xuICAgIC8vIEB0b2RvIC0gY2hlY2sgaWYgc29tZXRoaW5nIG1vcmUgc3VidGlsZSB0aGFuIGEgYnJvYWRjYXN0IGNhbiBiZSBkb25lXG4gICAgdGhpcy5icm9hZGNhc3QobnVsbCwgY2xpZW50LCAnZW5hYmxlLWluZGV4JywgY2xpZW50LmluZGV4KTtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJQbGFjZXIpO1xuIl19
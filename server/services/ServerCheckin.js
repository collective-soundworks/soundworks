'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Number$isInteger = require('babel-runtime/core-js/number/is-integer')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _utilsHelpers = require('../../utils/helpers');

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var SERVICE_ID = 'service:checkin';

/**
 * Assign places among a set of predefined positions (i.e. labels and/or coordinates).
 *
 * The module assigns a position to a client upon request of the client-side module.
 *
 * (See also {@link src/client/ClientCheckin.js~ClientCheckin} on the client side.)
 *
 * @example
 * const checkin = new ServerCheckin({ capacity: 100, order: 'random' });
 */

var ServerCheckin = (function (_ServerActivity) {
  _inherits(ServerCheckin, _ServerActivity);

  /**
   * @param {Object} [options={}] Options.
   * @attribute {String} [defaults.setupConfigPath='setup'] - The path to the server's
   *  setup configuration entry (see {@link src/server/core/server.js~appConfig} for details).
   * @param {Object} [options.order='ascending'] - The order in which indices are assigned.
   *  Currently supported values are:
   * - `'ascending'`: indices are assigned in ascending order
   * - `'random'`: indices are assigned in random order
   */

  function ServerCheckin() {
    _classCallCheck(this, ServerCheckin);

    _get(Object.getPrototypeOf(ServerCheckin.prototype), 'constructor', this).call(this, SERVICE_ID);

    var defaults = {
      order: 'ascending',
      setupConfigPath: 'setup'
    };

    this.configure(defaults);

    // use shared config service to share the setup
    this._sharedConfigService = this.require('shared-config');
  }

  _createClass(ServerCheckin, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'start', this).call(this);

      var setupConfigPath = this.options.setupConfigPath;
      var setupConfig = this._sharedConfigService.get(setupConfigPath);

      /**
       * Setup defining predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = setupConfig && setupConfig[setupConfigPath];

      /**
       * Maximum number of clients checked in (may limit or be limited by the number of predefined labels and/or coordinates).
       * @type {Number}
       */
      this.capacity = (0, _utilsHelpers.getOpt)(this.setup.capacity, Infinity, 1);

      /**
       * List of the clients checked in with corresponing indices.
       * @type {Client[]}
       */
      this.clients = [];

      /**
       * Order in which indices are assigned. Currently supported values are:
       * - `'ascending'`: assigns indices in ascending order;
       * - `'random'`: assigns indices in random order.
       * @type {[type]}
       */
      this.order = this.options; // 'ascending' | 'random'

      this._availableIndices = [];
      this._nextAscendingIndex = 0;

      var setup = this.options.setup;

      if (setup) {
        var numLabels = setup.labels ? setup.labels.length : Infinity;
        var numCoordinates = setup.coordinates ? setup.coordinates.length : Infinity;
        var numPositions = Math.min(numLabels, numCoordinates);

        if (this.capacity > numPositions) this.capacity = numPositions;
      }

      if (this.capacity === Infinity) this.order = 'ascending';else if (this.order === 'random') {
        this._nextAscendingIndex = this.capacity;

        for (var i = 0; i < this.capacity; i++) {
          this._availableIndices.push(i);
        }
      }
    }
  }, {
    key: '_getRandomIndex',
    value: function _getRandomIndex() {
      var numAvailable = this._availableIndices.length;

      if (numAvailable > 0) {
        var random = Math.floor(Math.random() * numAvailable);
        return this._availableIndices.splice(random, 1)[0];
      }

      return -1;
    }
  }, {
    key: '_getAscendingIndex',
    value: function _getAscendingIndex() {
      if (this._availableIndices.length > 0) {
        this._availableIndices.sort(function (a, b) {
          return a - b;
        });

        return this._availableIndices.splice(0, 1)[0];
      } else if (this._nextAscendingIndex < this.capacity) {
        return this._nextAscendingIndex++;
      }

      return -1;
    }
  }, {
    key: '_releaseIndex',
    value: function _releaseIndex(index) {
      if (_Number$isInteger(index)) this._availableIndices.push(index);
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this = this;

      return function () {
        var index = -1;

        if (_this.order === 'random') index = _this._getRandomIndex();else // if (order === 'acsending')
          index = _this._getAscendingIndex();

        client.index = index;

        if (index >= 0) {
          var setup = _this.setup;
          var label = undefined;
          var coordinates = undefined;

          if (setup) {
            label = setup.labels ? setup.labels[index] : undefined;
            coordinates = setup.coordinates ? setup.coordinates[index] : undefined;

            client.label = label;
            client.coordinates = coordinates;
          }

          _this.clients[index] = client;
          _this.send(client, 'position', index, label, coordinates);
        } else {
          _this.send(client, 'unavailable');
        }
      };
    }

    /** @inheritdoc */
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
    }

    /** @inheritdoc */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'disconnect', this).call(this, client);

      var index = client.index;

      if (index >= 0) {
        delete this.clients[index];
        this._releaseIndex(index);
      }
    }
  }]);

  return ServerCheckin;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerCheckin);

exports['default'] = ServerCheckin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozs0QkFDNUIscUJBQXFCOzt3Q0FDWCw4QkFBOEI7Ozs7QUFFL0QsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7SUFZL0IsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7Ozs7OztBQVVOLFdBVlAsYUFBYSxHQVVIOzBCQVZWLGFBQWE7O0FBV2YsK0JBWEUsYUFBYSw2Q0FXVCxVQUFVLEVBQUU7O0FBRWxCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsV0FBSyxFQUFFLFdBQVc7QUFDbEIscUJBQWUsRUFBRSxPQUFPO0tBQ3pCLENBQUE7O0FBRUQsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3pCLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQzNEOztlQXRCRyxhQUFhOztXQXdCWixpQkFBRztBQUNOLGlDQXpCRSxhQUFhLHVDQXlCRDs7QUFFZCxVQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQztBQUNyRCxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7Ozs7QUFNbkUsVUFBSSxDQUFDLEtBQUssR0FBRyxXQUFXLElBQUksV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDOzs7Ozs7QUFNekQsVUFBSSxDQUFDLFFBQVEsR0FBRywwQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Ozs7OztBQU16RCxVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7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RTtBQUNkLGVBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixZQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQzNCO0tBQ0Y7OztTQWhLRyxhQUFhOzs7QUFtS25CLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFMUMsYUFBYSIsImZpbGUiOiIvVXNlcnMvbWF0dXN6ZXdza2kvZGV2L2Nvc2ltYS9saWIvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlckNoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmNoZWNraW4nO1xuXG4vKipcbiAqIEFzc2lnbiBwbGFjZXMgYW1vbmcgYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogVGhlIG1vZHVsZSBhc3NpZ25zIGEgcG9zaXRpb24gdG8gYSBjbGllbnQgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQtc2lkZSBtb2R1bGUuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanN+Q2xpZW50Q2hlY2tpbn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgY2hlY2tpbiA9IG5ldyBTZXJ2ZXJDaGVja2luKHsgY2FwYWNpdHk6IDEwMCwgb3JkZXI6ICdyYW5kb20nIH0pO1xuICovXG5jbGFzcyBTZXJ2ZXJDaGVja2luIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtkZWZhdWx0cy5zZXR1cENvbmZpZ1BhdGg9J3NldHVwJ10gLSBUaGUgcGF0aCB0byB0aGUgc2VydmVyJ3NcbiAgICogIHNldHVwIGNvbmZpZ3VyYXRpb24gZW50cnkgKHNlZSB7QGxpbmsgc3JjL3NlcnZlci9jb3JlL3NlcnZlci5qc35hcHBDb25maWd9IGZvciBkZXRhaWxzKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm9yZGVyPSdhc2NlbmRpbmcnXSAtIFRoZSBvcmRlciBpbiB3aGljaCBpbmRpY2VzIGFyZSBhc3NpZ25lZC5cbiAgICogIEN1cnJlbnRseSBzdXBwb3J0ZWQgdmFsdWVzIGFyZTpcbiAgICogLSBgJ2FzY2VuZGluZydgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAgICogLSBgJ3JhbmRvbSdgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiByYW5kb20gb3JkZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBvcmRlcjogJ2FzY2VuZGluZycsXG4gICAgICBzZXR1cENvbmZpZ1BhdGg6ICdzZXR1cCcsXG4gICAgfVxuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgLy8gdXNlIHNoYXJlZCBjb25maWcgc2VydmljZSB0byBzaGFyZSB0aGUgc2V0dXBcbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgY29uc3Qgc2V0dXBDb25maWdQYXRoID0gdGhpcy5vcHRpb25zLnNldHVwQ29uZmlnUGF0aDtcbiAgICBjb25zdCBzZXR1cENvbmZpZyA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KHNldHVwQ29uZmlnUGF0aCk7XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBkZWZpbmluZyBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gc2V0dXBDb25maWcgJiYgc2V0dXBDb25maWdbc2V0dXBDb25maWdQYXRoXTtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgY2hlY2tlZCBpbiAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBwcmVkZWZpbmVkIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5jYXBhY2l0eSA9IGdldE9wdCh0aGlzLnNldHVwLmNhcGFjaXR5LCBJbmZpbml0eSwgMSk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIGNoZWNrZWQgaW4gd2l0aCBjb3JyZXNwb25pbmcgaW5kaWNlcy5cbiAgICAgKiBAdHlwZSB7Q2xpZW50W119XG4gICAgICovXG4gICAgdGhpcy5jbGllbnRzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBPcmRlciBpbiB3aGljaCBpbmRpY2VzIGFyZSBhc3NpZ25lZC4gQ3VycmVudGx5IHN1cHBvcnRlZCB2YWx1ZXMgYXJlOlxuICAgICAqIC0gYCdhc2NlbmRpbmcnYDogYXNzaWducyBpbmRpY2VzIGluIGFzY2VuZGluZyBvcmRlcjtcbiAgICAgKiAtIGAncmFuZG9tJ2A6IGFzc2lnbnMgaW5kaWNlcyBpbiByYW5kb20gb3JkZXIuXG4gICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgKi9cbiAgICB0aGlzLm9yZGVyID0gdGhpcy5vcHRpb25zOyAvLyAnYXNjZW5kaW5nJyB8ICdyYW5kb20nXG5cbiAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzID0gW107XG4gICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gMDtcblxuICAgIGNvbnN0IHNldHVwID0gdGhpcy5vcHRpb25zLnNldHVwO1xuXG4gICAgaWYgKHNldHVwKSB7XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPT09IEluZmluaXR5KVxuICAgICAgdGhpcy5vcmRlciA9ICdhc2NlbmRpbmcnO1xuICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKSB7XG4gICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSB0aGlzLmNhcGFjaXR5O1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FwYWNpdHk7IGkrKylcbiAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSYW5kb21JbmRleCgpIHtcbiAgICBjb25zdCBudW1BdmFpbGFibGUgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aDtcblxuICAgIGlmIChudW1BdmFpbGFibGUgPiAwKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1BdmFpbGFibGUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKHJhbmRvbSwgMSlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX3JlbGVhc2VJbmRleChpbmRleCkge1xuICAgIGlmIChOdW1iZXIuaXNJbnRlZ2VyKGluZGV4KSlcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpbmRleCk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBsZXQgaW5kZXggPSAtMTtcblxuICAgICAgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldFJhbmRvbUluZGV4KCk7XG4gICAgICBlbHNlIC8vIGlmIChvcmRlciA9PT0gJ2Fjc2VuZGluZycpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0QXNjZW5kaW5nSW5kZXgoKTtcblxuICAgICAgY2xpZW50LmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgICAgbGV0IGxhYmVsO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXM7XG5cbiAgICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgICAgbGFiZWwgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHNbaW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgIGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlc1tpbmRleF0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBjbGllbnQubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY2xpZW50c1tpbmRleF0gPSBjbGllbnQ7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdwb3NpdGlvbicsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3VuYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IGluZGV4ID0gY2xpZW50LmluZGV4O1xuXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmNsaWVudHNbaW5kZXhdO1xuICAgICAgdGhpcy5fcmVsZWFzZUluZGV4KGluZGV4KTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyQ2hlY2tpbik7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlckNoZWNraW47XG4iXX0=
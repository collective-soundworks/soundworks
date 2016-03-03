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
   * @attribute {String} [defaults.setupConfigItem='setup'] - The path to the server's
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
      setupConfigItem: 'setup'
    };

    this.configure(defaults);

    // use shared config service to share the setup
    this._sharedConfigService = this.require('shared-config');
  }

  _createClass(ServerCheckin, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'start', this).call(this);

      /**
       * Setup defining predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = this._sharedConfigService.get(this.options.setupConfigItem);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7a0NBQTJCLHdCQUF3Qjs7Ozs0QkFDNUIscUJBQXFCOzt3Q0FDWCw4QkFBOEI7Ozs7QUFFL0QsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7Ozs7Ozs7Ozs7Ozs7SUFZL0IsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7Ozs7OztBQVVOLFdBVlAsYUFBYSxHQVVIOzBCQVZWLGFBQWE7O0FBV2YsK0JBWEUsYUFBYSw2Q0FXVCxVQUFVLEVBQUU7O0FBRWxCLFFBQU0sUUFBUSxHQUFHO0FBQ2YsV0FBSyxFQUFFLFdBQVc7QUFDbEIscUJBQWUsRUFBRSxPQUFPO0tBQ3pCLENBQUE7O0FBRUQsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3pCLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQzNEOztlQXRCRyxhQUFhOztXQXdCWixpQkFBRztBQUNOLGlDQXpCRSxhQUFhLHVDQXlCRDs7Ozs7O0FBTWQsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7Ozs7OztBQU16RSxVQUFJLENBQUMsUUFBUSxHQUFHLDBCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7Ozs7O0FBTXpELFVBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7OztBQVFsQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7O0FBRTFCLFVBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFD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T0FDM0I7S0FDRjs7O1NBN0pHLGFBQWE7OztBQWdLbkIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUUxQyxhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6Y2hlY2tpbic7XG5cbi8qKlxuICogQXNzaWduIHBsYWNlcyBhbW9uZyBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFzc2lnbnMgYSBwb3NpdGlvbiB0byBhIGNsaWVudCB1cG9uIHJlcXVlc3Qgb2YgdGhlIGNsaWVudC1zaWRlIG1vZHVsZS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qc35DbGllbnRDaGVja2lufSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBjaGVja2luID0gbmV3IFNlcnZlckNoZWNraW4oeyBjYXBhY2l0eTogMTAwLCBvcmRlcjogJ3JhbmRvbScgfSk7XG4gKi9cbmNsYXNzIFNlcnZlckNoZWNraW4gZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2RlZmF1bHRzLnNldHVwQ29uZmlnSXRlbT0nc2V0dXAnXSAtIFRoZSBwYXRoIHRvIHRoZSBzZXJ2ZXInc1xuICAgKiAgc2V0dXAgY29uZmlndXJhdGlvbiBlbnRyeSAoc2VlIHtAbGluayBzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzfmFwcENvbmZpZ30gZm9yIGRldGFpbHMpLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMub3JkZXI9J2FzY2VuZGluZyddIC0gVGhlIG9yZGVyIGluIHdoaWNoIGluZGljZXMgYXJlIGFzc2lnbmVkLlxuICAgKiAgQ3VycmVudGx5IHN1cHBvcnRlZCB2YWx1ZXMgYXJlOlxuICAgKiAtIGAnYXNjZW5kaW5nJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIGFzY2VuZGluZyBvcmRlclxuICAgKiAtIGAncmFuZG9tJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIHJhbmRvbSBvcmRlclxuICAgKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIG9yZGVyOiAnYXNjZW5kaW5nJyxcbiAgICAgIHNldHVwQ29uZmlnSXRlbTogJ3NldHVwJyxcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICAvLyB1c2Ugc2hhcmVkIGNvbmZpZyBzZXJ2aWNlIHRvIHNoYXJlIHRoZSBzZXR1cFxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvKipcbiAgICAgKiBTZXR1cCBkZWZpbmluZyBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQodGhpcy5vcHRpb25zLnNldHVwQ29uZmlnSXRlbSk7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGNoZWNrZWQgaW4gKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2YgcHJlZGVmaW5lZCBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5zZXR1cC5jYXBhY2l0eSwgSW5maW5pdHksIDEpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgY2xpZW50cyBjaGVja2VkIGluIHdpdGggY29ycmVzcG9uaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogT3JkZXIgaW4gd2hpY2ggaW5kaWNlcyBhcmUgYXNzaWduZWQuIEN1cnJlbnRseSBzdXBwb3J0ZWQgdmFsdWVzIGFyZTpcbiAgICAgKiAtIGAnYXNjZW5kaW5nJ2A6IGFzc2lnbnMgaW5kaWNlcyBpbiBhc2NlbmRpbmcgb3JkZXI7XG4gICAgICogLSBgJ3JhbmRvbSdgOiBhc3NpZ25zIGluZGljZXMgaW4gcmFuZG9tIG9yZGVyLlxuICAgICAqIEB0eXBlIHtbdHlwZV19XG4gICAgICovXG4gICAgdGhpcy5vcmRlciA9IHRoaXMub3B0aW9uczsgLy8gJ2FzY2VuZGluZycgfCAncmFuZG9tJ1xuXG4gICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcyA9IFtdO1xuICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IDA7XG5cbiAgICBjb25zdCBzZXR1cCA9IHRoaXMub3B0aW9ucy5zZXR1cDtcblxuICAgIGlmIChzZXR1cCkge1xuICAgICAgY29uc3QgbnVtTGFiZWxzID0gc2V0dXAubGFiZWxzID8gc2V0dXAubGFiZWxzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtUG9zaXRpb25zID0gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcyk7XG5cbiAgICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gbnVtUG9zaXRpb25zKVxuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gbnVtUG9zaXRpb25zO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhcGFjaXR5ID09PSBJbmZpbml0eSlcbiAgICAgIHRoaXMub3JkZXIgPSAnYXNjZW5kaW5nJztcbiAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSAncmFuZG9tJykge1xuICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gdGhpcy5jYXBhY2l0eTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcGFjaXR5OyBpKyspXG4gICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UmFuZG9tSW5kZXgoKSB7XG4gICAgY29uc3QgbnVtQXZhaWxhYmxlID0gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGg7XG5cbiAgICBpZiAobnVtQXZhaWxhYmxlID4gMCkge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtQXZhaWxhYmxlKTtcbiAgICAgIHJldHVybiB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNwbGljZShyYW5kb20sIDEpWzBdO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIF9nZXRBc2NlbmRpbmdJbmRleCgpIHtcbiAgICBpZiAodGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKDAsIDEpWzBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4IDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIF9yZWxlYXNlSW5kZXgoaW5kZXgpIHtcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihpbmRleCkpXG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaW5kZXgpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgIGlmICh0aGlzLm9yZGVyID09PSAncmFuZG9tJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRSYW5kb21JbmRleCgpO1xuICAgICAgZWxzZSAvLyBpZiAob3JkZXIgPT09ICdhY3NlbmRpbmcnKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldEFzY2VuZGluZ0luZGV4KCk7XG5cbiAgICAgIGNsaWVudC5pbmRleCA9IGluZGV4O1xuXG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBjb25zdCBzZXR1cCA9IHRoaXMuc2V0dXA7XG4gICAgICAgIGxldCBsYWJlbDtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIGlmIChzZXR1cCkge1xuICAgICAgICAgIGxhYmVsID0gc2V0dXAubGFiZWxzID8gc2V0dXAubGFiZWxzW2luZGV4XSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICBjb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXNbaW5kZXhdIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgY2xpZW50LmxhYmVsID0gbGFiZWw7XG4gICAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsaWVudHNbaW5kZXhdID0gY2xpZW50O1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncG9zaXRpb24nLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICd1bmF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBpbmRleCA9IGNsaWVudC5pbmRleDtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBkZWxldGUgdGhpcy5jbGllbnRzW2luZGV4XTtcbiAgICAgIHRoaXMuX3JlbGVhc2VJbmRleChpbmRleCk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlckNoZWNraW4pO1xuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXJDaGVja2luO1xuIl19
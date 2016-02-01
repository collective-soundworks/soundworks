'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

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
   * @param {Object} [options.name='checkin'] Name of the module.
   * @param {Object} [options.setup] Setup defining predefined positions (labels and/or coordinates).
   * @param {String[]} [options.setup.labels] List of predefined labels.
   * @param {Array[]} [options.setup.coordinates] List of predefined coordinates given as an array `[x:Number, y:Number]`.
   * @param {Number} [options.capacity=Infinity] Maximum number of places (may limit or be limited by the number of labels and/or coordinates defined by the setup).
   * @param {Object} [options.order='ascending'] Order in which indices are assigned. Currently spported values are:
   * - `'ascending'`: indices are assigned in ascending order
   * - `'random'`: indices are assigned in random order
   */

  function ServerCheckin() {
    _classCallCheck(this, ServerCheckin);

    _get(Object.getPrototypeOf(ServerCheckin.prototype), 'constructor', this).call(this, SERVICE_ID);
  }

  _createClass(ServerCheckin, [{
    key: 'start',
    value: function start() {
      /**
       * Setup defining predefined positions (labels and/or coordinates).
       * @type {Object}
       */
      this.setup = this.options.setup;

      /**
       * Maximum number of clients checked in (may limit or be limited by the number of predefined labels and/or coordinates).
       * @type {Number}
       */
      this.capacity = (0, _utilsHelpers.getOpt)(this.options.capacity, Infinity, 1);

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
      this.order = this.options.order || 'ascending'; // 'ascending' | 'random'

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
      this._availableIndices.push(index);
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this = this;

      return function () {
        var index = -1;

        if (_this.order === 'random') index = _this._getRandomIndex();else // if (order === 'acsending')
          index = _this._getAscendingIndex();

        client.modules[_this.id].index = index;

        if (index >= 0) {
          var setup = _this.setup;
          var label = undefined;
          var coordinates = undefined;

          if (setup) {
            label = setup.labels ? setup.labels[index] : undefined;
            coordinates = setup.coordinates ? setup.coordinates[index] : undefined;

            client.modules[_this.id].label = label;
            client.coordinates = coordinates;
          }

          _this.clients[index] = client;
          _this.send(client, 'position', index, label, coordinates);
        } else {
          _this.send(client, 'unavailable');
        }
      };
    }

    // _onRestart(client) {
    //   return (index, label, coordinates) => {
    //     // TODO: check if that's ok on random mode
    //     if (index > this._nextAscendingIndex) {
    //       for (let i = this._nextAscendingIndex; i < index; i++)
    //         this._availableIndices.push(i);

    //       this._nextAscendingIndex = index + 1;
    //     } else if (index === this._nextAscendingIndex) {
    //       this._nextAscendingIndex++;
    //     } else {
    //       let i = this._availableIndices.indexOf(index);

    //       if (i >= 0)
    //         this._availableIndices.splice(i, 1);
    //     }

    //     client.modules[this.id].index = index;
    //     this.clients[index] = client;

    //     if (label !== null)
    //       client.modules[this.id].label = label;

    //     if(coordinates !== null)
    //       client.coordinates = coordinates;
    //   }
    // }

    /** @inheritdoc */
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      // this.receive(client, 'restart', this._onRestart(client));
    }

    /** @inheritdoc */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'disconnect', this).call(this, client);

      var index = client.modules[this.id].index;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7NEJBQzVCLHFCQUFxQjs7d0NBQ2pCLDhCQUE4Qjs7OztBQUV6RCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7Ozs7OztJQVkvQixhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7Ozs7Ozs7QUFZTixXQVpQLGFBQWEsR0FZSDswQkFaVixhQUFhOztBQWFmLCtCQWJFLGFBQWEsNkNBYVQsVUFBVSxFQUFFO0dBQ25COztlQWRHLGFBQWE7O1dBZ0JaLGlCQUFHOzs7OztBQUtOLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7Ozs7OztBQU1oQyxVQUFJLENBQUMsUUFBUSxHQUFHLDBCQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQzs7Ozs7O0FBTTNELFVBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7OztBQVFsQixVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQzs7QUFFL0MsVUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM1QixVQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDOztBQUU3QixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQzs7QUFFakMsVUFBSSxLQUFLLEVBQUU7QUFDVCxZQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUNoRSxZQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FB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TyxDQUFDLE1BQUssRUFBRSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN0QyxrQkFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7V0FDbEM7O0FBRUQsZ0JBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQztBQUM3QixnQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1NBQzFELE1BQU07QUFDTCxnQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1NBQ2xDO09BQ0YsQ0FBQTtLQUNGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0ErQk0saUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBOUpFLGFBQWEseUNBOEpELE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7S0FFMUQ7Ozs7O1dBR1Msb0JBQUMsTUFBTSxFQUFFO0FBQ2pCLGlDQXRLRSxhQUFhLDRDQXNLRSxNQUFNLEVBQUU7O0FBRXpCLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFNUMsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2QsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDM0I7S0FDRjs7O1NBOUtHLGFBQWE7OztBQWlMbkIsc0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQzs7cUJBRXBDLGFBQWEiLCJmaWxlIjoic3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpjaGVja2luJztcblxuLyoqXG4gKiBBc3NpZ24gcGxhY2VzIGFtb25nIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIFRoZSBtb2R1bGUgYXNzaWducyBhIHBvc2l0aW9uIHRvIGEgY2xpZW50IHVwb24gcmVxdWVzdCBvZiB0aGUgY2xpZW50LXNpZGUgbW9kdWxlLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRDaGVja2luLmpzfkNsaWVudENoZWNraW59IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgU2VydmVyQ2hlY2tpbih7IGNhcGFjaXR5OiAxMDAsIG9yZGVyOiAncmFuZG9tJyB9KTtcbiAqL1xuY2xhc3MgU2VydmVyQ2hlY2tpbiBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2NoZWNraW4nXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zZXR1cF0gU2V0dXAgZGVmaW5pbmcgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgKiBAcGFyYW0ge1N0cmluZ1tdfSBbb3B0aW9ucy5zZXR1cC5sYWJlbHNdIExpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gICAqIEBwYXJhbSB7QXJyYXlbXX0gW29wdGlvbnMuc2V0dXAuY29vcmRpbmF0ZXNdIExpc3Qgb2YgcHJlZGVmaW5lZCBjb29yZGluYXRlcyBnaXZlbiBhcyBhbiBhcnJheSBgW3g6TnVtYmVyLCB5Ok51bWJlcl1gLlxuICAgKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMuY2FwYWNpdHk9SW5maW5pdHldIE1heGltdW0gbnVtYmVyIG9mIHBsYWNlcyAobWF5IGxpbWl0IG9yIGJlIGxpbWl0ZWQgYnkgdGhlIG51bWJlciBvZiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzIGRlZmluZWQgYnkgdGhlIHNldHVwKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm9yZGVyPSdhc2NlbmRpbmcnXSBPcmRlciBpbiB3aGljaCBpbmRpY2VzIGFyZSBhc3NpZ25lZC4gQ3VycmVudGx5IHNwcG9ydGVkIHZhbHVlcyBhcmU6XG4gICAqIC0gYCdhc2NlbmRpbmcnYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gYXNjZW5kaW5nIG9yZGVyXG4gICAqIC0gYCdyYW5kb20nYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gcmFuZG9tIG9yZGVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIC8qKlxuICAgICAqIFNldHVwIGRlZmluaW5nIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSB0aGlzLm9wdGlvbnMuc2V0dXA7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGNoZWNrZWQgaW4gKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2YgcHJlZGVmaW5lZCBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQodGhpcy5vcHRpb25zLmNhcGFjaXR5LCBJbmZpbml0eSwgMSk7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHRoZSBjbGllbnRzIGNoZWNrZWQgaW4gd2l0aCBjb3JyZXNwb25pbmcgaW5kaWNlcy5cbiAgICAgKiBAdHlwZSB7Q2xpZW50W119XG4gICAgICovXG4gICAgdGhpcy5jbGllbnRzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBPcmRlciBpbiB3aGljaCBpbmRpY2VzIGFyZSBhc3NpZ25lZC4gQ3VycmVudGx5IHN1cHBvcnRlZCB2YWx1ZXMgYXJlOlxuICAgICAqIC0gYCdhc2NlbmRpbmcnYDogYXNzaWducyBpbmRpY2VzIGluIGFzY2VuZGluZyBvcmRlcjtcbiAgICAgKiAtIGAncmFuZG9tJ2A6IGFzc2lnbnMgaW5kaWNlcyBpbiByYW5kb20gb3JkZXIuXG4gICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgKi9cbiAgICB0aGlzLm9yZGVyID0gdGhpcy5vcHRpb25zLm9yZGVyIHx8ICdhc2NlbmRpbmcnOyAvLyAnYXNjZW5kaW5nJyB8ICdyYW5kb20nXG5cbiAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzID0gW107XG4gICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gMDtcblxuICAgIGNvbnN0IHNldHVwID0gdGhpcy5vcHRpb25zLnNldHVwO1xuXG4gICAgaWYgKHNldHVwKSB7XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPT09IEluZmluaXR5KVxuICAgICAgdGhpcy5vcmRlciA9ICdhc2NlbmRpbmcnO1xuICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKSB7XG4gICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSB0aGlzLmNhcGFjaXR5O1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FwYWNpdHk7IGkrKylcbiAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSYW5kb21JbmRleCgpIHtcbiAgICBjb25zdCBudW1BdmFpbGFibGUgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aDtcblxuICAgIGlmIChudW1BdmFpbGFibGUgPiAwKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1BdmFpbGFibGUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKHJhbmRvbSwgMSlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX3JlbGVhc2VJbmRleChpbmRleCkge1xuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpbmRleCk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBsZXQgaW5kZXggPSAtMTtcblxuICAgICAgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldFJhbmRvbUluZGV4KCk7XG4gICAgICBlbHNlIC8vIGlmIChvcmRlciA9PT0gJ2Fjc2VuZGluZycpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0QXNjZW5kaW5nSW5kZXgoKTtcblxuICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uaW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLnNldHVwO1xuICAgICAgICBsZXQgbGFiZWw7XG4gICAgICAgIGxldCBjb29yZGluYXRlcztcblxuICAgICAgICBpZiAoc2V0dXApIHtcbiAgICAgICAgICBsYWJlbCA9IHNldHVwLmxhYmVscyA/IHNldHVwLmxhYmVsc1tpbmRleF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgY29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzW2luZGV4XSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmxhYmVsID0gbGFiZWw7XG4gICAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsaWVudHNbaW5kZXhdID0gY2xpZW50O1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAncG9zaXRpb24nLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICd1bmF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIF9vblJlc3RhcnQoY2xpZW50KSB7XG4gIC8vICAgcmV0dXJuIChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSA9PiB7XG4gIC8vICAgICAvLyBUT0RPOiBjaGVjayBpZiB0aGF0J3Mgb2sgb24gcmFuZG9tIG1vZGVcbiAgLy8gICAgIGlmIChpbmRleCA+IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCkge1xuICAvLyAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4OyBpIDwgaW5kZXg7IGkrKylcbiAgLy8gICAgICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG5cbiAgLy8gICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gaW5kZXggKyAxO1xuICAvLyAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4KSB7XG4gIC8vICAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAvLyAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgbGV0IGkgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmluZGV4T2YoaW5kZXgpO1xuXG4gIC8vICAgICAgIGlmIChpID49IDApXG4gIC8vICAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoaSwgMSk7XG4gIC8vICAgICB9XG5cbiAgLy8gICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmluZGV4ID0gaW5kZXg7XG4gIC8vICAgICB0aGlzLmNsaWVudHNbaW5kZXhdID0gY2xpZW50O1xuXG4gIC8vICAgICBpZiAobGFiZWwgIT09IG51bGwpXG4gIC8vICAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmxhYmVsID0gbGFiZWw7XG5cbiAgLy8gICAgIGlmKGNvb3JkaW5hdGVzICE9PSBudWxsKVxuICAvLyAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgLy8gICB9XG4gIC8vIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICAvLyB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVzdGFydCcsIHRoaXMuX29uUmVzdGFydChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IGluZGV4ID0gY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGVsZXRlIHRoaXMuY2xpZW50c1tpbmRleF07XG4gICAgICB0aGlzLl9yZWxlYXNlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJDaGVja2luKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyQ2hlY2tpbjtcbiJdfQ==
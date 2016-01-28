'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _corePier = require('../core/Pier');

var _corePier2 = _interopRequireDefault(_corePier);

var _utilsHelpers = require('../../utils/helpers');

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

var ServerCheckin = (function (_Pier) {
  _inherits(ServerCheckin, _Pier);

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
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerCheckin);

    _get(Object.getPrototypeOf(ServerCheckin.prototype), 'constructor', this).call(this, 'service:checkin');

    /**
     * Setup defining predefined positions (labels and/or coordinates).
     * @type {Object}
     */
    this.setup = options.setup;

    /**
     * Maximum number of clients checked in (may limit or be limited by the number of predefined labels and/or coordinates).
     * @type {Number}
     */
    this.capacity = (0, _utilsHelpers.getOpt)(options.capacity, Infinity, 1);

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
    this.order = options.order || 'ascending'; // 'ascending' | 'random'

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    var setup = options.setup;

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

  _createClass(ServerCheckin, [{
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

    /**
     * @private
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      // this.receive(client, 'restart', this._onRestart(client));
    }

    /**
     * @private
     */
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
})(_corePier2['default']);

exports['default'] = ServerCheckin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O3dCQUFpQixjQUFjOzs7OzRCQUNSLHFCQUFxQjs7Ozs7Ozs7Ozs7OztJQVl2QixhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7Ozs7Ozs7QUFZckIsV0FaUSxhQUFhLEdBWU47UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVpMLGFBQWE7O0FBYTlCLCtCQWJpQixhQUFhLDZDQWF4QixpQkFBaUIsRUFBRTs7Ozs7O0FBTXpCLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzs7Ozs7O0FBTTNCLFFBQUksQ0FBQyxRQUFRLEdBQUcsMEJBQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Ozs7OztBQU10RCxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFRbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQzs7QUFFMUMsUUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM1QixRQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDOztBQUU3QixRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDOztBQUU1QixRQUFJLEtBQUssRUFBRTtBQUNULFVBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ2hFLFVBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQy9FLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV6RCxVQUFJLElBQUksQ0FBQyxRQUFR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QUFDO1dBQ2xDOztBQUVELGdCQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDN0IsZ0JBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQztTQUMxRCxNQUFNO0FBQ0wsZ0JBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNsQztPQUNGLENBQUE7S0FDRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7V0FpQ00saUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBOUppQixhQUFhLHlDQThKaEIsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOztLQUUxRDs7Ozs7OztXQUtTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0F4S2lCLGFBQWEsNENBd0tiLE1BQU0sRUFBRTs7QUFFekIsVUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUU1QyxVQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDZCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUMzQjtLQUNGOzs7U0FoTGtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQaWVyIGZyb20gJy4uL2NvcmUvUGllcic7XG5pbXBvcnQgeyBnZXRPcHQgfSBmcm9tICcuLi8uLi91dGlscy9oZWxwZXJzJztcblxuLyoqXG4gKiBBc3NpZ24gcGxhY2VzIGFtb25nIGEgc2V0IG9mIHByZWRlZmluZWQgcG9zaXRpb25zIChpLmUuIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICpcbiAqIFRoZSBtb2R1bGUgYXNzaWducyBhIHBvc2l0aW9uIHRvIGEgY2xpZW50IHVwb24gcmVxdWVzdCBvZiB0aGUgY2xpZW50LXNpZGUgbW9kdWxlLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRDaGVja2luLmpzfkNsaWVudENoZWNraW59IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGVcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgU2VydmVyQ2hlY2tpbih7IGNhcGFjaXR5OiAxMDAsIG9yZGVyOiAncmFuZG9tJyB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyQ2hlY2tpbiBleHRlbmRzIFBpZXIge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNldHVwXSBTZXR1cCBkZWZpbmluZyBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLnNldHVwLmxhYmVsc10gTGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAgICogQHBhcmFtIHtBcnJheVtdfSBbb3B0aW9ucy5zZXR1cC5jb29yZGluYXRlc10gTGlzdCBvZiBwcmVkZWZpbmVkIGNvb3JkaW5hdGVzIGdpdmVuIGFzIGFuIGFycmF5IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jYXBhY2l0eT1JbmZpbml0eV0gTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMgZGVmaW5lZCBieSB0aGUgc2V0dXApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMub3JkZXI9J2FzY2VuZGluZyddIE9yZGVyIGluIHdoaWNoIGluZGljZXMgYXJlIGFzc2lnbmVkLiBDdXJyZW50bHkgc3Bwb3J0ZWQgdmFsdWVzIGFyZTpcbiAgICogLSBgJ2FzY2VuZGluZydgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAgICogLSBgJ3JhbmRvbSdgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiByYW5kb20gb3JkZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCdzZXJ2aWNlOmNoZWNraW4nKTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIGRlZmluaW5nIHByZWRlZmluZWQgcG9zaXRpb25zIChsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2V0dXAgPSBvcHRpb25zLnNldHVwO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBjaGVja2VkIGluIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIHByZWRlZmluZWQgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gZ2V0T3B0KG9wdGlvbnMuY2FwYWNpdHksIEluZmluaXR5LCAxKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgY2hlY2tlZCBpbiB3aXRoIGNvcnJlc3BvbmluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIE9yZGVyIGluIHdoaWNoIGluZGljZXMgYXJlIGFzc2lnbmVkLiBDdXJyZW50bHkgc3VwcG9ydGVkIHZhbHVlcyBhcmU6XG4gICAgICogLSBgJ2FzY2VuZGluZydgOiBhc3NpZ25zIGluZGljZXMgaW4gYXNjZW5kaW5nIG9yZGVyO1xuICAgICAqIC0gYCdyYW5kb20nYDogYXNzaWducyBpbmRpY2VzIGluIHJhbmRvbSBvcmRlci5cbiAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAqL1xuICAgIHRoaXMub3JkZXIgPSBvcHRpb25zLm9yZGVyIHx8ICdhc2NlbmRpbmcnOyAvLyAnYXNjZW5kaW5nJyB8ICdyYW5kb20nXG5cbiAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzID0gW107XG4gICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gMDtcblxuICAgIGNvbnN0IHNldHVwID0gb3B0aW9ucy5zZXR1cDtcblxuICAgIGlmIChzZXR1cCkge1xuICAgICAgY29uc3QgbnVtTGFiZWxzID0gc2V0dXAubGFiZWxzID8gc2V0dXAubGFiZWxzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSBzZXR1cC5jb29yZGluYXRlcyA/IHNldHVwLmNvb3JkaW5hdGVzLmxlbmd0aCA6IEluZmluaXR5O1xuICAgICAgY29uc3QgbnVtUG9zaXRpb25zID0gTWF0aC5taW4obnVtTGFiZWxzLCBudW1Db29yZGluYXRlcyk7XG5cbiAgICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gbnVtUG9zaXRpb25zKVxuICAgICAgICB0aGlzLmNhcGFjaXR5ID0gbnVtUG9zaXRpb25zO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhcGFjaXR5ID09PSBJbmZpbml0eSlcbiAgICAgIHRoaXMub3JkZXIgPSAnYXNjZW5kaW5nJztcbiAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSAncmFuZG9tJykge1xuICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gdGhpcy5jYXBhY2l0eTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcGFjaXR5OyBpKyspXG4gICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpKTtcbiAgICB9XG4gIH1cblxuICBfZ2V0UmFuZG9tSW5kZXgoKSB7XG4gICAgY29uc3QgbnVtQXZhaWxhYmxlID0gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGg7XG5cbiAgICBpZiAobnVtQXZhaWxhYmxlID4gMCkge1xuICAgICAgY29uc3QgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtQXZhaWxhYmxlKTtcbiAgICAgIHJldHVybiB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNwbGljZShyYW5kb20sIDEpWzBdO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIF9nZXRBc2NlbmRpbmdJbmRleCgpIHtcbiAgICBpZiAodGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKDAsIDEpWzBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4IDwgdGhpcy5jYXBhY2l0eSkge1xuICAgICAgcmV0dXJuIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIF9yZWxlYXNlSW5kZXgoaW5kZXgpIHtcbiAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaW5kZXgpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgIGlmICh0aGlzLm9yZGVyID09PSAncmFuZG9tJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRSYW5kb21JbmRleCgpO1xuICAgICAgZWxzZSAvLyBpZiAob3JkZXIgPT09ICdhY3NlbmRpbmcnKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldEFzY2VuZGluZ0luZGV4KCk7XG5cbiAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMuaWRdLmluZGV4ID0gaW5kZXg7XG5cbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGNvbnN0IHNldHVwID0gdGhpcy5zZXR1cDtcbiAgICAgICAgbGV0IGxhYmVsO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXM7XG5cbiAgICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgICAgbGFiZWwgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHNbaW5kZXhdIDogdW5kZWZpbmVkO1xuICAgICAgICAgIGNvb3JkaW5hdGVzID0gc2V0dXAuY29vcmRpbmF0ZXMgPyBzZXR1cC5jb29yZGluYXRlc1tpbmRleF0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5sYWJlbCA9IGxhYmVsO1xuICAgICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAndW5hdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBfb25SZXN0YXJ0KGNsaWVudCkge1xuICAvLyAgIHJldHVybiAoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykgPT4ge1xuICAvLyAgICAgLy8gVE9ETzogY2hlY2sgaWYgdGhhdCdzIG9rIG9uIHJhbmRvbSBtb2RlXG4gIC8vICAgICBpZiAoaW5kZXggPiB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgpIHtcbiAgLy8gICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleDsgaSA8IGluZGV4OyBpKyspXG4gIC8vICAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuXG4gIC8vICAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IGluZGV4ICsgMTtcbiAgLy8gICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCkge1xuICAvLyAgICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgrKztcbiAgLy8gICAgIH0gZWxzZSB7XG4gIC8vICAgICAgIGxldCBpID0gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5pbmRleE9mKGluZGV4KTtcblxuICAvLyAgICAgICBpZiAoaSA+PSAwKVxuICAvLyAgICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKGksIDEpO1xuICAvLyAgICAgfVxuXG4gIC8vICAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5pbmRleCA9IGluZGV4O1xuICAvLyAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcblxuICAvLyAgICAgaWYgKGxhYmVsICE9PSBudWxsKVxuICAvLyAgICAgICBjbGllbnQubW9kdWxlc1t0aGlzLmlkXS5sYWJlbCA9IGxhYmVsO1xuXG4gIC8vICAgICBpZihjb29yZGluYXRlcyAhPT0gbnVsbClcbiAgLy8gICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIC8vIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXN0YXJ0JywgdGhpcy5fb25SZXN0YXJ0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IGluZGV4ID0gY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0uaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGVsZXRlIHRoaXMuY2xpZW50c1tpbmRleF07XG4gICAgICB0aGlzLl9yZWxlYXNlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxufVxuIl19
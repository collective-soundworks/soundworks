'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

var _utilsHelpers = require('../utils/helpers');

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

var ServerCheckin = (function (_ServerModule) {
  _inherits(ServerCheckin, _ServerModule);

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

    _get(Object.getPrototypeOf(ServerCheckin.prototype), 'constructor', this).call(this, options.name || 'checkin');

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

        client.modules[_this.name].index = index;

        if (index >= 0) {
          var setup = _this.setup;
          var label = undefined;
          var coordinates = undefined;

          if (setup) {
            label = setup.labels ? setup.labels[index] : undefined;
            coordinates = setup.coordinates ? setup.coordinates[index] : undefined;

            client.modules[_this.name].label = label;
            client.coordinates = coordinates;
          }

          _this.clients[index] = client;
          _this.send(client, 'position', index, label, coordinates);
        } else {
          _this.send(client, 'unavailable');
        }
      };
    }
  }, {
    key: '_onRestart',
    value: function _onRestart(client) {
      var _this2 = this;

      return function (index, label, coordinates) {
        // TODO: check if that's ok on random mode
        if (index > _this2._nextAscendingIndex) {
          for (var i = _this2._nextAscendingIndex; i < index; i++) {
            _this2._availableIndices.push(i);
          }_this2._nextAscendingIndex = index + 1;
        } else if (index === _this2._nextAscendingIndex) {
          _this2._nextAscendingIndex++;
        } else {
          var i = _this2._availableIndices.indexOf(index);

          if (i >= 0) _this2._availableIndices.splice(i, 1);
        }

        client.modules[_this2.name].index = index;
        _this2.clients[index] = client;

        if (label !== null) client.modules[_this2.name].label = label;

        if (coordinates !== null) client.coordinates = coordinates;
      };
    }

    /**
     * @private
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'restart', this._onRestart(client));
    }

    /**
     * @private
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerCheckin.prototype), 'disconnect', this).call(this, client);

      var index = client.modules[this.name].index;

      if (index >= 0) {
        delete this.clients[index];
        this._releaseIndex(index);
      }
    }
  }]);

  return ServerCheckin;
})(_ServerModule3['default']);

exports['default'] = ServerCheckin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7NEJBQ2xCLGtCQUFrQjs7Ozs7Ozs7Ozs7OztJQVlwQixhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7Ozs7Ozs7QUFZckIsV0FaUSxhQUFhLEdBWU47UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVpMLGFBQWE7O0FBYTlCLCtCQWJpQixhQUFhLDZDQWF4QixPQUFPLENBQUMsSUFBSSxJQUFJLFNBQVMsRUFBRTs7Ozs7O0FBTWpDLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQzs7Ozs7O0FBTTNCLFFBQUksQ0FBQyxRQUFRLEdBQUcsMEJBQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7Ozs7OztBQU10RCxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7Ozs7Ozs7QUFRbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQzs7QUFFMUMsUUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM1QixRQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDOztBQUU3QixRQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDOztBQUU1QixRQUFJLEtBQUssRUFBRTtBQUNULFVBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ2hFLFVBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQy9FLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV6RCxVQUFJLElB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QUFDLE9BQUssSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFMUMsWUFBRyxXQUFXLEtBQUssSUFBSSxFQUNyQixNQUFNLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztPQUNwQyxDQUFBO0tBQ0Y7Ozs7Ozs7V0FLTSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0E5SmlCLGFBQWEseUNBOEpoQixNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7Ozs7OztXQUtTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0F4S2lCLGFBQWEsNENBd0tiLE1BQU0sRUFBRTs7QUFFekIsVUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUU5QyxVQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDZCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUMzQjtLQUNGOzs7U0FoTGtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vdXRpbHMvaGVscGVycyc7XG5cbi8qKlxuICogQXNzaWduIHBsYWNlcyBhbW9uZyBhIHNldCBvZiBwcmVkZWZpbmVkIHBvc2l0aW9ucyAoaS5lLiBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFzc2lnbnMgYSBwb3NpdGlvbiB0byBhIGNsaWVudCB1cG9uIHJlcXVlc3Qgb2YgdGhlIGNsaWVudC1zaWRlIG1vZHVsZS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qc35DbGllbnRDaGVja2lufSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqIEBleGFtcGxlXG4gKiBjb25zdCBjaGVja2luID0gbmV3IFNlcnZlckNoZWNraW4oeyBjYXBhY2l0eTogMTAwLCBvcmRlcjogJ3JhbmRvbScgfSk7XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNlcnZlckNoZWNraW4gZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubmFtZT0nY2hlY2tpbiddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLnNldHVwXSBTZXR1cCBkZWZpbmluZyBwcmVkZWZpbmVkIHBvc2l0aW9ucyAobGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLnNldHVwLmxhYmVsc10gTGlzdCBvZiBwcmVkZWZpbmVkIGxhYmVscy5cbiAgICogQHBhcmFtIHtBcnJheVtdfSBbb3B0aW9ucy5zZXR1cC5jb29yZGluYXRlc10gTGlzdCBvZiBwcmVkZWZpbmVkIGNvb3JkaW5hdGVzIGdpdmVuIGFzIGFuIGFycmF5IGBbeDpOdW1iZXIsIHk6TnVtYmVyXWAuXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5jYXBhY2l0eT1JbmZpbml0eV0gTWF4aW11bSBudW1iZXIgb2YgcGxhY2VzIChtYXkgbGltaXQgb3IgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMgZGVmaW5lZCBieSB0aGUgc2V0dXApLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMub3JkZXI9J2FzY2VuZGluZyddIE9yZGVyIGluIHdoaWNoIGluZGljZXMgYXJlIGFzc2lnbmVkLiBDdXJyZW50bHkgc3Bwb3J0ZWQgdmFsdWVzIGFyZTpcbiAgICogLSBgJ2FzY2VuZGluZydgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiBhc2NlbmRpbmcgb3JkZXJcbiAgICogLSBgJ3JhbmRvbSdgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiByYW5kb20gb3JkZXJcbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgZGVmaW5pbmcgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGxhYmVscyBhbmQvb3IgY29vcmRpbmF0ZXMpLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXA7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGNoZWNrZWQgaW4gKG1heSBsaW1pdCBvciBiZSBsaW1pdGVkIGJ5IHRoZSBudW1iZXIgb2YgcHJlZGVmaW5lZCBsYWJlbHMgYW5kL29yIGNvb3JkaW5hdGVzKS5cbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMuY2FwYWNpdHkgPSBnZXRPcHQob3B0aW9ucy5jYXBhY2l0eSwgSW5maW5pdHksIDEpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiB0aGUgY2xpZW50cyBjaGVja2VkIGluIHdpdGggY29ycmVzcG9uaW5nIGluZGljZXMuXG4gICAgICogQHR5cGUge0NsaWVudFtdfVxuICAgICAqL1xuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogT3JkZXIgaW4gd2hpY2ggaW5kaWNlcyBhcmUgYXNzaWduZWQuIEN1cnJlbnRseSBzdXBwb3J0ZWQgdmFsdWVzIGFyZTpcbiAgICAgKiAtIGAnYXNjZW5kaW5nJ2A6IGFzc2lnbnMgaW5kaWNlcyBpbiBhc2NlbmRpbmcgb3JkZXI7XG4gICAgICogLSBgJ3JhbmRvbSdgOiBhc3NpZ25zIGluZGljZXMgaW4gcmFuZG9tIG9yZGVyLlxuICAgICAqIEB0eXBlIHtbdHlwZV19XG4gICAgICovXG4gICAgdGhpcy5vcmRlciA9IG9wdGlvbnMub3JkZXIgfHwgJ2FzY2VuZGluZyc7IC8vICdhc2NlbmRpbmcnIHwgJ3JhbmRvbSdcblxuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMgPSBbXTtcbiAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSAwO1xuXG4gICAgY29uc3Qgc2V0dXAgPSBvcHRpb25zLnNldHVwO1xuXG4gICAgaWYgKHNldHVwKSB7XG4gICAgICBjb25zdCBudW1MYWJlbHMgPSBzZXR1cC5sYWJlbHMgPyBzZXR1cC5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Db29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICAgIHRoaXMuY2FwYWNpdHkgPSBudW1Qb3NpdGlvbnM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPT09IEluZmluaXR5KVxuICAgICAgdGhpcy5vcmRlciA9ICdhc2NlbmRpbmcnO1xuICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKSB7XG4gICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSB0aGlzLmNhcGFjaXR5O1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FwYWNpdHk7IGkrKylcbiAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSYW5kb21JbmRleCgpIHtcbiAgICBjb25zdCBudW1BdmFpbGFibGUgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aDtcblxuICAgIGlmIChudW1BdmFpbGFibGUgPiAwKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1BdmFpbGFibGUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKHJhbmRvbSwgMSlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX3JlbGVhc2VJbmRleChpbmRleCkge1xuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpbmRleCk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBsZXQgaW5kZXggPSAtMTtcblxuICAgICAgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldFJhbmRvbUluZGV4KCk7XG4gICAgICBlbHNlIC8vIGlmIChvcmRlciA9PT0gJ2Fjc2VuZGluZycpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0QXNjZW5kaW5nSW5kZXgoKTtcblxuICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleCA9IGluZGV4O1xuXG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBjb25zdCBzZXR1cCA9IHRoaXMuc2V0dXA7XG4gICAgICAgIGxldCBsYWJlbDtcbiAgICAgICAgbGV0IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIGlmIChzZXR1cCkge1xuICAgICAgICAgIGxhYmVsID0gc2V0dXAubGFiZWxzID8gc2V0dXAubGFiZWxzW2luZGV4XSA6IHVuZGVmaW5lZDtcbiAgICAgICAgICBjb29yZGluYXRlcyA9IHNldHVwLmNvb3JkaW5hdGVzID8gc2V0dXAuY29vcmRpbmF0ZXNbaW5kZXhdIDogdW5kZWZpbmVkO1xuXG4gICAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5sYWJlbCA9IGxhYmVsO1xuICAgICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3Bvc2l0aW9uJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAndW5hdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfb25SZXN0YXJ0KGNsaWVudCkge1xuICAgIHJldHVybiAoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykgPT4ge1xuICAgICAgLy8gVE9ETzogY2hlY2sgaWYgdGhhdCdzIG9rIG9uIHJhbmRvbSBtb2RlXG4gICAgICBpZiAoaW5kZXggPiB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleDsgaSA8IGluZGV4OyBpKyspXG4gICAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuXG4gICAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IGluZGV4ICsgMTtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCkge1xuICAgICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBpID0gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5pbmRleE9mKGluZGV4KTtcblxuICAgICAgICBpZiAoaSA+PSAwKVxuICAgICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuXG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4ID0gaW5kZXg7XG4gICAgICB0aGlzLmNsaWVudHNbaW5kZXhdID0gY2xpZW50O1xuXG4gICAgICBpZiAobGFiZWwgIT09IG51bGwpXG4gICAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0ubGFiZWwgPSBsYWJlbDtcblxuICAgICAgaWYoY29vcmRpbmF0ZXMgIT09IG51bGwpXG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVzdGFydCcsIHRoaXMuX29uUmVzdGFydChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBpbmRleCA9IGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGVsZXRlIHRoaXMuY2xpZW50c1tpbmRleF07XG4gICAgICB0aGlzLl9yZWxlYXNlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxufVxuIl19
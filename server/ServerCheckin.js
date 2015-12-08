'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Number$MAX_SAFE_INTEGER = require('babel-runtime/core-js/number/max-safe-integer')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _ServerModule2 = require('./ServerModule');

var _ServerModule3 = _interopRequireDefault(_ServerModule2);

var maxRandomCapacity = 9999;

/**
 * [server] Assign places among a set of predefined positions (i.e. labels and/or coordinates).
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
   * @param {String[]} [options.labels=null] List of predefined labels).
   * @param {Array[]} [options.coordinates=null] List of predefined coordinates given as an array `[x:Number, y:Number]`.
   * @param {Number} [options.capacity=Infinity] Maximum number of checkins allowed (may be limited by the number of predefined labels and/or coordinates).
   * @param {Object} [options.order='ascending'] Order in which indices are assigned. Currently spported values are:
   * - `'ascending'`: indices are assigned in ascending order;
   * - `'random'`: indices are assigned in random order.
   */

  function ServerCheckin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerCheckin);

    _get(Object.getPrototypeOf(ServerCheckin.prototype), 'constructor', this).call(this, options.name || 'checkin');

    /**
     * List of predefined labels.
     * @type {String[]}
     */
    this.labels = options.labels;

    /**
     * List of predefined coordinates.
     * @type {Array[]}
     */
    this.coordinates = options.coordinates;

    /**
     * Maximum number of clients allowed.
     * @type {Number}
     */
    this.capacity = options.capacity || Infinity;

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

    var numLabels = labels ? labels.length : Infinity;
    var numCoordinates = coordinates ? coordinates.length : Infinity;
    var numPositions = Math.min(numLabels, numCoordinates);

    if (this.capacity > numPositions) this.capacity = numPositions;

    if (this.capacity > _Number$MAX_SAFE_INTEGER) this.capacity = _Number$MAX_SAFE_INTEGER;

    if (this.capacity > maxRandomCapacity) this.order = 'ascending';else if (this.order === 'random') this._nextAscendingIndex = this.capacity;

    for (var i = 0; i < this.capacity; i++) {
      this._availableIndices.push(i);
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

        if (index >= 0) {
          var label = _this.labels[index];
          var _coordinates = _this.coordinates[index];

          client.modules[_this.name].index = index;
          client.modules[_this.name].label = label;
          client.coordinates = _coordinates;

          _this.clients[index] = client;

          _this.send(client, 'acknowledge', index, label, _coordinates);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXlCLGdCQUFnQjs7OztBQUV6QyxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7OztJQVlWLGFBQWE7WUFBYixhQUFhOzs7Ozs7Ozs7Ozs7O0FBV3JCLFdBWFEsYUFBYSxHQVdOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFYTCxhQUFhOztBQVk5QiwrQkFaaUIsYUFBYSw2Q0FZeEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7Ozs7OztBQU1qQyxRQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7Ozs7OztBQU03QixRQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7Ozs7OztBQU12QyxRQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDOzs7Ozs7QUFNN0MsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7O0FBUWxCLFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUM7O0FBRTFDLFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDNUIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQzs7QUFFN0IsUUFBSSxTQUFTLEdBQUcsTUFBTSxHQUFFLE1BQU0sQ0FBQyxNQUFNLEdBQUUsUUFBUSxDQUFDO0FBQ2hELFFBQUksY0FBYyxHQUFHLFdBQVcsR0FBRSxXQUFXLENBQUMsTUFBTSxHQUFFLFFBQVEsQ0FBQztBQUMvRCxRQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQzs7QUFFdkQsUUFBRyxJQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksRUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxZQUFZ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aEIsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDMUQ7Ozs7Ozs7V0FLUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBcktpQixhQUFhLDRDQXFLYixNQUFNLEVBQUU7O0FBRXpCLFVBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQzs7QUFFOUMsVUFBSSxLQUFLLElBQUksQ0FBQyxFQUFFO0FBQ2QsZUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzNCLFlBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDM0I7S0FDRjs7O1NBN0trQixhQUFhOzs7cUJBQWIsYUFBYSIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlckNoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyTW9kdWxlIGZyb20gJy4vU2VydmVyTW9kdWxlJztcblxuY29uc3QgbWF4UmFuZG9tQ2FwYWNpdHkgPSA5OTk5O1xuXG4vKipcbiAqIFtzZXJ2ZXJdIEFzc2lnbiBwbGFjZXMgYW1vbmcgYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogVGhlIG1vZHVsZSBhc3NpZ25zIGEgcG9zaXRpb24gdG8gYSBjbGllbnQgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQtc2lkZSBtb2R1bGUuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanN+Q2xpZW50Q2hlY2tpbn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgY2hlY2tpbiA9IG5ldyBTZXJ2ZXJDaGVja2luKHsgY2FwYWNpdHk6IDEwMCwgb3JkZXI6ICdyYW5kb20nIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJDaGVja2luIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2NoZWNraW4nXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmxhYmVscz1udWxsXSBMaXN0IG9mIHByZWRlZmluZWQgbGFiZWxzKS5cbiAgICogQHBhcmFtIHtBcnJheVtdfSBbb3B0aW9ucy5jb29yZGluYXRlcz1udWxsXSBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMgZ2l2ZW4gYXMgYW4gYXJyYXkgYFt4Ok51bWJlciwgeTpOdW1iZXJdYC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNhcGFjaXR5PUluZmluaXR5XSBNYXhpbXVtIG51bWJlciBvZiBjaGVja2lucyBhbGxvd2VkIChtYXkgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIHByZWRlZmluZWQgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5vcmRlcj0nYXNjZW5kaW5nJ10gT3JkZXIgaW4gd2hpY2ggaW5kaWNlcyBhcmUgYXNzaWduZWQuIEN1cnJlbnRseSBzcHBvcnRlZCB2YWx1ZXMgYXJlOlxuICAgKiAtIGAnYXNjZW5kaW5nJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIGFzY2VuZGluZyBvcmRlcjtcbiAgICogLSBgJ3JhbmRvbSdgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiByYW5kb20gb3JkZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NoZWNraW4nKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWxzID0gb3B0aW9ucy5sYWJlbHM7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMuXG4gICAgICogQHR5cGUge0FycmF5W119XG4gICAgICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG9wdGlvbnMuY29vcmRpbmF0ZXM7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gb3B0aW9ucy5jYXBhY2l0eSB8fCBJbmZpbml0eTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgY2hlY2tlZCBpbiB3aXRoIGNvcnJlc3BvbmluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIE9yZGVyIGluIHdoaWNoIGluZGljZXMgYXJlIGFzc2lnbmVkLiBDdXJyZW50bHkgc3VwcG9ydGVkIHZhbHVlcyBhcmU6XG4gICAgICogLSBgJ2FzY2VuZGluZydgOiBhc3NpZ25zIGluZGljZXMgaW4gYXNjZW5kaW5nIG9yZGVyO1xuICAgICAqIC0gYCdyYW5kb20nYDogYXNzaWducyBpbmRpY2VzIGluIHJhbmRvbSBvcmRlci5cbiAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAqL1xuICAgIHRoaXMub3JkZXIgPSBvcHRpb25zLm9yZGVyIHx8ICdhc2NlbmRpbmcnOyAvLyAnYXNjZW5kaW5nJyB8ICdyYW5kb20nXG5cbiAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzID0gW107XG4gICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gMDtcblxuICAgIGxldCBudW1MYWJlbHMgPSBsYWJlbHM/IGxhYmVscy5sZW5ndGg6IEluZmluaXR5O1xuICAgIGxldCBudW1Db29yZGluYXRlcyA9IGNvb3JkaW5hdGVzPyBjb29yZGluYXRlcy5sZW5ndGg6IEluZmluaXR5O1xuICAgIGxldCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgIGlmKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICB0aGlzLmNhcGFjaXR5ID0gbnVtUG9zaXRpb25zO1xuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUilcbiAgICAgIHRoaXMuY2FwYWNpdHkgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuICAgIGlmICh0aGlzLmNhcGFjaXR5ID4gbWF4UmFuZG9tQ2FwYWNpdHkpXG4gICAgICB0aGlzLm9yZGVyID0gJ2FzY2VuZGluZyc7XG4gICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gJ3JhbmRvbScpXG4gICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSB0aGlzLmNhcGFjaXR5O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNhcGFjaXR5OyBpKyspXG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG4gIH1cblxuICBfZ2V0UmFuZG9tSW5kZXgoKSB7XG4gICAgY29uc3QgbnVtQXZhaWxhYmxlID0gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGg7XG5cbiAgICBpZiAobnVtQXZhaWxhYmxlID4gMCkge1xuICAgICAgbGV0IHJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIG51bUF2YWlsYWJsZSk7XG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UocmFuZG9tLCAxKVswXTtcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBfZ2V0QXNjZW5kaW5nSW5kZXgoKSB7XG4gICAgaWYgKHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEgLSBiO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNwbGljZSgwLCAxKVswXTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA8IHRoaXMuY2FwYWNpdHkpIHtcbiAgICAgIHJldHVybiB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgrKztcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBfcmVsZWFzZUluZGV4KGluZGV4KSB7XG4gICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGluZGV4KTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICBpZiAodGhpcy5vcmRlciA9PT0gJ3JhbmRvbScpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0UmFuZG9tSW5kZXgoKTtcbiAgICAgIGVsc2UgLy8gaWYgKG9yZGVyID09PSAnYWNzZW5kaW5nJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRBc2NlbmRpbmdJbmRleCgpO1xuXG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXMubGFiZWxzW2luZGV4XTtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzW2luZGV4XTtcblxuICAgICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0ubGFiZWwgPSBsYWJlbDtcbiAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG5cbiAgICAgICAgdGhpcy5jbGllbnRzW2luZGV4XSA9IGNsaWVudDtcblxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnYWNrbm93bGVkZ2UnLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICd1bmF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vblJlc3RhcnQoY2xpZW50KSB7XG4gICAgcmV0dXJuIChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgICAvLyBUT0RPOiBjaGVjayBpZiB0aGF0J3Mgb2sgb24gcmFuZG9tIG1vZGVcbiAgICAgIGlmIChpbmRleCA+IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCkge1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4OyBpIDwgaW5kZXg7IGkrKylcbiAgICAgICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG5cbiAgICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4KSB7XG4gICAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmluZGV4T2YoaW5kZXgpO1xuXG4gICAgICAgIGlmIChpID49IDApXG4gICAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMuY2xpZW50c1tpbmRleF0gPSBjbGllbnQ7XG5cbiAgICAgIGlmIChsYWJlbCAhPT0gbnVsbClcbiAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5sYWJlbCA9IGxhYmVsO1xuXG4gICAgICBpZihjb29yZGluYXRlcyAhPT0gbnVsbClcbiAgICAgICAgY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXN0YXJ0JywgdGhpcy5fb25SZXN0YXJ0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IGluZGV4ID0gY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleDtcblxuICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICBkZWxldGUgdGhpcy5jbGllbnRzW2luZGV4XTtcbiAgICAgIHRoaXMuX3JlbGVhc2VJbmRleChpbmRleCk7XG4gICAgfVxuICB9XG59XG5cbiJdfQ==
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

    var numLabels = this.labels ? this.labels.length : Infinity;
    var numCoordinates = this.coordinates ? this.coordinates.length : Infinity;
    var numPositions = Math.min(numLabels, numCoordinates);

    if (this.capacity > numPositions) this.capacity = numPositions;

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

        if (index >= 0) {
          var label = _this.labels ? _this.labels[index] : undefined;
          var coordinates = _this.coordinates ? _this.coordinates[index] : undefined;

          client.modules[_this.name].index = index;
          client.modules[_this.name].label = label;
          client.coordinates = coordinates;

          _this.clients[index] = client;

          _this.send(client, 'acknowledge', index, label, coordinates);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzZCQUF5QixnQkFBZ0I7Ozs7Ozs7Ozs7Ozs7OztJQVlwQixhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7Ozs7OztBQVdyQixXQVhRLGFBQWEsR0FXTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBWEwsYUFBYTs7QUFZOUIsK0JBWmlCLGFBQWEsNkNBWXhCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOzs7Ozs7QUFNakMsUUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDOzs7Ozs7QUFNN0IsUUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDOzs7Ozs7QUFNdkMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQzs7Ozs7O0FBTTdDLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOzs7Ozs7OztBQVFsQixRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksV0FBVyxDQUFDOztBQUUxQyxRQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxDQUFDLENBQUM7O0FBRTdCLFFBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQzlELFFBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQzdFLFFBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV6RCxRQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsWUFBWSxFQUM3QixJQUFJLENBQUMsUUFBUSxHQUFH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QUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUMxRDs7Ozs7OztXQUtTLG9CQUFDLE1BQU0sRUFBRTtBQUNqQixpQ0FuS2lCLGFBQWEsNENBbUtiLE1BQU0sRUFBRTs7QUFFekIsVUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDOztBQUU5QyxVQUFJLEtBQUssSUFBSSxDQUFDLEVBQUU7QUFDZCxlQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUMzQjtLQUNGOzs7U0EzS2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJNb2R1bGUgZnJvbSAnLi9TZXJ2ZXJNb2R1bGUnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIEFzc2lnbiBwbGFjZXMgYW1vbmcgYSBzZXQgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgKGkuZS4gbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gKlxuICogVGhlIG1vZHVsZSBhc3NpZ25zIGEgcG9zaXRpb24gdG8gYSBjbGllbnQgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQtc2lkZSBtb2R1bGUuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanN+Q2xpZW50Q2hlY2tpbn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZVxuICogY29uc3QgY2hlY2tpbiA9IG5ldyBTZXJ2ZXJDaGVja2luKHsgY2FwYWNpdHk6IDEwMCwgb3JkZXI6ICdyYW5kb20nIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJDaGVja2luIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2NoZWNraW4nXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7U3RyaW5nW119IFtvcHRpb25zLmxhYmVscz1udWxsXSBMaXN0IG9mIHByZWRlZmluZWQgbGFiZWxzKS5cbiAgICogQHBhcmFtIHtBcnJheVtdfSBbb3B0aW9ucy5jb29yZGluYXRlcz1udWxsXSBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMgZ2l2ZW4gYXMgYW4gYXJyYXkgYFt4Ok51bWJlciwgeTpOdW1iZXJdYC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmNhcGFjaXR5PUluZmluaXR5XSBNYXhpbXVtIG51bWJlciBvZiBjaGVja2lucyBhbGxvd2VkIChtYXkgYmUgbGltaXRlZCBieSB0aGUgbnVtYmVyIG9mIHByZWRlZmluZWQgbGFiZWxzIGFuZC9vciBjb29yZGluYXRlcykuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5vcmRlcj0nYXNjZW5kaW5nJ10gT3JkZXIgaW4gd2hpY2ggaW5kaWNlcyBhcmUgYXNzaWduZWQuIEN1cnJlbnRseSBzcHBvcnRlZCB2YWx1ZXMgYXJlOlxuICAgKiAtIGAnYXNjZW5kaW5nJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIGFzY2VuZGluZyBvcmRlcjtcbiAgICogLSBgJ3JhbmRvbSdgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiByYW5kb20gb3JkZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NoZWNraW4nKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgcHJlZGVmaW5lZCBsYWJlbHMuXG4gICAgICogQHR5cGUge1N0cmluZ1tdfVxuICAgICAqL1xuICAgIHRoaXMubGFiZWxzID0gb3B0aW9ucy5sYWJlbHM7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHByZWRlZmluZWQgY29vcmRpbmF0ZXMuXG4gICAgICogQHR5cGUge0FycmF5W119XG4gICAgICovXG4gICAgdGhpcy5jb29yZGluYXRlcyA9IG9wdGlvbnMuY29vcmRpbmF0ZXM7XG5cbiAgICAvKipcbiAgICAgKiBNYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIGFsbG93ZWQuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLmNhcGFjaXR5ID0gb3B0aW9ucy5jYXBhY2l0eSB8fCBJbmZpbml0eTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgdGhlIGNsaWVudHMgY2hlY2tlZCBpbiB3aXRoIGNvcnJlc3BvbmluZyBpbmRpY2VzLlxuICAgICAqIEB0eXBlIHtDbGllbnRbXX1cbiAgICAgKi9cbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIE9yZGVyIGluIHdoaWNoIGluZGljZXMgYXJlIGFzc2lnbmVkLiBDdXJyZW50bHkgc3VwcG9ydGVkIHZhbHVlcyBhcmU6XG4gICAgICogLSBgJ2FzY2VuZGluZydgOiBhc3NpZ25zIGluZGljZXMgaW4gYXNjZW5kaW5nIG9yZGVyO1xuICAgICAqIC0gYCdyYW5kb20nYDogYXNzaWducyBpbmRpY2VzIGluIHJhbmRvbSBvcmRlci5cbiAgICAgKiBAdHlwZSB7W3R5cGVdfVxuICAgICAqL1xuICAgIHRoaXMub3JkZXIgPSBvcHRpb25zLm9yZGVyIHx8ICdhc2NlbmRpbmcnOyAvLyAnYXNjZW5kaW5nJyB8ICdyYW5kb20nXG5cbiAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzID0gW107XG4gICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gMDtcblxuICAgIGNvbnN0IG51bUxhYmVscyA9IHRoaXMubGFiZWxzID8gdGhpcy5sYWJlbHMubGVuZ3RoIDogSW5maW5pdHk7XG4gICAgY29uc3QgbnVtQ29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzID8gdGhpcy5jb29yZGluYXRlcy5sZW5ndGggOiBJbmZpbml0eTtcbiAgICBjb25zdCBudW1Qb3NpdGlvbnMgPSBNYXRoLm1pbihudW1MYWJlbHMsIG51bUNvb3JkaW5hdGVzKTtcblxuICAgIGlmKHRoaXMuY2FwYWNpdHkgPiBudW1Qb3NpdGlvbnMpXG4gICAgICB0aGlzLmNhcGFjaXR5ID0gbnVtUG9zaXRpb25zO1xuXG4gICAgaWYgKHRoaXMuY2FwYWNpdHkgPT09IEluZmluaXR5KVxuICAgICAgdGhpcy5vcmRlciA9ICdhc2NlbmRpbmcnO1xuICAgIGVsc2UgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKSB7XG4gICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSB0aGlzLmNhcGFjaXR5O1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2FwYWNpdHk7IGkrKylcbiAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSYW5kb21JbmRleCgpIHtcbiAgICBjb25zdCBudW1BdmFpbGFibGUgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aDtcblxuICAgIGlmIChudW1BdmFpbGFibGUgPiAwKSB7XG4gICAgICBjb25zdCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1BdmFpbGFibGUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKHJhbmRvbSwgMSlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLmNhcGFjaXR5KSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX3JlbGVhc2VJbmRleChpbmRleCkge1xuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpbmRleCk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBsZXQgaW5kZXggPSAtMTtcblxuICAgICAgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldFJhbmRvbUluZGV4KCk7XG4gICAgICBlbHNlIC8vIGlmIChvcmRlciA9PT0gJ2Fjc2VuZGluZycpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0QXNjZW5kaW5nSW5kZXgoKTtcblxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY29uc3QgbGFiZWwgPSB0aGlzLmxhYmVscyA/IHRoaXMubGFiZWxzW2luZGV4XSA6IHVuZGVmaW5lZDtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSB0aGlzLmNvb3JkaW5hdGVzID8gdGhpcy5jb29yZGluYXRlc1tpbmRleF0gOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleCA9IGluZGV4O1xuICAgICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuY2xpZW50c1tpbmRleF0gPSBjbGllbnQ7XG5cbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2Fja25vd2xlZGdlJywgaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAndW5hdmFpbGFibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfb25SZXN0YXJ0KGNsaWVudCkge1xuICAgIHJldHVybiAoaW5kZXgsIGxhYmVsLCBjb29yZGluYXRlcykgPT4ge1xuICAgICAgLy8gVE9ETzogY2hlY2sgaWYgdGhhdCdzIG9rIG9uIHJhbmRvbSBtb2RlXG4gICAgICBpZiAoaW5kZXggPiB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleDsgaSA8IGluZGV4OyBpKyspXG4gICAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuXG4gICAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IGluZGV4ICsgMTtcbiAgICAgIH0gZWxzZSBpZiAoaW5kZXggPT09IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCkge1xuICAgICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldCBpID0gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5pbmRleE9mKGluZGV4KTtcblxuICAgICAgICBpZiAoaSA+PSAwKVxuICAgICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuXG4gICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4ID0gaW5kZXg7XG4gICAgICB0aGlzLmNsaWVudHNbaW5kZXhdID0gY2xpZW50O1xuXG4gICAgICBpZiAobGFiZWwgIT09IG51bGwpXG4gICAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0ubGFiZWwgPSBsYWJlbDtcblxuICAgICAgaWYoY29vcmRpbmF0ZXMgIT09IG51bGwpXG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVzdGFydCcsIHRoaXMuX29uUmVzdGFydChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBpbmRleCA9IGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgZGVsZXRlIHRoaXMuY2xpZW50c1tpbmRleF07XG4gICAgICB0aGlzLl9yZWxlYXNlSW5kZXgoaW5kZXgpO1xuICAgIH1cbiAgfVxufVxuXG4iXX0=
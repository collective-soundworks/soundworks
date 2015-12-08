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

var maxRandomClients = 9999;

/**
 * [server] Assign places among a predefined {@link Setup}.
 *
 * The module assigns a position to a client upon request of the client-side module.
 *
 * (See also {@link src/client/ClientCheckin.js~ClientCheckin} on the client side.)
 *
 * @example const setup = new ServerSetup();
 * setup.generate('matrix', { cols: 5, rows: 4 });
 *
 * // As new clients connect, the positions in the matrix are assigned randomly
 * const checkin = new ServerCheckin({ setup: setup, order: 'random' });
 */

var ServerCheckin = (function (_ServerModule) {
  _inherits(ServerCheckin, _ServerModule);

  /**
   * @param {Object} [options={}] Options.
   * @param {Object} [options.name='checkin'] Name of the module.
   * @param {Object} [options.setup] Setup used in the scenario, if any (cf. {@link ServerSetup}).
   * @param {Object} [options.maxClients=Infinity] maximum number of clients supported by the scenario through this checkin module (if a `options.setup` is provided, the maximum number of clients the number of predefined positions of that `setup`).
   * @param {Object} [options.order='ascending'] Order in which indices are assigned. Currently spported values are:
   * - `'ascending'`: indices are assigned in ascending order;
   * - `'random'`: indices are assigned in random order.
   */

  function ServerCheckin() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerCheckin);

    _get(Object.getPrototypeOf(ServerCheckin.prototype), 'constructor', this).call(this, options.name || 'checkin');

    /**
     * Setup used by the checkin, if any.
     * @type {Setup}
     */
    this.setup = options.setup || null;

    /**
     * Maximum number of clients supported by the checkin.
     * @type {Number}
     */
    this.maxClients = options.maxClients || Infinity;

    /**
     * Order in which indices are assigned. Currently supported values are:
     * - `'ascending'`: assigns indices in ascending order;
     * - `'random'`: assigns indices in random order.
     * @type {[type]}
     */
    this.order = options.order || 'ascending'; // 'ascending' | 'random'

    if (this.maxClients > _Number$MAX_SAFE_INTEGER) this.maxClients = _Number$MAX_SAFE_INTEGER;

    if (this.setup) {
      var numPlaces = this.setup.getNumPositions();

      if (this.maxClients > numPlaces && numPlaces > 0) this.maxClients = numPlaces;
    }

    this._availableIndices = [];
    this._nextAscendingIndex = 0;

    if (this.maxClients > maxRandomClients) this.order = 'ascending';else if (this.order === 'random') {
      this._nextAscendingIndex = this.maxClients;

      for (var i = 0; i < this.maxClients; i++) {
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
      } else if (this._nextAscendingIndex < this.maxClients) {
        return this._nextAscendingIndex++;
      }

      return -1;
    }
  }, {
    key: '_releaseIndex',
    value: function _releaseIndex(index) {
      this._availableIndices.push(index);
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

      if (index >= 0) this._releaseIndex(index);
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
          client.modules[_this.name].index = index;

          var label = null;
          var coordinates = null;

          if (_this.setup) {
            label = _this.setup.getLabel(index);
            coordinates = _this.setup.getCoordinates(index);
          }

          client.modules[_this.name].label = label;
          client.coordinates = coordinates;

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

          if (i > -1) _this2._availableIndices.splice(i, 1);
        }

        client.modules[_this2.name].index = index;

        if (_this2.setup) {
          client.modules[_this2.name].label = label;
          client.coordinates = coordinates;
        }
      };
    }
  }]);

  return ServerCheckin;
})(_ServerModule3['default']);

exports['default'] = ServerCheckin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7NkJBQXlCLGdCQUFnQjs7OztBQUV6QyxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztJQWdCVCxhQUFhO1lBQWIsYUFBYTs7Ozs7Ozs7Ozs7O0FBVXJCLFdBVlEsYUFBYSxHQVVOO1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFWTCxhQUFhOztBQVc5QiwrQkFYaUIsYUFBYSw2Q0FXeEIsT0FBTyxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7Ozs7OztBQU1qQyxRQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDOzs7Ozs7QUFNbkMsUUFBSSxDQUFDLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQzs7Ozs7Ozs7QUFRakQsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLFdBQVcsQ0FBQzs7QUFFMUMsUUFBSSxJQUFJLENBQUMsVUFBVSwyQkFBMEIsRUFDM0MsSUFBSSxDQUFDLFVBQVUsMkJBQTBCLENBQUM7O0FBRTVDLFFBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtBQUNkLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7O0FBRS9DLFVBQUksSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLElBQUksU0FBUyxHQUFHLENBQUMsRUFDOUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7S0FDL0I7O0FBRUQsUUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztBQUM1QixRQUFJLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxDQUFDOztBQUU3QixRQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0JBQWdCLEVBQ3BDLElBQUksQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDLEtBQ3RCLElB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TSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2Qzs7QUFFRCxjQUFNLENBQUMsT0FBTyxDQUFDLE9BQUssSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7QUFFeEMsWUFBSSxPQUFLLEtBQUssRUFBRTtBQUNkLGdCQUFNLENBQUMsT0FBTyxDQUFDLE9BQUssSUFBSSxDQUFDLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUN4QyxnQkFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7U0FDbEM7T0FDRixDQUFBO0tBQ0Y7OztTQWpLa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoic3JjL3NlcnZlci9TZXJ2ZXJDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZSc7XG5cbmNvbnN0IG1heFJhbmRvbUNsaWVudHMgPSA5OTk5O1xuXG5cbi8qKlxuICogW3NlcnZlcl0gQXNzaWduIHBsYWNlcyBhbW9uZyBhIHByZWRlZmluZWQge0BsaW5rIFNldHVwfS5cbiAqXG4gKiBUaGUgbW9kdWxlIGFzc2lnbnMgYSBwb3NpdGlvbiB0byBhIGNsaWVudCB1cG9uIHJlcXVlc3Qgb2YgdGhlIGNsaWVudC1zaWRlIG1vZHVsZS5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qc35DbGllbnRDaGVja2lufSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqIEBleGFtcGxlIGNvbnN0IHNldHVwID0gbmV3IFNlcnZlclNldHVwKCk7XG4gKiBzZXR1cC5nZW5lcmF0ZSgnbWF0cml4JywgeyBjb2xzOiA1LCByb3dzOiA0IH0pO1xuICpcbiAqIC8vIEFzIG5ldyBjbGllbnRzIGNvbm5lY3QsIHRoZSBwb3NpdGlvbnMgaW4gdGhlIG1hdHJpeCBhcmUgYXNzaWduZWQgcmFuZG9tbHlcbiAqIGNvbnN0IGNoZWNraW4gPSBuZXcgU2VydmVyQ2hlY2tpbih7IHNldHVwOiBzZXR1cCwgb3JkZXI6ICdyYW5kb20nIH0pO1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJDaGVja2luIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gT3B0aW9ucy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm5hbWU9J2NoZWNraW4nXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5zZXR1cF0gU2V0dXAgdXNlZCBpbiB0aGUgc2NlbmFyaW8sIGlmIGFueSAoY2YuIHtAbGluayBTZXJ2ZXJTZXR1cH0pLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubWF4Q2xpZW50cz1JbmZpbml0eV0gbWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBzdXBwb3J0ZWQgYnkgdGhlIHNjZW5hcmlvIHRocm91Z2ggdGhpcyBjaGVja2luIG1vZHVsZSAoaWYgYSBgb3B0aW9ucy5zZXR1cGAgaXMgcHJvdmlkZWQsIHRoZSBtYXhpbXVtIG51bWJlciBvZiBjbGllbnRzIHRoZSBudW1iZXIgb2YgcHJlZGVmaW5lZCBwb3NpdGlvbnMgb2YgdGhhdCBgc2V0dXBgKS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm9yZGVyPSdhc2NlbmRpbmcnXSBPcmRlciBpbiB3aGljaCBpbmRpY2VzIGFyZSBhc3NpZ25lZC4gQ3VycmVudGx5IHNwcG9ydGVkIHZhbHVlcyBhcmU6XG4gICAqIC0gYCdhc2NlbmRpbmcnYDogaW5kaWNlcyBhcmUgYXNzaWduZWQgaW4gYXNjZW5kaW5nIG9yZGVyO1xuICAgKiAtIGAncmFuZG9tJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIHJhbmRvbSBvcmRlci5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnY2hlY2tpbicpO1xuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdXNlZCBieSB0aGUgY2hlY2tpbiwgaWYgYW55LlxuICAgICAqIEB0eXBlIHtTZXR1cH1cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gb3B0aW9ucy5zZXR1cCB8fCBudWxsO1xuXG4gICAgLyoqXG4gICAgICogTWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyBzdXBwb3J0ZWQgYnkgdGhlIGNoZWNraW4uXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLm1heENsaWVudHMgPSBvcHRpb25zLm1heENsaWVudHMgfHwgSW5maW5pdHk7XG5cbiAgICAvKipcbiAgICAgKiBPcmRlciBpbiB3aGljaCBpbmRpY2VzIGFyZSBhc3NpZ25lZC4gQ3VycmVudGx5IHN1cHBvcnRlZCB2YWx1ZXMgYXJlOlxuICAgICAqIC0gYCdhc2NlbmRpbmcnYDogYXNzaWducyBpbmRpY2VzIGluIGFzY2VuZGluZyBvcmRlcjtcbiAgICAgKiAtIGAncmFuZG9tJ2A6IGFzc2lnbnMgaW5kaWNlcyBpbiByYW5kb20gb3JkZXIuXG4gICAgICogQHR5cGUge1t0eXBlXX1cbiAgICAgKi9cbiAgICB0aGlzLm9yZGVyID0gb3B0aW9ucy5vcmRlciB8fCAnYXNjZW5kaW5nJzsgLy8gJ2FzY2VuZGluZycgfCAncmFuZG9tJ1xuXG4gICAgaWYgKHRoaXMubWF4Q2xpZW50cyA+IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKVxuICAgICAgdGhpcy5tYXhDbGllbnRzID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbiAgICBpZiAodGhpcy5zZXR1cCkge1xuICAgICAgY29uc3QgbnVtUGxhY2VzID0gdGhpcy5zZXR1cC5nZXROdW1Qb3NpdGlvbnMoKTtcblxuICAgICAgaWYgKHRoaXMubWF4Q2xpZW50cyA+IG51bVBsYWNlcyAmJiBudW1QbGFjZXMgPiAwKVxuICAgICAgICB0aGlzLm1heENsaWVudHMgPSBudW1QbGFjZXM7XG4gICAgfVxuXG4gICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcyA9IFtdO1xuICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IDA7XG5cbiAgICBpZiAodGhpcy5tYXhDbGllbnRzID4gbWF4UmFuZG9tQ2xpZW50cylcbiAgICAgIHRoaXMub3JkZXIgPSAnYXNjZW5kaW5nJztcbiAgICBlbHNlIGlmICh0aGlzLm9yZGVyID09PSAncmFuZG9tJykge1xuICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gdGhpcy5tYXhDbGllbnRzO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubWF4Q2xpZW50czsgaSsrKVxuICAgICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG4gICAgfVxuICB9XG5cbiAgX2dldFJhbmRvbUluZGV4KCkge1xuICAgIGNvbnN0IG51bUF2YWlsYWJsZSA9IHRoaXMuX2F2YWlsYWJsZUluZGljZXMubGVuZ3RoO1xuXG4gICAgaWYgKG51bUF2YWlsYWJsZSA+IDApIHtcbiAgICAgIGxldCByYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBudW1BdmFpbGFibGUpO1xuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKHJhbmRvbSwgMSlbMF07XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX2dldEFzY2VuZGluZ0luZGV4KCkge1xuICAgIGlmICh0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfSBlbHNlIGlmICh0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPCB0aGlzLm1heENsaWVudHMpIHtcbiAgICAgIHJldHVybiB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgrKztcbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBfcmVsZWFzZUluZGV4KGluZGV4KSB7XG4gICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGluZGV4KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVzdGFydCcsIHRoaXMuX29uUmVzdGFydChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBpbmRleCA9IGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXg7XG5cbiAgICBpZiAoaW5kZXggPj0gMClcbiAgICAgIHRoaXMuX3JlbGVhc2VJbmRleChpbmRleCk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBsZXQgaW5kZXggPSAtMTtcblxuICAgICAgaWYgKHRoaXMub3JkZXIgPT09ICdyYW5kb20nKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldFJhbmRvbUluZGV4KCk7XG4gICAgICBlbHNlIC8vIGlmIChvcmRlciA9PT0gJ2Fjc2VuZGluZycpXG4gICAgICAgIGluZGV4ID0gdGhpcy5fZ2V0QXNjZW5kaW5nSW5kZXgoKTtcblxuICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleCA9IGluZGV4O1xuXG4gICAgICAgIGxldCBsYWJlbCA9IG51bGw7XG4gICAgICAgIGxldCBjb29yZGluYXRlcyA9IG51bGw7XG5cbiAgICAgICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgICAgICBsYWJlbCA9IHRoaXMuc2V0dXAuZ2V0TGFiZWwoaW5kZXgpO1xuICAgICAgICAgIGNvb3JkaW5hdGVzID0gdGhpcy5zZXR1cC5nZXRDb29yZGluYXRlcyhpbmRleCk7XG4gICAgICAgIH1cblxuICAgICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICdhY2tub3dsZWRnZScsIGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ3VuYXZhaWxhYmxlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX29uUmVzdGFydChjbGllbnQpIHtcbiAgICByZXR1cm4gKGluZGV4LCBsYWJlbCwgY29vcmRpbmF0ZXMpID0+IHtcbiAgICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoYXQncyBvayBvbiByYW5kb20gbW9kZVxuICAgICAgaWYgKGluZGV4ID4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4KSB7XG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXg7IGkgPCBpbmRleDsgaSsrKVxuICAgICAgICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpKTtcblxuICAgICAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSBpbmRleCArIDE7XG4gICAgICB9IGVsc2UgaWYgKGluZGV4ID09PSB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXgpIHtcbiAgICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgaSA9IHRoaXMuX2F2YWlsYWJsZUluZGljZXMuaW5kZXhPZihpbmRleCk7XG5cbiAgICAgICAgaWYgKGkgPiAtMSlcbiAgICAgICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cblxuICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5pbmRleCA9IGluZGV4O1xuXG4gICAgICBpZiAodGhpcy5zZXR1cCkge1xuICAgICAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmxhYmVsID0gbGFiZWw7XG4gICAgICAgIGNsaWVudC5jb29yZGluYXRlcyA9IGNvb3JkaW5hdGVzO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19
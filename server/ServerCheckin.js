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

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

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

var ServerCheckin = (function (_Module) {
  _inherits(ServerCheckin, _Module);

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
})(_Module3['default']);

exports['default'] = ServerCheckin;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQW1CLFVBQVU7Ozs7QUFFN0IsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQlQsYUFBYTtZQUFiLGFBQWE7Ozs7Ozs7Ozs7OztBQVVyQixXQVZRLGFBQWEsR0FVTjtRQUFkLE9BQU8seURBQUcsRUFBRTs7MEJBVkwsYUFBYTs7QUFXOUIsK0JBWGlCLGFBQWEsNkNBV3hCLE9BQU8sQ0FBQyxJQUFJLElBQUksU0FBUyxFQUFFOzs7Ozs7QUFNakMsUUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQzs7Ozs7O0FBTW5DLFFBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUM7Ozs7Ozs7O0FBUWpELFFBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxXQUFXLENBQUM7O0FBRTFDLFFBQUksSUFBSSxDQUFDLFVBQVUsMkJBQTBCLEVBQzNDLElBQUksQ0FBQyxVQUFVLDJCQUEwQixDQUFDOztBQUU1QyxRQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxVQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDOztBQUUvQyxVQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0tBQy9COztBQUVELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7QUFDNUIsUUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQUMsQ0FBQzs7QUFFN0IsUUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLGdCQUFnQixFQUNwQyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUN0QixJQUFJ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Q0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7U0FDdkM7O0FBRUQsY0FBTSxDQUFDLE9BQU8sQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7O0FBRXhDLFlBQUksT0FBSyxLQUFLLEVBQUU7QUFDZCxnQkFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDeEMsZ0JBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1NBQ2xDO09BQ0YsQ0FBQTtLQUNGOzs7U0FqS2tCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyQ2hlY2tpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5jb25zdCBtYXhSYW5kb21DbGllbnRzID0gOTk5OTtcblxuXG4vKipcbiAqIFtzZXJ2ZXJdIEFzc2lnbiBwbGFjZXMgYW1vbmcgYSBwcmVkZWZpbmVkIHtAbGluayBTZXR1cH0uXG4gKlxuICogVGhlIG1vZHVsZSBhc3NpZ25zIGEgcG9zaXRpb24gdG8gYSBjbGllbnQgdXBvbiByZXF1ZXN0IG9mIHRoZSBjbGllbnQtc2lkZSBtb2R1bGUuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudENoZWNraW4uanN+Q2xpZW50Q2hlY2tpbn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiBAZXhhbXBsZSBjb25zdCBzZXR1cCA9IG5ldyBTZXJ2ZXJTZXR1cCgpO1xuICogc2V0dXAuZ2VuZXJhdGUoJ21hdHJpeCcsIHsgY29sczogNSwgcm93czogNCB9KTtcbiAqXG4gKiAvLyBBcyBuZXcgY2xpZW50cyBjb25uZWN0LCB0aGUgcG9zaXRpb25zIGluIHRoZSBtYXRyaXggYXJlIGFzc2lnbmVkIHJhbmRvbWx5XG4gKiBjb25zdCBjaGVja2luID0gbmV3IFNlcnZlckNoZWNraW4oeyBzZXR1cDogc2V0dXAsIG9yZGVyOiAncmFuZG9tJyB9KTtcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyQ2hlY2tpbiBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5uYW1lPSdjaGVja2luJ10gTmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMuc2V0dXBdIFNldHVwIHVzZWQgaW4gdGhlIHNjZW5hcmlvLCBpZiBhbnkgKGNmLiB7QGxpbmsgU2VydmVyU2V0dXB9KS5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm1heENsaWVudHM9SW5maW5pdHldIG1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgc3VwcG9ydGVkIGJ5IHRoZSBzY2VuYXJpbyB0aHJvdWdoIHRoaXMgY2hlY2tpbiBtb2R1bGUgKGlmIGEgYG9wdGlvbnMuc2V0dXBgIGlzIHByb3ZpZGVkLCB0aGUgbWF4aW11bSBudW1iZXIgb2YgY2xpZW50cyB0aGUgbnVtYmVyIG9mIHByZWRlZmluZWQgcG9zaXRpb25zIG9mIHRoYXQgYHNldHVwYCkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5vcmRlcj0nYXNjZW5kaW5nJ10gT3JkZXIgaW4gd2hpY2ggaW5kaWNlcyBhcmUgYXNzaWduZWQuIEN1cnJlbnRseSBzcHBvcnRlZCB2YWx1ZXMgYXJlOlxuICAgKiAtIGAnYXNjZW5kaW5nJ2A6IGluZGljZXMgYXJlIGFzc2lnbmVkIGluIGFzY2VuZGluZyBvcmRlcjtcbiAgICogLSBgJ3JhbmRvbSdgOiBpbmRpY2VzIGFyZSBhc3NpZ25lZCBpbiByYW5kb20gb3JkZXIuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ2NoZWNraW4nKTtcblxuICAgIC8qKlxuICAgICAqIFNldHVwIHVzZWQgYnkgdGhlIGNoZWNraW4sIGlmIGFueS5cbiAgICAgKiBAdHlwZSB7U2V0dXB9XG4gICAgICovXG4gICAgdGhpcy5zZXR1cCA9IG9wdGlvbnMuc2V0dXAgfHwgbnVsbDtcblxuICAgIC8qKlxuICAgICAqIE1heGltdW0gbnVtYmVyIG9mIGNsaWVudHMgc3VwcG9ydGVkIGJ5IHRoZSBjaGVja2luLlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy5tYXhDbGllbnRzID0gb3B0aW9ucy5tYXhDbGllbnRzIHx8IEluZmluaXR5O1xuXG4gICAgLyoqXG4gICAgICogT3JkZXIgaW4gd2hpY2ggaW5kaWNlcyBhcmUgYXNzaWduZWQuIEN1cnJlbnRseSBzdXBwb3J0ZWQgdmFsdWVzIGFyZTpcbiAgICAgKiAtIGAnYXNjZW5kaW5nJ2A6IGFzc2lnbnMgaW5kaWNlcyBpbiBhc2NlbmRpbmcgb3JkZXI7XG4gICAgICogLSBgJ3JhbmRvbSdgOiBhc3NpZ25zIGluZGljZXMgaW4gcmFuZG9tIG9yZGVyLlxuICAgICAqIEB0eXBlIHtbdHlwZV19XG4gICAgICovXG4gICAgdGhpcy5vcmRlciA9IG9wdGlvbnMub3JkZXIgfHwgJ2FzY2VuZGluZyc7IC8vICdhc2NlbmRpbmcnIHwgJ3JhbmRvbSdcblxuICAgIGlmICh0aGlzLm1heENsaWVudHMgPiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUilcbiAgICAgIHRoaXMubWF4Q2xpZW50cyA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG4gICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgIGNvbnN0IG51bVBsYWNlcyA9IHRoaXMuc2V0dXAuZ2V0TnVtUG9zaXRpb25zKCk7XG5cbiAgICAgIGlmICh0aGlzLm1heENsaWVudHMgPiBudW1QbGFjZXMgJiYgbnVtUGxhY2VzID4gMClcbiAgICAgICAgdGhpcy5tYXhDbGllbnRzID0gbnVtUGxhY2VzO1xuICAgIH1cblxuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMgPSBbXTtcbiAgICB0aGlzLl9uZXh0QXNjZW5kaW5nSW5kZXggPSAwO1xuXG4gICAgaWYgKHRoaXMubWF4Q2xpZW50cyA+IG1heFJhbmRvbUNsaWVudHMpXG4gICAgICB0aGlzLm9yZGVyID0gJ2FzY2VuZGluZyc7XG4gICAgZWxzZSBpZiAodGhpcy5vcmRlciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCA9IHRoaXMubWF4Q2xpZW50cztcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1heENsaWVudHM7IGkrKylcbiAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5wdXNoKGkpO1xuICAgIH1cbiAgfVxuXG4gIF9nZXRSYW5kb21JbmRleCgpIHtcbiAgICBjb25zdCBudW1BdmFpbGFibGUgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmxlbmd0aDtcblxuICAgIGlmIChudW1BdmFpbGFibGUgPiAwKSB7XG4gICAgICBsZXQgcmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogbnVtQXZhaWxhYmxlKTtcbiAgICAgIHJldHVybiB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNwbGljZShyYW5kb20sIDEpWzBdO1xuICAgIH1cblxuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIF9nZXRBc2NlbmRpbmdJbmRleCgpIHtcbiAgICBpZiAodGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICByZXR1cm4gYSAtIGI7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRoaXMuX2F2YWlsYWJsZUluZGljZXMuc3BsaWNlKDAsIDEpWzBdO1xuICAgIH0gZWxzZSBpZiAodGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4IDwgdGhpcy5tYXhDbGllbnRzKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4Kys7XG4gICAgfVxuXG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgX3JlbGVhc2VJbmRleChpbmRleCkge1xuICAgIHRoaXMuX2F2YWlsYWJsZUluZGljZXMucHVzaChpbmRleCk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3Jlc3RhcnQnLCB0aGlzLl9vblJlc3RhcnQoY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3QgaW5kZXggPSBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdLmluZGV4O1xuXG4gICAgaWYgKGluZGV4ID49IDApXG4gICAgICB0aGlzLl9yZWxlYXNlSW5kZXgoaW5kZXgpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgIGlmICh0aGlzLm9yZGVyID09PSAncmFuZG9tJylcbiAgICAgICAgaW5kZXggPSB0aGlzLl9nZXRSYW5kb21JbmRleCgpO1xuICAgICAgZWxzZSAvLyBpZiAob3JkZXIgPT09ICdhY3NlbmRpbmcnKVxuICAgICAgICBpbmRleCA9IHRoaXMuX2dldEFzY2VuZGluZ0luZGV4KCk7XG5cbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXggPSBpbmRleDtcblxuICAgICAgICBsZXQgbGFiZWwgPSBudWxsO1xuICAgICAgICBsZXQgY29vcmRpbmF0ZXMgPSBudWxsO1xuXG4gICAgICAgIGlmICh0aGlzLnNldHVwKSB7XG4gICAgICAgICAgbGFiZWwgPSB0aGlzLnNldHVwLmdldExhYmVsKGluZGV4KTtcbiAgICAgICAgICBjb29yZGluYXRlcyA9IHRoaXMuc2V0dXAuZ2V0Q29vcmRpbmF0ZXMoaW5kZXgpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5sYWJlbCA9IGxhYmVsO1xuICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcblxuICAgICAgICB0aGlzLnNlbmQoY2xpZW50LCAnYWNrbm93bGVkZ2UnLCBpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2VuZChjbGllbnQsICd1bmF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIF9vblJlc3RhcnQoY2xpZW50KSB7XG4gICAgcmV0dXJuIChpbmRleCwgbGFiZWwsIGNvb3JkaW5hdGVzKSA9PiB7XG4gICAgICAvLyBUT0RPOiBjaGVjayBpZiB0aGF0J3Mgb2sgb24gcmFuZG9tIG1vZGVcbiAgICAgIGlmIChpbmRleCA+IHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCkge1xuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4OyBpIDwgaW5kZXg7IGkrKylcbiAgICAgICAgICB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLnB1c2goaSk7XG5cbiAgICAgICAgdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4ID0gaW5kZXggKyAxO1xuICAgICAgfSBlbHNlIGlmIChpbmRleCA9PT0gdGhpcy5fbmV4dEFzY2VuZGluZ0luZGV4KSB7XG4gICAgICAgIHRoaXMuX25leHRBc2NlbmRpbmdJbmRleCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IGkgPSB0aGlzLl9hdmFpbGFibGVJbmRpY2VzLmluZGV4T2YoaW5kZXgpO1xuXG4gICAgICAgIGlmIChpID4gLTEpXG4gICAgICAgICAgdGhpcy5fYXZhaWxhYmxlSW5kaWNlcy5zcGxpY2UoaSwgMSk7XG4gICAgICB9XG5cbiAgICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0uaW5kZXggPSBpbmRleDtcblxuICAgICAgaWYgKHRoaXMuc2V0dXApIHtcbiAgICAgICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXS5sYWJlbCA9IGxhYmVsO1xuICAgICAgICBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==
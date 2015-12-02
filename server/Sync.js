'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _syncServer = require('sync/server');

var _syncServer2 = _interopRequireDefault(_syncServer);

var _Module2 = require('./Module');

var _Module3 = _interopRequireDefault(_Module2);

/**
 * The {@link Sync} module takes care of the synchronization process on the server side.
 * @example
 * // Require the Soundworks library (server side)
 * const serverSide = require('soundworks/server'); // TODO
 *
 * // Create Sync module
 * const sync = new serverSide.Sync();
 *
 * // Get sync time
 * const nowSync = sync.getSyncTime(); // current time in the sync clock time
 */

var Sync = (function (_Module) {
  _inherits(Sync, _Module);

  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [name='sync'] Name of the module.
   */

  function Sync() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Sync);

    _get(Object.getPrototypeOf(Sync.prototype), 'constructor', this).call(this, options.name || 'sync');

    this._hrtimeStart = process.hrtime();

    this._sync = new _syncServer2['default'](function () {
      var time = process.hrtime(_this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
  }

  /**
   * @private
   * @todo ?
   */

  _createClass(Sync, [{
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      _get(Object.getPrototypeOf(Sync.prototype), 'connect', this).call(this, client);

      var sendFunction = function sendFunction(cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return _this2.send.apply(_this2, [client, cmd].concat(args));
      };
      var receiveFunction = function receiveFunction(cmd, callback) {
        return _this2.receive(client, cmd, callback);
      };

      this._sync.start(sendFunction, receiveFunction);
    }

    /**
     * Returns the current time in the sync clock.
     * @return {Number} Current sync time (in seconds).
     */
  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this._sync.getSyncTime();
    }
  }]);

  return Sync;
})(_Module3['default']);

exports['default'] = Sync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUF1QixhQUFhOzs7O3VCQUNqQixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7OztJQWVSLElBQUk7WUFBSixJQUFJOzs7Ozs7OztBQU1aLFdBTlEsSUFBSSxHQU1HOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLElBQUk7O0FBT3JCLCtCQVBpQixJQUFJLDZDQU9mLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFOztBQUU5QixRQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQzs7QUFFckMsUUFBSSxDQUFDLEtBQUssR0FBRyw0QkFBZSxZQUFNO0FBQ2hDLFVBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsTUFBSyxZQUFZLENBQUMsQ0FBQztBQUMvQyxhQUFPLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ2pDLENBQUMsQ0FBQztHQUNKOzs7Ozs7O2VBZmtCLElBQUk7O1dBcUJoQixpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXRCaUIsSUFBSSx5Q0FzQlAsTUFBTSxFQUFFOztBQUV0QixVQUFNLFlBQVksR0FBRyxTQUFmLFlBQVksQ0FBSSxHQUFHOzBDQUFLLElBQUk7QUFBSixjQUFJOzs7ZUFBSyxPQUFLLElBQUksTUFBQSxVQUFDLE1BQU0sRUFBRSxHQUFHLFNBQUssSUFBSSxFQUFDO09BQUEsQ0FBQztBQUN2RSxVQUFNLGVBQWUsR0FBRyxTQUFsQixlQUFlLENBQUksR0FBRyxFQUFFLFFBQVE7ZUFBSyxPQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQztPQUFBLENBQUM7O0FBRS9FLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxlQUFlLENBQUMsQ0FBQztLQUNqRDs7Ozs7Ozs7V0FNVSx1QkFBRztBQUNaLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNqQzs7O1NBcENrQixJQUFJOzs7cUJBQUosSUFBSSIsImZpbGUiOiJzcmMvc2VydmVyL1N5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU3luY1NlcnZlciBmcm9tICdzeW5jL3NlcnZlcic7XG5pbXBvcnQgTW9kdWxlIGZyb20gJy4vTW9kdWxlJztcblxuXG4vKipcbiAqIFRoZSB7QGxpbmsgU3luY30gbW9kdWxlIHRha2VzIGNhcmUgb2YgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqIEBleGFtcGxlXG4gKiAvLyBSZXF1aXJlIHRoZSBTb3VuZHdvcmtzIGxpYnJhcnkgKHNlcnZlciBzaWRlKVxuICogY29uc3Qgc2VydmVyU2lkZSA9IHJlcXVpcmUoJ3NvdW5kd29ya3Mvc2VydmVyJyk7IC8vIFRPRE9cbiAqXG4gKiAvLyBDcmVhdGUgU3luYyBtb2R1bGVcbiAqIGNvbnN0IHN5bmMgPSBuZXcgc2VydmVyU2lkZS5TeW5jKCk7XG4gKlxuICogLy8gR2V0IHN5bmMgdGltZVxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrIHRpbWVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3luYyBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3N5bmMnKTtcblxuICAgIHRoaXMuX2hydGltZVN0YXJ0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY1NlcnZlcigoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyA/XG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IHNlbmRGdW5jdGlvbiA9IChjbWQsIC4uLmFyZ3MpID0+IHRoaXMuc2VuZChjbGllbnQsIGNtZCwgLi4uYXJncyk7XG4gICAgY29uc3QgcmVjZWl2ZUZ1bmN0aW9uID0gKGNtZCwgY2FsbGJhY2spID0+IHRoaXMucmVjZWl2ZShjbGllbnQsIGNtZCwgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fc3luYy5zdGFydChzZW5kRnVuY3Rpb24sIHJlY2VpdmVGdW5jdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEN1cnJlbnQgc3luYyB0aW1lIChpbiBzZWNvbmRzKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKCk7XG4gIH1cbn1cblxuIl19
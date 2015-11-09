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
      _get(Object.getPrototypeOf(Sync.prototype), 'connect', this).call(this, client);
      this._sync.start(function (cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return client.send.apply(client, [cmd].concat(args));
      }, function (cmd, callback) {
        return client.receive(cmd, callback);
      });
    }

    /**
     * Returns the current time in the sync clock.
     * @return {Number} Current sync time (in seconds).
     */
  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this.sync.getSyncTime();
    }
  }]);

  return Sync;
})(_Module3['default']);

exports['default'] = Sync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUF1QixhQUFhOzs7O3VCQUNqQixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7OztJQWVSLElBQUk7WUFBSixJQUFJOzs7Ozs7OztBQU1aLFdBTlEsSUFBSSxHQU1HOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQU5MLElBQUk7O0FBT3JCLCtCQVBpQixJQUFJLDZDQU9mLE9BQU8sQ0FBQyxJQUFJLElBQUksTUFBTSxFQUFFOztBQUU5QixRQUFJLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNyQyxRQUFJLENBQUMsS0FBSyxHQUFHLDRCQUFlLFlBQU07QUFDaEMsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFLLFlBQVksQ0FBQyxDQUFDO0FBQy9DLGFBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDakMsQ0FBQyxDQUFDO0dBQ0o7Ozs7Ozs7ZUFka0IsSUFBSTs7V0FvQmhCLGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQXJCaUIsSUFBSSx5Q0FxQlAsTUFBTSxFQUFFO0FBQ3RCLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQUMsR0FBRzswQ0FBSyxJQUFJO0FBQUosY0FBSTs7O2VBQUssTUFBTSxDQUFDLElBQUksTUFBQSxDQUFYLE1BQU0sR0FBTSxHQUFHLFNBQUssSUFBSSxFQUFDO09BQUEsRUFBRSxVQUFDLEdBQUcsRUFBRSxRQUFRO2VBQUssTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDO09BQUEsQ0FBQyxDQUFDO0tBQ2pIOzs7Ozs7OztXQU1VLHVCQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ2hDOzs7U0EvQmtCLElBQUk7OztxQkFBSixJQUFJIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTeW5jU2VydmVyIGZyb20gJ3N5bmMvc2VydmVyJztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogVGhlIHtAbGluayBTeW5jfSBtb2R1bGUgdGFrZXMgY2FyZSBvZiB0aGUgc3luY2hyb25pemF0aW9uIHByb2Nlc3Mgb24gdGhlIHNlcnZlciBzaWRlLlxuICogQGV4YW1wbGVcbiAqIC8vIFJlcXVpcmUgdGhlIFNvdW5kd29ya3MgbGlicmFyeSAoc2VydmVyIHNpZGUpXG4gKiBjb25zdCBzZXJ2ZXJTaWRlID0gcmVxdWlyZSgnc291bmR3b3Jrcy9zZXJ2ZXInKTsgLy8gVE9ET1xuICpcbiAqIC8vIENyZWF0ZSBTeW5jIG1vZHVsZVxuICogY29uc3Qgc3luYyA9IG5ldyBzZXJ2ZXJTaWRlLlN5bmMoKTtcbiAqXG4gKiAvLyBHZXQgc3luYyB0aW1lXG4gKiBjb25zdCBub3dTeW5jID0gc3luYy5nZXRTeW5jVGltZSgpOyAvLyBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2sgdGltZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTeW5jIGV4dGVuZHMgTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3luYycpO1xuXG4gICAgdGhpcy5faHJ0aW1lU3RhcnQgPSBwcm9jZXNzLmhydGltZSgpO1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY1NlcnZlcigoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyA/XG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KChjbWQsIC4uLmFyZ3MpID0+IGNsaWVudC5zZW5kKGNtZCwgLi4uYXJncyksIChjbWQsIGNhbGxiYWNrKSA9PiBjbGllbnQucmVjZWl2ZShjbWQsIGNhbGxiYWNrKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEN1cnJlbnQgc3luYyB0aW1lIChpbiBzZWNvbmRzKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxufVxuXG4iXX0=
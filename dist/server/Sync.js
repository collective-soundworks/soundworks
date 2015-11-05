'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var Sync = require('sync/server');
var ServerModule = require('./ServerModule');
// import ServerModule from './ServerModule.es6.js';

/**
 * The {@link ServerSync} module takes care of the synchronization process on the server side.
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

var ServerSync = (function (_ServerModule) {
  _inherits(ServerSync, _ServerModule);

  // export default class ServerSync extends ServerModule {
  /**
   * Creates an instance of the class.
   * @param {Object} [options={}] Options.
   * @param {String} [name='sync'] Name of the module.
   */

  function ServerSync() {
    var _this = this;

    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, ServerSync);

    _get(Object.getPrototypeOf(ServerSync.prototype), 'constructor', this).call(this, options.name || 'sync');

    this._hrtimeStart = process.hrtime();
    this._sync = new Sync(function () {
      var time = process.hrtime(_this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
  }

  /**
   * @private
   * @todo ?
   */

  _createClass(ServerSync, [{
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerSync.prototype), 'connect', this).call(this, client);
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

  return ServerSync;
})(ServerModule);

module.exports = ServerSync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFFYixJQUFNLElBQUksR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDcEMsSUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlekMsVUFBVTtZQUFWLFVBQVU7Ozs7Ozs7OztBQU9ILFdBUFAsVUFBVSxHQU9ZOzs7UUFBZCxPQUFPLHlEQUFHLEVBQUU7OzBCQVBwQixVQUFVOztBQVFaLCtCQVJFLFVBQVUsNkNBUU4sT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7O0FBRTlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ3JDLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLENBQUMsWUFBTTtBQUMxQixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQUssWUFBWSxDQUFDLENBQUM7QUFDL0MsYUFBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNqQyxDQUFDLENBQUM7R0FDSjs7Ozs7OztlQWZHLFVBQVU7O1dBcUJQLGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQXRCRSxVQUFVLHlDQXNCRSxNQUFNLEVBQUU7QUFDdEIsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBQyxHQUFHOzBDQUFLLElBQUk7QUFBSixjQUFJOzs7ZUFBSyxNQUFNLENBQUMsSUFBSSxNQUFBLENBQVgsTUFBTSxHQUFNLEdBQUcsU0FBSyxJQUFJLEVBQUM7T0FBQSxFQUFFLFVBQUMsR0FBRyxFQUFFLFFBQVE7ZUFBSyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDakg7Ozs7Ozs7O1dBTVUsdUJBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDaEM7OztTQWhDRyxVQUFVO0dBQVMsWUFBWTs7QUFtQ3JDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgU3luYyA9IHJlcXVpcmUoJ3N5bmMvc2VydmVyJyk7XG5jb25zdCBTZXJ2ZXJNb2R1bGUgPSByZXF1aXJlKCcuL1NlcnZlck1vZHVsZScpO1xuLy8gaW1wb3J0IFNlcnZlck1vZHVsZSBmcm9tICcuL1NlcnZlck1vZHVsZS5lczYuanMnO1xuXG4vKipcbiAqIFRoZSB7QGxpbmsgU2VydmVyU3luY30gbW9kdWxlIHRha2VzIGNhcmUgb2YgdGhlIHN5bmNocm9uaXphdGlvbiBwcm9jZXNzIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqIEBleGFtcGxlXG4gKiAvLyBSZXF1aXJlIHRoZSBTb3VuZHdvcmtzIGxpYnJhcnkgKHNlcnZlciBzaWRlKVxuICogY29uc3Qgc2VydmVyU2lkZSA9IHJlcXVpcmUoJ3NvdW5kd29ya3Mvc2VydmVyJyk7IC8vIFRPRE9cbiAqXG4gKiAvLyBDcmVhdGUgU3luYyBtb2R1bGVcbiAqIGNvbnN0IHN5bmMgPSBuZXcgc2VydmVyU2lkZS5TeW5jKCk7XG4gKlxuICogLy8gR2V0IHN5bmMgdGltZVxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrIHRpbWVcbiAqL1xuY2xhc3MgU2VydmVyU3luYyBleHRlbmRzIFNlcnZlck1vZHVsZSB7XG4vLyBleHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJTeW5jIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIE9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZT0nc3luYyddIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKG9wdGlvbnMubmFtZSB8fCAnc3luYycpO1xuXG4gICAgdGhpcy5faHJ0aW1lU3RhcnQgPSBwcm9jZXNzLmhydGltZSgpO1xuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luYygoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyA/XG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAgICB0aGlzLl9zeW5jLnN0YXJ0KChjbWQsIC4uLmFyZ3MpID0+IGNsaWVudC5zZW5kKGNtZCwgLi4uYXJncyksIChjbWQsIGNhbGxiYWNrKSA9PiBjbGllbnQucmVjZWl2ZShjbWQsIGNhbGxiYWNrKSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEN1cnJlbnQgc3luYyB0aW1lIChpbiBzZWNvbmRzKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNlcnZlclN5bmM7XG4iXX0=
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
 * [server] Synchronize the local clock on a master clock shared by the server and the clients.
 *
 * Both the clients and the server can use this master clock as a common time reference.
 * For instance, this allows all the clients to do something exactly at the same time, such as blinking the screen or playing a sound in a synchronized manner.
 *
 * **Note:** the module is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * (See also {@link src/client/ClientSync.js~ClientSync} on the client side.)
 *
 * @example const sync = new ServerSync();
 *
 * const nowSync = sync.getSyncTime(); // current time in the sync clock time
 */

var ServerSync = (function (_Module) {
  _inherits(ServerSync, _Module);

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

    this._sync = new _syncServer2['default'](function () {
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
      var _this2 = this;

      _get(Object.getPrototypeOf(ServerSync.prototype), 'connect', this).call(this, client);

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

  return ServerSync;
})(_Module3['default']);

exports['default'] = ServerSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzBCQUF1QixhQUFhOzs7O3VCQUNqQixVQUFVOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJSLFVBQVU7WUFBVixVQUFVOzs7Ozs7OztBQU1sQixXQU5RLFVBQVUsR0FNSDs7O1FBQWQsT0FBTyx5REFBRyxFQUFFOzswQkFOTCxVQUFVOztBQU8zQiwrQkFQaUIsVUFBVSw2Q0FPckIsT0FBTyxDQUFDLElBQUksSUFBSSxNQUFNLEVBQUU7O0FBRTlCLFFBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVyQyxRQUFJLENBQUMsS0FBSyxHQUFHLDRCQUFlLFlBQU07QUFDaEMsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFLLFlBQVksQ0FBQyxDQUFDO0FBQy9DLGFBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDakMsQ0FBQyxDQUFDO0dBQ0o7Ozs7Ozs7ZUFma0IsVUFBVTs7V0FxQnRCLGlCQUFDLE1BQU0sRUFBRTs7O0FBQ2QsaUNBdEJpQixVQUFVLHlDQXNCYixNQUFNLEVBQUU7O0FBRXRCLFVBQU0sWUFBWSxHQUFHLFNBQWYsWUFBWSxDQUFJLEdBQUc7MENBQUssSUFBSTtBQUFKLGNBQUk7OztlQUFLLE9BQUssSUFBSSxNQUFBLFVBQUMsTUFBTSxFQUFFLEdBQUcsU0FBSyxJQUFJLEVBQUM7T0FBQSxDQUFDO0FBQ3ZFLFVBQU0sZUFBZSxHQUFHLFNBQWxCLGVBQWUsQ0FBSSxHQUFHLEVBQUUsUUFBUTtlQUFLLE9BQUssT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDO09BQUEsQ0FBQzs7QUFFL0UsVUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0tBQ2pEOzs7Ozs7OztXQU1VLHVCQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO0tBQ2pDOzs7U0FwQ2tCLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6InNyYy9zZXJ2ZXIvU2VydmVyU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTeW5jU2VydmVyIGZyb20gJ3N5bmMvc2VydmVyJztcbmltcG9ydCBNb2R1bGUgZnJvbSAnLi9Nb2R1bGUnO1xuXG5cbi8qKlxuICogW3NlcnZlcl0gU3luY2hyb25pemUgdGhlIGxvY2FsIGNsb2NrIG9uIGEgbWFzdGVyIGNsb2NrIHNoYXJlZCBieSB0aGUgc2VydmVyIGFuZCB0aGUgY2xpZW50cy5cbiAqXG4gKiBCb3RoIHRoZSBjbGllbnRzIGFuZCB0aGUgc2VydmVyIGNhbiB1c2UgdGhpcyBtYXN0ZXIgY2xvY2sgYXMgYSBjb21tb24gdGltZSByZWZlcmVuY2UuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgYWxsb3dzIGFsbCB0aGUgY2xpZW50cyB0byBkbyBzb21ldGhpbmcgZXhhY3RseSBhdCB0aGUgc2FtZSB0aW1lLCBzdWNoIGFzIGJsaW5raW5nIHRoZSBzY3JlZW4gb3IgcGxheWluZyBhIHNvdW5kIGluIGEgc3luY2hyb25pemVkIG1hbm5lci5cbiAqXG4gKiAqKk5vdGU6KiogdGhlIG1vZHVsZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRTeW5jLmpzfkNsaWVudFN5bmN9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgY29uc3Qgc3luYyA9IG5ldyBTZXJ2ZXJTeW5jKCk7XG4gKlxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrIHRpbWVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyU3luYyBleHRlbmRzIE1vZHVsZSB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBPcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWU9J3N5bmMnXSBOYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihvcHRpb25zLm5hbWUgfHwgJ3N5bmMnKTtcblxuICAgIHRoaXMuX2hydGltZVN0YXJ0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY1NlcnZlcigoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAdG9kbyA/XG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IHNlbmRGdW5jdGlvbiA9IChjbWQsIC4uLmFyZ3MpID0+IHRoaXMuc2VuZChjbGllbnQsIGNtZCwgLi4uYXJncyk7XG4gICAgY29uc3QgcmVjZWl2ZUZ1bmN0aW9uID0gKGNtZCwgY2FsbGJhY2spID0+IHRoaXMucmVjZWl2ZShjbGllbnQsIGNtZCwgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fc3luYy5zdGFydChzZW5kRnVuY3Rpb24sIHJlY2VpdmVGdW5jdGlvbik7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IEN1cnJlbnQgc3luYyB0aW1lIChpbiBzZWNvbmRzKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKCk7XG4gIH1cbn1cbiJdfQ==
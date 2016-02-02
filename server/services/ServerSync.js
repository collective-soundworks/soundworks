'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _syncServer = require('sync/server');

var _syncServer2 = _interopRequireDefault(_syncServer);

var SERVICE_ID = 'service:sync';
/**
 * Synchronize the local clock on a master clock shared by the server and the clients.
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

var ServerSync = (function (_ServerActivity) {
  _inherits(ServerSync, _ServerActivity);

  function ServerSync() {
    _classCallCheck(this, ServerSync);

    _get(Object.getPrototypeOf(ServerSync.prototype), 'constructor', this).call(this, SERVICE_ID);
  }

  _createClass(ServerSync, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ServerSync.prototype), 'start', this).call(this);

      this._hrtimeStart = process.hrtime();

      this._sync = new _syncServer2['default'](function () {
        var time = process.hrtime(_this._hrtimeStart);
        return time[0] + time[1] * 1e-9;
      });
    }

    /**
     * @private
     */
  }, {
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      _get(Object.getPrototypeOf(ServerSync.prototype), 'connect', this).call(this, client);

      var send = function send(cmd) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return _this2.send.apply(_this2, [client, cmd].concat(args));
      };
      var receive = function receive(cmd, callback) {
        return _this2.receive(client, cmd, callback);
      };

      this._sync.start(send, receive);
    }

    /**
     * Returns the current time in the sync clock.
     * @return {Number} - Current sync time (in seconds).
     */
  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this._sync.getSyncTime();
    }
  }]);

  return ServerSync;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerSync);

exports['default'] = ServerSync;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyU3luYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OzswQkFDeEMsYUFBYTs7OztBQUVwQyxJQUFNLFVBQVUsR0FBRyxjQUFjLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7SUFlNUIsVUFBVTtZQUFWLFVBQVU7O0FBQ0gsV0FEUCxVQUFVLEdBQ0E7MEJBRFYsVUFBVTs7QUFFWiwrQkFGRSxVQUFVLDZDQUVOLFVBQVUsRUFBRTtHQUNuQjs7ZUFIRyxVQUFVOztXQUtULGlCQUFHOzs7QUFDTixpQ0FORSxVQUFVLHVDQU1FOztBQUVkLFVBQUksQ0FBQyxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDOztBQUVyQyxVQUFJLENBQUMsS0FBSyxHQUFHLDRCQUFlLFlBQU07QUFDaEMsWUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxNQUFLLFlBQVksQ0FBQyxDQUFDO0FBQy9DLGVBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7T0FDakMsQ0FBQyxDQUFDO0tBQ0o7Ozs7Ozs7V0FLTSxpQkFBQyxNQUFNLEVBQUU7OztBQUNkLGlDQXBCRSxVQUFVLHlDQW9CRSxNQUFNLEVBQUU7O0FBRXRCLFVBQU0sSUFBSSxHQUFHLFNBQVAsSUFBSSxDQUFJLEdBQUc7MENBQUssSUFBSTtBQUFKLGNBQUk7OztlQUFLLE9BQUssSUFBSSxNQUFBLFVBQUMsTUFBTSxFQUFFLEdBQUcsU0FBSyxJQUFJLEVBQUM7T0FBQSxDQUFDO0FBQy9ELFVBQU0sT0FBTyxHQUFHLFNBQVYsT0FBTyxDQUFJLEdBQUcsRUFBRSxRQUFRO2VBQUssT0FBSyxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUM7T0FBQSxDQUFDOztBQUV2RSxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDakM7Ozs7Ozs7O1dBTVUsdUJBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7S0FDakM7OztTQWxDRyxVQUFVOzs7QUFxQ2hCLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDOztxQkFFdkMsVUFBVSIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlclN5bmMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3luY1NlcnZlciBmcm9tICdzeW5jL3NlcnZlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcbi8qKlxuICogU3luY2hyb25pemUgdGhlIGxvY2FsIGNsb2NrIG9uIGEgbWFzdGVyIGNsb2NrIHNoYXJlZCBieSB0aGUgc2VydmVyIGFuZCB0aGUgY2xpZW50cy5cbiAqXG4gKiBCb3RoIHRoZSBjbGllbnRzIGFuZCB0aGUgc2VydmVyIGNhbiB1c2UgdGhpcyBtYXN0ZXIgY2xvY2sgYXMgYSBjb21tb24gdGltZSByZWZlcmVuY2UuXG4gKiBGb3IgaW5zdGFuY2UsIHRoaXMgYWxsb3dzIGFsbCB0aGUgY2xpZW50cyB0byBkbyBzb21ldGhpbmcgZXhhY3RseSBhdCB0aGUgc2FtZSB0aW1lLCBzdWNoIGFzIGJsaW5raW5nIHRoZSBzY3JlZW4gb3IgcGxheWluZyBhIHNvdW5kIGluIGEgc3luY2hyb25pemVkIG1hbm5lci5cbiAqXG4gKiAqKk5vdGU6KiogdGhlIG1vZHVsZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9DbGllbnRTeW5jLmpzfkNsaWVudFN5bmN9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogQGV4YW1wbGUgY29uc3Qgc3luYyA9IG5ldyBTZXJ2ZXJTeW5jKCk7XG4gKlxuICogY29uc3Qgbm93U3luYyA9IHN5bmMuZ2V0U3luY1RpbWUoKTsgLy8gY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrIHRpbWVcbiAqL1xuY2xhc3MgU2VydmVyU3luYyBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgdGhpcy5faHJ0aW1lU3RhcnQgPSBwcm9jZXNzLmhydGltZSgpO1xuXG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jU2VydmVyKCgpID0+IHtcbiAgICAgIGNvbnN0IHRpbWUgPSBwcm9jZXNzLmhydGltZSh0aGlzLl9ocnRpbWVTdGFydCk7XG4gICAgICByZXR1cm4gdGltZVswXSArIHRpbWVbMV0gKiAxZS05O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIGNvbnN0IHNlbmQgPSAoY21kLCAuLi5hcmdzKSA9PiB0aGlzLnNlbmQoY2xpZW50LCBjbWQsIC4uLmFyZ3MpO1xuICAgIGNvbnN0IHJlY2VpdmUgPSAoY21kLCBjYWxsYmFjaykgPT4gdGhpcy5yZWNlaXZlKGNsaWVudCwgY21kLCBjYWxsYmFjayk7XG5cbiAgICB0aGlzLl9zeW5jLnN0YXJ0KHNlbmQsIHJlY2VpdmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdGltZSBpbiB0aGUgc3luYyBjbG9jay5cbiAgICogQHJldHVybiB7TnVtYmVyfSAtIEN1cnJlbnQgc3luYyB0aW1lIChpbiBzZWNvbmRzKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKCk7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyU3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlclN5bmM7XG4iXX0=
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _server = require('sync/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:sync';
/**
 * Interface for the server `'sync'` service.
 *
 * This service acts as the master clock provider for the client sync service,
 * in order to synchronize the clocks of the different clients to its own clock.
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.Sync}*__
 *
 * **Note:** the service is based on [`github.com/collective-soundworks/sync`](https://github.com/collective-soundworks/sync).
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.sync = this.require('sync');
 * // when the experience has started
 * const syncTime = this.sync.getSyncTime();
 */

var Sync = function (_Service) {
  (0, _inherits3.default)(Sync, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Sync() {
    (0, _classCallCheck3.default)(this, Sync);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Sync).call(this, SERVICE_ID));

    _this._hrtimeStart = process.hrtime();

    _this._sync = new _server2.default(function () {
      var time = process.hrtime(_this._hrtimeStart);
      return time[0] + time[1] * 1e-9;
    });
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Sync, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'start', this).call(this);
    }

    /** @private */

  }, {
    key: 'connect',
    value: function connect(client) {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Sync.prototype), 'connect', this).call(this, client);

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
     * Returns the current time in the sync clock, derived from `process.hrtime()`.
     * @return {Number} - Current sync time (in _seconds_).
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this._sync.getSyncTime();
    }
  }]);
  return Sync;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Sync);

exports.default = Sync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsY0FBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFrQk0sSTs7Ozs7QUFFSixrQkFBYztBQUFBOztBQUFBLDhHQUNOLFVBRE07O0FBR1osVUFBSyxZQUFMLEdBQW9CLFFBQVEsTUFBUixFQUFwQjs7QUFFQSxVQUFLLEtBQUwsR0FBYSxxQkFBZSxZQUFNO0FBQ2hDLFVBQU0sT0FBTyxRQUFRLE1BQVIsQ0FBZSxNQUFLLFlBQXBCLENBQWI7QUFDQSxhQUFPLEtBQUssQ0FBTCxJQUFVLEtBQUssQ0FBTCxJQUFVLElBQTNCO0FBQ0QsS0FIWSxDQUFiO0FBTFk7QUFTYjs7Ozs7Ozs0QkFHTztBQUNOO0FBQ0Q7Ozs7Ozs0QkFHTyxNLEVBQVE7QUFBQTs7QUFDZCxvR0FBYyxNQUFkOztBQUVBLFVBQU0sT0FBTyxTQUFQLElBQU8sQ0FBQyxHQUFEO0FBQUEsMENBQVMsSUFBVDtBQUFTLGNBQVQ7QUFBQTs7QUFBQSxlQUFrQixPQUFLLElBQUwsZ0JBQVUsTUFBVixFQUFrQixHQUFsQixTQUEwQixJQUExQixFQUFsQjtBQUFBLE9BQWI7QUFDQSxVQUFNLFVBQVUsU0FBVixPQUFVLENBQUMsR0FBRCxFQUFNLFFBQU47QUFBQSxlQUFtQixPQUFLLE9BQUwsQ0FBYSxNQUFiLEVBQXFCLEdBQXJCLEVBQTBCLFFBQTFCLENBQW5CO0FBQUEsT0FBaEI7O0FBRUEsV0FBSyxLQUFMLENBQVcsS0FBWCxDQUFpQixJQUFqQixFQUF1QixPQUF2QjtBQUNEOzs7Ozs7Ozs7a0NBTWE7QUFDWixhQUFPLEtBQUssS0FBTCxDQUFXLFdBQVgsRUFBUDtBQUNEOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsSUFBcEM7O2tCQUVlLEkiLCJmaWxlIjoiU3luYy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU3luY01vZHVsZSBmcm9tICdzeW5jL3NlcnZlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jJztcbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnc3luYydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFjdHMgYXMgdGhlIG1hc3RlciBjbG9jayBwcm92aWRlciBmb3IgdGhlIGNsaWVudCBzeW5jIHNlcnZpY2UsXG4gKiBpbiBvcmRlciB0byBzeW5jaHJvbml6ZSB0aGUgY2xvY2tzIG9mIHRoZSBkaWZmZXJlbnQgY2xpZW50cyB0byBpdHMgb3duIGNsb2NrLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSpfX1xuICpcbiAqICoqTm90ZToqKiB0aGUgc2VydmljZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAqL1xuY2xhc3MgU3luYyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5faHJ0aW1lU3RhcnQgPSBwcm9jZXNzLmhydGltZSgpO1xuXG4gICAgdGhpcy5fc3luYyA9IG5ldyBTeW5jTW9kdWxlKCgpID0+IHtcbiAgICAgIGNvbnN0IHRpbWUgPSBwcm9jZXNzLmhydGltZSh0aGlzLl9ocnRpbWVTdGFydCk7XG4gICAgICByZXR1cm4gdGltZVswXSArIHRpbWVbMV0gKiAxZS05O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICBjb25zdCBzZW5kID0gKGNtZCwgLi4uYXJncykgPT4gdGhpcy5zZW5kKGNsaWVudCwgY21kLCAuLi5hcmdzKTtcbiAgICBjb25zdCByZWNlaXZlID0gKGNtZCwgY2FsbGJhY2spID0+IHRoaXMucmVjZWl2ZShjbGllbnQsIGNtZCwgY2FsbGJhY2spO1xuXG4gICAgdGhpcy5fc3luYy5zdGFydChzZW5kLCByZWNlaXZlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHRpbWUgaW4gdGhlIHN5bmMgY2xvY2ssIGRlcml2ZWQgZnJvbSBgcHJvY2Vzcy5ocnRpbWUoKWAuXG4gICAqIEByZXR1cm4ge051bWJlcn0gLSBDdXJyZW50IHN5bmMgdGltZSAoaW4gX3NlY29uZHNfKS5cbiAgICovXG4gIGdldFN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luYyk7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmM7XG4iXX0=
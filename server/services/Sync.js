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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _server = require('sync/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:sync';
/**
 * Interface of the server `'sync'` service.
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

var Sync = function (_Activity) {
  (0, _inherits3.default)(Sync, _Activity);

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
     * Returns the current time in the sync clock, devired from `process.hrtime()`.
     * @return {Number} - Current sync time (in _seconds_).
     */

  }, {
    key: 'getSyncTime',
    value: function getSyncTime() {
      return this._sync.getSyncTime();
    }
  }]);
  return Sync;
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, Sync);

exports.default = Sync;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLGFBQWEsY0FBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCQTs7Ozs7QUFFSixXQUZJLElBRUosR0FBYzt3Q0FGVixNQUVVOzs2RkFGVixpQkFHSSxhQURNOztBQUdaLFVBQUssWUFBTCxHQUFvQixRQUFRLE1BQVIsRUFBcEIsQ0FIWTs7QUFLWixVQUFLLEtBQUwsR0FBYSxxQkFBZSxZQUFNO0FBQ2hDLFVBQU0sT0FBTyxRQUFRLE1BQVIsQ0FBZSxNQUFLLFlBQUwsQ0FBdEIsQ0FEMEI7QUFFaEMsYUFBTyxLQUFLLENBQUwsSUFBVSxLQUFLLENBQUwsSUFBVSxJQUFWLENBRmU7S0FBTixDQUE1QixDQUxZOztHQUFkOzs7Ozs2QkFGSTs7NEJBY0k7QUFDTix1REFmRSwwQ0FlRixDQURNOzs7Ozs7OzRCQUtBLFFBQVE7OztBQUNkLHVEQXBCRSw2Q0FvQlksT0FBZCxDQURjOztBQUdkLFVBQU0sT0FBTyxTQUFQLElBQU8sQ0FBQyxHQUFEOzBDQUFTOzs7O2VBQVMsT0FBSyxJQUFMLGdCQUFVLFFBQVEsWUFBUSxLQUExQjtPQUFsQixDQUhDO0FBSWQsVUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFDLEdBQUQsRUFBTSxRQUFOO2VBQW1CLE9BQUssT0FBTCxDQUFhLE1BQWIsRUFBcUIsR0FBckIsRUFBMEIsUUFBMUI7T0FBbkIsQ0FKRjs7QUFNZCxXQUFLLEtBQUwsQ0FBVyxLQUFYLENBQWlCLElBQWpCLEVBQXVCLE9BQXZCLEVBTmM7Ozs7Ozs7Ozs7a0NBYUY7QUFDWixhQUFPLEtBQUssS0FBTCxDQUFXLFdBQVgsRUFBUCxDQURZOzs7U0FoQ1Y7OztBQXFDTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLElBQXBDOztrQkFFZSIsImZpbGUiOiJTeW5jLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4uL2NvcmUvQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFN5bmNNb2R1bGUgZnJvbSAnc3luYy9zZXJ2ZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYyc7XG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgc2VydmVyIGAnc3luYydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFjdHMgYXMgdGhlIG1hc3RlciBjbG9jayBwcm92aWRlciBmb3IgdGhlIGNsaWVudCBzeW5jIHNlcnZpY2UsXG4gKiBpbiBvcmRlciB0byBzeW5jaHJvbml6ZSB0aGUgY2xvY2tzIG9mIHRoZSBkaWZmZXJlbnQgY2xpZW50cyB0byBpdHMgb3duIGNsb2NrLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TeW5jfSpfX1xuICpcbiAqICoqTm90ZToqKiB0aGUgc2VydmljZSBpcyBiYXNlZCBvbiBbYGdpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmNgXShodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3N5bmMpLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogY29uc3Qgc3luY1RpbWUgPSB0aGlzLnN5bmMuZ2V0U3luY1RpbWUoKTtcbiAqL1xuY2xhc3MgU3luYyBleHRlbmRzIEFjdGl2aXR5IHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2hydGltZVN0YXJ0ID0gcHJvY2Vzcy5ocnRpbWUoKTtcblxuICAgIHRoaXMuX3N5bmMgPSBuZXcgU3luY01vZHVsZSgoKSA9PiB7XG4gICAgICBjb25zdCB0aW1lID0gcHJvY2Vzcy5ocnRpbWUodGhpcy5faHJ0aW1lU3RhcnQpO1xuICAgICAgcmV0dXJuIHRpbWVbMF0gKyB0aW1lWzFdICogMWUtOTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgY29uc3Qgc2VuZCA9IChjbWQsIC4uLmFyZ3MpID0+IHRoaXMuc2VuZChjbGllbnQsIGNtZCwgLi4uYXJncyk7XG4gICAgY29uc3QgcmVjZWl2ZSA9IChjbWQsIGNhbGxiYWNrKSA9PiB0aGlzLnJlY2VpdmUoY2xpZW50LCBjbWQsIGNhbGxiYWNrKTtcblxuICAgIHRoaXMuX3N5bmMuc3RhcnQoc2VuZCwgcmVjZWl2ZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB0aW1lIGluIHRoZSBzeW5jIGNsb2NrLCBkZXZpcmVkIGZyb20gYHByb2Nlc3MuaHJ0aW1lKClgLlxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9IC0gQ3VycmVudCBzeW5jIHRpbWUgKGluIF9zZWNvbmRzXykuXG4gICAqL1xuICBnZXRTeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmMpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jO1xuIl19
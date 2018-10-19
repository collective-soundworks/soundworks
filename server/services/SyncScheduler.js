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

var _helpers = require('../../utils/helpers');

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:sync-scheduler';

/**
 * Interface for the server `'sync-scheduler'` service.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.syncScheduler = this.require('sync-scheduler');
 */

var SyncScheduler = function (_Service) {
  (0, _inherits3.default)(SyncScheduler, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function SyncScheduler() {
    (0, _classCallCheck3.default)(this, SyncScheduler);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SyncScheduler.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler)).call(this, SERVICE_ID));

    _this._sync = _this.require('sync');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SyncScheduler, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(SyncScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler.prototype), 'start', this).call(this);

      this.ready();
    }
  }, {
    key: 'connect',


    /** @private */
    value: function connect(client) {
      (0, _get3.default)(SyncScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler.prototype), 'connect', this).call(this, client);
    }

    /** @private */

  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)(SyncScheduler.prototype.__proto__ || (0, _getPrototypeOf2.default)(SyncScheduler.prototype), 'disconnect', this).call(this, client);
    }
  }, {
    key: 'currentTime',
    get: function get() {
      return this._sync.getSyncTime();
    }
  }, {
    key: 'syncTime',
    get: function get() {
      return this._sync.getSyncTime();
    }
  }]);
  return SyncScheduler;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SyncScheduler);

exports.default = SyncScheduler;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmNTY2hlZHVsZXIuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmNTY2hlZHVsZXIiLCJfc3luYyIsInJlcXVpcmUiLCJyZWFkeSIsImNsaWVudCIsImdldFN5bmNUaW1lIiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsd0JBQW5COztBQUdBOzs7Ozs7Ozs7SUFRTUMsYTs7O0FBQ0o7QUFDQSwyQkFBYztBQUFBOztBQUFBLG9KQUNORCxVQURNOztBQUdaLFVBQUtFLEtBQUwsR0FBYSxNQUFLQyxPQUFMLENBQWEsTUFBYixDQUFiO0FBSFk7QUFJYjs7QUFFRDs7Ozs7NEJBQ1E7QUFDTjs7QUFFQSxXQUFLQyxLQUFMO0FBQ0Q7Ozs7O0FBVUQ7NEJBQ1FDLE0sRUFBUTtBQUNkLGtKQUFjQSxNQUFkO0FBQ0Q7O0FBRUQ7Ozs7K0JBQ1dBLE0sRUFBUTtBQUNqQixxSkFBaUJBLE1BQWpCO0FBQ0Q7Ozt3QkFoQmlCO0FBQ2hCLGFBQU8sS0FBS0gsS0FBTCxDQUFXSSxXQUFYLEVBQVA7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLSixLQUFMLENBQVdJLFdBQVgsRUFBUDtBQUNEOzs7RUFyQnlCQyxpQjs7QUFrQzVCQyx5QkFBZUMsUUFBZixDQUF3QlQsVUFBeEIsRUFBb0NDLGFBQXBDOztrQkFFZUEsYSIsImZpbGUiOiJTeW5jU2NoZWR1bGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c3luYy1zY2hlZHVsZXInO1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnc3luYy1zY2hlZHVsZXInYCBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc3luY1NjaGVkdWxlciA9IHRoaXMucmVxdWlyZSgnc3luYy1zY2hlZHVsZXInKTtcbiAqL1xuY2xhc3MgU3luY1NjaGVkdWxlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fc3luYyA9IHRoaXMucmVxdWlyZSgnc3luYycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBnZXQgY3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5bmMuZ2V0U3luY1RpbWUoKTtcbiAgfVxuXG4gIGdldCBzeW5jVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFN5bmNTY2hlZHVsZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTeW5jU2NoZWR1bGVyO1xuIl19
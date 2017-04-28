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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlN5bmNTY2hlZHVsZXIuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIlN5bmNTY2hlZHVsZXIiLCJfc3luYyIsInJlcXVpcmUiLCJyZWFkeSIsImNsaWVudCIsImdldFN5bmNUaW1lIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsd0JBQW5COztBQUdBOzs7Ozs7Ozs7SUFRTUMsYTs7O0FBQ0o7QUFDQSwyQkFBYztBQUFBOztBQUFBLG9KQUNORCxVQURNOztBQUdaLFVBQUtFLEtBQUwsR0FBYSxNQUFLQyxPQUFMLENBQWEsTUFBYixDQUFiO0FBSFk7QUFJYjs7QUFFRDs7Ozs7NEJBQ1E7QUFDTjs7QUFFQSxXQUFLQyxLQUFMO0FBQ0Q7Ozs7O0FBVUQ7NEJBQ1FDLE0sRUFBUTtBQUNkLGtKQUFjQSxNQUFkO0FBQ0Q7O0FBRUQ7Ozs7K0JBQ1dBLE0sRUFBUTtBQUNqQixxSkFBaUJBLE1BQWpCO0FBQ0Q7Ozt3QkFoQmlCO0FBQ2hCLGFBQU8sS0FBS0gsS0FBTCxDQUFXSSxXQUFYLEVBQVA7QUFDRDs7O3dCQUVjO0FBQ2IsYUFBTyxLQUFLSixLQUFMLENBQVdJLFdBQVgsRUFBUDtBQUNEOzs7OztBQWFILHlCQUFlQyxRQUFmLENBQXdCUCxVQUF4QixFQUFvQ0MsYUFBcEM7O2tCQUVlQSxhIiwiZmlsZSI6IlN5bmNTY2hlZHVsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHsgZ2V0T3B0IH0gZnJvbSAnLi4vLi4vdXRpbHMvaGVscGVycyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzeW5jLXNjaGVkdWxlcic7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdzeW5jLXNjaGVkdWxlcidgIHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zeW5jU2NoZWR1bGVyID0gdGhpcy5yZXF1aXJlKCdzeW5jLXNjaGVkdWxlcicpO1xuICovXG5jbGFzcyBTeW5jU2NoZWR1bGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9zeW5jID0gdGhpcy5yZXF1aXJlKCdzeW5jJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIGdldCBjdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc3luYy5nZXRTeW5jVGltZSgpO1xuICB9XG5cbiAgZ2V0IHN5bmNUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zeW5jLmdldFN5bmNUaW1lKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU3luY1NjaGVkdWxlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFN5bmNTY2hlZHVsZXI7XG4iXX0=
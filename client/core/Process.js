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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _EventEmitter2 = require('../../utils/EventEmitter');

var _EventEmitter3 = _interopRequireDefault(_EventEmitter2);

var _Signal = require('../../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A process defines the simpliest unit of the framework.
 * It is defined by a signal `active` and 2 methods: `start` and `stop`.
 *
 * @memberof module:soundworks/client
 */
var Process = function (_EventEmitter) {
  (0, _inherits3.default)(Process, _EventEmitter);

  function Process(id) {
    (0, _classCallCheck3.default)(this, Process);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Process.__proto__ || (0, _getPrototypeOf2.default)(Process)).call(this));

    if (id === undefined) throw new Error('Undefined id for process ' + _this.constructor.name);

    /**
     * Name of the process.
     * @name id
     * @type {String}
     * @instanceof Process
     */
    _this.id = id;

    /**
     * Signals defining the process state.
     * @name signal
     * @type {Object}
     * @instanceof Process
     */
    _this.signals = {};
    _this.signals.active = new _Signal2.default();
    return _this;
  }

  /**
   * Start the process.
   */


  (0, _createClass3.default)(Process, [{
    key: 'start',
    value: function start() {
      this.signals.active.set(true);
    }

    /**
     * Stop the process.
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.signals.active.set(false);
    }
  }]);
  return Process;
}(_EventEmitter3.default);

exports.default = Process;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2Nlc3MuanMiXSwibmFtZXMiOlsiUHJvY2VzcyIsImlkIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJzaWduYWxzIiwiYWN0aXZlIiwic2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsTzs7O0FBQ0osbUJBQVlDLEVBQVosRUFBZ0I7QUFBQTs7QUFBQTs7QUFHZCxRQUFJQSxPQUFPQyxTQUFYLEVBQ0UsTUFBTSxJQUFJQyxLQUFKLCtCQUFzQyxNQUFLQyxXQUFMLENBQWlCQyxJQUF2RCxDQUFOOztBQUVGOzs7Ozs7QUFNQSxVQUFLSixFQUFMLEdBQVVBLEVBQVY7O0FBRUE7Ozs7OztBQU1BLFVBQUtLLE9BQUwsR0FBZSxFQUFmO0FBQ0EsVUFBS0EsT0FBTCxDQUFhQyxNQUFiLEdBQXNCLHNCQUF0QjtBQXJCYztBQXNCZjs7QUFFRDs7Ozs7Ozs0QkFHUTtBQUNOLFdBQUtELE9BQUwsQ0FBYUMsTUFBYixDQUFvQkMsR0FBcEIsQ0FBd0IsSUFBeEI7QUFDRDs7QUFFRDs7Ozs7OzJCQUdPO0FBQ0wsV0FBS0YsT0FBTCxDQUFhQyxNQUFiLENBQW9CQyxHQUFwQixDQUF3QixLQUF4QjtBQUNEOzs7OztrQkFHWVIsTyIsImZpbGUiOiJQcm9jZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi8uLi91dGlscy9FdmVudEVtaXR0ZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi8uLi91dGlscy9TaWduYWwnO1xuXG4vKipcbiAqIEEgcHJvY2VzcyBkZWZpbmVzIHRoZSBzaW1wbGllc3QgdW5pdCBvZiB0aGUgZnJhbWV3b3JrLlxuICogSXQgaXMgZGVmaW5lZCBieSBhIHNpZ25hbCBgYWN0aXZlYCBhbmQgMiBtZXRob2RzOiBgc3RhcnRgIGFuZCBgc3RvcGAuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBQcm9jZXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgaWYgKGlkID09PSB1bmRlZmluZWQpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZGVmaW5lZCBpZCBmb3IgcHJvY2VzcyAke3RoaXMuY29uc3RydWN0b3IubmFtZX1gKTtcblxuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIHByb2Nlc3MuXG4gICAgICogQG5hbWUgaWRcbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqIEBpbnN0YW5jZW9mIFByb2Nlc3NcbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG5cbiAgICAvKipcbiAgICAgKiBTaWduYWxzIGRlZmluaW5nIHRoZSBwcm9jZXNzIHN0YXRlLlxuICAgICAqIEBuYW1lIHNpZ25hbFxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQGluc3RhbmNlb2YgUHJvY2Vzc1xuICAgICAqL1xuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUgPSBuZXcgU2lnbmFsKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHByb2Nlc3MuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlLnNldCh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBwcm9jZXNzLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlLnNldChmYWxzZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvY2VzcztcbiJdfQ==
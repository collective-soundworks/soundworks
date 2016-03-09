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

var _events = require('events');

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A process defines the simpliest unit of the framework.
 * It is defined by a signal `active` and 2 methods: `start` and `stop`=.
 */

var Process = function (_EventEmitter) {
  (0, _inherits3.default)(Process, _EventEmitter);

  function Process(id) {
    (0, _classCallCheck3.default)(this, Process);

    /**
     * Name of the module.
     * @type {String}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Process).call(this));

    _this.id = id;

    /**
     * Signals defining the process state.
     * @type {Object}
     */
    _this.signals = {};
    _this.signals.active = new _Signal2.default();
    return _this;
  }

  /**
   * Start a process.
   */


  (0, _createClass3.default)(Process, [{
    key: 'start',
    value: function start() {
      this.signals.active.set(true);
    }

    /**
     * Stop a process.
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.signals.active.set(false);
    }
  }]);
  return Process;
}(_events.EventEmitter);

exports.default = Process;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2Nlc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7SUFNcUI7OztBQUNuQixXQURtQixPQUNuQixDQUFZLEVBQVosRUFBZ0I7d0NBREcsU0FDSDs7Ozs7Ozs2RkFERyxxQkFDSDs7QUFNZCxVQUFLLEVBQUwsR0FBVSxFQUFWOzs7Ozs7QUFOYyxTQVlkLENBQUssT0FBTCxHQUFlLEVBQWYsQ0FaYztBQWFkLFVBQUssT0FBTCxDQUFhLE1BQWIsR0FBc0Isc0JBQXRCLENBYmM7O0dBQWhCOzs7Ozs7OzZCQURtQjs7NEJBb0JYO0FBQ04sV0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixHQUFwQixDQUF3QixJQUF4QixFQURNOzs7Ozs7Ozs7MkJBT0Q7QUFDTCxXQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLEdBQXBCLENBQXdCLEtBQXhCLEVBREs7OztTQTNCWSIsImZpbGUiOiJQcm9jZXNzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuXG4vKipcbiAqIEEgcHJvY2VzcyBkZWZpbmVzIHRoZSBzaW1wbGllc3QgdW5pdCBvZiB0aGUgZnJhbWV3b3JrLlxuICogSXQgaXMgZGVmaW5lZCBieSBhIHNpZ25hbCBgYWN0aXZlYCBhbmQgMiBtZXRob2RzOiBgc3RhcnRgIGFuZCBgc3RvcGA9LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcm9jZXNzIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoaWQpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIE5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMuaWQgPSBpZDtcblxuICAgIC8qKlxuICAgICAqIFNpZ25hbHMgZGVmaW5pbmcgdGhlIHByb2Nlc3Mgc3RhdGUuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnNpZ25hbHMgPSB7fTtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlID0gbmV3IFNpZ25hbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IGEgcHJvY2Vzcy5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUuc2V0KHRydWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgYSBwcm9jZXNzLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlLnNldChmYWxzZSk7XG4gIH1cblxufVxuIl19
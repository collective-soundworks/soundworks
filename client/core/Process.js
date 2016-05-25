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
 * It is defined by a signal `active` and 2 methods: `start` and `stop`.
 *
 * @memberof module:soundworks/client
 */

var Process = function (_EventEmitter) {
  (0, _inherits3.default)(Process, _EventEmitter);

  function Process(id) {
    (0, _classCallCheck3.default)(this, Process);

    /**
     * Name of the process.
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
}(_events.EventEmitter);

exports.default = Process;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2Nlc3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7OztJQVFNLE87OztBQUNKLG1CQUFZLEVBQVosRUFBZ0I7QUFBQTs7Ozs7OztBQUFBOztBQU1kLFVBQUssRUFBTCxHQUFVLEVBQVY7Ozs7OztBQU1BLFVBQUssT0FBTCxHQUFlLEVBQWY7QUFDQSxVQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLHNCQUF0QjtBQWJjO0FBY2Y7Ozs7Ozs7Ozs0QkFLTztBQUNOLFdBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsR0FBcEIsQ0FBd0IsSUFBeEI7QUFDRDs7Ozs7Ozs7MkJBS007QUFDTCxXQUFLLE9BQUwsQ0FBYSxNQUFiLENBQW9CLEdBQXBCLENBQXdCLEtBQXhCO0FBQ0Q7Ozs7O2tCQUdZLE8iLCJmaWxlIjoiUHJvY2Vzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcblxuLyoqXG4gKiBBIHByb2Nlc3MgZGVmaW5lcyB0aGUgc2ltcGxpZXN0IHVuaXQgb2YgdGhlIGZyYW1ld29yay5cbiAqIEl0IGlzIGRlZmluZWQgYnkgYSBzaWduYWwgYGFjdGl2ZWAgYW5kIDIgbWV0aG9kczogYHN0YXJ0YCBhbmQgYHN0b3BgLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgUHJvY2VzcyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGlkKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBwcm9jZXNzLlxuICAgICAqIEB0eXBlIHtTdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogU2lnbmFscyBkZWZpbmluZyB0aGUgcHJvY2VzcyBzdGF0ZS5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5hY3RpdmUgPSBuZXcgU2lnbmFsKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgdGhlIHByb2Nlc3MuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlLnNldCh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBwcm9jZXNzLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlLnNldChmYWxzZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHJvY2VzcztcbiJdfQ==
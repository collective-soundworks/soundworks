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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlByb2Nlc3MuanMiXSwibmFtZXMiOlsiUHJvY2VzcyIsImlkIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJzaWduYWxzIiwiYWN0aXZlIiwiU2lnbmFsIiwic2V0IiwiRXZlbnRFbWl0dGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7SUFNTUEsTzs7O0FBQ0osbUJBQVlDLEVBQVosRUFBZ0I7QUFBQTs7QUFBQTs7QUFHZCxRQUFJQSxPQUFPQyxTQUFYLEVBQ0UsTUFBTSxJQUFJQyxLQUFKLCtCQUFzQyxNQUFLQyxXQUFMLENBQWlCQyxJQUF2RCxDQUFOOztBQUVGOzs7Ozs7QUFNQSxVQUFLSixFQUFMLEdBQVVBLEVBQVY7O0FBRUE7Ozs7OztBQU1BLFVBQUtLLE9BQUwsR0FBZSxFQUFmO0FBQ0EsVUFBS0EsT0FBTCxDQUFhQyxNQUFiLEdBQXNCLElBQUlDLGdCQUFKLEVBQXRCO0FBckJjO0FBc0JmOztBQUVEOzs7Ozs7OzRCQUdRO0FBQ04sV0FBS0YsT0FBTCxDQUFhQyxNQUFiLENBQW9CRSxHQUFwQixDQUF3QixJQUF4QjtBQUNEOztBQUVEOzs7Ozs7MkJBR087QUFDTCxXQUFLSCxPQUFMLENBQWFDLE1BQWIsQ0FBb0JFLEdBQXBCLENBQXdCLEtBQXhCO0FBQ0Q7OztFQXJDbUJDLHNCOztrQkF3Q1BWLE8iLCJmaWxlIjoiUHJvY2Vzcy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vLi4vdXRpbHMvRXZlbnRFbWl0dGVyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi4vLi4vdXRpbHMvU2lnbmFsJztcblxuLyoqXG4gKiBBIHByb2Nlc3MgZGVmaW5lcyB0aGUgc2ltcGxpZXN0IHVuaXQgb2YgdGhlIGZyYW1ld29yay5cbiAqIEl0IGlzIGRlZmluZWQgYnkgYSBzaWduYWwgYGFjdGl2ZWAgYW5kIDIgbWV0aG9kczogYHN0YXJ0YCBhbmQgYHN0b3BgLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgUHJvY2VzcyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGNvbnN0cnVjdG9yKGlkKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGlmIChpZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmRlZmluZWQgaWQgZm9yIHByb2Nlc3MgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9YCk7XG5cbiAgICAvKipcbiAgICAgKiBOYW1lIG9mIHRoZSBwcm9jZXNzLlxuICAgICAqIEBuYW1lIGlkXG4gICAgICogQHR5cGUge1N0cmluZ31cbiAgICAgKiBAaW5zdGFuY2VvZiBQcm9jZXNzXG4gICAgICovXG4gICAgdGhpcy5pZCA9IGlkO1xuXG4gICAgLyoqXG4gICAgICogU2lnbmFscyBkZWZpbmluZyB0aGUgcHJvY2VzcyBzdGF0ZS5cbiAgICAgKiBAbmFtZSBzaWduYWxcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBpbnN0YW5jZW9mIFByb2Nlc3NcbiAgICAgKi9cbiAgICB0aGlzLnNpZ25hbHMgPSB7fTtcbiAgICB0aGlzLnNpZ25hbHMuYWN0aXZlID0gbmV3IFNpZ25hbCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHRoZSBwcm9jZXNzLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5zaWduYWxzLmFjdGl2ZS5zZXQodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCB0aGUgcHJvY2Vzcy5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5zaWduYWxzLmFjdGl2ZS5zZXQoZmFsc2UpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByb2Nlc3M7XG4iXX0=
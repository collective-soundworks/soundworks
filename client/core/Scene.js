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

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */

var Scene = function (_Activity) {
  (0, _inherits3.default)(Scene, _Activity);

  function Scene(id, hasNetwork) {
    (0, _classCallCheck3.default)(this, Scene);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Scene).call(this, id, hasNetwork));

    _this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } /* else {
        this.hold(); // pause / resume
        } */
    });

    _this.signals.done = new _Signal2.default();
    _this.requiredSignals.add(_serviceManager2.default.signals.ready);
    return _this;
  }

  /**
   * Returns a service configured with the given options.
   * @param {String} id - The identifier of the service.
   * @param {Object} options - The options to configure the service.
   */


  (0, _createClass3.default)(Scene, [{
    key: 'require',
    value: function require(id, options) {
      return _serviceManager2.default.require(id, options);
    }

    /**
     * Add a signal to the required signals in order for the `Scene` instance
     * to start.
     * @param {Signal} signal - The signal that must be waited for.
     * @private
     */

  }, {
    key: 'waitFor',
    value: function waitFor(signal) {
      this.requiredSignals.add(signal);
    }

    /**
     * Mark the `Scene` as terminated. The call of this method is a
     * responsibility of the client code.
     * @private
     */

  }, {
    key: 'done',
    value: function done() {
      this.hide();
      this.signals.done.set(true);
    }
  }]);
  return Scene;
}(_Activity3.default);

exports.default = Scene;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNjZW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7OztJQU1NLEs7OztBQUNKLGlCQUFZLEVBQVosRUFBZ0IsVUFBaEIsRUFBNEI7QUFBQTs7QUFBQSwrR0FDcEIsRUFEb0IsRUFDaEIsVUFEZ0I7O0FBRzFCLFVBQUssZUFBTCxDQUFxQixXQUFyQixDQUFpQyxVQUFDLEtBQUQsRUFBVztBQUMxQyxVQUFJLEtBQUosRUFBVztBQUNULGNBQUssS0FBTDtBQUNBLGNBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNELE87OztBQUdGLEtBUEQ7O0FBVUEsVUFBSyxPQUFMLENBQWEsSUFBYixHQUFvQixzQkFBcEI7QUFDQSxVQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIseUJBQWUsT0FBZixDQUF1QixLQUFoRDtBQWQwQjtBQWUzQjs7Ozs7Ozs7Ozs7NEJBT08sRSxFQUFJLE8sRUFBUztBQUNuQixhQUFPLHlCQUFlLE9BQWYsQ0FBdUIsRUFBdkIsRUFBMkIsT0FBM0IsQ0FBUDtBQUNEOzs7Ozs7Ozs7Ozs0QkFRTyxNLEVBQVE7QUFDZCxXQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsTUFBekI7QUFDRDs7Ozs7Ozs7OzsyQkFPTTtBQUNMLFdBQUssSUFBTDtBQUNBLFdBQUssT0FBTCxDQUFhLElBQWIsQ0FBa0IsR0FBbEIsQ0FBc0IsSUFBdEI7QUFDRDs7Ozs7a0JBR1ksSyIsImZpbGUiOiJTY2VuZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuXG4vKipcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICovXG5jbGFzcyBTY2VuZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmspIHtcbiAgICBzdXBlcihpZCwgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICB9IC8qIGVsc2Uge1xuICAgICAgICB0aGlzLmhvbGQoKTsgLy8gcGF1c2UgLyByZXN1bWVcbiAgICAgIH0gKi9cbiAgICB9KTtcblxuXG4gICAgdGhpcy5zaWduYWxzLmRvbmUgPSBuZXcgU2lnbmFsKCk7XG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMucmVhZHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBzZXJ2aWNlIGNvbmZpZ3VyZWQgd2l0aCB0aGUgZ2l2ZW4gb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkZW50aWZpZXIgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBzaWduYWwgdG8gdGhlIHJlcXVpcmVkIHNpZ25hbHMgaW4gb3JkZXIgZm9yIHRoZSBgU2NlbmVgIGluc3RhbmNlXG4gICAqIHRvIHN0YXJ0LlxuICAgKiBAcGFyYW0ge1NpZ25hbH0gc2lnbmFsIC0gVGhlIHNpZ25hbCB0aGF0IG11c3QgYmUgd2FpdGVkIGZvci5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIHdhaXRGb3Ioc2lnbmFsKSB7XG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkKHNpZ25hbCk7XG4gIH1cblxuICAvKipcbiAgICogTWFyayB0aGUgYFNjZW5lYCBhcyB0ZXJtaW5hdGVkLiBUaGUgY2FsbCBvZiB0aGlzIG1ldGhvZCBpcyBhXG4gICAqIHJlc3BvbnNpYmlsaXR5IG9mIHRoZSBjbGllbnQgY29kZS5cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRvbmUoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy5zaWduYWxzLmRvbmUuc2V0KHRydWUpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjZW5lO1xuIl19
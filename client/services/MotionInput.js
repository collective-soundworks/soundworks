'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

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

var _motionInput = require('motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:motion-input';

/**
 * Wrapper for the motion-input module.
 *
 * @example
 * // in the experince constructor
 * this.motionInput = this.require(‘motioninput', {
 *   descriptors: [‘accelerationIncludingGravity']
 * });
 *
 * // in the experience start
 * if (this.motionInput.isAvailable(‘accelerationIncludingGravity')) {
 *   this.motionInput.addListener('accelerationIncludingGravity', (data) => {
 *     // digest motion data
 *   });
 * } else {
 *   // handle error
 * }
 */

var MotionInput = function (_Service) {
  (0, _inherits3.default)(MotionInput, _Service);

  function MotionInput() {
    (0, _classCallCheck3.default)(this, MotionInput);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MotionInput).call(this, SERVICE_ID, false));

    var defaults = {
      descriptors: []
    };

    // @todo - how to handle if only descriptors are invalid ?
    // showError: false,
    _this.configure(defaults);
    // @todo - should be handled directly inside the motionInput
    _this._descriptorsValidity = {};
    return _this;
  }

  // init() { /* nothing to do here... */ }

  /**
   * Override default configure to add descriptors from multiple calls.
   * @param {Object} options - The options to apply to the service.
   */


  (0, _createClass3.default)(MotionInput, [{
    key: 'configure',
    value: function configure(options) {
      if (this.options.descriptors) options.descriptors = this.options.descriptors.concat(options.descriptors);

      (0, _get3.default)((0, _getPrototypeOf2.default)(MotionInput.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(MotionInput.prototype), 'start', this).call(this);

      _motionInput2.default.init.apply(_motionInput2.default, (0, _toConsumableArray3.default)(this.options.descriptors)).then(function (modules) {
        _this2.options.descriptors.forEach(function (name, index) {
          _this2._descriptorsValidity[name] = modules[index].isValid;
        });

        _this2.ready();
      });
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(MotionInput.prototype), 'stop', this).call(this);
    }

    /**
     * Define if a given descriptor is available or not
     * @param {String} name - The descriptor name.
     * @returns {Boolean}
     */

  }, {
    key: 'isAvailable',
    value: function isAvailable(name) {
      return this._descriptorsValidity[name];
    }

    /**
     * Add a listener to a given descriptor.
     * @param {String} name - The descriptor name.
     * @param {Function} callback - The callback to register.
     */

  }, {
    key: 'addListener',
    value: function addListener(name, callback) {
      if (this._descriptorsValidity[name]) _motionInput2.default.addListener(name, callback);
    }

    /**
     * Remove a listener from a given descriptor.
     * @param {String} name - The descriptor name.
     * @param {Function} callback - The callback to remove.
     */

  }, {
    key: 'removeListener',
    value: function removeListener(name, callback) {
      if (this._descriptorsValidity[name]) _motionInput2.default.removeListener(name, callback);
    }
  }]);
  return MotionInput;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, MotionInput);

exports.default = MotionInput;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxzQkFBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJBOzs7QUFDSixXQURJLFdBQ0osR0FBYzt3Q0FEVixhQUNVOzs2RkFEVix3QkFFSSxZQUFZLFFBRE47O0FBR1osUUFBTSxXQUFXO0FBQ2YsbUJBQWEsRUFBYjtLQURJLENBSE07Ozs7QUFTWixVQUFLLFNBQUwsQ0FBZSxRQUFmOztBQVRZLFNBV1osQ0FBSyxvQkFBTCxHQUE0QixFQUE1QixDQVhZOztHQUFkOzs7Ozs7Ozs7OzZCQURJOzs4QkFxQk0sU0FBUztBQUNqQixVQUFJLEtBQUssT0FBTCxDQUFhLFdBQWIsRUFDRixRQUFRLFdBQVIsR0FBc0IsS0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixNQUF6QixDQUFnQyxRQUFRLFdBQVIsQ0FBdEQsQ0FERjs7QUFHQSx1REF6QkUsc0RBeUJjLFFBQWhCLENBSmlCOzs7Ozs7OzRCQVFYOzs7QUFDTix1REE5QkUsaURBOEJGLENBRE07O0FBR04sNEJBQ0csSUFESCwrREFDVyxLQUFLLE9BQUwsQ0FBYSxXQUFiLENBRFgsRUFFRyxJQUZILENBRVEsVUFBQyxPQUFELEVBQWE7QUFDakIsZUFBSyxPQUFMLENBQWEsV0FBYixDQUF5QixPQUF6QixDQUFpQyxVQUFDLElBQUQsRUFBTyxLQUFQLEVBQWlCO0FBQ2hELGlCQUFLLG9CQUFMLENBQTBCLElBQTFCLElBQWtDLFFBQVEsS0FBUixFQUFlLE9BQWYsQ0FEYztTQUFqQixDQUFqQyxDQURpQjs7QUFLakIsZUFBSyxLQUFMLEdBTGlCO09BQWIsQ0FGUixDQUhNOzs7Ozs7OzJCQWVEO0FBQ0wsdURBN0NFLGdEQTZDRixDQURLOzs7Ozs7Ozs7OztnQ0FTSyxNQUFNO0FBQ2hCLGFBQU8sS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUFQLENBRGdCOzs7Ozs7Ozs7OztnQ0FTTixNQUFNLFVBQVU7QUFDMUIsVUFBSSxLQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQUosRUFDRSxzQkFBWSxXQUFaLENBQXdCLElBQXhCLEVBQThCLFFBQTlCLEVBREY7Ozs7Ozs7Ozs7O21DQVNhLE1BQU0sVUFBVTtBQUM3QixVQUFJLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBSixFQUNFLHNCQUFZLGNBQVosQ0FBMkIsSUFBM0IsRUFBaUMsUUFBakMsRUFERjs7O1NBekVFOzs7QUE4RU4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxXQUFwQzs7a0JBRWUiLCJmaWxlIjoiTW90aW9uSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW90aW9uSW5wdXQgZnJvbSAnbW90aW9uLWlucHV0JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTptb3Rpb24taW5wdXQnO1xuXG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIG1vdGlvbi1pbnB1dCBtb2R1bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluIHRoZSBleHBlcmluY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubW90aW9uSW5wdXQgPSB0aGlzLnJlcXVpcmUo4oCYbW90aW9uaW5wdXQnLCB7XG4gKiAgIGRlc2NyaXB0b3JzOiBb4oCYYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSddXG4gKiB9KTtcbiAqXG4gKiAvLyBpbiB0aGUgZXhwZXJpZW5jZSBzdGFydFxuICogaWYgKHRoaXMubW90aW9uSW5wdXQuaXNBdmFpbGFibGUo4oCYYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpKSB7XG4gKiAgIHRoaXMubW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCAoZGF0YSkgPT4ge1xuICogICAgIC8vIGRpZ2VzdCBtb3Rpb24gZGF0YVxuICogICB9KTtcbiAqIH0gZWxzZSB7XG4gKiAgIC8vIGhhbmRsZSBlcnJvclxuICogfVxuICovXG5jbGFzcyBNb3Rpb25JbnB1dCBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRlc2NyaXB0b3JzOiBbXSxcbiAgICAgIC8vIEB0b2RvIC0gaG93IHRvIGhhbmRsZSBpZiBvbmx5IGRlc2NyaXB0b3JzIGFyZSBpbnZhbGlkID9cbiAgICAgIC8vIHNob3dFcnJvcjogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyBAdG9kbyAtIHNob3VsZCBiZSBoYW5kbGVkIGRpcmVjdGx5IGluc2lkZSB0aGUgbW90aW9uSW5wdXRcbiAgICB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5ID0ge31cbiAgfVxuXG4gIC8vIGluaXQoKSB7IC8qIG5vdGhpbmcgdG8gZG8gaGVyZS4uLiAqLyB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJlIHRvIGFkZCBkZXNjcmlwdG9ycyBmcm9tIG11bHRpcGxlIGNhbGxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzKVxuICAgICAgb3B0aW9ucy5kZXNjcmlwdG9ycyA9IHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycy5jb25jYXQob3B0aW9ucy5kZXNjcmlwdG9ycyk7XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIG1vdGlvbklucHV0XG4gICAgICAuaW5pdCguLi50aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMpXG4gICAgICAudGhlbigobW9kdWxlcykgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMuZm9yRWFjaCgobmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdID0gbW9kdWxlc1tpbmRleF0uaXNWYWxpZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGlmIGEgZ2l2ZW4gZGVzY3JpcHRvciBpcyBhdmFpbGFibGUgb3Igbm90XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIGRlc2NyaXB0b3IgbmFtZS5cbiAgICogQHJldHVybnMge0Jvb2xlYW59XG4gICAqL1xuICBpc0F2YWlsYWJsZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV07XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gYSBnaXZlbiBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBkZXNjcmlwdG9yIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlZ2lzdGVyLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSlcbiAgICAgIG1vdGlvbklucHV0LmFkZExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBmcm9tIGEgZ2l2ZW4gZGVzY3JpcHRvci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgZGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdKVxuICAgICAgbW90aW9uSW5wdXQucmVtb3ZlTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE1vdGlvbklucHV0KTtcblxuZXhwb3J0IGRlZmF1bHQgTW90aW9uSW5wdXQ7XG4iXX0=
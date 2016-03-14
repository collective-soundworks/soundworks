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

    // @todo - how to handle if only some descriptors are invalid ?
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxzQkFBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJBOzs7QUFDSixXQURJLFdBQ0osR0FBYzt3Q0FEVixhQUNVOzs2RkFEVix3QkFFSSxZQUFZLFFBRE47O0FBR1osUUFBTSxXQUFXO0FBQ2YsbUJBQWEsRUFBYjtLQURJLENBSE07Ozs7QUFTWixVQUFLLFNBQUwsQ0FBZSxRQUFmOztBQVRZLFNBV1osQ0FBSyxvQkFBTCxHQUE0QixFQUE1QixDQVhZOztHQUFkOzs7Ozs7Ozs7OzZCQURJOzs4QkFxQk0sU0FBUztBQUNqQixVQUFJLEtBQUssT0FBTCxDQUFhLFdBQWIsRUFDRixRQUFRLFdBQVIsR0FBc0IsS0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixNQUF6QixDQUFnQyxRQUFRLFdBQVIsQ0FBdEQsQ0FERjs7QUFHQSx1REF6QkUsc0RBeUJjLFFBQWhCLENBSmlCOzs7Ozs7OzRCQVFYOzs7QUFDTix1REE5QkUsaURBOEJGLENBRE07O0FBR04sNEJBQ0csSUFESCwrREFDVyxLQUFLLE9BQUwsQ0FBYSxXQUFiLENBRFgsRUFFRyxJQUZILENBRVEsVUFBQyxPQUFELEVBQWE7QUFDakIsZUFBSyxPQUFMLENBQWEsV0FBYixDQUF5QixPQUF6QixDQUFpQyxVQUFDLElBQUQsRUFBTyxLQUFQLEVBQWlCO0FBQ2hELGlCQUFLLG9CQUFMLENBQTBCLElBQTFCLElBQWtDLFFBQVEsS0FBUixFQUFlLE9BQWYsQ0FEYztTQUFqQixDQUFqQyxDQURpQjs7QUFLakIsZUFBSyxLQUFMLEdBTGlCO09BQWIsQ0FGUixDQUhNOzs7Ozs7OzJCQWVEO0FBQ0wsdURBN0NFLGdEQTZDRixDQURLOzs7Ozs7Ozs7OztnQ0FTSyxNQUFNO0FBQ2hCLGFBQU8sS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUFQLENBRGdCOzs7Ozs7Ozs7OztnQ0FTTixNQUFNLFVBQVU7QUFDMUIsVUFBSSxLQUFLLG9CQUFMLENBQTBCLElBQTFCLENBQUosRUFDRSxzQkFBWSxXQUFaLENBQXdCLElBQXhCLEVBQThCLFFBQTlCLEVBREY7Ozs7Ozs7Ozs7O21DQVNhLE1BQU0sVUFBVTtBQUM3QixVQUFJLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBSixFQUNFLHNCQUFZLGNBQVosQ0FBMkIsSUFBM0IsRUFBaUMsUUFBakMsRUFERjs7O1NBekVFOzs7QUE4RU4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxXQUFwQzs7a0JBRWUiLCJmaWxlIjoiTW90aW9uSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW90aW9uSW5wdXQgZnJvbSAnbW90aW9uLWlucHV0JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTptb3Rpb24taW5wdXQnO1xuXG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIG1vdGlvbi1pbnB1dCBtb2R1bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluIHRoZSBleHBlcmluY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubW90aW9uSW5wdXQgPSB0aGlzLnJlcXVpcmUo4oCYbW90aW9uaW5wdXQnLCB7XG4gKiAgIGRlc2NyaXB0b3JzOiBb4oCYYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSddXG4gKiB9KTtcbiAqXG4gKiAvLyBpbiB0aGUgZXhwZXJpZW5jZSBzdGFydFxuICogaWYgKHRoaXMubW90aW9uSW5wdXQuaXNBdmFpbGFibGUo4oCYYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpKSB7XG4gKiAgIHRoaXMubW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCAoZGF0YSkgPT4ge1xuICogICAgIC8vIGRpZ2VzdCBtb3Rpb24gZGF0YVxuICogICB9KTtcbiAqIH0gZWxzZSB7XG4gKiAgIC8vIGhhbmRsZSBlcnJvclxuICogfVxuICovXG5jbGFzcyBNb3Rpb25JbnB1dCBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRlc2NyaXB0b3JzOiBbXSxcbiAgICAgIC8vIEB0b2RvIC0gaG93IHRvIGhhbmRsZSBpZiBvbmx5IHNvbWUgZGVzY3JpcHRvcnMgYXJlIGludmFsaWQgP1xuICAgICAgLy8gc2hvd0Vycm9yOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIC8vIEB0b2RvIC0gc2hvdWxkIGJlIGhhbmRsZWQgZGlyZWN0bHkgaW5zaWRlIHRoZSBtb3Rpb25JbnB1dFxuICAgIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHkgPSB7fVxuICB9XG5cbiAgLy8gaW5pdCgpIHsgLyogbm90aGluZyB0byBkbyBoZXJlLi4uICovIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmUgdG8gYWRkIGRlc2NyaXB0b3JzIGZyb20gbXVsdGlwbGUgY2FsbHMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIHNlcnZpY2UuXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMpXG4gICAgICBvcHRpb25zLmRlc2NyaXB0b3JzID0gdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmNvbmNhdChvcHRpb25zLmRlc2NyaXB0b3JzKTtcblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgbW90aW9uSW5wdXRcbiAgICAgIC5pbml0KC4uLnRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycylcbiAgICAgIC50aGVuKChtb2R1bGVzKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycy5mb3JFYWNoKChuYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0gPSBtb2R1bGVzW2luZGV4XS5pc1ZhbGlkO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgaWYgYSBnaXZlbiBkZXNjcmlwdG9yIGlzIGF2YWlsYWJsZSBvciBub3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgZGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQXZhaWxhYmxlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBhIGdpdmVuIGRlc2NyaXB0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIGRlc2NyaXB0b3IgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXIuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdKVxuICAgICAgbW90aW9uSW5wdXQuYWRkTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gYSBnaXZlbiBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBkZXNjcmlwdG9yIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5yZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTW90aW9uSW5wdXQpO1xuXG5leHBvcnQgZGVmYXVsdCBNb3Rpb25JbnB1dDtcbiJdfQ==
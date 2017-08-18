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
 * Interface for the client `'motion-input'` service.
 *
 * This service provides a wrapper for the
 * [`motionInput`]{@link https://github.com/collective-soundworks/motion-input}
 * external module.
 *
 * @memberof module:soundworks/client
 * @example
 * // in the experince constructor
 * this.motionInput = this.require('motion-input', { descriptors: ['energy'] });
 * // when the experience has started
 * if (this.motionInput.isAvailable('energy')) {
 *   this.motionInput.addListener('energy', (data) => {
 *     // digest motion data
 *   });
 * } else {
 *   // handle error
 * }
 */

var MotionInput = function (_Service) {
  (0, _inherits3.default)(MotionInput, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function MotionInput() {
    (0, _classCallCheck3.default)(this, MotionInput);

    var _this = (0, _possibleConstructorReturn3.default)(this, (MotionInput.__proto__ || (0, _getPrototypeOf2.default)(MotionInput)).call(this, SERVICE_ID, false));

    var defaults = {
      descriptors: []
      // @todo - how to handle if only some descriptors are invalid ?
      // showError: false,
    };

    _this.configure(defaults);
    // @todo - should be handled directly inside the motionInput
    _this._descriptorsValidity = {};
    _this._descriptorsPeriod = {};
    return _this;
  }

  /**
   * Override default configure to add descriptors from multiple calls.
   * @private
   * @param {Object} options - The options to apply to the service.
   */


  (0, _createClass3.default)(MotionInput, [{
    key: 'configure',
    value: function configure(options) {
      if (this.options.descriptors) options.descriptors = this.options.descriptors.concat(options.descriptors);

      (0, _get3.default)(MotionInput.prototype.__proto__ || (0, _getPrototypeOf2.default)(MotionInput.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(MotionInput.prototype.__proto__ || (0, _getPrototypeOf2.default)(MotionInput.prototype), 'start', this).call(this);

      _motionInput2.default.init.apply(_motionInput2.default, (0, _toConsumableArray3.default)(this.options.descriptors)).then(function (modules) {
        _this2.options.descriptors.forEach(function (name, index) {
          _this2._descriptorsValidity[name] = modules[index].isValid;
          _this2._descriptorsPeriod[name] = modules[index].period;
        });

        _this2.ready();
      });
    }

    /** @private */

  }, {
    key: 'stop',
    value: function stop() {
      (0, _get3.default)(MotionInput.prototype.__proto__ || (0, _getPrototypeOf2.default)(MotionInput.prototype), 'stop', this).call(this);
    }

    /**
     * Define if a given descriptor is available or not
     * @param {String} name - Descriptor name.
     * @returns {Boolean} - Returns `true` if available, `false` otherwise.
     */

  }, {
    key: 'isAvailable',
    value: function isAvailable(name) {
      return this._descriptorsValidity[name];
    }

    /**
     * Returns the event period of a descriptor
     * @param {String} name - Descriptor name.
     * @returns {Number} - Event period (in seconds).
     */

  }, {
    key: 'getPeriod',
    value: function getPeriod(name) {
      return this._descriptorsPeriod[name];
    }

    /**
     * Add a listener to a given descriptor.
     * @param {String} name - Descriptor name.
     * @param {Function} callback - Callback to register.
     */

  }, {
    key: 'addListener',
    value: function addListener(name, callback) {
      if (this._descriptorsValidity[name]) _motionInput2.default.addListener(name, callback);
    }

    /**
     * Remove a listener of events triggered by a given descriptor.
     * @param {String} name - Descriptor name.
     * @param {Function} callback - Callback to remove.
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJNb3Rpb25JbnB1dCIsImRlZmF1bHRzIiwiZGVzY3JpcHRvcnMiLCJjb25maWd1cmUiLCJfZGVzY3JpcHRvcnNWYWxpZGl0eSIsIl9kZXNjcmlwdG9yc1BlcmlvZCIsIm9wdGlvbnMiLCJjb25jYXQiLCJpbml0IiwidGhlbiIsIm1vZHVsZXMiLCJmb3JFYWNoIiwibmFtZSIsImluZGV4IiwiaXNWYWxpZCIsInBlcmlvZCIsInJlYWR5IiwiY2FsbGJhY2siLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsc0JBQW5COztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQk1DLFc7OztBQUNKO0FBQ0EseUJBQWM7QUFBQTs7QUFBQSxnSkFDTkQsVUFETSxFQUNNLEtBRE47O0FBR1osUUFBTUUsV0FBVztBQUNmQyxtQkFBYTtBQUNiO0FBQ0E7QUFIZSxLQUFqQjs7QUFNQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7QUFDQTtBQUNBLFVBQUtHLG9CQUFMLEdBQTRCLEVBQTVCO0FBQ0EsVUFBS0Msa0JBQUwsR0FBMEIsRUFBMUI7QUFaWTtBQWFiOztBQUVEOzs7Ozs7Ozs7OEJBS1VDLE8sRUFBUztBQUNqQixVQUFJLEtBQUtBLE9BQUwsQ0FBYUosV0FBakIsRUFDRUksUUFBUUosV0FBUixHQUFzQixLQUFLSSxPQUFMLENBQWFKLFdBQWIsQ0FBeUJLLE1BQXpCLENBQWdDRCxRQUFRSixXQUF4QyxDQUF0Qjs7QUFFRixnSkFBZ0JJLE9BQWhCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFBQTs7QUFDTjs7QUFFQSw0QkFDR0UsSUFESCwrREFDVyxLQUFLRixPQUFMLENBQWFKLFdBRHhCLEdBRUdPLElBRkgsQ0FFUSxVQUFDQyxPQUFELEVBQWE7QUFDakIsZUFBS0osT0FBTCxDQUFhSixXQUFiLENBQXlCUyxPQUF6QixDQUFpQyxVQUFDQyxJQUFELEVBQU9DLEtBQVAsRUFBaUI7QUFDaEQsaUJBQUtULG9CQUFMLENBQTBCUSxJQUExQixJQUFrQ0YsUUFBUUcsS0FBUixFQUFlQyxPQUFqRDtBQUNBLGlCQUFLVCxrQkFBTCxDQUF3Qk8sSUFBeEIsSUFBZ0NGLFFBQVFHLEtBQVIsRUFBZUUsTUFBL0M7QUFDRCxTQUhEOztBQUtBLGVBQUtDLEtBQUw7QUFDRCxPQVRIO0FBVUQ7O0FBRUQ7Ozs7MkJBQ087QUFDTDtBQUNEOztBQUVEOzs7Ozs7OztnQ0FLWUosSSxFQUFNO0FBQ2hCLGFBQU8sS0FBS1Isb0JBQUwsQ0FBMEJRLElBQTFCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7OEJBS1VBLEksRUFBTTtBQUNkLGFBQU8sS0FBS1Asa0JBQUwsQ0FBd0JPLElBQXhCLENBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7Z0NBS1lBLEksRUFBTUssUSxFQUFVO0FBQzFCLFVBQUksS0FBS2Isb0JBQUwsQ0FBMEJRLElBQTFCLENBQUosRUFDRSxzQkFBWU0sV0FBWixDQUF3Qk4sSUFBeEIsRUFBOEJLLFFBQTlCO0FBQ0g7O0FBRUQ7Ozs7Ozs7O21DQUtlTCxJLEVBQU1LLFEsRUFBVTtBQUM3QixVQUFJLEtBQUtiLG9CQUFMLENBQTBCUSxJQUExQixDQUFKLEVBQ0Usc0JBQVlPLGNBQVosQ0FBMkJQLElBQTNCLEVBQWlDSyxRQUFqQztBQUNIOzs7OztBQUdILHlCQUFlRyxRQUFmLENBQXdCckIsVUFBeEIsRUFBb0NDLFdBQXBDOztrQkFFZUEsVyIsImZpbGUiOiJNb3Rpb25JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm1vdGlvbi1pbnB1dCc7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdtb3Rpb24taW5wdXQnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhIHdyYXBwZXIgZm9yIHRoZVxuICogW2Btb3Rpb25JbnB1dGBde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3MvbW90aW9uLWlucHV0fVxuICogZXh0ZXJuYWwgbW9kdWxlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbiB0aGUgZXhwZXJpbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLm1vdGlvbklucHV0ID0gdGhpcy5yZXF1aXJlKCdtb3Rpb24taW5wdXQnLCB7IGRlc2NyaXB0b3JzOiBbJ2VuZXJneSddIH0pO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogaWYgKHRoaXMubW90aW9uSW5wdXQuaXNBdmFpbGFibGUoJ2VuZXJneScpKSB7XG4gKiAgIHRoaXMubW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2VuZXJneScsIChkYXRhKSA9PiB7XG4gKiAgICAgLy8gZGlnZXN0IG1vdGlvbiBkYXRhXG4gKiAgIH0pO1xuICogfSBlbHNlIHtcbiAqICAgLy8gaGFuZGxlIGVycm9yXG4gKiB9XG4gKi9cbmNsYXNzIE1vdGlvbklucHV0IGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBkZXNjcmlwdG9yczogW10sXG4gICAgICAvLyBAdG9kbyAtIGhvdyB0byBoYW5kbGUgaWYgb25seSBzb21lIGRlc2NyaXB0b3JzIGFyZSBpbnZhbGlkID9cbiAgICAgIC8vIHNob3dFcnJvcjogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyBAdG9kbyAtIHNob3VsZCBiZSBoYW5kbGVkIGRpcmVjdGx5IGluc2lkZSB0aGUgbW90aW9uSW5wdXRcbiAgICB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5ID0ge307XG4gICAgdGhpcy5fZGVzY3JpcHRvcnNQZXJpb2QgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyZSB0byBhZGQgZGVzY3JpcHRvcnMgZnJvbSBtdWx0aXBsZSBjYWxscy5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBhcHBseSB0byB0aGUgc2VydmljZS5cbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycylcbiAgICAgIG9wdGlvbnMuZGVzY3JpcHRvcnMgPSB0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMuY29uY2F0KG9wdGlvbnMuZGVzY3JpcHRvcnMpO1xuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBtb3Rpb25JbnB1dFxuICAgICAgLmluaXQoLi4udGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzKVxuICAgICAgLnRoZW4oKG1vZHVsZXMpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSA9IG1vZHVsZXNbaW5kZXhdLmlzVmFsaWQ7XG4gICAgICAgICAgdGhpcy5fZGVzY3JpcHRvcnNQZXJpb2RbbmFtZV0gPSBtb2R1bGVzW2luZGV4XS5wZXJpb2Q7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSBpZiBhIGdpdmVuIGRlc2NyaXB0b3IgaXMgYXZhaWxhYmxlIG9yIG5vdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIERlc2NyaXB0b3IgbmFtZS5cbiAgICogQHJldHVybnMge0Jvb2xlYW59IC0gUmV0dXJucyBgdHJ1ZWAgaWYgYXZhaWxhYmxlLCBgZmFsc2VgIG90aGVyd2lzZS5cbiAgICovXG4gIGlzQXZhaWxhYmxlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBldmVudCBwZXJpb2Qgb2YgYSBkZXNjcmlwdG9yXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gRGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcmV0dXJucyB7TnVtYmVyfSAtIEV2ZW50IHBlcmlvZCAoaW4gc2Vjb25kcykuXG4gICAqL1xuICBnZXRQZXJpb2QobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdG9yc1BlcmlvZFtuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBhIGdpdmVuIGRlc2NyaXB0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gRGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIHJlZ2lzdGVyLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSlcbiAgICAgIG1vdGlvbklucHV0LmFkZExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBsaXN0ZW5lciBvZiBldmVudHMgdHJpZ2dlcmVkIGJ5IGEgZ2l2ZW4gZGVzY3JpcHRvci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBEZXNjcmlwdG9yIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSlcbiAgICAgIG1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBNb3Rpb25JbnB1dCk7XG5cbmV4cG9ydCBkZWZhdWx0IE1vdGlvbklucHV0O1xuIl19
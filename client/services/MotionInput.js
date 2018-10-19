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

var _motionInput = require('@ircam/motion-input');

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
      }).catch(function (err) {
        return console.error(err.stack);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJNb3Rpb25JbnB1dCIsImRlZmF1bHRzIiwiZGVzY3JpcHRvcnMiLCJjb25maWd1cmUiLCJfZGVzY3JpcHRvcnNWYWxpZGl0eSIsIl9kZXNjcmlwdG9yc1BlcmlvZCIsIm9wdGlvbnMiLCJjb25jYXQiLCJtb3Rpb25JbnB1dCIsImluaXQiLCJ0aGVuIiwibW9kdWxlcyIsImZvckVhY2giLCJuYW1lIiwiaW5kZXgiLCJpc1ZhbGlkIiwicGVyaW9kIiwicmVhZHkiLCJjYXRjaCIsImVyciIsImNvbnNvbGUiLCJlcnJvciIsInN0YWNrIiwiY2FsbGJhY2siLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwiU2VydmljZSIsInNlcnZpY2VNYW5hZ2VyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsc0JBQW5COztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQk1DLFc7OztBQUNKO0FBQ0EseUJBQWM7QUFBQTs7QUFBQSxnSkFDTkQsVUFETSxFQUNNLEtBRE47O0FBR1osUUFBTUUsV0FBVztBQUNmQyxtQkFBYTtBQUNiO0FBQ0E7QUFIZSxLQUFqQjs7QUFNQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7QUFDQTtBQUNBLFVBQUtHLG9CQUFMLEdBQTRCLEVBQTVCO0FBQ0EsVUFBS0Msa0JBQUwsR0FBMEIsRUFBMUI7QUFaWTtBQWFiOztBQUVEOzs7Ozs7Ozs7OEJBS1VDLE8sRUFBUztBQUNqQixVQUFJLEtBQUtBLE9BQUwsQ0FBYUosV0FBakIsRUFDRUksUUFBUUosV0FBUixHQUFzQixLQUFLSSxPQUFMLENBQWFKLFdBQWIsQ0FBeUJLLE1BQXpCLENBQWdDRCxRQUFRSixXQUF4QyxDQUF0Qjs7QUFFRixnSkFBZ0JJLE9BQWhCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFBQTs7QUFDTjs7QUFFQUUsNEJBQ0dDLElBREgsK0RBQ1csS0FBS0gsT0FBTCxDQUFhSixXQUR4QixHQUVHUSxJQUZILENBRVEsVUFBQ0MsT0FBRCxFQUFhO0FBQ2pCLGVBQUtMLE9BQUwsQ0FBYUosV0FBYixDQUF5QlUsT0FBekIsQ0FBaUMsVUFBQ0MsSUFBRCxFQUFPQyxLQUFQLEVBQWlCO0FBQ2hELGlCQUFLVixvQkFBTCxDQUEwQlMsSUFBMUIsSUFBa0NGLFFBQVFHLEtBQVIsRUFBZUMsT0FBakQ7QUFDQSxpQkFBS1Ysa0JBQUwsQ0FBd0JRLElBQXhCLElBQWdDRixRQUFRRyxLQUFSLEVBQWVFLE1BQS9DO0FBQ0QsU0FIRDs7QUFLQSxlQUFLQyxLQUFMO0FBQ0QsT0FUSCxFQVVHQyxLQVZILENBVVMsVUFBQ0MsR0FBRDtBQUFBLGVBQVNDLFFBQVFDLEtBQVIsQ0FBY0YsSUFBSUcsS0FBbEIsQ0FBVDtBQUFBLE9BVlQ7QUFXRDs7QUFFRDs7OzsyQkFDTztBQUNMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2dDQUtZVCxJLEVBQU07QUFDaEIsYUFBTyxLQUFLVCxvQkFBTCxDQUEwQlMsSUFBMUIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs4QkFLVUEsSSxFQUFNO0FBQ2QsYUFBTyxLQUFLUixrQkFBTCxDQUF3QlEsSUFBeEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7OztnQ0FLWUEsSSxFQUFNVSxRLEVBQVU7QUFDMUIsVUFBSSxLQUFLbkIsb0JBQUwsQ0FBMEJTLElBQTFCLENBQUosRUFDRUwsc0JBQVlnQixXQUFaLENBQXdCWCxJQUF4QixFQUE4QlUsUUFBOUI7QUFDSDs7QUFFRDs7Ozs7Ozs7bUNBS2VWLEksRUFBTVUsUSxFQUFVO0FBQzdCLFVBQUksS0FBS25CLG9CQUFMLENBQTBCUyxJQUExQixDQUFKLEVBQ0VMLHNCQUFZaUIsY0FBWixDQUEyQlosSUFBM0IsRUFBaUNVLFFBQWpDO0FBQ0g7OztFQXZGdUJHLGlCOztBQTBGMUJDLHlCQUFlQyxRQUFmLENBQXdCN0IsVUFBeEIsRUFBb0NDLFdBQXBDOztrQkFFZUEsVyIsImZpbGUiOiJNb3Rpb25JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdAaXJjYW0vbW90aW9uLWlucHV0JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTptb3Rpb24taW5wdXQnO1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnbW90aW9uLWlucHV0J2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgcHJvdmlkZXMgYSB3cmFwcGVyIGZvciB0aGVcbiAqIFtgbW90aW9uSW5wdXRgXXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL21vdGlvbi1pbnB1dH1cbiAqIGV4dGVybmFsIG1vZHVsZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW4gdGhlIGV4cGVyaW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5tb3Rpb25JbnB1dCA9IHRoaXMucmVxdWlyZSgnbW90aW9uLWlucHV0JywgeyBkZXNjcmlwdG9yczogWydlbmVyZ3knXSB9KTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGlmICh0aGlzLm1vdGlvbklucHV0LmlzQXZhaWxhYmxlKCdlbmVyZ3knKSkge1xuICogICB0aGlzLm1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdlbmVyZ3knLCAoZGF0YSkgPT4ge1xuICogICAgIC8vIGRpZ2VzdCBtb3Rpb24gZGF0YVxuICogICB9KTtcbiAqIH0gZWxzZSB7XG4gKiAgIC8vIGhhbmRsZSBlcnJvclxuICogfVxuICovXG5jbGFzcyBNb3Rpb25JbnB1dCBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGVzY3JpcHRvcnM6IFtdLFxuICAgICAgLy8gQHRvZG8gLSBob3cgdG8gaGFuZGxlIGlmIG9ubHkgc29tZSBkZXNjcmlwdG9ycyBhcmUgaW52YWxpZCA/XG4gICAgICAvLyBzaG93RXJyb3I6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgLy8gQHRvZG8gLSBzaG91bGQgYmUgaGFuZGxlZCBkaXJlY3RseSBpbnNpZGUgdGhlIG1vdGlvbklucHV0XG4gICAgdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eSA9IHt9O1xuICAgIHRoaXMuX2Rlc2NyaXB0b3JzUGVyaW9kID0ge307XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmUgdG8gYWRkIGRlc2NyaXB0b3JzIGZyb20gbXVsdGlwbGUgY2FsbHMuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIHNlcnZpY2UuXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMpXG4gICAgICBvcHRpb25zLmRlc2NyaXB0b3JzID0gdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmNvbmNhdChvcHRpb25zLmRlc2NyaXB0b3JzKTtcblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgbW90aW9uSW5wdXRcbiAgICAgIC5pbml0KC4uLnRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycylcbiAgICAgIC50aGVuKChtb2R1bGVzKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycy5mb3JFYWNoKChuYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0gPSBtb2R1bGVzW2luZGV4XS5pc1ZhbGlkO1xuICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JzUGVyaW9kW25hbWVdID0gbW9kdWxlc1tpbmRleF0ucGVyaW9kO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGlmIGEgZ2l2ZW4gZGVzY3JpcHRvciBpcyBhdmFpbGFibGUgb3Igbm90XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gRGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSBSZXR1cm5zIGB0cnVlYCBpZiBhdmFpbGFibGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBdmFpbGFibGUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGV2ZW50IHBlcmlvZCBvZiBhIGRlc2NyaXB0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBEZXNjcmlwdG9yIG5hbWUuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gRXZlbnQgcGVyaW9kIChpbiBzZWNvbmRzKS5cbiAgICovXG4gIGdldFBlcmlvZChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0b3JzUGVyaW9kW25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGEgZ2l2ZW4gZGVzY3JpcHRvci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBEZXNjcmlwdG9yIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gcmVnaXN0ZXIuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdKVxuICAgICAgbW90aW9uSW5wdXQuYWRkTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIG9mIGV2ZW50cyB0cmlnZ2VyZWQgYnkgYSBnaXZlbiBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIERlc2NyaXB0b3IgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdKVxuICAgICAgbW90aW9uSW5wdXQucmVtb3ZlTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE1vdGlvbklucHV0KTtcblxuZXhwb3J0IGRlZmF1bHQgTW90aW9uSW5wdXQ7XG4iXX0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJNb3Rpb25JbnB1dCIsImRlZmF1bHRzIiwiZGVzY3JpcHRvcnMiLCJjb25maWd1cmUiLCJfZGVzY3JpcHRvcnNWYWxpZGl0eSIsIl9kZXNjcmlwdG9yc1BlcmlvZCIsIm9wdGlvbnMiLCJjb25jYXQiLCJpbml0IiwidGhlbiIsIm1vZHVsZXMiLCJmb3JFYWNoIiwibmFtZSIsImluZGV4IiwiaXNWYWxpZCIsInBlcmlvZCIsInJlYWR5IiwiY2FsbGJhY2siLCJhZGRMaXN0ZW5lciIsInJlbW92ZUxpc3RlbmVyIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLGFBQWEsc0JBQW5COztBQUdBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFvQk1DLFc7OztBQUNKO0FBQ0EseUJBQWM7QUFBQTs7QUFBQSxnSkFDTkQsVUFETSxFQUNNLEtBRE47O0FBR1osUUFBTUUsV0FBVztBQUNmQyxtQkFBYTtBQURFLEtBQWpCOztBQU1BLFVBQUtDLFNBQUwsQ0FBZUYsUUFBZjtBQUNBO0FBQ0EsVUFBS0csb0JBQUwsR0FBNEIsRUFBNUI7QUFDQSxVQUFLQyxrQkFBTCxHQUEwQixFQUExQjtBQVpZO0FBYWI7O0FBRUQ7Ozs7Ozs7Ozs4QkFLVUMsTyxFQUFTO0FBQ2pCLFVBQUksS0FBS0EsT0FBTCxDQUFhSixXQUFqQixFQUNFSSxRQUFRSixXQUFSLEdBQXNCLEtBQUtJLE9BQUwsQ0FBYUosV0FBYixDQUF5QkssTUFBekIsQ0FBZ0NELFFBQVFKLFdBQXhDLENBQXRCOztBQUVGLGdKQUFnQkksT0FBaEI7QUFDRDs7QUFFRDs7Ozs0QkFDUTtBQUFBOztBQUNOOztBQUVBLDRCQUNHRSxJQURILCtEQUNXLEtBQUtGLE9BQUwsQ0FBYUosV0FEeEIsR0FFR08sSUFGSCxDQUVRLFVBQUNDLE9BQUQsRUFBYTtBQUNqQixlQUFLSixPQUFMLENBQWFKLFdBQWIsQ0FBeUJTLE9BQXpCLENBQWlDLFVBQUNDLElBQUQsRUFBT0MsS0FBUCxFQUFpQjtBQUNoRCxpQkFBS1Qsb0JBQUwsQ0FBMEJRLElBQTFCLElBQWtDRixRQUFRRyxLQUFSLEVBQWVDLE9BQWpEO0FBQ0EsaUJBQUtULGtCQUFMLENBQXdCTyxJQUF4QixJQUFnQ0YsUUFBUUcsS0FBUixFQUFlRSxNQUEvQztBQUNELFNBSEQ7O0FBS0EsZUFBS0MsS0FBTDtBQUNELE9BVEg7QUFVRDs7QUFFRDs7OzsyQkFDTztBQUNMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2dDQUtZSixJLEVBQU07QUFDaEIsYUFBTyxLQUFLUixvQkFBTCxDQUEwQlEsSUFBMUIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs4QkFLVUEsSSxFQUFNO0FBQ2QsYUFBTyxLQUFLUCxrQkFBTCxDQUF3Qk8sSUFBeEIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7OztnQ0FLWUEsSSxFQUFNSyxRLEVBQVU7QUFDMUIsVUFBSSxLQUFLYixvQkFBTCxDQUEwQlEsSUFBMUIsQ0FBSixFQUNFLHNCQUFZTSxXQUFaLENBQXdCTixJQUF4QixFQUE4QkssUUFBOUI7QUFDSDs7QUFFRDs7Ozs7Ozs7bUNBS2VMLEksRUFBTUssUSxFQUFVO0FBQzdCLFVBQUksS0FBS2Isb0JBQUwsQ0FBMEJRLElBQTFCLENBQUosRUFDRSxzQkFBWU8sY0FBWixDQUEyQlAsSUFBM0IsRUFBaUNLLFFBQWpDO0FBQ0g7Ozs7O0FBR0gseUJBQWVHLFFBQWYsQ0FBd0JyQixVQUF4QixFQUFvQ0MsV0FBcEM7O2tCQUVlQSxXIiwiZmlsZSI6Ik1vdGlvbklucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ21vdGlvbi1pbnB1dCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bW90aW9uLWlucHV0JztcblxuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ21vdGlvbi1pbnB1dCdgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIHByb3ZpZGVzIGEgd3JhcHBlciBmb3IgdGhlXG4gKiBbYG1vdGlvbklucHV0YF17QGxpbmsgaHR0cHM6Ly9naXRodWIuY29tL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9tb3Rpb24taW5wdXR9XG4gKiBleHRlcm5hbCBtb2R1bGUuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluIHRoZSBleHBlcmluY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubW90aW9uSW5wdXQgPSB0aGlzLnJlcXVpcmUoJ21vdGlvbi1pbnB1dCcsIHsgZGVzY3JpcHRvcnM6IFsnZW5lcmd5J10gfSk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBpZiAodGhpcy5tb3Rpb25JbnB1dC5pc0F2YWlsYWJsZSgnZW5lcmd5JykpIHtcbiAqICAgdGhpcy5tb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignZW5lcmd5JywgKGRhdGEpID0+IHtcbiAqICAgICAvLyBkaWdlc3QgbW90aW9uIGRhdGFcbiAqICAgfSk7XG4gKiB9IGVsc2Uge1xuICogICAvLyBoYW5kbGUgZXJyb3JcbiAqIH1cbiAqL1xuY2xhc3MgTW90aW9uSW5wdXQgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRlc2NyaXB0b3JzOiBbXSxcbiAgICAgIC8vIEB0b2RvIC0gaG93IHRvIGhhbmRsZSBpZiBvbmx5IHNvbWUgZGVzY3JpcHRvcnMgYXJlIGludmFsaWQgP1xuICAgICAgLy8gc2hvd0Vycm9yOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIC8vIEB0b2RvIC0gc2hvdWxkIGJlIGhhbmRsZWQgZGlyZWN0bHkgaW5zaWRlIHRoZSBtb3Rpb25JbnB1dFxuICAgIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHkgPSB7fTtcbiAgICB0aGlzLl9kZXNjcmlwdG9yc1BlcmlvZCA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJlIHRvIGFkZCBkZXNjcmlwdG9ycyBmcm9tIG11bHRpcGxlIGNhbGxzLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzKVxuICAgICAgb3B0aW9ucy5kZXNjcmlwdG9ycyA9IHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycy5jb25jYXQob3B0aW9ucy5kZXNjcmlwdG9ycyk7XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIG1vdGlvbklucHV0XG4gICAgICAuaW5pdCguLi50aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMpXG4gICAgICAudGhlbigobW9kdWxlcykgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMuZm9yRWFjaCgobmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdID0gbW9kdWxlc1tpbmRleF0uaXNWYWxpZDtcbiAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yc1BlcmlvZFtuYW1lXSA9IG1vZHVsZXNbaW5kZXhdLnBlcmlvZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZWFkeSgpO1xuICAgICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RvcCgpIHtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGlmIGEgZ2l2ZW4gZGVzY3JpcHRvciBpcyBhdmFpbGFibGUgb3Igbm90XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gRGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSBSZXR1cm5zIGB0cnVlYCBpZiBhdmFpbGFibGUsIGBmYWxzZWAgb3RoZXJ3aXNlLlxuICAgKi9cbiAgaXNBdmFpbGFibGUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGV2ZW50IHBlcmlvZCBvZiBhIGRlc2NyaXB0b3JcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBEZXNjcmlwdG9yIG5hbWUuXG4gICAqIEByZXR1cm5zIHtOdW1iZXJ9IC0gRXZlbnQgcGVyaW9kIChpbiBzZWNvbmRzKS5cbiAgICovXG4gIGdldFBlcmlvZChuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0b3JzUGVyaW9kW25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGEgZ2l2ZW4gZGVzY3JpcHRvci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBEZXNjcmlwdG9yIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gQ2FsbGJhY2sgdG8gcmVnaXN0ZXIuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdKVxuICAgICAgbW90aW9uSW5wdXQuYWRkTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIG9mIGV2ZW50cyB0cmlnZ2VyZWQgYnkgYSBnaXZlbiBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIERlc2NyaXB0b3IgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byByZW1vdmUuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdKVxuICAgICAgbW90aW9uSW5wdXQucmVtb3ZlTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE1vdGlvbklucHV0KTtcblxuZXhwb3J0IGRlZmF1bHQgTW90aW9uSW5wdXQ7XG4iXX0=
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

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(MotionInput).call(this, SERVICE_ID, false));

    var defaults = {
      descriptors: []
    };

    // @todo - how to handle if only some descriptors are invalid ?
    // showError: false,
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
          _this2._descriptorsPeriod[name] = modules[index].period;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU0sYUFBYSxzQkFBbkI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJNLFc7Ozs7O0FBRUoseUJBQWM7QUFBQTs7QUFBQSxxSEFDTixVQURNLEVBQ00sS0FETjs7QUFHWixRQUFNLFdBQVc7QUFDZixtQkFBYTtBQURFLEtBQWpCOzs7O0FBTUEsVUFBSyxTQUFMLENBQWUsUUFBZjs7QUFFQSxVQUFLLG9CQUFMLEdBQTRCLEVBQTVCO0FBQ0EsVUFBSyxrQkFBTCxHQUEwQixFQUExQjtBQVpZO0FBYWI7Ozs7Ozs7Ozs7OzhCQU9TLE8sRUFBUztBQUNqQixVQUFJLEtBQUssT0FBTCxDQUFhLFdBQWpCLEVBQ0UsUUFBUSxXQUFSLEdBQXNCLEtBQUssT0FBTCxDQUFhLFdBQWIsQ0FBeUIsTUFBekIsQ0FBZ0MsUUFBUSxXQUF4QyxDQUF0Qjs7QUFFRiw2R0FBZ0IsT0FBaEI7QUFDRDs7Ozs7OzRCQUdPO0FBQUE7O0FBQ047O0FBRUEsNEJBQ0csSUFESCwrREFDVyxLQUFLLE9BQUwsQ0FBYSxXQUR4QixHQUVHLElBRkgsQ0FFUSxVQUFDLE9BQUQsRUFBYTtBQUNqQixlQUFLLE9BQUwsQ0FBYSxXQUFiLENBQXlCLE9BQXpCLENBQWlDLFVBQUMsSUFBRCxFQUFPLEtBQVAsRUFBaUI7QUFDaEQsaUJBQUssb0JBQUwsQ0FBMEIsSUFBMUIsSUFBa0MsUUFBUSxLQUFSLEVBQWUsT0FBakQ7QUFDQSxpQkFBSyxrQkFBTCxDQUF3QixJQUF4QixJQUFnQyxRQUFRLEtBQVIsRUFBZSxNQUEvQztBQUNELFNBSEQ7O0FBS0EsZUFBSyxLQUFMO0FBQ0QsT0FUSDtBQVVEOzs7Ozs7MkJBR007QUFDTDtBQUNEOzs7Ozs7Ozs7O2dDQU9XLEksRUFBTTtBQUNoQixhQUFPLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBUDtBQUNEOzs7Ozs7Ozs7OzhCQU9TLEksRUFBTTtBQUNkLGFBQU8sS0FBSyxrQkFBTCxDQUF3QixJQUF4QixDQUFQO0FBQ0Q7Ozs7Ozs7Ozs7Z0NBT1csSSxFQUFNLFEsRUFBVTtBQUMxQixVQUFJLEtBQUssb0JBQUwsQ0FBMEIsSUFBMUIsQ0FBSixFQUNFLHNCQUFZLFdBQVosQ0FBd0IsSUFBeEIsRUFBOEIsUUFBOUI7QUFDSDs7Ozs7Ozs7OzttQ0FPYyxJLEVBQU0sUSxFQUFVO0FBQzdCLFVBQUksS0FBSyxvQkFBTCxDQUEwQixJQUExQixDQUFKLEVBQ0Usc0JBQVksY0FBWixDQUEyQixJQUEzQixFQUFpQyxRQUFqQztBQUNIOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsV0FBcEM7O2tCQUVlLFciLCJmaWxlIjoiTW90aW9uSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW90aW9uSW5wdXQgZnJvbSAnbW90aW9uLWlucHV0JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTptb3Rpb24taW5wdXQnO1xuXG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnbW90aW9uLWlucHV0J2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgcHJvdmlkZXMgYSB3cmFwcGVyIGZvciB0aGVcbiAqIFtgbW90aW9uSW5wdXRgXXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vY29sbGVjdGl2ZS1zb3VuZHdvcmtzL21vdGlvbi1pbnB1dH1cbiAqIGV4dGVybmFsIG1vZHVsZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW4gdGhlIGV4cGVyaW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5tb3Rpb25JbnB1dCA9IHRoaXMucmVxdWlyZSgnbW90aW9uLWlucHV0JywgeyBkZXNjcmlwdG9yczogWydlbmVyZ3knXSB9KTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWRcbiAqIGlmICh0aGlzLm1vdGlvbklucHV0LmlzQXZhaWxhYmxlKCdlbmVyZ3knKSkge1xuICogICB0aGlzLm1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdlbmVyZ3knLCAoZGF0YSkgPT4ge1xuICogICAgIC8vIGRpZ2VzdCBtb3Rpb24gZGF0YVxuICogICB9KTtcbiAqIH0gZWxzZSB7XG4gKiAgIC8vIGhhbmRsZSBlcnJvclxuICogfVxuICovXG5jbGFzcyBNb3Rpb25JbnB1dCBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGVzY3JpcHRvcnM6IFtdLFxuICAgICAgLy8gQHRvZG8gLSBob3cgdG8gaGFuZGxlIGlmIG9ubHkgc29tZSBkZXNjcmlwdG9ycyBhcmUgaW52YWxpZCA/XG4gICAgICAvLyBzaG93RXJyb3I6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgLy8gQHRvZG8gLSBzaG91bGQgYmUgaGFuZGxlZCBkaXJlY3RseSBpbnNpZGUgdGhlIG1vdGlvbklucHV0XG4gICAgdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eSA9IHt9O1xuICAgIHRoaXMuX2Rlc2NyaXB0b3JzUGVyaW9kID0ge307XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmUgdG8gYWRkIGRlc2NyaXB0b3JzIGZyb20gbXVsdGlwbGUgY2FsbHMuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIHNlcnZpY2UuXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMpXG4gICAgICBvcHRpb25zLmRlc2NyaXB0b3JzID0gdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmNvbmNhdChvcHRpb25zLmRlc2NyaXB0b3JzKTtcblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgbW90aW9uSW5wdXRcbiAgICAgIC5pbml0KC4uLnRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycylcbiAgICAgIC50aGVuKChtb2R1bGVzKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycy5mb3JFYWNoKChuYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0gPSBtb2R1bGVzW2luZGV4XS5pc1ZhbGlkO1xuICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JzUGVyaW9kW25hbWVdID0gbW9kdWxlc1tpbmRleF0ucGVyaW9kO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgaWYgYSBnaXZlbiBkZXNjcmlwdG9yIGlzIGF2YWlsYWJsZSBvciBub3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBEZXNjcmlwdG9yIG5hbWUuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSAtIFJldHVybnMgYHRydWVgIGlmIGF2YWlsYWJsZSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqL1xuICBpc0F2YWlsYWJsZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXZlbnQgcGVyaW9kIG9mIGEgZGVzY3JpcHRvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIERlc2NyaXB0b3IgbmFtZS5cbiAgICogQHJldHVybnMge051bWJlcn0gLSBFdmVudCBwZXJpb2QgKGluIHNlY29uZHMpLlxuICAgKi9cbiAgZ2V0UGVyaW9kKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRvcnNQZXJpb2RbbmFtZV07XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gYSBnaXZlbiBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIERlc2NyaXB0b3IgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byByZWdpc3Rlci5cbiAgICovXG4gIGFkZExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgb2YgZXZlbnRzIHRyaWdnZXJlZCBieSBhIGdpdmVuIGRlc2NyaXB0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gRGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5yZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTW90aW9uSW5wdXQpO1xuXG5leHBvcnQgZGVmYXVsdCBNb3Rpb25JbnB1dDtcbiJdfQ==
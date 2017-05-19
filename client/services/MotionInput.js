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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk1vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbIlNFUlZJQ0VfSUQiLCJNb3Rpb25JbnB1dCIsImRlZmF1bHRzIiwiZGVzY3JpcHRvcnMiLCJjb25maWd1cmUiLCJfZGVzY3JpcHRvcnNWYWxpZGl0eSIsIl9kZXNjcmlwdG9yc1BlcmlvZCIsIm9wdGlvbnMiLCJjb25jYXQiLCJpbml0IiwidGhlbiIsIm1vZHVsZXMiLCJmb3JFYWNoIiwibmFtZSIsImluZGV4IiwiaXNWYWxpZCIsInBlcmlvZCIsInJlYWR5IiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsImNhbGxiYWNrIiwiYWRkTGlzdGVuZXIiLCJyZW1vdmVMaXN0ZW5lciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxhQUFhLHNCQUFuQjs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBb0JNQyxXOzs7QUFDSjtBQUNBLHlCQUFjO0FBQUE7O0FBQUEsZ0pBQ05ELFVBRE0sRUFDTSxLQUROOztBQUdaLFFBQU1FLFdBQVc7QUFDZkMsbUJBQWE7QUFERSxLQUFqQjs7QUFNQSxVQUFLQyxTQUFMLENBQWVGLFFBQWY7QUFDQTtBQUNBLFVBQUtHLG9CQUFMLEdBQTRCLEVBQTVCO0FBQ0EsVUFBS0Msa0JBQUwsR0FBMEIsRUFBMUI7QUFaWTtBQWFiOztBQUVEOzs7Ozs7Ozs7OEJBS1VDLE8sRUFBUztBQUNqQixVQUFJLEtBQUtBLE9BQUwsQ0FBYUosV0FBakIsRUFDRUksUUFBUUosV0FBUixHQUFzQixLQUFLSSxPQUFMLENBQWFKLFdBQWIsQ0FBeUJLLE1BQXpCLENBQWdDRCxRQUFRSixXQUF4QyxDQUF0Qjs7QUFFRixnSkFBZ0JJLE9BQWhCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFBQTs7QUFDTjs7QUFFQSw0QkFDR0UsSUFESCwrREFDVyxLQUFLRixPQUFMLENBQWFKLFdBRHhCLEdBRUdPLElBRkgsQ0FFUSxVQUFDQyxPQUFELEVBQWE7QUFDakIsZUFBS0osT0FBTCxDQUFhSixXQUFiLENBQXlCUyxPQUF6QixDQUFpQyxVQUFDQyxJQUFELEVBQU9DLEtBQVAsRUFBaUI7QUFDaEQsaUJBQUtULG9CQUFMLENBQTBCUSxJQUExQixJQUFrQ0YsUUFBUUcsS0FBUixFQUFlQyxPQUFqRDtBQUNBLGlCQUFLVCxrQkFBTCxDQUF3Qk8sSUFBeEIsSUFBZ0NGLFFBQVFHLEtBQVIsRUFBZUUsTUFBL0M7QUFDRCxTQUhEOztBQUtBLGVBQUtDLEtBQUw7QUFDRCxPQVRILEVBVUdDLEtBVkgsQ0FVUyxVQUFDQyxHQUFEO0FBQUEsZUFBU0MsUUFBUUMsS0FBUixDQUFjRixJQUFJRyxLQUFsQixDQUFUO0FBQUEsT0FWVDtBQVdEOztBQUVEOzs7OzJCQUNPO0FBQ0w7QUFDRDs7QUFFRDs7Ozs7Ozs7Z0NBS1lULEksRUFBTTtBQUNoQixhQUFPLEtBQUtSLG9CQUFMLENBQTBCUSxJQUExQixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzhCQUtVQSxJLEVBQU07QUFDZCxhQUFPLEtBQUtQLGtCQUFMLENBQXdCTyxJQUF4QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O2dDQUtZQSxJLEVBQU1VLFEsRUFBVTtBQUMxQixVQUFJLEtBQUtsQixvQkFBTCxDQUEwQlEsSUFBMUIsQ0FBSixFQUNFLHNCQUFZVyxXQUFaLENBQXdCWCxJQUF4QixFQUE4QlUsUUFBOUI7QUFDSDs7QUFFRDs7Ozs7Ozs7bUNBS2VWLEksRUFBTVUsUSxFQUFVO0FBQzdCLFVBQUksS0FBS2xCLG9CQUFMLENBQTBCUSxJQUExQixDQUFKLEVBQ0Usc0JBQVlZLGNBQVosQ0FBMkJaLElBQTNCLEVBQWlDVSxRQUFqQztBQUNIOzs7OztBQUdILHlCQUFlRyxRQUFmLENBQXdCMUIsVUFBeEIsRUFBb0NDLFdBQXBDOztrQkFFZUEsVyIsImZpbGUiOiJNb3Rpb25JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm1vdGlvbi1pbnB1dCc7XG5cblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCdtb3Rpb24taW5wdXQnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhIHdyYXBwZXIgZm9yIHRoZVxuICogW2Btb3Rpb25JbnB1dGBde0BsaW5rIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2xsZWN0aXZlLXNvdW5kd29ya3MvbW90aW9uLWlucHV0fVxuICogZXh0ZXJuYWwgbW9kdWxlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbiB0aGUgZXhwZXJpbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLm1vdGlvbklucHV0ID0gdGhpcy5yZXF1aXJlKCdtb3Rpb24taW5wdXQnLCB7IGRlc2NyaXB0b3JzOiBbJ2VuZXJneSddIH0pO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZFxuICogaWYgKHRoaXMubW90aW9uSW5wdXQuaXNBdmFpbGFibGUoJ2VuZXJneScpKSB7XG4gKiAgIHRoaXMubW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2VuZXJneScsIChkYXRhKSA9PiB7XG4gKiAgICAgLy8gZGlnZXN0IG1vdGlvbiBkYXRhXG4gKiAgIH0pO1xuICogfSBlbHNlIHtcbiAqICAgLy8gaGFuZGxlIGVycm9yXG4gKiB9XG4gKi9cbmNsYXNzIE1vdGlvbklucHV0IGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBkZXNjcmlwdG9yczogW10sXG4gICAgICAvLyBAdG9kbyAtIGhvdyB0byBoYW5kbGUgaWYgb25seSBzb21lIGRlc2NyaXB0b3JzIGFyZSBpbnZhbGlkID9cbiAgICAgIC8vIHNob3dFcnJvcjogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyBAdG9kbyAtIHNob3VsZCBiZSBoYW5kbGVkIGRpcmVjdGx5IGluc2lkZSB0aGUgbW90aW9uSW5wdXRcbiAgICB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5ID0ge307XG4gICAgdGhpcy5fZGVzY3JpcHRvcnNQZXJpb2QgPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyZSB0byBhZGQgZGVzY3JpcHRvcnMgZnJvbSBtdWx0aXBsZSBjYWxscy5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBhcHBseSB0byB0aGUgc2VydmljZS5cbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycylcbiAgICAgIG9wdGlvbnMuZGVzY3JpcHRvcnMgPSB0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMuY29uY2F0KG9wdGlvbnMuZGVzY3JpcHRvcnMpO1xuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBtb3Rpb25JbnB1dFxuICAgICAgLmluaXQoLi4udGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzKVxuICAgICAgLnRoZW4oKG1vZHVsZXMpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSA9IG1vZHVsZXNbaW5kZXhdLmlzVmFsaWQ7XG4gICAgICAgICAgdGhpcy5fZGVzY3JpcHRvcnNQZXJpb2RbbmFtZV0gPSBtb2R1bGVzW2luZGV4XS5wZXJpb2Q7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgaWYgYSBnaXZlbiBkZXNjcmlwdG9yIGlzIGF2YWlsYWJsZSBvciBub3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBEZXNjcmlwdG9yIG5hbWUuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSAtIFJldHVybnMgYHRydWVgIGlmIGF2YWlsYWJsZSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gICAqL1xuICBpc0F2YWlsYWJsZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgZXZlbnQgcGVyaW9kIG9mIGEgZGVzY3JpcHRvclxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIERlc2NyaXB0b3IgbmFtZS5cbiAgICogQHJldHVybnMge051bWJlcn0gLSBFdmVudCBwZXJpb2QgKGluIHNlY29uZHMpLlxuICAgKi9cbiAgZ2V0UGVyaW9kKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRvcnNQZXJpb2RbbmFtZV07XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgbGlzdGVuZXIgdG8gYSBnaXZlbiBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIERlc2NyaXB0b3IgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBDYWxsYmFjayB0byByZWdpc3Rlci5cbiAgICovXG4gIGFkZExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgb2YgZXZlbnRzIHRyaWdnZXJlZCBieSBhIGdpdmVuIGRlc2NyaXB0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gRGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIENhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5yZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTW90aW9uSW5wdXQpO1xuXG5leHBvcnQgZGVmYXVsdCBNb3Rpb25JbnB1dDtcbiJdfQ==
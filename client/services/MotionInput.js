'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _motionInput = require('motion-input');

var _motionInput2 = _interopRequireDefault(_motionInput);

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

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

var MotionInput = (function (_Service) {
  _inherits(MotionInput, _Service);

  function MotionInput() {
    _classCallCheck(this, MotionInput);

    _get(Object.getPrototypeOf(MotionInput.prototype), 'constructor', this).call(this, SERVICE_ID, false);

    var defaults = {
      descriptors: []
    };

    // @todo - how to handle if only descriptors are invalid ?
    // showError: false,
    this.configure(defaults);
    // @todo - should be handled directly inside the motionInput
    this._descriptorsValidity = {};
  }

  // init() { /* nothing to do here... */ }

  /**
   * Override default configure to add descriptors from multiple calls.
   * @param {Object} options - The options to apply to the service.
   */

  _createClass(MotionInput, [{
    key: 'configure',
    value: function configure(options) {
      if (this.options.descriptors) options.descriptors = this.options.descriptors.concat(options.descriptors);

      _get(Object.getPrototypeOf(MotionInput.prototype), 'configure', this).call(this, options);
    }

    /** @private */
  }, {
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(MotionInput.prototype), 'start', this).call(this);

      _motionInput2['default'].init.apply(_motionInput2['default'], _toConsumableArray(this.options.descriptors)).then(function (modules) {
        _this.options.descriptors.forEach(function (name, index) {
          _this._descriptorsValidity[name] = modules[index].isValid;
        });

        _this.ready();
      });
    }

    /** @private */
  }, {
    key: 'stop',
    value: function stop() {
      _get(Object.getPrototypeOf(MotionInput.prototype), 'stop', this).call(this);
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
      if (this._descriptorsValidity[name]) _motionInput2['default'].addListener(name, callback);
    }

    /**
     * Remove a listener from a given descriptor.
     * @param {String} name - The descriptor name.
     * @param {Function} callback - The callback to remove.
     */
  }, {
    key: 'removeListener',
    value: function removeListener(name, callback) {
      if (this._descriptorsValidity[name]) _motionInput2['default'].removeListener(name, callback);
    }
  }]);

  return MotionInput;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, MotionInput);

exports['default'] = MotionInput;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL01vdGlvbklucHV0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBd0IsY0FBYzs7OzsyQkFDbEIsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7OztBQUVuRCxJQUFNLFVBQVUsR0FBRyxzQkFBc0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJwQyxXQUFXO1lBQVgsV0FBVzs7QUFDSixXQURQLFdBQVcsR0FDRDswQkFEVixXQUFXOztBQUViLCtCQUZFLFdBQVcsNkNBRVAsVUFBVSxFQUFFLEtBQUssRUFBRTs7QUFFekIsUUFBTSxRQUFRLEdBQUc7QUFDZixpQkFBVyxFQUFFLEVBQUU7S0FHaEIsQ0FBQzs7OztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUE7R0FDL0I7Ozs7Ozs7OztlQWJHLFdBQVc7O1dBcUJOLG1CQUFDLE9BQU8sRUFBRTtBQUNqQixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUMxQixPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTdFLGlDQXpCRSxXQUFXLDJDQXlCRyxPQUFPLEVBQUU7S0FDMUI7Ozs7O1dBR0ksaUJBQUc7OztBQUNOLGlDQTlCRSxXQUFXLHVDQThCQzs7QUFFZCwrQkFDRyxJQUFJLE1BQUEsOENBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUMsQ0FDakMsSUFBSSxDQUFDLFVBQUMsT0FBTyxFQUFLO0FBQ2pCLGNBQUssT0FBTyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLO0FBQ2hELGdCQUFLLG9CQUFvQixDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7U0FDMUQsQ0FBQyxDQUFDOztBQUVILGNBQUssS0FBSyxFQUFFLENBQUM7T0FDZCxDQUFDLENBQUM7S0FDTjs7Ozs7V0FHRyxnQkFBRztBQUNMLGlDQTdDRSxXQUFXLHNDQTZDQTtLQUNkOzs7Ozs7Ozs7V0FPVSxxQkFBQyxJQUFJLEVBQUU7QUFDaEIsYUFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEM7Ozs7Ozs7OztXQU9VLHFCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDMUIsVUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQ2pDLHlCQUFZLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDM0M7Ozs7Ozs7OztXQU9hLHdCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQ2pDLHlCQUFZLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDOUM7OztTQTNFRyxXQUFXOzs7QUE4RWpCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7O3FCQUVsQyxXQUFXIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL01vdGlvbklucHV0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IG1vdGlvbklucHV0IGZyb20gJ21vdGlvbi1pbnB1dCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bW90aW9uLWlucHV0JztcblxuXG4vKipcbiAqIFdyYXBwZXIgZm9yIHRoZSBtb3Rpb24taW5wdXQgbW9kdWxlLlxuICpcbiAqIEBleGFtcGxlXG4gKiAvLyBpbiB0aGUgZXhwZXJpbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLm1vdGlvbklucHV0ID0gdGhpcy5yZXF1aXJlKOKAmG1vdGlvbmlucHV0Jywge1xuICogICBkZXNjcmlwdG9yczogW+KAmGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknXVxuICogfSk7XG4gKlxuICogLy8gaW4gdGhlIGV4cGVyaWVuY2Ugc3RhcnRcbiAqIGlmICh0aGlzLm1vdGlvbklucHV0LmlzQXZhaWxhYmxlKOKAmGFjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknKSkge1xuICogICB0aGlzLm1vdGlvbklucHV0LmFkZExpc3RlbmVyKCdhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JywgKGRhdGEpID0+IHtcbiAqICAgICAvLyBkaWdlc3QgbW90aW9uIGRhdGFcbiAqICAgfSk7XG4gKiB9IGVsc2Uge1xuICogICAvLyBoYW5kbGUgZXJyb3JcbiAqIH1cbiAqL1xuY2xhc3MgTW90aW9uSW5wdXQgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgZmFsc2UpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBkZXNjcmlwdG9yczogW10sXG4gICAgICAvLyBAdG9kbyAtIGhvdyB0byBoYW5kbGUgaWYgb25seSBkZXNjcmlwdG9ycyBhcmUgaW52YWxpZCA/XG4gICAgICAvLyBzaG93RXJyb3I6IGZhbHNlLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgLy8gQHRvZG8gLSBzaG91bGQgYmUgaGFuZGxlZCBkaXJlY3RseSBpbnNpZGUgdGhlIG1vdGlvbklucHV0XG4gICAgdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eSA9IHt9XG4gIH1cblxuICAvLyBpbml0KCkgeyAvKiBub3RoaW5nIHRvIGRvIGhlcmUuLi4gKi8gfVxuXG4gIC8qKlxuICAgKiBPdmVycmlkZSBkZWZhdWx0IGNvbmZpZ3VyZSB0byBhZGQgZGVzY3JpcHRvcnMgZnJvbSBtdWx0aXBsZSBjYWxscy5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBhcHBseSB0byB0aGUgc2VydmljZS5cbiAgICovXG4gIGNvbmZpZ3VyZShvcHRpb25zKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycylcbiAgICAgIG9wdGlvbnMuZGVzY3JpcHRvcnMgPSB0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMuY29uY2F0KG9wdGlvbnMuZGVzY3JpcHRvcnMpO1xuXG4gICAgc3VwZXIuY29uZmlndXJlKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBtb3Rpb25JbnB1dFxuICAgICAgLmluaXQoLi4udGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzKVxuICAgICAgLnRoZW4oKG1vZHVsZXMpID0+IHtcbiAgICAgICAgdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmZvckVhY2goKG5hbWUsIGluZGV4KSA9PiB7XG4gICAgICAgICAgdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSA9IG1vZHVsZXNbaW5kZXhdLmlzVmFsaWQ7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0b3AoKSB7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZSBpZiBhIGdpdmVuIGRlc2NyaXB0b3IgaXMgYXZhaWxhYmxlIG9yIG5vdFxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBkZXNjcmlwdG9yIG5hbWUuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufVxuICAgKi9cbiAgaXNBdmFpbGFibGUobmFtZSkge1xuICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGxpc3RlbmVyIHRvIGEgZ2l2ZW4gZGVzY3JpcHRvci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgZGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byByZWdpc3Rlci5cbiAgICovXG4gIGFkZExpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgbGlzdGVuZXIgZnJvbSBhIGdpdmVuIGRlc2NyaXB0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIGRlc2NyaXB0b3IgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spIHtcbiAgICBpZiAodGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXSlcbiAgICAgIG1vdGlvbklucHV0LnJlbW92ZUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBNb3Rpb25JbnB1dCk7XG5cbmV4cG9ydCBkZWZhdWx0IE1vdGlvbklucHV0O1xuIl19
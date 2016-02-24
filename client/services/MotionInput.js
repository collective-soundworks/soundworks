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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvTW90aW9uSW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQUF3QixjQUFjOzs7OzJCQUNsQixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O0FBRW5ELElBQU0sVUFBVSxHQUFHLHNCQUFzQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQnBDLFdBQVc7WUFBWCxXQUFXOztBQUNKLFdBRFAsV0FBVyxHQUNEOzBCQURWLFdBQVc7O0FBRWIsK0JBRkUsV0FBVyw2Q0FFUCxVQUFVLEVBQUUsS0FBSyxFQUFFOztBQUV6QixRQUFNLFFBQVEsR0FBRztBQUNmLGlCQUFXLEVBQUUsRUFBRTtLQUdoQixDQUFDOzs7O0FBRUYsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQTtHQUMvQjs7Ozs7Ozs7O2VBYkcsV0FBVzs7V0FxQk4sbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQzFCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFN0UsaUNBekJFLFdBQVcsMkNBeUJHLE9BQU8sRUFBRTtLQUMxQjs7Ozs7V0FHSSxpQkFBRzs7O0FBQ04saUNBOUJFLFdBQVcsdUNBOEJDOztBQUVkLCtCQUNHLElBQUksTUFBQSw4Q0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBQyxDQUNqQyxJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDakIsY0FBSyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDaEQsZ0JBQUssb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUMxRCxDQUFDLENBQUM7O0FBRUgsY0FBSyxLQUFLLEVBQUUsQ0FBQztPQUNkLENBQUMsQ0FBQztLQUNOOzs7OztXQUdHLGdCQUFHO0FBQ0wsaUNBN0NFLFdBQVcsc0NBNkNBO0tBQ2Q7Ozs7Ozs7OztXQU9VLHFCQUFDLElBQUksRUFBRTtBQUNoQixhQUFPLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7Ozs7Ozs7O1dBT1UscUJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUMxQixVQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFDakMseUJBQVksV0FBVyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMzQzs7Ozs7Ozs7O1dBT2Esd0JBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtBQUM3QixVQUFJLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsRUFDakMseUJBQVksY0FBYyxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztLQUM5Qzs7O1NBM0VHLFdBQVc7OztBQThFakIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQzs7cUJBRWxDLFdBQVciLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9zZXJ2aWNlcy9Nb3Rpb25JbnB1dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb3Rpb25JbnB1dCBmcm9tICdtb3Rpb24taW5wdXQnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm1vdGlvbi1pbnB1dCc7XG5cblxuLyoqXG4gKiBXcmFwcGVyIGZvciB0aGUgbW90aW9uLWlucHV0IG1vZHVsZS5cbiAqXG4gKiBAZXhhbXBsZVxuICogLy8gaW4gdGhlIGV4cGVyaW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5tb3Rpb25JbnB1dCA9IHRoaXMucmVxdWlyZSjigJhtb3Rpb25pbnB1dCcsIHtcbiAqICAgZGVzY3JpcHRvcnM6IFvigJhhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5J11cbiAqIH0pO1xuICpcbiAqIC8vIGluIHRoZSBleHBlcmllbmNlIHN0YXJ0XG4gKiBpZiAodGhpcy5tb3Rpb25JbnB1dC5pc0F2YWlsYWJsZSjigJhhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5JykpIHtcbiAqICAgdGhpcy5tb3Rpb25JbnB1dC5hZGRMaXN0ZW5lcignYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScsIChkYXRhKSA9PiB7XG4gKiAgICAgLy8gZGlnZXN0IG1vdGlvbiBkYXRhXG4gKiAgIH0pO1xuICogfSBlbHNlIHtcbiAqICAgLy8gaGFuZGxlIGVycm9yXG4gKiB9XG4gKi9cbmNsYXNzIE1vdGlvbklucHV0IGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIGZhbHNlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGVzY3JpcHRvcnM6IFtdLFxuICAgICAgLy8gQHRvZG8gLSBob3cgdG8gaGFuZGxlIGlmIG9ubHkgZGVzY3JpcHRvcnMgYXJlIGludmFsaWQgP1xuICAgICAgLy8gc2hvd0Vycm9yOiBmYWxzZSxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIC8vIEB0b2RvIC0gc2hvdWxkIGJlIGhhbmRsZWQgZGlyZWN0bHkgaW5zaWRlIHRoZSBtb3Rpb25JbnB1dFxuICAgIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHkgPSB7fVxuICB9XG5cbiAgLy8gaW5pdCgpIHsgLyogbm90aGluZyB0byBkbyBoZXJlLi4uICovIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGUgZGVmYXVsdCBjb25maWd1cmUgdG8gYWRkIGRlc2NyaXB0b3JzIGZyb20gbXVsdGlwbGUgY2FsbHMuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gYXBwbHkgdG8gdGhlIHNlcnZpY2UuXG4gICAqL1xuICBjb25maWd1cmUob3B0aW9ucykge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMpXG4gICAgICBvcHRpb25zLmRlc2NyaXB0b3JzID0gdGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzLmNvbmNhdChvcHRpb25zLmRlc2NyaXB0b3JzKTtcblxuICAgIHN1cGVyLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgbW90aW9uSW5wdXRcbiAgICAgIC5pbml0KC4uLnRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycylcbiAgICAgIC50aGVuKChtb2R1bGVzKSA9PiB7XG4gICAgICAgIHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycy5mb3JFYWNoKChuYW1lLCBpbmRleCkgPT4ge1xuICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0gPSBtb2R1bGVzW2luZGV4XS5pc1ZhbGlkO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgaWYgYSBnaXZlbiBkZXNjcmlwdG9yIGlzIGF2YWlsYWJsZSBvciBub3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgZGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQXZhaWxhYmxlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBhIGdpdmVuIGRlc2NyaXB0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIGRlc2NyaXB0b3IgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXIuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdKVxuICAgICAgbW90aW9uSW5wdXQuYWRkTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gYSBnaXZlbiBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBkZXNjcmlwdG9yIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5yZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTW90aW9uSW5wdXQpO1xuXG5leHBvcnQgZGVmYXVsdCBNb3Rpb25JbnB1dDtcbiJdfQ==
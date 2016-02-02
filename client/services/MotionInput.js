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

        // @tbd - maybe handle errors here...
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvTW90aW9uSW5wdXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQUF3QixjQUFjOzs7OzJCQUNsQixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O0FBRW5ELElBQU0sVUFBVSxHQUFHLHNCQUFzQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQnBDLFdBQVc7WUFBWCxXQUFXOztBQUNKLFdBRFAsV0FBVyxHQUNEOzBCQURWLFdBQVc7O0FBRWIsK0JBRkUsV0FBVyw2Q0FFUCxVQUFVLEVBQUUsS0FBSyxFQUFFOztBQUV6QixRQUFNLFFBQVEsR0FBRztBQUNmLGlCQUFXLEVBQUUsRUFBRTtLQUdoQixDQUFDOzs7O0FBRUYsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLG9CQUFvQixHQUFHLEVBQUUsQ0FBQTtHQUMvQjs7Ozs7Ozs7O2VBYkcsV0FBVzs7V0FxQk4sbUJBQUMsT0FBTyxFQUFFO0FBQ2pCLFVBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQzFCLE9BQU8sQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFN0UsaUNBekJFLFdBQVcsMkNBeUJHLE9BQU8sRUFBRTtLQUMxQjs7Ozs7V0FHSSxpQkFBRzs7O0FBQ04saUNBOUJFLFdBQVcsdUNBOEJDOztBQUVkLCtCQUNHLElBQUksTUFBQSw4Q0FBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBQyxDQUNqQyxJQUFJLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDakIsY0FBSyxPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFDLElBQUksRUFBRSxLQUFLLEVBQUs7QUFDaEQsZ0JBQUssb0JBQW9CLENBQUMsSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztTQUMxRCxDQUFDLENBQUM7OztBQUdILGNBQUssS0FBSyxFQUFFLENBQUM7T0FDZCxDQUFDLENBQUM7S0FDTjs7Ozs7V0FHRyxnQkFBRztBQUNMLGlDQTlDRSxXQUFXLHNDQThDQTtLQUNkOzs7Ozs7Ozs7V0FPVSxxQkFBQyxJQUFJLEVBQUU7QUFDaEIsYUFBTyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEM7Ozs7Ozs7OztXQU9VLHFCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDMUIsVUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQ2pDLHlCQUFZLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDM0M7Ozs7Ozs7OztXQU9hLHdCQUFDLElBQUksRUFBRSxRQUFRLEVBQUU7QUFDN0IsVUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLEVBQ2pDLHlCQUFZLGNBQWMsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDOUM7OztTQTVFRyxXQUFXOzs7QUErRWpCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7O3FCQUVsQyxXQUFXIiwiZmlsZSI6InNyYy9jbGllbnQvc2VydmljZXMvTW90aW9uSW5wdXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW90aW9uSW5wdXQgZnJvbSAnbW90aW9uLWlucHV0JztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTptb3Rpb24taW5wdXQnO1xuXG5cbi8qKlxuICogV3JhcHBlciBmb3IgdGhlIG1vdGlvbi1pbnB1dCBtb2R1bGUuXG4gKlxuICogQGV4YW1wbGVcbiAqIC8vIGluIHRoZSBleHBlcmluY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubW90aW9uSW5wdXQgPSB0aGlzLnJlcXVpcmUo4oCYbW90aW9uaW5wdXQnLCB7XG4gKiAgIGRlc2NyaXB0b3JzOiBb4oCYYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSddXG4gKiB9KTtcbiAqXG4gKiAvLyBpbiB0aGUgZXhwZXJpZW5jZSBzdGFydFxuICogaWYgKHRoaXMubW90aW9uSW5wdXQuaXNBdmFpbGFibGUo4oCYYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eScpKSB7XG4gKiAgIHRoaXMubW90aW9uSW5wdXQuYWRkTGlzdGVuZXIoJ2FjY2VsZXJhdGlvbkluY2x1ZGluZ0dyYXZpdHknLCAoZGF0YSkgPT4ge1xuICogICAgIC8vIGRpZ2VzdCBtb3Rpb24gZGF0YVxuICogICB9KTtcbiAqIH0gZWxzZSB7XG4gKiAgIC8vIGhhbmRsZSBlcnJvclxuICogfVxuICovXG5jbGFzcyBNb3Rpb25JbnB1dCBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCBmYWxzZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRlc2NyaXB0b3JzOiBbXSxcbiAgICAgIC8vIEB0b2RvIC0gaG93IHRvIGhhbmRsZSBpZiBvbmx5IGRlc2NyaXB0b3JzIGFyZSBpbnZhbGlkID9cbiAgICAgIC8vIHNob3dFcnJvcjogZmFsc2UsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICAvLyBAdG9kbyAtIHNob3VsZCBiZSBoYW5kbGVkIGRpcmVjdGx5IGluc2lkZSB0aGUgbW90aW9uSW5wdXRcbiAgICB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5ID0ge31cbiAgfVxuXG4gIC8vIGluaXQoKSB7IC8qIG5vdGhpbmcgdG8gZG8gaGVyZS4uLiAqLyB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlIGRlZmF1bHQgY29uZmlndXJlIHRvIGFkZCBkZXNjcmlwdG9ycyBmcm9tIG11bHRpcGxlIGNhbGxzLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGFwcGx5IHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmRlc2NyaXB0b3JzKVxuICAgICAgb3B0aW9ucy5kZXNjcmlwdG9ycyA9IHRoaXMub3B0aW9ucy5kZXNjcmlwdG9ycy5jb25jYXQob3B0aW9ucy5kZXNjcmlwdG9ycyk7XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIG1vdGlvbklucHV0XG4gICAgICAuaW5pdCguLi50aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMpXG4gICAgICAudGhlbigobW9kdWxlcykgPT4ge1xuICAgICAgICB0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcnMuZm9yRWFjaCgobmFtZSwgaW5kZXgpID0+IHtcbiAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdID0gbW9kdWxlc1tpbmRleF0uaXNWYWxpZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gQHRiZCAtIG1heWJlIGhhbmRsZSBlcnJvcnMgaGVyZS4uLlxuICAgICAgICB0aGlzLnJlYWR5KCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdG9wKCkge1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgaWYgYSBnaXZlbiBkZXNjcmlwdG9yIGlzIGF2YWlsYWJsZSBvciBub3RcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBUaGUgZGVzY3JpcHRvciBuYW1lLlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQXZhaWxhYmxlKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVzY3JpcHRvcnNWYWxpZGl0eVtuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSBsaXN0ZW5lciB0byBhIGdpdmVuIGRlc2NyaXB0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gVGhlIGRlc2NyaXB0b3IgbmFtZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gcmVnaXN0ZXIuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihuYW1lLCBjYWxsYmFjaykge1xuICAgIGlmICh0aGlzLl9kZXNjcmlwdG9yc1ZhbGlkaXR5W25hbWVdKVxuICAgICAgbW90aW9uSW5wdXQuYWRkTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGxpc3RlbmVyIGZyb20gYSBnaXZlbiBkZXNjcmlwdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFRoZSBkZXNjcmlwdG9yIG5hbWUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JzVmFsaWRpdHlbbmFtZV0pXG4gICAgICBtb3Rpb25JbnB1dC5yZW1vdmVMaXN0ZW5lcihuYW1lLCBjYWxsYmFjayk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTW90aW9uSW5wdXQpO1xuXG5leHBvcnQgZGVmYXVsdCBNb3Rpb25JbnB1dDtcbiJdfQ==
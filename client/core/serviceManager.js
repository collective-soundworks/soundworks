'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:serviceManager');

var _instances = {};
var _ctors = {};

/**
 * Factory and initialisation manager for the services.
 * Lazy instanciate an instance of the given type and retrieve it on each call.
 */
var serviceManager = {
  /**
   * Initialize the manager.
   */
  init: function init() {
    var _this = this;

    log('init');
    this._requiredSignals = new _SignalAll2.default();
    this._requiredSignals.addObserver(function () {
      return _this.ready();
    });

    this.signals = {};
    this.signals.start = new _Signal2.default();
    this.signals.ready = new _Signal2.default();
  },


  /**
   * Sends the signal required by all services to start.
   */
  start: function start() {
    log('start');
    this.signals.start.set(true);

    if (!this._requiredSignals.length) this.ready();
  },


  /**
   * Mark the services as ready. This signal is observed by {@link Experience}
   * instances and trigger their `start`.
   */
  ready: function ready() {
    log('ready');
    this.signals.ready.set(true);
  },


  // reset() {
  //   this.signals.start.set(false);
  //   this.signals.ready.set(false);
  // },

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} id - The id of the service.
   * @param {Object} options - Options to pass to the service constructor.
   */
  require: function require(id) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    id = 'service:' + id;

    if (!_ctors[id]) throw new Error('Service "' + id + '" does not exists');

    var instance = _instances[id];

    if (!instance) {
      instance = new _ctors[id]();
      // add the instance ready signal as required for the manager
      this._requiredSignals.add(instance.signals.ready);
      // store instance
      _instances[id] = instance;
    }

    instance.configure(options);
    return instance;
  },


  /**
   * Register a service with a given id.
   * @param {String} id - The id of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register: function register(id, ctor) {
    _ctors[id] = ctor;
  }
};

exports.default = serviceManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImxvZyIsIl9pbnN0YW5jZXMiLCJfY3RvcnMiLCJzZXJ2aWNlTWFuYWdlciIsImluaXQiLCJfcmVxdWlyZWRTaWduYWxzIiwiYWRkT2JzZXJ2ZXIiLCJyZWFkeSIsInNpZ25hbHMiLCJzdGFydCIsInNldCIsImxlbmd0aCIsInJlcXVpcmUiLCJpZCIsIm9wdGlvbnMiLCJFcnJvciIsImluc3RhbmNlIiwiYWRkIiwiY29uZmlndXJlIiwicmVnaXN0ZXIiLCJjdG9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxxQkFBTSwyQkFBTixDQUFaOztBQUVBLElBQU1DLGFBQWEsRUFBbkI7QUFDQSxJQUFNQyxTQUFTLEVBQWY7O0FBRUE7Ozs7QUFJQSxJQUFNQyxpQkFBaUI7QUFDckI7OztBQUdBQyxNQUpxQixrQkFJZDtBQUFBOztBQUNMSixRQUFJLE1BQUo7QUFDQSxTQUFLSyxnQkFBTCxHQUF3Qix5QkFBeEI7QUFDQSxTQUFLQSxnQkFBTCxDQUFzQkMsV0FBdEIsQ0FBa0M7QUFBQSxhQUFNLE1BQUtDLEtBQUwsRUFBTjtBQUFBLEtBQWxDOztBQUVBLFNBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBS0EsT0FBTCxDQUFhQyxLQUFiLEdBQXFCLHNCQUFyQjtBQUNBLFNBQUtELE9BQUwsQ0FBYUQsS0FBYixHQUFxQixzQkFBckI7QUFDRCxHQVpvQjs7O0FBY3JCOzs7QUFHQUUsT0FqQnFCLG1CQWlCYjtBQUNOVCxRQUFJLE9BQUo7QUFDQSxTQUFLUSxPQUFMLENBQWFDLEtBQWIsQ0FBbUJDLEdBQW5CLENBQXVCLElBQXZCOztBQUVBLFFBQUksQ0FBQyxLQUFLTCxnQkFBTCxDQUFzQk0sTUFBM0IsRUFDRSxLQUFLSixLQUFMO0FBQ0gsR0F2Qm9COzs7QUF5QnJCOzs7O0FBSUFBLE9BN0JxQixtQkE2QmI7QUFDTlAsUUFBSSxPQUFKO0FBQ0EsU0FBS1EsT0FBTCxDQUFhRCxLQUFiLENBQW1CRyxHQUFuQixDQUF1QixJQUF2QjtBQUNELEdBaENvQjs7O0FBa0NyQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUFLQUUsU0E1Q3FCLG1CQTRDYkMsRUE1Q2EsRUE0Q0s7QUFBQSxRQUFkQyxPQUFjLHlEQUFKLEVBQUk7O0FBQ3hCRCxTQUFLLGFBQWFBLEVBQWxCOztBQUVBLFFBQUksQ0FBQ1gsT0FBT1csRUFBUCxDQUFMLEVBQ0UsTUFBTSxJQUFJRSxLQUFKLGVBQXNCRixFQUF0Qix1QkFBTjs7QUFFRixRQUFJRyxXQUFXZixXQUFXWSxFQUFYLENBQWY7O0FBRUEsUUFBSSxDQUFDRyxRQUFMLEVBQWU7QUFDYkEsaUJBQVcsSUFBSWQsT0FBT1csRUFBUCxDQUFKLEVBQVg7QUFDQTtBQUNBLFdBQUtSLGdCQUFMLENBQXNCWSxHQUF0QixDQUEwQkQsU0FBU1IsT0FBVCxDQUFpQkQsS0FBM0M7QUFDQTtBQUNBTixpQkFBV1ksRUFBWCxJQUFpQkcsUUFBakI7QUFDRDs7QUFFREEsYUFBU0UsU0FBVCxDQUFtQkosT0FBbkI7QUFDQSxXQUFPRSxRQUFQO0FBQ0QsR0E5RG9COzs7QUFnRXJCOzs7OztBQUtBRyxVQXJFcUIsb0JBcUVaTixFQXJFWSxFQXFFUk8sSUFyRVEsRUFxRUY7QUFDakJsQixXQUFPVyxFQUFQLElBQWFPLElBQWI7QUFDRDtBQXZFb0IsQ0FBdkI7O2tCQTBFZWpCLGMiLCJmaWxlIjoic2VydmljZU1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlTWFuYWdlcicpO1xuXG5jb25zdCBfaW5zdGFuY2VzID0ge307XG5jb25zdCBfY3RvcnMgPSB7fTtcblxuLyoqXG4gKiBGYWN0b3J5IGFuZCBpbml0aWFsaXNhdGlvbiBtYW5hZ2VyIGZvciB0aGUgc2VydmljZXMuXG4gKiBMYXp5IGluc3RhbmNpYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBnaXZlbiB0eXBlIGFuZCByZXRyaWV2ZSBpdCBvbiBlYWNoIGNhbGwuXG4gKi9cbmNvbnN0IHNlcnZpY2VNYW5hZ2VyID0ge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgbWFuYWdlci5cbiAgICovXG4gIGluaXQoKSB7XG4gICAgbG9nKCdpbml0Jyk7XG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzID0gbmV3IFNpZ25hbEFsbCgpO1xuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigoKSA9PiB0aGlzLnJlYWR5KCkpO1xuXG4gICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgdGhpcy5zaWduYWxzLnN0YXJ0ID0gbmV3IFNpZ25hbCgpO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeSA9IG5ldyBTaWduYWwoKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgdGhlIHNpZ25hbCByZXF1aXJlZCBieSBhbGwgc2VydmljZXMgdG8gc3RhcnQuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBsb2coJ3N0YXJ0Jyk7XG4gICAgdGhpcy5zaWduYWxzLnN0YXJ0LnNldCh0cnVlKTtcblxuICAgIGlmICghdGhpcy5fcmVxdWlyZWRTaWduYWxzLmxlbmd0aClcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgfSxcblxuICAvKipcbiAgICogTWFyayB0aGUgc2VydmljZXMgYXMgcmVhZHkuIFRoaXMgc2lnbmFsIGlzIG9ic2VydmVkIGJ5IHtAbGluayBFeHBlcmllbmNlfVxuICAgKiBpbnN0YW5jZXMgYW5kIHRyaWdnZXIgdGhlaXIgYHN0YXJ0YC5cbiAgICovXG4gIHJlYWR5KCkge1xuICAgIGxvZygncmVhZHknKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KHRydWUpO1xuICB9LFxuXG4gIC8vIHJlc2V0KCkge1xuICAvLyAgIHRoaXMuc2lnbmFscy5zdGFydC5zZXQoZmFsc2UpO1xuICAvLyAgIHRoaXMuc2lnbmFscy5yZWFkeS5zZXQoZmFsc2UpO1xuICAvLyB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGluc3RhbmNlIG9mIGEgc2VydmljZSB3aXRoIG9wdGlvbnMgdG8gYmUgYXBwbGllZCB0byBpdHMgY29uc3RydWN0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIHBhc3MgdG8gdGhlIHNlcnZpY2UgY29uc3RydWN0b3IuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zID0ge30pIHtcbiAgICBpZCA9ICdzZXJ2aWNlOicgKyBpZDtcblxuICAgIGlmICghX2N0b3JzW2lkXSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2VydmljZSBcIiR7aWR9XCIgZG9lcyBub3QgZXhpc3RzYCk7XG5cbiAgICBsZXQgaW5zdGFuY2UgPSBfaW5zdGFuY2VzW2lkXTtcblxuICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgIGluc3RhbmNlID0gbmV3IF9jdG9yc1tpZF0oKTtcbiAgICAgIC8vIGFkZCB0aGUgaW5zdGFuY2UgcmVhZHkgc2lnbmFsIGFzIHJlcXVpcmVkIGZvciB0aGUgbWFuYWdlclxuICAgICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzLmFkZChpbnN0YW5jZS5zaWduYWxzLnJlYWR5KTtcbiAgICAgIC8vIHN0b3JlIGluc3RhbmNlXG4gICAgICBfaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuICAgIH1cblxuICAgIGluc3RhbmNlLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgc2VydmljZSB3aXRoIGEgZ2l2ZW4gaWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlZ2lzdGVyKGlkLCBjdG9yKSB7XG4gICAgX2N0b3JzW2lkXSA9IGN0b3I7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlTWFuYWdlcjtcblxuIl19
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
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

var log = (0, _debug2['default'])('soundworks:serviceManager');

/**
 * Factory for the services.
 * Lazy instanciate an instance of the given type and retrieve it on each call.
 */
var _instances = {};
var _ctors = {};

var serviceManager = {
  /**
   * Initialize the serviceManager
   */
  init: function init() {
    var _this = this;

    log('init');
    this._requiredSignals = new _SignalAll2['default']();
    this._requiredSignals.addObserver(function () {
      return _this.ready();
    });

    this.signals = {};
    this.signals.start = new _Signal2['default']();
    this.signals.ready = new _Signal2['default']();

    // return this;
  },

  /**
   * Sends the signal required by all services to start.
   */
  start: function start() {
    log('start');
    this.signals.start.set(true);
  },

  /**
   * Mark the services as ready. Should be listened by `Experience` instances.
   */
  ready: function ready() {
    log('ready');
    this.signals.ready.set(true);
  },

  // reset() {
  //   this.signals.start.set(false);
  //   this.signals.ready.set(false);
  // },

  configure: function configure(id, options) {
    return this.getInstance(id, options);
  },

  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} id - The id of the service.
   * @param {Object} options - Options to pass to the service constructor.
   */
  getInstance: function getInstance(id) {
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

// export default serviceManager.init();
exports['default'] = serviceManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9zZXJ2aWNlTWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFBbUIsVUFBVTs7OztxQkFDWCxPQUFPOzs7O3NCQUNOLFVBQVU7Ozs7eUJBQ1AsYUFBYTs7OztBQUVuQyxJQUFNLEdBQUcsR0FBRyx3QkFBTSwyQkFBMkIsQ0FBQyxDQUFDOzs7Ozs7QUFNL0MsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsSUFBTSxjQUFjLEdBQUc7Ozs7QUFJckIsTUFBSSxFQUFBLGdCQUFHOzs7QUFDTCxPQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDWixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsNEJBQWUsQ0FBQztBQUN4QyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDO2FBQU0sTUFBSyxLQUFLLEVBQUU7S0FBQSxDQUFDLENBQUM7O0FBRXRELFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLHlCQUFZLENBQUM7QUFDbEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcseUJBQVksQ0FBQzs7O0dBR25DOzs7OztBQUtELE9BQUssRUFBQSxpQkFBRztBQUNOLE9BQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNiLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5Qjs7Ozs7QUFLRCxPQUFLLEVBQUEsaUJBQUc7QUFDTixPQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDYixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDOUI7Ozs7Ozs7QUFPRCxXQUFTLEVBQUEsbUJBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUNyQixXQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ3RDOzs7Ozs7O0FBT0QsYUFBVyxFQUFBLHFCQUFDLEVBQUUsRUFBZ0I7UUFBZCxPQUFPLHlEQUFHLEVBQUU7O0FBQzFCLE1BQUUsR0FBRyxVQUFVLEdBQUcsRUFBRSxDQUFDOztBQUVyQixRQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUNiLE1BQU0sSUFBSSxLQUFLLGVBQWEsRUFBRSx1QkFBb0IsQ0FBQzs7QUFFckQsUUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDOztBQUU5QixRQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2IsY0FBUSxHQUFHLElBQUksTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7O0FBRTVCLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFbEQsZ0JBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUM7S0FDM0I7O0FBRUQsWUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QixXQUFPLFFBQVEsQ0FBQztHQUNqQjs7Ozs7OztBQU9ELFVBQVEsRUFBQSxrQkFBQyxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ2pCLFVBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7R0FDbkI7Q0FDRixDQUFDOzs7cUJBR2EsY0FBYyIsImZpbGUiOiJzcmMvY2xpZW50L2NvcmUvc2VydmljZU1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlTWFuYWdlcicpO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIHRoZSBzZXJ2aWNlcy5cbiAqIExhenkgaW5zdGFuY2lhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIGdpdmVuIHR5cGUgYW5kIHJldHJpZXZlIGl0IG9uIGVhY2ggY2FsbC5cbiAqL1xuY29uc3QgX2luc3RhbmNlcyA9IHt9O1xuY29uc3QgX2N0b3JzID0ge307XG5cbmNvbnN0IHNlcnZpY2VNYW5hZ2VyID0ge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc2VydmljZU1hbmFnZXJcbiAgICovXG4gIGluaXQoKSB7XG4gICAgbG9nKCdpbml0Jyk7XG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzID0gbmV3IFNpZ25hbEFsbCgpO1xuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigoKSA9PiB0aGlzLnJlYWR5KCkpO1xuXG4gICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgdGhpcy5zaWduYWxzLnN0YXJ0ID0gbmV3IFNpZ25hbCgpO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeSA9IG5ldyBTaWduYWwoKTtcblxuICAgIC8vIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyB0aGUgc2lnbmFsIHJlcXVpcmVkIGJ5IGFsbCBzZXJ2aWNlcyB0byBzdGFydC5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGxvZygnc3RhcnQnKTtcbiAgICB0aGlzLnNpZ25hbHMuc3RhcnQuc2V0KHRydWUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXJrIHRoZSBzZXJ2aWNlcyBhcyByZWFkeS4gU2hvdWxkIGJlIGxpc3RlbmVkIGJ5IGBFeHBlcmllbmNlYCBpbnN0YW5jZXMuXG4gICAqL1xuICByZWFkeSgpIHtcbiAgICBsb2coJ3JlYWR5Jyk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgfSxcblxuICAvLyByZXNldCgpIHtcbiAgLy8gICB0aGlzLnNpZ25hbHMuc3RhcnQuc2V0KGZhbHNlKTtcbiAgLy8gICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KGZhbHNlKTtcbiAgLy8gfSxcblxuICBjb25maWd1cmUoaWQsIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRJbnN0YW5jZShpZCwgb3B0aW9ucyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaW5zdGFuY2Ugb2YgYSBzZXJ2aWNlIHdpdGggb3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIGl0cyBjb25zdHJ1Y3Rvci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gcGFzcyB0byB0aGUgc2VydmljZSBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIGdldEluc3RhbmNlKGlkLCBvcHRpb25zID0ge30pIHtcbiAgICBpZCA9ICdzZXJ2aWNlOicgKyBpZDtcblxuICAgIGlmICghX2N0b3JzW2lkXSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2VydmljZSBcIiR7aWR9XCIgZG9lcyBub3QgZXhpc3RzYCk7XG5cbiAgICBsZXQgaW5zdGFuY2UgPSBfaW5zdGFuY2VzW2lkXTtcblxuICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgIGluc3RhbmNlID0gbmV3IF9jdG9yc1tpZF0oKTtcbiAgICAgIC8vIGFkZCB0aGUgaW5zdGFuY2UgcmVhZHkgc2lnbmFsIGFzIHJlcXVpcmVkIGZvciB0aGUgbWFuYWdlclxuICAgICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzLmFkZChpbnN0YW5jZS5zaWduYWxzLnJlYWR5KTtcbiAgICAgIC8vIHN0b3JlIGluc3RhbmNlXG4gICAgICBfaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuICAgIH1cblxuICAgIGluc3RhbmNlLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgc2VydmljZSB3aXRoIGEgZ2l2ZW4gaWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlZ2lzdGVyKGlkLCBjdG9yKSB7XG4gICAgX2N0b3JzW2lkXSA9IGN0b3I7XG4gIH0sXG59O1xuXG4vLyBleHBvcnQgZGVmYXVsdCBzZXJ2aWNlTWFuYWdlci5pbml0KCk7XG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlTWFuYWdlcjtcbiJdfQ==
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _Signal = require('../../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('../../utils/SignalAll');

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
  _serviceInstanciationHook: null,

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

    var networkedServices = [];

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


  /**
   * Returns an instance of a service with options to be applied to its constructor.
   * @param {String} id - The id of the service.
   * @param {Object} options - Options to pass to the service constructor.
   */
  require: function require(id) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    id = 'service:' + id;

    if (!_ctors[id]) throw new Error('Service "' + id + '" is not defined');

    var instance = _instances[id];

    if (!instance) {
      // throw an error if manager already started
      if (this.signals.start.get() === true) throw new Error('Service "' + id + '" required after serviceManager start');

      instance = new _ctors[id]();

      if (this._serviceInstanciationHook !== null) this._serviceInstanciationHook(id, instance);

      // add the instance ready signal as required for the manager
      this._requiredSignals.add(instance.signals.ready);
      // store instance
      _instances[id] = instance;
    }

    instance.configure(options);
    return instance;
  },


  /**
   * Register a function to be executed when a service is instanciated.
   *
   * @param {serviceManager~serviceInstanciationHook} func - Function to
   *  register has a hook to be execute when a service is created.
   */
  /**
   * @callback serviceManager~serviceInstanciationHook
   * @param {String} id - id of the instanciated service.
   * @param {Service} instance - instance of the service.
   */
  setServiceInstanciationHook: function setServiceInstanciationHook(func) {
    this._serviceInstanciationHook = func;
  },


  /**
   * Register a service with a given id.
   * @param {String} id - The id of the service.
   * @param {Function} ctor - The constructor of the service.
   */
  register: function register(id, ctor) {
    _ctors[id] = ctor;
  },
  getRequiredServices: function getRequiredServices() {
    return (0, _keys2.default)(_instances);
  }
};

exports.default = serviceManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImxvZyIsIl9pbnN0YW5jZXMiLCJfY3RvcnMiLCJzZXJ2aWNlTWFuYWdlciIsIl9zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2siLCJpbml0IiwiX3JlcXVpcmVkU2lnbmFscyIsImFkZE9ic2VydmVyIiwicmVhZHkiLCJzaWduYWxzIiwic3RhcnQiLCJuZXR3b3JrZWRTZXJ2aWNlcyIsInNldCIsImxlbmd0aCIsInJlcXVpcmUiLCJpZCIsIm9wdGlvbnMiLCJFcnJvciIsImluc3RhbmNlIiwiZ2V0IiwiYWRkIiwiY29uZmlndXJlIiwic2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rIiwiZnVuYyIsInJlZ2lzdGVyIiwiY3RvciIsImdldFJlcXVpcmVkU2VydmljZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE1BQU0scUJBQU0sMkJBQU4sQ0FBWjs7QUFFQSxJQUFNQyxhQUFhLEVBQW5CO0FBQ0EsSUFBTUMsU0FBUyxFQUFmOztBQUVBOzs7O0FBSUEsSUFBTUMsaUJBQWlCO0FBQ3JCQyw2QkFBMkIsSUFETjs7QUFHckI7OztBQUdBQyxNQU5xQixrQkFNZDtBQUFBOztBQUNMTCxRQUFJLE1BQUo7QUFDQSxTQUFLTSxnQkFBTCxHQUF3Qix5QkFBeEI7QUFDQSxTQUFLQSxnQkFBTCxDQUFzQkMsV0FBdEIsQ0FBa0M7QUFBQSxhQUFNLE1BQUtDLEtBQUwsRUFBTjtBQUFBLEtBQWxDOztBQUVBLFNBQUtDLE9BQUwsR0FBZSxFQUFmO0FBQ0EsU0FBS0EsT0FBTCxDQUFhQyxLQUFiLEdBQXFCLHNCQUFyQjtBQUNBLFNBQUtELE9BQUwsQ0FBYUQsS0FBYixHQUFxQixzQkFBckI7QUFDRCxHQWRvQjs7O0FBZ0JyQjs7O0FBR0FFLE9BbkJxQixtQkFtQmI7QUFDTlYsUUFBSSxPQUFKOztBQUVBLFFBQU1XLG9CQUFvQixFQUExQjs7QUFFQSxTQUFLRixPQUFMLENBQWFDLEtBQWIsQ0FBbUJFLEdBQW5CLENBQXVCLElBQXZCOztBQUVBLFFBQUksQ0FBQyxLQUFLTixnQkFBTCxDQUFzQk8sTUFBM0IsRUFDRSxLQUFLTCxLQUFMO0FBQ0gsR0E1Qm9COzs7QUE4QnJCOzs7O0FBSUFBLE9BbENxQixtQkFrQ2I7QUFDTlIsUUFBSSxPQUFKO0FBQ0EsU0FBS1MsT0FBTCxDQUFhRCxLQUFiLENBQW1CSSxHQUFuQixDQUF1QixJQUF2QjtBQUNELEdBckNvQjs7O0FBdUNyQjs7Ozs7QUFLQUUsU0E1Q3FCLG1CQTRDYkMsRUE1Q2EsRUE0Q0s7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FBQ3hCRCxTQUFLLGFBQWFBLEVBQWxCOztBQUVBLFFBQUksQ0FBQ2IsT0FBT2EsRUFBUCxDQUFMLEVBQ0UsTUFBTSxJQUFJRSxLQUFKLGVBQXNCRixFQUF0QixzQkFBTjs7QUFFRixRQUFJRyxXQUFXakIsV0FBV2MsRUFBWCxDQUFmOztBQUVBLFFBQUksQ0FBQ0csUUFBTCxFQUFlO0FBQ2I7QUFDQSxVQUFJLEtBQUtULE9BQUwsQ0FBYUMsS0FBYixDQUFtQlMsR0FBbkIsT0FBNkIsSUFBakMsRUFDRSxNQUFNLElBQUlGLEtBQUosZUFBc0JGLEVBQXRCLDJDQUFOOztBQUVGRyxpQkFBVyxJQUFJaEIsT0FBT2EsRUFBUCxDQUFKLEVBQVg7O0FBRUEsVUFBSSxLQUFLWCx5QkFBTCxLQUFtQyxJQUF2QyxFQUNFLEtBQUtBLHlCQUFMLENBQStCVyxFQUEvQixFQUFtQ0csUUFBbkM7O0FBRUY7QUFDQSxXQUFLWixnQkFBTCxDQUFzQmMsR0FBdEIsQ0FBMEJGLFNBQVNULE9BQVQsQ0FBaUJELEtBQTNDO0FBQ0E7QUFDQVAsaUJBQVdjLEVBQVgsSUFBaUJHLFFBQWpCO0FBQ0Q7O0FBRURBLGFBQVNHLFNBQVQsQ0FBbUJMLE9BQW5CO0FBQ0EsV0FBT0UsUUFBUDtBQUNELEdBdEVvQjs7O0FBd0VyQjs7Ozs7O0FBTUE7Ozs7O0FBS0FJLDZCQW5GcUIsdUNBbUZPQyxJQW5GUCxFQW1GYTtBQUNoQyxTQUFLbkIseUJBQUwsR0FBaUNtQixJQUFqQztBQUNELEdBckZvQjs7O0FBdUZyQjs7Ozs7QUFLQUMsVUE1RnFCLG9CQTRGWlQsRUE1RlksRUE0RlJVLElBNUZRLEVBNEZGO0FBQ2pCdkIsV0FBT2EsRUFBUCxJQUFhVSxJQUFiO0FBQ0QsR0E5Rm9CO0FBaUdyQkMscUJBakdxQixpQ0FpR0M7QUFDcEIsV0FBTyxvQkFBWXpCLFVBQVosQ0FBUDtBQUNEO0FBbkdvQixDQUF2Qjs7a0JBc0dlRSxjIiwiZmlsZSI6InNlcnZpY2VNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi4vLi4vdXRpbHMvU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi4vLi4vdXRpbHMvU2lnbmFsQWxsJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZU1hbmFnZXInKTtcblxuY29uc3QgX2luc3RhbmNlcyA9IHt9O1xuY29uc3QgX2N0b3JzID0ge307XG5cbi8qKlxuICogRmFjdG9yeSBhbmQgaW5pdGlhbGlzYXRpb24gbWFuYWdlciBmb3IgdGhlIHNlcnZpY2VzLlxuICogTGF6eSBpbnN0YW5jaWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgcmV0cmlldmUgaXQgb24gZWFjaCBjYWxsLlxuICovXG5jb25zdCBzZXJ2aWNlTWFuYWdlciA9IHtcbiAgX3NlcnZpY2VJbnN0YW5jaWF0aW9uSG9vazogbnVsbCxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgbWFuYWdlci5cbiAgICovXG4gIGluaXQoKSB7XG4gICAgbG9nKCdpbml0Jyk7XG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzID0gbmV3IFNpZ25hbEFsbCgpO1xuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigoKSA9PiB0aGlzLnJlYWR5KCkpO1xuXG4gICAgdGhpcy5zaWduYWxzID0ge307XG4gICAgdGhpcy5zaWduYWxzLnN0YXJ0ID0gbmV3IFNpZ25hbCgpO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeSA9IG5ldyBTaWduYWwoKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgdGhlIHNpZ25hbCByZXF1aXJlZCBieSBhbGwgc2VydmljZXMgdG8gc3RhcnQuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBsb2coJ3N0YXJ0Jyk7XG5cbiAgICBjb25zdCBuZXR3b3JrZWRTZXJ2aWNlcyA9IFtdO1xuXG4gICAgdGhpcy5zaWduYWxzLnN0YXJ0LnNldCh0cnVlKTtcblxuICAgIGlmICghdGhpcy5fcmVxdWlyZWRTaWduYWxzLmxlbmd0aClcbiAgICAgIHRoaXMucmVhZHkoKTtcbiAgfSxcblxuICAvKipcbiAgICogTWFyayB0aGUgc2VydmljZXMgYXMgcmVhZHkuIFRoaXMgc2lnbmFsIGlzIG9ic2VydmVkIGJ5IHtAbGluayBFeHBlcmllbmNlfVxuICAgKiBpbnN0YW5jZXMgYW5kIHRyaWdnZXIgdGhlaXIgYHN0YXJ0YC5cbiAgICovXG4gIHJlYWR5KCkge1xuICAgIGxvZygncmVhZHknKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KHRydWUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGluc3RhbmNlIG9mIGEgc2VydmljZSB3aXRoIG9wdGlvbnMgdG8gYmUgYXBwbGllZCB0byBpdHMgY29uc3RydWN0b3IuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIHRvIHBhc3MgdG8gdGhlIHNlcnZpY2UgY29uc3RydWN0b3IuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zID0ge30pIHtcbiAgICBpZCA9ICdzZXJ2aWNlOicgKyBpZDtcblxuICAgIGlmICghX2N0b3JzW2lkXSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgU2VydmljZSBcIiR7aWR9XCIgaXMgbm90IGRlZmluZWRgKTtcblxuICAgIGxldCBpbnN0YW5jZSA9IF9pbnN0YW5jZXNbaWRdO1xuXG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgLy8gdGhyb3cgYW4gZXJyb3IgaWYgbWFuYWdlciBhbHJlYWR5IHN0YXJ0ZWRcbiAgICAgIGlmICh0aGlzLnNpZ25hbHMuc3RhcnQuZ2V0KCkgPT09IHRydWUpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgU2VydmljZSBcIiR7aWR9XCIgcmVxdWlyZWQgYWZ0ZXIgc2VydmljZU1hbmFnZXIgc3RhcnRgKTtcblxuICAgICAgaW5zdGFuY2UgPSBuZXcgX2N0b3JzW2lkXSgpO1xuXG4gICAgICBpZiAodGhpcy5fc2VydmljZUluc3RhbmNpYXRpb25Ib29rICE9PSBudWxsKVxuICAgICAgICB0aGlzLl9zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2soaWQsIGluc3RhbmNlKTtcblxuICAgICAgLy8gYWRkIHRoZSBpbnN0YW5jZSByZWFkeSBzaWduYWwgYXMgcmVxdWlyZWQgZm9yIHRoZSBtYW5hZ2VyXG4gICAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkKGluc3RhbmNlLnNpZ25hbHMucmVhZHkpO1xuICAgICAgLy8gc3RvcmUgaW5zdGFuY2VcbiAgICAgIF9pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCB3aGVuIGEgc2VydmljZSBpcyBpbnN0YW5jaWF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7c2VydmljZU1hbmFnZXJ+c2VydmljZUluc3RhbmNpYXRpb25Ib29rfSBmdW5jIC0gRnVuY3Rpb24gdG9cbiAgICogIHJlZ2lzdGVyIGhhcyBhIGhvb2sgdG8gYmUgZXhlY3V0ZSB3aGVuIGEgc2VydmljZSBpcyBjcmVhdGVkLlxuICAgKi9cbiAgLyoqXG4gICAqIEBjYWxsYmFjayBzZXJ2aWNlTWFuYWdlcn5zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2tcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gaWQgb2YgdGhlIGluc3RhbmNpYXRlZCBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge1NlcnZpY2V9IGluc3RhbmNlIC0gaW5zdGFuY2Ugb2YgdGhlIHNlcnZpY2UuXG4gICAqL1xuICBzZXRTZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2soZnVuYykge1xuICAgIHRoaXMuX3NlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayA9IGZ1bmM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgc2VydmljZSB3aXRoIGEgZ2l2ZW4gaWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlZ2lzdGVyKGlkLCBjdG9yKSB7XG4gICAgX2N0b3JzW2lkXSA9IGN0b3I7XG4gIH0sXG5cblxuICBnZXRSZXF1aXJlZFNlcnZpY2VzKCkge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhfaW5zdGFuY2VzKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlcnZpY2VNYW5hZ2VyO1xuXG4iXX0=
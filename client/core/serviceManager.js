'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

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
      if (this.signals.start.get() === true) throw new Error('Service "' + id + '" required after application start');

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImxvZyIsIl9pbnN0YW5jZXMiLCJfY3RvcnMiLCJzZXJ2aWNlTWFuYWdlciIsIl9zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2siLCJpbml0IiwiX3JlcXVpcmVkU2lnbmFscyIsImFkZE9ic2VydmVyIiwicmVhZHkiLCJzaWduYWxzIiwic3RhcnQiLCJuZXR3b3JrZWRTZXJ2aWNlcyIsInNldCIsImxlbmd0aCIsInJlcXVpcmUiLCJpZCIsIm9wdGlvbnMiLCJFcnJvciIsImluc3RhbmNlIiwiZ2V0IiwiYWRkIiwiY29uZmlndXJlIiwic2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rIiwiZnVuYyIsInJlZ2lzdGVyIiwiY3RvciIsImdldFJlcXVpcmVkU2VydmljZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxxQkFBTSwyQkFBTixDQUFaOztBQUVBLElBQU1DLGFBQWEsRUFBbkI7QUFDQSxJQUFNQyxTQUFTLEVBQWY7O0FBRUE7Ozs7QUFJQSxJQUFNQyxpQkFBaUI7QUFDckJDLDZCQUEyQixJQUROOztBQUdyQjs7O0FBR0FDLE1BTnFCLGtCQU1kO0FBQUE7O0FBQ0xMLFFBQUksTUFBSjtBQUNBLFNBQUtNLGdCQUFMLEdBQXdCLHlCQUF4QjtBQUNBLFNBQUtBLGdCQUFMLENBQXNCQyxXQUF0QixDQUFrQztBQUFBLGFBQU0sTUFBS0MsS0FBTCxFQUFOO0FBQUEsS0FBbEM7O0FBRUEsU0FBS0MsT0FBTCxHQUFlLEVBQWY7QUFDQSxTQUFLQSxPQUFMLENBQWFDLEtBQWIsR0FBcUIsc0JBQXJCO0FBQ0EsU0FBS0QsT0FBTCxDQUFhRCxLQUFiLEdBQXFCLHNCQUFyQjtBQUNELEdBZG9COzs7QUFnQnJCOzs7QUFHQUUsT0FuQnFCLG1CQW1CYjtBQUNOVixRQUFJLE9BQUo7O0FBRUEsUUFBTVcsb0JBQW9CLEVBQTFCOztBQUVBLFNBQUtGLE9BQUwsQ0FBYUMsS0FBYixDQUFtQkUsR0FBbkIsQ0FBdUIsSUFBdkI7O0FBRUEsUUFBSSxDQUFDLEtBQUtOLGdCQUFMLENBQXNCTyxNQUEzQixFQUNFLEtBQUtMLEtBQUw7QUFDSCxHQTVCb0I7OztBQThCckI7Ozs7QUFJQUEsT0FsQ3FCLG1CQWtDYjtBQUNOUixRQUFJLE9BQUo7QUFDQSxTQUFLUyxPQUFMLENBQWFELEtBQWIsQ0FBbUJJLEdBQW5CLENBQXVCLElBQXZCO0FBQ0QsR0FyQ29COzs7QUF1Q3JCOzs7OztBQUtBRSxTQTVDcUIsbUJBNENiQyxFQTVDYSxFQTRDSztBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFDeEJELFNBQUssYUFBYUEsRUFBbEI7O0FBRUEsUUFBSSxDQUFDYixPQUFPYSxFQUFQLENBQUwsRUFDRSxNQUFNLElBQUlFLEtBQUosZUFBc0JGLEVBQXRCLHNCQUFOOztBQUVGLFFBQUlHLFdBQVdqQixXQUFXYyxFQUFYLENBQWY7O0FBRUEsUUFBSSxDQUFDRyxRQUFMLEVBQWU7QUFDYjtBQUNBLFVBQUksS0FBS1QsT0FBTCxDQUFhQyxLQUFiLENBQW1CUyxHQUFuQixPQUE2QixJQUFqQyxFQUNFLE1BQU0sSUFBSUYsS0FBSixlQUFzQkYsRUFBdEIsd0NBQU47O0FBRUZHLGlCQUFXLElBQUloQixPQUFPYSxFQUFQLENBQUosRUFBWDs7QUFFQSxVQUFJLEtBQUtYLHlCQUFMLEtBQW1DLElBQXZDLEVBQ0UsS0FBS0EseUJBQUwsQ0FBK0JXLEVBQS9CLEVBQW1DRyxRQUFuQzs7QUFFRjtBQUNBLFdBQUtaLGdCQUFMLENBQXNCYyxHQUF0QixDQUEwQkYsU0FBU1QsT0FBVCxDQUFpQkQsS0FBM0M7QUFDQTtBQUNBUCxpQkFBV2MsRUFBWCxJQUFpQkcsUUFBakI7QUFDRDs7QUFFREEsYUFBU0csU0FBVCxDQUFtQkwsT0FBbkI7QUFDQSxXQUFPRSxRQUFQO0FBQ0QsR0F0RW9COzs7QUF3RXJCOzs7Ozs7QUFNQTs7Ozs7QUFLQUksNkJBbkZxQix1Q0FtRk9DLElBbkZQLEVBbUZhO0FBQ2hDLFNBQUtuQix5QkFBTCxHQUFpQ21CLElBQWpDO0FBQ0QsR0FyRm9COzs7QUF1RnJCOzs7OztBQUtBQyxVQTVGcUIsb0JBNEZaVCxFQTVGWSxFQTRGUlUsSUE1RlEsRUE0RkY7QUFDakJ2QixXQUFPYSxFQUFQLElBQWFVLElBQWI7QUFDRCxHQTlGb0I7QUFpR3JCQyxxQkFqR3FCLGlDQWlHQztBQUNwQixXQUFPLG9CQUFZekIsVUFBWixDQUFQO0FBQ0Q7QUFuR29CLENBQXZCOztrQkFzR2VFLGMiLCJmaWxlIjoic2VydmljZU1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2xpZW50IGZyb20gJy4vY2xpZW50JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uLy4uL3V0aWxzL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4uLy4uL3V0aWxzL1NpZ25hbEFsbCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VNYW5hZ2VyJyk7XG5cbmNvbnN0IF9pbnN0YW5jZXMgPSB7fTtcbmNvbnN0IF9jdG9ycyA9IHt9O1xuXG4vKipcbiAqIEZhY3RvcnkgYW5kIGluaXRpYWxpc2F0aW9uIG1hbmFnZXIgZm9yIHRoZSBzZXJ2aWNlcy5cbiAqIExhenkgaW5zdGFuY2lhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIGdpdmVuIHR5cGUgYW5kIHJldHJpZXZlIGl0IG9uIGVhY2ggY2FsbC5cbiAqL1xuY29uc3Qgc2VydmljZU1hbmFnZXIgPSB7XG4gIF9zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2s6IG51bGwsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIG1hbmFnZXIuXG4gICAqL1xuICBpbml0KCkge1xuICAgIGxvZygnaW5pdCcpO1xuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcbiAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKCkgPT4gdGhpcy5yZWFkeSgpKTtcblxuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5zdGFydCA9IG5ldyBTaWduYWwoKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIHRoZSBzaWduYWwgcmVxdWlyZWQgYnkgYWxsIHNlcnZpY2VzIHRvIHN0YXJ0LlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgbG9nKCdzdGFydCcpO1xuXG4gICAgY29uc3QgbmV0d29ya2VkU2VydmljZXMgPSBbXTtcblxuICAgIHRoaXMuc2lnbmFscy5zdGFydC5zZXQodHJ1ZSk7XG5cbiAgICBpZiAoIXRoaXMuX3JlcXVpcmVkU2lnbmFscy5sZW5ndGgpXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1hcmsgdGhlIHNlcnZpY2VzIGFzIHJlYWR5LiBUaGlzIHNpZ25hbCBpcyBvYnNlcnZlZCBieSB7QGxpbmsgRXhwZXJpZW5jZX1cbiAgICogaW5zdGFuY2VzIGFuZCB0cmlnZ2VyIHRoZWlyIGBzdGFydGAuXG4gICAqL1xuICByZWFkeSgpIHtcbiAgICBsb2coJ3JlYWR5Jyk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpbnN0YW5jZSBvZiBhIHNlcnZpY2Ugd2l0aCBvcHRpb25zIHRvIGJlIGFwcGxpZWQgdG8gaXRzIGNvbnN0cnVjdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBwYXNzIHRvIHRoZSBzZXJ2aWNlIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWQgPSAnc2VydmljZTonICsgaWQ7XG5cbiAgICBpZiAoIV9jdG9yc1tpZF0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNlcnZpY2UgXCIke2lkfVwiIGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICBsZXQgaW5zdGFuY2UgPSBfaW5zdGFuY2VzW2lkXTtcblxuICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgIC8vIHRocm93IGFuIGVycm9yIGlmIG1hbmFnZXIgYWxyZWFkeSBzdGFydGVkXG4gICAgICBpZiAodGhpcy5zaWduYWxzLnN0YXJ0LmdldCgpID09PSB0cnVlKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNlcnZpY2UgXCIke2lkfVwiIHJlcXVpcmVkIGFmdGVyIGFwcGxpY2F0aW9uIHN0YXJ0YCk7XG5cbiAgICAgIGluc3RhbmNlID0gbmV3IF9jdG9yc1tpZF0oKTtcblxuICAgICAgaWYgKHRoaXMuX3NlcnZpY2VJbnN0YW5jaWF0aW9uSG9vayAhPT0gbnVsbClcbiAgICAgICAgdGhpcy5fc2VydmljZUluc3RhbmNpYXRpb25Ib29rKGlkLCBpbnN0YW5jZSk7XG5cbiAgICAgIC8vIGFkZCB0aGUgaW5zdGFuY2UgcmVhZHkgc2lnbmFsIGFzIHJlcXVpcmVkIGZvciB0aGUgbWFuYWdlclxuICAgICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzLmFkZChpbnN0YW5jZS5zaWduYWxzLnJlYWR5KTtcbiAgICAgIC8vIHN0b3JlIGluc3RhbmNlXG4gICAgICBfaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuICAgIH1cblxuICAgIGluc3RhbmNlLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgd2hlbiBhIHNlcnZpY2UgaXMgaW5zdGFuY2lhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0ge3NlcnZpY2VNYW5hZ2VyfnNlcnZpY2VJbnN0YW5jaWF0aW9uSG9va30gZnVuYyAtIEZ1bmN0aW9uIHRvXG4gICAqICByZWdpc3RlciBoYXMgYSBob29rIHRvIGJlIGV4ZWN1dGUgd2hlbiBhIHNlcnZpY2UgaXMgY3JlYXRlZC5cbiAgICovXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgc2VydmljZU1hbmFnZXJ+c2VydmljZUluc3RhbmNpYXRpb25Ib29rXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIGlkIG9mIHRoZSBpbnN0YW5jaWF0ZWQgc2VydmljZS5cbiAgICogQHBhcmFtIHtTZXJ2aWNlfSBpbnN0YW5jZSAtIGluc3RhbmNlIG9mIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgc2V0U2VydmljZUluc3RhbmNpYXRpb25Ib29rKGZ1bmMpIHtcbiAgICB0aGlzLl9zZXJ2aWNlSW5zdGFuY2lhdGlvbkhvb2sgPSBmdW5jO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHNlcnZpY2Ugd2l0aCBhIGdpdmVuIGlkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWdpc3RlcihpZCwgY3Rvcikge1xuICAgIF9jdG9yc1tpZF0gPSBjdG9yO1xuICB9LFxuXG5cbiAgZ2V0UmVxdWlyZWRTZXJ2aWNlcygpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoX2luc3RhbmNlcyk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlTWFuYWdlcjtcblxuIl19
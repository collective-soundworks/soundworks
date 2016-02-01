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

// export default serviceManager.init();
exports['default'] = serviceManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9zZXJ2aWNlTWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFBbUIsVUFBVTs7OztxQkFDWCxPQUFPOzs7O3NCQUNOLFVBQVU7Ozs7eUJBQ1AsYUFBYTs7OztBQUVuQyxJQUFNLEdBQUcsR0FBRyx3QkFBTSwyQkFBMkIsQ0FBQyxDQUFDOzs7Ozs7QUFNL0MsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsSUFBTSxjQUFjLEdBQUc7Ozs7QUFJckIsTUFBSSxFQUFBLGdCQUFHOzs7QUFDTCxPQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDWixRQUFJLENBQUMsZ0JBQWdCLEdBQUcsNEJBQWUsQ0FBQztBQUN4QyxRQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDO2FBQU0sTUFBSyxLQUFLLEVBQUU7S0FBQSxDQUFDLENBQUM7O0FBRXRELFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLHlCQUFZLENBQUM7QUFDbEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcseUJBQVksQ0FBQzs7O0dBR25DOzs7OztBQUtELE9BQUssRUFBQSxpQkFBRztBQUNOLE9BQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNiLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5Qjs7Ozs7QUFLRCxPQUFLLEVBQUEsaUJBQUc7QUFDTixPQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDYixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDOUI7Ozs7Ozs7Ozs7OztBQVlELFNBQU8sRUFBQSxpQkFBQyxFQUFFLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOztBQUN0QixNQUFFLEdBQUcsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFDYixNQUFNLElBQUksS0FBSyxlQUFhLEVBQUUsdUJBQW9CLENBQUM7O0FBRXJELFFBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGNBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDOztBQUU1QixVQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxELGdCQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0tBQzNCOztBQUVELFlBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUIsV0FBTyxRQUFRLENBQUM7R0FDakI7Ozs7Ozs7QUFPRCxVQUFRLEVBQUEsa0JBQUMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUNqQixVQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0dBQ25CO0NBQ0YsQ0FBQzs7O3FCQUdhLGNBQWMiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL3NlcnZpY2VNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vU2lnbmFsQWxsJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZU1hbmFnZXInKTtcblxuLyoqXG4gKiBGYWN0b3J5IGZvciB0aGUgc2VydmljZXMuXG4gKiBMYXp5IGluc3RhbmNpYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBnaXZlbiB0eXBlIGFuZCByZXRyaWV2ZSBpdCBvbiBlYWNoIGNhbGwuXG4gKi9cbmNvbnN0IF9pbnN0YW5jZXMgPSB7fTtcbmNvbnN0IF9jdG9ycyA9IHt9O1xuXG5jb25zdCBzZXJ2aWNlTWFuYWdlciA9IHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIHNlcnZpY2VNYW5hZ2VyXG4gICAqL1xuICBpbml0KCkge1xuICAgIGxvZygnaW5pdCcpO1xuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcbiAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKCkgPT4gdGhpcy5yZWFkeSgpKTtcblxuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5zdGFydCA9IG5ldyBTaWduYWwoKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG5cbiAgICAvLyByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgdGhlIHNpZ25hbCByZXF1aXJlZCBieSBhbGwgc2VydmljZXMgdG8gc3RhcnQuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBsb2coJ3N0YXJ0Jyk7XG4gICAgdGhpcy5zaWduYWxzLnN0YXJ0LnNldCh0cnVlKTtcbiAgfSxcblxuICAvKipcbiAgICogTWFyayB0aGUgc2VydmljZXMgYXMgcmVhZHkuIFNob3VsZCBiZSBsaXN0ZW5lZCBieSBgRXhwZXJpZW5jZWAgaW5zdGFuY2VzLlxuICAgKi9cbiAgcmVhZHkoKSB7XG4gICAgbG9nKCdyZWFkeScpO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeS5zZXQodHJ1ZSk7XG4gIH0sXG5cbiAgLy8gcmVzZXQoKSB7XG4gIC8vICAgdGhpcy5zaWduYWxzLnN0YXJ0LnNldChmYWxzZSk7XG4gIC8vICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldChmYWxzZSk7XG4gIC8vIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaW5zdGFuY2Ugb2YgYSBzZXJ2aWNlIHdpdGggb3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIGl0cyBjb25zdHJ1Y3Rvci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gcGFzcyB0byB0aGUgc2VydmljZSBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlkID0gJ3NlcnZpY2U6JyArIGlkO1xuXG4gICAgaWYgKCFfY3RvcnNbaWRdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXJ2aWNlIFwiJHtpZH1cIiBkb2VzIG5vdCBleGlzdHNgKTtcblxuICAgIGxldCBpbnN0YW5jZSA9IF9pbnN0YW5jZXNbaWRdO1xuXG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2UgPSBuZXcgX2N0b3JzW2lkXSgpO1xuICAgICAgLy8gYWRkIHRoZSBpbnN0YW5jZSByZWFkeSBzaWduYWwgYXMgcmVxdWlyZWQgZm9yIHRoZSBtYW5hZ2VyXG4gICAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkKGluc3RhbmNlLnNpZ25hbHMucmVhZHkpO1xuICAgICAgLy8gc3RvcmUgaW5zdGFuY2VcbiAgICAgIF9pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzZXJ2aWNlIHdpdGggYSBnaXZlbiBpZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVnaXN0ZXIoaWQsIGN0b3IpIHtcbiAgICBfY3RvcnNbaWRdID0gY3RvcjtcbiAgfSxcbn07XG5cbi8vIGV4cG9ydCBkZWZhdWx0IHNlcnZpY2VNYW5hZ2VyLmluaXQoKTtcbmV4cG9ydCBkZWZhdWx0IHNlcnZpY2VNYW5hZ2VyO1xuIl19
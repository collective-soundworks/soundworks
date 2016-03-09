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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE1BQU0scUJBQU0sMkJBQU4sQ0FBTjs7QUFFTixJQUFNLGFBQWEsRUFBYjtBQUNOLElBQU0sU0FBUyxFQUFUOzs7Ozs7QUFNTixJQUFNLGlCQUFpQjs7Ozs7QUFJckIsd0JBQU87OztBQUNMLFFBQUksTUFBSixFQURLO0FBRUwsU0FBSyxnQkFBTCxHQUF3Qix5QkFBeEIsQ0FGSztBQUdMLFNBQUssZ0JBQUwsQ0FBc0IsV0FBdEIsQ0FBa0M7YUFBTSxNQUFLLEtBQUw7S0FBTixDQUFsQyxDQUhLOztBQUtMLFNBQUssT0FBTCxHQUFlLEVBQWYsQ0FMSztBQU1MLFNBQUssT0FBTCxDQUFhLEtBQWIsR0FBcUIsc0JBQXJCLENBTks7QUFPTCxTQUFLLE9BQUwsQ0FBYSxLQUFiLEdBQXFCLHNCQUFyQixDQVBLO0dBSmM7Ozs7OztBQWlCckIsMEJBQVE7QUFDTixRQUFJLE9BQUosRUFETTtBQUVOLFNBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBdUIsSUFBdkIsRUFGTTs7QUFJTixRQUFJLENBQUMsS0FBSyxnQkFBTCxDQUFzQixNQUF0QixFQUNILEtBQUssS0FBTCxHQURGO0dBckJtQjs7Ozs7OztBQTZCckIsMEJBQVE7QUFDTixRQUFJLE9BQUosRUFETTtBQUVOLFNBQUssT0FBTCxDQUFhLEtBQWIsQ0FBbUIsR0FBbkIsQ0FBdUIsSUFBdkIsRUFGTTtHQTdCYTs7Ozs7Ozs7Ozs7OztBQTRDckIsNEJBQVEsSUFBa0I7UUFBZCxnRUFBVSxrQkFBSTs7QUFDeEIsU0FBSyxhQUFhLEVBQWIsQ0FEbUI7O0FBR3hCLFFBQUksQ0FBQyxPQUFPLEVBQVAsQ0FBRCxFQUNGLE1BQU0sSUFBSSxLQUFKLGVBQXNCLHdCQUF0QixDQUFOLENBREY7O0FBR0EsUUFBSSxXQUFXLFdBQVcsRUFBWCxDQUFYLENBTm9COztBQVF4QixRQUFJLENBQUMsUUFBRCxFQUFXO0FBQ2IsaUJBQVcsSUFBSSxPQUFPLEVBQVAsQ0FBSixFQUFYOztBQURhLFVBR2IsQ0FBSyxnQkFBTCxDQUFzQixHQUF0QixDQUEwQixTQUFTLE9BQVQsQ0FBaUIsS0FBakIsQ0FBMUI7O0FBSGEsZ0JBS2IsQ0FBVyxFQUFYLElBQWlCLFFBQWpCLENBTGE7S0FBZjs7QUFRQSxhQUFTLFNBQVQsQ0FBbUIsT0FBbkIsRUFoQndCO0FBaUJ4QixXQUFPLFFBQVAsQ0FqQndCO0dBNUNMOzs7Ozs7OztBQXFFckIsOEJBQVMsSUFBSSxNQUFNO0FBQ2pCLFdBQU8sRUFBUCxJQUFhLElBQWIsQ0FEaUI7R0FyRUU7Q0FBakI7O2tCQTBFUyIsImZpbGUiOiJzZXJ2aWNlTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjbGllbnQgZnJvbSAnLi9jbGllbnQnO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuL1NpZ25hbEFsbCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VNYW5hZ2VyJyk7XG5cbmNvbnN0IF9pbnN0YW5jZXMgPSB7fTtcbmNvbnN0IF9jdG9ycyA9IHt9O1xuXG4vKipcbiAqIEZhY3RvcnkgYW5kIGluaXRpYWxpc2F0aW9uIG1hbmFnZXIgZm9yIHRoZSBzZXJ2aWNlcy5cbiAqIExhenkgaW5zdGFuY2lhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIGdpdmVuIHR5cGUgYW5kIHJldHJpZXZlIGl0IG9uIGVhY2ggY2FsbC5cbiAqL1xuY29uc3Qgc2VydmljZU1hbmFnZXIgPSB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBtYW5hZ2VyLlxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICBsb2coJ2luaXQnKTtcbiAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMgPSBuZXcgU2lnbmFsQWxsKCk7XG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzLmFkZE9ic2VydmVyKCgpID0+IHRoaXMucmVhZHkoKSk7XG5cbiAgICB0aGlzLnNpZ25hbHMgPSB7fTtcbiAgICB0aGlzLnNpZ25hbHMuc3RhcnQgPSBuZXcgU2lnbmFsKCk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5ID0gbmV3IFNpZ25hbCgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyB0aGUgc2lnbmFsIHJlcXVpcmVkIGJ5IGFsbCBzZXJ2aWNlcyB0byBzdGFydC5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIGxvZygnc3RhcnQnKTtcbiAgICB0aGlzLnNpZ25hbHMuc3RhcnQuc2V0KHRydWUpO1xuXG4gICAgaWYgKCF0aGlzLl9yZXF1aXJlZFNpZ25hbHMubGVuZ3RoKVxuICAgICAgdGhpcy5yZWFkeSgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXJrIHRoZSBzZXJ2aWNlcyBhcyByZWFkeS4gVGhpcyBzaWduYWwgaXMgb2JzZXJ2ZWQgYnkge0BsaW5rIEV4cGVyaWVuY2V9XG4gICAqIGluc3RhbmNlcyBhbmQgdHJpZ2dlciB0aGVpciBgc3RhcnRgLlxuICAgKi9cbiAgcmVhZHkoKSB7XG4gICAgbG9nKCdyZWFkeScpO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeS5zZXQodHJ1ZSk7XG4gIH0sXG5cbiAgLy8gcmVzZXQoKSB7XG4gIC8vICAgdGhpcy5zaWduYWxzLnN0YXJ0LnNldChmYWxzZSk7XG4gIC8vICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldChmYWxzZSk7XG4gIC8vIH0sXG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaW5zdGFuY2Ugb2YgYSBzZXJ2aWNlIHdpdGggb3B0aW9ucyB0byBiZSBhcHBsaWVkIHRvIGl0cyBjb25zdHJ1Y3Rvci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gcGFzcyB0byB0aGUgc2VydmljZSBjb25zdHJ1Y3Rvci5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlkID0gJ3NlcnZpY2U6JyArIGlkO1xuXG4gICAgaWYgKCFfY3RvcnNbaWRdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXJ2aWNlIFwiJHtpZH1cIiBkb2VzIG5vdCBleGlzdHNgKTtcblxuICAgIGxldCBpbnN0YW5jZSA9IF9pbnN0YW5jZXNbaWRdO1xuXG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2UgPSBuZXcgX2N0b3JzW2lkXSgpO1xuICAgICAgLy8gYWRkIHRoZSBpbnN0YW5jZSByZWFkeSBzaWduYWwgYXMgcmVxdWlyZWQgZm9yIHRoZSBtYW5hZ2VyXG4gICAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkKGluc3RhbmNlLnNpZ25hbHMucmVhZHkpO1xuICAgICAgLy8gc3RvcmUgaW5zdGFuY2VcbiAgICAgIF9pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzZXJ2aWNlIHdpdGggYSBnaXZlbiBpZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVnaXN0ZXIoaWQsIGN0b3IpIHtcbiAgICBfY3RvcnNbaWRdID0gY3RvcjtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNlcnZpY2VNYW5hZ2VyO1xuIl19
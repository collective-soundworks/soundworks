'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _client = require('./client');

var _client2 = _interopRequireDefault(_client);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

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

    console.log('serviceManager:init');
    this._requiredSignals = new _SignalAll2['default']();
    this._requiredSignals.addObserver(function () {
      console.log('serviceManager:ready');
      _this.signals.ready.set(true);
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
    console.log('serviceManager:start');
    this.signals.start.set(true);
  },

  /**
   * Mark the services as ready. Should be listened by `Experience` instances.
   */
  ready: function ready() {
    console.log('serviceManager:ready');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9zZXJ2aWNlTWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztzQkFBbUIsVUFBVTs7OztzQkFDVixVQUFVOzs7O3lCQUNQLGFBQWE7Ozs7Ozs7O0FBTW5DLElBQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUN0QixJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7O0FBRWxCLElBQU0sY0FBYyxHQUFHOzs7O0FBSXJCLE1BQUksRUFBQSxnQkFBRzs7O0FBQ0wsV0FBTyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyw0QkFBZSxDQUFDO0FBQ3hDLFFBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsWUFBTTtBQUN0QyxhQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEMsWUFBSyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5QixDQUFDLENBQUM7O0FBRUgsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcseUJBQVksQ0FBQztBQUNsQyxRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyx5QkFBWSxDQUFDOzs7R0FHbkM7Ozs7O0FBS0QsT0FBSyxFQUFBLGlCQUFHO0FBQ04sV0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3BDLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5Qjs7Ozs7QUFLRCxPQUFLLEVBQUEsaUJBQUc7QUFDTixXQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDcEMsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzlCOzs7Ozs7O0FBT0QsV0FBUyxFQUFBLG1CQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUU7QUFDckIsV0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztHQUN0Qzs7Ozs7OztBQU9ELGFBQVcsRUFBQSxxQkFBQyxFQUFFLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOztBQUMxQixNQUFFLEdBQUcsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFDYixNQUFNLElBQUksS0FBSyxlQUFhLEVBQUUsdUJBQW9CLENBQUM7O0FBRXJELFFBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGNBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDOztBQUU1QixVQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxELGdCQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0tBQzNCOztBQUVELFlBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUIsV0FBTyxRQUFRLENBQUM7R0FDakI7Ozs7Ozs7QUFPRCxVQUFRLEVBQUEsa0JBQUMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUNqQixVQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0dBQ25CO0NBQ0YsQ0FBQzs7O3FCQUdhLGNBQWMiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL3NlcnZpY2VNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuXG4vKipcbiAqIEZhY3RvcnkgZm9yIHRoZSBzZXJ2aWNlcy5cbiAqIExhenkgaW5zdGFuY2lhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIGdpdmVuIHR5cGUgYW5kIHJldHJpZXZlIGl0IG9uIGVhY2ggY2FsbC5cbiAqL1xuY29uc3QgX2luc3RhbmNlcyA9IHt9O1xuY29uc3QgX2N0b3JzID0ge307XG5cbmNvbnN0IHNlcnZpY2VNYW5hZ2VyID0ge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgc2VydmljZU1hbmFnZXJcbiAgICovXG4gIGluaXQoKSB7XG4gICAgY29uc29sZS5sb2coJ3NlcnZpY2VNYW5hZ2VyOmluaXQnKTtcbiAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMgPSBuZXcgU2lnbmFsQWxsKCk7XG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzLmFkZE9ic2VydmVyKCgpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdzZXJ2aWNlTWFuYWdlcjpyZWFkeScpO1xuICAgICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5zdGFydCA9IG5ldyBTaWduYWwoKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG5cbiAgICAvLyByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgdGhlIHNpZ25hbCByZXF1aXJlZCBieSBhbGwgc2VydmljZXMgdG8gc3RhcnQuXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICBjb25zb2xlLmxvZygnc2VydmljZU1hbmFnZXI6c3RhcnQnKTtcbiAgICB0aGlzLnNpZ25hbHMuc3RhcnQuc2V0KHRydWUpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBNYXJrIHRoZSBzZXJ2aWNlcyBhcyByZWFkeS4gU2hvdWxkIGJlIGxpc3RlbmVkIGJ5IGBFeHBlcmllbmNlYCBpbnN0YW5jZXMuXG4gICAqL1xuICByZWFkeSgpIHtcbiAgICBjb25zb2xlLmxvZygnc2VydmljZU1hbmFnZXI6cmVhZHknKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KHRydWUpO1xuICB9LFxuXG4gIC8vIHJlc2V0KCkge1xuICAvLyAgIHRoaXMuc2lnbmFscy5zdGFydC5zZXQoZmFsc2UpO1xuICAvLyAgIHRoaXMuc2lnbmFscy5yZWFkeS5zZXQoZmFsc2UpO1xuICAvLyB9LFxuXG4gIGNvbmZpZ3VyZShpZCwgb3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLmdldEluc3RhbmNlKGlkLCBvcHRpb25zKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpbnN0YW5jZSBvZiBhIHNlcnZpY2Ugd2l0aCBvcHRpb25zIHRvIGJlIGFwcGxpZWQgdG8gaXRzIGNvbnN0cnVjdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBwYXNzIHRvIHRoZSBzZXJ2aWNlIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgZ2V0SW5zdGFuY2UoaWQsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlkID0gJ3NlcnZpY2U6JyArIGlkO1xuXG4gICAgaWYgKCFfY3RvcnNbaWRdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXJ2aWNlIFwiJHtpZH1cIiBkb2VzIG5vdCBleGlzdHNgKTtcblxuICAgIGxldCBpbnN0YW5jZSA9IF9pbnN0YW5jZXNbaWRdO1xuXG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2UgPSBuZXcgX2N0b3JzW2lkXSgpO1xuICAgICAgLy8gYWRkIHRoZSBpbnN0YW5jZSByZWFkeSBzaWduYWwgYXMgcmVxdWlyZWQgZm9yIHRoZSBtYW5hZ2VyXG4gICAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkKGluc3RhbmNlLnNpZ25hbHMucmVhZHkpO1xuICAgICAgLy8gc3RvcmUgaW5zdGFuY2VcbiAgICAgIF9pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBzZXJ2aWNlIHdpdGggYSBnaXZlbiBpZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjdG9yIC0gVGhlIGNvbnN0cnVjdG9yIG9mIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVnaXN0ZXIoaWQsIGN0b3IpIHtcbiAgICBfY3RvcnNbaWRdID0gY3RvcjtcbiAgfSxcbn07XG5cbi8vIGV4cG9ydCBkZWZhdWx0IHNlcnZpY2VNYW5hZ2VyLmluaXQoKTtcbmV4cG9ydCBkZWZhdWx0IHNlcnZpY2VNYW5hZ2VyO1xuIl19
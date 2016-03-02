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
    this._requiredSignals = new _SignalAll2['default']();
    this._requiredSignals.addObserver(function () {
      return _this.ready();
    });

    this.signals = {};
    this.signals.start = new _Signal2['default']();
    this.signals.ready = new _Signal2['default']();
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

exports['default'] = serviceManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvc2VydmljZU1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7c0JBQW1CLFVBQVU7Ozs7cUJBQ1gsT0FBTzs7OztzQkFDTixVQUFVOzs7O3lCQUNQLGFBQWE7Ozs7QUFFbkMsSUFBTSxHQUFHLEdBQUcsd0JBQU0sMkJBQTJCLENBQUMsQ0FBQzs7QUFFL0MsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBTWxCLElBQU0sY0FBYyxHQUFHOzs7O0FBSXJCLE1BQUksRUFBQSxnQkFBRzs7O0FBQ0wsT0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ1osUUFBSSxDQUFDLGdCQUFnQixHQUFHLDRCQUFlLENBQUM7QUFDeEMsUUFBSSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQzthQUFNLE1BQUssS0FBSyxFQUFFO0tBQUEsQ0FBQyxDQUFDOztBQUV0RCxRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyx5QkFBWSxDQUFDO0FBQ2xDLFFBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxHQUFHLHlCQUFZLENBQUM7R0FDbkM7Ozs7O0FBS0QsT0FBSyxFQUFBLGlCQUFHO0FBQ04sT0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUU3QixRQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFDL0IsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2hCOzs7Ozs7QUFNRCxPQUFLLEVBQUEsaUJBQUc7QUFDTixPQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDYixRQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDOUI7Ozs7Ozs7Ozs7OztBQVlELFNBQU8sRUFBQSxpQkFBQyxFQUFFLEVBQWdCO1FBQWQsT0FBTyx5REFBRyxFQUFFOztBQUN0QixNQUFFLEdBQUcsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFDYixNQUFNLElBQUksS0FBSyxlQUFhLEVBQUUsdUJBQW9CLENBQUM7O0FBRXJELFFBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGNBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDOztBQUU1QixVQUFJLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWxELGdCQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0tBQzNCOztBQUVELFlBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDNUIsV0FBTyxRQUFRLENBQUM7R0FDakI7Ozs7Ozs7QUFPRCxVQUFRLEVBQUEsa0JBQUMsRUFBRSxFQUFFLElBQUksRUFBRTtBQUNqQixVQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0dBQ25CO0NBQ0YsQ0FBQzs7cUJBRWEsY0FBYyIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9jb3JlL3NlcnZpY2VNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudCc7XG5pbXBvcnQgZGVidWcgZnJvbSAnZGVidWcnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgU2lnbmFsQWxsIGZyb20gJy4vU2lnbmFsQWxsJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZU1hbmFnZXInKTtcblxuY29uc3QgX2luc3RhbmNlcyA9IHt9O1xuY29uc3QgX2N0b3JzID0ge307XG5cbi8qKlxuICogRmFjdG9yeSBhbmQgaW5pdGlhbGlzYXRpb24gbWFuYWdlciBmb3IgdGhlIHNlcnZpY2VzLlxuICogTGF6eSBpbnN0YW5jaWF0ZSBhbiBpbnN0YW5jZSBvZiB0aGUgZ2l2ZW4gdHlwZSBhbmQgcmV0cmlldmUgaXQgb24gZWFjaCBjYWxsLlxuICovXG5jb25zdCBzZXJ2aWNlTWFuYWdlciA9IHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIG1hbmFnZXIuXG4gICAqL1xuICBpbml0KCkge1xuICAgIGxvZygnaW5pdCcpO1xuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscyA9IG5ldyBTaWduYWxBbGwoKTtcbiAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKCkgPT4gdGhpcy5yZWFkeSgpKTtcblxuICAgIHRoaXMuc2lnbmFscyA9IHt9O1xuICAgIHRoaXMuc2lnbmFscy5zdGFydCA9IG5ldyBTaWduYWwoKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIHRoZSBzaWduYWwgcmVxdWlyZWQgYnkgYWxsIHNlcnZpY2VzIHRvIHN0YXJ0LlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgbG9nKCdzdGFydCcpO1xuICAgIHRoaXMuc2lnbmFscy5zdGFydC5zZXQodHJ1ZSk7XG5cbiAgICBpZiAoIXRoaXMuX3JlcXVpcmVkU2lnbmFscy5sZW5ndGgpXG4gICAgICB0aGlzLnJlYWR5KCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIE1hcmsgdGhlIHNlcnZpY2VzIGFzIHJlYWR5LiBUaGlzIHNpZ25hbCBpcyBvYnNlcnZlZCBieSB7QGxpbmsgRXhwZXJpZW5jZX1cbiAgICogaW5zdGFuY2VzIGFuZCB0cmlnZ2VyIHRoZWlyIGBzdGFydGAuXG4gICAqL1xuICByZWFkeSgpIHtcbiAgICBsb2coJ3JlYWR5Jyk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgfSxcblxuICAvLyByZXNldCgpIHtcbiAgLy8gICB0aGlzLnNpZ25hbHMuc3RhcnQuc2V0KGZhbHNlKTtcbiAgLy8gICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KGZhbHNlKTtcbiAgLy8gfSxcblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpbnN0YW5jZSBvZiBhIHNlcnZpY2Ugd2l0aCBvcHRpb25zIHRvIGJlIGFwcGxpZWQgdG8gaXRzIGNvbnN0cnVjdG9yLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyB0byBwYXNzIHRvIHRoZSBzZXJ2aWNlIGNvbnN0cnVjdG9yLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWQgPSAnc2VydmljZTonICsgaWQ7XG5cbiAgICBpZiAoIV9jdG9yc1tpZF0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNlcnZpY2UgXCIke2lkfVwiIGRvZXMgbm90IGV4aXN0c2ApO1xuXG4gICAgbGV0IGluc3RhbmNlID0gX2luc3RhbmNlc1tpZF07XG5cbiAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICBpbnN0YW5jZSA9IG5ldyBfY3RvcnNbaWRdKCk7XG4gICAgICAvLyBhZGQgdGhlIGluc3RhbmNlIHJlYWR5IHNpZ25hbCBhcyByZXF1aXJlZCBmb3IgdGhlIG1hbmFnZXJcbiAgICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscy5hZGQoaW5zdGFuY2Uuc2lnbmFscy5yZWFkeSk7XG4gICAgICAvLyBzdG9yZSBpbnN0YW5jZVxuICAgICAgX2luc3RhbmNlc1tpZF0gPSBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICBpbnN0YW5jZS5jb25maWd1cmUob3B0aW9ucyk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIHNlcnZpY2Ugd2l0aCBhIGdpdmVuIGlkLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWdpc3RlcihpZCwgY3Rvcikge1xuICAgIF9jdG9yc1tpZF0gPSBjdG9yO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VydmljZU1hbmFnZXI7XG4iXX0=
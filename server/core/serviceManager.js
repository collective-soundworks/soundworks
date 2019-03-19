'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _Signal = require('../../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('../../utils/SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _ctors = {};
var _instances = {};

/**
 * Manager the services and their relations. Acts as a factory to ensure services
 * are instanciated only once.
 */
var serviceManager = {
  // add an init method
  /**
   *
   *
   */
  init: function init() {
    this._ready = this._ready.bind(this);

    this.signals = {};
    this.signals.start = new _Signal2.default();
    this.signals.ready = new _Signal2.default();

    this._requiredSignals = new _SignalAll2.default();
    this._requiredSignals.addObserver(this._ready);
  },
  start: function start() {
    this.signals.start.set(true);

    if (this._requiredSignals.length === 0) this._ready();
  },
  _ready: function _ready() {
    this.signals.ready.set(true);
  },


  /**
   * Retrieve a service according to the given id. If the service as not beeen
   * requested yet, it is instanciated.
   * @param {String} id - The id of the registered service
   * @param {Object} options - The options to configure the service.
   */
  require: function require(id) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    id = 'service:' + id;

    if (!_ctors[id]) throw new Error('Service "' + id + '" is not defined');

    var instance = _instances[id];

    if (!instance) {
      instance = new _ctors[id]();
      _instances[id] = instance;

      this._requiredSignals.add(instance.signals.ready);
    }

    instance.configure(options);
    return instance;
  },


  /**
   * Regiter a service
   * @param {String} id - The id of the service, in order to retrieve it later.
   * @param {Function} ctor - The constructor of the service.
   */
  register: function register(id, ctor) {
    _ctors[id] = ctor;
  },
  getRequiredServices: function getRequiredServices(clientType) {
    var services = [];

    for (var id in _instances) {
      if (_instances[id].clientTypes.has(clientType)) services.push(id);
    }

    return services;
  },
  getServiceList: function getServiceList() {
    return (0, _keys2.default)(_ctors);
  }
};

exports.default = serviceManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2VNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbIl9jdG9ycyIsIl9pbnN0YW5jZXMiLCJzZXJ2aWNlTWFuYWdlciIsImluaXQiLCJfcmVhZHkiLCJiaW5kIiwic2lnbmFscyIsInN0YXJ0IiwiU2lnbmFsIiwicmVhZHkiLCJfcmVxdWlyZWRTaWduYWxzIiwiU2lnbmFsQWxsIiwiYWRkT2JzZXJ2ZXIiLCJzZXQiLCJsZW5ndGgiLCJyZXF1aXJlIiwiaWQiLCJvcHRpb25zIiwiRXJyb3IiLCJpbnN0YW5jZSIsImFkZCIsImNvbmZpZ3VyZSIsInJlZ2lzdGVyIiwiY3RvciIsImdldFJlcXVpcmVkU2VydmljZXMiLCJjbGllbnRUeXBlIiwic2VydmljZXMiLCJjbGllbnRUeXBlcyIsImhhcyIsInB1c2giLCJnZXRTZXJ2aWNlTGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLFNBQVMsRUFBZjtBQUNBLElBQU1DLGFBQWEsRUFBbkI7O0FBRUE7Ozs7QUFJQSxJQUFNQyxpQkFBaUI7QUFDckI7QUFDQTs7OztBQUlBQyxNQU5xQixrQkFNZDtBQUNMLFNBQUtDLE1BQUwsR0FBYyxLQUFLQSxNQUFMLENBQVlDLElBQVosQ0FBaUIsSUFBakIsQ0FBZDs7QUFFQSxTQUFLQyxPQUFMLEdBQWUsRUFBZjtBQUNBLFNBQUtBLE9BQUwsQ0FBYUMsS0FBYixHQUFxQixJQUFJQyxnQkFBSixFQUFyQjtBQUNBLFNBQUtGLE9BQUwsQ0FBYUcsS0FBYixHQUFxQixJQUFJRCxnQkFBSixFQUFyQjs7QUFFQSxTQUFLRSxnQkFBTCxHQUF3QixJQUFJQyxtQkFBSixFQUF4QjtBQUNBLFNBQUtELGdCQUFMLENBQXNCRSxXQUF0QixDQUFrQyxLQUFLUixNQUF2QztBQUNELEdBZm9CO0FBaUJyQkcsT0FqQnFCLG1CQWlCYjtBQUNOLFNBQUtELE9BQUwsQ0FBYUMsS0FBYixDQUFtQk0sR0FBbkIsQ0FBdUIsSUFBdkI7O0FBRUEsUUFBSSxLQUFLSCxnQkFBTCxDQUFzQkksTUFBdEIsS0FBaUMsQ0FBckMsRUFDRSxLQUFLVixNQUFMO0FBQ0gsR0F0Qm9CO0FBd0JyQkEsUUF4QnFCLG9CQXdCWjtBQUNQLFNBQUtFLE9BQUwsQ0FBYUcsS0FBYixDQUFtQkksR0FBbkIsQ0FBdUIsSUFBdkI7QUFDRCxHQTFCb0I7OztBQTRCckI7Ozs7OztBQU1BRSxTQWxDcUIsbUJBa0NiQyxFQWxDYSxFQWtDSztBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFDeEJELFNBQUssYUFBYUEsRUFBbEI7O0FBRUEsUUFBSSxDQUFDaEIsT0FBT2dCLEVBQVAsQ0FBTCxFQUNFLE1BQU0sSUFBSUUsS0FBSixlQUFzQkYsRUFBdEIsc0JBQU47O0FBRUYsUUFBSUcsV0FBV2xCLFdBQVdlLEVBQVgsQ0FBZjs7QUFFQSxRQUFJLENBQUNHLFFBQUwsRUFBZTtBQUNiQSxpQkFBVyxJQUFJbkIsT0FBT2dCLEVBQVAsQ0FBSixFQUFYO0FBQ0FmLGlCQUFXZSxFQUFYLElBQWlCRyxRQUFqQjs7QUFFQSxXQUFLVCxnQkFBTCxDQUFzQlUsR0FBdEIsQ0FBMEJELFNBQVNiLE9BQVQsQ0FBaUJHLEtBQTNDO0FBQ0Q7O0FBRURVLGFBQVNFLFNBQVQsQ0FBbUJKLE9BQW5CO0FBQ0EsV0FBT0UsUUFBUDtBQUNELEdBbkRvQjs7O0FBcURyQjs7Ozs7QUFLQUcsVUExRHFCLG9CQTBEWk4sRUExRFksRUEwRFJPLElBMURRLEVBMERGO0FBQ2pCdkIsV0FBT2dCLEVBQVAsSUFBYU8sSUFBYjtBQUNELEdBNURvQjtBQThEckJDLHFCQTlEcUIsK0JBOEREQyxVQTlEQyxFQThEVztBQUM5QixRQUFNQyxXQUFXLEVBQWpCOztBQUVBLFNBQUssSUFBSVYsRUFBVCxJQUFlZixVQUFmLEVBQTJCO0FBQ3pCLFVBQUlBLFdBQVdlLEVBQVgsRUFBZVcsV0FBZixDQUEyQkMsR0FBM0IsQ0FBK0JILFVBQS9CLENBQUosRUFDRUMsU0FBU0csSUFBVCxDQUFjYixFQUFkO0FBQ0g7O0FBRUQsV0FBT1UsUUFBUDtBQUNELEdBdkVvQjtBQXlFckJJLGdCQXpFcUIsNEJBeUVKO0FBQ2YsV0FBTyxvQkFBWTlCLE1BQVosQ0FBUDtBQUNEO0FBM0VvQixDQUF2Qjs7a0JBOEVlRSxjIiwiZmlsZSI6InNlcnZpY2VNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuLi8uLi91dGlscy9TaWduYWwnO1xuaW1wb3J0IFNpZ25hbEFsbCBmcm9tICcuLi8uLi91dGlscy9TaWduYWxBbGwnO1xuXG5jb25zdCBfY3RvcnMgPSB7fTtcbmNvbnN0IF9pbnN0YW5jZXMgPSB7fTtcblxuLyoqXG4gKiBNYW5hZ2VyIHRoZSBzZXJ2aWNlcyBhbmQgdGhlaXIgcmVsYXRpb25zLiBBY3RzIGFzIGEgZmFjdG9yeSB0byBlbnN1cmUgc2VydmljZXNcbiAqIGFyZSBpbnN0YW5jaWF0ZWQgb25seSBvbmNlLlxuICovXG5jb25zdCBzZXJ2aWNlTWFuYWdlciA9IHtcbiAgLy8gYWRkIGFuIGluaXQgbWV0aG9kXG4gIC8qKlxuICAgKlxuICAgKlxuICAgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLl9yZWFkeSA9IHRoaXMuX3JlYWR5LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLnNpZ25hbHMgPSB7fTtcbiAgICB0aGlzLnNpZ25hbHMuc3RhcnQgPSBuZXcgU2lnbmFsKCk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5ID0gbmV3IFNpZ25hbCgpO1xuXG4gICAgdGhpcy5fcmVxdWlyZWRTaWduYWxzID0gbmV3IFNpZ25hbEFsbCgpO1xuICAgIHRoaXMuX3JlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcih0aGlzLl9yZWFkeSk7XG4gIH0sXG5cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5zaWduYWxzLnN0YXJ0LnNldCh0cnVlKTtcblxuICAgIGlmICh0aGlzLl9yZXF1aXJlZFNpZ25hbHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fcmVhZHkoKTtcbiAgfSxcblxuICBfcmVhZHkoKSB7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgfSxcblxuICAvKipcbiAgICogUmV0cmlldmUgYSBzZXJ2aWNlIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gaWQuIElmIHRoZSBzZXJ2aWNlIGFzIG5vdCBiZWVlblxuICAgKiByZXF1ZXN0ZWQgeWV0LCBpdCBpcyBpbnN0YW5jaWF0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgcmVnaXN0ZXJlZCBzZXJ2aWNlXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWQgPSAnc2VydmljZTonICsgaWQ7XG5cbiAgICBpZiAoIV9jdG9yc1tpZF0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNlcnZpY2UgXCIke2lkfVwiIGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICBsZXQgaW5zdGFuY2UgPSBfaW5zdGFuY2VzW2lkXTtcblxuICAgIGlmICghaW5zdGFuY2UpIHtcbiAgICAgIGluc3RhbmNlID0gbmV3IF9jdG9yc1tpZF07XG4gICAgICBfaW5zdGFuY2VzW2lkXSA9IGluc3RhbmNlO1xuXG4gICAgICB0aGlzLl9yZXF1aXJlZFNpZ25hbHMuYWRkKGluc3RhbmNlLnNpZ25hbHMucmVhZHkpO1xuICAgIH1cblxuICAgIGluc3RhbmNlLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2l0ZXIgYSBzZXJ2aWNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZSwgaW4gb3JkZXIgdG8gcmV0cmlldmUgaXQgbGF0ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWdpc3RlcihpZCwgY3Rvcikge1xuICAgIF9jdG9yc1tpZF0gPSBjdG9yO1xuICB9LFxuXG4gIGdldFJlcXVpcmVkU2VydmljZXMoY2xpZW50VHlwZSkge1xuICAgIGNvbnN0IHNlcnZpY2VzID0gW107XG5cbiAgICBmb3IgKGxldCBpZCBpbiBfaW5zdGFuY2VzKSB7XG4gICAgICBpZiAoX2luc3RhbmNlc1tpZF0uY2xpZW50VHlwZXMuaGFzKGNsaWVudFR5cGUpKVxuICAgICAgICBzZXJ2aWNlcy5wdXNoKGlkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VydmljZXM7XG4gIH0sXG5cbiAgZ2V0U2VydmljZUxpc3QoKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKF9jdG9ycyk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2aWNlTWFuYWdlcjtcbiJdfQ==
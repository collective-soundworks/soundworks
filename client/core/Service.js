'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Activity2 = require('./Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _serviceManager = require('./serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Signal = require('../../utils/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:services');

/**
 * Base class to be extended in order to create a new service.
 *
 * @memberof module:soundworks/client
 * @extends module:soundworks/client.Activity
 */

var Service = function (_Activity) {
  (0, _inherits3.default)(Service, _Activity);

  /**
   * @param {String} id - The id of the service (should be prefixed with `'service:'`).
   * @param {Boolean} hasNetwork - Define if the service needs an access to the socket
   *  connection.
   */
  function Service(id, hasNetwork) {
    (0, _classCallCheck3.default)(this, Service);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Service.__proto__ || (0, _getPrototypeOf2.default)(Service)).call(this, id, hasNetwork));

    _this.requiredSignals.addObserver(function (value) {
      if (value) {
        _this.start();
        _this.hasStarted = true;
      } else {
        _this.stop();
      }
    });

    /**
     * Is set to `true` when a signal is ready to be consumed.
     * @type {Signal}
     */
    _this.signals.ready = new _Signal2.default();
    // add the serviceManager bootstart signal to the required signals
    _this.waitFor(_serviceManager2.default.signals.start);

    _this.ready = _this.ready.bind(_this);
    return _this;
  }

  /**
   * Allow to require another service as a dependencies. When a service is
   * dependent from another service its `start` method is delayed until all
   * its dependencies are themselves `ready`.
   * @param {String} id - id of the service to require.
   * @param {Object} options - configuration object to be passed to the service.
   */


  (0, _createClass3.default)(Service, [{
    key: 'require',
    value: function require(id, options) {
      var service = _serviceManager2.default.require(id, options);
      var signal = service.signals.ready;

      if (signal) this.waitFor(signal);else throw new Error('signal "continue" doesn\'t exist on service :', service);

      return service;
    }

    /**
     * Method to call in the service lifecycle when it should be considered as
     * `ready` and thus allows all its dependent activities to start themselves.
     */

  }, {
    key: 'ready',
    value: function ready() {
      log('"' + this.id + '" ready');

      this.stop();
      this.signals.ready.set(true);
    }

    /** @inheritdoc */

  }, {
    key: 'start',
    value: function start() {
      log('"' + this.id + '" started');
      (0, _get3.default)(Service.prototype.__proto__ || (0, _getPrototypeOf2.default)(Service.prototype), 'start', this).call(this);
    }

    /** @inheritdoc */

  }, {
    key: 'stop',
    value: function stop() {
      log('"' + this.id + '" stopped');
      (0, _get3.default)(Service.prototype.__proto__ || (0, _getPrototypeOf2.default)(Service.prototype), 'stop', this).call(this);
    }
  }]);
  return Service;
}(_Activity3.default);

exports.default = Service;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOlsibG9nIiwiU2VydmljZSIsImlkIiwiaGFzTmV0d29yayIsInJlcXVpcmVkU2lnbmFscyIsImFkZE9ic2VydmVyIiwidmFsdWUiLCJzdGFydCIsImhhc1N0YXJ0ZWQiLCJzdG9wIiwic2lnbmFscyIsInJlYWR5Iiwid2FpdEZvciIsImJpbmQiLCJvcHRpb25zIiwic2VydmljZSIsInJlcXVpcmUiLCJzaWduYWwiLCJFcnJvciIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE1BQU0scUJBQU0scUJBQU4sQ0FBWjs7QUFHQTs7Ozs7OztJQU1NQyxPOzs7QUFDSjs7Ozs7QUFLQSxtQkFBWUMsRUFBWixFQUFnQkMsVUFBaEIsRUFBNEI7QUFBQTs7QUFBQSx3SUFDcEJELEVBRG9CLEVBQ2hCQyxVQURnQjs7QUFHMUIsVUFBS0MsZUFBTCxDQUFxQkMsV0FBckIsQ0FBaUMsVUFBQ0MsS0FBRCxFQUFXO0FBQzFDLFVBQUlBLEtBQUosRUFBVztBQUNULGNBQUtDLEtBQUw7QUFDQSxjQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsY0FBS0MsSUFBTDtBQUNEO0FBQ0YsS0FQRDs7QUFTQTs7OztBQUlBLFVBQUtDLE9BQUwsQ0FBYUMsS0FBYixHQUFxQixzQkFBckI7QUFDQTtBQUNBLFVBQUtDLE9BQUwsQ0FBYSx5QkFBZUYsT0FBZixDQUF1QkgsS0FBcEM7O0FBRUEsVUFBS0ksS0FBTCxHQUFhLE1BQUtBLEtBQUwsQ0FBV0UsSUFBWCxPQUFiO0FBcEIwQjtBQXFCM0I7O0FBRUQ7Ozs7Ozs7Ozs7OzRCQU9RWCxFLEVBQUlZLE8sRUFBUztBQUNuQixVQUFNQyxVQUFVLHlCQUFlQyxPQUFmLENBQXVCZCxFQUF2QixFQUEyQlksT0FBM0IsQ0FBaEI7QUFDQSxVQUFNRyxTQUFTRixRQUFRTCxPQUFSLENBQWdCQyxLQUEvQjs7QUFFQSxVQUFJTSxNQUFKLEVBQ0UsS0FBS0wsT0FBTCxDQUFhSyxNQUFiLEVBREYsS0FHRSxNQUFNLElBQUlDLEtBQUosa0RBQTBESCxPQUExRCxDQUFOOztBQUVGLGFBQU9BLE9BQVA7QUFDRDs7QUFFRDs7Ozs7Ozs0QkFJUTtBQUNOZixnQkFBUSxLQUFLRSxFQUFiOztBQUVBLFdBQUtPLElBQUw7QUFDQSxXQUFLQyxPQUFMLENBQWFDLEtBQWIsQ0FBbUJRLEdBQW5CLENBQXVCLElBQXZCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFDTm5CLGdCQUFRLEtBQUtFLEVBQWI7QUFDQTtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0xGLGdCQUFRLEtBQUtFLEVBQWI7QUFDQTtBQUNEOzs7OztrQkFHWUQsTyIsImZpbGUiOiJTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4vQWN0aXZpdHknO1xuaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi4vLi4vdXRpbHMvU2lnbmFsJztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c2VydmljZXMnKTtcblxuXG4vKipcbiAqIEJhc2UgY2xhc3MgdG8gYmUgZXh0ZW5kZWQgaW4gb3JkZXIgdG8gY3JlYXRlIGEgbmV3IHNlcnZpY2UuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4dGVuZHMgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkFjdGl2aXR5XG4gKi9cbmNsYXNzIFNlcnZpY2UgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBUaGUgaWQgb2YgdGhlIHNlcnZpY2UgKHNob3VsZCBiZSBwcmVmaXhlZCB3aXRoIGAnc2VydmljZTonYCkuXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaGFzTmV0d29yayAtIERlZmluZSBpZiB0aGUgc2VydmljZSBuZWVkcyBhbiBhY2Nlc3MgdG8gdGhlIHNvY2tldFxuICAgKiAgY29ubmVjdGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKGlkLCBoYXNOZXR3b3JrKSB7XG4gICAgc3VwZXIoaWQsIGhhc05ldHdvcmspO1xuXG4gICAgdGhpcy5yZXF1aXJlZFNpZ25hbHMuYWRkT2JzZXJ2ZXIoKHZhbHVlKSA9PiB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zdGFydCgpO1xuICAgICAgICB0aGlzLmhhc1N0YXJ0ZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gYHRydWVgIHdoZW4gYSBzaWduYWwgaXMgcmVhZHkgdG8gYmUgY29uc3VtZWQuXG4gICAgICogQHR5cGUge1NpZ25hbH1cbiAgICAgKi9cbiAgICB0aGlzLnNpZ25hbHMucmVhZHkgPSBuZXcgU2lnbmFsKCk7XG4gICAgLy8gYWRkIHRoZSBzZXJ2aWNlTWFuYWdlciBib290c3RhcnQgc2lnbmFsIHRvIHRoZSByZXF1aXJlZCBzaWduYWxzXG4gICAgdGhpcy53YWl0Rm9yKHNlcnZpY2VNYW5hZ2VyLnNpZ25hbHMuc3RhcnQpO1xuXG4gICAgdGhpcy5yZWFkeSA9IHRoaXMucmVhZHkuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyB0byByZXF1aXJlIGFub3RoZXIgc2VydmljZSBhcyBhIGRlcGVuZGVuY2llcy4gV2hlbiBhIHNlcnZpY2UgaXNcbiAgICogZGVwZW5kZW50IGZyb20gYW5vdGhlciBzZXJ2aWNlIGl0cyBgc3RhcnRgIG1ldGhvZCBpcyBkZWxheWVkIHVudGlsIGFsbFxuICAgKiBpdHMgZGVwZW5kZW5jaWVzIGFyZSB0aGVtc2VsdmVzIGByZWFkeWAuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIGlkIG9mIHRoZSBzZXJ2aWNlIHRvIHJlcXVpcmUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gY29uZmlndXJhdGlvbiBvYmplY3QgdG8gYmUgcGFzc2VkIHRvIHRoZSBzZXJ2aWNlLlxuICAgKi9cbiAgcmVxdWlyZShpZCwgb3B0aW9ucykge1xuICAgIGNvbnN0IHNlcnZpY2UgPSBzZXJ2aWNlTWFuYWdlci5yZXF1aXJlKGlkLCBvcHRpb25zKTtcbiAgICBjb25zdCBzaWduYWwgPSBzZXJ2aWNlLnNpZ25hbHMucmVhZHk7XG5cbiAgICBpZiAoc2lnbmFsKVxuICAgICAgdGhpcy53YWl0Rm9yKHNpZ25hbCk7XG4gICAgZWxzZVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzaWduYWwgXCJjb250aW51ZVwiIGRvZXNuJ3QgZXhpc3Qgb24gc2VydmljZSA6YCwgc2VydmljZSk7XG5cbiAgICByZXR1cm4gc2VydmljZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZXRob2QgdG8gY2FsbCBpbiB0aGUgc2VydmljZSBsaWZlY3ljbGUgd2hlbiBpdCBzaG91bGQgYmUgY29uc2lkZXJlZCBhc1xuICAgKiBgcmVhZHlgIGFuZCB0aHVzIGFsbG93cyBhbGwgaXRzIGRlcGVuZGVudCBhY3Rpdml0aWVzIHRvIHN0YXJ0IHRoZW1zZWx2ZXMuXG4gICAqL1xuICByZWFkeSgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHJlYWR5YCk7XG5cbiAgICB0aGlzLnN0b3AoKTtcbiAgICB0aGlzLnNpZ25hbHMucmVhZHkuc2V0KHRydWUpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgc3RhcnRlZGApO1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RvcCgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0b3BwZWRgKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VydmljZTtcblxuIl19
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

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _SignalAll = require('./SignalAll');

var _SignalAll2 = _interopRequireDefault(_SignalAll);

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
    _this.requiredSignals.add(_serviceManager2.default.signals.start);
    return _this;
  }

  /**
   * Method to call in the service lifecycle when it should be considered as
   * `ready` and thus allows all its dependent activities to start themselves.
   */


  (0, _createClass3.default)(Service, [{
    key: 'ready',
    value: function ready() {
      this.stop();
      log('"' + this.id + '" ready');
      this.signals.ready.set(true);
    }

    /**
     * Allow to require another service as a dependencies. When a service is
     * dependent from another service its `start` method is delayed until all
     * its dependencies are themselves `ready`.
     * @param {String} id - id of the service to require.
     * @param {Object} options - configuration object to be passed to the service.
     */

  }, {
    key: 'require',
    value: function require(id, options) {
      var service = _serviceManager2.default.require(id, options);
      var signal = service.signals.ready;

      if (signal) this.requiredSignals.add(signal);else throw new Error('signal "continue" doesn\'t exist on service :', service);

      return service;
    }

    /**
     * Lifecycle method to initialize the service. Must be called manually.
     * @example
     * // in the `start` method implementation
     * if (!this.hasStarted)
     *   this.init();
     */

  }, {
    key: 'init',
    value: function init() {}

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOlsibG9nIiwiU2VydmljZSIsImlkIiwiaGFzTmV0d29yayIsInJlcXVpcmVkU2lnbmFscyIsImFkZE9ic2VydmVyIiwidmFsdWUiLCJzdGFydCIsImhhc1N0YXJ0ZWQiLCJzdG9wIiwic2lnbmFscyIsInJlYWR5IiwiYWRkIiwic2V0Iiwib3B0aW9ucyIsInNlcnZpY2UiLCJyZXF1aXJlIiwic2lnbmFsIiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE1BQU0scUJBQU0scUJBQU4sQ0FBWjs7QUFHQTs7Ozs7OztJQU1NQyxPOzs7QUFDSjs7Ozs7QUFLQSxtQkFBWUMsRUFBWixFQUFnQkMsVUFBaEIsRUFBNEI7QUFBQTs7QUFBQSx3SUFDcEJELEVBRG9CLEVBQ2hCQyxVQURnQjs7QUFHMUIsVUFBS0MsZUFBTCxDQUFxQkMsV0FBckIsQ0FBaUMsVUFBQ0MsS0FBRCxFQUFXO0FBQzFDLFVBQUlBLEtBQUosRUFBVztBQUNULGNBQUtDLEtBQUw7QUFDQSxjQUFLQyxVQUFMLEdBQWtCLElBQWxCO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsY0FBS0MsSUFBTDtBQUNEO0FBQ0YsS0FQRDs7QUFTQTs7OztBQUlBLFVBQUtDLE9BQUwsQ0FBYUMsS0FBYixHQUFxQixzQkFBckI7QUFDQTtBQUNBLFVBQUtQLGVBQUwsQ0FBcUJRLEdBQXJCLENBQXlCLHlCQUFlRixPQUFmLENBQXVCSCxLQUFoRDtBQWxCMEI7QUFtQjNCOztBQUVEOzs7Ozs7Ozs0QkFJUTtBQUNOLFdBQUtFLElBQUw7QUFDQVQsZ0JBQVEsS0FBS0UsRUFBYjtBQUNBLFdBQUtRLE9BQUwsQ0FBYUMsS0FBYixDQUFtQkUsR0FBbkIsQ0FBdUIsSUFBdkI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs0QkFPUVgsRSxFQUFJWSxPLEVBQVM7QUFDbkIsVUFBTUMsVUFBVSx5QkFBZUMsT0FBZixDQUF1QmQsRUFBdkIsRUFBMkJZLE9BQTNCLENBQWhCO0FBQ0EsVUFBTUcsU0FBU0YsUUFBUUwsT0FBUixDQUFnQkMsS0FBL0I7O0FBRUEsVUFBSU0sTUFBSixFQUNFLEtBQUtiLGVBQUwsQ0FBcUJRLEdBQXJCLENBQXlCSyxNQUF6QixFQURGLEtBR0UsTUFBTSxJQUFJQyxLQUFKLGtEQUEwREgsT0FBMUQsQ0FBTjs7QUFFRixhQUFPQSxPQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7MkJBT08sQ0FBRTs7QUFFVDs7Ozs0QkFDUTtBQUNOZixnQkFBUSxLQUFLRSxFQUFiO0FBQ0E7QUFDRDs7QUFFRDs7OzsyQkFDTztBQUNMRixnQkFBUSxLQUFLRSxFQUFiO0FBQ0E7QUFDRDs7Ozs7a0JBR1lELE8iLCJmaWxlIjoiU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTaWduYWxBbGwgZnJvbSAnLi9TaWduYWxBbGwnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlcycpO1xuXG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgYSBuZXcgc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAqL1xuY2xhc3MgU2VydmljZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZSAoc2hvdWxkIGJlIHByZWZpeGVkIHdpdGggYCdzZXJ2aWNlOidgKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBoYXNOZXR3b3JrIC0gRGVmaW5lIGlmIHRoZSBzZXJ2aWNlIG5lZWRzIGFuIGFjY2VzcyB0byB0aGUgc29ja2V0XG4gICAqICBjb25uZWN0aW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmspIHtcbiAgICBzdXBlcihpZCwgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIElzIHNldCB0byBgdHJ1ZWAgd2hlbiBhIHNpZ25hbCBpcyByZWFkeSB0byBiZSBjb25zdW1lZC5cbiAgICAgKiBAdHlwZSB7U2lnbmFsfVxuICAgICAqL1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeSA9IG5ldyBTaWduYWwoKTtcbiAgICAvLyBhZGQgdGhlIHNlcnZpY2VNYW5hZ2VyIGJvb3RzdGFydCBzaWduYWwgdG8gdGhlIHJlcXVpcmVkIHNpZ25hbHNcbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGQoc2VydmljZU1hbmFnZXIuc2lnbmFscy5zdGFydCk7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHRvIGNhbGwgaW4gdGhlIHNlcnZpY2UgbGlmZWN5Y2xlIHdoZW4gaXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXNcbiAgICogYHJlYWR5YCBhbmQgdGh1cyBhbGxvd3MgYWxsIGl0cyBkZXBlbmRlbnQgYWN0aXZpdGllcyB0byBzdGFydCB0aGVtc2VsdmVzLlxuICAgKi9cbiAgcmVhZHkoKSB7XG4gICAgdGhpcy5zdG9wKCk7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiByZWFkeWApO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeS5zZXQodHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgdG8gcmVxdWlyZSBhbm90aGVyIHNlcnZpY2UgYXMgYSBkZXBlbmRlbmNpZXMuIFdoZW4gYSBzZXJ2aWNlIGlzXG4gICAqIGRlcGVuZGVudCBmcm9tIGFub3RoZXIgc2VydmljZSBpdHMgYHN0YXJ0YCBtZXRob2QgaXMgZGVsYXllZCB1bnRpbCBhbGxcbiAgICogaXRzIGRlcGVuZGVuY2llcyBhcmUgdGhlbXNlbHZlcyBgcmVhZHlgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBpZCBvZiB0aGUgc2VydmljZSB0byByZXF1aXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBzZXJ2aWNlID0gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gICAgY29uc3Qgc2lnbmFsID0gc2VydmljZS5zaWduYWxzLnJlYWR5O1xuXG4gICAgaWYgKHNpZ25hbClcbiAgICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZChzaWduYWwpO1xuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2lnbmFsIFwiY29udGludWVcIiBkb2Vzbid0IGV4aXN0IG9uIHNlcnZpY2UgOmAsIHNlcnZpY2UpO1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogTGlmZWN5Y2xlIG1ldGhvZCB0byBpbml0aWFsaXplIHRoZSBzZXJ2aWNlLiBNdXN0IGJlIGNhbGxlZCBtYW51YWxseS5cbiAgICogQGV4YW1wbGVcbiAgICogLy8gaW4gdGhlIGBzdGFydGAgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4gICAqIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgKiAgIHRoaXMuaW5pdCgpO1xuICAgKi9cbiAgaW5pdCgpIHt9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgc3RhcnRlZGApO1xuICAgIHN1cGVyLnN0YXJ0KCk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RvcCgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0b3BwZWRgKTtcbiAgICBzdXBlci5zdG9wKCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2VydmljZTtcblxuIl19
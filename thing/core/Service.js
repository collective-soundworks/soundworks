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

var _serviceManager = require('../../client/core/serviceManager');

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
        _this.hasStarted = true; // keep this for Orbe/Nodal compatibility
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOlsibG9nIiwiU2VydmljZSIsImlkIiwiaGFzTmV0d29yayIsInJlcXVpcmVkU2lnbmFscyIsImFkZE9ic2VydmVyIiwidmFsdWUiLCJzdGFydCIsImhhc1N0YXJ0ZWQiLCJzdG9wIiwic2lnbmFscyIsInJlYWR5IiwiU2lnbmFsIiwid2FpdEZvciIsInNlcnZpY2VNYW5hZ2VyIiwiYmluZCIsIm9wdGlvbnMiLCJzZXJ2aWNlIiwicmVxdWlyZSIsInNpZ25hbCIsIkVycm9yIiwic2V0IiwiQWN0aXZpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNLHFCQUFNLHFCQUFOLENBQVo7O0FBR0E7Ozs7Ozs7SUFNTUMsTzs7O0FBQ0o7Ozs7O0FBS0EsbUJBQVlDLEVBQVosRUFBZ0JDLFVBQWhCLEVBQTRCO0FBQUE7O0FBQUEsd0lBQ3BCRCxFQURvQixFQUNoQkMsVUFEZ0I7O0FBRzFCLFVBQUtDLGVBQUwsQ0FBcUJDLFdBQXJCLENBQWlDLFVBQUNDLEtBQUQsRUFBVztBQUMxQyxVQUFJQSxLQUFKLEVBQVc7QUFDVCxjQUFLQyxLQUFMO0FBQ0EsY0FBS0MsVUFBTCxHQUFrQixJQUFsQixDQUZTLENBRWU7QUFDekIsT0FIRCxNQUdPO0FBQ0wsY0FBS0MsSUFBTDtBQUNEO0FBQ0YsS0FQRDs7QUFTQTs7OztBQUlBLFVBQUtDLE9BQUwsQ0FBYUMsS0FBYixHQUFxQixJQUFJQyxnQkFBSixFQUFyQjtBQUNBO0FBQ0EsVUFBS0MsT0FBTCxDQUFhQyx5QkFBZUosT0FBZixDQUF1QkgsS0FBcEM7O0FBRUEsVUFBS0ksS0FBTCxHQUFhLE1BQUtBLEtBQUwsQ0FBV0ksSUFBWCxPQUFiO0FBcEIwQjtBQXFCM0I7O0FBRUQ7Ozs7Ozs7Ozs7OzRCQU9RYixFLEVBQUljLE8sRUFBUztBQUNuQixVQUFNQyxVQUFVSCx5QkFBZUksT0FBZixDQUF1QmhCLEVBQXZCLEVBQTJCYyxPQUEzQixDQUFoQjtBQUNBLFVBQU1HLFNBQVNGLFFBQVFQLE9BQVIsQ0FBZ0JDLEtBQS9COztBQUVBLFVBQUlRLE1BQUosRUFDRSxLQUFLTixPQUFMLENBQWFNLE1BQWIsRUFERixLQUdFLE1BQU0sSUFBSUMsS0FBSixrREFBMERILE9BQTFELENBQU47O0FBRUYsYUFBT0EsT0FBUDtBQUNEOztBQUVEOzs7Ozs7OzRCQUlRO0FBQ05qQixnQkFBUSxLQUFLRSxFQUFiOztBQUVBLFdBQUtPLElBQUw7QUFDQSxXQUFLQyxPQUFMLENBQWFDLEtBQWIsQ0FBbUJVLEdBQW5CLENBQXVCLElBQXZCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFDTnJCLGdCQUFRLEtBQUtFLEVBQWI7QUFDQTtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0xGLGdCQUFRLEtBQUtFLEVBQWI7QUFDQTtBQUNEOzs7RUFyRW1Cb0Isa0I7O2tCQXdFUHJCLE8iLCJmaWxlIjoiU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vLi4vY2xpZW50L2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi8uLi91dGlscy9TaWduYWwnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3JrczpzZXJ2aWNlcycpO1xuXG5cbi8qKlxuICogQmFzZSBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgYSBuZXcgc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXh0ZW5kcyBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuQWN0aXZpdHlcbiAqL1xuY2xhc3MgU2VydmljZSBleHRlbmRzIEFjdGl2aXR5IHtcbiAgLyoqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZSAoc2hvdWxkIGJlIHByZWZpeGVkIHdpdGggYCdzZXJ2aWNlOidgKS5cbiAgICogQHBhcmFtIHtCb29sZWFufSBoYXNOZXR3b3JrIC0gRGVmaW5lIGlmIHRoZSBzZXJ2aWNlIG5lZWRzIGFuIGFjY2VzcyB0byB0aGUgc29ja2V0XG4gICAqICBjb25uZWN0aW9uLlxuICAgKi9cbiAgY29uc3RydWN0b3IoaWQsIGhhc05ldHdvcmspIHtcbiAgICBzdXBlcihpZCwgaGFzTmV0d29yayk7XG5cbiAgICB0aGlzLnJlcXVpcmVkU2lnbmFscy5hZGRPYnNlcnZlcigodmFsdWUpID0+IHtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0KCk7XG4gICAgICAgIHRoaXMuaGFzU3RhcnRlZCA9IHRydWU7IC8vIGtlZXAgdGhpcyBmb3IgT3JiZS9Ob2RhbCBjb21wYXRpYmlsaXR5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8qKlxuICAgICAqIElzIHNldCB0byBgdHJ1ZWAgd2hlbiBhIHNpZ25hbCBpcyByZWFkeSB0byBiZSBjb25zdW1lZC5cbiAgICAgKiBAdHlwZSB7U2lnbmFsfVxuICAgICAqL1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeSA9IG5ldyBTaWduYWwoKTtcbiAgICAvLyBhZGQgdGhlIHNlcnZpY2VNYW5hZ2VyIGJvb3RzdGFydCBzaWduYWwgdG8gdGhlIHJlcXVpcmVkIHNpZ25hbHNcbiAgICB0aGlzLndhaXRGb3Ioc2VydmljZU1hbmFnZXIuc2lnbmFscy5zdGFydCk7XG5cbiAgICB0aGlzLnJlYWR5ID0gdGhpcy5yZWFkeS5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsbG93IHRvIHJlcXVpcmUgYW5vdGhlciBzZXJ2aWNlIGFzIGEgZGVwZW5kZW5jaWVzLiBXaGVuIGEgc2VydmljZSBpc1xuICAgKiBkZXBlbmRlbnQgZnJvbSBhbm90aGVyIHNlcnZpY2UgaXRzIGBzdGFydGAgbWV0aG9kIGlzIGRlbGF5ZWQgdW50aWwgYWxsXG4gICAqIGl0cyBkZXBlbmRlbmNpZXMgYXJlIHRoZW1zZWx2ZXMgYHJlYWR5YC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gaWQgb2YgdGhlIHNlcnZpY2UgdG8gcmVxdWlyZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBjb25maWd1cmF0aW9uIG9iamVjdCB0byBiZSBwYXNzZWQgdG8gdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgc2VydmljZSA9IHNlcnZpY2VNYW5hZ2VyLnJlcXVpcmUoaWQsIG9wdGlvbnMpO1xuICAgIGNvbnN0IHNpZ25hbCA9IHNlcnZpY2Uuc2lnbmFscy5yZWFkeTtcblxuICAgIGlmIChzaWduYWwpXG4gICAgICB0aGlzLndhaXRGb3Ioc2lnbmFsKTtcbiAgICBlbHNlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYHNpZ25hbCBcImNvbnRpbnVlXCIgZG9lc24ndCBleGlzdCBvbiBzZXJ2aWNlIDpgLCBzZXJ2aWNlKTtcblxuICAgIHJldHVybiBzZXJ2aWNlO1xuICB9XG5cbiAgLyoqXG4gICAqIE1ldGhvZCB0byBjYWxsIGluIHRoZSBzZXJ2aWNlIGxpZmVjeWNsZSB3aGVuIGl0IHNob3VsZCBiZSBjb25zaWRlcmVkIGFzXG4gICAqIGByZWFkeWAgYW5kIHRodXMgYWxsb3dzIGFsbCBpdHMgZGVwZW5kZW50IGFjdGl2aXRpZXMgdG8gc3RhcnQgdGhlbXNlbHZlcy5cbiAgICovXG4gIHJlYWR5KCkge1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgcmVhZHlgKTtcblxuICAgIHRoaXMuc3RvcCgpO1xuICAgIHRoaXMuc2lnbmFscy5yZWFkeS5zZXQodHJ1ZSk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiBzdGFydGVkYCk7XG4gICAgc3VwZXIuc3RhcnQoKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdG9wKCkge1xuICAgIGxvZyhgXCIke3RoaXMuaWR9XCIgc3RvcHBlZGApO1xuICAgIHN1cGVyLnN0b3AoKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTZXJ2aWNlO1xuXG4iXX0=
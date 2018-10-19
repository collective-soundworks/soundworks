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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2UuanMiXSwibmFtZXMiOlsibG9nIiwiU2VydmljZSIsImlkIiwiaGFzTmV0d29yayIsInJlcXVpcmVkU2lnbmFscyIsImFkZE9ic2VydmVyIiwidmFsdWUiLCJzdGFydCIsImhhc1N0YXJ0ZWQiLCJzdG9wIiwic2lnbmFscyIsInJlYWR5IiwiU2lnbmFsIiwid2FpdEZvciIsInNlcnZpY2VNYW5hZ2VyIiwiYmluZCIsIm9wdGlvbnMiLCJzZXJ2aWNlIiwicmVxdWlyZSIsInNpZ25hbCIsIkVycm9yIiwic2V0IiwiQWN0aXZpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNQSxNQUFNLHFCQUFNLHFCQUFOLENBQVo7O0FBR0E7Ozs7Ozs7SUFNTUMsTzs7O0FBQ0o7Ozs7O0FBS0EsbUJBQVlDLEVBQVosRUFBZ0JDLFVBQWhCLEVBQTRCO0FBQUE7O0FBQUEsd0lBQ3BCRCxFQURvQixFQUNoQkMsVUFEZ0I7O0FBRzFCLFVBQUtDLGVBQUwsQ0FBcUJDLFdBQXJCLENBQWlDLFVBQUNDLEtBQUQsRUFBVztBQUMxQyxVQUFJQSxLQUFKLEVBQVc7QUFDVCxjQUFLQyxLQUFMO0FBQ0EsY0FBS0MsVUFBTCxHQUFrQixJQUFsQixDQUZTLENBRWU7QUFDekIsT0FIRCxNQUdPO0FBQ0wsY0FBS0MsSUFBTDtBQUNEO0FBQ0YsS0FQRDs7QUFTQTs7OztBQUlBLFVBQUtDLE9BQUwsQ0FBYUMsS0FBYixHQUFxQixJQUFJQyxnQkFBSixFQUFyQjtBQUNBO0FBQ0EsVUFBS0MsT0FBTCxDQUFhQyx5QkFBZUosT0FBZixDQUF1QkgsS0FBcEM7O0FBRUEsVUFBS0ksS0FBTCxHQUFhLE1BQUtBLEtBQUwsQ0FBV0ksSUFBWCxPQUFiO0FBcEIwQjtBQXFCM0I7O0FBRUQ7Ozs7Ozs7Ozs7OzRCQU9RYixFLEVBQUljLE8sRUFBUztBQUNuQixVQUFNQyxVQUFVSCx5QkFBZUksT0FBZixDQUF1QmhCLEVBQXZCLEVBQTJCYyxPQUEzQixDQUFoQjtBQUNBLFVBQU1HLFNBQVNGLFFBQVFQLE9BQVIsQ0FBZ0JDLEtBQS9COztBQUVBLFVBQUlRLE1BQUosRUFDRSxLQUFLTixPQUFMLENBQWFNLE1BQWIsRUFERixLQUdFLE1BQU0sSUFBSUMsS0FBSixrREFBMERILE9BQTFELENBQU47O0FBRUYsYUFBT0EsT0FBUDtBQUNEOztBQUVEOzs7Ozs7OzRCQUlRO0FBQ05qQixnQkFBUSxLQUFLRSxFQUFiOztBQUVBLFdBQUtPLElBQUw7QUFDQSxXQUFLQyxPQUFMLENBQWFDLEtBQWIsQ0FBbUJVLEdBQW5CLENBQXVCLElBQXZCO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1E7QUFDTnJCLGdCQUFRLEtBQUtFLEVBQWI7QUFDQTtBQUNEOztBQUVEOzs7OzJCQUNPO0FBQ0xGLGdCQUFRLEtBQUtFLEVBQWI7QUFDQTtBQUNEOzs7RUFyRW1Cb0Isa0I7O2tCQXdFUHJCLE8iLCJmaWxlIjoiU2VydmljZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuL0FjdGl2aXR5JztcbmltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uLy4uL3V0aWxzL1NpZ25hbCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNlcnZpY2VzJyk7XG5cblxuLyoqXG4gKiBCYXNlIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGluIG9yZGVyIHRvIGNyZWF0ZSBhIG5ldyBzZXJ2aWNlLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleHRlbmRzIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5BY3Rpdml0eVxuICovXG5jbGFzcyBTZXJ2aWNlIGV4dGVuZHMgQWN0aXZpdHkge1xuICAvKipcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlIChzaG91bGQgYmUgcHJlZml4ZWQgd2l0aCBgJ3NlcnZpY2U6J2ApLlxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGhhc05ldHdvcmsgLSBEZWZpbmUgaWYgdGhlIHNlcnZpY2UgbmVlZHMgYW4gYWNjZXNzIHRvIHRoZSBzb2NrZXRcbiAgICogIGNvbm5lY3Rpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCwgaGFzTmV0d29yaykge1xuICAgIHN1cGVyKGlkLCBoYXNOZXR3b3JrKTtcblxuICAgIHRoaXMucmVxdWlyZWRTaWduYWxzLmFkZE9ic2VydmVyKCh2YWx1ZSkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMuc3RhcnQoKTtcbiAgICAgICAgdGhpcy5oYXNTdGFydGVkID0gdHJ1ZTsgLy8ga2VlcCB0aGlzIGZvciBPcmJlL05vZGFsIGNvbXBhdGliaWxpdHlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc3RvcCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLyoqXG4gICAgICogSXMgc2V0IHRvIGB0cnVlYCB3aGVuIGEgc2lnbmFsIGlzIHJlYWR5IHRvIGJlIGNvbnN1bWVkLlxuICAgICAqIEB0eXBlIHtTaWduYWx9XG4gICAgICovXG4gICAgdGhpcy5zaWduYWxzLnJlYWR5ID0gbmV3IFNpZ25hbCgpO1xuICAgIC8vIGFkZCB0aGUgc2VydmljZU1hbmFnZXIgYm9vdHN0YXJ0IHNpZ25hbCB0byB0aGUgcmVxdWlyZWQgc2lnbmFsc1xuICAgIHRoaXMud2FpdEZvcihzZXJ2aWNlTWFuYWdlci5zaWduYWxzLnN0YXJ0KTtcblxuICAgIHRoaXMucmVhZHkgPSB0aGlzLnJlYWR5LmJpbmQodGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogQWxsb3cgdG8gcmVxdWlyZSBhbm90aGVyIHNlcnZpY2UgYXMgYSBkZXBlbmRlbmNpZXMuIFdoZW4gYSBzZXJ2aWNlIGlzXG4gICAqIGRlcGVuZGVudCBmcm9tIGFub3RoZXIgc2VydmljZSBpdHMgYHN0YXJ0YCBtZXRob2QgaXMgZGVsYXllZCB1bnRpbCBhbGxcbiAgICogaXRzIGRlcGVuZGVuY2llcyBhcmUgdGhlbXNlbHZlcyBgcmVhZHlgLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgLSBpZCBvZiB0aGUgc2VydmljZSB0byByZXF1aXJlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRvIGJlIHBhc3NlZCB0byB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBzZXJ2aWNlID0gc2VydmljZU1hbmFnZXIucmVxdWlyZShpZCwgb3B0aW9ucyk7XG4gICAgY29uc3Qgc2lnbmFsID0gc2VydmljZS5zaWduYWxzLnJlYWR5O1xuXG4gICAgaWYgKHNpZ25hbClcbiAgICAgIHRoaXMud2FpdEZvcihzaWduYWwpO1xuICAgIGVsc2VcbiAgICAgIHRocm93IG5ldyBFcnJvcihgc2lnbmFsIFwiY29udGludWVcIiBkb2Vzbid0IGV4aXN0IG9uIHNlcnZpY2UgOmAsIHNlcnZpY2UpO1xuXG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gIH1cblxuICAvKipcbiAgICogTWV0aG9kIHRvIGNhbGwgaW4gdGhlIHNlcnZpY2UgbGlmZWN5Y2xlIHdoZW4gaXQgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYXNcbiAgICogYHJlYWR5YCBhbmQgdGh1cyBhbGxvd3MgYWxsIGl0cyBkZXBlbmRlbnQgYWN0aXZpdGllcyB0byBzdGFydCB0aGVtc2VsdmVzLlxuICAgKi9cbiAgcmVhZHkoKSB7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiByZWFkeWApO1xuXG4gICAgdGhpcy5zdG9wKCk7XG4gICAgdGhpcy5zaWduYWxzLnJlYWR5LnNldCh0cnVlKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBsb2coYFwiJHt0aGlzLmlkfVwiIHN0YXJ0ZWRgKTtcbiAgICBzdXBlci5zdGFydCgpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0b3AoKSB7XG4gICAgbG9nKGBcIiR7dGhpcy5pZH1cIiBzdG9wcGVkYCk7XG4gICAgc3VwZXIuc3RvcCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZpY2U7XG5cbiJdfQ==
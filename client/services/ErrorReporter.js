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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:error-reporter';

/**
 * Interface for the client `'error-reporter'` service.
 *
 * This service allows to log javascript errors that could occur during the
 * application life cycle. Errors are catch and send to the server in order
 * to be persisted in a file.
 * By default, the log file are located in the `logs/clients` directory inside
 * the application directory.
 *
 * *The service is automatically launched whenever the application detects the
 * use of a networked activity. It should never be required manually inside
 * an application.*
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.ErrorReporter}*__
 *
 * @memberof module:soundworks/client
 */

var ErrorReporter = function (_Service) {
  (0, _inherits3.default)(ErrorReporter, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function ErrorReporter() {
    (0, _classCallCheck3.default)(this, ErrorReporter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ErrorReporter).call(this, SERVICE_ID, true));

    _this._onError = _this._onError.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(ErrorReporter, [{
    key: 'init',
    value: function init() {
      window.addEventListener('error', this._onError);
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ErrorReporter.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.ready();
    }

    /** @private */

  }, {
    key: '_onError',
    value: function _onError(e) {
      var stack = void 0;
      var file = e.filename;
      file = file.replace(window.location.origin, '');
      var line = e.lineno;
      var col = e.colno;
      var msg = e.message;
      var userAgent = navigator.userAgent;

      this.send('error', file, line, col, msg, userAgent);
    }
  }]);
  return ErrorReporter;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ErrorReporter);

exports.default = ErrorReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTSxhQUFhLHdCQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQk0sYTs7Ozs7QUFFSiwyQkFBYztBQUFBOztBQUFBLHVIQUNOLFVBRE0sRUFDTSxJQUROOztBQUdaLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBSFk7QUFJYjs7Ozs7OzsyQkFHTTtBQUNMLGFBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsS0FBSyxRQUF0QztBQUNEOzs7Ozs7NEJBR087QUFDTjs7QUFFQSxVQUFJLENBQUMsS0FBSyxVQUFWLEVBQ0UsS0FBSyxJQUFMOztBQUVGLFdBQUssS0FBTDtBQUNEOzs7Ozs7NkJBR1EsQyxFQUFHO0FBQ1YsVUFBSSxjQUFKO0FBQ0EsVUFBSSxPQUFPLEVBQUUsUUFBYjtBQUNBLGFBQU8sS0FBSyxPQUFMLENBQWEsT0FBTyxRQUFQLENBQWdCLE1BQTdCLEVBQXFDLEVBQXJDLENBQVA7QUFDQSxVQUFNLE9BQU8sRUFBRSxNQUFmO0FBQ0EsVUFBTSxNQUFNLEVBQUUsS0FBZDtBQUNBLFVBQU0sTUFBTSxFQUFFLE9BQWQ7QUFDQSxVQUFNLFlBQVksVUFBVSxTQUE1Qjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLEdBQS9CLEVBQW9DLEdBQXBDLEVBQXlDLFNBQXpDO0FBQ0Q7Ozs7O0FBR0gseUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxhQUFwQzs7a0JBRWUsYSIsImZpbGUiOiJFcnJvclJlcG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6ZXJyb3ItcmVwb3J0ZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ2Vycm9yLXJlcG9ydGVyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIGxvZyBqYXZhc2NyaXB0IGVycm9ycyB0aGF0IGNvdWxkIG9jY3VyIGR1cmluZyB0aGVcbiAqIGFwcGxpY2F0aW9uIGxpZmUgY3ljbGUuIEVycm9ycyBhcmUgY2F0Y2ggYW5kIHNlbmQgdG8gdGhlIHNlcnZlciBpbiBvcmRlclxuICogdG8gYmUgcGVyc2lzdGVkIGluIGEgZmlsZS5cbiAqIEJ5IGRlZmF1bHQsIHRoZSBsb2cgZmlsZSBhcmUgbG9jYXRlZCBpbiB0aGUgYGxvZ3MvY2xpZW50c2AgZGlyZWN0b3J5IGluc2lkZVxuICogdGhlIGFwcGxpY2F0aW9uIGRpcmVjdG9yeS5cbiAqXG4gKiAqVGhlIHNlcnZpY2UgaXMgYXV0b21hdGljYWxseSBsYXVuY2hlZCB3aGVuZXZlciB0aGUgYXBwbGljYXRpb24gZGV0ZWN0cyB0aGVcbiAqIHVzZSBvZiBhIG5ldHdvcmtlZCBhY3Rpdml0eS4gSXQgc2hvdWxkIG5ldmVyIGJlIHJlcXVpcmVkIG1hbnVhbGx5IGluc2lkZVxuICogYW4gYXBwbGljYXRpb24uKlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5FcnJvclJlcG9ydGVyfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqL1xuY2xhc3MgRXJyb3JSZXBvcnRlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgdGhpcy5fb25FcnJvciA9IHRoaXMuX29uRXJyb3IuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHRoaXMuX29uRXJyb3IpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkVycm9yKGUpIHtcbiAgICBsZXQgc3RhY2s7XG4gICAgbGV0IGZpbGUgPSBlLmZpbGVuYW1lO1xuICAgIGZpbGUgPSBmaWxlLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLm9yaWdpbiwgJycpO1xuICAgIGNvbnN0IGxpbmUgPSBlLmxpbmVubztcbiAgICBjb25zdCBjb2wgPSBlLmNvbG5vO1xuICAgIGNvbnN0IG1zZyA9IGUubWVzc2FnZTtcbiAgICBjb25zdCB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gICAgdGhpcy5zZW5kKCdlcnJvcicsIGZpbGUsIGxpbmUsIGNvbCwgbXNnLCB1c2VyQWdlbnQpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEVycm9yUmVwb3J0ZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvclJlcG9ydGVyO1xuIl19
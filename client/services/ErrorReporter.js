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
 * application life cycle. Errors are caught and sent to the server in order
 * to be persisted in a file.
 * By default, the log files are located in the `logs/clients` directory inside
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBR0EsSUFBTSxhQUFhLHdCQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQk0sYTs7Ozs7QUFFSiwyQkFBYztBQUFBOztBQUFBLHVIQUNOLFVBRE0sRUFDTSxJQUROOztBQUdaLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCO0FBSFk7QUFJYjs7Ozs7OzsyQkFHTTtBQUNMLGFBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsS0FBSyxRQUF0QztBQUNEOzs7Ozs7NEJBR087QUFDTjs7QUFFQSxVQUFJLENBQUMsS0FBSyxVQUFWLEVBQ0UsS0FBSyxJQUFMOztBQUVGLFdBQUssS0FBTDtBQUNEOzs7Ozs7NkJBR1EsQyxFQUFHO0FBQ1YsVUFBSSxjQUFKO0FBQ0EsVUFBSSxPQUFPLEVBQUUsUUFBYjtBQUNBLGFBQU8sS0FBSyxPQUFMLENBQWEsT0FBTyxRQUFQLENBQWdCLE1BQTdCLEVBQXFDLEVBQXJDLENBQVA7QUFDQSxVQUFNLE9BQU8sRUFBRSxNQUFmO0FBQ0EsVUFBTSxNQUFNLEVBQUUsS0FBZDtBQUNBLFVBQU0sTUFBTSxFQUFFLE9BQWQ7QUFDQSxVQUFNLFlBQVksVUFBVSxTQUE1Qjs7QUFFQSxXQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLEVBQXlCLElBQXpCLEVBQStCLEdBQS9CLEVBQW9DLEdBQXBDLEVBQXlDLFNBQXpDO0FBQ0Q7Ozs7O0FBR0gseUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxhQUFwQzs7a0JBRWUsYSIsImZpbGUiOiJFcnJvclJlcG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6ZXJyb3ItcmVwb3J0ZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ2Vycm9yLXJlcG9ydGVyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIGxvZyBqYXZhc2NyaXB0IGVycm9ycyB0aGF0IGNvdWxkIG9jY3VyIGR1cmluZyB0aGVcbiAqIGFwcGxpY2F0aW9uIGxpZmUgY3ljbGUuIEVycm9ycyBhcmUgY2F1Z2h0IGFuZCBzZW50IHRvIHRoZSBzZXJ2ZXIgaW4gb3JkZXJcbiAqIHRvIGJlIHBlcnNpc3RlZCBpbiBhIGZpbGUuXG4gKiBCeSBkZWZhdWx0LCB0aGUgbG9nIGZpbGVzIGFyZSBsb2NhdGVkIGluIHRoZSBgbG9ncy9jbGllbnRzYCBkaXJlY3RvcnkgaW5zaWRlXG4gKiB0aGUgYXBwbGljYXRpb24gZGlyZWN0b3J5LlxuICpcbiAqICpUaGUgc2VydmljZSBpcyBhdXRvbWF0aWNhbGx5IGxhdW5jaGVkIHdoZW5ldmVyIHRoZSBhcHBsaWNhdGlvbiBkZXRlY3RzIHRoZVxuICogdXNlIG9mIGEgbmV0d29ya2VkIGFjdGl2aXR5LiBJdCBzaG91bGQgbmV2ZXIgYmUgcmVxdWlyZWQgbWFudWFsbHkgaW5zaWRlXG4gKiBhbiBhcHBsaWNhdGlvbi4qXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkVycm9yUmVwb3J0ZXJ9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICovXG5jbGFzcyBFcnJvclJlcG9ydGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICB0aGlzLl9vbkVycm9yID0gdGhpcy5fb25FcnJvci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5fb25FcnJvcik7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uRXJyb3IoZSkge1xuICAgIGxldCBzdGFjaztcbiAgICBsZXQgZmlsZSA9IGUuZmlsZW5hbWU7XG4gICAgZmlsZSA9IGZpbGUucmVwbGFjZSh3aW5kb3cubG9jYXRpb24ub3JpZ2luLCAnJyk7XG4gICAgY29uc3QgbGluZSA9IGUubGluZW5vO1xuICAgIGNvbnN0IGNvbCA9IGUuY29sbm87XG4gICAgY29uc3QgbXNnID0gZS5tZXNzYWdlO1xuICAgIGNvbnN0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgICB0aGlzLnNlbmQoJ2Vycm9yJywgZmlsZSwgbGluZSwgY29sLCBtc2csIHVzZXJBZ2VudCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgRXJyb3JSZXBvcnRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IEVycm9yUmVwb3J0ZXI7XG4iXX0=
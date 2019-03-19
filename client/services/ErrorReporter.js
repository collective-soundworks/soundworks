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

    var _this = (0, _possibleConstructorReturn3.default)(this, (ErrorReporter.__proto__ || (0, _getPrototypeOf2.default)(ErrorReporter)).call(this, SERVICE_ID, true));

    _this._onError = _this._onError.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(ErrorReporter, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(ErrorReporter.prototype.__proto__ || (0, _getPrototypeOf2.default)(ErrorReporter.prototype), 'start', this).call(this);

      window.addEventListener('error', this._onError);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIkVycm9yUmVwb3J0ZXIiLCJfb25FcnJvciIsImJpbmQiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVhZHkiLCJlIiwic3RhY2siLCJmaWxlIiwiZmlsZW5hbWUiLCJyZXBsYWNlIiwibG9jYXRpb24iLCJvcmlnaW4iLCJsaW5lIiwibGluZW5vIiwiY29sIiwiY29sbm8iLCJtc2ciLCJtZXNzYWdlIiwidXNlckFnZW50IiwibmF2aWdhdG9yIiwic2VuZCIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxhQUFhLHdCQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBaUJNQyxhOzs7QUFDSjtBQUNBLDJCQUFjO0FBQUE7O0FBQUEsb0pBQ05ELFVBRE0sRUFDTSxJQUROOztBQUdaLFVBQUtFLFFBQUwsR0FBZ0IsTUFBS0EsUUFBTCxDQUFjQyxJQUFkLE9BQWhCO0FBSFk7QUFJYjs7QUFFRDs7Ozs7NEJBQ1E7QUFDTjs7QUFFQUMsYUFBT0MsZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsS0FBS0gsUUFBdEM7QUFDQSxXQUFLSSxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NkJBQ1NDLEMsRUFBRztBQUNWLFVBQUlDLGNBQUo7QUFDQSxVQUFJQyxPQUFPRixFQUFFRyxRQUFiO0FBQ0FELGFBQU9BLEtBQUtFLE9BQUwsQ0FBYVAsT0FBT1EsUUFBUCxDQUFnQkMsTUFBN0IsRUFBcUMsRUFBckMsQ0FBUDtBQUNBLFVBQU1DLE9BQU9QLEVBQUVRLE1BQWY7QUFDQSxVQUFNQyxNQUFNVCxFQUFFVSxLQUFkO0FBQ0EsVUFBTUMsTUFBTVgsRUFBRVksT0FBZDtBQUNBLFVBQU1DLFlBQVlDLFVBQVVELFNBQTVCOztBQUVBLFdBQUtFLElBQUwsQ0FBVSxPQUFWLEVBQW1CYixJQUFuQixFQUF5QkssSUFBekIsRUFBK0JFLEdBQS9CLEVBQW9DRSxHQUFwQyxFQUF5Q0UsU0FBekM7QUFDRDs7O0VBM0J5QkcsaUI7O0FBOEI1QkMseUJBQWVDLFFBQWYsQ0FBd0J6QixVQUF4QixFQUFvQ0MsYUFBcEM7O2tCQUVlQSxhIiwiZmlsZSI6IkVycm9yUmVwb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTplcnJvci1yZXBvcnRlcic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnZXJyb3ItcmVwb3J0ZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gbG9nIGphdmFzY3JpcHQgZXJyb3JzIHRoYXQgY291bGQgb2NjdXIgZHVyaW5nIHRoZVxuICogYXBwbGljYXRpb24gbGlmZSBjeWNsZS4gRXJyb3JzIGFyZSBjYXVnaHQgYW5kIHNlbnQgdG8gdGhlIHNlcnZlciBpbiBvcmRlclxuICogdG8gYmUgcGVyc2lzdGVkIGluIGEgZmlsZS5cbiAqIEJ5IGRlZmF1bHQsIHRoZSBsb2cgZmlsZXMgYXJlIGxvY2F0ZWQgaW4gdGhlIGBsb2dzL2NsaWVudHNgIGRpcmVjdG9yeSBpbnNpZGVcbiAqIHRoZSBhcHBsaWNhdGlvbiBkaXJlY3RvcnkuXG4gKlxuICogKlRoZSBzZXJ2aWNlIGlzIGF1dG9tYXRpY2FsbHkgbGF1bmNoZWQgd2hlbmV2ZXIgdGhlIGFwcGxpY2F0aW9uIGRldGVjdHMgdGhlXG4gKiB1c2Ugb2YgYSBuZXR3b3JrZWQgYWN0aXZpdHkuIEl0IHNob3VsZCBuZXZlciBiZSByZXF1aXJlZCBtYW51YWxseSBpbnNpZGVcbiAqIGFuIGFwcGxpY2F0aW9uLipcbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuRXJyb3JSZXBvcnRlcn0qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKi9cbmNsYXNzIEVycm9yUmVwb3J0ZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIHRoaXMuX29uRXJyb3IgPSB0aGlzLl9vbkVycm9yLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHRoaXMuX29uRXJyb3IpO1xuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25FcnJvcihlKSB7XG4gICAgbGV0IHN0YWNrO1xuICAgIGxldCBmaWxlID0gZS5maWxlbmFtZTtcbiAgICBmaWxlID0gZmlsZS5yZXBsYWNlKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sICcnKTtcbiAgICBjb25zdCBsaW5lID0gZS5saW5lbm87XG4gICAgY29uc3QgY29sID0gZS5jb2xubztcbiAgICBjb25zdCBtc2cgPSBlLm1lc3NhZ2U7XG4gICAgY29uc3QgdXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICAgIHRoaXMuc2VuZCgnZXJyb3InLCBmaWxlLCBsaW5lLCBjb2wsIG1zZywgdXNlckFnZW50KTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBFcnJvclJlcG9ydGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JSZXBvcnRlcjtcbiJdfQ==
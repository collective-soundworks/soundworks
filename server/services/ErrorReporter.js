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

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function padLeft(str, value, length) {
  str = str + '';
  while (str.length < length) {
    str = value + str;
  }
  return str;
}

var SERVICE_ID = 'service:error-reporter';

/**
 * Interface for the server `'error-reporter'` service.
 *
 * This service allows to log javascript errors that could occur during the
 * application life cycle. Errors are caught and sent to the server in order
 * to be persisted in a file.
 * By default, the log file are located in the `logs/clients` directory inside
 * the application directory. This location can be changed by modifying the
 * `errorReporterDirectory` entry of the server configuration.
 *
 * *The service is automatically launched whenever the application detects the
 * use of a networked activity. It should never be required manually inside
 * an application.*
 *
 * __*The service must be used with its [client-side counterpart]{@link module:soundworks/client.ErrorReporter}*__
 *
 * @memberof module:soundworks/server
 */

var ErrorReporter = function (_Service) {
  (0, _inherits3.default)(ErrorReporter, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function ErrorReporter() {
    (0, _classCallCheck3.default)(this, ErrorReporter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ErrorReporter).call(this, SERVICE_ID));

    var defaults = {
      configItem: 'errorReporterDirectory'
    };

    _this.configure(defaults);
    _this._onError = _this._onError.bind(_this);

    _this._sharedConfig = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(ErrorReporter, [{
    key: 'start',
    value: function start() {
      var dir = this._sharedConfig.get(this.options.configItem);

      if (dir === null) dir = _path2.default.join(process.cwd(), 'logs', 'clients');

      _fsExtra2.default.ensureDirSync(dir); // create directory if not exists

      this.dir = dir;
    }

    /** @private */

  }, {
    key: 'connect',


    /** @private */
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ErrorReporter.prototype), 'connect', this).call(this, client);
      this.receive(client, 'error', this._onError);
    }

    /** @private */

  }, {
    key: '_onError',
    value: function _onError(file, line, col, msg, userAgent) {
      var entry = this._getFormattedDate() + '\t\t\t';
      entry += '- ' + file + ':' + line + ':' + col + '\t"' + msg + '"\n\t' + userAgent + '\n\n';

      _fsExtra2.default.appendFile(this.filePath, entry, function (err) {
        if (err) console.error(err.message);
      });
    }

    /** @private */

  }, {
    key: '_getFormattedDate',
    value: function _getFormattedDate() {
      var now = new Date();
      var year = padLeft(now.getFullYear(), 0, 4);
      var month = padLeft(now.getMonth() + 1, 0, 2);
      var day = padLeft(now.getDate(), 0, 2);
      var hour = padLeft(now.getHours(), 0, 2);
      var minutes = padLeft(now.getMinutes(), 0, 2);
      var seconds = padLeft(now.getSeconds(), 0, 2);
      // prepare file name
      return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds;
    }
  }, {
    key: 'filePath',
    get: function get() {
      var now = new Date();
      var year = padLeft(now.getFullYear(), 0, 4);
      var month = padLeft(now.getMonth() + 1, 0, 2);
      var day = padLeft(now.getDate(), 0, 2);
      var filename = '' + year + month + day + '.log';

      return _path2.default.join(this.dir, filename);
    }
  }]);
  return ErrorReporter;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ErrorReporter);

exports.default = ErrorReporter;
//# sourceMappingURL=data:application/json;base64,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QXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQWQ7QUFDQSxVQUFNLE1BQU0sUUFBUSxJQUFJLE9BQUosRUFBUixFQUF1QixDQUF2QixFQUEwQixDQUExQixDQUFaO0FBQ0EsVUFBTSxnQkFBYyxJQUFkLEdBQXFCLEtBQXJCLEdBQTZCLEdBQTdCLFNBQU47O0FBRUEsYUFBTyxlQUFLLElBQUwsQ0FBVSxLQUFLLEdBQWYsRUFBb0IsUUFBcEIsQ0FBUDtBQUNEOzs7OztBQWdDSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLGFBQXBDOztrQkFFZSxhIiwiZmlsZSI6IkVycm9yUmVwb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnNlICBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cblxuZnVuY3Rpb24gcGFkTGVmdChzdHIsIHZhbHVlLCBsZW5ndGgpIHtcbiAgc3RyID0gc3RyICsgJyc7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7IHN0ciA9IHZhbHVlICsgc3RyOyB9XG4gIHJldHVybiBzdHI7XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTplcnJvci1yZXBvcnRlcic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnZXJyb3ItcmVwb3J0ZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gbG9nIGphdmFzY3JpcHQgZXJyb3JzIHRoYXQgY291bGQgb2NjdXIgZHVyaW5nIHRoZVxuICogYXBwbGljYXRpb24gbGlmZSBjeWNsZS4gRXJyb3JzIGFyZSBjYXVnaHQgYW5kIHNlbnQgdG8gdGhlIHNlcnZlciBpbiBvcmRlclxuICogdG8gYmUgcGVyc2lzdGVkIGluIGEgZmlsZS5cbiAqIEJ5IGRlZmF1bHQsIHRoZSBsb2cgZmlsZSBhcmUgbG9jYXRlZCBpbiB0aGUgYGxvZ3MvY2xpZW50c2AgZGlyZWN0b3J5IGluc2lkZVxuICogdGhlIGFwcGxpY2F0aW9uIGRpcmVjdG9yeS4gVGhpcyBsb2NhdGlvbiBjYW4gYmUgY2hhbmdlZCBieSBtb2RpZnlpbmcgdGhlXG4gKiBgZXJyb3JSZXBvcnRlckRpcmVjdG9yeWAgZW50cnkgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICpcbiAqICpUaGUgc2VydmljZSBpcyBhdXRvbWF0aWNhbGx5IGxhdW5jaGVkIHdoZW5ldmVyIHRoZSBhcHBsaWNhdGlvbiBkZXRlY3RzIHRoZVxuICogdXNlIG9mIGEgbmV0d29ya2VkIGFjdGl2aXR5LiBJdCBzaG91bGQgbmV2ZXIgYmUgcmVxdWlyZWQgbWFudWFsbHkgaW5zaWRlXG4gKiBhbiBhcHBsaWNhdGlvbi4qXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LkVycm9yUmVwb3J0ZXJ9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICovXG5jbGFzcyBFcnJvclJlcG9ydGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGNvbmZpZ0l0ZW06ICdlcnJvclJlcG9ydGVyRGlyZWN0b3J5JyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX29uRXJyb3IgPSB0aGlzLl9vbkVycm9yLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBsZXQgZGlyID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldCh0aGlzLm9wdGlvbnMuY29uZmlnSXRlbSk7XG5cbiAgICBpZiAoZGlyID09PSBudWxsKVxuICAgICAgZGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdsb2dzJywgJ2NsaWVudHMnKTtcblxuICAgIGZzZS5lbnN1cmVEaXJTeW5jKGRpcik7IC8vIGNyZWF0ZSBkaXJlY3RvcnkgaWYgbm90IGV4aXN0c1xuXG4gICAgdGhpcy5kaXIgPSBkaXI7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IGZpbGVQYXRoKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBgJHt5ZWFyfSR7bW9udGh9JHtkYXl9LmxvZ2A7XG5cbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuZGlyLCBmaWxlbmFtZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgYGVycm9yYCwgdGhpcy5fb25FcnJvcik7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uRXJyb3IoZmlsZSwgbGluZSwgY29sLCBtc2csIHVzZXJBZ2VudCkge1xuICAgIGxldCBlbnRyeSA9IGAke3RoaXMuX2dldEZvcm1hdHRlZERhdGUoKX1cXHRcXHRcXHRgO1xuICAgIGVudHJ5ICs9IGAtICR7ZmlsZX06JHtsaW5lfToke2NvbH1cXHRcIiR7bXNnfVwiXFxuXFx0JHt1c2VyQWdlbnR9XFxuXFxuYDtcblxuICAgIGZzZS5hcHBlbmRGaWxlKHRoaXMuZmlsZVBhdGgsIGVudHJ5LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0Rm9ybWF0dGVkRGF0ZSgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCA0KTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGhvdXIgPSBwYWRMZWZ0KG5vdy5nZXRIb3VycygpLCAwLCAyKTtcbiAgICBjb25zdCBtaW51dGVzID0gcGFkTGVmdChub3cuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICBjb25zdCBzZWNvbmRzID0gcGFkTGVmdChub3cuZ2V0U2Vjb25kcygpLCAwLCAyKTtcbiAgICAvLyBwcmVwYXJlIGZpbGUgbmFtZVxuICAgIHJldHVybiBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0gJHtob3VyfToke21pbnV0ZXN9OiR7c2Vjb25kc31gO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEVycm9yUmVwb3J0ZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvclJlcG9ydGVyO1xuIl19
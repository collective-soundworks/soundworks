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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

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
 * application life cycle. Errors are catch and send to the server in order
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

var ErrorReporter = function (_Activity) {
  (0, _inherits3.default)(ErrorReporter, _Activity);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function ErrorReporter() {
    (0, _classCallCheck3.default)(this, ErrorReporter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ErrorReporter).call(this, SERVICE_ID));

    var defaults = {
      directoryConfig: 'errorReporterDirectory'
    };

    _this.configure(defaults);
    _this._onError = _this._onError.bind(_this);

    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(ErrorReporter, [{
    key: 'start',
    value: function start() {
      var dir = this._sharedConfigService.get(this.options.directoryConfig);
      dir = _path2.default.join(process.cwd(), dir);
      dir = _path2.default.normalize(dir); // @todo - check it does the job on windows
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
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, ErrorReporter);

exports.default = ErrorReporter;
//# sourceMappingURL=data:application/json;base64,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QWlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLENBQS9CLENBQWQ7QUFDQSxVQUFNLE1BQU0sUUFBUSxJQUFJLE9BQUosRUFBUixFQUF1QixDQUF2QixFQUEwQixDQUExQixDQUFaO0FBQ0EsVUFBTSxnQkFBYyxJQUFkLEdBQXFCLEtBQXJCLEdBQTZCLEdBQTdCLFNBQU47O0FBRUEsYUFBTyxlQUFLLElBQUwsQ0FBVSxLQUFLLEdBQWYsRUFBb0IsUUFBcEIsQ0FBUDtBQUNEOzs7OztBQWdDSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLGFBQXBDOztrQkFFZSxhIiwiZmlsZSI6IkVycm9yUmVwb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9BY3Rpdml0eSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgZnNlICBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gcGFkTGVmdChzdHIsIHZhbHVlLCBsZW5ndGgpIHtcbiAgc3RyID0gc3RyICsgJyc7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7IHN0ciA9IHZhbHVlICsgc3RyOyB9XG4gIHJldHVybiBzdHI7XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTplcnJvci1yZXBvcnRlcic7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnZXJyb3ItcmVwb3J0ZXInYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gbG9nIGphdmFzY3JpcHQgZXJyb3JzIHRoYXQgY291bGQgb2NjdXIgZHVyaW5nIHRoZVxuICogYXBwbGljYXRpb24gbGlmZSBjeWNsZS4gRXJyb3JzIGFyZSBjYXRjaCBhbmQgc2VuZCB0byB0aGUgc2VydmVyIGluIG9yZGVyXG4gKiB0byBiZSBwZXJzaXN0ZWQgaW4gYSBmaWxlLlxuICogQnkgZGVmYXVsdCwgdGhlIGxvZyBmaWxlIGFyZSBsb2NhdGVkIGluIHRoZSBgbG9ncy9jbGllbnRzYCBkaXJlY3RvcnkgaW5zaWRlXG4gKiB0aGUgYXBwbGljYXRpb24gZGlyZWN0b3J5LiBUaGlzIGxvY2F0aW9uIGNhbiBiZSBjaGFuZ2VkIGJ5IG1vZGlmeWluZyB0aGVcbiAqIGBlcnJvclJlcG9ydGVyRGlyZWN0b3J5YCBlbnRyeSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogKlRoZSBzZXJ2aWNlIGlzIGF1dG9tYXRpY2FsbHkgbGF1bmNoZWQgd2hlbmV2ZXIgdGhlIGFwcGxpY2F0aW9uIGRldGVjdHMgdGhlXG4gKiB1c2Ugb2YgYSBuZXR3b3JrZWQgYWN0aXZpdHkuIEl0IHNob3VsZCBuZXZlciBiZSByZXF1aXJlZCBtYW51YWxseSBpbnNpZGVcbiAqIGFuIGFwcGxpY2F0aW9uLipcbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRXJyb3JSZXBvcnRlcn0qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKi9cbmNsYXNzIEVycm9yUmVwb3J0ZXIgZXh0ZW5kcyBBY3Rpdml0eSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRpcmVjdG9yeUNvbmZpZzogJ2Vycm9yUmVwb3J0ZXJEaXJlY3RvcnknLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgdGhpcy5fb25FcnJvciA9IHRoaXMuX29uRXJyb3IuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBsZXQgZGlyID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQodGhpcy5vcHRpb25zLmRpcmVjdG9yeUNvbmZpZyk7XG4gICAgZGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGRpcik7XG4gICAgZGlyID0gcGF0aC5ub3JtYWxpemUoZGlyKTsgLy8gQHRvZG8gLSBjaGVjayBpdCBkb2VzIHRoZSBqb2Igb24gd2luZG93c1xuICAgIGZzZS5lbnN1cmVEaXJTeW5jKGRpcik7IC8vIGNyZWF0ZSBkaXJlY3RvcnkgaWYgbm90IGV4aXN0c1xuXG4gICAgdGhpcy5kaXIgPSBkaXI7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IGZpbGVQYXRoKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBgJHt5ZWFyfSR7bW9udGh9JHtkYXl9LmxvZ2A7XG5cbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuZGlyLCBmaWxlbmFtZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgYGVycm9yYCwgdGhpcy5fb25FcnJvcik7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uRXJyb3IoZmlsZSwgbGluZSwgY29sLCBtc2csIHVzZXJBZ2VudCkge1xuICAgIGxldCBlbnRyeSA9IGAke3RoaXMuX2dldEZvcm1hdHRlZERhdGUoKX1cXHRcXHRcXHRgO1xuICAgIGVudHJ5ICs9IGAtICR7ZmlsZX06JHtsaW5lfToke2NvbH1cXHRcIiR7bXNnfVwiXFxuXFx0JHt1c2VyQWdlbnR9XFxuXFxuYDtcblxuICAgIGZzZS5hcHBlbmRGaWxlKHRoaXMuZmlsZVBhdGgsIGVudHJ5LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0Rm9ybWF0dGVkRGF0ZSgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCA0KTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGhvdXIgPSBwYWRMZWZ0KG5vdy5nZXRIb3VycygpLCAwLCAyKTtcbiAgICBjb25zdCBtaW51dGVzID0gcGFkTGVmdChub3cuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICBjb25zdCBzZWNvbmRzID0gcGFkTGVmdChub3cuZ2V0U2Vjb25kcygpLCAwLCAyKTtcbiAgICAvLyBwcmVwYXJlIGZpbGUgbmFtZVxuICAgIHJldHVybiBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0gJHtob3VyfToke21pbnV0ZXN9OiR7c2Vjb25kc31gO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEVycm9yUmVwb3J0ZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvclJlcG9ydGVyO1xuIl19
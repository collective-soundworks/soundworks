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

    var _this = (0, _possibleConstructorReturn3.default)(this, (ErrorReporter.__proto__ || (0, _getPrototypeOf2.default)(ErrorReporter)).call(this, SERVICE_ID));

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
      (0, _get3.default)(ErrorReporter.prototype.__proto__ || (0, _getPrototypeOf2.default)(ErrorReporter.prototype), 'start', this).call(this);

      var dir = this._sharedConfig.get(this.options.configItem);

      if (dir === null) dir = _path2.default.join(process.cwd(), 'logs', 'clients');

      _fsExtra2.default.ensureDirSync(dir); // create directory if not exists

      this.dir = dir;

      this.ready();
    }

    /** @private */

  }, {
    key: 'connect',


    /** @private */
    value: function connect(client) {
      (0, _get3.default)(ErrorReporter.prototype.__proto__ || (0, _getPrototypeOf2.default)(ErrorReporter.prototype), 'connect', this).call(this, client);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOlsicGFkTGVmdCIsInN0ciIsInZhbHVlIiwibGVuZ3RoIiwiU0VSVklDRV9JRCIsIkVycm9yUmVwb3J0ZXIiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfb25FcnJvciIsImJpbmQiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsImRpciIsImdldCIsIm9wdGlvbnMiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsImVuc3VyZURpclN5bmMiLCJyZWFkeSIsImNsaWVudCIsInJlY2VpdmUiLCJmaWxlIiwibGluZSIsImNvbCIsIm1zZyIsInVzZXJBZ2VudCIsImVudHJ5IiwiX2dldEZvcm1hdHRlZERhdGUiLCJhcHBlbmRGaWxlIiwiZmlsZVBhdGgiLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJtZXNzYWdlIiwibm93IiwiRGF0ZSIsInllYXIiLCJnZXRGdWxsWWVhciIsIm1vbnRoIiwiZ2V0TW9udGgiLCJkYXkiLCJnZXREYXRlIiwiaG91ciIsImdldEhvdXJzIiwibWludXRlcyIsImdldE1pbnV0ZXMiLCJzZWNvbmRzIiwiZ2V0U2Vjb25kcyIsImZpbGVuYW1lIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxTQUFTQSxPQUFULENBQWlCQyxHQUFqQixFQUFzQkMsS0FBdEIsRUFBNkJDLE1BQTdCLEVBQXFDO0FBQ25DRixRQUFNQSxNQUFNLEVBQVo7QUFDQSxTQUFPQSxJQUFJRSxNQUFKLEdBQWFBLE1BQXBCLEVBQTRCO0FBQUVGLFVBQU1DLFFBQVFELEdBQWQ7QUFBb0I7QUFDbEQsU0FBT0EsR0FBUDtBQUNEOztBQUVELElBQU1HLGFBQWEsd0JBQW5COztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBa0JNQyxhOzs7QUFDSjtBQUNBLDJCQUFjO0FBQUE7O0FBQUEs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UUFBcEIsQ0FBUDtBQUNEOzs7OztBQWdDSCx5QkFBZUMsUUFBZixDQUF3Qi9DLFVBQXhCLEVBQW9DQyxhQUFwQzs7a0JBRWVBLGEiLCJmaWxlIjoiRXJyb3JSZXBvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmc2UgIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuXG5mdW5jdGlvbiBwYWRMZWZ0KHN0ciwgdmFsdWUsIGxlbmd0aCkge1xuICBzdHIgPSBzdHIgKyAnJztcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBsZW5ndGgpIHsgc3RyID0gdmFsdWUgKyBzdHI7IH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmVycm9yLXJlcG9ydGVyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdlcnJvci1yZXBvcnRlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBsb2cgamF2YXNjcmlwdCBlcnJvcnMgdGhhdCBjb3VsZCBvY2N1ciBkdXJpbmcgdGhlXG4gKiBhcHBsaWNhdGlvbiBsaWZlIGN5Y2xlLiBFcnJvcnMgYXJlIGNhdWdodCBhbmQgc2VudCB0byB0aGUgc2VydmVyIGluIG9yZGVyXG4gKiB0byBiZSBwZXJzaXN0ZWQgaW4gYSBmaWxlLlxuICogQnkgZGVmYXVsdCwgdGhlIGxvZyBmaWxlIGFyZSBsb2NhdGVkIGluIHRoZSBgbG9ncy9jbGllbnRzYCBkaXJlY3RvcnkgaW5zaWRlXG4gKiB0aGUgYXBwbGljYXRpb24gZGlyZWN0b3J5LiBUaGlzIGxvY2F0aW9uIGNhbiBiZSBjaGFuZ2VkIGJ5IG1vZGlmeWluZyB0aGVcbiAqIGBlcnJvclJlcG9ydGVyRGlyZWN0b3J5YCBlbnRyeSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogKlRoZSBzZXJ2aWNlIGlzIGF1dG9tYXRpY2FsbHkgbGF1bmNoZWQgd2hlbmV2ZXIgdGhlIGFwcGxpY2F0aW9uIGRldGVjdHMgdGhlXG4gKiB1c2Ugb2YgYSBuZXR3b3JrZWQgYWN0aXZpdHkuIEl0IHNob3VsZCBuZXZlciBiZSByZXF1aXJlZCBtYW51YWxseSBpbnNpZGVcbiAqIGFuIGFwcGxpY2F0aW9uLipcbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuRXJyb3JSZXBvcnRlcn0qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKi9cbmNsYXNzIEVycm9yUmVwb3J0ZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgY29uZmlnSXRlbTogJ2Vycm9yUmVwb3J0ZXJEaXJlY3RvcnknLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgdGhpcy5fb25FcnJvciA9IHRoaXMuX29uRXJyb3IuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBsZXQgZGlyID0gdGhpcy5fc2hhcmVkQ29uZmlnLmdldCh0aGlzLm9wdGlvbnMuY29uZmlnSXRlbSk7XG5cbiAgICBpZiAoZGlyID09PSBudWxsKVxuICAgICAgZGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksICdsb2dzJywgJ2NsaWVudHMnKTtcblxuICAgIGZzZS5lbnN1cmVEaXJTeW5jKGRpcik7IC8vIGNyZWF0ZSBkaXJlY3RvcnkgaWYgbm90IGV4aXN0c1xuXG4gICAgdGhpcy5kaXIgPSBkaXI7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgZ2V0IGZpbGVQYXRoKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBgJHt5ZWFyfSR7bW9udGh9JHtkYXl9LmxvZ2A7XG5cbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuZGlyLCBmaWxlbmFtZSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgYGVycm9yYCwgdGhpcy5fb25FcnJvcik7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uRXJyb3IoZmlsZSwgbGluZSwgY29sLCBtc2csIHVzZXJBZ2VudCkge1xuICAgIGxldCBlbnRyeSA9IGAke3RoaXMuX2dldEZvcm1hdHRlZERhdGUoKX1cXHRcXHRcXHRgO1xuICAgIGVudHJ5ICs9IGAtICR7ZmlsZX06JHtsaW5lfToke2NvbH1cXHRcIiR7bXNnfVwiXFxuXFx0JHt1c2VyQWdlbnR9XFxuXFxuYDtcblxuICAgIGZzZS5hcHBlbmRGaWxlKHRoaXMuZmlsZVBhdGgsIGVudHJ5LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfZ2V0Rm9ybWF0dGVkRGF0ZSgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCA0KTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGhvdXIgPSBwYWRMZWZ0KG5vdy5nZXRIb3VycygpLCAwLCAyKTtcbiAgICBjb25zdCBtaW51dGVzID0gcGFkTGVmdChub3cuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICBjb25zdCBzZWNvbmRzID0gcGFkTGVmdChub3cuZ2V0U2Vjb25kcygpLCAwLCAyKTtcbiAgICAvLyBwcmVwYXJlIGZpbGUgbmFtZVxuICAgIHJldHVybiBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0gJHtob3VyfToke21pbnV0ZXN9OiR7c2Vjb25kc31gO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIEVycm9yUmVwb3J0ZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvclJlcG9ydGVyO1xuIl19
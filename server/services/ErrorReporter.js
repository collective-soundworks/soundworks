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
//# sourceMappingURL=data:application/json;base64,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UUFBUSxJQUFJLFdBQUosRUFBUixFQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUFQLENBRk87QUFHYixVQUFNLFFBQVEsUUFBUSxJQUFJLFFBQUosS0FBaUIsQ0FBakIsRUFBb0IsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBUixDQUhPO0FBSWIsVUFBTSxNQUFNLFFBQVEsSUFBSSxPQUFKLEVBQVIsRUFBdUIsQ0FBdkIsRUFBMEIsQ0FBMUIsQ0FBTixDQUpPO0FBS2IsVUFBTSxnQkFBYyxPQUFPLFFBQVEsWUFBN0IsQ0FMTzs7QUFPYixhQUFPLGVBQUssSUFBTCxDQUFVLEtBQUssR0FBTCxFQUFVLFFBQXBCLENBQVAsQ0FQYTs7O1NBMUJYOzs7QUFrRU4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxhQUFwQzs7a0JBRWUiLCJmaWxlIjoiRXJyb3JSZXBvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBmc2UgIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBwYWRMZWZ0KHN0ciwgdmFsdWUsIGxlbmd0aCkge1xuICBzdHIgPSBzdHIgKyAnJztcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBsZW5ndGgpIHsgc3RyID0gdmFsdWUgKyBzdHI7IH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmVycm9yLXJlcG9ydGVyJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdlcnJvci1yZXBvcnRlcidgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBsb2cgamF2YXNjcmlwdCBlcnJvcnMgdGhhdCBjb3VsZCBvY2N1ciBkdXJpbmcgdGhlXG4gKiBhcHBsaWNhdGlvbiBsaWZlIGN5Y2xlLiBFcnJvcnMgYXJlIGNhdGNoIGFuZCBzZW5kIHRvIHRoZSBzZXJ2ZXIgaW4gb3JkZXJcbiAqIHRvIGJlIHBlcnNpc3RlZCBpbiBhIGZpbGUuXG4gKiBCeSBkZWZhdWx0LCB0aGUgbG9nIGZpbGUgYXJlIGxvY2F0ZWQgaW4gdGhlIGBsb2dzL2NsaWVudHNgIGRpcmVjdG9yeSBpbnNpZGVcbiAqIHRoZSBhcHBsaWNhdGlvbiBkaXJlY3RvcnkuIFRoaXMgbG9jYXRpb24gY2FuIGJlIGNoYW5nZWQgYnkgbW9kaWZ5aW5nIHRoZVxuICogYGVycm9yUmVwb3J0ZXJEaXJlY3RvcnlgIGVudHJ5IG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAqXG4gKiAqVGhlIHNlcnZpY2UgaXMgYXV0b21hdGljYWxseSBsYXVuY2hlZCB3aGVuZXZlciB0aGUgYXBwbGljYXRpb24gZGV0ZWN0cyB0aGVcbiAqIHVzZSBvZiBhIG5ldHdvcmtlZCBhY3Rpdml0eS4gSXQgc2hvdWxkIG5ldmVyIGJlIHJlcXVpcmVkIG1hbnVhbGx5IGluc2lkZVxuICogYW4gYXBwbGljYXRpb24uKlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5FcnJvclJlcG9ydGVyfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqL1xuY2xhc3MgRXJyb3JSZXBvcnRlciBleHRlbmRzIEFjdGl2aXR5IHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGlyZWN0b3J5Q29uZmlnOiAnZXJyb3JSZXBvcnRlckRpcmVjdG9yeScsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9vbkVycm9yID0gdGhpcy5fb25FcnJvci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIGxldCBkaXIgPSB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmdldCh0aGlzLm9wdGlvbnMuZGlyZWN0b3J5Q29uZmlnKTtcbiAgICBkaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgZGlyKTtcbiAgICBkaXIgPSBwYXRoLm5vcm1hbGl6ZShkaXIpOyAvLyBAdG9kbyAtIGNoZWNrIGl0IGRvZXMgdGhlIGpvYiBvbiB3aW5kb3dzXG4gICAgZnNlLmVuc3VyZURpclN5bmMoZGlyKTsgLy8gY3JlYXRlIGRpcmVjdG9yeSBpZiBub3QgZXhpc3RzXG5cbiAgICB0aGlzLmRpciA9IGRpcjtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBnZXQgZmlsZVBhdGgoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgNCk7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGAke3llYXJ9JHttb250aH0ke2RheX0ubG9nYDtcblxuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5kaXIsIGZpbGVuYW1lKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCBgZXJyb3JgLCB0aGlzLl9vbkVycm9yKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25FcnJvcihmaWxlLCBsaW5lLCBjb2wsIG1zZywgdXNlckFnZW50KSB7XG4gICAgbGV0IGVudHJ5ID0gYCR7dGhpcy5fZ2V0Rm9ybWF0dGVkRGF0ZSgpfVxcdFxcdFxcdGA7XG4gICAgZW50cnkgKz0gYC0gJHtmaWxlfToke2xpbmV9OiR7Y29sfVxcdFwiJHttc2d9XCJcXG5cXHQke3VzZXJBZ2VudH1cXG5cXG5gO1xuXG4gICAgZnNlLmFwcGVuZEZpbGUodGhpcy5maWxlUGF0aCwgZW50cnksIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRGb3JtYXR0ZWREYXRlKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgaG91ciA9IHBhZExlZnQobm93LmdldEhvdXJzKCksIDAsIDIpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBwYWRMZWZ0KG5vdy5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgIGNvbnN0IHNlY29uZHMgPSBwYWRMZWZ0KG5vdy5nZXRTZWNvbmRzKCksIDAsIDIpO1xuICAgIC8vIHByZXBhcmUgZmlsZSBuYW1lXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlc306JHtzZWNvbmRzfWA7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgRXJyb3JSZXBvcnRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IEVycm9yUmVwb3J0ZXI7XG4iXX0=
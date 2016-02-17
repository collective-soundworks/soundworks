'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreServerActivity = require('../core/ServerActivity');

var _coreServerActivity2 = _interopRequireDefault(_coreServerActivity);

var _coreServerServiceManager = require('../core/serverServiceManager');

var _coreServerServiceManager2 = _interopRequireDefault(_coreServerServiceManager);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function padLeft(str, value, length) {
  str = str + '';
  while (str.length < length) {
    str = value + str;
  }
  return str;
}

var SERVICE_ID = 'service:error-reporter';

var ServerErrorReporter = (function (_ServerActivity) {
  _inherits(ServerErrorReporter, _ServerActivity);

  function ServerErrorReporter() {
    _classCallCheck(this, ServerErrorReporter);

    _get(Object.getPrototypeOf(ServerErrorReporter.prototype), 'constructor', this).call(this, SERVICE_ID);

    var defaults = {
      configPath: 'errorReporterFolder'
    };

    this.configure(defaults);
    this._logError = this._logError.bind(this);

    this._sharedConfigService = this.require('shared-config');
  }

  _createClass(ServerErrorReporter, [{
    key: 'start',
    value: function start() {
      var configPath = this.options.configPath;
      var folderPath = this._sharedConfigService.get(configPath)[configPath];
      // @todo - test if it does the job on windows
      var dirPath = _path2['default'].join(process.cwd(), folderPath);
      this.dirPath = _path2['default'].normalize(dirPath);
      // create directory if not exists
      _fsExtra2['default'].ensureDirSync(dirPath);
    }
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerErrorReporter.prototype), 'connect', this).call(this, client);
      this.receive(client, 'error', this._logError);
    }
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerErrorReporter.prototype), 'disconnect', this).call(this, client);
    }
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
    key: '_logError',
    value: function _logError(file, line, col, msg, userAgent) {
      var entry = this._getFormattedDate() + '\t\t\t';
      entry += '- ' + file + ':' + line + ':' + col + '\t"' + msg + '"\n\t' + userAgent + '\n\n';

      _fsExtra2['default'].appendFile(this.filePath, entry, function (err) {
        if (err) console.error(err.message);
      });
    }
  }, {
    key: 'filePath',
    get: function get() {
      var now = new Date();
      var year = padLeft(now.getFullYear(), 0, 4);
      var month = padLeft(now.getMonth() + 1, 0, 2);
      var day = padLeft(now.getDate(), 0, 2);
      var filename = '' + year + month + day + '.log';

      return _path2['default'].join(this.dirPath, filename);
    }
  }]);

  return ServerErrorReporter;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerErrorReporter);

exports['default'] = ServerErrorReporter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyRXJyb3JSZXBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7Ozt1QkFDOUMsVUFBVTs7OztvQkFDVixNQUFNOzs7O0FBRXZCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7QUFFRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQzs7SUFFdEMsbUJBQW1CO1lBQW5CLG1CQUFtQjs7QUFDWixXQURQLG1CQUFtQixHQUNUOzBCQURWLG1CQUFtQjs7QUFFckIsK0JBRkUsbUJBQW1CLDZDQUVmLFVBQVUsRUFBRTs7QUFFbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixnQkFBVSxFQUFFLHFCQUFxQjtLQUNsQyxDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0MsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7R0FDM0Q7O2VBWkcsbUJBQW1COztXQWNsQixpQkFBRztBQUNOLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO0FBQzNDLFVBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXpF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QVEsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQzs7cUJBRWhELG1CQUFtQiIsImZpbGUiOiJzcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlckVycm9yUmVwb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgZnNlICBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gcGFkTGVmdChzdHIsIHZhbHVlLCBsZW5ndGgpIHtcbiAgc3RyID0gc3RyICsgJyc7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7IHN0ciA9IHZhbHVlICsgc3RyOyB9XG4gIHJldHVybiBzdHI7XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTplcnJvci1yZXBvcnRlcic7XG5cbmNsYXNzIFNlcnZlckVycm9yUmVwb3J0ZXIgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb25maWdQYXRoOiAnZXJyb3JSZXBvcnRlckZvbGRlcicsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9sb2dFcnJvciA9IHRoaXMuX2xvZ0Vycm9yLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBjb25maWdQYXRoID0gdGhpcy5vcHRpb25zLmNvbmZpZ1BhdGg7XG4gICAgY29uc3QgZm9sZGVyUGF0aCA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KGNvbmZpZ1BhdGgpW2NvbmZpZ1BhdGhdO1xuICAgIC8vIEB0b2RvIC0gdGVzdCBpZiBpdCBkb2VzIHRoZSBqb2Igb24gd2luZG93c1xuICAgIGNvbnN0IGRpclBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgZm9sZGVyUGF0aCk7XG4gICAgdGhpcy5kaXJQYXRoID0gcGF0aC5ub3JtYWxpemUoZGlyUGF0aCk7XG4gICAgLy8gY3JlYXRlIGRpcmVjdG9yeSBpZiBub3QgZXhpc3RzXG4gICAgZnNlLmVuc3VyZURpclN5bmMoZGlyUGF0aCk7XG4gIH1cblxuICBnZXQgZmlsZVBhdGgoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgNCk7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGAke3llYXJ9JHttb250aH0ke2RheX0ubG9nYDtcblxuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5kaXJQYXRoLCBmaWxlbmFtZSk7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCBgZXJyb3JgLCB0aGlzLl9sb2dFcnJvcik7XG4gIH1cblxuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAgfVxuXG4gIF9nZXRGb3JtYXR0ZWREYXRlKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgaG91ciA9IHBhZExlZnQobm93LmdldEhvdXJzKCksIDAsIDIpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBwYWRMZWZ0KG5vdy5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgIGNvbnN0IHNlY29uZHMgPSBwYWRMZWZ0KG5vdy5nZXRTZWNvbmRzKCksIDAsIDIpO1xuICAgIC8vIHByZXBhcmUgZmlsZSBuYW1lXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlc306JHtzZWNvbmRzfWA7XG4gIH1cblxuICBfbG9nRXJyb3IoZmlsZSwgbGluZSwgY29sLCBtc2csIHVzZXJBZ2VudCkge1xuICAgIGxldCBlbnRyeSA9IGAke3RoaXMuX2dldEZvcm1hdHRlZERhdGUoKX1cXHRcXHRcXHRgO1xuICAgIGVudHJ5ICs9IGAtICR7ZmlsZX06JHtsaW5lfToke2NvbH1cXHRcIiR7bXNnfVwiXFxuXFx0JHt1c2VyQWdlbnR9XFxuXFxuYDtcblxuICAgIGZzZS5hcHBlbmRGaWxlKHRoaXMuZmlsZVBhdGgsIGVudHJ5LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKVxuICAgICAgICBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJFcnJvclJlcG9ydGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyRXJyb3JSZXBvcnRlcjtcbiJdfQ==
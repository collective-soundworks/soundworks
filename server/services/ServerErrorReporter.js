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
      directoryConfig: 'errorReporterDirectory'
    };

    this.configure(defaults);
    this._onError = this._onError.bind(this);

    this._sharedConfigService = this.require('shared-config');
  }

  _createClass(ServerErrorReporter, [{
    key: 'start',
    value: function start() {
      var directoryConfig = this.options.directoryConfig;
      var dir = this._sharedConfigService.get(directoryConfig)[directoryConfig];
      dir = _path2['default'].join(process.cwd(), dir);
      dir = _path2['default'].normalize(dir); // @todo - check it does the job on windows
      _fsExtra2['default'].ensureDirSync(dir); // create directory if not exists

      this.dir = dir;
    }
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerErrorReporter.prototype), 'connect', this).call(this, client);
      this.receive(client, 'error', this._onError);
    }
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      _get(Object.getPrototypeOf(ServerErrorReporter.prototype), 'disconnect', this).call(this, client);
    }
  }, {
    key: '_onError',
    value: function _onError(file, line, col, msg, userAgent) {
      var entry = this._getFormattedDate() + '\t\t\t';
      entry += '- ' + file + ':' + line + ':' + col + '\t"' + msg + '"\n\t' + userAgent + '\n\n';

      _fsExtra2['default'].appendFile(this.filePath, entry, function (err) {
        if (err) console.error(err.message);
      });
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
    key: 'filePath',
    get: function get() {
      var now = new Date();
      var year = padLeft(now.getFullYear(), 0, 4);
      var month = padLeft(now.getMonth() + 1, 0, 2);
      var day = padLeft(now.getDate(), 0, 2);
      var filename = '' + year + month + day + '.log';

      return _path2['default'].join(this.dir, filename);
    }
  }]);

  return ServerErrorReporter;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerErrorReporter);

exports['default'] = ServerErrorReporter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyRXJyb3JSZXBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7Ozt1QkFDOUMsVUFBVTs7OztvQkFDVixNQUFNOzs7O0FBRXZCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7QUFFRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQzs7SUFFdEMsbUJBQW1CO1lBQW5CLG1CQUFtQjs7QUFDWixXQURQLG1CQUFtQixHQUNUOzBCQURWLG1CQUFtQjs7QUFFckIsK0JBRkUsbUJBQW1CLDZDQUVmLFVBQVUsRUFBRTs7QUFFbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixxQkFBZSxFQUFFLHdCQUF3QjtLQUMxQyxDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7R0FDM0Q7O2VBWkcsbUJBQW1COztXQWNsQixpQkFBRztBQUNOLFVBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDO0FBQ3JELFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDMUUs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Qjs7O0FBaUV6QixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztxQkFFaEQsbUJBQW1CIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyRXJyb3JSZXBvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBmc2UgIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBwYWRMZWZ0KHN0ciwgdmFsdWUsIGxlbmd0aCkge1xuICBzdHIgPSBzdHIgKyAnJztcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBsZW5ndGgpIHsgc3RyID0gdmFsdWUgKyBzdHI7IH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmVycm9yLXJlcG9ydGVyJztcblxuY2xhc3MgU2VydmVyRXJyb3JSZXBvcnRlciBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGRpcmVjdG9yeUNvbmZpZzogJ2Vycm9yUmVwb3J0ZXJEaXJlY3RvcnknLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG4gICAgdGhpcy5fb25FcnJvciA9IHRoaXMuX29uRXJyb3IuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIGNvbnN0IGRpcmVjdG9yeUNvbmZpZyA9IHRoaXMub3B0aW9ucy5kaXJlY3RvcnlDb25maWc7XG4gICAgbGV0IGRpciA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KGRpcmVjdG9yeUNvbmZpZylbZGlyZWN0b3J5Q29uZmlnXTtcbiAgICBkaXIgPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgZGlyKTtcbiAgICBkaXIgPSBwYXRoLm5vcm1hbGl6ZShkaXIpOyAvLyBAdG9kbyAtIGNoZWNrIGl0IGRvZXMgdGhlIGpvYiBvbiB3aW5kb3dzXG4gICAgZnNlLmVuc3VyZURpclN5bmMoZGlyKTsgLy8gY3JlYXRlIGRpcmVjdG9yeSBpZiBub3QgZXhpc3RzXG5cbiAgICB0aGlzLmRpciA9IGRpcjtcbiAgfVxuXG4gIGdldCBmaWxlUGF0aCgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCA0KTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYCR7eWVhcn0ke21vbnRofSR7ZGF5fS5sb2dgO1xuXG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmRpciwgZmlsZW5hbWUpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgYGVycm9yYCwgdGhpcy5fb25FcnJvcik7XG4gIH1cblxuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAgfVxuXG4gIF9vbkVycm9yKGZpbGUsIGxpbmUsIGNvbCwgbXNnLCB1c2VyQWdlbnQpIHtcbiAgICBsZXQgZW50cnkgPSBgJHt0aGlzLl9nZXRGb3JtYXR0ZWREYXRlKCl9XFx0XFx0XFx0YDtcbiAgICBlbnRyeSArPSBgLSAke2ZpbGV9OiR7bGluZX06JHtjb2x9XFx0XCIke21zZ31cIlxcblxcdCR7dXNlckFnZW50fVxcblxcbmA7XG5cbiAgICBmc2UuYXBwZW5kRmlsZSh0aGlzLmZpbGVQYXRoLCBlbnRyeSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgY29uc29sZS5lcnJvcihlcnIubWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cblxuICBfZ2V0Rm9ybWF0dGVkRGF0ZSgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCA0KTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGhvdXIgPSBwYWRMZWZ0KG5vdy5nZXRIb3VycygpLCAwLCAyKTtcbiAgICBjb25zdCBtaW51dGVzID0gcGFkTGVmdChub3cuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICBjb25zdCBzZWNvbmRzID0gcGFkTGVmdChub3cuZ2V0U2Vjb25kcygpLCAwLCAyKTtcbiAgICAvLyBwcmVwYXJlIGZpbGUgbmFtZVxuICAgIHJldHVybiBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0gJHtob3VyfToke21pbnV0ZXN9OiR7c2Vjb25kc31gO1xuICB9XG59XG5cbnNlcnZlclNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNlcnZlckVycm9yUmVwb3J0ZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBTZXJ2ZXJFcnJvclJlcG9ydGVyO1xuIl19
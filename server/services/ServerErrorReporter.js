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
      folder: 'logs/clients'
    };

    this.configure(defaults);
    this._logError = this._logError.bind(this);
  }

  _createClass(ServerErrorReporter, [{
    key: 'start',
    value: function start() {
      // @todo - test if it does the job on windows
      var dirPath = _path2['default'].join(process.cwd(), this.options.folder);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyRXJyb3JSZXBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7Ozt1QkFDOUMsVUFBVTs7OztvQkFDVixNQUFNOzs7O0FBRXZCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7QUFFRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQzs7SUFFdEMsbUJBQW1CO1lBQW5CLG1CQUFtQjs7QUFDWixXQURQLG1CQUFtQixHQUNUOzBCQURWLG1CQUFtQjs7QUFFckIsK0JBRkUsbUJBQW1CLDZDQUVmLFVBQVUsRUFBRTs7QUFFbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixZQUFNLEVBQUUsY0FBYztLQUN2QixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM1Qzs7ZUFWRyxtQkFBbUI7O1dBWWxCLGlCQUFHOztBQUVOLFVBQU0sT0FBTyxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM5RCxVQUFJLENBQUMsT0FBTyxHQUFHLGtCQUFLLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFdkMsMkJBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzVCOzs7V0FZTSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0EvQkUsbUJBQW1CLHlDQStCUCxNQUFNLEVBQUU7QUFDdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLFdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQy9DOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7QUFDakIsaUNBcENFLG1CQUFtQiw0Q0FvQ0osTUFBTSxFQUFFO0tBQzFCOzs7V0FFZ0IsNkJBQUc7QUFDbEIsVUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN2QixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QyxVQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEQsVUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsVUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDM0MsVUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEQsVUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0FBRWhELGFBQVUsSUFBSSxTQUFJLEtBQUssU0FBSSxHQUFHLFNBQUksSUFBSSxTQUFJLE9BQU8sU0FBSSxPQUFPLENBQUc7S0FDaEU7OztXQUVRLG1CQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUU7QUFDekMsVUFBSSxLQUFLLEdBQU0sSUFBSSxDQUFDLGlCQUFpQixFQUFFLFdBQVEsQ0FBQztBQUNoRCxXQUFLLFdBQVMsSUFBSSxTQUFJLElBQUksU0FBSSxHQUFHLFdBQU0sR0FBRyxhQUFRLFNBQVMsU0FBTSxDQUFDOztBQUVsRSwyQkFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsVUFBQyxHQUFHLEVBQUs7QUFDNUMsWUFBSSxHQUFHLEVBQ0wsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDOUIsQ0FBQyxDQUFDO0tBQ0o7OztTQXZDVyxlQUFHO0FBQ2IsVUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztBQUN2QixVQUFNLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUM5QyxVQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEQsVUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDekMsVUFBTSxRQUFRLFFBQU0sSUFBSSxHQUFHLEtBQUssR0FBRyxHQUFHLFNBQU0sQ0FBQzs7QUFFN0MsYUFBTyxrQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMxQzs7O1NBNUJHLG1CQUFtQjs7O0FBOER6QixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztxQkFFaEQsbUJBQW1CIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyRXJyb3JSZXBvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBmc2UgIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5mdW5jdGlvbiBwYWRMZWZ0KHN0ciwgdmFsdWUsIGxlbmd0aCkge1xuICBzdHIgPSBzdHIgKyAnJztcbiAgd2hpbGUgKHN0ci5sZW5ndGggPCBsZW5ndGgpIHsgc3RyID0gdmFsdWUgKyBzdHI7IH1cbiAgcmV0dXJuIHN0cjtcbn1cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmVycm9yLXJlcG9ydGVyJztcblxuY2xhc3MgU2VydmVyRXJyb3JSZXBvcnRlciBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICAgIGZvbGRlcjogJ2xvZ3MvY2xpZW50cycsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9sb2dFcnJvciA9IHRoaXMuX2xvZ0Vycm9yLmJpbmQodGhpcyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICAvLyBAdG9kbyAtIHRlc3QgaWYgaXQgZG9lcyB0aGUgam9iIG9uIHdpbmRvd3NcbiAgICBjb25zdCBkaXJQYXRoID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIHRoaXMub3B0aW9ucy5mb2xkZXIpO1xuICAgIHRoaXMuZGlyUGF0aCA9IHBhdGgubm9ybWFsaXplKGRpclBhdGgpO1xuICAgIC8vIGNyZWF0ZSBkaXJlY3RvcnkgaWYgbm90IGV4aXN0c1xuICAgIGZzZS5lbnN1cmVEaXJTeW5jKGRpclBhdGgpO1xuICB9XG5cbiAgZ2V0IGZpbGVQYXRoKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBgJHt5ZWFyfSR7bW9udGh9JHtkYXl9LmxvZ2A7XG5cbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuZGlyUGF0aCwgZmlsZW5hbWUpO1xuICB9XG5cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgYGVycm9yYCwgdGhpcy5fbG9nRXJyb3IpO1xuICB9XG5cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gIH1cblxuICBfZ2V0Rm9ybWF0dGVkRGF0ZSgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCA0KTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGhvdXIgPSBwYWRMZWZ0KG5vdy5nZXRIb3VycygpLCAwLCAyKTtcbiAgICBjb25zdCBtaW51dGVzID0gcGFkTGVmdChub3cuZ2V0TWludXRlcygpLCAwLCAyKTtcbiAgICBjb25zdCBzZWNvbmRzID0gcGFkTGVmdChub3cuZ2V0U2Vjb25kcygpLCAwLCAyKTtcbiAgICAvLyBwcmVwYXJlIGZpbGUgbmFtZVxuICAgIHJldHVybiBgJHt5ZWFyfS0ke21vbnRofS0ke2RheX0gJHtob3VyfToke21pbnV0ZXN9OiR7c2Vjb25kc31gO1xuICB9XG5cbiAgX2xvZ0Vycm9yKGZpbGUsIGxpbmUsIGNvbCwgbXNnLCB1c2VyQWdlbnQpIHtcbiAgICBsZXQgZW50cnkgPSBgJHt0aGlzLl9nZXRGb3JtYXR0ZWREYXRlKCl9XFx0XFx0XFx0YDtcbiAgICBlbnRyeSArPSBgLSAke2ZpbGV9OiR7bGluZX06JHtjb2x9XFx0XCIke21zZ31cIlxcblxcdCR7dXNlckFnZW50fVxcblxcbmA7XG5cbiAgICBmc2UuYXBwZW5kRmlsZSh0aGlzLmZpbGVQYXRoLCBlbnRyeSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycilcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIubWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyRXJyb3JSZXBvcnRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlckVycm9yUmVwb3J0ZXI7XG4iXX0=
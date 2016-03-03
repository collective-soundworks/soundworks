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
      var dir = this._sharedConfigService.get(this.options.directoryConfig);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyRXJyb3JSZXBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7Ozt1QkFDOUMsVUFBVTs7OztvQkFDVixNQUFNOzs7O0FBRXZCLFNBQVMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFO0FBQ25DLEtBQUcsR0FBRyxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsU0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLE1BQU0sRUFBRTtBQUFFLE9BQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO0dBQUU7QUFDbEQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7QUFFRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQzs7SUFFdEMsbUJBQW1CO1lBQW5CLG1CQUFtQjs7QUFDWixXQURQLG1CQUFtQixHQUNUOzBCQURWLG1CQUFtQjs7QUFFckIsK0JBRkUsbUJBQW1CLDZDQUVmLFVBQVUsRUFBRTs7QUFFbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixxQkFBZSxFQUFFLHdCQUF3QjtLQUMxQyxDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDekIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFekMsUUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7R0FDM0Q7O2VBWkcsbUJBQW1COztXQWNsQixpQkFBRztBQUNOLFVBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN0RSxT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Ozs7QUFnRXpCLHNDQUFxQixRQUFRLENBQUMsVUFBVSxFQUFFLG1CQUFtQixDQUFDLENBQUM7O3FCQUVoRCxtQkFBbUIiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJFcnJvclJlcG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuaW1wb3J0IGZzZSAgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmZ1bmN0aW9uIHBhZExlZnQoc3RyLCB2YWx1ZSwgbGVuZ3RoKSB7XG4gIHN0ciA9IHN0ciArICcnO1xuICB3aGlsZSAoc3RyLmxlbmd0aCA8IGxlbmd0aCkgeyBzdHIgPSB2YWx1ZSArIHN0cjsgfVxuICByZXR1cm4gc3RyO1xufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6ZXJyb3ItcmVwb3J0ZXInO1xuXG5jbGFzcyBTZXJ2ZXJFcnJvclJlcG9ydGVyIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGlyZWN0b3J5Q29uZmlnOiAnZXJyb3JSZXBvcnRlckRpcmVjdG9yeScsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9vbkVycm9yID0gdGhpcy5fb25FcnJvci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgbGV0IGRpciA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KHRoaXMub3B0aW9ucy5kaXJlY3RvcnlDb25maWcpO1xuICAgIGRpciA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBkaXIpO1xuICAgIGRpciA9IHBhdGgubm9ybWFsaXplKGRpcik7IC8vIEB0b2RvIC0gY2hlY2sgaXQgZG9lcyB0aGUgam9iIG9uIHdpbmRvd3NcbiAgICBmc2UuZW5zdXJlRGlyU3luYyhkaXIpOyAvLyBjcmVhdGUgZGlyZWN0b3J5IGlmIG5vdCBleGlzdHNcblxuICAgIHRoaXMuZGlyID0gZGlyO1xuICB9XG5cbiAgZ2V0IGZpbGVQYXRoKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBgJHt5ZWFyfSR7bW9udGh9JHtkYXl9LmxvZ2A7XG5cbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuZGlyLCBmaWxlbmFtZSk7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCBgZXJyb3JgLCB0aGlzLl9vbkVycm9yKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICB9XG5cbiAgX29uRXJyb3IoZmlsZSwgbGluZSwgY29sLCBtc2csIHVzZXJBZ2VudCkge1xuICAgIGxldCBlbnRyeSA9IGAke3RoaXMuX2dldEZvcm1hdHRlZERhdGUoKX1cXHRcXHRcXHRgO1xuICAgIGVudHJ5ICs9IGAtICR7ZmlsZX06JHtsaW5lfToke2NvbH1cXHRcIiR7bXNnfVwiXFxuXFx0JHt1c2VyQWdlbnR9XFxuXFxuYDtcblxuICAgIGZzZS5hcHBlbmRGaWxlKHRoaXMuZmlsZVBhdGgsIGVudHJ5LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9nZXRGb3JtYXR0ZWREYXRlKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgaG91ciA9IHBhZExlZnQobm93LmdldEhvdXJzKCksIDAsIDIpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBwYWRMZWZ0KG5vdy5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgIGNvbnN0IHNlY29uZHMgPSBwYWRMZWZ0KG5vdy5nZXRTZWNvbmRzKCksIDAsIDIpO1xuICAgIC8vIHByZXBhcmUgZmlsZSBuYW1lXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlc306JHtzZWNvbmRzfWA7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyRXJyb3JSZXBvcnRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlckVycm9yUmVwb3J0ZXI7XG4iXX0=
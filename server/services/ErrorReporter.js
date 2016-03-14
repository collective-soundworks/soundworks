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

var ErrorReporter = function (_Activity) {
  (0, _inherits3.default)(ErrorReporter, _Activity);

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

  (0, _createClass3.default)(ErrorReporter, [{
    key: 'start',
    value: function start() {
      var dir = this._sharedConfigService.get(this.options.directoryConfig);
      dir = _path2.default.join(process.cwd(), dir);
      dir = _path2.default.normalize(dir); // @todo - check it does the job on windows
      _fsExtra2.default.ensureDirSync(dir); // create directory if not exists

      this.dir = dir;
    }
  }, {
    key: 'connect',
    value: function connect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ErrorReporter.prototype), 'connect', this).call(this, client);
      this.receive(client, 'error', this._onError);
    }
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ErrorReporter.prototype), 'disconnect', this).call(this, client);
    }
  }, {
    key: '_onError',
    value: function _onError(file, line, col, msg, userAgent) {
      var entry = this._getFormattedDate() + '\t\t\t';
      entry += '- ' + file + ':' + line + ':' + col + '\t"' + msg + '"\n\t' + userAgent + '\n\n';

      _fsExtra2.default.appendFile(this.filePath, entry, function (err) {
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

      return _path2.default.join(this.dir, filename);
    }
  }]);
  return ErrorReporter;
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, ErrorReporter);

exports.default = ErrorReporter;
//# sourceMappingURL=data:application/json;base64,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QU0sT0FBTyxRQUFRLElBQUksV0FBSixFQUFSLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLENBQVAsQ0FGTztBQUdiLFVBQU0sUUFBUSxRQUFRLElBQUksUUFBSixLQUFpQixDQUFqQixFQUFvQixDQUE1QixFQUErQixDQUEvQixDQUFSLENBSE87QUFJYixVQUFNLE1BQU0sUUFBUSxJQUFJLE9BQUosRUFBUixFQUF1QixDQUF2QixFQUEwQixDQUExQixDQUFOLENBSk87QUFLYixVQUFNLGdCQUFjLE9BQU8sUUFBUSxZQUE3QixDQUxPOztBQU9iLGFBQU8sZUFBSyxJQUFMLENBQVUsS0FBSyxHQUFMLEVBQVUsUUFBcEIsQ0FBUCxDQVBhOzs7U0F2Qlg7OztBQWdFTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLGFBQXBDOztrQkFFZSIsImZpbGUiOiJFcnJvclJlcG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4uL2NvcmUvQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IGZzZSAgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmZ1bmN0aW9uIHBhZExlZnQoc3RyLCB2YWx1ZSwgbGVuZ3RoKSB7XG4gIHN0ciA9IHN0ciArICcnO1xuICB3aGlsZSAoc3RyLmxlbmd0aCA8IGxlbmd0aCkgeyBzdHIgPSB2YWx1ZSArIHN0cjsgfVxuICByZXR1cm4gc3RyO1xufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6ZXJyb3ItcmVwb3J0ZXInO1xuXG5jbGFzcyBFcnJvclJlcG9ydGVyIGV4dGVuZHMgQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgZGlyZWN0b3J5Q29uZmlnOiAnZXJyb3JSZXBvcnRlckRpcmVjdG9yeScsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9vbkVycm9yID0gdGhpcy5fb25FcnJvci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgbGV0IGRpciA9IHRoaXMuX3NoYXJlZENvbmZpZ1NlcnZpY2UuZ2V0KHRoaXMub3B0aW9ucy5kaXJlY3RvcnlDb25maWcpO1xuICAgIGRpciA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBkaXIpO1xuICAgIGRpciA9IHBhdGgubm9ybWFsaXplKGRpcik7IC8vIEB0b2RvIC0gY2hlY2sgaXQgZG9lcyB0aGUgam9iIG9uIHdpbmRvd3NcbiAgICBmc2UuZW5zdXJlRGlyU3luYyhkaXIpOyAvLyBjcmVhdGUgZGlyZWN0b3J5IGlmIG5vdCBleGlzdHNcblxuICAgIHRoaXMuZGlyID0gZGlyO1xuICB9XG5cbiAgZ2V0IGZpbGVQYXRoKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgZmlsZW5hbWUgPSBgJHt5ZWFyfSR7bW9udGh9JHtkYXl9LmxvZ2A7XG5cbiAgICByZXR1cm4gcGF0aC5qb2luKHRoaXMuZGlyLCBmaWxlbmFtZSk7XG4gIH1cblxuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCBgZXJyb3JgLCB0aGlzLl9vbkVycm9yKTtcbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICB9XG5cbiAgX29uRXJyb3IoZmlsZSwgbGluZSwgY29sLCBtc2csIHVzZXJBZ2VudCkge1xuICAgIGxldCBlbnRyeSA9IGAke3RoaXMuX2dldEZvcm1hdHRlZERhdGUoKX1cXHRcXHRcXHRgO1xuICAgIGVudHJ5ICs9IGAtICR7ZmlsZX06JHtsaW5lfToke2NvbH1cXHRcIiR7bXNnfVwiXFxuXFx0JHt1c2VyQWdlbnR9XFxuXFxuYDtcblxuICAgIGZzZS5hcHBlbmRGaWxlKHRoaXMuZmlsZVBhdGgsIGVudHJ5LCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSBjb25zb2xlLmVycm9yKGVyci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9nZXRGb3JtYXR0ZWREYXRlKCkge1xuICAgIGNvbnN0IG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgY29uc3QgeWVhciA9IHBhZExlZnQobm93LmdldEZ1bGxZZWFyKCksIDAsIDQpO1xuICAgIGNvbnN0IG1vbnRoID0gcGFkTGVmdChub3cuZ2V0TW9udGgoKSArIDEsIDAsIDIpO1xuICAgIGNvbnN0IGRheSA9IHBhZExlZnQobm93LmdldERhdGUoKSwgMCwgMik7XG4gICAgY29uc3QgaG91ciA9IHBhZExlZnQobm93LmdldEhvdXJzKCksIDAsIDIpO1xuICAgIGNvbnN0IG1pbnV0ZXMgPSBwYWRMZWZ0KG5vdy5nZXRNaW51dGVzKCksIDAsIDIpO1xuICAgIGNvbnN0IHNlY29uZHMgPSBwYWRMZWZ0KG5vdy5nZXRTZWNvbmRzKCksIDAsIDIpO1xuICAgIC8vIHByZXBhcmUgZmlsZSBuYW1lXG4gICAgcmV0dXJuIGAke3llYXJ9LSR7bW9udGh9LSR7ZGF5fSAke2hvdXJ9OiR7bWludXRlc306JHtzZWNvbmRzfWA7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgRXJyb3JSZXBvcnRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IEVycm9yUmVwb3J0ZXI7XG4iXX0=
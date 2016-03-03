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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlckVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztrQ0FBMkIsd0JBQXdCOzs7O3dDQUNsQiw4QkFBOEI7Ozs7dUJBQzlDLFVBQVU7Ozs7b0JBQ1YsTUFBTTs7OztBQUV2QixTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtBQUNuQyxLQUFHLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNmLFNBQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLEVBQUU7QUFBRSxPQUFHLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztHQUFFO0FBQ2xELFNBQU8sR0FBRyxDQUFDO0NBQ1o7O0FBRUQsSUFBTSxVQUFVLEdBQUcsd0JBQXdCLENBQUM7O0lBRXRDLG1CQUFtQjtZQUFuQixtQkFBbUI7O0FBQ1osV0FEUCxtQkFBbUIsR0FDVDswQkFEVixtQkFBbUI7O0FBRXJCLCtCQUZFLG1CQUFtQiw2Q0FFZixVQUFVLEVBQUU7O0FBRWxCLFFBQU0sUUFBUSxHQUFHO0FBQ2YscUJBQWUsRUFBRSx3QkFBd0I7S0FDMUMsQ0FBQzs7QUFFRixRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXpDLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQzNEOztlQVpHLG1CQUFtQjs7V0FjbEIsaUJBQUc7QUFDTixVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZUFB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QUN0Qzs7O1NBL0JHLG1CQUFtQjs7O0FBZ0V6QixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztxQkFFaEQsbUJBQW1CIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL3NlcnZpY2VzL1NlcnZlckVycm9yUmVwb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgZnNlICBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gcGFkTGVmdChzdHIsIHZhbHVlLCBsZW5ndGgpIHtcbiAgc3RyID0gc3RyICsgJyc7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7IHN0ciA9IHZhbHVlICsgc3RyOyB9XG4gIHJldHVybiBzdHI7XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTplcnJvci1yZXBvcnRlcic7XG5cbmNsYXNzIFNlcnZlckVycm9yUmVwb3J0ZXIgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBkaXJlY3RvcnlDb25maWc6ICdlcnJvclJlcG9ydGVyRGlyZWN0b3J5JyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX29uRXJyb3IgPSB0aGlzLl9vbkVycm9yLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBsZXQgZGlyID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQodGhpcy5vcHRpb25zLmRpcmVjdG9yeUNvbmZpZyk7XG4gICAgZGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGRpcik7XG4gICAgZGlyID0gcGF0aC5ub3JtYWxpemUoZGlyKTsgLy8gQHRvZG8gLSBjaGVjayBpdCBkb2VzIHRoZSBqb2Igb24gd2luZG93c1xuICAgIGZzZS5lbnN1cmVEaXJTeW5jKGRpcik7IC8vIGNyZWF0ZSBkaXJlY3RvcnkgaWYgbm90IGV4aXN0c1xuXG4gICAgdGhpcy5kaXIgPSBkaXI7XG4gIH1cblxuICBnZXQgZmlsZVBhdGgoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgNCk7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGAke3llYXJ9JHttb250aH0ke2RheX0ubG9nYDtcblxuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5kaXIsIGZpbGVuYW1lKTtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsIGBlcnJvcmAsIHRoaXMuX29uRXJyb3IpO1xuICB9XG5cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gIH1cblxuICBfb25FcnJvcihmaWxlLCBsaW5lLCBjb2wsIG1zZywgdXNlckFnZW50KSB7XG4gICAgbGV0IGVudHJ5ID0gYCR7dGhpcy5fZ2V0Rm9ybWF0dGVkRGF0ZSgpfVxcdFxcdFxcdGA7XG4gICAgZW50cnkgKz0gYC0gJHtmaWxlfToke2xpbmV9OiR7Y29sfVxcdFwiJHttc2d9XCJcXG5cXHQke3VzZXJBZ2VudH1cXG5cXG5gO1xuXG4gICAgZnNlLmFwcGVuZEZpbGUodGhpcy5maWxlUGF0aCwgZW50cnksIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldEZvcm1hdHRlZERhdGUoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgNCk7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBob3VyID0gcGFkTGVmdChub3cuZ2V0SG91cnMoKSwgMCwgMik7XG4gICAgY29uc3QgbWludXRlcyA9IHBhZExlZnQobm93LmdldE1pbnV0ZXMoKSwgMCwgMik7XG4gICAgY29uc3Qgc2Vjb25kcyA9IHBhZExlZnQobm93LmdldFNlY29uZHMoKSwgMCwgMik7XG4gICAgLy8gcHJlcGFyZSBmaWxlIG5hbWVcbiAgICByZXR1cm4gYCR7eWVhcn0tJHttb250aH0tJHtkYXl9ICR7aG91cn06JHttaW51dGVzfToke3NlY29uZHN9YDtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJFcnJvclJlcG9ydGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyRXJyb3JSZXBvcnRlcjtcbiJdfQ==
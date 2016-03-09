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

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

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

var ServerErrorReporter = function (_ServerActivity) {
  (0, _inherits3.default)(ServerErrorReporter, _ServerActivity);

  function ServerErrorReporter() {
    (0, _classCallCheck3.default)(this, ServerErrorReporter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerErrorReporter).call(this, SERVICE_ID));

    var defaults = {
      directoryConfig: 'errorReporterDirectory'
    };

    _this.configure(defaults);
    _this._onError = _this._onError.bind(_this);

    _this._sharedConfigService = _this.require('shared-config');
    return _this;
  }

  (0, _createClass3.default)(ServerErrorReporter, [{
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerErrorReporter.prototype), 'connect', this).call(this, client);
      this.receive(client, 'error', this._onError);
    }
  }, {
    key: 'disconnect',
    value: function disconnect(client) {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ServerErrorReporter.prototype), 'disconnect', this).call(this, client);
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
  return ServerErrorReporter;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, ServerErrorReporter);

exports.default = ServerErrorReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlckVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBLFNBQVMsT0FBVCxDQUFpQixHQUFqQixFQUFzQixLQUF0QixFQUE2QixNQUE3QixFQUFxQztBQUNuQyxRQUFNLE1BQU0sRUFBTixDQUQ2QjtBQUVuQyxTQUFPLElBQUksTUFBSixHQUFhLE1BQWIsRUFBcUI7QUFBRSxVQUFNLFFBQVEsR0FBUixDQUFSO0dBQTVCO0FBQ0EsU0FBTyxHQUFQLENBSG1DO0NBQXJDOztBQU1BLElBQU0sYUFBYSx3QkFBYjs7SUFFQTs7O0FBQ0osV0FESSxtQkFDSixHQUFjO3dDQURWLHFCQUNVOzs2RkFEVixnQ0FFSSxhQURNOztBQUdaLFFBQU0sV0FBVztBQUNmLHVCQUFpQix3QkFBakI7S0FESSxDQUhNOztBQU9aLFVBQUssU0FBTCxDQUFlLFFBQWYsRUFQWTtBQVFaLFVBQUssUUFBTCxHQUFnQixNQUFLLFFBQUwsQ0FBYyxJQUFkLE9BQWhCLENBUlk7O0FBVVosVUFBSyxvQkFBTCxHQUE0QixNQUFLLE9BQUwsQ0FBYSxlQUFiLENBQTVCLENBVlk7O0dBQWQ7OzZCQURJOzs0QkFjSTtBQUNOLFVBQUksTUFBTSxLQUFLLG9CQUFMLENBQTBCLEdBQTFCLENBQThCLEtBQUssT0FBTCxDQUFhLGVBQWIsQ0FBcEMsQ0FERTtBQUVOLFlBQU0sZUFBSyxJQUFMLENBQVUsUUFBUSxHQUFSLEVBQVYsRUFBeUIsR0FBekIsQ0FBTixDQUZNO0FBR04sWUFBTSxlQUFLLFNBQUwsQ0FBZSxHQUFmLENBQU47QUFITSx1QkFJTixDQUFJLGFBQUosQ0FBa0IsR0FBbEI7O0FBSk0sVUFNTixDQUFLLEdBQUwsR0FBVyxHQUFYLENBTk07Ozs7NEJBbUJBLFFBQVE7QUFDZCx1REFsQ0UsNERBa0NZLE9BQWQsQ0FEYztBQUVkLFdBQUssT0FBTCxDQUFhLE1BQWIsV0FBOEIsS0FBSyxRQUFMLENBQTlCLENBRmM7Ozs7K0JBS0wsUUFBUTtBQUNqQix1REF2Q0UsK0RBdUNlLE9BQWpCLENBRGlCOzs7OzZCQUlWLE1BQU0sTUFBTSxLQUFLLEtBQUssV0FBVztBQUN4QyxVQUFJLFFBQVcsS0FBSyxpQkFBTCxhQUFYLENBRG9DO0FBRXhDLHNCQUFjLGFBQVEsYUFBUSxjQUFTLGdCQUFXLGtCQUFsRCxDQUZ3Qzs7QUFJeEMsd0JBQUksVUFBSixDQUFlLEtBQUssUUFBTCxFQUFlLEtBQTlCLEVBQXFDLFVBQUMsR0FBRCxFQUFTO0FBQzVDLFlBQUksR0FBSixFQUFTLFFBQVEsS0FBUixDQUFjLElBQUksT0FBSixDQUFkLENBQVQ7T0FEbUMsQ0FBckMsQ0FKd0M7Ozs7d0NBU3RCO0FBQ2xCLFVBQU0sTUFBTSxJQUFJLElBQUosRUFBTixDQURZO0FBRWxCLFVBQU0sT0FBTyxRQUFRLElBQUksV0FBSixFQUFSLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLENBQVAsQ0FGWTtBQUdsQixVQUFNLFFBQVEsUUFBUSxJQUFJLFFBQUosS0FBaUIsQ0FBakIsRUFBb0IsQ0FBNUIsRUFBK0IsQ0FBL0IsQ0FBUixDQUhZO0FBSWxCLFVBQU0sTUFBTSxRQUFRLElBQUksT0FBSixFQUFSLEVBQXVCLENBQXZCLEVBQTBCLENBQTFCLENBQU4sQ0FKWTtBQUtsQixVQUFNLE9BQU8sUUFBUSxJQUFJLFFBQUosRUFBUixFQUF3QixDQUF4QixFQUEyQixDQUEzQixDQUFQLENBTFk7QUFNbEIsVUFBTSxVQUFVLFFBQVEsSUFBSSxVQUFKLEVBQVIsRUFBMEIsQ0FBMUIsRUFBNkIsQ0FBN0IsQ0FBVixDQU5ZO0FBT2xCLFVBQU0sVUFBVSxRQUFRLElBQUksVUFBSixFQUFSLEVBQTBCLENBQTFCLEVBQTZCLENBQTdCLENBQVY7O0FBUFksYUFTUixhQUFRLGNBQVMsWUFBTyxhQUFRLGdCQUFXLE9BQXJELENBVGtCOzs7O3dCQTVCTDtBQUNiLFVBQU0sTUFBTSxJQUFJLElBQUosRUFBTixDQURPO0FBRWIsVUFBTSxPQUFPLFFBQVEsSUFBSSxXQUFKLEVBQVIsRUFBMkIsQ0FBM0IsRUFBOEIsQ0FBOUIsQ0FBUCxDQUZPO0FBR2IsVUFBTSxRQUFRLFFBQVEsSUFBSSxRQUFKLEtBQWlCLENBQWpCLEVBQW9CLENBQTVCLEVBQStCLENBQS9CLENBQVIsQ0FITztBQUliLFVBQU0sTUFBTSxRQUFRLElBQUksT0FBSixFQUFSLEVBQXVCLENBQXZCLEVBQTBCLENBQTFCLENBQU4sQ0FKTztBQUtiLFVBQU0sZ0JBQWMsT0FBTyxRQUFRLFlBQTdCLENBTE87O0FBT2IsYUFBTyxlQUFLLElBQUwsQ0FBVSxLQUFLLEdBQUwsRUFBVSxRQUFwQixDQUFQLENBUGE7OztTQXZCWDs7O0FBZ0VOLCtCQUFxQixRQUFyQixDQUE4QixVQUE5QixFQUEwQyxtQkFBMUM7O2tCQUVlIiwiZmlsZSI6IlNlcnZlckVycm9yUmVwb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgZnNlICBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZnVuY3Rpb24gcGFkTGVmdChzdHIsIHZhbHVlLCBsZW5ndGgpIHtcbiAgc3RyID0gc3RyICsgJyc7XG4gIHdoaWxlIChzdHIubGVuZ3RoIDwgbGVuZ3RoKSB7IHN0ciA9IHZhbHVlICsgc3RyOyB9XG4gIHJldHVybiBzdHI7XG59XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTplcnJvci1yZXBvcnRlcic7XG5cbmNsYXNzIFNlcnZlckVycm9yUmVwb3J0ZXIgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBkaXJlY3RvcnlDb25maWc6ICdlcnJvclJlcG9ydGVyRGlyZWN0b3J5JyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuICAgIHRoaXMuX29uRXJyb3IgPSB0aGlzLl9vbkVycm9yLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBsZXQgZGlyID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQodGhpcy5vcHRpb25zLmRpcmVjdG9yeUNvbmZpZyk7XG4gICAgZGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIGRpcik7XG4gICAgZGlyID0gcGF0aC5ub3JtYWxpemUoZGlyKTsgLy8gQHRvZG8gLSBjaGVjayBpdCBkb2VzIHRoZSBqb2Igb24gd2luZG93c1xuICAgIGZzZS5lbnN1cmVEaXJTeW5jKGRpcik7IC8vIGNyZWF0ZSBkaXJlY3RvcnkgaWYgbm90IGV4aXN0c1xuXG4gICAgdGhpcy5kaXIgPSBkaXI7XG4gIH1cblxuICBnZXQgZmlsZVBhdGgoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgNCk7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBmaWxlbmFtZSA9IGAke3llYXJ9JHttb250aH0ke2RheX0ubG9nYDtcblxuICAgIHJldHVybiBwYXRoLmpvaW4odGhpcy5kaXIsIGZpbGVuYW1lKTtcbiAgfVxuXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsIGBlcnJvcmAsIHRoaXMuX29uRXJyb3IpO1xuICB9XG5cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gIH1cblxuICBfb25FcnJvcihmaWxlLCBsaW5lLCBjb2wsIG1zZywgdXNlckFnZW50KSB7XG4gICAgbGV0IGVudHJ5ID0gYCR7dGhpcy5fZ2V0Rm9ybWF0dGVkRGF0ZSgpfVxcdFxcdFxcdGA7XG4gICAgZW50cnkgKz0gYC0gJHtmaWxlfToke2xpbmV9OiR7Y29sfVxcdFwiJHttc2d9XCJcXG5cXHQke3VzZXJBZ2VudH1cXG5cXG5gO1xuXG4gICAgZnNlLmFwcGVuZEZpbGUodGhpcy5maWxlUGF0aCwgZW50cnksIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIpIGNvbnNvbGUuZXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgIH0pO1xuICB9XG5cbiAgX2dldEZvcm1hdHRlZERhdGUoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgNCk7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBob3VyID0gcGFkTGVmdChub3cuZ2V0SG91cnMoKSwgMCwgMik7XG4gICAgY29uc3QgbWludXRlcyA9IHBhZExlZnQobm93LmdldE1pbnV0ZXMoKSwgMCwgMik7XG4gICAgY29uc3Qgc2Vjb25kcyA9IHBhZExlZnQobm93LmdldFNlY29uZHMoKSwgMCwgMik7XG4gICAgLy8gcHJlcGFyZSBmaWxlIG5hbWVcbiAgICByZXR1cm4gYCR7eWVhcn0tJHttb250aH0tJHtkYXl9ICR7aG91cn06JHttaW51dGVzfToke3NlY29uZHN9YDtcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJFcnJvclJlcG9ydGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyRXJyb3JSZXBvcnRlcjtcbiJdfQ==
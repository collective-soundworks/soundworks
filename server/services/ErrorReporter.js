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
      var dir = this._sharedConfig.get(this.options.configItem);

      if (dir === null) dir = _path2.default.join(process.cwd(), 'logs', 'clients');

      _fsExtra2.default.ensureDirSync(dir); // create directory if not exists

      this.dir = dir;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOlsicGFkTGVmdCIsInN0ciIsInZhbHVlIiwibGVuZ3RoIiwiU0VSVklDRV9JRCIsIkVycm9yUmVwb3J0ZXIiLCJkZWZhdWx0cyIsImNvbmZpZ0l0ZW0iLCJjb25maWd1cmUiLCJfb25FcnJvciIsImJpbmQiLCJfc2hhcmVkQ29uZmlnIiwicmVxdWlyZSIsImRpciIsImdldCIsIm9wdGlvbnMiLCJqb2luIiwicHJvY2VzcyIsImN3ZCIsImVuc3VyZURpclN5bmMiLCJjbGllbnQiLCJyZWNlaXZlIiwiZmlsZSIsImxpbmUiLCJjb2wiLCJtc2ciLCJ1c2VyQWdlbnQiLCJlbnRyeSIsIl9nZXRGb3JtYXR0ZWREYXRlIiwiYXBwZW5kRmlsZSIsImZpbGVQYXRoIiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwibWVzc2FnZSIsIm5vdyIsIkRhdGUiLCJ5ZWFyIiwiZ2V0RnVsbFllYXIiLCJtb250aCIsImdldE1vbnRoIiwiZGF5IiwiZ2V0RGF0ZSIsImhvdXIiLCJnZXRIb3VycyIsIm1pbnV0ZXMiLCJnZXRNaW51dGVzIiwic2Vjb25kcyIsImdldFNlY29uZHMiLCJmaWxlbmFtZSIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBR0EsU0FBU0EsT0FBVCxDQUFpQkMsR0FBakIsRUFBc0JDLEtBQXRCLEVBQTZCQyxNQUE3QixFQUFxQztBQUNuQ0YsUUFBTUEsTUFBTSxFQUFaO0FBQ0EsU0FBT0EsSUFBSUUsTUFBSixHQUFhQSxNQUFwQixFQUE0QjtBQUFFRixVQUFNQyxRQUFRRCxHQUFkO0FBQW9CO0FBQ2xELFNBQU9BLEdBQVA7QUFDRDs7QUFFRCxJQUFNRyxhQUFhLHdCQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCTUMsYTs7O0FBQ0o7QUFDQSwyQkFBYztBQUFBOztBQUFBLG9KQUNORCxV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QyxRQUFmLENBQXdCOUMsVUFBeEIsRUFBb0NDLGFBQXBDOztrQkFFZUEsYSIsImZpbGUiOiJFcnJvclJlcG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGZzZSAgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5cbmZ1bmN0aW9uIHBhZExlZnQoc3RyLCB2YWx1ZSwgbGVuZ3RoKSB7XG4gIHN0ciA9IHN0ciArICcnO1xuICB3aGlsZSAoc3RyLmxlbmd0aCA8IGxlbmd0aCkgeyBzdHIgPSB2YWx1ZSArIHN0cjsgfVxuICByZXR1cm4gc3RyO1xufVxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6ZXJyb3ItcmVwb3J0ZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ2Vycm9yLXJlcG9ydGVyJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgYWxsb3dzIHRvIGxvZyBqYXZhc2NyaXB0IGVycm9ycyB0aGF0IGNvdWxkIG9jY3VyIGR1cmluZyB0aGVcbiAqIGFwcGxpY2F0aW9uIGxpZmUgY3ljbGUuIEVycm9ycyBhcmUgY2F1Z2h0IGFuZCBzZW50IHRvIHRoZSBzZXJ2ZXIgaW4gb3JkZXJcbiAqIHRvIGJlIHBlcnNpc3RlZCBpbiBhIGZpbGUuXG4gKiBCeSBkZWZhdWx0LCB0aGUgbG9nIGZpbGUgYXJlIGxvY2F0ZWQgaW4gdGhlIGBsb2dzL2NsaWVudHNgIGRpcmVjdG9yeSBpbnNpZGVcbiAqIHRoZSBhcHBsaWNhdGlvbiBkaXJlY3RvcnkuIFRoaXMgbG9jYXRpb24gY2FuIGJlIGNoYW5nZWQgYnkgbW9kaWZ5aW5nIHRoZVxuICogYGVycm9yUmVwb3J0ZXJEaXJlY3RvcnlgIGVudHJ5IG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAqXG4gKiAqVGhlIHNlcnZpY2UgaXMgYXV0b21hdGljYWxseSBsYXVuY2hlZCB3aGVuZXZlciB0aGUgYXBwbGljYXRpb24gZGV0ZWN0cyB0aGVcbiAqIHVzZSBvZiBhIG5ldHdvcmtlZCBhY3Rpdml0eS4gSXQgc2hvdWxkIG5ldmVyIGJlIHJlcXVpcmVkIG1hbnVhbGx5IGluc2lkZVxuICogYW4gYXBwbGljYXRpb24uKlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5FcnJvclJlcG9ydGVyfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqL1xuY2xhc3MgRXJyb3JSZXBvcnRlciBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBjb25maWdJdGVtOiAnZXJyb3JSZXBvcnRlckRpcmVjdG9yeScsXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgICB0aGlzLl9vbkVycm9yID0gdGhpcy5fb25FcnJvci5iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgbGV0IGRpciA9IHRoaXMuX3NoYXJlZENvbmZpZy5nZXQodGhpcy5vcHRpb25zLmNvbmZpZ0l0ZW0pO1xuXG4gICAgaWYgKGRpciA9PT0gbnVsbClcbiAgICAgIGRpciA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCAnbG9ncycsICdjbGllbnRzJyk7XG5cbiAgICBmc2UuZW5zdXJlRGlyU3luYyhkaXIpOyAvLyBjcmVhdGUgZGlyZWN0b3J5IGlmIG5vdCBleGlzdHNcblxuICAgIHRoaXMuZGlyID0gZGlyO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGdldCBmaWxlUGF0aCgpIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGNvbnN0IHllYXIgPSBwYWRMZWZ0KG5vdy5nZXRGdWxsWWVhcigpLCAwLCA0KTtcbiAgICBjb25zdCBtb250aCA9IHBhZExlZnQobm93LmdldE1vbnRoKCkgKyAxLCAwLCAyKTtcbiAgICBjb25zdCBkYXkgPSBwYWRMZWZ0KG5vdy5nZXREYXRlKCksIDAsIDIpO1xuICAgIGNvbnN0IGZpbGVuYW1lID0gYCR7eWVhcn0ke21vbnRofSR7ZGF5fS5sb2dgO1xuXG4gICAgcmV0dXJuIHBhdGguam9pbih0aGlzLmRpciwgZmlsZW5hbWUpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsIGBlcnJvcmAsIHRoaXMuX29uRXJyb3IpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9vbkVycm9yKGZpbGUsIGxpbmUsIGNvbCwgbXNnLCB1c2VyQWdlbnQpIHtcbiAgICBsZXQgZW50cnkgPSBgJHt0aGlzLl9nZXRGb3JtYXR0ZWREYXRlKCl9XFx0XFx0XFx0YDtcbiAgICBlbnRyeSArPSBgLSAke2ZpbGV9OiR7bGluZX06JHtjb2x9XFx0XCIke21zZ31cIlxcblxcdCR7dXNlckFnZW50fVxcblxcbmA7XG5cbiAgICBmc2UuYXBwZW5kRmlsZSh0aGlzLmZpbGVQYXRoLCBlbnRyeSwgKGVycikgPT4ge1xuICAgICAgaWYgKGVycikgY29uc29sZS5lcnJvcihlcnIubWVzc2FnZSk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX2dldEZvcm1hdHRlZERhdGUoKSB7XG4gICAgY29uc3Qgbm93ID0gbmV3IERhdGUoKTtcbiAgICBjb25zdCB5ZWFyID0gcGFkTGVmdChub3cuZ2V0RnVsbFllYXIoKSwgMCwgNCk7XG4gICAgY29uc3QgbW9udGggPSBwYWRMZWZ0KG5vdy5nZXRNb250aCgpICsgMSwgMCwgMik7XG4gICAgY29uc3QgZGF5ID0gcGFkTGVmdChub3cuZ2V0RGF0ZSgpLCAwLCAyKTtcbiAgICBjb25zdCBob3VyID0gcGFkTGVmdChub3cuZ2V0SG91cnMoKSwgMCwgMik7XG4gICAgY29uc3QgbWludXRlcyA9IHBhZExlZnQobm93LmdldE1pbnV0ZXMoKSwgMCwgMik7XG4gICAgY29uc3Qgc2Vjb25kcyA9IHBhZExlZnQobm93LmdldFNlY29uZHMoKSwgMCwgMik7XG4gICAgLy8gcHJlcGFyZSBmaWxlIG5hbWVcbiAgICByZXR1cm4gYCR7eWVhcn0tJHttb250aH0tJHtkYXl9ICR7aG91cn06JHttaW51dGVzfToke3NlY29uZHN9YDtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBFcnJvclJlcG9ydGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JSZXBvcnRlcjtcbiJdfQ==
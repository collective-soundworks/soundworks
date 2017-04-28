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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _helpers = require('../../utils/helpers');

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:audio-buffer-manager';

/**
 * Interface for the server `'audio-buffer-manager'` service.
 *
 * @memberof module:soundworks/server
 * @example
 * // inside the experience constructor
 * this.audioBufferManager = this.require('audio-buffer-manager');
 */

var AudioBufferManager = function (_Service) {
  (0, _inherits3.default)(AudioBufferManager, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function AudioBufferManager() {
    (0, _classCallCheck3.default)(this, AudioBufferManager);

    var _this = (0, _possibleConstructorReturn3.default)(this, (AudioBufferManager.__proto__ || (0, _getPrototypeOf2.default)(AudioBufferManager)).call(this, SERVICE_ID));

    _this._fileSystem = _this.require('file-system');
    return _this;
  }

  (0, _createClass3.default)(AudioBufferManager, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(AudioBufferManager.prototype.__proto__ || (0, _getPrototypeOf2.default)(AudioBufferManager.prototype), 'start', this).call(this);

      this.ready();
    }
  }]);
  return AudioBufferManager;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, AudioBufferManager);

exports.default = AudioBufferManager;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1ZGlvQnVmZmVyTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiQXVkaW9CdWZmZXJNYW5hZ2VyIiwiX2ZpbGVTeXN0ZW0iLCJyZXF1aXJlIiwicmVhZHkiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSw4QkFBbkI7O0FBRUE7Ozs7Ozs7OztJQVFNQyxrQjs7O0FBQ0o7QUFDQSxnQ0FBYztBQUFBOztBQUFBLDhKQUNORCxVQURNOztBQUdaLFVBQUtFLFdBQUwsR0FBbUIsTUFBS0MsT0FBTCxDQUFhLGFBQWIsQ0FBbkI7QUFIWTtBQUliOzs7OzRCQUVPO0FBQ047O0FBRUEsV0FBS0MsS0FBTDtBQUNEOzs7OztBQUdILHlCQUFlQyxRQUFmLENBQXdCTCxVQUF4QixFQUFvQ0Msa0JBQXBDOztrQkFFZUEsa0IiLCJmaWxlIjoiQXVkaW9CdWZmZXJNYW5hZ2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCB7IGdldE9wdCB9IGZyb20gJy4uLy4uL3V0aWxzL2hlbHBlcnMnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6YXVkaW8tYnVmZmVyLW1hbmFnZXInO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIHNlcnZlciBgJ2F1ZGlvLWJ1ZmZlci1tYW5hZ2VyJ2Agc2VydmljZS5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLmF1ZGlvQnVmZmVyTWFuYWdlciA9IHRoaXMucmVxdWlyZSgnYXVkaW8tYnVmZmVyLW1hbmFnZXInKTtcbiAqL1xuY2xhc3MgQXVkaW9CdWZmZXJNYW5hZ2VyIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9maWxlU3lzdGVtID0gdGhpcy5yZXF1aXJlKCdmaWxlLXN5c3RlbScpO1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBBdWRpb0J1ZmZlck1hbmFnZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBBdWRpb0J1ZmZlck1hbmFnZXI7XG4iXX0=
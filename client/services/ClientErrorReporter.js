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

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:error-reporter';

/**
 * [client] This service listen for errors on the client side to report them
 * on the server. Is required by default by any {@link src/client/scene/Experience.js}
 * if its `hasNetwork` is set to `true`.
 */

var ClientErrorReporter = function (_Service) {
  (0, _inherits3.default)(ClientErrorReporter, _Service);

  function ClientErrorReporter() {
    (0, _classCallCheck3.default)(this, ClientErrorReporter);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ClientErrorReporter).call(this, SERVICE_ID, true));

    _this._onError = _this._onError.bind(_this);
    return _this;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(ClientErrorReporter, [{
    key: 'init',
    value: function init() {
      window.addEventListener('error', this._onError);
    }

    /** @inheritdoc */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(ClientErrorReporter.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.ready();
    }
  }, {
    key: '_onError',
    value: function _onError(e) {
      var stack = void 0;
      var file = e.filename;
      file = file.replace(window.location.origin, '');
      var line = e.lineno;
      var col = e.colno;
      var msg = e.message;
      var userAgent = navigator.userAgent;

      this.send('error', file, line, col, msg, userAgent);
    }
  }]);
  return ClientErrorReporter;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, ClientErrorReporter);

exports.default = ClientErrorReporter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNsaWVudEVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLHdCQUFiOzs7Ozs7OztJQU9BOzs7QUFDSixXQURJLG1CQUNKLEdBQWM7d0NBRFYscUJBQ1U7OzZGQURWLGdDQUVJLFlBQVksT0FETjs7QUFHWixVQUFLLFFBQUwsR0FBZ0IsTUFBSyxRQUFMLENBQWMsSUFBZCxPQUFoQixDQUhZOztHQUFkOzs7Ozs2QkFESTs7MkJBUUc7QUFDTCxhQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLEtBQUssUUFBTCxDQUFqQyxDQURLOzs7Ozs7OzRCQUtDO0FBQ04sdURBZEUseURBY0YsQ0FETTs7QUFHTixVQUFJLENBQUMsS0FBSyxVQUFMLEVBQ0gsS0FBSyxJQUFMLEdBREY7O0FBR0EsV0FBSyxLQUFMLEdBTk07Ozs7NkJBU0MsR0FBRztBQUNWLFVBQUksY0FBSixDQURVO0FBRVYsVUFBSSxPQUFPLEVBQUUsUUFBRixDQUZEO0FBR1YsYUFBTyxLQUFLLE9BQUwsQ0FBYSxPQUFPLFFBQVAsQ0FBZ0IsTUFBaEIsRUFBd0IsRUFBckMsQ0FBUCxDQUhVO0FBSVYsVUFBTSxPQUFPLEVBQUUsTUFBRixDQUpIO0FBS1YsVUFBTSxNQUFNLEVBQUUsS0FBRixDQUxGO0FBTVYsVUFBTSxNQUFNLEVBQUUsT0FBRixDQU5GO0FBT1YsVUFBTSxZQUFZLFVBQVUsU0FBVixDQVBSOztBQVNWLFdBQUssSUFBTCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUIsSUFBekIsRUFBK0IsR0FBL0IsRUFBb0MsR0FBcEMsRUFBeUMsU0FBekMsRUFUVTs7O1NBdEJSOzs7QUFtQ04seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxtQkFBcEM7O2tCQUVlIiwiZmlsZSI6IkNsaWVudEVycm9yUmVwb3J0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6ZXJyb3ItcmVwb3J0ZXInO1xuXG4vKipcbiAqIFtjbGllbnRdIFRoaXMgc2VydmljZSBsaXN0ZW4gZm9yIGVycm9ycyBvbiB0aGUgY2xpZW50IHNpZGUgdG8gcmVwb3J0IHRoZW1cbiAqIG9uIHRoZSBzZXJ2ZXIuIElzIHJlcXVpcmVkIGJ5IGRlZmF1bHQgYnkgYW55IHtAbGluayBzcmMvY2xpZW50L3NjZW5lL0V4cGVyaWVuY2UuanN9XG4gKiBpZiBpdHMgYGhhc05ldHdvcmtgIGlzIHNldCB0byBgdHJ1ZWAuXG4gKi9cbmNsYXNzIENsaWVudEVycm9yUmVwb3J0ZXIgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICB0aGlzLl9vbkVycm9yID0gdGhpcy5fb25FcnJvci5iaW5kKHRoaXMpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2Vycm9yJywgdGhpcy5fb25FcnJvcik7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBfb25FcnJvcihlKSB7XG4gICAgbGV0IHN0YWNrO1xuICAgIGxldCBmaWxlID0gZS5maWxlbmFtZTtcbiAgICBmaWxlID0gZmlsZS5yZXBsYWNlKHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4sICcnKTtcbiAgICBjb25zdCBsaW5lID0gZS5saW5lbm87XG4gICAgY29uc3QgY29sID0gZS5jb2xubztcbiAgICBjb25zdCBtc2cgPSBlLm1lc3NhZ2U7XG4gICAgY29uc3QgdXNlckFnZW50ID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICAgIHRoaXMuc2VuZCgnZXJyb3InLCBmaWxlLCBsaW5lLCBjb2wsIG1zZywgdXNlckFnZW50KTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnRFcnJvclJlcG9ydGVyKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50RXJyb3JSZXBvcnRlcjtcbiJdfQ==
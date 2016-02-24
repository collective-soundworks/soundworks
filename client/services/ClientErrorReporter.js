'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var SERVICE_ID = 'service:error-reporter';

/**
 * [client] This service listen for errors on the client side to report them
 * on the server. Is required by default by any {@link src/client/scene/Experience.js}
 * if its `hasNetwork` is set to `true`.
 */

var ClientErrorReporter = (function (_Service) {
  _inherits(ClientErrorReporter, _Service);

  function ClientErrorReporter() {
    _classCallCheck(this, ClientErrorReporter);

    _get(Object.getPrototypeOf(ClientErrorReporter.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    this._onError = this._onError.bind(this);
  }

  /** @inheritdoc */

  _createClass(ClientErrorReporter, [{
    key: 'init',
    value: function init() {
      window.addEventListener('error', this._onError);
    }

    /** @inheritdoc */
  }, {
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ClientErrorReporter.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.ready();
    }
  }, {
    key: '_onError',
    value: function _onError(e) {
      var stack = undefined;
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
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientErrorReporter);

exports['default'] = ClientErrorReporter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudEVycm9yUmVwb3J0ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OzsyQkFBb0IsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7OztBQUVuRCxJQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQzs7Ozs7Ozs7SUFPdEMsbUJBQW1CO1lBQW5CLG1CQUFtQjs7QUFDWixXQURQLG1CQUFtQixHQUNUOzBCQURWLG1CQUFtQjs7QUFFckIsK0JBRkUsbUJBQW1CLDZDQUVmLFVBQVUsRUFBRSxJQUFJLEVBQUU7O0FBRXhCLFFBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDMUM7Ozs7ZUFMRyxtQkFBbUI7O1dBUW5CLGdCQUFHO0FBQ0wsWUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDakQ7Ozs7O1dBR0ksaUJBQUc7QUFDTixpQ0FkRSxtQkFBbUIsdUNBY1A7O0FBRWQsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFZCxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7O1dBRU8sa0JBQUMsQ0FBQyxFQUFFO0FBQ1YsVUFBSSxLQUFLLFlBQUEsQ0FBQztBQUNWLFVBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDdEIsVUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDaEQsVUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN0QixVQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3BCLFVBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDdEIsVUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQzs7QUFFdEMsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQ3JEOzs7U0FoQ0csbUJBQW1COzs7QUFtQ3pCLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQzs7cUJBRTFDLG1CQUFtQiIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRFcnJvclJlcG9ydGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmVycm9yLXJlcG9ydGVyJztcblxuLyoqXG4gKiBbY2xpZW50XSBUaGlzIHNlcnZpY2UgbGlzdGVuIGZvciBlcnJvcnMgb24gdGhlIGNsaWVudCBzaWRlIHRvIHJlcG9ydCB0aGVtXG4gKiBvbiB0aGUgc2VydmVyLiBJcyByZXF1aXJlZCBieSBkZWZhdWx0IGJ5IGFueSB7QGxpbmsgc3JjL2NsaWVudC9zY2VuZS9FeHBlcmllbmNlLmpzfVxuICogaWYgaXRzIGBoYXNOZXR3b3JrYCBpcyBzZXQgdG8gYHRydWVgLlxuICovXG5jbGFzcyBDbGllbnRFcnJvclJlcG9ydGVyIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgdGhpcy5fb25FcnJvciA9IHRoaXMuX29uRXJyb3IuYmluZCh0aGlzKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIHRoaXMuX29uRXJyb3IpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgX29uRXJyb3IoZSkge1xuICAgIGxldCBzdGFjaztcbiAgICBsZXQgZmlsZSA9IGUuZmlsZW5hbWU7XG4gICAgZmlsZSA9IGZpbGUucmVwbGFjZSh3aW5kb3cubG9jYXRpb24ub3JpZ2luLCAnJyk7XG4gICAgY29uc3QgbGluZSA9IGUubGluZW5vO1xuICAgIGNvbnN0IGNvbCA9IGUuY29sbm87XG4gICAgY29uc3QgbXNnID0gZS5tZXNzYWdlO1xuICAgIGNvbnN0IHVzZXJBZ2VudCA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgICB0aGlzLnNlbmQoJ2Vycm9yJywgZmlsZSwgbGluZSwgY29sLCBtc2csIHVzZXJBZ2VudCk7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgQ2xpZW50RXJyb3JSZXBvcnRlcik7XG5cbmV4cG9ydCBkZWZhdWx0IENsaWVudEVycm9yUmVwb3J0ZXI7XG4iXX0=
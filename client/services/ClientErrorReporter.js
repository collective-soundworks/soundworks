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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50RXJyb3JSZXBvcnRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OzJCQUFvQixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O0FBRW5ELElBQU0sVUFBVSxHQUFHLHdCQUF3QixDQUFDOzs7Ozs7OztJQU90QyxtQkFBbUI7WUFBbkIsbUJBQW1COztBQUNaLFdBRFAsbUJBQW1CLEdBQ1Q7MEJBRFYsbUJBQW1COztBQUVyQiwrQkFGRSxtQkFBbUIsNkNBRWYsVUFBVSxFQUFFLElBQUksRUFBRTs7QUFFeEIsUUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUMxQzs7OztlQUxHLG1CQUFtQjs7V0FRbkIsZ0JBQUc7QUFDTCxZQUFNLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNqRDs7Ozs7V0FHSSxpQkFBRztBQUNOLGlDQWRFLG1CQUFtQix1Q0FjUDs7QUFFZCxVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFDbEIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVkLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7V0FFTyxrQkFBQyxDQUFDLEVBQUU7QUFDVixVQUFJLEtBQUssWUFBQSxDQUFDO0FBQ1YsVUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUN0QixVQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoRCxVQUFNLElBQUksR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3RCLFVBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDcEIsVUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUN0QixVQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDOztBQUV0QyxVQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDckQ7OztTQWhDRyxtQkFBbUI7OztBQW1DekIsZ0NBQWUsUUFBUSxDQUFDLFVBQVUsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDOztxQkFFMUMsbUJBQW1CIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50RXJyb3JSZXBvcnRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTplcnJvci1yZXBvcnRlcic7XG5cbi8qKlxuICogW2NsaWVudF0gVGhpcyBzZXJ2aWNlIGxpc3RlbiBmb3IgZXJyb3JzIG9uIHRoZSBjbGllbnQgc2lkZSB0byByZXBvcnQgdGhlbVxuICogb24gdGhlIHNlcnZlci4gSXMgcmVxdWlyZWQgYnkgZGVmYXVsdCBieSBhbnkge0BsaW5rIHNyYy9jbGllbnQvc2NlbmUvRXhwZXJpZW5jZS5qc31cbiAqIGlmIGl0cyBgaGFzTmV0d29ya2AgaXMgc2V0IHRvIGB0cnVlYC5cbiAqL1xuY2xhc3MgQ2xpZW50RXJyb3JSZXBvcnRlciBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIHRoaXMuX29uRXJyb3IgPSB0aGlzLl9vbkVycm9yLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCB0aGlzLl9vbkVycm9yKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgaWYgKCF0aGlzLmhhc1N0YXJ0ZWQpXG4gICAgICB0aGlzLmluaXQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIF9vbkVycm9yKGUpIHtcbiAgICBsZXQgc3RhY2s7XG4gICAgbGV0IGZpbGUgPSBlLmZpbGVuYW1lO1xuICAgIGZpbGUgPSBmaWxlLnJlcGxhY2Uod2luZG93LmxvY2F0aW9uLm9yaWdpbiwgJycpO1xuICAgIGNvbnN0IGxpbmUgPSBlLmxpbmVubztcbiAgICBjb25zdCBjb2wgPSBlLmNvbG5vO1xuICAgIGNvbnN0IG1zZyA9IGUubWVzc2FnZTtcbiAgICBjb25zdCB1c2VyQWdlbnQgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gICAgdGhpcy5zZW5kKCdlcnJvcicsIGZpbGUsIGxpbmUsIGNvbCwgbXNnLCB1c2VyQWdlbnQpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudEVycm9yUmVwb3J0ZXIpO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnRFcnJvclJlcG9ydGVyO1xuIl19
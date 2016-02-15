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

var SERVICE_ID = 'service:locator';

/**
 * Allow to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/services/ClientLocator.js~ClientLocator} on the client side.)
 */

var ServerLocator = (function (_ServerActivity) {
  _inherits(ServerLocator, _ServerActivity);

  function ServerLocator() {
    _classCallCheck(this, ServerLocator);

    _get(Object.getPrototypeOf(ServerLocator.prototype), 'constructor', this).call(this, SERVICE_ID);

    var defaults = {
      setup: {}
    };

    this.configure(defaults);
  }

  /**
   * @private
   */

  _createClass(ServerLocator, [{
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerLocator.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'coordinates', this._onCoordinates(client));
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this = this;

      return function () {
        var setup = _this.options.setup;
        var area = undefined;

        if (setup) {
          area = {
            width: setup.width,
            height: setup.height,
            background: setup.background
          };
        }

        _this.send(client, 'area', area);
      };
    }
  }, {
    key: '_onCoordinates',
    value: function _onCoordinates(client) {
      return function (coordinates) {
        return client.coordinates = coordinates;
      };
    }
  }]);

  return ServerLocator;
})(_coreServerActivity2['default']);

_coreServerServiceManager2['default'].register(SERVICE_ID, ServerLocator);

exports['default'] = ServerLocator;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OztBQUUvRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7SUFPL0IsYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLEdBQ0g7MEJBRFYsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULFVBQVUsRUFBRTs7QUFFbEIsUUFBTSxRQUFRLEdBQUc7QUFDZixXQUFLLEVBQUUsRUFBRTtLQUNWLENBQUM7O0FBRUYsUUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUMxQjs7Ozs7O2VBVEcsYUFBYTs7V0FjVixpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0FmRSxhQUFhLHlDQWVELE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ2xFOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7OztBQUNqQixhQUFPLFlBQU07QUFDWCxZQUFNLEtBQUssR0FBRyxNQUFLLE9BQU8sQ0FBQyxLQUFLLENBQUM7QUFDakMsWUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDOztBQUVyQixZQUFJLEtBQUssRUFBRTtBQUNULGNBQUksR0FBRztBQUNMLGlCQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7QUFDbEIsa0JBQU0sRUFBRSxLQUFLLENBQUMsTUFBTTtBQUNwQixzQkFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1dBQzdCLENBQUM7U0FDSDs7QUFFRCxjQUFLLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO09BQ2pDLENBQUE7S0FDRjs7O1dBRWEsd0JBQUMsTUFBTSxFQUFFO0FBQ3JCLGFBQU8sVUFBQyxXQUFXO2VBQUssTUFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXO09BQUEsQ0FBQztLQUMxRDs7O1NBeENHLGFBQWE7OztBQTJDbkIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUUxQyxhQUFhIiwiZmlsZSI6InNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmxvY2F0b3InO1xuXG4vKipcbiAqIEFsbG93IHRvIGluZGljYXRlIHRoZSBhcHByb3hpbWF0ZSBsb2NhdGlvbiBvZiB0aGUgY2xpZW50IG9uIGEgbWFwLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnRMb2NhdG9yLmpzfkNsaWVudExvY2F0b3J9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKi9cbmNsYXNzIFNlcnZlckxvY2F0b3IgZXh0ZW5kcyBTZXJ2ZXJBY3Rpdml0eSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBzZXR1cDoge30sXG4gICAgfTtcblxuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG5cbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAnY29vcmRpbmF0ZXMnLCB0aGlzLl9vbkNvb3JkaW5hdGVzKGNsaWVudCkpO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgY29uc3Qgc2V0dXAgPSB0aGlzLm9wdGlvbnMuc2V0dXA7XG4gICAgICBsZXQgYXJlYSA9IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgIGFyZWEgPSB7XG4gICAgICAgICAgd2lkdGg6IHNldHVwLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogc2V0dXAuaGVpZ2h0LFxuICAgICAgICAgIGJhY2tncm91bmQ6IHNldHVwLmJhY2tncm91bmQsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdhcmVhJywgYXJlYSk7XG4gICAgfVxuICB9XG5cbiAgX29uQ29vcmRpbmF0ZXMoY2xpZW50KSB7XG4gICAgcmV0dXJuIChjb29yZGluYXRlcykgPT4gY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyTG9jYXRvcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlckxvY2F0b3I7XG4iXX0=
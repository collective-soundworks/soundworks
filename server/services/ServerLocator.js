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
  }

  _createClass(ServerLocator, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerLocator.prototype), 'start', this).call(this);
      /**
       * Setup defining dimensions and background.
       * @type {Object}
       * @property {Number} setup.width - Width of the setup.
       * @property {Number} setup.height - Height of the setup.
       * @property {String} setup.background - Optionnal background (image) of the setup.
       */
      this.setup = this.options.setup;
    }

    /**
     * @private
     */
  }, {
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
        var setup = _this.setup;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OztBQUUvRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7SUFPL0IsYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLEdBQ0g7MEJBRFYsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULFVBQVUsRUFBRTtHQUNuQjs7ZUFIRyxhQUFhOztXQUtaLGlCQUFHO0FBQ04saUNBTkUsYUFBYSx1Q0FNRDs7Ozs7Ozs7QUFRZCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDO0tBQ2pDOzs7Ozs7O1dBS00saUJBQUMsTUFBTSxFQUFFO0FBQ2QsaUNBckJFLGFBQWEseUNBcUJELE1BQU0sRUFBRTs7QUFFdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6RCxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0tBQ2xFOzs7V0FFUyxvQkFBQyxNQUFNLEVBQUU7OztBQUNqQixhQUFPLFlBQU07QUFDWCxZQUFNLEtBQUssR0FBRyxNQUFLLEtBQUssQ0FBQztBQUN6QixZQUFJLElBQUksR0FBRyxTQUFTLENBQUM7O0FBRXJCLFlBQUksS0FBSyxFQUFFO0FBQ1QsY0FBSSxHQUFHO0FBQ0wsaUJBQUssRUFBRSxLQUFLLENBQUMsS0FBSztBQUNsQixrQkFBTSxFQUFFLEtBQUssQ0FBQyxNQUFNO0FBQ3BCLHNCQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7V0FDN0IsQ0FBQztTQUNIOztBQUVELGNBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDakMsQ0FBQTtLQUNGOzs7V0FFYSx3QkFBQyxNQUFNLEVBQUU7QUFDckIsYUFBTyxVQUFDLFdBQVc7ZUFBSyxNQUFNLENBQUMsV0FBVyxHQUFHLFdBQVc7T0FBQSxDQUFDO0tBQzFEOzs7U0E5Q0csYUFBYTs7O0FBaURuQixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQzs7cUJBRTFDLGFBQWEiLCJmaWxlIjoic3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9jYXRvcic7XG5cbi8qKlxuICogQWxsb3cgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudExvY2F0b3IuanN+Q2xpZW50TG9jYXRvcn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuY2xhc3MgU2VydmVyTG9jYXRvciBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuICAgIC8qKlxuICAgICAqIFNldHVwIGRlZmluaW5nIGRpbWVuc2lvbnMgYW5kIGJhY2tncm91bmQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc2V0dXAud2lkdGggLSBXaWR0aCBvZiB0aGUgc2V0dXAuXG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IHNldHVwLmhlaWdodCAtIEhlaWdodCBvZiB0aGUgc2V0dXAuXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IHNldHVwLmJhY2tncm91bmQgLSBPcHRpb25uYWwgYmFja2dyb3VuZCAoaW1hZ2UpIG9mIHRoZSBzZXR1cC5cbiAgICAgKi9cbiAgICB0aGlzLnNldHVwID0gdGhpcy5vcHRpb25zLnNldHVwO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdjb29yZGluYXRlcycsIHRoaXMuX29uQ29vcmRpbmF0ZXMoY2xpZW50KSk7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBjb25zdCBzZXR1cCA9IHRoaXMuc2V0dXA7XG4gICAgICBsZXQgYXJlYSA9IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKHNldHVwKSB7XG4gICAgICAgIGFyZWEgPSB7XG4gICAgICAgICAgd2lkdGg6IHNldHVwLndpZHRoLFxuICAgICAgICAgIGhlaWdodDogc2V0dXAuaGVpZ2h0LFxuICAgICAgICAgIGJhY2tncm91bmQ6IHNldHVwLmJhY2tncm91bmQsXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdhcmVhJywgYXJlYSk7XG4gICAgfVxuICB9XG5cbiAgX29uQ29vcmRpbmF0ZXMoY2xpZW50KSB7XG4gICAgcmV0dXJuIChjb29yZGluYXRlcykgPT4gY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyTG9jYXRvcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlckxvY2F0b3I7XG4iXX0=
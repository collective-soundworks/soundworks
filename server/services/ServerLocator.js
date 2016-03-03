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
 * [server] This service allows to indicate the approximate location of the client on a map.
 *
 * (See also {@link src/client/services/ClientLocator.js~ClientLocator} on the client side.)
 */

var ServerLocator = (function (_ServerActivity) {
  _inherits(ServerLocator, _ServerActivity);

  function ServerLocator() {
    _classCallCheck(this, ServerLocator);

    _get(Object.getPrototypeOf(ServerLocator.prototype), 'constructor', this).call(this, SERVICE_ID);

    /**
     * @type {Object} defaults - Defaults options of the service
     * @attribute {String} [defaults.areaConfigItem='setup.area'] - The path to the server's area
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */
    var defaults = {
      areaConfigItem: 'setup.area'
    };

    this.configure(defaults);

    this._area = null;
    this._sharedConfigService = this.require('shared-config');
  }

  /** @inheritdoc */

  _createClass(ServerLocator, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ServerLocator.prototype), 'start', this).call(this);

      var areaConfigItem = this.options.areaConfigItem;

      this.clientTypes.forEach(function (clientType) {
        _this._sharedConfigService.addItem(areaConfigItem, clientType);
      });
    }

    /** @inheritdoc */
  }, {
    key: 'connect',
    value: function connect(client) {
      _get(Object.getPrototypeOf(ServerLocator.prototype), 'connect', this).call(this, client);

      this.receive(client, 'request', this._onRequest(client));
      this.receive(client, 'coordinates', this._onCoordinates(client));
    }

    /** @private */
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this2 = this;

      return function () {
        return _this2.send(client, 'aknowledge', _this2.options.areaConfigItem);
      };
    }

    /** @private */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OztBQUUvRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7SUFPL0IsYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLEdBQ0g7MEJBRFYsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULFVBQVUsRUFBRTs7Ozs7OztBQU9sQixRQUFNLFFBQVEsR0FBRztBQUNmLG9CQUFjLEVBQUUsWUFBWTtLQUM3QixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQzNEOzs7O2VBakJHLGFBQWE7O1dBb0JaLGlCQUFHOzs7QUFDTixpQ0FyQkUsYUFBYSx1Q0FxQkQ7O0FBRWQsVUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUM7O0FBRW5ELFVBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUMsVUFBVSxFQUFLO0FBQ3ZDLGNBQUssb0JBQW9CLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsQ0FBQztPQUMvRCxDQUFDLENBQUM7S0FDSjs7Ozs7V0FHTSxpQkFBQyxNQUFNLEVBQUU7QUFDZCxpQ0FoQ0UsYUFBYSx5Q0FnQ0QsTUFBTSxFQUFFOztBQUV0QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7S0FDbEU7Ozs7O1dBR1Msb0JBQUMsTUFBTSxFQUFFOzs7QUFDakIsYUFBTztlQUFNLE9BQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsT0FBSyxPQUFPLENBQUMsY0FBYyxDQUFDO09BQUEsQ0FBQztLQUMzRTs7Ozs7V0FHYSx3QkFBQyxNQUFNLEVBQUU7QUFDckIsYUFBTyxVQUFDLFdBQVc7ZUFBSyxNQUFNLENBQUMsV0FBVyxHQUFHLFdBQVc7T0FBQSxDQUFDO0tBQzFEOzs7U0E5Q0csYUFBYTs7O0FBaURuQixzQ0FBcUIsUUFBUSxDQUFDLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQzs7cUJBRTFDLGFBQWEiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL3NlcnZlci9zZXJ2aWNlcy9TZXJ2ZXJMb2NhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZlckFjdGl2aXR5IGZyb20gJy4uL2NvcmUvU2VydmVyQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZlclNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXInO1xuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6bG9jYXRvcic7XG5cbi8qKlxuICogW3NlcnZlcl0gVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBpbmRpY2F0ZSB0aGUgYXBwcm94aW1hdGUgbG9jYXRpb24gb2YgdGhlIGNsaWVudCBvbiBhIG1hcC5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TG9jYXRvci5qc35DbGllbnRMb2NhdG9yfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICovXG5jbGFzcyBTZXJ2ZXJMb2NhdG9yIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtPYmplY3R9IGRlZmF1bHRzIC0gRGVmYXVsdHMgb3B0aW9ucyBvZiB0aGUgc2VydmljZVxuICAgICAqIEBhdHRyaWJ1dGUge1N0cmluZ30gW2RlZmF1bHRzLmFyZWFDb25maWdJdGVtPSdzZXR1cC5hcmVhJ10gLSBUaGUgcGF0aCB0byB0aGUgc2VydmVyJ3MgYXJlYVxuICAgICAqICBjb25maWd1cmF0aW9uIGVudHJ5IChzZWUge0BsaW5rIHNyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXIuanN+YXBwQ29uZmlnfSBmb3IgZGV0YWlscykuXG4gICAgICovXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7XG4gICAgICBhcmVhQ29uZmlnSXRlbTogJ3NldHVwLmFyZWEnLFxuICAgIH07XG5cbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9hcmVhID0gbnVsbDtcbiAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGNvbnN0IGFyZWFDb25maWdJdGVtID0gdGhpcy5vcHRpb25zLmFyZWFDb25maWdJdGVtO1xuXG4gICAgdGhpcy5jbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLl9zaGFyZWRDb25maWdTZXJ2aWNlLmFkZEl0ZW0oYXJlYUNvbmZpZ0l0ZW0sIGNsaWVudFR5cGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuXG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ2Nvb3JkaW5hdGVzJywgdGhpcy5fb25Db29yZGluYXRlcyhjbGllbnQpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnNlbmQoY2xpZW50LCAnYWtub3dsZWRnZScsIHRoaXMub3B0aW9ucy5hcmVhQ29uZmlnSXRlbSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uQ29vcmRpbmF0ZXMoY2xpZW50KSB7XG4gICAgcmV0dXJuIChjb29yZGluYXRlcykgPT4gY2xpZW50LmNvb3JkaW5hdGVzID0gY29vcmRpbmF0ZXM7XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyTG9jYXRvcik7XG5cbmV4cG9ydCBkZWZhdWx0IFNlcnZlckxvY2F0b3I7XG4iXX0=
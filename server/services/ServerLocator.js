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
     * @attribute {String} [defaults.areaConfigPath='setup.area'] - The path to the server's area
     *  configuration entry (see {@link src/server/core/server.js~appConfig} for details).
     */
    var defaults = {
      areaConfigPath: 'setup.area'
    };

    this.configure(defaults);

    this._area = null;
    this._sharedConfigService = this.require('shared-config');
  }

  /** @inheritdoc */

  _createClass(ServerLocator, [{
    key: 'start',
    value: function start() {
      _get(Object.getPrototypeOf(ServerLocator.prototype), 'start', this).call(this);

      this._area = this._sharedConfigService.get(this.options.areaConfigPath);
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
      var _this = this;

      return function () {
        return _this.send(client, 'aknowledge', _this._area);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTG9jYXRvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O2tDQUEyQix3QkFBd0I7Ozs7d0NBQ2xCLDhCQUE4Qjs7OztBQUUvRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7Ozs7Ozs7SUFPL0IsYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLEdBQ0g7MEJBRFYsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULFVBQVUsRUFBRTs7Ozs7OztBQU9sQixRQUFNLFFBQVEsR0FBRztBQUNmLG9CQUFjLEVBQUUsWUFBWTtLQUM3QixDQUFDOztBQUVGLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0dBQzNEOzs7O2VBakJHLGFBQWE7O1dBb0JaLGlCQUFHO0FBQ04saUNBckJFLGFBQWEsdUNBcUJEOztBQUVkLFVBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0tBQ3pFOzs7OztXQUdNLGlCQUFDLE1BQU0sRUFBRTtBQUNkLGlDQTVCRSxhQUFhLHlDQTRCRCxNQUFNLEVBQUU7O0FBRXRCLFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUNsRTs7Ozs7V0FHUyxvQkFBQyxNQUFNLEVBQUU7OztBQUNqQixhQUFPO2VBQU0sTUFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLFlBQVksRUFBRSxNQUFLLEtBQUssQ0FBQztPQUFBLENBQUM7S0FDMUQ7Ozs7O1dBR2Esd0JBQUMsTUFBTSxFQUFFO0FBQ3JCLGFBQU8sVUFBQyxXQUFXO2VBQUssTUFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXO09BQUEsQ0FBQztLQUMxRDs7O1NBMUNHLGFBQWE7OztBQTZDbkIsc0NBQXFCLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUUxQyxhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvc2VydmljZXMvU2VydmVyTG9jYXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2ZXJBY3Rpdml0eSBmcm9tICcuLi9jb3JlL1NlcnZlckFjdGl2aXR5JztcbmltcG9ydCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZlclNlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOmxvY2F0b3InO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIFRoaXMgc2VydmljZSBhbGxvd3MgdG8gaW5kaWNhdGUgdGhlIGFwcHJveGltYXRlIGxvY2F0aW9uIG9mIHRoZSBjbGllbnQgb24gYSBtYXAuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudExvY2F0b3IuanN+Q2xpZW50TG9jYXRvcn0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqL1xuY2xhc3MgU2VydmVyTG9jYXRvciBleHRlbmRzIFNlcnZlckFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fSBkZWZhdWx0cyAtIERlZmF1bHRzIG9wdGlvbnMgb2YgdGhlIHNlcnZpY2VcbiAgICAgKiBAYXR0cmlidXRlIHtTdHJpbmd9IFtkZWZhdWx0cy5hcmVhQ29uZmlnUGF0aD0nc2V0dXAuYXJlYSddIC0gVGhlIHBhdGggdG8gdGhlIHNlcnZlcidzIGFyZWFcbiAgICAgKiAgY29uZmlndXJhdGlvbiBlbnRyeSAoc2VlIHtAbGluayBzcmMvc2VydmVyL2NvcmUvc2VydmVyLmpzfmFwcENvbmZpZ30gZm9yIGRldGFpbHMpLlxuICAgICAqL1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgYXJlYUNvbmZpZ1BhdGg6ICdzZXR1cC5hcmVhJyxcbiAgICB9O1xuXG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fYXJlYSA9IG51bGw7XG4gICAgdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZSA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLl9hcmVhID0gdGhpcy5fc2hhcmVkQ29uZmlnU2VydmljZS5nZXQodGhpcy5vcHRpb25zLmFyZWFDb25maWdQYXRoKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcblxuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdjb29yZGluYXRlcycsIHRoaXMuX29uQ29vcmRpbmF0ZXMoY2xpZW50KSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICByZXR1cm4gKCkgPT4gdGhpcy5zZW5kKGNsaWVudCwgJ2Frbm93bGVkZ2UnLCB0aGlzLl9hcmVhKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db29yZGluYXRlcyhjbGllbnQpIHtcbiAgICByZXR1cm4gKGNvb3JkaW5hdGVzKSA9PiBjbGllbnQuY29vcmRpbmF0ZXMgPSBjb29yZGluYXRlcztcbiAgfVxufVxuXG5zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTZXJ2ZXJMb2NhdG9yKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyTG9jYXRvcjtcbiJdfQ==
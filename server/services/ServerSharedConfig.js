'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _ServerActivity2 = require('../core/ServerActivity');

var _ServerActivity3 = _interopRequireDefault(_ServerActivity2);

var _serverServiceManager = require('../core/serverServiceManager');

var _serverServiceManager2 = _interopRequireDefault(_serverServiceManager);

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:shared-config';

/**
 * [server] Service that acts as an accessor for the server config for both
 * server and client sides.
 */

var ServerSharedConfig = function (_ServerActivity) {
  (0, _inherits3.default)(ServerSharedConfig, _ServerActivity);

  function ServerSharedConfig() {
    (0, _classCallCheck3.default)(this, ServerSharedConfig);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(ServerSharedConfig).call(this, SERVICE_ID));

    _this._cache = {};
    _this._clientItemsMap = {};
    return _this;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(ServerSharedConfig, [{
    key: 'connect',
    value: function connect(client) {
      this.receive(client, 'request', this._onRequest(client));
    }

    /**
     * Returns an item of the server configuration from its path. For server-side use.
     * @param {String} item - String representing the path to the configuration
     *  ex. `'setup.area'` will search for the `area` entry of the '`setup`' entry
     *  of the server configuration.
     * @returns {Mixed} - The value of the request item. Returns `null` if
     *  the given item does not exists.
     */

  }, {
    key: 'get',
    value: function get(item) {
      var parts = item.split('.');
      var value = _server2.default.config;
      // search item through config
      parts.forEach(function (attr) {
        if (value[attr]) value = value[attr];else value = null;
      });

      return value;
    }

    /**
     * Add a required item from server side to a specific client. This should be
     * called on ServerActivities initialization.
     *
     */

  }, {
    key: 'addItem',
    value: function addItem(item, clientType) {
      if (!this._clientItemsMap[clientType]) this._clientItemsMap[clientType] = new _set2.default();;

      this._clientItemsMap[clientType].add(item);
    }

    /**
     * Generate a object according to the given items. The result is cached
     * @param {Array<String>} items - The path to the items to be shared.
     * @returns {Object} - An optimized object containing all the requested items.
     */

  }, {
    key: '_getValues',
    value: function _getValues(clientType) {
      if (this._cache[clientType]) return this._cache[clientType];

      var items = this._clientItemsMap[clientType];
      var serverConfig = _server2.default.config;
      var data = {};

      // build data tree
      items.forEach(function (item) {
        var parts = item.split('.');
        var pointer = data;

        parts.forEach(function (attr) {
          if (!pointer[attr]) pointer[attr] = {};

          pointer = pointer[attr];
        });
      });

      // populate previously builded tree
      items.forEach(function (item) {
        var parts = item.split('.');
        var len = parts.length;
        var value = serverConfig;
        var pointer = data;

        parts.forEach(function (attr, index) {
          value = value[attr];

          if (index < len - 1) pointer = pointer[attr];else pointer[attr] = value;
        });
      });

      this._cache[clientType] = data;
      return data;
    }
  }, {
    key: '_onRequest',
    value: function _onRequest(client) {
      var _this2 = this;

      // generate an optimized config bundle to return the client
      return function (items) {
        items.forEach(function (item) {
          return _this2.addItem(item, client.type);
        });

        var config = _this2._getValues(client.type);
        _this2.send(client, 'config', config);
      };
    }
  }]);
  return ServerSharedConfig;
}(_ServerActivity3.default);

_serverServiceManager2.default.register(SERVICE_ID, ServerSharedConfig);

exports.default = ServerSharedConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZlclNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU0sYUFBYSx1QkFBYjs7Ozs7OztJQU1BOzs7QUFDSixXQURJLGtCQUNKLEdBQWM7d0NBRFYsb0JBQ1U7OzZGQURWLCtCQUVJLGFBRE07O0FBR1osVUFBSyxNQUFMLEdBQWMsRUFBZCxDQUhZO0FBSVosVUFBSyxlQUFMLEdBQXVCLEVBQXZCLENBSlk7O0dBQWQ7Ozs7OzZCQURJOzs0QkFTSSxRQUFRO0FBQ2QsV0FBSyxPQUFMLENBQWEsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLLFVBQUwsQ0FBZ0IsTUFBaEIsQ0FBaEMsRUFEYzs7Ozs7Ozs7Ozs7Ozs7d0JBWVosTUFBTTtBQUNSLFVBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQVIsQ0FERTtBQUVSLFVBQUksUUFBUSxpQkFBTyxNQUFQOztBQUZKLFdBSVIsQ0FBTSxPQUFOLENBQWMsVUFBQyxJQUFELEVBQVU7QUFDdEIsWUFBSSxNQUFNLElBQU4sQ0FBSixFQUNFLFFBQVEsTUFBTSxJQUFOLENBQVIsQ0FERixLQUdFLFFBQVEsSUFBUixDQUhGO09BRFksQ0FBZCxDQUpROztBQVdSLGFBQU8sS0FBUCxDQVhROzs7Ozs7Ozs7Ozs0QkFtQkYsTUFBTSxZQUFZO0FBQ3hCLFVBQUksQ0FBQyxLQUFLLGVBQUwsQ0FBcUIsVUFBckIsQ0FBRCxFQUNGLEtBQUssZUFBTCxDQUFxQixVQUFyQixJQUFtQyxtQkFBbkMsQ0FERixDQUR3Qjs7QUFJeEIsV0FBSyxlQUFMLENBQXFCLFVBQXJCLEVBQWlDLEdBQWpDLENBQXFDLElBQXJDLEVBSndCOzs7Ozs7Ozs7OzsrQkFZZixZQUFZO0FBQ3JCLFVBQUksS0FBSyxNQUFMLENBQVksVUFBWixDQUFKLEVBQ0UsT0FBTyxLQUFLLE1BQUwsQ0FBWSxVQUFaLENBQVAsQ0FERjs7QUFHQSxVQUFNLFFBQVEsS0FBSyxlQUFMLENBQXFCLFVBQXJCLENBQVIsQ0FKZTtBQUtyQixVQUFNLGVBQWUsaUJBQU8sTUFBUCxDQUxBO0FBTXJCLFVBQU0sT0FBTyxFQUFQOzs7QUFOZSxXQVNyQixDQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBVTtBQUN0QixZQUFNLFFBQVEsS0FBSyxLQUFMLENBQVcsR0FBWCxDQUFSLENBRGdCO0FBRXRCLFlBQUksVUFBVSxJQUFWLENBRmtCOztBQUl0QixjQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBVTtBQUN0QixjQUFJLENBQUMsUUFBUSxJQUFSLENBQUQsRUFDRixRQUFRLElBQVIsSUFBZ0IsRUFBaEIsQ0FERjs7QUFHQSxvQkFBVSxRQUFRLElBQVIsQ0FBVixDQUpzQjtTQUFWLENBQWQsQ0FKc0I7T0FBVixDQUFkOzs7QUFUcUIsV0FzQnJCLENBQU0sT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFlBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQVIsQ0FEZ0I7QUFFdEIsWUFBTSxNQUFNLE1BQU0sTUFBTixDQUZVO0FBR3RCLFlBQUksUUFBUSxZQUFSLENBSGtCO0FBSXRCLFlBQUksVUFBVSxJQUFWLENBSmtCOztBQU10QixjQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBTyxLQUFQLEVBQWlCO0FBQzdCLGtCQUFRLE1BQU0sSUFBTixDQUFSLENBRDZCOztBQUc3QixjQUFJLFFBQVEsTUFBTSxDQUFOLEVBQ1YsVUFBVSxRQUFRLElBQVIsQ0FBVixDQURGLEtBR0UsUUFBUSxJQUFSLElBQWdCLEtBQWhCLENBSEY7U0FIWSxDQUFkLENBTnNCO09BQVYsQ0FBZCxDQXRCcUI7O0FBc0NyQixXQUFLLE1BQUwsQ0FBWSxVQUFaLElBQTBCLElBQTFCLENBdENxQjtBQXVDckIsYUFBTyxJQUFQLENBdkNxQjs7OzsrQkEwQ1osUUFBUTs7OztBQUVqQixhQUFPLFVBQUMsS0FBRCxFQUFXO0FBQ2hCLGNBQU0sT0FBTixDQUFjLFVBQUMsSUFBRDtpQkFBVSxPQUFLLE9BQUwsQ0FBYSxJQUFiLEVBQW1CLE9BQU8sSUFBUDtTQUE3QixDQUFkLENBRGdCOztBQUdoQixZQUFNLFNBQVMsT0FBSyxVQUFMLENBQWdCLE9BQU8sSUFBUCxDQUF6QixDQUhVO0FBSWhCLGVBQUssSUFBTCxDQUFVLE1BQVYsRUFBa0IsUUFBbEIsRUFBNEIsTUFBNUIsRUFKZ0I7T0FBWCxDQUZVOzs7U0E5RmY7OztBQXlHTiwrQkFBcUIsUUFBckIsQ0FBOEIsVUFBOUIsRUFBMEMsa0JBQTFDOztrQkFFZSIsImZpbGUiOiJTZXJ2ZXJTaGFyZWRDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2VydmVyQWN0aXZpdHkgZnJvbSAnLi4vY29yZS9TZXJ2ZXJBY3Rpdml0eSc7XG5pbXBvcnQgc2VydmVyU2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogW3NlcnZlcl0gU2VydmljZSB0aGF0IGFjdHMgYXMgYW4gYWNjZXNzb3IgZm9yIHRoZSBzZXJ2ZXIgY29uZmlnIGZvciBib3RoXG4gKiBzZXJ2ZXIgYW5kIGNsaWVudCBzaWRlcy5cbiAqL1xuY2xhc3MgU2VydmVyU2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmVyQWN0aXZpdHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgdGhpcy5fY2xpZW50SXRlbXNNYXAgPSB7fTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gZnJvbSBpdHMgcGF0aC4gRm9yIHNlcnZlci1zaWRlIHVzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gLSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoZSBjb25maWd1cmF0aW9uXG4gICAqICBleC4gYCdzZXR1cC5hcmVhJ2Agd2lsbCBzZWFyY2ggZm9yIHRoZSBgYXJlYWAgZW50cnkgb2YgdGhlICdgc2V0dXBgJyBlbnRyeVxuICAgKiAgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gVGhlIHZhbHVlIG9mIHRoZSByZXF1ZXN0IGl0ZW0uIFJldHVybnMgYG51bGxgIGlmXG4gICAqICB0aGUgZ2l2ZW4gaXRlbSBkb2VzIG5vdCBleGlzdHMuXG4gICAqL1xuICBnZXQoaXRlbSkge1xuICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgIGxldCB2YWx1ZSA9IHNlcnZlci5jb25maWc7XG4gICAgLy8gc2VhcmNoIGl0ZW0gdGhyb3VnaCBjb25maWdcbiAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAodmFsdWVbYXR0cl0pXG4gICAgICAgIHZhbHVlID0gdmFsdWVbYXR0cl07XG4gICAgICBlbHNlXG4gICAgICAgIHZhbHVlID0gbnVsbDtcbiAgICB9KTtcblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYSByZXF1aXJlZCBpdGVtIGZyb20gc2VydmVyIHNpZGUgdG8gYSBzcGVjaWZpYyBjbGllbnQuIFRoaXMgc2hvdWxkIGJlXG4gICAqIGNhbGxlZCBvbiBTZXJ2ZXJBY3Rpdml0aWVzIGluaXRpYWxpemF0aW9uLlxuICAgKlxuICAgKi9cbiAgYWRkSXRlbShpdGVtLCBjbGllbnRUeXBlKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXSlcbiAgICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpOztcblxuICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdLmFkZChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIG9iamVjdCBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGl0ZW1zLiBUaGUgcmVzdWx0IGlzIGNhY2hlZFxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGl0ZW1zIC0gVGhlIHBhdGggdG8gdGhlIGl0ZW1zIHRvIGJlIHNoYXJlZC5cbiAgICogQHJldHVybnMge09iamVjdH0gLSBBbiBvcHRpbWl6ZWQgb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSByZXF1ZXN0ZWQgaXRlbXMuXG4gICAqL1xuICBfZ2V0VmFsdWVzKGNsaWVudFR5cGUpIHtcbiAgICBpZiAodGhpcy5fY2FjaGVbY2xpZW50VHlwZV0pXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbY2xpZW50VHlwZV07XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdO1xuICAgIGNvbnN0IHNlcnZlckNvbmZpZyA9IHNlcnZlci5jb25maWc7XG4gICAgY29uc3QgZGF0YSA9IHt9O1xuXG4gICAgLy8gYnVpbGQgZGF0YSB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgaWYgKCFwb2ludGVyW2F0dHJdKVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB7fTtcblxuICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gcG9wdWxhdGUgcHJldmlvdXNseSBidWlsZGVkIHRyZWVcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICAgIGNvbnN0IGxlbiA9IHBhcnRzLmxlbmd0aDtcbiAgICAgIGxldCB2YWx1ZSA9IHNlcnZlckNvbmZpZztcbiAgICAgIGxldCBwb2ludGVyID0gZGF0YTtcblxuICAgICAgcGFydHMuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVthdHRyXTtcblxuICAgICAgICBpZiAoaW5kZXggPCBsZW4gLSAxKVxuICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyW2F0dHJdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9pbnRlclthdHRyXSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jYWNoZVtjbGllbnRUeXBlXSA9IGRhdGE7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIC8vIGdlbmVyYXRlIGFuIG9wdGltaXplZCBjb25maWcgYnVuZGxlIHRvIHJldHVybiB0aGUgY2xpZW50XG4gICAgcmV0dXJuIChpdGVtcykgPT4ge1xuICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5hZGRJdGVtKGl0ZW0sIGNsaWVudC50eXBlKSk7XG5cbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX2dldFZhbHVlcyhjbGllbnQudHlwZSk7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlnJywgY29uZmlnKTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmVyU2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2VydmVyU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2VydmVyU2hhcmVkQ29uZmlnO1xuIl19
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

var _Activity2 = require('../core/Activity');

var _Activity3 = _interopRequireDefault(_Activity2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:shared-config';

/**
 * [server] Service that acts as an accessor for the server config for both
 * server and client sides.
 */

var SharedConfig = function (_Activity) {
  (0, _inherits3.default)(SharedConfig, _Activity);

  function SharedConfig() {
    (0, _classCallCheck3.default)(this, SharedConfig);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedConfig).call(this, SERVICE_ID));

    _this._cache = {};
    _this._clientItemsMap = {};
    return _this;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(SharedConfig, [{
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
     * called at the activity's initialization.
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
  return SharedConfig;
}(_Activity3.default);

_serviceManager2.default.register(SERVICE_ID, SharedConfig);

exports.default = SharedConfig;
//# sourceMappingURL=data:application/json;base64,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aUJBQVUsT0FBSyxPQUFMLENBQWEsSUFBYixFQUFtQixPQUFPLElBQVA7U0FBN0IsQ0FBZCxDQURnQjs7QUFHaEIsWUFBTSxTQUFTLE9BQUssVUFBTCxDQUFnQixPQUFPLElBQVAsQ0FBekIsQ0FIVTtBQUloQixlQUFLLElBQUwsQ0FBVSxNQUFWLEVBQWtCLFFBQWxCLEVBQTRCLE1BQTVCLEVBSmdCO09BQVgsQ0FGVTs7O1NBOUZmOzs7QUF5R04seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxZQUFwQzs7a0JBRWUiLCJmaWxlIjoiU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFjdGl2aXR5IGZyb20gJy4uL2NvcmUvQWN0aXZpdHknO1xuaW1wb3J0IHNlcnZpY2VNYW5hZ2VyIGZyb20gJy4uL2NvcmUvc2VydmljZU1hbmFnZXInO1xuaW1wb3J0IHNlcnZlciBmcm9tICcuLi9jb3JlL3NlcnZlcic7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1jb25maWcnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIFNlcnZpY2UgdGhhdCBhY3RzIGFzIGFuIGFjY2Vzc29yIGZvciB0aGUgc2VydmVyIGNvbmZpZyBmb3IgYm90aFxuICogc2VydmVyIGFuZCBjbGllbnQgc2lkZXMuXG4gKi9cbmNsYXNzIFNoYXJlZENvbmZpZyBleHRlbmRzIEFjdGl2aXR5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCk7XG5cbiAgICB0aGlzLl9jYWNoZSA9IHt9O1xuICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwID0ge307XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGl0ZW0gb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGZyb20gaXRzIHBhdGguIEZvciBzZXJ2ZXItc2lkZSB1c2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtIC0gU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGUgY29uZmlndXJhdGlvblxuICAgKiAgZXguIGAnc2V0dXAuYXJlYSdgIHdpbGwgc2VhcmNoIGZvciB0aGUgYGFyZWFgIGVudHJ5IG9mIHRoZSAnYHNldHVwYCcgZW50cnlcbiAgICogIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMge01peGVkfSAtIFRoZSB2YWx1ZSBvZiB0aGUgcmVxdWVzdCBpdGVtLiBSZXR1cm5zIGBudWxsYCBpZlxuICAgKiAgdGhlIGdpdmVuIGl0ZW0gZG9lcyBub3QgZXhpc3RzLlxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdmFsdWUgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIC8vIHNlYXJjaCBpdGVtIHRocm91Z2ggY29uZmlnXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKHZhbHVlW2F0dHJdKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlW2F0dHJdO1xuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcmVxdWlyZWQgaXRlbSBmcm9tIHNlcnZlciBzaWRlIHRvIGEgc3BlY2lmaWMgY2xpZW50LiBUaGlzIHNob3VsZCBiZVxuICAgKiBjYWxsZWQgYXQgdGhlIGFjdGl2aXR5J3MgaW5pdGlhbGl6YXRpb24uXG4gICAqXG4gICAqL1xuICBhZGRJdGVtKGl0ZW0sIGNsaWVudFR5cGUpIHtcbiAgICBpZiAoIXRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdKVxuICAgICAgdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV0gPSBuZXcgU2V0KCk7O1xuXG4gICAgdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV0uYWRkKGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgb2JqZWN0IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gaXRlbXMuIFRoZSByZXN1bHQgaXMgY2FjaGVkXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gaXRlbXMgLSBUaGUgcGF0aCB0byB0aGUgaXRlbXMgdG8gYmUgc2hhcmVkLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSAtIEFuIG9wdGltaXplZCBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIHJlcXVlc3RlZCBpdGVtcy5cbiAgICovXG4gIF9nZXRWYWx1ZXMoY2xpZW50VHlwZSkge1xuICAgIGlmICh0aGlzLl9jYWNoZVtjbGllbnRUeXBlXSlcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVtjbGllbnRUeXBlXTtcblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV07XG4gICAgY29uc3Qgc2VydmVyQ29uZmlnID0gc2VydmVyLmNvbmZpZztcbiAgICBjb25zdCBkYXRhID0ge307XG5cbiAgICAvLyBidWlsZCBkYXRhIHRyZWVcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICAgIGxldCBwb2ludGVyID0gZGF0YTtcblxuICAgICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICBpZiAoIXBvaW50ZXJbYXR0cl0pXG4gICAgICAgICAgcG9pbnRlclthdHRyXSA9IHt9O1xuXG4gICAgICAgIHBvaW50ZXIgPSBwb2ludGVyW2F0dHJdO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBwb3B1bGF0ZSBwcmV2aW91c2x5IGJ1aWxkZWQgdHJlZVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgICAgY29uc3QgbGVuID0gcGFydHMubGVuZ3RoO1xuICAgICAgbGV0IHZhbHVlID0gc2VydmVyQ29uZmlnO1xuICAgICAgbGV0IHBvaW50ZXIgPSBkYXRhO1xuXG4gICAgICBwYXJ0cy5mb3JFYWNoKChhdHRyLCBpbmRleCkgPT4ge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlW2F0dHJdO1xuXG4gICAgICAgIGlmIChpbmRleCA8IGxlbiAtIDEpXG4gICAgICAgICAgcG9pbnRlciA9IHBvaW50ZXJbYXR0cl07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwb2ludGVyW2F0dHJdID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NhY2hlW2NsaWVudFR5cGVdID0gZGF0YTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgLy8gZ2VuZXJhdGUgYW4gb3B0aW1pemVkIGNvbmZpZyBidW5kbGUgdG8gcmV0dXJuIHRoZSBjbGllbnRcbiAgICByZXR1cm4gKGl0ZW1zKSA9PiB7XG4gICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLmFkZEl0ZW0oaXRlbSwgY2xpZW50LnR5cGUpKTtcblxuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ2V0VmFsdWVzKGNsaWVudC50eXBlKTtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maWcnLCBjb25maWcpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRDb25maWc7XG4iXX0=
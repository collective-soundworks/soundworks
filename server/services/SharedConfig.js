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
 * Interface of the server `'shared-config'` service.
 *
 * This service can be use with its client-side counterpart in order to share
 * some server configuration items with the clients, or server-side only to act
 * as an accessor of the server configuration.
 *
 * __*The service can be use with its [client-side counterpart]{@link module:soundworks/client.SharedConfig}*__
 *
 * @memberof module:soundworks/server
 * @example
 * // inside experience constructor
 * this.sharedConfig = this.require('shared-config');
 * // access a configuration item for server-side use
 * const area = this.sharedConfig.get('setup.area');
 * // share this item with client of type `player`
 * this.sharedConfig.share('setup.area', 'player');
 */

var SharedConfig = function (_Activity) {
  (0, _inherits3.default)(SharedConfig, _Activity);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

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
     * @param {String} item - String representing the path to the configuration.
     *  For example `'setup.area'` will retrieve the value (here an object)
     *  corresponding to the `area` key inside the `setup` entry of the server
     *  configuration.
     * @returns {Mixed} - Value of the requested item. Returns `null` if
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
     * Add a configuration item to be shared with a specific client.
     * @param {String} item - Key to the configuration item (_ex:_ `'setup.area'`)
     * @param {String} clientType - Client type whom the data should be shared.
     */

  }, {
    key: 'share',
    value: function share(item, clientType) {
      if (!this._clientItemsMap[clientType]) this._clientItemsMap[clientType] = new _set2.default();;

      this._clientItemsMap[clientType].add(item);
    }

    /**
     * Generate a object according to the given items. The result is cached.
     * @private
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
          return _this2.share(item, client.type);
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
//# sourceMappingURL=data:application/json;base64,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QUFsQixFQUE0QixNQUE1QjtBQUNELE9BTEQ7QUFNRDs7Ozs7QUFHSCx5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFlBQXBDOztrQkFFZSxZIiwiZmlsZSI6IlNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBY3Rpdml0eSBmcm9tICcuLi9jb3JlL0FjdGl2aXR5JztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIHNlcnZlciBgJ3NoYXJlZC1jb25maWcnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBjYW4gYmUgdXNlIHdpdGggaXRzIGNsaWVudC1zaWRlIGNvdW50ZXJwYXJ0IGluIG9yZGVyIHRvIHNoYXJlXG4gKiBzb21lIHNlcnZlciBjb25maWd1cmF0aW9uIGl0ZW1zIHdpdGggdGhlIGNsaWVudHMsIG9yIHNlcnZlci1zaWRlIG9ubHkgdG8gYWN0XG4gKiBhcyBhbiBhY2Nlc3NvciBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24uXG4gKlxuICogX18qVGhlIHNlcnZpY2UgY2FuIGJlIHVzZSB3aXRoIGl0cyBbY2xpZW50LXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5TaGFyZWRDb25maWd9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlclxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLnNoYXJlZENvbmZpZyA9IHRoaXMucmVxdWlyZSgnc2hhcmVkLWNvbmZpZycpO1xuICogLy8gYWNjZXNzIGEgY29uZmlndXJhdGlvbiBpdGVtIGZvciBzZXJ2ZXItc2lkZSB1c2VcbiAqIGNvbnN0IGFyZWEgPSB0aGlzLnNoYXJlZENvbmZpZy5nZXQoJ3NldHVwLmFyZWEnKTtcbiAqIC8vIHNoYXJlIHRoaXMgaXRlbSB3aXRoIGNsaWVudCBvZiB0eXBlIGBwbGF5ZXJgXG4gKiB0aGlzLnNoYXJlZENvbmZpZy5zaGFyZSgnc2V0dXAuYXJlYScsICdwbGF5ZXInKTtcbiAqL1xuY2xhc3MgU2hhcmVkQ29uZmlnIGV4dGVuZHMgQWN0aXZpdHkge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICB0aGlzLl9jbGllbnRJdGVtc01hcCA9IHt9O1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVtIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBmcm9tIGl0cyBwYXRoLiBGb3Igc2VydmVyLXNpZGUgdXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqICBGb3IgZXhhbXBsZSBgJ3NldHVwLmFyZWEnYCB3aWxsIHJldHJpZXZlIHRoZSB2YWx1ZSAoaGVyZSBhbiBvYmplY3QpXG4gICAqICBjb3JyZXNwb25kaW5nIHRvIHRoZSBgYXJlYWAga2V5IGluc2lkZSB0aGUgYHNldHVwYCBlbnRyeSBvZiB0aGUgc2VydmVyXG4gICAqICBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gVmFsdWUgb2YgdGhlIHJlcXVlc3RlZCBpdGVtLiBSZXR1cm5zIGBudWxsYCBpZlxuICAgKiAgdGhlIGdpdmVuIGl0ZW0gZG9lcyBub3QgZXhpc3RzLlxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdmFsdWUgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIC8vIHNlYXJjaCBpdGVtIHRocm91Z2ggY29uZmlnXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKHZhbHVlW2F0dHJdKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlW2F0dHJdO1xuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29uZmlndXJhdGlvbiBpdGVtIHRvIGJlIHNoYXJlZCB3aXRoIGEgc3BlY2lmaWMgY2xpZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIEtleSB0byB0aGUgY29uZmlndXJhdGlvbiBpdGVtIChfZXg6XyBgJ3NldHVwLmFyZWEnYClcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBDbGllbnQgdHlwZSB3aG9tIHRoZSBkYXRhIHNob3VsZCBiZSBzaGFyZWQuXG4gICAqL1xuICBzaGFyZShpdGVtLCBjbGllbnRUeXBlKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXSlcbiAgICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpOztcblxuICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdLmFkZChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIG9iamVjdCBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGl0ZW1zLiBUaGUgcmVzdWx0IGlzIGNhY2hlZC5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBpdGVtcyAtIFRoZSBwYXRoIHRvIHRoZSBpdGVtcyB0byBiZSBzaGFyZWQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gQW4gb3B0aW1pemVkIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgcmVxdWVzdGVkIGl0ZW1zLlxuICAgKi9cbiAgX2dldFZhbHVlcyhjbGllbnRUeXBlKSB7XG4gICAgaWYgKHRoaXMuX2NhY2hlW2NsaWVudFR5cGVdKVxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW2NsaWVudFR5cGVdO1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXTtcbiAgICBjb25zdCBzZXJ2ZXJDb25maWcgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIGNvbnN0IGRhdGEgPSB7fTtcblxuICAgIC8vIGJ1aWxkIGRhdGEgdHJlZVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgICAgbGV0IHBvaW50ZXIgPSBkYXRhO1xuXG4gICAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgIGlmICghcG9pbnRlclthdHRyXSlcbiAgICAgICAgICBwb2ludGVyW2F0dHJdID0ge307XG5cbiAgICAgICAgcG9pbnRlciA9IHBvaW50ZXJbYXR0cl07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIHBvcHVsYXRlIHByZXZpb3VzbHkgYnVpbGRlZCB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBsZW4gPSBwYXJ0cy5sZW5ndGg7XG4gICAgICBsZXQgdmFsdWUgPSBzZXJ2ZXJDb25maWc7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIsIGluZGV4KSA9PiB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVbYXR0cl07XG5cbiAgICAgICAgaWYgKGluZGV4IDwgbGVuIC0gMSlcbiAgICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2FjaGVbY2xpZW50VHlwZV0gPSBkYXRhO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICAvLyBnZW5lcmF0ZSBhbiBvcHRpbWl6ZWQgY29uZmlnIGJ1bmRsZSB0byByZXR1cm4gdGhlIGNsaWVudFxuICAgIHJldHVybiAoaXRlbXMpID0+IHtcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuc2hhcmUoaXRlbSwgY2xpZW50LnR5cGUpKTtcblxuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ2V0VmFsdWVzKGNsaWVudC50eXBlKTtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maWcnLCBjb25maWcpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRDb25maWc7XG4iXX0=
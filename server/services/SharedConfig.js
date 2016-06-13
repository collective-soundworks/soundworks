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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:shared-config';

/**
 * Interface for the server `'shared-config'` service.
 *
 * This service can be use with its client-side counterpart in order to share
 * some server configuration items with the clients, or server-side only to act
 * as an accessor to the server configuration.
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

var SharedConfig = function (_Service) {
  (0, _inherits3.default)(SharedConfig, _Service);

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
        if (value && value[attr]) value = value[attr];else value = null;
      });

      return value;
    }

    /**
     * Add a configuration item to be shared with a specific client.
     * @param {String} item - Key to the configuration item (_ex:_ `'setup.area'`)
     * @param {String} clientType - Client type with whom the data should be shared.
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
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedConfig);

exports.default = SharedConfig;
//# sourceMappingURL=data:application/json;base64,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QWtCLFFBQWxCLEVBQTRCLE1BQTVCO0FBQ0QsT0FMRDtBQU1EOzs7OztBQUdILHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsWUFBcEM7O2tCQUVlLFkiLCJmaWxlIjoiU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdzaGFyZWQtY29uZmlnJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgY2FuIGJlIHVzZSB3aXRoIGl0cyBjbGllbnQtc2lkZSBjb3VudGVycGFydCBpbiBvcmRlciB0byBzaGFyZVxuICogc29tZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBpdGVtcyB3aXRoIHRoZSBjbGllbnRzLCBvciBzZXJ2ZXItc2lkZSBvbmx5IHRvIGFjdFxuICogYXMgYW4gYWNjZXNzb3IgdG8gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIGNhbiBiZSB1c2Ugd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkQ29uZmlnfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAqIC8vIGFjY2VzcyBhIGNvbmZpZ3VyYXRpb24gaXRlbSBmb3Igc2VydmVyLXNpZGUgdXNlXG4gKiBjb25zdCBhcmVhID0gdGhpcy5zaGFyZWRDb25maWcuZ2V0KCdzZXR1cC5hcmVhJyk7XG4gKiAvLyBzaGFyZSB0aGlzIGl0ZW0gd2l0aCBjbGllbnQgb2YgdHlwZSBgcGxheWVyYFxuICogdGhpcy5zaGFyZWRDb25maWcuc2hhcmUoJ3NldHVwLmFyZWEnLCAncGxheWVyJyk7XG4gKi9cbmNsYXNzIFNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICB0aGlzLl9jbGllbnRJdGVtc01hcCA9IHt9O1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgdGhpcy5yZWNlaXZlKGNsaWVudCwgJ3JlcXVlc3QnLCB0aGlzLl9vblJlcXVlc3QoY2xpZW50KSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBpdGVtIG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBmcm9tIGl0cyBwYXRoLiBGb3Igc2VydmVyLXNpZGUgdXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHBhdGggdG8gdGhlIGNvbmZpZ3VyYXRpb24uXG4gICAqICBGb3IgZXhhbXBsZSBgJ3NldHVwLmFyZWEnYCB3aWxsIHJldHJpZXZlIHRoZSB2YWx1ZSAoaGVyZSBhbiBvYmplY3QpXG4gICAqICBjb3JyZXNwb25kaW5nIHRvIHRoZSBgYXJlYWAga2V5IGluc2lkZSB0aGUgYHNldHVwYCBlbnRyeSBvZiB0aGUgc2VydmVyXG4gICAqICBjb25maWd1cmF0aW9uLlxuICAgKiBAcmV0dXJucyB7TWl4ZWR9IC0gVmFsdWUgb2YgdGhlIHJlcXVlc3RlZCBpdGVtLiBSZXR1cm5zIGBudWxsYCBpZlxuICAgKiAgdGhlIGdpdmVuIGl0ZW0gZG9lcyBub3QgZXhpc3RzLlxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdmFsdWUgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIC8vIHNlYXJjaCBpdGVtIHRocm91Z2ggY29uZmlnXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgaWYgKHZhbHVlICYmIHZhbHVlW2F0dHJdKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlW2F0dHJdO1xuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29uZmlndXJhdGlvbiBpdGVtIHRvIGJlIHNoYXJlZCB3aXRoIGEgc3BlY2lmaWMgY2xpZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIEtleSB0byB0aGUgY29uZmlndXJhdGlvbiBpdGVtIChfZXg6XyBgJ3NldHVwLmFyZWEnYClcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBDbGllbnQgdHlwZSB3aXRoIHdob20gdGhlIGRhdGEgc2hvdWxkIGJlIHNoYXJlZC5cbiAgICovXG4gIHNoYXJlKGl0ZW0sIGNsaWVudFR5cGUpIHtcbiAgICBpZiAoIXRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdKVxuICAgICAgdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV0gPSBuZXcgU2V0KCk7O1xuXG4gICAgdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV0uYWRkKGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgb2JqZWN0IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gaXRlbXMuIFRoZSByZXN1bHQgaXMgY2FjaGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGl0ZW1zIC0gVGhlIHBhdGggdG8gdGhlIGl0ZW1zIHRvIGJlIHNoYXJlZC5cbiAgICogQHJldHVybnMge09iamVjdH0gLSBBbiBvcHRpbWl6ZWQgb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSByZXF1ZXN0ZWQgaXRlbXMuXG4gICAqL1xuICBfZ2V0VmFsdWVzKGNsaWVudFR5cGUpIHtcbiAgICBpZiAodGhpcy5fY2FjaGVbY2xpZW50VHlwZV0pXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbY2xpZW50VHlwZV07XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdO1xuICAgIGNvbnN0IHNlcnZlckNvbmZpZyA9IHNlcnZlci5jb25maWc7XG4gICAgbGV0IGRhdGEgPSB7fTtcblxuICAgIC8vIGJ1aWxkIGRhdGEgdHJlZVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgICAgbGV0IHBvaW50ZXIgPSBkYXRhO1xuXG4gICAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgIGlmICghcG9pbnRlclthdHRyXSlcbiAgICAgICAgICBwb2ludGVyW2F0dHJdID0ge307XG5cbiAgICAgICAgcG9pbnRlciA9IHBvaW50ZXJbYXR0cl07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIHBvcHVsYXRlIHByZXZpb3VzbHkgYnVpbGRlZCB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBsZW4gPSBwYXJ0cy5sZW5ndGg7XG4gICAgICBsZXQgdmFsdWUgPSBzZXJ2ZXJDb25maWc7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIsIGluZGV4KSA9PiB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVbYXR0cl07XG5cbiAgICAgICAgaWYgKGluZGV4IDwgbGVuIC0gMSlcbiAgICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2FjaGVbY2xpZW50VHlwZV0gPSBkYXRhO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICAvLyBnZW5lcmF0ZSBhbiBvcHRpbWl6ZWQgY29uZmlnIGJ1bmRsZSB0byByZXR1cm4gdGhlIGNsaWVudFxuICAgIHJldHVybiAoaXRlbXMpID0+IHtcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuc2hhcmUoaXRlbSwgY2xpZW50LnR5cGUpKTtcblxuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ2V0VmFsdWVzKGNsaWVudC50eXBlKTtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maWcnLCBjb25maWcpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRDb25maWc7XG4iXX0=
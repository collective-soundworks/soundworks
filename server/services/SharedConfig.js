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

    var _this = (0, _possibleConstructorReturn3.default)(this, (SharedConfig.__proto__ || (0, _getPrototypeOf2.default)(SharedConfig)).call(this, SERVICE_ID));

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiU2hhcmVkQ29uZmlnIiwiX2NhY2hlIiwiX2NsaWVudEl0ZW1zTWFwIiwiY2xpZW50IiwicmVjZWl2ZSIsIl9vblJlcXVlc3QiLCJpdGVtIiwicGFydHMiLCJzcGxpdCIsInZhbHVlIiwiY29uZmlnIiwiZm9yRWFjaCIsImF0dHIiLCJjbGllbnRUeXBlIiwiYWRkIiwiaXRlbXMiLCJzZXJ2ZXJDb25maWciLCJkYXRhIiwicG9pbnRlciIsImxlbiIsImxlbmd0aCIsImluZGV4Iiwic2hhcmUiLCJ0eXBlIiwiX2dldFZhbHVlcyIsInNlbmQiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxhQUFhLHVCQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCTUMsWTs7O0FBQ0o7QUFDQSwwQkFBYztBQUFBOztBQUFBLGtKQUNORCxVQURNOztBQUdaLFVBQUtFLE1BQUwsR0FBYyxFQUFkO0FBQ0EsVUFBS0MsZUFBTCxHQUF1QixFQUF2QjtBQUpZO0FBS2I7O0FBRUQ7Ozs7OzRCQUNRQyxNLEVBQVE7QUFDZCxXQUFLQyxPQUFMLENBQWFELE1BQWIsRUFBcUIsU0FBckIsRUFBZ0MsS0FBS0UsVUFBTCxDQUFnQkYsTUFBaEIsQ0FBaEM7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7O3dCQVNJRyxJLEVBQU07QUFDUixVQUFNQyxRQUFRRCxLQUFLRSxLQUFMLENBQVcsR0FBWCxDQUFkO0FBQ0EsVUFBSUMsUUFBUSxpQkFBT0MsTUFBbkI7QUFDQTtBQUNBSCxZQUFNSSxPQUFOLENBQWMsVUFBQ0MsSUFBRCxFQUFVO0FBQ3RCLFlBQUlILFNBQVNBLE1BQU1HLElBQU4sQ0FBYixFQUNFSCxRQUFRQSxNQUFNRyxJQUFOLENBQVIsQ0FERixLQUdFSCxRQUFRLElBQVI7QUFDSCxPQUxEOztBQU9BLGFBQU9BLEtBQVA7QUFDRDs7QUFFRDs7Ozs7Ozs7MEJBS01ILEksRUFBTU8sVSxFQUFZO0FBQ3RCLFVBQUksQ0FBQyxLQUFLWCxlQUFMLENBQXFCVyxVQUFyQixDQUFMLEVBQ0UsS0FBS1gsZUFBTCxDQUFxQlcsVUFBckIsSUFBbUMsbUJBQW5DLENBQTZDOztBQUUvQyxXQUFLWCxlQUFMLENBQXFCVyxVQUFyQixFQUFpQ0MsR0FBakMsQ0FBcUNSLElBQXJDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzsrQkFNV08sVSxFQUFZO0FBQ3JCLFVBQUksS0FBS1osTUFBTCxDQUFZWSxVQUFaLENBQUosRUFDRSxPQUFPLEtBQUtaLE1BQUwsQ0FBWVksVUFBWixDQUFQOztBQUVGLFVBQU1FLFFBQVEsS0FBS2IsZUFBTCxDQUFxQlcsVUFBckIsQ0FBZDtBQUNBLFVBQU1HLGVBQWUsaUJBQU9OLE1BQTVCO0FBQ0EsVUFBSU8sT0FBTyxFQUFYOztBQUVBO0FBQ0FGLFlBQU1KLE9BQU4sQ0FBYyxVQUFDTCxJQUFELEVBQVU7QUFDdEIsWUFBTUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLEdBQVgsQ0FBZDtBQUNBLFlBQUlVLFVBQVVELElBQWQ7O0FBRUFWLGNBQU1JLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQVU7QUFDdEIsY0FBSSxDQUFDTSxRQUFRTixJQUFSLENBQUwsRUFDRU0sUUFBUU4sSUFBUixJQUFnQixFQUFoQjs7QUFFRk0sb0JBQVVBLFFBQVFOLElBQVIsQ0FBVjtBQUNELFNBTEQ7QUFNRCxPQVZEOztBQVlBO0FBQ0FHLFlBQU1KLE9BQU4sQ0FBYyxVQUFDTCxJQUFELEVBQVU7QUFDdEIsWUFBTUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLEdBQVgsQ0FBZDtBQUNBLFlBQU1XLE1BQU1aLE1BQU1hLE1BQWxCO0FBQ0EsWUFBSVgsUUFBUU8sWUFBWjtBQUNBLFlBQUlFLFVBQVVELElBQWQ7O0FBRUFWLGNBQU1JLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQU9TLEtBQVAsRUFBaUI7QUFDN0JaLGtCQUFRQSxNQUFNRyxJQUFOLENBQVI7O0FBRUEsY0FBSVMsUUFBUUYsTUFBTSxDQUFsQixFQUNFRCxVQUFVQSxRQUFRTixJQUFSLENBQVYsQ0FERixLQUdFTSxRQUFRTixJQUFSLElBQWdCSCxLQUFoQjtBQUNILFNBUEQ7QUFRRCxPQWREOztBQWdCQSxXQUFLUixNQUFMLENBQVlZLFVBQVosSUFBMEJJLElBQTFCO0FBQ0EsYUFBT0EsSUFBUDtBQUNEOzs7K0JBRVVkLE0sRUFBUTtBQUFBOztBQUNqQjtBQUNBLGFBQU8sVUFBQ1ksS0FBRCxFQUFXO0FBQ2hCQSxjQUFNSixPQUFOLENBQWMsVUFBQ0wsSUFBRDtBQUFBLGlCQUFVLE9BQUtnQixLQUFMLENBQVdoQixJQUFYLEVBQWlCSCxPQUFPb0IsSUFBeEIsQ0FBVjtBQUFBLFNBQWQ7O0FBRUEsWUFBTWIsU0FBUyxPQUFLYyxVQUFMLENBQWdCckIsT0FBT29CLElBQXZCLENBQWY7QUFDQSxlQUFLRSxJQUFMLENBQVV0QixNQUFWLEVBQWtCLFFBQWxCLEVBQTRCTyxNQUE1QjtBQUNELE9BTEQ7QUFNRDs7Ozs7QUFHSCx5QkFBZWdCLFFBQWYsQ0FBd0IzQixVQUF4QixFQUFvQ0MsWUFBcEM7O2tCQUVlQSxZIiwiZmlsZSI6IlNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnc2hhcmVkLWNvbmZpZydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGNhbiBiZSB1c2Ugd2l0aCBpdHMgY2xpZW50LXNpZGUgY291bnRlcnBhcnQgaW4gb3JkZXIgdG8gc2hhcmVcbiAqIHNvbWUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaXRlbXMgd2l0aCB0aGUgY2xpZW50cywgb3Igc2VydmVyLXNpZGUgb25seSB0byBhY3RcbiAqIGFzIGFuIGFjY2Vzc29yIHRvIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBjYW4gYmUgdXNlIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZENvbmZpZ30qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gKiAvLyBhY2Nlc3MgYSBjb25maWd1cmF0aW9uIGl0ZW0gZm9yIHNlcnZlci1zaWRlIHVzZVxuICogY29uc3QgYXJlYSA9IHRoaXMuc2hhcmVkQ29uZmlnLmdldCgnc2V0dXAuYXJlYScpO1xuICogLy8gc2hhcmUgdGhpcyBpdGVtIHdpdGggY2xpZW50IG9mIHR5cGUgYHBsYXllcmBcbiAqIHRoaXMuc2hhcmVkQ29uZmlnLnNoYXJlKCdzZXR1cC5hcmVhJywgJ3BsYXllcicpO1xuICovXG5jbGFzcyBTaGFyZWRDb25maWcgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgdGhpcy5fY2xpZW50SXRlbXNNYXAgPSB7fTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gZnJvbSBpdHMgcGF0aC4gRm9yIHNlcnZlci1zaWRlIHVzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gLSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKiAgRm9yIGV4YW1wbGUgYCdzZXR1cC5hcmVhJ2Agd2lsbCByZXRyaWV2ZSB0aGUgdmFsdWUgKGhlcmUgYW4gb2JqZWN0KVxuICAgKiAgY29ycmVzcG9uZGluZyB0byB0aGUgYGFyZWFgIGtleSBpbnNpZGUgdGhlIGBzZXR1cGAgZW50cnkgb2YgdGhlIHNlcnZlclxuICAgKiAgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMge01peGVkfSAtIFZhbHVlIG9mIHRoZSByZXF1ZXN0ZWQgaXRlbS4gUmV0dXJucyBgbnVsbGAgaWZcbiAgICogIHRoZSBnaXZlbiBpdGVtIGRvZXMgbm90IGV4aXN0cy5cbiAgICovXG4gIGdldChpdGVtKSB7XG4gICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgbGV0IHZhbHVlID0gc2VydmVyLmNvbmZpZztcbiAgICAvLyBzZWFyY2ggaXRlbSB0aHJvdWdoIGNvbmZpZ1xuICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZVthdHRyXSlcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVthdHRyXTtcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbmZpZ3VyYXRpb24gaXRlbSB0byBiZSBzaGFyZWQgd2l0aCBhIHNwZWNpZmljIGNsaWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gLSBLZXkgdG8gdGhlIGNvbmZpZ3VyYXRpb24gaXRlbSAoX2V4Ol8gYCdzZXR1cC5hcmVhJ2ApXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIC0gQ2xpZW50IHR5cGUgd2l0aCB3aG9tIHRoZSBkYXRhIHNob3VsZCBiZSBzaGFyZWQuXG4gICAqL1xuICBzaGFyZShpdGVtLCBjbGllbnRUeXBlKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXSlcbiAgICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpOztcblxuICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdLmFkZChpdGVtKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZSBhIG9iamVjdCBhY2NvcmRpbmcgdG8gdGhlIGdpdmVuIGl0ZW1zLiBUaGUgcmVzdWx0IGlzIGNhY2hlZC5cbiAgICogQHByaXZhdGVcbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBpdGVtcyAtIFRoZSBwYXRoIHRvIHRoZSBpdGVtcyB0byBiZSBzaGFyZWQuXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IC0gQW4gb3B0aW1pemVkIG9iamVjdCBjb250YWluaW5nIGFsbCB0aGUgcmVxdWVzdGVkIGl0ZW1zLlxuICAgKi9cbiAgX2dldFZhbHVlcyhjbGllbnRUeXBlKSB7XG4gICAgaWYgKHRoaXMuX2NhY2hlW2NsaWVudFR5cGVdKVxuICAgICAgcmV0dXJuIHRoaXMuX2NhY2hlW2NsaWVudFR5cGVdO1xuXG4gICAgY29uc3QgaXRlbXMgPSB0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXTtcbiAgICBjb25zdCBzZXJ2ZXJDb25maWcgPSBzZXJ2ZXIuY29uZmlnO1xuICAgIGxldCBkYXRhID0ge307XG5cbiAgICAvLyBidWlsZCBkYXRhIHRyZWVcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICAgIGxldCBwb2ludGVyID0gZGF0YTtcblxuICAgICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4ge1xuICAgICAgICBpZiAoIXBvaW50ZXJbYXR0cl0pXG4gICAgICAgICAgcG9pbnRlclthdHRyXSA9IHt9O1xuXG4gICAgICAgIHBvaW50ZXIgPSBwb2ludGVyW2F0dHJdO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBwb3B1bGF0ZSBwcmV2aW91c2x5IGJ1aWxkZWQgdHJlZVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgICAgY29uc3QgbGVuID0gcGFydHMubGVuZ3RoO1xuICAgICAgbGV0IHZhbHVlID0gc2VydmVyQ29uZmlnO1xuICAgICAgbGV0IHBvaW50ZXIgPSBkYXRhO1xuXG4gICAgICBwYXJ0cy5mb3JFYWNoKChhdHRyLCBpbmRleCkgPT4ge1xuICAgICAgICB2YWx1ZSA9IHZhbHVlW2F0dHJdO1xuXG4gICAgICAgIGlmIChpbmRleCA8IGxlbiAtIDEpXG4gICAgICAgICAgcG9pbnRlciA9IHBvaW50ZXJbYXR0cl07XG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwb2ludGVyW2F0dHJdID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMuX2NhY2hlW2NsaWVudFR5cGVdID0gZGF0YTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIF9vblJlcXVlc3QoY2xpZW50KSB7XG4gICAgLy8gZ2VuZXJhdGUgYW4gb3B0aW1pemVkIGNvbmZpZyBidW5kbGUgdG8gcmV0dXJuIHRoZSBjbGllbnRcbiAgICByZXR1cm4gKGl0ZW1zKSA9PiB7XG4gICAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB0aGlzLnNoYXJlKGl0ZW0sIGNsaWVudC50eXBlKSk7XG5cbiAgICAgIGNvbnN0IGNvbmZpZyA9IHRoaXMuX2dldFZhbHVlcyhjbGllbnQudHlwZSk7XG4gICAgICB0aGlzLnNlbmQoY2xpZW50LCAnY29uZmlnJywgY29uZmlnKTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkQ29uZmlnO1xuIl19
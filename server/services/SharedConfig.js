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

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

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

  (0, _createClass3.default)(SharedConfig, [{
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedConfig.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedConfig.prototype), 'start', this).call(this);

      this.ready();
    }

    /** @inheritdoc */

  }, {
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
        if (value && value[attr] !== undefined) value = value[attr];else value = null;
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
      if (!this._clientItemsMap[clientType]) this._clientItemsMap[clientType] = new _set2.default();

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiU2hhcmVkQ29uZmlnIiwiX2NhY2hlIiwiX2NsaWVudEl0ZW1zTWFwIiwicmVhZHkiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsIml0ZW0iLCJwYXJ0cyIsInNwbGl0IiwidmFsdWUiLCJjb25maWciLCJmb3JFYWNoIiwiYXR0ciIsInVuZGVmaW5lZCIsImNsaWVudFR5cGUiLCJhZGQiLCJpdGVtcyIsInNlcnZlckNvbmZpZyIsImRhdGEiLCJwb2ludGVyIiwibGVuIiwibGVuZ3RoIiwiaW5kZXgiLCJzaGFyZSIsInR5cGUiLCJfZ2V0VmFsdWVzIiwic2VuZCIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxhQUFhLHVCQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCTUMsWTs7O0FBQ0o7QUFDQSwwQkFBYztBQUFBOztBQUFBLGtKQUNORCxVQURNOztBQUdaLFVBQUtFLE1BQUwsR0FBYyxFQUFkO0FBQ0EsVUFBS0MsZUFBTCxHQUF1QixFQUF2QjtBQUpZO0FBS2I7Ozs7NEJBRU87QUFDTjs7QUFFQSxXQUFLQyxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1FDLE0sRUFBUTtBQUNkLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLRSxVQUFMLENBQWdCRixNQUFoQixDQUFoQztBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7d0JBU0lHLEksRUFBTTtBQUNSLFVBQU1DLFFBQVFELEtBQUtFLEtBQUwsQ0FBVyxHQUFYLENBQWQ7QUFDQSxVQUFJQyxRQUFRLGlCQUFPQyxNQUFuQjtBQUNBO0FBQ0FILFlBQU1JLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQVU7QUFDdEIsWUFBSUgsU0FBU0EsTUFBTUcsSUFBTixNQUFnQkMsU0FBN0IsRUFDRUosUUFBUUEsTUFBTUcsSUFBTixDQUFSLENBREYsS0FHRUgsUUFBUSxJQUFSO0FBQ0gsT0FMRDs7QUFPQSxhQUFPQSxLQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzBCQUtNSCxJLEVBQU1RLFUsRUFBWTtBQUN0QixVQUFJLENBQUMsS0FBS2IsZUFBTCxDQUFxQmEsVUFBckIsQ0FBTCxFQUNFLEtBQUtiLGVBQUwsQ0FBcUJhLFVBQXJCLElBQW1DLG1CQUFuQzs7QUFFRixXQUFLYixlQUFMLENBQXFCYSxVQUFyQixFQUFpQ0MsR0FBakMsQ0FBcUNULElBQXJDO0FBQ0Q7O0FBRUQ7Ozs7Ozs7OzsrQkFNV1EsVSxFQUFZO0FBQ3JCLFVBQUksS0FBS2QsTUFBTCxDQUFZYyxVQUFaLENBQUosRUFDRSxPQUFPLEtBQUtkLE1BQUwsQ0FBWWMsVUFBWixDQUFQOztBQUVGLFVBQU1FLFFBQVEsS0FBS2YsZUFBTCxDQUFxQmEsVUFBckIsQ0FBZDtBQUNBLFVBQU1HLGVBQWUsaUJBQU9QLE1BQTVCO0FBQ0EsVUFBSVEsT0FBTyxFQUFYOztBQUVBO0FBQ0FGLFlBQU1MLE9BQU4sQ0FBYyxVQUFDTCxJQUFELEVBQVU7QUFDdEIsWUFBTUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLEdBQVgsQ0FBZDtBQUNBLFlBQUlXLFVBQVVELElBQWQ7O0FBRUFYLGNBQU1JLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQVU7QUFDdEIsY0FBSSxDQUFDTyxRQUFRUCxJQUFSLENBQUwsRUFDRU8sUUFBUVAsSUFBUixJQUFnQixFQUFoQjs7QUFFRk8sb0JBQVVBLFFBQVFQLElBQVIsQ0FBVjtBQUNELFNBTEQ7QUFNRCxPQVZEOztBQVlBO0FBQ0FJLFlBQU1MLE9BQU4sQ0FBYyxVQUFDTCxJQUFELEVBQVU7QUFDdEIsWUFBTUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLEdBQVgsQ0FBZDtBQUNBLFlBQU1ZLE1BQU1iLE1BQU1jLE1BQWxCO0FBQ0EsWUFBSVosUUFBUVEsWUFBWjtBQUNBLFlBQUlFLFVBQVVELElBQWQ7O0FBRUFYLGNBQU1JLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQU9VLEtBQVAsRUFBaUI7QUFDN0JiLGtCQUFRQSxNQUFNRyxJQUFOLENBQVI7O0FBRUEsY0FBSVUsUUFBUUYsTUFBTSxDQUFsQixFQUNFRCxVQUFVQSxRQUFRUCxJQUFSLENBQVYsQ0FERixLQUdFTyxRQUFRUCxJQUFSLElBQWdCSCxLQUFoQjtBQUNILFNBUEQ7QUFRRCxPQWREOztBQWdCQSxXQUFLVCxNQUFMLENBQVljLFVBQVosSUFBMEJJLElBQTFCO0FBQ0EsYUFBT0EsSUFBUDtBQUNEOzs7K0JBRVVmLE0sRUFBUTtBQUFBOztBQUNqQjtBQUNBLGFBQU8sVUFBQ2EsS0FBRCxFQUFXO0FBQ2hCQSxjQUFNTCxPQUFOLENBQWMsVUFBQ0wsSUFBRDtBQUFBLGlCQUFVLE9BQUtpQixLQUFMLENBQVdqQixJQUFYLEVBQWlCSCxPQUFPcUIsSUFBeEIsQ0FBVjtBQUFBLFNBQWQ7O0FBRUEsWUFBTWQsU0FBUyxPQUFLZSxVQUFMLENBQWdCdEIsT0FBT3FCLElBQXZCLENBQWY7QUFDQSxlQUFLRSxJQUFMLENBQVV2QixNQUFWLEVBQWtCLFFBQWxCLEVBQTRCTyxNQUE1QjtBQUNELE9BTEQ7QUFNRDs7Ozs7QUFHSCx5QkFBZWlCLFFBQWYsQ0FBd0I3QixVQUF4QixFQUFvQ0MsWUFBcEM7O2tCQUVlQSxZIiwiZmlsZSI6IlNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgc2VydmVyIGZyb20gJy4uL2NvcmUvc2VydmVyJztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgc2VydmVyIGAnc2hhcmVkLWNvbmZpZydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGNhbiBiZSB1c2Ugd2l0aCBpdHMgY2xpZW50LXNpZGUgY291bnRlcnBhcnQgaW4gb3JkZXIgdG8gc2hhcmVcbiAqIHNvbWUgc2VydmVyIGNvbmZpZ3VyYXRpb24gaXRlbXMgd2l0aCB0aGUgY2xpZW50cywgb3Igc2VydmVyLXNpZGUgb25seSB0byBhY3RcbiAqIGFzIGFuIGFjY2Vzc29yIHRvIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbi5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBjYW4gYmUgdXNlIHdpdGggaXRzIFtjbGllbnQtc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LlNoYXJlZENvbmZpZ30qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyXG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJyk7XG4gKiAvLyBhY2Nlc3MgYSBjb25maWd1cmF0aW9uIGl0ZW0gZm9yIHNlcnZlci1zaWRlIHVzZVxuICogY29uc3QgYXJlYSA9IHRoaXMuc2hhcmVkQ29uZmlnLmdldCgnc2V0dXAuYXJlYScpO1xuICogLy8gc2hhcmUgdGhpcyBpdGVtIHdpdGggY2xpZW50IG9mIHR5cGUgYHBsYXllcmBcbiAqIHRoaXMuc2hhcmVkQ29uZmlnLnNoYXJlKCdzZXR1cC5hcmVhJywgJ3BsYXllcicpO1xuICovXG5jbGFzcyBTaGFyZWRDb25maWcgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lEKTtcblxuICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgdGhpcy5fY2xpZW50SXRlbXNNYXAgPSB7fTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICB0aGlzLnJlY2VpdmUoY2xpZW50LCAncmVxdWVzdCcsIHRoaXMuX29uUmVxdWVzdChjbGllbnQpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIGl0ZW0gb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uIGZyb20gaXRzIHBhdGguIEZvciBzZXJ2ZXItc2lkZSB1c2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpdGVtIC0gU3RyaW5nIHJlcHJlc2VudGluZyB0aGUgcGF0aCB0byB0aGUgY29uZmlndXJhdGlvbi5cbiAgICogIEZvciBleGFtcGxlIGAnc2V0dXAuYXJlYSdgIHdpbGwgcmV0cmlldmUgdGhlIHZhbHVlIChoZXJlIGFuIG9iamVjdClcbiAgICogIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGBhcmVhYCBrZXkgaW5zaWRlIHRoZSBgc2V0dXBgIGVudHJ5IG9mIHRoZSBzZXJ2ZXJcbiAgICogIGNvbmZpZ3VyYXRpb24uXG4gICAqIEByZXR1cm5zIHtNaXhlZH0gLSBWYWx1ZSBvZiB0aGUgcmVxdWVzdGVkIGl0ZW0uIFJldHVybnMgYG51bGxgIGlmXG4gICAqICB0aGUgZ2l2ZW4gaXRlbSBkb2VzIG5vdCBleGlzdHMuXG4gICAqL1xuICBnZXQoaXRlbSkge1xuICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgIGxldCB2YWx1ZSA9IHNlcnZlci5jb25maWc7XG4gICAgLy8gc2VhcmNoIGl0ZW0gdGhyb3VnaCBjb25maWdcbiAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICBpZiAodmFsdWUgJiYgdmFsdWVbYXR0cl0gIT09IHVuZGVmaW5lZClcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVthdHRyXTtcbiAgICAgIGVsc2VcbiAgICAgICAgdmFsdWUgPSBudWxsO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbmZpZ3VyYXRpb24gaXRlbSB0byBiZSBzaGFyZWQgd2l0aCBhIHNwZWNpZmljIGNsaWVudC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gLSBLZXkgdG8gdGhlIGNvbmZpZ3VyYXRpb24gaXRlbSAoX2V4Ol8gYCdzZXR1cC5hcmVhJ2ApXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjbGllbnRUeXBlIC0gQ2xpZW50IHR5cGUgd2l0aCB3aG9tIHRoZSBkYXRhIHNob3VsZCBiZSBzaGFyZWQuXG4gICAqL1xuICBzaGFyZShpdGVtLCBjbGllbnRUeXBlKSB7XG4gICAgaWYgKCF0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXSlcbiAgICAgIHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV0uYWRkKGl0ZW0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgb2JqZWN0IGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gaXRlbXMuIFRoZSByZXN1bHQgaXMgY2FjaGVkLlxuICAgKiBAcHJpdmF0ZVxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IGl0ZW1zIC0gVGhlIHBhdGggdG8gdGhlIGl0ZW1zIHRvIGJlIHNoYXJlZC5cbiAgICogQHJldHVybnMge09iamVjdH0gLSBBbiBvcHRpbWl6ZWQgb2JqZWN0IGNvbnRhaW5pbmcgYWxsIHRoZSByZXF1ZXN0ZWQgaXRlbXMuXG4gICAqL1xuICBfZ2V0VmFsdWVzKGNsaWVudFR5cGUpIHtcbiAgICBpZiAodGhpcy5fY2FjaGVbY2xpZW50VHlwZV0pXG4gICAgICByZXR1cm4gdGhpcy5fY2FjaGVbY2xpZW50VHlwZV07XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdO1xuICAgIGNvbnN0IHNlcnZlckNvbmZpZyA9IHNlcnZlci5jb25maWc7XG4gICAgbGV0IGRhdGEgPSB7fTtcblxuICAgIC8vIGJ1aWxkIGRhdGEgdHJlZVxuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgIGNvbnN0IHBhcnRzID0gaXRlbS5zcGxpdCgnLicpO1xuICAgICAgbGV0IHBvaW50ZXIgPSBkYXRhO1xuXG4gICAgICBwYXJ0cy5mb3JFYWNoKChhdHRyKSA9PiB7XG4gICAgICAgIGlmICghcG9pbnRlclthdHRyXSlcbiAgICAgICAgICBwb2ludGVyW2F0dHJdID0ge307XG5cbiAgICAgICAgcG9pbnRlciA9IHBvaW50ZXJbYXR0cl07XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIHBvcHVsYXRlIHByZXZpb3VzbHkgYnVpbGRlZCB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBjb25zdCBsZW4gPSBwYXJ0cy5sZW5ndGg7XG4gICAgICBsZXQgdmFsdWUgPSBzZXJ2ZXJDb25maWc7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIsIGluZGV4KSA9PiB7XG4gICAgICAgIHZhbHVlID0gdmFsdWVbYXR0cl07XG5cbiAgICAgICAgaWYgKGluZGV4IDwgbGVuIC0gMSlcbiAgICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5fY2FjaGVbY2xpZW50VHlwZV0gPSBkYXRhO1xuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgX29uUmVxdWVzdChjbGllbnQpIHtcbiAgICAvLyBnZW5lcmF0ZSBhbiBvcHRpbWl6ZWQgY29uZmlnIGJ1bmRsZSB0byByZXR1cm4gdGhlIGNsaWVudFxuICAgIHJldHVybiAoaXRlbXMpID0+IHtcbiAgICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHRoaXMuc2hhcmUoaXRlbSwgY2xpZW50LnR5cGUpKTtcblxuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5fZ2V0VmFsdWVzKGNsaWVudC50eXBlKTtcbiAgICAgIHRoaXMuc2VuZChjbGllbnQsICdjb25maWcnLCBjb25maWcpO1xuICAgIH07XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkQ29uZmlnO1xuIl19
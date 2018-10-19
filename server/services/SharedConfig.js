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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiU2hhcmVkQ29uZmlnIiwiX2NhY2hlIiwiX2NsaWVudEl0ZW1zTWFwIiwicmVhZHkiLCJjbGllbnQiLCJyZWNlaXZlIiwiX29uUmVxdWVzdCIsIml0ZW0iLCJwYXJ0cyIsInNwbGl0IiwidmFsdWUiLCJzZXJ2ZXIiLCJjb25maWciLCJmb3JFYWNoIiwiYXR0ciIsInVuZGVmaW5lZCIsImNsaWVudFR5cGUiLCJhZGQiLCJpdGVtcyIsInNlcnZlckNvbmZpZyIsImRhdGEiLCJwb2ludGVyIiwibGVuIiwibGVuZ3RoIiwiaW5kZXgiLCJzaGFyZSIsInR5cGUiLCJfZ2V0VmFsdWVzIiwic2VuZCIsIlNlcnZpY2UiLCJzZXJ2aWNlTWFuYWdlciIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxhQUFhLHVCQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQWtCTUMsWTs7O0FBQ0o7QUFDQSwwQkFBYztBQUFBOztBQUFBLGtKQUNORCxVQURNOztBQUdaLFVBQUtFLE1BQUwsR0FBYyxFQUFkO0FBQ0EsVUFBS0MsZUFBTCxHQUF1QixFQUF2QjtBQUpZO0FBS2I7Ozs7NEJBRU87QUFDTjs7QUFFQSxXQUFLQyxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7NEJBQ1FDLE0sRUFBUTtBQUNkLFdBQUtDLE9BQUwsQ0FBYUQsTUFBYixFQUFxQixTQUFyQixFQUFnQyxLQUFLRSxVQUFMLENBQWdCRixNQUFoQixDQUFoQztBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7d0JBU0lHLEksRUFBTTtBQUNSLFVBQU1DLFFBQVFELEtBQUtFLEtBQUwsQ0FBVyxHQUFYLENBQWQ7QUFDQSxVQUFJQyxRQUFRQyxpQkFBT0MsTUFBbkI7QUFDQTtBQUNBSixZQUFNSyxPQUFOLENBQWMsVUFBQ0MsSUFBRCxFQUFVO0FBQ3RCLFlBQUlKLFNBQVNBLE1BQU1JLElBQU4sTUFBZ0JDLFNBQTdCLEVBQ0VMLFFBQVFBLE1BQU1JLElBQU4sQ0FBUixDQURGLEtBR0VKLFFBQVEsSUFBUjtBQUNILE9BTEQ7O0FBT0EsYUFBT0EsS0FBUDtBQUNEOztBQUVEOzs7Ozs7OzswQkFLTUgsSSxFQUFNUyxVLEVBQVk7QUFDdEIsVUFBSSxDQUFDLEtBQUtkLGVBQUwsQ0FBcUJjLFVBQXJCLENBQUwsRUFDRSxLQUFLZCxlQUFMLENBQXFCYyxVQUFyQixJQUFtQyxtQkFBbkM7O0FBRUYsV0FBS2QsZUFBTCxDQUFxQmMsVUFBckIsRUFBaUNDLEdBQWpDLENBQXFDVixJQUFyQztBQUNEOztBQUVEOzs7Ozs7Ozs7K0JBTVdTLFUsRUFBWTtBQUNyQixVQUFJLEtBQUtmLE1BQUwsQ0FBWWUsVUFBWixDQUFKLEVBQ0UsT0FBTyxLQUFLZixNQUFMLENBQVllLFVBQVosQ0FBUDs7QUFFRixVQUFNRSxRQUFRLEtBQUtoQixlQUFMLENBQXFCYyxVQUFyQixDQUFkO0FBQ0EsVUFBTUcsZUFBZVIsaUJBQU9DLE1BQTVCO0FBQ0EsVUFBSVEsT0FBTyxFQUFYOztBQUVBO0FBQ0FGLFlBQU1MLE9BQU4sQ0FBYyxVQUFDTixJQUFELEVBQVU7QUFDdEIsWUFBTUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLEdBQVgsQ0FBZDtBQUNBLFlBQUlZLFVBQVVELElBQWQ7O0FBRUFaLGNBQU1LLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQVU7QUFDdEIsY0FBSSxDQUFDTyxRQUFRUCxJQUFSLENBQUwsRUFDRU8sUUFBUVAsSUFBUixJQUFnQixFQUFoQjs7QUFFRk8sb0JBQVVBLFFBQVFQLElBQVIsQ0FBVjtBQUNELFNBTEQ7QUFNRCxPQVZEOztBQVlBO0FBQ0FJLFlBQU1MLE9BQU4sQ0FBYyxVQUFDTixJQUFELEVBQVU7QUFDdEIsWUFBTUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLEdBQVgsQ0FBZDtBQUNBLFlBQU1hLE1BQU1kLE1BQU1lLE1BQWxCO0FBQ0EsWUFBSWIsUUFBUVMsWUFBWjtBQUNBLFlBQUlFLFVBQVVELElBQWQ7O0FBRUFaLGNBQU1LLE9BQU4sQ0FBYyxVQUFDQyxJQUFELEVBQU9VLEtBQVAsRUFBaUI7QUFDN0JkLGtCQUFRQSxNQUFNSSxJQUFOLENBQVI7O0FBRUEsY0FBSVUsUUFBUUYsTUFBTSxDQUFsQixFQUNFRCxVQUFVQSxRQUFRUCxJQUFSLENBQVYsQ0FERixLQUdFTyxRQUFRUCxJQUFSLElBQWdCSixLQUFoQjtBQUNILFNBUEQ7QUFRRCxPQWREOztBQWdCQSxXQUFLVCxNQUFMLENBQVllLFVBQVosSUFBMEJJLElBQTFCO0FBQ0EsYUFBT0EsSUFBUDtBQUNEOzs7K0JBRVVoQixNLEVBQVE7QUFBQTs7QUFDakI7QUFDQSxhQUFPLFVBQUNjLEtBQUQsRUFBVztBQUNoQkEsY0FBTUwsT0FBTixDQUFjLFVBQUNOLElBQUQ7QUFBQSxpQkFBVSxPQUFLa0IsS0FBTCxDQUFXbEIsSUFBWCxFQUFpQkgsT0FBT3NCLElBQXhCLENBQVY7QUFBQSxTQUFkOztBQUVBLFlBQU1kLFNBQVMsT0FBS2UsVUFBTCxDQUFnQnZCLE9BQU9zQixJQUF2QixDQUFmO0FBQ0EsZUFBS0UsSUFBTCxDQUFVeEIsTUFBVixFQUFrQixRQUFsQixFQUE0QlEsTUFBNUI7QUFDRCxPQUxEO0FBTUQ7OztFQS9Hd0JpQixpQjs7QUFrSDNCQyx5QkFBZUMsUUFBZixDQUF3QmhDLFVBQXhCLEVBQW9DQyxZQUFwQzs7a0JBRWVBLFkiLCJmaWxlIjoiU2hhcmVkQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBzZXJ2ZXIgZnJvbSAnLi4vY29yZS9zZXJ2ZXInO1xuXG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpzaGFyZWQtY29uZmlnJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBzZXJ2ZXIgYCdzaGFyZWQtY29uZmlnJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgY2FuIGJlIHVzZSB3aXRoIGl0cyBjbGllbnQtc2lkZSBjb3VudGVycGFydCBpbiBvcmRlciB0byBzaGFyZVxuICogc29tZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiBpdGVtcyB3aXRoIHRoZSBjbGllbnRzLCBvciBzZXJ2ZXItc2lkZSBvbmx5IHRvIGFjdFxuICogYXMgYW4gYWNjZXNzb3IgdG8gdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIGNhbiBiZSB1c2Ugd2l0aCBpdHMgW2NsaWVudC1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuU2hhcmVkQ29uZmlnfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXJcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5zaGFyZWRDb25maWcgPSB0aGlzLnJlcXVpcmUoJ3NoYXJlZC1jb25maWcnKTtcbiAqIC8vIGFjY2VzcyBhIGNvbmZpZ3VyYXRpb24gaXRlbSBmb3Igc2VydmVyLXNpZGUgdXNlXG4gKiBjb25zdCBhcmVhID0gdGhpcy5zaGFyZWRDb25maWcuZ2V0KCdzZXR1cC5hcmVhJyk7XG4gKiAvLyBzaGFyZSB0aGlzIGl0ZW0gd2l0aCBjbGllbnQgb2YgdHlwZSBgcGxheWVyYFxuICogdGhpcy5zaGFyZWRDb25maWcuc2hhcmUoJ3NldHVwLmFyZWEnLCAncGxheWVyJyk7XG4gKi9cbmNsYXNzIFNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQpO1xuXG4gICAgdGhpcy5fY2FjaGUgPSB7fTtcbiAgICB0aGlzLl9jbGllbnRJdGVtc01hcCA9IHt9O1xuICB9XG5cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKiBAaW5oZXJpdGRvYyAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIHRoaXMucmVjZWl2ZShjbGllbnQsICdyZXF1ZXN0JywgdGhpcy5fb25SZXF1ZXN0KGNsaWVudCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gaXRlbSBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gZnJvbSBpdHMgcGF0aC4gRm9yIHNlcnZlci1zaWRlIHVzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gLSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBwYXRoIHRvIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKiAgRm9yIGV4YW1wbGUgYCdzZXR1cC5hcmVhJ2Agd2lsbCByZXRyaWV2ZSB0aGUgdmFsdWUgKGhlcmUgYW4gb2JqZWN0KVxuICAgKiAgY29ycmVzcG9uZGluZyB0byB0aGUgYGFyZWFgIGtleSBpbnNpZGUgdGhlIGBzZXR1cGAgZW50cnkgb2YgdGhlIHNlcnZlclxuICAgKiAgY29uZmlndXJhdGlvbi5cbiAgICogQHJldHVybnMge01peGVkfSAtIFZhbHVlIG9mIHRoZSByZXF1ZXN0ZWQgaXRlbS4gUmV0dXJucyBgbnVsbGAgaWZcbiAgICogIHRoZSBnaXZlbiBpdGVtIGRvZXMgbm90IGV4aXN0cy5cbiAgICovXG4gIGdldChpdGVtKSB7XG4gICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgbGV0IHZhbHVlID0gc2VydmVyLmNvbmZpZztcbiAgICAvLyBzZWFyY2ggaXRlbSB0aHJvdWdoIGNvbmZpZ1xuICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZVthdHRyXSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICB2YWx1ZSA9IHZhbHVlW2F0dHJdO1xuICAgICAgZWxzZVxuICAgICAgICB2YWx1ZSA9IG51bGw7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgY29uZmlndXJhdGlvbiBpdGVtIHRvIGJlIHNoYXJlZCB3aXRoIGEgc3BlY2lmaWMgY2xpZW50LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIEtleSB0byB0aGUgY29uZmlndXJhdGlvbiBpdGVtIChfZXg6XyBgJ3NldHVwLmFyZWEnYClcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNsaWVudFR5cGUgLSBDbGllbnQgdHlwZSB3aXRoIHdob20gdGhlIGRhdGEgc2hvdWxkIGJlIHNoYXJlZC5cbiAgICovXG4gIHNoYXJlKGl0ZW0sIGNsaWVudFR5cGUpIHtcbiAgICBpZiAoIXRoaXMuX2NsaWVudEl0ZW1zTWFwW2NsaWVudFR5cGVdKVxuICAgICAgdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV0gPSBuZXcgU2V0KCk7XG5cbiAgICB0aGlzLl9jbGllbnRJdGVtc01hcFtjbGllbnRUeXBlXS5hZGQoaXRlbSk7XG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGUgYSBvYmplY3QgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBpdGVtcy4gVGhlIHJlc3VsdCBpcyBjYWNoZWQuXG4gICAqIEBwcml2YXRlXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gaXRlbXMgLSBUaGUgcGF0aCB0byB0aGUgaXRlbXMgdG8gYmUgc2hhcmVkLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSAtIEFuIG9wdGltaXplZCBvYmplY3QgY29udGFpbmluZyBhbGwgdGhlIHJlcXVlc3RlZCBpdGVtcy5cbiAgICovXG4gIF9nZXRWYWx1ZXMoY2xpZW50VHlwZSkge1xuICAgIGlmICh0aGlzLl9jYWNoZVtjbGllbnRUeXBlXSlcbiAgICAgIHJldHVybiB0aGlzLl9jYWNoZVtjbGllbnRUeXBlXTtcblxuICAgIGNvbnN0IGl0ZW1zID0gdGhpcy5fY2xpZW50SXRlbXNNYXBbY2xpZW50VHlwZV07XG4gICAgY29uc3Qgc2VydmVyQ29uZmlnID0gc2VydmVyLmNvbmZpZztcbiAgICBsZXQgZGF0YSA9IHt9O1xuXG4gICAgLy8gYnVpbGQgZGF0YSB0cmVlXG4gICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgY29uc3QgcGFydHMgPSBpdGVtLnNwbGl0KCcuJyk7XG4gICAgICBsZXQgcG9pbnRlciA9IGRhdGE7XG5cbiAgICAgIHBhcnRzLmZvckVhY2goKGF0dHIpID0+IHtcbiAgICAgICAgaWYgKCFwb2ludGVyW2F0dHJdKVxuICAgICAgICAgIHBvaW50ZXJbYXR0cl0gPSB7fTtcblxuICAgICAgICBwb2ludGVyID0gcG9pbnRlclthdHRyXTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gcG9wdWxhdGUgcHJldmlvdXNseSBidWlsZGVkIHRyZWVcbiAgICBpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICAgIGNvbnN0IGxlbiA9IHBhcnRzLmxlbmd0aDtcbiAgICAgIGxldCB2YWx1ZSA9IHNlcnZlckNvbmZpZztcbiAgICAgIGxldCBwb2ludGVyID0gZGF0YTtcblxuICAgICAgcGFydHMuZm9yRWFjaCgoYXR0ciwgaW5kZXgpID0+IHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZVthdHRyXTtcblxuICAgICAgICBpZiAoaW5kZXggPCBsZW4gLSAxKVxuICAgICAgICAgIHBvaW50ZXIgPSBwb2ludGVyW2F0dHJdO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgcG9pbnRlclthdHRyXSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLl9jYWNoZVtjbGllbnRUeXBlXSA9IGRhdGE7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBfb25SZXF1ZXN0KGNsaWVudCkge1xuICAgIC8vIGdlbmVyYXRlIGFuIG9wdGltaXplZCBjb25maWcgYnVuZGxlIHRvIHJldHVybiB0aGUgY2xpZW50XG4gICAgcmV0dXJuIChpdGVtcykgPT4ge1xuICAgICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4gdGhpcy5zaGFyZShpdGVtLCBjbGllbnQudHlwZSkpO1xuXG4gICAgICBjb25zdCBjb25maWcgPSB0aGlzLl9nZXRWYWx1ZXMoY2xpZW50LnR5cGUpO1xuICAgICAgdGhpcy5zZW5kKGNsaWVudCwgJ2NvbmZpZycsIGNvbmZpZyk7XG4gICAgfTtcbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBTaGFyZWRDb25maWcpO1xuXG5leHBvcnQgZGVmYXVsdCBTaGFyZWRDb25maWc7XG4iXX0=
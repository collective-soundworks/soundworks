'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _client = require('../core/client');

var _client2 = _interopRequireDefault(_client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:shared-config';

/**
 * Interface for the client `'shared-config'` service.
 *
 * This service allows to share parts of the server configuration to the clients.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.SharedConfig}*__
 *
 * @param {Object} options
 * @param {Array<String>} options.items - List of the configuration items
 *  required by the server. The given strings follow a convention defining a path
 *  to the required configuration item, for example `'setup.area'` will retrieve
 *  the value (here an object) corresponding to the `area` key inside the `setup`
 *  entry of the server configuration.
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.sharedConfig = this.require('shared-config', { items: ['setup.area'] });
 * // when the experience has started
 * const areaWidth = this.sharedConfig.get('setup.area.width');
 */

var SharedConfig = function (_Service) {
  (0, _inherits3.default)(SharedConfig, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function SharedConfig() {
    (0, _classCallCheck3.default)(this, SharedConfig);

    /**
     * Configuration items required by the client.
     * @type {Array}
     * @private
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (SharedConfig.__proto__ || (0, _getPrototypeOf2.default)(SharedConfig)).call(this, SERVICE_ID, true));

    _this._items = [];

    _this._onConfigResponse = _this._onConfigResponse.bind(_this);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(SharedConfig, [{
    key: 'configure',
    value: function configure(options) {
      if (options.items) {
        this._items = this._items.concat(options.items);
        delete options.items;
      }

      (0, _get3.default)(SharedConfig.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedConfig.prototype), 'configure', this).call(this, options);
    }

    /** @private */

  }, {
    key: 'init',
    value: function init() {
      /**
       * Object containing all the configuration items shared by the server. The
       * object is flattened in order to minimize the needed communications between
       * the client and the server.
       * @type {Object}
       */
      this.data = null;
    }

    /** @private */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)(SharedConfig.prototype.__proto__ || (0, _getPrototypeOf2.default)(SharedConfig.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.send('request', this._items);
      this.receive('config', this._onConfigResponse);
    }

    /** @private */

  }, {
    key: '_onConfigResponse',
    value: function _onConfigResponse(data) {
      this.data = _client2.default.config = data;
      this.ready();
    }

    /**
     * Retrieve a configuration value from its key item, as defined in server side
     * service's `addItem` method or in client-side `items` option.
     * @param {String} item - Key to the configuration item (_ex:_ `'setup.area'`)
     * @return {Mixed}
     */

  }, {
    key: 'get',
    value: function get(item) {
      var parts = item.split('.');
      var tmp = this.data;

      parts.forEach(function (attr) {
        return tmp = tmp[attr];
      });

      return tmp;
    }
  }]);
  return SharedConfig;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedConfig);

exports.default = SharedConfig;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6WyJTRVJWSUNFX0lEIiwiU2hhcmVkQ29uZmlnIiwiX2l0ZW1zIiwiX29uQ29uZmlnUmVzcG9uc2UiLCJiaW5kIiwib3B0aW9ucyIsIml0ZW1zIiwiY29uY2F0IiwiZGF0YSIsImhhc1N0YXJ0ZWQiLCJpbml0Iiwic2VuZCIsInJlY2VpdmUiLCJjb25maWciLCJyZWFkeSIsIml0ZW0iLCJwYXJ0cyIsInNwbGl0IiwidG1wIiwiZm9yRWFjaCIsImF0dHIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFHQSxJQUFNQSxhQUFhLHVCQUFuQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCTUMsWTs7O0FBQ0o7QUFDQSwwQkFBYztBQUFBOztBQUdaOzs7OztBQUhZLGtKQUNORCxVQURNLEVBQ00sSUFETjs7QUFRWixVQUFLRSxNQUFMLEdBQWMsRUFBZDs7QUFFQSxVQUFLQyxpQkFBTCxHQUF5QixNQUFLQSxpQkFBTCxDQUF1QkMsSUFBdkIsT0FBekI7QUFWWTtBQVdiOztBQUVEOzs7Ozs4QkFDVUMsTyxFQUFTO0FBQ2pCLFVBQUlBLFFBQVFDLEtBQVosRUFBbUI7QUFDakIsYUFBS0osTUFBTCxHQUFjLEtBQUtBLE1BQUwsQ0FBWUssTUFBWixDQUFtQkYsUUFBUUMsS0FBM0IsQ0FBZDtBQUNBLGVBQU9ELFFBQVFDLEtBQWY7QUFDRDs7QUFFRCxrSkFBZ0JELE9BQWhCO0FBQ0Q7O0FBRUQ7Ozs7MkJBQ087QUFDTDs7Ozs7O0FBTUEsV0FBS0csSUFBTCxHQUFZLElBQVo7QUFDRDs7QUFFRDs7Ozs0QkFDUTtBQUNOOztBQUVBLFVBQUksQ0FBQyxLQUFLQyxVQUFWLEVBQ0UsS0FBS0MsSUFBTDs7QUFFRixXQUFLQyxJQUFMLENBQVUsU0FBVixFQUFxQixLQUFLVCxNQUExQjtBQUNBLFdBQUtVLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLEtBQUtULGlCQUE1QjtBQUNEOztBQUVEOzs7O3NDQUNrQkssSSxFQUFNO0FBQ3RCLFdBQUtBLElBQUwsR0FBWSxpQkFBT0ssTUFBUCxHQUFnQkwsSUFBNUI7QUFDQSxXQUFLTSxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt3QkFNSUMsSSxFQUFNO0FBQ1IsVUFBTUMsUUFBUUQsS0FBS0UsS0FBTCxDQUFXLEdBQVgsQ0FBZDtBQUNBLFVBQUlDLE1BQU0sS0FBS1YsSUFBZjs7QUFFQVEsWUFBTUcsT0FBTixDQUFjLFVBQUNDLElBQUQ7QUFBQSxlQUFVRixNQUFNQSxJQUFJRSxJQUFKLENBQWhCO0FBQUEsT0FBZDs7QUFFQSxhQUFPRixHQUFQO0FBQ0Q7Ozs7O0FBR0gseUJBQWVHLFFBQWYsQ0FBd0JyQixVQUF4QixFQUFvQ0MsWUFBcEM7O2tCQUVlQSxZIiwiZmlsZSI6IlNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogSW50ZXJmYWNlIGZvciB0aGUgY2xpZW50IGAnc2hhcmVkLWNvbmZpZydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBzaGFyZSBwYXJ0cyBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gdG8gdGhlIGNsaWVudHMuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZENvbmZpZ30qX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLml0ZW1zIC0gTGlzdCBvZiB0aGUgY29uZmlndXJhdGlvbiBpdGVtc1xuICogIHJlcXVpcmVkIGJ5IHRoZSBzZXJ2ZXIuIFRoZSBnaXZlbiBzdHJpbmdzIGZvbGxvdyBhIGNvbnZlbnRpb24gZGVmaW5pbmcgYSBwYXRoXG4gKiAgdG8gdGhlIHJlcXVpcmVkIGNvbmZpZ3VyYXRpb24gaXRlbSwgZm9yIGV4YW1wbGUgYCdzZXR1cC5hcmVhJ2Agd2lsbCByZXRyaWV2ZVxuICogIHRoZSB2YWx1ZSAoaGVyZSBhbiBvYmplY3QpIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGBhcmVhYCBrZXkgaW5zaWRlIHRoZSBgc2V0dXBgXG4gKiAgZW50cnkgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJywgeyBpdGVtczogWydzZXR1cC5hcmVhJ10gfSk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBjb25zdCBhcmVhV2lkdGggPSB0aGlzLnNoYXJlZENvbmZpZy5nZXQoJ3NldHVwLmFyZWEud2lkdGgnKTtcbiAqL1xuY2xhc3MgU2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmF0aW9uIGl0ZW1zIHJlcXVpcmVkIGJ5IHRoZSBjbGllbnQuXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5faXRlbXMgPSBbXTtcblxuICAgIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5pdGVtcykge1xuICAgICAgdGhpcy5faXRlbXMgPSB0aGlzLl9pdGVtcy5jb25jYXQob3B0aW9ucy5pdGVtcyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5pdGVtcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBPYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGNvbmZpZ3VyYXRpb24gaXRlbXMgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIuIFRoZVxuICAgICAqIG9iamVjdCBpcyBmbGF0dGVuZWQgaW4gb3JkZXIgdG8gbWluaW1pemUgdGhlIG5lZWRlZCBjb21tdW5pY2F0aW9ucyBiZXR3ZWVuXG4gICAgICogdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLl9pdGVtcyk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maWcnLCB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25maWdSZXNwb25zZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gY2xpZW50LmNvbmZpZyA9IGRhdGE7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgY29uZmlndXJhdGlvbiB2YWx1ZSBmcm9tIGl0cyBrZXkgaXRlbSwgYXMgZGVmaW5lZCBpbiBzZXJ2ZXIgc2lkZVxuICAgKiBzZXJ2aWNlJ3MgYGFkZEl0ZW1gIG1ldGhvZCBvciBpbiBjbGllbnQtc2lkZSBgaXRlbXNgIG9wdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gLSBLZXkgdG8gdGhlIGNvbmZpZ3VyYXRpb24gaXRlbSAoX2V4Ol8gYCdzZXR1cC5hcmVhJ2ApXG4gICAqIEByZXR1cm4ge01peGVkfVxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdG1wID0gdGhpcy5kYXRhO1xuXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4gdG1wID0gdG1wW2F0dHJdKTtcblxuICAgIHJldHVybiB0bXA7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkQ29uZmlnO1xuIl19
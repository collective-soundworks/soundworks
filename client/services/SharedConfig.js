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
 * Interface of the client `'shared-config'` service.
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

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedConfig).call(this, SERVICE_ID, true));

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

      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedConfig.prototype), 'configure', this).call(this, options);
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedConfig.prototype), 'start', this).call(this);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU0sYUFBYSx1QkFBYjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBdUJBOzs7OztBQUVKLFdBRkksWUFFSixHQUFjO3dDQUZWLGNBRVU7Ozs7Ozs7Ozs2RkFGVix5QkFHSSxZQUFZLE9BRE47O0FBUVosVUFBSyxNQUFMLEdBQWMsRUFBZCxDQVJZOztBQVVaLFVBQUssaUJBQUwsR0FBeUIsTUFBSyxpQkFBTCxDQUF1QixJQUF2QixPQUF6QixDQVZZOztHQUFkOzs7Ozs2QkFGSTs7OEJBZ0JNLFNBQVM7QUFDakIsVUFBSSxRQUFRLEtBQVIsRUFBZTtBQUNqQixhQUFLLE1BQUwsR0FBYyxLQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLFFBQVEsS0FBUixDQUFqQyxDQURpQjtBQUVqQixlQUFPLFFBQVEsS0FBUixDQUZVO09BQW5COztBQUtBLHVEQXRCRSx1REFzQmMsUUFBaEIsQ0FOaUI7Ozs7Ozs7MkJBVVo7Ozs7Ozs7QUFPTCxXQUFLLElBQUwsR0FBWSxJQUFaLENBUEs7Ozs7Ozs7NEJBV0M7QUFDTix1REF0Q0Usa0RBc0NGLENBRE07O0FBR04sVUFBSSxDQUFDLEtBQUssVUFBTCxFQUNILEtBQUssSUFBTCxHQURGOztBQUdBLFdBQUssSUFBTCxDQUFVLFNBQVYsRUFBcUIsS0FBSyxNQUFMLENBQXJCLENBTk07QUFPTixXQUFLLE9BQUwsQ0FBYSxRQUFiLEVBQXVCLEtBQUssaUJBQUwsQ0FBdkIsQ0FQTTs7Ozs7OztzQ0FXVSxNQUFNO0FBQ3RCLFdBQUssSUFBTCxHQUFZLGlCQUFPLE1BQVAsR0FBZ0IsSUFBaEIsQ0FEVTtBQUV0QixXQUFLLEtBQUwsR0FGc0I7Ozs7Ozs7Ozs7Ozt3QkFXcEIsTUFBTTtBQUNSLFVBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQVIsQ0FERTtBQUVSLFVBQUksTUFBTSxLQUFLLElBQUwsQ0FGRjs7QUFJUixZQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQ7ZUFBVSxNQUFNLElBQUksSUFBSixDQUFOO09BQVYsQ0FBZCxDQUpROztBQU1SLGFBQU8sR0FBUCxDQU5ROzs7U0EzRE47OztBQXFFTix5QkFBZSxRQUFmLENBQXdCLFVBQXhCLEVBQW9DLFlBQXBDOztrQkFFZSIsImZpbGUiOiJTaGFyZWRDb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5pbXBvcnQgU2VydmljZSBmcm9tICcuLi9jb3JlL1NlcnZpY2UnO1xuaW1wb3J0IGNsaWVudCBmcm9tICcuLi9jb3JlL2NsaWVudCc7XG5cblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOnNoYXJlZC1jb25maWcnO1xuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgY2xpZW50IGAnc2hhcmVkLWNvbmZpZydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byBzaGFyZSBwYXJ0cyBvZiB0aGUgc2VydmVyIGNvbmZpZ3VyYXRpb24gdG8gdGhlIGNsaWVudHMuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLlNoYXJlZENvbmZpZ30qX19cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLml0ZW1zIC0gTGlzdCBvZiB0aGUgY29uZmlndXJhdGlvbiBpdGVtc1xuICogIHJlcXVpcmVkIGJ5IHRoZSBzZXJ2ZXIuIFRoZSBnaXZlbiBzdHJpbmdzIGZvbGxvdyBhIGNvbnZlbnRpb24gZGVmaW5pbmcgYSBwYXRoXG4gKiAgdG8gdGhlIHJlcXVpcmVkIGNvbmZpZ3VyYXRpb24gaXRlbSwgZm9yIGV4YW1wbGUgYCdzZXR1cC5hcmVhJ2Agd2lsbCByZXRyaWV2ZVxuICogIHRoZSB2YWx1ZSAoaGVyZSBhbiBvYmplY3QpIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGBhcmVhYCBrZXkgaW5zaWRlIHRoZSBgc2V0dXBgXG4gKiAgZW50cnkgb2YgdGhlIHNlcnZlciBjb25maWd1cmF0aW9uLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMuc2hhcmVkQ29uZmlnID0gdGhpcy5yZXF1aXJlKCdzaGFyZWQtY29uZmlnJywgeyBpdGVtczogWydzZXR1cC5hcmVhJ10gfSk7XG4gKiAvLyB3aGVuIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkXG4gKiBjb25zdCBhcmVhV2lkdGggPSB0aGlzLnNoYXJlZENvbmZpZy5nZXQoJ3NldHVwLmFyZWEud2lkdGgnKTtcbiAqL1xuY2xhc3MgU2hhcmVkQ29uZmlnIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICAvKipcbiAgICAgKiBDb25maWd1cmF0aW9uIGl0ZW1zIHJlcXVpcmVkIGJ5IHRoZSBjbGllbnQuXG4gICAgICogQHR5cGUge0FycmF5fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5faXRlbXMgPSBbXTtcblxuICAgIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5pdGVtcykge1xuICAgICAgdGhpcy5faXRlbXMgPSB0aGlzLl9pdGVtcy5jb25jYXQob3B0aW9ucy5pdGVtcyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5pdGVtcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgaW5pdCgpIHtcbiAgICAvKipcbiAgICAgKiBPYmplY3QgY29udGFpbmluZyBhbGwgdGhlIGNvbmZpZ3VyYXRpb24gaXRlbXMgc2hhcmVkIGJ5IHRoZSBzZXJ2ZXIuIFRoZVxuICAgICAqIG9iamVjdCBpcyBmbGF0dGVuZWQgaW4gb3JkZXIgdG8gbWluaW1pemUgdGhlIG5lZWRlZCBjb21tdW5pY2F0aW9ucyBiZXR3ZWVuXG4gICAgICogdGhlIGNsaWVudCBhbmQgdGhlIHNlcnZlci5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuZGF0YSA9IG51bGw7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIGlmICghdGhpcy5oYXNTdGFydGVkKVxuICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB0aGlzLnNlbmQoJ3JlcXVlc3QnLCB0aGlzLl9pdGVtcyk7XG4gICAgdGhpcy5yZWNlaXZlKCdjb25maWcnLCB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBfb25Db25maWdSZXNwb25zZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gY2xpZW50LmNvbmZpZyA9IGRhdGE7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHJpZXZlIGEgY29uZmlndXJhdGlvbiB2YWx1ZSBmcm9tIGl0cyBrZXkgaXRlbSwgYXMgZGVmaW5lZCBpbiBzZXJ2ZXIgc2lkZVxuICAgKiBzZXJ2aWNlJ3MgYGFkZEl0ZW1gIG1ldGhvZCBvciBpbiBjbGllbnQtc2lkZSBgaXRlbXNgIG9wdGlvbi5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGl0ZW0gLSBLZXkgdG8gdGhlIGNvbmZpZ3VyYXRpb24gaXRlbSAoX2V4Ol8gYCdzZXR1cC5hcmVhJ2ApXG4gICAqIEByZXR1cm4ge01peGVkfVxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdG1wID0gdGhpcy5kYXRhO1xuXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4gdG1wID0gdG1wW2F0dHJdKTtcblxuICAgIHJldHVybiB0bXA7XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgU2hhcmVkQ29uZmlnKTtcblxuZXhwb3J0IGRlZmF1bHQgU2hhcmVkQ29uZmlnO1xuIl19
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
 * This service allows to retrieve part of the server configuration to client.
 */

var SharedConfig = function (_Service) {
  (0, _inherits3.default)(SharedConfig, _Service);

  function SharedConfig() {
    (0, _classCallCheck3.default)(this, SharedConfig);


    /**
     * Configuration items required by the client.
     * @type {Array}
     */

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SharedConfig).call(this, SERVICE_ID, true));

    _this._items = [];

    _this._onConfigResponse = _this._onConfigResponse.bind(_this);
    return _this;
  }

  /** @inheritdoc */


  (0, _createClass3.default)(SharedConfig, [{
    key: 'configure',
    value: function configure(options) {
      if (options.items) {
        this._items = this._items.concat(options.items);
        delete options.items;
      }

      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedConfig.prototype), 'configure', this).call(this, options);
    }

    /** @inheritdoc */

  }, {
    key: 'init',
    value: function init() {
      this.data = null;
    }

    /** @inheritdoc */

  }, {
    key: 'start',
    value: function start() {
      (0, _get3.default)((0, _getPrototypeOf2.default)(SharedConfig.prototype), 'start', this).call(this);

      if (!this.hasStarted) this.init();

      this.send('request', this._items);
      this.receive('config', this._onConfigResponse);
    }

    /**
     * Retrieve a configuration value from its key item, as defined in server side
     * service's `addItem` method.
     * @param {String} item - The item of the configuration (ex: `'setup.area'`)
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
  }, {
    key: '_onConfigResponse',
    value: function _onConfigResponse(data) {
      this.data = _client2.default.config = data;
      this.ready();
    }
  }]);
  return SharedConfig;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, SharedConfig);

exports.default = SharedConfig;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNoYXJlZENvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUdBLElBQU0sYUFBYSx1QkFBYjs7Ozs7O0lBS0E7OztBQUNKLFdBREksWUFDSixHQUFjO3dDQURWLGNBQ1U7Ozs7Ozs7OzZGQURWLHlCQUVJLFlBQVksT0FETjs7QUFPWixVQUFLLE1BQUwsR0FBYyxFQUFkLENBUFk7O0FBU1osVUFBSyxpQkFBTCxHQUF5QixNQUFLLGlCQUFMLENBQXVCLElBQXZCLE9BQXpCLENBVFk7O0dBQWQ7Ozs7OzZCQURJOzs4QkFjTSxTQUFTO0FBQ2pCLFVBQUksUUFBUSxLQUFSLEVBQWU7QUFDakIsYUFBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixRQUFRLEtBQVIsQ0FBakMsQ0FEaUI7QUFFakIsZUFBTyxRQUFRLEtBQVIsQ0FGVTtPQUFuQjs7QUFLQSx1REFwQkUsdURBb0JjLFFBQWhCLENBTmlCOzs7Ozs7OzJCQVVaO0FBQ0wsV0FBSyxJQUFMLEdBQVksSUFBWixDQURLOzs7Ozs7OzRCQUtDO0FBQ04sdURBOUJFLGtEQThCRixDQURNOztBQUdOLFVBQUksQ0FBQyxLQUFLLFVBQUwsRUFDSCxLQUFLLElBQUwsR0FERjs7QUFHQSxXQUFLLElBQUwsQ0FBVSxTQUFWLEVBQXFCLEtBQUssTUFBTCxDQUFyQixDQU5NO0FBT04sV0FBSyxPQUFMLENBQWEsUUFBYixFQUF1QixLQUFLLGlCQUFMLENBQXZCLENBUE07Ozs7Ozs7Ozs7Ozt3QkFnQkosTUFBTTtBQUNSLFVBQU0sUUFBUSxLQUFLLEtBQUwsQ0FBVyxHQUFYLENBQVIsQ0FERTtBQUVSLFVBQUksTUFBTSxLQUFLLElBQUwsQ0FGRjs7QUFJUixZQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQ7ZUFBVSxNQUFNLElBQUksSUFBSixDQUFOO09BQVYsQ0FBZCxDQUpROztBQU1SLGFBQU8sR0FBUCxDQU5ROzs7O3NDQVNRLE1BQU07QUFDdEIsV0FBSyxJQUFMLEdBQVksaUJBQU8sTUFBUCxHQUFnQixJQUFoQixDQURVO0FBRXRCLFdBQUssS0FBTCxHQUZzQjs7O1NBdERwQjs7O0FBNEROLHlCQUFlLFFBQWYsQ0FBd0IsVUFBeEIsRUFBb0MsWUFBcEM7O2tCQUVlIiwiZmlsZSI6IlNoYXJlZENvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgY2xpZW50IGZyb20gJy4uL2NvcmUvY2xpZW50JztcblxuXG5jb25zdCBTRVJWSUNFX0lEID0gJ3NlcnZpY2U6c2hhcmVkLWNvbmZpZyc7XG5cbi8qKlxuICogVGhpcyBzZXJ2aWNlIGFsbG93cyB0byByZXRyaWV2ZSBwYXJ0IG9mIHRoZSBzZXJ2ZXIgY29uZmlndXJhdGlvbiB0byBjbGllbnQuXG4gKi9cbmNsYXNzIFNoYXJlZENvbmZpZyBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIC8qKlxuICAgICAqIENvbmZpZ3VyYXRpb24gaXRlbXMgcmVxdWlyZWQgYnkgdGhlIGNsaWVudC5cbiAgICAgKiBAdHlwZSB7QXJyYXl9XG4gICAgICovXG4gICAgdGhpcy5faXRlbXMgPSBbXTtcblxuICAgIHRoaXMuX29uQ29uZmlnUmVzcG9uc2UgPSB0aGlzLl9vbkNvbmZpZ1Jlc3BvbnNlLmJpbmQodGhpcyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgY29uZmlndXJlKG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5pdGVtcykge1xuICAgICAgdGhpcy5faXRlbXMgPSB0aGlzLl9pdGVtcy5jb25jYXQob3B0aW9ucy5pdGVtcyk7XG4gICAgICBkZWxldGUgb3B0aW9ucy5pdGVtcztcbiAgICB9XG5cbiAgICBzdXBlci5jb25maWd1cmUob3B0aW9ucyk7XG4gIH1cblxuICAvKiogQGluaGVyaXRkb2MgKi9cbiAgaW5pdCgpIHtcbiAgICB0aGlzLmRhdGEgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBpbmhlcml0ZG9jICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RhcnRlZClcbiAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgdGhpcy5zZW5kKCdyZXF1ZXN0JywgdGhpcy5faXRlbXMpO1xuICAgIHRoaXMucmVjZWl2ZSgnY29uZmlnJywgdGhpcy5fb25Db25maWdSZXNwb25zZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBjb25maWd1cmF0aW9uIHZhbHVlIGZyb20gaXRzIGtleSBpdGVtLCBhcyBkZWZpbmVkIGluIHNlcnZlciBzaWRlXG4gICAqIHNlcnZpY2UncyBgYWRkSXRlbWAgbWV0aG9kLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gaXRlbSAtIFRoZSBpdGVtIG9mIHRoZSBjb25maWd1cmF0aW9uIChleDogYCdzZXR1cC5hcmVhJ2ApXG4gICAqIEByZXR1cm4ge01peGVkfVxuICAgKi9cbiAgZ2V0KGl0ZW0pIHtcbiAgICBjb25zdCBwYXJ0cyA9IGl0ZW0uc3BsaXQoJy4nKTtcbiAgICBsZXQgdG1wID0gdGhpcy5kYXRhO1xuXG4gICAgcGFydHMuZm9yRWFjaCgoYXR0cikgPT4gdG1wID0gdG1wW2F0dHJdKTtcblxuICAgIHJldHVybiB0bXA7XG4gIH1cblxuICBfb25Db25maWdSZXNwb25zZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gY2xpZW50LmNvbmZpZyA9IGRhdGE7XG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIFNoYXJlZENvbmZpZyk7XG5cbmV4cG9ydCBkZWZhdWx0IFNoYXJlZENvbmZpZztcbiJdfQ==
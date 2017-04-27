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

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:network';

/**
 * Interface for the client `'network'` service.
 *
 * This service provides a generic way to create client to client communications
 * through websockets without server side custom code.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Network}*__
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.network = this.require('network');
 * // after the experience has started, listens to events
 * this.network.receive('my:channel', (...args) => {
 *   // do something with `args`
 * });
 * // somewhere in the experience
 * this.network.send('player', 'my:channel', 42, false);
 */

var Network = function (_Service) {
  (0, _inherits3.default)(Network, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */
  function Network() {
    (0, _classCallCheck3.default)(this, Network);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Network.__proto__ || (0, _getPrototypeOf2.default)(Network)).call(this, SERVICE_ID, true));

    var defaults = {};
    _this.configure(defaults);

    _this._listeners = {};
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Network, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)(Network.prototype.__proto__ || (0, _getPrototypeOf2.default)(Network.prototype), 'start', this).call(this);

      // common logic for receivers
      (0, _get3.default)(Network.prototype.__proto__ || (0, _getPrototypeOf2.default)(Network.prototype), 'receive', this).call(this, 'receive', function () {
        for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
          values[_key] = arguments[_key];
        }

        var channel = values.shift();
        var listeners = _this2._listeners[channel];

        if (Array.isArray(listeners)) listeners.forEach(function (callback) {
          return callback.apply(undefined, values);
        });
      });

      this.ready();
    }

    /**
     * Send a message to given client type(s).
     * @param {String|Array<String>} clientTypes - Client type(s) to send the
     *  message to.
     * @param {String} channel - Channel of the message.
     * @param {...Mixed} values - Values to send in the message.
     */

  }, {
    key: 'send',
    value: function send(clientTypes, channel) {
      for (var _len2 = arguments.length, values = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        values[_key2 - 2] = arguments[_key2];
      }

      values.unshift(clientTypes, channel);
      (0, _get3.default)(Network.prototype.__proto__ || (0, _getPrototypeOf2.default)(Network.prototype), 'send', this).call(this, 'send', values);
    }

    /**
     * Send a message to all the connected clients.
     * @param {String} channel - Channel of the message.
     * @param {...Mixed} values - Values to send in the message.
     */

  }, {
    key: 'broadcast',
    value: function broadcast(channel) {
      for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        values[_key3 - 1] = arguments[_key3];
      }

      values.unshift(channel);
      (0, _get3.default)(Network.prototype.__proto__ || (0, _getPrototypeOf2.default)(Network.prototype), 'send', this).call(this, 'broadcast', values);
    }

    /**
     * Register a callback to be executed when a message is received on a given
     * channel.
     * @param {String} channel - Channel to listen to.
     * @param {Function} callback - Function to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      if (!this._listeners[channel]) this._listeners[channel] = [];

      this._listeners[channel].push(callback);
    }

    /**
     * Remove a callback from listening a given channel.
     * @param {String} channel - Channel to stop listening to.
     * @param {Function} callback - The previously registered callback function.
     */

  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      var listeners = this._listeners[channel];

      if (Array.isArray(listeners)) {
        var index = listeners.indexOf(callback);

        if (index !== -1) listeners.splice(index, 1);
      }
    }
  }]);
  return Network;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Network);

exports.default = Network;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIk5ldHdvcmsiLCJkZWZhdWx0cyIsImNvbmZpZ3VyZSIsIl9saXN0ZW5lcnMiLCJ2YWx1ZXMiLCJjaGFubmVsIiwic2hpZnQiLCJsaXN0ZW5lcnMiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiY2FsbGJhY2siLCJyZWFkeSIsImNsaWVudFR5cGVzIiwidW5zaGlmdCIsInB1c2giLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxpQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJNQyxPOzs7QUFDSjtBQUNBLHFCQUFjO0FBQUE7O0FBQUEsd0lBQ05ELFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1FLFdBQVcsRUFBakI7QUFDQSxVQUFLQyxTQUFMLENBQWVELFFBQWY7O0FBRUEsVUFBS0UsVUFBTCxHQUFrQixFQUFsQjtBQU5ZO0FBT2I7O0FBRUQ7Ozs7OzRCQUNRO0FBQUE7O0FBQ047O0FBRUE7QUFDQSxzSUFBYyxTQUFkLEVBQXlCLFlBQWU7QUFBQSwwQ0FBWEMsTUFBVztBQUFYQSxnQkFBVztBQUFBOztBQUN0QyxZQUFNQyxVQUFVRCxPQUFPRSxLQUFQLEVBQWhCO0FBQ0EsWUFBTUMsWUFBWSxPQUFLSixVQUFMLENBQWdCRSxPQUFoQixDQUFsQjs7QUFFQSxZQUFJRyxNQUFNQyxPQUFOLENBQWNGLFNBQWQsQ0FBSixFQUNFQSxVQUFVRyxPQUFWLENBQWtCLFVBQUNDLFFBQUQ7QUFBQSxpQkFBY0EsMEJBQVlQLE1BQVosQ0FBZDtBQUFBLFNBQWxCO0FBQ0gsT0FORDs7QUFRQSxXQUFLUSxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7eUJBT0tDLFcsRUFBYVIsTyxFQUFvQjtBQUFBLHlDQUFSRCxNQUFRO0FBQVJBLGNBQVE7QUFBQTs7QUFDcENBLGFBQU9VLE9BQVAsQ0FBZUQsV0FBZixFQUE0QlIsT0FBNUI7QUFDQSxtSUFBVyxNQUFYLEVBQW1CRCxNQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs4QkFLVUMsTyxFQUFvQjtBQUFBLHlDQUFSRCxNQUFRO0FBQVJBLGNBQVE7QUFBQTs7QUFDNUJBLGFBQU9VLE9BQVAsQ0FBZVQsT0FBZjtBQUNBLG1JQUFXLFdBQVgsRUFBd0JELE1BQXhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs0QkFNUUMsTyxFQUFTTSxRLEVBQVU7QUFDekIsVUFBSSxDQUFDLEtBQUtSLFVBQUwsQ0FBZ0JFLE9BQWhCLENBQUwsRUFDRSxLQUFLRixVQUFMLENBQWdCRSxPQUFoQixJQUEyQixFQUEzQjs7QUFFRixXQUFLRixVQUFMLENBQWdCRSxPQUFoQixFQUF5QlUsSUFBekIsQ0FBOEJKLFFBQTlCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUtlTixPLEVBQVNNLFEsRUFBVTtBQUNoQyxVQUFNSixZQUFZLEtBQUtKLFVBQUwsQ0FBZ0JFLE9BQWhCLENBQWxCOztBQUVBLFVBQUlHLE1BQU1DLE9BQU4sQ0FBY0YsU0FBZCxDQUFKLEVBQThCO0FBQzVCLFlBQU1TLFFBQVFULFVBQVVVLE9BQVYsQ0FBa0JOLFFBQWxCLENBQWQ7O0FBRUEsWUFBSUssVUFBVSxDQUFDLENBQWYsRUFDRVQsVUFBVVcsTUFBVixDQUFpQkYsS0FBakIsRUFBd0IsQ0FBeEI7QUFDSDtBQUNGOzs7OztBQUdILHlCQUFlRyxRQUFmLENBQXdCcEIsVUFBeEIsRUFBb0NDLE9BQXBDOztrQkFFZUEsTyIsImZpbGUiOiJOZXR3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm5ldHdvcmsnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgdGhlIGNsaWVudCBgJ25ldHdvcmsnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhIGdlbmVyaWMgd2F5IHRvIGNyZWF0ZSBjbGllbnQgdG8gY2xpZW50IGNvbW11bmljYXRpb25zXG4gKiB0aHJvdWdoIHdlYnNvY2tldHMgd2l0aG91dCBzZXJ2ZXIgc2lkZSBjdXN0b20gY29kZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTmV0d29ya30qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLm5ldHdvcmsgPSB0aGlzLnJlcXVpcmUoJ25ldHdvcmsnKTtcbiAqIC8vIGFmdGVyIHRoZSBleHBlcmllbmNlIGhhcyBzdGFydGVkLCBsaXN0ZW5zIHRvIGV2ZW50c1xuICogdGhpcy5uZXR3b3JrLnJlY2VpdmUoJ215OmNoYW5uZWwnLCAoLi4uYXJncykgPT4ge1xuICogICAvLyBkbyBzb21ldGhpbmcgd2l0aCBgYXJnc2BcbiAqIH0pO1xuICogLy8gc29tZXdoZXJlIGluIHRoZSBleHBlcmllbmNlXG4gKiB0aGlzLm5ldHdvcmsuc2VuZCgncGxheWVyJywgJ215OmNoYW5uZWwnLCA0MiwgZmFsc2UpO1xuICovXG5jbGFzcyBOZXR3b3JrIGV4dGVuZHMgU2VydmljZSB7XG4gIC8qKiBfPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X19XQVJOSU5HX188L3NwYW4+IFRoaXMgY2xhc3Mgc2hvdWxkIG5ldmVyIGJlIGluc3RhbmNpYXRlZCBtYW51YWxseV8gKi9cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoU0VSVklDRV9JRCwgdHJ1ZSk7XG5cbiAgICBjb25zdCBkZWZhdWx0cyA9IHt9O1xuICAgIHRoaXMuY29uZmlndXJlKGRlZmF1bHRzKTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBjb21tb24gbG9naWMgZm9yIHJlY2VpdmVyc1xuICAgIHN1cGVyLnJlY2VpdmUoJ3JlY2VpdmUnLCAoLi4udmFsdWVzKSA9PiB7XG4gICAgICBjb25zdCBjaGFubmVsID0gdmFsdWVzLnNoaWZ0KCk7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF07XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVycykpXG4gICAgICAgIGxpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soLi4udmFsdWVzKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gZ2l2ZW4gY2xpZW50IHR5cGUocykuXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5PFN0cmluZz59IGNsaWVudFR5cGVzIC0gQ2xpZW50IHR5cGUocykgdG8gc2VuZCB0aGVcbiAgICogIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi5NaXhlZH0gdmFsdWVzIC0gVmFsdWVzIHRvIHNlbmQgaW4gdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBzZW5kKGNsaWVudFR5cGVzLCBjaGFubmVsLCAuLi52YWx1ZXMpIHtcbiAgICB2YWx1ZXMudW5zaGlmdChjbGllbnRUeXBlcywgY2hhbm5lbCk7XG4gICAgc3VwZXIuc2VuZCgnc2VuZCcsIHZhbHVlcyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gYWxsIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLk1peGVkfSB2YWx1ZXMgLSBWYWx1ZXMgdG8gc2VuZCBpbiB0aGUgbWVzc2FnZS5cbiAgICovXG4gIGJyb2FkY2FzdChjaGFubmVsLCAuLi52YWx1ZXMpIHtcbiAgICB2YWx1ZXMudW5zaGlmdChjaGFubmVsKTtcbiAgICBzdXBlci5zZW5kKCdicm9hZGNhc3QnLCB2YWx1ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQgb24gYSBnaXZlblxuICAgKiBjaGFubmVsLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgdG8gbGlzdGVuIHRvLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF0gPSBbXTtcblxuICAgIHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjYWxsYmFjayBmcm9tIGxpc3RlbmluZyBhIGdpdmVuIGNoYW5uZWwuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCB0byBzdG9wIGxpc3RlbmluZyB0by5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgcHJldmlvdXNseSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE5ldHdvcmspO1xuXG5leHBvcnQgZGVmYXVsdCBOZXR3b3JrO1xuIl19
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
 * Interface of the client `'network'` service.
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
 * // when the experience has started, listen for events
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

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Network).call(this, SERVICE_ID, true));

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

      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'start', this).call(this);

      // common logic for receivers
      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'receive', this).call(this, 'receive', function () {
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'send', this).call(this, 'send', values);
    }

    /**
     * Send a message to all connected clients.
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
      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'send', this).call(this, 'broadcast', values);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGlCQUFuQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXFCTSxPOzs7OztBQUVKLHFCQUFjO0FBQUE7O0FBQUEsaUhBQ04sVUFETSxFQUNNLElBRE47O0FBR1osUUFBTSxXQUFXLEVBQWpCO0FBQ0EsVUFBSyxTQUFMLENBQWUsUUFBZjs7QUFFQSxVQUFLLFVBQUwsR0FBa0IsRUFBbEI7QUFOWTtBQU9iOzs7Ozs7OzRCQUdPO0FBQUE7O0FBQ047OztBQUdBLHVHQUFjLFNBQWQsRUFBeUIsWUFBZTtBQUFBLDBDQUFYLE1BQVc7QUFBWCxnQkFBVztBQUFBOztBQUN0QyxZQUFNLFVBQVUsT0FBTyxLQUFQLEVBQWhCO0FBQ0EsWUFBTSxZQUFZLE9BQUssVUFBTCxDQUFnQixPQUFoQixDQUFsQjs7QUFFQSxZQUFJLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBSixFQUNFLFVBQVUsT0FBVixDQUFrQixVQUFDLFFBQUQ7QUFBQSxpQkFBYywwQkFBWSxNQUFaLENBQWQ7QUFBQSxTQUFsQjtBQUNILE9BTkQ7O0FBUUEsV0FBSyxLQUFMO0FBQ0Q7Ozs7Ozs7Ozs7Ozt5QkFTSSxXLEVBQWEsTyxFQUFvQjtBQUFBLHlDQUFSLE1BQVE7QUFBUixjQUFRO0FBQUE7O0FBQ3BDLGFBQU8sT0FBUCxDQUFlLFdBQWYsRUFBNEIsT0FBNUI7QUFDQSxvR0FBVyxNQUFYLEVBQW1CLE1BQW5CO0FBQ0Q7Ozs7Ozs7Ozs7OEJBT1MsTyxFQUFvQjtBQUFBLHlDQUFSLE1BQVE7QUFBUixjQUFRO0FBQUE7O0FBQzVCLGFBQU8sT0FBUCxDQUFlLE9BQWY7QUFDQSxvR0FBVyxXQUFYLEVBQXdCLE1BQXhCO0FBQ0Q7Ozs7Ozs7Ozs7OzRCQVFPLE8sRUFBUyxRLEVBQVU7QUFDekIsVUFBSSxDQUFDLEtBQUssVUFBTCxDQUFnQixPQUFoQixDQUFMLEVBQ0UsS0FBSyxVQUFMLENBQWdCLE9BQWhCLElBQTJCLEVBQTNCOztBQUVGLFdBQUssVUFBTCxDQUFnQixPQUFoQixFQUF5QixJQUF6QixDQUE4QixRQUE5QjtBQUNEOzs7Ozs7Ozs7O21DQU9jLE8sRUFBUyxRLEVBQVU7QUFDaEMsVUFBTSxZQUFZLEtBQUssVUFBTCxDQUFnQixPQUFoQixDQUFsQjs7QUFFQSxVQUFJLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBSixFQUE4QjtBQUM1QixZQUFNLFFBQVEsVUFBVSxPQUFWLENBQWtCLFFBQWxCLENBQWQ7O0FBRUEsWUFBSSxVQUFVLENBQUMsQ0FBZixFQUNFLFVBQVUsTUFBVixDQUFpQixLQUFqQixFQUF3QixDQUF4QjtBQUNIO0FBQ0Y7Ozs7O0FBR0gseUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxPQUFwQzs7a0JBRWUsTyIsImZpbGUiOiJOZXR3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm5ldHdvcmsnO1xuXG4vKipcbiAqIEludGVyZmFjZSBvZiB0aGUgY2xpZW50IGAnbmV0d29yaydgIHNlcnZpY2UuXG4gKlxuICogVGhpcyBzZXJ2aWNlIHByb3ZpZGVzIGEgZ2VuZXJpYyB3YXkgdG8gY3JlYXRlIGNsaWVudCB0byBjbGllbnQgY29tbXVuaWNhdGlvbnNcbiAqIHRocm91Z2ggd2Vic29ja2V0cyB3aXRob3V0IHNlcnZlciBzaWRlIGN1c3RvbSBjb2RlLlxuICpcbiAqIF9fKlRoZSBzZXJ2aWNlIG11c3QgYmUgdXNlZCB3aXRoIGl0cyBbc2VydmVyLXNpZGUgY291bnRlcnBhcnRde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5OZXR3b3JrfSpfX1xuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqIEBleGFtcGxlXG4gKiAvLyBpbnNpZGUgdGhlIGV4cGVyaWVuY2UgY29uc3RydWN0b3JcbiAqIHRoaXMubmV0d29yayA9IHRoaXMucmVxdWlyZSgnbmV0d29yaycpO1xuICogLy8gd2hlbiB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZCwgbGlzdGVuIGZvciBldmVudHNcbiAqIHRoaXMubmV0d29yay5yZWNlaXZlKCdteTpjaGFubmVsJywgKC4uLmFyZ3MpID0+IHtcbiAqICAgLy8gZG8gc29tZXRoaW5nIHdpdGggYGFyZ3NgXG4gKiB9KTtcbiAqIC8vIHNvbWV3aGVyZSBpbiB0aGUgZXhwZXJpZW5jZVxuICogdGhpcy5uZXR3b3JrLnNlbmQoJ3BsYXllcicsICdteTpjaGFubmVsJywgNDIsIGZhbHNlKTtcbiAqL1xuY2xhc3MgTmV0d29yayBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gY29tbW9uIGxvZ2ljIGZvciByZWNlaXZlcnNcbiAgICBzdXBlci5yZWNlaXZlKCdyZWNlaXZlJywgKC4uLnZhbHVlcykgPT4ge1xuICAgICAgY29uc3QgY2hhbm5lbCA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKVxuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKC4uLnZhbHVlcykpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIGdpdmVuIGNsaWVudCB0eXBlKHMpLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIENsaWVudCB0eXBlKHMpIHRvIHNlbmQgdGhlXG4gICAqICBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uTWl4ZWR9IHZhbHVlcyAtIFZhbHVlcyB0byBzZW5kIGluIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgc2VuZChjbGllbnRUeXBlcywgY2hhbm5lbCwgLi4udmFsdWVzKSB7XG4gICAgdmFsdWVzLnVuc2hpZnQoY2xpZW50VHlwZXMsIGNoYW5uZWwpO1xuICAgIHN1cGVyLnNlbmQoJ3NlbmQnLCB2YWx1ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIGFsbCBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLk1peGVkfSB2YWx1ZXMgLSBWYWx1ZXMgdG8gc2VuZCBpbiB0aGUgbWVzc2FnZS5cbiAgICovXG4gIGJyb2FkY2FzdChjaGFubmVsLCAuLi52YWx1ZXMpIHtcbiAgICB2YWx1ZXMudW5zaGlmdChjaGFubmVsKTtcbiAgICBzdXBlci5zZW5kKCdicm9hZGNhc3QnLCB2YWx1ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQgb24gYSBnaXZlblxuICAgKiBjaGFubmVsLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgdG8gbGlzdGVuIHRvLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF0gPSBbXTtcblxuICAgIHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjYWxsYmFjayBmcm9tIGxpc3RlbmluZyBhIGdpdmVuIGNoYW5uZWwuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCB0byBzdG9wIGxpc3RlbmluZyB0by5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgcHJldmlvdXNseSByZWdpc3RlcmVkIGNhbGxiYWNrIGZ1bmN0aW9uLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIE5ldHdvcmspO1xuXG5leHBvcnQgZGVmYXVsdCBOZXR3b3JrO1xuIl19
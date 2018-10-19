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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOlsiU0VSVklDRV9JRCIsIk5ldHdvcmsiLCJkZWZhdWx0cyIsImNvbmZpZ3VyZSIsIl9saXN0ZW5lcnMiLCJ2YWx1ZXMiLCJjaGFubmVsIiwic2hpZnQiLCJsaXN0ZW5lcnMiLCJBcnJheSIsImlzQXJyYXkiLCJmb3JFYWNoIiwiY2FsbGJhY2siLCJyZWFkeSIsImNsaWVudFR5cGVzIiwidW5zaGlmdCIsInB1c2giLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJTZXJ2aWNlIiwic2VydmljZU1hbmFnZXIiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxpQkFBbkI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBbUJNQyxPOzs7QUFDSjtBQUNBLHFCQUFjO0FBQUE7O0FBQUEsd0lBQ05ELFVBRE0sRUFDTSxJQUROOztBQUdaLFFBQU1FLFdBQVcsRUFBakI7QUFDQSxVQUFLQyxTQUFMLENBQWVELFFBQWY7O0FBRUEsVUFBS0UsVUFBTCxHQUFrQixFQUFsQjtBQU5ZO0FBT2I7O0FBRUQ7Ozs7OzRCQUNRO0FBQUE7O0FBQ047O0FBRUE7QUFDQSxzSUFBYyxTQUFkLEVBQXlCLFlBQWU7QUFBQSwwQ0FBWEMsTUFBVztBQUFYQSxnQkFBVztBQUFBOztBQUN0QyxZQUFNQyxVQUFVRCxPQUFPRSxLQUFQLEVBQWhCO0FBQ0EsWUFBTUMsWUFBWSxPQUFLSixVQUFMLENBQWdCRSxPQUFoQixDQUFsQjs7QUFFQSxZQUFJRyxNQUFNQyxPQUFOLENBQWNGLFNBQWQsQ0FBSixFQUNFQSxVQUFVRyxPQUFWLENBQWtCLFVBQUNDLFFBQUQ7QUFBQSxpQkFBY0EsMEJBQVlQLE1BQVosQ0FBZDtBQUFBLFNBQWxCO0FBQ0gsT0FORDs7QUFRQSxXQUFLUSxLQUFMO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs7eUJBT0tDLFcsRUFBYVIsTyxFQUFvQjtBQUFBLHlDQUFSRCxNQUFRO0FBQVJBLGNBQVE7QUFBQTs7QUFDcENBLGFBQU9VLE9BQVAsQ0FBZUQsV0FBZixFQUE0QlIsT0FBNUI7QUFDQSxtSUFBVyxNQUFYLEVBQW1CRCxNQUFuQjtBQUNEOztBQUVEOzs7Ozs7Ozs4QkFLVUMsTyxFQUFvQjtBQUFBLHlDQUFSRCxNQUFRO0FBQVJBLGNBQVE7QUFBQTs7QUFDNUJBLGFBQU9VLE9BQVAsQ0FBZVQsT0FBZjtBQUNBLG1JQUFXLFdBQVgsRUFBd0JELE1BQXhCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozs0QkFNUUMsTyxFQUFTTSxRLEVBQVU7QUFDekIsVUFBSSxDQUFDLEtBQUtSLFVBQUwsQ0FBZ0JFLE9BQWhCLENBQUwsRUFDRSxLQUFLRixVQUFMLENBQWdCRSxPQUFoQixJQUEyQixFQUEzQjs7QUFFRixXQUFLRixVQUFMLENBQWdCRSxPQUFoQixFQUF5QlUsSUFBekIsQ0FBOEJKLFFBQTlCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7O21DQUtlTixPLEVBQVNNLFEsRUFBVTtBQUNoQyxVQUFNSixZQUFZLEtBQUtKLFVBQUwsQ0FBZ0JFLE9BQWhCLENBQWxCOztBQUVBLFVBQUlHLE1BQU1DLE9BQU4sQ0FBY0YsU0FBZCxDQUFKLEVBQThCO0FBQzVCLFlBQU1TLFFBQVFULFVBQVVVLE9BQVYsQ0FBa0JOLFFBQWxCLENBQWQ7O0FBRUEsWUFBSUssVUFBVSxDQUFDLENBQWYsRUFDRVQsVUFBVVcsTUFBVixDQUFpQkYsS0FBakIsRUFBd0IsQ0FBeEI7QUFDSDtBQUNGOzs7RUE1RW1CRyxpQjs7QUErRXRCQyx5QkFBZUMsUUFBZixDQUF3QnRCLFVBQXhCLEVBQW9DQyxPQUFwQzs7a0JBRWVBLE8iLCJmaWxlIjoiTmV0d29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpuZXR3b3JrJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIHRoZSBjbGllbnQgYCduZXR3b3JrJ2Agc2VydmljZS5cbiAqXG4gKiBUaGlzIHNlcnZpY2UgcHJvdmlkZXMgYSBnZW5lcmljIHdheSB0byBjcmVhdGUgY2xpZW50IHRvIGNsaWVudCBjb21tdW5pY2F0aW9uc1xuICogdGhyb3VnaCB3ZWJzb2NrZXRzIHdpdGhvdXQgc2VydmVyIHNpZGUgY3VzdG9tIGNvZGUuXG4gKlxuICogX18qVGhlIHNlcnZpY2UgbXVzdCBiZSB1c2VkIHdpdGggaXRzIFtzZXJ2ZXItc2lkZSBjb3VudGVycGFydF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLk5ldHdvcmt9Kl9fXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudFxuICogQGV4YW1wbGVcbiAqIC8vIGluc2lkZSB0aGUgZXhwZXJpZW5jZSBjb25zdHJ1Y3RvclxuICogdGhpcy5uZXR3b3JrID0gdGhpcy5yZXF1aXJlKCduZXR3b3JrJyk7XG4gKiAvLyBhZnRlciB0aGUgZXhwZXJpZW5jZSBoYXMgc3RhcnRlZCwgbGlzdGVucyB0byBldmVudHNcbiAqIHRoaXMubmV0d29yay5yZWNlaXZlKCdteTpjaGFubmVsJywgKC4uLmFyZ3MpID0+IHtcbiAqICAgLy8gZG8gc29tZXRoaW5nIHdpdGggYGFyZ3NgXG4gKiB9KTtcbiAqIC8vIHNvbWV3aGVyZSBpbiB0aGUgZXhwZXJpZW5jZVxuICogdGhpcy5uZXR3b3JrLnNlbmQoJ3BsYXllcicsICdteTpjaGFubmVsJywgNDIsIGZhbHNlKTtcbiAqL1xuY2xhc3MgTmV0d29yayBleHRlbmRzIFNlcnZpY2Uge1xuICAvKiogXzxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9fV0FSTklOR19fPC9zcGFuPiBUaGlzIGNsYXNzIHNob3VsZCBuZXZlciBiZSBpbnN0YW5jaWF0ZWQgbWFudWFsbHlfICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gY29tbW9uIGxvZ2ljIGZvciByZWNlaXZlcnNcbiAgICBzdXBlci5yZWNlaXZlKCdyZWNlaXZlJywgKC4uLnZhbHVlcykgPT4ge1xuICAgICAgY29uc3QgY2hhbm5lbCA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKVxuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKC4uLnZhbHVlcykpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIGdpdmVuIGNsaWVudCB0eXBlKHMpLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheTxTdHJpbmc+fSBjbGllbnRUeXBlcyAtIENsaWVudCB0eXBlKHMpIHRvIHNlbmQgdGhlXG4gICAqICBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uTWl4ZWR9IHZhbHVlcyAtIFZhbHVlcyB0byBzZW5kIGluIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgc2VuZChjbGllbnRUeXBlcywgY2hhbm5lbCwgLi4udmFsdWVzKSB7XG4gICAgdmFsdWVzLnVuc2hpZnQoY2xpZW50VHlwZXMsIGNoYW5uZWwpO1xuICAgIHN1cGVyLnNlbmQoJ3NlbmQnLCB2YWx1ZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmQgYSBtZXNzYWdlIHRvIGFsbCB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi5NaXhlZH0gdmFsdWVzIC0gVmFsdWVzIHRvIHNlbmQgaW4gdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBicm9hZGNhc3QoY2hhbm5lbCwgLi4udmFsdWVzKSB7XG4gICAgdmFsdWVzLnVuc2hpZnQoY2hhbm5lbCk7XG4gICAgc3VwZXIuc2VuZCgnYnJvYWRjYXN0JywgdmFsdWVzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhIGNhbGxiYWNrIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkIG9uIGEgZ2l2ZW5cbiAgICogY2hhbm5lbC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIHRvIGxpc3RlbiB0by5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBGdW5jdGlvbiB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdKVxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdID0gW107XG5cbiAgICB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF0ucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgY2FsbGJhY2sgZnJvbSBsaXN0ZW5pbmcgYSBnaXZlbiBjaGFubmVsLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgdG8gc3RvcCBsaXN0ZW5pbmcgdG8uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIHByZXZpb3VzbHkgcmVnaXN0ZXJlZCBjYWxsYmFjayBmdW5jdGlvbi5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobGlzdGVuZXJzKSkge1xuICAgICAgY29uc3QgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjayk7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBOZXR3b3JrKTtcblxuZXhwb3J0IGRlZmF1bHQgTmV0d29yaztcbiJdfQ==
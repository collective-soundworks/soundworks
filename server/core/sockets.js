'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  /**
   * Initialize the object which socket.io
   * @private
   */
  init: function init(httpServer, config) {
    this.io = new _socket2.default(httpServer, config);;
  },


  /**
   * Register the function to apply when a client of the given `clientType`
   * is connecting to the server
   * @param {Array} clientTypes - The different type of client, should be namespaced
   * @param {Function} callback
   * @private
   */
  onConnection: function onConnection(clientTypes, callback) {
    var _this = this;

    clientTypes.forEach(function (clientType) {
      _this.io.of(clientType).on('connection', function (socket) {
        callback(clientType, socket);
      });
    });
  },


  /**
   * Listen a WebSocket message.
   * @param {Client} client - The client that must listen to the message.
   * @param {String} channel - The channel of the message
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive: function receive(client, channel, callback) {
    client.socket.on(channel, callback);
  },


  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send: function send(client, channel) {
    var _client$socket;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_client$socket = client.socket).emit.apply(_client$socket, [channel].concat(args));
  },


  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If
   * not specified, the message is sent to all clients.
   *
   * @param {String|Array} clientType - The `clientType`(s) that must receive
   *  the message.
   * @param {module:soundworks/server.Client} excludeClient - Optionnal
   *  client to ignore when broadcasting the message, typically the client
   *  at the origin of the message.
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast: function broadcast(clientType, excludeClient, channel) {
    for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    var _this2 = this;

    if (!this.io) // @todo - remove that, fix server initialization order instead
      return;

    var namespaces = void 0;

    if (typeof clientType === 'string') namespaces = ['/' + clientType];else if (Array.isArray(clientType)) namespaces = clientType.map(function (type) {
      return '/' + type;
    });else namespaces = (0, _keys2.default)(this.io.nsps);

    if (excludeClient) {
      var index = namespaces.indexOf('/' + excludeClient.type);

      if (index !== -1) {
        var _excludeClient$socket;

        namespaces.splice(index, 1);
        (_excludeClient$socket = excludeClient.socket.broadcast).emit.apply(_excludeClient$socket, [channel].concat(args));
      }
    }

    namespaces.forEach(function (nsp) {
      var _io$of;

      return (_io$of = _this2.io.of(nsp)).emit.apply(_io$of, [channel].concat(args));
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldHMuanMiXSwibmFtZXMiOlsiaW5pdCIsImh0dHBTZXJ2ZXIiLCJjb25maWciLCJpbyIsIm9uQ29ubmVjdGlvbiIsImNsaWVudFR5cGVzIiwiY2FsbGJhY2siLCJmb3JFYWNoIiwiY2xpZW50VHlwZSIsIm9mIiwib24iLCJzb2NrZXQiLCJyZWNlaXZlIiwiY2xpZW50IiwiY2hhbm5lbCIsInNlbmQiLCJhcmdzIiwiZW1pdCIsImJyb2FkY2FzdCIsImV4Y2x1ZGVDbGllbnQiLCJuYW1lc3BhY2VzIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwidHlwZSIsIm5zcHMiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJuc3AiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O2tCQUVlO0FBQ2I7Ozs7QUFJQUEsTUFMYSxnQkFLUkMsVUFMUSxFQUtJQyxNQUxKLEVBS1k7QUFDdkIsU0FBS0MsRUFBTCxHQUFVLHFCQUFRRixVQUFSLEVBQW9CQyxNQUFwQixDQUFWLENBQXNDO0FBQ3ZDLEdBUFk7OztBQVNiOzs7Ozs7O0FBT0FFLGNBaEJhLHdCQWdCQUMsV0FoQkEsRUFnQmFDLFFBaEJiLEVBZ0J1QjtBQUFBOztBQUNsQ0QsZ0JBQVlFLE9BQVosQ0FBb0IsVUFBQ0MsVUFBRCxFQUFnQjtBQUNsQyxZQUFLTCxFQUFMLENBQVFNLEVBQVIsQ0FBV0QsVUFBWCxFQUF1QkUsRUFBdkIsQ0FBMEIsWUFBMUIsRUFBd0MsVUFBQ0MsTUFBRCxFQUFZO0FBQ2xETCxpQkFBU0UsVUFBVCxFQUFxQkcsTUFBckI7QUFDRCxPQUZEO0FBR0QsS0FKRDtBQUtELEdBdEJZOzs7QUF3QmI7Ozs7OztBQU1BQyxTQTlCYSxtQkE4QkxDLE1BOUJLLEVBOEJHQyxPQTlCSCxFQThCWVIsUUE5QlosRUE4QnNCO0FBQ2pDTyxXQUFPRixNQUFQLENBQWNELEVBQWQsQ0FBaUJJLE9BQWpCLEVBQTBCUixRQUExQjtBQUNELEdBaENZOzs7QUFrQ2I7Ozs7OztBQU1BUyxNQXhDYSxnQkF3Q1JGLE1BeENRLEVBd0NBQyxPQXhDQSxFQXdDa0I7QUFBQTs7QUFBQSxzQ0FBTkUsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQzdCLDZCQUFPTCxNQUFQLEVBQWNNLElBQWQsd0JBQW1CSCxPQUFuQixTQUErQkUsSUFBL0I7QUFDRCxHQTFDWTs7O0FBNENiOzs7Ozs7Ozs7Ozs7QUFZQUUsV0F4RGEscUJBd0RIVixVQXhERyxFQXdEU1csYUF4RFQsRUF3RHdCTCxPQXhEeEIsRUF3RDBDO0FBQUEsdUNBQU5FLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUFBOztBQUNyRCxRQUFJLENBQUMsS0FBS2IsRUFBVixFQUFjO0FBQ1o7O0FBRUYsUUFBSWlCLG1CQUFKOztBQUVBLFFBQUksT0FBT1osVUFBUCxLQUFzQixRQUExQixFQUNFWSxhQUFhLE9BQUtaLFVBQUwsQ0FBYixDQURGLEtBRUssSUFBSWEsTUFBTUMsT0FBTixDQUFjZCxVQUFkLENBQUosRUFDSFksYUFBYVosV0FBV2UsR0FBWCxDQUFlO0FBQUEsbUJBQVlDLElBQVo7QUFBQSxLQUFmLENBQWIsQ0FERyxLQUdISixhQUFhLG9CQUFZLEtBQUtqQixFQUFMLENBQVFzQixJQUFwQixDQUFiOztBQUVGLFFBQUlOLGFBQUosRUFBbUI7QUFDakIsVUFBTU8sUUFBUU4sV0FBV08sT0FBWCxDQUFtQixNQUFNUixjQUFjSyxJQUF2QyxDQUFkOztBQUVBLFVBQUlFLFVBQVUsQ0FBQyxDQUFmLEVBQWtCO0FBQUE7O0FBQ2hCTixtQkFBV1EsTUFBWCxDQUFrQkYsS0FBbEIsRUFBeUIsQ0FBekI7QUFDQSwrQ0FBY2YsTUFBZCxDQUFxQk8sU0FBckIsRUFBK0JELElBQS9CLCtCQUFvQ0gsT0FBcEMsU0FBZ0RFLElBQWhEO0FBQ0Q7QUFDRjs7QUFFREksZUFBV2IsT0FBWCxDQUFtQixVQUFDc0IsR0FBRDtBQUFBOztBQUFBLGFBQVMsaUJBQUsxQixFQUFMLENBQVFNLEVBQVIsQ0FBV29CLEdBQVgsR0FBZ0JaLElBQWhCLGdCQUFxQkgsT0FBckIsU0FBaUNFLElBQWpDLEVBQVQ7QUFBQSxLQUFuQjtBQUNEO0FBL0VZLEMiLCJmaWxlIjoic29ja2V0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBzaW8gZnJvbSAnc29ja2V0LmlvJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgb2JqZWN0IHdoaWNoIHNvY2tldC5pb1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW5pdChodHRwU2VydmVyLCBjb25maWcpIHtcbiAgICB0aGlzLmlvID0gbmV3IHNpbyhodHRwU2VydmVyLCBjb25maWcpOztcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXN0ZXIgdGhlIGZ1bmN0aW9uIHRvIGFwcGx5IHdoZW4gYSBjbGllbnQgb2YgdGhlIGdpdmVuIGBjbGllbnRUeXBlYFxuICAgKiBpcyBjb25uZWN0aW5nIHRvIHRoZSBzZXJ2ZXJcbiAgICogQHBhcmFtIHtBcnJheX0gY2xpZW50VHlwZXMgLSBUaGUgZGlmZmVyZW50IHR5cGUgb2YgY2xpZW50LCBzaG91bGQgYmUgbmFtZXNwYWNlZFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25Db25uZWN0aW9uKGNsaWVudFR5cGVzLCBjYWxsYmFjaykge1xuICAgIGNsaWVudFR5cGVzLmZvckVhY2goKGNsaWVudFR5cGUpID0+IHtcbiAgICAgIHRoaXMuaW8ub2YoY2xpZW50VHlwZSkub24oJ2Nvbm5lY3Rpb24nLCAoc29ja2V0KSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKGNsaWVudFR5cGUsIHNvY2tldCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LnNvY2tldC5vbihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNsaWVudC5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIGFsbCBjbGllbnQgb2YgZ2l2ZW4gYGNsaWVudFR5cGVgIG9yIGBjbGllbnRUeXBlYHMuIElmXG4gICAqIG5vdCBzcGVjaWZpZWQsIHRoZSBtZXNzYWdlIGlzIHNlbnQgdG8gYWxsIGNsaWVudHMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IG11c3QgcmVjZWl2ZVxuICAgKiAgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7bW9kdWxlOnNvdW5kd29ya3Mvc2VydmVyLkNsaWVudH0gZXhjbHVkZUNsaWVudCAtIE9wdGlvbm5hbFxuICAgKiAgY2xpZW50IHRvIGlnbm9yZSB3aGVuIGJyb2FkY2FzdGluZyB0aGUgbWVzc2FnZSwgdHlwaWNhbGx5IHRoZSBjbGllbnRcbiAgICogIGF0IHRoZSBvcmlnaW4gb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGlmICghdGhpcy5pbykgLy8gQHRvZG8gLSByZW1vdmUgdGhhdCwgZml4IHNlcnZlciBpbml0aWFsaXphdGlvbiBvcmRlciBpbnN0ZWFkXG4gICAgICByZXR1cm47XG5cbiAgICBsZXQgbmFtZXNwYWNlcztcblxuICAgIGlmICh0eXBlb2YgY2xpZW50VHlwZSA9PT0gJ3N0cmluZycpXG4gICAgICBuYW1lc3BhY2VzID0gW2AvJHtjbGllbnRUeXBlfWBdO1xuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY2xpZW50VHlwZSkpXG4gICAgICBuYW1lc3BhY2VzID0gY2xpZW50VHlwZS5tYXAodHlwZSA9PiBgLyR7dHlwZX1gKTtcbiAgICBlbHNlXG4gICAgICBuYW1lc3BhY2VzID0gT2JqZWN0LmtleXModGhpcy5pby5uc3BzKTtcblxuICAgIGlmIChleGNsdWRlQ2xpZW50KSB7XG4gICAgICBjb25zdCBpbmRleCA9IG5hbWVzcGFjZXMuaW5kZXhPZignLycgKyBleGNsdWRlQ2xpZW50LnR5cGUpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIG5hbWVzcGFjZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgZXhjbHVkZUNsaWVudC5zb2NrZXQuYnJvYWRjYXN0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmFtZXNwYWNlcy5mb3JFYWNoKChuc3ApID0+IHRoaXMuaW8ub2YobnNwKS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpKTtcbiAgfSxcbn07XG4iXX0=
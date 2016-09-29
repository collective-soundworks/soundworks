'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  /**
   * Initialize the object which socket.io
   * @private
   */
  initialize: function initialize(io) {
    this.io = io;
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
   * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
   * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast: function broadcast(clientType, excludeClient, channel) {
    for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    var _this = this;

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

      (_io$of = _this.io.of(nsp)).emit.apply(_io$of, [channel].concat(args));
    });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldHMuanMiXSwibmFtZXMiOlsiaW5pdGlhbGl6ZSIsImlvIiwicmVjZWl2ZSIsImNsaWVudCIsImNoYW5uZWwiLCJjYWxsYmFjayIsInNvY2tldCIsIm9uIiwic2VuZCIsImFyZ3MiLCJlbWl0IiwiYnJvYWRjYXN0IiwiY2xpZW50VHlwZSIsImV4Y2x1ZGVDbGllbnQiLCJuYW1lc3BhY2VzIiwiQXJyYXkiLCJpc0FycmF5IiwibWFwIiwidHlwZSIsIm5zcHMiLCJpbmRleCIsImluZGV4T2YiLCJzcGxpY2UiLCJmb3JFYWNoIiwibnNwIiwib2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztrQkFBZTtBQUNiOzs7O0FBSUFBLFlBTGEsc0JBS0ZDLEVBTEUsRUFLRTtBQUNiLFNBQUtBLEVBQUwsR0FBVUEsRUFBVjtBQUNELEdBUFk7OztBQVNiOzs7Ozs7QUFNQUMsU0FmYSxtQkFlTEMsTUFmSyxFQWVHQyxPQWZILEVBZVlDLFFBZlosRUFlc0I7QUFDakNGLFdBQU9HLE1BQVAsQ0FBY0MsRUFBZCxDQUFpQkgsT0FBakIsRUFBMEJDLFFBQTFCO0FBQ0QsR0FqQlk7OztBQW1CYjs7Ozs7O0FBTUFHLE1BekJhLGdCQXlCUkwsTUF6QlEsRUF5QkFDLE9BekJBLEVBeUJrQjtBQUFBOztBQUFBLHNDQUFOSyxJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFDN0IsNkJBQU9ILE1BQVAsRUFBY0ksSUFBZCx3QkFBbUJOLE9BQW5CLFNBQStCSyxJQUEvQjtBQUNELEdBM0JZOzs7QUE2QmI7Ozs7OztBQU1BRSxXQW5DYSxxQkFtQ0hDLFVBbkNHLEVBbUNTQyxhQW5DVCxFQW1Dd0JULE9BbkN4QixFQW1DMEM7QUFBQSx1Q0FBTkssSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQUE7O0FBQ3JELFFBQUlLLG1CQUFKOztBQUVBLFFBQUksT0FBT0YsVUFBUCxLQUFzQixRQUExQixFQUNFRSxhQUFhLE9BQUtGLFVBQUwsQ0FBYixDQURGLEtBRUssSUFBSUcsTUFBTUMsT0FBTixDQUFjSixVQUFkLENBQUosRUFDSEUsYUFBYUYsV0FBV0ssR0FBWCxDQUFlO0FBQUEsbUJBQVlDLElBQVo7QUFBQSxLQUFmLENBQWIsQ0FERyxLQUdISixhQUFhLG9CQUFZLEtBQUtiLEVBQUwsQ0FBUWtCLElBQXBCLENBQWI7O0FBRUYsUUFBSU4sYUFBSixFQUFtQjtBQUNqQixVQUFNTyxRQUFRTixXQUFXTyxPQUFYLENBQW1CLE1BQU1SLGNBQWNLLElBQXZDLENBQWQ7O0FBRUEsVUFBSUUsVUFBVSxDQUFDLENBQWYsRUFBa0I7QUFBQTs7QUFDaEJOLG1CQUFXUSxNQUFYLENBQWtCRixLQUFsQixFQUF5QixDQUF6QjtBQUNBLCtDQUFjZCxNQUFkLENBQXFCSyxTQUFyQixFQUErQkQsSUFBL0IsK0JBQW9DTixPQUFwQyxTQUFnREssSUFBaEQ7QUFDRDtBQUNGOztBQUVESyxlQUFXUyxPQUFYLENBQW1CLFVBQUNDLEdBQUQsRUFBUztBQUFBOztBQUMxQixzQkFBS3ZCLEVBQUwsQ0FBUXdCLEVBQVIsQ0FBV0QsR0FBWCxHQUFnQmQsSUFBaEIsZ0JBQXFCTixPQUFyQixTQUFpQ0ssSUFBakM7QUFDRCxLQUZEO0FBR0Q7QUF6RFksQyIsImZpbGUiOiJzb2NrZXRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgb2JqZWN0IHdoaWNoIHNvY2tldC5pb1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW5pdGlhbGl6ZShpbykge1xuICAgIHRoaXMuaW8gPSBpbztcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LnNvY2tldC5vbihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNsaWVudC5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIGFsbCBjbGllbnQgb2YgZ2l2ZW4gYGNsaWVudFR5cGVgIG9yIGBjbGllbnRUeXBlYHMuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBtZXNzYWdlIGlzIHNlbnQgdG8gYWxsIGNsaWVudHNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGNsaWVudFR5cGUgLSBUaGUgYGNsaWVudFR5cGVgKHMpIHRoYXQgbXVzdCByZWNlaXZlIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgbGV0IG5hbWVzcGFjZXM7XG5cbiAgICBpZiAodHlwZW9mIGNsaWVudFR5cGUgPT09ICdzdHJpbmcnKVxuICAgICAgbmFtZXNwYWNlcyA9IFtgLyR7Y2xpZW50VHlwZX1gXTtcbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNsaWVudFR5cGUpKVxuICAgICAgbmFtZXNwYWNlcyA9IGNsaWVudFR5cGUubWFwKHR5cGUgPT4gYC8ke3R5cGV9YCk7XG4gICAgZWxzZVxuICAgICAgbmFtZXNwYWNlcyA9IE9iamVjdC5rZXlzKHRoaXMuaW8ubnNwcyk7XG5cbiAgICBpZiAoZXhjbHVkZUNsaWVudCkge1xuICAgICAgY29uc3QgaW5kZXggPSBuYW1lc3BhY2VzLmluZGV4T2YoJy8nICsgZXhjbHVkZUNsaWVudC50eXBlKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGV4Y2x1ZGVDbGllbnQuc29ja2V0LmJyb2FkY2FzdC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hbWVzcGFjZXMuZm9yRWFjaCgobnNwKSA9PiB7XG4gICAgICB0aGlzLmlvLm9mKG5zcCkuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICB9KTtcbiAgfSxcbn07XG4iXX0=
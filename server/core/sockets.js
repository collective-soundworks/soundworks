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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQUFlOzs7Ozs7QUFLYixZQUxhLHNCQUtGLEVBTEUsRUFLRTtBQUNiLFNBQUssRUFBTCxHQUFVLEVBQVY7QUFDRCxHQVBZOzs7Ozs7Ozs7QUFlYixTQWZhLG1CQWVMLE1BZkssRUFlRyxPQWZILEVBZVksUUFmWixFQWVzQjtBQUNqQyxXQUFPLE1BQVAsQ0FBYyxFQUFkLENBQWlCLE9BQWpCLEVBQTBCLFFBQTFCO0FBQ0QsR0FqQlk7Ozs7Ozs7OztBQXlCYixNQXpCYSxnQkF5QlIsTUF6QlEsRUF5QkEsT0F6QkEsRUF5QmtCO0FBQUE7O0FBQUEsc0NBQU4sSUFBTTtBQUFOLFVBQU07QUFBQTs7QUFDN0IsNkJBQU8sTUFBUCxFQUFjLElBQWQsd0JBQW1CLE9BQW5CLFNBQStCLElBQS9CO0FBQ0QsR0EzQlk7Ozs7Ozs7OztBQW1DYixXQW5DYSxxQkFtQ0gsVUFuQ0csRUFtQ1MsYUFuQ1QsRUFtQ3dCLE9BbkN4QixFQW1DMEM7QUFBQSx1Q0FBTixJQUFNO0FBQU4sVUFBTTtBQUFBOztBQUFBOztBQUNyRCxRQUFJLG1CQUFKOztBQUVBLFFBQUksT0FBTyxVQUFQLEtBQXNCLFFBQTFCLEVBQ0UsYUFBYSxPQUFLLFVBQUwsQ0FBYixDQURGLEtBRUssSUFBSSxNQUFNLE9BQU4sQ0FBYyxVQUFkLENBQUosRUFDSCxhQUFhLFdBQVcsR0FBWCxDQUFlO0FBQUEsbUJBQVksSUFBWjtBQUFBLEtBQWYsQ0FBYixDQURHLEtBR0gsYUFBYSxvQkFBWSxLQUFLLEVBQUwsQ0FBUSxJQUFwQixDQUFiOztBQUVGLFFBQUksYUFBSixFQUFtQjtBQUNqQixVQUFNLFFBQVEsV0FBVyxPQUFYLENBQW1CLE1BQU0sY0FBYyxJQUF2QyxDQUFkOztBQUVBLFVBQUksVUFBVSxDQUFDLENBQWYsRUFBa0I7QUFBQTs7QUFDaEIsbUJBQVcsTUFBWCxDQUFrQixLQUFsQixFQUF5QixDQUF6QjtBQUNBLCtDQUFjLE1BQWQsQ0FBcUIsU0FBckIsRUFBK0IsSUFBL0IsK0JBQW9DLE9BQXBDLFNBQWdELElBQWhEO0FBQ0Q7QUFDRjs7QUFFRCxlQUFXLE9BQVgsQ0FBbUIsVUFBQyxHQUFELEVBQVM7QUFBQTs7QUFDMUIsc0JBQUssRUFBTCxDQUFRLEVBQVIsQ0FBVyxHQUFYLEdBQWdCLElBQWhCLGdCQUFxQixPQUFyQixTQUFpQyxJQUFqQztBQUNELEtBRkQ7QUFHRDtBQXpEWSxDIiwiZmlsZSI6InNvY2tldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBvYmplY3Qgd2hpY2ggc29ja2V0LmlvXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0aWFsaXplKGlvKSB7XG4gICAgdGhpcy5pbyA9IGlvO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjbGllbnQuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY2xpZW50LnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAgb3IgYGNsaWVudFR5cGVgcy4gSWYgbm90IHNwZWNpZmllZCwgdGhlIG1lc3NhZ2UgaXMgc2VudCB0byBhbGwgY2xpZW50c1xuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBsZXQgbmFtZXNwYWNlcztcblxuICAgIGlmICh0eXBlb2YgY2xpZW50VHlwZSA9PT0gJ3N0cmluZycpXG4gICAgICBuYW1lc3BhY2VzID0gW2AvJHtjbGllbnRUeXBlfWBdO1xuICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY2xpZW50VHlwZSkpXG4gICAgICBuYW1lc3BhY2VzID0gY2xpZW50VHlwZS5tYXAodHlwZSA9PiBgLyR7dHlwZX1gKTtcbiAgICBlbHNlXG4gICAgICBuYW1lc3BhY2VzID0gT2JqZWN0LmtleXModGhpcy5pby5uc3BzKTtcblxuICAgIGlmIChleGNsdWRlQ2xpZW50KSB7XG4gICAgICBjb25zdCBpbmRleCA9IG5hbWVzcGFjZXMuaW5kZXhPZignLycgKyBleGNsdWRlQ2xpZW50LnR5cGUpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIG5hbWVzcGFjZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgZXhjbHVkZUNsaWVudC5zb2NrZXQuYnJvYWRjYXN0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmFtZXNwYWNlcy5mb3JFYWNoKChuc3ApID0+IHtcbiAgICAgIHRoaXMuaW8ub2YobnNwKS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIH0pO1xuICB9LFxufTtcbiJdfQ==
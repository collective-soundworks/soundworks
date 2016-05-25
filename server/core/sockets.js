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

    if (typeof clientType === 'string') {
      namespaces = ['/' + clientType];
    } else if (Array.isArray(clientType)) {
      namespaces = clientType.map(function (type) {
        return '/' + type;
      });
    } else {
      namespaces = (0, _keys2.default)(this.io.nsps);
    }

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQUFlOzs7Ozs7QUFLYixZQUxhLHNCQUtGLEVBTEUsRUFLRTtBQUNiLFNBQUssRUFBTCxHQUFVLEVBQVY7QUFDRCxHQVBZOzs7Ozs7Ozs7QUFlYixTQWZhLG1CQWVMLE1BZkssRUFlRyxPQWZILEVBZVksUUFmWixFQWVzQjtBQUNqQyxXQUFPLE1BQVAsQ0FBYyxFQUFkLENBQWlCLE9BQWpCLEVBQTBCLFFBQTFCO0FBQ0QsR0FqQlk7Ozs7Ozs7OztBQXlCYixNQXpCYSxnQkF5QlIsTUF6QlEsRUF5QkEsT0F6QkEsRUF5QmtCO0FBQUE7O0FBQUEsc0NBQU4sSUFBTTtBQUFOLFVBQU07QUFBQTs7QUFDN0IsNkJBQU8sTUFBUCxFQUFjLElBQWQsd0JBQW1CLE9BQW5CLFNBQStCLElBQS9CO0FBQ0QsR0EzQlk7Ozs7Ozs7OztBQW1DYixXQW5DYSxxQkFtQ0gsVUFuQ0csRUFtQ1MsYUFuQ1QsRUFtQ3dCLE9BbkN4QixFQW1DMEM7QUFBQSx1Q0FBTixJQUFNO0FBQU4sVUFBTTtBQUFBOztBQUFBOztBQUNyRCxRQUFJLG1CQUFKOztBQUVBLFFBQUksT0FBTyxVQUFQLEtBQXNCLFFBQTFCLEVBQW9DO0FBQ2xDLG1CQUFhLE9BQUssVUFBTCxDQUFiO0FBQ0QsS0FGRCxNQUVPLElBQUksTUFBTSxPQUFOLENBQWMsVUFBZCxDQUFKLEVBQStCO0FBQ3BDLG1CQUFhLFdBQVcsR0FBWCxDQUFlO0FBQUEscUJBQVksSUFBWjtBQUFBLE9BQWYsQ0FBYjtBQUNELEtBRk0sTUFFQTtBQUNMLG1CQUFhLG9CQUFZLEtBQUssRUFBTCxDQUFRLElBQXBCLENBQWI7QUFDRDs7QUFFRCxRQUFJLGFBQUosRUFBbUI7QUFDakIsVUFBTSxRQUFRLFdBQVcsT0FBWCxDQUFtQixNQUFNLGNBQWMsSUFBdkMsQ0FBZDs7QUFFQSxVQUFJLFVBQVUsQ0FBQyxDQUFmLEVBQWtCO0FBQUE7O0FBQ2hCLG1CQUFXLE1BQVgsQ0FBa0IsS0FBbEIsRUFBeUIsQ0FBekI7QUFDQSwrQ0FBYyxNQUFkLENBQXFCLFNBQXJCLEVBQStCLElBQS9CLCtCQUFvQyxPQUFwQyxTQUFnRCxJQUFoRDtBQUNEO0FBQ0Y7O0FBRUQsZUFBVyxPQUFYLENBQW1CLFVBQUMsR0FBRCxFQUFTO0FBQUE7O0FBQzFCLHNCQUFLLEVBQUwsQ0FBUSxFQUFSLENBQVcsR0FBWCxHQUFnQixJQUFoQixnQkFBcUIsT0FBckIsU0FBaUMsSUFBakM7QUFDRCxLQUZEO0FBR0Q7QUExRFksQyIsImZpbGUiOiJzb2NrZXRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgb2JqZWN0IHdoaWNoIHNvY2tldC5pb1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaW5pdGlhbGl6ZShpbykge1xuICAgIHRoaXMuaW8gPSBpbztcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LnNvY2tldC5vbihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNsaWVudC5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIGFsbCBjbGllbnQgb2YgZ2l2ZW4gYGNsaWVudFR5cGVgIG9yIGBjbGllbnRUeXBlYHMuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBtZXNzYWdlIGlzIHNlbnQgdG8gYWxsIGNsaWVudHNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGNsaWVudFR5cGUgLSBUaGUgYGNsaWVudFR5cGVgKHMpIHRoYXQgbXVzdCByZWNlaXZlIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgbGV0IG5hbWVzcGFjZXM7XG5cbiAgICBpZiAodHlwZW9mIGNsaWVudFR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lc3BhY2VzID0gW2AvJHtjbGllbnRUeXBlfWBdO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjbGllbnRUeXBlKSkge1xuICAgICAgbmFtZXNwYWNlcyA9IGNsaWVudFR5cGUubWFwKHR5cGUgPT4gYC8ke3R5cGV9YCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVzcGFjZXMgPSBPYmplY3Qua2V5cyh0aGlzLmlvLm5zcHMpO1xuICAgIH1cblxuICAgIGlmIChleGNsdWRlQ2xpZW50KSB7XG4gICAgICBjb25zdCBpbmRleCA9IG5hbWVzcGFjZXMuaW5kZXhPZignLycgKyBleGNsdWRlQ2xpZW50LnR5cGUpO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIG5hbWVzcGFjZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgZXhjbHVkZUNsaWVudC5zb2NrZXQuYnJvYWRjYXN0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbmFtZXNwYWNlcy5mb3JFYWNoKChuc3ApID0+IHtcbiAgICAgIHRoaXMuaW8ub2YobnNwKS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIH0pO1xuICB9LFxufTtcbiJdfQ==
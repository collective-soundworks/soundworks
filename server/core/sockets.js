'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  /**
   * Initialize the module which socket.io
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2tCQUFlOzs7Ozs7QUFLYixrQ0FBVyxJQUFJO0FBQ2IsU0FBSyxFQUFMLEdBQVUsRUFBVixDQURhO0dBTEY7Ozs7Ozs7OztBQWViLDRCQUFRLFFBQVEsU0FBUyxVQUFVO0FBQ2pDLFdBQU8sTUFBUCxDQUFjLEVBQWQsQ0FBaUIsT0FBakIsRUFBMEIsUUFBMUIsRUFEaUM7R0FmdEI7Ozs7Ozs7OztBQXlCYixzQkFBSyxRQUFRLFNBQWtCOzs7c0NBQU47O0tBQU07O0FBQzdCLDZCQUFPLE1BQVAsRUFBYyxJQUFkLHdCQUFtQixnQkFBWSxLQUEvQixFQUQ2QjtHQXpCbEI7Ozs7Ozs7OztBQW1DYixnQ0FBVSxZQUFZLGVBQWUsU0FBa0I7dUNBQU47O0tBQU07Ozs7QUFDckQsUUFBSSxtQkFBSixDQURxRDs7QUFHckQsUUFBSSxPQUFPLFVBQVAsS0FBc0IsUUFBdEIsRUFBZ0M7QUFDbEMsbUJBQWEsT0FBSyxVQUFMLENBQWIsQ0FEa0M7S0FBcEMsTUFFTyxJQUFJLE1BQU0sT0FBTixDQUFjLFVBQWQsQ0FBSixFQUErQjtBQUNwQyxtQkFBYSxXQUFXLEdBQVgsQ0FBZTtxQkFBWTtPQUFaLENBQTVCLENBRG9DO0tBQS9CLE1BRUE7QUFDTCxtQkFBYSxvQkFBWSxLQUFLLEVBQUwsQ0FBUSxJQUFSLENBQXpCLENBREs7S0FGQTs7QUFNUCxRQUFJLGFBQUosRUFBbUI7QUFDakIsVUFBTSxRQUFRLFdBQVcsT0FBWCxDQUFtQixNQUFNLGNBQWMsSUFBZCxDQUFqQyxDQURXOztBQUdqQixVQUFJLFVBQVUsQ0FBQyxDQUFELEVBQUk7OztBQUNoQixtQkFBVyxNQUFYLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBRGdCO0FBRWhCLCtDQUFjLE1BQWQsQ0FBcUIsU0FBckIsRUFBK0IsSUFBL0IsK0JBQW9DLGdCQUFZLEtBQWhELEVBRmdCO09BQWxCO0tBSEY7O0FBU0EsZUFBVyxPQUFYLENBQW1CLFVBQUMsR0FBRCxFQUFTOzs7QUFDMUIsc0JBQUssRUFBTCxDQUFRLEVBQVIsQ0FBVyxHQUFYLEdBQWdCLElBQWhCLGdCQUFxQixnQkFBWSxLQUFqQyxFQUQwQjtLQUFULENBQW5CLENBcEJxRDtHQW5DMUMiLCJmaWxlIjoic29ja2V0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIG1vZHVsZSB3aGljaCBzb2NrZXQuaW9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGluaXRpYWxpemUoaW8pIHtcbiAgICB0aGlzLmlvID0gaW87XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5zb2NrZXQub24oY2hhbm5lbCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjbGllbnQuc29ja2V0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYCBvciBgY2xpZW50VHlwZWBzLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSBpcyBzZW50IHRvIGFsbCBjbGllbnRzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IG11c3QgcmVjZWl2ZSB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgZXhjbHVkZUNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGxldCBuYW1lc3BhY2VzO1xuXG4gICAgaWYgKHR5cGVvZiBjbGllbnRUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXNwYWNlcyA9IFtgLyR7Y2xpZW50VHlwZX1gXTtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoY2xpZW50VHlwZSkpIHtcbiAgICAgIG5hbWVzcGFjZXMgPSBjbGllbnRUeXBlLm1hcCh0eXBlID0+IGAvJHt0eXBlfWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gT2JqZWN0LmtleXModGhpcy5pby5uc3BzKTtcbiAgICB9XG5cbiAgICBpZiAoZXhjbHVkZUNsaWVudCkge1xuICAgICAgY29uc3QgaW5kZXggPSBuYW1lc3BhY2VzLmluZGV4T2YoJy8nICsgZXhjbHVkZUNsaWVudC50eXBlKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGV4Y2x1ZGVDbGllbnQuc29ja2V0LmJyb2FkY2FzdC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hbWVzcGFjZXMuZm9yRWFjaCgobnNwKSA9PiB7XG4gICAgICB0aGlzLmlvLm9mKG5zcCkuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICB9KTtcbiAgfSxcbn07XG4iXX0=
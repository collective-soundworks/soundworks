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
   * Stop listening to a message from the server.
   *
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(client, channel, callback) {
    client.socket.removeListener(channel, callback);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldHMuanMiXSwibmFtZXMiOlsiaW5pdCIsImh0dHBTZXJ2ZXIiLCJjb25maWciLCJpbyIsInNpbyIsIm9uQ29ubmVjdGlvbiIsImNsaWVudFR5cGVzIiwiY2FsbGJhY2siLCJmb3JFYWNoIiwiY2xpZW50VHlwZSIsIm9mIiwib24iLCJzb2NrZXQiLCJyZWNlaXZlIiwiY2xpZW50IiwiY2hhbm5lbCIsInNlbmQiLCJhcmdzIiwiZW1pdCIsInJlbW92ZUxpc3RlbmVyIiwiYnJvYWRjYXN0IiwiZXhjbHVkZUNsaWVudCIsIm5hbWVzcGFjZXMiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJ0eXBlIiwibnNwcyIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsIm5zcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7a0JBRWU7QUFDYjs7OztBQUlBQSxNQUxhLGdCQUtSQyxVQUxRLEVBS0lDLE1BTEosRUFLWTtBQUN2QixTQUFLQyxFQUFMLEdBQVUsSUFBSUMsZ0JBQUosQ0FBUUgsVUFBUixFQUFvQkMsTUFBcEIsQ0FBVixDQUFzQztBQUN2QyxHQVBZOzs7QUFTYjs7Ozs7OztBQU9BRyxjQWhCYSx3QkFnQkFDLFdBaEJBLEVBZ0JhQyxRQWhCYixFQWdCdUI7QUFBQTs7QUFDbENELGdCQUFZRSxPQUFaLENBQW9CLFVBQUNDLFVBQUQsRUFBZ0I7QUFDbEMsWUFBS04sRUFBTCxDQUFRTyxFQUFSLENBQVdELFVBQVgsRUFBdUJFLEVBQXZCLENBQTBCLFlBQTFCLEVBQXdDLFVBQUNDLE1BQUQsRUFBWTtBQUNsREwsaUJBQVNFLFVBQVQsRUFBcUJHLE1BQXJCO0FBQ0QsT0FGRDtBQUdELEtBSkQ7QUFLRCxHQXRCWTs7O0FBd0JiOzs7Ozs7QUFNQUMsU0E5QmEsbUJBOEJMQyxNQTlCSyxFQThCR0MsT0E5QkgsRUE4QllSLFFBOUJaLEVBOEJzQjtBQUNqQ08sV0FBT0YsTUFBUCxDQUFjRCxFQUFkLENBQWlCSSxPQUFqQixFQUEwQlIsUUFBMUI7QUFDRCxHQWhDWTs7O0FBa0NiOzs7Ozs7QUFNQVMsTUF4Q2EsZ0JBd0NSRixNQXhDUSxFQXdDQUMsT0F4Q0EsRUF3Q2tCO0FBQUE7O0FBQUEsc0NBQU5FLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUM3Qiw2QkFBT0wsTUFBUCxFQUFjTSxJQUFkLHdCQUFtQkgsT0FBbkIsU0FBK0JFLElBQS9CO0FBQ0QsR0ExQ1k7OztBQTZDYjs7Ozs7OztBQU9BRSxnQkFwRGEsMEJBb0RFTCxNQXBERixFQW9EVUMsT0FwRFYsRUFvRG1CUixRQXBEbkIsRUFvRDZCO0FBQ3hDTyxXQUFPRixNQUFQLENBQWNPLGNBQWQsQ0FBNkJKLE9BQTdCLEVBQXNDUixRQUF0QztBQUNELEdBdERZOzs7QUF3RGI7Ozs7Ozs7Ozs7OztBQVlBYSxXQXBFYSxxQkFvRUhYLFVBcEVHLEVBb0VTWSxhQXBFVCxFQW9Fd0JOLE9BcEV4QixFQW9FMEM7QUFBQSx1Q0FBTkUsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQUE7O0FBQ3JELFFBQUksQ0FBQyxLQUFLZCxFQUFWLEVBQWM7QUFDWjs7QUFFRixRQUFJbUIsbUJBQUo7O0FBRUEsUUFBSSxPQUFPYixVQUFQLEtBQXNCLFFBQTFCLEVBQ0VhLGFBQWEsT0FBS2IsVUFBTCxDQUFiLENBREYsS0FFSyxJQUFJYyxNQUFNQyxPQUFOLENBQWNmLFVBQWQsQ0FBSixFQUNIYSxhQUFhYixXQUFXZ0IsR0FBWCxDQUFlO0FBQUEsbUJBQVlDLElBQVo7QUFBQSxLQUFmLENBQWIsQ0FERyxLQUdISixhQUFhLG9CQUFZLEtBQUtuQixFQUFMLENBQVF3QixJQUFwQixDQUFiOztBQUVGLFFBQUlOLGFBQUosRUFBbUI7QUFDakIsVUFBTU8sUUFBUU4sV0FBV08sT0FBWCxDQUFtQixNQUFNUixjQUFjSyxJQUF2QyxDQUFkOztBQUVBLFVBQUlFLFVBQVUsQ0FBQyxDQUFmLEVBQWtCO0FBQUE7O0FBQ2hCTixtQkFBV1EsTUFBWCxDQUFrQkYsS0FBbEIsRUFBeUIsQ0FBekI7QUFDQSwrQ0FBY2hCLE1BQWQsQ0FBcUJRLFNBQXJCLEVBQStCRixJQUEvQiwrQkFBb0NILE9BQXBDLFNBQWdERSxJQUFoRDtBQUNEO0FBQ0Y7O0FBRURLLGVBQVdkLE9BQVgsQ0FBbUIsVUFBQ3VCLEdBQUQ7QUFBQTs7QUFBQSxhQUFTLGlCQUFLNUIsRUFBTCxDQUFRTyxFQUFSLENBQVdxQixHQUFYLEdBQWdCYixJQUFoQixnQkFBcUJILE9BQXJCLFNBQWlDRSxJQUFqQyxFQUFUO0FBQUEsS0FBbkI7QUFDRDtBQTNGWSxDIiwiZmlsZSI6InNvY2tldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc2lvIGZyb20gJ3NvY2tldC5pbyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIEluaXRpYWxpemUgdGhlIG9iamVjdCB3aGljaCBzb2NrZXQuaW9cbiAgICogQHByaXZhdGVcbiAgICovXG4gIGluaXQoaHR0cFNlcnZlciwgY29uZmlnKSB7XG4gICAgdGhpcy5pbyA9IG5ldyBzaW8oaHR0cFNlcnZlciwgY29uZmlnKTs7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIHRoZSBmdW5jdGlvbiB0byBhcHBseSB3aGVuIGEgY2xpZW50IG9mIHRoZSBnaXZlbiBgY2xpZW50VHlwZWBcbiAgICogaXMgY29ubmVjdGluZyB0byB0aGUgc2VydmVyXG4gICAqIEBwYXJhbSB7QXJyYXl9IGNsaWVudFR5cGVzIC0gVGhlIGRpZmZlcmVudCB0eXBlIG9mIGNsaWVudCwgc2hvdWxkIGJlIG5hbWVzcGFjZWRcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG9uQ29ubmVjdGlvbihjbGllbnRUeXBlcywgY2FsbGJhY2spIHtcbiAgICBjbGllbnRUeXBlcy5mb3JFYWNoKChjbGllbnRUeXBlKSA9PiB7XG4gICAgICB0aGlzLmlvLm9mKGNsaWVudFR5cGUpLm9uKCdjb25uZWN0aW9uJywgKHNvY2tldCkgPT4ge1xuICAgICAgICBjYWxsYmFjayhjbGllbnRUeXBlLCBzb2NrZXQpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5zb2NrZXQub24oY2hhbm5lbCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjbGllbnQuc29ja2V0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gIH0sXG5cblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LnNvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYCBvciBgY2xpZW50VHlwZWBzLiBJZlxuICAgKiBub3Qgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSBpcyBzZW50IHRvIGFsbCBjbGllbnRzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBtdXN0IHJlY2VpdmVcbiAgICogIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge21vZHVsZTpzb3VuZHdvcmtzL3NlcnZlci5DbGllbnR9IGV4Y2x1ZGVDbGllbnQgLSBPcHRpb25uYWxcbiAgICogIGNsaWVudCB0byBpZ25vcmUgd2hlbiBicm9hZGNhc3RpbmcgdGhlIG1lc3NhZ2UsIHR5cGljYWxseSB0aGUgY2xpZW50XG4gICAqICBhdCB0aGUgb3JpZ2luIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuaW8pIC8vIEB0b2RvIC0gcmVtb3ZlIHRoYXQsIGZpeCBzZXJ2ZXIgaW5pdGlhbGl6YXRpb24gb3JkZXIgaW5zdGVhZFxuICAgICAgcmV0dXJuO1xuXG4gICAgbGV0IG5hbWVzcGFjZXM7XG5cbiAgICBpZiAodHlwZW9mIGNsaWVudFR5cGUgPT09ICdzdHJpbmcnKVxuICAgICAgbmFtZXNwYWNlcyA9IFtgLyR7Y2xpZW50VHlwZX1gXTtcbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNsaWVudFR5cGUpKVxuICAgICAgbmFtZXNwYWNlcyA9IGNsaWVudFR5cGUubWFwKHR5cGUgPT4gYC8ke3R5cGV9YCk7XG4gICAgZWxzZVxuICAgICAgbmFtZXNwYWNlcyA9IE9iamVjdC5rZXlzKHRoaXMuaW8ubnNwcyk7XG5cbiAgICBpZiAoZXhjbHVkZUNsaWVudCkge1xuICAgICAgY29uc3QgaW5kZXggPSBuYW1lc3BhY2VzLmluZGV4T2YoJy8nICsgZXhjbHVkZUNsaWVudC50eXBlKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBuYW1lc3BhY2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIGV4Y2x1ZGVDbGllbnQuc29ja2V0LmJyb2FkY2FzdC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5hbWVzcGFjZXMuZm9yRWFjaCgobnNwKSA9PiB0aGlzLmlvLm9mKG5zcCkuZW1pdChjaGFubmVsLCAuLi5hcmdzKSk7XG4gIH0sXG59O1xuIl19
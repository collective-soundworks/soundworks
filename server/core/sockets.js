'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
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
    console.log(channel);
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

    var namespaces = undefined;

    if (typeof clientType === 'string') {
      namespaces = ['/' + clientType];
    } else if (Array.isArray(clientType)) {
      namespaces = clientType.map(function (type) {
        return '/' + type;
      });
    } else {
      namespaces = _Object$keys(this.io.nsps);
    }

    // console.log(excludeClient);
    if (excludeClient) {
      var index = namespaces.indexOf('/' + excludeClient.type);

      if (index !== -1) {
        var _excludeClient$socket$broadcast;

        namespaces.splice(index, 1);
        (_excludeClient$socket$broadcast = excludeClient.socket.broadcast).emit.apply(_excludeClient$socket$broadcast, [channel].concat(args));
      }
    }

    namespaces.forEach(function (nsp) {
      var _io$of;

      (_io$of = _this.io.of(nsp)).emit.apply(_io$of, [channel].concat(args));
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9zb2NrZXRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7cUJBQWU7Ozs7O0FBS2IsWUFBVSxFQUFBLG9CQUFDLEVBQUUsRUFBRTtBQUNiLFFBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0dBQ2Q7Ozs7Ozs7O0FBUUQsU0FBTyxFQUFBLGlCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFdBQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsVUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDOzs7Ozs7OztBQVFELE1BQUksRUFBQSxjQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7OztzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQzNCLHNCQUFBLE1BQU0sQ0FBQyxNQUFNLEVBQUMsSUFBSSxNQUFBLGtCQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUN0Qzs7Ozs7Ozs7QUFRRCxXQUFTLEVBQUEsbUJBQUMsVUFBVSxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQVc7dUNBQU4sSUFBSTtBQUFKLFVBQUk7Ozs7O0FBQ25ELFFBQUksVUFBVSxZQUFBLENBQUM7O0FBRWYsUUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQUU7QUFDbEMsZ0JBQVUsR0FBRyxPQUFLLFVBQVUsQ0FBRyxDQUFDO0tBQ2pDLE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3BDLGdCQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUk7cUJBQVEsSUFBSTtPQUFFLENBQUMsQ0FBQztLQUNqRCxNQUFNO0FBQ0wsZ0JBQVUsR0FBRyxhQUFZLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDeEM7OztBQUdELFFBQUksYUFBYSxFQUFFO0FBQ2pCLFVBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0QsVUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7OztBQUNoQixrQkFBVSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUIsMkNBQUEsYUFBYSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUMsSUFBSSxNQUFBLG1DQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztPQUN2RDtLQUNGOztBQUVELGNBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQyxHQUFHLEVBQUs7OztBQUMxQixnQkFBQSxNQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxNQUFBLFVBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO0tBQ3hDLENBQUMsQ0FBQztHQUNKO0NBQ0YiLCJmaWxlIjoic3JjL3NlcnZlci9jb3JlL3NvY2tldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBtb2R1bGUgd2hpY2ggc29ja2V0LmlvXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0aWFsaXplKGlvKSB7XG4gICAgdGhpcy5pbyA9IGlvO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zb2xlLmxvZyhjaGFubmVsKTtcbiAgICBjbGllbnQuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY2xpZW50LnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAgb3IgYGNsaWVudFR5cGVgcy4gSWYgbm90IHNwZWNpZmllZCwgdGhlIG1lc3NhZ2UgaXMgc2VudCB0byBhbGwgY2xpZW50c1xuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBsZXQgbmFtZXNwYWNlcztcblxuICAgIGlmICh0eXBlb2YgY2xpZW50VHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIG5hbWVzcGFjZXMgPSBbYC8ke2NsaWVudFR5cGV9YF07XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNsaWVudFR5cGUpKSB7XG4gICAgICBuYW1lc3BhY2VzID0gY2xpZW50VHlwZS5tYXAodHlwZSA9PiBgLyR7dHlwZX1gKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IE9iamVjdC5rZXlzKHRoaXMuaW8ubnNwcyk7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coZXhjbHVkZUNsaWVudCk7XG4gICAgaWYgKGV4Y2x1ZGVDbGllbnQpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gbmFtZXNwYWNlcy5pbmRleE9mKCcvJyArIGV4Y2x1ZGVDbGllbnQudHlwZSk7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbmFtZXNwYWNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBleGNsdWRlQ2xpZW50LnNvY2tldC5icm9hZGNhc3QuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuYW1lc3BhY2VzLmZvckVhY2goKG5zcCkgPT4ge1xuICAgICAgdGhpcy5pby5vZihuc3ApLmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgfSk7XG4gIH0sXG59O1xuIl19
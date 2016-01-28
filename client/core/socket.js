'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

exports['default'] = {
  /**
   * Store the instance of Socket.io Manager.
   */
  socket: null,

  /**
   * Is set to `true` when a `ClientActivity` is instanciated. Is checked by the `client` to initialize the connection or not.
   */
  required: false,

  /**
   * Initialize a namespaced connection with given transport options.
   * @param {String} namespace - Correspond to the `client.type` {@link client}.
   * @param {Object} options - Options of the socket.
   * @param {String} options.url - The url where the socket should connect.
   * @param {Array<String>} options.transports - The transports to use for the socket (cf. socket.io).
   */
  initialize: function initialize(namespace, options) {
    this.socket = (0, _socketIoClient2['default'])(options.url + '/' + namespace, {
      transports: options.transports
    });

    return this;
  },

  /**
   * Sends a WebSocket message to the server side socket.
   * @param {String} channel - The channel of the message.
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send: function send(channel) {
    var _socket;

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_socket = this.socket).emit.apply(_socket, [channel].concat(args));
  },

  sendVolatile: function sendVolatile(channel) {
    var _socket$volatile;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    (_socket$volatile = this.socket.volatile).emit.apply(_socket$volatile, [channel].concat(args));
  },

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive: function receive(channel, callback) {
    this.socket.removeListener(channel, callback);
    this.socket.on(channel, callback);
  },

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(channel, callback) {
    this.socket.removeListener(channel, callback);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29yZS9zb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OEJBQWUsa0JBQWtCOzs7O3FCQUVsQjs7OztBQUliLFFBQU0sRUFBRSxJQUFJOzs7OztBQUtaLFVBQVEsRUFBRSxLQUFLOzs7Ozs7Ozs7QUFTZixZQUFVLEVBQUEsb0JBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtBQUM3QixRQUFJLENBQUMsTUFBTSxHQUFHLGlDQUFNLE9BQU8sQ0FBQyxHQUFHLFNBQUksU0FBUyxFQUFJO0FBQzlDLGdCQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7S0FDL0IsQ0FBQyxDQUFDOztBQUVILFdBQU8sSUFBSSxDQUFDO0dBQ2I7Ozs7Ozs7QUFPRCxNQUFJLEVBQUEsY0FBQyxPQUFPLEVBQVc7OztzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQ25CLGVBQUEsSUFBSSxDQUFDLE1BQU0sRUFBQyxJQUFJLE1BQUEsV0FBQyxPQUFPLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDcEM7O0FBRUQsY0FBWSxFQUFBLHNCQUFDLE9BQU8sRUFBVzs7O3VDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDM0Isd0JBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUMsSUFBSSxNQUFBLG9CQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUM3Qzs7Ozs7OztBQU9ELFNBQU8sRUFBQSxpQkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3pCLFFBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5QyxRQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDbkM7Ozs7Ozs7QUFPRCxnQkFBYyxFQUFBLHdCQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDaEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQy9DO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9jb3JlL3NvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogU3RvcmUgdGhlIGluc3RhbmNlIG9mIFNvY2tldC5pbyBNYW5hZ2VyLlxuICAgKi9cbiAgc29ja2V0OiBudWxsLFxuXG4gIC8qKlxuICAgKiBJcyBzZXQgdG8gYHRydWVgIHdoZW4gYSBgQ2xpZW50QWN0aXZpdHlgIGlzIGluc3RhbmNpYXRlZC4gSXMgY2hlY2tlZCBieSB0aGUgYGNsaWVudGAgdG8gaW5pdGlhbGl6ZSB0aGUgY29ubmVjdGlvbiBvciBub3QuXG4gICAqL1xuICByZXF1aXJlZDogZmFsc2UsXG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgYSBuYW1lc3BhY2VkIGNvbm5lY3Rpb24gd2l0aCBnaXZlbiB0cmFuc3BvcnQgb3B0aW9ucy5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSAtIENvcnJlc3BvbmQgdG8gdGhlIGBjbGllbnQudHlwZWAge0BsaW5rIGNsaWVudH0uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkIGNvbm5lY3QuXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy50cmFuc3BvcnRzIC0gVGhlIHRyYW5zcG9ydHMgdG8gdXNlIGZvciB0aGUgc29ja2V0IChjZi4gc29ja2V0LmlvKS5cbiAgICovXG4gIGluaXRpYWxpemUobmFtZXNwYWNlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBpbyhgJHtvcHRpb25zLnVybH0vJHtuYW1lc3BhY2V9YCwge1xuICAgICAgdHJhbnNwb3J0czogb3B0aW9ucy50cmFuc3BvcnRzXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgdGhpcy5zb2NrZXQudm9sYXRpbGUuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIHRoaXMuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfSxcbn07XG4iXX0=
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

var log = (0, _debug2['default'])('soundworks:socket');

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
    var url = options.url + '/' + namespace;
    this.socket = (0, _socketIoClient2['default'])(url, {
      transports: options.transports
    });

    log('initialized - url: "' + url + '" - transports: ' + options.transports);
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
    log.apply(undefined, ['send - channel: "' + channel + '"'].concat(args));
  },

  sendVolatile: function sendVolatile(channel) {
    var _socket$volatile;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    (_socket$volatile = this.socket.volatile).emit.apply(_socket$volatile, [channel].concat(args));
    log.apply(undefined, ['sendVolatile - channel: "' + channel + '"'].concat(args));
  },

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive: function receive(channel, callback) {
    this.socket.removeListener(channel, callback);
    this.socket.on(channel, callback);
    log('receive listener - channel: "' + channel + '"');
  },

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(channel, callback) {
    this.socket.removeListener(channel, callback);
    log('remove listener - channel: "' + channel + '"');
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9tYXR1c3pld3NraS9kZXYvY29zaW1hL2xpYi9zb3VuZHdvcmtzL3NyYy9jbGllbnQvY29yZS9zb2NrZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBQWtCLE9BQU87Ozs7OEJBQ1Ysa0JBQWtCOzs7O0FBRWpDLElBQU0sR0FBRyxHQUFHLHdCQUFNLG1CQUFtQixDQUFDLENBQUM7O3FCQUV4Qjs7OztBQUliLFFBQU0sRUFBRSxJQUFJOzs7OztBQUtaLFVBQVEsRUFBRSxLQUFLOzs7Ozs7Ozs7QUFTZixZQUFVLEVBQUEsb0JBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtBQUM3QixRQUFNLEdBQUcsR0FBTSxPQUFPLENBQUMsR0FBRyxTQUFJLFNBQVMsQUFBRSxDQUFDO0FBQzFDLFFBQUksQ0FBQyxNQUFNLEdBQUcsaUNBQUcsR0FBRyxFQUFFO0FBQ3BCLGdCQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7S0FDL0IsQ0FBQyxDQUFDOztBQUVILE9BQUcsMEJBQXdCLEdBQUcsd0JBQW1CLE9BQU8sQ0FBQyxVQUFVLENBQUcsQ0FBQztBQUN2RSxXQUFPLElBQUksQ0FBQztHQUNiOzs7Ozs7O0FBT0QsTUFBSSxFQUFBLGNBQUMsT0FBTyxFQUFXOzs7c0NBQU4sSUFBSTtBQUFKLFVBQUk7OztBQUNuQixlQUFBLElBQUksQ0FBQyxNQUFNLEVBQUMsSUFBSSxNQUFBLFdBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO0FBQ25DLE9BQUcseUNBQXFCLE9BQU8sZUFBUSxJQUFJLEVBQUMsQ0FBQztHQUM5Qzs7QUFFRCxjQUFZLEVBQUEsc0JBQUMsT0FBTyxFQUFXOzs7dUNBQU4sSUFBSTtBQUFKLFVBQUk7OztBQUMzQix3QkFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBQyxJQUFJLE1BQUEsb0JBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO0FBQzVDLE9BQUcsaURBQTZCLE9BQU8sZUFBUSxJQUFJLEVBQUMsQ0FBQztHQUN0RDs7Ozs7OztBQU9ELFNBQU8sRUFBQSxpQkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3pCLFFBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5QyxRQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDbEMsT0FBRyxtQ0FBaUMsT0FBTyxPQUFJLENBQUM7R0FDakQ7Ozs7Ozs7QUFPRCxnQkFBYyxFQUFBLHdCQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDaEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLE9BQUcsa0NBQWdDLE9BQU8sT0FBSSxDQUFDO0dBQ2hEO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL21hdHVzemV3c2tpL2Rldi9jb3NpbWEvbGliL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9jb3JlL3NvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNvY2tldCcpO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgaW5zdGFuY2Ugb2YgU29ja2V0LmlvIE1hbmFnZXIuXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgd2hlbiBhIGBDbGllbnRBY3Rpdml0eWAgaXMgaW5zdGFuY2lhdGVkLiBJcyBjaGVja2VkIGJ5IHRoZSBgY2xpZW50YCB0byBpbml0aWFsaXplIHRoZSBjb25uZWN0aW9uIG9yIG5vdC5cbiAgICovXG4gIHJlcXVpcmVkOiBmYWxzZSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5hbWVzcGFjZWQgY29ubmVjdGlvbiB3aXRoIGdpdmVuIHRyYW5zcG9ydCBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlIC0gQ29ycmVzcG9uZCB0byB0aGUgYGNsaWVudC50eXBlYCB7QGxpbmsgY2xpZW50fS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLnRyYW5zcG9ydHMgLSBUaGUgdHJhbnNwb3J0cyB0byB1c2UgZm9yIHRoZSBzb2NrZXQgKGNmLiBzb2NrZXQuaW8pLlxuICAgKi9cbiAgaW5pdGlhbGl6ZShuYW1lc3BhY2UsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB1cmwgPSBgJHtvcHRpb25zLnVybH0vJHtuYW1lc3BhY2V9YDtcbiAgICB0aGlzLnNvY2tldCA9IGlvKHVybCwge1xuICAgICAgdHJhbnNwb3J0czogb3B0aW9ucy50cmFuc3BvcnRzXG4gICAgfSk7XG5cbiAgICBsb2coYGluaXRpYWxpemVkIC0gdXJsOiBcIiR7dXJsfVwiIC0gdHJhbnNwb3J0czogJHtvcHRpb25zLnRyYW5zcG9ydHN9YCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICBsb2coYHNlbmQgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImAsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgdGhpcy5zb2NrZXQudm9sYXRpbGUuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICBsb2coYHNlbmRWb2xhdGlsZSAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICB0aGlzLnNvY2tldC5vbihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgbG9nKGByZWNlaXZlIGxpc3RlbmVyIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBsb2coYHJlbW92ZSBsaXN0ZW5lciAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCk7XG4gIH0sXG59O1xuIl19
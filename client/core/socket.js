'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _socket2 = require('socket.io-client');

var _socket3 = _interopRequireDefault(_socket2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = (0, _debug2.default)('soundworks:socket');

var socket = {
  /**
   * Store the instance of Socket.io Manager.
   */
  socket: null,

  /**
   * Is set to `true` when a `Activity` is instanciated. Is checked by the `client` to initialize the connection or not.
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
    this.socket = (0, _socket3.default)(url, {
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

exports.default = socket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE1BQU0scUJBQU0sbUJBQU4sQ0FBTjs7QUFFTixJQUFNLFNBQVM7Ozs7QUFJYixVQUFRLElBQVI7Ozs7O0FBS0EsWUFBVSxLQUFWOzs7Ozs7Ozs7QUFTQSxrQ0FBVyxXQUFXLFNBQVM7QUFDN0IsUUFBTSxNQUFTLFFBQVEsR0FBUixTQUFlLFNBQXhCLENBRHVCO0FBRTdCLFNBQUssTUFBTCxHQUFjLHNCQUFHLEdBQUgsRUFBUTtBQUNwQixrQkFBWSxRQUFRLFVBQVI7S0FEQSxDQUFkLENBRjZCOztBQU03QixpQ0FBMkIsMkJBQXNCLFFBQVEsVUFBUixDQUFqRCxDQU42QjtBQU83QixXQUFPLElBQVAsQ0FQNkI7R0FsQmxCOzs7Ozs7OztBQWlDYixzQkFBSyxTQUFrQjs7O3NDQUFOOztLQUFNOztBQUNyQixvQkFBSyxNQUFMLEVBQVksSUFBWixpQkFBaUIsZ0JBQVksS0FBN0IsRUFEcUI7QUFFckIsZ0RBQXdCLHNCQUFlLEtBQXZDLEVBRnFCO0dBakNWO0FBc0NiLHNDQUFhLFNBQWtCOzs7dUNBQU47O0tBQU07O0FBQzdCLDZCQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQXFCLElBQXJCLDBCQUEwQixnQkFBWSxLQUF0QyxFQUQ2QjtBQUU3Qix3REFBZ0Msc0JBQWUsS0FBL0MsRUFGNkI7R0F0Q2xCOzs7Ozs7OztBQWdEYiw0QkFBUSxTQUFTLFVBQVU7QUFDekIsU0FBSyxNQUFMLENBQVksY0FBWixDQUEyQixPQUEzQixFQUFvQyxRQUFwQyxFQUR5QjtBQUV6QixTQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsT0FBZixFQUF3QixRQUF4QixFQUZ5QjtBQUd6QiwwQ0FBb0MsYUFBcEMsRUFIeUI7R0FoRGQ7Ozs7Ozs7O0FBMkRiLDBDQUFlLFNBQVMsVUFBVTtBQUNoQyxTQUFLLE1BQUwsQ0FBWSxjQUFaLENBQTJCLE9BQTNCLEVBQW9DLFFBQXBDLEVBRGdDO0FBRWhDLHlDQUFtQyxhQUFuQyxFQUZnQztHQTNEckI7Q0FBVDs7a0JBaUVTIiwiZmlsZSI6InNvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNvY2tldCcpO1xuXG5jb25zdCBzb2NrZXQgPSB7XG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgaW5zdGFuY2Ugb2YgU29ja2V0LmlvIE1hbmFnZXIuXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgd2hlbiBhIGBBY3Rpdml0eWAgaXMgaW5zdGFuY2lhdGVkLiBJcyBjaGVja2VkIGJ5IHRoZSBgY2xpZW50YCB0byBpbml0aWFsaXplIHRoZSBjb25uZWN0aW9uIG9yIG5vdC5cbiAgICovXG4gIHJlcXVpcmVkOiBmYWxzZSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5hbWVzcGFjZWQgY29ubmVjdGlvbiB3aXRoIGdpdmVuIHRyYW5zcG9ydCBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlIC0gQ29ycmVzcG9uZCB0byB0aGUgYGNsaWVudC50eXBlYCB7QGxpbmsgY2xpZW50fS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLnRyYW5zcG9ydHMgLSBUaGUgdHJhbnNwb3J0cyB0byB1c2UgZm9yIHRoZSBzb2NrZXQgKGNmLiBzb2NrZXQuaW8pLlxuICAgKi9cbiAgaW5pdGlhbGl6ZShuYW1lc3BhY2UsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB1cmwgPSBgJHtvcHRpb25zLnVybH0vJHtuYW1lc3BhY2V9YDtcbiAgICB0aGlzLnNvY2tldCA9IGlvKHVybCwge1xuICAgICAgdHJhbnNwb3J0czogb3B0aW9ucy50cmFuc3BvcnRzXG4gICAgfSk7XG5cbiAgICBsb2coYGluaXRpYWxpemVkIC0gdXJsOiBcIiR7dXJsfVwiIC0gdHJhbnNwb3J0czogJHtvcHRpb25zLnRyYW5zcG9ydHN9YCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgdGhpcy5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICBsb2coYHNlbmQgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImAsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgdGhpcy5zb2NrZXQudm9sYXRpbGUuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICBsb2coYHNlbmRWb2xhdGlsZSAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICB0aGlzLnNvY2tldC5vbihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgbG9nKGByZWNlaXZlIGxpc3RlbmVyIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBsb2coYHJlbW92ZSBsaXN0ZW5lciAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCk7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzb2NrZXQ7XG4iXX0=
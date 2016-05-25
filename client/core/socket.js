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

    this.socket = (0, _socket3.default)(url, { transports: options.transports });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE1BQU0scUJBQU0sbUJBQU4sQ0FBWjs7QUFFQSxJQUFNLFNBQVM7Ozs7QUFJYixVQUFRLElBSks7Ozs7O0FBU2IsWUFBVSxLQVRHOzs7Ozs7Ozs7QUFrQmIsWUFsQmEsc0JBa0JGLFNBbEJFLEVBa0JTLE9BbEJULEVBa0JrQjtBQUM3QixRQUFNLE1BQVMsUUFBUSxHQUFqQixTQUF3QixTQUE5Qjs7QUFFQSxTQUFLLE1BQUwsR0FBYyxzQkFBRyxHQUFILEVBQVEsRUFBRSxZQUFZLFFBQVEsVUFBdEIsRUFBUixDQUFkO0FBQ0EsaUNBQTJCLEdBQTNCLHdCQUFpRCxRQUFRLFVBQXpEOztBQUVBLFdBQU8sSUFBUDtBQUNELEdBekJZOzs7Ozs7OztBQWdDYixNQWhDYSxnQkFnQ1IsT0FoQ1EsRUFnQ1U7QUFBQTs7QUFBQSxzQ0FBTixJQUFNO0FBQU4sVUFBTTtBQUFBOztBQUNyQixvQkFBSyxNQUFMLEVBQVksSUFBWixpQkFBaUIsT0FBakIsU0FBNkIsSUFBN0I7QUFDQSxnREFBd0IsT0FBeEIsZUFBdUMsSUFBdkM7QUFDRCxHQW5DWTtBQXFDYixjQXJDYSx3QkFxQ0EsT0FyQ0EsRUFxQ2tCO0FBQUE7O0FBQUEsdUNBQU4sSUFBTTtBQUFOLFVBQU07QUFBQTs7QUFDN0IsNkJBQUssTUFBTCxDQUFZLFFBQVosRUFBcUIsSUFBckIsMEJBQTBCLE9BQTFCLFNBQXNDLElBQXRDO0FBQ0Esd0RBQWdDLE9BQWhDLGVBQStDLElBQS9DO0FBQ0QsR0F4Q1k7Ozs7Ozs7O0FBK0NiLFNBL0NhLG1CQStDTCxPQS9DSyxFQStDSSxRQS9DSixFQStDYztBQUN6QixTQUFLLE1BQUwsQ0FBWSxjQUFaLENBQTJCLE9BQTNCLEVBQW9DLFFBQXBDO0FBQ0EsU0FBSyxNQUFMLENBQVksRUFBWixDQUFlLE9BQWYsRUFBd0IsUUFBeEI7QUFDQSwwQ0FBb0MsT0FBcEM7QUFDRCxHQW5EWTs7Ozs7Ozs7QUEwRGIsZ0JBMURhLDBCQTBERSxPQTFERixFQTBEVyxRQTFEWCxFQTBEcUI7QUFDaEMsU0FBSyxNQUFMLENBQVksY0FBWixDQUEyQixPQUEzQixFQUFvQyxRQUFwQztBQUNBLHlDQUFtQyxPQUFuQztBQUNEO0FBN0RZLENBQWY7O2tCQWdFZSxNIiwiZmlsZSI6InNvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cbmNvbnN0IGxvZyA9IGRlYnVnKCdzb3VuZHdvcmtzOnNvY2tldCcpO1xuXG5jb25zdCBzb2NrZXQgPSB7XG4gIC8qKlxuICAgKiBTdG9yZSB0aGUgaW5zdGFuY2Ugb2YgU29ja2V0LmlvIE1hbmFnZXIuXG4gICAqL1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgLyoqXG4gICAqIElzIHNldCB0byBgdHJ1ZWAgd2hlbiBhIGBBY3Rpdml0eWAgaXMgaW5zdGFuY2lhdGVkLiBJcyBjaGVja2VkIGJ5IHRoZSBgY2xpZW50YCB0byBpbml0aWFsaXplIHRoZSBjb25uZWN0aW9uIG9yIG5vdC5cbiAgICovXG4gIHJlcXVpcmVkOiBmYWxzZSxcblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBhIG5hbWVzcGFjZWQgY29ubmVjdGlvbiB3aXRoIGdpdmVuIHRyYW5zcG9ydCBvcHRpb25zLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZXNwYWNlIC0gQ29ycmVzcG9uZCB0byB0aGUgYGNsaWVudC50eXBlYCB7QGxpbmsgY2xpZW50fS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPcHRpb25zIG9mIHRoZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBvcHRpb25zLnVybCAtIFRoZSB1cmwgd2hlcmUgdGhlIHNvY2tldCBzaG91bGQgY29ubmVjdC5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLnRyYW5zcG9ydHMgLSBUaGUgdHJhbnNwb3J0cyB0byB1c2UgZm9yIHRoZSBzb2NrZXQgKGNmLiBzb2NrZXQuaW8pLlxuICAgKi9cbiAgaW5pdGlhbGl6ZShuYW1lc3BhY2UsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB1cmwgPSBgJHtvcHRpb25zLnVybH0vJHtuYW1lc3BhY2V9YDtcblxuICAgIHRoaXMuc29ja2V0ID0gaW8odXJsLCB7IHRyYW5zcG9ydHM6IG9wdGlvbnMudHJhbnNwb3J0cyB9KTtcbiAgICBsb2coYGluaXRpYWxpemVkIC0gdXJsOiBcIiR7dXJsfVwiIC0gdHJhbnNwb3J0czogJHtvcHRpb25zLnRyYW5zcG9ydHN9YCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIGxvZyhgc2VuZCAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC52b2xhdGlsZS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIGxvZyhgc2VuZFZvbGF0aWxlIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIHRoaXMuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBsb2coYHJlY2VpdmUgbGlzdGVuZXIgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIGxvZyhgcmVtb3ZlIGxpc3RlbmVyIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNvY2tldDtcbiJdfQ==
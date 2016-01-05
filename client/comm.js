'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

exports['default'] = {
  socket: null,

  initialize: function initialize(clientType, options) {
    var socketUrl = options.socketUrl + '/' + clientType;

    this.socket = (0, _socketIoClient2['default'])(socketUrl, {
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

    // if (!this.socket) { return; }
    (_socket = this.socket).emit.apply(_socket, [channel].concat(args));
  },

  sendVolatile: function sendVolatile(channel) {
    var _socket$volatile;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    // if (!this.socket) { return; }
    (_socket$volatile = this.socket.volatile).emit.apply(_socket$volatile, [channel].concat(args));
  },

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive: function receive(channel, callback) {
    // if (!this.socket) { return; }
    this.socket.removeListener(channel, callback);
    this.socket.on(channel, callback);
  },

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(channel, callback) {
    // if (!this.socket) { return; }
    this.socket.removeListener(channel, callback);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs4QkFBZSxrQkFBa0I7Ozs7cUJBRWxCO0FBQ2IsUUFBTSxFQUFFLElBQUk7O0FBRVosWUFBVSxFQUFBLG9CQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDOUIsUUFBTSxTQUFTLEdBQU0sT0FBTyxDQUFDLFNBQVMsU0FBSSxVQUFVLEFBQUUsQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLE1BQU0sR0FBRyxpQ0FBRyxTQUFTLEVBQUU7QUFDMUIsZ0JBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtLQUMvQixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLENBQUM7R0FDYjs7Ozs7OztBQU9ELE1BQUksRUFBQSxjQUFDLE9BQU8sRUFBVzs7O3NDQUFOLElBQUk7QUFBSixVQUFJOzs7O0FBRW5CLGVBQUEsSUFBSSxDQUFDLE1BQU0sRUFBQyxJQUFJLE1BQUEsV0FBQyxPQUFPLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDcEM7O0FBRUQsY0FBWSxFQUFBLHNCQUFDLE9BQU8sRUFBVzs7O3VDQUFOLElBQUk7QUFBSixVQUFJOzs7O0FBRTNCLHdCQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFDLElBQUksTUFBQSxvQkFBQyxPQUFPLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDN0M7Ozs7Ozs7QUFPRCxTQUFPLEVBQUEsaUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFekIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLFFBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztHQUNuQzs7Ozs7OztBQU9ELGdCQUFjLEVBQUEsd0JBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTs7QUFFaEMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQy9DO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9jb21tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHNvY2tldDogbnVsbCxcblxuICBpbml0aWFsaXplKGNsaWVudFR5cGUsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBzb2NrZXRVcmwgPSBgJHtvcHRpb25zLnNvY2tldFVybH0vJHtjbGllbnRUeXBlfWA7XG5cbiAgICB0aGlzLnNvY2tldCA9IGlvKHNvY2tldFVybCwge1xuICAgICAgdHJhbnNwb3J0czogb3B0aW9ucy50cmFuc3BvcnRzLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgLy8gaWYgKCF0aGlzLnNvY2tldCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIHNlbmRWb2xhdGlsZShjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgLy8gaWYgKCF0aGlzLnNvY2tldCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnNvY2tldC52b2xhdGlsZS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICAvLyBpZiAoIXRoaXMuc29ja2V0KSB7IHJldHVybjsgfVxuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICB0aGlzLnNvY2tldC5vbihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICAvLyBpZiAoIXRoaXMuc29ja2V0KSB7IHJldHVybjsgfVxuICAgIHRoaXMuc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxufTtcbiJdfQ==
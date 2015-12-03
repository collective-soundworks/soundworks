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

    if (!this.socket) {
      return;
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_socket = this.socket).emit.apply(_socket, [channel].concat(args));
  },

  sendVolatile: function sendVolatile(channel) {
    var _socket$volatile;

    if (!this.socket) {
      return;
    }

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
    if (!this.socket) {
      return;
    }
    this.socket.removeListener(channel, callback);
    this.socket.on(channel, callback);
  },

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(channel, callback) {
    if (!this.socket) {
      return;
    }
    this.socket.removeListener(channel, callback);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs4QkFBZSxrQkFBa0I7Ozs7cUJBRWxCO0FBQ2IsUUFBTSxFQUFFLElBQUk7O0FBRVosWUFBVSxFQUFBLG9CQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDOUIsUUFBTSxTQUFTLEdBQU0sT0FBTyxDQUFDLFNBQVMsU0FBSSxVQUFVLEFBQUUsQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLE1BQU0sR0FBRyxpQ0FBRyxTQUFTLEVBQUU7QUFDMUIsZ0JBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtLQUMvQixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLENBQUM7R0FDYjs7Ozs7OztBQU9ELE1BQUksRUFBQSxjQUFDLE9BQU8sRUFBVzs7O0FBQ3JCLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsYUFBTztLQUFFOztzQ0FEZCxJQUFJO0FBQUosVUFBSTs7O0FBRW5CLGVBQUEsSUFBSSxDQUFDLE1BQU0sRUFBQyxJQUFJLE1BQUEsV0FBQyxPQUFPLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDcEM7O0FBRUQsY0FBWSxFQUFBLHNCQUFDLE9BQU8sRUFBVzs7O0FBQzdCLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsYUFBTztLQUFFOzt1Q0FETixJQUFJO0FBQUosVUFBSTs7O0FBRTNCLHdCQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFDLElBQUksTUFBQSxvQkFBQyxPQUFPLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDN0M7Ozs7Ozs7QUFPRCxTQUFPLEVBQUEsaUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QixRQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUFFLGFBQU87S0FBRTtBQUM3QixRQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDOUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ25DOzs7Ozs7O0FBT0QsZ0JBQWMsRUFBQSx3QkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2hDLFFBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQUUsYUFBTztLQUFFO0FBQzdCLFFBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztHQUMvQztDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvY29tbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBzb2NrZXQ6IG51bGwsXG5cbiAgaW5pdGlhbGl6ZShjbGllbnRUeXBlLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgc29ja2V0VXJsID0gYCR7b3B0aW9ucy5zb2NrZXRVcmx9LyR7Y2xpZW50VHlwZX1gO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBpbyhzb2NrZXRVcmwsIHtcbiAgICAgIHRyYW5zcG9ydHM6IG9wdGlvbnMudHJhbnNwb3J0cyxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGlmICghdGhpcy5zb2NrZXQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGlmICghdGhpcy5zb2NrZXQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5zb2NrZXQudm9sYXRpbGUuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLnNvY2tldCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnNvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgdGhpcy5zb2NrZXQub24oY2hhbm5lbCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLnNvY2tldCkgeyByZXR1cm47IH1cbiAgICB0aGlzLnNvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cbn07XG4iXX0=
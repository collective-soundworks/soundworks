'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _socketIoClient = require('socket.io-client');

var _socketIoClient2 = _interopRequireDefault(_socketIoClient);

exports['default'] = {
  _socket: null,

  initialize: function initialize(clientType, options) {
    var socketUrl = options.socketUrl + '/' + clientType;

    this._socket = (0, _socketIoClient2['default'])(socketUrl, {
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

    if (!this._socket) {
      return;
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_socket = this._socket).emit.apply(_socket, [channel].concat(args));
  },

  /**
   * Listen a WebSocket message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive: function receive(channel, callback) {
    if (!this._socket) {
      return;
    }
    this._socket.removeListener(channel, callback);
    this._socket.on(channel, callback);
  },

  /**
   * Stop listening to a message from the server.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(channel, callback) {
    if (!this._socket) {
      return;
    }
    this._socket.removeListener(channel, callback);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs4QkFBZSxrQkFBa0I7Ozs7cUJBRWxCO0FBQ2IsU0FBTyxFQUFFLElBQUk7O0FBRWIsWUFBVSxFQUFBLG9CQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDOUIsUUFBTSxTQUFTLEdBQU0sT0FBTyxDQUFDLFNBQVMsU0FBSSxVQUFVLEFBQUUsQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLE9BQU8sR0FBRyxpQ0FBRyxTQUFTLEVBQUU7QUFDM0IsZ0JBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtLQUMvQixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLENBQUM7R0FDYjs7Ozs7OztBQU9ELE1BQUksRUFBQSxjQUFDLE9BQU8sRUFBVzs7O0FBQ3JCLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQUUsYUFBTztLQUFFOztzQ0FEZixJQUFJO0FBQUosVUFBSTs7O0FBRW5CLGVBQUEsSUFBSSxDQUFDLE9BQU8sRUFBQyxJQUFJLE1BQUEsV0FBQyxPQUFPLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDckM7Ozs7Ozs7QUFPRCxTQUFPLEVBQUEsaUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUFFLGFBQU87S0FBRTtBQUM5QixRQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3BDOzs7Ozs7O0FBT0QsZ0JBQWMsRUFBQSx3QkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2hDLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQUUsYUFBTztLQUFFO0FBQzlCLFFBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztHQUNoRDtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvY29tbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBfc29ja2V0OiBudWxsLFxuXG4gIGluaXRpYWxpemUoY2xpZW50VHlwZSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHNvY2tldFVybCA9IGAke29wdGlvbnMuc29ja2V0VXJsfS8ke2NsaWVudFR5cGV9YDtcblxuICAgIHRoaXMuX3NvY2tldCA9IGlvKHNvY2tldFVybCwge1xuICAgICAgdHJhbnNwb3J0czogb3B0aW9ucy50cmFuc3BvcnRzLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIHNlcnZlciBzaWRlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQpIHsgcmV0dXJuOyB9XG4gICAgdGhpcy5fc29ja2V0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fc29ja2V0KSB7IHJldHVybjsgfVxuICAgIHRoaXMuX3NvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgdGhpcy5fc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvKipcbiAgICogU3RvcCBsaXN0ZW5pbmcgdG8gYSBtZXNzYWdlIGZyb20gdGhlIHNlcnZlci5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBjYW5jZWwuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fc29ja2V0KSB7IHJldHVybjsgfVxuICAgIHRoaXMuX3NvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cbn07XG4iXX0=
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvc29ja2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O3FCQUFrQixPQUFPOzs7OzhCQUNWLGtCQUFrQjs7OztBQUVqQyxJQUFNLEdBQUcsR0FBRyx3QkFBTSxtQkFBbUIsQ0FBQyxDQUFDOztxQkFFeEI7Ozs7QUFJYixRQUFNLEVBQUUsSUFBSTs7Ozs7QUFLWixVQUFRLEVBQUUsS0FBSzs7Ozs7Ozs7O0FBU2YsWUFBVSxFQUFBLG9CQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7QUFDN0IsUUFBTSxHQUFHLEdBQU0sT0FBTyxDQUFDLEdBQUcsU0FBSSxTQUFTLEFBQUUsQ0FBQztBQUMxQyxRQUFJLENBQUMsTUFBTSxHQUFHLGlDQUFHLEdBQUcsRUFBRTtBQUNwQixnQkFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO0tBQy9CLENBQUMsQ0FBQzs7QUFFSCxPQUFHLDBCQUF3QixHQUFHLHdCQUFtQixPQUFPLENBQUMsVUFBVSxDQUFHLENBQUM7QUFDdkUsV0FBTyxJQUFJLENBQUM7R0FDYjs7Ozs7OztBQU9ELE1BQUksRUFBQSxjQUFDLE9BQU8sRUFBVzs7O3NDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDbkIsZUFBQSxJQUFJLENBQUMsTUFBTSxFQUFDLElBQUksTUFBQSxXQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztBQUNuQyxPQUFHLHlDQUFxQixPQUFPLGVBQVEsSUFBSSxFQUFDLENBQUM7R0FDOUM7O0FBRUQsY0FBWSxFQUFBLHNCQUFDLE9BQU8sRUFBVzs7O3VDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDM0Isd0JBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUMsSUFBSSxNQUFBLG9CQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztBQUM1QyxPQUFHLGlEQUE2QixPQUFPLGVBQVEsSUFBSSxFQUFDLENBQUM7R0FDdEQ7Ozs7Ozs7QUFPRCxTQUFPLEVBQUEsaUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QixRQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDOUMsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2xDLE9BQUcsbUNBQWlDLE9BQU8sT0FBSSxDQUFDO0dBQ2pEOzs7Ozs7O0FBT0QsZ0JBQWMsRUFBQSx3QkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2hDLFFBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM5QyxPQUFHLGtDQUFnQyxPQUFPLE9BQUksQ0FBQztHQUNoRDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L2NvcmUvc29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c29ja2V0Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFN0b3JlIHRoZSBpbnN0YW5jZSBvZiBTb2NrZXQuaW8gTWFuYWdlci5cbiAgICovXG4gIHNvY2tldDogbnVsbCxcblxuICAvKipcbiAgICogSXMgc2V0IHRvIGB0cnVlYCB3aGVuIGEgYENsaWVudEFjdGl2aXR5YCBpcyBpbnN0YW5jaWF0ZWQuIElzIGNoZWNrZWQgYnkgdGhlIGBjbGllbnRgIHRvIGluaXRpYWxpemUgdGhlIGNvbm5lY3Rpb24gb3Igbm90LlxuICAgKi9cbiAgcmVxdWlyZWQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmFtZXNwYWNlZCBjb25uZWN0aW9uIHdpdGggZ2l2ZW4gdHJhbnNwb3J0IG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2UgLSBDb3JyZXNwb25kIHRvIHRoZSBgY2xpZW50LnR5cGVgIHtAbGluayBjbGllbnR9LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgb2YgdGhlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudXJsIC0gVGhlIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZCBjb25uZWN0LlxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMudHJhbnNwb3J0cyAtIFRoZSB0cmFuc3BvcnRzIHRvIHVzZSBmb3IgdGhlIHNvY2tldCAoY2YuIHNvY2tldC5pbykuXG4gICAqL1xuICBpbml0aWFsaXplKG5hbWVzcGFjZSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVybCA9IGAke29wdGlvbnMudXJsfS8ke25hbWVzcGFjZX1gO1xuICAgIHRoaXMuc29ja2V0ID0gaW8odXJsLCB7XG4gICAgICB0cmFuc3BvcnRzOiBvcHRpb25zLnRyYW5zcG9ydHNcbiAgICB9KTtcblxuICAgIGxvZyhgaW5pdGlhbGl6ZWQgLSB1cmw6IFwiJHt1cmx9XCIgLSB0cmFuc3BvcnRzOiAke29wdGlvbnMudHJhbnNwb3J0c31gKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIGxvZyhgc2VuZCAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC52b2xhdGlsZS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIGxvZyhgc2VuZFZvbGF0aWxlIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIHRoaXMuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBsb2coYHJlY2VpdmUgbGlzdGVuZXIgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIGxvZyhgcmVtb3ZlIGxpc3RlbmVyIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgKTtcbiAgfSxcbn07XG4iXX0=
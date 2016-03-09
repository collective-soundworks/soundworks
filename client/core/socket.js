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

exports.default = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7QUFFQSxJQUFNLE1BQU0scUJBQU0sbUJBQU4sQ0FBTjs7a0JBRVM7Ozs7QUFJYixVQUFRLElBQVI7Ozs7O0FBS0EsWUFBVSxLQUFWOzs7Ozs7Ozs7QUFTQSxrQ0FBVyxXQUFXLFNBQVM7QUFDN0IsUUFBTSxNQUFTLFFBQVEsR0FBUixTQUFlLFNBQXhCLENBRHVCO0FBRTdCLFNBQUssTUFBTCxHQUFjLHNCQUFHLEdBQUgsRUFBUTtBQUNwQixrQkFBWSxRQUFRLFVBQVI7S0FEQSxDQUFkLENBRjZCOztBQU03QixpQ0FBMkIsMkJBQXNCLFFBQVEsVUFBUixDQUFqRCxDQU42QjtBQU83QixXQUFPLElBQVAsQ0FQNkI7R0FsQmxCOzs7Ozs7OztBQWlDYixzQkFBSyxTQUFrQjs7O3NDQUFOOztLQUFNOztBQUNyQixvQkFBSyxNQUFMLEVBQVksSUFBWixpQkFBaUIsZ0JBQVksS0FBN0IsRUFEcUI7QUFFckIsZ0RBQXdCLHNCQUFlLEtBQXZDLEVBRnFCO0dBakNWO0FBc0NiLHNDQUFhLFNBQWtCOzs7dUNBQU47O0tBQU07O0FBQzdCLDZCQUFLLE1BQUwsQ0FBWSxRQUFaLEVBQXFCLElBQXJCLDBCQUEwQixnQkFBWSxLQUF0QyxFQUQ2QjtBQUU3Qix3REFBZ0Msc0JBQWUsS0FBL0MsRUFGNkI7R0F0Q2xCOzs7Ozs7OztBQWdEYiw0QkFBUSxTQUFTLFVBQVU7QUFDekIsU0FBSyxNQUFMLENBQVksY0FBWixDQUEyQixPQUEzQixFQUFvQyxRQUFwQyxFQUR5QjtBQUV6QixTQUFLLE1BQUwsQ0FBWSxFQUFaLENBQWUsT0FBZixFQUF3QixRQUF4QixFQUZ5QjtBQUd6QiwwQ0FBb0MsYUFBcEMsRUFIeUI7R0FoRGQ7Ozs7Ozs7O0FBMkRiLDBDQUFlLFNBQVMsVUFBVTtBQUNoQyxTQUFLLE1BQUwsQ0FBWSxjQUFaLENBQTJCLE9BQTNCLEVBQW9DLFFBQXBDLEVBRGdDO0FBRWhDLHlDQUFtQyxhQUFuQyxFQUZnQztHQTNEckIiLCJmaWxlIjoic29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c29ja2V0Jyk7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgLyoqXG4gICAqIFN0b3JlIHRoZSBpbnN0YW5jZSBvZiBTb2NrZXQuaW8gTWFuYWdlci5cbiAgICovXG4gIHNvY2tldDogbnVsbCxcblxuICAvKipcbiAgICogSXMgc2V0IHRvIGB0cnVlYCB3aGVuIGEgYENsaWVudEFjdGl2aXR5YCBpcyBpbnN0YW5jaWF0ZWQuIElzIGNoZWNrZWQgYnkgdGhlIGBjbGllbnRgIHRvIGluaXRpYWxpemUgdGhlIGNvbm5lY3Rpb24gb3Igbm90LlxuICAgKi9cbiAgcmVxdWlyZWQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmFtZXNwYWNlZCBjb25uZWN0aW9uIHdpdGggZ2l2ZW4gdHJhbnNwb3J0IG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2UgLSBDb3JyZXNwb25kIHRvIHRoZSBgY2xpZW50LnR5cGVgIHtAbGluayBjbGllbnR9LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgb2YgdGhlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudXJsIC0gVGhlIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZCBjb25uZWN0LlxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMudHJhbnNwb3J0cyAtIFRoZSB0cmFuc3BvcnRzIHRvIHVzZSBmb3IgdGhlIHNvY2tldCAoY2YuIHNvY2tldC5pbykuXG4gICAqL1xuICBpbml0aWFsaXplKG5hbWVzcGFjZSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVybCA9IGAke29wdGlvbnMudXJsfS8ke25hbWVzcGFjZX1gO1xuICAgIHRoaXMuc29ja2V0ID0gaW8odXJsLCB7XG4gICAgICB0cmFuc3BvcnRzOiBvcHRpb25zLnRyYW5zcG9ydHNcbiAgICB9KTtcblxuICAgIGxvZyhgaW5pdGlhbGl6ZWQgLSB1cmw6IFwiJHt1cmx9XCIgLSB0cmFuc3BvcnRzOiAke29wdGlvbnMudHJhbnNwb3J0c31gKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIGxvZyhgc2VuZCAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC52b2xhdGlsZS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIGxvZyhgc2VuZFZvbGF0aWxlIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIHRoaXMuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBsb2coYHJlY2VpdmUgbGlzdGVuZXIgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIGxvZyhgcmVtb3ZlIGxpc3RlbmVyIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgKTtcbiAgfSxcbn07XG4iXX0=
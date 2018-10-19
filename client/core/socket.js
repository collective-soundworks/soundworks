'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _set = require('babel-runtime/core-js/set');

var _set2 = _interopRequireDefault(_set);

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
   * Is set to `true` when a `Activity` that requires network is instanciated.
   * Is checked by the `client` to initialize the connection or not.
   */
  required: false,

  /**
   * Initialize a namespaced connection with given options.
   *
   * @param {String} namespace - Correspond to the `client.type` {@link client}.
   * @param {Object} options - Options of the socket.
   * @param {String} options.url - The url where the socket should connect.
   * @param {Array<String>} options.transports - The transports to use for the socket (cf. socket.io).
   * @param {Array<String>} options.path - Defines where socket should find the `socket.io` file.
   */
  init: function init(namespace, options) {
    this.socket = (0, _socket3.default)(options.url + '/' + namespace, {
      transports: options.transports,
      path: options.path
    });

    this.socket.on('error', function () {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console).error.apply(_console, ['error'].concat(args));
    });

    log('initialized\n          - url: ' + options.url + '/' + namespace + '\n          - transports: ' + options.transports + '\n          - path: ' + options.path + '\n    ');

    this._stateListeners = new _set2.default();
    this._state = null;

    this._listenSocketState();
  },


  /**
   * Listen to the different states of the socket.
   *
   * @param {Function} callback - The function to be called when the state
   *  of the socket changes, the given function is called with the name of the
   *  event as argument.
   * @see {http://socket.io/docs/client-api/#socket}
   */
  addStateListener: function addStateListener(callback) {
    this._stateListeners.add(callback);

    if (this._state !== null) callback(this._state);
  },
  _listenSocketState: function _listenSocketState() {
    var _this = this;

    // see: http://socket.io/docs/client-api/#socket
    ['connect', 'reconnect', 'disconnect', 'connect_error', 'reconnect_attempt', 'reconnecting', 'reconnect_error', 'reconnect_failed'].forEach(function (eventName) {
      _this.socket.on(eventName, function () {
        _this._state = eventName;
        _this._stateListeners.forEach(function (listener) {
          return listener(_this._state);
        });
        log('state - ' + _this._state);
      });
    });
  },


  /**
   * Sends a WebSocket message to the server side socket.
   *
   * @param {String} channel - The channel of the message.
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send: function send(channel) {
    var _socket;

    for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    (_socket = this.socket).emit.apply(_socket, [channel].concat(args));
    log.apply(undefined, ['send - channel: "' + channel + '"'].concat(args));
  },
  sendVolatile: function sendVolatile(channel) {
    var _socket$volatile;

    for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }

    (_socket$volatile = this.socket.volatile).emit.apply(_socket$volatile, [channel].concat(args));
    log.apply(undefined, ['sendVolatile - channel: "' + channel + '"'].concat(args));
  },


  /**
   * Listen a WebSocket message from the server.
   *
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
   *
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(channel, callback) {
    this.socket.removeListener(channel, callback);
    log('remove listener - channel: "' + channel + '"');
  }
};

exports.default = socket;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzb2NrZXQiLCJyZXF1aXJlZCIsImluaXQiLCJuYW1lc3BhY2UiLCJvcHRpb25zIiwidXJsIiwidHJhbnNwb3J0cyIsInBhdGgiLCJvbiIsImFyZ3MiLCJlcnJvciIsIl9zdGF0ZUxpc3RlbmVycyIsIl9zdGF0ZSIsIl9saXN0ZW5Tb2NrZXRTdGF0ZSIsImFkZFN0YXRlTGlzdGVuZXIiLCJjYWxsYmFjayIsImFkZCIsImZvckVhY2giLCJldmVudE5hbWUiLCJsaXN0ZW5lciIsInNlbmQiLCJjaGFubmVsIiwiZW1pdCIsInNlbmRWb2xhdGlsZSIsInZvbGF0aWxlIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxxQkFBTSxtQkFBTixDQUFaOztBQUVBLElBQU1DLFNBQVM7QUFDYjs7O0FBR0FBLFVBQVEsSUFKSzs7QUFNYjs7OztBQUlBQyxZQUFVLEtBVkc7O0FBWWI7Ozs7Ozs7OztBQVNBQyxNQXJCYSxnQkFxQlJDLFNBckJRLEVBcUJHQyxPQXJCSCxFQXFCWTtBQUN2QixTQUFLSixNQUFMLEdBQWMsc0JBQU9JLFFBQVFDLEdBQWYsU0FBc0JGLFNBQXRCLEVBQW1DO0FBQy9DRyxrQkFBWUYsUUFBUUUsVUFEMkI7QUFFL0NDLFlBQU1ILFFBQVFHO0FBRmlDLEtBQW5DLENBQWQ7O0FBS0EsU0FBS1AsTUFBTCxDQUFZUSxFQUFaLENBQWUsT0FBZixFQUF3QixZQUFhO0FBQUE7O0FBQUEsd0NBQVRDLElBQVM7QUFBVEEsWUFBUztBQUFBOztBQUNuQywyQkFBUUMsS0FBUixrQkFBYyxPQUFkLFNBQTBCRCxJQUExQjtBQUNELEtBRkQ7O0FBSUFWLDJDQUNlSyxRQUFRQyxHQUR2QixTQUM4QkYsU0FEOUIsa0NBRXNCQyxRQUFRRSxVQUY5Qiw0QkFHZ0JGLFFBQVFHLElBSHhCOztBQU1BLFNBQUtJLGVBQUwsR0FBdUIsbUJBQXZCO0FBQ0EsU0FBS0MsTUFBTCxHQUFjLElBQWQ7O0FBRUEsU0FBS0Msa0JBQUw7QUFDRCxHQXpDWTs7O0FBMkNiOzs7Ozs7OztBQVFBQyxrQkFuRGEsNEJBbURJQyxRQW5ESixFQW1EYztBQUN6QixTQUFLSixlQUFMLENBQXFCSyxHQUFyQixDQUF5QkQsUUFBekI7O0FBRUEsUUFBSSxLQUFLSCxNQUFMLEtBQWdCLElBQXBCLEVBQ0VHLFNBQVMsS0FBS0gsTUFBZDtBQUNILEdBeERZO0FBMERiQyxvQkExRGEsZ0NBMERRO0FBQUE7O0FBQ25CO0FBQ0EsS0FBRSxTQUFGLEVBQ0UsV0FERixFQUVFLFlBRkYsRUFHRSxlQUhGLEVBSUUsbUJBSkYsRUFLRSxjQUxGLEVBTUUsaUJBTkYsRUFPRSxrQkFQRixFQVFFSSxPQVJGLENBUVUsVUFBQ0MsU0FBRCxFQUFlO0FBQ3ZCLFlBQUtsQixNQUFMLENBQVlRLEVBQVosQ0FBZVUsU0FBZixFQUEwQixZQUFNO0FBQzlCLGNBQUtOLE1BQUwsR0FBY00sU0FBZDtBQUNBLGNBQUtQLGVBQUwsQ0FBcUJNLE9BQXJCLENBQTZCLFVBQUNFLFFBQUQ7QUFBQSxpQkFBY0EsU0FBUyxNQUFLUCxNQUFkLENBQWQ7QUFBQSxTQUE3QjtBQUNBYix5QkFBZSxNQUFLYSxNQUFwQjtBQUNELE9BSkQ7QUFLRCxLQWREO0FBZUQsR0EzRVk7OztBQTZFYjs7Ozs7O0FBTUFRLE1BbkZhLGdCQW1GUkMsT0FuRlEsRUFtRlU7QUFBQTs7QUFBQSx1Q0FBTlosSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQ3JCLG9CQUFLVCxNQUFMLEVBQVlzQixJQUFaLGlCQUFpQkQsT0FBakIsU0FBNkJaLElBQTdCO0FBQ0FWLGdEQUF3QnNCLE9BQXhCLGVBQXVDWixJQUF2QztBQUNELEdBdEZZO0FBd0ZiYyxjQXhGYSx3QkF3RkFGLE9BeEZBLEVBd0ZrQjtBQUFBOztBQUFBLHVDQUFOWixJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFDN0IsNkJBQUtULE1BQUwsQ0FBWXdCLFFBQVosRUFBcUJGLElBQXJCLDBCQUEwQkQsT0FBMUIsU0FBc0NaLElBQXRDO0FBQ0FWLHdEQUFnQ3NCLE9BQWhDLGVBQStDWixJQUEvQztBQUNELEdBM0ZZOzs7QUE2RmI7Ozs7OztBQU1BZ0IsU0FuR2EsbUJBbUdMSixPQW5HSyxFQW1HSU4sUUFuR0osRUFtR2M7QUFDekIsU0FBS2YsTUFBTCxDQUFZMEIsY0FBWixDQUEyQkwsT0FBM0IsRUFBb0NOLFFBQXBDO0FBQ0EsU0FBS2YsTUFBTCxDQUFZUSxFQUFaLENBQWVhLE9BQWYsRUFBd0JOLFFBQXhCO0FBQ0FoQiwwQ0FBb0NzQixPQUFwQztBQUNELEdBdkdZOzs7QUF5R2I7Ozs7OztBQU1BSyxnQkEvR2EsMEJBK0dFTCxPQS9HRixFQStHV04sUUEvR1gsRUErR3FCO0FBQ2hDLFNBQUtmLE1BQUwsQ0FBWTBCLGNBQVosQ0FBMkJMLE9BQTNCLEVBQW9DTixRQUFwQztBQUNBaEIseUNBQW1Dc0IsT0FBbkM7QUFDRDtBQWxIWSxDQUFmOztrQkFxSGVyQixNIiwiZmlsZSI6InNvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgc2lvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3Jrczpzb2NrZXQnKTtcblxuY29uc3Qgc29ja2V0ID0ge1xuICAvKipcbiAgICogU3RvcmUgdGhlIGluc3RhbmNlIG9mIFNvY2tldC5pbyBNYW5hZ2VyLlxuICAgKi9cbiAgc29ja2V0OiBudWxsLFxuXG4gIC8qKlxuICAgKiBJcyBzZXQgdG8gYHRydWVgIHdoZW4gYSBgQWN0aXZpdHlgIHRoYXQgcmVxdWlyZXMgbmV0d29yayBpcyBpbnN0YW5jaWF0ZWQuXG4gICAqIElzIGNoZWNrZWQgYnkgdGhlIGBjbGllbnRgIHRvIGluaXRpYWxpemUgdGhlIGNvbm5lY3Rpb24gb3Igbm90LlxuICAgKi9cbiAgcmVxdWlyZWQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmFtZXNwYWNlZCBjb25uZWN0aW9uIHdpdGggZ2l2ZW4gb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSAtIENvcnJlc3BvbmQgdG8gdGhlIGBjbGllbnQudHlwZWAge0BsaW5rIGNsaWVudH0uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkIGNvbm5lY3QuXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy50cmFuc3BvcnRzIC0gVGhlIHRyYW5zcG9ydHMgdG8gdXNlIGZvciB0aGUgc29ja2V0IChjZi4gc29ja2V0LmlvKS5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLnBhdGggLSBEZWZpbmVzIHdoZXJlIHNvY2tldCBzaG91bGQgZmluZCB0aGUgYHNvY2tldC5pb2AgZmlsZS5cbiAgICovXG4gIGluaXQobmFtZXNwYWNlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBzaW8oYCR7b3B0aW9ucy51cmx9LyR7bmFtZXNwYWNlfWAsIHtcbiAgICAgIHRyYW5zcG9ydHM6IG9wdGlvbnMudHJhbnNwb3J0cyxcbiAgICAgIHBhdGg6IG9wdGlvbnMucGF0aCxcbiAgICB9KTtcblxuICAgIHRoaXMuc29ja2V0Lm9uKCdlcnJvcicsICguLi5hcmdzKSA9PiB7XG4gICAgICBjb25zb2xlLmVycm9yKCdlcnJvcicsIC4uLmFyZ3MpO1xuICAgIH0pO1xuXG4gICAgbG9nKGBpbml0aWFsaXplZFxuICAgICAgICAgIC0gdXJsOiAke29wdGlvbnMudXJsfS8ke25hbWVzcGFjZX1cbiAgICAgICAgICAtIHRyYW5zcG9ydHM6ICR7b3B0aW9ucy50cmFuc3BvcnRzfVxuICAgICAgICAgIC0gcGF0aDogJHtvcHRpb25zLnBhdGh9XG4gICAgYCk7XG5cbiAgICB0aGlzLl9zdGF0ZUxpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9zdGF0ZSA9IG51bGw7XG5cbiAgICB0aGlzLl9saXN0ZW5Tb2NrZXRTdGF0ZSgpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gdG8gdGhlIGRpZmZlcmVudCBzdGF0ZXMgb2YgdGhlIHNvY2tldC5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHN0YXRlXG4gICAqICBvZiB0aGUgc29ja2V0IGNoYW5nZXMsIHRoZSBnaXZlbiBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCB0aGUgbmFtZSBvZiB0aGVcbiAgICogIGV2ZW50IGFzIGFyZ3VtZW50LlxuICAgKiBAc2VlIHtodHRwOi8vc29ja2V0LmlvL2RvY3MvY2xpZW50LWFwaS8jc29ja2V0fVxuICAgKi9cbiAgYWRkU3RhdGVMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX3N0YXRlTGlzdGVuZXJzLmFkZChjYWxsYmFjayk7XG5cbiAgICBpZiAodGhpcy5fc3RhdGUgIT09IG51bGwpXG4gICAgICBjYWxsYmFjayh0aGlzLl9zdGF0ZSk7XG4gIH0sXG5cbiAgX2xpc3RlblNvY2tldFN0YXRlKCkge1xuICAgIC8vIHNlZTogaHR0cDovL3NvY2tldC5pby9kb2NzL2NsaWVudC1hcGkvI3NvY2tldFxuICAgIFsgJ2Nvbm5lY3QnLFxuICAgICAgJ3JlY29ubmVjdCcsXG4gICAgICAnZGlzY29ubmVjdCcsXG4gICAgICAnY29ubmVjdF9lcnJvcicsXG4gICAgICAncmVjb25uZWN0X2F0dGVtcHQnLFxuICAgICAgJ3JlY29ubmVjdGluZycsXG4gICAgICAncmVjb25uZWN0X2Vycm9yJyxcbiAgICAgICdyZWNvbm5lY3RfZmFpbGVkJ1xuICAgIF0uZm9yRWFjaCgoZXZlbnROYW1lKSA9PiB7XG4gICAgICB0aGlzLnNvY2tldC5vbihldmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgdGhpcy5fc3RhdGUgPSBldmVudE5hbWU7XG4gICAgICAgIHRoaXMuX3N0YXRlTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiBsaXN0ZW5lcih0aGlzLl9zdGF0ZSkpO1xuICAgICAgICBsb2coYHN0YXRlIC0gJHt0aGlzLl9zdGF0ZX1gKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgbG9nKGBzZW5kIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgLCAuLi5hcmdzKTtcbiAgfSxcblxuICBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHRoaXMuc29ja2V0LnZvbGF0aWxlLmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgbG9nKGBzZW5kVm9sYXRpbGUgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImAsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnNvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgdGhpcy5zb2NrZXQub24oY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIGxvZyhgcmVjZWl2ZSBsaXN0ZW5lciAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnNvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgbG9nKGByZW1vdmUgbGlzdGVuZXIgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImApO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc29ja2V0O1xuIl19
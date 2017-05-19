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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzb2NrZXQiLCJyZXF1aXJlZCIsImluaXQiLCJuYW1lc3BhY2UiLCJvcHRpb25zIiwidXJsIiwidHJhbnNwb3J0cyIsInBhdGgiLCJfc3RhdGVMaXN0ZW5lcnMiLCJfc3RhdGUiLCJfbGlzdGVuU29ja2V0U3RhdGUiLCJhZGRTdGF0ZUxpc3RlbmVyIiwiY2FsbGJhY2siLCJhZGQiLCJmb3JFYWNoIiwiZXZlbnROYW1lIiwib24iLCJsaXN0ZW5lciIsInNlbmQiLCJjaGFubmVsIiwiYXJncyIsImVtaXQiLCJzZW5kVm9sYXRpbGUiLCJ2b2xhdGlsZSIsInJlY2VpdmUiLCJyZW1vdmVMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7OztBQUVBLElBQU1BLE1BQU0scUJBQU0sbUJBQU4sQ0FBWjs7QUFFQSxJQUFNQyxTQUFTO0FBQ2I7OztBQUdBQSxVQUFRLElBSks7O0FBTWI7Ozs7QUFJQUMsWUFBVSxLQVZHOztBQVliOzs7Ozs7Ozs7QUFTQUMsTUFyQmEsZ0JBcUJSQyxTQXJCUSxFQXFCR0MsT0FyQkgsRUFxQlk7QUFDdkIsU0FBS0osTUFBTCxHQUFjLHNCQUFPSSxRQUFRQyxHQUFmLFNBQXNCRixTQUF0QixFQUFtQztBQUMvQ0csa0JBQVlGLFFBQVFFLFVBRDJCO0FBRS9DQyxZQUFNSCxRQUFRRztBQUZpQyxLQUFuQyxDQUFkOztBQUtBUiwyQ0FDZUssUUFBUUMsR0FEdkIsU0FDOEJGLFNBRDlCLGtDQUVzQkMsUUFBUUUsVUFGOUIsNEJBR2dCRixRQUFRRyxJQUh4Qjs7QUFNQSxTQUFLQyxlQUFMLEdBQXVCLG1CQUF2QjtBQUNBLFNBQUtDLE1BQUwsR0FBYyxJQUFkOztBQUVBLFNBQUtDLGtCQUFMO0FBQ0QsR0FyQ1k7OztBQXVDYjs7Ozs7Ozs7QUFRQUMsa0JBL0NhLDRCQStDSUMsUUEvQ0osRUErQ2M7QUFDekIsU0FBS0osZUFBTCxDQUFxQkssR0FBckIsQ0FBeUJELFFBQXpCOztBQUVBLFFBQUksS0FBS0gsTUFBTCxLQUFnQixJQUFwQixFQUNFRyxTQUFTLEtBQUtILE1BQWQ7QUFDSCxHQXBEWTtBQXNEYkMsb0JBdERhLGdDQXNEUTtBQUFBOztBQUNuQjtBQUNBLEtBQUUsU0FBRixFQUNFLFdBREYsRUFFRSxZQUZGLEVBR0UsZUFIRixFQUlFLG1CQUpGLEVBS0UsY0FMRixFQU1FLGlCQU5GLEVBT0Usa0JBUEYsRUFRRUksT0FSRixDQVFVLFVBQUNDLFNBQUQsRUFBZTtBQUN2QixZQUFLZixNQUFMLENBQVlnQixFQUFaLENBQWVELFNBQWYsRUFBMEIsWUFBTTtBQUM5QixjQUFLTixNQUFMLEdBQWNNLFNBQWQ7QUFDQSxjQUFLUCxlQUFMLENBQXFCTSxPQUFyQixDQUE2QixVQUFDRyxRQUFEO0FBQUEsaUJBQWNBLFNBQVMsTUFBS1IsTUFBZCxDQUFkO0FBQUEsU0FBN0I7QUFDQVYseUJBQWUsTUFBS1UsTUFBcEI7QUFDRCxPQUpEO0FBS0QsS0FkRDtBQWVELEdBdkVZOzs7QUF5RWI7Ozs7OztBQU1BUyxNQS9FYSxnQkErRVJDLE9BL0VRLEVBK0VVO0FBQUE7O0FBQUEsc0NBQU5DLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUNyQixvQkFBS3BCLE1BQUwsRUFBWXFCLElBQVosaUJBQWlCRixPQUFqQixTQUE2QkMsSUFBN0I7QUFDQXJCLGdEQUF3Qm9CLE9BQXhCLGVBQXVDQyxJQUF2QztBQUNELEdBbEZZO0FBb0ZiRSxjQXBGYSx3QkFvRkFILE9BcEZBLEVBb0ZrQjtBQUFBOztBQUFBLHVDQUFOQyxJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFDN0IsNkJBQUtwQixNQUFMLENBQVl1QixRQUFaLEVBQXFCRixJQUFyQiwwQkFBMEJGLE9BQTFCLFNBQXNDQyxJQUF0QztBQUNBckIsd0RBQWdDb0IsT0FBaEMsZUFBK0NDLElBQS9DO0FBQ0QsR0F2Rlk7OztBQXlGYjs7Ozs7O0FBTUFJLFNBL0ZhLG1CQStGTEwsT0EvRkssRUErRklQLFFBL0ZKLEVBK0ZjO0FBQ3pCLFNBQUtaLE1BQUwsQ0FBWXlCLGNBQVosQ0FBMkJOLE9BQTNCLEVBQW9DUCxRQUFwQztBQUNBLFNBQUtaLE1BQUwsQ0FBWWdCLEVBQVosQ0FBZUcsT0FBZixFQUF3QlAsUUFBeEI7QUFDQWIsMENBQW9Db0IsT0FBcEM7QUFDRCxHQW5HWTs7O0FBcUdiOzs7Ozs7QUFNQU0sZ0JBM0dhLDBCQTJHRU4sT0EzR0YsRUEyR1dQLFFBM0dYLEVBMkdxQjtBQUNoQyxTQUFLWixNQUFMLENBQVl5QixjQUFaLENBQTJCTixPQUEzQixFQUFvQ1AsUUFBcEM7QUFDQWIseUNBQW1Db0IsT0FBbkM7QUFDRDtBQTlHWSxDQUFmOztrQkFpSGVuQixNIiwiZmlsZSI6InNvY2tldC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkZWJ1ZyBmcm9tICdkZWJ1Zyc7XG5pbXBvcnQgc2lvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuXG5jb25zdCBsb2cgPSBkZWJ1Zygnc291bmR3b3Jrczpzb2NrZXQnKTtcblxuY29uc3Qgc29ja2V0ID0ge1xuICAvKipcbiAgICogU3RvcmUgdGhlIGluc3RhbmNlIG9mIFNvY2tldC5pbyBNYW5hZ2VyLlxuICAgKi9cbiAgc29ja2V0OiBudWxsLFxuXG4gIC8qKlxuICAgKiBJcyBzZXQgdG8gYHRydWVgIHdoZW4gYSBgQWN0aXZpdHlgIHRoYXQgcmVxdWlyZXMgbmV0d29yayBpcyBpbnN0YW5jaWF0ZWQuXG4gICAqIElzIGNoZWNrZWQgYnkgdGhlIGBjbGllbnRgIHRvIGluaXRpYWxpemUgdGhlIGNvbm5lY3Rpb24gb3Igbm90LlxuICAgKi9cbiAgcmVxdWlyZWQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmFtZXNwYWNlZCBjb25uZWN0aW9uIHdpdGggZ2l2ZW4gb3B0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWVzcGFjZSAtIENvcnJlc3BvbmQgdG8gdGhlIGBjbGllbnQudHlwZWAge0BsaW5rIGNsaWVudH0uXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3B0aW9ucyBvZiB0aGUgc29ja2V0LlxuICAgKiBAcGFyYW0ge1N0cmluZ30gb3B0aW9ucy51cmwgLSBUaGUgdXJsIHdoZXJlIHRoZSBzb2NrZXQgc2hvdWxkIGNvbm5lY3QuXG4gICAqIEBwYXJhbSB7QXJyYXk8U3RyaW5nPn0gb3B0aW9ucy50cmFuc3BvcnRzIC0gVGhlIHRyYW5zcG9ydHMgdG8gdXNlIGZvciB0aGUgc29ja2V0IChjZi4gc29ja2V0LmlvKS5cbiAgICogQHBhcmFtIHtBcnJheTxTdHJpbmc+fSBvcHRpb25zLnBhdGggLSBEZWZpbmVzIHdoZXJlIHNvY2tldCBzaG91bGQgZmluZCB0aGUgYHNvY2tldC5pb2AgZmlsZS5cbiAgICovXG4gIGluaXQobmFtZXNwYWNlLCBvcHRpb25zKSB7XG4gICAgdGhpcy5zb2NrZXQgPSBzaW8oYCR7b3B0aW9ucy51cmx9LyR7bmFtZXNwYWNlfWAsIHtcbiAgICAgIHRyYW5zcG9ydHM6IG9wdGlvbnMudHJhbnNwb3J0cyxcbiAgICAgIHBhdGg6IG9wdGlvbnMucGF0aCxcbiAgICB9KTtcblxuICAgIGxvZyhgaW5pdGlhbGl6ZWRcbiAgICAgICAgICAtIHVybDogJHtvcHRpb25zLnVybH0vJHtuYW1lc3BhY2V9XG4gICAgICAgICAgLSB0cmFuc3BvcnRzOiAke29wdGlvbnMudHJhbnNwb3J0c31cbiAgICAgICAgICAtIHBhdGg6ICR7b3B0aW9ucy5wYXRofVxuICAgIGApO1xuXG4gICAgdGhpcy5fc3RhdGVMaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fc3RhdGUgPSBudWxsO1xuXG4gICAgdGhpcy5fbGlzdGVuU29ja2V0U3RhdGUoKTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIHRvIHRoZSBkaWZmZXJlbnQgc3RhdGVzIG9mIHRoZSBzb2NrZXQuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBzdGF0ZVxuICAgKiAgb2YgdGhlIHNvY2tldCBjaGFuZ2VzLCB0aGUgZ2l2ZW4gZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIG5hbWUgb2YgdGhlXG4gICAqICBldmVudCBhcyBhcmd1bWVudC5cbiAgICogQHNlZSB7aHR0cDovL3NvY2tldC5pby9kb2NzL2NsaWVudC1hcGkvI3NvY2tldH1cbiAgICovXG4gIGFkZFN0YXRlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9zdGF0ZUxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlICE9PSBudWxsKVxuICAgICAgY2FsbGJhY2sodGhpcy5fc3RhdGUpO1xuICB9LFxuXG4gIF9saXN0ZW5Tb2NrZXRTdGF0ZSgpIHtcbiAgICAvLyBzZWU6IGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9jbGllbnQtYXBpLyNzb2NrZXRcbiAgICBbICdjb25uZWN0JyxcbiAgICAgICdyZWNvbm5lY3QnLFxuICAgICAgJ2Rpc2Nvbm5lY3QnLFxuICAgICAgJ2Nvbm5lY3RfZXJyb3InLFxuICAgICAgJ3JlY29ubmVjdF9hdHRlbXB0JyxcbiAgICAgICdyZWNvbm5lY3RpbmcnLFxuICAgICAgJ3JlY29ubmVjdF9lcnJvcicsXG4gICAgICAncmVjb25uZWN0X2ZhaWxlZCdcbiAgICBdLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgdGhpcy5zb2NrZXQub24oZXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gZXZlbnROYW1lO1xuICAgICAgICB0aGlzLl9zdGF0ZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIodGhpcy5fc3RhdGUpKTtcbiAgICAgICAgbG9nKGBzdGF0ZSAtICR7dGhpcy5fc3RhdGV9YCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgc2VydmVyIHNpZGUgc29ja2V0LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIGxvZyhgc2VuZCAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgc2VuZFZvbGF0aWxlKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLnNvY2tldC52b2xhdGlsZS5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICAgIGxvZyhgc2VuZFZvbGF0aWxlIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIHRoaXMuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgICBsb2coYHJlY2VpdmUgbGlzdGVuZXIgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImApO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTdG9wIGxpc3RlbmluZyB0byBhIG1lc3NhZ2UgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGNhbmNlbC5cbiAgICovXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIGxvZyhgcmVtb3ZlIGxpc3RlbmVyIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgKTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHNvY2tldDtcbiJdfQ==
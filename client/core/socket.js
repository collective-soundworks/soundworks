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

    this._stateListeners = new _set2.default();
    this._state = null;

    this._listenSocketState();

    return this;
  },


  /**
   * Listen to the different states of the socket.
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
      });
    });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldC5qcyJdLCJuYW1lcyI6WyJsb2ciLCJzb2NrZXQiLCJyZXF1aXJlZCIsImluaXRpYWxpemUiLCJuYW1lc3BhY2UiLCJvcHRpb25zIiwidXJsIiwidHJhbnNwb3J0cyIsIl9zdGF0ZUxpc3RlbmVycyIsIl9zdGF0ZSIsIl9saXN0ZW5Tb2NrZXRTdGF0ZSIsImFkZFN0YXRlTGlzdGVuZXIiLCJjYWxsYmFjayIsImFkZCIsImZvckVhY2giLCJldmVudE5hbWUiLCJvbiIsImxpc3RlbmVyIiwic2VuZCIsImNoYW5uZWwiLCJhcmdzIiwiZW1pdCIsInNlbmRWb2xhdGlsZSIsInZvbGF0aWxlIiwicmVjZWl2ZSIsInJlbW92ZUxpc3RlbmVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsTUFBTSxxQkFBTSxtQkFBTixDQUFaOztBQUVBLElBQU1DLFNBQVM7QUFDYjs7O0FBR0FBLFVBQVEsSUFKSzs7QUFNYjs7O0FBR0FDLFlBQVUsS0FURzs7QUFXYjs7Ozs7OztBQU9BQyxZQWxCYSxzQkFrQkZDLFNBbEJFLEVBa0JTQyxPQWxCVCxFQWtCa0I7QUFDN0IsUUFBTUMsTUFBU0QsUUFBUUMsR0FBakIsU0FBd0JGLFNBQTlCOztBQUVBLFNBQUtILE1BQUwsR0FBYyxzQkFBR0ssR0FBSCxFQUFRLEVBQUVDLFlBQVlGLFFBQVFFLFVBQXRCLEVBQVIsQ0FBZDtBQUNBUCxpQ0FBMkJNLEdBQTNCLHdCQUFpREQsUUFBUUUsVUFBekQ7O0FBRUEsU0FBS0MsZUFBTCxHQUF1QixtQkFBdkI7QUFDQSxTQUFLQyxNQUFMLEdBQWMsSUFBZDs7QUFFQSxTQUFLQyxrQkFBTDs7QUFFQSxXQUFPLElBQVA7QUFDRCxHQTlCWTs7O0FBZ0NiOzs7Ozs7O0FBT0FDLGtCQXZDYSw0QkF1Q0lDLFFBdkNKLEVBdUNjO0FBQ3pCLFNBQUtKLGVBQUwsQ0FBcUJLLEdBQXJCLENBQXlCRCxRQUF6Qjs7QUFFQSxRQUFJLEtBQUtILE1BQUwsS0FBZ0IsSUFBcEIsRUFDRUcsU0FBUyxLQUFLSCxNQUFkO0FBQ0gsR0E1Q1k7QUE4Q2JDLG9CQTlDYSxnQ0E4Q1E7QUFBQTs7QUFDbkI7QUFDQSxLQUFFLFNBQUYsRUFDRSxXQURGLEVBRUUsWUFGRixFQUdFLGVBSEYsRUFJRSxtQkFKRixFQUtFLGNBTEYsRUFNRSxpQkFORixFQU9FLGtCQVBGLEVBUUVJLE9BUkYsQ0FRVSxVQUFDQyxTQUFELEVBQWU7QUFDdkIsWUFBS2QsTUFBTCxDQUFZZSxFQUFaLENBQWVELFNBQWYsRUFBMEIsWUFBTTtBQUM5QixjQUFLTixNQUFMLEdBQWNNLFNBQWQ7QUFDQSxjQUFLUCxlQUFMLENBQXFCTSxPQUFyQixDQUE2QixVQUFDRyxRQUFEO0FBQUEsaUJBQWNBLFNBQVMsTUFBS1IsTUFBZCxDQUFkO0FBQUEsU0FBN0I7QUFDRCxPQUhEO0FBSUQsS0FiRDtBQWNELEdBOURZOzs7QUFnRWI7Ozs7O0FBS0FTLE1BckVhLGdCQXFFUkMsT0FyRVEsRUFxRVU7QUFBQTs7QUFBQSxzQ0FBTkMsSUFBTTtBQUFOQSxVQUFNO0FBQUE7O0FBQ3JCLG9CQUFLbkIsTUFBTCxFQUFZb0IsSUFBWixpQkFBaUJGLE9BQWpCLFNBQTZCQyxJQUE3QjtBQUNBcEIsZ0RBQXdCbUIsT0FBeEIsZUFBdUNDLElBQXZDO0FBQ0QsR0F4RVk7QUEwRWJFLGNBMUVhLHdCQTBFQUgsT0ExRUEsRUEwRWtCO0FBQUE7O0FBQUEsdUNBQU5DLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUM3Qiw2QkFBS25CLE1BQUwsQ0FBWXNCLFFBQVosRUFBcUJGLElBQXJCLDBCQUEwQkYsT0FBMUIsU0FBc0NDLElBQXRDO0FBQ0FwQix3REFBZ0NtQixPQUFoQyxlQUErQ0MsSUFBL0M7QUFDRCxHQTdFWTs7O0FBK0ViOzs7OztBQUtBSSxTQXBGYSxtQkFvRkxMLE9BcEZLLEVBb0ZJUCxRQXBGSixFQW9GYztBQUN6QixTQUFLWCxNQUFMLENBQVl3QixjQUFaLENBQTJCTixPQUEzQixFQUFvQ1AsUUFBcEM7QUFDQSxTQUFLWCxNQUFMLENBQVllLEVBQVosQ0FBZUcsT0FBZixFQUF3QlAsUUFBeEI7QUFDQVosMENBQW9DbUIsT0FBcEM7QUFDRCxHQXhGWTs7O0FBMEZiOzs7OztBQUtBTSxnQkEvRmEsMEJBK0ZFTixPQS9GRixFQStGV1AsUUEvRlgsRUErRnFCO0FBQ2hDLFNBQUtYLE1BQUwsQ0FBWXdCLGNBQVosQ0FBMkJOLE9BQTNCLEVBQW9DUCxRQUFwQztBQUNBWix5Q0FBbUNtQixPQUFuQztBQUNEO0FBbEdZLENBQWY7O2tCQXFHZWxCLE0iLCJmaWxlIjoic29ja2V0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGRlYnVnIGZyb20gJ2RlYnVnJztcbmltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuY29uc3QgbG9nID0gZGVidWcoJ3NvdW5kd29ya3M6c29ja2V0Jyk7XG5cbmNvbnN0IHNvY2tldCA9IHtcbiAgLyoqXG4gICAqIFN0b3JlIHRoZSBpbnN0YW5jZSBvZiBTb2NrZXQuaW8gTWFuYWdlci5cbiAgICovXG4gIHNvY2tldDogbnVsbCxcblxuICAvKipcbiAgICogSXMgc2V0IHRvIGB0cnVlYCB3aGVuIGEgYEFjdGl2aXR5YCBpcyBpbnN0YW5jaWF0ZWQuIElzIGNoZWNrZWQgYnkgdGhlIGBjbGllbnRgIHRvIGluaXRpYWxpemUgdGhlIGNvbm5lY3Rpb24gb3Igbm90LlxuICAgKi9cbiAgcmVxdWlyZWQ6IGZhbHNlLFxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIGEgbmFtZXNwYWNlZCBjb25uZWN0aW9uIHdpdGggZ2l2ZW4gdHJhbnNwb3J0IG9wdGlvbnMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lc3BhY2UgLSBDb3JyZXNwb25kIHRvIHRoZSBgY2xpZW50LnR5cGVgIHtAbGluayBjbGllbnR9LlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE9wdGlvbnMgb2YgdGhlIHNvY2tldC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IG9wdGlvbnMudXJsIC0gVGhlIHVybCB3aGVyZSB0aGUgc29ja2V0IHNob3VsZCBjb25uZWN0LlxuICAgKiBAcGFyYW0ge0FycmF5PFN0cmluZz59IG9wdGlvbnMudHJhbnNwb3J0cyAtIFRoZSB0cmFuc3BvcnRzIHRvIHVzZSBmb3IgdGhlIHNvY2tldCAoY2YuIHNvY2tldC5pbykuXG4gICAqL1xuICBpbml0aWFsaXplKG5hbWVzcGFjZSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHVybCA9IGAke29wdGlvbnMudXJsfS8ke25hbWVzcGFjZX1gO1xuXG4gICAgdGhpcy5zb2NrZXQgPSBpbyh1cmwsIHsgdHJhbnNwb3J0czogb3B0aW9ucy50cmFuc3BvcnRzIH0pO1xuICAgIGxvZyhgaW5pdGlhbGl6ZWQgLSB1cmw6IFwiJHt1cmx9XCIgLSB0cmFuc3BvcnRzOiAke29wdGlvbnMudHJhbnNwb3J0c31gKTtcblxuICAgIHRoaXMuX3N0YXRlTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX3N0YXRlID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlblNvY2tldFN0YXRlKCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIHRvIHRoZSBkaWZmZXJlbnQgc3RhdGVzIG9mIHRoZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBzdGF0ZVxuICAgKiAgb2YgdGhlIHNvY2tldCBjaGFuZ2VzLCB0aGUgZ2l2ZW4gZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIG5hbWUgb2YgdGhlXG4gICAqICBldmVudCBhcyBhcmd1bWVudC5cbiAgICogQHNlZSB7aHR0cDovL3NvY2tldC5pby9kb2NzL2NsaWVudC1hcGkvI3NvY2tldH1cbiAgICovXG4gIGFkZFN0YXRlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLl9zdGF0ZUxpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuXG4gICAgaWYgKHRoaXMuX3N0YXRlICE9PSBudWxsKVxuICAgICAgY2FsbGJhY2sodGhpcy5fc3RhdGUpO1xuICB9LFxuXG4gIF9saXN0ZW5Tb2NrZXRTdGF0ZSgpIHtcbiAgICAvLyBzZWU6IGh0dHA6Ly9zb2NrZXQuaW8vZG9jcy9jbGllbnQtYXBpLyNzb2NrZXRcbiAgICBbICdjb25uZWN0JyxcbiAgICAgICdyZWNvbm5lY3QnLFxuICAgICAgJ2Rpc2Nvbm5lY3QnLFxuICAgICAgJ2Nvbm5lY3RfZXJyb3InLFxuICAgICAgJ3JlY29ubmVjdF9hdHRlbXB0JyxcbiAgICAgICdyZWNvbm5lY3RpbmcnLFxuICAgICAgJ3JlY29ubmVjdF9lcnJvcicsXG4gICAgICAncmVjb25uZWN0X2ZhaWxlZCdcbiAgICBdLmZvckVhY2goKGV2ZW50TmFtZSkgPT4ge1xuICAgICAgdGhpcy5zb2NrZXQub24oZXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuX3N0YXRlID0gZXZlbnROYW1lO1xuICAgICAgICB0aGlzLl9zdGF0ZUxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4gbGlzdGVuZXIodGhpcy5fc3RhdGUpKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBzZXJ2ZXIgc2lkZSBzb2NrZXQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHRoaXMuc29ja2V0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgbG9nKGBzZW5kIC0gY2hhbm5lbDogXCIke2NoYW5uZWx9XCJgLCAuLi5hcmdzKTtcbiAgfSxcblxuICBzZW5kVm9sYXRpbGUoY2hhbm5lbCwgLi4uYXJncykge1xuICAgIHRoaXMuc29ja2V0LnZvbGF0aWxlLmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gICAgbG9nKGBzZW5kVm9sYXRpbGUgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImAsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnNvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgdGhpcy5zb2NrZXQub24oY2hhbm5lbCwgY2FsbGJhY2spO1xuICAgIGxvZyhgcmVjZWl2ZSBsaXN0ZW5lciAtIGNoYW5uZWw6IFwiJHtjaGFubmVsfVwiYCk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICB0aGlzLnNvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgbG9nKGByZW1vdmUgbGlzdGVuZXIgLSBjaGFubmVsOiBcIiR7Y2hhbm5lbH1cImApO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc29ja2V0O1xuIl19
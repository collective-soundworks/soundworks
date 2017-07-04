'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  /**
   * Initialize the object which socket.io
   * @private
   */
  init: function init(httpServer, config) {
    this.io = new _socket2.default(httpServer, config);;
  },


  /**
   * Register the function to apply when a client of the given `clientType`
   * is connecting to the server
   * @param {Array} clientTypes - The different type of client, should be namespaced
   * @param {Function} callback
   * @private
   */
  onConnection: function onConnection(clientTypes, callback) {
    var _this = this;

    clientTypes.forEach(function (clientType) {
      _this.io.of(clientType).on('connection', function (socket) {
        callback(clientType, socket);
      });
    });
  },


  /**
   * Listen a WebSocket message.
   * @param {Client} client - The client that must listen to the message.
   * @param {String} channel - The channel of the message
   * @param {...*} callback - The callback to execute when a message is received.
   */
  receive: function receive(client, channel, callback) {
    client.socket.on(channel, callback);
  },


  /**
   * Sends a WebSocket message to the client.
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  send: function send(client, channel) {
    var _client$socket;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_client$socket = client.socket).emit.apply(_client$socket, [channel].concat(args));
  },


  /**
   * Stop listening to a message from the server.
   *
   * @param {Client} client - The client to send the message to.
   * @param {String} channel - The channel of the message.
   * @param {...*} callback - The callback to cancel.
   */
  removeListener: function removeListener(client, channel, callback) {
    client.socket.removeListener(channel, callback);
  },


  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If
   * not specified, the message is sent to all clients.
   *
   * @param {String|Array} clientType - The `clientType`(s) that must receive
   *  the message.
   * @param {module:soundworks/server.Client} excludeClient - Optionnal
   *  client to ignore when broadcasting the message, typically the client
   *  at the origin of the message.
   * @param {String} channel - Channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast: function broadcast(clientType, excludeClient, channel) {
    for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
      args[_key2 - 3] = arguments[_key2];
    }

    var _this2 = this;

    if (!this.io) // @todo - remove that, fix server initialization order instead
      return;

    var namespaces = void 0;

    if (typeof clientType === 'string') namespaces = ['/' + clientType];else if (Array.isArray(clientType)) namespaces = clientType.map(function (type) {
      return '/' + type;
    });else namespaces = (0, _keys2.default)(this.io.nsps);

    if (excludeClient) {
      var index = namespaces.indexOf('/' + excludeClient.type);

      if (index !== -1) {
        var _excludeClient$socket;

        namespaces.splice(index, 1);
        (_excludeClient$socket = excludeClient.socket.broadcast).emit.apply(_excludeClient$socket, [channel].concat(args));
      }
    }

    namespaces.forEach(function (nsp) {
      var _io$of;

      return (_io$of = _this2.io.of(nsp)).emit.apply(_io$of, [channel].concat(args));
    });
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNvY2tldHMuanMiXSwibmFtZXMiOlsiaW5pdCIsImh0dHBTZXJ2ZXIiLCJjb25maWciLCJpbyIsIm9uQ29ubmVjdGlvbiIsImNsaWVudFR5cGVzIiwiY2FsbGJhY2siLCJmb3JFYWNoIiwiY2xpZW50VHlwZSIsIm9mIiwib24iLCJzb2NrZXQiLCJyZWNlaXZlIiwiY2xpZW50IiwiY2hhbm5lbCIsInNlbmQiLCJhcmdzIiwiZW1pdCIsInJlbW92ZUxpc3RlbmVyIiwiYnJvYWRjYXN0IiwiZXhjbHVkZUNsaWVudCIsIm5hbWVzcGFjZXMiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJ0eXBlIiwibnNwcyIsImluZGV4IiwiaW5kZXhPZiIsInNwbGljZSIsIm5zcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7a0JBRWU7QUFDYjs7OztBQUlBQSxNQUxhLGdCQUtSQyxVQUxRLEVBS0lDLE1BTEosRUFLWTtBQUN2QixTQUFLQyxFQUFMLEdBQVUscUJBQVFGLFVBQVIsRUFBb0JDLE1BQXBCLENBQVYsQ0FBc0M7QUFDdkMsR0FQWTs7O0FBU2I7Ozs7Ozs7QUFPQUUsY0FoQmEsd0JBZ0JBQyxXQWhCQSxFQWdCYUMsUUFoQmIsRUFnQnVCO0FBQUE7O0FBQ2xDRCxnQkFBWUUsT0FBWixDQUFvQixVQUFDQyxVQUFELEVBQWdCO0FBQ2xDLFlBQUtMLEVBQUwsQ0FBUU0sRUFBUixDQUFXRCxVQUFYLEVBQXVCRSxFQUF2QixDQUEwQixZQUExQixFQUF3QyxVQUFDQyxNQUFELEVBQVk7QUFDbERMLGlCQUFTRSxVQUFULEVBQXFCRyxNQUFyQjtBQUNELE9BRkQ7QUFHRCxLQUpEO0FBS0QsR0F0Qlk7OztBQXdCYjs7Ozs7O0FBTUFDLFNBOUJhLG1CQThCTEMsTUE5QkssRUE4QkdDLE9BOUJILEVBOEJZUixRQTlCWixFQThCc0I7QUFDakNPLFdBQU9GLE1BQVAsQ0FBY0QsRUFBZCxDQUFpQkksT0FBakIsRUFBMEJSLFFBQTFCO0FBQ0QsR0FoQ1k7OztBQWtDYjs7Ozs7O0FBTUFTLE1BeENhLGdCQXdDUkYsTUF4Q1EsRUF3Q0FDLE9BeENBLEVBd0NrQjtBQUFBOztBQUFBLHNDQUFORSxJQUFNO0FBQU5BLFVBQU07QUFBQTs7QUFDN0IsNkJBQU9MLE1BQVAsRUFBY00sSUFBZCx3QkFBbUJILE9BQW5CLFNBQStCRSxJQUEvQjtBQUNELEdBMUNZOzs7QUE2Q2I7Ozs7Ozs7QUFPQUUsZ0JBcERhLDBCQW9ERUwsTUFwREYsRUFvRFVDLE9BcERWLEVBb0RtQlIsUUFwRG5CLEVBb0Q2QjtBQUN4Q08sV0FBT0YsTUFBUCxDQUFjTyxjQUFkLENBQTZCSixPQUE3QixFQUFzQ1IsUUFBdEM7QUFDRCxHQXREWTs7O0FBd0RiOzs7Ozs7Ozs7Ozs7QUFZQWEsV0FwRWEscUJBb0VIWCxVQXBFRyxFQW9FU1ksYUFwRVQsRUFvRXdCTixPQXBFeEIsRUFvRTBDO0FBQUEsdUNBQU5FLElBQU07QUFBTkEsVUFBTTtBQUFBOztBQUFBOztBQUNyRCxRQUFJLENBQUMsS0FBS2IsRUFBVixFQUFjO0FBQ1o7O0FBRUYsUUFBSWtCLG1CQUFKOztBQUVBLFFBQUksT0FBT2IsVUFBUCxLQUFzQixRQUExQixFQUNFYSxhQUFhLE9BQUtiLFVBQUwsQ0FBYixDQURGLEtBRUssSUFBSWMsTUFBTUMsT0FBTixDQUFjZixVQUFkLENBQUosRUFDSGEsYUFBYWIsV0FBV2dCLEdBQVgsQ0FBZTtBQUFBLG1CQUFZQyxJQUFaO0FBQUEsS0FBZixDQUFiLENBREcsS0FHSEosYUFBYSxvQkFBWSxLQUFLbEIsRUFBTCxDQUFRdUIsSUFBcEIsQ0FBYjs7QUFFRixRQUFJTixhQUFKLEVBQW1CO0FBQ2pCLFVBQU1PLFFBQVFOLFdBQVdPLE9BQVgsQ0FBbUIsTUFBTVIsY0FBY0ssSUFBdkMsQ0FBZDs7QUFFQSxVQUFJRSxVQUFVLENBQUMsQ0FBZixFQUFrQjtBQUFBOztBQUNoQk4sbUJBQVdRLE1BQVgsQ0FBa0JGLEtBQWxCLEVBQXlCLENBQXpCO0FBQ0EsK0NBQWNoQixNQUFkLENBQXFCUSxTQUFyQixFQUErQkYsSUFBL0IsK0JBQW9DSCxPQUFwQyxTQUFnREUsSUFBaEQ7QUFDRDtBQUNGOztBQUVESyxlQUFXZCxPQUFYLENBQW1CLFVBQUN1QixHQUFEO0FBQUE7O0FBQUEsYUFBUyxpQkFBSzNCLEVBQUwsQ0FBUU0sRUFBUixDQUFXcUIsR0FBWCxHQUFnQmIsSUFBaEIsZ0JBQXFCSCxPQUFyQixTQUFpQ0UsSUFBakMsRUFBVDtBQUFBLEtBQW5CO0FBQ0Q7QUEzRlksQyIsImZpbGUiOiJzb2NrZXRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHNpbyBmcm9tICdzb2NrZXQuaW8nO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBvYmplY3Qgd2hpY2ggc29ja2V0LmlvXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0KGh0dHBTZXJ2ZXIsIGNvbmZpZykge1xuICAgIHRoaXMuaW8gPSBuZXcgc2lvKGh0dHBTZXJ2ZXIsIGNvbmZpZyk7O1xuICB9LFxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciB0aGUgZnVuY3Rpb24gdG8gYXBwbHkgd2hlbiBhIGNsaWVudCBvZiB0aGUgZ2l2ZW4gYGNsaWVudFR5cGVgXG4gICAqIGlzIGNvbm5lY3RpbmcgdG8gdGhlIHNlcnZlclxuICAgKiBAcGFyYW0ge0FycmF5fSBjbGllbnRUeXBlcyAtIFRoZSBkaWZmZXJlbnQgdHlwZSBvZiBjbGllbnQsIHNob3VsZCBiZSBuYW1lc3BhY2VkXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBvbkNvbm5lY3Rpb24oY2xpZW50VHlwZXMsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50VHlwZXMuZm9yRWFjaCgoY2xpZW50VHlwZSkgPT4ge1xuICAgICAgdGhpcy5pby5vZihjbGllbnRUeXBlKS5vbignY29ubmVjdGlvbicsIChzb2NrZXQpID0+IHtcbiAgICAgICAgY2FsbGJhY2soY2xpZW50VHlwZSwgc29ja2V0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9LFxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjbGllbnQuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY2xpZW50LnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIFN0b3AgbGlzdGVuaW5nIHRvIGEgbWVzc2FnZSBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gY2FuY2VsLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5zb2NrZXQucmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAgb3IgYGNsaWVudFR5cGVgcy4gSWZcbiAgICogbm90IHNwZWNpZmllZCwgdGhlIG1lc3NhZ2UgaXMgc2VudCB0byBhbGwgY2xpZW50cy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGNsaWVudFR5cGUgLSBUaGUgYGNsaWVudFR5cGVgKHMpIHRoYXQgbXVzdCByZWNlaXZlXG4gICAqICB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHttb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuQ2xpZW50fSBleGNsdWRlQ2xpZW50IC0gT3B0aW9ubmFsXG4gICAqICBjbGllbnQgdG8gaWdub3JlIHdoZW4gYnJvYWRjYXN0aW5nIHRoZSBtZXNzYWdlLCB0eXBpY2FsbHkgdGhlIGNsaWVudFxuICAgKiAgYXQgdGhlIG9yaWdpbiBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBleGNsdWRlQ2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgaWYgKCF0aGlzLmlvKSAvLyBAdG9kbyAtIHJlbW92ZSB0aGF0LCBmaXggc2VydmVyIGluaXRpYWxpemF0aW9uIG9yZGVyIGluc3RlYWRcbiAgICAgIHJldHVybjtcblxuICAgIGxldCBuYW1lc3BhY2VzO1xuXG4gICAgaWYgKHR5cGVvZiBjbGllbnRUeXBlID09PSAnc3RyaW5nJylcbiAgICAgIG5hbWVzcGFjZXMgPSBbYC8ke2NsaWVudFR5cGV9YF07XG4gICAgZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjbGllbnRUeXBlKSlcbiAgICAgIG5hbWVzcGFjZXMgPSBjbGllbnRUeXBlLm1hcCh0eXBlID0+IGAvJHt0eXBlfWApO1xuICAgIGVsc2VcbiAgICAgIG5hbWVzcGFjZXMgPSBPYmplY3Qua2V5cyh0aGlzLmlvLm5zcHMpO1xuXG4gICAgaWYgKGV4Y2x1ZGVDbGllbnQpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gbmFtZXNwYWNlcy5pbmRleE9mKCcvJyArIGV4Y2x1ZGVDbGllbnQudHlwZSk7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbmFtZXNwYWNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBleGNsdWRlQ2xpZW50LnNvY2tldC5icm9hZGNhc3QuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBuYW1lc3BhY2VzLmZvckVhY2goKG5zcCkgPT4gdGhpcy5pby5vZihuc3ApLmVtaXQoY2hhbm5lbCwgLi4uYXJncykpO1xuICB9LFxufTtcbiJdfQ==
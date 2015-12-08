'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  /**
   * Initialize the module which socket.io
   * @private
   */
  initialize: function initialize(io) {
    this.io = io;
    this._nspPrefix = /^\//;
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
   * Sends a WebSocket message to all the clients belonging to the same `clientType` as `client`. (`client` does not receive a message)
   * @param {Client} client - The client which peers must receive the message
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  sendPeers: function sendPeers(client, channel) {
    var _client$socket$broadcast;

    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    (_client$socket$broadcast = client.socket.broadcast).emit.apply(_client$socket$broadcast, [channel].concat(args));
  },

  /**
   * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
   * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
   * @param {String} channel - The channel of the message
   * @param {...*} args - Arguments of the message (as many as needed, of any type).
   */
  broadcast: function broadcast(clientType, channel) {
    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    var _this = this;

    var namespaces = undefined;

    if (typeof clientType === 'string') {
      namespaces = ['/' + clientType.replace(this._nspPrefix, '')];
    } else if (Array.isArray(clientType)) {
      namespaces = clientType.map(function (type) {
        return '/' + type.replace(_this._nspPrefix, '');
      });
    } else {
      namespaces = _Object$keys(this.io.nsps);
    }

    namespaces.forEach(function (nsp) {
      var _io$of;

      (_io$of = _this.io.of(nsp)).emit.apply(_io$of, [channel].concat(args));
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O3FCQUFlOzs7Ozs7QUFNYixZQUFVLEVBQUEsb0JBQUMsRUFBRSxFQUFFO0FBQ2IsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDYixRQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztHQUN6Qjs7Ozs7Ozs7QUFRRCxTQUFPLEVBQUEsaUJBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDakMsVUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDOzs7Ozs7OztBQVFELE1BQUksRUFBQSxjQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7OztzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQzNCLHNCQUFBLE1BQU0sQ0FBQyxNQUFNLEVBQUMsSUFBSSxNQUFBLGtCQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUN0Qzs7Ozs7Ozs7QUFRRCxXQUFTLEVBQUEsbUJBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVzs7O3VDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDaEMsZ0NBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUMsSUFBSSxNQUFBLDRCQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUNoRDs7Ozs7Ozs7QUFRRCxXQUFTLEVBQUEsbUJBQUMsVUFBVSxFQUFFLE9BQU8sRUFBVzt1Q0FBTixJQUFJO0FBQUosVUFBSTs7Ozs7QUFDcEMsUUFBSSxVQUFVLFlBQUEsQ0FBQzs7QUFFZixRQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtBQUNsQyxnQkFBVSxHQUFHLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3BDLGdCQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksRUFBSztBQUNwQyxlQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQUssVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ2hELENBQUMsQ0FBQztLQUNKLE1BQU07QUFDTCxnQkFBVSxHQUFHLGFBQVksSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7QUFFRCxjQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLOzs7QUFBRSxnQkFBQSxNQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxNQUFBLFVBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO0tBQUUsQ0FBQyxDQUFDO0dBQzFFO0NBQ0YiLCJmaWxlIjoic3JjL3NlcnZlci9jb21tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQge1xuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBtb2R1bGUgd2hpY2ggc29ja2V0LmlvXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpbml0aWFsaXplKGlvKSB7XG4gICAgdGhpcy5pbyA9IGlvO1xuICAgIHRoaXMuX25zcFByZWZpeCA9IC9eXFwvLztcbiAgfSxcblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY2xpZW50LnNvY2tldC5vbihjaGFubmVsLCBjYWxsYmFjayk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNsaWVudC5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byBhbGwgdGhlIGNsaWVudHMgYmVsb25naW5nIHRvIHRoZSBzYW1lIGBjbGllbnRUeXBlYCBhcyBgY2xpZW50YC4gKGBjbGllbnRgIGRvZXMgbm90IHJlY2VpdmUgYSBtZXNzYWdlKVxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB3aGljaCBwZWVycyBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kUGVlcnMoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY2xpZW50LnNvY2tldC5icm9hZGNhc3QuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIGFsbCBjbGllbnQgb2YgZ2l2ZW4gYGNsaWVudFR5cGVgIG9yIGBjbGllbnRUeXBlYHMuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBtZXNzYWdlIGlzIHNlbnQgdG8gYWxsIGNsaWVudHNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGNsaWVudFR5cGUgLSBUaGUgYGNsaWVudFR5cGVgKHMpIHRoYXQgbXVzdCByZWNlaXZlIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgbGV0IG5hbWVzcGFjZXM7XG5cbiAgICBpZiAodHlwZW9mIGNsaWVudFR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lc3BhY2VzID0gWycvJyArIGNsaWVudFR5cGUucmVwbGFjZSh0aGlzLl9uc3BQcmVmaXgsICcnKV07XG4gICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGNsaWVudFR5cGUpKSB7XG4gICAgICBuYW1lc3BhY2VzID0gY2xpZW50VHlwZS5tYXAoKHR5cGUpID0+IHtcbiAgICAgICAgcmV0dXJuICcvJyArIHR5cGUucmVwbGFjZSh0aGlzLl9uc3BQcmVmaXgsICcnKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lc3BhY2VzID0gT2JqZWN0LmtleXModGhpcy5pby5uc3BzKTtcbiAgICB9XG5cbiAgICBuYW1lc3BhY2VzLmZvckVhY2goKG5zcCkgPT4geyB0aGlzLmlvLm9mKG5zcCkuZW1pdChjaGFubmVsLCAuLi5hcmdzKTsgfSk7XG4gIH0sXG59O1xuIl19
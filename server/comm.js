'use strict';

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  initialize: function initialize(io) {
    this.io = io;
    this._nspPrefix = /^\//;
  },

  receive: function receive(client, channel, callback) {
    client.socket.on(channel, callback);
  },

  send: function send(client, channel) {
    var _client$socket;

    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    (_client$socket = client.socket).emit.apply(_client$socket, [channel].concat(args));
  },

  // sendPeers
  sendPeers: function sendPeers(client, channel) {
    var _client$socket$broadcast;

    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    (_client$socket$broadcast = client.socket.broadcast).emit.apply(_client$socket$broadcast, [channel].concat(args));
  },

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O3FCQUNlOztBQUViLFlBQVUsRUFBQSxvQkFBQyxFQUFFLEVBQUU7QUFDYixRQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0dBQ3pCOztBQUVELFNBQU8sRUFBQSxpQkFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNqQyxVQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDckM7O0FBRUQsTUFBSSxFQUFBLGNBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVzs7O3NDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDM0Isc0JBQUEsTUFBTSxDQUFDLE1BQU0sRUFBQyxJQUFJLE1BQUEsa0JBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO0dBQ3RDOzs7QUFHRCxXQUFTLEVBQUEsbUJBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVzs7O3VDQUFOLElBQUk7QUFBSixVQUFJOzs7QUFDaEMsZ0NBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUMsSUFBSSxNQUFBLDRCQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUNoRDs7QUFFRCxXQUFTLEVBQUEsbUJBQUMsVUFBVSxFQUFFLE9BQU8sRUFBVzt1Q0FBTixJQUFJO0FBQUosVUFBSTs7Ozs7QUFDcEMsUUFBSSxVQUFVLFlBQUEsQ0FBQzs7QUFFZixRQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtBQUNsQyxnQkFBVSxHQUFHLENBQUMsR0FBRyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQzlELE1BQU0sSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFO0FBQ3BDLGdCQUFVLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQUksRUFBSztBQUNwQyxlQUFPLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQUssVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQ2hELENBQUMsQ0FBQztLQUNKLE1BQU07QUFDTCxnQkFBVSxHQUFHLGFBQVksSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4Qzs7QUFFRCxjQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLOzs7QUFBRSxnQkFBQSxNQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUMsSUFBSSxNQUFBLFVBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO0tBQUUsQ0FBQyxDQUFDO0dBQzFFOztDQUVGIiwiZmlsZSI6InNyYy9zZXJ2ZXIvY29tbS5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuZXhwb3J0IGRlZmF1bHQge1xuXG4gIGluaXRpYWxpemUoaW8pIHtcbiAgICB0aGlzLmlvID0gaW87XG4gICAgdGhpcy5fbnNwUHJlZml4ID0gL15cXC8vO1xuICB9LFxuXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNsaWVudC5zb2NrZXQub24oY2hhbm5lbCwgY2FsbGJhY2spO1xuICB9LFxuXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY2xpZW50LnNvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIC8vIHNlbmRQZWVyc1xuICBzZW5kUGVlcnMoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY2xpZW50LnNvY2tldC5icm9hZGNhc3QuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGxldCBuYW1lc3BhY2VzO1xuXG4gICAgaWYgKHR5cGVvZiBjbGllbnRUeXBlID09PSAnc3RyaW5nJykge1xuICAgICAgbmFtZXNwYWNlcyA9IFsnLycgKyBjbGllbnRUeXBlLnJlcGxhY2UodGhpcy5fbnNwUHJlZml4LCAnJyldO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShjbGllbnRUeXBlKSkge1xuICAgICAgbmFtZXNwYWNlcyA9IGNsaWVudFR5cGUubWFwKCh0eXBlKSA9PiB7XG4gICAgICAgIHJldHVybiAnLycgKyB0eXBlLnJlcGxhY2UodGhpcy5fbnNwUHJlZml4LCAnJyk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXNwYWNlcyA9IE9iamVjdC5rZXlzKHRoaXMuaW8ubnNwcyk7XG4gICAgfVxuXG4gICAgbmFtZXNwYWNlcy5mb3JFYWNoKChuc3ApID0+IHsgdGhpcy5pby5vZihuc3ApLmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7IH0pO1xuICB9LFxuXG59OyJdfQ==
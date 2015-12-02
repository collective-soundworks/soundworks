"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {

  initialize: function initialize(io) {
    this.io = io;
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
    var _io$of;

    for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
      args[_key3 - 2] = arguments[_key3];
    }

    (_io$of = this.io.of("/" + clientType)).emit.apply(_io$of, [channel].concat(args));
  }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztxQkFDZTs7QUFFYixZQUFVLEVBQUEsb0JBQUMsRUFBRSxFQUFFO0FBQ2IsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7R0FDZDs7QUFFRCxTQUFPLEVBQUEsaUJBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDakMsVUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDOztBQUVELE1BQUksRUFBQSxjQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7OztzQ0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQzNCLHNCQUFBLE1BQU0sQ0FBQyxNQUFNLEVBQUMsSUFBSSxNQUFBLGtCQUFDLE9BQU8sU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUN0Qzs7O0FBR0QsV0FBUyxFQUFBLG1CQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7Ozt1Q0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQ2hDLGdDQUFBLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFDLElBQUksTUFBQSw0QkFBQyxPQUFPLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDaEQ7O0FBRUQsV0FBUyxFQUFBLG1CQUFDLFVBQVUsRUFBRSxPQUFPLEVBQVc7Ozt1Q0FBTixJQUFJO0FBQUosVUFBSTs7O0FBQ3BDLGNBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQUssVUFBVSxDQUFHLEVBQUMsSUFBSSxNQUFBLFVBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO0dBQ3JEO0NBQ0YiLCJmaWxlIjoic3JjL3NlcnZlci9jb21tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgaW5pdGlhbGl6ZShpbykge1xuICAgIHRoaXMuaW8gPSBpbztcbiAgfSxcblxuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjbGllbnQuc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfSxcblxuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNsaWVudC5zb2NrZXQuZW1pdChjaGFubmVsLCAuLi5hcmdzKTtcbiAgfSxcblxuICAvLyBzZW5kUGVlcnNcbiAgc2VuZFBlZXJzKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNsaWVudC5zb2NrZXQuYnJvYWRjYXN0LmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gIH0sXG5cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICB0aGlzLmlvLm9mKGAvJHtjbGllbnRUeXBlfWApLmVtaXQoY2hhbm5lbCwgLi4uYXJncyk7XG4gIH0sXG59OyJdfQ==
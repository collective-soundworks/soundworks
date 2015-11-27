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

  send: function send(msg) {
    var _socket;

    if (!this._socket) {
      return;
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_socket = this._socket).emit.apply(_socket, [msg].concat(args));
  },

  receive: function receive(msg, callback) {
    if (!this._socket) {
      return;
    }

    this._socket.removeListener(msg, callback);
    this._socket.on(msg, callback);
  },

  removeListener: function removeListener(msg, callback) {
    if (!this._socket) {
      return;
    }

    this._socket.removeListener(msg, callback);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvUGxhdGZvcm0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OEJBQWUsa0JBQWtCOzs7O3FCQUVsQjtBQUNiLFNBQU8sRUFBRSxJQUFJOztBQUViLFlBQVUsRUFBQSxvQkFBQyxVQUFVLEVBQUUsT0FBTyxFQUFFO0FBQzlCLFFBQU0sU0FBUyxHQUFNLE9BQU8sQ0FBQyxTQUFTLFNBQUksVUFBVSxBQUFFLENBQUM7O0FBRXZELFFBQUksQ0FBQyxPQUFPLEdBQUcsaUNBQUcsU0FBUyxFQUFFO0FBQzNCLGdCQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7S0FDL0IsQ0FBQyxDQUFDOztBQUVILFdBQU8sSUFBSSxDQUFDO0dBQ2I7O0FBRUQsTUFBSSxFQUFBLGNBQUMsR0FBRyxFQUFXOzs7QUFDakIsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFBRSxhQUFPO0tBQUU7O3NDQURuQixJQUFJO0FBQUosVUFBSTs7O0FBR2YsZUFBQSxJQUFJLENBQUMsT0FBTyxFQUFDLElBQUksTUFBQSxXQUFDLEdBQUcsU0FBSyxJQUFJLEVBQUMsQ0FBQztHQUNqQzs7QUFFRCxTQUFPLEVBQUEsaUJBQUMsR0FBRyxFQUFFLFFBQVEsRUFBRTtBQUNyQixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUFFLGFBQU87S0FBRTs7QUFFOUIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLFFBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUNoQzs7QUFFRCxnQkFBYyxFQUFBLHdCQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDNUIsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFBRSxhQUFPO0tBQUU7O0FBRTlCLFFBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztHQUM1QztDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvUGxhdGZvcm0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgaW8gZnJvbSAnc29ja2V0LmlvLWNsaWVudCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgX3NvY2tldDogbnVsbCxcblxuICBpbml0aWFsaXplKGNsaWVudFR5cGUsIG9wdGlvbnMpIHtcbiAgICBjb25zdCBzb2NrZXRVcmwgPSBgJHtvcHRpb25zLnNvY2tldFVybH0vJHtjbGllbnRUeXBlfWA7XG5cbiAgICB0aGlzLl9zb2NrZXQgPSBpbyhzb2NrZXRVcmwsIHtcbiAgICAgIHRyYW5zcG9ydHM6IG9wdGlvbnMudHJhbnNwb3J0cyxcbiAgICB9KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuXG4gIHNlbmQobXNnLCAuLi5hcmdzKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9zb2NrZXQuZW1pdChtc2csIC4uLmFyZ3MpO1xuICB9LFxuXG4gIHJlY2VpdmUobXNnLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fc29ja2V0KSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fc29ja2V0LnJlbW92ZUxpc3RlbmVyKG1zZywgY2FsbGJhY2spO1xuICAgIHRoaXMuX3NvY2tldC5vbihtc2csIGNhbGxiYWNrKTtcbiAgfSxcblxuICByZW1vdmVMaXN0ZW5lcihtc2csIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9zb2NrZXQucmVtb3ZlTGlzdGVuZXIobXNnLCBjYWxsYmFjayk7XG4gIH1cbn07XG4iXX0=
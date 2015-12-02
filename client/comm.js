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

  send: function send(channel) {
    var _socket;

    if (!this._socket) {
      return;
    }

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    (_socket = this._socket).emit.apply(_socket, [channel].concat(args));
  },

  receive: function receive(channel, callback) {
    if (!this._socket) {
      return;
    }

    this._socket.removeListener(channel, callback);
    this._socket.on(channel, callback);
  },

  removeListener: function removeListener(channel, callback) {
    if (!this._socket) {
      return;
    }

    this._socket.removeListener(channel, callback);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29tbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs4QkFBZSxrQkFBa0I7Ozs7cUJBRWxCO0FBQ2IsU0FBTyxFQUFFLElBQUk7O0FBRWIsWUFBVSxFQUFBLG9CQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7QUFDOUIsUUFBTSxTQUFTLEdBQU0sT0FBTyxDQUFDLFNBQVMsU0FBSSxVQUFVLEFBQUUsQ0FBQzs7QUFFdkQsUUFBSSxDQUFDLE9BQU8sR0FBRyxpQ0FBRyxTQUFTLEVBQUU7QUFDM0IsZ0JBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtLQUMvQixDQUFDLENBQUM7O0FBRUgsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxNQUFJLEVBQUEsY0FBQyxPQUFPLEVBQVc7OztBQUNyQixRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUFFLGFBQU87S0FBRTs7c0NBRGYsSUFBSTtBQUFKLFVBQUk7OztBQUduQixlQUFBLElBQUksQ0FBQyxPQUFPLEVBQUMsSUFBSSxNQUFBLFdBQUMsT0FBTyxTQUFLLElBQUksRUFBQyxDQUFDO0dBQ3JDOztBQUVELFNBQU8sRUFBQSxpQkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3pCLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQUUsYUFBTztLQUFFOztBQUU5QixRQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDL0MsUUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ3BDOztBQUVELGdCQUFjLEVBQUEsd0JBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNoQyxRQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUFFLGFBQU87S0FBRTs7QUFFOUIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ2hEO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9jb21tLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGlvIGZyb20gJ3NvY2tldC5pby1jbGllbnQnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIF9zb2NrZXQ6IG51bGwsXG5cbiAgaW5pdGlhbGl6ZShjbGllbnRUeXBlLCBvcHRpb25zKSB7XG4gICAgY29uc3Qgc29ja2V0VXJsID0gYCR7b3B0aW9ucy5zb2NrZXRVcmx9LyR7Y2xpZW50VHlwZX1gO1xuXG4gICAgdGhpcy5fc29ja2V0ID0gaW8oc29ja2V0VXJsLCB7XG4gICAgICB0cmFuc3BvcnRzOiBvcHRpb25zLnRyYW5zcG9ydHMsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcblxuICBzZW5kKGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3NvY2tldC5lbWl0KGNoYW5uZWwsIC4uLmFyZ3MpO1xuICB9LFxuXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3NvY2tldC5yZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjayk7XG4gICAgdGhpcy5fc29ja2V0Lm9uKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfSxcblxuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGlmICghdGhpcy5fc29ja2V0KSB7IHJldHVybjsgfVxuXG4gICAgdGhpcy5fc29ja2V0LnJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxufTtcbiJdfQ==
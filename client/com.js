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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvY29tLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OzhCQUFlLGtCQUFrQjs7OztxQkFFbEI7QUFDYixTQUFPLEVBQUUsSUFBSTs7QUFFYixZQUFVLEVBQUEsb0JBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRTtBQUM5QixRQUFNLFNBQVMsR0FBTSxPQUFPLENBQUMsU0FBUyxTQUFJLFVBQVUsQUFBRSxDQUFDOztBQUV2RCxRQUFJLENBQUMsT0FBTyxHQUFHLGlDQUFHLFNBQVMsRUFBRTtBQUMzQixnQkFBVSxFQUFFLE9BQU8sQ0FBQyxVQUFVO0tBQy9CLENBQUMsQ0FBQzs7QUFFSCxXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELE1BQUksRUFBQSxjQUFDLEdBQUcsRUFBVzs7O0FBQ2pCLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQUUsYUFBTztLQUFFOztzQ0FEbkIsSUFBSTtBQUFKLFVBQUk7OztBQUdmLGVBQUEsSUFBSSxDQUFDLE9BQU8sRUFBQyxJQUFJLE1BQUEsV0FBQyxHQUFHLFNBQUssSUFBSSxFQUFDLENBQUM7R0FDakM7O0FBRUQsU0FBTyxFQUFBLGlCQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDckIsUUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7QUFBRSxhQUFPO0tBQUU7O0FBRTlCLFFBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMzQyxRQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDaEM7O0FBRUQsZ0JBQWMsRUFBQSx3QkFBQyxHQUFHLEVBQUUsUUFBUSxFQUFFO0FBQzVCLFFBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQUUsYUFBTztLQUFFOztBQUU5QixRQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7R0FDNUM7Q0FDRiIsImZpbGUiOiJzcmMvY2xpZW50L2NvbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBpbyBmcm9tICdzb2NrZXQuaW8tY2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBfc29ja2V0OiBudWxsLFxuXG4gIGluaXRpYWxpemUoY2xpZW50VHlwZSwgb3B0aW9ucykge1xuICAgIGNvbnN0IHNvY2tldFVybCA9IGAke29wdGlvbnMuc29ja2V0VXJsfS8ke2NsaWVudFR5cGV9YDtcblxuICAgIHRoaXMuX3NvY2tldCA9IGlvKHNvY2tldFVybCwge1xuICAgICAgdHJhbnNwb3J0czogb3B0aW9ucy50cmFuc3BvcnRzLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG5cbiAgc2VuZChtc2csIC4uLmFyZ3MpIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3NvY2tldC5lbWl0KG1zZywgLi4uYXJncyk7XG4gIH0sXG5cbiAgcmVjZWl2ZShtc2csIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9zb2NrZXQpIHsgcmV0dXJuOyB9XG5cbiAgICB0aGlzLl9zb2NrZXQucmVtb3ZlTGlzdGVuZXIobXNnLCBjYWxsYmFjayk7XG4gICAgdGhpcy5fc29ja2V0Lm9uKG1zZywgY2FsbGJhY2spO1xuICB9LFxuXG4gIHJlbW92ZUxpc3RlbmVyKG1zZywgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX3NvY2tldCkgeyByZXR1cm47IH1cblxuICAgIHRoaXMuX3NvY2tldC5yZW1vdmVMaXN0ZW5lcihtc2csIGNhbGxiYWNrKTtcbiAgfVxufTtcbiJdfQ==
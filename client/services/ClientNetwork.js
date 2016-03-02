/**
 * @todo
 * A generic service for inter-client communications (based on client.type)
 * without server side custom code
 */

'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _coreService = require('../core/Service');

var _coreService2 = _interopRequireDefault(_coreService);

var _coreServiceManager = require('../core/serviceManager');

var _coreServiceManager2 = _interopRequireDefault(_coreServiceManager);

var SERVICE_ID = 'service:network';

var ClientNetwork = (function (_Service) {
  _inherits(ClientNetwork, _Service);

  function ClientNetwork() {
    _classCallCheck(this, ClientNetwork);

    _get(Object.getPrototypeOf(ClientNetwork.prototype), 'constructor', this).call(this, SERVICE_ID, true);

    var defaults = {};
    this.configure(defaults);

    this._listeners = {};
  }

  _createClass(ClientNetwork, [{
    key: 'start',
    value: function start() {
      var _this = this;

      _get(Object.getPrototypeOf(ClientNetwork.prototype), 'start', this).call(this);

      // common logic for receivers
      _get(Object.getPrototypeOf(ClientNetwork.prototype), 'receive', this).call(this, 'receive', function () {
        for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
          values[_key] = arguments[_key];
        }

        var channel = values.shift();
        var listeners = _this._listeners[channel];

        if (Array.isArray(listeners)) listeners.forEach(function (callback) {
          return callback.apply(undefined, values);
        });
      });

      this.ready();
    }
  }, {
    key: 'send',
    value: function send(clientTypes, channel) {
      for (var _len2 = arguments.length, values = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        values[_key2 - 2] = arguments[_key2];
      }

      values.unshift(clientTypes, channel);
      _get(Object.getPrototypeOf(ClientNetwork.prototype), 'send', this).call(this, 'send', values);
    }
  }, {
    key: 'broadcast',
    value: function broadcast(channel) {
      for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        values[_key3 - 1] = arguments[_key3];
      }

      values.unshift(channel);
      _get(Object.getPrototypeOf(ClientNetwork.prototype), 'send', this).call(this, 'broadcast', values);
    }
  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      if (!this._listeners[channel]) this._listeners[channel] = [];

      this._listeners[channel].push(callback);
    }
  }, {
    key: 'removeListener',
    value: function removeListener(channel, callback) {
      var listeners = this._listeners[channel];

      if (Array.isArray(listeners)) {
        var index = listeners.indexOf(callback);

        if (index !== -1) listeners.splice(index, 1);
      }
    }
  }]);

  return ClientNetwork;
})(_coreService2['default']);

_coreServiceManager2['default'].register(SERVICE_ID, ClientNetwork);

exports['default'] = ClientNetwork;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvY2xpZW50L3NlcnZpY2VzL0NsaWVudE5ldHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFNb0IsaUJBQWlCOzs7O2tDQUNWLHdCQUF3Qjs7OztBQUVuRCxJQUFNLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQzs7SUFFL0IsYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLEdBQ0g7MEJBRFYsYUFBYTs7QUFFZiwrQkFGRSxhQUFhLDZDQUVULFVBQVUsRUFBRSxJQUFJLEVBQUU7O0FBRXhCLFFBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNwQixRQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUV6QixRQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUN0Qjs7ZUFSRyxhQUFhOztXQVVaLGlCQUFHOzs7QUFDTixpQ0FYRSxhQUFhLHVDQVdEOzs7QUFHZCxpQ0FkRSxhQUFhLHlDQWNELFNBQVMsRUFBRSxZQUFlOzBDQUFYLE1BQU07QUFBTixnQkFBTTs7O0FBQ2pDLFlBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMvQixZQUFNLFNBQVMsR0FBRyxNQUFLLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFM0MsWUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUMxQixTQUFTLENBQUMsT0FBTyxDQUFDLFVBQUMsUUFBUTtpQkFBSyxRQUFRLGtCQUFJLE1BQU0sQ0FBQztTQUFBLENBQUMsQ0FBQztPQUN4RCxFQUFFOztBQUVILFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOzs7V0FFRyxjQUFDLFdBQVcsRUFBRSxPQUFPLEVBQWE7eUNBQVIsTUFBTTtBQUFOLGNBQU07OztBQUNsQyxZQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyQyxpQ0EzQkUsYUFBYSxzQ0EyQkosTUFBTSxFQUFFLE1BQU0sRUFBRTtLQUM1Qjs7O1dBRVEsbUJBQUMsT0FBTyxFQUFhO3lDQUFSLE1BQU07QUFBTixjQUFNOzs7QUFDMUIsWUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN4QixpQ0FoQ0UsYUFBYSxzQ0FnQ0osV0FBVyxFQUFFLE1BQU0sRUFBRTtLQUNqQzs7O1dBRU0saUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUN6QixVQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFDM0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRWhDLFVBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3pDOzs7V0FFYSx3QkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2hDLFVBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRTNDLFVBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRTtBQUM1QixZQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUUxQyxZQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFDZCxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztPQUM5QjtLQUNGOzs7U0FuREcsYUFBYTs7O0FBc0RuQixnQ0FBZSxRQUFRLENBQUMsVUFBVSxFQUFFLGFBQWEsQ0FBQyxDQUFDOztxQkFFcEMsYUFBYSIsImZpbGUiOiIvVXNlcnMvc2NobmVsbC9EZXZlbG9wbWVudC93ZWIvY29sbGVjdGl2ZS1zb3VuZHdvcmtzL3NvdW5kd29ya3Mvc3JjL2NsaWVudC9zZXJ2aWNlcy9DbGllbnROZXR3b3JrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdG9kb1xuICogQSBnZW5lcmljIHNlcnZpY2UgZm9yIGludGVyLWNsaWVudCBjb21tdW5pY2F0aW9ucyAoYmFzZWQgb24gY2xpZW50LnR5cGUpXG4gKiB3aXRob3V0IHNlcnZlciBzaWRlIGN1c3RvbSBjb2RlXG4gKi9cblxuaW1wb3J0IFNlcnZpY2UgZnJvbSAnLi4vY29yZS9TZXJ2aWNlJztcbmltcG9ydCBzZXJ2aWNlTWFuYWdlciBmcm9tICcuLi9jb3JlL3NlcnZpY2VNYW5hZ2VyJztcblxuY29uc3QgU0VSVklDRV9JRCA9ICdzZXJ2aWNlOm5ldHdvcmsnO1xuXG5jbGFzcyBDbGllbnROZXR3b3JrIGV4dGVuZHMgU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFNFUlZJQ0VfSUQsIHRydWUpO1xuXG4gICAgY29uc3QgZGVmYXVsdHMgPSB7fTtcbiAgICB0aGlzLmNvbmZpZ3VyZShkZWZhdWx0cyk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIHN1cGVyLnN0YXJ0KCk7XG5cbiAgICAvLyBjb21tb24gbG9naWMgZm9yIHJlY2VpdmVyc1xuICAgIHN1cGVyLnJlY2VpdmUoJ3JlY2VpdmUnLCAoLi4udmFsdWVzKSA9PiB7XG4gICAgICBjb25zdCBjaGFubmVsID0gdmFsdWVzLnNoaWZ0KCk7XG4gICAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF07XG5cbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVycykpXG4gICAgICAgIGxpc3RlbmVycy5mb3JFYWNoKChjYWxsYmFjaykgPT4gY2FsbGJhY2soLi4udmFsdWVzKSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnJlYWR5KCk7XG4gIH1cblxuICBzZW5kKGNsaWVudFR5cGVzLCBjaGFubmVsLCAuLi52YWx1ZXMpIHtcbiAgICB2YWx1ZXMudW5zaGlmdChjbGllbnRUeXBlcywgY2hhbm5lbCk7XG4gICAgc3VwZXIuc2VuZCgnc2VuZCcsIHZhbHVlcyk7XG4gIH1cblxuICBicm9hZGNhc3QoY2hhbm5lbCwgLi4udmFsdWVzKSB7XG4gICAgdmFsdWVzLnVuc2hpZnQoY2hhbm5lbCk7XG4gICAgc3VwZXIuc2VuZCgnYnJvYWRjYXN0JywgdmFsdWVzKTtcbiAgfVxuXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXSA9IFtdO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlTGlzdGVuZXIoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKSB7XG4gICAgICBjb25zdCBpbmRleCA9IGxpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKTtcblxuICAgICAgaWYgKGluZGV4ICE9PSAtMSlcbiAgICAgICAgbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG59XG5cbnNlcnZpY2VNYW5hZ2VyLnJlZ2lzdGVyKFNFUlZJQ0VfSUQsIENsaWVudE5ldHdvcmspO1xuXG5leHBvcnQgZGVmYXVsdCBDbGllbnROZXR3b3JrO1xuIl19
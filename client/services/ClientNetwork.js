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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TmV0d29yay5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzJCQU1vQixpQkFBaUI7Ozs7a0NBQ1Ysd0JBQXdCOzs7O0FBRW5ELElBQU0sVUFBVSxHQUFHLGlCQUFpQixDQUFDOztJQUUvQixhQUFhO1lBQWIsYUFBYTs7QUFDTixXQURQLGFBQWEsR0FDSDswQkFEVixhQUFhOztBQUVmLCtCQUZFLGFBQWEsNkNBRVQsVUFBVSxFQUFFLElBQUksRUFBRTs7QUFFeEIsUUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0dBQ3RCOztlQVJHLGFBQWE7O1dBVVosaUJBQUc7OztBQUNOLGlDQVhFLGFBQWEsdUNBV0Q7OztBQUdkLGlDQWRFLGFBQWEseUNBY0QsU0FBUyxFQUFFLFlBQWU7MENBQVgsTUFBTTtBQUFOLGdCQUFNOzs7QUFDakMsWUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0FBQy9CLFlBQU0sU0FBUyxHQUFHLE1BQUssVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUUzQyxZQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQzFCLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBQyxRQUFRO2lCQUFLLFFBQVEsa0JBQUksTUFBTSxDQUFDO1NBQUEsQ0FBQyxDQUFDO09BQ3hELEVBQUU7O0FBRUgsVUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ2Q7OztXQUVHLGNBQUMsV0FBVyxFQUFFLE9BQU8sRUFBYTt5Q0FBUixNQUFNO0FBQU4sY0FBTTs7O0FBQ2xDLFlBQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3JDLGlDQTNCRSxhQUFhLHNDQTJCSixNQUFNLEVBQUUsTUFBTSxFQUFFO0tBQzVCOzs7V0FFUSxtQkFBQyxPQUFPLEVBQWE7eUNBQVIsTUFBTTtBQUFOLGNBQU07OztBQUMxQixZQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3hCLGlDQWhDRSxhQUFhLHNDQWdDSixXQUFXLEVBQUUsTUFBTSxFQUFFO0tBQ2pDOzs7V0FFTSxpQkFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ3pCLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxFQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7QUFFaEMsVUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDekM7OztXQUVhLHdCQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDaEMsVUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFM0MsVUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO0FBQzVCLFlBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRTFDLFlBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUNkLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQzlCO0tBQ0Y7OztTQW5ERyxhQUFhOzs7QUFzRG5CLGdDQUFlLFFBQVEsQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLENBQUM7O3FCQUVwQyxhQUFhIiwiZmlsZSI6InNyYy9jbGllbnQvc2VydmljZXMvQ2xpZW50TmV0d29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQHRvZG9cbiAqIEEgZ2VuZXJpYyBzZXJ2aWNlIGZvciBpbnRlci1jbGllbnQgY29tbXVuaWNhdGlvbnMgKGJhc2VkIG9uIGNsaWVudC50eXBlKVxuICogd2l0aG91dCBzZXJ2ZXIgc2lkZSBjdXN0b20gY29kZVxuICovXG5cbmltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpuZXR3b3JrJztcblxuY2xhc3MgQ2xpZW50TmV0d29yayBleHRlbmRzIFNlcnZpY2Uge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBzdXBlci5zdGFydCgpO1xuXG4gICAgLy8gY29tbW9uIGxvZ2ljIGZvciByZWNlaXZlcnNcbiAgICBzdXBlci5yZWNlaXZlKCdyZWNlaXZlJywgKC4uLnZhbHVlcykgPT4ge1xuICAgICAgY29uc3QgY2hhbm5lbCA9IHZhbHVlcy5zaGlmdCgpO1xuICAgICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdO1xuXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMpKVxuICAgICAgICBsaXN0ZW5lcnMuZm9yRWFjaCgoY2FsbGJhY2spID0+IGNhbGxiYWNrKC4uLnZhbHVlcykpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5yZWFkeSgpO1xuICB9XG5cbiAgc2VuZChjbGllbnRUeXBlcywgY2hhbm5lbCwgLi4udmFsdWVzKSB7XG4gICAgdmFsdWVzLnVuc2hpZnQoY2xpZW50VHlwZXMsIGNoYW5uZWwpO1xuICAgIHN1cGVyLnNlbmQoJ3NlbmQnLCB2YWx1ZXMpO1xuICB9XG5cbiAgYnJvYWRjYXN0KGNoYW5uZWwsIC4uLnZhbHVlcykge1xuICAgIHZhbHVlcy51bnNoaWZ0KGNoYW5uZWwpO1xuICAgIHN1cGVyLnNlbmQoJ2Jyb2FkY2FzdCcsIHZhbHVlcyk7XG4gIH1cblxuICByZWNlaXZlKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgaWYgKCF0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF0pXG4gICAgICB0aGlzLl9saXN0ZW5lcnNbY2hhbm5lbF0gPSBbXTtcblxuICAgIHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXS5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUxpc3RlbmVyKGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdO1xuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkobGlzdGVuZXJzKSkge1xuICAgICAgY29uc3QgaW5kZXggPSBsaXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjayk7XG5cbiAgICAgIGlmIChpbmRleCAhPT0gLTEpXG4gICAgICAgIGxpc3RlbmVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxufVxuXG5zZXJ2aWNlTWFuYWdlci5yZWdpc3RlcihTRVJWSUNFX0lELCBDbGllbnROZXR3b3JrKTtcblxuZXhwb3J0IGRlZmF1bHQgQ2xpZW50TmV0d29yaztcbiJdfQ==
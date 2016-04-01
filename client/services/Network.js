'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Service2 = require('../core/Service');

var _Service3 = _interopRequireDefault(_Service2);

var _serviceManager = require('../core/serviceManager');

var _serviceManager2 = _interopRequireDefault(_serviceManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SERVICE_ID = 'service:network';

/**
 * Interface of the client `'network'` service.
 *
 * This service provides a generic way to create client to client communications
 * through websockets without server side custom code.
 *
 * __*The service must be used with its [server-side counterpart]{@link module:soundworks/server.Network}*__
 *
 * @memberof module:soundworks/client
 * @example
 * // inside the experience constructor
 * this.network = this.require('network');
 * // when the experience has started, listen for events
 * this.network.receive('my:channel', (...args) => {
 *   // do something with `args`
 * });
 * // somewhere in the experience
 * this.network.send('player', 'my:channel', 42, false);
 */

var Network = function (_Service) {
  (0, _inherits3.default)(Network, _Service);

  /** _<span class="warning">__WARNING__</span> This class should never be instanciated manually_ */

  function Network() {
    (0, _classCallCheck3.default)(this, Network);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Network).call(this, SERVICE_ID, true));

    var defaults = {};
    _this.configure(defaults);

    _this._listeners = {};
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(Network, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'start', this).call(this);

      // common logic for receivers
      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'receive', this).call(this, 'receive', function () {
        for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
          values[_key] = arguments[_key];
        }

        var channel = values.shift();
        var listeners = _this2._listeners[channel];

        if (Array.isArray(listeners)) listeners.forEach(function (callback) {
          return callback.apply(undefined, values);
        });
      });

      this.ready();
    }

    /**
     * Send a message to given client type(s).
     * @param {String|Arrayw<String>} clientTypes - Client type(s) to send the
     *  message to.
     * @param {String} channel - Channel of the message.
     * @param {...Mixed} values - Values to send in the message.
     */

  }, {
    key: 'send',
    value: function send(clientTypes, channel) {
      for (var _len2 = arguments.length, values = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        values[_key2 - 2] = arguments[_key2];
      }

      values.unshift(clientTypes, channel);
      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'send', this).call(this, 'send', values);
    }

    /**
     * Send a message to all connected clients.
     * @param {String} channel - Channel of the message.
     * @param {...Mixed} values - Values to send in the message.
     */

  }, {
    key: 'broadcast',
    value: function broadcast(channel) {
      for (var _len3 = arguments.length, values = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        values[_key3 - 1] = arguments[_key3];
      }

      values.unshift(channel);
      (0, _get3.default)((0, _getPrototypeOf2.default)(Network.prototype), 'send', this).call(this, 'broadcast', values);
    }

    /**
     * Register a callback to be executed when a message is received on a given
     * channel.
     * @param {String} channel - Channel to listen to.
     * @param {Function} callback - Function to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(channel, callback) {
      if (!this._listeners[channel]) this._listeners[channel] = [];

      this._listeners[channel].push(callback);
    }

    /**
     * Remove a callback from listening a given channel.
     * @param {String} channel - Channel to stop listening to.
     * @param {Function} callback - The previously registered callback function.
     */

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
  return Network;
}(_Service3.default);

_serviceManager2.default.register(SERVICE_ID, Network);

exports.default = Network;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIk5ldHdvcmsuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxhQUFhLGlCQUFiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lBcUJBOzs7OztBQUVKLFdBRkksT0FFSixHQUFjO3dDQUZWLFNBRVU7OzZGQUZWLG9CQUdJLFlBQVksT0FETjs7QUFHWixRQUFNLFdBQVcsRUFBWCxDQUhNO0FBSVosVUFBSyxTQUFMLENBQWUsUUFBZixFQUpZOztBQU1aLFVBQUssVUFBTCxHQUFrQixFQUFsQixDQU5ZOztHQUFkOzs7Ozs2QkFGSTs7NEJBWUk7OztBQUNOLHVEQWJFLDZDQWFGOzs7QUFETSx1REFaSixnREFnQlksV0FBVyxZQUFlOzBDQUFYOztTQUFXOztBQUN0QyxZQUFNLFVBQVUsT0FBTyxLQUFQLEVBQVYsQ0FEZ0M7QUFFdEMsWUFBTSxZQUFZLE9BQUssVUFBTCxDQUFnQixPQUFoQixDQUFaLENBRmdDOztBQUl0QyxZQUFJLE1BQU0sT0FBTixDQUFjLFNBQWQsQ0FBSixFQUNFLFVBQVUsT0FBVixDQUFrQixVQUFDLFFBQUQ7aUJBQWMsMEJBQVksTUFBWjtTQUFkLENBQWxCLENBREY7T0FKdUIsQ0FBekIsQ0FKTTs7QUFZTixXQUFLLEtBQUwsR0FaTTs7Ozs7Ozs7Ozs7Ozt5QkFzQkgsYUFBYSxTQUFvQjt5Q0FBUjs7T0FBUTs7QUFDcEMsYUFBTyxPQUFQLENBQWUsV0FBZixFQUE0QixPQUE1QixFQURvQztBQUVwQyx1REFwQ0UsNkNBb0NTLFFBQVEsT0FBbkIsQ0FGb0M7Ozs7Ozs7Ozs7OzhCQVU1QixTQUFvQjt5Q0FBUjs7T0FBUTs7QUFDNUIsYUFBTyxPQUFQLENBQWUsT0FBZixFQUQ0QjtBQUU1Qix1REE5Q0UsNkNBOENTLGFBQWEsT0FBeEIsQ0FGNEI7Ozs7Ozs7Ozs7Ozs0QkFXdEIsU0FBUyxVQUFVO0FBQ3pCLFVBQUksQ0FBQyxLQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBRCxFQUNGLEtBQUssVUFBTCxDQUFnQixPQUFoQixJQUEyQixFQUEzQixDQURGOztBQUdBLFdBQUssVUFBTCxDQUFnQixPQUFoQixFQUF5QixJQUF6QixDQUE4QixRQUE5QixFQUp5Qjs7Ozs7Ozs7Ozs7bUNBWVosU0FBUyxVQUFVO0FBQ2hDLFVBQU0sWUFBWSxLQUFLLFVBQUwsQ0FBZ0IsT0FBaEIsQ0FBWixDQUQwQjs7QUFHaEMsVUFBSSxNQUFNLE9BQU4sQ0FBYyxTQUFkLENBQUosRUFBOEI7QUFDNUIsWUFBTSxRQUFRLFVBQVUsT0FBVixDQUFrQixRQUFsQixDQUFSLENBRHNCOztBQUc1QixZQUFJLFVBQVUsQ0FBQyxDQUFELEVBQ1osVUFBVSxNQUFWLENBQWlCLEtBQWpCLEVBQXdCLENBQXhCLEVBREY7T0FIRjs7O1NBdEVFOzs7QUErRU4seUJBQWUsUUFBZixDQUF3QixVQUF4QixFQUFvQyxPQUFwQzs7a0JBRWUiLCJmaWxlIjoiTmV0d29yay5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBTZXJ2aWNlIGZyb20gJy4uL2NvcmUvU2VydmljZSc7XG5pbXBvcnQgc2VydmljZU1hbmFnZXIgZnJvbSAnLi4vY29yZS9zZXJ2aWNlTWFuYWdlcic7XG5cbmNvbnN0IFNFUlZJQ0VfSUQgPSAnc2VydmljZTpuZXR3b3JrJztcblxuLyoqXG4gKiBJbnRlcmZhY2Ugb2YgdGhlIGNsaWVudCBgJ25ldHdvcmsnYCBzZXJ2aWNlLlxuICpcbiAqIFRoaXMgc2VydmljZSBwcm92aWRlcyBhIGdlbmVyaWMgd2F5IHRvIGNyZWF0ZSBjbGllbnQgdG8gY2xpZW50IGNvbW11bmljYXRpb25zXG4gKiB0aHJvdWdoIHdlYnNvY2tldHMgd2l0aG91dCBzZXJ2ZXIgc2lkZSBjdXN0b20gY29kZS5cbiAqXG4gKiBfXypUaGUgc2VydmljZSBtdXN0IGJlIHVzZWQgd2l0aCBpdHMgW3NlcnZlci1zaWRlIGNvdW50ZXJwYXJ0XXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9zZXJ2ZXIuTmV0d29ya30qX19cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKiBAZXhhbXBsZVxuICogLy8gaW5zaWRlIHRoZSBleHBlcmllbmNlIGNvbnN0cnVjdG9yXG4gKiB0aGlzLm5ldHdvcmsgPSB0aGlzLnJlcXVpcmUoJ25ldHdvcmsnKTtcbiAqIC8vIHdoZW4gdGhlIGV4cGVyaWVuY2UgaGFzIHN0YXJ0ZWQsIGxpc3RlbiBmb3IgZXZlbnRzXG4gKiB0aGlzLm5ldHdvcmsucmVjZWl2ZSgnbXk6Y2hhbm5lbCcsICguLi5hcmdzKSA9PiB7XG4gKiAgIC8vIGRvIHNvbWV0aGluZyB3aXRoIGBhcmdzYFxuICogfSk7XG4gKiAvLyBzb21ld2hlcmUgaW4gdGhlIGV4cGVyaWVuY2VcbiAqIHRoaXMubmV0d29yay5zZW5kKCdwbGF5ZXInLCAnbXk6Y2hhbm5lbCcsIDQyLCBmYWxzZSk7XG4gKi9cbmNsYXNzIE5ldHdvcmsgZXh0ZW5kcyBTZXJ2aWNlIHtcbiAgLyoqIF88c3BhbiBjbGFzcz1cIndhcm5pbmdcIj5fX1dBUk5JTkdfXzwvc3Bhbj4gVGhpcyBjbGFzcyBzaG91bGQgbmV2ZXIgYmUgaW5zdGFuY2lhdGVkIG1hbnVhbGx5XyAqL1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihTRVJWSUNFX0lELCB0cnVlKTtcblxuICAgIGNvbnN0IGRlZmF1bHRzID0ge307XG4gICAgdGhpcy5jb25maWd1cmUoZGVmYXVsdHMpO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgc3RhcnQoKSB7XG4gICAgc3VwZXIuc3RhcnQoKTtcblxuICAgIC8vIGNvbW1vbiBsb2dpYyBmb3IgcmVjZWl2ZXJzXG4gICAgc3VwZXIucmVjZWl2ZSgncmVjZWl2ZScsICguLi52YWx1ZXMpID0+IHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSB2YWx1ZXMuc2hpZnQoKTtcbiAgICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXTtcblxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkobGlzdGVuZXJzKSlcbiAgICAgICAgbGlzdGVuZXJzLmZvckVhY2goKGNhbGxiYWNrKSA9PiBjYWxsYmFjayguLi52YWx1ZXMpKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVhZHkoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kIGEgbWVzc2FnZSB0byBnaXZlbiBjbGllbnQgdHlwZShzKS5cbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl3PFN0cmluZz59IGNsaWVudFR5cGVzIC0gQ2xpZW50IHR5cGUocykgdG8gc2VuZCB0aGVcbiAgICogIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCBvZiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHsuLi5NaXhlZH0gdmFsdWVzIC0gVmFsdWVzIHRvIHNlbmQgaW4gdGhlIG1lc3NhZ2UuXG4gICAqL1xuICBzZW5kKGNsaWVudFR5cGVzLCBjaGFubmVsLCAuLi52YWx1ZXMpIHtcbiAgICB2YWx1ZXMudW5zaGlmdChjbGllbnRUeXBlcywgY2hhbm5lbCk7XG4gICAgc3VwZXIuc2VuZCgnc2VuZCcsIHZhbHVlcyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZCBhIG1lc3NhZ2UgdG8gYWxsIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIENoYW5uZWwgb2YgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Li4uTWl4ZWR9IHZhbHVlcyAtIFZhbHVlcyB0byBzZW5kIGluIHRoZSBtZXNzYWdlLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNoYW5uZWwsIC4uLnZhbHVlcykge1xuICAgIHZhbHVlcy51bnNoaWZ0KGNoYW5uZWwpO1xuICAgIHN1cGVyLnNlbmQoJ2Jyb2FkY2FzdCcsIHZhbHVlcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBjYWxsYmFjayB0byBiZSBleGVjdXRlZCB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZCBvbiBhIGdpdmVuXG4gICAqIGNoYW5uZWwuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gQ2hhbm5lbCB0byBsaXN0ZW4gdG8uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBpZiAoIXRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXSlcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXSA9IFtdO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzW2NoYW5uZWxdLnB1c2goY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhIGNhbGxiYWNrIGZyb20gbGlzdGVuaW5nIGEgZ2l2ZW4gY2hhbm5lbC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBDaGFubmVsIHRvIHN0b3AgbGlzdGVuaW5nIHRvLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgY2FsbGJhY2sgZnVuY3Rpb24uXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVyc1tjaGFubmVsXTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KGxpc3RlbmVycykpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gbGlzdGVuZXJzLmluZGV4T2YoY2FsbGJhY2spO1xuXG4gICAgICBpZiAoaW5kZXggIT09IC0xKVxuICAgICAgICBsaXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cblxuc2VydmljZU1hbmFnZXIucmVnaXN0ZXIoU0VSVklDRV9JRCwgTmV0d29yayk7XG5cbmV4cG9ydCBkZWZhdWx0IE5ldHdvcms7XG4iXX0=
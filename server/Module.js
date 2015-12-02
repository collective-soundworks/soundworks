// @todo - remove EventEmitter? (Implement our own listeners)
'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _comm = require('./comm');

var _comm2 = _interopRequireDefault(_comm);

var _events = require('events');

/**
 * The {@link Module} base class is used to create a *Soundworks* module on the server side.
 * Each module should have a {@link Module#connect} and a {@link Module#disconnect} method.
 * Any module mapped to the type of client `clientType` (thanks to the {@link server#map} method) would call its {@link Module#connect} method when such a client connects to the server, and its {@link Module#disconnect} method when such a client disconnects from the server.
 * @example
 * class MyModule extends serverSide.Module {
 *   constructor('my-module-name') {
 *     ... // anything the constructor needs
 *   }
 *
 *   connect(client) {
 *     ... // what the module has to do when a client connects to the server
 *   }
 *
 *   disconnect(client) {
 *     ... // what the module has to do when a client disconnects from the server
 *   }
 * }
 */

var Module = (function (_EventEmitter) {
  _inherits(Module, _EventEmitter);

  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] The options.
    * @param {string} [options.name='unnamed'] The name of the module.
   */

  function Module(name) {
    _classCallCheck(this, Module);

    _get(Object.getPrototypeOf(Module.prototype), 'constructor', this).call(this);
    /**
     * The name of the module.
     * @type {string}
     */
    this.name = name;
  }

  /**
   * Called when the `client` connects to the server.
   * This method should handle the logic of the module on the server side. For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {ModuleClient} client The connected client.
   */

  _createClass(Module, [{
    key: 'connect',
    value: function connect(client) {
      // Setup an object
      client.modules[this.name] = {};
    }

    /**
     * Called when the client `client` disconnects from the server.
     * This method should handle the logic when that happens. For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
     * @param {ModuleClient} client The disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {}
    // delete client.modules[this.name] // TODO?

    // -- receive something from a client

  }, {
    key: 'receive',
    value: function receive(client, channel, callback) {
      var namespacedChannel = this.name + ':' + channel;
      _comm2['default'].receive(client, namespacedChannel, callback);
    }

    // -- send something to a client type
  }, {
    key: 'send',
    value: function send(client, channel) {
      var namespacedChannel = this.name + ':' + channel;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      _comm2['default'].send.apply(_comm2['default'], [client, namespacedChannel].concat(args));
    }

    // -- send something to all clients of the same type as `client`
  }, {
    key: 'sendPeers',
    value: function sendPeers(client, channel) {
      var namespacedChannel = this.name + ':' + channel;

      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      _comm2['default'].sendPeers.apply(_comm2['default'], [client, namespacedChannel].concat(args));
    }

    // -- send something to all clients of a given type
  }, {
    key: 'broadcast',
    value: function broadcast(clientType, channel) {
      var namespacedChannel = this.name + ':' + channel;

      for (var _len3 = arguments.length, args = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      _comm2['default'].broadcast.apply(_comm2['default'], [clientType, namespacedChannel].concat(args));
    }
  }]);

  return Module;
})(_events.EventEmitter);

exports['default'] = Module;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUNpQixRQUFROzs7O3NCQUNJLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQmhCLE1BQU07WUFBTixNQUFNOzs7Ozs7OztBQU1kLFdBTlEsTUFBTSxDQU1iLElBQUksRUFBRTswQkFOQyxNQUFNOztBQU92QiwrQkFQaUIsTUFBTSw2Q0FPZjs7Ozs7QUFLUixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNsQjs7Ozs7Ozs7ZUFia0IsTUFBTTs7V0FvQmxCLGlCQUFDLE1BQU0sRUFBRTs7QUFFZCxZQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDaEM7Ozs7Ozs7OztXQU9TLG9CQUFDLE1BQU0sRUFBRSxFQUVsQjs7OztBQUFBOzs7V0FHTSxpQkFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNqQyxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxJQUFJLFNBQUksT0FBTyxBQUFFLENBQUM7QUFDcEQsd0JBQUssT0FBTyxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNuRDs7Ozs7V0FHRyxjQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7QUFDN0IsVUFBTSxpQkFBaUIsR0FBTSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzt3Q0FEN0IsSUFBSTtBQUFKLFlBQUk7OztBQUUzQix3QkFBSyxJQUFJLE1BQUEscUJBQUMsTUFBTSxFQUFFLGlCQUFpQixTQUFLLElBQUksRUFBQyxDQUFDO0tBQy9DOzs7OztXQUdRLG1CQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7QUFDbEMsVUFBTSxpQkFBaUIsR0FBTSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzt5Q0FEeEIsSUFBSTtBQUFKLFlBQUk7OztBQUVoQyx3QkFBSyxTQUFTLE1BQUEscUJBQUMsTUFBTSxFQUFFLGlCQUFpQixTQUFLLElBQUksRUFBQyxDQUFDO0tBQ3BEOzs7OztXQUdRLG1CQUFDLFVBQVUsRUFBRSxPQUFPLEVBQVc7QUFDdEMsVUFBTSxpQkFBaUIsR0FBTSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzt5Q0FEcEIsSUFBSTtBQUFKLFlBQUk7OztBQUVwQyx3QkFBSyxTQUFTLE1BQUEscUJBQUMsVUFBVSxFQUFFLGlCQUFpQixTQUFLLElBQUksRUFBQyxDQUFDO0tBQ3hEOzs7U0F4RGtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6InNyYy9zZXJ2ZXIvTW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRvZG8gLSByZW1vdmUgRXZlbnRFbWl0dGVyPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKlxuICogVGhlIHtAbGluayBNb2R1bGV9IGJhc2UgY2xhc3MgaXMgdXNlZCB0byBjcmVhdGUgYSAqU291bmR3b3JrcyogbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBoYXZlIGEge0BsaW5rIE1vZHVsZSNjb25uZWN0fSBhbmQgYSB7QGxpbmsgTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZC5cbiAqIEFueSBtb2R1bGUgbWFwcGVkIHRvIHRoZSB0eXBlIG9mIGNsaWVudCBgY2xpZW50VHlwZWAgKHRoYW5rcyB0byB0aGUge0BsaW5rIHNlcnZlciNtYXB9IG1ldGhvZCkgd291bGQgY2FsbCBpdHMge0BsaW5rIE1vZHVsZSNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIGFuZCBpdHMge0BsaW5rIE1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBNeU1vZHVsZSBleHRlbmRzIHNlcnZlclNpZGUuTW9kdWxlIHtcbiAqICAgY29uc3RydWN0b3IoJ215LW1vZHVsZS1uYW1lJykge1xuICogICAgIC4uLiAvLyBhbnl0aGluZyB0aGUgY29uc3RydWN0b3IgbmVlZHNcbiAqICAgfVxuICpcbiAqICAgY29ubmVjdChjbGllbnQpIHtcbiAqICAgICAuLi4gLy8gd2hhdCB0aGUgbW9kdWxlIGhhcyB0byBkbyB3aGVuIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXJcbiAqICAgfVxuICpcbiAqICAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAqICAgICAuLi4gLy8gd2hhdCB0aGUgbW9kdWxlIGhhcyB0byBkbyB3aGVuIGEgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlclxuICogICB9XG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZHVsZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWU9J3VubmFtZWQnXSBUaGUgbmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBjbGllbnRgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIG9mIHRoZSBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlLiBGb3IgaW5zdGFuY2UsIGl0IGNhbiB0YWtlIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGJ5IHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzIGFuZCBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcywgb3IgaXQgY2FuIGFkZCB0aGUgY2xpZW50IHRvIGEgbGlzdCB0byBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7TW9kdWxlQ2xpZW50fSBjbGllbnQgVGhlIGNvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIFNldHVwIGFuIG9iamVjdFxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGBjbGllbnRgIGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgd2hlbiB0aGF0IGhhcHBlbnMuIEZvciBpbnN0YW5jZSwgaXQgY2FuIHJlbW92ZSB0aGUgc29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLCBvciByZW1vdmUgdGhlIGNsaWVudCBmcm9tIHRoZSBsaXN0IHRoYXQga2VlcHMgdHJhY2sgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge01vZHVsZUNsaWVudH0gY2xpZW50IFRoZSBkaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBkZWxldGUgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXSAvLyBUT0RPP1xuICB9XG5cbiAgLy8gLS0gcmVjZWl2ZSBzb21ldGhpbmcgZnJvbSBhIGNsaWVudFxuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMubmFtZX06JHtjaGFubmVsfWA7XG4gICAgY29tbS5yZWNlaXZlKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8vIC0tIHNlbmQgc29tZXRoaW5nIHRvIGEgY2xpZW50IHR5cGVcbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMubmFtZX06JHtjaGFubmVsfWA7XG4gICAgY29tbS5zZW5kKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLy8gLS0gc2VuZCBzb21ldGhpbmcgdG8gYWxsIGNsaWVudHMgb2YgdGhlIHNhbWUgdHlwZSBhcyBgY2xpZW50YFxuICBzZW5kUGVlcnMoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gO1xuICAgIGNvbW0uc2VuZFBlZXJzKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLy8gLS0gc2VuZCBzb21ldGhpbmcgdG8gYWxsIGNsaWVudHMgb2YgYSBnaXZlbiB0eXBlXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gO1xuICAgIGNvbW0uYnJvYWRjYXN0KGNsaWVudFR5cGUsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxufVxuXG5cblxuXG4iXX0=
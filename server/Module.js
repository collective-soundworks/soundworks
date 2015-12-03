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
 * [server] Base class used to create any *Soundworks* module on the server side.
 *
 * While the sequence of user interactions and exchanges between client and server is determined on the client side, the server side modules are ready to receive requests from the corresponding client side modules as soon as a client is connected to the server.
 *
 * Each module should have a {@link Module#connect} and a {@link Module#disconnect} methods.
 * Any module mapped to the type of client `'clientType'` (thanks to the {@link server#map} method) calls its {@link Module#connect} method when such a client connects to the server, and its {@link Module#disconnect} method when such a client disconnects from the server.
 *
 * (See also {@link src/client/Module.js~Module} on the client side.)
 *
 * **Note:** a more complete example of how to write a module is in the [Example](manual/example.html) section.
 *
 * @example
 * class MyModule extends Module {
 *   constructor(name) {
 *     super(name);
 *
 *     // ...
 *   }
 *
 *   connect(client) {
 *     super.connect(client);
 *
 *     // ...
 *   }
 *
 *   disconnect(client) {
 *     super.disconnect(client);
 *
 *     // ...
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
   *
   * This method should handle the logic of the module on the server side.
   * For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {Client} client Connected client.
   */

  _createClass(Module, [{
    key: 'connect',
    value: function connect(client) {
      // Setup an object
      client.modules[this.name] = {};
    }

    /**
     * Called when the client `client` disconnects from the server.
     *
     * This method should handle the logic when that happens.
     * For instance, it can remove the socket message listeners, or remove the client from the list that keeps track of the connected clients.
     * @param {Client} client Disconnected client.
     */
  }, {
    key: 'disconnect',
    value: function disconnect(client) {}
    // delete client.modules[this.name] // TODO?

    /**
     * Listen a WebSocket message.
     * @param {Client} client - The client that must listen to the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(client, channel, callback) {
      var namespacedChannel = this.name + ':' + channel;
      _comm2['default'].receive(client, namespacedChannel, callback);
    }

    /**
     * Sends a WebSocket message to the client.
     * @param {Client} client - The client to send the message to.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'send',
    value: function send(client, channel) {
      var namespacedChannel = this.name + ':' + channel;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      _comm2['default'].send.apply(_comm2['default'], [client, namespacedChannel].concat(args));
    }

    /**
     * Sends a WebSocket message to all the clients belonging to the same `clientType` as `client`. (`client` does not receive a message)
     * @param {Client} client - The client which peers must receive the message
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'sendPeers',
    value: function sendPeers(client, channel) {
      var namespacedChannel = this.name + ':' + channel;

      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      _comm2['default'].sendPeers.apply(_comm2['default'], [client, namespacedChannel].concat(args));
    }

    /**
     * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
     * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.name}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUNpQixRQUFROzs7O3NCQUNJLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1DaEIsTUFBTTtZQUFOLE1BQU07Ozs7Ozs7O0FBTWQsV0FOUSxNQUFNLENBTWIsSUFBSSxFQUFFOzBCQU5DLE1BQU07O0FBT3ZCLCtCQVBpQixNQUFNLDZDQU9mOzs7OztBQUtSLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0dBQ2xCOzs7Ozs7Ozs7O2VBYmtCLE1BQU07O1dBc0JsQixpQkFBQyxNQUFNLEVBQUU7O0FBRWQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ2hDOzs7Ozs7Ozs7OztXQVNTLG9CQUFDLE1BQU0sRUFBRSxFQUVsQjs7Ozs7Ozs7O0FBQUE7OztXQVFNLGlCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQztBQUNwRCx3QkFBSyxPQUFPLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ25EOzs7Ozs7Ozs7O1dBUUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFXO0FBQzdCLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQzs7d0NBRDdCLElBQUk7QUFBSixZQUFJOzs7QUFFM0Isd0JBQUssSUFBSSxNQUFBLHFCQUFDLE1BQU0sRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUMvQzs7Ozs7Ozs7OztXQVFRLG1CQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7QUFDbEMsVUFBTSxpQkFBaUIsR0FBTSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzt5Q0FEeEIsSUFBSTtBQUFKLFlBQUk7OztBQUVoQyx3QkFBSyxTQUFTLE1BQUEscUJBQUMsTUFBTSxFQUFFLGlCQUFpQixTQUFLLElBQUksRUFBQyxDQUFDO0tBQ3BEOzs7Ozs7Ozs7O1dBUVEsbUJBQUMsVUFBVSxFQUFFLE9BQU8sRUFBVztBQUN0QyxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxJQUFJLFNBQUksT0FBTyxBQUFFLENBQUM7O3lDQURwQixJQUFJO0FBQUosWUFBSTs7O0FBRXBDLHdCQUFLLFNBQVMsTUFBQSxxQkFBQyxVQUFVLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDeEQ7OztTQWhGa0IsTUFBTTs7O3FCQUFOLE1BQU0iLCJmaWxlIjoic3JjL3NlcnZlci9Nb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdG9kbyAtIHJlbW92ZSBFdmVudEVtaXR0ZXI/IChJbXBsZW1lbnQgb3VyIG93biBsaXN0ZW5lcnMpXG5pbXBvcnQgY29tbSBmcm9tICcuL2NvbW0nO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqXG4gKiBbc2VydmVyXSBCYXNlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGFueSAqU291bmR3b3JrcyogbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAqXG4gKiBXaGlsZSB0aGUgc2VxdWVuY2Ugb2YgdXNlciBpbnRlcmFjdGlvbnMgYW5kIGV4Y2hhbmdlcyBiZXR3ZWVuIGNsaWVudCBhbmQgc2VydmVyIGlzIGRldGVybWluZWQgb24gdGhlIGNsaWVudCBzaWRlLCB0aGUgc2VydmVyIHNpZGUgbW9kdWxlcyBhcmUgcmVhZHkgdG8gcmVjZWl2ZSByZXF1ZXN0cyBmcm9tIHRoZSBjb3JyZXNwb25kaW5nIGNsaWVudCBzaWRlIG1vZHVsZXMgYXMgc29vbiBhcyBhIGNsaWVudCBpcyBjb25uZWN0ZWQgdG8gdGhlIHNlcnZlci5cbiAqXG4gKiBFYWNoIG1vZHVsZSBzaG91bGQgaGF2ZSBhIHtAbGluayBNb2R1bGUjY29ubmVjdH0gYW5kIGEge0BsaW5rIE1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2RzLlxuICogQW55IG1vZHVsZSBtYXBwZWQgdG8gdGhlIHR5cGUgb2YgY2xpZW50IGAnY2xpZW50VHlwZSdgICh0aGFua3MgdG8gdGhlIHtAbGluayBzZXJ2ZXIjbWFwfSBtZXRob2QpIGNhbGxzIGl0cyB7QGxpbmsgTW9kdWxlI2Nvbm5lY3R9IG1ldGhvZCB3aGVuIHN1Y2ggYSBjbGllbnQgY29ubmVjdHMgdG8gdGhlIHNlcnZlciwgYW5kIGl0cyB7QGxpbmsgTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZCB3aGVuIHN1Y2ggYSBjbGllbnQgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICpcbiAqIChTZWUgYWxzbyB7QGxpbmsgc3JjL2NsaWVudC9Nb2R1bGUuanN+TW9kdWxlfSBvbiB0aGUgY2xpZW50IHNpZGUuKVxuICpcbiAqICoqTm90ZToqKiBhIG1vcmUgY29tcGxldGUgZXhhbXBsZSBvZiBob3cgdG8gd3JpdGUgYSBtb2R1bGUgaXMgaW4gdGhlIFtFeGFtcGxlXShtYW51YWwvZXhhbXBsZS5odG1sKSBzZWN0aW9uLlxuICpcbiAqIEBleGFtcGxlXG4gKiBjbGFzcyBNeU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gKiAgIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAqICAgICBzdXBlcihuYW1lKTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGNvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICpcbiAqICAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAqICAgICBzdXBlci5kaXNjb25uZWN0KGNsaWVudCk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKiB9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZHVsZSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgY2xhc3MuXG4gICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zLlxuICAgICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm5hbWU9J3VubmFtZWQnXSBUaGUgbmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgKi9cbiAgY29uc3RydWN0b3IobmFtZSkge1xuICAgIHN1cGVyKCk7XG4gICAgLyoqXG4gICAgICogVGhlIG5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBjbGllbnRgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIG9mIHRoZSBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiB0YWtlIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGJ5IHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzIGFuZCBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcywgb3IgaXQgY2FuIGFkZCB0aGUgY2xpZW50IHRvIGEgbGlzdCB0byBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gU2V0dXAgYW4gb2JqZWN0XG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXSA9IHt9O1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBjbGllbnQgYGNsaWVudGAgZGlzY29ubmVjdHMgZnJvbSB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyB3aGVuIHRoYXQgaGFwcGVucy5cbiAgICogRm9yIGluc3RhbmNlLCBpdCBjYW4gcmVtb3ZlIHRoZSBzb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMsIG9yIHJlbW92ZSB0aGUgY2xpZW50IGZyb20gdGhlIGxpc3QgdGhhdCBrZWVwcyB0cmFjayBvZiB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgRGlzY29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gZGVsZXRlIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0gLy8gVE9ETz9cbiAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gYSBXZWJTb2NrZXQgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdGhhdCBtdXN0IGxpc3RlbiB0byB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMubmFtZX06JHtjaGFubmVsfWA7XG4gICAgY29tbS5yZWNlaXZlKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIHRoZSBjbGllbnQuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8uXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZChjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMubmFtZX06JHtjaGFubmVsfWA7XG4gICAgY29tbS5zZW5kKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gYWxsIHRoZSBjbGllbnRzIGJlbG9uZ2luZyB0byB0aGUgc2FtZSBgY2xpZW50VHlwZWAgYXMgYGNsaWVudGAuIChgY2xpZW50YCBkb2VzIG5vdCByZWNlaXZlIGEgbWVzc2FnZSlcbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgd2hpY2ggcGVlcnMgbXVzdCByZWNlaXZlIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgc2VuZFBlZXJzKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YDtcbiAgICBjb21tLnNlbmRQZWVycyhjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgdG8gYWxsIGNsaWVudCBvZiBnaXZlbiBgY2xpZW50VHlwZWAgb3IgYGNsaWVudFR5cGVgcy4gSWYgbm90IHNwZWNpZmllZCwgdGhlIG1lc3NhZ2UgaXMgc2VudCB0byBhbGwgY2xpZW50c1xuICAgKiBAcGFyYW0ge1N0cmluZ3xBcnJheX0gY2xpZW50VHlwZSAtIFRoZSBgY2xpZW50VHlwZWAocykgdGhhdCBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMubmFtZX06JHtjaGFubmVsfWA7XG4gICAgY29tbS5icm9hZGNhc3QoY2xpZW50VHlwZSwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG59XG5cbiJdfQ==
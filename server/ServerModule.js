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
 * Each module should have a {@link ServerModule#connect} and a {@link ServerModule#disconnect} methods.
 * Any module mapped to the type of client `'clientType'` (thanks to the {@link server#map} method) calls its {@link ServerModule#connect} method when such a client connects to the server, and its {@link ServerModule#disconnect} method when such a client disconnects from the server.
 *
 * (See also {@link src/client/ClientModule.js~ClientModule} on the client side.)
 *
 * **Note:** a more complete example of how to write a module is in the [Example](manual/example.html) section.
 *
 * @example
 * class MyModule extends ServerModule {
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

var ServerModule = (function (_EventEmitter) {
  _inherits(ServerModule, _EventEmitter);

  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] The options.
    * @param {string} [options.name='unnamed'] The name of the module.
   */

  function ServerModule(name) {
    _classCallCheck(this, ServerModule);

    _get(Object.getPrototypeOf(ServerModule.prototype), 'constructor', this).call(this);
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

  _createClass(ServerModule, [{
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
     * Get access to the global configuration (called from `server`)
     * @private
     */

  }, {
    key: 'configure',
    value: function configure(appConfig, envConfig) {
      this.appConfig = appConfig;
      this.envConfig = envConfig;
    }

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

  return ServerModule;
})(_events.EventEmitter);

exports['default'] = ServerModule;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvQ2xpZW50Q2hlY2tpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztvQkFDaUIsUUFBUTs7OztzQkFDSSxRQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFtQ2hCLFlBQVk7WUFBWixZQUFZOzs7Ozs7OztBQU1wQixXQU5RLFlBQVksQ0FNbkIsSUFBSSxFQUFFOzBCQU5DLFlBQVk7O0FBTzdCLCtCQVBpQixZQUFZLDZDQU9yQjs7Ozs7QUFLUixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztHQUNsQjs7Ozs7Ozs7OztlQWJrQixZQUFZOztXQXNCeEIsaUJBQUMsTUFBTSxFQUFFOztBQUVkLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUNoQzs7Ozs7Ozs7Ozs7V0FTUyxvQkFBQyxNQUFNLEVBQUUsRUFFbEI7Ozs7Ozs7QUFBQTs7O1dBTVEsbUJBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRTtBQUM5QixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztLQUM1Qjs7Ozs7Ozs7OztXQVFNLGlCQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO0FBQ2pDLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQztBQUNwRCx3QkFBSyxPQUFPLENBQUMsTUFBTSxFQUFFLGlCQUFpQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ25EOzs7Ozs7Ozs7O1dBUUcsY0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFXO0FBQzdCLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQzs7d0NBRDdCLElBQUk7QUFBSixZQUFJOzs7QUFFM0Isd0JBQUssSUFBSSxNQUFBLHFCQUFDLE1BQU0sRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUMvQzs7Ozs7Ozs7OztXQVFRLG1CQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7QUFDbEMsVUFBTSxpQkFBaUIsR0FBTSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzt5Q0FEeEIsSUFBSTtBQUFKLFlBQUk7OztBQUVoQyx3QkFBSyxTQUFTLE1BQUEscUJBQUMsTUFBTSxFQUFFLGlCQUFpQixTQUFLLElBQUksRUFBQyxDQUFDO0tBQ3BEOzs7Ozs7Ozs7O1dBUVEsbUJBQUMsVUFBVSxFQUFFLE9BQU8sRUFBVztBQUN0QyxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxJQUFJLFNBQUksT0FBTyxBQUFFLENBQUM7O3lDQURwQixJQUFJO0FBQUosWUFBSTs7O0FBRXBDLHdCQUFLLFNBQVMsTUFBQSxxQkFBQyxVQUFVLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDeEQ7OztTQXpGa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoic3JjL2NsaWVudC9DbGllbnRDaGVja2luLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRvZG8gLSByZW1vdmUgRXZlbnRFbWl0dGVyPyAoSW1wbGVtZW50IG91ciBvd24gbGlzdGVuZXJzKVxuaW1wb3J0IGNvbW0gZnJvbSAnLi9jb21tJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5cbi8qKlxuICogW3NlcnZlcl0gQmFzZSBjbGFzcyB1c2VkIHRvIGNyZWF0ZSBhbnkgKlNvdW5kd29ya3MqIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gKlxuICogV2hpbGUgdGhlIHNlcXVlbmNlIG9mIHVzZXIgaW50ZXJhY3Rpb25zIGFuZCBleGNoYW5nZXMgYmV0d2VlbiBjbGllbnQgYW5kIHNlcnZlciBpcyBkZXRlcm1pbmVkIG9uIHRoZSBjbGllbnQgc2lkZSwgdGhlIHNlcnZlciBzaWRlIG1vZHVsZXMgYXJlIHJlYWR5IHRvIHJlY2VpdmUgcmVxdWVzdHMgZnJvbSB0aGUgY29ycmVzcG9uZGluZyBjbGllbnQgc2lkZSBtb2R1bGVzIGFzIHNvb24gYXMgYSBjbGllbnQgaXMgY29ubmVjdGVkIHRvIHRoZSBzZXJ2ZXIuXG4gKlxuICogRWFjaCBtb2R1bGUgc2hvdWxkIGhhdmUgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Nvbm5lY3R9IGFuZCBhIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kcy5cbiAqIEFueSBtb2R1bGUgbWFwcGVkIHRvIHRoZSB0eXBlIG9mIGNsaWVudCBgJ2NsaWVudFR5cGUnYCAodGhhbmtzIHRvIHRoZSB7QGxpbmsgc2VydmVyI21hcH0gbWV0aG9kKSBjYWxscyBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIsIGFuZCBpdHMge0BsaW5rIFNlcnZlck1vZHVsZSNkaXNjb25uZWN0fSBtZXRob2Qgd2hlbiBzdWNoIGEgY2xpZW50IGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAqXG4gKiAoU2VlIGFsc28ge0BsaW5rIHNyYy9jbGllbnQvQ2xpZW50TW9kdWxlLmpzfkNsaWVudE1vZHVsZX0gb24gdGhlIGNsaWVudCBzaWRlLilcbiAqXG4gKiAqKk5vdGU6KiogYSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgb2YgaG93IHRvIHdyaXRlIGEgbW9kdWxlIGlzIGluIHRoZSBbRXhhbXBsZV0obWFudWFsL2V4YW1wbGUuaHRtbCkgc2VjdGlvbi5cbiAqXG4gKiBAZXhhbXBsZVxuICogY2xhc3MgTXlNb2R1bGUgZXh0ZW5kcyBTZXJ2ZXJNb2R1bGUge1xuICogICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gKiAgICAgc3VwZXIobmFtZSk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKlxuICogICBjb25uZWN0KGNsaWVudCkge1xuICogICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTZXJ2ZXJNb2R1bGUgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAvKipcbiAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGNsYXNzLlxuICAgICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucy5cbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0aW9ucy5uYW1lPSd1bm5hbWVkJ10gVGhlIG5hbWUgb2YgdGhlIG1vZHVsZS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG5hbWUpIHtcbiAgICBzdXBlcigpO1xuICAgIC8qKlxuICAgICAqIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCB3aGVuIHRoZSBgY2xpZW50YCBjb25uZWN0cyB0byB0aGUgc2VydmVyLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgaGFuZGxlIHRoZSBsb2dpYyBvZiB0aGUgbW9kdWxlIG9uIHRoZSBzZXJ2ZXIgc2lkZS5cbiAgICogRm9yIGluc3RhbmNlLCBpdCBjYW4gdGFrZSBjYXJlIG9mIHRoZSBjb21tdW5pY2F0aW9uIHdpdGggdGhlIGNsaWVudCBzaWRlIG1vZHVsZSBieSBzZXR0aW5nIHVwIFdlYlNvY2tldCBtZXNzYWdlIGxpc3RlbmVycyBhbmQgc2VuZGluZyBXZWJTb2NrZXQgbWVzc2FnZXMsIG9yIGl0IGNhbiBhZGQgdGhlIGNsaWVudCB0byBhIGxpc3QgdG8ga2VlcCB0cmFjayBvZiBhbGwgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IENvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIFNldHVwIGFuIG9iamVjdFxuICAgIGNsaWVudC5tb2R1bGVzW3RoaXMubmFtZV0gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGBjbGllbnRgIGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgd2hlbiB0aGF0IGhhcHBlbnMuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHJlbW92ZSB0aGUgc29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLCBvciByZW1vdmUgdGhlIGNsaWVudCBmcm9tIHRoZSBsaXN0IHRoYXQga2VlcHMgdHJhY2sgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIGRlbGV0ZSBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdIC8vIFRPRE8/XG4gIH1cblxuICAvKipcbiAgICogR2V0IGFjY2VzcyB0byB0aGUgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gKGNhbGxlZCBmcm9tIGBzZXJ2ZXJgKVxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29uZmlndXJlKGFwcENvbmZpZywgZW52Q29uZmlnKSB7XG4gICAgdGhpcy5hcHBDb25maWcgPSBhcHBDb25maWc7XG4gICAgdGhpcy5lbnZDb25maWcgPSBlbnZDb25maWc7XG4gIH1cblxuICAvKipcbiAgICogTGlzdGVuIGEgV2ViU29ja2V0IG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHRoYXQgbXVzdCBsaXN0ZW4gdG8gdGhlIG1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBjaGFubmVsIC0gVGhlIGNoYW5uZWwgb2YgdGhlIG1lc3NhZ2UgKGlzIGF1dG9tYXRpY2FsbHkgbmFtZXNwYWNlZCB3aXRoIHRoZSBtb2R1bGUncyBuYW1lOiBgJHt0aGlzLm5hbWV9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gYSBtZXNzYWdlIGlzIHJlY2VpdmVkLlxuICAgKi9cbiAgcmVjZWl2ZShjbGllbnQsIGNoYW5uZWwsIGNhbGxiYWNrKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gO1xuICAgIGNvbW0ucmVjZWl2ZShjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmQoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gO1xuICAgIGNvbW0uc2VuZChjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIFdlYlNvY2tldCBtZXNzYWdlIHRvIGFsbCB0aGUgY2xpZW50cyBiZWxvbmdpbmcgdG8gdGhlIHNhbWUgYGNsaWVudFR5cGVgIGFzIGBjbGllbnRgLiAoYGNsaWVudGAgZG9lcyBub3QgcmVjZWl2ZSBhIG1lc3NhZ2UpXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgLSBUaGUgY2xpZW50IHdoaWNoIHBlZXJzIG11c3QgcmVjZWl2ZSB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIHNlbmRQZWVycyhjbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMubmFtZX06JHtjaGFubmVsfWA7XG4gICAgY29tbS5zZW5kUGVlcnMoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBtZXNzYWdlIHRvIGFsbCBjbGllbnQgb2YgZ2l2ZW4gYGNsaWVudFR5cGVgIG9yIGBjbGllbnRUeXBlYHMuIElmIG5vdCBzcGVjaWZpZWQsIHRoZSBtZXNzYWdlIGlzIHNlbnQgdG8gYWxsIGNsaWVudHNcbiAgICogQHBhcmFtIHtTdHJpbmd8QXJyYXl9IGNsaWVudFR5cGUgLSBUaGUgYGNsaWVudFR5cGVgKHMpIHRoYXQgbXVzdCByZWNlaXZlIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gYXJncyAtIEFyZ3VtZW50cyBvZiB0aGUgbWVzc2FnZSAoYXMgbWFueSBhcyBuZWVkZWQsIG9mIGFueSB0eXBlKS5cbiAgICovXG4gIGJyb2FkY2FzdChjbGllbnRUeXBlLCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gO1xuICAgIGNvbW0uYnJvYWRjYXN0KGNsaWVudFR5cGUsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxufVxuIl19
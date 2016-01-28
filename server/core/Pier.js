'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _sockets = require('./sockets');

var _sockets2 = _interopRequireDefault(_sockets);

var _events = require('events');

// @todo - remove EventEmitter ? (Implement our own listeners)

/**
 * Base class used to create any *Soundworks* piers on the server side.
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
 * class MyPier extends Pier {
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

var Pier = (function (_EventEmitter) {
  _inherits(Pier, _EventEmitter);

  /**
    * Creates an instance of the class.
    * @param {Object} [options={}] The options.
    * @param {string} [options.name='unnamed'] The name of the module.
   */

  function Pier(id) {
    _classCallCheck(this, Pier);

    _get(Object.getPrototypeOf(Pier.prototype), 'constructor', this).call(this);

    /**
     * The id of the pier.
     * @type {string}
     */
    this.id = id;
  }

  /**
   * Called when the `client` connects to the server.
   *
   * This method should handle the logic of the module on the server side.
   * For instance, it can take care of the communication with the client side module by setting up WebSocket message listeners and sending WebSocket messages, or it can add the client to a list to keep track of all the connected clients.
   * @param {Client} client Connected client.
   */

  _createClass(Pier, [{
    key: 'connect',
    value: function connect(client) {
      // Setup an object
      client.modules[this.id] = {};
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
    // delete client.modules[this.id] // maybe needed by other modules

    /**
     * Listen a WebSocket message.
     * @param {Client} client - The client that must listen to the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} callback - The callback to execute when a message is received.
     */

  }, {
    key: 'receive',
    value: function receive(client, channel, callback) {
      var namespacedChannel = this.id + ':' + channel;
      _sockets2['default'].receive(client, namespacedChannel, callback);
    }

    /**
     * Sends a WebSocket message to the client.
     * @param {Client} client - The client to send the message to.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'send',
    value: function send(client, channel) {
      var namespacedChannel = this.id + ':' + channel;

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      _sockets2['default'].send.apply(_sockets2['default'], [client, namespacedChannel].concat(args));
    }

    /**
     * Sends a message to all client of given `clientType` or `clientType`s. If not specified, the message is sent to all clients
     * @param {String|Array} clientType - The `clientType`(s) that must receive the message.
     * @param {String} channel - The channel of the message (is automatically namespaced with the module's name: `${this.id}:channel`).
     * @param {...*} args - Arguments of the message (as many as needed, of any type).
     */
  }, {
    key: 'broadcast',
    value: function broadcast(clientType, excludeClient, channel) {
      var namespacedChannel = this.id + ':' + channel;

      for (var _len2 = arguments.length, args = Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        args[_key2 - 3] = arguments[_key2];
      }

      _sockets2['default'].broadcast.apply(_sockets2['default'], [clientType, excludeClient, namespacedChannel].concat(args));
    }
  }]);

  return Pier;
})(_events.EventEmitter);

exports['default'] = Pier;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvY29yZS9QaWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7dUJBQW9CLFdBQVc7Ozs7c0JBQ0YsUUFBUTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFxQ2hCLElBQUk7WUFBSixJQUFJOzs7Ozs7OztBQU1aLFdBTlEsSUFBSSxDQU1YLEVBQUUsRUFBRTswQkFORyxJQUFJOztBQU9yQiwrQkFQaUIsSUFBSSw2Q0FPYjs7Ozs7O0FBTVIsUUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7R0FDZDs7Ozs7Ozs7OztlQWRrQixJQUFJOztXQXVCaEIsaUJBQUMsTUFBTSxFQUFFOztBQUVkLFlBQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM5Qjs7Ozs7Ozs7Ozs7V0FTUyxvQkFBQyxNQUFNLEVBQUUsRUFFbEI7Ozs7Ozs7OztBQUFBOzs7V0FRTSxpQkFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtBQUNqQyxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7QUFDbEQsMkJBQVEsT0FBTyxDQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN0RDs7Ozs7Ozs7OztXQVFHLGNBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVztBQUM3QixVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7O3dDQUQzQixJQUFJO0FBQUosWUFBSTs7O0FBRTNCLDJCQUFRLElBQUksTUFBQSx3QkFBQyxNQUFNLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDbEQ7Ozs7Ozs7Ozs7V0FRUSxtQkFBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLE9BQU8sRUFBVztBQUNyRCxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxFQUFFLFNBQUksT0FBTyxBQUFFLENBQUM7O3lDQURILElBQUk7QUFBSixZQUFJOzs7QUFFbkQsMkJBQVEsU0FBUyxNQUFBLHdCQUFDLFVBQVUsRUFBRSxhQUFhLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDMUU7OztTQXRFa0IsSUFBSTs7O3FCQUFKLElBQUkiLCJmaWxlIjoic3JjL3NlcnZlci9jb3JlL1BpZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgc29ja2V0cyBmcm9tICcuL3NvY2tldHMnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLy8gQHRvZG8gLSByZW1vdmUgRXZlbnRFbWl0dGVyID8gKEltcGxlbWVudCBvdXIgb3duIGxpc3RlbmVycylcblxuLyoqXG4gKiBCYXNlIGNsYXNzIHVzZWQgdG8gY3JlYXRlIGFueSAqU291bmR3b3JrcyogcGllcnMgb24gdGhlIHNlcnZlciBzaWRlLlxuICpcbiAqIFdoaWxlIHRoZSBzZXF1ZW5jZSBvZiB1c2VyIGludGVyYWN0aW9ucyBhbmQgZXhjaGFuZ2VzIGJldHdlZW4gY2xpZW50IGFuZCBzZXJ2ZXIgaXMgZGV0ZXJtaW5lZCBvbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIGFyZSByZWFkeSB0byByZWNlaXZlIHJlcXVlc3RzIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgY2xpZW50IHNpZGUgbW9kdWxlcyBhcyBzb29uIGFzIGEgY2xpZW50IGlzIGNvbm5lY3RlZCB0byB0aGUgc2VydmVyLlxuICpcbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBoYXZlIGEge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBhbmQgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZHMuXG4gKiBBbnkgbW9kdWxlIG1hcHBlZCB0byB0aGUgdHlwZSBvZiBjbGllbnQgYCdjbGllbnRUeXBlJ2AgKHRoYW5rcyB0byB0aGUge0BsaW5rIHNlcnZlciNtYXB9IG1ldGhvZCkgY2FsbHMgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCBhbmQgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudE1vZHVsZS5qc35DbGllbnRNb2R1bGV9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogKipOb3RlOioqIGEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIG9mIGhvdyB0byB3cml0ZSBhIG1vZHVsZSBpcyBpbiB0aGUgW0V4YW1wbGVdKG1hbnVhbC9leGFtcGxlLmh0bWwpIHNlY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIE15UGllciBleHRlbmRzIFBpZXIge1xuICogICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gKiAgICAgc3VwZXIobmFtZSk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKlxuICogICBjb25uZWN0KGNsaWVudCkge1xuICogICAgIHN1cGVyLmNvbm5lY3QoY2xpZW50KTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqXG4gKiAgIGRpc2Nvbm5lY3QoY2xpZW50KSB7XG4gKiAgICAgc3VwZXIuZGlzY29ubmVjdChjbGllbnQpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICogfVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaWVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ndW5uYW1lZCddIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihpZCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgaWQgb2YgdGhlIHBpZXIuXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICB0aGlzLmlkID0gaWQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGBjbGllbnRgIGNvbm5lY3RzIHRvIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIG9mIHRoZSBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiB0YWtlIGNhcmUgb2YgdGhlIGNvbW11bmljYXRpb24gd2l0aCB0aGUgY2xpZW50IHNpZGUgbW9kdWxlIGJ5IHNldHRpbmcgdXAgV2ViU29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzIGFuZCBzZW5kaW5nIFdlYlNvY2tldCBtZXNzYWdlcywgb3IgaXQgY2FuIGFkZCB0aGUgY2xpZW50IHRvIGEgbGlzdCB0byBrZWVwIHRyYWNrIG9mIGFsbCB0aGUgY29ubmVjdGVkIGNsaWVudHMuXG4gICAqIEBwYXJhbSB7Q2xpZW50fSBjbGllbnQgQ29ubmVjdGVkIGNsaWVudC5cbiAgICovXG4gIGNvbm5lY3QoY2xpZW50KSB7XG4gICAgLy8gU2V0dXAgYW4gb2JqZWN0XG4gICAgY2xpZW50Lm1vZHVsZXNbdGhpcy5pZF0gPSB7fTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgY2xpZW50IGBjbGllbnRgIGRpc2Nvbm5lY3RzIGZyb20gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgd2hlbiB0aGF0IGhhcHBlbnMuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHJlbW92ZSB0aGUgc29ja2V0IG1lc3NhZ2UgbGlzdGVuZXJzLCBvciByZW1vdmUgdGhlIGNsaWVudCBmcm9tIHRoZSBsaXN0IHRoYXQga2VlcHMgdHJhY2sgb2YgdGhlIGNvbm5lY3RlZCBjbGllbnRzLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IERpc2Nvbm5lY3RlZCBjbGllbnQuXG4gICAqL1xuICBkaXNjb25uZWN0KGNsaWVudCkge1xuICAgIC8vIGRlbGV0ZSBjbGllbnQubW9kdWxlc1t0aGlzLmlkXSAvLyBtYXliZSBuZWVkZWQgYnkgb3RoZXIgbW9kdWxlc1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiBhIG1lc3NhZ2UgaXMgcmVjZWl2ZWQuXG4gICAqL1xuICByZWNlaXZlKGNsaWVudCwgY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMucmVjZWl2ZShjbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byB0aGUgY2xpZW50LlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5pZH06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5pZH06JHtjaGFubmVsfWA7XG4gICAgc29ja2V0cy5zZW5kKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYCBvciBgY2xpZW50VHlwZWBzLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSBpcyBzZW50IHRvIGFsbCBjbGllbnRzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IG11c3QgcmVjZWl2ZSB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMuaWR9OmNoYW5uZWxgKS5cbiAgICogQHBhcmFtIHsuLi4qfSBhcmdzIC0gQXJndW1lbnRzIG9mIHRoZSBtZXNzYWdlIChhcyBtYW55IGFzIG5lZWRlZCwgb2YgYW55IHR5cGUpLlxuICAgKi9cbiAgYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIGNoYW5uZWwsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBuYW1lc3BhY2VkQ2hhbm5lbCA9IGAke3RoaXMuaWR9OiR7Y2hhbm5lbH1gO1xuICAgIHNvY2tldHMuYnJvYWRjYXN0KGNsaWVudFR5cGUsIGV4Y2x1ZGVDbGllbnQsIG5hbWVzcGFjZWRDaGFubmVsLCAuLi5hcmdzKTtcbiAgfVxufVxuIl19
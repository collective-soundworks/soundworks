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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9zZXJ2ZXIvU2VydmVyTW9kdWxlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQUNpQixRQUFROzs7O3NCQUNJLFFBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQW1DaEIsWUFBWTtZQUFaLFlBQVk7Ozs7Ozs7O0FBTXBCLFdBTlEsWUFBWSxDQU1uQixJQUFJLEVBQUU7MEJBTkMsWUFBWTs7QUFPN0IsK0JBUGlCLFlBQVksNkNBT3JCOzs7OztBQUtSLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0dBQ2xCOzs7Ozs7Ozs7O2VBYmtCLFlBQVk7O1dBc0J4QixpQkFBQyxNQUFNLEVBQUU7O0FBRWQsWUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ2hDOzs7Ozs7Ozs7OztXQVNTLG9CQUFDLE1BQU0sRUFBRSxFQUVsQjs7Ozs7OztBQUFBOzs7V0FNUSxtQkFBQyxTQUFTLEVBQUUsU0FBUyxFQUFFO0FBQzlCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0tBQzVCOzs7Ozs7Ozs7O1dBUU0saUJBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7QUFDakMsVUFBTSxpQkFBaUIsR0FBTSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDO0FBQ3BELHdCQUFLLE9BQU8sQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbkQ7Ozs7Ozs7Ozs7V0FRRyxjQUFDLE1BQU0sRUFBRSxPQUFPLEVBQVc7QUFDN0IsVUFBTSxpQkFBaUIsR0FBTSxJQUFJLENBQUMsSUFBSSxTQUFJLE9BQU8sQUFBRSxDQUFDOzt3Q0FEN0IsSUFBSTtBQUFKLFlBQUk7OztBQUUzQix3QkFBSyxJQUFJLE1BQUEscUJBQUMsTUFBTSxFQUFFLGlCQUFpQixTQUFLLElBQUksRUFBQyxDQUFDO0tBQy9DOzs7Ozs7Ozs7O1dBUVEsbUJBQUMsTUFBTSxFQUFFLE9BQU8sRUFBVztBQUNsQyxVQUFNLGlCQUFpQixHQUFNLElBQUksQ0FBQyxJQUFJLFNBQUksT0FBTyxBQUFFLENBQUM7O3lDQUR4QixJQUFJO0FBQUosWUFBSTs7O0FBRWhDLHdCQUFLLFNBQVMsTUFBQSxxQkFBQyxNQUFNLEVBQUUsaUJBQWlCLFNBQUssSUFBSSxFQUFDLENBQUM7S0FDcEQ7Ozs7Ozs7Ozs7V0FRUSxtQkFBQyxVQUFVLEVBQUUsT0FBTyxFQUFXO0FBQ3RDLFVBQU0saUJBQWlCLEdBQU0sSUFBSSxDQUFDLElBQUksU0FBSSxPQUFPLEFBQUUsQ0FBQzs7eUNBRHBCLElBQUk7QUFBSixZQUFJOzs7QUFFcEMsd0JBQUssU0FBUyxNQUFBLHFCQUFDLFVBQVUsRUFBRSxpQkFBaUIsU0FBSyxJQUFJLEVBQUMsQ0FBQztLQUN4RDs7O1NBekZrQixZQUFZOzs7cUJBQVosWUFBWSIsImZpbGUiOiJzcmMvc2VydmVyL1NlcnZlck1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0b2RvIC0gcmVtb3ZlIEV2ZW50RW1pdHRlcj8gKEltcGxlbWVudCBvdXIgb3duIGxpc3RlbmVycylcbmltcG9ydCBjb21tIGZyb20gJy4vY29tbSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKipcbiAqIFtzZXJ2ZXJdIEJhc2UgY2xhc3MgdXNlZCB0byBjcmVhdGUgYW55ICpTb3VuZHdvcmtzKiBtb2R1bGUgb24gdGhlIHNlcnZlciBzaWRlLlxuICpcbiAqIFdoaWxlIHRoZSBzZXF1ZW5jZSBvZiB1c2VyIGludGVyYWN0aW9ucyBhbmQgZXhjaGFuZ2VzIGJldHdlZW4gY2xpZW50IGFuZCBzZXJ2ZXIgaXMgZGV0ZXJtaW5lZCBvbiB0aGUgY2xpZW50IHNpZGUsIHRoZSBzZXJ2ZXIgc2lkZSBtb2R1bGVzIGFyZSByZWFkeSB0byByZWNlaXZlIHJlcXVlc3RzIGZyb20gdGhlIGNvcnJlc3BvbmRpbmcgY2xpZW50IHNpZGUgbW9kdWxlcyBhcyBzb29uIGFzIGEgY2xpZW50IGlzIGNvbm5lY3RlZCB0byB0aGUgc2VydmVyLlxuICpcbiAqIEVhY2ggbW9kdWxlIHNob3VsZCBoYXZlIGEge0BsaW5rIFNlcnZlck1vZHVsZSNjb25uZWN0fSBhbmQgYSB7QGxpbmsgU2VydmVyTW9kdWxlI2Rpc2Nvbm5lY3R9IG1ldGhvZHMuXG4gKiBBbnkgbW9kdWxlIG1hcHBlZCB0byB0aGUgdHlwZSBvZiBjbGllbnQgYCdjbGllbnRUeXBlJ2AgKHRoYW5rcyB0byB0aGUge0BsaW5rIHNlcnZlciNtYXB9IG1ldGhvZCkgY2FsbHMgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBjb25uZWN0cyB0byB0aGUgc2VydmVyLCBhbmQgaXRzIHtAbGluayBTZXJ2ZXJNb2R1bGUjZGlzY29ubmVjdH0gbWV0aG9kIHdoZW4gc3VjaCBhIGNsaWVudCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gKlxuICogKFNlZSBhbHNvIHtAbGluayBzcmMvY2xpZW50L0NsaWVudE1vZHVsZS5qc35DbGllbnRNb2R1bGV9IG9uIHRoZSBjbGllbnQgc2lkZS4pXG4gKlxuICogKipOb3RlOioqIGEgbW9yZSBjb21wbGV0ZSBleGFtcGxlIG9mIGhvdyB0byB3cml0ZSBhIG1vZHVsZSBpcyBpbiB0aGUgW0V4YW1wbGVdKG1hbnVhbC9leGFtcGxlLmh0bWwpIHNlY3Rpb24uXG4gKlxuICogQGV4YW1wbGVcbiAqIGNsYXNzIE15TW9kdWxlIGV4dGVuZHMgU2VydmVyTW9kdWxlIHtcbiAqICAgY29uc3RydWN0b3IobmFtZSkge1xuICogICAgIHN1cGVyKG5hbWUpO1xuICpcbiAqICAgICAvLyAuLi5cbiAqICAgfVxuICpcbiAqICAgY29ubmVjdChjbGllbnQpIHtcbiAqICAgICBzdXBlci5jb25uZWN0KGNsaWVudCk7XG4gKlxuICogICAgIC8vIC4uLlxuICogICB9XG4gKlxuICogICBkaXNjb25uZWN0KGNsaWVudCkge1xuICogICAgIHN1cGVyLmRpc2Nvbm5lY3QoY2xpZW50KTtcbiAqXG4gKiAgICAgLy8gLi4uXG4gKiAgIH1cbiAqIH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyTW9kdWxlIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgLyoqXG4gICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIHRoZSBjbGFzcy5cbiAgICAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMuXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gW29wdGlvbnMubmFtZT0ndW5uYW1lZCddIFRoZSBuYW1lIG9mIHRoZSBtb2R1bGUuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgc3VwZXIoKTtcbiAgICAvKipcbiAgICAgKiBUaGUgbmFtZSBvZiB0aGUgbW9kdWxlLlxuICAgICAqIEB0eXBlIHtzdHJpbmd9XG4gICAgICovXG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsZWQgd2hlbiB0aGUgYGNsaWVudGAgY29ubmVjdHMgdG8gdGhlIHNlcnZlci5cbiAgICpcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGhhbmRsZSB0aGUgbG9naWMgb2YgdGhlIG1vZHVsZSBvbiB0aGUgc2VydmVyIHNpZGUuXG4gICAqIEZvciBpbnN0YW5jZSwgaXQgY2FuIHRha2UgY2FyZSBvZiB0aGUgY29tbXVuaWNhdGlvbiB3aXRoIHRoZSBjbGllbnQgc2lkZSBtb2R1bGUgYnkgc2V0dGluZyB1cCBXZWJTb2NrZXQgbWVzc2FnZSBsaXN0ZW5lcnMgYW5kIHNlbmRpbmcgV2ViU29ja2V0IG1lc3NhZ2VzLCBvciBpdCBjYW4gYWRkIHRoZSBjbGllbnQgdG8gYSBsaXN0IHRvIGtlZXAgdHJhY2sgb2YgYWxsIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBDb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBTZXR1cCBhbiBvYmplY3RcbiAgICBjbGllbnQubW9kdWxlc1t0aGlzLm5hbWVdID0ge307XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIHdoZW4gdGhlIGNsaWVudCBgY2xpZW50YCBkaXNjb25uZWN0cyBmcm9tIHRoZSBzZXJ2ZXIuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHNob3VsZCBoYW5kbGUgdGhlIGxvZ2ljIHdoZW4gdGhhdCBoYXBwZW5zLlxuICAgKiBGb3IgaW5zdGFuY2UsIGl0IGNhbiByZW1vdmUgdGhlIHNvY2tldCBtZXNzYWdlIGxpc3RlbmVycywgb3IgcmVtb3ZlIHRoZSBjbGllbnQgZnJvbSB0aGUgbGlzdCB0aGF0IGtlZXBzIHRyYWNrIG9mIHRoZSBjb25uZWN0ZWQgY2xpZW50cy5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCBEaXNjb25uZWN0ZWQgY2xpZW50LlxuICAgKi9cbiAgZGlzY29ubmVjdChjbGllbnQpIHtcbiAgICAvLyBkZWxldGUgY2xpZW50Lm1vZHVsZXNbdGhpcy5uYW1lXSAvLyBUT0RPP1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhY2Nlc3MgdG8gdGhlIGdsb2JhbCBjb25maWd1cmF0aW9uIChjYWxsZWQgZnJvbSBgc2VydmVyYClcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbmZpZ3VyZShhcHBDb25maWcsIGVudkNvbmZpZykge1xuICAgIHRoaXMuYXBwQ29uZmlnID0gYXBwQ29uZmlnO1xuICAgIHRoaXMuZW52Q29uZmlnID0gZW52Q29uZmlnO1xuICB9XG5cbiAgLyoqXG4gICAqIExpc3RlbiBhIFdlYlNvY2tldCBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB0aGF0IG11c3QgbGlzdGVuIHRvIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gY2hhbm5lbCAtIFRoZSBjaGFubmVsIG9mIHRoZSBtZXNzYWdlIChpcyBhdXRvbWF0aWNhbGx5IG5hbWVzcGFjZWQgd2l0aCB0aGUgbW9kdWxlJ3MgbmFtZTogYCR7dGhpcy5uYW1lfTpjaGFubmVsYCkuXG4gICAqIEBwYXJhbSB7Li4uKn0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIGEgbWVzc2FnZSBpcyByZWNlaXZlZC5cbiAgICovXG4gIHJlY2VpdmUoY2xpZW50LCBjaGFubmVsLCBjYWxsYmFjaykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YDtcbiAgICBjb21tLnJlY2VpdmUoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgV2ViU29ja2V0IG1lc3NhZ2UgdG8gdGhlIGNsaWVudC5cbiAgICogQHBhcmFtIHtDbGllbnR9IGNsaWVudCAtIFRoZSBjbGllbnQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0by5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kKGNsaWVudCwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YDtcbiAgICBjb21tLnNlbmQoY2xpZW50LCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBXZWJTb2NrZXQgbWVzc2FnZSB0byBhbGwgdGhlIGNsaWVudHMgYmVsb25naW5nIHRvIHRoZSBzYW1lIGBjbGllbnRUeXBlYCBhcyBgY2xpZW50YC4gKGBjbGllbnRgIGRvZXMgbm90IHJlY2VpdmUgYSBtZXNzYWdlKVxuICAgKiBAcGFyYW0ge0NsaWVudH0gY2xpZW50IC0gVGhlIGNsaWVudCB3aGljaCBwZWVycyBtdXN0IHJlY2VpdmUgdGhlIG1lc3NhZ2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBzZW5kUGVlcnMoY2xpZW50LCBjaGFubmVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgbmFtZXNwYWNlZENoYW5uZWwgPSBgJHt0aGlzLm5hbWV9OiR7Y2hhbm5lbH1gO1xuICAgIGNvbW0uc2VuZFBlZXJzKGNsaWVudCwgbmFtZXNwYWNlZENoYW5uZWwsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlbmRzIGEgbWVzc2FnZSB0byBhbGwgY2xpZW50IG9mIGdpdmVuIGBjbGllbnRUeXBlYCBvciBgY2xpZW50VHlwZWBzLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGUgbWVzc2FnZSBpcyBzZW50IHRvIGFsbCBjbGllbnRzXG4gICAqIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBjbGllbnRUeXBlIC0gVGhlIGBjbGllbnRUeXBlYChzKSB0aGF0IG11c3QgcmVjZWl2ZSB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGNoYW5uZWwgLSBUaGUgY2hhbm5lbCBvZiB0aGUgbWVzc2FnZSAoaXMgYXV0b21hdGljYWxseSBuYW1lc3BhY2VkIHdpdGggdGhlIG1vZHVsZSdzIG5hbWU6IGAke3RoaXMubmFtZX06Y2hhbm5lbGApLlxuICAgKiBAcGFyYW0gey4uLip9IGFyZ3MgLSBBcmd1bWVudHMgb2YgdGhlIG1lc3NhZ2UgKGFzIG1hbnkgYXMgbmVlZGVkLCBvZiBhbnkgdHlwZSkuXG4gICAqL1xuICBicm9hZGNhc3QoY2xpZW50VHlwZSwgY2hhbm5lbCwgLi4uYXJncykge1xuICAgIGNvbnN0IG5hbWVzcGFjZWRDaGFubmVsID0gYCR7dGhpcy5uYW1lfToke2NoYW5uZWx9YDtcbiAgICBjb21tLmJyb2FkY2FzdChjbGllbnRUeXBlLCBuYW1lc3BhY2VkQ2hhbm5lbCwgLi4uYXJncyk7XG4gIH1cbn1cbiJdfQ==